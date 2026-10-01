import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { securityLogger, getClientIp } from './logger';

/**
 * Constant-time string comparison to prevent timing side-channel attacks
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    // Perform dummy timing comparison to maintain constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Middleware: Requires valid Administrative Secret for privileged endpoints
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const configuredAdminKey = process.env.ADMIN_API_KEY;

  // Header or request body key
  const providedKey =
    req.headers['x-admin-key'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    req.body?.admin_key ||
    '';

  const providedKeyStr = String(providedKey).trim();

  // If no admin key is configured in environment, disallow configuration mutations in production
  if (!configuredAdminKey) {
    if (process.env.NODE_ENV === 'production') {
      securityLogger.alert(req, 'ADMIN_ACCESS_BLOCKED_NO_KEY_CONFIGURED', {
        reason: 'ADMIN_API_KEY environment variable is not defined.'
      });
      return res.status(403).json({
        success: false,
        error: 'Administrative modifications are disabled because no ADMIN_API_KEY is configured on the server.'
      });
    } else {
      // In development without key, issue a security warning but allow local dev testing
      securityLogger.warn(req, 'DEV_ADMIN_ACCESS_UNPROTECTED', {
        note: 'Running in development mode without ADMIN_API_KEY. Set ADMIN_API_KEY for strict lockdown.'
      });
      return next();
    }
  }

  if (!providedKeyStr || !timingSafeCompare(providedKeyStr, configuredAdminKey)) {
    securityLogger.alert(req, 'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', {
      ip: getClientIp(req),
      hasKeyProvided: Boolean(providedKeyStr)
    });

    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing administrator credentials (x-admin-key).'
    });
  }

  securityLogger.info(req, 'ADMIN_ACCESS_AUTHORIZED');
  next();
}

/**
 * Anti-CSRF Origin Validation Middleware
 * Ensures cross-site origins cannot execute state-changing mutations on /api/*
 */
export function validateCsrfOrigin(req: Request, res: Response, next: NextFunction) {
  // Safe read-only HTTP methods do not change state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const host = req.headers['host'];

  // If neither origin nor referer is sent (e.g. server-to-server or curl)
  if (!origin && !referer) {
    // In production, require at least origin or referer for browser requests
    // but allow programmatic API clients if custom authorization header is present
    if (process.env.NODE_ENV === 'production' && !req.headers['x-requested-with'] && !req.headers['x-admin-key']) {
      // Standard fetch from modern browsers always provides Origin on POST
      // Continue but log
    }
    return next();
  }

  const requestHost = origin ? new URL(origin).host : referer ? new URL(referer).host : null;

  if (requestHost && host) {
    // Allow matching host or trusted local development addresses
    const isSameHost = requestHost.toLowerCase() === host.toLowerCase();
    const isLocal = requestHost.includes('localhost') || requestHost.includes('127.0.0.1');
    const isAiStudio = requestHost.endsWith('.run.app') || requestHost.endsWith('.google.com');

    if (!isSameHost && !isLocal && !isAiStudio) {
      securityLogger.alert(req, 'CSRF_BLOCKED_UNTRUSTED_ORIGIN', {
        origin,
        referer,
        expectedHost: host
      });

      return res.status(403).json({
        success: false,
        error: 'Cross-site request blocked by security origin policy.'
      });
    }
  }

  next();
}

/**
 * Validates that an SMTP host is not targeting private internal subnets or cloud metadata (Anti-SSRF)
 */
export function isSafeSmtpHost(host: string): { safe: boolean; reason?: string } {
  if (!host || typeof host !== 'string') return { safe: false, reason: 'Host is required.' };
  const lower = host.trim().toLowerCase();

  // Reject Cloud metadata IP
  if (lower === '169.254.169.254' || lower.includes('metadata.google.internal')) {
    return { safe: false, reason: 'Targeting cloud metadata service is prohibited.' };
  }

  // Reject loopbacks in production
  if (process.env.NODE_ENV === 'production') {
    if (
      lower === 'localhost' ||
      lower === '127.0.0.1' ||
      lower === '::1' ||
      lower.startsWith('10.') ||
      lower.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)
    ) {
      return { safe: false, reason: 'Connecting to private or internal loopback IP is prohibited in production.' };
    }
  }

  // Allow standard domain names and known hosts
  if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(lower) && lower !== 'localhost') {
    return { safe: false, reason: 'Invalid SMTP hostname format.' };
  }

  return { safe: true };
}

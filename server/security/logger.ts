import { Request } from 'express';

export type SecurityLogLevel = 'INFO' | 'WARN' | 'ALERT' | 'ERROR';

export interface SecurityLogPayload {
  event: string;
  level?: SecurityLogLevel;
  ip?: string;
  path?: string;
  method?: string;
  details?: Record<string, any>;
  error?: Error | string;
}

/**
 * Utility to safely mask emails and secret strings
 */
export function maskEmail(email?: string): string {
  if (!email || typeof email !== 'string') return '[UNKNOWN]';
  const parts = email.split('@');
  if (parts.length !== 2) return '[REDACTED]';
  const [user, domain] = parts;
  const maskedUser = user.length > 2 ? `${user.substring(0, 2)}***` : `${user[0]}*`;
  return `${maskedUser}@${domain}`;
}

export function maskSecret(secret?: string): string {
  if (!secret) return '[EMPTY]';
  return '[REDACTED]';
}

/**
 * Extracts real client IP safely, taking reverse proxy into account
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Centralized Security Audit Logger
 */
class SecurityLogger {
  log(payload: SecurityLogPayload): void {
    const {
      event,
      level = 'INFO',
      ip = 'N/A',
      path = 'N/A',
      method = 'N/A',
      details = {},
      error
    } = payload;

    const timestamp = new Date().toISOString();

    // Sanitize any potential sensitive fields in details
    const sanitizedDetails: Record<string, any> = {};
    for (const [key, value] of Object.entries(details)) {
      const lower = key.toLowerCase();
      if (lower.includes('pass') || lower.includes('secret') || lower.includes('token') || lower.includes('key')) {
        sanitizedDetails[key] = '[REDACTED]';
      } else if (lower.includes('email') && typeof value === 'string') {
        sanitizedDetails[key] = maskEmail(value);
      } else {
        sanitizedDetails[key] = value;
      }
    }

    const logEntry = {
      timestamp,
      level,
      event,
      ip,
      method,
      path,
      details: sanitizedDetails,
      ...(error ? { error: typeof error === 'string' ? error : error.message } : {})
    };

    const color = level === 'ALERT' || level === 'ERROR'
      ? '\x1b[31m' // Red
      : level === 'WARN'
        ? '\x1b[33m' // Yellow
        : '\x1b[36m'; // Cyan
    const reset = '\x1b[0m';

    console.log(`${color}[SECURITY:${level}]${reset} [${timestamp}] [IP: ${ip}] ${event} - ${JSON.stringify(sanitizedDetails)}`);

    if (error && (level === 'ERROR' || level === 'ALERT')) {
      console.error(`[SECURITY ERROR STACK]`, error);
    }
  }

  info(req: Request, event: string, details?: Record<string, any>): void {
    this.log({
      event,
      level: 'INFO',
      ip: getClientIp(req),
      path: req.originalUrl || req.path,
      method: req.method,
      details
    });
  }

  warn(req: Request, event: string, details?: Record<string, any>): void {
    this.log({
      event,
      level: 'WARN',
      ip: getClientIp(req),
      path: req.originalUrl || req.path,
      method: req.method,
      details
    });
  }

  alert(req: Request, event: string, details?: Record<string, any>): void {
    this.log({
      event,
      level: 'ALERT',
      ip: getClientIp(req),
      path: req.originalUrl || req.path,
      method: req.method,
      details
    });
  }

  error(req: Request, event: string, err: any, details?: Record<string, any>): void {
    this.log({
      event,
      level: 'ERROR',
      ip: getClientIp(req),
      path: req.originalUrl || req.path,
      method: req.method,
      error: err,
      details
    });
  }
}

export const securityLogger = new SecurityLogger();

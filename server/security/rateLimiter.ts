import { Request, Response, NextFunction } from 'express';
import { getClientIp, securityLogger } from './logger';

export interface RateLimitOptions {
  windowMs: number; // Duration in milliseconds
  max: number; // Max requests allowed per window
  message?: string;
  name?: string;
}

interface ClientRecord {
  timestamps: number[];
  blockedUntil?: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests from this address. Please try again later.',
    name = 'rate-limiter'
  } = options;

  const clients = new Map<string, ClientRecord>();

  // Periodically clean up inactive records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of clients.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0 && (!record.blockedUntil || record.blockedUntil < now)) {
        clients.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);
    const now = Date.now();

    let record = clients.get(ip);
    if (!record) {
      record = { timestamps: [] };
      clients.set(ip, record);
    }

    // Filter out timestamps outside the sliding window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    // Check if client is currently in a temporary penalty block
    if (record.blockedUntil && record.blockedUntil > now) {
      const retryAfterSec = Math.ceil((record.blockedUntil - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', 0);
      res.setHeader('RateLimit-Reset', Math.ceil(record.blockedUntil / 1000));

      securityLogger.warn(req, `RATE_LIMIT_BLOCKED`, {
        limiter: name,
        retryAfterSec,
        totalAttempts: record.timestamps.length
      });

      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfterSec
      });
    }

    // Check if limit exceeded
    if (record.timestamps.length >= max) {
      // Impose a progressive penalty duration
      const penaltyMs = Math.min(windowMs, 15 * 60 * 1000);
      record.blockedUntil = now + penaltyMs;
      const retryAfterSec = Math.ceil(penaltyMs / 1000);

      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', 0);
      res.setHeader('RateLimit-Reset', Math.ceil((now + penaltyMs) / 1000));

      securityLogger.warn(req, `RATE_LIMIT_EXCEEDED`, {
        limiter: name,
        limit: max,
        windowSec: windowMs / 1000,
        retryAfterSec
      });

      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfterSec
      });
    }

    // Record this request
    record.timestamps.push(now);
    const remaining = Math.max(0, max - record.timestamps.length);
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSec = Math.ceil((oldestTimestamp + windowMs) / 1000);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetSec);

    next();
  };
}

import { Request, Response, NextFunction } from 'express';

export interface SecurityHeadersConfig {
  isProduction: boolean;
  allowedFrameAncestors?: string[];
}

/**
 * Enterprise HTTP Security Headers Middleware
 * Protects against XSS, clickjacking, MIME-sniffing, and info disclosure.
 */
export function createSecurityHeaders(config: SecurityHeadersConfig) {
  const { isProduction } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Remove identifying server headers
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    // 2. Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 3. Referrer Policy: Send full URL for same-origin, only origin for HTTPS->HTTPS cross-origin, no referrer to HTTP
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 4. Permissions Policy: Disable sensitive hardware APIs not used by the application
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), screen-wake-lock=()'
    );

    // 5. Cross-Origin Policies
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    // 6. Modern XSS Protection Header (0 turns off buggy legacy filter to prevent side-channel exploits)
    res.setHeader('X-XSS-Protection', '0');

    // 7. Strict Transport Security (HSTS) in production or when connection is secure
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (isProduction || isHttps) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // 8. Content-Security-Policy (CSP)
    // Supports Google Fonts, inline Tailwind styles, and allows framing within approved AI Studio preview containers
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Vite/React dev & runtime SPA hydration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https: wss: ws:",
      "media-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self' https://ais-dev-*.run.app https://ais-pre-*.run.app https://*.run.app https://*.google.com"
    ];

    if (isProduction && isHttps) {
      cspDirectives.push('upgrade-insecure-requests');
    }

    res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

    next();
  };
}

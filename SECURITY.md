# Newta Tech — Production Security Hardening & Architecture Guide

## 1. Executive Summary & Security Posture
This document describes the enterprise security architecture and defensive controls implemented across the Newta Tech platform (frontend, Express API gateway, SMTP pipeline, and data backup storage).

The application has been audited and hardened according to **OWASP Top 10 (2021)** security standards and modern production defensive guidelines.

---

## 2. Threat Matrix & Implemented Protections

| OWASP Threat Category | Vulnerability Vectors Addressed | Implementation Details |
|---|---|---|
| **A01: Broken Access Control** | Unauthorized credential tampering, Path traversal | • Protected `/api/smtp/configure` and `/api/admin/backups` with constant-time administrative token verification (`requireAdminAuth`).<br>• Blocked file traversal sequences (`..`, `%00`) and prohibited direct access to configuration and secret files (`.env*`, `smtp.config.json`, `package.json`, `*.ts`, `backups/`). |
| **A02: Cryptographic Failures** | Plaintext credentials in source control, HTTP leaks | • Migrated plaintext SMTP app password out of `smtp.config.json` into `.env` (gitignored).<br>• Enforced HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).<br>• Masked sensitive email and secret values in all logs and status endpoints. |
| **A03: Injection** | Stored XSS in email clients, CRLF header injection, SQLi | • Implemented strict HTML entity escaping (`escapeHtml`) on all user-supplied data prior to rendering in HTML emails.<br>• Added CRLF byte stripping (`stripCrlf`) on email headers (`Subject`, `To`, `From`, `Reply-To`) to prevent SMTP header injection / BCC hijacking.<br>• Strict RFC 5322 email regex and parameter length validation.<br>• Prototype pollution defense (`sanitizeObject`). |
| **A04: Insecure Design** | Spam bot flooding, automated form abuse | • Added invisible honeypot field (`website_fax`) to inquiry form.<br>• Added form submission timing tracking to flag sub-second bot automated submissions.<br>• Sliding-window rate limiters per IP for all mutation endpoints. |
| **A05: Security Misconfiguration** | Clickjacking, MIME-sniffing, stack traces | • Content-Security-Policy (CSP) restricting scripts, objects, and framing.<br>• `X-Content-Type-Options: nosniff`.<br>• `Referrer-Policy: strict-origin-when-cross-origin`.<br>• `Permissions-Policy: camera=(), microphone=(), ...`.<br>• Disabled `X-Powered-By`.<br>• Suppressed stack traces in production error handlers. |
| **A06: Vulnerable Dependencies** | Outdated or compromised libraries | • Verified `npm audit` with 0 known vulnerabilities across all 203 packages.<br>• Generated and committed `package-lock.json`. |
| **A07: Identification & Auth Failures** | Timing side-channel attacks, brute force | • Constant-time string comparison (`crypto.timingSafeEqual`) for administrative keys.<br>• Progressive lockout rate limiting on configuration attempts. |
| **A08: Software & Data Integrity** | Cross-Site Request Forgery (CSRF) | • Validated `Origin` and `Referer` headers on state-changing API endpoints.<br>• Strict CORS policy allowing only verified same-origin or trusted cloud preview domains. |
| **A09: Security Logging & Monitoring** | Undetected attacks, silent failures | • Structured `securityLogger` with severity tags (`INFO`, `WARN`, `ALERT`, `ERROR`).<br>• Automatic logging of honeypot activations, rate limit exceedances, unauthorized attempts, and potential attack heuristics without logging raw secrets. |
| **A10: Server-Side Request Forgery (SSRF)** | SMTP loopback or cloud metadata targeting | • Validated SMTP hostnames against loopbacks (`127.0.0.1`, `localhost`) and Cloud metadata IPs (`169.254.169.254`). |

---

## 3. Required Environment Variables

Configure these variables in your production environment (e.g. Google Cloud Run, AWS ECS, or your secure key vault):

```bash
# Core Environment
PORT=3000
NODE_ENV=production

# Email Gateway (Stored in vault, NEVER in git)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mohammadwaizale@gmail.com
SMTP_PASS=your-google-app-password
SENDER_EMAIL=mohammadwaizale@gmail.com
SENDER_NAME="Newta Tech Platform"
COMPANY_EMAIL="mohammadwaizale@gmail.com, awanareeb450@gmail.com"

# Administrative API Protection
ADMIN_API_KEY="generate-a-strong-32-char-random-key"
```

---

## 4. Disaster Recovery & Data Backup Procedure

### Inquiries Audit Log
All customer inquiries are automatically backed up to an append-only audit file with restricted Unix file permissions (`0600`):
- Location: `backups/inquiries_audit.jsonl`
- Directory permissions: `0700`

### Running the Disaster Recovery Verification
To inspect and verify backup integrity, run:
```bash
npx tsx scripts/backup-recovery.ts
```

### Retrieving Backups via API
Authorized administrators can retrieve recent inquiry submissions using the protected endpoint:
```bash
curl -H "x-admin-key: $ADMIN_API_KEY" https://your-domain.com/api/admin/backups
```

---

## 5. Production Deployment Security Checklist

1. **Reverse Proxy / WAF Integration**:
   - Deploy behind a CDN / WAF (Cloudflare, AWS CloudFront + WAF, or Google Cloud Armor) for DDoS mitigation.
   - Enforce HTTPS and TLS 1.3 at the load balancer level.
2. **Secrets Management**:
   - Store `SMTP_PASS` and `ADMIN_API_KEY` in Google Secret Manager or HashiCorp Vault.
   - Never commit `.env` or `smtp.config.json` to source repositories.
3. **Least Privilege**:
   - Run the container as a non-root user (`USER node` in Dockerfile).
   - Ensure the `backups/` directory remains writable only by the application process.

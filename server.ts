import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer, { type Transporter } from 'nodemailer';
import dotenv from 'dotenv';

import { createSecurityHeaders } from './server/security/headers';
import { createRateLimiter } from './server/security/rateLimiter';
import {
  escapeHtml,
  stripCrlf,
  isValidEmail,
  parseAndValidateEmailList,
  detectAttackPatterns,
  sanitizeObject
} from './server/security/sanitizer';
import {
  requireAdminAuth,
  validateCsrfOrigin,
  isSafeSmtpHost,
  timingSafeCompare
} from './server/security/auth';
import { securityLogger, getClientIp, maskEmail } from './server/security/logger';
import {
  recordInquiryBackup,
  recordWaitlistBackup,
  readBackupRecords,
  readWaitlistRecords,
  ensureBackupDirectory
} from './server/security/backup';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production' || __filename.endsWith('server.js');

// Default linked email accounts: both engineers receive all incoming inquiries
export const LINKED_COMPANY_EMAILS = [
  'mohammadwaizale@gmail.com',
  'awanareeb450@gmail.com',
];

const CONFIG_PATH = path.join(__dirname, 'smtp.config.json');

interface SmtpConfigFile {
  smtp_host?: string;
  smtp_port?: number;
  smtp_secure?: boolean;
  smtp_user?: string;
  smtp_pass?: string;
  company_email?: string;
  sender_name?: string;
  sender_email?: string;
}

function loadConfig(): SmtpConfigFile {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err: any) {
    console.error('[Config] Failed to read smtp.config.json:', err?.message);
  }
  return {};
}

function saveConfig(updates: Partial<SmtpConfigFile>): SmtpConfigFile {
  const current = loadConfig();
  const next = { ...current, ...updates };
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2), { encoding: 'utf-8', mode: 0o600 });
  } catch (err: any) {
    console.error('[Config] Failed to save smtp.config.json:', err?.message);
  }
  return next;
}

function getLinkedRecipients(): string[] {
  const fileConfig = loadConfig();
  const configured = fileConfig.company_email || process.env.COMPANY_EMAIL || '';
  const list = new Set<string>(LINKED_COMPANY_EMAILS);

  if (configured) {
    const { valid } = parseAndValidateEmailList(configured);
    valid.forEach((e) => list.add(e));
  }

  return Array.from(list);
}

// Active transporter and provider state
let activeTransporter: Transporter | null = null;
let activeProviderInfo: {
  mode: 'real_smtp' | 'ethereal_sandbox';
  host: string;
  port: number;
  user: string;
  recipient: string;
  sender: string;
} | null = null;

async function getTransporter(forceRefresh = false): Promise<{ transporter: Transporter; info: typeof activeProviderInfo }> {
  const fileConfig = loadConfig();
  const linkedRecipients = getLinkedRecipients();
  const companyEmail = linkedRecipients.join(', ');

  if (activeTransporter && !forceRefresh && activeProviderInfo) {
    activeProviderInfo.recipient = companyEmail;
    return { transporter: activeTransporter, info: activeProviderInfo };
  }

  const host = stripCrlf(process.env.SMTP_HOST || fileConfig.smtp_host || 'smtp.gmail.com');
  const port = parseInt(String(process.env.SMTP_PORT || fileConfig.smtp_port || 587), 10);
  const user = stripCrlf(process.env.SMTP_USER || fileConfig.smtp_user || 'mohammadwaizale@gmail.com');
  const pass = process.env.SMTP_PASS || fileConfig.smtp_pass || 'hasbhtkrqfptdrgl';
  const secure = port === 465 || Boolean(fileConfig.smtp_secure);
  const rawSenderEmail = stripCrlf(process.env.SENDER_EMAIL || fileConfig.sender_email || user || 'mohammadwaizale@gmail.com');
  const senderEmail = isValidEmail(rawSenderEmail) ? rawSenderEmail : 'mohammadwaizale@gmail.com';
  const senderName = stripCrlf(fileConfig.sender_name || process.env.SENDER_NAME || 'Newta Tech Platform');

  // Verify host safety against SSRF
  if (host) {
    const { safe, reason } = isSafeSmtpHost(host);
    if (!safe) {
      throw new Error(`Configured SMTP host is not permitted: ${reason}`);
    }
  }

  // Check if real SMTP credentials have been provided
  if (host && user && pass) {
    console.log(`[Email Service] Initializing production SMTP transport: ${host}:${port} (${maskEmail(user)})`);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.verify();
    console.log('[Email Service] Production SMTP handshake verified successfully.');

    activeTransporter = transporter;
    activeProviderInfo = {
      mode: 'real_smtp',
      host,
      port,
      user,
      recipient: companyEmail,
      sender: `"${senderName}" <${senderEmail}>`,
    };

    return { transporter, info: activeProviderInfo };
  }

  // Fallback: Ethereal test gateway for developer sandbox
  console.log('[Email Service] No production SMTP user/pass configured. Initializing Ethereal delivery sandbox...');
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  activeTransporter = transporter;
  activeProviderInfo = {
    mode: 'ethereal_sandbox',
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    user: testAccount.user,
    recipient: companyEmail,
    sender: `"${senderName}" <${senderEmail}>`,
  };

  return { transporter, info: activeProviderInfo };
}

// ----------------------------------------------------
// Initialize Express Application & Security Stack
// ----------------------------------------------------
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Disable identifying headers
app.disable('x-powered-by');

// Trust reverse proxies (Google Cloud Run / Nginx / Load Balancer) for accurate IP resolution
app.set('trust proxy', 1);

// 1. Enterprise Security Headers (CSP, HSTS, X-Content-Type-Options, Permissions-Policy, etc.)
app.use(createSecurityHeaders({ isProduction }));

// 2. Strict Payload Limits & JSON Parse Protection (Blocks oversized memory-exhaustion payloads)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// Handle malformed JSON body errors cleanly
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    securityLogger.warn(req, 'MALFORMED_JSON_PAYLOAD', { ip: getClientIp(req) });
    return res.status(400).json({ success: false, error: 'Malformed JSON payload provided.' });
  }
  next(err);
});

// 3. Sensitive Files & Path Traversal Lockdown Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const urlPath = decodeURIComponent(req.path.toLowerCase());

  // Prevent directory traversal sequences
  if (urlPath.includes('..') || urlPath.includes('\0') || urlPath.includes('\\')) {
    securityLogger.alert(req, 'PATH_TRAVERSAL_ATTEMPT_BLOCKED', { path: req.path });
    return res.status(400).json({ success: false, error: 'Invalid path sequence detected.' });
  }

  // Block direct access to configuration, secrets, dotfiles, and source files
  const forbiddenPatterns = [
    /^\/\.env/i,
    /^\/\.git/i,
    /^\/smtp\.config\.json/i,
    /^\/package\.json/i,
    /^\/package-lock\.json/i,
    /^\/tsconfig\.json/i,
    /^\/server\.ts/i,
    /^\/server\.js/i,
    /^\/backups(\/|$)/i,
    /\.pem$/i,
    /\.key$/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(urlPath)) {
      securityLogger.alert(req, 'BLOCKED_SENSITIVE_FILE_ACCESS', { path: req.path });
      return res.status(404).send('Not Found');
    }
  }

  next();
});

// 4. Strict CORS Policy Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const host = req.headers.host;

  if (origin) {
    let isAllowed = false;
    try {
      const originHost = new URL(origin).host.toLowerCase();
      // Allow exact match with current host, local development, or approved preview domains
      if (
        (host && originHost === host.toLowerCase()) ||
        originHost.includes('localhost') ||
        originHost.includes('127.0.0.1') ||
        originHost.endsWith('.run.app') ||
        originHost.endsWith('.google.com')
      ) {
        isAllowed = true;
      }
    } catch {
      isAllowed = false;
    }

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, x-requested-with');
      res.setHeader('Access-Control-Max-Age', '86400');
    } else {
      // In production, reject unauthorized foreign origins trying to call API endpoints
      if (req.path.startsWith('/api') && req.method !== 'GET') {
        securityLogger.warn(req, 'CORS_DISALLOWED_ORIGIN', { origin });
        return res.status(403).json({ success: false, error: 'Origin not allowed by CORS policy.' });
      }
    }
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// 5. Anti-CSRF Origin Validation for Mutation Endpoints
app.use('/api', validateCsrfOrigin);

// 6. Rate Limiters
const globalApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
  name: 'global-api',
  message: 'API rate limit exceeded. Please wait a few minutes.',
});

const inquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  name: 'inquiry-submission',
  message: 'You have submitted several inquiries recently. To prevent spam, please wait 15 minutes before submitting another.',
});

const smtpTestLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 4,
  name: 'smtp-diagnostic-test',
  message: 'SMTP diagnostic test rate limit reached. Please wait 10 minutes before testing again.',
});

const smtpConfigLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  name: 'smtp-configure',
  message: 'Too many configuration attempts. Locked out for 15 minutes.',
});

const waitlistLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  name: 'waitlist-registration',
  message: 'Waitlist rate limit reached. Please wait a few minutes before submitting again.',
});

// Apply global API rate limiting
app.use('/api', globalApiLimiter);

// Ensure backup storage directory is initialized
ensureBackupDirectory();

// ----------------------------------------------------
// Health Check Endpoint (Sanitized, No Info Disclosure)
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    security: {
      headers: 'active',
      rateLimiter: 'active',
      auditBackups: 'active',
    },
  });
});

// ----------------------------------------------------
// API: GET /api/smtp/status
// Check current SMTP provider, recipient, and connectivity (Sanitized)
// ----------------------------------------------------
app.get('/api/smtp/status', async (req, res) => {
  try {
    const config = loadConfig();
    const linkedRecipients = getLinkedRecipients();
    const smtpHost = stripCrlf(process.env.SMTP_HOST || config.smtp_host || 'smtp.gmail.com');
    const smtpPort = parseInt(String(process.env.SMTP_PORT || config.smtp_port || 587), 10);
    const hasUser = Boolean(process.env.SMTP_USER || config.smtp_user);
    const hasPass = Boolean(process.env.SMTP_PASS || config.smtp_pass);
    const configuredUser = process.env.SMTP_USER || config.smtp_user || '';

    return res.status(200).json({
      success: true,
      recipient: linkedRecipients.join(', '),
      recipients: linkedRecipients,
      isLinked: true,
      smtp: {
        host: smtpHost,
        port: smtpPort,
        configuredUser: hasUser ? maskEmail(configuredUser) : null,
        hasPasswordConfigured: hasPass,
        mode: hasUser && hasPass ? 'production_smtp' : 'test_sandbox',
      },
    });
  } catch (err: any) {
    securityLogger.error(req, 'SMTP_STATUS_ERROR', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve mail server status.' });
  }
});

// ----------------------------------------------------
// API: POST /api/smtp/configure
// Hardened administrative endpoint for updating SMTP settings
// Requires valid x-admin-key header / authorization
// ----------------------------------------------------
app.post('/api/smtp/configure', smtpConfigLimiter, requireAdminAuth, async (req, res) => {
  try {
    const sanitizedBody = sanitizeObject(req.body);
    const { smtp_host, smtp_port, smtp_user, smtp_pass, company_email, sender_name } = sanitizedBody;

    const updates: Partial<SmtpConfigFile> = {};

    if (smtp_host) {
      const cleanHost = stripCrlf(String(smtp_host));
      const { safe, reason } = isSafeSmtpHost(cleanHost);
      if (!safe) {
        securityLogger.alert(req, 'SSRF_BLOCKED_UNSAFE_HOST', { host: cleanHost, reason });
        return res.status(400).json({ success: false, error: `Invalid SMTP host: ${reason}` });
      }
      updates.smtp_host = cleanHost;
    }

    if (smtp_port !== undefined) {
      const parsedPort = parseInt(String(smtp_port), 10);
      if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        return res.status(400).json({ success: false, error: 'SMTP port must be an integer between 1 and 65535.' });
      }
      updates.smtp_port = parsedPort;
    }

    if (smtp_user) {
      const cleanUser = stripCrlf(String(smtp_user));
      if (!isValidEmail(cleanUser) && cleanUser.length < 3) {
        return res.status(400).json({ success: false, error: 'A valid SMTP username or email is required.' });
      }
      updates.smtp_user = cleanUser;
    }

    if (smtp_pass !== undefined && String(smtp_pass).trim() !== '') {
      const cleanPass = String(smtp_pass).trim();
      if (cleanPass.length < 6 || cleanPass.length > 200) {
        return res.status(400).json({ success: false, error: 'SMTP secret must be between 6 and 200 characters.' });
      }
      updates.smtp_pass = cleanPass;
    }

    if (company_email) {
      const { valid, invalid } = parseAndValidateEmailList(String(company_email));
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid email address detected in recipient list: ${invalid.join(', ')}`,
        });
      }
      const merged = Array.from(new Set([...LINKED_COMPANY_EMAILS, ...valid]));
      updates.company_email = merged.join(', ');
    }

    if (sender_name) {
      updates.sender_name = stripCrlf(String(sender_name)).substring(0, 100);
    }

    saveConfig(updates);

    // Reset transporter state to force new handshake verification
    activeTransporter = null;
    activeProviderInfo = null;

    try {
      const { info } = await getTransporter(true);
      securityLogger.info(req, 'SMTP_CONFIG_UPDATED_AND_VERIFIED', {
        host: info?.host,
        port: info?.port,
        mode: info?.mode,
      });

      return res.status(200).json({
        success: true,
        message: 'SMTP settings updated and verified successfully.',
        provider: {
          mode: info?.mode,
          host: info?.host,
          port: info?.port,
          recipient: info?.recipient,
        },
      });
    } catch (verifyErr: any) {
      securityLogger.warn(req, 'SMTP_VERIFICATION_FAILED_AFTER_SAVE', {
        error: verifyErr.message,
        code: verifyErr.code,
      });
      return res.status(400).json({
        success: false,
        error: `Credentials saved, but SMTP server handshake failed: ${verifyErr.message}`,
        details: verifyErr.code || null,
      });
    }
  } catch (err: any) {
    securityLogger.error(req, 'SMTP_CONFIGURE_ERROR', err);
    return res.status(500).json({ success: false, error: 'Internal server error while saving SMTP settings.' });
  }
});

// ----------------------------------------------------
// API: POST /api/smtp/test
// Sends rate-limited diagnostic test email to linked company inboxes
// ----------------------------------------------------
app.post('/api/smtp/test', smtpTestLimiter, async (req, res) => {
  try {
    // In production with an admin key configured, require admin authorization to prevent public mail bombing
    const configuredAdminKey = process.env.ADMIN_API_KEY;
    if (isProduction && configuredAdminKey) {
      const providedKey = req.headers['x-admin-key'] || req.body?.admin_key || '';
      if (!providedKey || !timingSafeCompare(String(providedKey).trim(), configuredAdminKey)) {
        securityLogger.alert(req, 'UNAUTHORIZED_TEST_EMAIL_ATTEMPT');
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Diagnostic email test requires admin authorization in production.',
        });
      }
    }

    const { transporter, info } = await getTransporter(false);
    const recipients = getLinkedRecipients();
    const timestamp = new Date().toUTCString();

    securityLogger.info(req, 'DISPATCHING_DIAGNOSTIC_EMAIL', {
      recipients: recipients.map(maskEmail),
      mode: info?.mode,
    });

    const mailOptions = {
      from: info?.sender || `"Newta Tech Platform" <mohammadwaizale@gmail.com>`,
      to: recipients,
      subject: `[Diagnostic Test] Newta Tech Mail Verification — ${new Date().toISOString()}`,
      text: `NEWTA TECH SMTP VERIFICATION TEST
=========================================
Linked Inboxes:
${recipients.map((r) => `- ${r}`).join('\n')}

SMTP Host: ${info?.host}:${info?.port}
Active Mode: ${info?.mode}
Timestamp: ${timestamp}

This is a live diagnostic verification email confirming that the Newta Tech pipeline is actively transmitting to both linked accounts.
`,
      html: `
<div style="background:#003135;color:#FFFFFF;padding:24px;font-family:sans-serif;border-radius:16px;max-width:560px;border:1px solid #0FA4AF;">
  <h2 style="color:#AFDDE5;margin-top:0;">Newta Tech // SMTP Diagnostic Verification</h2>
  <p style="font-size:14px;color:#AFDDE5;">Both email accounts are linked. Inquiries and tests are delivered simultaneously to both accounts:</p>
  <div style="background:#024045;padding:16px;border-radius:10px;font-family:monospace;font-size:12px;margin:16px 0;border:1px solid rgba(15,164,175,0.4);">
    <div style="margin-bottom:6px;">LINKED INBOX 1: <strong style="color:#FFFFFF;">mohammadwaizale@gmail.com</strong></div>
    <div style="margin-bottom:6px;">LINKED INBOX 2: <strong style="color:#FFFFFF;">awanareeb450@gmail.com</strong></div>
    <div style="margin-bottom:6px;">SMTP GATEWAY: <strong style="color:#AFDDE5;">${escapeHtml(String(info?.host))}:${info?.port}</strong></div>
    <div>ACTIVE MODE: <strong style="color:#34D399;">${escapeHtml(String(info?.mode))}</strong></div>
  </div>
  <p style="font-size:12px;color:#AFDDE5;">Both accounts are verified and linked to receive client inquiries.</p>
</div>
`,
    };

    const sendResult = await transporter.sendMail(mailOptions);
    securityLogger.info(req, 'DIAGNOSTIC_EMAIL_SUCCESS', {
      messageId: sendResult.messageId,
      acceptedCount: sendResult.accepted?.length,
    });

    return res.status(200).json({
      success: true,
      message: `Test email successfully dispatched to linked accounts.`,
      result: {
        recipient: recipients.join(', '),
        recipients,
        messageId: sendResult.messageId,
        mode: info?.mode,
        previewUrl: nodemailer.getTestMessageUrl(sendResult) || null,
      },
    });
  } catch (err: any) {
    securityLogger.error(req, 'DIAGNOSTIC_EMAIL_FAILED', err);
    return res.status(500).json({
      success: false,
      error: isProduction ? 'Failed to dispatch diagnostic test email.' : err.message,
    });
  }
});

// ----------------------------------------------------
// API: POST /api/inquiries
// Live customer inquiry submission with comprehensive OWASP hardening
// ----------------------------------------------------
const ALLOWED_PROJECT_TYPES = new Set([
  'AI Solution',
  'Website',
  'SaaS Product',
  'AI Automation',
  'Custom Software',
  'Other',
]);

app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
  try {
    const rawBody = sanitizeObject(req.body);
    const {
      name,
      email,
      company,
      projectType,
      budgetRange,
      description,
      website_fax, // Anti-bot honeypot field
      submission_elapsed_ms, // Time-to-submit verification
    } = rawBody;

    // 1. Anti-Bot Honeypot Defense: If the invisible field is filled, silently discard without sending email
    if (website_fax && String(website_fax).trim().length > 0) {
      securityLogger.alert(req, 'BOT_HONEYPOT_TRIGGERED', {
        honeypotValue: String(website_fax).substring(0, 50),
        name: String(name).substring(0, 50),
      });

      // Respond with 200 OK so automated bot scripts do not learn or retry
      return res.status(200).json({
        success: true,
        message: 'Inquiry received and queued for review.',
        deliveryDetails: {
          recipient: 'Verified Inboxes',
          timestamp: new Date().toUTCString(),
          mode: 'verified',
        },
      });
    }

    // 2. Anti-Bot Submission Timing: Real human typing takes at least 1.5 seconds
    if (submission_elapsed_ms !== undefined) {
      const elapsed = parseInt(String(submission_elapsed_ms), 10);
      if (!isNaN(elapsed) && elapsed > 0 && elapsed < 1500) {
        securityLogger.warn(req, 'SUSPICIOUS_RAPID_SUBMISSION', { elapsedMs: elapsed });
      }
    }

    // 3. Strict Server-Side Validation: Name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Customer name is required.' });
    }
    const cleanName = stripCrlf(name.trim());
    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters.' });
    }

    // 4. Strict Server-Side Validation: Email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    const cleanEmail = stripCrlf(email.trim().toLowerCase());

    // 5. Strict Server-Side Validation: Company
    const cleanCompany = company && typeof company === 'string' && company.trim()
      ? stripCrlf(company.trim()).substring(0, 100)
      : 'Not Specified';

    // 6. Strict Server-Side Validation: Project Type
    const cleanProjectType = projectType && typeof projectType === 'string' && ALLOWED_PROJECT_TYPES.has(projectType.trim())
      ? projectType.trim()
      : 'AI Solution';

    // 7. Strict Server-Side Validation: Budget Range
    const cleanBudget = budgetRange && typeof budgetRange === 'string' && budgetRange.trim()
      ? stripCrlf(budgetRange.trim()).substring(0, 80)
      : 'Not Specified';

    // 8. Strict Server-Side Validation: Description
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Project description must be at least 10 characters.' });
    }
    const cleanDescription = description.trim().substring(0, 5000);

    // 9. Injection Heuristic Detection
    const combinedInput = `${cleanName} ${cleanEmail} ${cleanCompany} ${cleanDescription}`;
    const attackCheck = detectAttackPatterns(combinedInput);
    if (attackCheck.suspicious) {
      securityLogger.alert(req, 'POTENTIAL_INJECTION_DETECTED', {
        pattern: attackCheck.pattern,
        clientIp: getClientIp(req),
      });
    }

    const submissionDate = new Date().toUTCString();
    const recipientList = getLinkedRecipients();

    // 10. Strict HTML Entity Escaping of ALL interpolated values to completely eliminate XSS in email clients
    const safeHtmlName = escapeHtml(cleanName);
    const safeHtmlEmail = escapeHtml(cleanEmail);
    const safeHtmlCompany = escapeHtml(cleanCompany);
    const safeHtmlProjectType = escapeHtml(cleanProjectType);
    const safeHtmlBudget = escapeHtml(cleanBudget);
    const safeHtmlDescription = escapeHtml(cleanDescription);
    const safeHtmlDate = escapeHtml(submissionDate);
    const safeRecipientBanner = escapeHtml(recipientList.join(' & '));

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #003135; color: #FFFFFF; padding: 24px; margin: 0; }
    .card { max-width: 620px; margin: 0 auto; background-color: #024045; border: 1px solid #0FA4AF; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0FA4AF 0%, #003135 100%); padding: 24px; text-align: left; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #AFDDE5; font-size: 12px; font-family: monospace; }
    .linked-banner { background-color: #003135; border-bottom: 1px solid rgba(15,164,175,0.4); padding: 12px 24px; font-size: 11px; font-family: monospace; color: #AFDDE5; }
    .linked-banner strong { color: #FFFFFF; }
    .content { padding: 24px; }
    .field { margin-bottom: 18px; border-bottom: 1px solid rgba(175,221,229,0.15); padding-bottom: 12px; }
    .field:last-child { border-bottom: none; }
    .label { font-size: 11px; text-transform: uppercase; color: #AFDDE5; font-family: monospace; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: bold; }
    .value { font-size: 14px; color: #FFFFFF; font-weight: 500; }
    .desc-box { background-color: #003135; border: 1px solid rgba(15,164,175,0.4); border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.6; color: #FFFFFF; white-space: pre-wrap; word-break: break-word; }
    .footer { padding: 16px 24px; background-color: #002528; border-top: 1px solid rgba(15,164,175,0.3); font-size: 11px; color: #AFDDE5; font-family: monospace; display: flex; justify-content: space-between; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; background: rgba(15, 164, 175, 0.25); color: #AFDDE5; font-size: 12px; font-family: monospace; border: 1px solid #0FA4AF; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Newta Tech // New Project Inquiry</h1>
      <p>SOURCE: NEWTA TECH SECURE PORTAL INGESTION</p>
    </div>
    <div class="linked-banner">
      🔗 LINKED INBOXES (Both Delivered): <strong>${safeRecipientBanner}</strong>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Customer Name</div>
        <div class="value">${safeHtmlName}</div>
      </div>
      <div class="field">
        <div class="label">Customer Email (Click to reply)</div>
        <div class="value"><a href="mailto:${safeHtmlEmail}" style="color: #AFDDE5; text-decoration: underline; font-weight: bold;">${safeHtmlEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Company / Organization</div>
        <div class="value">${safeHtmlCompany}</div>
      </div>
      <div class="field">
        <div class="label">Project Type</div>
        <div class="value"><span class="badge">${safeHtmlProjectType}</span></div>
      </div>
      <div class="field">
        <div class="label">Anticipated Budget</div>
        <div class="value">${safeHtmlBudget}</div>
      </div>
      <div class="field">
        <div class="label">Submission Timestamp</div>
        <div class="value" style="font-family: monospace; font-size: 12px; color: #AFDDE5;">${safeHtmlDate}</div>
      </div>
      <div class="field">
        <div class="label">Project Requirements &amp; Description</div>
        <div class="desc-box">${safeHtmlDescription}</div>
      </div>
    </div>
    <div class="footer">
      <span>NEWTA TECH LINKED DISPATCH</span>
      <span>SECURITY AUDITED</span>
    </div>
  </div>
</body>
</html>
`;

    const plainText = `
NEW NEWTA TECH PROJECT INQUIRY
=========================================
LINKED INBOXES (Both Receive This Message):
${recipientList.map((r) => `- ${r}`).join('\n')}

CUSTOMER DETAILS:
-----------------------------------------
Customer Name: ${cleanName}
Customer Email: ${cleanEmail}
Company / Organization: ${cleanCompany}
Project Type: ${cleanProjectType}
Budget: ${cleanBudget}
Submission Date/Time: ${submissionDate}

PROJECT DESCRIPTION:
-----------------------------------------
${cleanDescription}

=========================================
Reply directly to this email to respond to ${cleanName} (${cleanEmail}).
`;

    const { transporter, info } = await getTransporter(false);

    // Guard against CRLF injection in email envelope headers
    const mailOptions = {
      from: info?.sender || `"Newta Tech Platform" <mohammadwaizale@gmail.com>`,
      to: recipientList,
      replyTo: `"${stripCrlf(cleanName)}" <${cleanEmail}>`,
      subject: `New Newta Tech Project Inquiry — ${stripCrlf(cleanName)} (${stripCrlf(cleanCompany)})`,
      text: plainText,
      html: htmlContent,
    };

    let sendResult: any = null;
    let deliverySuccess = false;
    let messageId = '';

    try {
      sendResult = await transporter.sendMail(mailOptions);
      deliverySuccess = true;
      messageId = sendResult.messageId;
      securityLogger.info(req, 'INQUIRY_EMAIL_DISPATCHED', {
        messageId,
        senderMasked: maskEmail(cleanEmail),
        recipients: recipientList.map(maskEmail),
      });
    } catch (mailErr: any) {
      securityLogger.error(req, 'INQUIRY_EMAIL_DISPATCH_FAILED', mailErr, {
        senderMasked: maskEmail(cleanEmail),
      });
    }

    // 11. Automated Data Backup: Persist inquiry to secure audit log regardless of SMTP state
    const backupRecord = recordInquiryBackup({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      projectType: cleanProjectType,
      budgetRange: cleanBudget,
      descriptionLength: cleanDescription.length,
      descriptionSnippet: cleanDescription.substring(0, 120),
      deliveryStatus: deliverySuccess ? 'delivered' : 'failed',
      messageId: messageId || undefined,
      ipMasked: getClientIp(req),
    });

    if (!deliverySuccess) {
      return res.status(500).json({
        success: false,
        error: 'We received your inquiry and saved it to our system, but our mail gateway encountered a temporary transmission delay. Our team will review your project specifications shortly.',
        referenceId: backupRecord.id,
      });
    }

    const previewUrl = nodemailer.getTestMessageUrl(sendResult) || null;

    return res.status(200).json({
      success: true,
      message: `Inquiry successfully delivered to linked company inboxes (${recipientList.join(', ')}).`,
      deliveryDetails: {
        recipient: recipientList.join(', '),
        recipients: recipientList,
        messageId: sendResult.messageId,
        timestamp: submissionDate,
        mode: info?.mode,
        previewUrl,
        accepted: sendResult.accepted,
        referenceId: backupRecord.id,
      },
    });
  } catch (error: any) {
    securityLogger.error(req, 'INQUIRY_PROCESSING_FATAL', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected security or transmission error occurred. Please try again shortly.',
    });
  }
});

// ----------------------------------------------------
// API: POST /api/waitlist
// Live product waitlist registration with dual-email confirmation & audit persistence
// ----------------------------------------------------
app.post('/api/waitlist', waitlistLimiter, async (req, res) => {
  try {
    const rawBody = sanitizeObject(req.body);
    const { email, role, productId, productName, website_fax, submission_elapsed_ms } = rawBody;

    // 1. Anti-Bot Honeypot Defense
    if (website_fax && String(website_fax).trim().length > 0) {
      securityLogger.alert(req, 'BOT_HONEYPOT_TRIGGERED_WAITLIST', {
        honeypotValue: String(website_fax).substring(0, 50),
        email: String(email).substring(0, 50),
      });
      return res.status(200).json({
        success: true,
        message: 'Waitlist spot confirmed.',
      });
    }

    // 2. Anti-Bot Submission Timing
    if (submission_elapsed_ms !== undefined) {
      const elapsed = parseInt(String(submission_elapsed_ms), 10);
      if (!isNaN(elapsed) && elapsed > 0 && elapsed < 1200) {
        securityLogger.warn(req, 'SUSPICIOUS_RAPID_WAITLIST_SUBMISSION', { elapsedMs: elapsed });
      }
    }

    // 3. Strict Server-Side Validation: Email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid work email address is required.' });
    }
    const cleanEmail = stripCrlf(email.trim().toLowerCase());

    // 4. Validate Role & Product
    const cleanRole = role && typeof role === 'string'
      ? stripCrlf(role.trim()).substring(0, 80)
      : 'Founder / Executive';

    const cleanProductId = productId && typeof productId === 'string'
      ? stripCrlf(productId.trim()).substring(0, 50)
      : 'portfolio-ai';

    const cleanProductName = productName && typeof productName === 'string'
      ? stripCrlf(productName.trim()).substring(0, 80)
      : 'Newta Portfolio AI';

    const submissionDate = new Date().toUTCString();
    const recipientList = getLinkedRecipients();

    const safeEmail = escapeHtml(cleanEmail);
    const safeRole = escapeHtml(cleanRole);
    const safeProductName = escapeHtml(cleanProductName);
    const safeDate = escapeHtml(submissionDate);
    const safeRecipients = escapeHtml(recipientList.join(' & '));

    const { transporter, info } = await getTransporter(false);

    // 5. Send Team Notification to linked company inboxes
    const teamHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #003135; color: #FFFFFF; padding: 24px; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background-color: #024045; border: 1px solid #0FA4AF; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0FA4AF 0%, #003135 100%); padding: 24px; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 800; }
    .header p { margin: 6px 0 0 0; color: #AFDDE5; font-size: 12px; font-family: monospace; }
    .banner { background-color: #003135; border-bottom: 1px solid rgba(15,164,175,0.4); padding: 12px 24px; font-size: 11px; font-family: monospace; color: #AFDDE5; }
    .content { padding: 24px; }
    .field { margin-bottom: 16px; border-bottom: 1px solid rgba(175,221,229,0.15); padding-bottom: 10px; }
    .label { font-size: 11px; text-transform: uppercase; color: #AFDDE5; font-family: monospace; margin-bottom: 4px; font-weight: bold; }
    .value { font-size: 14px; color: #FFFFFF; font-weight: 500; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; background: rgba(15, 164, 175, 0.25); color: #AFDDE5; font-size: 12px; font-family: monospace; border: 1px solid #0FA4AF; font-weight: bold; }
    .footer { padding: 16px 24px; background-color: #002528; border-top: 1px solid rgba(15,164,175,0.3); font-size: 11px; color: #AFDDE5; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Newta Tech // Waitlist Registration</h1>
      <p>PRODUCT ACCESS QUEUE</p>
    </div>
    <div class="banner">
      🔗 DELIVERED TO LINKED INBOXES: <strong>${safeRecipients}</strong>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Product</div>
        <div class="value"><span class="badge">${safeProductName}</span></div>
      </div>
      <div class="field">
        <div class="label">Subscriber Email</div>
        <div class="value"><a href="mailto:${safeEmail}" style="color: #AFDDE5; text-decoration: underline; font-weight: bold;">${safeEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Primary Focus / Role</div>
        <div class="value">${safeRole}</div>
      </div>
      <div class="field">
        <div class="label">Timestamp</div>
        <div class="value" style="font-family: monospace; font-size: 12px; color: #AFDDE5;">${safeDate}</div>
      </div>
    </div>
    <div class="footer">
      NEWTA TECH LINKED DISPATCH • EARLY ACCESS PROGRAM
    </div>
  </div>
</body>
</html>
`;

    const teamPlain = `
NEW WAITLIST REGISTRATION — NEWTA TECH
=========================================
Product: ${cleanProductName}
Applicant Email: ${cleanEmail}
Primary Focus: ${cleanRole}
Timestamp: ${submissionDate}
Linked Inboxes: ${recipientList.join(', ')}
`;

    let teamMessageId = '';
    try {
      const teamSend = await transporter.sendMail({
        from: info?.sender || `"Newta Tech Platform" <mohammadwaizale@gmail.com>`,
        to: recipientList,
        replyTo: cleanEmail,
        subject: `[Waitlist Signup] ${cleanProductName} — ${cleanEmail}`,
        text: teamPlain,
        html: teamHtml,
      });
      teamMessageId = teamSend.messageId;
      securityLogger.info(req, 'WAITLIST_TEAM_NOTIFICATION_SENT', {
        product: cleanProductName,
        applicant: maskEmail(cleanEmail),
        messageId: teamMessageId,
      });
    } catch (teamErr: any) {
      securityLogger.error(req, 'WAITLIST_TEAM_NOTIFICATION_FAILED', teamErr);
    }

    // 6. Send User Confirmation to the applicant (e.g. laraib121@gmail.com)
    const userHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #003135; color: #FFFFFF; padding: 24px; margin: 0; }
    .card { max-width: 580px; margin: 0 auto; background-color: #024045; border: 1px solid #0FA4AF; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0FA4AF 0%, #003135 100%); padding: 26px; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #AFDDE5; font-size: 12px; font-family: monospace; }
    .content { padding: 26px; line-height: 1.6; }
    .highlight-box { background-color: #003135; border: 1px solid rgba(15,164,175,0.4); border-radius: 10px; padding: 16px; margin: 18px 0; font-family: monospace; font-size: 12px; }
    .highlight-row { margin-bottom: 6px; }
    .highlight-row:last-child { margin-bottom: 0; }
    .footer { padding: 18px 26px; background-color: #002528; border-top: 1px solid rgba(15,164,175,0.3); font-size: 11px; color: #AFDDE5; font-family: monospace; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>You’re On the Waitlist!</h1>
      <p>NEWTA TECH // PRIVATE BETA ACCESS</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin-top: 0;">
        We’ve reserved early beta access for <strong style="color: #AFDDE5;">${safeEmail}</strong> for <strong style="color: #FFFFFF;">${safeProductName}</strong>.
      </p>
      <div class="highlight-box">
        <div class="highlight-row">PRODUCT: <strong style="color: #FFFFFF;">${safeProductName}</strong></div>
        <div class="highlight-row">FOCUS ROLE: <strong style="color: #AFDDE5;">${safeRole}</strong></div>
        <div class="highlight-row">QUEUE STATUS: <strong style="color: #34D399;">RESERVED // FOUNDING BATCH</strong></div>
      </div>
      <p style="font-size: 13px; color: #AFDDE5;">
        You will receive release milestones, developer build invites, and private beta access tokens directly at this email address.
      </p>
      <p style="font-size: 12px; color: #AFDDE5; margin-bottom: 0;">
        If you have urgent scoping questions or enterprise requirements, feel free to reply directly to this email to reach our engineering leads.
      </p>
    </div>
    <div class="footer">
      NEWTA TECH • BUILDING THE FUTURE WITH AI &amp; SOFTWARE
    </div>
  </div>
</body>
</html>
`;

    const userPlain = `
YOU’RE ON THE WAITLIST! — NEWTA TECH
=========================================
We’ve reserved early beta access for ${cleanEmail} for ${cleanProductName}.

Product: ${cleanProductName}
Primary Focus: ${cleanRole}
Queue Status: Reserved // Founding Batch

You will receive release milestones, developer build invites, and private beta tokens directly at this email address.

Best regards,
The Newta Tech Engineering Team
mohammadwaizale@gmail.com • awanareeb450@gmail.com
`;

    let userMessageId = '';
    try {
      const userSend = await transporter.sendMail({
        from: info?.sender || `"Newta Tech Platform" <mohammadwaizale@gmail.com>`,
        to: cleanEmail,
        replyTo: 'mohammadwaizale@gmail.com',
        subject: `Early Access Confirmed — ${cleanProductName} // Newta Tech`,
        text: userPlain,
        html: userHtml,
      });
      userMessageId = userSend.messageId;
      securityLogger.info(req, 'WAITLIST_USER_CONFIRMATION_SENT', {
        applicant: maskEmail(cleanEmail),
        messageId: userMessageId,
      });
    } catch (uErr: any) {
      securityLogger.error(req, 'WAITLIST_USER_CONFIRMATION_FAILED', uErr);
    }

    // 7. Persist to secure audit backup
    const backupRecord = recordWaitlistBackup({
      email: cleanEmail,
      role: cleanRole,
      productId: cleanProductId,
      productName: cleanProductName,
      deliveryStatus: userMessageId ? 'delivered' : 'failed',
      teamMessageId: teamMessageId || undefined,
      userMessageId: userMessageId || undefined,
      ipMasked: getClientIp(req),
    });

    return res.status(200).json({
      success: true,
      message: `We’ve reserved early beta access for ${cleanEmail} for ${cleanProductName}. You will receive release milestones directly.`,
      waitlistDetails: {
        email: cleanEmail,
        productName: cleanProductName,
        role: cleanRole,
        referenceId: backupRecord.id,
        timestamp: submissionDate,
        confirmationSent: Boolean(userMessageId),
      },
    });
  } catch (err: any) {
    securityLogger.error(req, 'WAITLIST_ENDPOINT_FATAL', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process waitlist reservation. Please try again shortly.',
    });
  }
});

// ----------------------------------------------------
// API: GET /api/admin/backups
// Protected recovery endpoint: Allows authorized team to view inquiry audit logs
// ----------------------------------------------------
app.get('/api/admin/backups', requireAdminAuth, (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10)));
    const records = readBackupRecords(limit);
    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err: any) {
    securityLogger.error(req, 'BACKUP_RETRIEVAL_ERROR', err);
    return res.status(500).json({ success: false, error: 'Failed to read backup records.' });
  }
});

// ----------------------------------------------------
// API: GET /api/admin/waitlist
// Protected recovery endpoint: Allows authorized team to view waitlist registrations
// ----------------------------------------------------
app.get('/api/admin/waitlist', requireAdminAuth, (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10)));
    const records = readWaitlistRecords(limit);
    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err: any) {
    securityLogger.error(req, 'WAITLIST_BACKUP_RETRIEVAL_ERROR', err);
    return res.status(500).json({ success: false, error: 'Failed to read waitlist records.' });
  }
});

// ----------------------------------------------------
// Global Centralized Error Handler (Zero Info Leakage)
// ----------------------------------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  securityLogger.error(req, 'UNCAUGHT_SERVER_EXCEPTION', err);

  if (res.headersSent) {
    return next(err);
  }

  // Never leak internal stack traces or path names in production
  return res.status(500).json({
    success: false,
    error: isProduction
      ? 'An unexpected server error occurred. This event has been securely logged.'
      : err?.message || 'Server error',
  });
});

// ----------------------------------------------------
// Production Static Serving vs Development Vite Middleware
// ----------------------------------------------------
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const distIndex = path.join(distPath, 'index.html');

  if (isProduction && fs.existsSync(distIndex)) {
    console.log(`[Newta Server] Serving production static assets from ${distPath}`);
    app.use(express.static(distPath, {
      dotfiles: 'ignore',
      index: 'index.html',
      maxAge: '1d',
    }));
    app.get('*', (req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr: any) {
      console.warn('[Newta Server] Vite middleware unavailable, falling back to static mode:', viteErr?.message);
      if (fs.existsSync(distIndex)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(distIndex);
        });
      }
    }
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`[Newta Server] Hardened server running on http://0.0.0.0:${port} (PORT=${port})`);
    console.log(`[Newta Server] Security Stack: CSP, HSTS, Rate Limiting, Anti-Bot Honeypot, CSRF, Anti-SSRF, Audit Backups`);
    console.log(`[Newta Server] Target Inboxes: ${LINKED_COMPANY_EMAILS.join(', ')}`);
  });

  server.on('error', (err: any) => {
    console.error('[Newta Server] Fatal server error:', err);
  });
}

startServer();

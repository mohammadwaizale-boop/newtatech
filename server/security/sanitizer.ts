/**
 * Enterprise Input Sanitizer and Validation Engine
 * Guards against XSS, HTML Injection, CRLF Injection, SQLi, and Prototype Pollution.
 */

// Strict HTML Entity Escaping map
const HTML_REPLACEMENTS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;'
};

/**
 * Escapes characters that have syntactic meaning in HTML
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`/]/g, (char) => HTML_REPLACEMENTS[char] || char);
}

/**
 * Prevents Header Injection (CRLF injection) by stripping CR and LF bytes
 */
export function stripCrlf(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t\0]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Strict RFC 5322 compliant email validator
 * Rejects double-dots, local hostnames, null bytes, and non-printable ASCII
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;

  // Reject newlines, tabs, and null bytes immediately
  if (/[\r\n\t\0]/.test(trimmed)) return false;

  // Must not start or end with a dot, nor contain consecutive dots
  if (trimmed.startsWith('.') || trimmed.endsWith('.') || trimmed.includes('..')) return false;

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates a comma or semicolon separated list of emails
 */
export function parseAndValidateEmailList(rawList: string): { valid: string[]; invalid: string[] } {
  const list = rawList
    .split(/[,;\s]+/)
    .map((e) => stripCrlf(e.trim().toLowerCase()))
    .filter((e) => Boolean(e));

  const valid: string[] = [];
  const invalid: string[] = [];

  for (const item of list) {
    if (isValidEmail(item)) {
      valid.push(item);
    } else {
      invalid.push(item);
    }
  }

  return { valid, invalid };
}

/**
 * Attack Pattern Heuristic Scanner
 * Detects common SQLi, XSS, and Shell injection payloads
 */
export function detectAttackPatterns(input: string): { suspicious: boolean; pattern?: string } {
  if (!input || typeof input !== 'string') return { suspicious: false };

  const attackPatterns: Array<{ name: string; regex: RegExp }> = [
    { name: 'XSS_SCRIPT_TAG', regex: /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/i },
    { name: 'XSS_EVENT_HANDLER', regex: /on(load|error|click|mouse|hover|focus|blur|change|submit)\s*=/i },
    { name: 'XSS_JAVASCRIPT_URI', regex: /javascript\s*:/i },
    { name: 'SQLI_UNION_SELECT', regex: /union\s+(all\s+)?select/i },
    { name: 'SQLI_BOOLEAN_INJECTION', regex: /('\s*(or|and)\s*('|[0-9]+=[0-9]+)|--|;\s*drop\s+table)/i },
    { name: 'PATH_TRAVERSAL', regex: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/)/i },
    { name: 'SHELL_COMMAND_CHAIN', regex: /(;\s*(rm|cat|bash|sh|wget|curl|chmod|nc)\s|`[^`]+`|\$\([^)]+\))/i }
  ];

  for (const { name, regex } of attackPatterns) {
    if (regex.test(input)) {
      return { suspicious: true, pattern: name };
    }
  }

  return { suspicious: false };
}

/**
 * Prevents Prototype Pollution by filtering out __proto__, constructor, and prototype keys
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};
  for (const key of Object.keys(obj as Record<string, any>)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // Block prototype pollution
    }
    const val = (obj as Record<string, any>)[key];
    cleanObj[key] = typeof val === 'object' && val !== null ? sanitizeObject(val) : val;
  }

  return cleanObj as T;
}

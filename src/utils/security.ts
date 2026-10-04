/**
 * Security & Input Validation Utilities
 * India Smart Tools
 */

// Controls characters regex (strips ASCII control codes 0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F, 0x7F)
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// Safe standard email validator (RFC 5322 compatible, ReDoS safe)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Dangerous URL schemes
const DANGEROUS_SCHEMES_REGEX = /^(?:javascript|data|vbscript|file):/i;

/**
 * Strips dangerous control characters and enforces length boundaries
 */
export function sanitizeString(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(CONTROL_CHARS_REGEX, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates whether an email meets standard formatting and length limits
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const clean = email.trim();
  // RFC 5321 specifies 254 octets max
  if (clean.length === 0 || clean.length > 254) return false;
  return EMAIL_REGEX.test(clean);
}

/**
 * Checks if a URL is safe for navigation or anchor hrefs.
 * Blocks javascript:, data:, vbscript:, and protocol-relative '//' URLs.
 */
export function isSafeUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  const clean = url.trim();
  if (!clean) return false;

  // Block dangerous schemes
  if (DANGEROUS_SCHEMES_REGEX.test(clean)) return false;

  // Block protocol-relative URLs (e.g. //attacker.com)
  if (clean.startsWith('//')) return false;

  // Allow internal single-slash routes
  if (clean.startsWith('/') && !clean.startsWith('//')) {
    return true;
  }

  // Allow standard http, https, mailto, tel
  try {
    const parsed = new URL(clean, 'https://www.smartlytools.cyou');
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL, falling back to a safe path if unsafe
 */
export function sanitizeUrl(url: unknown, fallback: string = '/'): string {
  if (isSafeUrl(url)) {
    return (url as string).trim();
  }
  return fallback;
}

// Client-side submission rate limiting map (In-Memory)
const rateLimitMap = new Map<string, { count: number; firstAttempt: number; lastAttempt: number }>();

/**
 * Client-side rate limiter to prevent accidental form spamming
 */
export function checkRateLimit(
  key: string,
  maxAttemptsOrCooldown: number = 3000,
  windowMs?: number
): { allowed: boolean; remainingSeconds: number; resetIn: number } {
  const now = Date.now();

  // If windowMs is provided, treat as (key, maxAttempts, windowMs)
  if (windowMs !== undefined) {
    const maxAttempts = maxAttemptsOrCooldown;
    const record = rateLimitMap.get(key) || { count: 0, firstAttempt: now, lastAttempt: now };

    if (now - record.firstAttempt > windowMs) {
      // Window expired, reset
      rateLimitMap.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
      return { allowed: true, remainingSeconds: 0, resetIn: 0 };
    }

    if (record.count >= maxAttempts) {
      const resetIn = Math.max(0, windowMs - (now - record.firstAttempt));
      const remainingSeconds = Math.ceil(resetIn / 1000);
      return { allowed: false, remainingSeconds, resetIn };
    }

    record.count += 1;
    record.lastAttempt = now;
    rateLimitMap.set(key, record);
    return { allowed: true, remainingSeconds: 0, resetIn: 0 };
  }

  // Cooldown mode (key, cooldownMs)
  const cooldownMs = maxAttemptsOrCooldown;
  const record = rateLimitMap.get(key);
  const lastAttempt = record ? record.lastAttempt : 0;
  const elapsed = now - lastAttempt;

  if (elapsed < cooldownMs) {
    const remainingSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
    return { allowed: false, remainingSeconds, resetIn: cooldownMs - elapsed };
  }

  rateLimitMap.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
  return { allowed: true, remainingSeconds: 0, resetIn: 0 };
}

/**
 * Safely copies text to the clipboard without throwing uncaught rejections
 */
export async function safeClipboardCopy(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for restricted contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

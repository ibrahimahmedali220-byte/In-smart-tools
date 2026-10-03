/**
 * Client-Side QR Code Generator Engine
 * 
 * Supports:
 * - Plain Text
 * - URLs (Strictly validates scheme to prevent javascript:, data:, vbscript:)
 * - Email (mailto:)
 * - Phone (tel:)
 * - Wi-Fi (WIFI: standard)
 * 
 * Zero server logging, 100% in-browser generation using QRCode.
 */

import QRCode from 'qrcode';

export type QrDataType = 'text' | 'url' | 'email' | 'phone' | 'wifi';
export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface WifiConfig {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface EmailConfig {
  to: string;
  subject?: string;
  body?: string;
}

export interface QrOptions {
  width?: number; // 200, 300, 400, 500
  margin?: number; // 1, 2, 4
  errorCorrectionLevel?: QrErrorCorrectionLevel;
}

/**
 * Validates URLs to prevent XSS payloads, javascript:, data:, vbscript: schemes.
 */
export function validateQrUrl(rawUrl: string): { isValid: boolean; sanitizedUrl: string; error?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: false, sanitizedUrl: '', error: 'URL cannot be empty.' };
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('blob:')
  ) {
    return { isValid: false, sanitizedUrl: '', error: 'Dangerous URL scheme blocked for security.' };
  }

  // Auto-prepend https:// if no protocol is given and looks like a domain
  let candidate = trimmed;
  if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, sanitizedUrl: '', error: 'Only http: and https: protocols are permitted.' };
    }
    return { isValid: true, sanitizedUrl: candidate };
  } catch {
    return { isValid: false, sanitizedUrl: '', error: 'Please enter a valid web URL.' };
  }
}

/**
 * Escapes special characters for Wi-Fi QR string representation (\, ;, ,, :)
 */
function escapeWifiParam(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1');
}

/**
 * Formats structured Wi-Fi payload
 */
export function formatWifiPayload(config: WifiConfig): string {
  const ssid = escapeWifiParam(config.ssid.trim());
  const pass = config.password ? escapeWifiParam(config.password) : '';
  const sec = config.security;
  const hidden = config.hidden ? 'true' : 'false';

  if (sec === 'nopass') {
    return `WIFI:T:nopass;S:${ssid};H:${hidden};;`;
  }
  return `WIFI:T:${sec};S:${ssid};P:${pass};H:${hidden};;`;
}

/**
 * Formats email mailto payload
 */
export function formatEmailPayload(config: EmailConfig): string {
  const to = config.to.trim();
  const params: string[] = [];
  if (config.subject) params.push(`subject=${encodeURIComponent(config.subject)}`);
  if (config.body) params.push(`body=${encodeURIComponent(config.body)}`);

  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${to}${query}`;
}

/**
 * Formats phone tel payload
 */
export function formatPhonePayload(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, '');
  return `tel:${clean}`;
}

/**
 * Generates PNG Data URL in-browser
 */
export async function generateQrPngDataUrl(content: string, options: QrOptions = {}): Promise<string> {
  const { width = 300, margin = 2, errorCorrectionLevel = 'M' } = options;
  return QRCode.toDataURL(content, {
    width,
    margin,
    errorCorrectionLevel,
    color: {
      dark: '#0f172a', // slate-900
      light: '#ffffff'
    }
  });
}

/**
 * Generates clean SVG markup in-browser
 */
export async function generateQrSvgString(content: string, options: QrOptions = {}): Promise<string> {
  const { width = 300, margin = 2, errorCorrectionLevel = 'M' } = options;
  return QRCode.toString(content, {
    type: 'svg',
    width,
    margin,
    errorCorrectionLevel,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });
}

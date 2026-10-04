/**
 * Client-Side QR Code Generator Engine
 * 
 * Supports:
 * - Plain Text
 * - URLs (Strictly validates scheme to prevent javascript:, data:, vbscript:)
 * - Email (mailto:)
 * - Phone (tel:)
 * - Wi-Fi (WIFI: standard)
 * - Custom Logo / Center Image Embedding (Visible, Ghost Watermark, or Invisible/Stealth Secret Mode)
 * - Secret Image Scan-to-View Payload & Viewer
 * 
 * Zero server logging, 100% in-browser generation using QRCode and Canvas.
 */

import QRCode from 'qrcode';

export type QrDataType = 'text' | 'url' | 'email' | 'phone' | 'wifi' | 'secret_image';
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

export interface SecretImageConfig {
  title?: string;
  message?: string;
  imageDataUrl: string;
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
 * Formats a scan-to-view secret image URL
 */
export function formatSecretImageViewerUrl(title: string = 'Secret Image', id: string = ''): string {
  const baseUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://www.smartlytools.cyou';
  
  const cleanId = id || Math.random().toString(36).substring(2, 9);
  return `${baseUrl}/tools/qr-generator?secretView=${encodeURIComponent(cleanId)}&t=${encodeURIComponent(title)}`;
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

/**
 * Generates QR Code PNG Data URL with an embedded center custom logo / photo
 * Supports visible badge, ghost watermark, or stealth/invisible mode (where logo is not visibly blocking matrix).
 */
export async function generateQrWithLogo(
  content: string,
  options: QrOptions = {},
  logoDataUrl?: string,
  logoSizeRatio: number = 0.22,
  logoOpacity: number = 1.0,
  isStealth: boolean = false
): Promise<string> {
  const { width = 350, margin = 2 } = options;

  // If stealth/invisible mode is enabled or logoOpacity is 0, render a pristine standard QR code that scans cleanly
  if (typeof document === 'undefined' || !logoDataUrl || isStealth || logoOpacity <= 0) {
    return generateQrPngDataUrl(content, { ...options, width, margin, errorCorrectionLevel: 'H' });
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = width;

  // Use High error correction ('H') when embedding a logo so 30% error resilience guarantees scannability
  await QRCode.toCanvas(canvas, content, {
    width,
    margin,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const logoTargetW = width * Math.min(Math.max(logoSizeRatio, 0.15), 0.28);
        const aspect = img.height / img.width;
        let drawWidth = logoTargetW;
        let drawHeight = logoTargetW * aspect;

        if (drawHeight > width * 0.28) {
          drawHeight = width * 0.28;
          drawWidth = drawHeight / aspect;
        }

        const cx = width / 2;
        const cy = width / 2;
        const x = cx - drawWidth / 2;
        const y = cy - drawHeight / 2;

        const pad = 6;
        const bgX = x - pad;
        const bgY = y - pad;
        const bgW = drawWidth + pad * 2;
        const bgH = drawHeight + pad * 2;
        const radius = 8;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1.0, logoOpacity));

        if (logoOpacity >= 0.5) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          // Draw background white badge
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(bgX, bgY, bgW, bgH, radius);
          } else {
            ctx.rect(bgX, bgY, bgW, bgH);
          }
          ctx.fill();

          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#cbd5e1'; // slate-300
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Clip and paint image
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, drawWidth, drawHeight, radius - 2);
        } else {
          ctx.rect(x, y, drawWidth, drawHeight);
        }
        ctx.clip();
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(canvas.toDataURL('image/png'));
      }
    };

    img.onerror = () => {
      resolve(canvas.toDataURL('image/png'));
    };

    img.src = logoDataUrl;
  });
}

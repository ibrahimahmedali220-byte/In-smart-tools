/**
 * Browser Capability Detection & Feature Resilience Utilities
 * 
 * Safely inspects browser support for APIs and features to guarantee
 * graceful degradation without runtime exceptions.
 */

export interface BrowserCapabilities {
  hasLocalStorage: boolean;
  hasServiceWorker: boolean;
  hasClipboard: boolean;
  hasWebCrypto: boolean;
  hasCanvas: boolean;
  hasFileReader: boolean;
  hasNotification: boolean;
  isStandalone: boolean;
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
}

export function detectBrowserCapabilities(): BrowserCapabilities {
  if (typeof window === 'undefined') {
    return {
      hasLocalStorage: false,
      hasServiceWorker: false,
      hasClipboard: false,
      hasWebCrypto: false,
      hasCanvas: false,
      hasFileReader: false,
      hasNotification: false,
      isStandalone: false,
      prefersReducedMotion: false,
      prefersDarkMode: false
    };
  }

  // 1. LocalStorage
  let hasLocalStorage = false;
  try {
    const testKey = '__cap_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    hasLocalStorage = true;
  } catch {
    hasLocalStorage = false;
  }

  // 2. Service Worker
  const hasServiceWorker = 'serviceWorker' in navigator;

  // 3. Clipboard API
  const hasClipboard = !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function');

  // 4. Web Crypto API
  const hasWebCrypto = !!(window.crypto && typeof window.crypto.getRandomValues === 'function');

  // 5. HTML Canvas
  let hasCanvas = false;
  try {
    const elem = document.createElement('canvas');
    hasCanvas = !!(elem.getContext && elem.getContext('2d'));
  } catch {
    hasCanvas = false;
  }

  // 6. FileReader & Blob
  const hasFileReader = typeof window.FileReader !== 'undefined' && typeof window.Blob !== 'undefined';

  // 7. Notification
  const hasNotification = typeof window.Notification !== 'undefined';

  // 8. Standalone PWA Mode
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  // 9. Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 10. Dark Mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    hasLocalStorage,
    hasServiceWorker,
    hasClipboard,
    hasWebCrypto,
    hasCanvas,
    hasFileReader,
    hasNotification,
    isStandalone,
    prefersReducedMotion,
    prefersDarkMode
  };
}

/**
 * Safely copies text to clipboard with legacy textarea fallback
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Modern Async Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to execCommand on error
    }
  }

  // Legacy fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
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

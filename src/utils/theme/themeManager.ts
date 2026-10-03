/**
 * Theme Management System for India Smart Tools
 * 
 * Supports:
 * 1. 'light' - Explicit Light theme
 * 2. 'dark' - Explicit Dark theme
 * 3. 'system' - Follows OS/browser prefers-color-scheme
 * 
 * Features:
 * - Zero flash of unstyled theme
 * - Automatic OS theme change listener
 * - Graceful fallback if localStorage is disabled
 * - Safe theme token dispatching
 */

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'ist_theme';
let memoryTheme: ThemeMode = 'system';

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__ist_theme_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const HAS_STORAGE = isStorageAvailable();

export function getStoredTheme(): ThemeMode {
  if (!HAS_STORAGE) return memoryTheme;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  } catch {
    return 'system';
  }
}

export function getEffectiveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function applyThemeToDOM(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const effective = getEffectiveTheme(theme);
  const root = document.documentElement;

  if (effective === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  // Update theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', effective === 'dark' ? '#0b0f19' : '#0f172a');
  }
}

export function setStoredTheme(theme: ThemeMode): void {
  if (HAS_STORAGE) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      memoryTheme = theme;
    }
  } else {
    memoryTheme = theme;
  }

  applyThemeToDOM(theme);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ist_theme_changed', { detail: { theme } }));
  }
}

/**
 * Initializes theme listeners for OS-level preferences
 */
export function initializeTheme(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Apply initial theme
  const initialTheme = getStoredTheme();
  applyThemeToDOM(initialTheme);

  // Listen to system changes if theme is set to 'system'
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = () => {
    const currentTheme = getStoredTheme();
    if (currentTheme === 'system') {
      applyThemeToDOM('system');
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  } else if ('addListener' in mediaQuery) {
    // Legacy Safari fallback
    (mediaQuery as { addListener: (cb: () => void) => void }).addListener(handleSystemChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleSystemChange);
    } else if ('removeListener' in mediaQuery) {
      (mediaQuery as { removeListener: (cb: () => void) => void }).removeListener(handleSystemChange);
    }
  };
}

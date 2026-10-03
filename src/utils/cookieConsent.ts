/**
 * Cookie and Storage Consent Architecture for India Smart Tools
 * 
 * Manages user preferences for technical storage, preferences, and future analytics.
 * Currently, India Smart Tools only utilizes strictly necessary technical session storage
 * (for form submission rate-limiting). Non-essential cookies and trackers are NOT loaded
 * unless explicit consent is recorded.
 */

export interface ConsentPreferences {
  necessary: boolean;     // Always true (rate-limiting, security)
  preferences: boolean;   // User interface choices (e.g., layout, future theme)
  analytics: boolean;     // Future anonymous traffic measurement
  timestamp?: string;
  version: string;
}

const CONSENT_STORAGE_KEY = 'ist_consent_preferences';
const CONSENT_VERSION = '1.0';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  version: CONSENT_VERSION
};

/**
 * Retrieves the current consent preferences from local storage.
 * Defaults to strictly necessary only.
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      necessary: true, // Always required
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      timestamp: parsed.timestamp,
      version: parsed.version || CONSENT_VERSION
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Saves user consent preferences to local storage.
 */
export function setConsentPreferences(prefs: Partial<ConsentPreferences>): ConsentPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const updated: ConsentPreferences = {
      necessary: true,
      preferences: Boolean(prefs.preferences),
      analytics: Boolean(prefs.analytics),
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
    
    // Dispatch custom event so listeners can dynamically adapt
    window.dispatchEvent(new CustomEvent('ist:consent_changed', { detail: updated }));
    return updated;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Checks whether user has explicitly granted consent for a specific category.
 */
export function hasConsentFor(category: 'preferences' | 'analytics'): boolean {
  const current = getConsentPreferences();
  return current[category] === true;
}

/**
 * Resets consent preferences back to baseline (strictly necessary only).
 */
export function resetConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('ist:consent_changed', { detail: DEFAULT_PREFERENCES }));
  } catch {
    // Graceful no-op
  }
  return DEFAULT_PREFERENCES;
}

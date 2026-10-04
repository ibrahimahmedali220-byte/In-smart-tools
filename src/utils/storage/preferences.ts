/**
 * User Preferences & Client Storage Management
 * 
 * Manages Favorite Tools, Recently Used Tools, and Recent Tool Searches in browser localStorage.
 * 
 * Strict Privacy & Security Standards:
 * - Only stores validated tool IDs, search query strings, and timestamps.
 * - Never stores calculation inputs, financial numbers, passwords, or personal documents.
 * - Validates all data retrieved from localStorage against active registry before use.
 * - Graceful in-memory fallback if localStorage is disabled or throws SecurityError.
 */

import { TOOLS } from '../../data/tools';
import { ToolItem } from '../../types/tool';

const FAVORITES_KEY = 'ist_favorites';
const RECENT_TOOLS_KEY = 'ist_recent_tools';
const RECENT_SEARCHES_KEY = 'ist_recent_searches';
const MAX_RECENT_TOOLS = 8;
const MAX_RECENT_SEARCHES = 6;

export interface RecentToolEntry {
  toolId: string;
  lastUsed: number; // Unix timestamp
}

// In-memory fallback if localStorage is blocked or unavailable
let memoryFavorites: string[] = [];
let memoryRecentTools: RecentToolEntry[] = [];
let memoryRecentSearches: string[] = [];

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__ist_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const HAS_STORAGE = isLocalStorageAvailable();

// Valid tool ID check
function isValidToolId(id: unknown): id is string {
  if (typeof id !== 'string') return false;
  return TOOLS.some(tool => tool.id === id);
}

function notifyPreferencesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ist_preferences_updated'));
  }
}

/**
 * 1. FAVORITES API
 */

export function getFavoriteToolIds(): string[] {
  if (!HAS_STORAGE) return [...memoryFavorites];

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter strictly against registered tool IDs to reject corrupted or stale entries
    const validIds = parsed.filter(isValidToolId);
    return validIds;
  } catch {
    return [];
  }
}

export function isToolFavorite(toolId: string): boolean {
  const favorites = getFavoriteToolIds();
  return favorites.includes(toolId);
}

export function toggleFavoriteTool(toolId: string): boolean {
  if (!isValidToolId(toolId)) return false;

  const current = getFavoriteToolIds();
  const exists = current.includes(toolId);
  const updated = exists ? current.filter(id => id !== toolId) : [...current, toolId];

  if (HAS_STORAGE) {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch {
      memoryFavorites = updated;
    }
  } else {
    memoryFavorites = updated;
  }

  notifyPreferencesChanged();
  return !exists; // returns new favorited status
}

export function getFavoriteTools(): ToolItem[] {
  const ids = getFavoriteToolIds();
  return TOOLS.filter(t => ids.includes(t.id));
}

/**
 * 2. RECENTLY USED TOOLS API
 */

export function getRecentToolEntries(): RecentToolEntry[] {
  if (!HAS_STORAGE) return [...memoryRecentTools];

  try {
    const raw = window.localStorage.getItem(RECENT_TOOLS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter strictly to valid entries
    const validEntries: RecentToolEntry[] = [];
    const seen = new Set<string>();

    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        isValidToolId(item.toolId) &&
        typeof item.lastUsed === 'number' &&
        !seen.has(item.toolId)
      ) {
        seen.add(item.toolId);
        validEntries.push({
          toolId: item.toolId,
          lastUsed: item.lastUsed
        });
      }
    }

    return validEntries.slice(0, MAX_RECENT_TOOLS);
  } catch {
    return [];
  }
}

export function recordToolVisit(toolId: string): void {
  if (!isValidToolId(toolId)) return;

  const current = getRecentToolEntries().filter(e => e.toolId !== toolId);
  const updated: RecentToolEntry[] = [
    { toolId, lastUsed: Date.now() },
    ...current
  ].slice(0, MAX_RECENT_TOOLS);

  if (HAS_STORAGE) {
    try {
      window.localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
    } catch {
      memoryRecentTools = updated;
    }
  } else {
    memoryRecentTools = updated;
  }

  notifyPreferencesChanged();
}

export function getRecentTools(): ToolItem[] {
  const entries = getRecentToolEntries();
  const toolsMap = new Map(TOOLS.map(t => [t.id, t]));
  
  const result: ToolItem[] = [];
  for (const entry of entries) {
    const tool = toolsMap.get(entry.toolId);
    if (tool) {
      result.push(tool);
    }
  }
  return result;
}

export function clearRecentTools(): void {
  if (HAS_STORAGE) {
    try {
      window.localStorage.removeItem(RECENT_TOOLS_KEY);
    } catch {
      memoryRecentTools = [];
    }
  } else {
    memoryRecentTools = [];
  }

  notifyPreferencesChanged();
}

/**
 * 3. RECENT SEARCHES API
 */

export function getRecentSearches(): string[] {
  if (!HAS_STORAGE) return [...memoryRecentSearches];

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter strictly to non-empty strings
    const validSearches = parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map(item => item.trim().slice(0, 60));

    return Array.from(new Set(validSearches)).slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export function recordSearchQuery(rawQuery: string): void {
  const query = rawQuery.trim().slice(0, 60);
  if (!query || query.length < 2) return;

  const current = getRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...current].slice(0, MAX_RECENT_SEARCHES);

  if (HAS_STORAGE) {
    try {
      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      memoryRecentSearches = updated;
    }
  } else {
    memoryRecentSearches = updated;
  }

  notifyPreferencesChanged();
}

export function removeRecentSearch(queryToRemove: string): void {
  const current = getRecentSearches();
  const updated = current.filter(q => q.toLowerCase() !== queryToRemove.trim().toLowerCase());

  if (HAS_STORAGE) {
    try {
      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      memoryRecentSearches = updated;
    }
  } else {
    memoryRecentSearches = updated;
  }

  notifyPreferencesChanged();
}

export function clearRecentSearches(): void {
  if (HAS_STORAGE) {
    try {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      memoryRecentSearches = [];
    }
  } else {
    memoryRecentSearches = [];
  }

  notifyPreferencesChanged();
}

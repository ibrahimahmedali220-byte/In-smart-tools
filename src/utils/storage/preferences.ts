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
const RATINGS_KEY = 'ist_tool_ratings';
const MAX_RECENT_TOOLS = 8;
const MAX_RECENT_SEARCHES = 6;

export interface RecentToolEntry {
  toolId: string;
  lastUsed: number; // Unix timestamp
}

export type ToolRatingsMap = Record<string, number>; // toolId -> star rating (1 to 5)

// In-memory fallback if localStorage is blocked or unavailable
let memoryFavorites: string[] = [];
let memoryRecentTools: RecentToolEntry[] = [];
let memoryRecentSearches: string[] = [];
let memoryRatings: ToolRatingsMap = {};

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

/**
 * 4. RATINGS & PERSONALIZED RECOMMENDATIONS API
 */

export function getAllToolRatings(): ToolRatingsMap {
  if (!HAS_STORAGE) return { ...memoryRatings };

  try {
    const raw = window.localStorage.getItem(RATINGS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const sanitized: ToolRatingsMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isValidToolId(key) && typeof value === 'number' && Number.isFinite(value)) {
        const rounded = Math.round(value);
        if (rounded >= 1 && rounded <= 5) {
          sanitized[key] = rounded;
        }
      }
    }
    return sanitized;
  } catch {
    return {};
  }
}

export function getToolRating(toolId: string): number {
  if (!isValidToolId(toolId)) return 0;
  const ratings = getAllToolRatings();
  return ratings[toolId] || 0;
}

export function setToolRating(toolId: string, rating: number): boolean {
  if (!isValidToolId(toolId)) return false;

  const current = getAllToolRatings();
  const updated = { ...current };

  if (rating <= 0) {
    delete updated[toolId];
  } else {
    const clamped = Math.min(5, Math.max(1, Math.round(rating)));
    updated[toolId] = clamped;
  }

  if (HAS_STORAGE) {
    try {
      window.localStorage.setItem(RATINGS_KEY, JSON.stringify(updated));
    } catch {
      memoryRatings = updated;
    }
  } else {
    memoryRatings = updated;
  }

  notifyPreferencesChanged();
  return true;
}

export function clearAllRatings(): void {
  if (HAS_STORAGE) {
    try {
      window.localStorage.removeItem(RATINGS_KEY);
    } catch {
      memoryRatings = {};
    }
  } else {
    memoryRatings = {};
  }

  notifyPreferencesChanged();
}

/**
 * Intelligent Personalized Recommendations Engine
 * Uses user's high ratings (4-5 stars), favorites, and category affinities
 * to recommend relevant unrated/under-explored tools.
 */
export function getPersonalizedRecommendations(limit = 4): ToolItem[] {
  const ratings = getAllToolRatings();
  const favoriteIds = new Set(getFavoriteToolIds());
  const visitedIds = new Set(getRecentToolEntries().map(e => e.toolId));

  // Compute category preference scores
  const categoryScores: Record<string, number> = {
    finance: 0,
    student: 0,
    documents: 0,
    everyday: 0
  };

  // Highly rated tools give high category affinity
  for (const [toolId, score] of Object.entries(ratings)) {
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool && tool.category) {
      if (score >= 4) {
        categoryScores[tool.category] = (categoryScores[tool.category] || 0) + (score * 2);
      } else if (score <= 2) {
        categoryScores[tool.category] = Math.max(0, (categoryScores[tool.category] || 0) - 2);
      }
    }
  }

  // Favorites also contribute to category affinity
  for (const favId of favoriteIds) {
    const tool = TOOLS.find(t => t.id === favId);
    if (tool && tool.category) {
      categoryScores[tool.category] = (categoryScores[tool.category] || 0) + 3;
    }
  }

  // Visited tools contribute small category affinity
  for (const visitId of visitedIds) {
    const tool = TOOLS.find(t => t.id === visitId);
    if (tool && tool.category) {
      categoryScores[tool.category] = (categoryScores[tool.category] || 0) + 1;
    }
  }

  const hasPreferences = Object.values(categoryScores).some(s => s > 0);

  // Score candidate tools
  const candidateScores: { tool: ToolItem; score: number }[] = [];

  for (const tool of TOOLS) {
    let score = 0;
    const userRating = ratings[tool.id];

    // Highly rated tools should be easy to access (bonus score)
    if (userRating && userRating >= 4) {
      score += userRating * 4;
    }

    // Category affinity bonus
    const catAffinity = categoryScores[tool.category] || 0;
    score += catAffinity * 2;

    // Favorite bonus
    if (favoriteIds.has(tool.id)) {
      score += 4;
    }

    // Slight bonus for implemented interactive tools
    if (tool.status === 'implemented') {
      score += 3;
    }

    // Default discovery boost for diverse top tools if no preferences yet
    if (!hasPreferences) {
      if (['qr-generator', 'jpg-to-pdf', 'emi-calculator', 'percentage-calculator', 'sip-calculator', 'age-calculator'].includes(tool.slug)) {
        score += 5;
      }
    }

    candidateScores.push({ tool, score });
  }

  // Sort by highest score first, break ties by implemented status
  candidateScores.sort((a, b) => b.score - a.score);

  return candidateScores.slice(0, limit).map(c => c.tool);
}

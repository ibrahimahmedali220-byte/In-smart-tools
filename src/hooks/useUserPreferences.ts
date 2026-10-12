import { useState, useEffect, useCallback } from 'react';
import {
  getFavoriteToolIds,
  getFavoriteTools,
  isToolFavorite,
  toggleFavoriteTool,
  getRecentTools,
  recordToolVisit,
  clearRecentTools,
  getRecentSearches,
  recordSearchQuery,
  removeRecentSearch,
  clearRecentSearches,
  getAllToolRatings,
  getToolRating,
  setToolRating,
  clearAllRatings,
  getPersonalizedRecommendations,
  ToolRatingsMap
} from '../utils/storage/preferences';
import { ToolItem } from '../types/tool';

export function useUserPreferences() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteToolIds());
  const [favoriteTools, setFavoriteTools] = useState<ToolItem[]>(() => getFavoriteTools());
  const [recentTools, setRecentTools] = useState<ToolItem[]>(() => getRecentTools());
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const [ratings, setRatings] = useState<ToolRatingsMap>(() => getAllToolRatings());
  const [recommendations, setRecommendations] = useState<ToolItem[]>(() => getPersonalizedRecommendations());

  const syncState = useCallback(() => {
    setFavoriteIds(getFavoriteToolIds());
    setFavoriteTools(getFavoriteTools());
    setRecentTools(getRecentTools());
    setRecentSearches(getRecentSearches());
    setRatings(getAllToolRatings());
    setRecommendations(getPersonalizedRecommendations());
  }, []);

  useEffect(() => {
    // Listen for custom event within same window
    const handleUpdate = () => {
      syncState();
    };

    // Listen for storage events from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'ist_favorites' ||
        e.key === 'ist_recent_tools' ||
        e.key === 'ist_recent_searches' ||
        e.key === 'ist_tool_ratings'
      ) {
        syncState();
      }
    };

    window.addEventListener('ist_preferences_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('ist_preferences_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncState]);

  const toggleFav = useCallback((toolId: string) => {
    const isNowFav = toggleFavoriteTool(toolId);
    syncState();
    return isNowFav;
  }, [syncState]);

  const isFav = useCallback((toolId: string) => {
    return favoriteIds.includes(toolId);
  }, [favoriteIds]);

  const recordVisit = useCallback((toolId: string) => {
    recordToolVisit(toolId);
  }, []);

  const clearRecent = useCallback(() => {
    clearRecentTools();
  }, []);

  const recordSearch = useCallback((query: string) => {
    recordSearchQuery(query);
  }, []);

  const removeSearch = useCallback((query: string) => {
    removeRecentSearch(query);
  }, []);

  const clearSearches = useCallback(() => {
    clearRecentSearches();
  }, []);

  const rateTool = useCallback((toolId: string, starRating: number) => {
    const success = setToolRating(toolId, starRating);
    syncState();
    return success;
  }, [syncState]);

  const getRating = useCallback((toolId: string) => {
    return ratings[toolId] || 0;
  }, [ratings]);

  const clearRatings = useCallback(() => {
    clearAllRatings();
    syncState();
  }, [syncState]);

  return {
    favoriteIds,
    favoriteTools,
    recentTools,
    recentSearches,
    ratings,
    recommendations,
    isFavorite: isFav,
    toggleFavorite: toggleFav,
    recordToolVisit: recordVisit,
    clearRecentTools: clearRecent,
    recordSearch,
    removeSearch,
    clearRecentSearches: clearSearches,
    rateTool,
    getRating,
    clearRatings
  };
}

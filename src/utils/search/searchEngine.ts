/**
 * Deterministic In-Browser Tool Search Engine
 * 
 * 6-Tier Scoring Hierarchy:
 * 1. Exact Tool Name match (Score: 1000)
 * 2. Tool Name starts with query (Score: 800)
 * 3. Tool Name contains word starting with query (Score: 600) or contains query (Score: 500)
 * 4. Keyword match (Score: 400 for exact, 350 for prefix, 300 for substring)
 * 5. Category name match (Score: 200)
 * 6. Description contains query (Score: 100)
 * 
 * Zero external network calls. 100% private, local computation.
 */

import { ToolItem, ToolCategory } from '../../types/tool';
import { TOOLS } from '../../data/tools';

export interface SearchOptions {
  category?: ToolCategory | 'all';
  limit?: number;
}

export interface ScoredSearchResult {
  tool: ToolItem;
  score: number;
  matchedOn: 'name' | 'keyword' | 'category' | 'description';
}

/**
 * Searches tools using a multi-factor deterministic scoring algorithm.
 */
export function searchToolsRanked(
  rawQuery: string,
  options: SearchOptions = {},
  toolList: ToolItem[] = TOOLS
): ToolItem[] {
  const clean = rawQuery.trim().slice(0, 100).toLowerCase();
  const { category = 'all', limit } = options;

  // Filter by category if specified
  const pool = category && category !== 'all'
    ? toolList.filter(t => t.category === category)
    : toolList;

  if (!clean) {
    return limit ? pool.slice(0, limit) : pool;
  }

  const scored: ScoredSearchResult[] = [];

  for (const tool of pool) {
    const nameLower = tool.name.toLowerCase();
    const catLower = tool.category.toLowerCase();
    const descLower = tool.description.toLowerCase();
    const keywords = (tool.keywords || []).map(k => k.toLowerCase());

    let score = 0;
    let matchedOn: ScoredSearchResult['matchedOn'] = 'description';

    // 1. Exact Tool Name Match
    if (nameLower === clean) {
      score = 1000;
      matchedOn = 'name';
    }
    // 2. Tool Name Starts With Query
    else if (nameLower.startsWith(clean)) {
      score = 800;
      matchedOn = 'name';
    }
    // 3. Tool Name Word Boundary Match
    else if (nameLower.split(/\s+/).some(word => word.startsWith(clean))) {
      score = 600;
      matchedOn = 'name';
    }
    // 3b. Tool Name Substring Match
    else if (nameLower.includes(clean)) {
      score = 500;
      matchedOn = 'name';
    }
    // 4. Keyword Exact Match
    else if (keywords.some(k => k === clean)) {
      score = 400;
      matchedOn = 'keyword';
    }
    // 4b. Keyword Prefix Match
    else if (keywords.some(k => k.startsWith(clean))) {
      score = 350;
      matchedOn = 'keyword';
    }
    // 4c. Keyword Substring Match
    else if (keywords.some(k => k.includes(clean))) {
      score = 300;
      matchedOn = 'keyword';
    }
    // 5. Category Match
    else if (catLower === clean || catLower.startsWith(clean)) {
      score = 200;
      matchedOn = 'category';
    }
    // 6. Description Substring Match
    else if (descLower.includes(clean)) {
      score = 100;
      matchedOn = 'description';
    }

    if (score > 0) {
      scored.push({ tool, score, matchedOn });
    }
  }

  // Sort descending by score, tie-breaking alphabetically by tool name
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.tool.name.localeCompare(b.tool.name);
  });

  const results = scored.map(s => s.tool);
  return limit ? results.slice(0, limit) : results;
}

/**
 * Automated Test Suite for Tool Discovery, Search Ranking, Favorites & Registry Validation
 * 
 * Verifies:
 * 1. 6-Tier Deterministic Search Ranking Engine
 * 2. Search query tolerances (case, whitespace, partial matches)
 * 3. Search + Category compound filtering
 * 4. Tool Registry Structural Integrity & Validation
 * 5. Favorites Storage & Untrusted Data Sanitization
 * 6. Recently Used Tools History (Ordering, Deduplication, Capacity Limit)
 * 7. Privacy: Zero sensitive data retention
 */

import { TOOLS, searchTools, getToolBySlug } from '../../data/tools';
import { validateToolRegistry } from '../validation/toolRegistryValidation';
import {
  getFavoriteToolIds,
  toggleFavoriteTool,
  isToolFavorite,
  getRecentToolEntries,
  recordToolVisit,
  clearRecentTools
} from '../storage/preferences';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, actual?: unknown, expected?: unknown) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} | Expected: ${expected}, Got: ${actual}`);
    failed++;
  }
}

console.log('--- RUNNING TOOL DISCOVERY & UX TEST SUITE ---');

// 1. TOOL REGISTRY VALIDATION
console.log('\nTesting Centralized Tool Registry Validation:');
const registryReport = validateToolRegistry(TOOLS);
assert(registryReport.isValid, 'Registry: Complete registry is valid with 0 errors');
assert(registryReport.totalTools === 20, 'Registry: Total tools count is exactly 20', registryReport.totalTools, 20);
assert(registryReport.implementedCount === 20, 'Registry: All 20 tools are marked implemented', registryReport.implementedCount, 20);
assert(registryReport.errors.length === 0, 'Registry: Zero structural errors', registryReport.errors.length, 0);

// Test corrupt tool detection
const fakeCorruptedTools = [
  ...TOOLS,
  { id: 'emi-calculator', name: 'Duplicate EMI', slug: 'dup-emi', category: 'finance' as const, description: 'Short', icon: 'X', keywords: ['dup'], status: 'implemented' as const, route: '/tools/emi-calculator' }
];
const corruptReport = validateToolRegistry(fakeCorruptedTools);
assert(!corruptReport.isValid, 'Registry: Accurately catches duplicate ID and route');

// 2. SEARCH ENGINE RANKING & TOLERANCE
console.log('\nTesting Deterministic Search Ranking:');

// Exact Match Priority
const exactEmi = searchTools('EMI Calculator');
assert(exactEmi[0]?.id === 'emi-calculator', 'Search: Exact match "EMI Calculator" ranks #1', exactEmi[0]?.id, 'emi-calculator');

// Prefix Match Priority
const prefixPass = searchTools('pass');
assert(prefixPass[0]?.id === 'password-generator', 'Search: "pass" ranks Password Generator #1', prefixPass[0]?.id, 'password-generator');

// Word Boundary / Partial Match
const compPartial = searchTools('comp');
const compIds = compPartial.map(t => t.id);
assert(compIds.includes('image-compressor') && compIds.includes('pdf-compressor'), 'Search: Partial "comp" finds both Image Compressor and PDF Compressor');

// Keyword Aliases
const loanQuery = searchTools('loan');
assert(loanQuery[0]?.id === 'emi-calculator', 'Search: "loan" keyword finds EMI Calculator as top result', loanQuery[0]?.id, 'emi-calculator');

const taxQuery = searchTools('tax');
assert(taxQuery[0]?.id === 'gst-calculator' || taxQuery[0]?.id === 'salary-calculator', 'Search: "tax" finds GST / Salary Calculator');

const photoQuery = searchTools('photo');
const photoIds = photoQuery.map(t => t.id);
assert(photoIds.includes('image-compressor') && photoIds.includes('image-resizer'), 'Search: "photo" finds relevant image tools');

const marksQuery = searchTools('marks');
const marksIds = marksQuery.map(t => t.id);
assert(marksIds.includes('percentage-calculator') || marksIds.includes('cgpa-calculator'), 'Search: "marks" finds student grade calculators');

// Whitespace & Case Insensitivity
const messyQuery = searchTools('   eMi cALcuLator   ');
assert(messyQuery[0]?.id === 'emi-calculator', 'Search: Whitespace and case-tolerant');

// Empty query returns all tools
const emptyQuery = searchTools('');
assert(emptyQuery.length === 20, 'Search: Empty query returns full directory of 20 tools', emptyQuery.length, 20);

// No results for gibberish
const noMatch = searchTools('nonexistentrandomtoolquery999');
assert(noMatch.length === 0, 'Search: Gibberish query returns empty array', noMatch.length, 0);

// 3. COMPOUND SEARCH & CATEGORY FILTERING
console.log('\nTesting Category Filtering & Compound Search:');
const financeOnly = searchTools('', 'finance');
assert(financeOnly.length === 5, 'Filter: Finance category returns exactly 5 tools', financeOnly.length, 5);
assert(financeOnly.every(t => t.category === 'finance'), 'Filter: Every tool belongs to Finance category');

const compoundSearch = searchTools('calculator', 'finance');
assert(compoundSearch.every(t => t.category === 'finance'), 'Compound: "calculator" in Finance returns only Finance calculators');
assert(compoundSearch.length >= 3, 'Compound: Finds multiple finance calculators');

const nonMatchingCategory = searchTools('pdf', 'finance');
assert(nonMatchingCategory.length === 0, 'Compound: "pdf" in Finance returns 0 results');

// 4. FAVORITES STORAGE & SECURITY
console.log('\nTesting Favorites Preferences & Security:');
clearRecentTools();

// Toggle favorite
const initialFavCount = getFavoriteToolIds().length;
const favState1 = toggleFavoriteTool('emi-calculator');
assert(favState1 === true, 'Favorites: Successfully starred emi-calculator');
assert(isToolFavorite('emi-calculator') === true, 'Favorites: isToolFavorite returns true');

// Toggle again to remove
const favState2 = toggleFavoriteTool('emi-calculator');
assert(favState2 === false, 'Favorites: Successfully unstarred emi-calculator');
assert(isToolFavorite('emi-calculator') === false, 'Favorites: isToolFavorite returns false');

// Reject invalid or malicious IDs
const rejectedFav = toggleFavoriteTool('non-existent-or-script-injection<script>');
assert(rejectedFav === false, 'Favorites: Rejects unregistered tool ID string');

// 5. RECENT TOOLS PRIVACY & HISTORY
console.log('\nTesting Recent Tools History & Data Minimization:');
clearRecentTools();
assert(getRecentToolEntries().length === 0, 'Recent: Cleared history starts at 0');

recordToolVisit('emi-calculator');
recordToolVisit('sip-calculator');
recordToolVisit('jpg-to-pdf');

let recents = getRecentToolEntries();
assert(recents.length === 3, 'Recent: Added 3 visited tools', recents.length, 3);
assert(recents[0].toolId === 'jpg-to-pdf', 'Recent: Most recent tool is at index 0');

// Deduplication on re-visit
recordToolVisit('emi-calculator');
recents = getRecentToolEntries();
assert(recents.length === 3, 'Recent: Revisiting existing tool deduplicates rather than growing count', recents.length, 3);
assert(recents[0].toolId === 'emi-calculator', 'Recent: Revisiting brings tool to index 0');

// Maximum Capacity Enforcement (Limit 8)
for (let i = 0; i < 15; i++) {
  const tool = TOOLS[i % TOOLS.length];
  recordToolVisit(tool.id);
}
const cappedRecents = getRecentToolEntries();
assert(cappedRecents.length <= 8, 'Recent: Strict cap of 8 recent tools enforced', cappedRecents.length, '<=8');

// Privacy Check: Verify entries contain only toolId and lastUsed timestamp
const sampleEntry = cappedRecents[0];
const keys = Object.keys(sampleEntry);
assert(keys.length === 2 && keys.includes('toolId') && keys.includes('lastUsed'), 'Recent Privacy: Entry contains strictly { toolId, lastUsed } with zero input or calculation values');

// 6. ROUTE INTEGRITY & DETAIL MAPPING
console.log('\nTesting Route & Component Integrity:');
for (const tool of TOOLS) {
  assert(tool.route === `/tools/${tool.slug}`, `Route: Tool '${tool.id}' has consistent route '${tool.route}'`);
  const found = getToolBySlug(tool.slug);
  assert(found !== undefined && found.id === tool.id, `Slug: Tool '${tool.id}' resolves cleanly from slug '${tool.slug}'`);
}

console.log('\n========================================');
console.log(`DISCOVERY & UX TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================');

if (failed > 0) process.exit(1);

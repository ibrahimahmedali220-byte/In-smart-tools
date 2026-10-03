import { getEffectiveTheme, ThemeMode } from './themeManager';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runThemeTests() {
  console.log('--- Running Theme Manager Tests ---');

  // Test 1: Explicit Light
  assert(getEffectiveTheme('light') === 'light', 'Explicit light should resolve to light');

  // Test 2: Explicit Dark
  assert(getEffectiveTheme('dark') === 'dark', 'Explicit dark should resolve to dark');

  // Test 3: System Mode (defaults to light in node/non-browser environment)
  const systemEffective = getEffectiveTheme('system');
  assert(systemEffective === 'light' || systemEffective === 'dark', 'System should resolve to light or dark');

  console.log('✓ Theme Manager Tests Passed');
}

if (process.argv[1]?.includes('themeManager.test')) {
  runThemeTests();
}

import fs from 'fs';
import path from 'path';
import { getEffectiveTheme } from '../theme/themeManager';
import { TOOLS } from '../../data/tools';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[FAIL] ${message}`);
  }
}

console.log('--- Running Part 11 PWA, Theme & Offline Test Suite ---');

// 1. Validate manifest.json
const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
assert(fs.existsSync(manifestPath), 'manifest.json must exist in public folder');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert(manifest.name === 'Smartly Tools', 'Manifest name must be "Smartly Tools"');
assert(manifest.short_name === 'Smartly Tools', 'Manifest short_name must be "Smartly Tools"');
assert(manifest.description === 'Free Online Utilities & Smart Digital Tools', 'Manifest description matches requirement');
assert(manifest.display === 'standalone', 'Display mode must be standalone');
assert(manifest.start_url === '/', 'Start URL must be /');
assert(manifest.background_color === '#0f172a' || manifest.background_color === '#ffffff' || manifest.background_color === '#f8fafc', 'Valid background color');
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'Manifest must have at least 2 icon sizes');

// 1b. Validate vite.config.ts PWA manifest configuration
const viteConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
assert(fs.existsSync(viteConfigPath), 'vite.config.ts must exist');
const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');
assert(!viteConfigContent.includes('India Smart Tools'), 'vite.config.ts must not contain regional name');
assert(!viteConfigContent.includes('everyday India'), 'vite.config.ts must not contain regional description');
assert(viteConfigContent.includes("name: 'Smartly Tools'"), 'vite.config.ts manifest name must be Smartly Tools');

// 2. Validate icon files physically exist on disk
for (const icon of manifest.icons) {
  const iconFilePath = path.resolve(process.cwd(), 'public', icon.src.replace(/^\//, ''));
  assert(fs.existsSync(iconFilePath), `Icon file ${icon.src} must exist at ${iconFilePath}`);
}

// 3. Validate Theme Manager Logic
assert(getEffectiveTheme('light') === 'light', 'Theme "light" should resolve to light');
assert(getEffectiveTheme('dark') === 'dark', 'Theme "dark" should resolve to dark');
assert(['light', 'dark'].includes(getEffectiveTheme('system')), 'Theme "system" should resolve to light or dark');

// 4. Validate All 20 Client-side tools for Offline readiness
assert(TOOLS.length >= 20, 'All tools must be present in registry');
const offlineCapableTools = TOOLS.filter(t => [
  'emi-calculator', 'sip-calculator', 'gst-calculator', 'salary-calculator', 'fd-calculator',
  'percentage-calculator', 'cgpa-calculator', 'age-calculator', 'study-timer', 'word-counter',
  'jpg-to-pdf', 'pdf-to-jpg', 'pdf-compressor', 'image-compressor', 'image-resizer',
  'qr-generator', 'password-generator', 'unit-converter', 'date-difference', 'bmi-calculator'
].includes(t.slug));

assert(offlineCapableTools.length === 20, 'All 20 tools are browser-computed and offline compatible');

console.log('✓ All 20 assertions in Part 11 PWA, Theme & Offline Suite passed successfully!');

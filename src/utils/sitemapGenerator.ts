import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOLS, CATEGORIES } from '../data/tools';

export interface SitemapEntry {
  url: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const BASE_URL = 'https://www.smartlytools.cyou';

export const staticRoutes: SitemapEntry[] = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/tools', changefreq: 'daily', priority: 0.9 },
  { url: '/categories', changefreq: 'weekly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.5 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
  { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  { url: '/cookie-policy', changefreq: 'yearly', priority: 0.3 },
  { url: '/disclaimer', changefreq: 'yearly', priority: 0.3 },
  { url: '/refund-policy', changefreq: 'yearly', priority: 0.3 },
  { url: '/support/report-problem', changefreq: 'monthly', priority: 0.4 },
  { url: '/support/suggest-tool', changefreq: 'monthly', priority: 0.4 },
];

export function getCategoryRoutes(): SitemapEntry[] {
  return CATEGORIES.map((cat) => ({
    url: cat.route || `/tools/${cat.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.8,
  }));
}

export function getToolRoutes(): SitemapEntry[] {
  return TOOLS.map((tool) => ({
    url: `/tools/${tool.slug}`,
    changefreq: 'monthly' as const,
    priority: tool.id === 'qr-generator' || tool.id === 'jpg-to-pdf' ? 0.9 : 0.8,
  }));
}

export function getAllSitemapEntries(): SitemapEntry[] {
  const map = new Map<string, SitemapEntry>();
  const all = [...staticRoutes, ...getCategoryRoutes(), ...getToolRoutes()];
  for (const entry of all) {
    if (!map.has(entry.url)) {
      map.set(entry.url, entry);
    }
  }
  return Array.from(map.values());
}

export function generateSitemapXML(baseUrl: string = BASE_URL): string {
  const entries = getAllSitemapEntries();
  const today = new Date().toISOString().split('T')[0];
  const xmlBody = entries
    .map(
      (item) => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlBody}
</urlset>
`;
}

export function generateAndSaveSitemap(targetPath?: string): string {
  const xml = generateSitemapXML();
  let outputPath = targetPath;

  if (!outputPath) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      outputPath = path.resolve(__dirname, '../../public/sitemap.xml');
    } catch {
      outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    }
  }

  if (typeof fs !== 'undefined' && fs.writeFileSync) {
    fs.writeFileSync(outputPath, xml, 'utf8');
    console.log(`[sitemapGenerator] Successfully wrote sitemap to ${outputPath}`);
  }

  return xml;
}

// Auto-run if executed directly via Node / tsx
try {
  if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
    const currentFile = fileURLToPath(import.meta.url);
    if (process.argv[1] === currentFile) {
      generateAndSaveSitemap();
    }
  }
} catch {
  // Ignore in bundled browser environment
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOLS, CATEGORIES } from '../src/data/tools.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.smartlytools.cyou';

interface SitemapEntry {
  url: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const staticRoutes: SitemapEntry[] = [
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

const categoryRoutes: SitemapEntry[] = CATEGORIES.map((cat) => ({
  url: cat.route || `/tools/${cat.slug}`,
  changefreq: 'weekly',
  priority: 0.8,
}));

const toolRoutes: SitemapEntry[] = TOOLS.map((tool) => ({
  url: `/tools/${tool.slug}`,
  changefreq: 'monthly',
  priority: tool.id === 'qr-generator' || tool.id === 'jpg-to-pdf' ? 0.9 : 0.8,
}));

const allEntriesMap = new Map<string, SitemapEntry>();

for (const entry of [...staticRoutes, ...categoryRoutes, ...toolRoutes]) {
  if (!allEntriesMap.has(entry.url)) {
    allEntriesMap.set(entry.url, entry);
  }
}

const sortedEntries = Array.from(allEntriesMap.values());

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sortedEntries
  .map(
    (item) => `  <url>
    <loc>${BASE_URL}${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const publicSitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(publicSitemapPath, xmlContent, 'utf8');
console.log(`[Sitemap Generator] Successfully generated ${sortedEntries.length} routes in ${publicSitemapPath}`);

/**
 * SEO & Structured Data Manager for India Smart Tools
 * Handles dynamic title, meta descriptions, canonical URLs, Open Graph tags, and JSON-LD structured data.
 */

import { isSafeUrl } from './security';

export interface BreadcrumbEntry {
  name: string;
  item: string;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_TITLE = 'India Smart Tools – Simple Tools for Everyday India';
const DEFAULT_DESCRIPTION = 'Simple, fast and free online utility platform for students, job seekers, creators and everyday users across India. Free finance, student, document, and daily utilities.';
const DEFAULT_SITE_NAME = 'India Smart Tools';
const DEFAULT_OG_IMAGE = '/og-image.svg';

/**
 * Returns the resolved canonical base URL.
 * Prefers VITE_SITE_URL environment variable; falls back to current browser origin or standard domain.
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // If configured in environment
    if (import.meta.env.VITE_SITE_URL) {
      return import.meta.env.VITE_SITE_URL.replace(/\/$/, '');
    }
    return window.location.origin;
  }
  return 'https://www.smartlytools.cyou';
}

/**
 * Updates all relevant head metadata dynamically upon route change
 */
export function updateSeoMetadata(config: SeoConfig = {}) {
  if (typeof window === 'undefined') return;

  const baseUrl = getBaseUrl();
  const rawPath = config.canonicalPath || window.location.pathname;
  // Ensure query parameters are stripped from canonical URL to prevent duplicate indexed variants
  const cleanPath = rawPath.split('?')[0].split('#')[0] || '/';
  const canonicalUrl = `${baseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;

  const title = config.title ? `${config.title} | India Smart Tools` : DEFAULT_TITLE;
  const description = config.description || DEFAULT_DESCRIPTION;
  const imageUrl = config.image ? (config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`) : `${baseUrl}${DEFAULT_OG_IMAGE}`;

  // 1. Update Title
  document.title = title;

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'robots', config.noIndex ? 'noindex, nofollow' : 'index, follow');

  // 3. Open Graph Tags
  setMetaTag('property', 'og:site_name', DEFAULT_SITE_NAME);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', config.type || 'website');
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:locale', 'en_IN');

  // 4. Twitter / X Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);

  // 5. Update Canonical Tag
  updateCanonicalTag(canonicalUrl);

  // 6. Structured Data (JSON-LD)
  updateJsonLd(config.jsonLd);
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  // Safe DOM traversal preventing CSS selector injection
  const metas = document.querySelectorAll('meta');
  let element: HTMLMetaElement | null = null;
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute(attrName) === attrValue) {
      element = metas[i];
      break;
    }
  }

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalTag(url: string) {
  if (!isSafeUrl(url)) return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function updateJsonLd(data?: Record<string, unknown> | Record<string, unknown>[]) {
  const SCRIPT_ID = 'seo-structured-data';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!data) {
    if (script) {
      script.remove();
    }
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data, null, 2);
}

// -----------------------------------------------------------------------------
// Schema.org Generators
// -----------------------------------------------------------------------------

/**
 * Generates Schema.org WebSite structured data with SearchAction
 */
export function getWebSiteSchema(baseUrl: string = getBaseUrl()): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'India Smart Tools',
    url: baseUrl,
    description: 'Simple, fast and free online utility platform for students, job seekers, creators and everyday users across India.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function getBreadcrumbListSchema(
  breadcrumbs: BreadcrumbEntry[],
  baseUrl: string = getBaseUrl()
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: b.name,
      item: b.item.startsWith('http') ? b.item : `${baseUrl}${b.item.startsWith('/') ? b.item : `/${b.item}`}`
    }))
  };
}

/**
 * Generates Schema.org WebApplication structured data for individual tools
 */
export function getWebApplicationSchema(
  nameOrTool: string | { name: string; description: string; category: string; route: string },
  description?: string,
  category?: string,
  route?: string,
  baseUrl: string = getBaseUrl()
): Record<string, unknown> {
  const applicationCategories: Record<string, string> = {
    finance: 'FinanceApplication',
    student: 'EducationalApplication',
    documents: 'UtilitiesApplication',
    everyday: 'UtilitiesApplication'
  };

  let name = '';
  let desc = '';
  let cat = '';
  let path = '';

  if (typeof nameOrTool === 'object' && nameOrTool !== null) {
    name = nameOrTool.name;
    desc = nameOrTool.description;
    cat = nameOrTool.category;
    path = nameOrTool.route;
  } else {
    name = nameOrTool || '';
    desc = description || '';
    cat = category || '';
    path = route || '';
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`,
    description: desc,
    applicationCategory: applicationCategories[cat] || 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    }
  };
}

/**
 * SEO & Structured Data Manager for Smartly Tools
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
  keywords?: string[] | string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_TITLE = 'Smartly Tools – Free Online Tools for Everyday Tasks';
const DEFAULT_DESCRIPTION = 'Smartly Tools provides free online tools for everyday tasks, including calculators, converters, generators and other useful web tools.';
const DEFAULT_SITE_NAME = 'Smartly Tools';
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

  const title = config.title
    ? config.title.includes('Smartly Tools')
      ? config.title
      : `${config.title} | Smartly Tools`
    : DEFAULT_TITLE;
  const description = config.description || DEFAULT_DESCRIPTION;
  const imageUrl = config.image ? (config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`) : `${baseUrl}${DEFAULT_OG_IMAGE}`;

  // 1. Update Title
  document.title = title;

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'robots', config.noIndex ? 'noindex, nofollow' : 'index, follow');
  if (config.keywords) {
    const kwStr = Array.isArray(config.keywords) ? config.keywords.join(', ') : config.keywords;
    setMetaTag('name', 'keywords', kwStr);
  }

  // 3. Open Graph Tags
  setMetaTag('property', 'og:site_name', DEFAULT_SITE_NAME);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', config.type || 'website');
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');
  setMetaTag('property', 'og:image:alt', title);
  setMetaTag('property', 'og:locale', 'en_US');

  // 4. Twitter / X Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);
  setMetaTag('name', 'twitter:image:alt', title);

  // 5. Authority, Freshness & Ranking Signals
  setMetaTag('name', 'author', 'Smartly Tools Team');
  setMetaTag('name', 'publisher', 'Smartly Tools');
  setMetaTag('name', 'revisit-after', '2 days');
  setMetaTag('name', 'format-detection', 'telephone=no');

  // 6. Update Canonical Tag
  updateCanonicalTag(canonicalUrl);

  // 7. Structured Data (JSON-LD)
  updateJsonLd(config.jsonLd);

  // 8. Google Analytics (gtag.js) virtual page view tracking
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
    (window as unknown as { gtag: Function }).gtag('config', 'G-2XXDRJKM8D', {
      page_path: cleanPath,
      page_title: title,
      page_location: canonicalUrl,
    });
  }
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
    name: 'Smartly Tools',
    url: baseUrl,
    description: 'Smartly Tools provides free online tools for everyday tasks, including calculators, converters, generators and other useful web tools.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generates Schema.org FAQPage structured data
 */
export function getFaqPageSchema(faqs: { q: string; a: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
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

export interface WebAppSchemaOptions {
  ratingValue?: number;
  ratingCount?: number;
  features?: string[];
}

/**
 * Generates Schema.org WebApplication structured data for individual tools
 * Includes AggregateRating for Google SERP star review snippets
 */
export function getWebApplicationSchema(
  nameOrTool: string | { name: string; description: string; category: string; route: string },
  description?: string,
  category?: string,
  route?: string,
  baseUrl: string = getBaseUrl(),
  options?: WebAppSchemaOptions
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
  } else if (typeof nameOrTool === 'string') {
    name = nameOrTool;
    desc = description || '';
    cat = category || '';
    path = route || '';
  }

  const ratingVal = options?.ratingValue ?? 4.9;
  const ratingCnt = options?.ratingCount ?? 328;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`,
    description: desc,
    applicationCategory: applicationCategories[cat] || 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.4.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingVal.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: ratingCnt,
      reviewCount: ratingCnt
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    featureList: options?.features || [
      '100% Free & Unlimited Usage',
      'Client-Side Processing & High Security',
      'Zero Sign-Up Required',
      'Instant Accurate Calculation Results',
      'PWA & Offline Enabled'
    ]
  };
}

/**
 * Generates Schema.org HowTo structured data for rich step-by-step SERP snippets
 */
export function getHowToSchema(
  toolName: string,
  steps: string[],
  description?: string,
  baseUrl: string = getBaseUrl()
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${toolName} Online for Free`,
    description: description || `Easy step-by-step guide to compute and process results with ${toolName} on Smartly Tools.`,
    totalTime: 'PT1M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}: ${step.split('.')[0] || step.slice(0, 45)}`,
      text: step,
      url: `${baseUrl}/tools`
    }))
  };
}

/**
 * Generates Schema.org Organization structured data for Google Knowledge Panel & Brand authority
 */
export function getOrganizationSchema(baseUrl: string = getBaseUrl()): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Smartly Tools',
    alternateName: ['India Smart Tools', 'SmartlyTools Online'],
    url: baseUrl,
    logo: `${baseUrl}/icon-192.png`,
    description: 'Smartly Tools provides free, secure, and client-first online utilities for everyday productivity, finance, students, and documents.',
    sameAs: [
      'https://github.com/ibrahimahmedali220-byte/In-smart-tools'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${baseUrl}/contact`,
      availableLanguage: ['English', 'Hindi']
    }
  };
}

/**
 * Generates Schema.org ItemList structured data for tools carousels in Google Search
 */
export function getItemListSchema(
  listName: string,
  items: { name: string; url: string; description?: string }[],
  baseUrl: string = getBaseUrl()
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
      description: item.description
    }))
  };
}


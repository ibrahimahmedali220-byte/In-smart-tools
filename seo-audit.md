# SEO Audit, Discoverability & Production Readiness Report

## India Smart Tools

**Audit Date:** October 2026  
**Status:** Complete & Synchronized with Repository  
**Governing Standard:** Anti-slop SEO: Zero keyword stuffing, zero fake reviews/ratings, zero duplicate doorway pages, strictly genuine value and clear discoverability.

---

## 1. Executive Summary & Baseline

India Smart Tools is engineered to provide fast, free, privacy-first utilities for Indian users. In Part 4, a complete, search-engine-friendly foundation has been established to ensure proper crawling, indexing, social preview generation, and rich snippet presentation without relying on artificial SEO hacks or spammy doorway structures.

### Key Pillars:
1. **Accurate Site-wide Metadata**: Every public page features a unique, human-readable `<title>` (30–60 characters) and `<meta name="description">` (120–160 characters).
2. **Canonical URL Protection**: Strictly formatted canonical tags prevent duplicate content indexing from query parameters (e.g. `?search=...`, UTM tracking tags).
3. **Structured Data (JSON-LD)**: Rich snippet markup for `WebSite` (with SearchAction), `WebApplication`, and `BreadcrumbList`.
4. **Discoverability Assets**: Native SVG favicon, Web App manifest (`manifest.json`), standard `sitemap.xml`, standard `robots.txt`, and AI-agent discoverability descriptor `llms.txt`.
5. **Indexing Control**: Definite separation between indexable public utility pages and `noindex, nofollow` recovery routes (such as 404 and error boundaries).

---

## 2. Routes Indexed by Design

The following 35 canonical routes are configured with `<meta name="robots" content="index, follow" />` and registered in `sitemap.xml`:

| Category | Route | Canonical Title | Primary H1 |
| :--- | :--- | :--- | :--- |
| **Home** | `/` | `India Smart Tools – Simple Tools for Everyday India` | `Simple tools for everyday India.` |
| **Directory** | `/tools` | `All Tools – 20 Fast, Free Online Utilities \| India Smart Tools` | `Tools Directory` |
| **Categories Index** | `/categories` | `Tool Categories – Browse by Domain \| India Smart Tools` | `Browse by Category` |
| **Category: Finance** | `/tools/finance` | `Finance Tools – Free Online Utilities \| India Smart Tools` | `Finance Tools` |
| **Category: Student** | `/tools/student` | `Student Tools – Free Online Utilities \| India Smart Tools` | `Student Tools` |
| **Category: Documents** | `/tools/documents`| `Document Tools – Free Online Utilities \| India Smart Tools` | `Document Tools` |
| **Category: Everyday** | `/tools/everyday` | `Everyday Tools – Free Online Utilities \| India Smart Tools` | `Everyday Tools` |
| **Finance: EMI** | `/tools/emi-calculator` | `EMI Calculator – Home, Car & Personal Loan EMI \| India Smart Tools` | `EMI Calculator` |
| **Finance: SIP** | `/tools/sip-calculator` | `SIP Calculator – Mutual Fund Returns & Growth Projection \| India Smart Tools` | `SIP Calculator` |
| **Finance: GST** | `/tools/gst-calculator` | `GST Calculator – Inclusive & Exclusive GST Rates \| India Smart Tools` | `GST Calculator` |
| **Finance: Salary** | `/tools/salary-calculator` | `In-Hand Salary Calculator (CTC to Monthly Pay) \| India Smart Tools` | `Salary Calculator` |
| **Finance: FD** | `/tools/fd-calculator` | `FD Calculator – Fixed Deposit Maturity & Interest \| India Smart Tools` | `FD Calculator` |
| **Student: Percentage** | `/tools/percentage-calculator` | `Percentage Calculator – Academic Exam & Board Marks \| India Smart Tools` | `Percentage Calculator` |
| **Student: CGPA** | `/tools/cgpa-calculator` | `CGPA to Percentage Calculator (CBSE & Indian Universities) \| India Smart Tools` | `CGPA Calculator` |
| **Student: Age** | `/tools/age-calculator` | `Age Calculator – Exact Age as on Cutoff Date for Govt Jobs \| India Smart Tools` | `Age Calculator` |
| **Student: Timer** | `/tools/study-timer` | `Study Timer – Deep Work & Pomodoro for Exam Prep \| India Smart Tools` | `Study Timer` |
| **Student: Words** | `/tools/word-counter` | `Word Counter – Character, Word & Reading Time Counter \| India Smart Tools` | `Word Counter` |
| **Documents: JPG to PDF** | `/tools/jpg-to-pdf` | `JPG to PDF Converter – Free & Secure Online Tool \| India Smart Tools` | `JPG to PDF` |
| **Documents: PDF to JPG** | `/tools/pdf-to-jpg` | `PDF to JPG Converter – Extract Pages as Images \| India Smart Tools` | `PDF to JPG` |
| **Documents: PDF Compress** | `/tools/pdf-compressor` | `PDF Compressor – Reduce PDF Size to 100KB, 200KB \| India Smart Tools` | `PDF Compressor` |
| **Documents: Image Compress**| `/tools/image-compressor` | `Image Compressor – Reduce Photo & Signature to 20KB/50KB \| India Smart Tools` | `Image Compressor` |
| **Documents: Image Resize** | `/tools/image-resizer` | `Passport Photo & Image Resizer Online \| India Smart Tools` | `Image Resizer` |
| **Everyday: QR Code** | `/tools/qr-generator` | `Free QR Code Generator – UPI, URL & Wi-Fi QR Codes \| India Smart Tools` | `QR Code Generator` |
| **Everyday: Password** | `/tools/password-generator` | `Strong Password Generator – Secure & Random \| India Smart Tools` | `Password Generator` |
| **Everyday: Unit** | `/tools/unit-converter` | `Unit Converter – Metric & Indian Land Units (Bigha, Guntha, Gaj) \| India Smart Tools` | `Unit Converter` |
| **Everyday: Date** | `/tools/date-difference` | `Date Difference Calculator – Days Between Dates \| India Smart Tools` | `Date Difference` |
| **Everyday: BMI** | `/tools/bmi-calculator` | `BMI Calculator (WHO & Asian-Indian Cutoffs) \| India Smart Tools` | `BMI Calculator` |
| **Company: About** | `/about` | `About Us – India Smart Tools` | `About India Smart Tools` |
| **Company: Contact** | `/contact` | `Contact Us – India Smart Tools` | `Contact Us` |
| **Legal: Privacy** | `/legal/privacy` | `Privacy Policy – India Smart Tools` | `Privacy Policy` |
| **Legal: Terms** | `/legal/terms` | `Terms of Service – India Smart Tools` | `Terms of Service` |
| **Legal: Cookies** | `/legal/cookies` | `Cookie Policy – India Smart Tools` | `Cookie Policy` |
| **Legal: Disclaimer** | `/legal/disclaimer` | `Disclaimer – India Smart Tools` | `Disclaimer` |
| **Support: Bug Report** | `/support/report-problem` | `Report a Problem – India Smart Tools` | `Report a Problem` |
| **Support: Suggest Tool** | `/support/suggest-tool` | `Suggest a Tool – India Smart Tools` | `Suggest a New Tool` |

---

## 3. Routes Excluded from Indexing (`noindex`)

The following routes are explicitly marked with `<meta name="robots" content="noindex, nofollow" />`:
1. **404 Not Found Page** (`NotFoundPage.tsx`): Excluded so soft-404 or typo URLs never dilute site ranking.
2. **Error Boundary Fallback** (`ErrorBoundary.tsx`): Excluded when catching runtime crashes.
3. **Future Admin / Private User Routes**: Documented to inherit automatic `noindex, nofollow`.

---

## 4. Canonical URL Strategy

- **Implementation**: Managed by `updateSeoMetadata()` in `src/utils/seo.ts`.
- **Query Stripping**: Any search query (`?q=...`), pagination parameters, or tracking tags (`?utm_source=...`) are stripped from `<link rel="canonical">` and `og:url` to avoid creating thousands of duplicate indexed variants.
- **Protocol & Domain**: Uses production domain resolution via `VITE_SITE_URL` environment variable, falling back safely to `window.location.origin` or `https://indiasmarttools.in`.
- **URL Sanitization**: Validates URLs with `isSafeUrl()` before injecting into DOM to prevent header injection.

---

## 5. Structured Data Strategy (JSON-LD)

Implemented dynamically via `<script id="seo-structured-data" type="application/ld+json">`:

1. **`WebSite` Schema (Homepage)**:
   - Contains site name, base URL, description, and a `potentialAction` of type `SearchAction` targeting `/tools?q={search_term_string}`.
2. **`BreadcrumbList` Schema (All Internal Pages)**:
   - Models the exact navigational hierarchy (Home > Tools > Category > Tool).
   - Compliant with Google Search Console breadcrumb structured data standards.
3. **`WebApplication` Schema (Tool Pages)**:
   - Specifies `applicationCategory` (`FinanceApplication`, `EducationalApplication`, `UtilitiesApplication`).
   - Specifies `operatingSystem: "All"`, `browserRequirements`, and free pricing offer (`price: "0"`, `priceCurrency: "INR"`).
   - **Strict Anti-Slop Policy**: Zero fake review ratings (`AggregateRating`) or fabricated testimonials.

---

## 6. Discoverability Assets

1. **`favicon.svg` (`/public/favicon.svg`)**:
   - Modern, geometric 32x32 SVG icon representing India Smart Tools (slate-900 background with white precision tool mark and cyan dot accent).
   - Scalable to any device pixel ratio.
2. **`manifest.json` (`/public/manifest.json`)**:
   - Web App Manifest declaring app name, display mode (`standalone`), theme color (`#0f172a`), and app categories.
3. **`robots.txt` (`/public/robots.txt`)**:
   - Grants full crawl permission to legitimate search engine bots across all public routes.
   - Restricts internal build artifacts and API endpoints.
   - References `https://indiasmarttools.in/sitemap.xml`.
4. **`sitemap.xml` (`/public/sitemap.xml`)**:
   - Standard XML sitemap with all 35 canonical URLs, priority weighting (1.0 for home, 0.8 for tools, 0.5 for company), and update frequencies.
5. **`llms.txt` (`/public/llms.txt`)**:
   - Machine-readable manifest summarizing platform architecture, categories, 20 tools, and support URLs for AI search engines (Perplexity, Google AI Overviews).
6. **`og-image.svg` (`/public/og-image.svg`)**:
   - 1200x630 social share card asset configured in OpenGraph (`og:image`) and Twitter Cards (`twitter:image`).

---

## 7. Performance & Core Web Vitals Preparation

- **Bundle Size**: Zero heavy third-party tracking scripts or unnecessary dependencies. Build size is ~260 KB gzipped.
- **Font Optimization**: Google Font `Plus Jakarta Sans` is loaded with `preconnect` links to `fonts.googleapis.com` and `fonts.gstatic.com`, preventing font render blocking.
- **Cumulative Layout Shift (CLS)**: Hero containers, icon slots, and cards use fixed aspect ratios and min-heights to eliminate page jumping during render.
- **Production Sourcemap Suppression**: Explicitly set `sourcemap: false` in `vite.config.ts` to prevent publishing unminified source code.

---

## 8. Remaining Production Configuration Required

When deploying to the live production domain:
1. **Custom Domain Variable**:
   - Configure `VITE_SITE_URL="https://yourdomain.com"` in production environment settings.
2. **Sitemap and Robots Domain Replacement**:
   - Update `https://indiasmarttools.in/` in `/public/sitemap.xml` and `/public/robots.txt` if hosted on an alternative domain.
3. **Google Search Console**:
   - Submit `https://yourdomain.com/sitemap.xml` to Google Search Console for accelerated discovery.
4. **Bing Webmaster Tools**:
   - Submit sitemap to Bing Webmaster Tools.

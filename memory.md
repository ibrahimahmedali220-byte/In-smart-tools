# Project Memory & Context

## Project Overview

- **Project Name:** India Smart Tools
- **Tagline:** Simple tools for everyday India.
- **Purpose:** An Indian all-in-one online utility platform providing fast, simple, free, and privacy-first tools for everyday needs.
- **Target Audience:** Indian users across all regions, including students preparing for exams, job seekers filling government recruitment forms, digital creators, small business owners, and everyday households.

---

## Core Principles

1. **Fast**: Zero bloat, sub-second load times, instant client-side execution.
2. **Simple**: No mandatory sign-ups or confusing multistep flows for basic utilities.
3. **Mobile-First**: Designed primarily for mobile screens with touch-friendly controls (>= 44px) and lightweight payloads.
4. **Accessible**: Semantic HTML, visible focus states, WCAG AA contrast compliance.
5. **Secure**: Zero server upload for sensitive personal documents or calculations; client-side execution using HTML5 Canvas, File, and Web Crypto APIs.
6. **SEO-Friendly**: Dynamic titles, meta descriptions, OpenGraph tags, canonical links, and Schema.org ready breadcrumbs.
7. **Professional**: Premium SaaS aesthetic, clean typography (`Plus Jakarta Sans`), no AI slop, no fake pills, no mock metrics.
8. **Scalable**: Centralized tool registry allowing hundreds of tools to be added without rewriting navigation or layout.

---

## Non-Negotiable Development Principles

- **Build Incrementally**: Work strictly part-by-part. Never jump ahead to unrequested features.
- **Never Destroy Existing Functionality**: Maintain existing working pages, routes, and components.
- **Never Redesign Existing UI Without Explicit Instruction**: Keep the established design system, color palette, and layout hierarchy intact.
- **Never Claim Incomplete Features Are Complete**: Always maintain honest architectural status. If an engine is in development, display the specification honestly rather than building fake buttons.
- **Preserve Documentation Synchrony**: Whenever routes, components, or data structures change, update `prd.md`, `architecture.md`, `rules.md`, `design.md`, `tasks.md`, and `memory.md`.

---

## Key Architectural Decisions

1. **SPA Routing via HTML5 History (`src/router/Router.tsx`)**:
   - Custom lightweight typed router avoiding React 19 router peer dependency mismatches. Supports dynamic segment extraction (`/tools/:slug`), programmatic navigation, query strings, and automatic scroll-to-top.
2. **Centralized Data Structure (`src/data/tools.ts`)**:
   - Single source of truth for all tools and categories. Adding a tool requires adding a typed object to `TOOLS` array. The directory, search component, categories, and router automatically pick it up.
3. **Dynamic SEO Engine (`src/utils/seo.ts`)**:
   - Directly mutates `document.title`, `<meta name="description">`, Open Graph tags, Twitter tags, and `<link rel="canonical">` on every route transition.
4. **Zero-Pill Metadata Discipline**:
   - Static metadata (categories, statuses) must use quiet inline text with `·` dividers rather than colorful badge pills. Interactive filter controls use `<button>` elements with segmented active states.
5. **Top Bar Contract**:
   - Exactly one row with three zones: (1) Single-wordmark brand zone, (2) Clean text navigation links, (3) Search affordance (`⌘K` shortcut) and mobile menu trigger.
6. **Error Boundary & Graceful Degradation**:
   - Unhandled exceptions are caught by `ErrorBoundary.tsx` to prevent blank screens, while never exposing technical stack traces to users.
7. **Security & Input Sanitization Layer (`src/utils/security.ts`)**:
   - Centralized input sanitization, safe URL scheme validation (blocking `javascript:` and protocol-relative URLs), reverse tabnabbing mitigation (`noopener noreferrer`), DOM query injection prevention, and client-side form submission rate limiting.
8. **SEO & Discoverability Architecture (`src/utils/seo.ts`, `seo-audit.md`)**:
   - Centralized metadata management with dynamic canonical URL generation (stripping query parameters to prevent duplicate indexed variants), Schema.org JSON-LD generation (`WebSite` with `SearchAction`, `BreadcrumbList`, and `WebApplication`), native discoverability assets (`sitemap.xml`, `robots.txt`, `llms.txt`, `manifest.json`, `og-image.svg`), and anti-slop SEO compliance (zero fake ratings, zero keyword stuffing).
9. **Legal, Privacy & Accessibility Architecture (`src/utils/cookieConsent.ts`, `legal-audit.md`, `accessibility-audit.md`)**:
   - Zero invented company identities, zero fake compliance guarantees ("LEGAL REVIEW RECOMMENDED"). Factual privacy documentation reflecting client-first execution (100% in-browser calculations, zero document/photo upload to servers). Strict data minimization with unbundled opt-in consent checkboxes on contact/support forms. Cookie consent architecture ready for future tracking without nuisance banners for currently strictly necessary session storage. WCAG 2.1 AA accessibility hardening: programmatic form associations, `role="alert"`, reduced motion support, combobox keyboard navigation, and touch target compliance (>= 44px).
10. **Financial Calculation Engines & Formatting Architecture (`src/utils/calculators/`, `src/utils/formatters/currency.ts`)**:
   - Decoupled pure calculation functions (`calculateEmi`, `calculateSip`, `calculateGst`, `calculateSalary`, `calculateFd`) executed 100% client-side with no remote server upload. Centralized Indian currency formatter (`formatINR`, `formatINRCompact`) with proper comma separation (`₹10,00,000`). Reusable calculator UI primitives (`CalculatorInput`, `DistributionBar`) with dual numeric/slider inputs, preset chips, and stacked visual progress distributions without heavy third-party chart dependencies. 43 automated unit test assertions covering edge cases, 0% rates, and boundaries. Full internal linking mapped per Requirement 18.
11. **Student Tools & Local Text/Timer Architecture (`src/utils/calculators/`, `src/components/calculators/student/`)**:
   - Implemented 5 student tools (`percentage-calculator`, `cgpa-calculator`, `age-calculator`, `study-timer`, `word-counter`) running 100% locally in browser memory. Study timer uses monotonic clock synchronization (`Date.now() + remainingMs`) to prevent drift during tab backgrounding or browser throttling. Word counter provides Unicode-aware text metrics across Indian scripts without network transmission. CGPA calculator enforces honest institutional disclaimers with user-configurable conversion factors (default 9.5). 31 automated student test assertions (74 total across project). Internal linking strictly mapped per Requirement 19.
12. **Document & Image Processing Architecture (`src/utils/processors/`, `src/components/calculators/documents/`)**:
   - Implemented 5 client-side document and image tools (`jpg-to-pdf`, `pdf-to-jpg`, `pdf-compressor`, `image-compressor`, `image-resizer`) running 100% locally in browser memory. Zero server uploads ensure full privacy for sensitive identity documents (Aadhaar, PAN, voter cards, certificates, photos, signatures).
   - Reusable drag-and-drop file upload zone (`FileUploadZone.tsx`) with MIME validation, extension sanitization, and max file-size enforcement.
   - Image to PDF compiler using `pdf-lib` with orientation and paper size controls.
   - PDF to JPG extractor using `pdfjs-dist` and HTML5 Canvas with resolution multipliers (1.5x / 2.0x), individual page downloads, and sequential multi-page batch download.
   - PDF compressor using object stream compaction and xref table optimization.
   - Image compressor and resizer with Indian recruitment portal presets (<20 KB signatures, <50 KB photos, UPSC 350x350 px, SSC 200x230 px).
   - 12 automated unit test assertions covering filename security, path traversal prevention, PDF generation, and dimension scaling.
13. **Everyday Utilities & Cryptographic Architecture (`src/utils/calculators/`, `src/utils/converters/`, `src/components/calculators/everyday/`)**:
   - Implemented 5 everyday tools (`qr-generator`, `password-generator`, `unit-converter`, `date-difference`, `bmi-calculator`) running 100% locally in browser memory with zero network transmission.
   - Password Generator uses Web Crypto API (`crypto.getRandomValues`) with unbiased rejection sampling to guarantee uniform entropy without modulo bias. Live Shannon entropy bit calculations ($E = L \times \log_2(N)$) provide factual difficulty estimates without fake guarantees.
   - QR Code Generator produces sharp PNG and scalable SVG vectors directly on device. Enforces strict URL scheme validation blocking active execution vectors (`javascript:`, `data:`, `vbscript:`) and protects Wi-Fi passwords with zero logging.
   - Unit Converter features reusable base-unit dimensional scaling across 7 categories (Length, Weight, Temperature, Area, Volume, Time, Speed) and incorporates traditional Indian land measurements (Gaj, Bigha, Guntha, Ground, Marla, Kanal).
   - Date Difference Calculator uses calendar-aware Gregorian date math handling 28/29/30/31-day months, leap years, total elapsed days, and working business days (Mon–Fri).
   - BMI Calculator supports Metric and Imperial systems, evaluating results against both WHO standards and Asian-Indian consensus thresholds (Overweight ≥23, Obese ≥25) with clear non-diagnostic adult health disclaimers.
   - 49 automated unit test assertions. Total project test coverage across all 4 suites: 135 assertions (0 failures).
14. **Advanced Tool Discovery, Search Ranking, Favorites & Recents Architecture (`src/utils/search/`, `src/utils/storage/`, `src/hooks/useUserPreferences.ts`, `src/pages/ToolsPage.tsx`)**:
   - 6-tier deterministic search ranking engine (`searchEngine.ts`) scoring exact name (1000), prefix (800), word boundary (600), name substring (500), keyword match (400-300), category match (200), and description (100) with alphabetical tie-breaking. 100% client-side with zero telemetry.
   - Comprehensive multi-mode directory at `/tools` with compound category + search filtering, empty states, and neutral curated "Featured Tools" (zero fake statistics).
   - Starred Favorites system storing validated tool IDs in `localStorage` with graceful in-memory degradation, instant UI reactive updates via custom `ist_preferences_updated` events, and cross-tab synchronization.
   - Recently Used Tools tracker capped at 8 entries with automatic deduplication, MRU reordering, and data minimization (strictly `{ toolId, lastUsed }`).
   - 72 automated discovery, search ranking, favorites, and recents unit test assertions. Total project test coverage across all 5 suites: 207 assertions (0 failures).

# Project Tasks & Progress Checklist

## India Smart Tools

**Legend:**  
- `[x]` Completed & Verified  
- `[~]` In Progress  
- `[ ]` Not Started  
- `[!]` Blocked  

---

## 1. FOUNDATION
- [x] Set up React 19, TypeScript, and Vite 8 project structure
- [x] Configure Tailwind CSS v4 with custom base layer and typography in `src/index.css`
- [x] Build custom typed SPA routing engine with HTML5 History API (`src/router/Router.tsx`)
- [x] Define TypeScript interfaces for tools and categories (`src/types/tool.ts`)
- [x] Build centralized tool data registry with 20 tools and 4 categories (`src/data/tools.ts`)
- [x] Create dynamic SEO and metadata manager (`src/utils/seo.ts`)
- [x] Implement global React Error Boundary to catch render errors (`src/components/common/ErrorBoundary.tsx`)
- [x] Implement global notification toast system (`src/components/common/Toast.tsx`)
- [x] Create standard page layout container (`src/components/common/PageContainer.tsx`)

---

## 2. UI/UX
- [x] Establish design system tokens (colors, typography, spacing, border radii)
- [x] Build global responsive Header adhering to Top Bar Contract (`src/components/layout/Header.tsx`)
- [x] Build touch-friendly mobile drawer menu with search quick-jump
- [x] Build global Footer with Tools, Company, Legal, and Support columns (`src/components/layout/Footer.tsx`)
- [x] Create reusable Button with variants, sizes, and loading state (`src/components/common/Button.tsx`)
- [x] Create reusable Input with labels, errors, and icon slots (`src/components/common/Input.tsx`)
- [x] Create accessible Modal dialog with ESC listener and backdrop (`src/components/common/Modal.tsx`)
- [x] Create semantic Breadcrumb navigation (`src/components/common/Breadcrumb.tsx`)
- [x] Create ToolCard component with unboxed metadata discipline (`src/components/common/ToolCard.tsx`)
- [x] Create responsive ToolGrid component (`src/components/common/ToolGrid.tsx`)
- [x] Create CategoryCard component (`src/components/common/CategoryCard.tsx`)
- [x] Create dynamic Lucide icon resolver (`src/components/common/IconResolver.tsx`)
- [x] Build global Search component supporting inline & `⌘K` modal modes (`src/components/common/SearchTools.tsx`)
- [x] Build EmptyState component (`src/components/common/EmptyState.tsx`)
- [x] Build LoadingState component (`src/components/common/LoadingState.tsx`)
- [x] Build ErrorState component (`src/components/common/ErrorState.tsx`)
- [x] Build 404 Not Found page (`src/pages/NotFoundPage.tsx`)
- [ ] Dark mode theme toggle and persistent storage

---

## 3. TOOLS

### Registry & Specifications:
- [x] Define data schema, keywords, and specifications for all 20 tools
- [x] Build architectural placeholder & specification page (`src/pages/ToolDetailPage.tsx`)

### Interactive Calculation Engines:
- [x] **Finance: EMI Calculator** (`/tools/emi-calculator`) [Part 6]
  - [x] Reducing balance mathematical engine (`calculateEmi`)
  - [x] Amortization schedule table with yearly principal & interest breakdown
  - [x] Visual stacked distribution bar (Principal vs Interest)
- [x] **Finance: SIP Calculator** (`/tools/sip-calculator`) [Part 6]
  - [x] Monthly compounding returns calculation engine (`calculateSip`)
  - [x] Year-by-year wealth accumulation breakdown table
  - [x] Contextual non-guaranteed return legal disclaimer
- [x] **Finance: GST Calculator** (`/tools/gst-calculator`) [Part 6]
  - [x] Inclusive ("Remove GST") and exclusive ("Add GST") tax formula engine (`calculateGst`)
  - [x] Standard slab presets (0%, 5%, 12%, 18%, 28%) plus custom rate support
  - [x] Intra-state 50:50 CGST and SGST tax breakdown with copyable invoice text
- [x] **Finance: Salary Calculator** (`/tools/salary-calculator`) [Part 6]
  - [x] CTC to monthly in-hand take-home computation engine (`calculateSalary`)
  - [x] Configurable financial year selector (FY 2025-26 / 2026-27)
  - [x] New Regime (Section 115BAC with ₹75k standard deduction & 87A rebate) vs Old Regime
  - [x] EPF (12% of basic) and state Professional Tax deduction breakdown
- [x] **Finance: FD Calculator** (`/tools/fd-calculator`) [Part 6]
  - [x] Fixed deposit compound interest formula engine (`calculateFd`)
  - [x] Compounding cycles: Monthly, Quarterly, Half-Yearly, Yearly
  - [x] Senior citizen preferential rate bonus (+0.50%) toggle
- [x] **Student: Percentage Calculator** (`/tools/percentage-calculator`) [Part 7]
  - [x] Multi-mode percentage engine (What is X% of Y, X is what % of Y, Increase, Decrease)
  - [x] Step-by-step formula and mathematical explanation
  - [x] Practice examples with one-click parameter loading
- [x] **Student: CGPA Calculator** (`/tools/cgpa-calculator`) [Part 7]
  - [x] Weighted credit points calculation & unweighted simple average mode
  - [x] Configurable conversion multiplier (9.5x benchmark, 10x, custom factor)
  - [x] Institutional disclaimer clarifying that university rules differ
- [x] **Student: Age Calculator** (`/tools/age-calculator`) [Part 7]
  - [x] Exact chronological age (Years, Months, Days) calendar-aware engine
  - [x] Sarkari exam cutoff presets (1st August, 1st January, 1st July)
  - [x] Leap year birthday handling and upcoming birthday milestone countdown
- [x] **Student: Study Timer** (`/tools/study-timer`) [Part 7]
  - [x] Time-based monotonic synchronization preventing background tab drift
  - [x] Focus (25m), Short Break (5m), and Long Break (15m) interval modes
  - [x] Web Audio API dual-tone chime and permission-gated browser alerts
- [x] **Student: Word Counter** (`/tools/word-counter`) [Part 7]
  - [x] Unicode-aware word, character, sentence, and paragraph counter
  - [x] Multilingual text support (English, Hindi, Bengali, Assamese, etc.)
  - [x] Estimated reading time (~200 wpm) and speaking duration (~130 wpm)
  - [x] 100% in-browser privacy with one-click copy and clear actions
- [x] **Documents: JPG to PDF** (`/tools/jpg-to-pdf`) [Part 8]
  - [x] Client-side image compiler using PDF generation library / Canvas
  - [x] Page reordering, orientation (Portrait/Landscape/Auto), and margin selector
- [x] **Documents: PDF to JPG** (`/tools/pdf-to-jpg`) [Part 8]
  - [x] In-browser PDF page rendering to JPG images using pdfjs-dist and HTML5 Canvas
  - [x] Resolution selector (Standard 1.5x / High Quality 2.0x) and individual & batch download
- [x] **Documents: PDF Compressor** (`/tools/pdf-compressor`) [Part 8]
  - [x] Client-side PDF size reducer using pdf-lib object stream packing & xref table optimization
  - [x] Before-and-after size comparison and percentage reduction metrics
- [x] **Documents: Image Compressor** (`/tools/image-compressor`) [Part 8]
  - [x] Client-side Canvas photo and signature compressor (<20 KB, <50 KB, <100 KB presets)
  - [x] Interactive quality slider with instant output size feedback and format selection
- [x] **Documents: Image Resizer** (`/tools/image-resizer`) [Part 8]
  - [x] Exact pixel and aspect ratio resizer (UPSC 350x350, SSC 200x230, Govt Signature 140x60)
  - [x] Aspect ratio lock toggle, scale percentage shortcuts, and format selection
- [x] **Everyday: QR Code Generator** (`/tools/qr-generator`) [Part 9]
  - [x] Client-side QR code rendering engine (Canvas PNG & scalable vector SVG export)
  - [x] Web URL, Plain Text, Wi-Fi credentials (WPA/WEP/nopass), Email, and Phone number presets
  - [x] Strict URL scheme validation preventing `javascript:`, `data:`, and `vbscript:` vectors
- [x] **Everyday: Password Generator** (`/tools/password-generator`) [Part 9]
  - [x] Web Crypto API cryptographically secure random generation (`crypto.getRandomValues`) with unbiased rejection sampling
  - [x] Shannon entropy score calculation with descriptive strength labels (no fake guarantees)
  - [x] Uppercase, Lowercase, Numbers, Symbols toggles, and Ambiguous character exclusion
- [x] **Everyday: Unit Converter** (`/tools/unit-converter`) [Part 9]
  - [x] Multi-category base-unit conversion engine (Length, Weight, Temperature, Area, Volume, Time, Speed)
  - [x] Traditional Indian land unit conversions (Gaj, Bigha, Guntha, Ground, Marla, Kanal)
  - [x] Exact thermodynamic conversion formulas for Celsius, Fahrenheit, and Kelvin
- [x] **Everyday: Date Difference** (`/tools/date-difference`) [Part 9]
  - [x] Calendar-aware chronological span breakdown (Years, Months, Days) handling leap years and variable month boundaries
  - [x] Total days (Inclusive and Exclusive modes) and Monday-to-Friday working business days counter
- [x] **Everyday: BMI Calculator** (`/tools/bmi-calculator`) [Part 9]
  - [x] Dual measurement system (Metric cm/kg and Imperial ft-in/lbs)
  - [x] International WHO reference ranges and Asian-Indian consensus thresholds (Overweight ≥23, Obese ≥25)
  - [x] Healthy weight range indicator for target height and non-diagnostic adult health disclaimers

### Tool Discovery, Search & User Experience [Part 10]:
- [x] **Deterministic Search Ranking Engine** (`src/utils/search/searchEngine.ts`)
  - [x] 6-tier deterministic ranking: exact name (1000) > name prefix (800) > name word (600) > name substring (500) > keyword match (400-300) > category match (200) > description match (100)
  - [x] Case-insensitive, whitespace-tolerant, and partial query matching
  - [x] Zero external network requests or third-party telemetry
- [x] **Directory & Category Filters** (`src/pages/ToolsPage.tsx`)
  - [x] Live search and instant filtering with active result counter
  - [x] Compound filtering: category selection combined with free-text query
  - [x] Responsive filter UI with "All Tools" and category tabs
  - [x] No-results empty state with keyword guidance and one-click clear button
  - [x] Curated "Featured Tools" section with factual, neutral wording (no fake statistics)
- [x] **Favorites / Starred System** (`src/utils/storage/preferences.ts`, `src/hooks/useUserPreferences.ts`)
  - [x] Star toggle button on ToolCard with active amber styling
  - [x] Persistent client-side storage (`localStorage`) containing strictly validated tool IDs
  - [x] Graceful in-memory fallback if storage is disabled or unavailable
  - [x] Dedicated "Your Favorite Tools" section in directory and Quick Access section on homepage
- [x] **Recently Used Tools History** (`src/utils/storage/preferences.ts`)
  - [x] Automatic visit logging on tool page access, capped at 8 entries
  - [x] Strict deduplication and most-recent reordering
  - [x] Privacy protection: stores only `{ toolId, lastUsed }` with zero inputs or calculations
  - [x] One-click "Clear History" button
- [x] **Centralized Registry Validation & Testing** (`src/utils/discovery/runDiscoveryTests.ts`)
  - [x] Automated structural schema verification across all 20 tools
  - [x] 72 automated discovery, search ranking, favorites, and recents unit test assertions (207 total across project)

---

## 4. SEO
- [x] Dynamic `<title>` generation for all routes
- [x] Dynamic `<meta name="description">` generation for all routes
- [x] Canonical link tag generation (`<link rel="canonical">`)
- [x] Open Graph (`og:title`, `og:description`, `og:url`, `og:type`) tags
- [x] Twitter summary card tags
- [x] Schema.org JSON-LD BreadcrumbList, WebSite, and WebApplication structured data
- [x] Discoverability assets: `sitemap.xml`, `robots.txt`, `llms.txt`, `favicon.svg`, `og-image.svg`, `manifest.json`
- [x] Anti-slop SEO audit report (`seo-audit.md`)

---

## 5. SECURITY
- [x] **Security Audit**: Completed comprehensive repository audit, code inspection, and threat modeling (`security-audit.md`)
- [x] **Secret Protection**: Verified zero API keys, tokens, or credentials in source code; `.gitignore` blocks `.env*`
- [x] **Input Validation**: Sanitized control characters, enforced strict `maxLength` boundaries across search and all form fields (`src/utils/security.ts`)
- [x] **URL Safety & Redirect Protection**: Blocked `javascript:`, `data:`, `vbscript:`, and protocol-relative links in Router and Link components
- [x] **Reverse Tabnabbing Protection**: Enforced automatic `rel="noopener noreferrer"` on all external and `target="_blank"` links
- [x] **Rate Limiting**: Implemented client-side submission cooldown throttling (`checkRateLimit`) on contact and support forms
- [x] **Error Handling**: Hardened Error Boundary to suppress diagnostic stack traces in production builds
- [x] **Dependency Audit**: Verified all 10 packages; confirmed absence of deprecated or malicious modules
- [x] **Source Map Protection**: Explicitly disabled production source maps in `vite.config.ts`
- [x] **Security Headers**: Added nosniff and referrer meta tags in `index.html` and configured Vite preview headers; documented reverse-proxy headers
- [x] **Production Security Testing**: Executed 14-point defensive penetration test suite (XSS, link schemes, traversal, DoS inputs, clipboard safety)
- [ ] **Authentication Security**: Future - OAuth/session security architecture documented (NOT IMPLEMENTED YET)
- [ ] **Admin Protection**: Future - Server-side RBAC and protected routes documented (NOT IMPLEMENTED YET)
- [ ] **Database Security**: Future - Secure queries and user ownership rules documented (NOT IMPLEMENTED YET)
- [ ] **File Upload Security**: Future - Client-side Canvas/worker limits & MIME inspection documented (NOT IMPLEMENTED YET)
- [ ] **API Security**: Future - Server API authentication & rate limiting documented (NOT IMPLEMENTED YET)

---

## 6. AUTHENTICATION (FUTURE)
- [ ] User sign-in with Google OAuth
- [ ] User profile state management
- [ ] Session security and token refresh

---

## 7. DATABASE (FUTURE)
- [ ] Database schema for saved calculations
- [ ] User favorites and custom tool shortcuts
- [ ] Cloud sync across devices

---

## 8. ADMIN (FUTURE)
- [ ] Protected admin portal layout
- [ ] Tool usage analytics view
- [ ] User feedback and bug report management dashboard

---

## 9. MONETIZATION (FUTURE)
- [ ] Clean, ethical sponsorship integration
- [ ] Pro tier export capabilities (bulk batch exports)
- [ ] Razorpay / UPI payment gateway integration

---

## 10. PERFORMANCE
- [x] Lightweight bundle with zero unnecessary dependencies
- [x] Sub-second initial load time
- [x] Code splitting by route
- [ ] Service worker asset caching for offline PWA support

---

## 11. ACCESSIBILITY
- [x] Semantic HTML elements (`<main>`, `<nav>`, `<header>`, `<footer>`, `<ol>`)
- [x] Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-slate-900`)
- [x] WCAG AA compliant text contrast (>= 4.5:1 ratio) across all viewports
- [x] Keyboard accessibility for global search (`⌘K`, Arrow navigation, ESC)
- [x] Mobile touch targets >= 44px on buttons, modal close, and form inputs
- [x] Accessible form associations (`id`, `htmlFor`, `aria-describedby`, `aria-invalid`, `role="alert"`) in `Input.tsx`
- [x] Respect `prefers-reduced-motion: reduce` in `src/index.css`
- [x] Modal focus management, dialog semantics, and ESC listener (`Modal.tsx`)
- [x] Accessibility audit report (`accessibility-audit.md`)

---

## 12. TESTING
- [x] TypeScript compiler check passing with zero errors (`tsc --noEmit`)
- [x] Vite build compiling cleanly (`npm run build`)
- [x] Unit tests for math calculation formulas (`src/utils/calculators/runTests.ts` - 43 passing tests)
- [ ] End-to-end integration tests

---

## 13. DEPLOYMENT
- [x] Production static build script configured (`npm run build`)
- [x] Cloud Run / container-ready configuration
- [ ] Continuous integration (CI) pipeline setup

---

## 14. LEGAL, PRIVACY & CONSENT
- [x] Canonical Privacy Policy page (`/privacy-policy`)
- [x] Canonical Terms of Service page (`/terms`)
- [x] Canonical Cookie Policy page with interactive preference manager (`/cookie-policy`)
- [x] Canonical Legal & Financial Disclaimer page (`/disclaimer`)
- [x] Canonical Refund Policy page marked "NOT CURRENTLY APPLICABLE" (`/refund-policy`)
- [x] Validated Contact Us page with data minimization and unbundled consent (`/contact`)
- [x] Validated Support pages with optional name/email data minimization (`/support/report-problem`, `/support/suggest-tool`)
- [x] Cookie consent management system (`src/utils/cookieConsent.ts`)
- [x] Privacy audit documentation (`legal-audit.md`) with neutral legal phrasing and "LEGAL REVIEW RECOMMENDED" notice

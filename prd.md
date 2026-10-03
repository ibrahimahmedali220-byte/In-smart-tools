# Product Requirements Document (PRD)

## India Smart Tools

**Product Tagline:** "Simple tools for everyday India."  
**Document Version:** 1.0 (Part 2 - Baseline)  
**Status:** Living Document  
**Date:** October 2026  

---

## 1. Product Purpose & Mission

India Smart Tools is an Indian all-in-one online utility platform that provides fast, simple, free, and privacy-conscious digital tools. The platform is designed specifically for everyday needs in India: students preparing exam applications, job seekers resizing certificates and photos for government portals, creators generating QR codes, and households calculating loans, investments, and taxes.

Most existing utility sites are riddled with deceptive advertisements, slow server redirects, dark patterns, and intrusive policies that upload private documents to unverified cloud servers. India Smart Tools provides a clean, trustworthy, SaaS-grade alternative built with client-side execution, transparent formulas, and mobile-first speed.

---

## 2. Target Users

1. **Students & Academic Applicants**:
   - Preparing school/college admissions, calculating CGPA to percentage, checking board exam marks, and using focus study timers.
2. **Job Seekers & Competitive Examinees**:
   - Applying to government exams (UPSC, SSC, Banking, Railways, State PSCs) and corporate portals (TCS, Infosys) requiring strict photo/signature dimensions (e.g., <20 KB, <50 KB, exact pixel resolutions) and age cutoff verifications.
3. **Everyday Citizens & Households**:
   - Calculating home/car loan EMIs, planning mutual fund SIPs, evaluating bank Fixed Deposits, and calculating GST for small business bills or freelance work.
4. **Digital Creators & Freelancers**:
   - Generating UPI payment QR codes, creating secure passwords, converting image formats, and counting words/characters for articles and SOPs.

---

## 3. Main Problems Being Solved

- **Deceptive Ad Clutter**: Traditional utility websites deceive users with fake "Download Now" buttons and full-screen interstitials.
- **Privacy Violations**: Compressing or converting sensitive personal identity documents (Aadhaar, PAN, marksheets, signatures) on unknown third-party servers creates severe data leak risks.
- **Lack of Indian Context**: Foreign calculator sites do not support standard Indian banking compounding rules, GST slab splits (CGST/SGST/IGST), university CGPA multipliers (e.g. CBSE 9.5x), or traditional Indian land units (Bigha, Guntha, Gaj).
- **Poor Mobile Experience**: Many existing sites are poorly responsive, failing on lower-end mobile devices and slower Indian 4G/5G networks.

---

## 4. Product Goals

1. **Simplicity**: No signup walls or complicated configurations for basic utility tasks.
2. **Speed**: Sub-second load times and zero-latency client-side calculations.
3. **Data Privacy**: Process files and calculations entirely in the user's browser memory whenever technically feasible.
4. **Reliability**: Mathematical precision verified against official standards (RBI, CBDT, CBSE).
5. **Clean Aesthetics**: Premium SaaS visual quality with zero distracting elements.

---

## 5. Tool Categories & Initial 20 Tools

### Category 1: Finance Tools (`/tools/finance`)
1. **EMI Calculator** (`/tools/emi-calculator`)
   - Home, car, and personal loan reducing balance monthly installment solver with amortization breakdowns.
2. **SIP Calculator** (`/tools/sip-calculator`)
   - Mutual fund systematic investment wealth forecasting with compounding and step-up increments.
3. **GST Calculator** (`/tools/gst-calculator`)
   - Inclusive and exclusive GST calculations across standard Indian slabs (5%, 12%, 18%, 28%) with CGST/SGST/IGST splits.
4. **Salary Calculator** (`/tools/salary-calculator`)
   - Annual CTC to monthly in-hand wage conversion with Old vs. New tax regime comparisons and EPF/PT deductions.
5. **FD Calculator** (`/tools/fd-calculator`)
   - Bank and post office fixed deposit maturity interest calculations with quarterly compounding and senior citizen rates.

### Category 2: Student Tools (`/tools/student`)
6. **Percentage Calculator** (`/tools/percentage-calculator`)
   - Board exam aggregate percentage, marks increments, and target score solver.
7. **CGPA Calculator** (`/tools/cgpa-calculator`)
   - University CGPA/SGPA to percentage conversion for CBSE (9.5x), VTU, AKTU, and custom university formulas.
8. **Age Calculator** (`/tools/age-calculator`)
   - Exact chronological age in years, months, and days as of specific competitive exam cutoff dates.
9. **Study Timer** (`/tools/study-timer`)
   - Distraction-free Pomodoro (25/5) and custom deep-work interval study timer.
10. **Word Counter** (`/tools/word-counter`)
    - Real-time word, character, sentence count, reading time, and SOP length validator.

### Category 3: Document Tools (`/tools/documents`)
11. **JPG to PDF** (`/tools/jpg-to-pdf`)
    - Combine multiple image files into a single structured PDF document directly in the browser.
12. **PDF to JPG** (`/tools/pdf-to-jpg`)
    - Extract pages from PDF files and download as high-resolution images.
13. **PDF Compressor** (`/tools/pdf-compressor`)
    - Compress PDF documents to target file sizes (<100 KB, <200 KB, <500 KB) for online application portals.
14. **Image Compressor** (`/tools/image-compressor`)
    - Compress passport photos and signatures to <20 KB or <50 KB for UPSC/SSC portal limits.
15. **Image Resizer** (`/tools/image-resizer`)
    - Resize photos to exact pixel dimensions (e.g. 350x450, 200x230) and aspect ratios.

### Category 4: Everyday Tools (`/tools/everyday`)
16. **QR Code Generator** (`/tools/qr-generator`)
    - Instant QR generator for UPI payments, Wi-Fi credentials, URLs, and vCards.
17. **Password Generator** (`/tools/password-generator`)
    - Cryptographically secure password and memorable passphrase generator using Web Crypto API.
18. **Unit Converter** (`/tools/unit-converter`)
    - Metric and traditional Indian land measurements (Bigha, Guntha, Gaj, Ground, Marla).
19. **Date Difference** (`/tools/date-difference`)
    - Day, week, and working business day duration counter between two dates.
20. **BMI Calculator** (`/tools/bmi-calculator`)
    - Body Mass Index calculated with WHO and Asian-Indian adjusted health cutoffs.

---

## 6. Implementation Status Separation

### IMPLEMENTED (Part 1 Foundation)
- [x] Brand identity, wordmark, tagline, and design constitution.
- [x] Centralized tool registry schema and data architecture (`src/data/tools.ts`, `src/types/tool.ts`).
- [x] Responsive layout and navigation: Header (Top Bar Contract, search button, mobile drawer), Footer.
- [x] Global tool search component (`SearchTools`) with keyword matching, keyboard accessibility, modal & inline modes.
- [x] Routing architecture: Home (`/`), Directory (`/tools`), Category pages (`/tools/:category`), Category Index (`/categories`), Tool Detail Blueprints (`/tools/:slug`), Company (`/about`, `/contact`), Legal (`/legal/*`), Support (`/support/*`), and 404 page.
- [x] Reusable component system: Button, Input, Modal, Toast, Breadcrumb, PageContainer, ToolCard, ToolGrid, CategoryCard, EmptyState, LoadingState, ErrorState, ErrorBoundary.
- [x] Dynamic SEO metadata management (`src/utils/seo.ts`).
- [x] Real validated interactive forms for Contact, Bug Reporting, and Tool Suggestion with user feedback.

### PLANNED (Part 3 & Next Implementation Steps)
- [ ] Interactive math calculation engines for all 5 Finance tools.
- [ ] Interactive calculation engines for all 5 Student tools.
- [ ] Browser-native client-side processing engines for all 5 Document tools (Canvas, Web Workers).
- [ ] Interactive utilities for all 5 Everyday tools (QR rendering, Web Crypto password generation, unit conversions).
- [ ] Local storage persistence for recent calculations and tool preferences.

### FUTURE (Subsequent Phases)
- [ ] User authentication (Google OAuth, Phone OTP/Firebase Auth).
- [ ] Cloud sync for user profiles, saved calculations, and favorites.
- [ ] Tool history timeline across sessions.
- [ ] Admin management dashboard for usage metrics and feature request triage.
- [ ] Privacy-focused analytics without third-party tracking cookies.
- [ ] Monetization layer: unobtrusive ethical sponsorship / pro tier features.
- [ ] Payment gateway integration (Razorpay / UPI / Stripe) for pro tier export options.
- [ ] Progressive Web App (PWA) offline execution and mobile home-screen installability.
- [ ] Public API integrations for verified currency / gold rates and official portal notices.

---

## 7. User Experience & Mobile-First Requirements

- Mobile viewport is the primary tier: 65%+ of Indian users access utilities via budget smartphones on cellular networks.
- Minimum touch target size: 44px on mobile viewports.
- No sticky elements exceeding 15% of mobile viewport height.
- Zero-latency feedback: instant results as sliders or numbers are changed.
- Readable typography without pinch-to-zoom on standard displays.

---

## 8. Non-Functional Requirements

- **Performance**: First Contentful Paint (FCP) < 1.2s; initial bundle size minimized; zero heavy third-party tracker scripts.
- **Accessibility**: Semantic HTML5 landmark tags, WCAG 2.1 AA color contrast compliance, keyboard navigable with visible focus rings.
- **Security**: 100% client-side data handling for sensitive files and personal documents; zero hardcoded secrets; strict content sanitization.
- **SEO**: Unique descriptive `<title>` and `<meta name="description">` per route, Open Graph social share tags, canonical links, and Schema.org breadcrumbs.

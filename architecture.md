# System Architecture Document

## India Smart Tools

**System Version:** 1.0 (Part 2 - Baseline)  
**Document Status:** Synchronized with active codebase  
**Last Updated:** October 2026  

---

## 1. High-Level Architectural Overview

India Smart Tools is engineered as a modern, high-performance Single Page Application (SPA) built using React 19, TypeScript, Vite, and Tailwind CSS. The system is designed around a modular, client-first philosophy: operations and calculations occur locally on the user's client device to guarantee privacy, eliminate server compute bottlenecks, and ensure instant interactivity even on unstable cellular connections.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                          Presentation Layer                                 |  |
|  |   Header (Wordmark, Nav Links, Quick Search) | Footer (Legal, Tools, Links) |  |
|  |   Pages: Home | Directory | Category | ToolDetail | About | Contact | Legal |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                       Component & Interaction Layer                         |  |
|  |   SearchTools | ToolCard | ToolGrid | CategoryCard | Breadcrumb | Modal     |  |
|  |   Button | Input | Toast | EmptyState | LoadingState | ErrorState           |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                       Core Routing & State Management                       |  |
|  |   RouterContext (HTML5 History API) | ToastContext | ErrorBoundary          |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                          Data & Utility Registry                            |  |
|  |   tools.ts (20 Tools Config) | seo.ts (Dynamic Metadata) | IconResolver     |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture

- **Framework**: React 19 (`react`, `react-dom`) with functional components and React hooks.
- **Language**: TypeScript (`strict` type-checking enabled, ES2022 target).
- **Build System**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`.
- **Styling**: Tailwind CSS v4 using modern `@import "tailwindcss";` with custom layers for typography and focus styling in `src/index.css`.
- **Icons**: Lucide React (`lucide-react`) dynamically resolved via `IconResolver.tsx`.
- **Motion**: Motion (`motion`) installed for smooth UI transitions.

---

## 3. Routing Architecture

The application uses a custom typed HTML5 History routing engine located in `src/router/Router.tsx`.

### Key Features:
- **`RouterProvider`**: Manages current path state synchronized with `window.location.pathname` and `window.location.search`.
- **`useRouter()`**: Hook exposing `currentPath`, `navigate(to, options)`, `params`, and `searchQuery`.
- **`<Link to="...">`**: Semantic anchor component that intercepts standard clicks to prevent full-page refreshes while respecting native browser behaviors (`Ctrl+Click`, middle-click, external URLs).
- **Dynamic Segment Resolution**: Parses `/tools/:slug` and extracts route parameters.
- **Scroll Restoration**: Automatically scrolls to top on route navigation.
- **Browser History Integration**: Binds to `popstate` events for native forward/back button support.

### Complete Route Table:
| Route | Component | Description | Status |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | Platform overview, search, featured tools, categories | IMPLEMENTED |
| `/tools` | `ToolsPage` | Complete directory of 20 tools with category filter tabs | IMPLEMENTED |
| `/categories` | `CategoriesIndexPage` | Categorized view of all suites with included tools | IMPLEMENTED |
| `/tools/finance` | `CategoryPage` | Finance category suite view (5 tools) | IMPLEMENTED |
| `/tools/student` | `CategoryPage` | Student category suite view (5 tools) | IMPLEMENTED |
| `/tools/documents` | `CategoryPage` | Document category suite view (5 tools) | IMPLEMENTED |
| `/tools/everyday` | `CategoryPage` | Everyday utilities suite view (5 tools) | IMPLEMENTED |
| `/tools/:slug` | `ToolDetailPage` | Architectural blueprint & specification for each tool | IMPLEMENTED |
| `/about` | `AboutPage` | Platform mission, story, and core principles | IMPLEMENTED |
| `/contact` | `ContactPage` | Working contact form with validation & toast feedback | IMPLEMENTED |
| `/legal/privacy` | `LegalPage` | Privacy Policy | IMPLEMENTED |
| `/legal/terms` | `LegalPage` | Terms of Service | IMPLEMENTED |
| `/legal/cookies` | `LegalPage` | Cookie Policy | IMPLEMENTED |
| `/legal/disclaimer` | `LegalPage` | Financial & Legal Disclaimer | IMPLEMENTED |
| `/support/report-problem` | `SupportPage` | Bug & discrepancy report form with validation | IMPLEMENTED |
| `/support/suggest-tool` | `SupportPage` | New tool request form with validation | IMPLEMENTED |
| `*` (Catch-all) | `NotFoundPage` | 404 handler with directory and home links | IMPLEMENTED |

---

## 4. Component Architecture

Components are organized strictly by single responsibility:

### Common Primitives (`src/components/common/`):
- `Button.tsx`: Accessible button supporting variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner, and icon slots.
- `Input.tsx`: Accessible input with label, validation error text, helper text, start icon, and end icon.
- `Modal.tsx`: Focus-trapped modal dialog with ESC key listener, backdrop blur, and ARIA attributes.
- `Toast.tsx`: Application-wide notification toast system via `ToastProvider` and `useToast()` hook.
- `Breadcrumb.tsx`: Semantic `<nav aria-label="Breadcrumb">` with Schema.org readiness and clean `/` dividers.
- `PageContainer.tsx`: Standardized container width (`max-w-7xl`, `max-w-4xl`, etc.) and padding constraints.
- `EmptyState.tsx`: Accessible empty result indicator with customizable action button.
- `LoadingState.tsx`: Accessible loading indicator with screen-reader text.
- `ErrorState.tsx`: User-friendly error message box with retry action and home navigation.
- `ErrorBoundary.tsx`: React error boundary catching rendering exceptions and preventing white-screen crashes.
- `IconResolver.tsx`: Centralized map matching Lucide icon names to React icon components safely.
- `ToolCard.tsx`: Display card for tools with unboxed metadata discipline, category link, description, and hover affordances.
- `ToolGrid.tsx`: Responsive 1-to-4 column grid wrapper with empty-state integration.
- `CategoryCard.tsx`: Navigation card for categories with tool count and description.
- `SearchTools.tsx`: Instant global search component supporting both inline search bar and `Cmd+K` / `Ctrl+K` modal dialog.

### Layout Components (`src/components/layout/`):
- `Header.tsx`: Responsive top bar adhering to Top Bar Contract (Wordmark, Nav Links, Search trigger with shortcut badge, Mobile hamburger drawer).
- `Footer.tsx`: Categorized footer with Tools, Company, Legal, Support links, and copyright text.

---

## 5. Tool Data Architecture

Centralized tool configuration lives in `src/data/tools.ts` and `src/types/tool.ts`.

### TypeScript Interface:
```typescript
export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: 'finance' | 'student' | 'documents' | 'everyday';
  description: string;
  icon: string;
  keywords: string[];
  status: 'planned' | 'in_development' | 'active';
  route: string;
  summary?: string;
  targetAudience?: string[];
  plannedFeatures?: string[];
  seoTitle?: string;
  seoDescription?: string;
}
```

### Search Engine:
`searchTools(query: string): ToolItem[]` executes a multi-attribute filter checking:
1. Exact and partial tool name
2. Slug identifiers
3. Category names
4. Rich keyword lists (e.g. "loan" matches EMI Calculator, "photo" matches Image Resizer/Compressor)
5. Descriptive text

---

## 6. Financial Calculation Engines & Formatting Architecture

Part 6 introduced pure, decoupled client-side calculation engines and currency formatters located in `src/utils/calculators/` and `src/utils/formatters/`:

### A. Centralized Currency Formatter (`src/utils/formatters/currency.ts`):
- **`formatINR(val, options)`**: Formats numbers according to standard Indian numbering rules (e.g., `1000000` -> `₹10,00,000`). Handles decimals, invalid inputs, and NaN cleanly without exceptions.
- **`formatINRCompact(val)`**: Converts large sums into readable denominations (`₹15 Lakh`, `₹1.25 Cr`).
- **`parseNumberInput(input, fallback)`**: Robust parser stripping currency symbols, commas, and invalid characters.

### B. Decoupled Calculation Engines:
1. **`calculateEmi(input)` (`emiCalculator.ts`)**:
   - Reduces balance interest: $EMI = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$.
   - Handles 0% interest loans ($EMI = P / n$), extreme values, and generates yearly amortization schedules.
2. **`calculateSip(input)` (`sipCalculator.ts`)**:
   - Monthly compounding annuity: $M = P \times \frac{(1+i)^n - 1}{i} \times (1+i)$.
   - Generates year-by-year principal vs. wealth gain tables.
3. **`calculateGst(input)` (`gstCalculator.ts`)**:
   - Computes both Add GST (exclusive) and Remove GST (inclusive).
   - Generates 50:50 intra-state CGST and SGST splits.
4. **`calculateSalary(input)` (`salaryCalculator.ts`)**:
   - Converts annual CTC into monthly in-hand take-home pay.
   - Computes EPF (12%), Professional Tax, and Income Tax under New (Section 115BAC with ₹75k standard deduction) and Old tax regimes for FY 2025-26 & 2026-27.
5. **`calculateFd(input)` (`fdCalculator.ts`)**:
   - Compound interest: $A = P \times (1 + \frac{r}{n})^{n \times t}$.
   - Supports Monthly ($n=12$), Quarterly ($n=4$), Half-Yearly ($n=2$), and Yearly ($n=1$) compounding intervals, plus Senior Citizen preferential bonuses (+0.50%).

### C. Student Calculation & Utility Engines (Part 7):
1. **`calculatePercentage(input)` (`percentageCalculator.ts`)**:
   - Multi-mode engine: `percent_of`, `what_percent`, `increase`, `decrease`.
   - Generates exact formula representations and step-by-step mathematical explanations.
2. **`calculateCgpa(input)` (`cgpaCalculator.ts`)**:
   - Credit-weighted mode: $\text{CGPA} = \frac{\sum(\text{Grade Point} \times \text{Credit})}{\sum\text{Credit}}$.
   - Simple unweighted average mode.
   - Configurable percentage conversion factor (default 9.5 for CBSE/AICTE).
3. **`calculateAge(input)` (`ageCalculator.ts`)**:
   - Exact calendar-aware chronological age: Years, Months, Days.
   - Handles leap years (Feb 29) and variable month lengths without simplistic 365-day approximations.
   - Calculates total days, total weeks, and next birthday countdown.
4. **`analyzeText(text)` (`wordCounter.ts`)**:
   - Unicode-aware text analysis supporting Indian scripts (Hindi, Bengali, Assamese, etc.) and English.
   - Computes words, characters with/without spaces, sentences, paragraphs, and reading/speaking times.
5. **Study Timer State Architecture (`StudyTimerComponent.tsx`)**:
   - Time-based monotonic synchronization against wall-clock timestamps (`Date.now() + remainingMs`).
   - Completely immune to background tab throttling or OS sleep intervals.
   - Synthesizes notification chimes via Web Audio API with zero external media files.

### D. Automated Testing Suites:
- `src/utils/calculators/runTests.ts`: 43 assertions for Finance calculations.
- `src/utils/calculators/runStudentTests.ts`: 31 assertions for Student calculations.
- Total 74 automated unit tests verifying calculations.

---

## 7. SEO & Metadata Architecture

Implemented in `src/utils/seo.ts`:
- **`updateSeoMetadata(config)`**: Dynamically sets `document.title`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`), and Twitter summary card tags upon route changes.

---

## 7. Backend & Server Architecture

- **Current Status**: **PLANNED — NOT IMPLEMENTED**
- The application currently runs as a 100% static client-side single page app. A Node.js / Express proxy file is present in `package.json` for optional server-side routing, but no active backend API endpoints are deployed or required for the Part 1/2 foundation.

---

## 8. Authentication Architecture

- **Current Status**: **PLANNED — NOT IMPLEMENTED**
- No user accounts, credentials, or session cookies are currently collected or active. Future authentication will be integrated client-side using Google OAuth / Firebase Auth without exposing client secrets.

---

## 9. Database Architecture

- **Current Status**: **PLANNED — NOT IMPLEMENTED**
- No database is connected. All platform metadata (tools, categories, legal text) is statically bundled with the client application. Future user state (saved calculations, favorites) will first use browser `localStorage`, with optional cloud database persistence added in future milestones.

---

## 10. File-Processing & Document Architecture (Part 8)

- **Status**: **IMPLEMENTED**
- All 5 document and image tools (`jpg-to-pdf`, `pdf-to-jpg`, `pdf-compressor`, `image-compressor`, `image-resizer`) run 100% client-side:
  - PDF Generation via `pdf-lib` without server uploads.
  - PDF Rasterization to JPG via `pdfjs-dist` and HTML5 Canvas.
  - PDF Compression via object stream compaction and xref table deduplication.
  - Image Compression and Resampling via Canvas 2D bilinear scaling targeting Indian Sarkari exam limits (<20 KB, <50 KB, UPSC 350x350, SSC 200x230).

---

## 11. Everyday Tools Processing Architecture (Part 9)

- **Status**: **IMPLEMENTED**
- All 5 everyday tools run 100% locally in browser memory:
  - **QR Code Generator (`src/utils/calculators/qrGenerator.ts`, `src/components/calculators/everyday/QrGeneratorComponent.tsx`)**: In-browser Canvas and SVG generation with strict URL validation blocking `javascript:`, `data:`, `vbscript:` schemes. Formats structured Wi-Fi (WPA/WEP/nopass with escaping), mailto, and tel protocols.
  - **Password Generator (`src/utils/calculators/passwordGenerator.ts`, `src/components/calculators/everyday/PasswordGeneratorComponent.tsx`)**: Cryptographically secure pseudorandom generation via Web Crypto API (`crypto.getRandomValues`) with unbiased rejection sampling. Shannon entropy bit score evaluation with descriptive strength ratings (no fake guarantees). Zero network transmission or local retention.
  - **Unit Converter (`src/utils/converters/unitConverter.ts`, `src/components/calculators/everyday/UnitConverterComponent.tsx`)**: Reusable conversion engine across 7 categories (Length, Weight, Temperature, Area, Volume, Time, Speed) using unified base SI units and non-linear thermodynamic formulas for Fahrenheit/Celsius/Kelvin. Calibrated traditional Indian land measurements (Gaj, Bigha, Guntha, Ground, Marla, Kanal).
  - **Date Difference Calculator (`src/utils/calculators/dateDifference.ts`, `src/components/calculators/everyday/DateDifferenceComponent.tsx`)**: Calendar-aware Gregorian span engine handling 28/29/30/31-day months and leap years. Calculates exact Years/Months/Days, total days (inclusive/exclusive), and Monday-to-Friday working business days.
  - **BMI Calculator (`src/utils/calculators/bmiCalculator.ts`, `src/components/calculators/everyday/BmiCalculatorComponent.tsx`)**: Metric and Imperial height/weight calculations with dual evaluation: WHO International standards and Asian-Indian consensus thresholds (Overweight ≥23, Obese ≥25). Non-diagnostic adult health disclaimers.
- **Automated Test Suite**: `src/utils/calculators/runEverydayTests.ts` (49 assertions). Total project unit tests: 135 assertions.

---

## 12. Admin Architecture

- **Current Status**: **PLANNED — NOT IMPLEMENTED**
- No admin portal or administrative API routes exist at this stage.

---

## 12. Security Boundaries

- **Zero Remote Document Transmission**: Personal photos, certificates, and financial figures remain strictly within browser memory.
- **Client Input Validation**: Contact and support forms enforce email regex and minimum length constraints before submission.
- **Zero Hardcoded Secrets**: No API keys, credentials, or private tokens exist in frontend code.
- **No Unsafe HTML Injection**: All user-controlled text is rendered via React JSX safely escaping cross-site scripting (XSS) vectors.
- **Information Disclosure Prevention**: Error boundaries and error states hide stack traces and server internals from users.

---

## 13. Deployment Architecture

- **Build Target**: Static distribution bundle generated via `npm run build` (`dist/`).
- **Static Assets**: Bundled and hashed by Vite with code-splitting.
- **Hosting Environment**: Google Cloud Run / Containerized Node.js service running Vite static file preview or Express middleware.

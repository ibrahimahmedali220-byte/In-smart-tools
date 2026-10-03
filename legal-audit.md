# Legal, Privacy, Consent & Data Governance Audit

## India Smart Tools

**Audit Date:** October 2026  
**Status:** Complete & Synchronized with Active Codebase  
**Governing Standard:** Factual transparency, privacy-by-design, data minimization, and neutral legal phrasing.  
**Critical Notice:** LEGAL REVIEW RECOMMENDED — This document and associated legal policies reflect the technical architecture of India Smart Tools. We do not claim "100% legal compliance" or make unsupported legal guarantees without independent legal verification.

---

## 1. Executive Summary & Codebase Audit

Before drafting legal and privacy documentation, a thorough inspection of the repository was conducted. India Smart Tools is built as a client-first, privacy-conscious Single Page Application (SPA). Calculations and file transformations execute strictly on the client device.

| Evaluated System / Feature | Current Implementation Status | Privacy & Legal Implication |
| :--- | :--- | :--- |
| **User Accounts / Authentication** | **NOT IMPLEMENTED** | No account credentials, passwords, or user profiles are collected or stored. |
| **User Login / Registration** | **NOT IMPLEMENTED** | Users access all 20 tools instantly without creating accounts. |
| **Payment Gateways / Subscriptions** | **NOT IMPLEMENTED** | The platform is 100% free. No credit card, UPI payment, or billing processing exists. |
| **Database Storage (Server-Side)** | **NOT IMPLEMENTED** | Calculation inputs, images, and documents are not persisted in any remote database. |
| **HTTP Cookies** | **NOT USED** | The platform sets zero HTTP cookies (no tracking, session, or advertising cookies). |
| **Local Storage / Session Storage** | **STRICTLY NECESSARY ONLY** | `sessionStorage` is used strictly to enforce client-side submission cooldown timestamps (5-second throttle) to mitigate form spam. `localStorage` is used to store optional cookie consent preferences if adjusted. |
| **Third-Party Advertising / Ad Pixels** | **NOT IMPLEMENTED** | Zero ad networks, retargeting scripts, or social tracking pixels. |
| **Third-Party Web Analytics** | **NOT IMPLEMENTED** | Zero external analytics scripts (e.g. Google Analytics, Mixpanel, Hotjar) are loaded. |
| **Third-Party Embeds** | **NONE** | Zero embedded YouTube players, Instagram widgets, Google Maps iframes, or social feeds. |
| **Third-Party Static Assets** | **Google Fonts CDN** | Loads "Plus Jakarta Sans" web typography from `fonts.googleapis.com` / `fonts.gstatic.com`. No user calculation data or cookies are shared with Google. |
| **External APIs / AI APIs** | **NOT LOADED ON CLIENT** | All calculations run through local algorithmic functions. Server proxy capability is declared for future backend extensions but inactive for client tools. |
| **Communication Forms** | **IMPLEMENTED** | Contact (`/contact`), Bug Report (`/support/report-problem`), and Tool Suggestion (`/support/suggest-tool`) collect minimal user-provided text for feedback. Submissions are processed without public database exposure. |

---

## 2. Public Legal Pages Created

The following public legal pages have been implemented with dedicated canonical routing, breadcrumbs, structured metadata, and responsive typography:

| Canonical Route | Page Title | Primary Legal Function |
| :--- | :--- | :--- |
| `/privacy-policy` | Privacy Policy | Explains client-side calculation execution, non-collection of sensitive data, form processing, and user rights. |
| `/terms` | Terms of Service | Outlines acceptable use, anti-scraping rules, informational utility license, calculation accuracy limitations, and limitation of liability. |
| `/cookie-policy` | Cookie Policy | Factual disclosure of browser storage usage, absence of tracking cookies, and an interactive Cookie Preference Manager. |
| `/disclaimer` | Disclaimer | Specific disclaimers for financial simulators (EMI, SIP, GST, Salary), academic grading formulas, government exam presets, and health utilities. |
| `/refund-policy` | Refund Policy | Explicitly marked as **NOT CURRENTLY APPLICABLE — ALL TOOLS ARE 100% FREE**, explaining that no payments or fees are collected. |
| `/contact` | Contact Us | Minimalist, validated communication channel for technical inquiries, bug reports, and data privacy requests. |

*Note: Backward-compatible aliases `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/legal/disclaimer`, and `/legal/refund` are also supported in the router.*

---

## 3. Data Minimization & Privacy-by-Design Verification

Under privacy-by-design principles, India Smart Tools collects only data that is genuinely required to deliver each specific function:

1. **Calculators & Document Converters**:
   - Computations happen entirely inside browser runtime memory (`window`, `HTML5 Canvas`, `Web Crypto API`).
   - Loan figures, salary structures, exam marks, photos, and signatures are never sent across the network.
   - All runtime variables are purged upon tab refresh or window closure.

2. **Contact Form (`/contact`)**:
   - **Name**: Marked explicitly as *(Optional)*. Used only to address the sender politely.
   - **Email**: Required only to enable a reply to the inquiry.
   - **Subject**: Marked explicitly as *(Optional)*.
   - **Message**: Required (minimum 15 characters, maximum 5,000 characters).
   - **Consent**: Unbundled, unchecked-by-default consent checkbox explicitly requiring opt-in before dispatch.
   - **Transparency**: Data minimization notice displayed below the form stating that data is not shared, sold, or used for marketing.

3. **Support Forms (`/support/report-problem`, `/support/suggest-tool`)**:
   - **Name**: Fully optional (anonymous reports are explicitly supported and welcomed).
   - **Email**: Fully optional (only needed if the user requests follow-up).
   - **Device / Browser**: Fully optional.
   - **Consent**: Explicit opt-in checkbox confirming user permission for engineering review.

---

## 4. Privacy Contact & Request Handling

- **No Invented Identities**: The platform does not invent corporate entities, fake registration numbers, or unverified physical addresses.
- **Configurable Contact Identifier**: The privacy contact is managed via the environment variable `VITE_PRIVACY_EMAIL`, falling back to:
  `privacy@smartlytools.vercel.app (Configured Contact Inbox)`
- **User Privacy Inquiries**:
  - Because calculation data is processed in browser memory and not stored on servers, there is no remote calculation history to export or delete.
  - If a user submits a contact form and requests deletion of their email correspondence, instructions on directing their request to the privacy contact are provided.

---

## 5. Cookie Consent & Browser Storage Architecture

1. **Current Reality**:
   - India Smart Tools does not deploy tracking, advertising, or cross-site cookies.
   - A fake, annoying banner was avoided in accordance with user guidelines because the site currently uses strictly necessary technical storage only (`sessionStorage` for form rate-limiting).
2. **Prepared Architecture (`src/utils/cookieConsent.ts`)**:
   - Implemented a structured `ConsentPreferences` system:
     - `necessary`: Always `true` (technical rate-limiting and security).
     - `preferences`: `false` by default (for future layout/theme preferences).
     - `analytics`: `false` by default (for future anonymous traffic analytics).
   - Provides functions `getConsentPreferences()`, `setConsentPreferences()`, `hasConsentFor()`, and `resetConsentPreferences()`.
3. **Interactive Preference Center**:
   - An interactive Cookie Preference Manager is directly embedded on `/cookie-policy`, enabling users to inspect storage categories, toggle future preferences, save them, or reset to defaults at any time.

---

## 6. Third-Party Service Auditing

| Service / Domain | Purpose | Data Transmitted | Cookie / Storage Usage | Privacy Safeguards |
| :--- | :--- | :--- | :--- | :--- |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | Web typography (`Plus Jakarta Sans`) | Standard HTTP request headers (IP address, User-Agent) necessary to deliver font files. | None. Google Fonts does not set cookies. | Font files are cached locally by the browser. No personal calculation data is shared. |
| **External Examination Links** (e.g. UPSC, SSC, CBSE) | Informational convenience for government job applicants | Standard browser navigation | Out of scope (third-party domains). | Outbound links open with `rel="noopener noreferrer"` to prevent reverse tabnabbing. |

---

## 7. Disclaimers & Professional Advice Boundaries

The Disclaimer page (`/disclaimer`) explicitly addresses the limitations of online utility tools:

- **Financial Tools (EMI, SIP, GST, Salary, FD)**: Educational calculators only. Not certified tax, legal, or investment advice. Users must consult a Certified Financial Planner (CFP) or Chartered Accountant (CA).
- **Academic Tools (Percentage, CGPA, Age)**: Based on common guidelines (e.g., CBSE 9.5x formula), but autonomous colleges and recruitment boards retain authority to use distinct conversion tables.
- **Document Tools (JPG to PDF, Image Compressor, Resizer)**: Presets are calibrated to official portal brochures (e.g. UPSC, SSC), but official parameters may change. Users must verify files prior to final application submission.
- **Health Tools (BMI Calculator)**: Based on WHO and Asian-Indian cutoffs for statistical reference. Not a medical diagnosis or treatment plan.

---

## 8. Remaining Production Configuration Requirements

Prior to launching on a custom production domain:
1. **Set Environment Variables**:
   - `VITE_PRIVACY_EMAIL`: Set to the real monitored privacy mailbox (e.g. `privacy@yourdomain.com`).
   - `VITE_CONTACT_EMAIL`: Set to the real customer support inbox.
   - `VITE_SITE_URL`: Set to the canonical production URL (e.g. `https://yourdomain.com`).
2. **Formal Legal Review**:
   - Engage qualified Indian legal counsel to review the terms and policies against the final corporate identity and any future monetization or user account features.

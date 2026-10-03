import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../../utils/seo';
import {
  getConsentPreferences,
  setConsentPreferences,
  resetConsentPreferences,
  ConsentPreferences
} from '../../utils/cookieConsent';
import { useToast } from '../../components/common/Toast';
import { ShieldCheck, Info, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'cookies' | 'disclaimer' | 'refund';

interface LegalDocConfig {
  title: string;
  slug: string;
  lastUpdated: string;
  description: string;
  notice?: string;
  sections: { title: string; content: string[] }[];
}

const PRIVACY_CONTACT_EMAIL = import.meta.env.VITE_PRIVACY_EMAIL || 'privacy@indiasmarttools.in (Configured Contact Inbox)';

const LEGAL_DOCS: Record<LegalDocType, LegalDocConfig> = {
  privacy: {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    lastUpdated: 'October 2026',
    description: 'A transparent, factual breakdown of how India Smart Tools processes user calculations, browser storage, and communication data.',
    notice: 'LEGAL REVIEW RECOMMENDED — This document describes the actual technical architecture of India Smart Tools. We do not claim 100% legal compliance with any specific regional law without formal legal verification.',
    sections: [
      {
        title: '1. Architecture & Privacy by Design',
        content: [
          'India Smart Tools is engineered around a client-first, privacy-by-design model. Every utility, calculator, and converter on this platform operates 100% locally within your browser runtime using standard Web APIs (HTML5, Canvas, Web Crypto, and local JavaScript).',
          'Your calculations, document uploads, marks percentages, loan figures, and images are NEVER transmitted to or stored on any remote server. When you close or refresh your browser tab, all calculation inputs held in runtime memory are discarded.'
        ]
      },
      {
        title: '2. Information We Do Not Collect',
        content: [
          'Because our computational architecture is client-side, we do not collect, view, or record:',
          '• Personal financial data: Salary figures, loan balances, bank details, SIP contribution amounts, or GST numbers.',
          '• Personal academic records: Roll numbers, marks, exam scores, CGPA, or student identifiers.',
          '• Personal identity documents: Aadhaar numbers, PAN numbers, passport photos, or signature scans uploaded to image or PDF tools.',
          '• Account credentials: India Smart Tools requires no registration, password creation, or user login.'
        ]
      },
      {
        title: '3. Data Collected Through Communication Forms',
        content: [
          'If you voluntarily contact us via our Contact, Bug Report, or Tool Suggestion forms, we collect only the minimal information required to assist you:',
          '• Name (Optional): Used solely to address you politely in communications.',
          '• Email address: Required only if you request a direct reply to your inquiry.',
          '• Message and problem description: Details of your inquiry or bug reproduction steps.',
          'Data Minimization Notice: Form communications are never stored in a public database, never sold to third-party data brokers, and never used for advertising, newsletter marketing, or behavioral profiling.'
        ]
      },
      {
        title: '4. Browser Storage & Cookies',
        content: [
          'India Smart Tools does NOT use tracking cookies, advertising pixels, or cross-site fingerprinting technologies.',
          'We use strictly necessary technical sessionStorage only to enforce client-side rate-limiting cooldown timestamps (e.g. 5-second throttle between form submissions) to protect our forms against automated spamming.',
          'For complete details, please consult our Cookie Policy.'
        ]
      },
      {
        title: '5. Third-Party Services & Assets',
        content: [
          '• Web Typography: We load the open-source "Plus Jakarta Sans" font from Google Fonts (fonts.googleapis.com / fonts.gstatic.com). This is an essential static resource; no user calculation data or cookies are shared with Google.',
          '• External Links: We provide links to official Indian examination portals (e.g., UPSC, SSC, CBSE) and government bodies. We are not responsible for the privacy practices of external third-party portals.'
        ]
      },
      {
        title: '6. Children and Minors',
        content: [
          'India Smart Tools provides educational, student, and everyday calculators for general users. We do not knowingly solicit, collect, or retain personal information from minors under 18 years of age.'
        ]
      },
      {
        title: '7. User Rights: Data Access, Deletion & Privacy Inquiries',
        content: [
          'Because all tool calculations take place entirely in your local browser and are not saved on a server, there is no remote calculation history or account data to retrieve or delete.',
          'If you have submitted a communication form and wish to request the removal of your correspondence, please direct your request to our designated privacy contact placeholder below.',
          `Privacy Contact: ${PRIVACY_CONTACT_EMAIL}`
        ]
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    slug: 'terms',
    lastUpdated: 'October 2026',
    description: 'Terms and conditions governing the informational and educational use of India Smart Tools.',
    notice: 'LEGAL REVIEW RECOMMENDED — These terms govern access and use of the platform based on its current free informational functionality.',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: [
          'By accessing or using India Smart Tools ("the Platform"), you acknowledge and agree to these Terms of Service. If you do not agree with any part of these terms, please do not use the Platform.'
        ]
      },
      {
        title: '2. Free Informational License',
        content: [
          'All tools, calculators, converters, and informational resources on the Platform are provided free of charge for personal, academic, and non-commercial educational use.',
          'You are granted a revocable, non-exclusive, and non-transferable license to utilize the tools in accordance with these Terms.'
        ]
      },
      {
        title: '3. Acceptable Use and Prohibited Misuse',
        content: [
          'You agree to use the Platform in a lawful, ethical, and responsible manner. You agree NOT to:',
          '• Deploy automated web scrapers, bots, or denial-of-service scripts against the Platform.',
          '• Interfere with or attempt to compromise the integrity or security of the Platform infrastructure.',
          '• Misrepresent results obtained from the Platform as official government certifications or certified financial advice.',
          '• Reverse-engineer or repurpose proprietary brand assets, documentation, or code without prior permission.'
        ]
      },
      {
        title: '4. Limitation of Calculations & Educational Nature',
        content: [
          'Mathematical calculations (including loan EMIs, mutual fund SIP projections, tax calculations, and academic conversions) are provided as mathematical approximations for educational and planning purposes only.',
          'Official institutions, banks, universities, and recruitment boards may use specific proprietary rounding, surcharge tables, or cutoff criteria. Always verify critical results directly with the relevant official authority.'
        ]
      },
      {
        title: '5. Intellectual Property',
        content: [
          'The design, brand identity, logos, code architecture, and original content of India Smart Tools are the property of the Platform and are protected by applicable intellectual property laws.'
        ]
      },
      {
        title: '6. Disclaimer of Warranties & Limitation of Liability',
        content: [
          'The Platform is provided strictly on an "as is" and "as available" basis without warranties of any kind, whether express or implied.',
          'To the fullest extent permitted by applicable law, India Smart Tools and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of or inability to use the Platform or reliance on calculation outputs.'
        ]
      },
      {
        title: '7. Inquiries & Legal Notices',
        content: [
          `For formal notices, intellectual property inquiries, or terms questions, please reach out to our designated contact configuration: ${PRIVACY_CONTACT_EMAIL}`
        ]
      }
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    lastUpdated: 'October 2026',
    description: 'Clear details on our minimal technical storage and cookie consent architecture.',
    sections: [
      {
        title: '1. What Are Cookies and Local Storage?',
        content: [
          'Cookies and web storage (localStorage and sessionStorage) are standard browser features allowing websites to retain technical state or preferences locally on your computer or mobile device.'
        ]
      },
      {
        title: '2. Actual Storage Technology Used by India Smart Tools',
        content: [
          'India Smart Tools follows strict data minimization principles. Currently:',
          '• We do NOT deploy HTTP cookies.',
          '• We do NOT deploy advertising cookies, marketing tracking pixels, or cross-site profiling tags.',
          '• We do NOT load third-party analytics trackers.',
          '• Strictly Necessary Session Storage: We use technical sessionStorage solely to maintain a temporary rate-limiting timestamp (5-second throttle) to prevent automated form submission flooding.'
        ]
      },
      {
        title: '3. Categories of Browser Storage',
        content: [
          '• Strictly Necessary (Active): Required for basic platform security, technical rate-limiting, and error-handling. Cannot be disabled without breaking website functionality.',
          '• Preference Storage (Inactive / Future): Would retain user preferences such as dark mode or recent tool shortcuts. Not currently active.',
          '• Analytics Cookies (Inactive / Future): Would measure anonymous page-view statistics to guide tool development. Not currently active. Will require explicit user consent if introduced.'
        ]
      },
      {
        title: '4. How to Manage or Clear Browser Storage',
        content: [
          'You can clear cookies and site data at any time via your browser settings:',
          '• Google Chrome: Settings > Privacy and security > Clear browsing data > Cookies and other site data.',
          '• Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data > Clear Data.',
          '• Apple Safari: Settings > Safari > Advanced > Website Data > Remove All Website Data.'
        ]
      }
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    slug: 'disclaimer',
    lastUpdated: 'October 2026',
    description: 'Important legal disclaimers regarding calculator outputs, academic formulas, government guidelines, and health utilities.',
    notice: 'LEGAL REVIEW RECOMMENDED — Please read this disclaimer carefully before relying on any calculation outputs or guidance.',
    sections: [
      {
        title: '1. Financial and Tax Calculators (EMI, SIP, GST, Salary, FD)',
        content: [
          'Financial tools provided on India Smart Tools (including the EMI Calculator, SIP Calculator, GST Calculator, Salary Calculator, and Fixed Deposit Calculator) are mathematical simulation engines intended strictly for general educational and informational purposes.',
          'They do NOT constitute certified financial, tax, accounting, or legal advice.',
          'Tax laws, rebate rules (e.g. Section 87A), compounding frequencies, and bank lending rates in India are subject to legislative amendments and institutional discretion. Always consult a qualified Chartered Accountant (CA) or SEBI-registered Investment Advisor before making significant financial commitments.'
        ]
      },
      {
        title: '2. Academic and Examination Calculators (Percentage, CGPA, Age)',
        content: [
          'Our CGPA-to-Percentage converter uses the widely recognized CBSE formula (CGPA × 9.5). However, different autonomous colleges, state universities (such as VTU, Mumbai University, or AKTU), and recruitment commissions may maintain distinct official grading ordinances or conversion tables.',
          'Age calculators calculate chronological age as on a cutoff date, but applicants must cross-check specific notification age relaxation rules (such as category-based cutoffs) in the official gazette.'
        ]
      },
      {
        title: '3. Document and Image Tools (JPG to PDF, Image Compressor, Resizer)',
        content: [
          'Presets for photo and signature dimensions (e.g., UPSC 350×350 px, SSC 200×230 px, <20 KB or <50 KB size limits) are calibrated based on publicly available portal brochures.',
          'Government exam boards frequently update their server upload parameters without advance notice. You must independently inspect your output files against the official instruction manual before final form fee payment.'
        ]
      },
      {
        title: '4. Health and Fitness Utilities (BMI Calculator)',
        content: [
          'The BMI Calculator uses standard World Health Organization (WHO) and Asian-Indian population cutoffs for general reference. It is NOT a medical diagnosis, clinical evaluation, or personalized treatment plan. Consult a qualified medical practitioner for health advice.'
        ]
      },
      {
        title: '5. No Warranty & Limitation of Liability',
        content: [
          'India Smart Tools does not warrant the completeness, accuracy, or reliability of tool outputs. Under no circumstances will India Smart Tools or its creators be liable for missed recruitment deadlines, loan interest variations, tax penalties, or any loss resulting from reliance on this platform.'
        ]
      }
    ]
  },
  refund: {
    title: 'Refund Policy',
    slug: 'refund-policy',
    lastUpdated: 'October 2026',
    description: 'Information regarding payment processing and refund eligibility on India Smart Tools.',
    notice: 'STATUS: NOT CURRENTLY APPLICABLE — ALL TOOLS ARE 100% FREE',
    sections: [
      {
        title: '1. Completely Free Utility Platform',
        content: [
          'India Smart Tools is currently a 100% free online utility platform. We do not sell physical goods, software licenses, paid subscriptions, or premium memberships.',
          'We do not operate any payment gateways, credit card processing, UPI payment collections, or bank transfers on this website.'
        ]
      },
      {
        title: '2. Non-Applicability of Refunds',
        content: [
          'Because no monetary transactions or charges occur on India Smart Tools, refunds and cancellations are NOT CURRENTLY APPLICABLE.',
          'You will never be asked for credit card numbers, debit card PINs, UPI OTPs, or bank account credentials on this platform.'
        ]
      },
      {
        title: '3. Future Paid or Premium Features',
        content: [
          'If paid products, batch processing capabilities, or premium features are introduced in future iterations of India Smart Tools, this Refund Policy will be updated prior to launch to clearly outline:',
          '• Authorized payment providers (e.g. Razorpay, Stripe, or UPI).',
          '• Eligible refund conditions and statutory cancellation windows.',
          '• Step-by-step refund submission procedures.',
          '• Customer support contact details for payment disputes.'
        ]
      }
    ]
  }
};

export interface LegalPageProps {
  type: LegalDocType;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const doc = LEGAL_DOCS[type];
  const { showToast } = useToast();

  // Cookie preferences state for Cookie Policy interactive manager
  const [preferences, setPreferences] = useState<ConsentPreferences>(getConsentPreferences());
  const [hasSavedPrefs, setHasSavedPrefs] = useState(false);

  useEffect(() => {
    if (doc) {
      updateSeoMetadata({
        title: `${doc.title} – India Smart Tools`,
        description: doc.description,
        canonicalPath: `/${doc.slug}`,
        jsonLd: getBreadcrumbListSchema([
          { name: 'Home', item: '/' },
          { name: 'Legal', item: '/privacy-policy' },
          { name: doc.title, item: `/${doc.slug}` }
        ])
      });
    }
  }, [doc, type]);

  const handleSavePreferences = () => {
    setConsentPreferences(preferences);
    setHasSavedPrefs(true);
    showToast('Your privacy preferences have been saved.', 'success');
  };

  const handleResetPreferences = () => {
    resetConsentPreferences();
    setPreferences(getConsentPreferences());
    setHasSavedPrefs(false);
    showToast('Preferences reset to strictly necessary only.', 'info');
  };

  if (!doc) return null;

  return (
    <PageContainer maxWidth="4xl">
      <Breadcrumb
        items={[
          { label: 'Legal', href: '/privacy-policy' },
          { label: doc.title, href: `/${doc.slug}` }
        ]}
        className="mb-6"
      />

      <div className="space-y-8">
        {/* Document Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transparency & Legal Documentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {doc.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
            <span>Effective Date: {doc.lastUpdated}</span>
            <span aria-hidden="true">·</span>
            <span>Version 1.0</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 font-medium">India Smart Tools</span>
          </div>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
            {doc.description}
          </p>

          {/* Legal Review / Status Notice */}
          {doc.notice && (
            <div className="mt-4 p-3.5 bg-slate-100 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="leading-relaxed">
                {doc.notice}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Cookie Preference Center on Cookie Policy Page */}
        {type === 'cookies' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <ShieldCheck className="w-5 h-5 text-slate-800" aria-hidden="true" />
                <h2>Cookie & Browser Storage Preference Manager</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                You have full control over non-essential browser storage. Notice that non-essential trackers are disabled by default.
              </p>
            </div>

            <div className="space-y-4">
              {/* Strictly Necessary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      Strictly Necessary Storage
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      Always Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                    Used strictly for essential technical rate-limiting and CSRF/spam protection on forms. Cannot be disabled without compromising site reliability.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  aria-label="Strictly necessary storage always enabled"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-not-allowed opacity-60"
                />
              </div>

              {/* Preference Storage */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    User Interface Preferences
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                    Allows the browser to remember UI choices (such as preferred calculator presets or theme settings). Currently inactive.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="pref-storage-toggle"
                  checked={preferences.preferences}
                  onChange={e => setPreferences({ ...preferences, preferences: e.target.checked })}
                  aria-label="Enable user interface preferences storage"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
              </div>

              {/* Analytics Storage */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    Anonymous Usage Analytics
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                    Allows anonymous aggregation of popular tools to prioritize engineering features. India Smart Tools currently does not load any third-party analytics trackers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="analytics-storage-toggle"
                  checked={preferences.analytics}
                  onChange={e => setPreferences({ ...preferences, analytics: e.target.checked })}
                  aria-label="Enable anonymous usage analytics"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetPreferences}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset to Default
              </Button>
              <div className="flex items-center gap-2">
                {hasSavedPrefs && (
                  <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Document Sections */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 divide-y divide-slate-100">
          {doc.sections.map((section, idx) => (
            <div key={idx} className={idx === 0 ? 'pb-6' : 'py-6'}>
              <h2 className="text-base font-semibold text-slate-900 mb-3">
                {section.title}
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

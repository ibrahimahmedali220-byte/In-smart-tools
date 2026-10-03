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
import { ShieldCheck, Info, CheckCircle2, RotateCcw } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'cookies' | 'disclaimer' | 'refund';

interface LegalDocConfig {
  title: string;
  slug: string;
  lastUpdated: string;
  description: string;
  notice?: string;
  sections: { title: string; content: string[] }[];
}

const PRIVACY_CONTACT_EMAIL = import.meta.env.VITE_PRIVACY_EMAIL || 'privacy@smartlytools.vercel.app (Configured Contact Inbox)';

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
        title: '4. Browser Storage & Local Preferences',
        content: [
          'India Smart Tools does NOT use third-party tracking cookies, advertising pixels, or cross-site fingerprinting technologies.',
          'To provide a seamless, app-like Progressive Web App (PWA) experience, we use local browser storage (localStorage) strictly for three user-controlled preferences:',
          '1. Theme Preference (ist_theme): Stores your selected display theme (light, dark, or system).',
          '2. Favorite Tools (ist_favorites): Stores the string IDs of tools you have explicitly starred for quick access.',
          '3. Recent Tools History (ist_recent_tools): Stores the IDs and timestamps of up to 8 recently visited tools. Zero calculation inputs or files are ever stored.',
          'You can clear your history or favorites at any time directly within the application, or by clearing your browser cache.'
        ]
      },
      {
        title: '5. Progressive Web App (PWA) & Service Worker',
        content: [
          'Our service worker precaches public application assets (HTML, CSS, JavaScript, icons, web fonts) to allow offline functionality on supported devices.',
          'The service worker never caches sensitive data, passwords, uploaded files, or private calculations.'
        ]
      },
      {
        title: '6. Privacy Inquiries & Contact',
        content: [
          `If you have questions regarding data handling or wish to request clarification on any privacy practice, please reach out to our privacy contact inbox: ${PRIVACY_CONTACT_EMAIL}.`
        ]
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    slug: 'terms',
    lastUpdated: 'October 2026',
    description: 'General terms and conditions governing the use of India Smart Tools free online utilities.',
    notice: 'LEGAL REVIEW RECOMMENDED — These Terms of Service set forth reasonable usage standards for a free, public utility website.',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: [
          'By accessing and using India Smart Tools (smartlytools.vercel.app), you agree to be bound by these Terms of Service. If you do not agree with these terms, you should discontinue using the website.'
        ]
      },
      {
        title: '2. Free Educational & Utility Platform',
        content: [
          'India Smart Tools provides computational calculators, document utilities, and academic converters free of charge for personal, academic, and professional convenience.',
          'All tools are provided on an "as is" and "as available" basis without warranties of any kind.'
        ]
      },
      {
        title: '3. Computational Accuracy & Non-Professional Advice',
        content: [
          'Calculations produced by financial tools (EMI, SIP, GST, Salary, FD) are mathematical estimates intended for general informational guidance only. They do not constitute certified tax advice, legal opinion, or banking commitments.',
          'For formal loan agreements, tax filings, or audited financial statements, please consult qualified chartered accountants (CAs) or financial advisers.'
        ]
      },
      {
        title: '4. Acceptable Use',
        content: [
          'You agree not to misuse our services, attempt to disrupt infrastructure, reverse-engineer proprietary assets, or execute automated scraping that impairs performance for other Indian users.'
        ]
      }
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    lastUpdated: 'October 2026',
    description: 'Detailed information regarding browser storage, preferences, and cookie usage on India Smart Tools.',
    notice: 'LEGAL REVIEW RECOMMENDED — We do not use third-party tracking or advertising cookies.',
    sections: [
      {
        title: '1. What Are Cookies and Browser Storage?',
        content: [
          'Cookies and web storage (localStorage and sessionStorage) are small pieces of data stored on your device by your web browser to remember preferences and maintain site stability.'
        ]
      },
      {
        title: '2. How India Smart Tools Uses Storage',
        content: [
          '• Theme Preference (localStorage): Remembers whether you selected Light, Dark, or System mode.',
          '• Tool Preferences (localStorage): Remembers your starred favorite tools and up to 8 recently opened tools.',
          '• Rate Limiting (sessionStorage): Prevents spam on our contact forms.',
          '• Service Worker Cache: Stores application assets for offline use.'
        ]
      },
      {
        title: '3. Zero Third-Party Advertising Trackers',
        content: [
          'India Smart Tools does not deploy commercial marketing cookies, Facebook pixels, Google Ads trackers, or cross-site tracking beacons.'
        ]
      }
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    slug: 'disclaimer',
    lastUpdated: 'October 2026',
    description: 'General informational disclaimer for all calculation models, converters, and document processors.',
    notice: 'LEGAL REVIEW RECOMMENDED — Factual disclaimer of liability for mathematical approximations.',
    sections: [
      {
        title: '1. General Informational Notice',
        content: [
          'The content, tools, calculators, and documentation provided on India Smart Tools are for general informational, educational, and computational assistance only.'
        ]
      },
      {
        title: '2. Financial & Tax Calculations',
        content: [
          'Calculators for EMI, SIP, Fixed Deposits, GST, and In-Hand Salary use established mathematical equations and statutory tax slabs. Actual banking figures may vary due to discrete interest rounding, processing charges, or specific employer salary structures.'
        ]
      },
      {
        title: '3. Academic & Document Compliance',
        content: [
          'CGPA conversion factors and exam age eligibility criteria are based on standard Indian benchmarks (CBSE/AICTE/UPSC). Always verify final application criteria against official notification gazettes released by your target examining body.'
        ]
      }
    ]
  },
  refund: {
    title: 'Refund Policy',
    slug: 'refund-policy',
    lastUpdated: 'October 2026',
    description: 'Statement regarding payments and transactions on India Smart Tools.',
    sections: [
      {
        title: '1. 100% Free Platform Notice',
        content: [
          'All utilities, tools, and converters on India Smart Tools are completely free to use. We do not charge fees, require paid subscriptions, or process credit card payments.',
          'Because no monetary transactions occur on this platform, refunds are not applicable.'
        ]
      }
    ]
  }
};

export const LegalPage: React.FC<{ type: LegalDocType }> = ({ type }) => {
  const doc = LEGAL_DOCS[type] || LEGAL_DOCS.privacy;
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState<ConsentPreferences>(getConsentPreferences());
  const [hasSavedPrefs, setHasSavedPrefs] = useState(false);

  useEffect(() => {
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
  }, [doc]);

  const handleSavePreferences = () => {
    setConsentPreferences(preferences);
    setHasSavedPrefs(true);
    showToast('Cookie preferences updated successfully.', 'success');
    setTimeout(() => setHasSavedPrefs(false), 3000);
  };

  const handleResetPreferences = () => {
    const fresh = resetConsentPreferences();
    setPreferences(fresh);
    showToast('Preferences reset to default values.', 'info');
  };

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
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Legal Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            {doc.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>Effective Date: {doc.lastUpdated}</span>
            <span aria-hidden="true">·</span>
            <span>Version 1.0</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">India Smart Tools</span>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {doc.description}
          </p>

          {/* Legal Review / Status Notice */}
          {doc.notice && (
            <div className="mt-4 p-3.5 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4 text-slate-500 dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="leading-relaxed">
                {doc.notice}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Cookie Preference Center on Cookie Policy Page */}
        {type === 'cookies' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-base">
                <ShieldCheck className="w-5 h-5 text-slate-800 dark:text-sky-400" aria-hidden="true" />
                <h2>Cookie & Browser Storage Preference Manager</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have full control over non-essential browser storage. Notice that non-essential trackers are disabled by default.
              </p>
            </div>

            <div className="space-y-4">
              {/* Strictly Necessary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Strictly Necessary Storage
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Always Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                    Used strictly for essential technical rate-limiting, offline service worker caching, and CSRF/spam protection.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  aria-label="Strictly necessary storage always enabled"
                  className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-slate-900 cursor-not-allowed opacity-60"
                />
              </div>

              {/* Preference Storage */}
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    User Interface Preferences & Favorites
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                    Allows the browser to remember UI choices (such as dark/light mode preference, starred favorites, and recently used tools).
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="pref-storage-toggle"
                  checked={preferences.preferences}
                  onChange={e => setPreferences({ ...preferences, preferences: e.target.checked })}
                  aria-label="Enable user interface preferences storage"
                  className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-slate-900 dark:text-sky-500 focus:ring-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {doc.sections.map((section, idx) => (
            <div key={idx} className={idx === 0 ? 'pb-6' : 'py-6'}>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {section.title}
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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

import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { BackButton } from '../components/common/BackButton';
import { Link } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { Check, Shield, Zap, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateSeoMetadata({
      title: 'About Us – Smartly Tools',
      description: 'Learn about Smartly Tools: a fast, free, privacy-focused online utility platform created for everyday productivity.',
      canonicalPath: '/about',
      jsonLd: getBreadcrumbListSchema([
        { name: 'Home', item: '/' },
        { name: 'About', item: '/about' }
      ])
    });
  }, []);

  return (
    <PageContainer maxWidth="4xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Breadcrumb items={[{ label: 'About', href: '/about' }]} className="mb-0" />
        <BackButton fallbackUrl="/" label="Back to Home" />
      </div>

      <div className="space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            About Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            About Smartly Tools
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Smartly Tools is built on a simple conviction: essential everyday digital calculations, file formatting, QR generation, and academic tools should be fast, completely free, and respectful of user privacy.
          </p>
        </div>

        {/* Story & Context */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Smartly Tools Was Built
          </h2>
          <p>
            Whether a student preparing marks certificates, a job seeker resizing passport photos to strict limits for application portals, or a family planning a loan EMI, millions of users search for everyday utility tools every single day.
          </p>
          <p>
            Unfortunately, most existing utility websites are cluttered with intrusive pop-up ads, deceptive download buttons, slow server redirects, and questionable privacy policies that upload private files to unverified cloud servers.
          </p>
          <p>
            Smartly Tools replaces this chaos with a clean, fast, and secure digital utility suite that processes calculations and files directly on your device.
          </p>
        </div>

        {/* Guiding Principles */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-6">
            Our Core Principles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-sky-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Zero Server Uploads</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculations and image operations execute on your device in browser memory. We never receive or store your certificates or financial inputs.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-sky-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Zero Distractions</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No subscription paywalls, no forced account signups, no countdown timers, and no fake download traps.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-sky-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Offline & Accessible</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Installable Progressive Web App (PWA) with light and dark mode, optimized for high performance across all mobile and broadband networks worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Explore CTA */}
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-lg font-bold">Ready to try our tools?</h3>
            <p className="text-xs text-slate-300 mt-1">Explore our complete catalog of 20 fast online utilities.</p>
          </div>
          <Link
            to="/tools"
            className="px-5 py-2.5 bg-white text-slate-900 dark:bg-sky-400 dark:text-slate-950 rounded-xl font-semibold text-xs hover:bg-slate-100 dark:hover:bg-sky-300 transition-colors text-center shrink-0 min-h-[44px] flex items-center justify-center"
          >
            Browse All Tools →
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

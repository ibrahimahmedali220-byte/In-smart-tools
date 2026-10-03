import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Link } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { Check, Shield, Zap, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateSeoMetadata({
      title: 'About Us – India Smart Tools',
      description: 'Learn about India Smart Tools: a fast, free, privacy-focused online utility platform created for everyday users across India.',
      canonicalPath: '/about',
      jsonLd: getBreadcrumbListSchema([
        { name: 'Home', item: '/' },
        { name: 'About', item: '/about' }
      ])
    });
  }, []);

  return (
    <PageContainer maxWidth="4xl">
      <Breadcrumb items={[{ label: 'About', href: '/about' }]} className="mb-6" />

      <div className="space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            About Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
            About India Smart Tools
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            India Smart Tools is built on a simple conviction: essential everyday digital calculations, file formatting, and academic tools should be fast, completely free, and respectful of user privacy.
          </p>
        </div>

        {/* Story & Context */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 space-y-6 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Why India Smart Tools Was Built
          </h2>
          <p>
            Whether an engineering student preparing marks certificates for TCS or Infosys, a job seeker resizing passport photos to strict 20 KB limits for UPSC or SSC portals, or a family planning a home loan EMI, millions of Indians search for everyday utility tools every single day.
          </p>
          <p>
            Unfortunately, most existing utility websites are cluttered with intrusive pop-up ads, deceptive download buttons, slow server redirects, and questionable privacy policies that upload private certificates to unverified cloud servers.
          </p>
          <p>
            India Smart Tools replaces this chaos with a clean, fast, and secure digital utility suite designed specifically for Indian use cases.
          </p>
        </div>

        {/* Guiding Principles */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
            Our Core Principles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">High-Speed Performance</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Zero bloat. Instant page loads on 4G and 5G connections across India.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Privacy First</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Client-side document and image processing. Photos, marksheets, and signatures stay on your device.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Indian Standards</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Curated specifically for Indian tax slabs, bank compounding schedules, university grading formulas, and portal upload constraints.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Free & Transparent</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                No hidden subscription gates or artificial limitations on basic utilities.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <span>Have an idea or feedback to make the platform better?</span>
          <Link to="/contact" className="text-slate-900 font-semibold hover:underline">
            Get in touch with us →
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

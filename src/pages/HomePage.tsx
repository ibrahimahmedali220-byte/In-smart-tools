import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SearchTools } from '../components/common/SearchTools';
import { CategoryCard } from '../components/common/CategoryCard';
import { ToolCard } from '../components/common/ToolCard';
import { CATEGORIES, TOOLS } from '../data/tools';
import { Link } from '../router/Router';
import { updateSeoMetadata, getWebSiteSchema } from '../utils/seo';
import { ShieldCheck, Zap, Laptop, ArrowRight, Star } from 'lucide-react';
import { useUserPreferences } from '../hooks/useUserPreferences';

export const HomePage: React.FC = () => {
  const { favoriteTools, recentTools } = useUserPreferences();

  useEffect(() => {
    updateSeoMetadata({
      title: 'India Smart Tools – Simple Tools for Everyday India',
      description: 'An Indian all-in-one utility platform providing simple, fast and free online tools for students, job seekers, creators and everyday users.',
      canonicalPath: '/',
      jsonLd: getWebSiteSchema()
    });
  }, []);

  // Curate 6 high-utility tools across categories for featured showcase
  const featuredTools = TOOLS.filter(t =>
    ['emi-calculator', 'sip-calculator', 'jpg-to-pdf', 'percentage-calculator', 'age-calculator', 'qr-generator'].includes(t.slug)
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200/80 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 text-balance">
            Simple tools for everyday India.
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Fast, free, and privacy-conscious online utilities designed for students, job applicants, creators, and everyday productivity.
          </p>

          {/* Prominent Global Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto text-left shadow-sm rounded-xl">
            <SearchTools
              variant="inline"
              placeholder="Search by tool name or keyword (e.g. loan, photo, gst, age, qr)..."
            />
          </div>

          {/* Quick Category Jump Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="text-slate-400 font-medium">Quick categories:</span>
            {CATEGORIES.map(category => (
              <Link
                key={category.id}
                to={category.route}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors font-medium text-slate-700"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <PageContainer className="space-y-16 sm:space-y-20">
        
        {/* Section 1: Browse by Category */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Explore Tool Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Structured suites organized for your daily work and studies.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center text-xs font-semibold text-slate-800 hover:text-slate-950 gap-1 transition-colors"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(category => (
              <CategoryCard
                key={category.id}
                category={{
                  ...category,
                  toolCount: TOOLS.filter(t => t.category === category.id).length
                }}
              />
            ))}
          </div>
        </section>

        {/* Section 1.5: Quick Access (Shown only if user has favorites or recent tools) */}
        {(favoriteTools.length > 0 || recentTools.length > 0) && (
          <section className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Your Quick Access Tools
                </h2>
              </div>
              <Link
                to="/tools"
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
              >
                Manage in Directory →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(favoriteTools.length > 0 ? favoriteTools : recentTools).slice(0, 3).map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Featured Essential Tools */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Essential calculators, converters, and document utilities.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center text-xs font-semibold text-slate-800 hover:text-slate-950 gap-1 transition-colors"
            >
              <span>Browse all 20 tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Section 3: Architecture & Guarantees */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 md:p-12">
          <div className="max-w-2xl mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Designed for Speed, Simplicity & Privacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              India Smart Tools is engineered to solve everyday calculations and file operations without annoying sign-up walls, sluggish bloat, or data tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Instant Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean client-optimized algorithms guarantee calculation results and preview rendering without waiting for server round-trips.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Client-First Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your certificates, photographs, salaries, and sensitive inputs stay secure on your device. We never store personal documents.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Mobile-First Touch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tuned specifically for Indian 4G/5G mobile browsers, low-bandwidth connections, and touch interfaces.
              </p>
            </div>
          </div>
        </section>

      </PageContainer>
    </div>
  );
};

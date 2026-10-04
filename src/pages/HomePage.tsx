import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SearchTools } from '../components/common/SearchTools';
import { CategoryCard } from '../components/common/CategoryCard';
import { ToolCard } from '../components/common/ToolCard';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { CATEGORIES, TOOLS } from '../data/tools';
import { Link, useRouter } from '../router/Router';
import { updateSeoMetadata, getWebSiteSchema } from '../utils/seo';
import { ShieldCheck, Zap, Laptop, ArrowRight, Star, History, Trash2, Clock } from 'lucide-react';
import { useUserPreferences } from '../hooks/useUserPreferences';

export const HomePage: React.FC = () => {
  const { favoriteTools, recentTools, recentSearches, removeSearch, clearRecentSearches, clearRecentTools } = useUserPreferences();
  const { navigate } = useRouter();

  useEffect(() => {
    updateSeoMetadata({
      title: 'Smartly Tools – Simple, Fast & Free Online Utilities',
      description: 'Smartly Tools is a fast, free, and privacy-conscious online utility platform providing QR generator, PDF tools, student calculators, and financial tools.',
      canonicalPath: '/',
      jsonLd: getWebSiteSchema()
    });
  }, []);

  // Curate 6 high-utility tools with QR Generator & JPG to PDF at top followed by Finance
  const featuredTools = ['qr-generator', 'jpg-to-pdf', 'emi-calculator', 'sip-calculator', 'percentage-calculator', 'age-calculator']
    .map(slug => TOOLS.find(t => t.slug === slug))
    .filter(Boolean) as typeof TOOLS;

  // Strictly last 2 accessed tools for quick access
  const lastTwoRecentTools = recentTools.slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-slate-50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 pt-12 pb-16 md:pt-20 md:pb-24 transition-colors duration-150">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
            Simple tools for everyday India.
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Fast, free, and privacy-conscious online utilities designed for students, job applicants, creators, and everyday productivity.
          </p>

          {/* Prominent Global Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto text-left shadow-sm rounded-2xl">
            <SearchTools
              variant="inline"
              placeholder="Search by tool name or keyword (e.g. qr, pdf, loan, photo, gst)..."
            />
          </div>

          {/* User's Recent Search History Bar (Local Storage) */}
          {recentSearches.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 animate-in fade-in duration-150">
              <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" /> Recent searches:
              </span>
              {recentSearches.map(term => (
                <div
                  key={term}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shadow-2xs group"
                >
                  <Link
                    to={`/tools?q=${encodeURIComponent(term)}`}
                    className="font-medium hover:text-slate-950 dark:hover:text-white"
                  >
                    {term}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeSearch(term)}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 ml-0.5 cursor-pointer"
                    title={`Remove "${term}" from recent searches`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[11px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline ml-1 cursor-pointer"
                title="Clear all recent searches"
              >
                Clear
              </button>
            </div>
          )}

          {/* Quick Category Jump Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Quick categories:</span>
            {CATEGORIES.map(category => (
              <Link
                key={category.id}
                to={category.route}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors font-medium text-slate-700 dark:text-slate-300"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <PageContainer className="space-y-16 sm:space-y-20">
        
        {/* PWA Install Promo Card (suppresses automatically if installed or unsupported) */}
        <PWAInstallButton variant="card" />

        {/* Dedicated "Recently Used" Section (Stores last 2 accessed tools in localStorage) */}
        {lastTwoRecentTools.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Recently Used Tools
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your last {lastTwoRecentTools.length} accessed {lastTwoRecentTools.length === 1 ? 'tool' : 'tools'} stored locally for quick access.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearRecentTools}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear recently accessed tools history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
                <Link
                  to="/tools"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  All Tools →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
              {lastTwoRecentTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} isRecent={true} />
              ))}
            </div>
          </section>
        )}

        {/* Section 1: Featured Essential Tools (QR Code Generator & JPG to PDF at Top #1 and #2, above Categories) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Featured Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Top utilities including QR Code Generator, JPG to PDF, and financial calculators.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white gap-1 transition-colors"
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

        {/* Favorites Section (if user has favorites) */}
        {favoriteTools.length > 0 && (
          <section className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Your Starred Favorites
                </h2>
              </div>
              <Link
                to="/tools"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                Manage in Directory →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Browse by Category (Placed below Featured Tools) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Explore Tool Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Structured suites organized for your daily work and studies.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white gap-1 transition-colors"
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

        {/* Section 3: Architecture & Guarantees */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 md:p-12 transition-colors">
          <div className="max-w-2xl mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Designed for Speed, Simplicity & Privacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              India Smart Tools is engineered to solve everyday calculations and file operations without annoying sign-up walls, sluggish bloat, or data tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Instant Execution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Clean client-optimized algorithms guarantee calculation results and preview rendering without waiting for server round-trips.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Client-First Privacy</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your certificates, photographs, salaries, and sensitive inputs stay secure on your device. We never store personal documents.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-3">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Offline & Installable</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Works offline on mobile and desktop as a Progressive Web App (PWA) with zero internet requirement after caching.
              </p>
            </div>
          </div>
        </section>

      </PageContainer>
    </div>
  );
};

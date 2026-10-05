import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolCard } from '../components/common/ToolCard';
import { ToolGrid } from '../components/common/ToolGrid';
import { TOOLS, CATEGORIES, searchTools } from '../data/tools';
import { ToolCategory } from '../types/tool';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { Search, X, Star, History, Sparkles, RotateCcw } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { favoriteTools, recentTools, clearRecentTools } = useUserPreferences();

  useEffect(() => {
    updateSeoMetadata({
      title: 'All Tools – Free Online Utilities & Smart Digital Tools',
      description: 'Browse all free online calculators, academic tools, document converters, and everyday utilities on Smartly Tools.',
      canonicalPath: '/tools',
      jsonLd: getBreadcrumbListSchema([
        { name: 'Home', item: '/' },
        { name: 'Tools', item: '/tools' }
      ])
    });
  }, []);

  // Filtered & Ranked Tools via Deterministic Search Engine
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [selectedCategory, searchQuery]);

  // Curate 6 high-utility tools (QR Code & JPG to PDF first, followed by Finance)
  const featuredTools = useMemo(() => {
    return ['qr-generator', 'jpg-to-pdf', 'emi-calculator', 'sip-calculator', 'percentage-calculator', 'age-calculator']
      .map(slug => TOOLS.find(t => t.slug === slug))
      .filter(Boolean) as typeof TOOLS;
  }, []);

  const isFiltering = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Tools Directory
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Comprehensive suite of 20 online utilities across Finance, Academics, Documents, and Everyday Productivity. 100% free, private, and browser-executed.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        
        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
          role="tablist"
          aria-label="Tool Categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-sky-400 min-h-[36px] ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Tools ({TOOLS.length})
          </button>

          {CATEGORIES.map(cat => {
            const count = TOOLS.filter(t => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-sky-400 min-h-[36px] ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search Input with Accessible Clear Button */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value.slice(0, 100))}
            placeholder="Search tools by name or keyword..."
            aria-label="Search tools by name, description, or keyword"
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 focus:border-slate-900 dark:focus:border-sky-400 shadow-2xs transition-shadow min-h-[40px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* FILTERED VIEW: Displayed when search query or category filter is active */}
      {isFiltering ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100 font-bold">{filteredTools.length}</strong> matching{' '}
              {filteredTools.length === 1 ? 'tool' : 'tools'}
              {searchQuery ? ` for "${searchQuery}"` : ''}
              {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer min-h-[36px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No tools found matching &ldquo;{searchQuery}&rdquo;</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Try another keyword such as &ldquo;loan&rdquo;, &ldquo;pdf&rdquo;, &ldquo;photo&rdquo;, &ldquo;tax&rdquo;, or &ldquo;marks&rdquo;.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white dark:text-slate-950 rounded-xl text-xs font-semibold transition-colors min-h-[40px]"
                >
                  Clear search and view all tools
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* DEFAULT DIRECTORY VIEW: Organized Sections with User Favorites & Recents */
        <div className="space-y-12 sm:space-y-16">
          
          {/* 1. FAVORITES SECTION (Conditional) */}
          {favoriteTools.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Your Favorite Tools
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ({favoriteTools.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* 2. RECENTLY USED SECTION (Conditional) */}
          {recentTools.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Recently Used Tools
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ({recentTools.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearRecentTools}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors min-h-[36px] flex items-center"
                >
                  Clear History
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentTools.slice(0, 4).map(tool => (
                  <ToolCard key={tool.id} tool={tool} isRecent />
                ))}
              </div>
            </section>
          )}

          {/* 3. FEATURED / RECOMMENDED TOOLS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Featured Tools
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Popular everyday utilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* 4. COMPLETE ALL TOOLS DIRECTORY */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                All Tools
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {TOOLS.length} Tools Available
              </span>
            </div>

            <ToolGrid tools={TOOLS} />
          </section>

        </div>
      )}
    </PageContainer>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolCard } from '../components/common/ToolCard';
import { ToolGrid } from '../components/common/ToolGrid';
import { EmptyState } from '../components/common/EmptyState';
import { TOOLS, CATEGORIES, searchTools } from '../data/tools';
import { ToolCategory, ToolItem } from '../types/tool';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { Search, X, Star, History, Sparkles, Filter, RotateCcw } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { favoriteTools, recentTools, clearRecentTools } = useUserPreferences();

  useEffect(() => {
    updateSeoMetadata({
      title: 'All Tools – 20 Fast, Free Online Utilities',
      description: 'Browse all 20 free online calculators, academic tools, document converters, and everyday utilities on India Smart Tools.',
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

  // Curated Featured Tools (Neutral wording, zero fake statistics)
  const featuredTools = useMemo(() => {
    return TOOLS.filter(t =>
      ['emi-calculator', 'sip-calculator', 'jpg-to-pdf', 'percentage-calculator', 'age-calculator', 'qr-generator'].includes(t.slug)
    );
  }, []);

  const isFiltering = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Tools', href: '/tools' }]} className="mb-6" />

      {/* Page Header */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Tools Directory
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Comprehensive suite of 20 online utilities across Finance, Academics, Documents, and Everyday Productivity. 100% free, private, and browser-executed.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        
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
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search Input with Accessible Clear Button */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value.slice(0, 100))}
            placeholder="Search tools by name or keyword..."
            aria-label="Search tools by name, description, or keyword"
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-sm transition-shadow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
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
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredTools.length}</strong> matching{' '}
              {filteredTools.length === 1 ? 'tool' : 'tools'}
              {searchQuery ? ` for "${searchQuery}"` : ''}
              {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-950 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
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
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No tools found matching &ldquo;{searchQuery}&rdquo;</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try another keyword such as &ldquo;loan&rdquo;, &ldquo;pdf&rdquo;, &ldquo;photo&rdquo;, &ldquo;tax&rdquo;, or &ldquo;marks&rdquo;.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Your Favorite Tools
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Recently Used Tools
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    ({recentTools.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearRecentTools}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
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
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Featured Tools
                </h2>
              </div>
              <span className="text-xs text-slate-500">Popular everyday utilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* 4. COMPLETE ALL TOOLS DIRECTORY */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                All Tools
              </h2>
              <span className="text-xs text-slate-500 font-medium">
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

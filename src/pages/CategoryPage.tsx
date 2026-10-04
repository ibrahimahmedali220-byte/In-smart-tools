import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolGrid } from '../components/common/ToolGrid';
import { IconResolver } from '../components/common/IconResolver';
import { CATEGORIES, getCategoryById, getToolsByCategory, searchTools } from '../data/tools';
import { ToolCategory } from '../types/tool';
import { Link } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { NotFoundPage } from './NotFoundPage';
import { BackButton } from '../components/common/BackButton';
import { Search, X } from 'lucide-react';

export interface CategoryPageProps {
  categoryId: ToolCategory;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const category = getCategoryById(categoryId);
  const allCategoryTools = useMemo(() => getToolsByCategory(categoryId), [categoryId]);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!filterQuery.trim()) return allCategoryTools;
    return searchTools(filterQuery, categoryId);
  }, [allCategoryTools, filterQuery, categoryId]);

  useEffect(() => {
    if (category) {
      const breadcrumbs = [
        { name: 'Home', item: '/' },
        { name: 'Tools', item: '/tools' },
        { name: category.name, item: category.route }
      ];

      updateSeoMetadata({
        title: `${category.name} – Free Online Utilities`,
        description: category.description,
        canonicalPath: category.route,
        jsonLd: getBreadcrumbListSchema(breadcrumbs)
      });
    }
  }, [category]);

  if (!category) {
    return <NotFoundPage />;
  }

  const otherCategories = CATEGORIES.filter(c => c.id !== categoryId);

  return (
    <PageContainer>
      {/* Navigation Top Bar: Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Breadcrumb
          items={[
            { label: 'Tools', href: '/tools' },
            { label: category.name, href: category.route }
          ]}
          className="mb-0"
        />
        <BackButton fallbackUrl="/categories" label="Back to Categories" />
      </div>

      {/* Category Hero / Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 md:p-10 mb-8 shadow-sm transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <IconResolver name={category.icon} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Category Suite</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{allCategoryTools.length} Tools Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {category.description} All tools run 100% client-side in your browser for instant performance and absolute privacy.
            </p>
          </div>
        </div>

        {/* Quick jump to other categories */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Other categories:</span>
          {otherCategories.map(cat => (
            <Link
              key={cat.id}
              to={cat.route}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* In-category Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Tools in this Suite
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {filteredTools.length} of {allCategoryTools.length} {category.name.toLowerCase()}
          </p>
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value.slice(0, 50))}
            placeholder={`Search ${category.name.toLowerCase()}...`}
            aria-label={`Filter ${category.name} tools`}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 focus:border-slate-900 dark:focus:border-sky-400 shadow-2xs min-h-[36px]"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded min-h-[28px] min-w-[28px] flex items-center justify-center"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <ToolGrid
        tools={filteredTools}
        emptyTitle={`No ${category.name.toLowerCase()} found matching "${filterQuery}"`}
        emptyDescription="Try clearing your search term or exploring another category."
        onClearFilters={() => setFilterQuery('')}
      />
    </PageContainer>
  );
};

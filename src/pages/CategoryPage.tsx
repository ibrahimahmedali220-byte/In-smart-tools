import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolGrid } from '../components/common/ToolGrid';
import { IconResolver } from '../components/common/IconResolver';
import { CATEGORIES, getCategoryById, getToolsByCategory, searchTools } from '../data/tools';
import { ToolCategory } from '../types/tool';
import { Link, useRouter } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { NotFoundPage } from './NotFoundPage';
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
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', href: '/tools' },
          { label: category.name, href: category.route }
        ]}
        className="mb-6"
      />

      {/* Category Hero / Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 md:p-10 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <IconResolver name={category.icon} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Category Suite</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold">{allCategoryTools.length} Tools Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {category.description} All tools run 100% client-side in your browser for instant performance and absolute privacy.
            </p>
          </div>
        </div>

        {/* Quick jump to other categories */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Other categories:</span>
          {otherCategories.map(cat => (
            <Link
              key={cat.id}
              to={cat.route}
              className="text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* In-category Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Tools in this Suite
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredTools.length} of {allCategoryTools.length} {category.name.toLowerCase()}
          </p>
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value.slice(0, 50))}
            placeholder={`Search ${category.name.toLowerCase()}...`}
            aria-label={`Filter ${category.name} tools`}
            className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-sm"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
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

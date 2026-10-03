import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CategoryCard } from '../components/common/CategoryCard';
import { CATEGORIES, TOOLS } from '../data/tools';
import { Link } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { ArrowRight } from 'lucide-react';

export const CategoriesIndexPage: React.FC = () => {
  useEffect(() => {
    updateSeoMetadata({
      title: 'Tool Categories – Browse by Domain',
      description: 'Explore India Smart Tools categorized into Finance, Student, Document, and Everyday productivity suites.',
      canonicalPath: '/categories',
      jsonLd: getBreadcrumbListSchema([
        { name: 'Home', item: '/' },
        { name: 'Categories', item: '/categories' }
      ])
    });
  }, []);

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Categories', href: '/categories' }]} className="mb-6" />

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Browse by Category
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Four dedicated tool suites built specifically for Indian financial planning, academic success, document compliance, and daily tasks.
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {CATEGORIES.map(category => {
          const categoryTools = TOOLS.filter(t => t.category === category.id);
          return (
            <div
              key={category.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col justify-between transition-colors"
            >
              <div>
                <CategoryCard
                  category={{
                    ...category,
                    toolCount: categoryTools.length
                  }}
                  className="p-0 border-0 shadow-none hover:shadow-none bg-transparent hover:border-0"
                />

                {/* List of included tools */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                    Included Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryTools.map(tool => (
                      <Link
                        key={tool.id}
                        to={tool.route}
                        className="text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700 transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 flex justify-end">
                <Link
                  to={category.route}
                  className="inline-flex items-center text-xs font-semibold text-slate-900 dark:text-sky-400 hover:text-slate-700 dark:hover:text-sky-300 gap-1.5 min-h-[36px]"
                >
                  <span>Open {category.name} Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};

import React from 'react';
import { CategoryItem } from '../../types/tool';
import { Link } from '../../router/Router';
import { IconResolver } from './IconResolver';
import { ArrowRight } from 'lucide-react';

export interface CategoryCardProps {
  category: CategoryItem;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '' }) => {
  return (
    <Link
      to={category.route}
      className={`group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-sky-400 focus-visible:outline-none transition-all duration-150 text-left ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950 transition-colors duration-150">
            <IconResolver name={category.icon} className="w-5 h-5" />
          </div>

          {category.toolCount !== undefined && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {category.toolCount} {category.toolCount === 1 ? 'tool' : 'tools'}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white">
          {category.name}
        </h3>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {category.tagline}
        </p>

        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-sky-400">
        <span>Explore tools</span>
        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-150" />
      </div>
    </Link>
  );
};

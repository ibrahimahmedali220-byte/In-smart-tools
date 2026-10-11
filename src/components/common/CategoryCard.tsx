import React from 'react';
import { CategoryItem } from '../../types/tool';
import { Link } from '../../router/Router';
import { IconResolver } from './IconResolver';
import { ChevronRight } from 'lucide-react';

export interface CategoryCardProps {
  category: CategoryItem;
  className?: string;
}

function getCategoryTheme(id: string): string {
  switch (id) {
    case 'finance':
      return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white';
    case 'student':
      return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
    case 'documents':
      return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white';
    case 'everyday':
      return 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white';
    default:
      return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
  }
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '' }) => {
  const iconTheme = getCategoryTheme(category.id);

  return (
    <Link
      to={category.route}
      className={`group relative flex flex-col justify-between p-5 sm:p-6 bg-white dark:bg-gradient-to-r dark:from-[#0B1736] dark:via-[#0E1E45] dark:to-[#08122B] hover:bg-slate-50 dark:hover:from-[#0F204C] dark:hover:via-[#13275A] dark:hover:to-[#0B193B] rounded-2xl border border-slate-200/90 dark:border-blue-900/60 hover:border-sky-300 dark:hover:border-cyan-400/80 shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_18px_rgba(0,0,0,0.35)] hover:dark:shadow-[0_10px_28px_-6px_rgba(22,139,255,0.35)] hover:-translate-y-1 sm:hover:-translate-y-1.5 active:scale-[0.98] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none transition-all duration-200 text-left ${className}`}
    >
      {/* Top subtle gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-t-2xl" />

      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.25)] ${iconTheme} group-hover:scale-105 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.35)] transition-all duration-200`}>
            <IconResolver name={category.icon} className="w-5 h-5 text-white" />
          </div>

          {category.toolCount !== undefined && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#070F26] text-slate-700 dark:text-cyan-300 border border-slate-200 dark:border-blue-900/60">
              {category.toolCount} {category.toolCount === 1 ? 'tool' : 'tools'}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-[#F4F7FF] group-hover:text-sky-600 dark:group-hover:text-white transition-colors">
          {category.name}
        </h3>

        <p className="mt-1 text-xs text-sky-600 dark:text-cyan-400 font-medium line-clamp-1">
          {category.tagline}
        </p>

        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-[#A8B5CC] line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
        <span>Explore suite</span>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-cyan-400/70 group-hover:text-sky-600 dark:group-hover:text-cyan-300 group-hover:translate-x-1.5 transition-all duration-200" />
      </div>
    </Link>
  );
};

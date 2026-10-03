import React from 'react';
import { ToolItem } from '../../types/tool';
import { Link } from '../../router/Router';
import { IconResolver } from './IconResolver';
import { ArrowUpRight, Star } from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences';

export interface ToolCardProps {
  tool: ToolItem;
  className?: string;
  isRecent?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, className = '', isRecent = false }) => {
  const { isFavorite, toggleFavorite } = useUserPreferences();
  const isFav = isFavorite(tool.id);

  const categoryNames: Record<string, string> = {
    finance: 'Finance',
    student: 'Student',
    documents: 'Documents',
    everyday: 'Everyday'
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <Link
      to={tool.route}
      className={`group relative flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none transition-all duration-150 text-left ${className}`}
    >
      <div>
        {/* Header: Icon, Category & Favorite Toggle */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-150">
            <IconResolver name={tool.icon} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>{categoryNames[tool.category] || tool.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-medium">Ready</span>
            </div>

            {/* Accessible Favorite Star Button */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
              aria-pressed={isFav}
              className={`p-1.5 rounded-lg border transition-all ${
                isFav
                  ? 'bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-950 flex items-center gap-1.5">
          <span>{tool.name}</span>
          <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Footer subtle hint */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>{isRecent ? 'Recently Used' : '100% In-Browser'}</span>
        <span className="text-slate-700 group-hover:text-slate-900 font-medium transition-colors">
          Open Tool →
        </span>
      </div>
    </Link>
  );
};

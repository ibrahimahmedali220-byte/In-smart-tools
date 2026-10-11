import React from 'react';
import { ToolItem } from '../../types/tool';
import { Link } from '../../router/Router';
import { IconResolver } from './IconResolver';
import { ChevronRight, Star } from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences';

export interface ToolCardProps {
  tool: ToolItem;
  className?: string;
  isRecent?: boolean;
}

/**
 * Maps tools to distinct vibrant icon container themes inspired by the reference design
 */
function getToolIconColor(slug: string, category: string): string {
  switch (slug) {
    case 'qr-generator':
      return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white';
    case 'jpg-to-pdf':
      return 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white';
    case 'emi-calculator':
      return 'bg-gradient-to-br from-rose-500 to-pink-600 text-white';
    case 'sip-calculator':
      return 'bg-gradient-to-br from-teal-400 to-cyan-600 text-white';
    case 'percentage-calculator':
      return 'bg-gradient-to-br from-purple-500 to-violet-700 text-white';
    case 'age-calculator':
      return 'bg-gradient-to-br from-emerald-600 to-green-700 text-white';
    case 'gst-calculator':
      return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white';
    case 'salary-calculator':
      return 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white';
    case 'fd-calculator':
      return 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white';
    case 'cgpa-calculator':
      return 'bg-gradient-to-br from-sky-500 to-blue-600 text-white';
    case 'study-timer':
      return 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white';
    case 'word-counter':
      return 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white';
    case 'pdf-to-jpg':
      return 'bg-gradient-to-br from-violet-500 to-purple-700 text-white';
    case 'pdf-compressor':
      return 'bg-gradient-to-br from-amber-500 to-rose-600 text-white';
    case 'image-compressor':
      return 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white';
    case 'image-resizer':
      return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
    case 'password-generator':
      return 'bg-gradient-to-br from-sky-400 to-blue-600 text-white';
    case 'unit-converter':
      return 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white';
    case 'date-difference':
      return 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white';
    case 'bmi-calculator':
      return 'bg-gradient-to-br from-rose-500 to-red-600 text-white';
    case 'private-calculator':
      return 'bg-gradient-to-br from-slate-600 to-slate-800 text-white';
    case 'private-calling':
      return 'bg-gradient-to-br from-indigo-600 to-violet-800 text-white';
    default:
      if (category === 'finance') return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white';
      if (category === 'student') return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
      if (category === 'documents') return 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white';
      return 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white';
  }
}

/**
 * Maps tools to distinct radiant border and glow themes matching reference image
 */
function getToolCardBorder(slug: string, category: string): { border: string; glow: string; arrowColor: string } {
  switch (slug) {
    case 'qr-generator':
      return {
        border: 'border-emerald-200/90 dark:border-emerald-500/40 hover:border-emerald-400 dark:hover:border-emerald-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(16,185,129,0.35)]',
        arrowColor: 'text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-300'
      };
    case 'jpg-to-pdf':
      return {
        border: 'border-blue-200/90 dark:border-blue-500/40 hover:border-blue-400 dark:hover:border-blue-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(59,130,246,0.4)]',
        arrowColor: 'text-blue-500 dark:text-blue-400 group-hover:text-blue-300'
      };
    case 'emi-calculator':
      return {
        border: 'border-rose-200/90 dark:border-rose-500/40 hover:border-rose-400 dark:hover:border-rose-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(244,63,94,0.35)]',
        arrowColor: 'text-rose-500 dark:text-rose-400 group-hover:text-rose-300'
      };
    case 'sip-calculator':
      return {
        border: 'border-cyan-200/90 dark:border-cyan-500/40 hover:border-cyan-400 dark:hover:border-cyan-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(6,182,212,0.35)]',
        arrowColor: 'text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-300'
      };
    case 'percentage-calculator':
      return {
        border: 'border-purple-200/90 dark:border-purple-500/40 hover:border-purple-400 dark:hover:border-purple-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(168,85,247,0.35)]',
        arrowColor: 'text-purple-500 dark:text-purple-400 group-hover:text-purple-300'
      };
    case 'age-calculator':
      return {
        border: 'border-green-200/90 dark:border-green-500/40 hover:border-green-400 dark:hover:border-green-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(34,197,94,0.35)]',
        arrowColor: 'text-green-500 dark:text-green-400 group-hover:text-green-300'
      };
    case 'gst-calculator':
    case 'pdf-compressor':
      return {
        border: 'border-amber-200/90 dark:border-amber-500/40 hover:border-amber-400 dark:hover:border-amber-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(245,158,11,0.35)]',
        arrowColor: 'text-amber-500 dark:text-amber-400 group-hover:text-amber-300'
      };
    default:
      if (category === 'finance') {
        return {
          border: 'border-teal-200/90 dark:border-teal-500/40 hover:border-teal-400 dark:hover:border-teal-400/90',
          glow: 'hover:shadow-[0_10px_28px_-6px_rgba(20,184,166,0.35)]',
          arrowColor: 'text-teal-500 dark:text-teal-400 group-hover:text-teal-300'
        };
      }
      return {
        border: 'border-sky-200/90 dark:border-blue-500/40 hover:border-sky-400 dark:hover:border-cyan-400/90',
        glow: 'hover:shadow-[0_10px_28px_-6px_rgba(14,165,233,0.35)]',
        arrowColor: 'text-sky-500 dark:text-sky-400 group-hover:text-cyan-300'
      };
  }
}

/**
 * Compact Futuristic 3D Button-Style Tool Item
 * Directly mirrors the reference image design:
 * - Rounded rectangular tile with layered 3D depth and subtle blue gradient
 * - Thin luminous border with matching neon glow
 * - 3D-styled colored square icon container
 * - Crisp bold tool name
 * - Smooth hover lift (3–5px) & specular reflection
 * - Right-facing arrow with smooth rightward shift
 * - Star-favorite controls and accessibility preserved
 */
export const ToolCard: React.FC<ToolCardProps> = ({ tool, className = '', isRecent = false }) => {
  const { isFavorite, toggleFavorite } = useUserPreferences();
  const isFav = isFavorite(tool.id);
  const isComingSoon = Boolean(tool.badge) || tool.status === 'in_development' || tool.status === 'planned';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  const iconBg = getToolIconColor(tool.slug, tool.category);
  const { border, glow, arrowColor } = getToolCardBorder(tool.slug, tool.category);

  return (
    <Link
      to={tool.route}
      aria-label={`${tool.name} – ${tool.description}`}
      title={tool.description}
      className={`group relative flex items-center justify-between p-3 sm:p-3.5 bg-white dark:bg-gradient-to-r dark:from-[#0B1736] dark:via-[#0E1E45] dark:to-[#08122B] hover:bg-slate-50 dark:hover:from-[#0F204C] dark:hover:via-[#13275A] dark:hover:to-[#0B193B] rounded-2xl border ${border} shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_18px_rgba(0,0,0,0.35)] ${glow} hover:-translate-y-1 sm:hover:-translate-y-1.5 active:scale-[0.98] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-all duration-200 text-left cursor-pointer min-h-[64px] ${className}`}
    >
      {/* Top subtle gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Left: Icon container & Tool Name */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 mr-2">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.25)] ${iconBg} group-hover:scale-105 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.35)] transition-all duration-200`}
        >
          <IconResolver name={tool.icon} className="w-5 h-5 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-[#F4F7FF] group-hover:text-sky-600 dark:group-hover:text-white truncate transition-colors leading-snug">
              {tool.name}
            </h3>

            {isComingSoon && (
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                SOON
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Favorite Action & Chevron Arrow */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
          aria-pressed={isFav}
          className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
            isFav
              ? 'opacity-100 text-amber-400 hover:scale-110'
              : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-400'
          }`}
          title={isFav ? 'Remove from favorites' : 'Star favorite'}
        >
          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${arrowColor} group-hover:translate-x-1.5 transition-transform duration-200`} />
      </div>
    </Link>
  );
};

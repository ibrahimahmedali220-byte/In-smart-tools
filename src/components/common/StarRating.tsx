import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences';

export interface StarRatingProps {
  toolId: string;
  toolName?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onRatingChange?: (newRating: number) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Needs improvement',
  2: 'Fair utility',
  3: 'Good and useful',
  4: 'Very helpful',
  5: 'Exceptional tool'
};

export const StarRating: React.FC<StarRatingProps> = ({
  toolId,
  toolName,
  size = 'md',
  showLabel = false,
  className = '',
  onRatingChange
}) => {
  const { getRating, rateTool } = useUserPreferences();
  const currentRating = getRating(toolId);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : currentRating;

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-6 h-6 sm:w-7 sm:h-7'
  };

  const handleSelect = (e: React.MouseEvent, starValue: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Clicking the same rating resets it to 0 (unrate)
    const nextRating = currentRating === starValue ? 0 : starValue;
    rateTool(toolId, nextRating);
    if (onRatingChange) {
      onRatingChange(nextRating);
    }
  };

  return (
    <div className={`inline-flex flex-col items-start gap-1 select-none ${className}`}>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={toolName ? `Rate ${toolName}` : 'Tool rating'}
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeRating;
          const isSelected = starValue === currentRating;

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}: ${RATING_DESCRIPTIONS[starValue] || ''}`}
              title={`${starValue} star${starValue > 1 ? 's' : ''} - ${RATING_DESCRIPTIONS[starValue] || ''}`}
              onClick={(e) => handleSelect(e, starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onFocus={() => setHoverRating(starValue)}
              onBlur={() => setHoverRating(null)}
              className={`p-1 -m-1 rounded-md transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
                hoverRating !== null && starValue <= hoverRating ? 'scale-110' : 'hover:scale-105 active:scale-95'
              }`}
            >
              <Star
                className={`${starSizes[size]} transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]'
                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500'
                }`}
              />
            </button>
          );
        })}

        {currentRating > 0 && (
          <span className="ml-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {currentRating}.0
          </span>
        )}
      </div>

      {showLabel && (
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          {activeRating > 0 ? (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {RATING_DESCRIPTIONS[activeRating]}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">Tap stars to rate & personalize recommendations</span>
          )}
        </div>
      )}
    </div>
  );
};

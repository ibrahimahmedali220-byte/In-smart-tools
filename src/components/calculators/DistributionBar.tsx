import React from 'react';

export interface DistributionItem {
  label: string;
  amount: string;
  percentage: number;
  color: string; // Tailwind background color class, e.g. 'bg-slate-900', 'bg-amber-500'
}

export interface DistributionBarProps {
  items: DistributionItem[];
  title?: string;
  className?: string;
}

export const DistributionBar: React.FC<DistributionBarProps> = ({
  items,
  title = 'Breakdown',
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>{title}</span>
        </div>
      )}

      {/* Visual Stacked Bar */}
      <div
        className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200"
        role="progressbar"
        aria-label={title}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${Math.max(0, Math.min(100, item.percentage))}%` }}
            className={`${item.color} transition-all duration-300`}
            title={`${item.label}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Legend & Amounts */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className={`w-2.5 h-2.5 rounded-sm ${item.color} shrink-0`} aria-hidden="true" />
              <span className="truncate">{item.label}</span>
              <span className="font-semibold text-slate-900 ml-auto">{item.percentage}%</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 pl-4">
              {item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

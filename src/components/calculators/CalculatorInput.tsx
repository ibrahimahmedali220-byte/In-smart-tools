import React from 'react';

export interface CalculatorInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // '₹', '%', 'Years', 'Months'
  unitPosition?: 'prefix' | 'suffix';
  presets?: { label: string; value: number }[];
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 10000000,
  step = 1,
  unit = '₹',
  unitPosition = 'prefix',
  presets,
  helperText,
  error,
  disabled = false
}) => {
  const isPrefix = unitPosition === 'prefix';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(0, num)));
    } else if (raw === '') {
      onChange(0);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
          {label}
        </label>
        {/* Direct numeric input */}
        <div className="relative flex items-center">
          {isPrefix && (
            <span className="absolute left-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 pointer-events-none select-none">
              {unit}
            </span>
          )}
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={value > 0 ? (isPrefix && unit === '₹' ? value.toLocaleString('en-IN') : value) : ''}
            placeholder="0"
            disabled={disabled}
            onChange={handleInputChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={`w-32 sm:w-40 rounded-xl border bg-white dark:bg-slate-900 py-1.5 text-right text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors focus:border-slate-900 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400 ${
              isPrefix ? 'pl-7 pr-3' : 'pl-3 pr-8'
            } ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
          />
          {!isPrefix && (
            <span className="absolute right-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 pointer-events-none select-none">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Range Slider for quick tactile adjustment */}
      {min !== undefined && max !== undefined && (
        <div className="pt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleSliderChange}
            aria-label={`${label} slider`}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-sky-400 focus:outline-none"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 select-none">
            <span>{isPrefix ? `${unit}${min.toLocaleString('en-IN')}` : `${min} ${unit}`}</span>
            <span>{isPrefix ? `${unit}${max.toLocaleString('en-IN')}` : `${max} ${unit}`}</span>
          </div>
        </div>
      )}

      {/* Quick Preset Buttons */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange(p.value)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors min-h-[30px] ${
                value === p.value
                  ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

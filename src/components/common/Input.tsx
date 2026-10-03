import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, startIcon, endIcon, className = '', id, required, ...props }, ref) => {
    // Generate deterministic id if not supplied
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined);
    const errorId = inputId && error ? `${inputId}-error` : undefined;
    const helperId = inputId && helperText && !error ? `${inputId}-helper` : undefined;
    const describedBy = errorId || helperId || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-tight">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500" aria-hidden="true">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-required={required ? 'true' : undefined}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={`w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:border-slate-900 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400 disabled:bg-slate-50 dark:disabled:bg-slate-800/60 disabled:text-slate-500 ${
              startIcon ? 'pl-10' : ''
            } ${endIcon ? 'pr-10' : ''} ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-700'
            } ${className}`}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3.5 flex items-center text-slate-400 dark:text-slate-500">
              {endIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

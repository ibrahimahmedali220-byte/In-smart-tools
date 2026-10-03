import React from 'react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading tools...',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-sky-400 animate-spin motion-reduce:animate-none`}
        />
      </div>
      {message && (
        <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          {message}
        </p>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
};

import React from 'react';
import { AlertCircle, RefreshCw, Home, Grid } from 'lucide-react';
import { Button } from './Button';
import { Link } from '../../router/Router';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showToolsButton?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected issue. Your inputs are safe. Please try again or return to the directory.',
  onRetry,
  showHomeButton = true,
  showToolsButton = true,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-red-200/80 dark:border-red-900/40 rounded-2xl bg-red-50/60 dark:bg-red-950/20 ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
        {message}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        )}
        {showToolsButton && (
          <Link to="/tools">
            <Button
              variant="outline"
              size="sm"
              icon={<Grid className="w-3.5 h-3.5" />}
            >
              Browse Tools
            </Button>
          </Link>
        )}
        {showHomeButton && (
          <Link to="/">
            <Button
              variant="primary"
              size="sm"
              icon={<Home className="w-3.5 h-3.5" />}
            >
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

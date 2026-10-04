import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '../../router/Router';

export interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackUrl = '/',
  label = 'Back',
  className = ''
}) => {
  const { navigate } = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-sky-400 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      <span>{label}</span>
    </button>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { ThemeMode } from '../../utils/theme/themeManager';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-sky-400" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-slate-400" /> }
  ];

  const currentIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-sky-400" />;
    return <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
  };

  if (variant === 'segmented') {
    return (
      <div
        role="radiogroup"
        aria-label="Select color theme"
        className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700/80 ${className}`}
      >
        {themes.map(t => {
          const isSelected = theme === t.mode;
          return (
            <button
              key={t.mode}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(t.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Current theme: ${theme} (${effectiveTheme} active). Change theme`}
        className="flex items-center justify-center min-w-[40px] min-h-[40px] p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-400"
      >
        {currentIcon()}
        <span className="sr-only">Toggle theme</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {themes.map(t => (
            <button
              key={t.mode}
              role="menuitem"
              onClick={() => {
                setTheme(t.mode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                theme === t.mode
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {t.icon}
                <span>{t.label}</span>
              </div>
              {theme === t.mode && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-sky-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

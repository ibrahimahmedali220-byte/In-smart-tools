import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { searchTools, getAllTools } from '../../data/tools';
import { useRouter } from '../../router/Router';
import { IconResolver } from './IconResolver';

export interface SearchToolsProps {
  variant?: 'inline' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export const SearchTools: React.FC<SearchToolsProps> = ({
  variant = 'inline',
  isOpen = true,
  onClose,
  placeholder = 'Search tools by name, keyword (e.g. loan, photo, gst)...',
  autoFocus = false,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();

  const allTools = useMemo(() => getAllTools(), []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    return searchTools(query);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Focus input when modal opens
  useEffect(() => {
    if (variant === 'modal' && isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, variant]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectTool(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (variant === 'modal' && onClose) {
        onClose();
      } else {
        setQuery('');
      }
    }
  };

  const handleSelectTool = (tool: ToolItem) => {
    navigate(tool.route);
    setQuery('');
    if (onClose) onClose();
  };

  const categoryNames: Record<string, string> = {
    finance: 'Finance',
    student: 'Student',
    documents: 'Documents',
    everyday: 'Everyday'
  };

  const searchBox = (
    <div className={`relative flex flex-col w-full ${className}`}>
      {/* Input row */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value.slice(0, 100))}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          maxLength={100}
          placeholder={placeholder}
          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 focus:border-slate-900 dark:focus:border-sky-400 transition-shadow"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results-list"
          aria-activedescendant={results[selectedIndex] ? `result-${results[selectedIndex].id}` : undefined}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant dropdown / results list */}
      {query.trim().length > 0 && (
        <div
          ref={resultsRef}
          id="search-results-list"
          role="listbox"
          className="mt-2 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 z-30"
        >
          {results.length > 0 ? (
            results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  id={`result-${tool.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleSelectTool(tool)}
                  className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <IconResolver name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {tool.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {categoryNames[tool.category]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-md">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium gap-0.5">
                        <CornerDownLeft className="w-3 h-3" /> Select
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">No tools found matching &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try searching for &ldquo;loan&rdquo;, &ldquo;pdf&rdquo;, &ldquo;marks&rdquo;, &ldquo;age&rdquo;, or &ldquo;qr&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Suggested quick searches if query is empty and in modal */}
      {variant === 'modal' && !query.trim() && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Popular Quick Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {['EMI Calculator', 'SIP Calculator', 'JPG to PDF', 'PDF Compressor', 'CGPA Calculator', 'Age Calculator', 'QR Generator'].map(term => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors min-h-[32px]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'modal') {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:pt-20 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
      >
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 z-10 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              India Smart Tools Search
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">ESC to close</span>
          </div>
          {searchBox}
        </div>
      </div>
    );
  }

  return searchBox;
};

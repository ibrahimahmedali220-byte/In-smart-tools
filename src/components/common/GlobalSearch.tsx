import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolItem } from '../../types/tool';
import { useRouter } from '../../router/Router';
import { IconResolver } from './IconResolver';

export interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  onSelect?: (tool: ToolItem) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  everyday: 'Everyday',
  documents: 'Documents',
  finance: 'Finance',
  student: 'Student'
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className = '',
  placeholder = 'Search tools by name or description...',
  onSelect
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useRouter();

  // Simple filtering logic across existing tool registry by name or description
  const filteredTools = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return TOOLS.filter(
      tool =>
        tool.name.toLowerCase().includes(trimmed) ||
        tool.description.toLowerCase().includes(trimmed)
    );
  }, [query]);

  // Reset keyboard selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = (tool: ToolItem) => {
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery('');
    if (onSelect) {
      onSelect(tool);
    } else {
      navigate(tool.route);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredTools.length > 0) {
        setSelectedIndex(prev => (prev + 1) % filteredTools.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredTools.length > 0) {
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools.length > 0 && filteredTools[selectedIndex]) {
        handleSelectTool(filteredTools[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setIsMobileExpanded(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Desktop Search Input */}
      <div className="hidden sm:relative sm:flex sm:items-center w-48 md:w-56 lg:w-72">
        <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-cyan-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Global search for tools"
          aria-expanded={isOpen}
          role="combobox"
          className="w-full pl-9 pr-14 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-100/90 dark:bg-[#0B1530]/90 hover:bg-slate-200/70 dark:hover:bg-[#112048] border border-slate-200/80 dark:border-blue-900/60 focus:border-cyan-400 dark:focus:border-cyan-400 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all min-h-[36px]"
        />

        {/* Clear or Keyboard Shortcut Indicator */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-[#070F26] border border-slate-200 dark:border-blue-900/60 rounded shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Mobile Search Button Toggle */}
      <button
        type="button"
        onClick={() => {
          setIsMobileExpanded(prev => !prev);
          setTimeout(() => mobileInputRef.current?.focus(), 100);
        }}
        className="sm:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Open search input"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Mobile Expanding Search Bar Overlay */}
      {isMobileExpanded && (
        <div className="sm:hidden absolute top-12 right-0 left-auto w-[calc(100vw-2rem)] max-w-sm bg-white dark:bg-[#0D1836] border border-slate-200 dark:border-blue-900/80 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-cyan-400 pointer-events-none" />
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools by name or description..."
              className="w-full pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-blue-900/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  mobileInputRef.current?.focus();
                }}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Global Search Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div
          role="listbox"
          aria-label="Tools search results"
          className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-80 sm:w-96 max-w-[90vw] bg-white dark:bg-[#0D1836] rounded-2xl border border-slate-200 dark:border-blue-900/70 shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-blue-950/60 z-50 max-h-96 overflow-y-auto animate-in fade-in-0 duration-150"
        >
          {/* Result Count Header */}
          <div className="px-3.5 py-2 bg-slate-50/80 dark:bg-[#081024] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
            </span>
            <span className="hidden sm:inline">Use ↑ ↓ to navigate, ↵ to select</span>
          </div>

          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTool(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-100/90 dark:bg-[#162754] text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-[#101F44] text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-cyan-400 shrink-0 mt-0.5">
                    <IconResolver name={tool.icon} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {tool.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 whitespace-nowrap">
                        · {CATEGORY_LABELS[tool.category] || tool.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {tool.description}
                    </p>
                  </div>

                  <div className="shrink-0 self-center pl-1">
                    {isSelected ? (
                      <span className="hidden sm:inline-flex items-center text-[10px] text-slate-400 dark:text-cyan-400 font-medium">
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                No tools matching &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Try searching for words like &ldquo;calculator&rdquo;, &ldquo;pdf&rdquo;, &ldquo;image&rdquo;, &ldquo;qr&rdquo;, or &ldquo;grade&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../../router/Router';
import { SearchTools } from '../common/SearchTools';
import { Search, Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { currentPath } = useRouter();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', exact: true },
    { label: 'Tools', href: '/tools', exact: false },
    { label: 'Categories', href: '/categories', exact: false },
    { label: 'About', href: '/about', exact: true },
    { label: 'Contact', href: '/contact', exact: true }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Zone 1: Wordmark Brand Lockup */}
            <div className="flex items-center gap-6 shrink-0">
              <Link
                to="/"
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 hover:text-slate-700 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
              >
                India Smart Tools
              </Link>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600">
              {navLinks.map(link => {
                const isActive = link.exact
                  ? currentPath === link.href
                  : currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`transition-colors py-1 hover:text-slate-900 whitespace-nowrap ${
                      isActive ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Primary Actions (Search & Mobile Toggle) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Prominent Desktop Search Affordance */}
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-800 rounded-lg border border-slate-200/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                aria-label="Search tools (Press Cmd+K to open)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-normal">Search tools...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="sm:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Search tools"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-md">
            {/* Mobile Search Bar Quick Access */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search all 20 tools...</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map(link => {
                const isActive = link.exact
                  ? currentPath === link.href
                  : currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Quick Category Jump on Mobile */}
            <div className="pt-3 border-t border-slate-100">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: 'Finance Tools', route: '/tools/finance' },
                  { name: 'Student Tools', route: '/tools/student' },
                  { name: 'Document Tools', route: '/tools/documents' },
                  { name: 'Everyday Tools', route: '/tools/everyday' }
                ].map(cat => (
                  <Link
                    key={cat.route}
                    to={cat.route}
                    className="text-xs text-slate-600 hover:text-slate-900 py-1 px-2 rounded hover:bg-slate-50"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      <SearchTools
        variant="modal"
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

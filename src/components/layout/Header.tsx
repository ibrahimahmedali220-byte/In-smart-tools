import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../../router/Router';
import { GlobalSearch } from '../common/GlobalSearch';
import { ThemeToggle } from '../common/ThemeToggle';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { Menu, X, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentPath } = useRouter();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { label: 'Home', href: '/', exact: true },
    { label: 'Tools', href: '/tools', exact: false },
    { label: 'Categories', href: '/categories', exact: false },
    { label: 'About', href: '/about', exact: true },
    { label: 'Contact', href: '/contact', exact: true }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#050B1D]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-blue-950/80 dark:shadow-[0_4px_25px_-5px_rgba(5,11,29,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Zone 1: Wordmark Brand Lockup */}
            <div className="flex items-center gap-6 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-[#F4F7FF] hover:text-sky-600 dark:hover:text-cyan-300 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_18px_rgba(22,139,255,0.7)] group-hover:shadow-[0_0_24px_rgba(0,200,255,0.9)] transition-shadow shrink-0">
                  <Zap className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text dark:text-transparent">
                  India Smart Tools
                </span>
              </Link>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              {navLinks.map(link => {
                const isActive = link.exact
                  ? currentPath === link.href
                  : currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`transition-all py-1 whitespace-nowrap relative text-sm font-medium ${
                      isActive
                        ? 'text-slate-950 dark:text-cyan-300 font-semibold after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:rounded-full after:shadow-[0_0_12px_rgba(0,200,255,0.9)]'
                        : 'text-slate-600 dark:text-[#A8B5CC] hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Primary Actions (Global Search, PWA Install, Theme & Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Global Search Component */}
              <GlobalSearch />

              {/* PWA Install Button */}
              <PWAInstallButton variant="header" />

              {/* Dark/Light Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:scale-105 active:scale-95 transition-all duration-150 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
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
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-md">
            {/* Mobile Search Bar Quick Access */}
            <div className="w-full">
              <GlobalSearch
                className="w-full"
                placeholder="Search tools by name or description..."
                onSelect={() => setIsMobileMenuOpen(false)}
              />
            </div>

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
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 dark:bg-slate-800 text-white dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Theme Preference Selector */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Theme Preference
              </span>
              <ThemeToggle variant="segmented" />
            </div>

            {/* Quick Category Jump on Mobile */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
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
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

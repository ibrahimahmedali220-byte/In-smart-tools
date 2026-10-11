import React from 'react';
import { Link } from '../../router/Router';
import { ThemeToggle } from '../common/ThemeToggle';
import { PrivacyWiperButton } from '../common/PrivacyWiperButton';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#040816] border-t border-slate-200 dark:border-blue-950/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-[#F4F7FF] tracking-tight group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(22,139,255,0.7)] group-hover:shadow-[0_0_20px_rgba(0,200,255,0.9)] transition-shadow shrink-0">
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text dark:text-transparent">
                India Smart Tools
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-[#A8B5CC] max-w-xs">
              Simple, fast, and free online utilities designed for students, job applicants, creators, and everyday productivity.
            </p>
            <div className="pt-2">
              <ThemeToggle variant="segmented" />
            </div>
          </div>

          {/* Column 1: Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/tools/finance" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Finance Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/student" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Student Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/documents" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Document Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/everyday" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Everyday Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/privacy-policy" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/support/report-problem" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/support/suggest-tool" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Suggest a Tool
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p>© 2026 India Smart Tools. All rights reserved.</p>
            <PrivacyWiperButton />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Built with modern web standards for high-speed performance across all devices.
          </p>
        </div>
      </div>
    </footer>
  );
};

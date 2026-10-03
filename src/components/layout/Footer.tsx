import React from 'react';
import { Link } from '../../router/Router';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
            <Link to="/" className="text-base font-bold text-slate-900 tracking-tight">
              India Smart Tools
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Simple tools for everyday India. Fast, free, and privacy-conscious online utilities designed for students, job applicants, and professionals.
            </p>
          </div>

          {/* Column 1: Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3.5">
              Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/tools/finance" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Finance Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/student" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Student Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/documents" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Document Tools
                </Link>
              </li>
              <li>
                <Link to="/tools/everyday" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Everyday Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3.5">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3.5">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/privacy-policy" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3.5">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/support/report-problem" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/support/suggest-tool" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Suggest a Tool
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 India Smart Tools. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            Built with modern web standards for high-speed performance across all Indian networks.
          </p>
        </div>
      </div>
    </footer>
  );
};

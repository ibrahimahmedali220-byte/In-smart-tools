import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Button } from '../components/common/Button';
import { SearchTools } from '../components/common/SearchTools';
import { Link } from '../router/Router';
import { updateSeoMetadata } from '../utils/seo';
import { Home, Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    updateSeoMetadata({
      title: 'Page Not Found (404) – India Smart Tools',
      description: 'The requested tool or page could not be located on India Smart Tools.',
      noIndex: true
    });
  }, []);

  const popularTools = [
    { name: 'EMI Calculator', route: '/tools/emi-calculator' },
    { name: 'SIP Calculator', route: '/tools/sip-calculator' },
    { name: 'JPG to PDF', route: '/tools/jpg-to-pdf' },
    { name: 'Percentage Calculator', route: '/tools/percentage-calculator' },
    { name: 'QR Code Generator', route: '/tools/qr-generator' }
  ];

  return (
    <PageContainer maxWidth="md" className="text-center py-12 sm:py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-slate-700" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Error 404
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
        Page Not Found
      </h1>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
        The tool or link you followed may have moved or does not exist. Search for any tool or explore popular shortcuts below.
      </p>

      {/* Embedded Search Tool */}
      <div className="mt-6 max-w-sm mx-auto text-left">
        <SearchTools variant="inline" placeholder="Search across all 20 tools..." />
      </div>

      {/* Popular Shortcuts */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Popular Online Tools
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {popularTools.map(tool => (
            <Link
              key={tool.route}
              to={tool.route}
              className="text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <span>{tool.name}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/tools">
          <Button variant="outline" size="md">
            Browse All 20 Tools
          </Button>
        </Link>
        <Link to="/categories">
          <Button variant="ghost" size="md">
            Browse Categories
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
};

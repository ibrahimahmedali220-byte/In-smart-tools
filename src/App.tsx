/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DynamicBreadcrumb } from './components/common/DynamicBreadcrumb';
import { PWAUpdateBanner } from './components/common/PWAUpdateBanner';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Lazy load Vercel Analytics so it does not block critical initial paint
const Analytics = React.lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })));

// Static import for critical home landing path to ensure sub-1.5s LCP & FCP
import { HomePage } from './pages/HomePage';

// Code splitting & lazy loading for non-home routes
const ToolsPage = React.lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const CategoriesIndexPage = React.lazy(() => import('./pages/CategoriesIndexPage').then(m => ({ default: m.CategoriesIndexPage })));
const ToolDetailPage = React.lazy(() => import('./pages/ToolDetailPage').then(m => ({ default: m.ToolDetailPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPage = React.lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.LegalPage })));
const SupportPage = React.lazy(() => import('./pages/support/SupportPages').then(m => ({ default: m.SupportPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import type { LegalDocType } from './pages/legal/LegalPages';
import type { SupportPageType } from './pages/support/SupportPages';
import { ToolCategory } from './types/tool';

const PageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6" aria-busy="true">
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
      <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
      <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
      <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { currentPath, params } = useRouter();

  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }

    // 2. All Tools Directory
    if (currentPath === '/tools' || currentPath === '/tools/') {
      return <ToolsPage />;
    }

    // 3. Categories Index
    if (currentPath === '/categories' || currentPath === '/categories/') {
      return <CategoriesIndexPage />;
    }

    // 4. Specific Category Routes (/tools/finance, /tools/student, /tools/documents, /tools/everyday)
    const validCategories: ToolCategory[] = ['finance', 'student', 'documents', 'everyday'];
    for (const cat of validCategories) {
      if (currentPath === `/tools/${cat}` || currentPath === `/tools/${cat}/`) {
        return <CategoryPage categoryId={cat} />;
      }
    }

    // 5. Individual Tool Routes (/tools/:slug)
    if (currentPath.startsWith('/tools/')) {
      const slug = params.slug || currentPath.replace('/tools/', '').replace(/\/$/, '');
      if (slug) {
        return <ToolDetailPage slug={slug} />;
      }
    }

    // 6. Company Pages
    if (currentPath === '/about' || currentPath === '/about/') {
      return <AboutPage />;
    }

    if (currentPath === '/contact' || currentPath === '/contact/') {
      return <ContactPage />;
    }

    // 7. Legal Pages (/privacy-policy, /terms, /cookie-policy, /disclaimer, /refund-policy and /legal/*)
    const legalRouteMap: Record<string, LegalDocType> = {
      '/privacy-policy': 'privacy',
      '/legal/privacy': 'privacy',
      '/terms': 'terms',
      '/terms-of-service': 'terms',
      '/legal/terms': 'terms',
      '/cookie-policy': 'cookies',
      '/legal/cookies': 'cookies',
      '/disclaimer': 'disclaimer',
      '/legal/disclaimer': 'disclaimer',
      '/refund-policy': 'refund',
      '/legal/refund': 'refund'
    };

    const cleanPath = currentPath.replace(/\/$/, '') || '/';
    if (legalRouteMap[cleanPath]) {
      return <LegalPage type={legalRouteMap[cleanPath]} />;
    }

    // 8. Support Pages (/support/report-problem, /support/suggest-tool)
    const supportTypes: SupportPageType[] = ['report-problem', 'suggest-tool'];
    for (const sType of supportTypes) {
      if (currentPath === `/support/${sType}` || currentPath === `/support/${sType}/`) {
        return <SupportPage type={sType} />;
      }
    }

    // 9. 404 Fallback
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <Header />
      <main className="flex-1">
        <DynamicBreadcrumb />
        <React.Suspense fallback={<PageSkeleton />}>
          {renderRoute()}
        </React.Suspense>
      </main>
      <Footer />
      <PWAUpdateBanner />
      <OfflineIndicator />
      <React.Suspense fallback={null}>
        <Analytics />
      </React.Suspense>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </RouterProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

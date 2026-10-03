/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { CategoryPage } from './pages/CategoryPage';
import { CategoriesIndexPage } from './pages/CategoriesIndexPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage, LegalDocType } from './pages/legal/LegalPages';
import { SupportPage, SupportPageType } from './pages/support/SupportPages';
import { NotFoundPage } from './pages/NotFoundPage';
import { ToolCategory } from './types/tool';

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <div className="flex-1">
        {renderRoute()}
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </RouterProvider>
    </ErrorBoundary>
  );
}

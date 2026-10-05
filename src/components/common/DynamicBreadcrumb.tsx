import React, { useMemo } from 'react';
import { useRouter } from '../../router/Router';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { getToolBySlug, getCategoryById, CATEGORIES } from '../../data/tools';
import { ToolCategory } from '../../types/tool';

export const DynamicBreadcrumb: React.FC = () => {
  const { currentPath, params } = useRouter();

  const items = useMemo<BreadcrumbItem[] | null>(() => {
    // 1. Root / Home path has no breadcrumb
    if (!currentPath || currentPath === '/' || currentPath === '') {
      return null;
    }

    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    // 2. All Tools Directory
    if (cleanPath === '/tools') {
      return [{ label: 'All Tools', href: '/tools' }];
    }

    // 3. Categories Index
    if (cleanPath === '/categories') {
      return [{ label: 'Categories', href: '/categories' }];
    }

    // 4. Specific Category Routes (/tools/finance, /tools/student, etc.)
    const validCategories: ToolCategory[] = ['finance', 'student', 'documents', 'everyday'];
    for (const catId of validCategories) {
      if (cleanPath === `/tools/${catId}`) {
        const catObj = getCategoryById(catId);
        return [
          { label: 'Tools', href: '/tools' },
          { label: catObj ? `${catObj.name} Tools` : 'Category', href: `/tools/${catId}` }
        ];
      }
    }

    // 5. Individual Tool Routes (/tools/:slug) e.g., Home > Tools > Finance > Calculator
    if (cleanPath.startsWith('/tools/')) {
      const slug = params.slug || cleanPath.replace('/tools/', '');
      const tool = getToolBySlug(slug);

      if (tool) {
        const catObj = getCategoryById(tool.category);
        return [
          { label: 'Tools', href: '/tools' },
          { label: catObj ? catObj.name : tool.category, href: catObj ? catObj.route : '/tools' },
          { label: tool.name, href: tool.route }
        ];
      }

      return [
        { label: 'Tools', href: '/tools' },
        { label: 'Tool' }
      ];
    }

    // 6. Company Pages
    if (cleanPath === '/about') {
      return [{ label: 'About Us', href: '/about' }];
    }

    if (cleanPath === '/contact') {
      return [{ label: 'Contact Us', href: '/contact' }];
    }

    // 7. Legal Pages
    const legalLabels: Record<string, string> = {
      '/privacy-policy': 'Privacy Policy',
      '/legal/privacy': 'Privacy Policy',
      '/terms': 'Terms of Service',
      '/terms-of-service': 'Terms of Service',
      '/legal/terms': 'Terms of Service',
      '/cookie-policy': 'Cookie Policy',
      '/legal/cookies': 'Cookie Policy',
      '/disclaimer': 'Disclaimer',
      '/legal/disclaimer': 'Disclaimer',
      '/refund-policy': 'Refund Policy',
      '/legal/refund': 'Refund Policy'
    };

    if (legalLabels[cleanPath]) {
      return [
        { label: 'Legal', href: '/privacy-policy' },
        { label: legalLabels[cleanPath], href: cleanPath }
      ];
    }

    // 8. Support Pages
    if (cleanPath === '/support/report-problem') {
      return [
        { label: 'Support', href: '/contact' },
        { label: 'Report a Problem', href: '/support/report-problem' }
      ];
    }

    if (cleanPath === '/support/suggest-tool') {
      return [
        { label: 'Support', href: '/contact' },
        { label: 'Suggest a Tool', href: '/support/suggest-tool' }
      ];
    }

    // 9. 404 / Other
    return [{ label: 'Page Not Found' }];
  }, [currentPath, params.slug]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <Breadcrumb items={items} />
      </div>
    </div>
  );
};

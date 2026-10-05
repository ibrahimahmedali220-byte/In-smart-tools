import React from 'react';
import { Link } from '../../router/Router';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0" itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
          <Link to="/" itemProp="item" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2;

          return (
            <li key={`${item.label}-${index}`} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-900 dark:text-slate-100" aria-current={isLast ? 'page' : undefined} itemProp="name">
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} itemProp="item" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

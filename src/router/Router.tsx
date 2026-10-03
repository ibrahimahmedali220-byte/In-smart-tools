import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { isSafeUrl, sanitizeUrl } from '../utils/security';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
  searchQuery: string;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface RouterProviderProps {
  children: React.ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/';
      return isSafeUrl(path) ? path : '/';
    }
    return '/';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search || '';
    }
    return '';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(isSafeUrl(path) ? path : '/');
      setSearchQuery(window.location.search || '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    // Validate and sanitize destination URL
    const safeTarget = sanitizeUrl(to, '/');

    const [pathname, search] = safeTarget.split('?');
    const targetSearch = search ? `?${search}` : '';

    if (options?.replace) {
      window.history.replaceState(null, '', safeTarget);
    } else {
      window.history.pushState(null, '', safeTarget);
    }

    setCurrentPath(pathname || '/');
    setSearchQuery(targetSearch);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Derive dynamic parameters based on current path
  const params = useMemo(() => {
    const paramMap: Record<string, string> = {};
    const segments = currentPath.split('/').filter(Boolean);

    // If path is /tools/:slug
    if (segments.length === 2 && segments[0] === 'tools') {
      // Sanitize slug parameter to prevent parameter pollution
      paramMap.slug = encodeURIComponent(segments[1]);
    }

    return paramMap;
  }, [currentPath]);

  const value = useMemo(
    () => ({
      currentPath,
      navigate,
      params,
      searchQuery
    }),
    [currentPath, params, searchQuery]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  activeClassName?: string;
  exact?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  to,
  replace = false,
  className = '',
  activeClassName = '',
  exact = false,
  children,
  onClick,
  rel,
  target,
  ...props
}) => {
  const { currentPath, navigate } = useRouter();

  // Validate URL safety
  const safeTarget = sanitizeUrl(to, '#');
  const isExternal = safeTarget.startsWith('http://') || safeTarget.startsWith('https://');

  // Prevent reverse tabnabbing on external or target="_blank" links
  const computedRel = target === '_blank' || isExternal
    ? `${rel || ''} noopener noreferrer`.trim()
    : rel;

  const isActive = exact ? currentPath === to : currentPath === to || (to !== '/' && currentPath.startsWith(to));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If dangerous scheme was passed, prevent any execution
    if (!isSafeUrl(to)) {
      e.preventDefault();
      return;
    }

    // Let browser handle external links, open in new tab, or modifier clicks
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      target === '_blank' ||
      isExternal ||
      to.startsWith('mailto:') ||
      to.startsWith('tel:')
    ) {
      if (onClick) onClick(e);
      return;
    }

    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to, { replace });
  };

  const combinedClass = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a
      href={safeTarget}
      onClick={handleClick}
      rel={computedRel}
      target={target}
      className={combinedClass}
      {...props}
    >
      {children}
    </a>
  );
};


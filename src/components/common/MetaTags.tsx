import React, { useEffect } from 'react';
import { updateSeoMetadata, SeoConfig } from '../../utils/seo';

export interface MetaTagsProps extends SeoConfig {
  children?: React.ReactNode;
}

/**
 * Declarative Dynamic Meta Tag Manager (Lightweight React Helmet pattern)
 * Directly manages document.title, description, Open Graph tags, Twitter cards,
 * canonical links, and Schema.org JSON-LD for individual pages and tools.
 */
export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  canonicalPath,
  type = 'website',
  image,
  noIndex,
  jsonLd
}) => {
  useEffect(() => {
    updateSeoMetadata({
      title,
      description,
      canonicalPath,
      type,
      image,
      noIndex,
      jsonLd
    });
  }, [title, description, canonicalPath, type, image, noIndex, jsonLd]);

  return null;
};

export type ToolCategory = 'finance' | 'student' | 'documents' | 'everyday';

export type ToolStatus = 'planned' | 'in_development' | 'active' | 'implemented';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  icon: string;
  keywords: string[];
  status: ToolStatus;
  route: string;
  summary?: string;
  targetAudience?: string[];
  plannedFeatures?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategoryItem {
  id: ToolCategory;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  route: string;
  toolCount?: number;
}

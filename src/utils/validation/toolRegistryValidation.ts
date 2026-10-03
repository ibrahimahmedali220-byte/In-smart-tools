/**
 * Centralized Tool Registry Validation Engine
 * 
 * Verifies consistency and structural integrity of the tools directory:
 * - Ensures all required metadata fields are populated.
 * - Detects duplicate tool IDs, slugs, or routes.
 * - Enforces valid category membership.
 * - Validates route syntax.
 * - Verifies that tools marked 'implemented' have valid routes and metadata.
 */

import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolItem, ToolCategory } from '../../types/tool';

export interface ValidationIssue {
  toolId?: string;
  field?: string;
  message: string;
}

export interface RegistryValidationReport {
  isValid: boolean;
  totalTools: number;
  implementedCount: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

const VALID_CATEGORIES = new Set<ToolCategory>(['finance', 'student', 'documents', 'everyday']);

export function validateToolRegistry(tools: ToolItem[] = TOOLS): RegistryValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenRoutes = new Set<string>();

  let implementedCount = 0;

  for (const tool of tools) {
    // 1. Check ID
    if (!tool.id || !tool.id.trim()) {
      errors.push({ field: 'id', message: 'Tool is missing an ID.' });
    } else if (seenIds.has(tool.id)) {
      errors.push({ toolId: tool.id, field: 'id', message: `Duplicate tool ID detected: '${tool.id}'` });
    } else {
      seenIds.add(tool.id);
    }

    // 2. Check Name
    if (!tool.name || !tool.name.trim()) {
      errors.push({ toolId: tool.id, field: 'name', message: 'Tool name is missing or empty.' });
    }

    // 3. Check Slug
    if (!tool.slug || !tool.slug.trim()) {
      errors.push({ toolId: tool.id, field: 'slug', message: 'Tool slug is missing or empty.' });
    } else if (seenSlugs.has(tool.slug)) {
      errors.push({ toolId: tool.id, field: 'slug', message: `Duplicate tool slug detected: '${tool.slug}'` });
    } else {
      seenSlugs.add(tool.slug);
    }

    // 4. Check Category
    if (!tool.category || !VALID_CATEGORIES.has(tool.category)) {
      errors.push({
        toolId: tool.id,
        field: 'category',
        message: `Invalid category '${tool.category}'. Must be one of: ${Array.from(VALID_CATEGORIES).join(', ')}`
      });
    }

    // 5. Check Description
    if (!tool.description || tool.description.trim().length < 15) {
      errors.push({
        toolId: tool.id,
        field: 'description',
        message: 'Tool description is missing or too short (< 15 characters).'
      });
    }

    // 6. Check Icon
    if (!tool.icon || !tool.icon.trim()) {
      errors.push({ toolId: tool.id, field: 'icon', message: 'Tool icon name is missing.' });
    }

    // 7. Check Keywords
    if (!Array.isArray(tool.keywords) || tool.keywords.length === 0) {
      errors.push({ toolId: tool.id, field: 'keywords', message: 'Tool must define at least one keyword.' });
    }

    // 8. Check Route
    if (!tool.route || !tool.route.startsWith('/tools/')) {
      errors.push({
        toolId: tool.id,
        field: 'route',
        message: `Invalid route '${tool.route}'. Must start with '/tools/'.`
      });
    } else if (seenRoutes.has(tool.route)) {
      errors.push({ toolId: tool.id, field: 'route', message: `Duplicate route detected: '${tool.route}'` });
    } else {
      seenRoutes.add(tool.route);
    }

    // 9. Status & Implementation check
    if (tool.status === 'implemented') {
      implementedCount++;
      if (!tool.seoTitle || !tool.seoDescription) {
        warnings.push({
          toolId: tool.id,
          message: 'Implemented tool is missing custom seoTitle or seoDescription.'
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    totalTools: tools.length,
    implementedCount,
    errors,
    warnings
  };
}

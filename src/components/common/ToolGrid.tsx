import React from 'react';
import { ToolItem } from '../../types/tool';
import { ToolCard } from './ToolCard';
import { EmptyState } from './EmptyState';

export interface ToolGridProps {
  tools: ToolItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  className?: string;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  emptyTitle = 'No matching tools found',
  emptyDescription = 'Try clearing your search or picking a different category filter.',
  onClearFilters,
  className = ''
}) => {
  if (tools.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onClearFilters ? 'Reset Filters' : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 ${className}`}>
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};

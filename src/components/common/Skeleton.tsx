import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-800/80 rounded animate-pulse motion-reduce:animate-none ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export const ToolCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-4 rounded" />
            <Skeleton className="w-16 h-2.5 rounded" />
          </div>
        </div>
        <Skeleton className="w-6 h-6 rounded-md" />
      </div>
      <div className="space-y-1.5 pt-1">
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-4/5 h-3 rounded" />
      </div>
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="w-20 h-2.5 rounded" />
        <Skeleton className="w-12 h-3 rounded" />
      </div>
    </div>
  );
};

export const ToolGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" aria-label="Loading tools">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl space-y-4">
      <div className="flex items-center gap-3.5">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-32 h-4 rounded" />
          <Skeleton className="w-20 h-3 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-5/6 h-3 rounded" />
      </div>
    </div>
  );
};

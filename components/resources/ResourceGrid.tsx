'use client';

import { Resource } from '@/lib/firestore';
import ResourceCard from './ResourceCard';
import ResourceSkeleton from './ResourceSkeleton';
import { clsx } from 'clsx';

interface ResourceGridProps {
  resources: Resource[];
  loading?: boolean;
  className?: string;
  emptyMessage?: string;
}

export default function ResourceGrid({ 
  resources, 
  loading = false, 
  className,
  emptyMessage = "No resources found. Try adjusting your filters or search terms."
}: ResourceGridProps) {
  if (loading) {
    return (
      <div className={clsx(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ResourceSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={clsx(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      className
    )}>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          className="h-full"
        />
      ))}
    </div>
  );
}
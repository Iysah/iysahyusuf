'use client';

import { clsx } from 'clsx';

interface ResourceSkeletonProps {
  className?: string;
}

export default function ResourceSkeleton({ className }: ResourceSkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
        'animate-pulse',
        className
      )}
    >
      {/* Media Section Skeleton */}
      <div className="aspect-video bg-gray-200" />

      {/* Content Section Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-md w-16" />
          <div className="h-6 bg-gray-200 rounded-md w-20" />
          <div className="h-6 bg-gray-200 rounded-md w-14" />
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
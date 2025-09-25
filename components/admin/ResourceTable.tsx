'use client';

import { useState } from 'react';
import { Resource } from '@/lib/firestore';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface ResourceTableProps {
  resources: Resource[];
  loading?: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

export default function ResourceTable({
  resources,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}: ResourceTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      web: 'bg-blue-100 text-blue-800',
      app: 'bg-green-100 text-green-800',
      design: 'bg-purple-100 text-purple-800',
      development: 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <p className="text-gray-500">No resources found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {resource.mediaType === 'video' ? (
                        <video
                          src={resource.mediaUrl}
                          className="h-12 w-12 rounded-lg object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={resource.mediaUrl}
                          alt={resource.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {resource.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getCategoryColor(resource.category)
                  )}>
                    {resource.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => resource.id && onTogglePublished(resource.id, !resource.isPublished)}
                      className={clsx(
                        'inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full',
                        resource.isPublished
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      )}
                    >
                      {resource.isPublished ? (
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircleIcon className="w-3 h-3 mr-1" />
                      )}
                      {resource.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => resource.id && onToggleFeatured(resource.id, !resource.featured)}
                      className={clsx(
                        'p-1 rounded-full transition-colors',
                        resource.featured
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-yellow-500'
                      )}
                      title={resource.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {resource.featured ? (
                        <StarIconSolid className="w-4 h-4" />
                      ) : (
                        <StarIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(
                    resource.createdAt instanceof Date 
                      ? resource.createdAt 
                      : new Date(resource.createdAt.seconds * 1000), 
                    'MMM d, yyyy'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <a
                      href={resource.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="View resource"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onEdit(resource)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit resource"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => resource.id && handleDelete(resource.id)}
                      disabled={deletingId === resource.id}
                      className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                      title="Delete resource"
                    >
                      {deletingId === resource.id ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <TrashIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
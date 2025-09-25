'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Resource } from '@/lib/firestore';
import MediaUpload from './MediaUpload';
import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';

interface ResourceFormData {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: 'web' | 'app' | 'design' | 'development';
  tags: string;
  resourceUrl: string;
  isPublished: boolean;
  featured: boolean;
}

interface ResourceFormProps {
  resource?: Resource;
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const categories = [
  { value: 'web', label: 'Web' },
  { value: 'app', label: 'App' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
];

export default function ResourceForm({ resource, onSubmit, onCancel, loading }: ResourceFormProps) {
  const [mediaUrl, setMediaUrl] = useState(resource?.mediaUrl || '');
  const [mediaType, setMediaType] = useState<'image' | 'video'>(resource?.mediaType || 'image');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResourceFormData>({
    defaultValues: {
      title: resource?.title || '',
      description: resource?.description || '',
      mediaUrl: resource?.mediaUrl || '',
      mediaType: resource?.mediaType || 'image',
      category: resource?.category || 'web',
      tags: resource?.tags?.join(', ') || '',
      resourceUrl: resource?.resourceUrl || '',
      isPublished: resource?.isPublished ?? true,
      featured: resource?.featured ?? false,
    },
  });

  const watchedValues = watch(['isPublished', 'featured']);

  useEffect(() => {
    setValue('mediaUrl', mediaUrl);
    setValue('mediaType', mediaType);
  }, [mediaUrl, mediaType, setValue]);

  const handleFormSubmit = async (data: ResourceFormData) => {
    if (!mediaUrl) {
      alert('Please upload media for the resource');
      return;
    }

    const formattedData = {
      ...data,
      mediaUrl,
      mediaType,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    await onSubmit(formattedData);
  };

  const handleMediaChange = (url: string, type: 'image' | 'video') => {
    setMediaUrl(url);
    setMediaType(type);
  };

  const handleMediaRemove = () => {
    setMediaUrl('');
    setMediaType('image');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg shadow-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.title ? 'border-red-300' : 'border-gray-300'
          )}
          placeholder="Enter resource title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg shadow-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.description ? 'border-red-300' : 'border-gray-300'
          )}
          placeholder="Describe the resource"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Media Upload */}
      <MediaUpload
        value={mediaUrl}
        onChange={handleMediaChange}
        onRemove={handleMediaRemove}
      />

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg shadow-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.category ? 'border-red-300' : 'border-gray-300'
          )}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          {...register('tags')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tags separated by commas (e.g., react, ui, components)"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate multiple tags with commas
        </p>
      </div>

      {/* Resource URL */}
      <div>
        <label htmlFor="resourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Resource URL *
        </label>
        <input
          type="url"
          id="resourceUrl"
          {...register('resourceUrl', { 
            required: 'Resource URL is required',
            pattern: {
              value: /^https?:\/\/.+/,
              message: 'Please enter a valid URL'
            }
          })}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg shadow-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.resourceUrl ? 'border-red-300' : 'border-gray-300'
          )}
          placeholder="https://example.com"
        />
        {errors.resourceUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.resourceUrl.message}</p>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        {/* Published Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Published
            </label>
            <p className="text-sm text-gray-500">
              Make this resource visible to the public
            </p>
          </div>
          <Switch
            checked={watchedValues[0]}
            onChange={(checked) => setValue('isPublished', checked)}
            className={clsx(
              watchedValues[0] ? 'bg-blue-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            <span
              className={clsx(
                watchedValues[0] ? 'translate-x-6' : 'translate-x-1',
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
              )}
            />
          </Switch>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Featured
            </label>
            <p className="text-sm text-gray-500">
              Highlight this resource in the featured section
            </p>
          </div>
          <Switch
            checked={watchedValues[1]}
            onChange={(checked) => setValue('featured', checked)}
            className={clsx(
              watchedValues[1] ? 'bg-blue-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            <span
              className={clsx(
                watchedValues[1] ? 'translate-x-6' : 'translate-x-1',
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
              )}
            />
          </Switch>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className={clsx(
            'flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg',
            'hover:bg-blue-700 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting || loading ? 'Saving...' : resource ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
}
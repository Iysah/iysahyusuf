'use client';

import { useState, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { CloudArrowUpIcon, XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface MediaUploadProps {
  value?: string;
  onChange: (url: string, type: 'image' | 'video') => void;
  onRemove: () => void;
  className?: string;
}

export default function MediaUpload({ value, onChange, onRemove, className }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  const handleUploadSuccess = (result: any) => {
    const url = result.secure_url;
    const resourceType = result.resource_type;
    const type = resourceType === 'video' ? 'video' : 'image';
    
    setMediaType(type);
    onChange(url, type);
    setUploading(false);
  };

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error);
    setUploading(false);
  };

  const isVideo = value && (value.includes('.mp4') || value.includes('.webm') || value.includes('.mov') || mediaType === 'video');

  return (
    <div className={clsx('space-y-4', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Media Upload
      </label>
      
      {value ? (
        <div className="relative">
          {/* Media Preview */}
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {isVideo ? (
              <video
                src={value}
                className="w-full h-full object-cover"
                controls
                muted
              />
            ) : (
              <img
                src={value}
                alt="Uploaded media"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Media Info */}
          <div className="mt-2 text-sm text-gray-600">
            <p>Type: {isVideo ? 'Video' : 'Image'}</p>
            <p className="truncate">URL: {value}</p>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset="ml_default" // You'll need to create this in Cloudinary
          options={{
            multiple: false,
            resourceType: 'auto',
            maxFileSize: 10000000, // 10MB
            sources: ['local', 'url'],
            folder: 'portfolio-resources',
          }}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                setUploading(true);
                open();
              }}
              disabled={uploading}
              className={clsx(
                'w-full h-64 border-2 border-dashed border-gray-300 rounded-lg',
                'flex flex-col items-center justify-center',
                'text-gray-500 hover:text-gray-700',
                'hover:border-gray-400 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-12 h-12 mb-4" />
                  <p className="text-sm font-medium">Click to upload media</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports images and videos up to 10MB
                  </p>
                </>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
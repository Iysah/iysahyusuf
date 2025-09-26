'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Resource } from '@/lib/firestore';
import { ArrowTopRightOnSquareIcon, PlayIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export default function ResourceCard({ resource, className }: ResourceCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryColors = {
    web: 'bg-blue-100 text-blue-800 border-blue-200',
    app: 'bg-green-100 text-green-800 border-green-200',
    design: 'bg-purple-100 text-purple-800 border-purple-200',
    development: 'bg-orange-100 text-orange-800 border-orange-200',
    ai: 'bg-pink-100 text-pink-800 border-pink-200',
    productivity: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    business: 'bg-red-100 text-red-800 border-red-200',
    learning: 'bg-green-100 text-green-800 border-green-200',
    devops: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const handleVideoHover = (playing: boolean) => {
    setIsVideoPlaying(playing);
  };

  const handleVisitResource = () => {
    window.open(resource.resourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={clsx(
        'group relative bg-white rounded-xl shadow-sm border border-gray-200',
        'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out',
        'overflow-hidden',
        className
      )}
    >
      {/* Media Section */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {resource.mediaType === 'video' ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onMouseEnter={() => handleVideoHover(true)}
            onMouseLeave={() => handleVideoHover(false)}
          >
            {!isVideoPlaying ? (
              <>
                <Image
                  src={`${resource?.mediaUrl}.jpg`} // Cloudinary video thumbnail
                  alt={resource.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <PlayIcon className="w-6 h-6 text-gray-800" />
                  </div>
                </div>
              </>
            ) : (
              <video
                src={resource?.mediaUrl || '/placeholder-video.mp4'}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <Image
            src={imageError ? '/placeholder-image.svg' : resource.mediaUrl}
            alt={resource.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}

        {/* Featured Badge */}
        {resource.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              Featured
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={clsx(
              'text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm',
              categoryColors[resource?.category]
            )}
          >
            {resource.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-gray-400 text-xs px-2 py-1">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Visit Button */}
        <button
          onClick={handleVisitResource}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5',
            'bg-gray-900 text-white rounded-lg font-medium text-sm',
            'hover:bg-gray-800 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          )}
        >
          Visit Resource
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
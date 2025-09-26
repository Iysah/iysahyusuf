'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search resources by title, description, or tags...",
  className,
  debounceMs = 300
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={clsx('relative', className)}>
      <div
        className={clsx(
          'relative flex items-center',
          'bg-white border border-gray-200 rounded-lg mb-2',
          'transition-all duration-200',
          isFocused 
            ? 'border-gray-400 shadow-lg ring-4 ring-gray-100' 
            : 'hover:border-gray-300'
        )}
      >
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={clsx(
            'w-full pl-10 pr-10 py-3 text-gray-900 placeholder-gray-500',
            'bg-transparent border-0 rounded-lg',
            'focus:outline-none focus:ring-0',
            'text-sm md:text-base'
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className={clsx(
              'absolute right-3 flex items-center justify-center',
              'w-6 h-6 text-gray-400 hover:text-gray-600',
              'transition-colors duration-200',
              'focus:outline-none'
            )}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions/Results Count */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-sm text-gray-600">
              Searching for: <span className="font-medium text-gray-900">"{query}"</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
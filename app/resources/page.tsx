'use client';

import { useState, useEffect, useCallback } from 'react';
import { Resource } from '@/lib/firestore';
import ResourceGrid from '@/components/resources/ResourceGrid';
import FilterTabs from '@/components/resources/FilterTabs';
import SearchBar from '@/components/resources/SearchBar';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch featured resources
  const fetchFeaturedResources = useCallback(async () => {
    try {
      setFeaturedLoading(true);
      const response = await fetch('/api/resources?featured=true&limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error fetching featured resources:', error);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  // Fetch resources with filters
  const fetchResources = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setResources([]);
      }

      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '12');

      const response = await fetch(`/api/resources?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setResources(data.resources || []);
        } else {
          setResources(prev => [...prev, ...(data.resources || [])]);
        }
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, searchQuery]);

  // Load more resources
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchResources(false);
  };

  // Initial load
  useEffect(() => {
    fetchFeaturedResources();
    fetchResources(true);
  }, [fetchFeaturedResources, fetchResources]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Resources
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover curated web and app resources, tools, and inspiration for your next project.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search resources by title, description, or tags..."
                className="mb-8"
              />
            </div>

            {/* Filter Tabs */}
            <FilterTabs
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              className="justify-center"
            />
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      {featuredResources.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked resources that stand out for their quality, innovation, and usefulness.
            </p>
          </div>

          <ResourceGrid
            resources={featuredResources}
            loading={featuredLoading}
            className="mb-16"
          />

          {/* Divider */}
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              All Resources
            </h2>
          </div>
        </section>
      )}

      {/* Main Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Results Info */}
        {!loading && (
          <div className="mb-8">
            <p className="text-gray-600">
              {searchQuery ? (
                <>
                  Found <span className="font-medium">{resources.length}</span> resources
                  {activeCategory !== 'all' && (
                    <> in <span className="font-medium">{activeCategory}</span></>
                  )}
                  {searchQuery && (
                    <> for "<span className="font-medium">{searchQuery}</span>"</>
                  )}
                </>
              ) : (
                <>
                  Showing <span className="font-medium">{resources.length}</span> resources
                  {activeCategory !== 'all' && (
                    <> in <span className="font-medium">{activeCategory}</span></>
                  )}
                </>
              )}
            </p>
          </div>
        )}

        {/* Resources Grid */}
        <ResourceGrid
          resources={resources}
          loading={loading}
          emptyMessage={
            searchQuery
              ? `No resources found for "${searchQuery}". Try different keywords or browse all resources.`
              : activeCategory !== 'all'
              ? `No resources found in the ${activeCategory} category. Try browsing all resources.`
              : "No resources available yet. Check back soon for new additions!"
          }
        />

        {/* Load More Button */}
        {hasMore && !loading && resources.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={clsx(
                'inline-flex items-center gap-2 px-6 py-3',
                'bg-white border border-gray-300 rounded-lg',
                'text-gray-700 font-medium',
                'hover:bg-gray-50 hover:border-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Resources
                  <ChevronDownIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
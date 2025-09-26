'use client';

import { useState, useEffect, useCallback } from 'react';
import { Resource } from '@/lib/firestore';
import ResourceTable from '@/components/admin/ResourceTable';
import ResourceForm from '@/components/admin/ResourceForm';
import SearchBar from '@/components/resources/SearchBar';
import FilterTabs from '@/components/resources/FilterTabs';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function AdminResourcesPage() {
  const { getAuthToken } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(async () => {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }, [getAuthToken]);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('admin', 'true'); // Get all resources including unpublished
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);

      const headers = await getAuthHeaders();
      const response = await fetch(`/api/resources?${params.toString()}`, {
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      } else if (response.status === 401) {
        console.error('Authentication failed');
        // Handle authentication error - could redirect to login
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, getAuthHeaders]);

  // Initial load
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Handle form submission
  const handleFormSubmit = async (data: Omit<Resource, 'id' | 'createdAt'>) => {
    try {
      setFormLoading(true);
      const headers = await getAuthHeaders();
      
      if (editingResource) {
        // Update existing resource
        const response = await fetch(`/api/resources/${editingResource.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });

        if (response.ok) {
          await fetchResources();
          setIsFormOpen(false);
          setEditingResource(null);
        } else {
          throw new Error('Failed to update resource');
        }
      } else {
        // Create new resource
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });

        if (response.ok) {
          await fetchResources();
          setIsFormOpen(false);
        } else {
          throw new Error('Failed to create resource');
        }
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        await fetchResources();
      } else {
        throw new Error('Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };

  // Handle toggle published
  const handleTogglePublished = async (id: string, isPublished: boolean) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isPublished }),
      });

      if (response.ok) {
        await fetchResources();
      } else {
        throw new Error('Failed to update resource');
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource. Please try again.');
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ featured }),
      });

      if (response.ok) {
        await fetchResources();
      } else {
        throw new Error('Failed to update resource');
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource. Please try again.');
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingResource(null);
  };

  // Handle new resource
  const handleNewResource = () => {
    setEditingResource(null);
    setIsFormOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Resource Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your portfolio resources, tools, and inspiration
              </p>
            </div>
            <button
              onClick={handleNewResource}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Resource
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <FunnelIcon className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Search Bar - Always visible */}
          <div className="mb-4 lg:mb-0">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search resources by title, description, or tags..."
            />
          </div>

          {/* Filters - Collapsible on mobile, always visible on desktop */}
          <div className={clsx(
            'transition-all duration-300 ease-in-out lg:block',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <div className="pt-4 lg:pt-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="lg:flex-1 lg:max-w-none">
                  {/* Filter label for mobile */}
                  <div className="mb-3 lg:hidden">
                    <label className="text-sm font-medium text-gray-700">Filter by Category</label>
                  </div>
                  <FilterTabs
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </div>
                
                {/* Filter Summary */}
                <div className="flex items-center gap-2 text-sm text-gray-500 lg:ml-4">
                  <span>
                    {resources.length} resource{resources.length !== 1 ? 's' : ''} found
                  </span>
                  {(searchQuery || activeCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">Total Resources</div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {resources.length.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Published Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">Published</div>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {resources.filter(r => r.isPublished).length.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Featured Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">Featured</div>
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {resources.filter(r => r.featured).length.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+15.3%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Draft Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">Drafts</div>
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {resources.filter(r => !r.isPublished).length.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-red-600 font-medium">-2.1%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        {/* Resources Table */}
        <ResourceTable
          resources={resources}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublished={handleTogglePublished}
          onToggleFeatured={handleToggleFeatured}
        />
      </div>

      {/* Form Modal */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </Dialog.Title>
              <button
                onClick={handleFormClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <ResourceForm
                key={editingResource?.id || 'new'}
                resource={editingResource || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormClose}
                loading={formLoading}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      </div>
    </ProtectedRoute>
  );
}
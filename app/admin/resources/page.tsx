'use client';

import { useState, useEffect, useCallback } from 'react';
import { Resource } from '@/lib/firestore';
import ResourceTable from '@/components/admin/ResourceTable';
import ResourceForm from '@/components/admin/ResourceForm';
import SearchBar from '@/components/resources/SearchBar';
import FilterTabs from '@/components/resources/FilterTabs';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('admin', 'true'); // Get all resources including unpublished
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/resources?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Handle form submission
  const handleFormSubmit = async (data: Omit<Resource, 'id' | 'createdAt'>) => {
    try {
      setFormLoading(true);
      
      if (editingResource) {
        // Update existing resource
        const response = await fetch(`/api/resources/${editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
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
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search resources by title, description, or tags..."
              />
            </div>
            <div className="lg:w-auto">
              <FilterTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">
              {resources.length}
            </div>
            <div className="text-sm text-gray-600">Total Resources</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.isPublished).length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {resources.filter(r => r.featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-600">
              {resources.filter(r => !r.isPublished).length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
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
  );
}
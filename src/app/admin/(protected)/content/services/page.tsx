'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/lib/db-storage';
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Modal from '@/components/admin/Modal';

type ActiveTab = 'content' | 'services';

export default function ServicesManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('content');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [pageFormData, setPageFormData] = useState({
    title: '',
    content: '',
  });

  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: [] as string[],
    orderIndex: 0,
    isFeatured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading services data...');
      
      const [servicesRes, pageRes] = await Promise.all([
        fetch('/api/admin/services'),
        fetch('/api/admin/pages?id=services')
      ]);

      console.log('Services response status:', servicesRes.status);
      console.log('Page response status:', pageRes.status);

      if (!servicesRes.ok) {
        const errorText = await servicesRes.text();
        console.error('Services fetch error:', errorText);
        throw new Error(`Failed to fetch services: ${servicesRes.status}`);
      }

      const servicesData = await servicesRes.json();
      console.log('Loaded services:', servicesData);
      setServices(servicesData);

      // Handle page content - might not exist yet
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        console.log('Loaded page content:', pageData);
        setPageFormData({
          title: pageData.title,
          content: pageData.content,
        });
      } else if (pageRes.status === 404) {
        // Page doesn't exist yet - use defaults
        console.log('Services page not found, using defaults');
        const defaultPage = {
          title: 'Our Services',
          content: '<p>We offer comprehensive construction services including residential and commercial projects. Our team of experienced professionals is dedicated to delivering high-quality results that exceed your expectations.</p><p>From initial planning to final completion, we handle every aspect of your construction project with precision and care. Our commitment to quality craftsmanship and attention to detail ensures that your vision becomes reality.</p>',
        };
        setPageFormData({
          title: defaultPage.title,
          content: defaultPage.content,
        });
      } else {
        const errorText = await pageRes.text();
        console.error('Page fetch error:', errorText);
        throw new Error(`Failed to fetch page content: ${pageRes.status}`);
      }

      setError(null);
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error in loadData:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setError(null);

    try {
      const response = await fetch('/api/admin/pages?id=services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        throw new Error(errorData.error || 'Failed to save page content');
      }

      await response.json();
      setSaveMessage('Page content saved successfully!');
      
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving page content:', error);
      setError(error instanceof Error ? error.message : 'Failed to save page content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const url = editingService 
        ? `/api/admin/services?id=${editingService.id}`
        : '/api/admin/services';
      
      console.log('Saving service:', serviceFormData);
      
      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Service save error:', errorData);
        throw new Error(errorData.error || 'Failed to save service');
      }

      const savedService = await response.json();
      console.log('Service saved successfully:', savedService);
      
      await loadData();
      setIsModalOpen(false);
      resetServiceForm();
      setSaveMessage(editingService ? 'Service updated successfully!' : 'Service created successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving service:', error);
      setError(error instanceof Error ? error.message : 'Failed to save service. Please try again.');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features,
      orderIndex: service.orderIndex,
      isFeatured: service.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/admin/services?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete service');
        }

        await loadData();
        setError(null);
        setSaveMessage('Service deleted successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting service:', error);
        setError('Failed to delete service. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/services?id=${id}&action=toggle-featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }

      await loadData();
      setError(null);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setError('Failed to update featured status. Please try again.');
    }
  };

  // const handleMoveService = async (id: number, direction: 'up' | 'down') => {
  //   const index = services.findIndex(s => s.id === id);
  //   if (index === -1) return;
    
  //   if (direction === 'up' && index === 0) return;
  //   if (direction === 'down' && index === services.length - 1) return;

  //   const swapIndex = direction === 'up' ? index - 1 : index + 1;
  //   const currentService = services[index];
  //   const swapService = services[swapIndex];

  //   try {
  //     // Swap order indices
  //     await Promise.all([
  //       fetch(`/api/admin/services?id=${currentService.id}`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ orderIndex: swapService.orderIndex }),
  //       }),
  //       fetch(`/api/admin/services?id=${swapService.id}`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ orderIndex: currentService.orderIndex }),
  //       }),
  //     ]);

  //     await loadData();
  //     setError(null);
  //   } catch (error) {
  //     console.error('Error moving service:', error);
  //     setError('Failed to reorder services. Please try again.');
  //   }
  // };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceFormData({
      title: '',
      description: '',
      icon: '',
      features: [],
      orderIndex: services.length,
      isFeatured: false
    });
  };

  const addFeature = () => {
    setServiceFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setServiceFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setServiceFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
        {activeTab === 'services' && (
          <button
            onClick={() => {
              resetServiceForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Service
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {saveMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {saveMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`${
              activeTab === 'content'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Page Content
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`${
              activeTab === 'services'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Service Callouts ({services.length})
          </button>
        </nav>
      </div>

      {/* Page Content Editor */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Services Page Content
            </h2>
            <p className="text-gray-600 mb-6">
              This text appears on the left side of the services page, next to the image.
            </p>
          </div>

          <form onSubmit={handleSavePageContent} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Page Title
              </label>
              <input
                type="text"
                id="title"
                value={pageFormData.title}
                onChange={(e) => setPageFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <RichTextEditor
                value={pageFormData.content}
                onChange={(value) => setPageFormData(prev => ({ ...prev, content: value }))}
                placeholder="Enter your services description here..."
                id="content"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use the toolbar to format your text with bold, italic, and underline.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-medium ${
                  isSaving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Preview</h3>
            <div className="border p-4 rounded-md bg-gray-50">
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: pageFormData.content || '' }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Services Manager */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Use the arrows to reorder services. Only services marked as &quot;Featured&quot; (⭐) will appear on the public services page (max 3).
            </p>
          </div> */}

          {services.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 mb-4">No services yet. Create your first service!</p>
              <button
                onClick={() => {
                  resetServiceForm();
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Service
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md p-6 flex items-start gap-4"
                >
                  {/* Reorder Buttons */}
                  {/* <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveService(service.id, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Move up"
                    >
                      <ArrowUpIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleMoveService(service.id, 'down')}
                      disabled={index === services.length - 1}
                      className={`p-1 rounded ${
                        index === services.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Move down"
                    >
                      <ArrowDownIcon className="h-5 w-5" />
                    </button>
                  </div> */}

                  {/* Service Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500 font-mono">#{index + 1}</span>
                      <h2 className="text-xl text-black font-semibold">{service.title}</h2>
                      <button
                        onClick={() => handleToggleFeatured(service.id, service.isFeatured)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        title={service.isFeatured ? 'Featured' : 'Not featured'}
                      >
                        {service.isFeatured ? (
                          <StarIconSolid className="h-5 w-5" />
                        ) : (
                          <StarIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    {service.features.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Service Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetServiceForm();
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleServiceSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-tcs-navy-900 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              value={serviceFormData.title}
              onChange={(e) => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              style={{ color: '#000000' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Description
            </label>
            <textarea
              value={serviceFormData.description}
              onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              style={{ color: '#000000' }}
              rows={3}
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Icon (Heroicon name)
            </label>
            <input
              type="text"
              value={serviceFormData.icon}
              onChange={(e) => setServiceFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              style={{ color: '#000000' }}
              placeholder="e.g., WrenchScrewdriverIcon"
            />
          </div> */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Features
            </label>
            <div className="space-y-2">
              {serviceFormData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    style={{ color: '#000000' }}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                Add Feature
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={serviceFormData.isFeatured}
              onChange={(e) => setServiceFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold" style={{ color: '#000000' }}>
              Featured Service (appears on public page)
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetServiceForm();
              }}
              className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

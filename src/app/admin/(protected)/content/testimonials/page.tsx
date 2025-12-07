'use client';

import { useState, useEffect } from 'react';
import { Testimonial } from '@/lib/db-storage';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Modal from '@/components/admin/Modal';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
    projectType: '',
    imagePath: '',
    isFeatured: false
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      setTestimonials(data);
      setError(null);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTestimonial 
        ? `/api/admin/testimonials?id=${editingTestimonial.id}`
        : '/api/admin/testimonials';
      
      const response = await fetch(url, {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save testimonial');
      }

      await loadTestimonials();
      setIsModalOpen(false);
      resetForm();
      setError(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      setError('Failed to save testimonial. Please try again.');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
      rating: testimonial.rating,
      projectType: testimonial.projectType,
      imagePath: testimonial.imagePath,
      isFeatured: testimonial.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await fetch(`/api/admin/testimonials?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete testimonial');
        }

        await loadTestimonials();
        setError(null);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        setError('Failed to delete testimonial. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}&action=toggle-featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }

      await loadTestimonials();
      setError(null);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setError('Failed to update featured status. Please try again.');
    }
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      quote: '',
      rating: 5,
      projectType: '',
      imagePath: '',
      isFeatured: false
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Testimonial
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-md p-6 flex items-start gap-6"
          >
            {/* {testimonial.imagePath && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={testimonial.imagePath}
                  alt={testimonial.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )} */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl text-gray-700 font-semibold">{testimonial.name}</h2>
                <button
                  onClick={() => handleToggleFeatured(testimonial.id, testimonial.isFeatured)}
                  className="text-yellow-500 hover:text-yellow-600 transition-colors"
                >
                  {/* {testimonial.isFeatured ? (
                    <StarIconSolid className="h-5 w-5" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
                  )} */}
                </button>
              </div>
              <p className="text-gray-600 mb-1">{testimonial.role}</p>
              {testimonial.projectType && (
                <p className="text-sm text-gray-500 mb-3">Project: {testimonial.projectType}</p>
              )}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 italic">&quot;{testimonial.quote}&quot;</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              style={{ color: '#000000' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Quote
            </label>
            <RichTextEditor
              value={formData.quote}
              onChange={(value) => setFormData(prev => ({ ...prev, quote: value }))}
              placeholder="Enter testimonial quote..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Use the toolbar to format text with bold, italic, and underline.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Rating (1-5)
            </label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) }))}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              style={{ color: '#000000' }}
              min="1"
              max="5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              Project Type
            </label>
            <input
              type="text"
              value={formData.projectType}
              onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              style={{ color: '#000000' }}
              placeholder="e.g., Kitchen Remodel, Bathroom Renovation"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 
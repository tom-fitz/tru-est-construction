'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContent } from '@/lib/db-storage';
import Link from 'next/link';

export default function ContentEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load page content on client-side
    const loadPage = async () => {
      try {
        const response = await fetch(`/api/admin/pages?id=${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Page not found');
          } else {
            throw new Error('Failed to fetch page content');
          }
          return;
        }
        const pageContent = await response.json();
        setPage(pageContent);
        setFormData({
          title: pageContent.title,
          content: pageContent.content,
        });
        setError(null);
      } catch (err) {
        setError('Failed to load page content. Please try again.');
        console.error('Error loading page content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setError(null);

    try {
      const response = await fetch(`/api/admin/pages?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Error: Page not found');
        } else {
          throw new Error('Failed to save content');
        }
        return;
      }

      const updatedPage = await response.json();
      setPage(updatedPage);
      setSaveMessage('Content saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (err) {
      setError('Error saving content. Please try again.');
      console.error('Error saving content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // For a real application, you might want to create a special preview mode
    // For now, just open the page in a new tab
    const pathMap: Record<string, string> = {
      'home': '/',
      'about': '/about',
      'contact': '/contact',
    };

    const path = pathMap[params.id] || '/';
    window.open(path, '_blank');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Page not found!</p>
        <Link 
          href="/admin/content"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Back to Content Management
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Edit: {page.title}</h1>
        <div className="space-x-2">
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Preview
          </button>
          <Link 
            href="/admin/content"
            className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content (HTML)
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
              required
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              {saveMessage && (
                <span className={saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
                  {saveMessage}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Content Preview</h2>
        <div className="border p-4 rounded-md prose max-w-none text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: formData.content }} />
        </div>
      </div>
    </div>
  );
} 
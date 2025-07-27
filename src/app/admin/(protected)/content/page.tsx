'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContent } from '@/lib/db-storage';

export default function ContentManagement() {
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load pages on client-side
    const loadPages = async () => {
      try {
        const response = await fetch('/api/admin/pages');
        if (!response.ok) {
          throw new Error('Failed to fetch pages');
        }
        const allPages = await response.json();
        setPages(allPages);
        setError(null);
      } catch (err) {
        setError('Failed to load pages. Please try again.');
        console.error('Error loading pages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPages();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Select a page to edit its content. Changes will be immediately visible on your website.
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {Object.values(pages).map((page) => (
              <li key={page.id}>
                <Link 
                  href={`/admin/content/${page.id}`}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{page.title}</h3>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(page.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-blue-500">Edit &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 
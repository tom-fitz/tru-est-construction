/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { PageContent } from '@/lib/db-storage';
import Link from 'next/link';

interface HomePageContent {
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyContent: string;
}

type HomePageTab = 'hero' | 'story';

export default function ContentEditor({ params }: { params: any }) {
  const [page, setPage] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [homePageData, setHomePageData] = useState<HomePageContent>({
    heroTitle: 'Construction Management',
    heroDescription: 'With over 45 years in General Contracting experience, we work exclusively for you, looking out for your best interest.',
    storyTitle: 'Building Excellence Since 1978',
    storyContent: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<HomePageTab>('hero');

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

        // If this is the homepage, parse the content into sections
        if (params.id === 'home') {
          try {
            const parsedContent = JSON.parse(pageContent.content);
            setHomePageData(prev => ({
              ...prev,
              ...parsedContent,
            }));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // If content isn't in the new format, use the old content as storyContent
            setHomePageData(prev => ({
              ...prev,
              storyContent: pageContent.content,
            }));
          }
        }
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
    if (params.id === 'home') {
      setHomePageData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setError(null);

    try {
      const contentToSave = params.id === 'home' 
        ? JSON.stringify(homePageData)
        : formData.content;

      const response = await fetch(`/api/admin/pages?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: contentToSave,
        }),
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
      const timer = setTimeout(() => {
        setSaveMessage('');
      }, 3000);

      // Cleanup timer on component unmount or re-render
      return () => clearTimeout(timer);
    } catch (err) {
      setError('Error saving content. Please try again.');
      console.error('Error saving content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
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

  const renderHomePageEditor = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`${
              activeTab === 'hero'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`${
              activeTab === 'story'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Our Story Section
          </button>
        </nav>
      </div>

      {/* Hero Section Editor */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Hero Title
            </label>
            <input
              type="text"
              id="heroTitle"
              name="heroTitle"
              value={homePageData.heroTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Hero Description
            </label>
            <textarea
              id="heroDescription"
              name="heroDescription"
              value={homePageData.heroDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900"
              required
            />
          </div>
        </div>
      )}

      {/* Story Section Editor */}
      {activeTab === 'story' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="storyTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              id="storyTitle"
              name="storyTitle"
              value={homePageData.storyTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="storyContent" className="block text-sm font-medium text-gray-700 mb-1">
              Content (HTML)
            </label>
            <textarea
              id="storyContent"
              name="storyContent"
              value={homePageData.storyContent}
              onChange={handleChange}
              rows={15}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono text-sm text-gray-900"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              You can use HTML tags for formatting. For example: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStandardEditor = () => (
    <>
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
    </>
  );

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
          {params.id === 'home' ? renderHomePageEditor() : renderStandardEditor()}

          <div className="mt-8 flex items-center justify-between">
            <div>
              {saveMessage && (
                <span className="text-green-500">
                  {saveMessage}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded ${
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
          {params.id === 'home' ? (
            activeTab === 'hero' ? (
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">{homePageData.heroTitle}</h1>
                <p className="text-xl">{homePageData.heroDescription}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{homePageData.storyTitle}</h2>
                <div dangerouslySetInnerHTML={{ __html: homePageData.storyContent || '' }} />
              </div>
            )
          ) : (
            <div dangerouslySetInnerHTML={{ __html: formData.content || '' }} />
          )}
        </div>
      </div>
    </div>
  );
} 
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/db-storage';
import Link from 'next/link';

export default function BlogEditor({ params }: { params: any }) {
  const router = useRouter();
  const isNewPost = params.id === 'new';
  const postId = isNewPost ? null : parseInt(params.id, 10);
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(!isNewPost);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    published: false,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    // Load blog post on client-side for editing
    if (!isNewPost) {
      const loadPost = async () => {
        try {
          const response = await fetch(`/api/admin/blog?id=${postId}`);
          if (!response.ok) {
            if (response.status === 404) {
              setError('Blog post not found');
            } else {
              throw new Error('Failed to fetch blog post');
            }
            return;
          }
          const existingPost = await response.json();
          setPost(existingPost);
          setFormData({
            title: existingPost.title,
            slug: existingPost.slug,
            excerpt: existingPost.excerpt,
            content: existingPost.content,
            date: existingPost.date,
            published: existingPost.published,
          });
          setError(null);
        } catch (err) {
          setError('Failed to load blog post. Please try again.');
          console.error('Error loading blog post:', err);
        } finally {
          setIsLoading(false);
        }
      };

      loadPost();
    }
  }, [isNewPost, postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-generate slug from title if slug hasn't been manually edited
    if (name === 'title' && !slugEdited) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim(),
      }));
    }

    // Mark slug as manually edited
    if (name === 'slug') {
      setSlugEdited(true);
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      published: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setError(null);

    try {
      if (isNewPost) {
        // Create new post
        const response = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create blog post');
        }

        const newPost = await response.json();
        setPost(newPost);
        setSaveMessage('Blog post created successfully!');
        
        // Redirect to edit page for the new post
        setTimeout(() => {
          router.push(`/admin/blog/${newPost.id}`);
        }, 1500);
      } else {
        // Update existing post
        const response = await fetch(`/api/admin/blog?id=${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Error: Post not found');
          } else {
            throw new Error('Failed to update blog post');
          }
          return;
        }

        const updatedPost = await response.json();
        setPost(updatedPost);
        setSaveMessage('Blog post updated successfully!');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (err) {
      setError('Error saving blog post. Please try again.');
      console.error('Error saving blog post:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // For a real application, you might want to create a special preview mode
    if (!isNewPost && post) {
      window.open(`/blog/${post.slug}`, '_blank');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isNewPost && !post) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Blog post not found!</p>
        <Link 
          href="/admin/blog"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Back to Blog Management
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewPost ? 'Create New Blog Post' : `Edit: ${post?.title}`}
        </h1>
        <div className="space-x-2">
          {!isNewPost && (
            <button
              type="button"
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Preview
            </button>
          )}
          <Link 
            href="/admin/blog"
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
              Post Title
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
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in the URL: /blog/{formData.slug}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date
            </label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (Summary)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
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
              rows={12}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleCheckbox}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Publish this post</span>
            </label>
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
              {isSaving ? 'Saving...' : isNewPost ? 'Create Post' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg font-semibold mb-3">Content Preview</h2>
        <div className="border p-4 rounded-md prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formData.content }} />
        </div>
      </div>
    </div>
  );
} 
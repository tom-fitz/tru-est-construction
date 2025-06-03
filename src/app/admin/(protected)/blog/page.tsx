'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/db-storage';

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load blog posts on client-side
    const loadBlogPosts = async () => {
      try {
        const response = await fetch('/api/admin/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const allPosts = await response.json();
        setPosts(allPosts);
        setError(null);
      } catch (err) {
        setError('Failed to load blog posts. Please try again.');
        console.error('Error loading blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const handleDeletePost = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/blog?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        setPosts(posts.filter(post => post.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete post. Please try again.');
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog?id=${id}&action=toggle-publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post status');
      }

      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post.id === id ? updatedPost : post
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update post status. Please try again.');
      console.error('Error updating post status:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Blog Management</h1>
        <Link 
          href="/admin/blog/new"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Manage your blog posts here. You can create, edit, publish/unpublish, and delete posts.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No blog posts found. Create a new one!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 whitespace-nowrap">
                      <Link 
                        href={`/admin/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`text-sm ${
                          post.published 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      <Link 
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
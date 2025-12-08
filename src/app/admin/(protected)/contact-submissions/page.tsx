'use client';

import { useState, useEffect } from 'react';
import { ContactSubmission } from '@/lib/db-storage';
import { TrashIcon, EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ContactSubmission['status'] | 'all'>('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/contact-submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch contact submissions');
      }
      const data = await response.json();
      setSubmissions(data);
      setError(null);
    } catch (error) {
      console.error('Error loading contact submissions:', error);
      setError('Failed to load contact submissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: ContactSubmission['status']) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await loadSubmissions();
      setError(null);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const response = await fetch(`/api/admin/contact-submissions?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete submission');
        }

        await loadSubmissions();
        setError(null);
      } catch (error) {
        console.error('Error deleting submission:', error);
        setError('Failed to delete submission. Please try again.');
      }
    }
  };

  const filteredSubmissions = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter);

  const getStatusColor = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
        <p className="text-gray-600">
          Manage and respond to contact form submissions
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`${
                filter === status
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {status}
              {status === 'all' && ` (${submissions.length})`}
              {status !== 'all' && ` (${submissions.filter(s => s.status === status).length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No contact submissions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {submission.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <a href={`mailto:${submission.email}`} className="hover:text-blue-600">
                      {submission.email}
                    </a>
                    {submission.phone && (
                      <a href={`tel:${submission.phone}`} className="hover:text-blue-600">
                        {submission.phone}
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
              </div>

              <div className="flex gap-2">
                {submission.status === 'new' && (
                  <button
                    onClick={() => handleStatusChange(submission.id, 'read')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Mark as Read
                  </button>
                )}
                {(submission.status === 'new' || submission.status === 'read') && (
                  <button
                    onClick={() => handleStatusChange(submission.id, 'replied')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    Mark as Replied
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange(submission.id, 'archived')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Archive
                </button>
                {submission.status === 'archived' && (
                  <button
                    onClick={() => handleStatusChange(submission.id, 'new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


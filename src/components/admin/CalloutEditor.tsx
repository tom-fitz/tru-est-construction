'use client';

import { useState } from 'react';
import { Callout, CalloutItem } from '@/lib/db-storage';

interface CalloutEditorProps {
  callout: Callout;
  onSave: (data: Pick<Callout, 'title' | 'items'>) => Promise<void>;
}

export default function CalloutEditor({ callout, onSave }: CalloutEditorProps) {
  const [title, setTitle] = useState(callout.title);
  const [items, setItems] = useState<CalloutItem[]>(callout.items);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (index: number, field: keyof CalloutItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave({ title, items });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save callout');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Section Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Callout Item {index + 1}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor={`item-title-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id={`item-title-${index}`}
                  value={item.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor={`item-description-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id={`item-description-${index}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface PageContent {
  id: string;
  pageId: string;
  content: string;
}

const PAGES = [
  { id: 'about', name: 'About Page' },
  { id: 'services', name: 'Services Page' },
  { id: 'contact', name: 'Contact Page' },
  { id: 'testimonials', name: 'Testimonials Page' },
];

export default function ContentEditor() {
  const { status } = useSession();
  const router = useRouter();
  const [contents, setContents] = useState<Record<string, PageContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const contentsData: Record<string, PageContent> = {};
        await Promise.all(
          PAGES.map(async (page) => {
            const response = await fetch(`/api/admin/content/${page.id}`);
            if (response.ok) {
              const data = await response.json();
              contentsData[page.id] = data;
            }
          })
        );
        setContents(contentsData);
      } catch (error) {
        console.error('Error fetching contents:', error);
        toast.error('Failed to load page contents');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchContents();
    }
  }, [status]);

  const handleSubmit = async (pageId: string, content: string) => {
    try {
      const response = await fetch(`/api/admin/content/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const updatedContent = await response.json();
        setContents(prev => ({
          ...prev,
          [pageId]: updatedContent
        }));
        toast.success('Content updated successfully');
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Page Content</h1>
      <div className="grid gap-8">
        {PAGES.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <CardTitle>{page.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={contents[page.id]?.content || ''}
                onChange={(content: string) => {
                  handleSubmit(page.id, content);
                }}
                placeholder={`Enter content for ${page.name}...`}
                id={`editor-${page.id}`}
              />
              <p className="mt-2 text-sm text-gray-500">
                Changes are saved automatically. Use the toolbar to format text with bold, italic, and underline.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

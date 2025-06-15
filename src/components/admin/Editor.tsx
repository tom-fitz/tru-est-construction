'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

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
      <h1 className="text-3xl font-bold mb-8">Manage Page Content</h1>
      <div className="grid gap-8">
        {PAGES.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <CardTitle>{page.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                initialValue={contents[page.id]?.content || ''}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={(content: string) => {
                  handleSubmit(page.id, content);
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
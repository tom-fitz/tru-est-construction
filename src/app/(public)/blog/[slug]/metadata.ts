import { Metadata } from 'next';
import { storageService } from '@/lib/storage';

// Define a reusable function to generate metadata for a blog post
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  // This will only work during build time or server-side
  // For production, you would want to use a proper database
  const post = storageService.getBlogPost(params.slug);
  
  if (!post || !post.published) {
    return {
      title: 'Post Not Found - Tru-Est Construction',
      description: 'The blog post you were looking for could not be found.',
    };
  }
  
  return {
    title: `${post.title} - Tru-Est Construction Blog`,
    description: post.excerpt,
  };
} 
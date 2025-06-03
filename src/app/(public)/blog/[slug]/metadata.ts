import { Metadata } from 'next';
import { getBlogPost, BlogPost } from '@/lib/db-storage';

// Define a reusable function to generate metadata for a blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Use the async database function
  const post: BlogPost | undefined = await getBlogPost(params.slug);
  
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
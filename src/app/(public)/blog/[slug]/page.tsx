/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBlogPost } from '@/lib/db-storage';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BlogPost({ params }: { params: any }) {
  const slug = params.slug;
  // Get the blog post from the database
  const post = await getBlogPost(slug);
  if (!post || !post.published) {
    notFound();
  }
  // Get related posts (optional: could be optimized)
  // For now, just fetch all and filter
  // You could use getBlogPosts() and filter, or add a new method
  // For simplicity, we'll skip related posts for now or you can add it back
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      {/* <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <p className="text-center mb-2">
            <Link href="/blog" className="text-yellow-600 dark:text-yellow-400 hover:underline">
              ← Back to Blog
            </Link>
          </p>
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">{post.title}</h1>
          <p className="mt-4 text-center text-yellow-600 dark:text-yellow-400">{post.date}</p>
        </div>
      </section> */}

      <section className="relative h-[300px] w-full">
        <div className="absolute inset-0 bg-gray-900/70 z-10" />
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gray-500" />
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
            <div className="text-center text-white">
            <p className="text-center mb-2">
              <Link href="/blog" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                ← Back to Blog
              </Link>
            </p>
              <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">{post.title}</h1>
              <p className="mt-4 text-center text-yellow-600 dark:text-yellow-400">{post.date}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Post Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Featured Image */}
            <div className="relative h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg mb-8">
              {/* Placeholder for blog post image - replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <span>Blog Post Image Placeholder</span>
              </div>
            </div>
            {/* Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
            {/* Share Links and Related Posts can be added back here if needed */}
          </div>
        </div>
      </section>
    </div>
  );
} 
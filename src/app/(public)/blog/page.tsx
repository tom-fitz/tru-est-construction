import { getBlogPosts } from '@/lib/db-storage';
import Image from "next/image";
import Link from "next/link";

export default async function Blog() {
  // Get all blog posts from the database
  const posts = await getBlogPosts();
  
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Blog</h1>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and insights from the construction industry
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">No blog posts available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48 bg-gray-300 dark:bg-gray-600">
                    {/* Placeholder for blog post image - replace with actual images */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <span>Blog Image Placeholder</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-2">{post.date}</p>
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      <Link href={`/blog/${post.slug}`} className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-yellow-600 dark:text-yellow-400 font-medium hover:text-yellow-700 dark:hover:text-yellow-300 inline-flex items-center"
                    >
                      Read more
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 
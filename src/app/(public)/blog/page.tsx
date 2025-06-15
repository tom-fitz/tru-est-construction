import { getBlogPosts } from '@/lib/db-storage';
import Link from "next/link";

export default async function Blog() {
  // Get all blog posts from the database
  const posts = await getBlogPosts();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gray-900/70 z-10" />
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gray-500" />
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">Stay updated with the latest news, tips, and insights from the construction industry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">No blog posts available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-48 bg-gray-300 dark:bg-gray-600">
                    {/* Placeholder for blog post image - replace with actual images */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
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
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-yellow-600 dark:text-yellow-400 font-medium hover:text-yellow-700 dark:hover:text-yellow-300 inline-flex items-center"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* CTA Section */}
      <section className="py-16 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Want to Learn More?</h2>
          <p className="text-xl mb-8 text-gray-900">Stay updated with our latest insights and construction tips</p>
          <a 
            href="/contact" 
            className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
          >
            Subscribe to Our Blog
          </a>
        </div>
      </section>
    </div>
  );
} 
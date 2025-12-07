import { getBlogPosts, getPageContent } from '@/lib/db-storage';
import Link from "next/link";
import PageHeader from '@/components/PageHeader';
import CallToAction from '@/components/CallToAction';

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

export default async function Blog() {
  // Get all blog posts from the database
  const posts = await getBlogPosts();
  const page = await getPageContent('blog');
  
  // Parse page content as JSON
  let pageTitle = 'Our Blog';
  let pageSubtitle = 'Stay updated with the latest news, tips, and insights from the construction industry';
  
  try {
    const parsed = JSON.parse(page?.content || '{}');
    pageTitle = parsed.pageTitle || pageTitle;
    pageSubtitle = parsed.pageSubtitle || pageSubtitle;
  } catch {
    // Use defaults if parsing fails
  }
  
  return (
    <div className="flex flex-col">
      <PageHeader 
        title={pageTitle} 
        description={pageSubtitle}
      />

      {/* Blog Posts */}
      <section className="py-16 bg-white dark:bg-tcs-navy-900">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black dark:text-gray-300" style={{ color: '#000000' }}>No blog posts available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                  {/* <div className="relative h-48 bg-gray-300 dark:bg-gray-600">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <span>Blog Image Placeholder</span>
                    </div>
                  </div> */}
                  <div className="p-6">
                    <p className="text-tcs-blue text-sm mb-2">{post.date}</p>
                    <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                      <Link href={`/blog/${post.slug}`} className="hover:text-tcs-blue transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-black dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-tcs-blue font-medium hover:text-tcs-blue-600 inline-flex items-center"
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

      <CallToAction 
        title="Want to Learn More?"
        description="Stay updated with our latest insights and construction tips"
        buttonText="Subscribe to Our Blog"
      />
    </div>
  );
} 
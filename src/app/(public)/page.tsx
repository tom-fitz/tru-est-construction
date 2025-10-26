import { getPageContent, getBlogPosts } from '@/lib/db-storage';
import Link from "next/link";
import Image from "next/image";

interface HomePageContent {
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyContent: string;
}

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

export default async function Home() {
  // Get the home page content and recent blog posts from the database
  const [page, posts] = await Promise.all([
    getPageContent('home'),
    getBlogPosts()
  ]);
  
  // Parse the homepage content
  let homeContent: HomePageContent;
  try {
    homeContent = JSON.parse(page?.content || '{}') as HomePageContent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Fallback to old format
    homeContent = {
      heroTitle: 'Construction Management',
      heroDescription: 'With over 45 years in General Contracting experience, we work exclusively for you, looking out for your best interest.',
      storyTitle: 'Building Excellence Since 1978',
      storyContent: page?.content || '',
    };
  }
  
  const recentPosts = posts.slice(0, 3); // Get only the 3 most recent posts
  
  return (
    <div className="flex flex-col">
      {/* Hero Section with Header Image */}
      <section className="relative min-h-[85vh] w-full flex items-center overflow-hidden bg-white">
        {/* Background Image Container */}
        <div className="absolute inset-0 -m-[5%]">
          <Image
            src="/hero_two.webp"
            alt="Construction and Engineering"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
        </div>

        {/* Darker Overlay for Better Contrast */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content Container */}
        <div className="relative w-full">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {homeContent.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-xl drop-shadow-md">
                {homeContent.heroDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-8 py-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  Start Your Project
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/about" 
                  className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/40 shadow-lg"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-100 relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/callout_01.jpg"
                alt="Tru-Est Construction Team"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-yellow-600 font-semibold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{homeContent.storyTitle}</h2>
              <div className="prose prose-lg text-gray-800 mb-8">
                <div dangerouslySetInnerHTML={{ __html: homeContent.storyContent || '' }} />
              </div>
              <Link 
                href="/about" 
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Learn More About Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-24 bg-gray-800 relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-semibold tracking-wider uppercase text-sm mb-4 block">Latest Updates</span>
            <h2 className="text-4xl font-bold text-white mb-6">Recent Blog Posts</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and insights from the construction industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
                <div className="p-6">
                  <p className="text-yellow-600 text-sm mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    <Link href={`/blog/${post.slug}`} className="hover:text-yellow-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-yellow-600 font-medium hover:text-yellow-700 inline-flex items-center"
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

          <div className="text-center mt-12">
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              View All Blog Posts
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

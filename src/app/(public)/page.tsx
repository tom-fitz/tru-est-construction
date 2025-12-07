import { getPageContent, getBlogPosts, getFeaturedServices } from '@/lib/db-storage';
import Link from "next/link";
import Image from "next/image";
import CallToAction from '@/components/CallToAction';

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
  const featuredServices = await getFeaturedServices();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section with Graph Paper Texture - Dark Theme */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-tcs-navy-900 via-tcs-navy-800 to-gray-900">
        {/* Graph Paper Background Layers with Higher Opacity and Dark Styling */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url('/graph-paper.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
            filter: 'invert(1) brightness(0.3) contrast(1.2)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url('/graph-paper.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
            transform: 'rotate(45deg)',
            filter: 'invert(1) brightness(0.25) contrast(1.1)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('/graph-paper.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            filter: 'invert(1) brightness(0.2) contrast(1.1)',
          }}
        />

        {/* Dark gradient overlay for depth and subtle blue tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-tcs-navy-900/80 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tcs-blue-900/10 to-transparent" />

        {/* Content Container - Centered */}
        <div className="relative w-full z-10 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              {/* Large Centered Logo */}
              <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/tcs_logo_transparent_buffer.png"
                  alt="TCS Construction Management"
                  width={600}
                  height={280}
                  className="h-auto w-full max-w-2xl mx-auto drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Title and Description */}
              <div className="max-w-4xl mt-8">
                {/* <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                  {homeContent.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                  {homeContent.heroDescription}
                </p> */}
                
                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center gap-6">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-tcs-blue-600 to-tcs-blue-500 text-white font-bold rounded-xl hover:from-tcs-blue-700 hover:to-tcs-blue-600 transition-all duration-300 shadow-2xl hover:shadow-tcs-blue-500/50 transform hover:-translate-y-1 hover:scale-105 border border-tcs-blue-400/30"
                  >
                    Start Your Project
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 border-2 border-white/40 hover:border-white/60 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Dark Theme */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tcs-blue-400 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-tcs-blue-500/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-tcs-blue-900/40 border border-tcs-blue-500/30 rounded-full mb-6 backdrop-blur-sm">
                <span className="text-tcs-blue-300 font-bold tracking-wider uppercase text-xs">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                {homeContent.storyTitle}
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-tcs-blue-400 to-tcs-blue-300 rounded-full mx-auto"></div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none mb-10
                [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-center
                [&_h2]:text-white [&_h2]:font-bold [&_h2]:mb-4
                [&_h3]:text-gray-200 [&_h3]:font-semibold [&_h3]:mb-3
                [&_ul]:text-gray-300 [&_ul]:mb-5
                [&_li]:mb-2
                [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: homeContent.storyContent || '' }} 
            />

            {/* CTA Button */}
            <div className="text-center mt-10">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-tcs-blue-600 to-tcs-blue-500 text-white font-bold rounded-xl hover:from-tcs-blue-700 hover:to-tcs-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-tcs-blue-500/30 transform hover:-translate-y-1 border border-tcs-blue-400/30"
              >
                Learn More About Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-gray-100 dark:bg-tcs-navy">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">Featured Services</h2>
              <div className="w-24 h-1 bg-tcs-blue mx-auto mb-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div 
                  key={service.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                  <p className="text-gray-900 dark:text-gray-300 mb-4">{service.description}</p>
                  {service.features.length > 0 && (
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                          <span className="h-1.5 w-1.5 bg-tcs-blue rounded-full"></span>
                          {feature}
                        </div>
                      ))}
                      <Link 
                        href="/services" 
                        className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold mt-6 bg-white/10 hover:bg-tcs-accent rounded backdrop-blur-md transition-all duration-300"
                      >
                        View All Services
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blog Posts Section - Medium Dark Theme for Contrast */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-800 via-tcs-navy-700 to-slate-900 overflow-hidden">
        {/* Subtle pattern overlay */}
        {/* <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(92,179,232,0.03)_25%,rgba(92,179,232,0.03)_50%,transparent_50%,transparent_75%,rgba(92,179,232,0.03)_75%,rgba(92,179,232,0.03)_100%)] bg-[length:20px_20px]" /> */}
        
        {/* Gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" /> */}
        
        {/* Decorative top border with glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tcs-blue-400 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-tcs-blue-500/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-tcs-blue-900/40 border border-tcs-blue-500/30 rounded-full mb-6 backdrop-blur-sm">
              <span className="text-tcs-blue-300 font-bold tracking-wider uppercase text-xs">Latest Updates</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">Recent Blog Posts</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-tcs-blue-400 to-tcs-blue-300 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest news, tips, and insights from the construction industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 hover:border-tcs-blue-400 hover:shadow-tcs-blue-500/20 group">
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-tcs-blue-500"></div>
                    <p className="text-gray-900 text-sm font-bold uppercase tracking-wide">{post.date}</p>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-tcs-blue-600 transition-colors group-hover:text-tcs-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 mb-5 line-clamp-3 leading-relaxed text-base">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-gray-900 font-bold hover:text-tcs-blue-700 inline-flex items-center gap-2 transition-all group-hover:gap-3"
                  >
                    Read more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-tcs-blue-600 to-tcs-blue-500 text-white font-bold rounded-xl hover:from-tcs-blue-700 hover:to-tcs-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-tcs-blue-500/30 transform hover:-translate-y-1 border border-tcs-blue-400/30"
            >
              View All Blog Posts
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CallToAction 
        title="Need a Custom Solution?"
        description="Contact us to discuss your specific construction needs"
        buttonText="Get a Free Quote"
      />
    </div>
  );
}

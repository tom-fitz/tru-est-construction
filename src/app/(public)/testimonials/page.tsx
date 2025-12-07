import { getPageContent } from '@/lib/db-storage';
import PageHeader from '@/components/PageHeader';
import CallToAction from '@/components/CallToAction';

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

// Sample testimonials data - in a real app, this would come from your database
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    image: "/testimonials/person1.jpg", // You'll need to add these images
    quote: "Tru-Est Construction transformed our outdated kitchen into a modern masterpiece. Their attention to detail and professionalism exceeded our expectations.",
    rating: 5,
    project: "Kitchen Renovation"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    image: "/testimonials/person2.jpg",
    quote: "The team at Tru-Est delivered our commercial space renovation on time and under budget. Their expertise in commercial construction is unmatched.",
    rating: 5,
    project: "Office Renovation"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Property Developer",
    image: "/testimonials/person3.jpg",
    quote: "Working with Tru-Est on our multi-unit residential project was a pleasure. Their project management skills kept everything running smoothly.",
    rating: 5,
    project: "Multi-Unit Residential"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Restaurant Owner",
    image: "/testimonials/person4.jpg",
    quote: "They completely renovated our restaurant space, creating an amazing atmosphere that our customers love. The quality of work is outstanding.",
    rating: 5,
    project: "Restaurant Renovation"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Homeowner",
    image: "/testimonials/person5.jpg",
    quote: "Our home addition project was handled with such care and precision. Tru-Est made the process stress-free and the results are beautiful.",
    rating: 5,
    project: "Home Addition"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Property Manager",
    image: "/testimonials/person6.jpg",
    quote: "The maintenance team at Tru-Est is responsive and thorough. They've been managing our properties for years and we couldn't be happier.",
    rating: 5,
    project: "Property Maintenance"
  }
];

export default async function TestimonialsPage() {
  const page = await getPageContent('testimonials');
  
  // Parse page content as JSON
  let pageTitle = 'Client Testimonials';
  let pageSubtitle = 'See what our clients say about their experience with Tru-Est Construction';
  let testimonialsContent = '';
  
  try {
    const parsed = JSON.parse(page?.content || '{}');
    pageTitle = parsed.pageTitle || pageTitle;
    pageSubtitle = parsed.pageSubtitle || pageSubtitle;
    testimonialsContent = parsed.content || '';
  } catch {
    // Fallback to old format
    testimonialsContent = page?.content || '';
  }

  return (
    <div className="flex flex-col">
      <PageHeader 
        title={pageTitle} 
        description={pageSubtitle}
      />

      {/* Testimonials Grid */}
      <section className="py-16 bg-white dark:bg-tcs-navy-900">
        <div className="container mx-auto px-4">
          {/* Stats Section */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-tcs-blue mb-2">500+</div>
              <div className="text-black dark:text-gray-300" style={{ color: '#000000' }}>Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-tcs-blue mb-2">98%</div>
              <div className="text-black dark:text-gray-300" style={{ color: '#000000' }}>Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-tcs-blue mb-2">45+</div>
              <div className="text-black dark:text-gray-300" style={{ color: '#000000' }}>Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-tcs-blue mb-2">100%</div>
              <div className="text-black dark:text-gray-300" style={{ color: '#000000' }}>Licensed & Insured</div>
            </div>
          </div> */}

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {/* <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mr-4">
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-500" />
                    </div> */}
                    <div>
                      <h3 className="font-bold text-black dark:text-white">{testimonial.name}</h3>
                      <p className="text-sm text-black dark:text-gray-300">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-tcs-blue">★</span>
                    ))}
                  </div>
                  <blockquote className="text-black dark:text-gray-300 italic mb-4">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="text-sm text-tcs-blue font-medium">
                    {testimonial.project}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
      {testimonialsContent && (
        <section className="py-16 bg-gray-100 dark:bg-tcs-navy">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose dark:prose-invert mx-auto">
                <div dangerouslySetInnerHTML={{ __html: testimonialsContent }} />
              </div>
            </div>
          </div>
        </section>
      )}

      <CallToAction 
        title="Ready to Start Your Project?"
        description="Join our satisfied clients and experience the TCS difference"
        buttonText="Get a Free Quote"
      />
    </div>
  );
} 
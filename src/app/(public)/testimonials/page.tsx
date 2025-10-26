import { getPageContent } from '@/lib/db-storage';

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
  const testimonialsContent = page?.content || '';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gray-900/70 z-10" />
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gray-500" />
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Client Testimonials</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">See what our clients say about their experience with Tru-Est Construction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-300">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Licensed & Insured</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mr-4">
                      {/* Add actual images later */}
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 italic mb-4">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">
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
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose dark:prose-invert mx-auto">
                <div dangerouslySetInnerHTML={{ __html: testimonialsContent }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-gray-900">Join our satisfied clients and experience the Tru-Est difference</p>
          <a 
            href="/contact" 
            className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
          >
            Get a Free Quote
          </a>
        </div>
      </section>
    </div>
  );
} 
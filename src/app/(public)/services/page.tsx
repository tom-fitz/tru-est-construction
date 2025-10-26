import { getPageContent, getFeaturedServices } from '@/lib/db-storage';
import Image from "next/image";

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

export default async function ServicesPage() {
  const page = await getPageContent('services');
  const servicesContent = page?.content || '';
  const featuredServices = await getFeaturedServices();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gray-900/70 z-10" />
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gray-500" />
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">Comprehensive construction solutions for your every need</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: servicesContent }} />
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
              <div className="relative h-[400px]">
                <Image
                  src="/callout_02.jpg"
                  alt="Our Construction Services"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Featured Services</h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.slice(0, 3).map((service) => (
                <div 
                  key={service.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  {service.features.length > 0 && (
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="h-1.5 w-1.5 bg-yellow-500 rounded-full"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Need a Custom Solution?</h2>
          <p className="text-xl mb-8 text-gray-900">Contact us to discuss your specific construction needs</p>
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
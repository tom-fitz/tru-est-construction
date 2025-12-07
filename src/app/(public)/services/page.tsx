import { getPageContent, getFeaturedServices } from '@/lib/db-storage';
import PageHeader from '@/components/PageHeader';
import CallToAction from '@/components/CallToAction';

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

export default async function ServicesPage() {
  const page = await getPageContent('services');
  const servicesContent = page?.content || '<p>We offer comprehensive construction services including residential and commercial projects. Our team of experienced professionals is dedicated to delivering high-quality results that exceed your expectations.</p><p>From initial planning to final completion, we handle every aspect of your construction project with precision and care. Our commitment to quality craftsmanship and attention to detail ensures that your vision becomes reality.</p>';
  const featuredServices = await getFeaturedServices();

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Our Services" 
        description="Comprehensive construction solutions for your every need"
      />

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg prose-invert max-w-none
                [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-5
                [&_h2]:text-white [&_h2]:font-bold [&_h2]:mb-4
                [&_h3]:text-gray-200 [&_h3]:font-semibold [&_h3]:mb-3
                [&_ul]:text-gray-300 [&_ul]:mb-5
                [&_li]:mb-2
                [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: servicesContent }} 
            />
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
              {featuredServices.slice(0, 3).map((service) => (
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CallToAction 
        title="Need a Custom Solution?"
        description="Contact us to discuss your specific construction needs"
        buttonText="Get a Free Quote"
      />
    </div>
  );
} 
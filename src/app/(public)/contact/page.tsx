import { getPageContent } from '@/lib/db-storage';
import PageHeader from '@/components/PageHeader';

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

export default async function Contact() {
  // Get the contact page content from the database
  const page = await getPageContent('contact');
  const contactContent = page?.content || '';
  
  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Contact Us" 
        description="Have a question or want to discuss a project? Get in touch with our team."
      />

      {/* Contact Information and Form */}
      <section className="py-16 bg-white dark:bg-tcs-navy-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contactContent }} />
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-tcs-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-tcs-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-tcs-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-tcs-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-tcs-blue text-white font-bold py-3 px-6 rounded-md hover:bg-tcs-blue-600 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
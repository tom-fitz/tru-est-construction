import { getPageContent } from '@/lib/db-storage';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

export default async function Contact() {
  // Get the contact page content from the database
  const page = await getPageContent('contact');
  
  // Parse page content as JSON
  let pageTitle = 'Contact Us';
  let pageSubtitle = 'Have a question or want to discuss a project? Get in touch with our team.';
  let contactContent = '';
  
  try {
    const parsed = JSON.parse(page?.content || '{}');
    pageTitle = parsed.pageTitle || pageTitle;
    pageSubtitle = parsed.pageSubtitle || pageSubtitle;
    contactContent = parsed.content || '';
  } catch {
    // Fallback to old format - plain HTML content
    contactContent = page?.content || '';
  }
  
  return (
    <div className="flex flex-col">
      <PageHeader 
        title={pageTitle} 
        description={pageSubtitle}
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
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
} 
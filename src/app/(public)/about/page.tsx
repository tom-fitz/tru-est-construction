import { getPageContent } from '@/lib/db-storage';
import PageHeader from '@/components/PageHeader';
import CallToAction from '@/components/CallToAction';

// Always fetch fresh data from database (no caching)
// Perfect for content editing - see changes immediately
// TODO: Once content is stable, change to `export const revalidate = 60;` for better performance
export const revalidate = 0;

const values = [
  {
    title: 'Quality',
    description: 'We are committed to delivering the highest quality in every project, using premium materials and expert craftsmanship to ensure lasting results.'
  },
  {
    title: 'Integrity',
    description: 'We operate with complete transparency and honesty, building trust through clear communication and ethical business practices.'
  },
  {
    title: 'Innovation',
    description: 'We embrace modern construction techniques and technologies while maintaining traditional values of quality and craftsmanship.'
  }
];

export default async function About() {
  const page = await getPageContent('about');
  const aboutContent = page?.content || '';
  
  return (
    <div className="flex flex-col">
      <PageHeader 
        title="About Us" 
        description="Building excellence since 1978"
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
              dangerouslySetInnerHTML={{ __html: aboutContent }} 
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100 dark:bg-tcs-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-6">Our Values</h2>
            <div className="w-24 h-1 bg-tcs-blue mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                <p className="text-gray-900 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction 
        title="Ready to Start Your Project?"
        description="Let's discuss how we can bring your vision to life"
        buttonText="Get a Free Quote"
      />
    </div>
  );
} 
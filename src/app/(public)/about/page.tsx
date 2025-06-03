import { getPageContent } from '@/lib/db-storage';

export default async function About() {
  // Get the about page content from the database
  const page = await getPageContent('about');
  const aboutContent = page?.content || '';
  
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">About Us</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="prose dark:prose-invert max-w-none">
              {/* Render the content from storage */}
              <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
            </div>
            <div className="relative h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg">
              {/* Placeholder for about image - replace with your actual image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <span>About Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quality</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Integrity</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Innovation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
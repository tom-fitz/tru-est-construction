import { getPageContent } from '@/lib/db-storage';
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // Get the home page content from the database
  const page = await getPageContent('home');
  const homeContent = page?.content || '';
  
  return (
    <div className="flex flex-col">
      {/* Hero Section with Header Image */}
      <section className="relative h-[500px] w-full">
        <div className="absolute inset-0 bg-gray-900/70 z-10" />
        <div className="relative h-full w-full">
          {/* Placeholder for header image - replace with your actual image */}
          <div className="absolute inset-0 bg-gray-500" />
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Construction Services</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">Building your dreams with precision and reliability</p>
              <Link 
                href="/contact" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-md transition-colors"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About Tru-Est Construction</h2>
            <div className="prose dark:prose-invert mx-auto">
              {/* Render the content from storage */}
              <div dangerouslySetInnerHTML={{ __html: homeContent }} />
            </div>
            <Link 
              href="/about" 
              className="inline-block mt-6 text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 font-medium"
            >
              Learn more about us →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Contact Us</h2>
            <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="Your name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="Your email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="Your phone number"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

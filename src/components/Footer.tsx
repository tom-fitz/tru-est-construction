import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tru-Est Construction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quality construction services for all your needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Info</h3>
            <address className="not-italic text-gray-600 dark:text-gray-300">
              <p>123 Construction Ave</p>
              <p>Building City, BC 12345</p>
              <p className="mt-2">Email: info@truest.com</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Tru-Est Construction. All rights reserved.
            <Link href="/admin" className="ml-2 text-sm hover:underline">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
} 
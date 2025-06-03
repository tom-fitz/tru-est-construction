import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/" className="text-gray-800 dark:text-white">
              <img src="/tru_est_cont_logo.png" alt="Tru-Est Construction" className="h-26" />
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 
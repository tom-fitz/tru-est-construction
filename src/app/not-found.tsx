import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-white">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We&apos;re sorry, but we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-md transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
} 
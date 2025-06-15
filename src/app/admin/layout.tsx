import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Tru-Est Construction',
  description: 'Admin dashboard for Tru-Est Construction website',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-xl font-bold">
              Tru-Est Admin
            </Link>
            <Link 
              href="/" 
              className="text-sm bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded"
              target="_blank"
            >
              View Site
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin" 
                  className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/content" 
                  className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Page Content
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/content/services" 
                  className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/content/testimonials" 
                  className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/blog" 
                  className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Blog Posts
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
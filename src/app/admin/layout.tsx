'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-xl font-bold">
              Tru-Est Admin
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded transition-colors"
                target="_blank"
              >
                View Site
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-gray-900 text-white overflow-y-auto">
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
        <main className="flex-1 bg-gray-100 min-w-0 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

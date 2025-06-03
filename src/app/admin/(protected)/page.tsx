import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content Management Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Content Management</h2>
          <p className="text-gray-600 mb-4">Edit and update content for your website pages.</p>
          <Link 
            href="/admin/content" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Manage Content
          </Link>
        </div>
        
        {/* Blog Posts Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Blog Posts</h2>
          <p className="text-gray-600 mb-4">Create, edit, and publish blog posts for your website.</p>
          <Link 
            href="/admin/blog" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Manage Blog
          </Link>
        </div>
        
        {/* Preview Website Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Preview Website</h2>
          <p className="text-gray-600 mb-4">View your website to see your changes live.</p>
          <Link 
            href="/"
            target="_blank"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded transition-colors"
          >
            View Website
          </Link>
        </div>
      </div>
    </div>
  );
} 
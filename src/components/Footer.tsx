import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-tcs-navy-900 via-gray-900 to-tcs-navy-900 overflow-hidden">
      {/* Graph Paper Background Layers */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/graph-paper.svg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '90px 90px',
          filter: 'invert(1) brightness(0.2) contrast(1.1)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/graph-paper.svg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
          transform: 'rotate(45deg)',
          filter: 'invert(1) brightness(0.15) contrast(1.1)',
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-tcs-blue-500 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">TCS Construction Management</h3>
            <p className="text-gray-300 leading-relaxed">
              Professional construction management services with over 45 years of experience.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-tcs-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-tcs-blue-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-tcs-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-tcs-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-tcs-blue-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <address className="not-italic text-gray-300">
              <p>260 Cartwright Road</p>
              <p>Wellesley, MA, 02482</p>
              <p className="mt-3">
                <a href="mailto:Rich@truestconstructionservices.com" className="hover:text-tcs-blue-400 transition-colors">
                  Rich@truestconstructionservices.com
                </a>
              </p>
              <p>
                <a href="tel:+13392981217" className="hover:text-tcs-blue-400 transition-colors">
                  (339) 298-1217
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t border-tcs-navy-700/50 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} TCS Construction Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
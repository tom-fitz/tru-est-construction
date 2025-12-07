'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [_, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav 
      className='fixed w-full z-50 transition-all duration-300'
      style={{
        backgroundColor: 'rgba(2, 16, 29, 0.95)',
        padding: '25px 0',
      }}
    >
      {/* Graph Paper Texture Background - always visible */}
      <div 
        className="absolute inset-0 opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-tcs-navy-900/98 via-tcs-navy-900/95 to-tcs-navy-900/98" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center relative">
          {/* Desktop Navigation - Always Centered */}
          <div className="hidden md:flex items-center space-x-8 transition-all duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-white border-b-2 border-tcs-blue-400 pb-1' 
                    : 'text-gray-200 hover:text-white hover:border-b-2 hover:border-tcs-blue-400/50 pb-1'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-tcs-accent text-tcs-navy hover:bg-tcs-blue-500 shadow-lg hover:shadow-xl border border-tcs-blue-400/30 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute right-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none transition-colors text-white hover:text-tcs-blue-300 p-2 rounded-lg hover:bg-white/10"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-tcs-navy-800/80 rounded-lg p-4 backdrop-blur-sm border border-tcs-blue-500/20">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-semibold transition-colors px-3 py-2 rounded-lg ${
                    isActive(link.href)
                      ? 'text-white bg-tcs-blue/30 border-l-4 border-tcs-blue-400' 
                      : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-3 bg-tcs-blue text-white font-semibold rounded-lg hover:bg-tcs-blue-500 transition-colors border border-tcs-blue-400/30 shadow-lg mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 
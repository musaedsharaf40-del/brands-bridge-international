'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Brands', href: '/brands' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className={cn(
              'text-2xl font-bold transition-colors',
              scrolled ? 'text-primary-600' : 'text-white'
            )}>
              <span className="font-display">Brands Bridge</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'font-medium transition-colors',
                  isActive(item.href)
                    ? scrolled ? 'text-primary-600' : 'text-white'
                    : scrolled ? 'text-secondary-600 hover:text-primary-600' : 'text-white/80 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className={cn(
              'flex items-center space-x-1 font-medium',
              scrolled ? 'text-secondary-600' : 'text-white/80'
            )}>
              <Globe className="h-4 w-4" />
              <span>EN</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <Link href="/contact">
              <Button variant={scrolled ? 'primary' : 'outline'} size="sm" className={!scrolled ? 'border-white text-white hover:bg-white/10' : ''}>
                Get in Touch
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={cn('h-6 w-6', scrolled ? 'text-secondary-900' : 'text-white')} />
            ) : (
              <Menu className={cn('h-6 w-6', scrolled ? 'text-secondary-900' : 'text-white')} />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg animate-slide-down">
          <div className="container-custom py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block py-2 font-medium',
                  isActive(item.href) ? 'text-primary-600' : 'text-secondary-600'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Brands', href: '/brands' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/about#services' },
  ],
  resources: [
    { name: 'Product Catalog', href: '/products' },
    { name: 'Partner With Us', href: '/contact' },
    { name: 'FAQs', href: '/about#faq' },
    { name: 'News', href: '/news' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold font-display">Brands Bridge</h3>
              <p className="text-primary-400 text-sm">International</p>
            </Link>
            <p className="mt-4 text-secondary-400 max-w-sm">
              Your trusted partner in global FMCG distribution. Connecting world-renowned brands with markets worldwide.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start space-x-3 text-secondary-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>123 Trade Center, Business District, Dubai, UAE</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-400">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-400">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@brandsbridgeintl.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} Brands Bridge International. All rights reserved.
          </p>
          <p className="text-secondary-500 text-sm mt-2 md:mt-0">
            Premium FMCG Trading & Distribution
          </p>
        </div>
      </div>
    </footer>
  );
}

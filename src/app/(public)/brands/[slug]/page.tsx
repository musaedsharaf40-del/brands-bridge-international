'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, ExternalLink, Globe } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { brandsApi } from '@/lib/api';
import { Brand, Product } from '@/types';
import { getImageUrl } from '@/lib/utils';

export default function BrandDetailPage() {
  const params = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrand();
  }, [params.slug]);

  const loadBrand = async () => {
    setLoading(true);
    try {
      const data = await brandsApi.getBySlug(params.slug as string);
      setBrand(data as Brand | null);
    } catch (error) {
      console.error('Failed to load brand:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
            <div className="h-48 bg-gray-200 rounded-xl mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom text-center py-20">
          <Globe className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600">Brand not found</h2>
          <Link href="/brands">
            <Button variant="primary" className="mt-6">
              Back to Brands
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-800 to-secondary-900 py-16">
        <div className="container-custom">
          <Link href="/brands" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Link>
          
          <div className="flex items-center gap-6">
            {brand.logo ? (
              <div className="w-24 h-24 bg-white rounded-xl p-4 flex items-center justify-center">
                <img
                  src={getImageUrl(brand.logo)}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{brand.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{brand.name}</h1>
              {brand.country && (
                <p className="text-white/80 mt-1">{brand.country}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Brand Info */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl font-bold mb-4">About {brand.name}</h2>
          <p className="text-secondary-600 leading-relaxed">
            {brand.description || `${brand.name} is one of our trusted partner brands. We are proud to distribute their products across our global network.`}
          </p>
          
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Visit Official Website
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          )}
        </div>

        {/* Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Products from {brand.name}</h2>
          
          {brand.products && brand.products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {brand.products.map((product: Product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card hover>
                    <div className="h-40 bg-gray-100">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.category && (
                        <span className="text-sm text-secondary-500">{product.category.name}</span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-secondary-600">No products available yet</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-primary-50 rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">Interested in {brand.name} products?</h3>
          <p className="text-secondary-600 mb-4">Contact us for pricing, availability, and distribution opportunities.</p>
          <Link href="/contact">
            <Button variant="primary">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

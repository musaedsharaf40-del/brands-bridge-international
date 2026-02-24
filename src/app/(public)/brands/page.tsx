'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Grid, Award } from 'lucide-react';
import { Card } from '@/components/ui';
import { brandsApi } from '@/lib/api';
import { Brand } from '@/types';
import { cn, getImageUrl } from '@/lib/utils';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await brandsApi.getAll();
      setBrands(data);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredBrands = filteredBrands.filter((brand) => brand.isFeatured);
  const otherBrands = filteredBrands.filter((brand) => !brand.isFeatured);

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-800 to-secondary-900 py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-white">Our Brands</h1>
          <p className="mt-2 text-white/80">Partnering with world-renowned brands</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search */}
        <div className="max-w-md mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Brands */}
            {featuredBrands.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-primary-600" />
                  Featured Partners
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredBrands.map((brand) => (
                    <Link key={brand.id} href={`/brands/${brand.slug}`}>
                      <Card hover className="h-full">
                        <div className="p-6 text-center">
                          {brand.logo ? (
                            <div className="h-24 flex items-center justify-center mb-4">
                              <img
                                src={getImageUrl(brand.logo)}
                                alt={brand.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                              <span className="text-2xl font-bold text-gray-400">
                                {brand.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <h3 className="font-semibold text-lg">{brand.name}</h3>
                          {brand.country && (
                            <p className="text-sm text-secondary-500 mt-1">{brand.country}</p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Brands */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Grid className="h-6 w-6 mr-2 text-secondary-600" />
                All Brands
              </h2>
              {otherBrands.length === 0 && featuredBrands.length === 0 ? (
                <div className="text-center py-16">
                  <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600">No brands found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {otherBrands.map((brand) => (
                    <Link key={brand.id} href={`/brands/${brand.slug}`}>
                      <div className="p-4 bg-white border rounded-xl hover:border-primary-300 hover:shadow-md transition-all text-center">
                        {brand.logo ? (
                          <div className="h-16 flex items-center justify-center mb-2">
                            <img
                              src={getImageUrl(brand.logo)}
                              alt={brand.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center mb-2">
                            <span className="text-xl font-bold text-gray-400">
                              {brand.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <h3 className="font-medium text-sm">{brand.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

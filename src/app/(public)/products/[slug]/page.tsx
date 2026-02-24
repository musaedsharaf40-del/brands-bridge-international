'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, ExternalLink } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { getImageUrl } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productsApi.getBySlug(params.slug as string) as Product | null;
      setProduct(data);
      
      // Load related products from same category
      if (data?.categoryId) {
        const related = await productsApi.getByCategory(data.categoryId, 4) as Product[];
        setRelatedProducts(related.filter((p: Product) => p.id !== data.id).slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to load product:', error);
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
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded" />
                <div className="h-6 w-1/4 bg-gray-200 rounded" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom text-center py-20">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600">Product not found</h2>
          <Link href="/products">
            <Button variant="primary" className="mt-6">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Back Button */}
        <Link href="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover min-h-[400px]"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <Package className="h-24 w-24 text-gray-300" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.brand && (
              <Link href={`/brands/${product.brand.slug}`} className="text-primary-600 font-medium hover:underline">
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
            
            {product.category && (
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-secondary-600">
                  {product.category.name}
                </span>
              </div>
            )}

            {product.sku && (
              <p className="text-secondary-500 mt-4">SKU: {product.sku}</p>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-secondary-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {product.brand?.website && (
              <a
                href={product.brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-6 text-primary-600 hover:text-primary-700"
              >
                Visit Brand Website
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}

            <div className="mt-8 p-6 bg-primary-50 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Interested in this product?</h3>
              <p className="text-secondary-600 mb-4">Contact us for pricing and availability.</p>
              <Link href="/contact">
                <Button variant="primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`}>
                  <Card hover>
                    <div className="h-40 bg-gray-100">
                      {relatedProduct.image ? (
                        <img
                          src={getImageUrl(relatedProduct.image)}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{relatedProduct.name}</h3>
                      {relatedProduct.brand && (
                        <span className="text-sm text-primary-600">{relatedProduct.brand.name}</span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

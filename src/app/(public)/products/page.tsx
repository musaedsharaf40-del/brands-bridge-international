'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, Package } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { productsApi, categoriesApi, brandsApi } from '@/lib/api';
import { Product, Category, Brand } from '@/types';
import { cn, getImageUrl } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    categoryId: searchParams.get('category') || '',
    brandId: '',
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll({
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        brandId: filters.brandId || undefined,
        page: filters.page,
        limit: 12,
      });
      setProducts(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-white">Our Products</h1>
          <p className="mt-2 text-white/80">Explore our wide range of FMCG products</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 1 })}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  value={filters.brandId}
                  onChange={(e) => setFilters({ ...filters, brandId: e.target.value, page: 1 })}
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setFilters({ search: '', categoryId: '', brandId: '', page: 1 })}
              >
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg',
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                  )}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg',
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                  )}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}>
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card hover className={cn(
                      viewMode === 'list' && 'flex items-center'
                    )}>
                      <div className={cn(
                        'bg-gray-100',
                        viewMode === 'grid' ? 'h-48' : 'w-32 h-32 flex-shrink-0'
                      )}>
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        {product.brand && (
                          <span className="text-xs text-blue-600 font-medium">{product.brand.name}</span>
                        )}
                        <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                        {product.category && (
                          <span className="text-sm text-slate-500">{product.category.name}</span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                    className={cn(
                      'px-4 py-2 rounded-lg',
                      filters.page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="container-custom">
            <h1 className="text-4xl font-bold text-white">Our Products</h1>
            <p className="mt-2 text-white/80">Loading products...</p>
          </div>
        </div>
        <div className="container-custom py-12">
          <div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

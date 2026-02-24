'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
} from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { productsApi, categoriesApi, brandsApi } from '@/lib/api';
import type { Product, Category, Brand } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pageSize = 10;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productsApi.getAll({
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        brandId: selectedBrand || undefined,
        includeInactive: showInactive,
        page,
        limit: pageSize,
      });
      setProducts(data.data || data);
      setTotal(data.total || data.length || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedBrand, showInactive, page]);

  const fetchFilters = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoriesApi.getAll(true),
        brandsApi.getAll({ includeInactive: true }),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleActive = async (id: string) => {
    try {
      await productsApi.toggleActive(id);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
    setActiveMenu(null);
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await productsApi.toggleFeatured(id);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product featured:', error);
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setActiveMenu(null);
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (product: Product) => (
        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-xs">No img</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (product: Product) => (
        <div>
          <p className="font-medium text-slate-800">{product.name}</p>
          <p className="text-xs text-slate-500">{product.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: Product) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          {product.category?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'brand',
      header: 'Brand',
      render: (product: Product) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
          {product.brand?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          {product.isActive ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              Inactive
            </span>
          )}
          {product.featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: Product) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === product.id ? null : product.id);
            }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
          {activeMenu === product.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleActive(product.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {product.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleToggleFeatured(product.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {product.featured ? (
                    <>
                      <StarOff className="w-4 h-4" />
                      Remove Featured
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Set Featured
                    </>
                  )}
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          {/* Show Inactive */}
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => {
                setShowInactive(e.target.checked);
                setPage(1);
              }}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Show Inactive</span>
          </label>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(product) => router.push(`/admin/products/${product.id}`)}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
        }}
        emptyMessage="No products found. Create your first product to get started."
      />
    </div>
  );
}

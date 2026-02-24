'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, MoreVertical, Building2, Star, StarOff } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { brandsApi } from '@/lib/api';
import type { Brand } from '@/types';

interface BrandForm {
  name: string;
  slug: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
  featured: boolean;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<BrandForm>({
    name: '',
    slug: '',
    description: '',
    logo: '',
    website: '',
    isActive: true,
    featured: false,
  });

  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await brandsApi.getAll({ includeInactive: true });
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setForm({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || '',
        logo: brand.logo || '',
        website: brand.website || '',
        isActive: brand.isActive,
        featured: brand.featured,
      });
    } else {
      setEditingBrand(null);
      setForm({
        name: '',
        slug: '',
        description: '',
        logo: '',
        website: '',
        isActive: true,
        featured: false,
      });
    }
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingBrand) {
        await brandsApi.update(editingBrand.id, form);
      } else {
        await brandsApi.create(form);
      }
      handleCloseModal();
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Error saving brand. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await brandsApi.toggleActive(id);
      fetchBrands();
    } catch (error) {
      console.error('Error toggling brand status:', error);
    }
    setActiveMenu(null);
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await brandsApi.toggleFeatured(id);
      fetchBrands();
    } catch (error) {
      console.error('Error toggling brand featured:', error);
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand? This will affect all associated products.')) return;
    try {
      await brandsApi.delete(id);
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
    setActiveMenu(null);
  };

  const columns = [
    {
      key: 'logo',
      header: 'Logo',
      render: (brand: Brand) => (
        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-2">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Building2 className="w-6 h-6 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (brand: Brand) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-800">{brand.name}</p>
            {brand.featured && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <p className="text-xs text-slate-500">/{brand.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (brand: Brand) => (
        <p className="text-sm text-slate-600 truncate max-w-xs">
          {brand.description || '-'}
        </p>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      render: (brand: Brand) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
          {brand._count?.products || 0} products
        </span>
      ),
    },
    {
      key: 'website',
      header: 'Website',
      render: (brand: Brand) => (
        brand.website ? (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Visit
          </a>
        ) : (
          <span className="text-slate-400 text-sm">-</span>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (brand: Brand) => (
        brand.isActive ? (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Active
          </span>
        ) : (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
            Inactive
          </span>
        )
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (brand: Brand) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === brand.id ? null : brand.id);
            }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
          {activeMenu === brand.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                <button
                  onClick={() => handleOpenModal(brand)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(brand.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {brand.isActive ? (
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
                  onClick={() => handleToggleFeatured(brand.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {brand.featured ? (
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
                  onClick={() => handleDelete(brand.id)}
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
          <h1 className="text-2xl font-bold text-slate-800">Brands</h1>
          <p className="text-slate-600">Manage partner brands and manufacturers</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={brands}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No brands found. Create your first brand to get started."
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm({
                    ...form,
                    name,
                    slug: !editingBrand ? generateSlug(name) : form.slug,
                  });
                }}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="brand-url-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brand description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://brand-website.com"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingBrand ? 'Save Changes' : 'Create Brand'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

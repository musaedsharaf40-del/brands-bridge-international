'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, MoreVertical, FolderTree } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/types';

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll(true);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setForm({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
      });
    }
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, form);
      } else {
        await categoriesApi.create(form);
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await categoriesApi.toggleActive(id);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all associated products.')) return;
    try {
      await categoriesApi.delete(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
    setActiveMenu(null);
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (category: Category) => (
        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FolderTree className="w-6 h-6 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (category: Category) => (
        <div>
          <p className="font-medium text-slate-800">{category.name}</p>
          <p className="text-xs text-slate-500">/{category.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category: Category) => (
        <p className="text-sm text-slate-600 truncate max-w-xs">
          {category.description || '-'}
        </p>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      render: (category: Category) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          {category._count?.products || 0} products
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (category: Category) => (
        category.isActive ? (
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
      render: (category: Category) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === category.id ? null : category.id);
            }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
          {activeMenu === category.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(category.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {category.isActive ? (
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
                <hr className="my-1" />
                <button
                  onClick={() => handleDelete(category.id)}
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
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-600">Organize your products by categories</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No categories found. Create your first category to get started."
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({
                  ...form,
                  name,
                  slug: !editingCategory ? generateSlug(name) : form.slug,
                });
              }}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
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
              placeholder="category-url-slug"
            />
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
              placeholder="Category description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700">Active (visible on website)</span>
          </label>

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
              {isSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  Building2,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
} from 'lucide-react';
import { productsApi, categoriesApi, brandsApi, inquiriesApi } from '@/lib/api';

interface DashboardStats {
  products: number;
  categories: number;
  brands: number;
  inquiries: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [productsData, categoriesData, brandsData, inquiriesData] = await Promise.all([
          productsApi.getAll({ limit: 1 }),
          categoriesApi.getAll(true),
          brandsApi.getAll({ includeInactive: true }),
          inquiriesApi.getAll({ limit: 5 }),
        ]);

        // Calculate stats
        const inquiryStats = await inquiriesApi.getStats();

        setStats({
          products: productsData.total || productsData.data?.length || 0,
          categories: categoriesData.length || 0,
          brands: brandsData.length || 0,
          inquiries: {
            total: inquiryStats.total || 0,
            pending: inquiryStats.byStatus?.PENDING || 0,
            inProgress: inquiryStats.byStatus?.IN_PROGRESS || 0,
            resolved: inquiryStats.byStatus?.RESOLVED || 0,
          },
        });

        setRecentInquiries(inquiriesData.data || inquiriesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Total Products',
      value: stats?.products || 0,
      icon: Package,
      href: '/admin/products',
      color: 'blue',
    },
    {
      name: 'Categories',
      value: stats?.categories || 0,
      icon: FolderTree,
      href: '/admin/categories',
      color: 'green',
    },
    {
      name: 'Brands',
      value: stats?.brands || 0,
      icon: Building2,
      href: '/admin/brands',
      color: 'purple',
    },
    {
      name: 'Total Inquiries',
      value: stats?.inquiries.total || 0,
      icon: MessageSquare,
      href: '/admin/inquiries',
      color: 'orange',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUSINESS':
        return 'bg-purple-100 text-purple-800';
      case 'GENERAL':
        return 'bg-blue-100 text-blue-800';
      case 'SUPPORT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-lg ${
                  stat.color === 'blue'
                    ? 'bg-blue-100'
                    : stat.color === 'green'
                    ? 'bg-green-100'
                    : stat.color === 'purple'
                    ? 'bg-purple-100'
                    : 'bg-orange-100'
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === 'blue'
                      ? 'text-blue-600'
                      : stat.color === 'green'
                      ? 'text-green-600'
                      : stat.color === 'purple'
                      ? 'text-purple-600'
                      : 'text-orange-600'
                  }`}
                />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-slate-600 text-sm mt-1">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Inquiry Stats + Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Inquiry Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-slate-700">Pending</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {stats?.inquiries.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">In Progress</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {stats?.inquiries.inProgress || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Resolved</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {stats?.inquiries.resolved || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {recentInquiries.slice(0, 5).map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{inquiry.name}</p>
                      <p className="text-sm text-slate-500">{inquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(inquiry.type)}`}>
                      {inquiry.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No inquiries yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Add Product</span>
          </Link>
          <Link
            href="/admin/categories/new"
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <FolderTree className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Add Category</span>
          </Link>
          <Link
            href="/admin/brands/new"
            className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Building2 className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Add Brand</span>
          </Link>
          <Link
            href="/admin/content"
            className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-slate-700">Edit Content</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

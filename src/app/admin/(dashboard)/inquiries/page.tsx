'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Mail,
  Phone,
  Building,
} from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { inquiriesApi } from '@/lib/api';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: string;
  subject?: string;
  message: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const pageSize = 10;

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await inquiriesApi.getAll({
        search: searchTerm || undefined,
        type: selectedType || undefined,
        status: selectedStatus || undefined,
        page,
        limit: pageSize,
      });
      setInquiries(data.data || data);
      setTotal(data.meta?.total || data.data?.length || 0);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedType, selectedStatus, page]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await inquiriesApi.updateStatus(id, status);
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await inquiriesApi.delete(id);
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
    setActiveMenu(null);
  };

  const handleViewInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      await inquiriesApi.addNote(selectedInquiry.id, notes);
      fetchInquiries();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Contact',
      render: (inquiry: Inquiry) => (
        <div>
          <p className="font-medium text-slate-800">{inquiry.name}</p>
          <p className="text-xs text-slate-500">{inquiry.email}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (inquiry: Inquiry) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(inquiry.type)}`}>
          {inquiry.type}
        </span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (inquiry: Inquiry) => (
        <p className="text-sm text-slate-600 truncate max-w-xs">
          {inquiry.subject || inquiry.message.substring(0, 50) + '...'}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (inquiry: Inquiry) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
          {inquiry.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (inquiry: Inquiry) => (
        <p className="text-sm text-slate-600">{formatDate(inquiry.createdAt)}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (inquiry: Inquiry) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === inquiry.id ? null : inquiry.id);
            }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
          {activeMenu === inquiry.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                <button
                  onClick={() => handleViewInquiry(inquiry)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleUpdateStatus(inquiry.id, 'IN_PROGRESS')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                >
                  <Clock className="w-4 h-4" />
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(inquiry.id, 'RESOLVED')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleUpdateStatus(inquiry.id, 'CLOSED')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <XCircle className="w-4 h-4" />
                  Close
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleDelete(inquiry.id)}
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inquiries</h1>
        <p className="text-slate-600">Manage customer inquiries and contact requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="GENERAL">General</option>
            <option value="BUSINESS">Business</option>
            <option value="SUPPORT">Support</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={inquiries}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleViewInquiry}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
        }}
        emptyMessage="No inquiries found."
      />

      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Inquiry Details"
        size="lg"
      >
        {selectedInquiry && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(selectedInquiry.type)}`}>
                  {selectedInquiry.type}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                  {selectedInquiry.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-500">{formatDate(selectedInquiry.createdAt)}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-800">{selectedInquiry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>
              {selectedInquiry.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              )}
              {selectedInquiry.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{selectedInquiry.company}</span>
                </div>
              )}
            </div>

            {/* Subject */}
            {selectedInquiry.subject && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Subject</h3>
                <p className="text-slate-800">{selectedInquiry.subject}</p>
              </div>
            )}

            {/* Message */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Message</h3>
              <p className="text-slate-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Internal Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add internal notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'IN_PROGRESS')}
                  className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESOLVED')}
                  className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                >
                  Resolved
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'CLOSED')}
                  className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

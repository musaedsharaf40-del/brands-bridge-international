// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: Product[];
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
  featured: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: Product[];
}

// Product Types
export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  image?: string;
  images?: string[];
  specifications?: Record<string, string>;
  featured: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  categoryId?: string;
  brandId?: string;
  category?: Category;
  brand?: Brand;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Inquiry Types
export type InquiryType = 'GENERAL' | 'BUSINESS' | 'PARTNERSHIP' | 'SUPPORT';
export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED';

export interface Inquiry {
  id: string;
  type: InquiryType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject?: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiriesResponse {
  data: Inquiry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Content Types
export type ContentType = 'TEXT' | 'HTML' | 'IMAGE' | 'JSON';

export interface Content {
  id: string;
  key: string;
  type: ContentType;
  value: string;
  valueAr?: string;
  section?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentMap {
  [key: string]: {
    value: string;
    valueAr?: string;
    type: ContentType;
  };
}

// Statistics
export interface Statistic {
  id: string;
  key: string;
  label: string;
  labelAr?: string;
  value: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

// Company Values
export interface CompanyValue {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

// Services
export interface Service {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  icon?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

// Partner
export type PartnerType = 'DISTRIBUTOR' | 'PARTNER' | 'CERTIFICATION';

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  type: PartnerType;
  sortOrder: number;
  isActive: boolean;
}

// Settings
export interface Settings {
  [key: string]: string;
}

// API Response Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Form Types
export interface ContactFormData {
  type?: InquiryType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject?: string;
  message: string;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wlsjqigrtudnybwpetjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsc2pxaWdydHVkbnlid3BldGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTQ0NjIsImV4cCI6MjA4NjA5MDQ2Mn0.ygNFCzU0NouS_3oxhJ9UrKBi8HfqdIBtfP7Iz9DJ4jc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Category {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  sku?: string;
  image?: string;
  images?: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  category_id?: string;
  brand_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category;
  brand?: Brand;
}

export interface Inquiry {
  id: string;
  type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject?: string;
  message: string;
  status: string;
  notes?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  key: string;
  type: string;
  value: string;
  value_ar?: string;
  section?: string;
  created_at: string;
  updated_at: string;
}

export interface Statistic {
  id: string;
  key: string;
  label: string;
  label_ar?: string;
  value: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyValue {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  icon?: string;
  image?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  type: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  settings_group: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  auth_user_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

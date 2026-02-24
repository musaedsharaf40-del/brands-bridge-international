import { supabase } from './supabase';
import type { 
  Category, 
  Brand, 
  Product, 
  Inquiry, 
  Content, 
  Statistic, 
  CompanyValue, 
  Service, 
  Partner, 
  Setting,
  AdminUser 
} from './supabase';

// Helper to convert snake_case to camelCase for frontend compatibility
function toCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item)) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as any) as T;
  }
  return obj;
}

// Helper to convert camelCase to snake_case for database
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    
    // Get admin user profile
    if (data.user) {
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .maybeSingle();
      
      if (adminError) throw new Error(adminError.message);
      if (!adminUser) throw new Error('Admin user not found');
      
      return {
        access_token: data.session?.access_token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          firstName: adminUser.first_name,
          lastName: adminUser.last_name,
          name: `${adminUser.first_name} ${adminUser.last_name}`,
          role: adminUser.role,
          isActive: adminUser.is_active,
          createdAt: adminUser.created_at,
          updatedAt: adminUser.updated_at,
        },
      };
    }
    
    throw new Error('Login failed');
  },
  
  getProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    if (!user) throw new Error('Not authenticated');
    
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    
    if (adminError) throw new Error(adminError.message);
    return adminUser ? toCamelCase(adminUser) : null;
  },
  
  verifyToken: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return { valid: !!user };
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (includeInactive = false) => {
    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data ? toCamelCase(data) : null;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data ? toCamelCase(data) : null;
  },
  
  create: async (categoryData: any) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([toSnakeCase(categoryData)])
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  update: async (id: string, categoryData: any) => {
    const { data, error } = await supabase
      .from('categories')
      .update(toSnakeCase({ ...categoryData, updated_at: new Date().toISOString() }))
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  },
  
  toggleActive: async (id: string) => {
    // First get current state
    const { data: current, error: fetchError } = await supabase
      .from('categories')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) throw new Error(fetchError.message);
    
    const { data, error } = await supabase
      .from('categories')
      .update({ is_active: !current?.is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
};

// Brands API
export const brandsApi = {
  getAll: async (params?: { includeInactive?: boolean; featured?: boolean }) => {
    let query = supabase
      .from('brands')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!params?.includeInactive) {
      query = query.eq('is_active', true);
    }
    
    if (params?.featured !== undefined) {
      query = query.eq('is_featured', params.featured);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getFeatured: async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data ? toCamelCase(data) : null;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data ? toCamelCase(data) : null;
  },
  
  create: async (brandData: any) => {
    const { data, error } = await supabase
      .from('brands')
      .insert([toSnakeCase(brandData)])
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  update: async (id: string, brandData: any) => {
    const { data, error } = await supabase
      .from('brands')
      .update(toSnakeCase({ ...brandData, updated_at: new Date().toISOString() }))
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  },
  
  toggleActive: async (id: string) => {
    const { data: current, error: fetchError } = await supabase
      .from('brands')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) throw new Error(fetchError.message);
    
    const { data, error } = await supabase
      .from('brands')
      .update({ is_active: !current?.is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  toggleFeatured: async (id: string) => {
    const { data: current, error: fetchError } = await supabase
      .from('brands')
      .select('is_featured')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) throw new Error(fetchError.message);
    
    const { data, error } = await supabase
      .from('brands')
      .update({ is_featured: !current?.is_featured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    featured?: boolean;
    includeInactive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('sort_order', { ascending: true });
    
    if (!params?.includeInactive) {
      query = query.eq('is_active', true);
    }
    
    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    
    if (params?.brandId) {
      query = query.eq('brand_id', params.brandId);
    }
    
    if (params?.featured !== undefined) {
      query = query.eq('is_featured', params.featured);
    }
    
    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }
    
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    
    // Fetch categories and brands for products
    const products = data || [];
    if (products.length > 0) {
      const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
      const brandIds = [...new Set(products.map(p => p.brand_id).filter(Boolean))];
      
      const [categoriesResult, brandsResult] = await Promise.all([
        categoryIds.length > 0 
          ? supabase.from('categories').select('*').in('id', categoryIds)
          : { data: [] },
        brandIds.length > 0
          ? supabase.from('brands').select('*').in('id', brandIds)
          : { data: [] },
      ]);
      
      const categoriesMap = (categoriesResult.data || []).reduce((acc: any, cat: any) => {
        acc[cat.id] = cat;
        return acc;
      }, {});
      
      const brandsMap = (brandsResult.data || []).reduce((acc: any, brand: any) => {
        acc[brand.id] = brand;
        return acc;
      }, {});
      
      products.forEach(product => {
        if (product.category_id && categoriesMap[product.category_id]) {
          product.category = categoriesMap[product.category_id];
        }
        if (product.brand_id && brandsMap[product.brand_id]) {
          product.brand = brandsMap[product.brand_id];
        }
      });
    }
    
    return {
      data: toCamelCase<any[]>(products),
      total: count || 0,
      meta: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  },
  
  getFeatured: async (limit = 8) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(limit);
    
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    
    if (data) {
      // Fetch category and brand
      if (data.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .maybeSingle();
        data.category = category;
      }
      if (data.brand_id) {
        const { data: brand } = await supabase
          .from('brands')
          .select('*')
          .eq('id', data.brand_id)
          .maybeSingle();
        data.brand = brand;
      }
    }
    
    return data ? toCamelCase(data) : null;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    
    if (data) {
      if (data.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .maybeSingle();
        data.category = category;
      }
      if (data.brand_id) {
        const { data: brand } = await supabase
          .from('brands')
          .select('*')
          .eq('id', data.brand_id)
          .maybeSingle();
        data.brand = brand;
      }
    }
    
    return data ? toCamelCase(data) : null;
  },
  
  getByCategory: async (categoryId: string, limit?: number) => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getByBrand: async (brandId: string, limit?: number) => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getStats: async () => {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw new Error(error.message);
    return { total: count || 0 };
  },
  
  create: async (productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert([toSnakeCase(productData)])
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  update: async (id: string, productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(toSnakeCase({ ...productData, updated_at: new Date().toISOString() }))
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  },
  
  toggleActive: async (id: string) => {
    const { data: current, error: fetchError } = await supabase
      .from('products')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) throw new Error(fetchError.message);
    
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: !current?.is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  toggleFeatured: async (id: string) => {
    const { data: current, error: fetchError } = await supabase
      .from('products')
      .select('is_featured')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) throw new Error(fetchError.message);
    
    const { data, error } = await supabase
      .from('products')
      .update({ is_featured: !current?.is_featured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
};

// Inquiries API
export const inquiriesApi = {
  create: async (inquiryData: any) => {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([toSnakeCase(inquiryData)])
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  getAll: async (params?: {
    search?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (params?.type) {
      query = query.eq('type', params.type);
    }
    
    if (params?.status) {
      query = query.eq('status', params.status);
    }
    
    if (params?.search) {
      query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }
    
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    
    // Transform data to include name field for frontend compatibility
    const transformedData = (data || []).map(inquiry => ({
      ...inquiry,
      name: `${inquiry.first_name} ${inquiry.last_name}`,
    }));
    
    return {
      data: toCamelCase<any[]>(transformedData),
      meta: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data ? toCamelCase(data) : null;
  },
  
  getStats: async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('status');
    
    if (error) throw new Error(error.message);
    
    const byStatus = (data || []).reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: data?.length || 0,
      byStatus,
    };
  },
  
  updateStatus: async (id: string, status: string) => {
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (status === 'RESPONDED') {
      updateData.responded_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  addNote: async (id: string, notes: string) => {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

// Content API
export const contentApi = {
  getPublic: async () => {
    const { data, error } = await supabase
      .from('contents')
      .select('*');
    
    if (error) throw new Error(error.message);
    
    // Convert to key-value map
    const contentMap = (data || []).reduce((acc: any, item: any) => {
      acc[item.key] = {
        value: item.value,
        valueAr: item.value_ar,
        type: item.type,
      };
      return acc;
    }, {});
    
    return contentMap;
  },
  
  getStatistics: async () => {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getValues: async () => {
    const { data, error } = await supabase
      .from('company_values')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getPartners: async (type?: string) => {
    let query = supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  getSettings: async (group?: string) => {
    let query = supabase
      .from('settings')
      .select('*');
    
    if (group) {
      query = query.eq('settings_group', group);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    // Convert to key-value map
    const settingsMap = (data || []).reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    
    return settingsMap;
  },
  
  getAll: async (section?: string) => {
    let query = supabase
      .from('contents')
      .select('*');
    
    if (section) {
      query = query.eq('section', section);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return toCamelCase<any[]>(data || []);
  },
  
  update: async (key: string, contentData: any) => {
    const { data, error } = await supabase
      .from('contents')
      .update(toSnakeCase({ ...contentData, updated_at: new Date().toISOString() }))
      .eq('key', key)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
  
  updateSetting: async (key: string, value: string) => {
    const { data, error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
};

// Uploads API (using Supabase Storage)
export const uploadsApi = {
  upload: async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);
    
    if (error) throw new Error(error.message);
    
    const { data: publicUrl } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);
    
    return {
      url: publicUrl.publicUrl,
      filename: fileName,
    };
  },
  
  uploadMultiple: async (files: File[]) => {
    const results = await Promise.all(files.map(file => uploadsApi.upload(file)));
    return results;
  },
  
  list: async () => {
    const { data, error } = await supabase.storage
      .from('uploads')
      .list('uploads');
    
    if (error) throw new Error(error.message);
    return data || [];
  },
  
  delete: async (filename: string) => {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([`uploads/${filename}`]);
    
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

// Legacy api object for backward compatibility with auth-context
export const api = {
  setAuthToken: (token: string | null) => {
    // Supabase manages tokens internally, this is a no-op
  },
  
  login: authApi.login,
  getProfile: authApi.getProfile,
};

export default supabase;

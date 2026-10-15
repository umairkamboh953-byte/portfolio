import {
  Product,
  Order,
  User,
  PlatformSettings,
  Inquiry,
  AdminStats,
  PackageTierKey,
  PaymentMethod,
  Coupon,
  WebsiteContent,
  DeliverableFile,
  PolicyItem
} from '../types/index.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('markety_auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('markety_auth_token', res.token);
    return res;
  },

  async adminLogin(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('markety_auth_token', res.token);
    return res;
  },

  async adminGoogleLogin(email: string, name?: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('/auth/admin-google', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
    localStorage.setItem('markety_auth_token', res.token);
    return res;
  },

  async requestPasswordReset(email: string): Promise<{ message: string; resetToken?: string }> {
    return request<{ message: string; resetToken?: string }>('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(email: string, token: string, newPassword: string): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, newPassword }),
    });
  },

  async register(name: string, email: string, password: string, phone?: string, company?: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, company }),
    });
    localStorage.setItem('markety_auth_token', res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('markety_auth_token');
    }
  },

  async updateProfile(data: { name?: string; phone?: string; company?: string; currentPassword?: string; newPassword?: string }): Promise<{ user: User }> {
    return request<{ user: User }>('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string; featured?: boolean }): Promise<{ products: Product[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.featured) query.set('featured', 'true');
    const queryString = query.toString();
    return request<{ products: Product[] }>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  async getProduct(idOrSlug: string): Promise<{ product: Product }> {
    return request<{ product: Product }>(`/products/${idOrSlug}`);
  },

  // Orders
  async checkout(orderData: {
    productId: string;
    selectedPackage: PackageTierKey;
    currency: 'PKR' | 'USD';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNotes?: string;
    paymentMethod: PaymentMethod;
    couponCode?: string;
  }): Promise<{ order: Order; message: string }> {
    return request<{ order: Order; message: string }>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getMyOrders(): Promise<{ orders: Order[] }> {
    return request<{ orders: Order[] }>('/orders/my-orders');
  },

  async getOrder(idOrNumber: string): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/orders/${idOrNumber}`);
  },

  async submitPaymentReference(idOrNumber: string, data: { paymentReference?: string; receiptUrl?: string }): Promise<{ order: Order; message: string }> {
    return request<{ order: Order; message: string }>(`/orders/${idOrNumber}/payment-reference`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Coupons
  async validateCoupon(code: string, amount: number, currency: 'PKR' | 'USD'): Promise<{ valid: boolean; discount: number; finalAmount: number; code: string }> {
    return request<{ valid: boolean; discount: number; finalAmount: number; code: string }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount, currency }),
    });
  },

  async getAdminCoupons(): Promise<{ coupons: Coupon[] }> {
    return request<{ coupons: Coupon[] }>('/admin/coupons');
  },

  async saveAdminCoupon(coupon: Partial<Coupon>, isEdit: boolean = false): Promise<{ coupon: Coupon }> {
    if (isEdit && coupon.id) {
      return request<{ coupon: Coupon }>(`/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        body: JSON.stringify(coupon),
      });
    }
    return request<{ coupon: Coupon }>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  async deleteAdminCoupon(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  // Inquiries
  async submitContact(data: { name: string; email: string; phone?: string; message: string }): Promise<{ message: string }> {
    return request<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitCustomRequest(data: {
    name: string;
    email: string;
    phone?: string;
    budget?: string;
    projectType?: string;
    timeline?: string;
    message: string;
  }): Promise<{ message: string }> {
    return request<{ message: string }>('/custom-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Content & Settings
  async getContent(): Promise<{ content: WebsiteContent }> {
    return request<{ content: WebsiteContent }>('/content');
  },

  async updateContent(content: Partial<WebsiteContent>): Promise<{ content: WebsiteContent }> {
    return request<{ content: WebsiteContent }>('/admin/content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  async getSettings(): Promise<{ settings: PlatformSettings }> {
    return request<{ settings: PlatformSettings }>('/settings');
  },

  // Admin endpoints
  async getAdminStats(dateFilter: string = 'all'): Promise<{ stats: AdminStats }> {
    return request<{ stats: AdminStats }>(`/admin/stats?dateFilter=${dateFilter}`);
  },

  async getAdminReports(): Promise<{ reports: any }> {
    return request<{ reports: any }>('/admin/reports');
  },

  async getAdminProducts(params?: { search?: string; category?: string; status?: string }): Promise<{ products: Product[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    const queryString = query.toString();
    return request<{ products: Product[] }>(`/admin/products${queryString ? `?${queryString}` : ''}`);
  },

  async saveAdminProduct(productData: Partial<Product>, isEdit: boolean = false): Promise<{ product: Product }> {
    if (isEdit && productData.id) {
      return request<{ product: Product }>(`/admin/products/${productData.id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    }
    return request<{ product: Product }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async toggleProductStatus(id: string): Promise<{ product: Product }> {
    return request<{ product: Product }>(`/admin/products/${id}/toggle-status`, { method: 'POST' });
  },

  async toggleProductFeatured(id: string): Promise<{ product: Product }> {
    return request<{ product: Product }>(`/admin/products/${id}/toggle-featured`, { method: 'POST' });
  },

  async deleteAdminProduct(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin File Management
  async uploadAdminFile(data: {
    title: string;
    filename: string;
    fileBase64: string;
    isSourceCode?: boolean;
    description?: string;
  }): Promise<{ file: DeliverableFile; message: string }> {
    return request<{ file: DeliverableFile; message: string }>('/admin/files/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async attachProductFile(productId: string, file: DeliverableFile): Promise<{ product: Product; file: DeliverableFile }> {
    return request<{ product: Product; file: DeliverableFile }>(`/admin/products/${productId}/files`, {
      method: 'POST',
      body: JSON.stringify(file),
    });
  },

  async removeProductFile(productId: string, fileId: string): Promise<{ product: Product }> {
    return request<{ product: Product }>(`/admin/products/${productId}/files/${fileId}`, {
      method: 'DELETE',
    });
  },

  async getMissingSourceProducts(): Promise<{ missingProducts: Product[] }> {
    return request<{ missingProducts: Product[] }>('/admin/files/missing-source');
  },

  // Admin Orders
  async getAdminOrders(params?: { status?: string; fulfillmentStatus?: string; search?: string; dateFilter?: string }): Promise<{ orders: Order[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.fulfillmentStatus) query.set('fulfillmentStatus', params.fulfillmentStatus);
    if (params?.search) query.set('search', params.search);
    if (params?.dateFilter) query.set('dateFilter', params.dateFilter);
    const queryString = query.toString();
    return request<{ orders: Order[] }>(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  async verifyPayment(orderId: string): Promise<{ order: Order; message: string }> {
    return request<{ order: Order; message: string }>(`/admin/orders/${orderId}/verify-payment`, {
      method: 'POST',
    });
  },

  async rejectPayment(orderId: string, reason: string): Promise<{ order: Order; message: string }> {
    return request<{ order: Order; message: string }>(`/admin/orders/${orderId}/reject-payment`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async approveDelivery(orderId: string, deliveryNotes?: string): Promise<{ order: Order; message: string }> {
    return request<{ order: Order; message: string }>(`/admin/orders/${orderId}/approve-delivery`, {
      method: 'POST',
      body: JSON.stringify({ deliveryNotes }),
    });
  },

  async updateAdminNotes(orderId: string, notes: string): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/admin/orders/${orderId}/admin-notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  async updateOrderStatus(orderId: string, status?: string, fulfillmentStatus?: string): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/admin/orders/${orderId}/update-status`, {
      method: 'POST',
      body: JSON.stringify({ status, fulfillmentStatus }),
    });
  },

  async attachDeliverable(orderId: string, deliverableData: Partial<DeliverableFile>): Promise<{ order: Order }> {
    return request<{ order: Order }>(`/admin/orders/${orderId}/attach-deliverable`, {
      method: 'POST',
      body: JSON.stringify(deliverableData),
    });
  },

  // Admin Customers
  async getAdminCustomers(search?: string): Promise<{ customers: User[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ customers: User[] }>(`/admin/customers${query}`);
  },

  async getCustomerOrdersAdmin(customerId: string): Promise<{ orders: Order[] }> {
    return request<{ orders: Order[] }>(`/admin/customers/${customerId}/orders`);
  },

  // Admin Inquiries
  async getAdminInquiries(params?: { status?: string; type?: string }): Promise<{ inquiries: Inquiry[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    const queryString = query.toString();
    return request<{ inquiries: Inquiry[] }>(`/admin/inquiries${queryString ? `?${queryString}` : ''}`);
  },

  async updateInquiryStatus(id: string, status: string, adminNotes?: string): Promise<{ inquiry: Inquiry }> {
    return request<{ inquiry: Inquiry }>(`/admin/inquiries/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  async updateSettings(settings: Partial<PlatformSettings>): Promise<{ settings: PlatformSettings }> {
    return request<{ settings: PlatformSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async getAdminAuditLogs(): Promise<{ logs: any[] }> {
    return request<{ logs: any[] }>('/admin/audit-logs');
  },

  // Policies (Public & Admin CRUD)
  async getPolicies(): Promise<{ policies: PolicyItem[] }> {
    return request<{ policies: PolicyItem[] }>('/policies');
  },

  async getPolicy(key: string): Promise<{ policy: PolicyItem }> {
    return request<{ policy: PolicyItem }>(`/policies/${key}`);
  },

  async createPolicy(policy: Partial<PolicyItem>): Promise<{ policy: PolicyItem }> {
    return request<{ policy: PolicyItem }>('/admin/policies', {
      method: 'POST',
      body: JSON.stringify(policy),
    });
  },

  async updatePolicy(id: string, policy: Partial<PolicyItem>): Promise<{ policy: PolicyItem }> {
    return request<{ policy: PolicyItem }>(`/admin/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policy),
    });
  },

  async deletePolicy(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/admin/policies/${id}`, {
      method: 'DELETE',
    });
  }
};

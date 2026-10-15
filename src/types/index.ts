export type ProductCategory =
  | 'Ecommerce Websites'
  | 'Business Websites'
  | 'Portfolio Websites'
  | 'Landing Pages'
  | 'AI Web Applications'
  | 'Agency Websites'
  | 'Restaurant Websites'
  | 'SaaS Websites'
  | 'Custom Projects'
  | 'Custom Website Projects';

export type PackageTierKey = 'starter' | 'professional' | 'custom';

export interface PackageConfig {
  enabled: boolean;
  name: string;
  pricePKR?: number;
  priceUSD?: number;
  description: string;
  features: string[];
}

export interface DeliverableFile {
  id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  description: string;
  isSourceCode?: boolean;
  storagePath?: string;
  uploadedAt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  screenshots: string[];
  pricePKR: number;
  priceUSD: number;
  discountPercent?: number;
  technologies: string[];
  responsive: boolean;
  sourceCodeIncluded: boolean;
  liveDemoUrl: string;
  featured: boolean;
  status: 'published' | 'draft';
  packages: {
    starter: PackageConfig;
    professional: PackageConfig;
    custom: PackageConfig;
  };
  requirements: {
    backend: string;
    hosting: string;
    database: string;
  };
  deliveryFormat: string;
  estimatedDeliveryTime: string;
  licenseTerms?: string;
  deliveryInstructions?: string;
  productFiles?: DeliverableFile[];
  faq: { question: string; answer: string }[];
  createdAt: string;
}

export type OrderPaymentStatus =
  | 'pending_payment'
  | 'payment_under_review'
  | 'paid'
  | 'processing'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type FulfillmentStatus = 'unfulfilled' | 'preparing' | 'delivered';

export type PaymentMethod =
  | 'jazzcash'
  | 'easypaisa'
  | 'bank_transfer'
  | 'international_gateway';

export interface OrderDownloadLog {
  fileId: string;
  filename: string;
  downloadedAt: string;
  ip?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  category: ProductCategory;
  selectedPackage: PackageTierKey;
  packagePrice: number;
  currency: 'PKR' | 'USD';
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  paymentReference?: string;
  receiptUrl?: string;
  receiptSubmittedAt?: string;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  rejectionReason?: string;
  adminNotes?: string;
  couponCode?: string;
  discountAmount?: number;
  deliveryNotes?: string;
  deliveryDate?: string;
  deliverables: DeliverableFile[];
  downloadActivity?: OrderDownloadLog[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  company?: string;
  orderCount?: number;
  totalSpentPKR?: number;
  totalSpentUSD?: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  currency?: 'PKR' | 'USD';
  minOrderValue?: number;
  maxUsage?: number;
  usageCount: number;
  startDate: string;
  expiryDate: string;
  active: boolean;
  createdAt: string;
}

export interface PolicyItem {
  id: string;
  key: string;
  title: string;
  category: string;
  content: string;
  icon?: string;
  updatedAt: string;
}

export interface WebsiteContent {
  heroHeadline: string;
  heroDescription: string;
  heroTagline: string;
  aboutTitle: string;
  aboutDescription: string;
  privacyPolicy: string;
  termsAndConditions: string;
  refundPolicy: string;
  deliveryPolicy: string;
  faqs: { question: string; answer: string }[];
}

export interface PlatformSettings {
  websiteName: string;
  whatsappNumber: string;
  contactEmail: string;
  supportHours: string;
  exchangeRateUSDToPKR: number;
  policies?: PolicyItem[];
  paymentAccounts: {
    jazzcash: { accountTitle: string; accountNumber: string; instructions: string };
    easypaisa: { accountTitle: string; accountNumber: string; instructions: string };
    bank: { bankName: string; accountTitle: string; accountNumber: string; iban: string; swift: string; branch: string };
    gateway: { name: string; isConfigured: boolean; description: string; publishableKey?: string };
  };
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
    instagram: string;
  };
  content?: WebsiteContent;
  developerProfile?: DeveloperProfile;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'AI & Tools' | 'Mobile';
  level: number;
  years: number;
  icon?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  icon: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  pricePKR: number;
  priceUSD: number;
  pricingModel: 'Fixed' | 'Starting From' | 'Hourly';
  deliveryTime: string;
  deliverables: string[];
  active: boolean;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientTitle: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  projectUrl?: string;
  featured?: boolean;
  createdAt: string;
}

export interface DeveloperProfile {
  fullName: string;
  headline: string;
  tagline: string;
  bio: string;
  avatar: string;
  location: string;
  availability: 'Available for Hire' | 'Open to Contracts' | 'Busy / Selective';
  yearsExperience: number;
  completedProjectsCount: number;
  happyClientsCount: number;
  hourlyRatePKR: number;
  hourlyRateUSD: number;
  resumeUrl: string;
  skills: SkillItem[];
  services: ServiceItem[];
  experience: ExperienceItem[];
  testimonials: TestimonialItem[];
}

export interface Inquiry {
  id: string;
  type: 'general' | 'custom_project' | 'question' | 'delivery_issue' | 'refund_request';
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  projectType?: string;
  timeline?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'pending' | 'resolved';
  adminNotes?: string;
  repliedAt?: string;
}

export interface AdminStats {
  totalWebsites: number;
  publishedWebsites: number;
  draftWebsites: number;
  totalOrders: number;
  pendingPaymentsCount: number;
  verifiedPaymentsCount: number;
  ordersAwaitingDeliveryCount: number;
  totalRevenuePKR: number;
  totalRevenueUSD: number;
  totalCustomers: number;
  recentOrders: Order[];
  recentCustomers: User[];
  recentActivity: {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    actor: string;
  }[];
}

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  Order,
  User,
  PlatformSettings,
  Inquiry,
  AdminStats,
  Coupon,
  WebsiteContent,
  DeliverableFile,
  OrderDownloadLog,
  PolicyItem,
  DeveloperProfile
} from '../src/types/index.js';

const DATA_FILE = path.resolve(process.cwd(), 'server_data.json');
export const STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'deliverables');

// Ensure private storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Password hashing helper using standard node crypto PBKDF2
export function hashPassword(password: string, salt: string = 'markety_salt_2026'): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export interface StoredUser extends User {
  passwordHash: string;
  resetToken?: string;
  resetTokenExpires?: number;
}

export interface Session {
  token: string;
  userId: string;
  role: 'admin' | 'customer';
  expiresAt: number;
}

export interface FailedLoginAttempt {
  count: number;
  lockedUntil?: number;
  lastAttempt: number;
}

export interface DatabaseSchema {
  users: StoredUser[];
  sessions: Session[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  inquiries: Inquiry[];
  content: WebsiteContent;
  settings: PlatformSettings;
  policies: PolicyItem[];
  auditLogs: {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    actor: string;
  }[];
}

export const INITIAL_POLICIES: PolicyItem[] = [
  {
    id: 'pol-licensing',
    key: 'licensing',
    title: 'Commercial Website Licensing Terms',
    category: 'Licensing',
    icon: 'shield',
    content: `When you purchase any ready-made website or application on Smart Developer, you receive a standard single-end-product commercial license unless an enterprise reselling license is explicitly arranged.

What You Can Do:
• Use the source code for your personal or commercial business website.
• Modify, rebrand, adapt, and expand any part of the source code.
• Deploy to any hosting service (Vercel, Netlify, AWS, VPS, cPanel).
• Integrate your own payment gateways, APIs, databases, and branding assets.

What You Cannot Do:
• Resell or redistribute the raw source code on another template marketplace.
• Claim original authorship of the Smart Developer base architecture without license.`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pol-delivery',
    key: 'delivery',
    title: 'Verified Website Delivery Policy',
    category: 'Delivery',
    icon: 'clock',
    content: `Smart Developer follows a strict payment verification and instant digital deliverable release workflow.

Delivery Workflow:
1. Order Creation: Customer chooses package tier and selects payment method.
2. Payment Submission: Customer sends payment via JazzCash, Easypaisa, or Bank Transfer and enters the TID/Reference in the portal.
3. Verification: Smart Developer administrative verification team validates receipt against bank/merchant logs.
4. File Release: Deliverables (Full Source ZIP, Deployment Guide, Migration Scripts) become immediately downloadable inside your Customer Dashboard.

Average verification turnaround during business hours is 30–90 minutes. You will also receive an email notification when files are unlocked.`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pol-refund',
    key: 'refund',
    title: 'Refund & Defect Warranty Policy',
    category: 'Refund',
    icon: 'file-text',
    content: `Because Smart Developer provides full unminified digital source code, purchases are governed by standard software licensing regulations.

Code Quality Guarantee:
Every website listing undergoes multi-device responsiveness testing and TypeScript type check validation. If you find a verified defect or broken component that differs from the live demo, our engineering team will provide code patches free of charge within the 30-day warranty window.

Refund Eligibility:
Refunds can be requested if an order has not yet been verified or if technical delivery fails and our team is unable to rectify the issue within 5 business days. Once source code ZIP files have been downloaded by the customer, refunds cannot be processed due to the irrevocable nature of digital goods.`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pol-support',
    key: 'support',
    title: 'Developer Support Scope & Guidelines',
    category: 'Support',
    icon: 'check',
    content: `We are committed to helping you launch smoothly and successfully.

Starter Package Support:
Includes comprehensive PDF setup guide, environment variable checklist, and 30 days of email assistance for installation questions.

Professional Package Support:
Includes hands-on remote deployment onto your server/domain, payment gateway configuration assistance, and direct WhatsApp developer priority support for 60 days.`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pol-privacy',
    key: 'privacy',
    title: 'Privacy & Data Security Policy',
    category: 'Privacy',
    icon: 'shield',
    content: `Smart Developer values customer privacy. We collect only necessary contact and billing details to process orders, verify payments, and deliver software files.

We do not sell, rent, or share personal information with third parties. All transactional records and payment receipts are encrypted and stored in secure restricted databases.`,
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_CONTENT: WebsiteContent = {
  heroTagline: 'Premium Websites. Ready for Your Next Big Idea.',
  heroHeadline: 'Your Next Website Is Already Built.',
  heroDescription: 'Discover premium, ready-made websites built for businesses, entrepreneurs, and creators. Preview the live experience, choose your website, and get the files you need to launch.',
  aboutTitle: 'About Smart Developer',
  aboutDescription: 'Smart Developer is a digital web architecture boutique and website marketplace. We engineer high-performance web applications, ecommerce stores, and agency platforms built with TypeScript, React, and modern full-stack frameworks. Every website includes verified source code and step-by-step launch documentation.',
  privacyPolicy: 'Smart Developer values customer privacy. We collect only necessary contact and billing details to process orders, verify payments, and deliver software files. We do not sell or share personal information with third parties.',
  termsAndConditions: 'All ready-made websites are delivered under a commercial single-production license. Resale of raw source code on secondary template directories is prohibited. Support is provided according to your selected package tier.',
  refundPolicy: 'Digital source code releases cannot be returned once files have been unlocked and downloaded. If a technical flaw differs from the verified live demo, our engineering team provides code patches free of charge within 30 days.',
  deliveryPolicy: 'Orders are verified manually via bank and mobile transaction logs. Once approved by the administrator, deliverables unlock automatically in the customer account dashboard.',
  faqs: [
    {
      question: 'What do I receive upon purchasing a website?',
      answer: 'You receive a complete, unminified digital deliverable archive including full React and TypeScript source files, CSS stylesheets, asset folders, configuration files, and a step-by-step PDF Deployment Guide tailored for Vercel, Netlify, or self-hosted servers.'
    },
    {
      question: 'Which payment methods do you support in Pakistan and internationally?',
      answer: 'For clients in Pakistan, we accept JazzCash, Easypaisa, and direct Bank Transfer (Meezan Bank). For international buyers, wire transfer and international card payments are supported in USD.'
    },
    {
      question: 'How long does payment verification take?',
      answer: 'When you submit your JazzCash/Easypaisa TID or bank payment reference, our verification desk validates the transaction within 30 to 90 minutes during active operating hours. Once approved, files become downloadable in your Customer Dashboard immediately.'
    },
    {
      question: 'Can I request custom modifications for my business?',
      answer: 'Yes! You can choose the Professional package or request a Custom Website Project quote. Our senior engineering team can integrate custom databases, modify branding, wire custom payment gateways, and configure custom domain DNS.'
    },
    {
      question: 'Do you charge any recurring monthly license fees?',
      answer: 'No. All ready-made websites on Smart Developer are one-time purchases with a commercial license for a single production deployment. You own the code without recurring subscription fees.'
    }
  ]
};

const DEFAULT_DEVELOPER_PROFILE: DeveloperProfile = {
  fullName: 'Umair Kamboh',
  headline: 'Senior Full-Stack Engineer & SaaS Architect',
  tagline: 'Crafting high-impact web apps, custom digital platforms, and production-ready codebases.',
  bio: 'Passionate software engineer and tech entrepreneur with 6+ years of expertise delivering high-performance web applications, scalable APIs, and bespoke digital solutions for global clients and startups.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  location: 'Lahore, Pakistan / Remote Worldwide',
  availability: 'Available for Hire',
  yearsExperience: 6,
  completedProjectsCount: 52,
  happyClientsCount: 44,
  hourlyRatePKR: 12500,
  hourlyRateUSD: 45,
  resumeUrl: '#download-resume',
  skills: [
    { id: 'sk-1', name: 'React & Next.js', category: 'Frontend', level: 96, years: 5, icon: 'code', featured: true },
    { id: 'sk-2', name: 'TypeScript & JavaScript', category: 'Frontend', level: 94, years: 5, icon: 'file-code', featured: true },
    { id: 'sk-3', name: 'Tailwind CSS & UI Systems', category: 'Frontend', level: 95, years: 4, icon: 'palette', featured: true },
    { id: 'sk-4', name: 'Node.js & Express', category: 'Backend', level: 92, years: 5, icon: 'server', featured: true },
    { id: 'sk-5', name: 'Python & FastAPI', category: 'Backend', level: 88, years: 4, icon: 'terminal', featured: false },
    { id: 'sk-6', name: 'PostgreSQL & Drizzle ORM', category: 'Database', level: 90, years: 4, icon: 'database', featured: true },
    { id: 'sk-7', name: 'MongoDB & Redis Cache', category: 'Database', level: 86, years: 4, icon: 'database', featured: false },
    { id: 'sk-8', name: 'Docker & Cloud Deployment', category: 'Cloud & DevOps', level: 85, years: 3, icon: 'cloud', featured: false },
    { id: 'sk-9', name: 'AI Models & Gemini Integration', category: 'AI & Tools', level: 92, years: 2, icon: 'cpu', featured: true },
    { id: 'sk-10', name: 'Git & CI/CD Pipelines', category: 'Cloud & DevOps', level: 91, years: 5, icon: 'git-branch', featured: false }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Full-Stack Web App Development',
      slug: 'fullstack-web-apps',
      icon: 'globe',
      category: 'Web Engineering',
      shortDescription: 'Modern, high-velocity web applications built with Next.js, React, Node, and TypeScript.',
      fullDescription: 'From initial architecture to production launch, I build reliable, secure, responsive web applications engineered for speed, clean code, and intuitive UX.',
      pricePKR: 85000,
      priceUSD: 350,
      pricingModel: 'Starting From',
      deliveryTime: '5-10 Days',
      deliverables: ['Production TypeScript React code', 'Modern Tailwind UI/UX', 'REST API / Database backend', 'Live deployment on cloud', '30 days warranty support'],
      active: true,
      featured: true
    },
    {
      id: 'srv-2',
      title: 'SaaS MVP & AI-Powered Platforms',
      slug: 'saas-mvp-engineering',
      icon: 'sparkles',
      category: 'SaaS & AI',
      shortDescription: 'Turn ideas into real software products with authentication, subscriptions, and AI capabilities.',
      fullDescription: 'Rapid MVP engineering for software founders. Complete with RBAC auth, database schemas, payment integrations, and AI workflow automation.',
      pricePKR: 140000,
      priceUSD: 590,
      pricingModel: 'Starting From',
      deliveryTime: '10-14 Days',
      deliverables: ['Full-stack SaaS architecture', 'User auth & customer dashboards', 'Stripe / JazzCash payments', 'Automated AI workflows', 'Documentation & handover'],
      active: true,
      featured: true
    },
    {
      id: 'srv-3',
      title: 'High-Converting Ecommerce & Marketplaces',
      slug: 'ecommerce-marketplaces',
      icon: 'shopping-cart',
      category: 'E-commerce',
      shortDescription: 'Scalable e-commerce stores with catalog filters, cart, and multi-currency checkout.',
      fullDescription: 'Custom online shopping experiences featuring instant search, package tiers, payment gateways (JazzCash, Easypaisa, Stripe), and automated order deliveries.',
      pricePKR: 95000,
      priceUSD: 400,
      pricingModel: 'Starting From',
      deliveryTime: '7-12 Days',
      deliverables: ['Responsive store UI', 'Secure checkout flow', 'Admin inventory & order panel', 'Payment gateway setup', 'SEO meta & social tags'],
      active: true,
      featured: true
    },
    {
      id: 'srv-4',
      title: 'Bespoke Portfolio & Corporate Websites',
      slug: 'portfolio-corporate-sites',
      icon: 'briefcase',
      category: 'Branding & Showcase',
      shortDescription: 'Premium, interactive portfolio and agency websites designed to win clients and elevate brands.',
      fullDescription: 'Stand out from competitors with custom animations, editorial typography, case study modals, and direct client inquiry systems.',
      pricePKR: 45000,
      priceUSD: 190,
      pricingModel: 'Fixed',
      deliveryTime: '3-5 Days',
      deliverables: ['Custom bespoke design', 'Interactive project gallery', 'Client inquiry / lead capture', 'Ultra-fast 98+ PageSpeed score', 'Full source code & hosting guide'],
      active: true,
      featured: false
    }
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Lead Full-Stack Architect',
      company: 'Smart Developer Studio',
      location: 'Remote',
      period: '2022 - Present',
      current: true,
      description: 'Architecting ready-made commercial web applications, SaaS platforms, and bespoke client projects with TypeScript, React, and Node.js.',
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Cloud Architecture']
    },
    {
      id: 'exp-2',
      title: 'Senior Software Engineer',
      company: 'Apex Digital Technologies',
      location: 'Lahore, Pakistan',
      period: '2020 - 2022',
      current: false,
      description: 'Built scalable backend microservices, optimized SQL databases, and led the frontend team to build high-converting e-commerce web applications.',
      skills: ['Express.js', 'PostgreSQL', 'Redis', 'React', 'Docker', 'REST APIs']
    },
    {
      id: 'exp-3',
      title: 'Frontend Developer & UI Specialist',
      company: 'Creative Labs PK',
      location: 'Lahore, Pakistan',
      period: '2018 - 2020',
      current: false,
      description: 'Crafted modern corporate websites, responsive design systems, and rich interactive web experiences for international agency clients.',
      skills: ['JavaScript', 'HTML5/CSS3', 'UI/UX Design', 'Vue.js', 'WordPress']
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      clientName: 'Hamza Farooq',
      clientTitle: 'Founder & CEO',
      company: 'Nova Digital Karachi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      content: 'Umair built our entire SaaS product from scratch in under two weeks. The code quality, speed, and design polish were incredible. Highly recommended!',
      projectUrl: 'https://smartdeveloper.com',
      featured: true,
      createdAt: '2026-09-15'
    },
    {
      id: 'test-2',
      clientName: 'Sarah Jenkins',
      clientTitle: 'Product Director',
      company: 'Vanguard Media UK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      content: 'The portfolio website and code delivery were flawless. Everything was clean, documented, and ready for instant deployment. 10/10 developer!',
      projectUrl: 'https://smartdeveloper.com',
      featured: true,
      createdAt: '2026-09-28'
    },
    {
      id: 'test-3',
      clientName: 'Bilal Siddiqui',
      clientTitle: 'E-commerce Lead',
      company: 'RetailHub Pakistan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      content: 'Fast delivery, smooth communication via WhatsApp, and transparent pricing. The JazzCash and bank verification made it super easy for local payments.',
      projectUrl: 'https://smartdeveloper.com',
      featured: true,
      createdAt: '2026-10-02'
    }
  ]
};

const DEFAULT_SETTINGS: PlatformSettings = {
  websiteName: 'Smart Developer',
  whatsappNumber: '+92 300 1234567',
  contactEmail: 'sales@smartdeveloper.com',
  supportHours: 'Mon - Sat: 9:00 AM - 10:00 PM PKT (UTC+5)',
  exchangeRateUSDToPKR: 278.5,
  paymentAccounts: {
    jazzcash: {
      accountTitle: 'MARKETY STUDIO PK',
      accountNumber: '03001234567',
      instructions: 'Open your JazzCash App > Send Money > Enter Mobile Number 03001234567. Confirm Receiver Name is MARKETY STUDIO PK. Take a screenshot of the transaction receipt and copy the TID / Reference Number.'
    },
    easypaisa: {
      accountTitle: 'MARKETY STUDIO PK',
      accountNumber: '03451234567',
      instructions: 'Open Easypaisa > Send Money to Mobile Account > 03451234567. Ensure Account Title is MARKETY STUDIO PK. Copy your Transaction ID (TRX ID) and attach your payment receipt screenshot.'
    },
    bank: {
      bankName: 'Meezan Bank Limited',
      accountTitle: 'MARKETY STUDIO PRIVATE LIMITED',
      accountNumber: '01010102938475',
      iban: 'PK45MEZN0001010102938475',
      swift: 'MEZNPKKA',
      branch: 'DHA Phase 5 Branch, Lahore'
    },
    gateway: {
      name: 'Stripe International Checkout',
      isConfigured: false,
      description: 'Accepts Visa, Mastercard, American Express internationally in USD. Setup your Stripe keys in Admin Settings to enable automated processing.'
    }
  },
  socialLinks: {
    twitter: 'https://twitter.com/marketystudio',
    github: 'https://github.com/marketystudio',
    linkedin: 'https://linkedin.com/company/marketystudio',
    instagram: 'https://instagram.com/marketystudio'
  },
  content: DEFAULT_CONTENT,
  developerProfile: DEFAULT_DEVELOPER_PROFILE
};

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 20000,
    maxUsage: 100,
    usageCount: 7,
    startDate: '2026-01-01T00:00:00Z',
    expiryDate: '2026-12-31T23:59:59Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'coup-launch50',
    code: 'LAUNCH50',
    discountType: 'fixed',
    discountValue: 5000,
    currency: 'PKR',
    minOrderValue: 40000,
    maxUsage: 50,
    usageCount: 14,
    startDate: '2026-02-01T00:00:00Z',
    expiryDate: '2026-12-31T23:59:59Z',
    active: true,
    createdAt: '2026-02-01T00:00:00Z'
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-smart-buy-01',
    slug: 'smart-buy-ecommerce',
    name: 'Smart Buy — Luxury Ecommerce Store',
    category: 'Ecommerce Websites',
    shortDescription: 'Turnkey high-conversion ecommerce platform with cart checkout, product variations, and mobile-optimized luxury aesthetic.',
    fullDescription: 'Smart Buy is an ultra-fast, luxury-grade ecommerce web storefront engineered for premium apparel, lifestyle brands, and boutique retail. Includes interactive bag drawer, multi-angle gallery, instant client filtering, and production-ready checkout structure. Comes with complete React/TypeScript source code and step-by-step launch documentation.',
    thumbnail: '/src/assets/images/smart_buy_ecommerce_1791631896429.jpg',
    screenshots: [
      '/src/assets/images/smart_buy_ecommerce_1791631896429.jpg',
      '/src/assets/images/hero_marketplace_preview_1791631880640.jpg'
    ],
    pricePKR: 75000,
    priceUSD: 270,
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Zustand State', 'Lucide Icons'],
    responsive: true,
    sourceCodeIncluded: true,
    liveDemoUrl: '#live-demo-smart-buy',
    featured: true,
    status: 'published',
    productFiles: [
      {
        id: 'file-sb-01',
        title: 'Smart Buy Production Source Code',
        filename: 'smart-buy-ecommerce-v1.0.zip',
        fileType: 'application/zip',
        fileSize: '14.8 MB',
        downloadUrl: '/api/downloads/ord-mkt-1082/deliv-01',
        description: 'Complete React/TypeScript source files with build scripts and package configurations.',
        isSourceCode: true,
        uploadedAt: '2026-03-01T10:00:00Z'
      },
      {
        id: 'file-sb-02',
        title: 'Deployment & Setup Guide',
        filename: 'smart-buy-deployment-guide.pdf',
        fileType: 'application/pdf',
        fileSize: '1.2 MB',
        downloadUrl: '/api/downloads/ord-mkt-1082/deliv-02',
        description: 'Step-by-step instructions for Vercel, Netlify, and custom domain setup.',
        isSourceCode: false,
        uploadedAt: '2026-03-01T10:00:00Z'
      }
    ],
    packages: {
      starter: {
        enabled: true,
        name: 'Starter Package',
        pricePKR: 75000,
        priceUSD: 270,
        description: 'Complete source code and setup instructions for self-hosting.',
        features: [
          'Full React/TypeScript Source Code ZIP',
          'Tailwind CSS design system & responsive layout',
          'Catalog, Filter & Cart Drawer functionality',
          'Step-by-step local & cloud deployment guide',
          '30-day bug fix warranty'
        ]
      },
      professional: {
        enabled: true,
        name: 'Professional Package',
        pricePKR: 115000,
        priceUSD: 410,
        description: 'Includes setup, payment gateway integration & domain linking.',
        features: [
          'Everything in Starter Package',
          'Deployment onto your Vercel/Netlify/VPS server',
          'JazzCash/Easypaisa/Stripe configuration',
          'Custom brand color & logo replacement',
          '60-day direct developer support'
        ]
      },
      custom: {
        enabled: true,
        name: 'Custom Tailored Project',
        description: 'Full custom redesign, database backend & ERP integration.',
        features: [
          'Everything in Professional Package',
          'Custom PostgreSQL or headless CMS setup',
          'Inventory sync & warehouse integration',
          'Dedicated senior software engineer'
        ]
      }
    },
    requirements: {
      backend: 'Node.js 18+ or standard static CDN (Vercel, Netlify, Cloudflare)',
      hosting: 'Vercel, Netlify, AWS S3, or cPanel Node.js',
      database: 'Optional (Includes mock store, easily connects to Supabase/PostgreSQL/Shopify)'
    },
    deliveryFormat: 'ZIP Archive containing clean modular source code + PDF Deployment Manual',
    estimatedDeliveryTime: 'Instant after payment verification (1–3 hours during business hours)',
    faq: [
      {
        question: 'Do I get 100% source code ownership?',
        answer: 'Yes! You receive the full non-minified TypeScript and React source code without any DRM or license locks for your single commercial project.'
      },
      {
        question: 'Can I add my own payment gateway?',
        answer: 'Yes. The checkout module has standard provider hooks for JazzCash, Easypaisa, Stripe, and Cash on Delivery.'
      }
    ],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'prod-markety-biz-02',
    slug: 'markety-business',
    name: 'Markety Business — Corporate Platform',
    category: 'Business Websites',
    shortDescription: 'Polished executive corporate website designed for consultancy, financial firms, tech vendors, and B2B enterprises.',
    fullDescription: 'Designed with authority and precision, Markety Business gives your B2B enterprise immediate credibility. Features executive leadership profiles, interactive financial and impact data charts, lead generation capture funnels, and enterprise service breakdowns.',
    thumbnail: '/src/assets/images/markety_business_site_1791631912074.jpg',
    screenshots: [
      '/src/assets/images/markety_business_site_1791631912074.jpg',
      '/src/assets/images/hero_marketplace_preview_1791631880640.jpg'
    ],
    pricePKR: 55000,
    priceUSD: 195,
    technologies: ['Next.js/React', 'TypeScript', 'Tailwind CSS', 'Interactive Charts', 'Motion'],
    responsive: true,
    sourceCodeIncluded: true,
    liveDemoUrl: '#live-demo-markety-business',
    featured: true,
    status: 'published',
    productFiles: [
      {
        id: 'file-mb-01',
        title: 'Markety Business Source Code',
        filename: 'markety-business-v1.0.zip',
        fileType: 'application/zip',
        fileSize: '16.2 MB',
        downloadUrl: '/api/downloads/ord-mkt-1082/deliv-01',
        description: 'Complete Next.js/React source code with corporate layouts.',
        isSourceCode: true,
        uploadedAt: '2026-03-02T11:00:00Z'
      }
    ],
    packages: {
      starter: {
        enabled: true,
        name: 'Starter Package',
        pricePKR: 55000,
        priceUSD: 195,
        description: 'Complete website codebase with corporate sections & setup guide.',
        features: [
          'Full TypeScript Source Code ZIP',
          'Enterprise multi-page layout (Home, Services, Case Studies, Team)',
          'Validated lead capture & contact forms',
          'Deploy guide for Cloudflare / Vercel / Shared Hosting',
          '30-day technical assistance'
        ]
      },
      professional: {
        enabled: true,
        name: 'Professional Package',
        pricePKR: 85000,
        priceUSD: 305,
        description: 'Turnkey deployment with domain, SSL and CRM webhook wiring.',
        features: [
          'Everything in Starter Package',
          'Complete setup on your custom domain with SSL',
          'Lead form routing to your corporate email / WhatsApp',
          'Brand typography and asset integration',
          '60-day maintenance support'
        ]
      },
      custom: {
        enabled: true,
        name: 'Enterprise Custom',
        description: 'Multi-lingual setup, custom portal & compliance documents.',
        features: [
          'Full custom scope tailored to your company needs',
          'Dedicated project manager and priority delivery'
        ]
      }
    },
    requirements: {
      backend: 'Node.js 18+ or any static web host',
      hosting: 'Vercel, Netlify, cPanel, or Hostinger',
      database: 'None required for presentation tier; API webhooks ready'
    },
    deliveryFormat: 'ZIP Archive with complete documentation and environment configurations',
    estimatedDeliveryTime: 'Instant after payment verification',
    faq: [
      {
        question: 'Is SEO optimization already implemented?',
        answer: 'Yes! OpenGraph meta tags, Schema.org Organization markup, and semantic HTML5 hierarchy are pre-built.'
      }
    ],
    createdAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'prod-creative-portfolio-03',
    slug: 'creative-portfolio',
    name: 'Creative Portfolio — Developer & Designer Showcase',
    category: 'Portfolio Websites',
    shortDescription: 'High-impact personal portfolio with dark editorial styling, project showcase filters, and refined micro-interactions.',
    fullDescription: 'Stand out from the crowd with a bespoke editorial portfolio crafted for software engineers, product designers, and creative directors. Features project filtering, rich case study templates, resume viewer, and direct hire inquiry drawer.',
    thumbnail: '/src/assets/images/creative_portfolio_site_1791631928179.jpg',
    screenshots: [
      '/src/assets/images/creative_portfolio_site_1791631928179.jpg',
      '/src/assets/images/hero_marketplace_preview_1791631880640.jpg'
    ],
    pricePKR: 35000,
    priceUSD: 125,
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    responsive: true,
    sourceCodeIncluded: true,
    liveDemoUrl: '#live-demo-creative-portfolio',
    featured: true,
    status: 'published',
    productFiles: [
      {
        id: 'file-cp-01',
        title: 'Creative Portfolio Source Code',
        filename: 'creative-portfolio-v1.0.zip',
        fileType: 'application/zip',
        fileSize: '8.4 MB',
        downloadUrl: '/api/downloads/ord-mkt-1082/deliv-01',
        description: 'Complete lightweight portfolio source code with animations.',
        isSourceCode: true,
        uploadedAt: '2026-03-03T12:00:00Z'
      }
    ],
    packages: {
      starter: {
        enabled: true,
        name: 'Starter Package',
        pricePKR: 35000,
        priceUSD: 125,
        description: 'Instant source files with quick customization guide.',
        features: [
          'Complete clean React/Vite source code',
          'Pre-configured dark mode theme & typography',
          'Dynamic project gallery & detail modals',
          'One-click deploy button to GitHub Pages / Vercel',
          'Lifetime personal license'
        ]
      },
      professional: {
        enabled: true,
        name: 'Professional Setup',
        pricePKR: 55000,
        priceUSD: 195,
        description: 'We input your real projects, bio, and deploy to your custom domain.',
        features: [
          'Starter Package included',
          'Content population for up to 8 of your projects',
          'Custom domain configuration & SSL',
          'Email forwarding setup'
        ]
      },
      custom: {
        enabled: true,
        name: 'Custom Bespoke Portfolio',
        description: 'Unique custom animations, 3D WebGL hero or custom design.',
        features: ['Custom design sprint with dedicated designer']
      }
    },
    requirements: {
      backend: 'Static hosting (GitHub Pages, Vercel, Netlify — 100% free hosting tiers)',
      hosting: 'Any static host',
      database: 'Not required'
    },
    deliveryFormat: 'ZIP Archive + GitHub repository transfer upon request',
    estimatedDeliveryTime: 'Instant after payment verification',
    faq: [
      {
        question: 'Can I host this for free?',
        answer: 'Yes! This website is lightweight static HTML/JS/CSS and can be hosted completely free on Vercel, Netlify, or GitHub Pages.'
      }
    ],
    createdAt: '2026-03-03T12:00:00Z'
  },
  {
    id: 'prod-ai-assistant-04',
    slug: 'ai-assistant',
    name: 'AI Assistant — Neural Web Application',
    category: 'AI Web Applications',
    shortDescription: 'Production-ready AI web app interface featuring conversational streaming, vector nodes visualization, and telemetry.',
    fullDescription: 'A modern AI web application frontend and API bridge built for generative AI founders. Features multi-turn chat sessions, markdown/code syntax highlighting, model parameter controls, token telemetry counters, and vector search visualizer.',
    thumbnail: '/src/assets/images/ai_assistant_webapp_1791631943658.jpg',
    screenshots: [
      '/src/assets/images/ai_assistant_webapp_1791631943658.jpg',
      '/src/assets/images/hero_marketplace_preview_1791631880640.jpg'
    ],
    pricePKR: 85000,
    priceUSD: 305,
    technologies: ['React 19', 'TypeScript', 'Node.js Express', 'SSE Streaming', 'Tailwind CSS'],
    responsive: true,
    sourceCodeIncluded: true,
    liveDemoUrl: '#live-demo-ai-assistant',
    featured: true,
    status: 'published',
    productFiles: [
      {
        id: 'file-ai-01',
        title: 'AI Assistant Full-Stack Bundle',
        filename: 'ai-assistant-webapp-v1.0.zip',
        fileType: 'application/zip',
        fileSize: '19.5 MB',
        downloadUrl: '/api/downloads/ord-mkt-1082/deliv-01',
        description: 'Complete React frontend + Express SSE proxy backend.',
        isSourceCode: true,
        uploadedAt: '2026-03-04T14:00:00Z'
      }
    ],
    packages: {
      starter: {
        enabled: true,
        name: 'Starter Package',
        pricePKR: 85000,
        priceUSD: 305,
        description: 'Complete frontend interface + Express proxy backend.',
        features: [
          'Full Full-Stack Source Code (React + Express)',
          'Streaming response handlers (SSE & WebSockets)',
          'Markdown parsing, code copying & chat history memory',
          'Gemini / OpenAI API environment proxy setup',
          '30-day technical onboarding support'
        ]
      },
      professional: {
        enabled: true,
        name: 'Professional Package',
        pricePKR: 135000,
        priceUSD: 485,
        description: 'Full deployment with user authentication & database memory.',
        features: [
          'Starter package included',
          'User authentication (Email & Google login)',
          'Cloud database setup (PostgreSQL / SQLite) for chat history',
          'Deployment on Docker / VPS / Cloud Run',
          '60-day engineering support'
        ]
      },
      custom: {
        enabled: true,
        name: 'Custom AI Solution',
        description: 'Custom fine-tuning, RAG document pipelines & enterprise tools.',
        features: ['Custom RAG implementation & enterprise integrations']
      }
    },
    requirements: {
      backend: 'Node.js 18+ runtime',
      hosting: 'Vercel Serverless, Render, Railway, or Google Cloud Run',
      database: 'SQLite or PostgreSQL for storing sessions'
    },
    deliveryFormat: 'ZIP Archive containing full-stack codebase, .env.example, and setup script',
    estimatedDeliveryTime: 'Instant after payment verification',
    faq: [
      {
        question: 'Does this include API keys?',
        answer: 'No, you plug in your own Google Gemini or OpenAI API keys in the server .env file.'
      }
    ],
    createdAt: '2026-03-04T14:00:00Z'
  },
  {
    id: 'prod-modern-agency-05',
    slug: 'modern-agency',
    name: 'Modern Agency — Digital Studio Platform',
    category: 'Agency Websites',
    shortDescription: 'High-converting creative agency showcase with interactive case studies, service cards, and client quotation funnel.',
    fullDescription: 'Crafted for web agencies, marketing studios, and video production firms. Comes with dynamic bento grid layouts, client testimonial sliders, pricing tier comparison modules, and high-conversion client proposal request form.',
    thumbnail: '/src/assets/images/modern_agency_website_1791631986875.jpg',
    screenshots: [
      '/src/assets/images/modern_agency_website_1791631986875.jpg',
      '/src/assets/images/hero_marketplace_preview_1791631880640.jpg'
    ],
    pricePKR: 65000,
    priceUSD: 235,
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lucide'],
    responsive: true,
    sourceCodeIncluded: true,
    liveDemoUrl: '#live-demo-modern-agency',
    featured: false,
    status: 'published',
    productFiles: [
      {
        id: 'file-ma-01',
        title: 'Modern Agency Theme Archive',
        filename: 'modern-agency-showcase-v1.0.zip',
        fileType: 'application/zip',
        fileSize: '11.3 MB',
        downloadUrl: '/api/downloads/ord-mkt-1082/deliv-01',
        description: 'Full agency source code with case studies and animations.',
        isSourceCode: true,
        uploadedAt: '2026-03-05T09:00:00Z'
      }
    ],
    packages: {
      starter: {
        enabled: true,
        name: 'Starter Package',
        pricePKR: 65000,
        priceUSD: 235,
        description: 'Complete agency theme code and setup documentation.',
        features: [
          'Full React/TypeScript source code',
          'Bento grid case study layout & proposal modal',
          'SEO optimized metadata & lightning fast performance',
          'Deploy guide for Vercel / Netlify / cPanel',
          '30-day bug warranty'
        ]
      },
      professional: {
        enabled: true,
        name: 'Professional Package',
        pricePKR: 95000,
        priceUSD: 340,
        description: 'Complete customization with your team, portfolio, and domain.',
        features: [
          'Starter package included',
          'Complete content transfer for your agency',
          'Domain & SSL setup',
          'Lead webhook integration with WhatsApp and Slack'
        ]
      },
      custom: {
        enabled: true,
        name: 'Custom Agency Brand',
        description: 'Full custom design system and custom interactive capabilities.',
        features: ['Custom design sprint with senior creative technologist']
      }
    },
    requirements: {
      backend: 'Static hosting or Node.js',
      hosting: 'Vercel, Netlify, Cloudflare Pages',
      database: 'Not required'
    },
    deliveryFormat: 'ZIP Archive + Documentation PDF',
    estimatedDeliveryTime: 'Instant after payment verification',
    faq: [
      {
        question: 'Can I reuse this for multiple clients?',
        answer: 'The standard license is for a single agency production site. For client reselling rights, contact our custom licensing team.'
      }
    ],
    createdAt: '2026-03-05T09:00:00Z'
  }
];

class Database {
  private data: DatabaseSchema;
  private failedAttempts: Map<string, FailedLoginAttempt> = new Map();

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.coupons) parsed.coupons = INITIAL_COUPONS;
        if (!parsed.content) parsed.content = DEFAULT_CONTENT;
        if (!parsed.policies || !Array.isArray(parsed.policies) || parsed.policies.length === 0) {
          parsed.policies = INITIAL_POLICIES;
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing defaults:', err);
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminMarkety2026!';
    const defaultAdmin: StoredUser = {
      id: 'usr-admin-01',
      name: 'Smart Developer Admin',
      email: 'admin@smartdeveloper.com',
      role: 'admin',
      phone: '+92 300 1234567',
      company: 'Smart Developer PK',
      passwordHash: hashPassword(adminPassword),
      createdAt: new Date().toISOString()
    };

    const defaultCustomer: StoredUser = {
      id: 'usr-demo-customer-01',
      name: 'Tariq Mehmood',
      email: 'customer@example.com',
      role: 'customer',
      phone: '+92 321 9876543',
      company: 'Apex Digital Lahore',
      passwordHash: hashPassword('Customer123!'),
      createdAt: new Date().toISOString()
    };

    const sampleOrder: Order = {
      id: 'ord-mkt-1082',
      orderNumber: 'MKT-1082',
      productId: 'prod-smart-buy-01',
      productName: 'Smart Buy — Luxury Ecommerce Store',
      productThumbnail: '/src/assets/images/smart_buy_ecommerce_1791631896429.jpg',
      category: 'Ecommerce Websites',
      selectedPackage: 'starter',
      packagePrice: 75000,
      currency: 'PKR',
      customerId: 'usr-demo-customer-01',
      customerName: 'Tariq Mehmood',
      customerEmail: 'customer@example.com',
      customerPhone: '+92 321 9876543',
      customerNotes: 'Need files to launch our winter boutique.',
      paymentMethod: 'jazzcash',
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered',
      paymentReference: 'JC-8829104821',
      receiptSubmittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      paymentVerifiedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      paymentVerifiedBy: 'admin@marketystudio.com',
      deliveryDate: new Date(Date.now() - 3600000 * 18).toISOString(),
      deliveryNotes: 'Production build verified and released to customer.',
      deliverables: [
        {
          id: 'deliv-01',
          title: 'Smart Buy Production Source Code',
          filename: 'smart-buy-ecommerce-v1.0.zip',
          fileType: 'application/zip',
          fileSize: '14.8 MB',
          downloadUrl: '/api/downloads/ord-mkt-1082/deliv-01',
          description: 'Full unminified TypeScript/React source code with build scripts.',
          isSourceCode: true
        },
        {
          id: 'deliv-02',
          title: 'Deployment & Setup Guide',
          filename: 'smart-buy-deployment-guide.pdf',
          fileType: 'application/pdf',
          fileSize: '1.2 MB',
          downloadUrl: '/api/downloads/ord-mkt-1082/deliv-02',
          description: 'Step-by-step instructions for Vercel, Netlify, and custom domain setup.',
          isSourceCode: false
        }
      ],
      downloadActivity: [
        {
          fileId: 'deliv-01',
          filename: 'smart-buy-ecommerce-v1.0.zip',
          downloadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          ip: '127.0.0.1'
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
    };

    const initialData: DatabaseSchema = {
      users: [defaultAdmin, defaultCustomer],
      sessions: [],
      products: INITIAL_PRODUCTS,
      orders: [sampleOrder],
      coupons: INITIAL_COUPONS,
      inquiries: [
        {
          id: 'inq-01',
          type: 'custom_project',
          name: 'Hamza Khan',
          email: 'hamza@nexustech.pk',
          phone: '+92 333 4567890',
          budget: 'PKR 150k – 300k',
          projectType: 'SaaS Platform',
          timeline: '2 – 3 Weeks',
          message: 'Looking to build a multi-tenant client portal with JazzCash integration.',
          createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
          status: 'pending',
          adminNotes: 'Contacted via WhatsApp, waiting for requirements doc.'
        }
      ],
      content: DEFAULT_CONTENT,
      settings: DEFAULT_SETTINGS,
      policies: INITIAL_POLICIES,
      auditLogs: [
        {
          id: 'log-01',
          action: 'SYSTEM_BOOT',
          details: 'Markety Studio database initialized with initial catalogue and secure admin.',
          timestamp: new Date().toISOString(),
          actor: 'system'
        }
      ]
    };

    this.save(initialData);
    return initialData;
  }

  private save(data?: DatabaseSchema) {
    try {
      const payload = data || this.data;
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // Rate Limiting Protection for Login
  checkRateLimit(key: string): { allowed: boolean; remainingLockoutSeconds?: number } {
    const now = Date.now();
    const attempt = this.failedAttempts.get(key);
    if (!attempt) return { allowed: true };

    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
      return { allowed: false, remainingLockoutSeconds: remainingSeconds };
    }

    // Reset if window has passed (> 15 minutes)
    if (now - attempt.lastAttempt > 15 * 60 * 1000) {
      this.failedAttempts.delete(key);
      return { allowed: true };
    }

    return { allowed: true };
  }

  recordFailedLogin(key: string): { locked: boolean; remainingLockoutSeconds?: number } {
    const now = Date.now();
    const attempt = this.failedAttempts.get(key) || { count: 0, lastAttempt: now };
    attempt.count += 1;
    attempt.lastAttempt = now;

    // Lock after 5 failed attempts for 15 minutes
    if (attempt.count >= 5) {
      attempt.lockedUntil = now + 15 * 60 * 1000;
      this.failedAttempts.set(key, attempt);
      return { locked: true, remainingLockoutSeconds: 15 * 60 };
    }

    this.failedAttempts.set(key, attempt);
    return { locked: false };
  }

  resetFailedLogins(key: string): void {
    this.failedAttempts.delete(key);
  }

  // Users & Admin
  getUserByEmail(email: string): StoredUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): StoredUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: StoredUser): void {
    this.data.users.push(user);
    this.save();
  }

  saveUser(user: StoredUser): void {
    const idx = this.data.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      this.data.users[idx] = user;
    } else {
      this.data.users.push(user);
    }
    this.save();
  }

  updateUserPassword(id: string, newHash: string): boolean {
    const user = this.getUserById(id);
    if (!user) return false;
    user.passwordHash = newHash;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    this.save();
    return true;
  }

  generatePasswordResetToken(email: string): string | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    const token = crypto.randomBytes(24).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    this.save();
    return token;
  }

  verifyPasswordResetToken(email: string, token: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user || !user.resetToken || !user.resetTokenExpires) return false;
    if (user.resetToken !== token || user.resetTokenExpires < Date.now()) return false;
    return true;
  }

  getCustomers(): User[] {
    return this.data.users
      .filter(u => u.role === 'customer')
      .map(u => {
        const customerOrders = this.data.orders.filter(o => o.customerId === u.id || o.customerEmail.toLowerCase() === u.email.toLowerCase());
        let spentPKR = 0;
        let spentUSD = 0;
        customerOrders.forEach(o => {
          if (o.paymentStatus === 'paid' || o.paymentStatus === 'delivered') {
            if (o.currency === 'PKR') spentPKR += o.packagePrice;
            else spentUSD += o.packagePrice;
          }
        });
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          company: u.company,
          orderCount: customerOrders.length,
          totalSpentPKR: spentPKR,
          totalSpentUSD: spentUSD,
          createdAt: u.createdAt
        };
      });
  }

  // Sessions
  createSession(userId: string, role: 'admin' | 'customer' = 'customer'): string {
    const now = Date.now();
    this.data.sessions = this.data.sessions.filter(s => s.expiresAt > now);

    const token = generateToken();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000;
    this.data.sessions.push({ token, userId, role, expiresAt });
    this.save();
    return token;
  }

  getSession(token: string): Session | undefined {
    const now = Date.now();
    return this.data.sessions.find(s => s.token === token && s.expiresAt > now);
  }

  deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  // Products
  getProducts(includeDrafts: boolean = false): Product[] {
    if (includeDrafts) return this.data.products;
    return this.data.products.filter(p => p.status === 'published');
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id || p.slug === id);
  }

  saveProduct(product: Product): void {
    const idx = this.data.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      this.data.products[idx] = product;
    } else {
      this.data.products.unshift(product);
    }
    this.save();
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    const changed = this.data.products.length !== initialLen;
    if (changed) this.save();
    return changed;
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  getCustomerOrders(customerId: string): Order[] {
    return this.data.orders.filter(o => o.customerId === customerId);
  }

  createOrder(order: Order): void {
    this.data.orders.unshift(order);
    this.logAction('CREATE_ORDER', `Created order ${order.orderNumber} for product ${order.productName}`, order.customerEmail);
    this.save();
  }

  updateOrder(order: Order): void {
    const idx = this.data.orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      this.data.orders[idx] = order;
      this.save();
    }
  }

  recordDownload(orderIdOrNumber: string, fileId: string, filename: string, ip: string = '127.0.0.1'): void {
    const order = this.getOrderById(orderIdOrNumber);
    if (!order) return;
    if (!order.downloadActivity) order.downloadActivity = [];
    order.downloadActivity.unshift({
      fileId,
      filename,
      downloadedAt: new Date().toISOString(),
      ip
    });
    this.updateOrder(order);
    this.logAction('CUSTOMER_DOWNLOAD', `Customer downloaded ${filename} for order ${order.orderNumber}`, order.customerEmail);
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.data.coupons || [];
  }

  getCouponByCode(code: string): Coupon | undefined {
    return this.getCoupons().find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  }

  saveCoupon(coupon: Coupon): void {
    if (!this.data.coupons) this.data.coupons = [];
    const idx = this.data.coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      this.data.coupons[idx] = coupon;
    } else {
      this.data.coupons.unshift(coupon);
    }
    this.save();
  }

  deleteCoupon(id: string): boolean {
    if (!this.data.coupons) return false;
    const initLen = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    const changed = this.data.coupons.length !== initLen;
    if (changed) this.save();
    return changed;
  }

  validateCoupon(code: string, amount: number, currency: 'PKR' | 'USD'): { valid: boolean; discount: number; error?: string } {
    const coupon = this.getCouponByCode(code);
    if (!coupon) return { valid: false, discount: 0, error: 'Invalid coupon code.' };
    if (!coupon.active) return { valid: false, discount: 0, error: 'This coupon is inactive.' };

    const now = new Date();
    if (new Date(coupon.expiryDate) < now) return { valid: false, discount: 0, error: 'Coupon has expired.' };
    if (new Date(coupon.startDate) > now) return { valid: false, discount: 0, error: 'Coupon is not yet active.' };

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return { valid: false, discount: 0, error: 'Coupon usage limit has been reached.' };
    }

    if (coupon.minOrderValue && amount < coupon.minOrderValue) {
      return { valid: false, discount: 0, error: `Minimum order value for this coupon is ${currency} ${coupon.minOrderValue}.` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((amount * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    if (discount > amount) discount = amount;
    return { valid: true, discount };
  }

  // Inquiries & Support
  createInquiry(inquiry: Inquiry): void {
    this.data.inquiries.unshift(inquiry);
    this.logAction('NEW_INQUIRY', `Received ${inquiry.type} inquiry from ${inquiry.name} (${inquiry.email})`, inquiry.email);
    this.save();
  }

  getInquiries(): Inquiry[] {
    return this.data.inquiries;
  }

  updateInquiry(inquiry: Inquiry): void {
    const idx = this.data.inquiries.findIndex(i => i.id === inquiry.id);
    if (idx >= 0) {
      this.data.inquiries[idx] = inquiry;
      this.save();
    }
  }

  // Content & Settings
  getContent(): WebsiteContent {
    return this.data.content || DEFAULT_CONTENT;
  }

  updateContent(content: Partial<WebsiteContent>): WebsiteContent {
    this.data.content = { ...this.getContent(), ...content };
    this.save();
    return this.data.content;
  }

  // Policies Management (Add, Edit, Delete)
  getPolicies(): PolicyItem[] {
    if (!this.data.policies || !Array.isArray(this.data.policies) || this.data.policies.length === 0) {
      this.data.policies = [...INITIAL_POLICIES];
      this.save();
    }
    return this.data.policies;
  }

  getPolicyByKey(keyOrId: string): PolicyItem | undefined {
    return this.getPolicies().find(
      p => p.id === keyOrId || p.key.toLowerCase() === keyOrId.toLowerCase()
    );
  }

  addPolicy(item: Omit<PolicyItem, 'id' | 'updatedAt'>): PolicyItem {
    const policies = this.getPolicies();
    const newPolicy: PolicyItem = {
      ...item,
      id: 'pol-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      updatedAt: new Date().toISOString()
    };
    policies.push(newPolicy);
    this.data.policies = policies;
    this.save();
    return newPolicy;
  }

  updatePolicy(id: string, updates: Partial<PolicyItem>): PolicyItem | null {
    const policies = this.getPolicies();
    const idx = policies.findIndex(p => p.id === id || p.key === id);
    if (idx < 0) return null;

    policies[idx] = {
      ...policies[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.policies = policies;
    this.save();
    return policies[idx];
  }

  deletePolicy(id: string): boolean {
    const policies = this.getPolicies();
    const initialLen = policies.length;
    this.data.policies = policies.filter(p => p.id !== id && p.key !== id);
    const changed = this.data.policies.length !== initialLen;
    if (changed) this.save();
    return changed;
  }

  getSettings(): PlatformSettings {
    const current = this.data.settings || DEFAULT_SETTINGS;
    current.content = this.getContent();
    current.policies = this.getPolicies();
    if (!current.developerProfile) {
      current.developerProfile = DEFAULT_DEVELOPER_PROFILE;
    }
    return current;
  }

  updateSettings(settings: Partial<PlatformSettings>): PlatformSettings {
    const current = this.getSettings();
    const mergedProfile = settings.developerProfile
      ? { ...current.developerProfile, ...settings.developerProfile }
      : current.developerProfile;

    const mergedPayments = settings.paymentAccounts
      ? {
          ...current.paymentAccounts,
          ...settings.paymentAccounts,
          jazzcash: {
            ...current.paymentAccounts.jazzcash,
            ...(settings.paymentAccounts?.jazzcash || {})
          },
          easypaisa: {
            ...current.paymentAccounts.easypaisa,
            ...(settings.paymentAccounts?.easypaisa || {})
          },
          bank: {
            ...current.paymentAccounts.bank,
            ...(settings.paymentAccounts?.bank || {})
          }
        }
      : current.paymentAccounts;

    this.data.settings = {
      ...current,
      ...settings,
      developerProfile: mergedProfile,
      paymentAccounts: mergedPayments
    };
    this.save();
    return this.data.settings;
  }

  // Audit Logs
  logAction(action: string, details: string, actor: string): void {
    this.data.auditLogs.unshift({
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString(),
      actor
    });
    if (this.data.auditLogs.length > 300) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 300);
    }
    this.save();
  }

  getAuditLogs() {
    return this.data.auditLogs;
  }

  // Statistics & Reports
  getStats(dateFilter?: 'all' | '7days' | '30days' | 'this_month'): AdminStats {
    let revPKR = 0;
    let revUSD = 0;
    let pendingCount = 0;
    let verifiedCount = 0;
    let awaitingDeliveryCount = 0;

    const now = Date.now();
    let cutoff = 0;
    if (dateFilter === '7days') cutoff = now - 7 * 24 * 3600 * 1000;
    else if (dateFilter === '30days') cutoff = now - 30 * 24 * 3600 * 1000;
    else if (dateFilter === 'this_month') {
      const d = new Date();
      cutoff = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    }

    const filteredOrders = cutoff > 0
      ? this.data.orders.filter(o => new Date(o.createdAt).getTime() >= cutoff)
      : this.data.orders;

    for (const order of filteredOrders) {
      if (order.paymentStatus === 'paid' || order.paymentStatus === 'delivered' || order.paymentStatus === 'processing') {
        verifiedCount++;
        if (order.currency === 'PKR') revPKR += order.packagePrice;
        else revUSD += order.packagePrice;

        if (order.fulfillmentStatus !== 'delivered') {
          awaitingDeliveryCount++;
        }
      }
      if (order.paymentStatus === 'pending_payment' || order.paymentStatus === 'payment_under_review') {
        pendingCount++;
      }
    }

    const customers = this.getCustomers();

    return {
      totalWebsites: this.data.products.length,
      publishedWebsites: this.data.products.filter(p => p.status === 'published').length,
      draftWebsites: this.data.products.filter(p => p.status === 'draft').length,
      totalOrders: filteredOrders.length,
      pendingPaymentsCount: pendingCount,
      verifiedPaymentsCount: verifiedCount,
      ordersAwaitingDeliveryCount: awaitingDeliveryCount,
      totalRevenuePKR: revPKR,
      totalRevenueUSD: revUSD,
      totalCustomers: customers.length,
      recentOrders: this.data.orders.slice(0, 6),
      recentCustomers: customers.slice(0, 6),
      recentActivity: this.data.auditLogs.slice(0, 10)
    };
  }
}

export const db = new Database();

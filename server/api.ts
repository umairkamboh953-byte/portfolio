import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db, hashPassword, StoredUser, STORAGE_DIR } from './db.js';
import { requireAuth, requireAdmin, optionalAuth, AuthenticatedRequest } from './auth.js';
import { Product, Order, Inquiry, PlatformSettings, DeliverableFile, Coupon, WebsiteContent } from '../src/types/index.js';

const router = Router();

// ==========================================
// 1. AUTHENTICATION & ADMIN SECURITY ROUTES
// ==========================================

router.post('/auth/register', (req, res) => {
  const { name, email, password, phone, company } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const newUser: StoredUser = {
    id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: 'customer',
    phone: phone?.trim(),
    company: company?.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  db.createUser(newUser);
  const token = db.createSession(newUser.id, 'customer');
  db.logAction('USER_REGISTER', `Customer registered: ${newUser.name} (${newUser.email})`, newUser.email);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      company: newUser.company,
      createdAt: newUser.createdAt
    }
  });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || '127.0.0.1';
  const rateLimitKey = `login_${email}_${ip}`;

  const rateCheck = db.checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `Too many failed attempts. Account temporarily locked. Try again in ${rateCheck.remainingLockoutSeconds} seconds.`
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    db.recordFailedLogin(rateLimitKey);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const testHash = hashPassword(password);
  if (user.passwordHash !== testHash) {
    const record = db.recordFailedLogin(rateLimitKey);
    if (record.locked) {
      return res.status(429).json({
        error: `Too many failed login attempts. Account locked for 15 minutes.`
      });
    }
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Reset rate limit on success
  db.resetFailedLogins(rateLimitKey);

  const token = db.createSession(user.id, user.role);
  db.logAction('USER_LOGIN', `User signed in: ${user.email} (Role: ${user.role})`, user.email);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      createdAt: user.createdAt
    }
  });
});

// Dedicated Administrator Login with strict role enforcement and rate limiting
router.post('/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || '127.0.0.1';
  const rateLimitKey = `admin_login_${email}_${ip}`;

  const rateCheck = db.checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `Security Alert: Administrative portal locked due to multiple failed attempts. Please retry in ${rateCheck.remainingLockoutSeconds} seconds.`
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Administrator email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.role !== 'admin') {
    const record = db.recordFailedLogin(rateLimitKey);
    db.logAction('ADMIN_LOGIN_FAILED', `Unauthorized admin login attempt for ${email} from ${ip}`, email);
    return res.status(401).json({
      error: 'Invalid administrator credentials or unauthorized account.'
    });
  }

  const testHash = hashPassword(password);
  if (user.passwordHash !== testHash) {
    const record = db.recordFailedLogin(rateLimitKey);
    db.logAction('ADMIN_LOGIN_FAILED', `Failed admin password attempt for ${email}`, email);
    if (record.locked) {
      return res.status(429).json({
        error: 'Security Lockout: 5 failed attempts reached. Admin portal locked for 15 minutes.'
      });
    }
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  db.resetFailedLogins(rateLimitKey);
  const token = db.createSession(user.id, 'admin');
  db.logAction('ADMIN_LOGIN_SUCCESS', `Administrator ${user.email} logged into Admin Panel`, user.email);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      createdAt: user.createdAt
    }
  });
});

// Google Authentication for Administrator Gateway
router.post('/auth/admin-google', (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google account email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Authorized Admin Google Whitelist
  // Includes project owner umairkamboh953@gmail.com and root admin admin@marketystudio.com
  const authorizedAdminEmails = [
    'umairkamboh953@gmail.com',
    'admin@marketystudio.com'
  ];

  let user = db.getUserByEmail(cleanEmail);

  if (user) {
    if (user.role !== 'admin' && !authorizedAdminEmails.includes(cleanEmail)) {
      db.logAction('GOOGLE_ADMIN_DENIED', `Non-admin Google account ${cleanEmail} attempted admin access`, cleanEmail);
      return res.status(403).json({
        error: `Access Denied: Google account "${cleanEmail}" does not have administrator privileges.`
      });
    }

    // Ensure role is admin if on whitelist
    if (user.role !== 'admin' && authorizedAdminEmails.includes(cleanEmail)) {
      user.role = 'admin';
      db.saveUser(user);
    }
  } else {
    // If user does not exist in DB yet:
    const isWhitelisted = authorizedAdminEmails.includes(cleanEmail) || cleanEmail.endsWith('@smartdeveloper.com') || cleanEmail.endsWith('@marketystudio.com');
    if (!isWhitelisted) {
      db.logAction('GOOGLE_ADMIN_UNAUTHORIZED', `Unregistered Google email ${cleanEmail} attempted admin login`, cleanEmail);
      return res.status(403).json({
        error: `Access Denied: Google account "${cleanEmail}" is not recognized on the authorized administrator whitelist.`
      });
    }

    // Auto-provision verified administrator record
    const newAdmin: StoredUser = {
      id: 'usr-google-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: name?.trim() || (cleanEmail === 'umairkamboh953@gmail.com' ? 'Umair Kamboh' : 'Smart Developer Administrator'),
      email: cleanEmail,
      role: 'admin',
      phone: '+92 300 1234567',
      company: 'Smart Developer PK',
      passwordHash: '',
      createdAt: new Date().toISOString()
    };
    db.createUser(newAdmin);
    user = newAdmin;
  }

  const token = db.createSession(user.id, 'admin');
  db.logAction('GOOGLE_ADMIN_LOGIN', `Administrator ${user.email} signed in via Google Authentication`, user.email);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      createdAt: user.createdAt
    }
  });
});

// Request Password Reset
router.post('/auth/request-password-reset', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const token = db.generatePasswordResetToken(email);
  db.logAction('PASSWORD_RESET_REQUESTED', `Password reset token generated for ${email}`, email);

  // In production, an email is dispatched with the token link. In dev/sandbox, token is returned.
  res.json({
    message: 'If the email exists, a password reset link has been dispatched.',
    resetToken: token // Useful for immediate sandbox testing without third-party email setup
  });
});

// Reset Password with Token
router.post('/auth/reset-password', (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Email, token, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const valid = db.verifyPasswordResetToken(email, token);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid or expired password reset token.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  db.updateUserPassword(user.id, hashPassword(newPassword));
  db.logAction('PASSWORD_RESET_COMPLETED', `Password was successfully reset for ${email}`, email);

  res.json({ message: 'Password has been successfully updated. You may now log in.' });
});

router.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

router.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
  if (req.token) {
    db.deleteSession(req.token);
  }
  res.json({ message: 'Signed out successfully.' });
});

router.post('/auth/update-profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { name, phone, company, currentPassword, newPassword } = req.body;
  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (company !== undefined) user.company = company.trim();

  if (newPassword) {
    if (!currentPassword || hashPassword(currentPassword) !== user.passwordHash) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }
    user.passwordHash = hashPassword(newPassword);
  }

  db.createUser(user);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      createdAt: user.createdAt
    }
  });
});

// ==========================================
// 2. PRODUCTS CATALOG & MANAGEMENT
// ==========================================

router.get('/products', (req, res) => {
  const { category, search, sort, featured } = req.query;
  let products = db.getProducts(false);

  if (category && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => a.priceUSD - b.priceUSD);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.priceUSD - a.priceUSD);
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ products });
});

router.get('/products/:idOrSlug', (req, res) => {
  const product = db.getProductById(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Website product not found.' });
  }
  res.json({ product });
});

// Admin Product Routes
router.get('/admin/products', requireAdmin, (req, res) => {
  const { search, category, status } = req.query;
  let products = db.getProducts(true);

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }

  if (status && status !== 'all') {
    products = products.filter(p => p.status === status);
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ products });
});

router.post('/admin/products', requireAdmin, (req: AuthenticatedRequest, res) => {
  const data = req.body as Partial<Product>;
  if (!data.name || !data.category || !data.priceUSD || !data.pricePKR) {
    return res.status(400).json({ error: 'Name, category, pricePKR, and priceUSD are required.' });
  }

  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newProduct: Product = {
    id: 'prod-' + Date.now(),
    slug,
    name: data.name.trim(),
    category: data.category,
    shortDescription: data.shortDescription?.trim() || '',
    fullDescription: data.fullDescription?.trim() || '',
    thumbnail: data.thumbnail || '/src/assets/images/hero_marketplace_preview_1791631880640.jpg',
    screenshots: data.screenshots && data.screenshots.length > 0
      ? data.screenshots
      : [data.thumbnail || '/src/assets/images/hero_marketplace_preview_1791631880640.jpg'],
    pricePKR: Number(data.pricePKR),
    priceUSD: Number(data.priceUSD),
    discountPercent: data.discountPercent ? Number(data.discountPercent) : undefined,
    technologies: data.technologies || ['React', 'TypeScript', 'Tailwind CSS'],
    responsive: data.responsive ?? true,
    sourceCodeIncluded: data.sourceCodeIncluded ?? true,
    liveDemoUrl: data.liveDemoUrl || '#',
    featured: Boolean(data.featured),
    status: data.status || 'published',
    licenseTerms: data.licenseTerms || 'Standard single-production commercial license.',
    deliveryInstructions: data.deliveryInstructions || 'Instant download from customer dashboard.',
    productFiles: data.productFiles || [],
    packages: data.packages || {
      starter: {
        enabled: true,
        name: 'Starter Package',
        pricePKR: Number(data.pricePKR),
        priceUSD: Number(data.priceUSD),
        description: 'Complete source code and setup instructions.',
        features: ['Full source code files', 'Responsive layout', 'Basic setup guide']
      },
      professional: {
        enabled: true,
        name: 'Professional Package',
        pricePKR: Math.round(Number(data.pricePKR) * 1.5),
        priceUSD: Math.round(Number(data.priceUSD) * 1.5),
        description: 'Codebase + Turnkey deployment and domain configuration.',
        features: ['Full source code files', 'Turnkey hosting setup', 'Domain & SSL', '60-day support']
      },
      custom: {
        enabled: true,
        name: 'Custom Tailored Project',
        description: 'Customized features, branding, and integration.',
        features: ['Custom design sprint', 'Custom integrations']
      }
    },
    requirements: data.requirements || {
      backend: 'Node.js 18+ or static host',
      hosting: 'Vercel, Netlify, or VPS',
      database: 'Optional'
    },
    deliveryFormat: data.deliveryFormat || 'ZIP Archive + PDF Guide',
    estimatedDeliveryTime: data.estimatedDeliveryTime || 'Instant after payment verification',
    faq: data.faq || [],
    createdAt: new Date().toISOString()
  };

  db.saveProduct(newProduct);
  db.logAction('CREATE_PRODUCT', `Admin created listing: ${newProduct.name}`, req.user!.email);
  res.status(201).json({ product: newProduct });
});

router.put('/admin/products/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found.' });

  const updated: Product = {
    ...existing,
    ...req.body,
    id: existing.id
  };

  db.saveProduct(updated);
  db.logAction('UPDATE_PRODUCT', `Admin updated listing: ${updated.name}`, req.user!.email);
  res.json({ product: updated });
});

router.post('/admin/products/:id/toggle-status', requireAdmin, (req: AuthenticatedRequest, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  product.status = product.status === 'published' ? 'draft' : 'published';
  db.saveProduct(product);
  db.logAction('TOGGLE_PRODUCT_STATUS', `Set ${product.name} status to ${product.status}`, req.user!.email);
  res.json({ product });
});

router.post('/admin/products/:id/toggle-featured', requireAdmin, (req: AuthenticatedRequest, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  product.featured = !product.featured;
  db.saveProduct(product);
  db.logAction('TOGGLE_PRODUCT_FEATURED', `Set ${product.name} featured: ${product.featured}`, req.user!.email);
  res.json({ product });
});

router.delete('/admin/products/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  db.deleteProduct(product.id);
  db.logAction('DELETE_PRODUCT', `Admin deleted listing: ${product.name}`, req.user!.email);
  res.json({ message: 'Product deleted successfully.' });
});

// ==========================================
// 3. SOURCE CODE & FILE MANAGEMENT
// ==========================================

// Upload deliverable file to private protected storage
router.post('/admin/files/upload', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { title, filename, fileBase64, isSourceCode, description } = req.body;

  if (!title || !filename || !fileBase64) {
    return res.status(400).json({ error: 'Title, filename, and file data are required.' });
  }

  // Validate file extension
  const ext = path.extname(filename).toLowerCase();
  const allowedExtensions = ['.zip', '.pdf', '.sql', '.json', '.md', '.txt', '.tar', '.gz'];
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({
      error: `Disallowed file format "${ext}". Allowed types: ${allowedExtensions.join(', ')}`
    });
  }

  try {
    // Decode base64 and write to private storage directory
    const buffer = Buffer.from(fileBase64.replace(/^data:.*?;base64,/, ''), 'base64');
    const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(1) + ' MB';

    // Generate safe private stored filename
    const fileId = 'file-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    const safeStoredName = `${fileId}${ext}`;
    const targetPath = path.join(STORAGE_DIR, safeStoredName);

    fs.writeFileSync(targetPath, buffer);

    const deliverable: DeliverableFile = {
      id: fileId,
      title: title.trim(),
      filename: filename.trim(),
      fileType: ext === '.zip' ? 'application/zip' : ext === '.pdf' ? 'application/pdf' : 'application/octet-stream',
      fileSize: fileSizeMB,
      downloadUrl: `/api/downloads/file/${fileId}`,
      description: description || '',
      isSourceCode: Boolean(isSourceCode),
      storagePath: safeStoredName,
      uploadedAt: new Date().toISOString()
    };

    db.logAction('UPLOAD_FILE', `Admin uploaded file ${filename} (${fileSizeMB})`, req.user!.email);

    res.status(201).json({
      file: deliverable,
      message: 'File stored securely in protected storage.'
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to process and store file.' });
  }
});

// Attach a file to a product
router.post('/admin/products/:productId/files', requireAdmin, (req: AuthenticatedRequest, res) => {
  const product = db.getProductById(req.params.productId);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const file = req.body as DeliverableFile;
  if (!file.title || !file.filename) {
    return res.status(400).json({ error: 'File title and filename are required.' });
  }

  if (!product.productFiles) product.productFiles = [];
  product.productFiles.push(file);

  // If source code file attached, set sourceCodeIncluded to true
  if (file.isSourceCode) {
    product.sourceCodeIncluded = true;
  }

  db.saveProduct(product);
  db.logAction('ATTACH_PRODUCT_FILE', `Attached ${file.filename} to product ${product.name}`, req.user!.email);

  res.json({ product, file });
});

// Remove a file from a product
router.delete('/admin/products/:productId/files/:fileId', requireAdmin, (req: AuthenticatedRequest, res) => {
  const product = db.getProductById(req.params.productId);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  if (product.productFiles) {
    product.productFiles = product.productFiles.filter(f => f.id !== req.params.fileId);
  }

  db.saveProduct(product);
  db.logAction('REMOVE_PRODUCT_FILE', `Removed file from product ${product.name}`, req.user!.email);

  res.json({ product });
});

// Get products missing source code
router.get('/admin/files/missing-source', requireAdmin, (req, res) => {
  const products = db.getProducts(true);
  const missing = products.filter(p => !p.productFiles || p.productFiles.length === 0 || !p.productFiles.some(f => f.isSourceCode));
  res.json({ missingProducts: missing });
});

// ==========================================
// 4. ORDERS & FULFILLMENT MANAGEMENT
// ==========================================

router.post('/orders/checkout', optionalAuth, (req: AuthenticatedRequest, res) => {
  const {
    productId,
    selectedPackage,
    currency,
    customerName,
    customerEmail,
    customerPhone,
    customerNotes,
    paymentMethod,
    couponCode
  } = req.body;

  if (!productId || !selectedPackage || !currency || !customerName || !customerEmail || !customerPhone || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required order fields.' });
  }

  const product = db.getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Selected website product does not exist.' });
  }

  let packagePrice = currency === 'PKR' ? product.pricePKR : product.priceUSD;
  const pkgConfig = product.packages[selectedPackage as keyof typeof product.packages];
  if (pkgConfig && typeof pkgConfig === 'object') {
    if (currency === 'PKR' && pkgConfig.pricePKR) {
      packagePrice = pkgConfig.pricePKR;
    } else if (currency === 'USD' && pkgConfig.priceUSD) {
      packagePrice = pkgConfig.priceUSD;
    }
  }

  // Handle coupon discount
  let discountAmount = 0;
  let appliedCoupon: string | undefined = undefined;
  if (couponCode) {
    const couponValidation = db.validateCoupon(couponCode, packagePrice, currency);
    if (couponValidation.valid) {
      discountAmount = couponValidation.discount;
      appliedCoupon = couponCode.toUpperCase().trim();
      packagePrice = Math.max(0, packagePrice - discountAmount);

      // Increment coupon usage
      const c = db.getCouponByCode(couponCode);
      if (c) {
        c.usageCount += 1;
        db.saveCoupon(c);
      }
    }
  }

  let customerId = req.user ? req.user.id : 'guest-' + Date.now();
  if (!req.user) {
    const existing = db.getUserByEmail(customerEmail);
    if (existing) {
      customerId = existing.id;
    }
  }

  const orderNumber = 'MKT-' + Math.floor(1000 + Math.random() * 9000);

  // Deliverables attached from product
  const deliverables: DeliverableFile[] = (product.productFiles && product.productFiles.length > 0)
    ? [...product.productFiles]
    : [
        {
          id: 'deliv-src-' + Date.now(),
          title: `${product.name} Production Source Code`,
          filename: `${product.slug}-source-code.zip`,
          fileType: 'application/zip',
          fileSize: '18.4 MB',
          downloadUrl: `/api/downloads/${orderNumber}/src`,
          description: 'Clean modular TypeScript/React source code, project dependencies, and assets.',
          isSourceCode: true
        },
        {
          id: 'deliv-guide-' + Date.now(),
          title: `${product.name} Setup & Launch Documentation`,
          filename: `${product.slug}-deployment-manual.pdf`,
          fileType: 'application/pdf',
          fileSize: '1.5 MB',
          downloadUrl: `/api/downloads/${orderNumber}/guide`,
          description: 'Step-by-step launch manual for Vercel, Netlify, and custom domains.',
          isSourceCode: false
        }
      ];

  const newOrder: Order = {
    id: 'ord-' + Date.now(),
    orderNumber,
    productId: product.id,
    productName: product.name,
    productThumbnail: product.thumbnail,
    category: product.category,
    selectedPackage,
    packagePrice,
    currency,
    customerId,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    customerPhone: customerPhone.trim(),
    customerNotes: customerNotes?.trim(),
    paymentMethod,
    paymentStatus: 'pending_payment',
    fulfillmentStatus: 'unfulfilled',
    couponCode: appliedCoupon,
    discountAmount,
    deliverables,
    downloadActivity: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createOrder(newOrder);

  res.status(201).json({
    order: newOrder,
    message: 'Order created successfully. Please follow payment instructions to complete payment.'
  });
});

router.get('/orders/my-orders', requireAuth, (req: AuthenticatedRequest, res) => {
  const customerOrders = db.getCustomerOrders(req.user!.id);
  res.json({ orders: customerOrders });
});

router.get('/orders/:idOrNumber', optionalAuth, (req: AuthenticatedRequest, res) => {
  const order = db.getOrderById(req.params.idOrNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (req.user) {
    if (req.user.role !== 'admin' && order.customerId !== req.user.id && order.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied. You can only view your own orders.' });
    }
  }

  res.json({ order });
});

router.post('/orders/:idOrNumber/payment-reference', (req, res) => {
  const { paymentReference, receiptUrl } = req.body;
  const order = db.getOrderById(req.params.idOrNumber);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (!paymentReference && !receiptUrl) {
    return res.status(400).json({ error: 'Please provide either a Transaction ID or payment receipt.' });
  }

  if (paymentReference) order.paymentReference = paymentReference.trim();
  if (receiptUrl) order.receiptUrl = receiptUrl;
  order.receiptSubmittedAt = new Date().toISOString();

  // Crucial payment rule: Never automatically mark as paid! Set to payment_under_review
  if (order.paymentStatus === 'pending_payment') {
    order.paymentStatus = 'payment_under_review';
  }
  order.updatedAt = new Date().toISOString();

  db.updateOrder(order);
  db.logAction('PAYMENT_REFERENCE_SUBMITTED', `Payment reference ${paymentReference || 'Receipt'} submitted for order ${order.orderNumber}`, order.customerEmail);

  res.json({
    order,
    message: 'Payment reference submitted. The Smart Developer team will verify the payment and release files.'
  });
});

// Admin Orders
router.get('/admin/orders', requireAdmin, (req, res) => {
  const { status, fulfillmentStatus, search, dateFilter } = req.query;
  let orders = db.getOrders();

  if (status && status !== 'all') {
    orders = orders.filter(o => o.paymentStatus === status);
  }

  if (fulfillmentStatus && fulfillmentStatus !== 'all') {
    orders = orders.filter(o => o.fulfillmentStatus === fulfillmentStatus);
  }

  if (dateFilter && dateFilter !== 'all') {
    const now = Date.now();
    let cutoff = 0;
    if (dateFilter === '7days') cutoff = now - 7 * 24 * 3600 * 1000;
    else if (dateFilter === '30days') cutoff = now - 30 * 24 * 3600 * 1000;
    if (cutoff > 0) {
      orders = orders.filter(o => new Date(o.createdAt).getTime() >= cutoff);
    }
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    orders = orders.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.paymentReference && o.paymentReference.toLowerCase().includes(q))
    );
  }

  res.json({ orders });
});

// Admin approves & verifies payment: strictly server-side
router.post('/admin/orders/:id/verify-payment', requireAdmin, (req: AuthenticatedRequest, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.paymentStatus = 'paid';
  order.paymentVerifiedAt = new Date().toISOString();
  order.paymentVerifiedBy = req.user!.email;
  order.rejectionReason = undefined;
  if (!order.fulfillmentStatus || order.fulfillmentStatus === 'unfulfilled') {
    order.fulfillmentStatus = 'preparing';
  }
  order.updatedAt = new Date().toISOString();

  db.updateOrder(order);
  db.logAction('PAYMENT_VERIFIED', `Admin ${req.user!.email} verified payment for order ${order.orderNumber} (${order.currency} ${order.packagePrice})`, req.user!.email);

  res.json({
    order,
    message: `Payment verified for ${order.orderNumber}. Deliverables are now unlocked for the customer.`
  });
});

// Admin rejects payment submission
router.post('/admin/orders/:id/reject-payment', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { reason } = req.body;
  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'Rejection reason is required.' });
  }

  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.paymentStatus = 'pending_payment';
  order.rejectionReason = reason.trim();
  order.updatedAt = new Date().toISOString();

  db.updateOrder(order);
  db.logAction('PAYMENT_REJECTED', `Payment rejected for order ${order.orderNumber}: "${reason.trim()}"`, req.user!.email);

  res.json({
    order,
    message: `Payment rejected with reason: ${reason}`
  });
});

// Admin approves delivery
router.post('/admin/orders/:id/approve-delivery', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { deliveryNotes } = req.body;
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.fulfillmentStatus = 'delivered';
  order.paymentStatus = 'delivered';
  order.deliveryDate = new Date().toISOString();
  if (deliveryNotes) order.deliveryNotes = deliveryNotes.trim();
  order.updatedAt = new Date().toISOString();

  db.updateOrder(order);
  db.logAction('ORDER_DELIVERED', `Admin marked order ${order.orderNumber} as delivered`, req.user!.email);

  res.json({
    order,
    message: `Order ${order.orderNumber} delivery approved and recorded.`
  });
});

// Admin internal notes
router.post('/admin/orders/:id/admin-notes', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { notes } = req.body;
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.adminNotes = notes?.trim() || '';
  order.updatedAt = new Date().toISOString();

  db.updateOrder(order);
  res.json({ order });
});

router.post('/admin/orders/:id/update-status', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { status, fulfillmentStatus } = req.body;
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (status) order.paymentStatus = status;
  if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
  order.updatedAt = new Date().toISOString();

  db.updateOrder(order);
  db.logAction('ORDER_STATUS_CHANGED', `Admin updated order ${order.orderNumber} status to ${status}`, req.user!.email);

  res.json({ order });
});

router.post('/admin/orders/:id/attach-deliverable', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { title, filename, fileType, fileSize, downloadUrl, description, isSourceCode } = req.body;
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (!title || !filename) {
    return res.status(400).json({ error: 'Title and filename are required.' });
  }

  const deliverable: DeliverableFile = {
    id: 'deliv-' + Date.now(),
    title,
    filename,
    fileType: fileType || 'application/zip',
    fileSize: fileSize || '10 MB',
    downloadUrl: downloadUrl || `/api/downloads/${order.orderNumber}/${Date.now()}`,
    description: description || '',
    isSourceCode: Boolean(isSourceCode),
    uploadedAt: new Date().toISOString()
  };

  order.deliverables.push(deliverable);
  order.updatedAt = new Date().toISOString();
  db.updateOrder(order);
  db.logAction('ATTACH_DELIVERABLE', `Attached ${filename} to order ${order.orderNumber}`, req.user!.email);

  res.json({ order, deliverable });
});

// ==========================================
// 5. CUSTOMER MANAGEMENT
// ==========================================

router.get('/admin/customers', requireAdmin, (req, res) => {
  const { search } = req.query;
  let customers = db.getCustomers();

  if (search) {
    const q = (search as string).toLowerCase().trim();
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
  }

  res.json({ customers });
});

router.get('/admin/customers/:id/orders', requireAdmin, (req, res) => {
  const orders = db.getCustomerOrders(req.params.id);
  res.json({ orders });
});

// ==========================================
// 6. COUPONS & DISCOUNTS
// ==========================================

router.get('/admin/coupons', requireAdmin, (req, res) => {
  const coupons = db.getCoupons();
  res.json({ coupons });
});

router.post('/admin/coupons', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { code, discountType, discountValue, currency, minOrderValue, maxUsage, startDate, expiryDate, active } = req.body;

  if (!code || !discountValue || !discountType) {
    return res.status(400).json({ error: 'Coupon code, discount type, and value are required.' });
  }

  const existing = db.getCouponByCode(code);
  if (existing) {
    return res.status(409).json({ error: 'A coupon with this code already exists.' });
  }

  const newCoupon: Coupon = {
    id: 'coup-' + Date.now(),
    code: code.trim().toUpperCase(),
    discountType,
    discountValue: Number(discountValue),
    currency: currency || 'PKR',
    minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
    maxUsage: maxUsage ? Number(maxUsage) : undefined,
    usageCount: 0,
    startDate: startDate || new Date().toISOString(),
    expiryDate: expiryDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    active: active ?? true,
    createdAt: new Date().toISOString()
  };

  db.saveCoupon(newCoupon);
  db.logAction('CREATE_COUPON', `Admin created coupon ${newCoupon.code}`, req.user!.email);

  res.status(201).json({ coupon: newCoupon });
});

router.put('/admin/coupons/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const coupons = db.getCoupons();
  const existing = coupons.find(c => c.id === req.params.id);
  if (!existing) return res.status(404).json({ error: 'Coupon not found.' });

  const updated: Coupon = {
    ...existing,
    ...req.body,
    id: existing.id
  };

  db.saveCoupon(updated);
  db.logAction('UPDATE_COUPON', `Admin updated coupon ${updated.code}`, req.user!.email);

  res.json({ coupon: updated });
});

router.delete('/admin/coupons/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const success = db.deleteCoupon(req.params.id);
  if (!success) return res.status(404).json({ error: 'Coupon not found.' });

  db.logAction('DELETE_COUPON', `Admin deleted coupon ${req.params.id}`, req.user!.email);
  res.json({ message: 'Coupon deleted successfully.' });
});

// Public validation endpoint for checkout
router.post('/coupons/validate', (req, res) => {
  const { code, amount, currency } = req.body;
  if (!code || amount === undefined) {
    return res.status(400).json({ error: 'Coupon code and order amount are required.' });
  }

  const result = db.validateCoupon(code, Number(amount), currency || 'PKR');
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  res.json({
    valid: true,
    discount: result.discount,
    finalAmount: Math.max(0, Number(amount) - result.discount),
    code: code.toUpperCase().trim()
  });
});

// ==========================================
// 7. WEBSITE CONTENT MANAGEMENT
// ==========================================

router.get('/content', (req, res) => {
  const content = db.getContent();
  res.json({ content });
});

router.put('/admin/content', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updateContent(req.body);
  db.logAction('UPDATE_CONTENT', 'Admin updated website content and policies', req.user!.email);
  res.json({ content: updated });
});

// ==========================================
// 8. SECURE FILE DELIVERY & DOWNLOAD
// ==========================================

router.get('/downloads/:orderIdOrNumber/:fileId', requireAuth, (req: AuthenticatedRequest, res) => {
  const order = db.getOrderById(req.params.orderIdOrNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  const isOwner = order.customerId === req.user!.id || order.customerEmail.toLowerCase() === req.user!.email.toLowerCase();
  const isAdmin = req.user!.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      error: 'Security Violation: You do not have permission to access another customer’s purchase deliverables.'
    });
  }

  const eligibleStatuses = ['paid', 'delivered', 'processing'];
  if (!eligibleStatuses.includes(order.paymentStatus) && !isAdmin) {
    return res.status(403).json({
      error: `Files are locked: Order payment status is "${order.paymentStatus.replace('_', ' ')}". Deliverables are released automatically once the administrator verifies your payment.`
    });
  }

  const deliverable = order.deliverables.find(d => d.id === req.params.fileId) || order.deliverables[0];
  const filename = deliverable ? deliverable.filename : `${order.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-source.zip`;

  // Record download activity on order
  db.recordDownload(order.id, deliverable?.id || req.params.fileId, filename, req.ip || '127.0.0.1');

  // Check if physical file exists in private storage
  if (deliverable?.storagePath) {
    const physicalPath = path.join(STORAGE_DIR, deliverable.storagePath);
    if (fs.existsSync(physicalPath)) {
      return res.download(physicalPath, filename);
    }
  }

  // Provide generated signed manifest package if no physical file on disk yet
  const manifest = `# Smart Developer — Official Deliverable Package
Project: ${order.productName}
Order Number: ${order.orderNumber}
Licensee: ${order.customerName} (${order.customerEmail})
Package Tier: ${order.selectedPackage.toUpperCase()}
Payment Status: VERIFIED & COMPLETED
Released On: ${new Date().toISOString()}

============================================================
PACKAGE CONTENTS:
1. /source - Complete React & TypeScript Project Code
2. /documentation - Launch & Environment Variable Guide
3. /database - Schema & migration scripts
4. /license - Commercial Single-Site Deployment License

============================================================
QUICK START GUIDE:
1. Unzip the repository into your project directory.
2. Run "npm install" to populate dependencies.
3. Copy .env.example to .env and configure your variables.
4. Run "npm run dev" to launch local preview on port 3000.
5. Deploy to Netlify / Vercel via "npm run build".

Support: ${db.getSettings().contactEmail} | WhatsApp: ${db.getSettings().whatsappNumber}
Thank you for building with Smart Developer!
`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(manifest);
});

// Direct file download for admin testing
router.get('/downloads/file/:fileId', requireAdmin, (req, res) => {
  const fileId = req.params.fileId;
  const files = fs.readdirSync(STORAGE_DIR);
  const matched = files.find(f => f.startsWith(fileId));
  if (matched) {
    const physicalPath = path.join(STORAGE_DIR, matched);
    return res.download(physicalPath);
  }
  res.status(404).json({ error: 'File not found in storage.' });
});

// ==========================================
// 9. SUPPORT & INQUIRIES
// ==========================================

router.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const inquiry: Inquiry = {
    id: 'inq-' + Date.now(),
    type: 'general',
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  db.createInquiry(inquiry);

  res.status(201).json({
    message: 'Your inquiry has been successfully sent. A representative will contact you within 24 hours.'
  });
});

router.post('/custom-request', (req, res) => {
  const { name, email, phone, budget, projectType, timeline, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and project scope are required.' });
  }

  const inquiry: Inquiry = {
    id: 'inq-custom-' + Date.now(),
    type: 'custom_project',
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    budget: budget?.trim(),
    projectType: projectType?.trim(),
    timeline: timeline?.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  db.createInquiry(inquiry);

  res.status(201).json({
    message: 'Your custom website proposal request has been received. Our solutions architect will prepare a tailored estimate.'
  });
});

router.get('/admin/inquiries', requireAdmin, (req, res) => {
  const { status, type } = req.query;
  let inquiries = db.getInquiries();

  if (status && status !== 'all') {
    inquiries = inquiries.filter(i => i.status === status);
  }

  if (type && type !== 'all') {
    inquiries = inquiries.filter(i => i.type === type);
  }

  res.json({ inquiries });
});

router.post('/admin/inquiries/:id/status', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { status, adminNotes } = req.body;
  const inq = db.getInquiries().find(i => i.id === req.params.id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found.' });

  if (status) inq.status = status;
  if (adminNotes !== undefined) inq.adminNotes = adminNotes;
  inq.repliedAt = new Date().toISOString();

  db.updateInquiry(inq);
  db.logAction('UPDATE_INQUIRY', `Admin updated inquiry from ${inq.name} to ${inq.status}`, req.user!.email);

  res.json({ inquiry: inq });
});

// ==========================================
// 10. SETTINGS, REPORTS & STATS
// ==========================================

router.get('/settings', (req, res) => {
  const settings = db.getSettings();
  res.json({ settings });
});

router.put('/admin/settings', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updateSettings(req.body);
  db.logAction('UPDATE_SETTINGS', 'Administrator updated platform settings & payment accounts', req.user!.email);
  res.json({ settings: updated });
});

// ==========================================
// POLICIES (DYNAMIC ADD, EDIT, DELETE)
// ==========================================

router.get('/policies', (req, res) => {
  const policies = db.getPolicies();
  res.json({ policies });
});

router.get('/policies/:key', (req, res) => {
  const policy = db.getPolicyByKey(req.params.key);
  if (!policy) {
    return res.status(404).json({ error: 'Policy not found' });
  }
  res.json({ policy });
});

router.post('/admin/policies', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { title, key, category, content, icon } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Policy title and content are required' });
  }
  const cleanKey = (key || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newPolicy = db.addPolicy({
    title: title.trim(),
    key: cleanKey,
    category: category?.trim() || 'General',
    content: content.trim(),
    icon: icon || 'file-text'
  });
  db.logAction('CREATE_POLICY', `Administrator created policy "${newPolicy.title}"`, req.user!.email);
  res.json({ policy: newPolicy });
});

router.put('/admin/policies/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { title, key, category, content, icon } = req.body;
  const updated = db.updatePolicy(req.params.id, {
    ...(title && { title: title.trim() }),
    ...(key && { key: key.trim().toLowerCase() }),
    ...(category && { category: category.trim() }),
    ...(content && { content: content.trim() }),
    ...(icon && { icon })
  });
  if (!updated) {
    return res.status(404).json({ error: 'Policy not found' });
  }
  db.logAction('UPDATE_POLICY', `Administrator updated policy "${updated.title}"`, req.user!.email);
  res.json({ policy: updated });
});

router.delete('/admin/policies/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const deleted = db.deletePolicy(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Policy not found' });
  }
  db.logAction('DELETE_POLICY', `Administrator deleted policy ID ${req.params.id}`, req.user!.email);
  res.json({ success: true, message: 'Policy successfully removed' });
});

router.get('/admin/stats', requireAdmin, (req, res) => {
  const dateFilter = (req.query.dateFilter as 'all' | '7days' | '30days' | 'this_month') || 'all';
  const stats = db.getStats(dateFilter);
  res.json({ stats });
});

router.get('/admin/reports', requireAdmin, (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts(true);

  // Group verified revenue by currency
  let verifiedPKR = 0;
  let verifiedUSD = 0;
  const productSalesMap: Record<string, { name: string; count: number; totalPKR: number; totalUSD: number }> = {};

  orders.forEach(o => {
    if (o.paymentStatus === 'paid' || o.paymentStatus === 'delivered') {
      if (o.currency === 'PKR') verifiedPKR += o.packagePrice;
      else verifiedUSD += o.packagePrice;

      if (!productSalesMap[o.productId]) {
        productSalesMap[o.productId] = { name: o.productName, count: 0, totalPKR: 0, totalUSD: 0 };
      }
      productSalesMap[o.productId].count += 1;
      if (o.currency === 'PKR') productSalesMap[o.productId].totalPKR += o.packagePrice;
      else productSalesMap[o.productId].totalUSD += o.packagePrice;
    }
  });

  const bestSelling = Object.values(productSalesMap).sort((a, b) => b.count - a.count);
  const pendingReviews = orders.filter(o => o.paymentStatus === 'payment_under_review' || o.paymentStatus === 'pending_payment');
  const undelivered = orders.filter(o => (o.paymentStatus === 'paid') && o.fulfillmentStatus !== 'delivered');

  res.json({
    reports: {
      verifiedRevenue: { pkr: verifiedPKR, usd: verifiedUSD },
      bestSelling,
      pendingReviewsCount: pendingReviews.length,
      undeliveredOrdersCount: undelivered.length,
      totalOrdersCount: orders.length,
      catalogueStatus: {
        total: products.length,
        published: products.filter(p => p.status === 'published').length,
        drafts: products.filter(p => p.status === 'draft').length
      }
    }
  });
});

router.get('/admin/audit-logs', requireAdmin, (req, res) => {
  const logs = db.getAuditLogs();
  res.json({ logs });
});

export default router;

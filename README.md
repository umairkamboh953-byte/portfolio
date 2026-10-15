# Markety Studio — Premium Website Selling Platform

> **"Premium Websites. Ready for Your Next Big Idea."**

Markety Studio is a production-grade website selling platform and digital agency marketplace tailored for businesses and creators in Pakistan and internationally. The platform sells ready-made websites, ecommerce stores, corporate websites, developer portfolios, landing pages, and AI-powered web applications with transparent pricing, manual payment verification (JazzCash, Easypaisa, Bank Transfer, USD Stripe), and customer-isolated secure file delivery.

---

## 1. Project Folder Structure

```
├── .env.example                  # Environment configuration template
├── index.html                    # HTML5 entry with fonts, OpenGraph, and Twitter tags
├── metadata.json                 # AI Studio applet capabilities and metadata
├── package.json                  # Scripts and dependencies
├── server.ts                     # Full-stack Node/Express server entry point
├── server_data.json              # Persistent database file (auto-generated on boot)
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build and Tailwind configuration
├── server/
│   ├── api.ts                   # Express REST API routes (/api/*)
│   ├── auth.ts                  # Role-based access control & session middleware
│   └── db.ts                    # Transactional persistent database & audit logs
└── src/
    ├── assets/
    │   └── images/              # High-fidelity project showcase and hero images
    ├── components/
    │   ├── admin/
    │   │   └── AdminDashboard.tsx   # Protected admin portal (orders, CRUD, settings)
    │   ├── auth/
    │   │   └── AuthModal.tsx        # Customer login, register & quick demo switch
    │   ├── checkout/
    │   │   └── CheckoutPage.tsx     # 10-step purchase flow & payment reference submit
    │   ├── common/
    │   │   ├── Footer.tsx           # Global footer with WhatsApp & legal policies
    │   │   ├── LiveDemoModal.tsx    # Responsive device viewport demo simulator
    │   │   ├── Logo.tsx             # Original geometric 'M' symbol
    │   │   ├── Navbar.tsx           # Sticky blurred navigation (3-zone contract)
    │   │   └── SearchModal.tsx      # Global live search overlay
    │   ├── dashboard/
    │   │   └── CustomerDashboard.tsx# Customer order tracking & file downloads
    │   ├── details/
    │   │   └── ProductDetailPage.tsx# Gallery, package selector & tech specs
    │   ├── home/
    │   │   ├── FAQSection.tsx       # Clean question & answer accordion
    │   │   ├── HeroSection.tsx      # Cinematic dark mode hero with showcase
    │   │   ├── HowItWorks.tsx       # 4-step workflow overview
    │   │   └── TrustBenefits.tsx    # Verified guarantees & Pakistan payment support
    │   ├── marketplace/
    │   │   ├── CatalogPage.tsx      # Category tabs, price filter, sorting
    │   │   └── WebsiteCard.tsx      # Product card with live demo & buy triggers
    │   ├── contact/
    │   │   └── ContactPage.tsx      # Contact & custom website project request forms
    │   └── policies/
    │       └── PolicyModal.tsx      # Licensing, refund, delivery & support policies
    ├── context/
    │   ├── AuthContext.tsx          # Authentication state & role verification
    │   └── CurrencyContext.tsx      # Dual currency switcher (PKR & USD)
    ├── services/
    │   └── api.ts                   # Client-side API caller
    ├── types/
    │   └── index.ts                 # TypeScript types for products, orders, users
    ├── App.tsx                      # Root component & view router
    ├── index.css                    # Tailwind CSS theme & dark obsidian styles
    └── main.tsx                     # React 19 application mount
```

---

## 2. Installation & Quick Start

### Prerequisites
- Node.js version 18.x or 20.x
- npm version 9.x or later

### Local Development Setup
1. Clone or download the repository.
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables example:
   ```bash
   cp .env.example .env
   ```
4. Start the full-stack development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Local dev and production server port | `3000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `ADMIN_PASSWORD` | Initial password for the administrator account | Must be changed in production |
| `SESSION_SECRET` | Cryptographic secret for tokens and sessions | Custom secret string |
| `APP_URL` | Public base URL for canonical tags and webhooks | Auto-injected in AI Studio |
| `STRIPE_SECRET_KEY` | Optional international Stripe checkout key | Empty |

---

## 4. Database Setup & Architecture

Markety Studio includes an embedded transactional JSON persistence engine (`server/db.ts` / `server_data.json`) that requires zero external cloud dependencies to get started.

- **Transactional Sync**: State updates (orders, listings, settings, audit logs) are atomically committed to `server_data.json`.
- **Database Schema**:
  - `users`: Administrator and customer accounts with PBKDF2 password hashes and roles.
  - `sessions`: Ephemeral token sessions with 7-day expiration.
  - `products`: Complete website listings with pricing tiers, technology stacks, and requirements.
  - `orders`: Order state machine with payment references, receipts, and deliverable manifests.
  - `inquiries`: Customer contact queries and custom website project proposals.
  - `settings`: Configurable payment instructions (JazzCash, Easypaisa, Meezan Bank, WhatsApp, Email).
  - `auditLogs`: Security event stream tracking all administrative actions.

---

## 5. Admin Account Setup Instructions (Secure Production Protocol)

To avoid hardcoded credentials or exposing default passwords:

1. Before starting the server in production, set the environment variable:
   ```bash
   export ADMIN_PASSWORD="YourStrongCustomPassword#2026"
   ```
2. When the server boots for the first time, it hashes `ADMIN_PASSWORD` using salted PBKDF2 (`server/db.ts`) and stores it securely.
3. Access the Admin Panel:
   - Log in with `admin@marketystudio.com` and your configured password.
   - Navigate to the **Admin Panel** via the user menu in the top navigation bar.
4. From the admin panel, you can:
   - Verify incoming payments and inspect transaction IDs (TIDs) or uploaded receipts.
   - Transition order status to **Paid**, which immediately unlocks download permissions for the customer.
   - Add, edit, publish, or delete website products.
   - Update official JazzCash, Easypaisa, and Bank Account numbers.
   - View immutable security audit logs.

---

## 6. Deployment Instructions

### Option A: Full-Stack Deployment (Recommended)
Because Markety Studio features backend authentication, order verification, and protected file downloads, it runs best on a Node.js runtime (Render, Railway, Fly.io, Cloud Run, or VPS):

1. Set `NODE_ENV=production` and `ADMIN_PASSWORD` in your hosting dashboard.
2. Build the frontend assets:
   ```bash
   npm run build
   ```
3. Start the Express server:
   ```bash
   npm run start
   ```
   The server serves the compiled `dist/` directory and exposes the `/api/*` endpoints on port 3000.

### Option B: Netlify Frontend + Decoupled Backend
1. **Netlify (Frontend)**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - In `netlify.toml`, proxy `/api/*` requests to your hosted backend API:
     ```toml
     [[redirects]]
       from = "/api/*"
       to = "https://your-backend-api.com/api/:splat"
       status = 200
       force = true
     ```
2. **Backend**: Host `server.ts` on Render / Railway / Google Cloud Run to handle database operations, session tokens, and protected deliverables.

---

## 7. Checklist of Remaining Manual Setup Requirements

- [ ] **Bank & Mobile Accounts**: Open **Admin Panel > Settings** and update the default JazzCash, Easypaisa, and Meezan Bank account numbers to your organization's real accounts.
- [ ] **WhatsApp Support**: Update the business WhatsApp phone number to your active customer care line.
- [ ] **Production Admin Password**: Set `ADMIN_PASSWORD` in your hosting environment variables before first boot.
- [ ] **International Gateway (Optional)**: If accepting credit cards internationally, configure your Stripe API keys.
- [ ] **Custom Domain**: Connect your domain (e.g., `marketystudio.com`) and configure DNS records.

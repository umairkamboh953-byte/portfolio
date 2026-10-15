import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CurrencyProvider } from './context/CurrencyContext.js';
import { api } from './services/api.js';
import { Product, PlatformSettings, PackageTierKey, Order } from './types/index.js';

// Common components
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { LiveDemoModal } from './components/common/LiveDemoModal.js';
import { SearchModal } from './components/common/SearchModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { PolicyModal } from './components/policies/PolicyModal.js';
import { FloatingButtons } from './components/common/FloatingButtons.js';

// Home components
import { HeroSection } from './components/home/HeroSection.js';
import { PortfolioAboutSection } from './components/home/PortfolioAboutSection.js';
import { PortfolioServicesSection } from './components/home/PortfolioServicesSection.js';
import { PortfolioSkillsSection } from './components/home/PortfolioSkillsSection.js';
import { PortfolioExperienceSection } from './components/home/PortfolioExperienceSection.js';
import { PortfolioTestimonialsSection } from './components/home/PortfolioTestimonialsSection.js';
import { TrustBenefits } from './components/home/TrustBenefits.js';
import { HowItWorks } from './components/home/HowItWorks.js';
import { FAQSection } from './components/home/FAQSection.js';
import { WebsiteCard } from './components/marketplace/WebsiteCard.js';

// Page components
import { CatalogPage } from './components/marketplace/CatalogPage.js';
import { ProductDetailPage } from './components/details/ProductDetailPage.js';
import { CheckoutPage } from './components/checkout/CheckoutPage.js';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { ContactPage } from './components/contact/ContactPage.js';

import { Sparkles, ArrowRight, Shield } from 'lucide-react';

function MainApp() {
  const { user, isAdmin } = useAuth();

  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'admin') return 'admin';
      if (path === 'marketplace' || path === 'explore') return 'marketplace';
      if (path === 'how-it-works') return 'how-it-works';
      if (path === 'contact' || path === 'quote') return 'contact';
      if (path === 'dashboard' || path === 'orders') return 'dashboard';
    }
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected product and checkout states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutPackage, setCheckoutPackage] = useState<PackageTierKey>('starter');
  const [catalogCategory, setCatalogCategory] = useState<string>('All');

  // Modals
  const [demoProduct, setDemoProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [policyType, setPolicyType] = useState<string | null>(null);

  // Load products & settings
  const loadInitialData = async () => {
    try {
      const [prodRes, settRes] = await Promise.all([
        api.getProducts(),
        api.getSettings(),
      ]);
      setProducts(prodRes.products);
      setSettings(settRes.settings);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Listen to browser forward/backward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'admin') setCurrentTab('admin');
      else if (path === 'marketplace' || path === 'explore') setCurrentTab('marketplace');
      else if (path === 'how-it-works') setCurrentTab('how-it-works');
      else if (path === 'contact' || path === 'quote') setCurrentTab('contact');
      else if (path === 'dashboard' || path === 'orders') setCurrentTab('dashboard');
      else setCurrentTab('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation router handler
  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'marketplace' && param) {
      setCatalogCategory(param);
    } else if (tab === 'marketplace') {
      setCatalogCategory('All');
    }
    setCurrentTab(tab);

    if (typeof window !== 'undefined') {
      const targetPath = tab === 'home' ? '/' : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  const handleSelectProduct = (prod: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedProduct(prod);
    setCurrentTab('details');
  };

  const handleStartBuy = (prod: Product, packageKey: PackageTierKey = 'starter') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedProduct(prod);
    setCheckoutPackage(packageKey);
    setCurrentTab('checkout');
  };

  const handleLiveDemo = (prod?: Product) => {
    if (prod) {
      setDemoProduct(prod);
    } else if (products.length > 0) {
      setDemoProduct(products[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Floating Buttons: WhatsApp on Bottom-Left and AI Bot Assistant on Bottom-Right (Mobile & Desktop) */}
      <FloatingButtons settings={settings} />

      {/* Sticky Blur Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        settings={settings}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {/* VIEW 1: HOMEPAGE */}
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onExplore={() => handleNavigate('marketplace')}
              onPreviewDemo={handleLiveDemo}
              onContact={() => handleNavigate('contact')}
              featuredProduct={products.find((p) => p.featured) || products[0]}
              developerProfile={settings?.developerProfile}
              settings={settings}
            />

            {/* Dynamic Developer Profile, Bio & Metrics */}
            <PortfolioAboutSection
              profile={settings?.developerProfile}
              settings={settings}
              onExploreProjects={() => handleNavigate('marketplace')}
              onContact={() => handleNavigate('contact')}
            />

            {/* Dynamic Services & Development Offerings */}
            <PortfolioServicesSection
              services={settings?.developerProfile?.services}
              onSelectService={() => handleNavigate('contact')}
            />

            {/* Dynamic Tech Stack & Skills */}
            <PortfolioSkillsSection
              skills={settings?.developerProfile?.skills}
            />

            {/* Dynamic Experience Timeline */}
            <PortfolioExperienceSection
              experience={settings?.developerProfile?.experience}
            />

            {/* Dynamic Client Testimonials & Reviews */}
            <PortfolioTestimonialsSection
              testimonials={settings?.developerProfile?.testimonials}
            />

            {/* Featured Websites Collection Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curated Marquee Releases</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Featured Ready-Made Websites
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Inspected architectures engineered for instant business deployment.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate('marketplace')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group"
                >
                  <span>Explore All {products.length} Solutions</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {loading ? (
                <div className="py-20 text-center text-xs text-slate-400 font-mono">
                  Loading verified website catalog...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.slice(0, 3).map((prod) => (
                    <WebsiteCard
                      key={prod.id}
                      product={prod}
                      onViewDetails={handleSelectProduct}
                      onLiveDemo={handleLiveDemo}
                      onBuy={(p) => handleStartBuy(p, 'starter')}
                    />
                  ))}
                </div>
              )}
            </section>

            <HowItWorks />
            <FAQSection />
          </div>
        )}

        {/* VIEW 2: MARKETPLACE CATALOG */}
        {currentTab === 'marketplace' && (
          <CatalogPage
            products={products}
            initialCategory={catalogCategory}
            onViewDetails={handleSelectProduct}
            onLiveDemo={handleLiveDemo}
            onBuy={(p) => handleStartBuy(p, 'starter')}
          />
        )}

        {/* VIEW 3: PRODUCT DETAIL PAGE */}
        {currentTab === 'details' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => handleNavigate('marketplace')}
            onLiveDemo={handleLiveDemo}
            onBuy={handleStartBuy}
            onSelectProduct={handleSelectProduct}
            onContactSupport={() => handleNavigate('contact')}
          />
        )}

        {/* VIEW 4: SECURE ORDER CHECKOUT */}
        {currentTab === 'checkout' && selectedProduct && (
          <CheckoutPage
            product={selectedProduct}
            initialPackage={checkoutPackage}
            settings={settings}
            onBack={() => {
              if (selectedProduct) {
                setCurrentTab('details');
              } else {
                handleNavigate('marketplace');
              }
            }}
            onOrderSuccess={() => {}}
            onViewDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {/* VIEW 5: CUSTOMER DASHBOARD */}
        {currentTab === 'dashboard' && (
          <CustomerDashboard onExplore={() => handleNavigate('marketplace')} />
        )}

        {/* VIEW 6: PROTECTED ADMIN PANEL */}
        {currentTab === 'admin' && (
          isAdmin && user ? (
            <AdminDashboard
              onBackToStore={() => {
                loadInitialData();
                handleNavigate('home');
              }}
              onDataChange={() => {
                loadInitialData();
              }}
            />
          ) : (
            <AdminLogin
              onSuccess={() => {
                loadInitialData();
              }}
              onBackToStore={() => {
                loadInitialData();
                handleNavigate('home');
              }}
            />
          )
        )}

        {/* VIEW 7: HOW IT WORKS PAGE */}
        {currentTab === 'how-it-works' && (
          <div className="py-12">
            <div className="max-w-4xl mx-auto px-4 text-center mb-8">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
                Launch Transparency
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                How Purchasing & Delivery Works
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Everything you need to know about our code standards, manual payment verification, and digital release guarantees.
              </p>
            </div>
            <HowItWorks />
            <TrustBenefits />
            <FAQSection />
          </div>
        )}

        {/* VIEW 8: CONTACT & CUSTOM PROPOSAL */}
        {currentTab === 'contact' && <ContactPage settings={settings} />}
      </main>

      {/* Global Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenPolicy={(p) => setPolicyType(p)}
      />

      {/* Interactive Responsive Live Demo Modal */}
      {demoProduct && (
        <LiveDemoModal
          product={demoProduct}
          onClose={() => setDemoProduct(null)}
          onSelectBuy={(p) => {
            setDemoProduct(null);
            handleStartBuy(p, 'starter');
          }}
        />
      )}

      {/* Global Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
        onLiveDemo={handleLiveDemo}
      />

      {/* Auth Modal (Login / Register / Quick Demo Accounts) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
        onSuccess={() => loadInitialData()}
      />

      {/* Platform Policies Modal (Dynamic Policies from Database) */}
      <PolicyModal
        type={policyType}
        onClose={() => setPolicyType(null)}
        policies={settings?.policies}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <MainApp />
      </CurrencyProvider>
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from './Logo.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import {
  Search,
  User as UserIcon,
  Menu,
  X,
  Shield,
  ShoppingBag,
  ChevronDown,
  LogOut,
  Sparkles,
  Home,
  LayoutGrid,
  HelpCircle,
  FileText,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Lock,
  Bot,
  UserPlus
} from 'lucide-react';

import { PlatformSettings } from '../../types/index.js';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  settings?: PlatformSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch, onOpenAuth, settings }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const { user, isAdmin, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync body scroll with mobile drawer state
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Automatically close mobile menu and restore scroll on desktop screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home', icon: Home },
    { label: 'All Websites', id: 'marketplace', icon: LayoutGrid },
    { label: 'How It Works', id: 'how-it-works', icon: HelpCircle },
    { label: 'Custom Quote', id: 'contact', icon: FileText },
  ];

  const handleMobileNav = (tabId: string, param?: string) => {
    document.body.style.overflow = '';
    setMobileMenuOpen(false);
    onNavigate(tabId, param);
  };

  const rawNumber = settings?.whatsappNumber || '+92 300 1234567';
  const cleanPhone = rawNumber.replace(/[^0-9]/g, '');

  const openWhatsAppDirect = () => {
    document.body.style.overflow = '';
    setMobileMenuOpen(false);
    const msg = encodeURIComponent(
      'Hello Smart Developer! I am browsing your website catalogue and need assistance choosing a website or custom project.'
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const openBotDirect = () => {
    document.body.style.overflow = '';
    setMobileMenuOpen(false);
    if (typeof window === 'undefined') return;
    const bp = (window as any).botpress;
    if (bp && typeof bp.open === 'function') {
      bp.open();
      return;
    }
    if (bp && typeof bp.toggle === 'function') {
      bp.toggle();
      return;
    }
    const nativeBtn = document.querySelector(
      'bp-webchat, #bp-webchat, .bpFab, [data-name="fab"], button[aria-label="Open Webchat"]'
    ) as HTMLElement | null;
    if (nativeBtn) {
      nativeBtn.click();
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          scrolled
            ? 'bg-[#08090D]/95 backdrop-blur-md border-white/10 shadow-lg shadow-black/50'
            : 'bg-[#08090D]/85 backdrop-blur-sm border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => onNavigate('home')}
                className="text-left focus:outline-none cursor-pointer"
              >
                <Logo size="md" />
              </button>
            </div>

            {/* Zone 2: Desktop Navigation Links (XL screens) */}
            <nav className="hidden xl:flex items-center gap-6 text-xs lg:text-sm font-medium text-slate-300">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
                    currentTab === item.id ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Zone 3: Controls & Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* WhatsApp Button (Clean & compact on sm+, available in mobile drawer & floating button) */}
              <button
                onClick={openWhatsAppDirect}
                className="hidden sm:inline-flex px-2.5 py-1.5 text-[#25D366] bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 rounded-xl transition-all cursor-pointer items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                title={`Chat with Smart Developer on WhatsApp (${rawNumber})`}
                aria-label="Direct WhatsApp Chat"
              >
                <div className="relative flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#25D366]"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.04 2C6.49 2 1.98 6.51 1.98 12.06c0 1.77.46 3.5 1.34 5.02L2 22l5.06-1.33c1.47.8 3.12 1.23 4.98 1.23 5.55 0 10.06-4.51 10.06-10.06C22.1 6.51 17.59 2 12.04 2zm0 18.25c-1.57 0-3.1-.42-4.44-1.22l-.32-.19-3.3.86.88-3.21-.21-.33a8.214 8.214 0 0 1-1.26-4.36c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25s-3.7 8.25-8.25 8.25z" />
                    <path d="M17.472 14.382c-.301-.15-1.777-.877-2.053-.977-.275-.1-.475-.15-.675.15-.2.3-.775.977-.95 1.177-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.496-1.78-1.67-2.08-.175-.3-.018-.463.132-.612.135-.135.301-.35.451-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.243-.585-.49-.506-.675-.515-.175-.009-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.112 3.225 5.118 4.525 2.99 1.294 2.99.862 3.525.812.535-.05 1.725-.705 1.97-1.385.245-.68.245-1.265.17-1.385-.075-.12-.275-.195-.575-.345z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-[#25D366]">WhatsApp</span>
              </button>

              {/* AI Sales Bot Action Button (Clean on sm+) */}
              <button
                onClick={openBotDirect}
                className="hidden sm:inline-flex px-2.5 py-1.5 text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 rounded-xl transition-all cursor-pointer items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                title="Chat with AI Website Sales Assistant"
                aria-label="Direct AI Bot Chat"
              >
                <div className="relative flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-300" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-cyan-300">AI Bot</span>
              </button>

              {/* Search Icon */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Search Websites Catalog"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Currency Selector (PKR / USD) */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs font-mono shrink-0">
                <button
                  onClick={() => setCurrency('PKR')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors text-[11px] sm:text-xs font-bold cursor-pointer ${
                    currency === 'PKR' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PKR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors text-[11px] sm:text-xs font-bold cursor-pointer ${
                    currency === 'USD' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD
                </button>
              </div>

              {/* Account Dropdown for signed-in users on larger screens */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-medium max-w-[85px] truncate">{user.name.split(' ')[0]}</span>
                    {isAdmin && (
                      <span className="px-1 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[9px] font-mono">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0E121B] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-white/5">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-3 py-2 text-cyan-300 hover:bg-white/5 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Panel</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>My Orders & Downloads</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

              {/* Desktop: Dedicated Admin Panel Button */}
              <button
                onClick={() => onNavigate('admin')}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                  currentTab === 'admin'
                    ? 'bg-blue-600/30 text-cyan-300 border-cyan-400/60 shadow-sm shadow-cyan-500/20 font-bold'
                    : 'bg-[#0E131F] text-slate-300 hover:text-white border-blue-500/30 hover:border-cyan-400/50 hover:bg-blue-950/40'
                }`}
                title="Access Admin Operations Panel"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Panel</span>
              </button>

              {/* Desktop: Primary Action Button */}
              <button
                onClick={() => onNavigate('marketplace')}
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all whitespace-nowrap cursor-pointer hover:shadow-cyan-500/20 shrink-0"
                title="Explore ready-made websites catalog"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Explore Websites</span>
              </button>

              {/* ========================================================= */}
              {/* CLEAR, PROMINENT THREE-LINES (☰) MOBILE HAMBURGER BUTTON */}
              {/* ========================================================= */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 xl:hidden rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md ${
                  mobileMenuOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70 shadow-cyan-500/30 ring-2 ring-cyan-500/40'
                    : 'bg-[#121724] hover:bg-[#1A2234] text-white border-white/25 hover:border-cyan-400/60 active:scale-95 shadow-black/40'
                }`}
                aria-label="Toggle Navigation Menu (Three Lines)"
                title="Open Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-[4px] w-5 h-5" aria-hidden="true">
                    {/* Clear Three Horizontal Lines */}
                    <span className="block h-[2.5px] w-5 rounded-full bg-white shadow-sm" />
                    <span className="block h-[2.5px] w-5 rounded-full bg-cyan-400 shadow-sm" />
                    <span className="block h-[2.5px] w-5 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* COMPLETE MOBILE MENU DRAWER (PORTALED TO DOCUMENT.BODY)   */}
      {/* ========================================================= */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] xl:hidden bg-[#08090E] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Top Bar with Brand & Close Button */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-16 bg-[#08090E] border-b border-white/10 shrink-0">
            <button
              onClick={() => handleMobileNav('home')}
              className="text-left focus:outline-none cursor-pointer"
            >
              <Logo size="md" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Menu
              </span>
              <button
                onClick={() => {
                  document.body.style.overflow = '';
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center active:scale-95"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Drawer Body Containing ALL Buttons */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-lg mx-auto w-full pb-32">
            
            {/* 1. AUTHENTICATION SECTION: SIGN IN & SIGN UP BUTTONS */}
            {user ? (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/30 text-cyan-300 font-bold flex items-center justify-center text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-[170px]">{user.name}</p>
                      <p className="text-xs text-slate-400 font-mono truncate max-w-[170px]">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase ${
                      isAdmin
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => handleMobileNav('dashboard')}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      document.body.style.overflow = '';
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F1424] to-[#0A0D18] border border-blue-500/30 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span>Account & Instant Deliveries</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sign in or create a customer account to download purchased website source code and view orders.
                </p>

                {/* Explicit Separate Sign In and Sign Up Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      document.body.style.overflow = '';
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-all cursor-pointer active:scale-95"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      document.body.style.overflow = '';
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-white" />
                    <span>Sign Up Free</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. DIRECT SUPPORT (WHATSAPP & AI SALES BOT) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp Card */}
              <button
                onClick={openWhatsAppDirect}
                className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all flex flex-col justify-between cursor-pointer group shadow-lg shadow-emerald-950/30 active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                    <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.04 2C6.49 2 1.98 6.51 1.98 12.06c0 1.77.46 3.5 1.34 5.02L2 22l5.06-1.33c1.47.8 3.12 1.23 4.98 1.23 5.55 0 10.06-4.51 10.06-10.06C22.1 6.51 17.59 2 12.04 2zm0 18.25c-1.57 0-3.1-.42-4.44-1.22l-.32-.19-3.3.86.88-3.21-.21-.33a8.214 8.214 0 0 1-1.26-4.36c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25s-3.7 8.25-8.25 8.25z" />
                      <path d="M17.472 14.382c-.301-.15-1.777-.877-2.053-.977-.275-.1-.475-.15-.675.15-.2.3-.775.977-.95 1.177-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.496-1.78-1.67-2.08-.175-.3-.018-.463.132-.612.135-.135.301-.35.451-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.243-.585-.49-.506-.675-.515-.175-.009-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.112 3.225 5.118 4.525 2.99 1.294 2.99.862 3.525.812.535-.05 1.725-.705 1.97-1.385.245-.68.245-1.265.17-1.385-.075-.12-.275-.195-.575-.345z" />
                    </svg>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">WhatsApp Live</p>
                  <p className="text-[10px] text-emerald-400 font-mono truncate">{rawNumber}</p>
                </div>
              </button>

              {/* AI Sales Bot Card */}
              <button
                onClick={openBotDirect}
                className="p-3.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all flex flex-col justify-between cursor-pointer group shadow-lg shadow-cyan-950/30 active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Sales Bot</p>
                  <p className="text-[10px] text-cyan-300 font-mono">Instant Advice</p>
                </div>
              </button>
            </div>

            {/* 3. DEDICATED ADMIN OPERATIONS PANEL GATEWAY */}
            <div className="p-4 rounded-2xl bg-[#0C1120] border-2 border-blue-500/40 shadow-xl shadow-blue-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Admin Operations Panel</p>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Manage listings, edit portfolio, verify payments</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => handleMobileNav('admin')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Open Admin Operations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4. EXPLORE READY-MADE WEBSITES CARD */}
            <button
              onClick={() => handleMobileNav('marketplace')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold flex items-center justify-between shadow-xl shadow-blue-600/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-extrabold text-white">Explore Ready Websites</p>
                  <p className="text-xs text-cyan-100 font-normal">Browse verified source code catalogue</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 5. STORE SECTIONS NAVIGATION LINKS */}
            <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Store Sections
              </div>
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNav(item.id)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            {/* 6. CURRENCY SWITCHER ROW */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Display Currency</p>
                <p className="text-[11px] text-slate-400">Switch between PKR (Local) and USD (Global)</p>
              </div>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-xs font-mono">
                <button
                  onClick={() => setCurrency('PKR')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    currency === 'PKR' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PKR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    currency === 'USD' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>

            {/* 7. QUICK SEARCH BUTTON */}
            <button
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search Website Catalog...</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

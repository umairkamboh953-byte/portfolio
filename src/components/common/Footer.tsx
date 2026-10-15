import React from 'react';
import { Logo } from './Logo.js';
import { PlatformSettings } from '../../types/index.js';
import {
  MessageSquare,
  Mail,
  Shield,
  FileText,
  Clock,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  settings?: PlatformSettings;
  onNavigate: (tab: string, param?: string) => void;
  onOpenPolicy: (type: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenPolicy }) => {
  const whatsappNumber = settings?.whatsappNumber || '+92 300 1234567';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const email = settings?.contactEmail || 'sales@smartdeveloper.com';
  const dynamicPolicies = settings?.policies && settings.policies.length > 0 ? settings.policies : null;

  return (
    <footer className="w-full bg-[#050609] border-t border-white/10 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Smart Developer is the premier marketplace for production-grade websites, bespoke web applications, and turnkey ecommerce stores. Built for founders, entrepreneurs, and digital businesses across Pakistan and worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20Smart%20Developer%20Team%2C%20I%20am%20interested%20in%20purchasing%20a%20website.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 font-medium rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Websites</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('marketplace', 'Ecommerce Websites')} className="hover:text-white transition-colors cursor-pointer">
                  Ecommerce Stores
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace', 'Business Websites')} className="hover:text-white transition-colors cursor-pointer">
                  Corporate & Business
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace', 'Portfolio Websites')} className="hover:text-white transition-colors cursor-pointer">
                  Developer Portfolios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace', 'AI Web Applications')} className="hover:text-white transition-colors cursor-pointer">
                  AI Web Applications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace', 'Agency Websites')} className="hover:text-white transition-colors cursor-pointer">
                  Agency Showcases
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Custom Website Project
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Team
                </button>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{email}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust, Legal & Policies (Dynamically rendered from Database/Admin) */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Legal & Policies</h4>
            <ul className="space-y-2">
              {dynamicPolicies ? (
                dynamicPolicies.map((p) => (
                  <li key={p.id || p.key}>
                    <button
                      onClick={() => onOpenPolicy(p.key || p.id)}
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                      title={p.title}
                    >
                      <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{p.title}</span>
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <button onClick={() => onOpenPolicy('licensing')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Commercial Licensing</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onOpenPolicy('delivery')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Verified Delivery Policy</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onOpenPolicy('refund')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Refund & Warranty</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onOpenPolicy('support')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Support Guidelines</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Smart Developer. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Primary Local: PKR (JazzCash / Easypaisa / Bank Transfer)</span>
            <span>·</span>
            <span>International: USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

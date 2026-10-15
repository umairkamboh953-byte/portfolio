import React, { useState } from 'react';
import { Product } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import {
  X,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface LiveDemoModalProps {
  product: Product;
  onClose: () => void;
  onSelectBuy: (product: Product) => void;
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({ product, onClose, onSelectBuy }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { formatPrice } = useCurrency();

  const deviceWidths = {
    desktop: 'w-full max-w-5xl',
    tablet: 'w-full max-w-2xl',
    mobile: 'w-full max-w-sm',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex flex-col w-full h-[92vh] max-w-6xl bg-[#0C0E14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0E121B]">
          {/* Left: Window Dots & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 text-xs text-slate-300 font-medium">
              <span className="text-white font-semibold truncate max-w-xs">{product.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400 font-mono text-[11px]">{product.category}</span>
            </div>
          </div>

          {/* Center: Responsive Viewport Switcher */}
          <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-lg">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSelectBuy(product);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy ({formatPrice(product.pricePKR, product.priceUSD)})</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser URL Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#090B10] text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-lg bg-black/50 border border-white/10 rounded-md px-3 py-1 text-slate-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">https://preview.smartdeveloper.com/demo/{product.slug}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="hidden md:inline text-[11px] text-slate-500">Interactive Production Preview</span>
          </div>
        </div>

        {/* Live Preview Viewport Canvas */}
        <div className="flex-1 bg-[#050608] overflow-y-auto p-4 flex justify-center items-start">
          <div className={`${deviceWidths[deviceMode]} transition-all duration-300 bg-[#0A0D14] border border-white/10 rounded-xl overflow-hidden shadow-2xl`}>
            {/* Interactive Demo Content Header */}
            <div className="relative">
              <img
                src={product.thumbnail}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent" />
            </div>

            {/* In-Preview Interactive Overview */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{product.category}</span>
                  <h2 className="text-2xl font-bold text-white mt-1">{product.name}</h2>
                  <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">{product.shortDescription}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Starting Price</div>
                  <div className="text-2xl font-bold text-white font-mono">{formatPrice(product.pricePKR, product.priceUSD)}</div>
                </div>
              </div>

              {/* Technologies in Demo */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Verified Architecture & Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {product.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Package Tiers Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-sm font-semibold text-white">Starter Tier</div>
                  <div className="text-xs text-slate-400 mt-1">{product.packages.starter.description}</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-3">
                    {formatPrice(product.packages.starter.pricePKR || product.pricePKR, product.packages.starter.priceUSD || product.priceUSD)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30">
                  <div className="text-sm font-semibold text-white">Professional Tier</div>
                  <div className="text-xs text-slate-400 mt-1">{product.packages.professional.description}</div>
                  <div className="text-lg font-bold text-blue-400 font-mono mt-3">
                    {formatPrice(product.packages.professional.pricePKR || product.pricePKR * 1.5, product.packages.professional.priceUSD || product.priceUSD * 1.5)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-sm font-semibold text-white">Custom Tier</div>
                  <div className="text-xs text-slate-400 mt-1">{product.packages.custom.description}</div>
                  <div className="text-sm font-semibold text-slate-300 font-mono mt-3">Custom Quote</div>
                </div>
              </div>

              {/* Interactive Purchase Bar inside Demo */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-transparent border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-white">Instant File Delivery:</span> Clean source code, setup PDF, and verified license.
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onSelectBuy(product);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-colors"
                >
                  <span>Select Package & Buy Website</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

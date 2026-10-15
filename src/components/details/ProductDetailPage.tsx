import React, { useState } from 'react';
import { Product, PackageTierKey } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import {
  Play,
  ShoppingBag,
  ArrowLeft,
  Check,
  Server,
  Database,
  Cloud,
  FileCode,
  Shield,
  Clock,
  Sparkles,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onLiveDemo: (product: Product) => void;
  onBuy: (product: Product, packageKey?: PackageTierKey) => void;
  onSelectProduct: (product: Product) => void;
  onContactSupport: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onLiveDemo,
  onBuy,
  onSelectProduct,
  onContactSupport
}) => {
  const [selectedPackage, setSelectedPackage] = useState<PackageTierKey>('starter');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const { formatPrice, currency } = useCurrency();

  const galleryImages = product.screenshots.length > 0 ? product.screenshots : [product.thumbnail];

  // Related products in same category
  const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  const currentPkg = product.packages[selectedPackage];
  const pkgPrice = selectedPackage === 'starter'
    ? formatPrice(product.packages.starter.pricePKR || product.pricePKR, product.packages.starter.priceUSD || product.priceUSD)
    : selectedPackage === 'professional'
    ? formatPrice(product.packages.professional.pricePKR || Math.round(product.pricePKR * 1.5), product.packages.professional.priceUSD || Math.round(product.priceUSD * 1.5))
    : 'Custom Quote';

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-xs text-slate-400">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
        <span>/</span>
        <span className="text-cyan-400">{product.category}</span>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (8 cols): Media Gallery & Technical Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Hero Media Frame */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0B0E16] overflow-hidden group shadow-2xl">
            <img
              src={galleryImages[activeImageIdx] || product.thumbnail}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16]/80 via-transparent to-transparent opacity-40 pointer-events-none" />

            {/* Quick Live Demo Floating Button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => onLiveDemo(product)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Open Live Demo</span>
              </button>
            </div>
          </div>

          {/* Thumbnails Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIdx === idx ? 'border-blue-500 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Description */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C1019] border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white">Project Overview</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Technical Specifications & Hosting Requirements */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C1019] border border-white/10 space-y-6">
            <h2 className="text-xl font-bold text-white">Architecture & Requirements</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                  <Server className="w-4 h-4" />
                  <span>Backend Stack</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{product.requirements.backend}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                  <Cloud className="w-4 h-4" />
                  <span>Hosting Target</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{product.requirements.hosting}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                  <Database className="w-4 h-4" />
                  <span>Database Setup</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{product.requirements.database}</p>
              </div>
            </div>

            {/* Delivery Specifications */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-300 font-semibold">
                <FileCode className="w-4 h-4" />
                <span>Delivery Format & Estimated Time</span>
              </div>
              <p className="text-slate-300">{product.deliveryFormat}</p>
              <p className="text-slate-400 font-mono text-[11px]">Turnaround: {product.estimatedDeliveryTime}</p>
            </div>
          </div>

          {/* Product Specific FAQ */}
          {product.faq && product.faq.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0C1019] border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-3">
                {product.faq.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <h4 className="text-sm font-semibold text-white">{item.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Contiguous Purchase & Package Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0E121B] border border-white/10 shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
                {product.category}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Package Tier Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Package Tier
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 border border-white/10 rounded-xl text-xs font-medium">
                {(['starter', 'professional', 'custom'] as PackageTierKey[]).map((key) => {
                  const isSelected = selectedPackage === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPackage(key)}
                      className={`py-2 px-3 rounded-lg capitalize transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Package Details */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-300 font-semibold capitalize">{selectedPackage} Package</span>
                <span className="text-2xl font-bold text-white font-mono">{pkgPrice}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentPkg?.description}
              </p>

              {/* Package Features list */}
              {currentPkg?.features && (
                <ul className="space-y-2 pt-2 border-t border-white/5">
                  {currentPkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Technologies */}
            <div>
              <div className="text-xs text-slate-400 mb-2 font-mono">Included Stack:</div>
              <div className="flex flex-wrap gap-1.5">
                {product.technologies.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Buy CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onBuy(product, selectedPackage)}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-cyan-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {selectedPackage === 'custom' ? 'Request Custom Proposal' : `Buy Website (${pkgPrice})`}
                </span>
              </button>

              <button
                onClick={() => onLiveDemo(product)}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Preview Live Demo in Fullscreen</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Clean Code</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Commercial License</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Manual Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>WhatsApp Assistance</span>
              </div>
            </div>

            {/* Questions CTA */}
            <div className="text-center pt-2">
              <button
                onClick={onContactSupport}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Have questions before ordering? Contact our architects
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Websites Section */}
      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Similar {product.category} Solutions</h3>
            <button
              onClick={onBack}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="p-4 rounded-xl bg-[#0B0E16] border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <img
                  src={rel.thumbnail}
                  alt={rel.name}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] rounded-lg object-cover mb-3 group-hover:scale-[1.02] transition-transform"
                />
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{rel.name}</h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-400 font-mono">{formatPrice(rel.pricePKR, rel.priceUSD)}</span>
                  <span className="text-[11px] text-cyan-400">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Product } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { Play, ArrowRight, Smartphone, Code, ShoppingBag } from 'lucide-react';

interface WebsiteCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onLiveDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  product,
  onViewDetails,
  onLiveDemo,
  onBuy,
}) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="flex flex-col bg-[#0B0E16] border border-white/10 hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-xl hover:shadow-blue-950/20">
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
        <img
          src={product.thumbnail}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-transparent to-transparent opacity-60" />

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
          <button
            onClick={() => onLiveDemo(product)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Live Demo</span>
          </button>
          <button
            onClick={() => onViewDetails(product)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer"
          >
            View Details
          </button>
        </div>

        {/* Top Floating Tags (Clean Unboxed/Subtle) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none">
          <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-cyan-300 font-mono">
            {product.category}
          </span>
          {product.sourceCodeIncluded && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
              Source Included
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title & Responsive indicator */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onViewDetails(product)}
              className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
            >
              {product.name}
            </h3>
            {product.responsive && (
              <span className="p-1 text-slate-400 hover:text-white" title="Responsive Design">
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Tech Stack Pills (Subtle unboxed tags) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] text-slate-400 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded font-mono"
              >
                {tech}
              </span>
            ))}
            {product.technologies.length > 3 && (
              <span className="text-[10px] text-slate-400 px-1 py-0.5 font-mono">
                +{product.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Starter Tier</span>
            <span className="text-base font-bold text-white font-mono">
              {formatPrice(product.pricePKR, product.priceUSD)}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => onLiveDemo(product)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Preview Live Website"
            >
              <Play className="w-3 h-3 fill-cyan-300" />
              <span className="text-[11px] font-medium hidden xs:inline">Demo</span>
            </button>
            <button
              onClick={() => onViewDetails(product)}
              className="px-2.5 sm:px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onBuy(product)}
              className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

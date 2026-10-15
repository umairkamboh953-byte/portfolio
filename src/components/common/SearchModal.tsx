import React, { useState } from 'react';
import { Product } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { Search, X, ArrowRight, Play } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLiveDemo: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onLiveDemo,
}) => {
  const [query, setQuery] = useState('');
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0D1018] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search ready-made websites, technologies, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          <div className="px-3 py-1 text-[11px] font-mono text-slate-400 uppercase">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Ready-Made Websites'}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching websites found for "{query}".
            </div>
          ) : (
            results.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group cursor-pointer"
                onClick={() => {
                  onClose();
                  onSelectProduct(prod);
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.thumbnail}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-12 aspect-[4/3] rounded object-cover"
                  />
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono">{prod.category}</span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {prod.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatPrice(prod.pricePKR, prod.priceUSD)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onLiveDemo(prod);
                    }}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded transition-colors"
                    title="Live Demo"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types/index.js';
import { WebsiteCard } from './WebsiteCard.js';
import { Search, Filter, SlidersHorizontal, X, Sparkles, RefreshCw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext.js';

interface CatalogPageProps {
  products: Product[];
  initialCategory?: string;
  onViewDetails: (product: Product) => void;
  onLiveDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Ecommerce Websites',
  'Business Websites',
  'Portfolio Websites',
  'Landing Pages',
  'AI Web Applications',
  'Agency Websites',
  'Restaurant Websites',
  'SaaS Websites',
  'Custom Website Projects',
];

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  initialCategory = 'All',
  onViewDetails,
  onLiveDemo,
  onBuy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price_asc' | 'price_desc'>('featured');
  const [priceTier, setPriceTier] = useState<'all' | 'under_150' | '150_250' | '250_plus'>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number>(6);

  const { currency } = useCurrency();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesTech = p.technologies.some((t) => t.toLowerCase().includes(q));
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTech && !matchesCat) {
          return false;
        }
      }

      // Price filter (based on USD equivalent for consistency)
      if (priceTier === 'under_150' && p.priceUSD >= 150) return false;
      if (priceTier === '150_250' && (p.priceUSD < 150 || p.priceUSD > 250)) return false;
      if (priceTier === '250_plus' && p.priceUSD <= 250) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price_asc') {
        return a.priceUSD - b.priceUSD;
      }
      if (sortBy === 'price_desc') {
        return b.priceUSD - a.priceUSD;
      }
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy, priceTier]);

  const visibleProducts = filteredProducts.slice(0, displayCount);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setPriceTier('all');
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Introduction */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Production Catalogue</span>
              <span className="text-slate-500">·</span>
              <span>{products.length} Verified Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Ready-Made Websites
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Inspect working architectures, preview source code specifications, and acquire launch-ready solutions with complete files.
            </p>
          </div>

          {/* Quick Stats or Active Filter Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Showing <strong className="text-white">{filteredProducts.length}</strong> websites
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar & Primary Controls */}
      <div className="bg-[#0D1018] border border-white/10 rounded-2xl p-4 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, tech stack (React, Next.js, Tailwind), or category..."
              className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Filter Selectors */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
            {/* Price Tier Filter */}
            <select
              value={priceTier}
              onChange={(e: any) => setPriceTier(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-2 sm:py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="under_150">&lt; $150 USD</option>
              <option value="150_250">$150 – $250</option>
              <option value="250_plus">$250+ USD</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-2 sm:py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low-High</option>
              <option value="price_desc">Price: High-Low</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="mt-4 pt-4 border-t border-white/5 overflow-x-auto scrollbar-none flex items-center gap-2 pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleProducts.map((prod) => (
              <WebsiteCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewDetails}
                onLiveDemo={onLiveDemo}
                onBuy={onBuy}
              />
            ))}
          </div>

          {/* Load More Button */}
          {filteredProducts.length > displayCount && (
            <div className="text-center pt-6">
              <button
                onClick={() => setDisplayCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Load More Websites ({filteredProducts.length - displayCount} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[#0D1018] border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No matching websites found</h3>
          <p className="text-xs text-slate-400 mb-6">
            We couldn't find any websites matching your query "{searchQuery}" with the selected category filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

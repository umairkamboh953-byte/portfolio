import React from 'react';
import { ServiceItem } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import {
  Code2,
  Sparkles,
  ShoppingCart,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface PortfolioServicesSectionProps {
  services?: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const PortfolioServicesSection: React.FC<PortfolioServicesSectionProps> = ({
  services = [],
  onSelectService
}) => {
  const { formatPrice } = useCurrency();

  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'shopping-cart':
        return <ShoppingCart className="w-5 h-5 text-emerald-400" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'globe':
      default:
        return <Globe className="w-5 h-5 text-cyan-400" />;
    }
  };

  const activeServices = services.filter((s) => s.active !== false);

  if (activeServices.length === 0) return null;

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>Engineering Expertise & Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Services & Development Offerings
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            From complete web applications to custom SaaS architectures, here is how I help founders and businesses scale.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {activeServices.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-2xl border border-white/10 bg-[#0C1019] hover:bg-[#0F1420] hover:border-cyan-500/40 p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Header: Icon, Category & Price */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                      {service.category || 'Engineering'}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {service.pricingModel || 'Starting From'}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                    {formatPrice(service.pricePKR, service.priceUSD)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {service.shortDescription || service.fullDescription}
              </p>

              {/* Deliverables Bullet List */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="space-y-2 mb-6 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                    Included Deliverables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.deliverables.slice(0, 4).map((deliv, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer: Timeline & Action Button */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{service.deliveryTime || '5-10 Days Delivery'}</span>
              </div>

              <button
                onClick={() => onSelectService(service)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-blue-600/20"
              >
                <span>Request Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

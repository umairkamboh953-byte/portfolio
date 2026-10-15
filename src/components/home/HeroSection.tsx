import React from 'react';
import { ArrowRight, Play, Sparkles, Layers, ShieldCheck, Terminal, User, Bot, MessageCircle } from 'lucide-react';
import { Product, DeveloperProfile, PlatformSettings } from '../../types/index.js';

interface HeroSectionProps {
  onExplore: () => void;
  onPreviewDemo: (product?: Product) => void;
  onContact?: () => void;
  featuredProduct?: Product;
  developerProfile?: DeveloperProfile;
  settings?: PlatformSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onPreviewDemo,
  onContact,
  featuredProduct,
  developerProfile,
  settings
}) => {
  const brandName = settings?.websiteName || 'Smart Developer';
  const fullName = developerProfile?.fullName || 'Umair Kamboh';
  const headline = developerProfile?.headline || 'Senior Full-Stack Engineer & SaaS Architect';
  const tagline = developerProfile?.tagline || 'Crafting high-impact web apps, custom digital platforms, and production-ready codebases.';

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Tagline Kicker with Dynamic Developer Name */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300">
            <span className="text-cyan-400 font-semibold">{brandName}</span>
            <span className="text-slate-500">·</span>
            <span>By {fullName}</span>
            <span className="text-slate-500">·</span>
            <span className="hidden sm:inline">Portfolio & Production Code</span>
          </div>

          {/* Marquee Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] text-balance">
            Your Next Website Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
              Already Built.
            </span>
          </h1>

          {/* Supporting Text from Dynamic Developer Tagline / Headline */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {tagline} Preview live demos, choose your verified architecture, and launch your business with full source code ownership.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px] cursor-pointer"
            >
              <span>Explore Portfolio Websites</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </button>

            <button
              onClick={() => onPreviewDemo(featuredProduct)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-white/20"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>View Live Demos</span>
            </button>

            {onContact && (
              <button
                onClick={onContact}
                className="w-full sm:w-auto px-6 py-3.5 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-300 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Contact {fullName.split(' ')[0]}</span>
              </button>
            )}
          </div>

          {/* Quick Live Contact Options (WhatsApp & AI Assistant) - First Screen Presence */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={`https://wa.me/${(settings?.whatsappNumber || '+92 300 1234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Smart Developer! I am viewing your portfolio websites and would like to connect.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all hover:scale-105 shadow-sm shadow-emerald-950/20"
              title="Chat with Smart Developer on WhatsApp"
            >
              <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp: {settings?.whatsappNumber || '+92 300 1234567'}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                const bp = (window as any).botpress;
                if (bp && typeof bp.open === 'function') {
                  bp.open();
                } else {
                  const el = document.querySelector('bp-webchat, #bp-webchat, .bpFab, [data-name="fab"]') as HTMLElement | null;
                  if (el) el.click();
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-105 cursor-pointer shadow-sm shadow-cyan-950/20"
              title="Open AI Website Sales Assistant"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI Website Assistant</span>
            </button>
          </div>
        </div>

        {/* Floating Website Showcase Canvas */}
        <div className="mt-14 sm:mt-20 relative max-w-5xl mx-auto">
          {/* Main Showcase Frame */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0C0F17] shadow-2xl shadow-black/80 overflow-hidden group">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0A0D15]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-3 text-[11px] text-slate-400 font-mono hidden sm:inline">
                  smart-developer.production // {fullName.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded">
                Verified Codebase & Instant Release
              </div>
            </div>

            {/* Showcase Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
              <img
                src="/src/assets/images/hero_marketplace_preview_1791631880640.jpg"
                alt={`${brandName} Premium Websites`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-transparent to-transparent opacity-80" />

              {/* Floating Interactive Badge Overlays */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-cyan-300">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Full TypeScript & React Source Code Included</div>
                    <div className="text-[11px] text-slate-400">Engineered by {fullName} · Tested across all devices</div>
                  </div>
                </div>
                <button
                  onClick={onExplore}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Browse Portfolio Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { DeveloperProfile, PlatformSettings } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import {
  User,
  Briefcase,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  Phone,
  Layers,
  Award,
  Users
} from 'lucide-react';

interface PortfolioAboutSectionProps {
  profile?: DeveloperProfile;
  settings?: PlatformSettings;
  onExploreProjects: () => void;
  onContact: () => void;
}

export const PortfolioAboutSection: React.FC<PortfolioAboutSectionProps> = ({
  profile,
  settings,
  onExploreProjects,
  onContact
}) => {
  const { formatPrice } = useCurrency();

  const fullName = profile?.fullName || 'Umair Kamboh';
  const headline = profile?.headline || 'Senior Full-Stack Engineer & SaaS Architect';
  const bio =
    profile?.bio ||
    'Passionate software engineer and tech entrepreneur with 6+ years of expertise delivering high-performance web applications, scalable APIs, and bespoke digital solutions for global clients and startups.';
  const avatar =
    profile?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const location = profile?.location || 'Lahore, Pakistan / Remote Worldwide';
  const availability = profile?.availability || 'Available for Hire';
  const yearsExp = profile?.yearsExperience ?? 6;
  const completedProjects = profile?.completedProjectsCount ?? 52;
  const happyClients = profile?.happyClientsCount ?? 44;
  const hourlyRatePKR = profile?.hourlyRatePKR ?? 12500;
  const hourlyRateUSD = profile?.hourlyRateUSD ?? 45;

  const whatsappNumber = settings?.whatsappNumber || '+92 300 1234567';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="about" className="py-20 relative overflow-hidden border-t border-white/5 bg-[#090C14]">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column 1: Developer Avatar & Quick Status Card */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative group">
              {/* Radial glow background */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-[#0E131F] shadow-2xl p-2">
                <img
                  src={avatar}
                  alt={fullName}
                  referrerPolicy="no-referrer"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Floating Availability Pill */}
                <div className="absolute bottom-5 left-5 right-5 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-white">{availability}</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">
                    {formatPrice(hourlyRatePKR, hourlyRateUSD)}/hr
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Quick Credentials */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fast 24h Turnaround</span>
              </div>
            </div>
          </div>

          {/* Column 2: Bio, Story, Metrics & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs font-semibold text-cyan-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Stack Software Engineer & Solutions Architect</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hi, I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{fullName}</span>
            </h2>

            <p className="text-base sm:text-lg font-medium text-slate-200">
              {headline}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              {bio}
            </p>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {yearsExp}+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Years Experience</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                  {completedProjects}+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Websites & Projects</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  {happyClients}+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Satisfied Clients</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onContact}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
              >
                <span>Hire For Custom Project</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(fullName)}%2C%20I%20reviewed%20your%20developer%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Directly</span>
              </a>

              <button
                onClick={onExploreProjects}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Layers className="w-4 h-4 text-slate-300" />
                <span>View Portfolio Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

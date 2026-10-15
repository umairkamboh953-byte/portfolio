import React from 'react';
import { Search, PackageCheck, CreditCard, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      title: 'Explore & Test Live Demos',
      desc: 'Browse website categories, filter by technology stack, and preview full interactive demos in desktop and mobile viewports.'
    },
    {
      num: '02',
      icon: <PackageCheck className="w-5 h-5 text-blue-400" />,
      title: 'Select Your Delivery Tier',
      desc: 'Choose between the Starter package (source code only) or the Professional package (complete setup, deployment & domain linking).'
    },
    {
      num: '03',
      icon: <CreditCard className="w-5 h-5 text-indigo-400" />,
      title: 'Submit Payment & Reference',
      desc: 'Pay easily via JazzCash, Easypaisa, or direct Bank Transfer. Submit your Transaction ID or receipt screenshot for manual verification.'
    },
    {
      num: '04',
      icon: <DownloadCloud className="w-5 h-5 text-emerald-400" />,
      title: 'Instant Deliverables Release',
      desc: 'Once payment is confirmed by our operations team, your account instantly unlocks secure download links for the full source code and launch guide.'
    }
  ];

  return (
    <section className="py-20 bg-[#080A10] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">Simple & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
            How Purchasing Works on Smart Developer
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            From live preview to production launch in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-[#0D111A] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {step.icon}
                  </div>
                  <span className="text-xl font-bold font-mono text-slate-400">{step.num}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

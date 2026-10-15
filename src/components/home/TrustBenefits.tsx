import React from 'react';
import { Eye, Code, Smartphone, DollarSign, ShieldCheck, Wrench } from 'lucide-react';

export const TrustBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      title: 'Live Interactive Previews',
      description: 'Interact with the actual responsive layout, navigation, and components before making your purchase decision.'
    },
    {
      icon: <Code className="w-5 h-5 text-blue-400" />,
      title: 'Full Source Code Included',
      description: 'Complete unminified TypeScript and React source files, component hierarchy, and build configurations provided upon purchase.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-indigo-400" />,
      title: 'Responsive & Tested Layouts',
      description: 'Every website is engineered for seamless performance across smartphones, tablets, laptops, and 4K displays.'
    },
    {
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      title: 'Transparent Dual Pricing',
      description: 'Fair, transparent rates in Pakistani Rupees (PKR) for local entrepreneurs and US Dollars (USD) for international clients.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-cyan-300" />,
      title: 'Delivery After Verification',
      description: 'Secure payment review process ensuring genuine transactions, protected files, and verified deliverables.'
    },
    {
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      title: 'Optional Tailored Customization',
      description: 'Need extra integrations, custom branding, or server setup? Our software engineers provide end-to-end deployment support.'
    }
  ];

  return (
    <section className="py-16 border-y border-white/5 bg-[#07090E]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">The Smart Developer Standard</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
            Built for Serious Founders & Digital Businesses
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            No bloated themes or fragile site builders. Only clean code and production-ready architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0C1019] border border-white/10 hover:border-blue-500/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-colors">
                {b.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

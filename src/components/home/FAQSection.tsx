import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What do I receive upon purchasing a website?',
      a: 'You receive a complete, unminified digital deliverable archive including full React and TypeScript source files, CSS stylesheets, asset folders, configuration files, and a step-by-step PDF Deployment Guide tailored for Vercel, Netlify, or self-hosted servers.'
    },
    {
      q: 'Which payment methods do you support in Pakistan and internationally?',
      a: 'For clients in Pakistan, we accept JazzCash, Easypaisa, and direct Bank Transfer (Meezan Bank). For international buyers, wire transfer and international card payments are supported in USD.'
    },
    {
      q: 'How long does payment verification take?',
      a: 'When you submit your JazzCash/Easypaisa TID or bank payment reference, our verification desk validates the transaction within 30 to 90 minutes during active operating hours. Once approved, files become downloadable in your Customer Dashboard immediately.'
    },
    {
      q: 'Can I request custom modifications for my business?',
      a: 'Yes! You can choose the Professional package or request a Custom Website Project quote. Our senior engineering team can integrate custom databases, modify branding, wire custom payment gateways, and configure custom domain DNS.'
    },
    {
      q: 'Do you charge any recurring monthly license fees?',
      a: 'No. All ready-made websites on Smart Developer are one-time purchases with a commercial license for a single production deployment. You own the code without recurring subscription fees.'
    }
  ];

  return (
    <section className="py-20 bg-[#06080D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">Clarity First</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Everything you need to know about purchasing, licensing, and file delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0B0E16] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

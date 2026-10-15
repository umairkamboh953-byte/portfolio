import React from 'react';
import { TestimonialItem } from '../../types/index.js';
import { Star, MessageSquare, Quote, ExternalLink } from 'lucide-react';

interface PortfolioTestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export const PortfolioTestimonialsSection: React.FC<PortfolioTestimonialsSectionProps> = ({
  testimonials = []
}) => {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Verified Client Feedback</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Client Testimonials & Reviews
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Real feedback from founders, agency partners, and businesses who hired me for websites and full-stack software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#0C1019] hover:bg-[#0F1422] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < test.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-6">
                "{test.content}"
              </p>
            </div>

            {/* Client profile */}
            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <img
                src={test.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={test.clientName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{test.clientName}</div>
                <div className="text-[11px] text-slate-400 truncate">
                  {test.clientTitle ? `${test.clientTitle}, ` : ''}{test.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

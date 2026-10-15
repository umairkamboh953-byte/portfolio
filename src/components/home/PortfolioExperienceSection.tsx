import React from 'react';
import { ExperienceItem } from '../../types/index.js';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface PortfolioExperienceSectionProps {
  experience?: ExperienceItem[];
}

export const PortfolioExperienceSection: React.FC<PortfolioExperienceSectionProps> = ({
  experience = []
}) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Professional Background</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experience & Career Milestones
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Track record of architectural leadership, enterprise web applications, and successful digital products.
        </p>
      </div>

      <div className="relative border-l-2 border-white/10 ml-3 sm:ml-4 space-y-10 pl-6 sm:pl-8">
        {experience.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#08090D] border-2 border-cyan-400 ring-4 ring-cyan-500/20 group-hover:scale-125 transition-transform" />

            <div className="p-6 rounded-2xl border border-white/10 bg-[#0C1019] group-hover:bg-[#0F1422] group-hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-cyan-400">{item.company}</div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{item.period}</span>
                    {item.current && (
                      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                {item.description}
              </p>

              {item.skills && item.skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

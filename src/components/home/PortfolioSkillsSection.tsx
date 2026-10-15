import React, { useState } from 'react';
import { SkillItem } from '../../types/index.js';
import { Cpu, Terminal, Database, Cloud, Code, Sparkles, CheckCircle2 } from 'lucide-react';

interface PortfolioSkillsSectionProps {
  skills?: SkillItem[];
}

export const PortfolioSkillsSection: React.FC<PortfolioSkillsSectionProps> = ({ skills = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (skills.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category || 'General')))];

  const filteredSkills =
    activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Code className="w-3.5 h-3.5 text-cyan-400" />;
      case 'backend':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'database':
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'cloud & devops':
      case 'devops':
        return <Cloud className="w-3.5 h-3.5 text-blue-400" />;
      case 'ai & tools':
      case 'ai':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Verified Tech Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Technical Proficiency
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Modern, robust libraries, databases, and deployment infrastructure I use to build scalable products.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0C1019] hover:bg-[#0F1422] hover:border-cyan-500/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  {getCategoryIcon(skill.category || '')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{skill.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{skill.category}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-cyan-400">{skill.level}%</span>
                {skill.years && (
                  <span className="text-[10px] text-slate-500 block font-mono">{skill.years} yrs exp</span>
                )}
              </div>
            </div>

            {/* Proficiency Progress Bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, skill.level))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

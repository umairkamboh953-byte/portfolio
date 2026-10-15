import React, { useState, useEffect } from 'react';
import { X, Shield, Clock, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { PolicyItem } from '../../types/index.js';

interface PolicyModalProps {
  type: string | null;
  onClose: () => void;
  policies?: PolicyItem[];
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose, policies = [] }) => {
  const [activeKey, setActiveKey] = useState<string>('');

  useEffect(() => {
    if (type) {
      setActiveKey(type);
    }
  }, [type]);

  if (!type) return null;

  // Find currently active policy from dynamic policies list, or fallback
  const currentPolicy = policies.find(
    (p) => p.key === activeKey || p.id === activeKey || p.key === type || p.id === type
  ) || policies[0];

  const getIcon = (category?: string, iconName?: string) => {
    const key = (iconName || category || '').toLowerCase();
    if (key.includes('shield') || key.includes('licens') || key.includes('priva')) {
      return <Shield className="w-5 h-5 text-cyan-400" />;
    }
    if (key.includes('clock') || key.includes('deliver') || key.includes('time')) {
      return <Clock className="w-5 h-5 text-blue-400" />;
    }
    if (key.includes('file') || key.includes('refund') || key.includes('term')) {
      return <FileText className="w-5 h-5 text-purple-400" />;
    }
    if (key.includes('check') || key.includes('support') || key.includes('guid')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
    return <HelpCircle className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0D1019] border border-white/10 rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-white/10 bg-[#090C14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
              {getIcon(currentPolicy?.category, currentPolicy?.icon)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {currentPolicy?.title || 'Platform Policy'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                  {currentPolicy?.category || 'Legal'}
                </span>
                {currentPolicy?.updatedAt && (
                  <span>
                    Updated: {new Date(currentPolicy.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Tab Switcher (if multiple policies exist) */}
        {policies.length > 1 && (
          <div className="px-5 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            {policies.map((p) => {
              const active = (p.key === activeKey || p.id === activeKey) || (!activeKey && p === currentPolicy);
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveKey(p.key || p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.title.split(' ')[0]} Policy
                </button>
              );
            })}
          </div>
        )}

        {/* Policy Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {currentPolicy ? (
            <div className="space-y-3 whitespace-pre-line font-sans text-[13px] leading-relaxed text-slate-300">
              {currentPolicy.content}
            </div>
          ) : (
            <p className="text-slate-400">No policy content available.</p>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-white/10 bg-[#090C14] flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-slate-500 font-mono">
            Smart Developer Legal Framework
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

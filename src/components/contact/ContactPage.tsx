import React, { useState } from 'react';
import { PlatformSettings } from '../../types/index.js';
import { api } from '../../services/api.js';
import {
  MessageSquare,
  Mail,
  Send,
  Building,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ContactPageProps {
  settings?: PlatformSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [activeMode, setActiveMode] = useState<'custom_project' | 'general'>('custom_project');

  // Custom project quote form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Ecommerce Custom Store');
  const [budget, setBudget] = useState('PKR 150k – 300k ($500 – $1,000 USD)');
  const [timeline, setTimeline] = useState('2 – 3 Weeks');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const whatsappNumber = settings?.whatsappNumber || '+92 300 1234567';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const contactEmail = settings?.contactEmail || 'sales@marketystudio.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      if (activeMode === 'custom_project') {
        const res = await api.submitCustomRequest({
          name,
          email,
          phone,
          projectType,
          budget,
          timeline,
          message,
        });
        setSuccessMsg(res.message);
      } else {
        const res = await api.submitContact({
          name,
          email,
          phone,
          message,
        });
        setSuccessMsg(res.message);
      }
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to transmit message to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
          Direct Engineering Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Custom Website Projects & Inquiries
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Request a tailored build, enterprise integrations, or consult with our solutions team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info & Direct Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D1018] border border-white/10 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immediate Assistance
            </h3>

            {/* WhatsApp Link Card */}
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Smart%20Developer%20Team%2C%20I%20would%20like%20to%20discuss%20a%20website%20project.`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Chat on WhatsApp
                  </div>
                  <div className="text-[11px] text-slate-400">{whatsappNumber}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${contactEmail}`}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/20 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Official Business Email
                  </div>
                  <div className="text-[11px] text-slate-400">{contactEmail}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>

            {/* Operating Hours */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1">
              <span className="text-slate-400 font-mono text-[11px]">Direct Operating Hours:</span>
              <p className="text-white font-medium">
                {settings?.supportHours || 'Mon – Sat: 9:00 AM – 10:00 PM PKT (UTC+5)'}
              </p>
              <p className="text-[11px] text-slate-400">
                Inquiries outside business hours are answered early next morning.
              </p>
            </div>
          </div>
        </div>

        {/* Lead Capture Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D1018] border border-white/10 space-y-6">
            {/* Form Mode Selector */}
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveMode('custom_project')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeMode === 'custom_project' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Website Quote
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('general')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeMode === 'general' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                General Inquiry
              </button>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {activeMode === 'custom_project' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Website Type</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Ecommerce Custom Store">Ecommerce Store</option>
                        <option value="Corporate Business Portal">Corporate Portal</option>
                        <option value="AI Web Application">AI Web Application</option>
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="Restaurant Online Ordering">Restaurant System</option>
                        <option value="Creative Agency Showcase">Agency Showcase</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Budget Range</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="PKR 80k – 150k ($300 – $550 USD)">PKR 80k – 150k ($300–$550)</option>
                        <option value="PKR 150k – 300k ($550 – $1,100 USD)">PKR 150k – 300k ($550–$1,100)</option>
                        <option value="PKR 300k – 600k ($1,100 – $2,200 USD)">PKR 300k – 600k ($1,100–$2,200)</option>
                        <option value="PKR 600k+ ($2,200+ USD)">PKR 600k+ ($2,200+ USD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Target Deadline</label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="1 – 2 Weeks">Urgent: 1 – 2 Weeks</option>
                        <option value="2 – 4 Weeks">Standard: 2 – 4 Weeks</option>
                        <option value="1 – 2 Months">Flexible: 1 – 2 Months</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {activeMode === 'custom_project' ? 'Project Scope & Required Features *' : 'Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    activeMode === 'custom_project'
                      ? 'Describe your business, required features (e.g. payment gateway, admin portal, database, multi-lingual), and any reference links...'
                      : 'How can our engineering team assist you?'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting to Engineers...' : activeMode === 'custom_project' ? 'Submit Proposal Request' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

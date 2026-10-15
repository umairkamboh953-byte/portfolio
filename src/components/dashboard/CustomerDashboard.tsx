import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';
import { Order } from '../../types/index.js';
import {
  ShoppingBag,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  KeyRound,
  ExternalLink,
  MessageSquare,
  Lock,
  RefreshCw,
  Search
} from 'lucide-react';

export const CustomerDashboard: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { user, updateProfile } = useAuth();
  const { formatPrice } = useCurrency();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs: 'orders' | 'profile' | 'support'
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>('orders');

  // Modal for submitting payment reference on existing order
  const [selectedOrderForRef, setSelectedOrderForRef] = useState<Order | null>(null);
  const [tidInput, setTidInput] = useState('');
  const [submittingRef, setSubmittingRef] = useState(false);

  // Profile edit states
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileCompany, setProfileCompany] = useState(user?.company || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOrders();
      setOrders(res.orders);
    } catch (err: any) {
      setError(err.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        company: profileCompany,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setProfileMsg('Profile updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setProfileMsg(`Error: ${err.message}`);
    }
  };

  const handleSubmitTID = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRef || !tidInput.trim()) return;

    setSubmittingRef(true);
    try {
      await api.submitPaymentReference(selectedOrderForRef.orderNumber, {
        paymentReference: tidInput.trim(),
      });
      setSelectedOrderForRef(null);
      setTidInput('');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Error submitting reference.');
    } finally {
      setSubmittingRef(false);
    }
  };

  const getStatusBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>{status === 'delivered' ? 'DELIVERED' : 'PAID & VERIFIED'}</span>
          </span>
        );
      case 'payment_under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-cyan-300 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            <span>UNDER REVIEW</span>
          </span>
        );
      case 'pending_payment':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>PENDING PAYMENT</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span>{status.toUpperCase()}</span>
          </span>
        );
    }
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
            Customer Account Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your purchased website files, transaction verifications, and download keys.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Purchases ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile & Security
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS & DOWNLOADS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Your Orders & Digital Deliverables</h2>
            <button
              onClick={fetchOrders}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading your purchases...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#0D1018] border border-white/10 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Website Orders Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven't purchased any website templates or custom packages yet.
              </p>
              <button
                onClick={onExplore}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow"
              >
                Explore Marketplace
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const canDownload = ord.paymentStatus === 'paid' || ord.paymentStatus === 'delivered';
                return (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl bg-[#0C0F17] border border-white/10 hover:border-white/20 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.productThumbnail}
                          alt={ord.productName}
                          referrerPolicy="no-referrer"
                          className="w-14 aspect-[4/3] rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-[11px] text-cyan-400 font-mono">
                            Order #{ord.orderNumber} · {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                          <h3 className="text-sm font-bold text-white">{ord.productName}</h3>
                          <div className="text-xs text-slate-400 capitalize">
                            Tier: <strong className="text-slate-200">{ord.selectedPackage}</strong> · Amount: <strong className="text-white font-mono">{ord.currency} {ord.packagePrice.toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-col sm:items-end gap-2">
                        {getStatusBadge(ord.paymentStatus)}
                        <span className="text-[11px] text-slate-400 uppercase font-mono">
                          Method: {ord.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Deliverables Section or Action Required */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      <div>
                        {canDownload ? (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Source Code & Assets Ready for Download</span>
                            </span>
                            <p className="text-[11px] text-slate-400">
                              Payment verified on {new Date(ord.paymentVerifiedAt || ord.updatedAt).toLocaleDateString()}. All files licensed for production.
                            </p>
                          </div>
                        ) : ord.paymentStatus === 'payment_under_review' ? (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Payment Reference Under Verification</span>
                            </span>
                            <p className="text-[11px] text-slate-400">
                              TID: <strong className="font-mono text-white">{ord.paymentReference}</strong>. Files will unlock once verified.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Action Required: Submit Transaction ID</span>
                            </span>
                            <p className="text-[11px] text-slate-400">
                              Complete payment and enter your transaction TID to trigger file release.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Download Buttons or Action Button */}
                      <div className="flex items-center gap-2">
                        {canDownload ? (
                          ord.deliverables.map((deliv) => (
                            <a
                              key={deliv.id}
                              href={`/api/downloads/${ord.orderNumber}/${deliv.id}`}
                              download={deliv.filename}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{deliv.title}</span>
                            </a>
                          ))
                        ) : ord.paymentStatus === 'pending_payment' ? (
                          <button
                            onClick={() => {
                              setSelectedOrderForRef(ord);
                              setTidInput('');
                            }}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                          >
                            Submit TID / Proof
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Verifying...</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#0D1018] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Profile Information & Password</span>
          </h2>

          {profileMsg && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-300 text-xs">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address (Read-only)</label>
              <input
                type="text"
                disabled
                value={user?.email}
                className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-lg text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="font-bold text-white text-xs">Change Password (Optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal for Submitting TID */}
      {selectedOrderForRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0E121B] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Submit Payment Reference for Order {selectedOrderForRef.orderNumber}
            </h3>
            <p className="text-xs text-slate-400">
              Please enter the Transaction ID (TID) from your JazzCash, Easypaisa, or Bank transfer receipt.
            </p>

            <form onSubmit={handleSubmitTID} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Transaction Reference / TID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09182374618"
                  value={tidInput}
                  onChange={(e) => setTidInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForRef(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRef}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  {submittingRef ? 'Submitting...' : 'Submit Reference'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

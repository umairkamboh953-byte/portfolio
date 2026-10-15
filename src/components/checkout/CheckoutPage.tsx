import React, { useState } from 'react';
import { Product, PackageTierKey, PaymentMethod, PlatformSettings, Order } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  CreditCard,
  Building2,
  Smartphone,
  Upload,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  Lock
} from 'lucide-react';

interface CheckoutPageProps {
  product: Product;
  initialPackage?: PackageTierKey;
  settings?: PlatformSettings;
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
  onViewDashboard: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  product,
  initialPackage = 'starter',
  settings,
  onBack,
  onOrderSuccess,
  onViewDashboard,
}) => {
  const { user } = useAuth();
  const { currency, formatPrice } = useCurrency();

  const [selectedPackage, setSelectedPackage] = useState<PackageTierKey>(initialPackage);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Post-order reference submission
  const [trxReference, setTrxReference] = useState('');
  const [receiptFileUrl, setReceiptFileUrl] = useState('');
  const [referenceSubmitted, setReferenceSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculate pricing
  const currentPkg = product.packages[selectedPackage];
  const pkgPrice = currency === 'PKR'
    ? (currentPkg?.pricePKR || product.pricePKR)
    : (currentPkg?.priceUSD || product.priceUSD);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setError('Please provide your full name, email, and phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.checkout({
        productId: product.id,
        selectedPackage,
        currency,
        customerName,
        customerEmail,
        customerPhone,
        customerNotes,
        paymentMethod,
      });

      setCreatedOrder(res.order);
      onOrderSuccess(res.order);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdOrder) return;
    if (!trxReference.trim() && !receiptFileUrl) {
      setError('Please provide either a Transaction ID or receipt screenshot.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitPaymentReference(createdOrder.orderNumber, {
        paymentReference: trxReference,
        receiptUrl: receiptFileUrl,
      });
      setCreatedOrder(res.order);
      setReferenceSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment reference.');
    } finally {
      setLoading(false);
    }
  };

  // Mock receipt upload helper (reads as base64 data url)
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Details</span>
        </button>
      </div>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
          Secure Order Checkout
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          {createdOrder ? `Order Confirmation — ${createdOrder.orderNumber}` : 'Complete Your Purchase'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {createdOrder
            ? 'Your order has been recorded. Complete the manual transfer and submit your reference below.'
            : 'Review selected package tier, provide billing contacts, and select your payment method.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STATE 1: CHECKOUT FORM (BEFORE ORDER CREATION) */}
      {!createdOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCreateOrder} className="space-y-6">
              {/* Package Tier Selection */}
              <div className="p-6 rounded-2xl bg-[#0D1018] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. Choose Package Tier
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['starter', 'professional', 'custom'] as PackageTierKey[]).map((key) => {
                    const isSelected = selectedPackage === key;
                    const pkg = product.packages[key];
                    const price = currency === 'PKR' ? pkg.pricePKR : pkg.priceUSD;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedPackage(key)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 text-white'
                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold capitalize">{key}</div>
                        <div className="text-xs font-mono mt-1 text-cyan-300">
                          {price ? formatPrice(pkg.pricePKR || 0, pkg.priceUSD || 0) : 'Quote'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact & Billing Information */}
              <div className="p-6 rounded-2xl bg-[#0D1018] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. Contact & Billing Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tariq@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Order Notes or Custom Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific instructions for domain linking or server setup..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-6 rounded-2xl bg-[#0D1018] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  3. Select Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* JazzCash */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'jazzcash'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>JazzCash (Pakistan)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Send to Mobile Account 0300-1234567
                      </div>
                    </div>
                  </label>

                  {/* Easypaisa */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'easypaisa'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Easypaisa (Pakistan)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Send to Mobile Account 0345-1234567
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Direct Bank Transfer</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Meezan Bank IBAN / Online Wire
                      </div>
                    </div>
                  </label>

                  {/* International Card */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'international_gateway'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="international_gateway"
                      checked={paymentMethod === 'international_gateway'}
                      onChange={() => setPaymentMethod('international_gateway')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        <span>International Gateway (USD)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Visa / Mastercard / Stripe Wire
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-cyan-200" />
                <span>
                  {loading
                    ? 'Creating Secure Order...'
                    : `Review & Place Order (${currency} ${pkgPrice?.toLocaleString()})`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="flex gap-3 pb-4 border-b border-white/5">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 aspect-[4/3] rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="text-xs text-cyan-400 font-mono">{product.category}</div>
                  <h4 className="text-sm font-bold text-white">{product.name}</h4>
                  <div className="text-xs text-slate-400 capitalize mt-0.5">
                    Tier: <span className="text-white font-medium">{selectedPackage}</span>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Package Base Price</span>
                  <span className="font-mono text-white">
                    {currency} {pkgPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Digital Delivery & Source ZIP</span>
                  <span className="text-emerald-400 font-mono">Included Free</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Single-Site Commercial License</span>
                  <span className="text-emerald-400 font-mono">Verified</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount Due</span>
                  <span className="font-mono text-cyan-400">
                    {currency} {pkgPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-white">Payment Policy:</div>
                <p>
                  Smart Developer verifies payments manually before releasing files. Submitting an order creates a pending transaction. Once approved, source code download links activate immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: ORDER CREATED — MANUAL PAYMENT INSTRUCTIONS & RECEIPT SUBMISSION */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Order Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D111A] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
                  STATUS: {createdOrder.paymentStatus.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Order ID: <strong className="text-white">{createdOrder.orderNumber}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-2">
                {createdOrder.productName} ({createdOrder.selectedPackage.toUpperCase()} Tier)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Amount to transfer: <strong className="text-cyan-400 font-mono text-sm">{createdOrder.currency} {createdOrder.packagePrice.toLocaleString()}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onViewDashboard}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                View in Customer Dashboard
              </button>
            </div>
          </div>

          {/* Payment Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Details Box */}
            <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Official Transfer Instructions</span>
              </h3>

              {createdOrder.paymentMethod === 'jazzcash' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Title:</span>
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{settings?.paymentAccounts.jazzcash.accountTitle || 'MARKETY STUDIO PK'}</span>
                        <button
                          onClick={() => handleCopy(settings?.paymentAccounts.jazzcash.accountTitle || 'MARKETY STUDIO PK', 'jc-title')}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          {copiedKey === 'jc-title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">JazzCash Mobile Number:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-300">
                        <span>{settings?.paymentAccounts.jazzcash.accountNumber || '03001234567'}</span>
                        <button
                          onClick={() => handleCopy(settings?.paymentAccounts.jazzcash.accountNumber || '03001234567', 'jc-num')}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          {copiedKey === 'jc-num' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {settings?.paymentAccounts.jazzcash.instructions}
                  </p>
                </div>
              )}

              {createdOrder.paymentMethod === 'easypaisa' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Title:</span>
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{settings?.paymentAccounts.easypaisa.accountTitle || 'MARKETY STUDIO PK'}</span>
                        <button
                          onClick={() => handleCopy(settings?.paymentAccounts.easypaisa.accountTitle || 'MARKETY STUDIO PK', 'ep-title')}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          {copiedKey === 'ep-title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Easypaisa Number:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-300">
                        <span>{settings?.paymentAccounts.easypaisa.accountNumber || '03451234567'}</span>
                        <button
                          onClick={() => handleCopy(settings?.paymentAccounts.easypaisa.accountNumber || '03451234567', 'ep-num')}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          {copiedKey === 'ep-num' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {settings?.paymentAccounts.easypaisa.instructions}
                  </p>
                </div>
              )}

              {createdOrder.paymentMethod === 'bank_transfer' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bank Name:</span>
                      <span className="font-bold text-white">{settings?.paymentAccounts.bank.bankName || 'Meezan Bank Ltd'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Title:</span>
                      <span className="font-bold text-white">{settings?.paymentAccounts.bank.accountTitle || 'MARKETY STUDIO PK'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">IBAN:</span>
                      <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                        <span>{settings?.paymentAccounts.bank.iban || 'PK45MEZN0001010102938475'}</span>
                        <button
                          onClick={() => handleCopy(settings?.paymentAccounts.bank.iban || 'PK45MEZN0001010102938475', 'bank-iban')}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          {copiedKey === 'bank-iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {createdOrder.paymentMethod === 'international_gateway' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-slate-300">
                    <p className="font-semibold text-white mb-1">International USD Wire / Stripe Link</p>
                    <p className="text-slate-400 text-[11px]">
                      Our international billing team will issue an invoice link to {createdOrder.customerEmail} within 30 minutes, or you can complete via bank wire.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reference & Receipt Submission Form */}
            <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Submit Transaction Proof</span>
              </h3>

              {referenceSubmitted || createdOrder.paymentReference ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reference Submitted for Verification</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Reference ID: <strong className="text-white font-mono">{createdOrder.paymentReference || trxReference}</strong>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Status is now <strong>Payment Under Review</strong>. The admin team will verify the payment and release your downloads shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReference} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Transaction ID / Reference Number (TID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JC-88912903 or TRX-109284"
                      value={trxReference}
                      onChange={(e) => setTrxReference(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Payment Screenshot / Receipt (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                    {receiptFileUrl && (
                      <p className="text-[11px] text-cyan-400 mt-1">✓ Receipt image attached</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
                  >
                    {loading ? 'Submitting Reference...' : 'Submit Payment Proof for Verification'}
                  </button>
                </form>
              )}

              <div className="pt-2 text-[11px] text-slate-400">
                Need urgent confirmation? Message our operations team on WhatsApp at{' '}
                <strong className="text-white">{settings?.whatsappNumber || '+92 300 1234567'}</strong> with Order #{createdOrder.orderNumber}.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

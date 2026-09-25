import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress } from '../types';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Banknote,
  MessageCircle,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendToWhatsApp, generateOrderWhatsAppMessage, getMerchantWhatsAppPhone, MERCHANT_DISPLAY_PHONE } from '../utils/whatsapp';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartGrandTotal,
    appliedCoupon,
    placeOrder,
    setActiveView,
    formatPrice,
    currentUser,
    currency,
    merchantWhatsAppPhone,
    merchantUpiId,
    merchantUpiQrImage,
    merchantUpiName,
    codSettings
  } = useStore();

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: currentUser?.name ? currentUser.name.split(' ')[0] : '',
    lastName: currentUser?.name ? (currentUser.name.split(' ').slice(1).join(' ') || '') : '',
    email: currentUser?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'credit_card' | 'apple_pay' | 'upi' | 'cash_on_delivery'>(
    codSettings?.enabled ? 'cash_on_delivery' : 'upi'
  );
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Active Merchant UPI & COD values
  const activeUpiId = merchantUpiId || 'ulef.luxury@okhdfcbank';
  const activeUpiName = merchantUpiName || 'ULEF LUXURY';
  const activeWhatsApp = merchantWhatsAppPhone || getMerchantWhatsAppPhone();

  // Amount in INR for UPI QR
  const codFeeInStoreCurrency = codSettings?.extraFee ? (currency === 'INR' ? codSettings.extraFee : Math.round(codSettings.extraFee / 86.5)) : 0;
  const effectiveGrandTotal = cartGrandTotal + (paymentMethod === 'cash_on_delivery' ? codFeeInStoreCurrency : 0);
  const amountInINR = Math.round(currency === 'INR' ? effectiveGrandTotal : effectiveGrandTotal * 86.5);
  
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activeUpiName)}&am=${amountInINR}&cu=INR&tn=ULEF%20Order`;
  const upiQrGeneratedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiIntentUri)}`;
  // If merchant uploaded their own custom QR code image, use it! Otherwise use dynamic generator
  const activeQrCodeUrl = merchantUpiQrImage || upiQrGeneratedUrl;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white">
          NO ITEMS TO CHECKOUT
        </h2>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-6 px-8 py-3.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const paymentStatus = paymentMethod === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : paymentMethod === 'whatsapp'
      ? 'Pending WhatsApp Confirmation'
      : paymentMethod === 'upi'
      ? (upiUtr.trim() ? `Paid via UPI (UTR: ${upiUtr.trim()})` : 'Pending UPI Verification')
      : 'Paid';

    const newOrder = placeOrder({
      items: cart,
      shippingAddress: formData,
      billingSameAsShipping,
      paymentMethod,
      paymentStatus: paymentStatus as any,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartShippingFee + (paymentMethod === 'cash_on_delivery' ? codFeeInStoreCurrency : 0),
      tax: cartTax,
      total: effectiveGrandTotal,
      status: 'Processing',
    });

    // Direct WhatsApp message trigger for Cash on Delivery, WhatsApp orders, and UPI orders!
    if (paymentMethod === 'cash_on_delivery' || paymentMethod === 'whatsapp' || paymentMethod === 'upi') {
      sendToWhatsApp(generateOrderWhatsAppMessage(newOrder, formatPrice), activeWhatsApp);
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            256-BIT ENCRYPTED CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
            EXPRESS LUXURY CHECKOUT
          </h1>
        </div>

        <button
          onClick={() => setActiveView('cart')}
          className="text-xs font-mono text-neutral-500 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Bag
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Contact, Shipping, Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Contact Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center text-xs font-mono">1</span>
              <span>Contact & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">First Name (Naam)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">WhatsApp Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9316614778 / 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Street Address (Ghar / Flat No. & Area)</label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="House / Flat No., Building, Street Name, Landmark"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">State / Province</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Country</label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-mono"
              >
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
                <option value="India">India</option>
                <option value="Canada">Canada</option>
                <option value="France">France</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="w-4 h-4 rounded text-neutral-950 accent-neutral-950 dark:accent-white"
                />
                <span>Billing address is identical to shipping address</span>
              </label>
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center text-xs font-mono">2</span>
              <span>Secure Payment Method</span>
            </h3>

            {/* Payment Radios */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('whatsapp')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 relative overflow-hidden ${
                  paymentMethod === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-500/10 text-neutral-950 dark:text-white shadow-sm ring-1 ring-emerald-500'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    Direct
                  </span>
                </div>
                <span className="text-xs font-mono font-bold">WhatsApp Order</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'credit_card'
                    ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'apple_pay'
                    ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">Apple / Google</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'upi'
                    ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">Instant UPI</span>
              </button>

              {codSettings?.enabled !== false && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Banknote className="w-5 h-5 text-amber-500" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold uppercase">
                      COD
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold">Cash on Delivery</span>
                </button>
              )}
            </div>

            {/* Cash on Delivery Description Card */}
            {paymentMethod === 'cash_on_delivery' && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-neutral-900 dark:text-amber-200 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 text-sm">
                    <Banknote className="w-5 h-5" />
                    <span>Cash on Delivery (Ghar Par Cash De Sakte Hain)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 uppercase">
                    COD Active
                  </span>
                </div>
                
                {codFeeInStoreCurrency > 0 && (
                  <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold flex items-center justify-between">
                    <span>COD Convenience & Handling Fee:</span>
                    <span>+{formatPrice(codFeeInStoreCurrency)}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <p className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct WhatsApp Notification:</strong> Jaise hi aap <strong>"Place COD Order"</strong> par click karenge, direct store owner ko WhatsApp (+{activeWhatsApp}) par message jayega ki <strong>kis bande ne order kiya hai aur kahan se order kiya hai (pura delivery address)</strong>.
                    </span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Truck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Delivery courier jab aapke ghar parcel layega, tab aapko <strong>{formatPrice(effectiveGrandTotal)}</strong> cash dena hoga.
                    </span>
                  </p>
                  {codSettings?.customNote && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 italic pt-1">
                      ℹ️ {codSettings.customNote}
                    </p>
                  )}
                </div>
                {formData.addressLine1 && (
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/40 border border-amber-500/20 text-[10px] space-y-0.5">
                    <span className="font-bold uppercase text-neutral-500">Delivery Address:</span>
                    <p className="text-neutral-950 dark:text-white truncate">
                      {formData.addressLine1}, {formData.city}, {formData.state} - {formData.postalCode}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Instant UPI & Dynamic/Custom QR Code Card */}
            {paymentMethod === 'upi' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-950 dark:text-white text-sm">
                    <QrCode className="w-5 h-5 text-amber-500" />
                    <span>Instant UPI / QR Code Payment (0% Gateway Fees)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Instant Bank Transfer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Dynamic or Custom Uploaded QR Code */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <div className="relative group">
                      <img
                        src={activeQrCodeUrl}
                        alt="Store UPI QR Code"
                        className="w-44 h-44 object-contain rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 bg-white p-1"
                      />
                      {merchantUpiQrImage && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-600 text-white text-[8px] font-bold uppercase rounded shadow">
                          Merchant QR
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-wider">
                      Scan to Pay ₹{amountInINR}
                    </span>
                    <span className="text-[9px] text-neutral-400">
                      GPay • PhonePe • Paytm • BHIM
                    </span>
                  </div>

                  {/* UPI Details & Mobile Intent */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-neutral-400 uppercase">Store UPI ID</span>
                        <span className="text-[10px] text-neutral-500 font-bold">{activeUpiName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-950 dark:text-white flex-1 truncate">
                          {activeUpiId}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUpiId}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block mb-1">Mobile Fast Pay (Tap to Open)</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <a
                          href={upiIntentUri}
                          className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-center hover:border-amber-400 transition-colors"
                        >
                          Google Pay
                        </a>
                        <a
                          href={upiIntentUri}
                          className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-center hover:border-amber-400 transition-colors"
                        >
                          PhonePe
                        </a>
                        <a
                          href={upiIntentUri}
                          className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-center hover:border-amber-400 transition-colors"
                        >
                          Paytm
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                        Transaction UTR / Reference No. (Payment ke baad)
                      </label>
                      <input
                        type="text"
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value)}
                        placeholder="e.g. 12-digit UTR (423891823901)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Description Card */}
            {paymentMethod === 'whatsapp' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-neutral-800 dark:text-emerald-200 space-y-2 mt-4">
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Order Dispatch ({MERCHANT_DISPLAY_PHONE})</span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Aapka pura order receipt, t-shirt details (naam, size, quantity, price), aur delivery address directly WhatsApp par forward ho jayega instant confirmation aur delivery updates ke liye.
                </p>
              </div>
            )}

            {/* Credit Card Input Sub-fields */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3 mt-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8920 1289 4242"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Security Code (CVV)</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                You will authorize with Face ID / Touch ID upon placing the order.
              </div>
            )}
          </div>
        </div>

        {/* Right Form: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-6">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-white pb-4 border-b border-neutral-800">
              REVIEW ORDER ({cart.length} SILHOUETTES)
            </h3>

            {/* Cart preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.selectedColor.image || item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      {item.selectedSize} • {item.selectedColor.name} × {item.quantity}
                    </p>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs font-mono pt-4 border-t border-neutral-800">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>DHL / Shiprocket Delivery</span>
                <span className="text-white">{cartShippingFee === 0 ? 'FREE' : formatPrice(cartShippingFee)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Tax</span>
                <span className="text-white">{formatPrice(cartTax)}</span>
              </div>
              <div className="pt-4 border-t border-neutral-800 flex justify-between text-base font-bold">
                <span className="font-display uppercase tracking-wider">Total Due</span>
                <span className="text-white font-mono text-xl">{formatPrice(effectiveGrandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 cursor-pointer ${
                paymentMethod === 'cash_on_delivery'
                  ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-400/20'
                  : paymentMethod === 'whatsapp' || paymentMethod === 'upi'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2 font-mono">
                  <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  {paymentMethod === 'cash_on_delivery'
                    ? 'Confirming COD & Dispatching to WhatsApp...'
                    : paymentMethod === 'whatsapp'
                    ? 'Opening WhatsApp Concierge...'
                    : 'Authorizing Order...'}
                </span>
              ) : paymentMethod === 'cash_on_delivery' ? (
                <>
                  <Banknote className="w-4 h-4 text-neutral-950" />
                  <span>Place COD Order & Send to WhatsApp • {formatPrice(effectiveGrandTotal)}</span>
                </>
              ) : paymentMethod === 'upi' ? (
                <>
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Confirm UPI Order & Send to WhatsApp • {formatPrice(effectiveGrandTotal)}</span>
                </>
              ) : paymentMethod === 'whatsapp' ? (
                <>
                  <MessageCircle className="w-4 h-4 text-neutral-950" />
                  <span>Send Order via WhatsApp • {formatPrice(effectiveGrandTotal)}</span>
                </>
              ) : (
                <>
                  <span>Place Order • {formatPrice(effectiveGrandTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Complimentary 14-Day Exchanges & Returns</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

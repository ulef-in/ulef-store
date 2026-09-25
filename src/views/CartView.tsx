import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Truck,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { sendToWhatsApp, getWhatsAppUrl, generateCartWhatsAppMessage } from '../utils/whatsapp';

export const CartView: React.FC = () => {
  const {
    cart,
    cartTotalCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartGrandTotal,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
    formatPrice
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 mx-auto flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white">
          YOUR SHOPPING BAG IS EMPTY
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
          Explore Drop 04 architectural silhouettes in 240 GSM heavyweight combed cotton.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-8 px-8 py-4 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors"
        >
          Explore Drop 04 Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            YOUR CURATED BAG
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
            SHOPPING BAG ({cartTotalCount} ITEMS)
          </h1>
        </div>

        <button
          onClick={() => setActiveView('shop')}
          className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Browsing
        </button>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-medium">
            <Truck className="w-4 h-4 text-amber-500" />
            {remainingForFreeShipping === 0 ? (
              <strong className="text-emerald-500 font-bold">Complimentary Global Express Shipping Unlocked!</strong>
            ) : (
              <span>Add <strong className="text-neutral-950 dark:text-white">{formatPrice(remainingForFreeShipping)}</strong> more for Free Worldwide Express</span>
            )}
          </span>
          <span className="text-neutral-500 font-bold">{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Item List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              {/* Product Thumbnail */}
              <div className="w-24 h-32 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shrink-0">
                <img
                  src={item.selectedColor.image || item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold font-display uppercase tracking-tight text-neutral-950 dark:text-white">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    <span>Size: <strong className="text-neutral-950 dark:text-white">{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-700 inline-block"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.name}
                    </span>
                    <span>•</span>
                    <span>{item.product.gsm} GSM</span>
                  </div>
                </div>

                {/* Bottom Quantity and Price */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 p-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-mono text-xs font-bold text-neutral-950 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-mono font-bold text-neutral-950 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-6">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-white pb-4 border-b border-neutral-800">
              ORDER SUMMARY
            </h3>

            {/* Coupon input */}
            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Tag className="w-4 h-4" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-neutral-400 hover:text-white underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo Code (e.g. ULEF10)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-bold uppercase transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Line item breakdown */}
            <div className="space-y-2.5 text-xs font-mono">
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
                <span>Shipping</span>
                <span className="text-white">
                  {cartShippingFee === 0 ? 'FREE EXPRESS' : formatPrice(cartShippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Sales Tax (8%)</span>
                <span className="text-white">{formatPrice(cartTax)}</span>
              </div>
              <div className="pt-4 border-t border-neutral-800 flex justify-between text-base font-bold">
                <span className="font-display uppercase tracking-wider">Grand Total</span>
                <span className="text-white font-mono text-lg">{formatPrice(cartGrandTotal)}</span>
              </div>
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => setActiveView('checkout')}
              className="w-full py-4 px-6 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-xl cursor-pointer"
            >
              <span>Proceed To Luxury Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Checkout Button */}
            <a
              href={getWhatsAppUrl(generateCartWhatsAppMessage(cart, cartGrandTotal, formatPrice))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Bag Order</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted • 14-Day Free Global Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

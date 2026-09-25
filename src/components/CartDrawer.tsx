import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
  Truck,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendToWhatsApp, getWhatsAppUrl, generateCartWhatsAppMessage } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-neutral-900 text-white shadow-2xl border-l border-neutral-800 flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                SHOPPING BAG ({cartTotalCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-neutral-950/80 border-b border-neutral-800/80">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Truck className="w-4 h-4 text-amber-400" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-400 font-bold">Free Worldwide Express Shipping Unlocked!</strong>
                ) : (
                  <span>Add <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> for Free Express</span>
                )}
              </span>
              <span className="text-neutral-400 text-[11px]">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-neutral-800/60">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-26 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                      <img
                        src={item.selectedColor.image || item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold font-display line-clamp-1 text-white">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs font-mono text-neutral-400">
                          <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-neutral-600 inline-block"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        </div>

                        <div className="mt-1 text-[11px] font-mono text-neutral-500">
                          {item.product.gsm} GSM Compact Cotton
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-800/80 p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-mono font-bold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold font-display text-white">
                  Your shopping bag is empty
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Explore Drop 04 architectural silhouettes in 240 GSM heavyweight cotton.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider font-display hover:bg-neutral-200 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-neutral-950 border-t border-neutral-800 space-y-4">
              {/* Promo code input */}
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-white text-xs underline font-mono"
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
                    placeholder="Promo code (e.g. ULEF10)"
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold uppercase transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
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
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white">{formatPrice(cartTax)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold">
                  <span className="text-white font-display uppercase tracking-wider">Estimated Total</span>
                  <span className="text-white font-mono text-base">{formatPrice(cartGrandTotal)}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
              >
                <span>Proceed To Luxury Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick WhatsApp Order Button */}
              <a
                href={getWhatsAppUrl(generateCartWhatsAppMessage(cart, cartGrandTotal, formatPrice))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick WhatsApp Order</span>
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted 256-Bit SSL Checkout • Free Returns</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

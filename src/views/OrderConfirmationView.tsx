import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Download,
  Copy,
  Calendar,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getWhatsAppUrl, generateOrderWhatsAppMessage } from '../utils/whatsapp';

export const OrderConfirmationView: React.FC = () => {
  const { lastPlacedOrder, setActiveView, formatPrice, showToast } = useStore();

  const order = lastPlacedOrder;
  const whatsappUrl = order ? getWhatsAppUrl(generateOrderWhatsAppMessage(order, formatPrice)) : '';

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold font-display uppercase text-neutral-950 dark:text-white">
          No Recent Order Found
        </h2>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-6 px-6 py-3 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    showToast('Copied!', 'Tracking number copied to clipboard.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Confirmation Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold">
          {order.paymentMethod === 'cash_on_delivery' ? '💵 CASH ON DELIVERY PLACED' : 'PAYMENT CONFIRMED'} • ORDER #{order.id}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          {order.paymentMethod === 'cash_on_delivery' ? (
            <>
              Aapka Cash on Delivery order receive ho gaya hai! Delivery partner (Shiprocket/Delhivery) doorstep par aane par aapko <strong>{formatPrice(order.total)}</strong> pay karna hoga.
            </>
          ) : (
            <>
              We have begun preparing your Drop 04 heavyweight silhouettes. A confirmation email has been dispatched to <strong className="text-neutral-950 dark:text-white">{order.shippingAddress.email}</strong>.
            </>
          )}
        </p>
      </div>

      {/* Tracking Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
          <div>
            <div className="text-xs font-mono text-neutral-400 uppercase">Express Courier</div>
            <div className="text-lg font-bold font-display text-white mt-0.5">{order.carrier}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs text-amber-400 font-bold">
              {order.trackingNumber}
            </div>
            <button
              onClick={handleCopyTracking}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Copy tracking code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-neutral-500 uppercase block mb-1">Estimated Arrival</span>
            <strong className="text-white text-sm">{order.estimatedDelivery}</strong>
          </div>
          <div>
            <span className="text-neutral-500 uppercase block mb-1">Payment Method</span>
            <strong className="text-white text-sm capitalize">{order.paymentMethod.replace('_', ' ')} ({order.paymentStatus})</strong>
          </div>
          <div>
            <span className="text-neutral-500 uppercase block mb-1">Total Paid</span>
            <strong className="text-white text-sm">{formatPrice(order.total)}</strong>
          </div>
        </div>

        {/* Purchased items list */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-neutral-400">
            Purchased Silhouettes
          </h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <img
                  src={item.selectedColor.image || item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-12 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                />
                <div>
                  <span className="font-bold text-white block">{item.product.name}</span>
                  <span className="text-neutral-400 text-[11px]">
                    Size: {item.selectedSize} • {item.selectedColor.name} × {item.quantity}
                  </span>
                </div>
              </div>
              <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Destination Address */}
        <div className="pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
          <span className="text-neutral-500 uppercase block mb-1">Delivery Destination</span>
          <p className="text-white">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName} • {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        {/* WhatsApp Notification Banner */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">WhatsApp Direct Order Transmission</span>
              <span className="text-neutral-300 text-[11px]">Send order summary and delivery slip to our team on WhatsApp for instant confirmation.</span>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Open in WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-neutral-950" />
          <span>Send Order on WhatsApp</span>
        </a>

        <button
          onClick={() => setActiveView('order-tracking')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Track Live Progress</span>
        </button>

        <button
          onClick={() => setActiveView('shop')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 font-bold font-display uppercase tracking-wider text-xs transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

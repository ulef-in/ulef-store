import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, formatPrice, setActiveView } = useStore();
  const [searchInput, setSearchInput] = useState(orders[0]?.id || 'ULF-89231');
  const [activeOrder, setActiveOrder] = useState(orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean);
    if (found) {
      setActiveOrder(found);
    } else if (orders.length > 0) {
      setActiveOrder(orders[0]);
    }
  };

  const steps = [
    { title: 'Order Confirmed', description: 'Payment authorized & order logged in atelier system.' },
    { title: 'Cutting & QC', description: 'Heavyweight density verification & craftsmanship inspection.' },
    { title: 'Packed', description: 'Packaged in matte recyclable luxury presentation box.' },
    { title: 'Shipped', description: 'Dispatched via DHL Express Worldwide courier.' },
    { title: 'Delivered', description: 'Delivered to your doorstep.' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'Processing') return 0;
    if (status === 'Cutting & QC') return 1;
    if (status === 'Packed') return 2;
    if (status === 'Shipped' || status === 'Out for Delivery') return 3;
    if (status === 'Delivered') return 4;
    return 0;
  };

  const currentStepIndex = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
          ATELIER FULFILLMENT TRACKER
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
          TRACK YOUR SHIPMENT
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Enter your ULEF Order Number (e.g. ULF-89231) or DHL Express tracking code to view real-time transit logs.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Order ID (e.g. ULF-89231)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-mono text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors"
        >
          Track
        </button>
      </form>

      {/* Quick selectable sample orders */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 overflow-x-auto no-scrollbar">
          <span>Recent orders:</span>
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => {
                setSearchInput(o.id);
                setActiveOrder(o);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                activeOrder?.id === o.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-transparent font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {o.id} ({o.status})
            </button>
          ))}
        </div>
      )}

      {/* Order Status Display */}
      {activeOrder ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-8">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white">
                  ORDER #{activeOrder.id}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400 text-neutral-950 uppercase">
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Courier: {activeOrder.carrier} • Tracking Code: <strong className="text-white">{activeOrder.trackingNumber}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-neutral-500 text-xs block">Estimated Delivery</span>
              <strong className="text-white text-sm">{activeOrder.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-4">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-800 hidden md:block">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.title} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all z-10 ${
                          isCurrent
                            ? 'bg-amber-400 text-neutral-950 ring-4 ring-amber-400/20 scale-110'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="text-left md:text-center">
                        <div className={`text-xs font-bold font-display uppercase tracking-wider ${
                          isCompleted ? 'text-white' : 'text-neutral-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5 leading-tight max-w-[140px] md:mx-auto">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Status Logs */}
          <div className="pt-6 border-t border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-neutral-400">
              Transit Log History
            </h4>
            <div className="space-y-2 font-mono text-xs">
              {activeOrder.statusHistory.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-bold text-white block">{h.status}</span>
                    <span className="text-neutral-400 text-[11px]">{h.description}</span>
                  </div>
                  <span className="text-neutral-500 text-[11px] shrink-0">{h.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Package items */}
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-neutral-400 mb-3">
              Items in this Package
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeOrder.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
                  <img
                    src={item.selectedColor.image || item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 rounded-lg object-cover bg-neutral-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white truncate block">{item.product.name}</span>
                    <span className="text-neutral-400 text-[11px]">
                      Size: {item.selectedSize} • {item.selectedColor.name} (Qty: {item.quantity})
                    </span>
                    <span className="text-neutral-300 font-bold block mt-0.5">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-neutral-500 text-xs font-mono">
          No order details matched this ID. Try searching "ULF-89231".
        </div>
      )}
    </div>
  );
};

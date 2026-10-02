import React, { useState } from 'react';
import { useStore, ViewType } from '../context/StoreContext';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Feather, MessageCircle, Mail, Phone, Clock, Lock } from 'lucide-react';
import { MERCHANT_DISPLAY_PHONE, SUPPORT_EMAIL, getSupportWhatsAppUrl } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const { setActiveView, showToast, currentUser, isAdminAuthenticated, addVipSubscriber } = useStore();
  const [newsletterContact, setNewsletterContact] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterContact) return;
    // If digits present, add to VIP WhatsApp list
    const digits = newsletterContact.replace(/[^0-9]/g, '');
    if (digits.length >= 10) {
      addVipSubscriber(currentUser?.name || 'VIP Member', digits);
    }
    setIsSubscribed(true);
    showToast('VIP Privilege Unlocked!', 'Use promo code "ULEF10" for 10% off. You will receive exclusive drop alerts on WhatsApp!', 'success');
  };

  const navLinks: { label: string; view: ViewType }[] = [
    { label: 'Drop 04 Catalog', view: 'shop' },
    { label: 'Lookbook Archive', view: 'lookbook' },
    { label: 'Atelier Story', view: 'about' },
    { label: 'Live Order Tracker', view: 'order-tracking' },
    { label: 'Curated Wishlist', view: 'wishlist' },
    { label: 'Concierge & Contact', view: 'contact' },
  ];

  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800 transition-colors">
      {/* Brand Value Propositions Bar */}
      <div className="border-b border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-neutral-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                240 GSM HEAVYWEIGHT
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Sculpted drop-shoulder silhouette with zero side-seams.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                ANTI-BACON COLLAR
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                1.25" double-ribbed collar with elastane memory recovery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                EXPRESS GLOBAL DELIVERY
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Dispatched in 24h with tracked luxury packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                7-DAY EASY RETURNS
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Hassle-free size exchange and returns within 7 days of delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Manifesto column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-display tracking-tight text-white">
                ULEF<span className="text-neutral-500">.IN</span>
              </span>
            </div>
            <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              240 GSM HEAVYWEIGHT OVERSIZED ATELIER
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We engineer uncompromising heavyweight streetwear essentials. Crafted with high-density 240 GSM compact cotton, tailored drop shoulders, and architectural cuts designed to withstand time.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400 font-mono flex-wrap">
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
                240 GSM COTTON
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
                ANTI-BACON COLLAR
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
                PRE-SHRUNK
              </span>
            </div>
          </div>

          {/* Customer Support Desk (As Requested by User) */}
          <div className="md:col-span-3 space-y-4 p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">
                CUSTOMER SUPPORT
              </h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Have queries about sizing, delivery, or custom orders? Reach us directly:
            </p>

            <div className="space-y-3 pt-1 text-xs font-mono">
              {/* Support Email */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Support Email</span>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-bold group"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="break-all">{SUPPORT_EMAIL}</span>
                </a>
              </div>

              {/* WhatsApp Support Number */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Official WhatsApp</span>
                <a
                  href={getSupportWhatsAppUrl('Direct Customer Support')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md group cursor-pointer w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 fill-white" />
                  <span>Chat: {MERCHANT_DISPLAY_PHONE}</span>
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                <Clock className="w-3 h-3" />
                <span>24/7 Digital Concierge Desk</span>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-0.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Atelier & Dispatch Hub</span>
                <span className="text-white block">Modasa, Aravalli District, Gujarat — 383315, India</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-neutral-300">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => setActiveView(item.view)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-neutral-500 hover:text-amber-400 font-mono text-[11px] transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-neutral-500" />
                  <span>{isAdminAuthenticated ? 'Admin Panel (Unlocked)' : 'Owner / Admin Portal'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* VIP Newsletter column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-neutral-300">
              JOIN THE CIRCLE
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Subscribe for private 240 GSM drops and receive 10% off with code <strong className="text-white">ULEF10</strong>.
            </p>

            {isSubscribed ? (
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3 text-xs text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-white">Privilege code unlocked:</div>
                  <div className="font-mono text-amber-400 font-bold text-sm tracking-wider">
                    ULEF10
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={newsletterContact}
                    onChange={(e) => setNewsletterContact(e.target.value)}
                    placeholder="Enter WhatsApp Number or Email"
                    required
                    className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center justify-center font-bold cursor-pointer"
                    aria-label="Subscribe to WhatsApp VIP drop alerts"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-neutral-500 block">
                  Get instant private 240 GSM drop alerts on WhatsApp.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div>
            © {new Date().getFullYear()} ULEF.IN Atelier Corp. All rights reserved. • Support: {SUPPORT_EMAIL}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              WHATSAPP DIRECT
            </span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              UPI
            </span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              COD
            </span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              CARDS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

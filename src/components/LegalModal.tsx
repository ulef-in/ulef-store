import React, { useEffect } from 'react';
import { useStore, LegalPolicyType } from '../context/StoreContext';
import { X, ShieldCheck, FileText, Truck, Scale, Mail, Phone, MapPin, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MERCHANT_DISPLAY_PHONE, SUPPORT_EMAIL, getSupportWhatsAppUrl } from '../utils/whatsapp';

export const LegalModal: React.FC = () => {
  const { legalPolicy, openLegalPolicy } = useStore();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        openLegalPolicy(null);
      }
    };
    if (legalPolicy) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [legalPolicy, openLegalPolicy]);

  if (!legalPolicy) return null;

  const tabs: { id: NonNullable<LegalPolicyType>; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'PRIVACY POLICY (DPDP)', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terms', label: 'TERMS OF SERVICE', icon: <FileText className="w-4 h-4" /> },
    { id: 'shipping', label: 'SHIPPING & 7-DAY RETURNS', icon: <Truck className="w-4 h-4" /> },
    { id: 'contact', label: 'LEGAL & GRIEVANCE', icon: <Scale className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => openLegalPolicy(null)}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                  ULEF ATELIER • LEGAL COMPLIANCE
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wider text-white">
                  ATELIER STATUTORY POLICIES
                </h3>
              </div>
            </div>

            <button
              onClick={() => openLegalPolicy(null)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 px-4 py-2.5 bg-neutral-900/60 border-b border-neutral-800 overflow-x-auto scrollbar-none font-mono text-xs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => openLegalPolicy(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-bold cursor-pointer ${
                  legalPolicy === tab.id
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed font-mono">
            {/* 1. PRIVACY POLICY */}
            {legalPolicy === 'privacy' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Digital Personal Data Protection (DPDP) Act, 2023 Compliance</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    ULEF Atelier operates in strict compliance with the Digital Personal Data Protection Act (DPDP Act, 2023) of India. We enforce absolute privacy, zero unauthorized third-party commercial exploitation, and minimal data collection principles.
                  </p>
                </div>

                <div className="space-y-4 text-neutral-300">
                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      1. Scope & Purpose of Personal Data Collection
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      We collect customer personal identifiers (including Full Name, WhatsApp Mobile Number, Delivery Address, Email Address, and PIN Code) <strong>strictly and exclusively</strong> for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
                      <li>Order confirmation, payment verification, and GST-compliant invoice issuance.</li>
                      <li>Nationwide delivery dispatch via certified logistics partners (Shiprocket, Bluedart, Delhivery).</li>
                      <li>Live parcel tracking notifications and direct customer support communication via official WhatsApp.</li>
                    </ul>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      2. Strict No-Sale & Confidentiality Commitment
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Your personal contact number, address, and purchase records are <strong>never sold, leased, rented, or bartered</strong> to external marketing brokers, advertising networks, or unauthorized third parties. Access to order data is strictly partitioned and restricted to authorized atelier dispatch staff.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      3. Data Retention & Your Statutory Rights (Right to Erase / Correct)
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      In accordance with Indian DPDP Act provisions, you retain the statutory right to request access to, rectification of, or complete deletion of your customer account profile and non-statutory order records. To exercise these rights, email our Grievance Desk at <strong className="text-white">{SUPPORT_EMAIL}</strong>.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      4. Secure Transaction Processing
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      We do not store complete credit card or debit card numbers on our servers. All digital payments (UPI, Cards, NetBanking) are routed via RBI-authorized payment gateways with 256-bit SSL encryption.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {/* 2. TERMS OF SERVICE */}
            {legalPolicy === 'terms' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <FileText className="w-4 h-4" />
                    <span>Terms & Conditions of Drop Purchases</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    By browsing ulef.in or placing an order, you agree to these Terms of Service governing product allocations, pricing strikethroughs, and atelier drop timelines.
                  </p>
                </div>

                <div className="space-y-4 text-neutral-300">
                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      1. Limited Drop Model & Allocation Limits
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      All ULEF garments are produced in numbered, limited heavyweight batches (e.g. Drop 04). Adding an item to the shopping cart does not reserve inventory until order confirmation and authorization is finalized.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      2. Transparent Pricing & Strikethroughs
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      All prices are denominated in Indian Rupees (INR ₹) inclusive of applicable taxes. Slashed original prices indicate standard atelier retail value or post-drop pricing. We reserve the right to correct typographical or system pricing errors prior to order dispatch with customer notification.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      3. Cash on Delivery (COD) Anti-Fraud Verification
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      To prevent artificial inventory locking and malicious fake bookings, all Cash on Delivery orders require telephone or automated WhatsApp verification before physical parcel dispatch. Orders with unreachable phone numbers or unverified addresses are subject to cancellation.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      4. Intellectual Property & Brand Rights
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      All textile patterns, graphic typography, lookbook photography, website design, and proprietary 240 GSM architectural cuts are exclusive trademarks and copyrighted assets of ULEF Atelier. Unauthorized commercial reproduction or counterfeit production will be prosecuted under Indian copyright law.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {/* 3. SHIPPING & 7-DAY RETURNS POLICY */}
            {legalPolicy === 'shipping' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Official 7-Day Replacement & Exchange Policy</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    We stand behind our 240 GSM heavyweight garments. If your size isn't absolute perfection, our 7-day policy has you covered.
                  </p>
                </div>

                <div className="space-y-4 text-neutral-300">
                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      1. Dispatch & Delivery Timelines
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
                      <li><strong>Atelier Dispatch:</strong> All orders are processed, quality-checked, and dispatched within <strong>48 hours</strong> of placement.</li>
                      <li><strong>Delivery Window:</strong> Nationwide express delivery takes <strong>4 to 7 business days</strong> across India via partner couriers (Shiprocket, Bluedart, Delhivery).</li>
                      <li><strong>Live Tracking:</strong> Real-time tracking link is transmitted via SMS/WhatsApp as soon as your shipment manifest is generated.</li>
                    </ul>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      2. 7-Day Exchange & Replacement Window
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Our replacement and size exchange window is strictly valid for <strong>7 days from the confirmed date of delivery</strong>. Eligible claims include:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
                      <li><strong>Sizing Mismatch:</strong> Swap for a larger or smaller size in the same silhouette (first exchange is complimentary).</li>
                      <li><strong>Transit Damage:</strong> Parcel crushed or compromised during courier transit.</li>
                      <li><strong>Fabric / Print Defect:</strong> Any manufacturing imperfection in the 240 GSM knit or screenprint.</li>
                    </ul>
                    <p className="text-[11px] text-amber-400 mt-1">
                      <em>*Note: Recording a continuous, uncut unboxing video upon opening your courier parcel is strongly recommended to expedite instant claim approvals.</em>
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      3. Garment Eligibility Conditions
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      To qualify for exchange or replacement:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
                      <li>Item must be <strong>unworn, unwashed, and odor-free</strong>.</li>
                      <li>Original atelier tags, barcode labels, and presentation box must accompany the garment.</li>
                    </ul>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                      4. How to Initiate an Exchange
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Simply message our official WhatsApp concierge at <strong className="text-white">{MERCHANT_DISPLAY_PHONE}</strong> with your Order ID (e.g. ULF-89231) or email <strong className="text-white">{SUPPORT_EMAIL}</strong>. Our logistics team will arrange a doorstep reverse pickup.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {/* 4. LEGAL IDENTITY & GRIEVANCE */}
            {legalPolicy === 'contact' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <Scale className="w-4 h-4" />
                    <span>Statutory Legal Identity & Grievance Redressal</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Compliant with Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act of India.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
                      Legal Business Entity
                    </span>
                    <strong className="text-white text-sm block">ULEF Atelier</strong>
                    <span className="text-xs text-neutral-400 block">
                      Architectural Heavyweight Streetwear Manufacturing & Direct-to-Consumer Atelier
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
                      Atelier Dispatch & Registered Hub
                    </span>
                    <div className="flex items-start gap-1.5 text-xs text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Modasa, Aravalli District, Gujarat — 383315, India</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
                      Support & Statutory Grievance Email
                    </span>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{SUPPORT_EMAIL}</span>
                    </a>
                    <span className="text-[11px] text-neutral-500 block">
                      Acknowledgement within 48 hours; resolution within 14 business days.
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
                      Official Customer WhatsApp
                    </span>
                    <a
                      href={getSupportWhatsAppUrl('Statutory Grievance Desk')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{MERCHANT_DISPLAY_PHONE}</span>
                    </a>
                    <span className="text-[11px] text-neutral-500 block">
                      Operates Mon–Sat: 10:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-1 text-xs text-neutral-400">
                  <strong className="text-white uppercase block text-[11px] tracking-wider">
                    Grievance Officer Designation
                  </strong>
                  <p>
                    Officer in Charge: Legal & Consumer Redressal Cell, ULEF Atelier, Modasa, Aravalli, Gujarat (383315). For formal legal escalations or statutory inquiries under DPDP Act / E-Commerce Rules, write to <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-400 underline">{SUPPORT_EMAIL}</a> with your full name and order reference number.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer of modal */}
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-500">
            <span>© {new Date().getFullYear()} ULEF Atelier Corp. • Modasa, Gujarat (383315)</span>
            <button
              onClick={() => openLegalPolicy(null)}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white text-neutral-950 font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

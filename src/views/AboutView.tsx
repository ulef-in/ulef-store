import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  ShieldCheck,
  Layers,
  Leaf,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
      {/* Manifesto Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500 font-bold">
          ATELIER MANIFESTO
        </span>
        <h1 className="text-3xl sm:text-6xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase leading-[0.95]">
          ENGINEERED FOR PROPORTION, BUILT FOR DECADES.
        </h1>
        <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
          ULEF.IN was founded on a singular obsession: the architecture of the oversized t-shirt. Rejecting flimsy fast-fashion jerseys, we craft museum-grade heavyweight garments with calculated drape.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=85"
          alt="Fabric atelier loom weaving"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white space-y-1">
          <div className="text-xs font-mono text-amber-400">ULEF FABRIC LAB // LOOM MILL 04</div>
          <div className="text-xl sm:text-2xl font-bold font-display uppercase">Double-Knit Compact Cotton Looms</div>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold">
            01
          </div>
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white">
            LONG-STAPLE COMBED COTTON
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
            Every fiber is combed to eliminate short, impure threads. The result is an ultra-dense, ultra-smooth surface that feels like silk against the skin while retaining indestructible 240 GSM heft.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold">
            02
          </div>
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white">
            1.25" ANTI-BACON COLLAR
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
            Nothing ruins an oversized silhouette faster than a loose, rippling collar. Our 1.25" custom ribbed band integrates micro-elastane memory yarns that snap back wash after wash.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold">
            03
          </div>
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white">
            ZERO-PLASTIC CIRCULARITY
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
            Every order is dispatched in biodegradable stone-paper mailers with non-toxic soy inks. Zero single-use petroleum plastics touch your garments.
          </p>
        </div>
      </div>

      {/* Sustainable ethics banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            ETHICAL CERTIFICATION
          </span>
          <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white">
            FAIR WAGE ATELIERS & OEKO-TEX® DYES
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Our garment artisans receive 2.4x the regional living wage with full healthcare and vocational mastery programs.
          </p>
        </div>

        <button
          onClick={() => setActiveView('shop')}
          className="px-8 py-3.5 rounded-xl bg-white text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Shop Drop 04</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden bg-neutral-950 text-white">
      {/* Background Editorial High-Res Imagery with Luxury Overlay */}
      <div className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center pt-8 pb-14 sm:pt-12 sm:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=90"
            alt="ULEF.IN Editorial Lookbook"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover [object-position:center_top] opacity-40 scale-100 sm:scale-105 transition-transform duration-10000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/50 to-neutral-950" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-center flex flex-col items-center justify-center box-border">
          {/* Subtitle tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-neutral-200 text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 max-w-full text-center"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">DROP 04 • ARCHITECTURAL OVERSIZED ESSENTIALS</span>
          </motion.div>

          {/* Main Title with fluid sizing */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full font-black font-display uppercase text-white max-w-4xl text-center leading-[1.05] sm:leading-[0.95] tracking-tight sm:tracking-tighter px-1 sm:px-4"
          >
            <span className="inline-block text-[clamp(1.8rem,6vw,2.4rem)] sm:text-6xl md:text-7xl lg:text-8xl">
              HEAVYWEIGHT
            </span>{' '}
            <span className="inline-block text-sm sm:text-base md:text-xl font-serif italic lowercase font-normal text-neutral-400 px-1 sm:px-2 align-middle">
              240 gsm
            </span>{' '}
            <span className="block sm:inline text-[clamp(1.6rem,5.5vw,2.4rem)] sm:text-6xl md:text-7xl lg:text-8xl">
              SCULPTED DRAPE
            </span>
          </motion.h1>

          {/* Manifesto description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-neutral-300 max-w-xl sm:max-w-2xl font-light leading-relaxed px-2 text-center"
          >
            Uncompromising drop-shoulder silhouettes engineered with pre-shrunk combed cotton and anti-bacon collars that never lose structure.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none px-2"
          >
            <button
              onClick={() => setActiveView('shop')}
              className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-4 rounded-xl bg-white text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 cursor-pointer"
            >
              <span>Explore Drop 04</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveView('lookbook')}
              className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold font-display uppercase tracking-wider text-xs backdrop-blur-md border border-neutral-700 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>View Editorial Lookbook</span>
            </button>
          </motion.div>

          {/* Quick Stats Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-10 text-center font-mono w-full max-w-3xl px-2"
          >
            <div className="p-2.5 sm:p-2 rounded-xl bg-neutral-900/40 sm:bg-transparent border border-neutral-800/40 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">240 GSM</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Heavy Knit</div>
            </div>
            <div className="p-2.5 sm:p-2 rounded-xl bg-neutral-900/40 sm:bg-transparent border border-neutral-800/40 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">0% SAGGING</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Ribbed Collar</div>
            </div>
            <div className="p-2.5 sm:p-2 rounded-xl bg-neutral-900/40 sm:bg-transparent border border-neutral-800/40 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">BOXY CUT</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Drop Shoulder</div>
            </div>
            <div className="p-2.5 sm:p-2 rounded-xl bg-neutral-900/40 sm:bg-transparent border border-neutral-800/40 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">WORLDWIDE</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Express Shipping</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee Infinite Scrolling Ticker */}
      <div className="bg-neutral-900 border-y border-neutral-800 py-3 overflow-hidden whitespace-nowrap flex text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 w-full max-w-[100vw]">
        <div className="inline-flex animate-marquee gap-8 items-center shrink-0">
          <span>ULEF.IN ATELIER</span>
          <span className="text-amber-400">•</span>
          <span>100% COMBED HEAVYWEIGHT COMPACT COTTON</span>
          <span className="text-amber-400">•</span>
          <span>PRE-SHRUNK BIO-WASHED</span>
          <span className="text-amber-400">•</span>
          <span>REACTIVE MINERAL DYE</span>
          <span className="text-amber-400">•</span>
          <span>DROP 04 NOW LIVE</span>
          <span className="text-amber-400">•</span>
          <span>FREE GLOBAL RETURNS</span>
          <span className="text-amber-400">•</span>
          <span>ULEF.IN ATELIER</span>
          <span className="text-amber-400">•</span>
          <span>100% COMBED HEAVYWEIGHT COMPACT COTTON</span>
          <span className="text-amber-400">•</span>
          <span>PRE-SHRUNK BIO-WASHED</span>
          <span className="text-amber-400">•</span>
          <span>REACTIVE MINERAL DYE</span>
          <span className="text-amber-400">•</span>
          <span>DROP 04 NOW LIVE</span>
          <span className="text-amber-400">•</span>
          <span>FREE GLOBAL RETURNS</span>
          <span className="text-amber-400">•</span>
        </div>
      </div>
    </div>
  );
};

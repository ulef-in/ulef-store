import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { DEFAULT_HERO_POSTER, resolveHeroPosterUrl } from '../lib/supabase';

export const HeroBanner: React.FC = () => {
  const { setActiveView, heroBannerImage, heroBannerOpacity } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Strictly prioritize robust local asset /hero-bg.jpg and purge fragile ImgBB URLs
  const rawPoster = resolveHeroPosterUrl(heroBannerImage) || '/hero-bg.jpg';
  const currentPoster = imageError || rawPoster.includes('ibb.co') || rawPoster.includes('imgbb')
    ? '/hero-bg.jpg'
    : rawPoster;
  const posterOpacity = typeof heroBannerOpacity === 'number' ? heroBannerOpacity / 100 : 0.60;

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden bg-[#080808] text-white">
      {/* Background Editorial High-Res Imagery with Sleek Obsidian Luxury Fallback */}
      <div className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center pt-8 pb-14 sm:pt-12 sm:pb-20 bg-gradient-to-b from-[#080808] via-[#0d0d0d] to-[#121212]">
        {/* Subtle Architectural Radial Glow (Deep Obsidian & Atelier Ambient Lighting) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255, 255, 255, 0.04) 0%, rgba(18, 18, 18, 0.5) 50%, rgba(8, 8, 8, 0.98) 100%)'
          }}
        />
        {/* Warm Subtle Atelier Accent Halo */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.08) 0%, transparent 60%)'
          }}
        />

        {/* Hero Background Layer (Local Image with Architectural Scrims) */}
        <div
          className="absolute inset-0 z-0 overflow-hidden w-full transition-opacity duration-700"
          style={{
            backgroundImage: `url(${currentPoster})`,
            backgroundPosition: 'center top',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100%'
          }}
        >
          <img
            src={currentPoster}
            alt="ULEF.IN Atelier Heavyweight Drapery"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              opacity: imageLoaded ? posterOpacity : 0,
              objectFit: 'cover',
              objectPosition: 'center top',
              width: '100%',
              height: '100%'
            }}
            className="w-full h-full object-cover [object-position:center_top] transition-opacity duration-700"
          />

          {/* Brutalist Architectural Dark Vignette Overlays & High-Contrast Scrim */}
          <div className="absolute inset-0 bg-[#080808]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-[#080808]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#080808]/50 to-[#080808]" />

          {/* Subtle Architectural Grid Lines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-center flex flex-col items-center justify-center box-border">
          {/* Subtitle tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-neutral-200 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] mb-4 sm:mb-6 max-w-full text-center shadow-2xl"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span className="truncate sm:whitespace-normal font-semibold">DROP 04 • ARCHITECTURAL OVERSIZED ESSENTIALS</span>
          </motion.div>

          {/* Main Title with fluid sizing and drop shadow */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full font-black font-display uppercase text-white max-w-4xl text-center leading-[1.05] sm:leading-[0.95] tracking-tight sm:tracking-tighter px-1 sm:px-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
          >
            <span className="inline-block text-[clamp(1.8rem,6vw,2.4rem)] sm:text-6xl md:text-7xl lg:text-8xl">
              HEAVYWEIGHT
            </span>{' '}
            <span className="inline-block text-sm sm:text-base md:text-xl font-serif italic lowercase font-normal text-amber-300 px-1 sm:px-2 align-middle">
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
            className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-neutral-200 max-w-xl sm:max-w-2xl font-normal leading-relaxed px-2 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
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
              className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-4 rounded-xl bg-black/60 hover:bg-black/80 text-white font-bold font-display uppercase tracking-wider text-xs backdrop-blur-md border border-neutral-600 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg"
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
            <div className="p-2.5 sm:p-2 rounded-xl bg-black/50 backdrop-blur-sm sm:bg-transparent border border-neutral-800/60 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">240 GSM</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Heavy Knit</div>
            </div>
            <div className="p-2.5 sm:p-2 rounded-xl bg-black/50 backdrop-blur-sm sm:bg-transparent border border-neutral-800/60 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">0% SAGGING</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Ribbed Collar</div>
            </div>
            <div className="p-2.5 sm:p-2 rounded-xl bg-black/50 backdrop-blur-sm sm:bg-transparent border border-neutral-800/60 sm:border-none">
              <div className="text-lg sm:text-2xl font-bold font-display text-white">BOXY CUT</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">Drop Shoulder</div>
            </div>
            <div className="p-2.5 sm:p-2 rounded-xl bg-black/50 backdrop-blur-sm sm:bg-transparent border border-neutral-800/60 sm:border-none">
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
          <span>7-DAY EASY RETURNS</span>
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
          <span>7-DAY EASY RETURNS</span>
          <span className="text-amber-400">•</span>
        </div>
      </div>
    </div>
  );
};

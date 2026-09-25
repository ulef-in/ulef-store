import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Award,
  CheckCircle2,
  Star,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { products, setActiveView, openProductDetail } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);

  const categories = ['All', 'Essentials', 'Minimalist Heavyweight', 'Graphic Street', 'Acid & Vintage Wash', 'Limited Drop'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const featuredProducts = products.filter(p => p.isFeatured || p.isBestSeller);

  const handleNextSlide = () => {
    setActiveSliderIndex(prev => (prev + 1) % Math.max(1, featuredProducts.length - 2));
  };

  const handlePrevSlide = () => {
    setActiveSliderIndex(prev => (prev - 1 + Math.max(1, featuredProducts.length - 2)) % Math.max(1, featuredProducts.length - 2));
  };

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Featured Heavyweight Drops Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold mb-1">
              <Flame className="w-4 h-4" />
              <span>CURATED HIGHLIGHTS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-950 dark:text-white uppercase">
              ICONIC OVERSIZED SILHOUETTES
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('shop')}
              className="ml-2 text-xs font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white hover:opacity-75 transition-opacity flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Featured Slider Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(activeSliderIndex, activeSliderIndex + 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. The ULEF.IN Architectural Anatomy Breakdown */}
      <section className="bg-neutral-900 text-white py-16 sm:py-24 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
              ENGINEERING MATRIX
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight uppercase text-white mt-2">
              WHY STANDARD TEES FAIL & WHY ULEF.IN PREVAILS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-4 leading-relaxed font-light">
              Most fast-fashion oversized tees use thin 160 GSM single-jersey that clings, turns transparent, and develops "bacon collar" ripples after two washes. We engineered a better foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
                240
              </div>
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">
                HEAVYWEIGHT 240 GSM COMPACT KNIT
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Woven from 100% long-staple combed cotton yarns. Substantial heft delivers natural drape and structural body geometry with zero transparency.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> 100% Zero-Sheer Guarantee
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
                1.25"
              </div>
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">
                ANTI-BACON REINFORCED RIBBED COLLAR
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Constructed with dense 1.25" 2x2 ribbed cotton and embedded elastane memory fibers. Holds its crisp circular contour after 50+ wash cycles.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> No Sagging or Warping
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
                BOXY
              </div>
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">
                ENGINEERED DROP-SHOULDER GEOMETRY
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dropped shoulder seams, wide bicep breaks, and seamless tubular bodies. Created to frame modern streetwear proportions effortlessly.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Japanese Streetwear Fit
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Drop 04 Collection Grid with Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              DROP 04 ARCHIVE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
              THE FULL STREETWEAR COLLECTION
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveView('shop')}
            className="px-8 py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-950 dark:text-white font-bold font-display uppercase tracking-wider text-xs transition-all inline-flex items-center gap-2"
          >
            <span>Explore All Silhouettes & Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Editorial Lookbook Banner Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white border border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  AUTUMN/WINTER LOOKBOOK
                </span>
                <h3 className="text-3xl sm:text-5xl font-black font-display tracking-tight uppercase leading-[0.95]">
                  THE ARCHITECTURAL PROPORTIONS STUDY
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  Captured on location in Tokyo and Berlin. Exploring heavy drape interplay, acid mineral wash textures, and boxy oversized layering.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setActiveView('lookbook')}
                  className="px-8 py-3.5 rounded-xl bg-white text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
                >
                  <span>Open Lookbook Archive</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-auto min-h-[340px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85"
                alt="Lookbook Model"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            VERIFIED INSIDER REVIEWS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
            WHAT THE STREETWEAR COMMUNITY SAYS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h4 className="text-sm font-bold font-display text-neutral-950 dark:text-white">
              "Finally a collar that doesn't stretch out"
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              "I own 10+ oversized tees from various luxury brands. ULEF.IN is the only one where the 1.25" collar stays completely flat and tight even after 15 washes. Pure 240 GSM magic."
            </p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-950 dark:text-white">Alexander M.</span>
              <span className="text-neutral-500">Verified Buyer • Size L</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h4 className="text-sm font-bold font-display text-neutral-950 dark:text-white">
              "Heavyweight structure is unmatched"
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              "The 240 GSM French Terry Graphic tee feels like armor yet remains breathable. The drop shoulder break hits exactly at the upper arm for that boxy silhouette."
            </p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-950 dark:text-white">Marcus Sterling</span>
              <span className="text-neutral-500">Verified Buyer • Size XL</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h4 className="text-sm font-bold font-display text-neutral-950 dark:text-white">
              "Chalk white is completely zero-sheer"
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              "Finding a white tee that isn't see-through is almost impossible. The Chalk White 240 GSM has zero transparency and pairs effortlessly with dark trousers."
            </p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-950 dark:text-white">Elena Rostova</span>
              <span className="text-neutral-500">Verified Buyer • Size M</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

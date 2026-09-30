import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Layers, Eye } from 'lucide-react';
import { DEFAULT_HERO_POSTER } from '../lib/supabase';

export const LookbookView: React.FC = () => {
  const { products, openProductDetail, setActiveView } = useStore();

  // Dynamic live products from inventory (excluding system records)
  const liveLooks = (products || []).filter(
    (p) => p && p.id && p.name !== '__SYSTEM_HERO_POSTER__'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono uppercase tracking-[0.2em] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDITORIAL CAMPAIGN ARCHIVE</span>
        </div>
        <h1 className="text-3xl sm:text-6xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase">
          DROP 04 LOOKBOOK
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
          Architectural silhouettes engineered with 240 GSM combed compact cotton. Proportions study exploring heavyweight drape dynamics, drop-shoulder silhouettes, and structural streetwear tailoring.
        </p>
      </div>

      {/* Dynamic Looks Grid */}
      {liveLooks.length === 0 ? (
        <div className="py-24 text-center space-y-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-8">
          <Layers className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold font-display uppercase text-neutral-950 dark:text-white">
            Editorial Archive Empty
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            New heavyweight silhouettes are currently in production in our atelier. Explore our storefront collection or check back shortly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveView('shop')}
              className="px-6 py-3 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Browse All Products
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {liveLooks.map((product, idx) => {
            const cardImage =
              product.images?.[0] ||
              product.colors?.[0]?.image ||
              DEFAULT_HERO_POSTER;

            const badgeText = product.isNewArrival
              ? 'NEW DROP'
              : product.isBestSeller
              ? 'BESTSELLER'
              : product.isFeatured
              ? 'ICONIC SILHOUETTE'
              : `${product.gsm || 240} GSM ARCHITECTURAL`;

            return (
              <div
                key={product.id}
                onClick={() => openProductDetail(product)}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-between min-h-[560px] sm:min-h-[620px] p-6 sm:p-8 text-white transition-all duration-300 hover:border-neutral-700 shadow-2xl cursor-pointer"
              >
                {/* Background Image with Pan & Hover Effect */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
                  <img
                    src={cardImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover [object-position:center_top] transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                  />
                  {/* Luxury editorial vignette gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/20" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/40 to-neutral-950/80" />
                </div>

                {/* Card Top: Look Identifier & Badge */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider">
                      LOOK {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider uppercase">
                      {badgeText}
                    </span>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-mono">
                    {product.category || 'Atelier'}
                  </span>
                </div>

                {/* Card Bottom: Product Details & CTA */}
                <div className="relative z-10 space-y-4 pt-16">
                  <div>
                    <span className="text-amber-400 font-bold tracking-widest text-[11px] font-mono uppercase block mb-1">
                      {product.fitType || 'Boxy Drop-Shoulder'} • {product.gsm || 240} GSM
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1.5 max-w-lg line-clamp-2 leading-relaxed">
                      {product.subtitle ||
                        product.fabricDetails ||
                        product.description ||
                        '100% Combed Compact Cotton with dense ribbed collar.'}
                    </p>
                  </div>

                  {/* Pricing, Specs & Shop Look Button */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-neutral-400 block text-[9px] font-mono uppercase tracking-wider">
                          ATELIER PRICE
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg sm:text-xl font-bold text-white font-mono">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-neutral-500 line-through font-mono">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="h-7 w-px bg-white/10" />

                      <div>
                        <span className="text-neutral-400 block text-[9px] font-mono uppercase tracking-wider">
                          WEIGHT
                        </span>
                        <span className="text-amber-400 font-mono font-bold text-xs">
                          {product.gsm || 240} GSM
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductDetail(product);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Shop Look</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { DEFAULT_HERO_POSTER } from '../lib/supabase';

const EDITORIAL_LOCATIONS = [
  'SHIBUYA DUSK // TOKYO',
  'KREUZBERG CONCRETE // BERLIN',
  'SOHO ARCHITECTURE // NEW YORK',
  'MITTE BRUTALISM // BERLIN',
];

export const LookbookView: React.FC = () => {
  const { products, openProductDetail, setActiveView } = useStore();

  // Dynamic live products from inventory (excluding system records)
  const validProducts = (products || []).filter(
    (p) => p && p.id && p.name !== '__SYSTEM_HERO_POSTER__'
  );

  // Exactly the first 4 active products for the high-fashion editorial cards
  const editorialProducts = validProducts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500 font-bold">
          EDITORIAL CAMPAIGN ARCHIVE
        </span>
        <h1 className="text-3xl sm:text-6xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase">
          DROP 04 LOOKBOOK
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
          Proportions study exploring heavy cotton drape dynamics, drop-shoulder silhouettes, and structural streetwear styling across global metropolises.
        </p>
      </div>

      {/* 1. Exactly 4 Editorial Lookbook Cards */}
      {editorialProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-8">
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
          {editorialProducts.map((product, idx) => {
            const cardImage =
              product.images?.[0] ||
              product.colors?.[0]?.image ||
              DEFAULT_HERO_POSTER;

            const editorialTag =
              EDITORIAL_LOCATIONS[idx % EDITORIAL_LOCATIONS.length];
            const editorialTitle = `DROP 04 // ${product.name.replace(/\s*(240\s*GSM|Tee|Boxy Cut|Drop-Shoulder).*/i, '').trim().toUpperCase()}`;
            const editorialDescription =
              product.subtitle ||
              product.fabricDetails ||
              product.description ||
              'Sculpted 240 GSM Heavyweight compact knit paired with raw-edge structural drape.';

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-end min-h-[540px] sm:min-h-[580px] p-6 sm:p-8 text-white shadow-2xl"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
                  <img
                    src={cardImage}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover [object-position:center_top] transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                </div>

                {/* Overlay Content */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">{editorialTag}</span>
                    <span className="text-neutral-400">LOOK 0{idx + 1}</span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                      {editorialTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1 max-w-md line-clamp-2">
                      {editorialDescription}
                    </p>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-800/80">
                    <div className="text-xs font-mono">
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
                        FEATURED SILHOUETTE:
                      </span>
                      <strong className="text-white text-sm font-display tracking-wide">
                        {product.name}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => openProductDetail(product)}
                      className="px-5 py-2.5 rounded-full bg-white text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer shrink-0"
                    >
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

      {/* 2. Separate General Catalog: ALL OVERSIZED PIECES */}
      <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMPLETE ATELIER ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-950 dark:text-white uppercase">
              ALL OVERSIZED PIECES ({validProducts.length})
            </h2>
          </div>
          <button
            onClick={() => setActiveView('shop')}
            className="text-xs font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white hover:opacity-75 transition-opacity flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore All in Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {validProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

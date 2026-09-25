import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Layers, Eye } from 'lucide-react';

export const LookbookView: React.FC = () => {
  const { products, openProductDetail, setActiveView } = useStore();

  const looks = [
    {
      id: 'look-1',
      title: 'DROP 04 // SHIBUYA DUSK',
      city: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      description: 'Sculpted 240 GSM Heavyweight Washed Onyx paired with raw-edge technical denim.',
      featuredProduct: products[0],
    },
    {
      id: 'look-2',
      title: 'DROP 04 // KREUZBERG CONCRETE',
      city: 'Berlin, Germany',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      description: 'Chalk White Clean Silhouette with tailored pleated trousers and minimalist footwear.',
      featuredProduct: products[1],
    },
    {
      id: 'look-3',
      title: 'DROP 04 // SOHO ARCHITECTURE',
      city: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
      description: '240 GSM French Terry Graphic Tee layered over high-neck thermal underlay.',
      featuredProduct: products[2],
    },
    {
      id: 'look-4',
      title: 'DROP 04 // MITTE BRUTALISM',
      city: 'Berlin, Germany',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85',
      description: 'Acid Wash Mineral Charcoal with wide-leg cargo utility trousers.',
      featuredProduct: products[3],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
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

      {/* Looks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {looks.map((look, idx) => (
          <div
            key={look.id}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-end min-h-[540px] p-8 text-white"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={look.image}
                alt={look.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">{look.city.toUpperCase()}</span>
                <span className="text-neutral-400">LOOK 0{idx + 1}</span>
              </div>

              <div>
                <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white">
                  {look.title}
                </h3>
                <p className="text-xs text-neutral-300 font-light mt-1 max-w-md">
                  {look.description}
                </p>
              </div>

              {look.featuredProduct && (
                <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                  <div className="text-xs font-mono">
                    <span className="text-neutral-400 block text-[10px]">FEATURED SILHOUETTE:</span>
                    <strong className="text-white">{look.featuredProduct.name}</strong>
                  </div>

                  <button
                    onClick={() => openProductDetail(look.featuredProduct)}
                    className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-lg"
                  >
                    <span>Shop Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

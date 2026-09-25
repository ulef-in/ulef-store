import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setActiveView } = useStore();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 mx-auto flex items-center justify-center text-neutral-400 mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white">
          YOUR WISHLIST IS EMPTY
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
          Save your favorite heavyweight oversized silhouettes to track drop releases and restocks.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-8 px-8 py-4 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors inline-flex items-center gap-2"
        >
          <span>Explore Drop 04 Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            SAVED CURATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
            SAVED SILHOUETTES ({savedProducts.length})
          </h1>
        </div>

        <button
          onClick={() => setActiveView('shop')}
          className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Back to Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

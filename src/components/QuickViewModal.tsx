import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Size, ProductColor } from '../types';
import { X, Star, Ruler, ShoppingBag, ArrowRight, Check, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    openQuickView,
    openProductDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setIsSizeGuideOpen
  } = useStore();

  const product = quickViewProduct;

  const [selectedSize, setSelectedSize] = useState<Size>('L');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedSize('L');
      setSelectedColor(product.colors[0]);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const currentColor = selectedColor || product.colors[0];
  const isSaved = isInWishlist(product.id);
  const stockForSelectedSize = product.stock[selectedSize] || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, currentColor, 1, true);
    openQuickView(null);
  };

  const handleFullProduct = () => {
    openProductDetail(product);
    openQuickView(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => openQuickView(null)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-4xl bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={() => openQuickView(null)}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Gallery */}
          <div className="md:w-1/2 bg-neutral-950 p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-950/80 text-white backdrop-blur-md border border-neutral-700">
                {product.gsm} GSM
              </span>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-white ring-1 ring-white' : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details */}
          <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1">
                  <span>{product.fitType.toUpperCase()}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-500">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-display tracking-tight text-white">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {product.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 font-mono">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 font-sans uppercase">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Color selector */}
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400 mb-2 flex items-center justify-between">
                  <span>Colorway: <strong className="text-white">{currentColor.name}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        currentColor.name === c.name
                          ? 'border-white bg-neutral-800 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-neutral-700" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400 mb-2 flex items-center justify-between">
                  <span>Select Size (Oversized Drape)</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-neutral-400 hover:text-white flex items-center gap-1 underline text-[11px]"
                  >
                    <Ruler className="w-3 h-3" /> Size Matrix
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {product.sizes.map((sz) => {
                    const inStock = (product.stock[sz] || 0) > 0;
                    return (
                      <button
                        key={sz}
                        disabled={!inStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                          selectedSize === sz
                            ? 'bg-white text-neutral-950 border-white'
                            : inStock
                            ? 'bg-neutral-800/80 text-white border-neutral-700 hover:border-neutral-500'
                            : 'bg-neutral-900 text-neutral-600 border-neutral-800 line-through cursor-not-allowed'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 text-[11px] font-mono text-neutral-400">
                  {stockForSelectedSize > 0 ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> In Stock ({stockForSelectedSize} units left in {selectedSize})
                    </span>
                  ) : (
                    <span className="text-red-400">Size {selectedSize} sold out</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex gap-3">
                <button
                  disabled={stockForSelectedSize === 0}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-red-500 transition-colors border border-neutral-700"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleFullProduct}
                className="w-full text-center text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1 py-1"
              >
                <span>View Full Atelier Spec Sheet & Customer Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

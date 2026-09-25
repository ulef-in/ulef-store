import React, { useState } from 'react';
import { Product, Size, ProductColor } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    openQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice
  } = useStore();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSizeForQuickAdd, setSelectedSizeForQuickAdd] = useState<Size | null>(null);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const currentColor: ProductColor = product.colors[selectedColorIndex] || product.colors[0];
  const isSaved = isInWishlist(product.id);

  // Hover image logic
  const primaryImage = currentColor.image || product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent, size: Size) => {
    e.stopPropagation();
    addToCart(product, size, currentColor, 1, false);
    setSelectedSizeForQuickAdd(size);
    setIsAddedRecently(true);
    setTimeout(() => {
      setIsAddedRecently(false);
    }, 1800);
  };

  const totalStock = (Object.values(product.stock) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div
      onClick={() => openProductDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80">
        {/* Main Product Image */}
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-950/80 text-white backdrop-blur-md border border-neutral-700/50">
            {product.gsm} GSM
          </span>
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-neutral-950 shadow-sm">
              BEST SELLER
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-neutral-950 dark:bg-neutral-100 shadow-sm">
              NEW DROP
            </span>
          )}
        </div>

        {/* Wishlist and Quick View Top Right Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-red-500 transition-all shadow-sm"
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white shadow-sm"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Size Selector Bar on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5 text-center flex items-center justify-center gap-1">
            {isAddedRecently ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> ADDED TO BAG ({selectedSizeForQuickAdd})
              </span>
            ) : (
              <span>QUICK ADD SIZE:</span>
            )}
          </div>
          <div className="flex items-center justify-center gap-1">
            {product.sizes.map((sz) => {
              const inStock = (product.stock[sz] || 0) > 0;
              return (
                <button
                  key={sz}
                  disabled={!inStock}
                  onClick={(e) => handleQuickAdd(e, sz)}
                  className={`h-7 px-2 rounded text-[10px] font-mono font-bold transition-all ${
                    inStock
                      ? 'bg-neutral-800/90 text-white hover:bg-white hover:text-neutral-950 border border-neutral-700'
                      : 'bg-neutral-900/40 text-neutral-600 line-through cursor-not-allowed border border-neutral-800/50'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3.5 flex flex-col space-y-1.5">
        {/* Color swatches & rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-neutral-950 dark:ring-white scale-110 border-transparent'
                    : 'border-neutral-300 dark:border-neutral-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{product.rating}</span>
            <span className="text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Name and subtitle */}
        <h3 className="text-sm font-bold font-display text-neutral-950 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
          {product.subtitle}
        </p>

        {/* Price & fit details */}
        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-bold text-neutral-950 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
            {product.fitType}
          </span>
        </div>
      </div>
    </div>
  );
};

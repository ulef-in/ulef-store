import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Size } from '../types';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  Check,
  RotateCcw,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopView: React.FC = () => {
  const { products, formatPrice } = useStore();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGSM, setSelectedGSM] = useState<number | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = ['All', 'Essentials', 'Minimalist Heavyweight', 'Graphic Street', 'Acid & Vintage Wash', 'Limited Drop'];
  const allSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const gsmOptions = ['All', 240];

  const colorPalette = [
    { name: 'Onyx / Black', hex: '#1c1c1e' },
    { name: 'Chalk White / Ecru', hex: '#f4f4f2' },
    { name: 'Vintage Ash', hex: '#4a4a4e' },
    { name: 'Olive / Sage', hex: '#3d4436' },
    { name: 'Espresso Mocha', hex: '#2b1d19' },
    { name: 'Midnight Cobalt', hex: '#16223b' },
  ];

  const toggleSize = (size: Size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedGSM('All');
    setMaxPrice(100);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

        // Size
        if (selectedSizes.length > 0) {
          const hasSelectedSize = selectedSizes.some(sz => (p.stock[sz] || 0) > 0);
          if (!hasSelectedSize) return false;
        }

        // Color
        if (selectedColors.length > 0) {
          const matchesColor = p.colors.some(c =>
            selectedColors.some(sc => c.name.toLowerCase().includes(sc.toLowerCase().split(' ')[0]))
          );
          if (!matchesColor) return false;
        }

        // GSM
        if (selectedGSM !== 'All' && p.gsm !== selectedGSM) return false;

        // Price
        if (p.price > maxPrice) return false;

        // Stock
        if (onlyInStock) {
          const totalStock = (Object.values(p.stock) as number[]).reduce((a, b) => a + b, 0);
          if (totalStock === 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSizes, selectedColors, selectedGSM, maxPrice, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Title */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            DROP 04 SPECIFICATION MATRIX
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-neutral-950 dark:text-white uppercase mt-1">
            ALL OVERSIZED PIECES ({filteredProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl font-light">
            Filter by premium compact cotton density (240 GSM), mineral wash techniques, and boxy drop-shoulder proportions.
          </p>
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500 hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-500 transition-colors"
            >
              <option value="featured">Featured Silhouettes</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Latest Drop</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-8 pr-4 border-r border-neutral-200 dark:border-neutral-800/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-neutral-950 dark:text-white">
              FILTER SPECIFICATIONS
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
              Collection Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
              Size (In Stock)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {allSizes.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`py-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabric Weight GSM Filter */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
              Fabric Weight (GSM)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {gsmOptions.map((gsm) => (
                <button
                  key={gsm}
                  onClick={() => setSelectedGSM(gsm as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    selectedGSM === gsm
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {gsm === 'All' ? 'All Weights' : `${gsm} GSM`}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
              Color Palette
            </label>
            <div className="space-y-2">
              {colorPalette.map((col) => {
                const isSelected = selectedColors.includes(col.name);
                return (
                  <button
                    key={col.name}
                    onClick={() => toggleColor(col.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white'
                        : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="uppercase tracking-wider text-neutral-500">Max Price</span>
              <span className="font-bold text-neutral-950 dark:text-white font-mono">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="2"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-950 dark:accent-white cursor-pointer"
            />
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-500 accent-neutral-950 dark:accent-white"
              />
              <span>In Stock Silhouettes Only</span>
            </label>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
              <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white">
                No matching silhouettes found
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Try widening your GSM density, clearing size selections, or resetting all filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-neutral-900 text-white p-6 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                    SPECIFICATION FILTERS
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono ${
                          selectedCategory === cat ? 'bg-white text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Sizes
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {allSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`py-2 rounded-lg font-mono text-xs font-bold ${
                          selectedSizes.includes(sz) ? 'bg-white text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GSM */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Fabric GSM Weight
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {gsmOptions.map((gsm) => (
                      <button
                        key={gsm}
                        onClick={() => setSelectedGSM(gsm as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                          selectedGSM === gsm ? 'bg-white text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {gsm === 'All' ? 'All' : `${gsm} GSM`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800 flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-300 font-bold text-xs uppercase"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs uppercase"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

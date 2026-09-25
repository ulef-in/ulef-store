import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Sparkles, SlidersHorizontal, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openProductDetail, formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const popularTags = ['240 GSM', 'Drop-Shoulder', 'Washed Onyx', 'Minimalist', 'Acid Wash', 'Chalk White'];

  const filteredProducts = products.filter(p => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.colors.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${p.gsm} GSM`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative z-10 w-full max-w-3xl bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center gap-3">
            <Search className="w-6 h-6 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search heavyweight tees, 240 GSM, colors, fit..."
              className="w-full bg-transparent text-lg sm:text-xl font-medium focus:outline-none placeholder:text-neutral-500 text-white font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-3 py-1.5 text-xs font-mono uppercase bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Quick Filter chips */}
          <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-neutral-400 flex items-center gap-1 shrink-0 font-medium">
              <Tag className="w-3.5 h-3.5" /> Popular:
            </span>
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors shrink-0 text-xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-neutral-800/60">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      openProductDetail(product);
                      setIsSearchOpen(false);
                    }}
                    className="flex gap-4 p-3 rounded-xl bg-neutral-800/40 hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-950 shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-700 text-neutral-200">
                            {product.gsm} GSM
                          </span>
                          <span className="text-[11px] text-neutral-400 truncate">
                            {product.fitType}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-display line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-white font-mono">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-neutral-400 group-hover:text-white flex items-center gap-1">
                          View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                <p className="text-sm font-medium text-neutral-300">No oversized silhouettes found</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Try searching for "240 GSM", "Onyx", "Chalk", or "Acid Wash"
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 px-6 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Showing {filteredProducts.length} results</span>
            <span>ULEF.IN Drop 04 Archive</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

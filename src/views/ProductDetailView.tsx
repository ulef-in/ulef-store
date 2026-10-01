import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Size, ProductColor, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Ruler,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronDown,
  Plus,
  Minus,
  Sparkles,
  Share2,
  CheckCircle2,
  MessageSquarePlus,
  ZoomIn,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendToWhatsApp, getWhatsAppUrl, generateProductWhatsAppMessage } from '../utils/whatsapp';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setIsSizeGuideOpen,
    setActiveView,
    addReview,
    products,
    showToast
  } = useStore();

  const product = selectedProduct || products[0];

  // Filter out any legacy dummy images that do not belong to the current product
  const DUMMY_FALLBACK_URLS = new Set([
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85'
  ]);

  // Genuine images belonging strictly to this product
  const rawImages = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.colors?.[0]?.image ? [product.colors[0].image] : []);

  // Filter out dummy photos if product has its own custom image
  const hasCustomImages = rawImages.some(img => !DUMMY_FALLBACK_URLS.has(img));
  const productImages = hasCustomImages
    ? rawImages.filter(img => !DUMMY_FALLBACK_URLS.has(img))
    : rawImages.slice(0, 1);

  const currentImages = productImages.length > 0 ? productImages : [product.images[0]];

  // State
  const [selectedSize, setSelectedSize] = useState<Size>('L');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');

  // Review submission form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFit, setReviewFit] = useState<'Runs Small' | 'True to Oversized' | 'Very Oversized'>('True to Oversized');

  const isSaved = isInWishlist(product.id);
  const stockForSelectedSize = product.stock[selectedSize] || 0;

  // Zoom lens effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (stockForSelectedSize === 0) return;
    addToCart(product, selectedSize, selectedColor, quantity, true);
  };

  const handleBuyNow = () => {
    if (stockForSelectedSize === 0) return;
    addToCart(product, selectedSize, selectedColor, quantity, false);
    setActiveView('checkout');
  };

  const productWhatsAppUrl = product ? getWhatsAppUrl(
    generateProductWhatsAppMessage(
      product,
      selectedSize,
      selectedColor.name,
      quantity,
      formatPrice
    )
  ) : '#';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    addReview(product.id, {
      userName: reviewName,
      userLocation: reviewLocation || 'Verified Client',
      rating: reviewRating,
      title: reviewTitle || 'Exceptional Quality',
      comment: reviewComment,
      verifiedPurchase: true,
      sizePurchased: selectedSize,
      fitFeedback: reviewFit,
    });

    setIsReviewFormOpen(false);
    setReviewName('');
    setReviewComment('');
    setReviewTitle('');
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
        <button onClick={() => setActiveView('home')} className="hover:text-neutral-950 dark:hover:text-white transition-colors">
          HOME
        </button>
        <span>/</span>
        <button onClick={() => setActiveView('shop')} className="hover:text-neutral-950 dark:hover:text-white transition-colors">
          COLLECTION
        </button>
        <span>/</span>
        <span className="text-neutral-950 dark:text-white font-bold truncate max-w-xs">{product.name.toUpperCase()}</span>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery with Interactive Zoom */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails - ONLY show if product has more than 1 image */}
          {currentImages.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0 no-scrollbar">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-neutral-950 dark:border-white ring-2 ring-neutral-950/20 dark:ring-white/20 scale-102'
                      : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Angle thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Stage with Magnification Lens */}
          <div
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-crosshair group"
          >
            <img
              src={currentImages[activeImageIndex] || currentImages[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-neutral-950/85 text-white backdrop-blur-md border border-neutral-700">
                {product.gsm} GSM HEAVYWEIGHT
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-white/90 text-neutral-950 backdrop-blur-md shadow-sm">
                {product.fitType.toUpperCase()}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/80 text-white px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md">
              <ZoomIn className="w-3.5 h-3.5" /> Hover To Inspect Weave
            </div>
          </div>
        </div>

        {/* Right Column: Product Actions & Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                {product.category.toUpperCase()}
              </span>
              
              <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating) ? 'fill-amber-400' : 'text-neutral-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-neutral-950 dark:text-white uppercase leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {product.subtitle}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-1 border-t border-neutral-200 dark:border-neutral-800 font-mono">
            <span className="text-3xl font-extrabold text-neutral-950 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="px-2 py-0.5 rounded text-xs font-bold font-sans bg-amber-400/20 text-amber-600 dark:text-amber-300 uppercase">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Colorway Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 uppercase">Selected Color:</span>
              <strong className="text-neutral-950 dark:text-white font-bold">{selectedColor.name}</strong>
            </div>

            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all ${
                    selectedColor.name === c.name
                      ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 uppercase">Select Size:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-neutral-950 dark:text-white underline font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Matrix Guide
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {product.sizes.map((sz) => {
                const stock = product.stock[sz] || 0;
                const inStock = stock > 0;
                return (
                  <button
                    key={sz}
                    disabled={!inStock}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-xl font-mono text-xs font-bold transition-all border ${
                      selectedSize === sz
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-md'
                        : inStock
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-900 line-through cursor-not-allowed'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            {/* Stock alert */}
            <div className="text-xs font-mono">
              {stockForSelectedSize > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>In Stock — {stockForSelectedSize} units available in size {selectedSize} (Ships in 24h)</span>
                </span>
              ) : (
                <span className="text-red-500">Size {selectedSize} currently sold out in Drop 04</span>
              )}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-mono text-sm font-bold text-neutral-950 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stockForSelectedSize, quantity + 1))}
                  className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={stockForSelectedSize === 0}
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-14 h-14 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now Express Button */}
            <button
              disabled={stockForSelectedSize === 0}
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Instant Buy Now • Express Checkout</span>
            </button>

            {/* Direct WhatsApp Order Button */}
            {stockForSelectedSize > 0 ? (
              <a
                href={productWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Directly on WhatsApp</span>
              </a>
            ) : (
              <button
                disabled
                className="w-full py-3.5 px-6 rounded-xl bg-neutral-800 text-neutral-500 font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Directly on WhatsApp</span>
              </button>
            )}
          </div>

          {/* Value props mini bar */}
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs font-mono text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Free Global Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>14-Day Free Exchanges</span>
            </div>
          </div>

          {/* Accordion Specs */}
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
            {/* Fabric & GSM */}
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                className="w-full py-4 flex items-center justify-between text-left text-xs font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white"
              >
                <span>FABRIC & {product.gsm} GSM COMPOSITION</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'fabric' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'fabric' && (
                <div className="pb-4 text-xs text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-mono">
                  <p>{product.fabricDetails}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{product.gsm} GSM heavyweight luxury compact cotton</li>
                    <li>Double-knit circular weave for zero-sheer structure</li>
                    <li>Pre-shrunk bio-wash: 0% shrinkage after cold wash</li>
                    <li>1.25" reinforced double-ribbed anti-bacon collar</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Sizing & Proportions */}
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fit' ? null : 'fit')}
                className="w-full py-4 flex items-center justify-between text-left text-xs font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white"
              >
                <span>ARCHITECTURAL FIT & DRAPE SPECS</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'fit' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'fit' && (
                <div className="pb-4 text-xs text-neutral-600 dark:text-neutral-400 space-y-2 font-mono leading-relaxed">
                  <p>Fit: <strong>{product.fitType}</strong> (Intended true oversized cut).</p>
                  <p>Our model is 185 cm / 6'1" and wearing size L for the signature boxy drop-shoulder aesthetic. Size down 1 step if you desire a closer fitted silhouette.</p>
                </div>
              )}
            </div>

            {/* Care Guide */}
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                className="w-full py-4 flex items-center justify-between text-left text-xs font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white"
              >
                <span>ATELIER CARE GUIDE</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'care' && (
                <div className="pb-4 text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 font-mono leading-relaxed">
                  <p>• Machine wash cold (30°C / 85°F) inside out.</p>
                  <p>• Lay flat or hang dry to preserve heavy cotton drape.</p>
                  <p>• Do not bleach. Cool iron on reverse if desired.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              COMMUNITY RATINGS & FEEDBACK
            </span>
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              CUSTOMER REVIEWS ({product.reviewsCount})
            </h3>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
            className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write A Verified Review</span>
          </button>
        </div>

        {/* Review Submission Form */}
        <AnimatePresence>
          {isReviewFormOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReviewSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4"
            >
              <h4 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-950 dark:text-white">
                Share your experience with {product.name}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    placeholder="Jordan Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Your Location (City, Country)</label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="New York, USA"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-neutral-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Fit Feedback</label>
                  <select
                    value={reviewFit}
                    onChange={(e) => setReviewFit(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white font-mono"
                  >
                    <option value="Runs Small">Runs Small</option>
                    <option value="True to Oversized">True to Oversized</option>
                    <option value="Very Oversized">Very Oversized</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Perfect heavyweight drape..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Your Detailed Review</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  placeholder="Describe the cotton heft, collar fit, wash durability..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-500 font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold font-display uppercase tracking-wider text-xs"
                >
                  Publish Verified Review
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-neutral-400'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">{rev.date}</span>
                </div>

                <p className="text-sm font-bold font-display text-neutral-950 dark:text-white">
                  "{rev.title}"
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {rev.comment}
                </p>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-neutral-950 dark:text-white font-bold">{rev.userName}</strong>
                    {rev.userLocation && <span>({rev.userLocation})</span>}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-bold text-neutral-800 dark:text-neutral-200">
                    Size: {rev.sizePurchased} • {rev.fitFeedback}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-8 text-center text-xs text-neutral-500 font-mono">
              Be the first verified customer to review this Drop 04 silhouette!
            </div>
          )}
        </div>
      </section>

      {/* Recommended Silhouettes Carousel */}
      <section className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
            RECOMMENDED STYLING
          </span>
          <h3 className="text-2xl font-black font-display uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            COMPLETE THE STREETWEAR LOOK
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Move
} from 'lucide-react';

interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName: string;
  gsm?: string | number;
  subtitle?: string;
}

export const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productName,
  gsm = '240 GSM',
  subtitle
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // References for drag & touch gesture handling
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const lastTapRef = useRef<number>(0);
  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPan({ x: 0, y: 0 });
      // Prevent background body scrolling while lightbox is active
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, initialIndex]);

  // Reset zoom & pan when image changes
  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const zoomIn = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(4, +(prev + 0.5).toFixed(1)));
  }, []);

  const zoomOut = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = Math.max(1, +(prev - 0.5).toFixed(1));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && scale === 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && scale === 1) {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        zoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scale, handleNext, handlePrev, zoomIn, zoomOut, resetZoom, onClose]);

  // Dynamic clamping for pan bounds
  const clampPan = (x: number, y: number, currentScale: number) => {
    if (currentScale <= 1) return { x: 0, y: 0 };
    const maxPanX = (window.innerWidth * (currentScale - 1)) / 1.8;
    const maxPanY = (window.innerHeight * (currentScale - 1)) / 1.8;
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y))
    };
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragDistanceRef.current += Math.hypot(dx, dy);

    if (scale > 1) {
      const nextPan = clampPan(panStartRef.current.x + dx, panStartRef.current.y + dy, scale);
      setPan(nextPan);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Image click / double click
  const handleImageClick = (e: React.MouseEvent) => {
    // If user dragged more than 6px, treat as pan, don't trigger click action
    if (dragDistanceRef.current > 6) return;

    if (scale === 1) {
      setScale(2);
    } else {
      resetZoom();
    }
  };

  // Touch gesture support: Double-tap & Pinch-to-zoom & Pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      panStartRef.current = { ...pan };
      dragDistanceRef.current = 0;
      setIsDragging(true);

      // Detect double tap
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap triggered
        if (scale > 1) {
          resetZoom();
        } else {
          setScale(2.2);
        }
      }
      lastTapRef.current = now;
    } else if (e.touches.length === 2) {
      // Pinch gesture start
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialTouchDistanceRef.current = dist;
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && scale > 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      dragDistanceRef.current += Math.hypot(dx, dy);
      const nextPan = clampPan(panStartRef.current.x + dx, panStartRef.current.y + dy, scale);
      setPan(nextPan);
    } else if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
      // Pinching
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / initialTouchDistanceRef.current;
      const newScale = Math.min(4, Math.max(1, +(initialScaleRef.current * ratio).toFixed(2)));
      setScale(newScale);
      if (newScale === 1) {
        setPan({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialTouchDistanceRef.current = null;
    if (scale <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[120] flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white select-none overflow-hidden touch-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Top Header Bar */}
        <div className="relative z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          {/* Product Info & GSM Badge */}
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {gsm}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  HIGH-RES WEAVE INSPECTION
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold font-display uppercase tracking-wider text-white truncate max-w-[200px] sm:max-w-md">
                {productName}
              </h2>
            </div>
          </div>

          {/* Right Controls: Zoom Level & Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-neutral-900/80 border border-neutral-800 rounded-full px-2 py-1 backdrop-blur-md">
              <button
                type="button"
                onClick={zoomOut}
                disabled={scale <= 1}
                aria-label="Zoom out"
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-mono text-neutral-300 font-bold px-2 min-w-[44px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={zoomIn}
                disabled={scale >= 4}
                aria-label="Zoom in"
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {scale > 1 && (
                <button
                  type="button"
                  onClick={resetZoom}
                  title="Reset Zoom (0)"
                  className="p-1.5 rounded-full text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Zoom Reset badge */}
            {scale > 1 && (
              <button
                type="button"
                onClick={resetZoom}
                className="sm:hidden px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Lightbox"
              className="p-2.5 sm:p-3 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Main Stage */}
        <div
          className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            // If clicking the backdrop outside image, close
            if (e.target === e.currentTarget && dragDistanceRef.current < 6) {
              onClose();
            }
          }}
        >
          {/* Left Arrow (Desktop & Mobile) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-white/80 hover:text-white border border-neutral-800/80 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-2xl"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow (Desktop & Mobile) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-white/80 hover:text-white border border-neutral-800/80 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-2xl"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Scalable & Pannable High-Res Image Container */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center transition-transform ease-out"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
              transitionDuration: isDragging ? '0ms' : '220ms',
              cursor: scale > 1 ? 'grab' : 'zoom-in'
            }}
            onClick={handleImageClick}
          >
            <img
              src={currentImage}
              alt={`${productName} - Angle ${currentIndex + 1}`}
              referrerPolicy="no-referrer"
              draggable={false}
              className="max-w-[92vw] max-h-[75vh] sm:max-h-[82vh] object-contain rounded-xl shadow-2xl pointer-events-auto"
            />
          </div>

          {/* Floating Mobile/Desktop Helper Hint */}
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-800 text-[11px] font-mono text-neutral-300 backdrop-blur-md flex items-center gap-1.5 shadow-xl whitespace-nowrap">
              {scale > 1 ? (
                <>
                  <Move className="w-3 h-3 text-amber-400" />
                  <span>Drag to pan across fabric weave</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Click image or '+' to zoom in • Double-tap on mobile</span>
                  <span className="sm:hidden">Double-tap or pinch to inspect weave</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Angle Thumbnails & Image Count */}
        <div className="relative z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Counter */}
          <div className="text-xs font-mono text-neutral-400 font-semibold order-2 sm:order-1">
            VIEWING <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(images.length).padStart(2, '0')}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full px-2 py-1 order-1 sm:order-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    resetZoom();
                  }}
                  className={`relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                    currentIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                      : 'border-neutral-800 opacity-50 hover:opacity-100 hover:border-neutral-600'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Angle thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard tip (Desktop only) */}
          <div className="hidden sm:block text-[11px] font-mono text-neutral-500 order-3">
            [ESC] Close • [← / →] Angles • [+/-] Zoom
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

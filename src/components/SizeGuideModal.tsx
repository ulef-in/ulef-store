import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Ruler, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [userHeight, setUserHeight] = useState('5\'11" (180 cm)');
  const [userWeight, setUserWeight] = useState('78 kg (172 lbs)');
  const [recommendedSize, setRecommendedSize] = useState('L');

  if (!isSizeGuideOpen) return null;

  const measurements = {
    in: [
      { size: 'XS', chest: '42.0"', length: '27.5"', shoulder: '21.0"', sleeve: '8.5"' },
      { size: 'S', chest: '44.5"', length: '28.5"', shoulder: '22.0"', sleeve: '9.0"' },
      { size: 'M', chest: '47.0"', length: '29.5"', shoulder: '23.0"', sleeve: '9.5"' },
      { size: 'L', chest: '49.5"', length: '30.5"', shoulder: '24.0"', sleeve: '10.0"' },
      { size: 'XL', chest: '52.0"', length: '31.5"', shoulder: '25.0"', sleeve: '10.5"' },
      { size: 'XXL', chest: '54.5"', length: '32.5"', shoulder: '26.0"', sleeve: '11.0"' },
      { size: 'XXXL', chest: '57.0"', length: '33.5"', shoulder: '27.0"', sleeve: '11.5"' },
    ],
    cm: [
      { size: 'XS', chest: '107 cm', length: '70 cm', shoulder: '53 cm', sleeve: '22 cm' },
      { size: 'S', chest: '113 cm', length: '72 cm', shoulder: '56 cm', sleeve: '23 cm' },
      { size: 'M', chest: '119 cm', length: '75 cm', shoulder: '58 cm', sleeve: '24 cm' },
      { size: 'L', chest: '126 cm', length: '77 cm', shoulder: '61 cm', sleeve: '25 cm' },
      { size: 'XL', chest: '132 cm', length: '80 cm', shoulder: '63 cm', sleeve: '27 cm' },
      { size: 'XXL', chest: '138 cm', length: '82 cm', shoulder: '66 cm', sleeve: '28 cm' },
      { size: 'XXXL', chest: '145 cm', length: '85 cm', shoulder: '68 cm', sleeve: '29 cm' },
    ]
  };

  const handleRecommend = (build: string) => {
    if (build === 'slim') setRecommendedSize('M');
    else if (build === 'regular') setRecommendedSize('L');
    else setRecommendedSize('XL');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSizeGuideOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display tracking-tight">
                  ARCHITECTURAL FIT & SIZE MATRIX
                </h3>
                <p className="text-xs text-neutral-400">
                  Engineered Drop-Shoulder Boxy Silhouette (True Oversized Cut)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center justify-between my-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Garment Dimensions (Flat Measurement)
            </div>
            <div className="flex items-center p-1 bg-neutral-800 rounded-lg border border-neutral-700">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  unit === 'in' ? 'bg-white text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                INCHES
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  unit === 'cm' ? 'bg-white text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                CENTIMETERS
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60 mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-800/80 text-neutral-400 font-mono uppercase">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest (Pit to Pit × 2)</th>
                  <th className="py-3 px-4">Back Length</th>
                  <th className="py-3 px-4">Shoulder Width</th>
                  <th className="py-3 px-4">Sleeve Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {measurements[unit].map((row) => (
                  <tr
                    key={row.size}
                    className={`hover:bg-neutral-800/40 transition-colors ${
                      row.size === recommendedSize ? 'bg-neutral-800/70 text-white font-bold' : 'text-neutral-300'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white">{row.size}</span>
                      {row.size === recommendedSize && (
                        <span className="px-1.5 py-0.5 rounded bg-white text-neutral-950 text-[10px] font-sans font-bold">
                          BEST FIT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{row.chest}</td>
                    <td className="py-3 px-4">{row.length}</td>
                    <td className="py-3 px-4">{row.shoulder}</td>
                    <td className="py-3 px-4">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Advisor Assistant */}
          <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/80">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Sizing Recommendation Advice
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleRecommend('slim')}
                className="p-3 rounded-lg border border-neutral-700 bg-neutral-900/60 hover:border-neutral-500 text-left transition-all"
              >
                <div className="text-xs font-bold text-white">Fitted Oversized</div>
                <div className="text-[11px] text-neutral-400 mt-1">Size down 1 step for subtle drape without bagginess.</div>
              </button>
              <button
                onClick={() => handleRecommend('regular')}
                className="p-3 rounded-lg border border-white bg-neutral-900 text-left transition-all relative"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Standard ULEF Drape</span>
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-[11px] text-neutral-300 mt-1">True to size. Intended boxy dropped-shoulder silhouette.</div>
              </button>
              <button
                onClick={() => handleRecommend('loose')}
                className="p-3 rounded-lg border border-neutral-700 bg-neutral-900/60 hover:border-neutral-500 text-left transition-all"
              >
                <div className="text-xs font-bold text-white">Ultra Oversized</div>
                <div className="text-[11px] text-neutral-400 mt-1">Size up 1 step for extreme brutalist skate/street length.</div>
              </button>
            </div>
          </div>

          {/* Model Stats note */}
          <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
            <span>Lookbook model: 185 cm / 6'1" • 75 kg • Wearing Size L</span>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="px-4 py-2 rounded-lg bg-white text-neutral-950 font-bold hover:bg-neutral-200 transition-colors"
            >
              Got it, Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

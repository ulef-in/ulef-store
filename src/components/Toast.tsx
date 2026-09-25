import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all ${
              toast.type === 'success'
                ? 'bg-neutral-900/95 text-white border-neutral-800 dark:bg-white/95 dark:text-neutral-950 dark:border-neutral-200'
                : toast.type === 'error'
                ? 'bg-red-950/95 text-red-100 border-red-800 dark:bg-red-50 dark:text-red-950 dark:border-red-200'
                : 'bg-neutral-900/95 text-neutral-100 border-neutral-800 dark:bg-neutral-900 dark:text-white dark:border-neutral-700'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 dark:text-red-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 dark:text-sky-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider font-display">
                {toast.title}
              </h4>
              <p className="text-xs mt-0.5 opacity-80 leading-relaxed line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Toast = ToastContainer;

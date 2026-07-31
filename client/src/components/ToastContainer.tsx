import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastMessage } from '../types/expense';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3.5 ${
                isError
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-100 shadow-glow-accent'
                  : isSuccess
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100 shadow-glow-primary'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              <div className="mt-0.5">
                {isError && <AlertTriangle className="w-5 h-5 text-rose-400" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {!isError && !isSuccess && <Info className="w-5 h-5 text-cyan-400" />}
              </div>

              <div className="flex-1 pr-2">
                <h5 className="text-sm font-bold tracking-tight">{toast.title}</h5>
                {toast.message && (
                  <p className="text-xs opacity-90 mt-1 font-mono leading-relaxed">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => onRemove(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

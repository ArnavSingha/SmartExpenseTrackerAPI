import React from 'react';
import { motion } from 'framer-motion';
import { STANDARD_CATEGORIES } from '../types/expense';
import { Filter, RotateCcw } from 'lucide-react';

interface CategoryFilterPillsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const CategoryFilterPills: React.FC<CategoryFilterPillsProps> = ({
  activeCategory,
  onSelectCategory,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-slate-800/60 py-4">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2 whitespace-nowrap">
          <Filter className="w-3.5 h-3.5 text-purple-400" /> Filter:
        </span>
        
        {STANDARD_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-slate-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterBubble"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-xl -z-10 shadow-glow-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              {cat}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="self-end sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-2 transition-all disabled:opacity-50 hover:shadow-sm"
        title="Force sync with local JSON database"
      >
        <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="font-mono">Sync Storage</span>
      </button>
    </div>
  );
};

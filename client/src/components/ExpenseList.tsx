import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense } from '../types/expense';
import { Trash2, Calendar, Tag, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onDelete: (id: string, title: string) => void;
  activeCategory: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  'Infrastructure': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  'Meals & Catering': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  'Travel & Transit': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  'Software & SaaS': 'bg-pink-500/10 text-pink-300 border-pink-500/30',
  'Hardware & Equipment': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  'General & Misc': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
};

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading, onDelete, activeCategory }) => {
  if (isLoading && expenses.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-sm">Fetching atomic JSON records via REST API...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="my-8 glass-card p-12 text-center border-dashed border-slate-800 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-semibold text-slate-300 mb-1">No Expenses Recorded</h4>
        <p className="text-sm text-slate-500 max-w-md">
          {activeCategory === 'All'
            ? 'Your financial dataset is completely clean. Click "Record New Expense" to test atomic file writes.'
            : `No expenditure items matched the category tag "${activeCategory}".`}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="my-6 space-y-3.5">
      <AnimatePresence mode="popLayout">
        {expenses.map((expense) => {
          const badgeStyle = CATEGORY_STYLES[expense.category] || 'bg-slate-800 text-slate-300 border-slate-700';

          return (
            <motion.div
              key={expense.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group glass-card-hover"
            >
              {/* Left Column: Title & Metadata */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-200 transition-colors flex items-center gap-1.5">
                    <span>{expense.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  
                  {/* Category Chip */}
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium whitespace-nowrap flex items-center gap-1 ${badgeStyle}`}>
                    <Tag className="w-3 h-3" />
                    <span>{expense.category}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{expense.date}</span>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 truncate max-w-[150px] sm:max-w-xs" title={expense.id}>
                    UUID: {expense.id}
                  </span>
                </div>
              </div>

              {/* Right Column: Price & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 block font-mono">Amount</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                    ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Delete Trigger Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(expense.id, expense.title)}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors shadow-sm"
                  title="Permanently remove from JSON disk (DELETE /api/expenses/:id)"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

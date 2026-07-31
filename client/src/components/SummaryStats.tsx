import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseSummary, Expense } from '../types/expense';
import { DollarSign, PieChart, TrendingUp, Layers, Flame, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

interface SummaryStatsProps {
  summary: ExpenseSummary;
  expenses: Expense[];
  onOpenModal: () => void;
}

const COLOR_PALETTE = [
  'from-purple-500 to-indigo-500 text-purple-400 border-purple-500/30',
  'from-cyan-500 to-blue-500 text-cyan-400 border-cyan-500/30',
  'from-emerald-500 to-teal-500 text-emerald-400 border-emerald-500/30',
  'from-pink-500 to-rose-500 text-pink-400 border-pink-500/30',
  'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30',
  'from-blue-500 to-violet-500 text-blue-400 border-blue-500/30',
];

export const SummaryStats: React.FC<SummaryStatsProps> = ({ summary, expenses, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<'distribution' | 'impact'>('distribution');
  const [budgetCause, setBudgetCause] = useState<number>(10000);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [budgetInput, setBudgetInput] = useState<string>('10000');

  const categories = Object.entries(summary.byCategory);
  const totalAmount = summary.total || 0;
  const budgetPercentage = Math.min((totalAmount / budgetCause) * 100, 100);

  // Determine budget status coloring & glow
  const isOver90 = (totalAmount / budgetCause) >= 0.9;
  const isOver70 = (totalAmount / budgetCause) >= 0.7 && !isOver90;
  
  const budgetGlowStyle = isOver90
    ? 'shadow-rose-500/20 border-rose-500/60'
    : isOver70
    ? 'shadow-amber-500/20 border-amber-500/60'
    : 'border-slate-800/80';

  // Top Impact expenses sorted by dollar amount
  const topImpactExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const maxExpenseAmount = topImpactExpenses.length > 0 ? topImpactExpenses[0].amount : 1;

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetInput);
    if (!isNaN(parsed) && parsed > 0) {
      setBudgetCause(parsed);
    }
    setIsEditingBudget(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* Hero Card: Cumulative Spending & Interactive Budget Thermometer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`lg:col-span-1 glass-card p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${budgetGlowStyle}`}
      >
        <div className={`absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-3xl transition-all pointer-events-none ${isOver90 ? 'bg-rose-600/25 animate-pulse' : isOver70 ? 'bg-amber-600/20' : 'bg-purple-600/20 animate-pulse-glow'}`} />

        <div>
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" /> Cumulative Total
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Live Aggregate
            </span>
          </div>

          <div className="my-2">
            <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-baseline">
              <span className="text-2xl text-slate-400 mr-1">$</span>
              {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Across <strong className="text-slate-200">{summary.count}</strong> atomic transactions</span>
            </p>
          </div>

          {/* Interactive Editable Budget Cap Thermometer */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Flame className={`w-3.5 h-3.5 ${isOver90 ? 'text-rose-400 animate-bounce' : isOver70 ? 'text-amber-400' : 'text-purple-400'}`} />
                <span>Budget Utilization</span>
              </span>
              
              {isEditingBudget ? (
                <form onSubmit={handleBudgetSubmit} className="flex items-center gap-1">
                  <span className="text-slate-400">$</span>
                  <input
                    type="number"
                    autoFocus
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onBlur={() => setIsEditingBudget(false)}
                    className="w-20 bg-slate-900 border border-purple-500 rounded px-1.5 py-0.5 text-white font-mono text-xs focus:outline-none"
                  />
                </form>
              ) : (
                <button
                  onClick={() => { setBudgetInput(budgetCause.toString()); setIsEditingBudget(true); }}
                  className="font-mono text-slate-300 hover:text-cyan-400 transition-colors underline decoration-dotted"
                  title="Click to customize monthly budget threshold ($)"
                >
                  Cap: ${budgetCause.toLocaleString()}
                </button>
              )}
            </div>

            {/* Glowing Thermometer Gauge */}
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${Math.max(budgetPercentage, 2)}%` }}
                className={`h-full transition-all duration-700 rounded-full ${isOver90 ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-glow-accent' : isOver70 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500'}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono mt-1.5">
              <span className={isOver90 ? 'text-rose-300 font-bold' : isOver70 ? 'text-amber-300' : 'text-slate-400'}>
                {((totalAmount / budgetCause) * 100).toFixed(1)}% Consumed
              </span>
              <span className="text-slate-500">
                {isOver90 ? '⚠️ Budget Danger!' : isOver70 ? '⚡ Approaching Cap' : '✓ Healthy Margin'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-glow-primary transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
        >
          <Layers className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span>Record New Expense</span>
        </button>
      </motion.div>

      {/* Tabbed Analytics Canvas: Distribution vs. Top Impact Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-2 glass-card p-6 flex flex-col justify-between"
      >
        <div>
          {/* Top Tab Headers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('distribution')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'distribution' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                <span>Category Distribution</span>
              </button>
              <button
                onClick={() => setActiveTab('impact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'impact' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Top Impact Chart</span>
              </button>
            </div>
            <span className="text-xs text-slate-400 font-mono self-end sm:self-auto">GET /api/expenses/summary</span>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'distribution' ? (
              <motion.div
                key="dist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="my-4"
              >
                {/* Visual Percentage Progress Bar */}
                <div className="h-4 w-full bg-slate-950/80 rounded-full overflow-hidden flex gap-0.5 my-2 border border-slate-800/80 p-0.5">
                  {categories.length === 0 ? (
                    <div className="h-full w-full bg-slate-800 rounded-full opacity-50 flex items-center justify-center text-[10px] text-slate-400 font-mono">No data</div>
                  ) : (
                    categories.map(([cat, amount], idx) => {
                      const percent = (amount / totalAmount) * 100;
                      const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                      const gradient = palette.split(' ').slice(0, 2).join(' ');
                      return (
                        <div
                          key={cat}
                          style={{ width: `${Math.max(percent, 4)}%` }}
                          title={`${cat}: $${amount.toFixed(2)} (${percent.toFixed(1)}%)`}
                          className={`h-full bg-gradient-to-r ${gradient} first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group cursor-pointer`}
                        />
                      );
                    })
                  )}
                </div>

                {/* Category Legend Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 mt-4 max-h-44 overflow-y-auto pr-1">
                  {categories.length === 0 ? (
                    <p className="text-xs text-slate-500 italic col-span-full py-6 text-center font-mono">
                      No expenditures recorded yet. Click "Inject Demo Data" above to simulate enterprise activity!
                    </p>
                  ) : (
                    categories.map(([cat, amount], idx) => {
                      const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                      const textColor = palette.split(' ')[2];
                      const borderColor = palette.split(' ')[3];
                      const percent = ((amount / totalAmount) * 100).toFixed(1);

                      return (
                        <div 
                          key={cat}
                          className={`p-3 rounded-xl bg-slate-950/60 border ${borderColor} flex flex-col justify-between transition-all hover:bg-slate-900`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-300 truncate mr-1" title={cat}>{cat}</span>
                            <span className={`font-mono text-[11px] ${textColor}`}>{percent}%</span>
                          </div>
                          <span className="text-sm font-bold text-white font-mono">
                            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="impact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="my-3 space-y-3 max-h-56 overflow-y-auto pr-1"
              >
                {topImpactExpenses.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-8 text-center font-mono">
                    No transactions available to evaluate impact rankings.
                  </p>
                ) : (
                  topImpactExpenses.map((exp, idx) => {
                    const ratio = (exp.amount / maxExpenseAmount) * 100;
                    const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                    const gradient = palette.split(' ').slice(0, 2).join(' ');
                    const textColor = palette.split(' ')[2];

                    return (
                      <div key={exp.id} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-200 truncate mr-2 flex items-center gap-1.5">
                            <span className={`font-mono font-bold ${textColor}`}>#{idx + 1}</span>
                            <span>{exp.title}</span>
                          </span>
                          <span className="font-mono font-bold text-white whitespace-nowrap">
                            ${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        {/* Horizontal Animated Impact Bar */}
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(ratio, 4)}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

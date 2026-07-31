import React, { useState } from 'react';
import { Sparkles, Terminal, FileText, Activity, Zap, Download, FileSpreadsheet, FileCode, ChevronDown, Loader2 } from 'lucide-react';
import { Expense } from '../types/expense';

interface NavbarProps {
  onSeedDemo: () => void;
  isSeeding: boolean;
  expenses: Expense[];
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSeedDemo, isSeeding, expenses, onToast }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportCSV = () => {
    if (expenses.length === 0) {
      onToast('error', 'Export Error', 'Cannot export an empty dataset. Add records first.');
      return;
    }
    const headers = 'UUID,Title,Amount (USD),Category,Date\n';
    const rows = expenses.map(e => `"${e.id}","${e.title.replace(/"/g, '""')}",${e.amount},"${e.category}","${e.date}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `enterprise_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowExportMenu(false);
    onToast('success', 'CSV Report Exported', 'Downloaded formatted financial audit spreadsheet.');
  };

  const exportJSON = () => {
    if (expenses.length === 0) {
      onToast('error', 'Export Error', 'Cannot export an empty dataset. Add records first.');
      return;
    }
    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `system_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowExportMenu(false);
    onToast('success', 'JSON Snapshot Exported', 'Downloaded raw persistent repository backup.');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand Title with Gradient Glow */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 p-0.5 shadow-glow-primary flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
              Smart Expense <span className="gradient-text">Tracker</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono flex items-center gap-1.5 truncate">
              <Terminal className="w-3 h-3 text-cyan-400" /> Enterprise Autonomous System
            </p>
          </div>
        </div>

        {/* Right Nav Action Suite */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* One-Click Enterprise Demo Seeder */}
          <button
            onClick={onSeedDemo}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/40 hover:border-emerald-400 transition-all text-xs sm:text-sm font-semibold text-emerald-200 hover:text-white shadow-sm hover:shadow-glow-primary disabled:opacity-60 transform active:scale-95"
            title="Inject 8 realistic enterprise transactions staggered in real-time"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="hidden md:inline">Injecting Demo...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-bounce" />
                <span>Inject Demo Data</span>
              </>
            )}
          </button>

          {/* Export Portal Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs sm:text-sm font-medium text-slate-200 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Export Audit</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={exportCSV}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="block font-semibold">Download CSV Audit Table</span>
                    <span className="text-[10px] text-slate-400 font-mono">Excel & Google Sheets ready</span>
                  </div>
                </button>
                <div className="h-px bg-slate-800 my-1" />
                <button
                  onClick={exportJSON}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors text-left"
                >
                  <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="block font-semibold">Download JSON Snapshot</span>
                    <span className="text-[10px] text-slate-400 font-mono">Raw persistent storage dump</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* OpenAPI Swagger Portal Button */}
          <a
            href="http://localhost:3000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/30 hover:to-cyan-600/30 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-200 text-sm font-medium text-purple-200 hover:text-white shadow-sm hover:shadow-glow-accent group"
          >
            <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>OpenAPI Docs</span>
          </a>
        </div>
      </div>
    </header>
  );
};

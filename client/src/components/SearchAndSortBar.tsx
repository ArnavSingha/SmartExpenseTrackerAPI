import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { SortOption } from '../types/expense';

interface SearchAndSortBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const SearchAndSortBar: React.FC<SearchAndSortBarProps> = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="mt-4 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
      {/* Live Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Instant filter by keywords (e.g., AWS, Nobu, Figma, 489)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors p-0.5"
            title="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sorting Control Dropdown */}
      <div className="flex items-center space-x-2 shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" /> Sort By:
        </span>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer"
        >
          <option value="newest" className="bg-slate-900">Date: Newest First</option>
          <option value="oldest" className="bg-slate-900">Date: Oldest First</option>
          <option value="highest" className="bg-slate-900">Amount: Highest First ($$$)</option>
          <option value="lowest" className="bg-slate-900">Amount: Lowest First ($)</option>
          <option value="title" className="bg-slate-900">Title: Alphabetical (A → Z)</option>
        </select>
      </div>
    </div>
  );
};

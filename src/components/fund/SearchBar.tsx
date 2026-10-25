'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, TrendingUp, Sparkles, Building2, Tag, ChevronRight, X } from 'lucide-react';
import { FundSummary } from '@/types/fund';

interface SearchBarProps {
  onSelectFund: (schemeCode: string) => void;
  selectedSchemeCode?: string;
}

const FEATURED_FUNDS = [
  { code: '122639', name: 'Parag Parikh Flexi Cap Fund', tag: 'Flexi Cap' },
  { code: '120828', name: 'Quant Small Cap Fund', tag: 'Small Cap' },
  { code: '120716', name: 'HDFC Top 100 Fund', tag: 'Large Cap' },
  { code: '120503', name: 'Mirae Asset Large & Midcap', tag: 'Large & Mid' },
  { code: '119551', name: 'Aditya Birla Banking & PSU Debt', tag: 'Debt' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectFund, selectedSchemeCode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FundSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/funds/search?q=${encodeURIComponent(query.trim())}&limit=12`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onSelectFund(code);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search 15,000+ Mutual Funds by Scheme Name, AMC, or Code (e.g. Parag Parikh, HDFC, 122639)..."
          className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm dark:shadow-lg dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Quick Pills */}
      <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Popular:
        </span>
        {FEATURED_FUNDS.map((fund) => {
          const isSelected = selectedSchemeCode === fund.code;
          return (
            <button
              key={fund.code}
              onClick={() => onSelectFund(fund.code)}
              className={`shrink-0 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-medium ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 shadow-xs'
              }`}
            >
              <span>{fund.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-slate-900/20 text-slate-950' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {fund.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Autocomplete Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Direct AMFI Search Results ({results.length})</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Live NAV Feed</span>
          </div>

          {results.map((fund) => (
            <div
              key={fund.schemeCode}
              onClick={() => handleSelect(fund.schemeCode)}
              className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/90 cursor-pointer transition-colors flex items-center justify-between group"
            >
              <div className="flex-1 pr-4 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    #{fund.schemeCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      fund.planType === 'Direct'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {fund.planType}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                    {fund.optionType}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{fund.category}</span>
                </div>

                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {fund.schemeName}
                </h4>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    {fund.amc}
                  </span>
                  <span>•</span>
                  <span>Updated: {fund.date}</span>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center gap-3">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Current NAV</div>
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ₹{fund.nav > 0 ? fund.nav.toFixed(2) : 'N/A'}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

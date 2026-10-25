'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FundDetail, FundSummary } from '@/types/fund';
import {
  Search,
  Plus,
  X,
  Building2,
  CheckCircle2,
  Sparkles,
  Loader2,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface FundSlotSelectorProps {
  slotIndex: number;
  fundDetail: FundDetail | null;
  color: string;
  onSelectFund: (schemeCode: string) => void;
  onRemoveFund?: () => void;
  isLoading?: boolean;
}

const PRESETS = [
  { code: '122639', name: 'Parag Parikh Flexi Cap' },
  { code: '120828', name: 'Quant Small Cap' },
  { code: '120716', name: 'HDFC Top 100' },
  { code: '120503', name: 'Mirae Asset Large & Midcap' },
  { code: '119551', name: 'Aditya Birla Banking & PSU' }
];

export const FundSlotSelector: React.FC<FundSlotSelectorProps> = ({
  slotIndex,
  fundDetail,
  color,
  onSelectFund,
  onRemoveFund,
  isLoading
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FundSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/funds/search?q=${encodeURIComponent(query.trim())}&limit=8`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePick = (code: string) => {
    onSelectFund(code);
    setQuery('');
    setIsOpen(false);
    setIsReplacing(false);
  };

  // If fund is selected and not in replacement mode
  if (fundDetail && !isReplacing) {
    const isPositive = fundDetail.oneDayChange.amount >= 0;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4 transition-colors duration-200">
        {/* Top colored accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: color }}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Fund #{slotIndex + 1}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsReplacing(true)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
                title="Change Fund"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {onRemoveFund && (
                <button
                  onClick={onRemoveFund}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs transition-colors"
                  title="Remove Slot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                #{fundDetail.summary.schemeCode}
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {fundDetail.summary.planType}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {fundDetail.summary.category}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2">
              {fundDetail.summary.schemeName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{fundDetail.summary.amc}</p>
          </div>
        </div>

        {/* Bottom NAV preview */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-end justify-between">
          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Latest NAV</span>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              ₹{fundDetail.summary.nav > 0 ? fundDetail.summary.nav.toFixed(2) : 'N/A'}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {isPositive ? '+' : ''}{fundDetail.oneDayChange.percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Empty slot or search mode
  return (
    <div
      className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-xl relative space-y-4 transition-colors duration-200"
      ref={dropdownRef}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Fund #{slotIndex + 1}
          </span>
        </div>
        {isReplacing && (
          <button
            onClick={() => setIsReplacing(false)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search by Scheme Name or Code..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
        />
      </div>

      {/* Quick Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Quick Add:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.code}
              onClick={() => handlePick(p.code)}
              className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((r, idx) => (
            <div
              key={`${r.schemeCode}-${idx}`}
              onClick={() => handlePick(r.schemeCode)}
              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                  #{r.schemeCode}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{r.nav > 0 ? r.nav.toFixed(2) : 'N/A'}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{r.schemeName}</h5>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>{r.amc}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{r.planType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, ArrowLeftRight, Check, Loader2, Sparkles, Building2, Tag } from 'lucide-react';
import { FundSummary } from '@/types/fund';

interface FundOverlapSelectorProps {
  fundA: FundSummary | null;
  fundB: FundSummary | null;
  onSelectFundA: (schemeCode: string) => void;
  onSelectFundB: (schemeCode: string) => void;
  onSwapFunds: () => void;
}

export const FundOverlapSelector: React.FC<FundOverlapSelectorProps> = ({
  fundA,
  fundB,
  onSelectFundA,
  onSelectFundB,
  onSwapFunds
}) => {
  // Search state for Slot A
  const [queryA, setQueryA] = useState<string>('');
  const [resultsA, setResultsA] = useState<FundSummary[]>([]);
  const [isSearchingA, setIsSearchingA] = useState<boolean>(false);
  const [isOpenA, setIsOpenA] = useState<boolean>(false);

  // Search state for Slot B
  const [queryB, setQueryB] = useState<string>('');
  const [resultsB, setResultsB] = useState<FundSummary[]>([]);
  const [isSearchingB, setIsSearchingB] = useState<boolean>(false);
  const [isOpenB, setIsOpenB] = useState<boolean>(false);

  const containerRefA = useRef<HTMLDivElement>(null);
  const containerRefB = useRef<HTMLDivElement>(null);

  // Search debouncing for Slot A
  useEffect(() => {
    if (!queryA.trim() || queryA.length < 2) {
      setResultsA([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingA(true);
      try {
        const res = await axios.get(`/api/funds/search?q=${encodeURIComponent(queryA)}&limit=8`);
        if (res.data?.success) {
          setResultsA(res.data.results);
          setIsOpenA(true);
        }
      } catch (err) {
        console.error('Error searching fund A:', err);
      } finally {
        setIsSearchingA(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [queryA]);

  // Search debouncing for Slot B
  useEffect(() => {
    if (!queryB.trim() || queryB.length < 2) {
      setResultsB([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingB(true);
      try {
        const res = await axios.get(`/api/funds/search?q=${encodeURIComponent(queryB)}&limit=8`);
        if (res.data?.success) {
          setResultsB(res.data.results);
          setIsOpenB(true);
        }
      } catch (err) {
        console.error('Error searching fund B:', err);
      } finally {
        setIsSearchingB(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [queryB]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRefA.current && !containerRefA.current.contains(e.target as Node)) {
        setIsOpenA(false);
      }
      if (containerRefB.current && !containerRefB.current.contains(e.target as Node)) {
        setIsOpenB(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const PRESETS = [
    { label: 'PPFAS vs. HDFC Flexi Cap', a: '122639', b: '118989' },
    { label: 'Quant vs. Nippon Small Cap', a: '120828', b: '118778' },
    { label: 'HDFC Top 100 vs. ICICI Bluechip', a: '120716', b: '120586' },
    { label: 'Mirae Large & Midcap vs. PPFAS', a: '120503', b: '122639' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-5 transition-colors duration-200">
      {/* Top Title & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Select Funds for Overlap Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search from 15,000+ official AMFI schemes or click a preset
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                onSelectFundA(p.a);
                onSelectFundB(p.b);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/80 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Search Input Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        {/* Slot A Input */}
        <div ref={containerRefA} className="lg:col-span-5 relative space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Primary Fund (Fund A)
            </span>
            {fundA && (
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                Code: {fundA.schemeCode}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={fundA ? fundA.schemeName : 'Search Fund A (e.g. Parag Parikh Flexi Cap)...'}
              value={queryA}
              onChange={(e) => {
                setQueryA(e.target.value);
                setIsOpenA(true);
              }}
              onFocus={() => setIsOpenA(true)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {isSearchingA ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown A */}
          {isOpenA && resultsA.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {resultsA.map((r, idx) => (
                <button
                  key={`${r.schemeCode}-${idx}`}
                  onClick={() => {
                    onSelectFundA(r.schemeCode);
                    setQueryA('');
                    setIsOpenA(false);
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors space-y-1 text-xs group"
                >
                  <div className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {r.schemeName}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                      {r.planType}
                    </span>
                    <span>{r.category}</span>
                    <span className="ml-auto font-mono text-emerald-600 dark:text-emerald-400">₹{r.nav}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button (Middle) */}
        <div className="lg:col-span-1 flex justify-center">
          <button
            onClick={onSwapFunds}
            title="Swap Fund A and Fund B"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slot B Input */}
        <div ref={containerRefB} className="lg:col-span-5 relative space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Comparison Fund (Fund B)
            </span>
            {fundB && (
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                Code: {fundB.schemeCode}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={fundB ? fundB.schemeName : 'Search Fund B (e.g. HDFC Flexi Cap)...'}
              value={queryB}
              onChange={(e) => {
                setQueryB(e.target.value);
                setIsOpenB(true);
              }}
              onFocus={() => setIsOpenB(true)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {isSearchingB ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown B */}
          {isOpenB && resultsB.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {resultsB.map((r, idx) => (
                <button
                  key={`${r.schemeCode}-${idx}`}
                  onClick={() => {
                    onSelectFundB(r.schemeCode);
                    setQueryB('');
                    setIsOpenB(false);
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors space-y-1 text-xs group"
                >
                  <div className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {r.schemeName}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                      {r.planType}
                    </span>
                    <span>{r.category}</span>
                    <span className="ml-auto font-mono text-blue-600 dark:text-blue-400">₹{r.nav}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

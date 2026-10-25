'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { SearchBar } from '@/components/fund/SearchBar';
import { SipCalculator } from '@/components/calculator/SipCalculator';
import { FundDetail } from '@/types/fund';
import {
  Calculator,
  TrendingUp,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function CalculatorPage() {
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('122639'); // Parag Parikh Flexi Cap
  const [fundDetail, setFundDetail] = useState<FundDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFund = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/funds/${code}`);
      const data = await res.json();
      if (data.success && data.fund) {
        setFundDetail(data.fund);
        setSelectedSchemeCode(code);
      } else {
        setError(data.error || 'Failed to load fund details');
      }
    } catch (err: any) {
      console.error('Error loading fund for SIP calculator:', err);
      setError('Network connection error while contacting AMFI parser');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFund(selectedSchemeCode);
  }, [selectedSchemeCode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Historical SIP & Wealth Growth Calculator
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                Real AMFI NAVs
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulate actual unit purchases on the 1st trading day of each month and calculate realistic XIRR and compounding wealth growth.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Zero Linear Estimations • Real Price Data</span>
          </div>
        </div>

        {/* Fund Picker Search Strip */}
        <div className="space-y-2">
          <SearchBar
            onSelectFund={(code) => loadFund(code)}
            selectedSchemeCode={selectedSchemeCode}
          />
        </div>

        {/* Active Fund Header Pill */}
        {fundDetail && !isLoading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm dark:shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  #{fundDetail.summary.schemeCode}
                </span>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {fundDetail.summary.planType}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{fundDetail.summary.category}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {fundDetail.summary.schemeName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {fundDetail.summary.amc}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Latest NAV</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                ₹{fundDetail.summary.nav > 0 ? fundDetail.summary.nav.toFixed(4) : 'N/A'}
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">as of {fundDetail.summary.date}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Fetching daily historical NAV series and calculating monthly SIP unit allocations...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 dark:text-rose-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-rose-700 dark:text-rose-200">Unable to Load Fund</h3>
              <p className="text-xs text-rose-600 dark:text-rose-300/80 mt-1">{error}</p>
            </div>
            <button
              onClick={() => loadFund(selectedSchemeCode)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loaded Calculator */}
        {!isLoading && !error && fundDetail && (
          <SipCalculator
            fund={fundDetail}
            onSelectFund={(code) => loadFund(code)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="font-bold text-slate-700 dark:text-slate-200">Mutual Fund Value Screener Calculator</span>
            <span>— Exact Historical SIP Backtest</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Newton-Raphson XIRR Engine</span>
            <span>•</span>
            <span>Direct AMFI Data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

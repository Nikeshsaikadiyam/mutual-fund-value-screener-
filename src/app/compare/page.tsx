'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { FundSlotSelector } from '@/components/compare/FundSlotSelector';
import { ComparisonChart, CompareFundItem } from '@/components/compare/ComparisonChart';
import { ComparisonTable } from '@/components/compare/ComparisonTable';
import { FundDetail } from '@/types/fund';
import {
  Scale,
  Sparkles,
  Plus,
  Loader2,
  TrendingUp,
  Layers,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const SLOT_COLORS = ['#10b981', '#f59e0b', '#a855f7'];

export default function ComparePage() {
  // Up to 3 selected scheme codes
  const [selectedCodes, setSelectedCodes] = useState<string[]>([
    '122639', // Parag Parikh Flexi Cap
    '120828', // Quant Small Cap
    '120716'  // HDFC Top 100
  ]);

  const [fundDetails, setFundDetails] = useState<(FundDetail | null)[]>([null, null, null]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all selected funds
  const loadAllFunds = async (codes: string[]) => {
    setIsLoading(true);
    try {
      const promises = codes.map(async (code) => {
        const trimmed = code ? code.trim() : '';
        if (!trimmed) return null;
        try {
          const res = await fetch(`/api/funds/${trimmed}`);
          const data = await res.json();
          return data.success && data.fund ? (data.fund as FundDetail) : null;
        } catch {
          return null;
        }
      });

      const loaded = await Promise.all(promises);
      setFundDetails(loaded);
    } catch (err) {
      console.error('Error loading funds for comparison:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllFunds(selectedCodes);
  }, [selectedCodes]);

  const handleUpdateSlot = (slotIdx: number, newCode: string) => {
    const updated = [...selectedCodes];
    updated[slotIdx] = newCode;
    setSelectedCodes(updated);

    setFundDetails((prev) => {
      const copy = [...prev];
      copy[slotIdx] = null;
      return copy;
    });
  };

  const handleRemoveSlot = (slotIdx: number) => {
    if (selectedCodes.length <= 2) {
      // Clear the fund in this slot
      const updated = [...selectedCodes];
      updated[slotIdx] = '';
      setSelectedCodes(updated);

      setFundDetails((prev) => {
        const copy = [...prev];
        copy[slotIdx] = null;
        return copy;
      });
    } else {
      const updatedCodes = selectedCodes.filter((_, i) => i !== slotIdx);
      setSelectedCodes(updatedCodes);
      setFundDetails((prev) => prev.filter((_, i) => i !== slotIdx));
    }
  };

  const handleAddSlot = () => {
    if (selectedCodes.length < 3) {
      setSelectedCodes([...selectedCodes, '120503']); // Mirae Asset Large & Midcap default
      setFundDetails((prev) => [...prev, null]);
    }
  };

  // Build active items for comparison components - strictly filter out nulls/empty and deduplicate
  const activeCompareItems: CompareFundItem[] = [];
  const seenCodes = new Set<string>();

  fundDetails.forEach((fd, idx) => {
    if (
      fd &&
      fd.summary &&
      fd.summary.schemeCode &&
      selectedCodes[idx] &&
      !seenCodes.has(fd.summary.schemeCode)
    ) {
      seenCodes.add(fd.summary.schemeCode);
      activeCompareItems.push({
        fund: fd,
        color: SLOT_COLORS[idx % SLOT_COLORS.length]
      });
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Multi-Fund Comparison Engine
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                Direct AMFI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select up to 3 mutual funds to compare normalized CAGR trajectories, risk-adjusted ratios, and portfolio expense structures.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {selectedCodes.length < 3 && (
              <button
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Add 3rd Fund Slot
              </button>
            )}
            <button
              onClick={() => setSelectedCodes(['122639', '120828', '120716'])}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* 3-Column Slot Selectors */}
        <div className={`grid grid-cols-1 ${selectedCodes.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
          {selectedCodes.map((code, idx) => (
            <FundSlotSelector
              key={`slot-${idx}`}
              slotIndex={idx}
              fundDetail={fundDetails[idx] || null}
              color={SLOT_COLORS[idx % SLOT_COLORS.length]}
              onSelectFund={(newCode) => handleUpdateSlot(idx, newCode)}
              onRemoveFund={() => handleRemoveSlot(idx)}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Synchronizing multi-fund historical NAV feeds and computing normalized trajectories...
            </p>
          </div>
        )}

        {/* Comparison Visualizations and Table */}
        {!isLoading && activeCompareItems.length >= 1 && (
          <div className="space-y-8">
            {/* 1. Normalized Overlaid Recharts Line Chart */}
            <ComparisonChart funds={activeCompareItems} />

            {/* 2. Side-by-Side Comparison Feature Matrix */}
            <ComparisonTable funds={activeCompareItems} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="font-bold text-slate-700 dark:text-slate-200">Mutual Fund Value Screener Compare</span>
            <span>— Direct AMFI Mutual Fund Multi-Analysis</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Base 100 Relative Compounding</span>
            <span>•</span>
            <span>Zero Intermediaries</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

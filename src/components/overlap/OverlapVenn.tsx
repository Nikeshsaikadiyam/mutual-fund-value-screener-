'use client';

import React from 'react';
import { PortfolioOverlapReport } from '@/lib/overlapCalculator';
import { Layers, PieChart, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface OverlapVennProps {
  report: PortfolioOverlapReport;
}

export const OverlapVenn: React.FC<OverlapVennProps> = ({ report }) => {
  const {
    fundAName,
    fundBName,
    totalOverlapPercentage,
    totalCommonStocks,
    uniqueHoldingsA,
    uniqueHoldingsB,
    uniqueWeightA,
    uniqueWeightB
  } = report;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Venn Intersection & Portfolio Allocation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Breakdown of unique stock weights vs. overlapping capital allocation
          </p>
        </div>
      </div>

      {/* 3-Zone Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative items-stretch">
        {/* Zone 1: Unique to Fund A */}
        <div className="bg-emerald-50/50 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 group hover:border-emerald-500/40 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Unique to Fund A
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate pt-2" title={fundAName}>
              {fundAName}
            </h4>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {uniqueWeightA}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {uniqueHoldingsA.length} Unique Holdings
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
            Exclusive stock bets not held by Fund B
          </div>
        </div>

        {/* Zone 2: Shared Overlapping Capital (Middle Intersection) */}
        <div className="bg-amber-50/50 dark:bg-slate-950 border-2 border-amber-300 dark:border-amber-500/40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-sm dark:shadow-lg shadow-amber-500/5 group hover:border-amber-500/60 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Shared Overlap
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
              Common Intersection
            </h4>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {totalOverlapPercentage}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {totalCommonStocks} Overlapping Stocks
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-amber-700/90 dark:text-amber-400/90 font-medium">
            Duplicated allocation weight
          </div>
        </div>

        {/* Zone 3: Unique to Fund B */}
        <div className="bg-blue-50/50 dark:bg-slate-950/80 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 group hover:border-blue-500/40 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Unique to Fund B
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate pt-2" title={fundBName}>
              {fundBName}
            </h4>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {uniqueWeightB}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {uniqueHoldingsB.length} Unique Holdings
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
            Exclusive stock bets not held by Fund A
          </div>
        </div>
      </div>
    </div>
  );
};

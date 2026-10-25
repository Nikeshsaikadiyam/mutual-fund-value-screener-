'use client';

import React from 'react';
import { FundMetadata, RiskMetrics } from '@/types/fund';
import {
  PieChart,
  Shield,
  Percent,
  Lock,
  Wallet,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface FundSidebarProps {
  metadata: FundMetadata;
  riskMetrics: RiskMetrics;
}

export const FundSidebar: React.FC<FundSidebarProps> = ({ metadata, riskMetrics }) => {
  const formatCurrencyCrores = (val: number) => {
    return new Intl.NumberFormat('en-IN').format(val);
  };

  const isLowExpense = metadata.expenseRatio < metadata.categoryAvgExpenseRatio;

  return (
    <div className="space-y-6">
      {/* 1. Key Fund Facts Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <Layers className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          Fund Essentials & Metadata
        </h3>

        <div className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
          {/* Expense Ratio */}
          <div className="py-3 flex justify-between items-start">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Expense Ratio (Direct)</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Category Avg: {metadata.categoryAvgExpenseRatio}%
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                {metadata.expenseRatio}%
              </span>
              {isLowExpense && (
                <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Low Cost Advantage
                </span>
              )}
            </div>
          </div>

          {/* Exit Load */}
          <div className="py-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Exit Load</span>
            <span className="text-right text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              {metadata.exitLoad}
            </span>
          </div>

          {/* Fund Size / AUM */}
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Fund Size (AUM)</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              ₹{formatCurrencyCrores(metadata.aumCrores)} Cr
            </span>
          </div>

          {/* Lock-in Period */}
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Lock-in Period</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{metadata.lockInPeriod || 'None'}</span>
          </div>

          {/* Min Investment */}
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Min Investment</span>
            <div className="text-right">
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                SIP: ₹{metadata.minSip} | Lumpsum: ₹{metadata.minLumpsum}
              </span>
            </div>
          </div>

          {/* Portfolio Turnover */}
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Portfolio Turnover</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
              {metadata.portfolioTurnoverRatio}%
            </span>
          </div>

          {/* Benchmark Index */}
          <div className="py-3 flex justify-between items-start gap-3">
            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Benchmark</span>
            <span className="text-right text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              {metadata.benchmark}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Risk & Volatility Ratios Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <Activity className="w-4 h-4 text-teal-500 dark:text-teal-400" />
          Risk & Volatility Ratios
        </h3>

        <div className="grid grid-cols-2 gap-3 pt-3">
          {/* Std Dev */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Std Deviation</span>
            <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
              {riskMetrics.standardDeviation}%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Volatility</span>
          </div>

          {/* Sharpe Ratio */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Sharpe Ratio</span>
            <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {riskMetrics.sharpeRatio}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Risk-Adj Return</span>
          </div>

          {/* Beta */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Beta</span>
            <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">
              {riskMetrics.beta}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Market Sensitivity</span>
          </div>

          {/* Alpha */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Alpha</span>
            <span
              className={`text-base font-mono font-bold ${
                riskMetrics.alpha >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {riskMetrics.alpha >= 0 ? '+' : ''}
              {riskMetrics.alpha}%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Excess Return</span>
          </div>
        </div>
      </div>

      {/* 3. Asset Allocation Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <PieChart className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          Asset Class Allocation
        </h3>

        <div className="space-y-3 pt-3">
          {/* Equity */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Equity Holdings</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {metadata.assetAllocation.equity}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metadata.assetAllocation.equity}%` }}
              />
            </div>
          </div>

          {/* Debt */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Debt & Money Market</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {metadata.assetAllocation.debt}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metadata.assetAllocation.debt}%` }}
              />
            </div>
          </div>

          {/* Cash */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Cash & Equivalents</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {metadata.assetAllocation.cashAndEquivalents}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metadata.assetAllocation.cashAndEquivalents}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

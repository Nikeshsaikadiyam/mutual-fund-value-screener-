'use client';

import React from 'react';
import { DebtFundProfile, DirectBond, ArbitrageEconomics } from '@/lib/bondArbitrageEngine';
import {
  TrendingUp,
  Percent,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Layers
} from 'lucide-react';

interface FundBondComparisonCardProps {
  fund: DebtFundProfile;
  bond: DirectBond;
  economics: ArbitrageEconomics;
  isDirectPlan: boolean;
  onTogglePlan: (isDirect: boolean) => void;
}

export const FundBondComparisonCard: React.FC<FundBondComparisonCardProps> = ({
  fund,
  bond,
  economics,
  isDirectPlan,
  onTogglePlan
}) => {
  const isAdvantageous = economics.yieldSpreadBps > 0;

  return (
    <div className="space-y-6">
      {/* Top Yield Spread Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Post-2023 Tax Neutrality Arbitrage
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Slab Rate Tax Neutrality vs. Fee Drag
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                +{economics.yieldSpreadBps} bps
              </span>{' '}
              Net Yield Spread with Direct Bond
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              By purchasing duration-matched AAA secondary corporate bonds directly, you eliminate the{' '}
              <strong className="text-rose-500 dark:text-rose-400">{economics.fundTER.toFixed(2)}%</strong> annual AMC fee drag while locking in predictable contractual cash flows.
            </p>
          </div>

          {/* Plan Toggle (Direct vs Regular) */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Compare Fund Plan
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onTogglePlan(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isDirectPlan
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Direct Plan (TER {fund.directTER}%)
              </button>
              <button
                type="button"
                onClick={() => onTogglePlan(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isDirectPlan
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Regular Plan (TER {fund.regularTER}%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Card: Debt Mutual Fund */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between space-y-6 transition-colors duration-200">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Debt Mutual Fund Vehicle
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pooled AMC Structure
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {fund.category}
              </span>
            </div>

            {/* Scheme Title */}
            <div>
              <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                {fund.schemeName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Benchmark: {fund.benchmarkName} • AUM: ₹{fund.aumCrores.toLocaleString()} Cr
              </p>
            </div>

            {/* Yield Math Breakdown Box */}
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Gross Portfolio YTM (Underlying):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {fund.grossYTM.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-rose-500 dark:text-rose-400 font-medium">
                <span>Annual Management Fee (TER Drag):</span>
                <span className="font-mono font-bold">
                  -{economics.fundTER.toFixed(2)}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Net Investor Yield:
                </span>
                <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">
                  {economics.fundNetYield.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                  Modified Duration:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {fund.modifiedDuration} Years
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                  AAA / SOV Allocation:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {(fund.creditBreakdown.aaa + fund.creditBreakdown.sovereign).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Characteristic */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Open-ended daily NAV • Variable portfolio turnover risk</span>
          </div>
        </div>

        {/* Right Card: Matched Direct Corporate Bond */}
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/40 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-bl-xl shadow-md">
            ★ Direct Arbitrage Match
          </div>

          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Direct Corporate Bond
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Direct Demat Asset
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {bond.rating}
              </span>
            </div>

            {/* Bond Title */}
            <div>
              <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                {bond.issuerName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ISIN: {bond.isin} • {bond.sector}
              </p>
            </div>

            {/* Yield Math Breakdown Box */}
            <div className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Secondary Market YTM (Annualized):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {bond.ytm.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Management Fees (TER):</span>
                <span className="font-mono font-bold">
                  0.00% (Zero Fee Drag)
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Direct Contractual Yield:
                </span>
                <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">
                  {bond.ytm.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                  Residual Maturity:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {bond.durationYears} Years ({bond.maturityDate})
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                  Coupon & Trading Price:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {bond.couponRate}% @ ₹{bond.cleanPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Characteristic */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guaranteed coupon cash flow • Zero mark-to-market redemption risk if held to maturity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

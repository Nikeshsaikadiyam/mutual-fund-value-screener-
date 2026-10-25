'use client';

import React from 'react';
import { ArbitrageEconomics } from '@/lib/bondArbitrageEngine';
import {
  Calculator,
  TrendingUp,
  Coins,
  IndianRupee,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface RupeeSavingsCalculatorProps {
  economics: ArbitrageEconomics;
  capitalAmount: number;
  horizonYears: number;
  isDirectPlan: boolean;
  onCapitalChange: (amount: number) => void;
  onHorizonChange: (years: number) => void;
}

const CAPITAL_PRESETS = [
  { label: '₹10 L', value: 1000000 },
  { label: '₹25 L', value: 2500000 },
  { label: '₹50 L', value: 5000000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2.5 Cr', value: 25000000 },
  { label: '₹5 Cr', value: 50000000 }
];

const HORIZON_PRESETS = [1, 2, 3, 4, 5];

export const RupeeSavingsCalculator: React.FC<RupeeSavingsCalculatorProps> = ({
  economics,
  capitalAmount,
  horizonYears,
  isDirectPlan,
  onCapitalChange,
  onHorizonChange
}) => {
  // Format numbers to Indian currency notation
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            TER Fee Drag & Compounded Rupee Cash Flow Simulator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Simulate the monetary difference over your target holding period
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Arbitrage Math</span>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Capital Amount Input & Preset Pills */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Investment Capital (INR)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={100000}
              step={100000}
              value={capitalAmount}
              onChange={(e) => onCapitalChange(Math.max(10000, Number(e.target.value)))}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {CAPITAL_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onCapitalChange(p.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  capitalAmount === p.value
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Holding Horizon Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Investment Horizon (Years to Maturity)
          </label>
          <div className="flex gap-2">
            {HORIZON_PRESETS.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => onHorizonChange(yr)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  horizonYears === yr
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {yr} {yr === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Comparing compounded returns over a continuous {horizonYears}-year holding window.
          </p>
        </div>
      </div>

      {/* 3 High-Impact Monetary Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Card 1: Annual Extra Cash Flow */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Annual Yield Cash Flow Gain</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            +{formatINR(economics.annualExtraCashFlow)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Extra cash generated every single year directly into your bank account.
          </p>
        </div>

        {/* Card 2: Cumulative Compounded Gain */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
            <span className="font-bold">{horizonYears}-Year Compounded Wealth Advantage</span>
            <Coins className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
            +{formatINR(economics.cumulativeDiffCompounded)}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            Total additional wealth accumulated with direct bonds over {horizonYears} years.
          </p>
        </div>

        {/* Card 3: Total AMC Fee Drag */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-500 dark:text-rose-400">
            <span className="font-semibold">Total AMC Management Fee Drag</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            -{formatINR(economics.totalAmcFeeDrag)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Total fees deducted by the asset management company over the period.
          </p>
        </div>
      </div>

      {/* Terminal Value Comparison Bar */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Projected Maturity Terminal Value ({horizonYears} Years)
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Principal: {formatINR(capitalAmount)}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Direct Bond Bar */}
          <div>
            <div className="flex justify-between text-[11px] pb-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Direct Corporate Bond ({economics.bondDirectYTM}% YTM)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatINR(economics.bondFutureValue)}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Mutual Fund Bar */}
          <div>
            <div className="flex justify-between text-[11px] pb-1">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Debt Mutual Fund ({economics.fundNetYield.toFixed(2)}% Net Yield)
              </span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {formatINR(economics.fundFutureValue)}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(
                    70,
                    (economics.fundFutureValue / economics.bondFutureValue) * 100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

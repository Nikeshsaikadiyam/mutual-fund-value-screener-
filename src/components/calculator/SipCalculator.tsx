'use client';

import React, { useState, useMemo } from 'react';
import { FundDetail } from '@/types/fund';
import { calculateHistoricalSIP, HistoricalSipResult } from '@/lib/sipCalculator';
import { SipChart } from './SipChart';
import {
  Calculator,
  TrendingUp,
  Wallet,
  Sparkles,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Table as TableIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SipCalculatorProps {
  fund: FundDetail;
  onSelectFund?: (schemeCode: string) => void;
}

export const SipCalculator: React.FC<SipCalculatorProps> = ({ fund, onSelectFund }) => {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(10000);
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Compute exact historical SIP result based on fund's daily NAVs
  const sipResult: HistoricalSipResult = useMemo(() => {
    return calculateHistoricalSIP(fund.historicalNav, monthlyAmount, horizonYears);
  }, [fund.historicalNav, monthlyAmount, horizonYears]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const multiplier = sipResult.totalInvested > 0
    ? (sipResult.currentPortfolioValue / sipResult.totalInvested).toFixed(2)
    : '1.00';

  const horizons = [
    { label: '1 Year', years: 1 },
    { label: '3 Years', years: 3 },
    { label: '5 Years', years: 5 },
    { label: '10 Years', years: 10 },
    { label: 'Max (Since Inception)', years: 0 }
  ];

  const presetAmounts = [2000, 5000, 10000, 25000, 50000];

  return (
    <div className="space-y-8">
      {/* 1. Calculator Controls Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Historical SIP Backtest & Wealth Growth Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate actual unit purchases on the 1st of every month at real historical AMFI NAVs
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Newton-Raphson XIRR
            </span>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Monthly Amount Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Monthly SIP Installment (₹)
              </label>
              <div className="text-right">
                <span className="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(monthlyAmount)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">per month</span>
              </div>
            </div>

            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            {/* Amount Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Quick Picks:</span>
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setMonthlyAmount(amt)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                    monthlyAmount === amt
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Investment Horizon Selector */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Investment Horizon
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {horizons.map((h) => {
                const isSelected = horizonYears === h.years;
                return (
                  <button
                    key={h.years}
                    onClick={() => setHorizonYears(h.years)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {h.label}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Backtest Window:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {sipResult.startDate} to {sipResult.endDate} ({sipResult.durationMonths} Installments)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Key Result Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* Card 1: Total Invested */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              Total Capital Invested
            </span>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-200">
              {formatCurrency(sipResult.totalInvested)}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
              {sipResult.durationMonths} Monthly SIPs of {formatCurrency(monthlyAmount)}
            </span>
          </div>

          {/* Card 2: Final Portfolio Value */}
          <div className="bg-emerald-50/50 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Current Portfolio Value
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(sipResult.currentPortfolioValue)}
            </div>
            <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 font-medium block">
              Wealth Multiplier: <strong className="text-emerald-600 dark:text-emerald-400">{multiplier}x</strong>
            </span>
          </div>

          {/* Card 3: Total Profit */}
          <div className="bg-teal-50/40 dark:bg-slate-950/80 border border-teal-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Total Net Profit
            </span>
            <div className="text-2xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
              +{formatCurrency(sipResult.absoluteProfit)}
            </div>
            <span className="text-[11px] text-teal-700/80 dark:text-teal-300/80 font-medium block">
              +{sipResult.absoluteGainPercentage}% Absolute Gain
            </span>
          </div>

          {/* Card 4: Annualized XIRR */}
          <div className="bg-amber-50/40 dark:bg-slate-950/80 border border-amber-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Annualized XIRR
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {sipResult.annualizedXirr.toFixed(2)}%
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
              Internal Rate of Return p.a.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recharts SIP Trajectory Area Chart */}
      <SipChart
        snapshots={sipResult.monthlySnapshots}
        schemeName={fund.summary.schemeName}
      />

      {/* 4. Detailed Monthly Cash Flow & Unit Accumulation Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Monthly SIP Installment & Unit Ledger ({sipResult.monthlySnapshots.length} Months)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Detailed step-by-step breakdown of unit allocation on each historical installment date
            </p>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span>{showTable ? 'Collapse Table' : 'Expand Full Ledger'}</span>
            {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showTable && (
          <div className="overflow-x-auto max-h-96 overflow-y-auto pt-2 border-t border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-950 z-10">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">NAV (₹)</th>
                  <th className="py-2.5 px-3 text-right">Units Bought</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Units</th>
                  <th className="py-2.5 px-3 text-right">Invested Capital</th>
                  <th className="py-2.5 px-3 text-right">Portfolio Value</th>
                  <th className="py-2.5 px-3 text-right">Gain (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                {sipResult.monthlySnapshots.map((snap, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-slate-400 dark:text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans font-medium">{snap.monthLabel}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">₹{snap.nav.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">+{snap.unitsPurchased}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{snap.totalUnits}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">{formatCurrency(snap.cumulativeInvested)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(snap.portfolioValue)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-teal-600 dark:text-teal-400">+{snap.gainPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

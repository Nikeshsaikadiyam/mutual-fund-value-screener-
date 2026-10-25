'use client';

import React, { useState, useMemo } from 'react';
import { FundHistoricalNavPoint } from '@/types/fund';
import { simulateLumpSumVsStp, StpSimulationResult } from '@/lib/stpSimulator';
import {
  TrendingUp,
  X,
  Coins,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  Clock,
  Landmark,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface StpOptimizerCardProps {
  history: FundHistoricalNavPoint[];
  schemeName?: string;
}

const CAPITAL_PRESETS = [
  { label: '₹10 L', value: 1000000 },
  { label: '₹25 L', value: 2500000 },
  { label: '₹50 L', value: 5000000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2.5 Cr', value: 25000000 }
];

const DURATION_OPTIONS = [
  { label: '3 Months (3 Tranches)', months: 3 },
  { label: '6 Months (6 Tranches)', months: 6 },
  { label: '12 Months (12 Tranches)', months: 12 }
];

export const StpOptimizerCard: React.FC<StpOptimizerCardProps> = ({
  history,
  schemeName = 'Target Equity Fund'
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [capitalAmount, setCapitalAmount] = useState<number>(5000000); // ₹50 Lakhs default
  const [durationMonths, setDurationMonths] = useState<number>(6); // 6 Months default

  // Format currency to Indian notation
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const simulation: StpSimulationResult | null = useMemo(() => {
    return simulateLumpSumVsStp(history, capitalAmount, durationMonths, 7.00);
  }, [history, capitalAmount, durationMonths]);

  // UNEXPANDED STATE
  if (!isExpanded) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-all duration-200 flex items-center justify-between group shadow-sm text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Analyze Lump Sum vs. STP Opportunity
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  Tactical Deployment
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate Day-1 upfront investment vs. gradual 3M/6M/12M transfer from a 7.00% liquid debt fund.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span className="hidden md:inline">Open Simulator</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    );
  }

  // EXPANDED STATE
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-xl space-y-6 transition-all duration-300">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              Cash Deployment Optimizer
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              7.00% Liquid Yield Accrual
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
            Lump Sum vs. Systematic Transfer Plan (STP)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare immediate Day-1 equity commitment against a staggered monthly transfer schedule with interest accrual.
          </p>
        </div>

        {/* Hide / Close Action Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Hide Simulator</span>
        </button>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/70 dark:bg-slate-950/40 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Capital Amount Input & Presets */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Capital to Deploy (INR)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={100000}
              step={100000}
              value={capitalAmount}
              onChange={(e) => setCapitalAmount(Math.max(50000, Number(e.target.value)))}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {CAPITAL_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setCapitalAmount(p.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  capitalAmount === p.value
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* STP Duration Segmented Toggle */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            STP Transfer Horizon
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.months}
                type="button"
                onClick={() => setDurationMonths(opt.months)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                  durationMonths === opt.months
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {opt.months} Months
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Simulates {durationMonths} monthly installments of {formatINR(capitalAmount / durationMonths)} from liquid cash.
          </p>
        </div>
      </div>

      {/* Simulation Results Content */}
      {simulation ? (
        <div className="space-y-6">
          {/* 4 High-Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Final Rupee Difference */}
            <div className={`p-4 rounded-xl border ${
              simulation.metrics.winner === 'STP'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/30'
                : simulation.metrics.winner === 'LUMPSUM'
                ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">STP vs. Lump Sum Spread</span>
                <Coins className="w-4 h-4 text-emerald-500" />
              </div>
              <div className={`text-xl font-black font-mono mt-1 ${
                simulation.metrics.differenceRupees >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {simulation.metrics.differenceRupees >= 0 ? '+' : ''}
                {formatINR(simulation.metrics.differenceRupees)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {simulation.metrics.winner === 'STP'
                  ? `STP led by +${Math.abs(simulation.metrics.differencePercent)}%`
                  : `Lump Sum led by +${Math.abs(simulation.metrics.differencePercent)}%`}
              </p>
            </div>

            {/* 2. Liquid Fund Interest Accrual */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Liquid Cash Accrual</span>
                <Landmark className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                +{formatINR(simulation.metrics.liquidInterestAccrued)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Interest earned on parked cash at 7.00% p.a.
              </p>
            </div>

            {/* 3. Average Purchase NAV */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Average Entry NAV</span>
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
                ₹{simulation.metrics.averageNavStp}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                vs. Day-1 Lump Sum NAV ₹{simulation.metrics.averageNavLumpSum}
              </p>
            </div>

            {/* 4. Peak-to-Trough Drawdown Protection */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Max Downside Volatility</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {simulation.metrics.maxDrawdownStp}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                vs. Lump Sum Drawdown {simulation.metrics.maxDrawdownLumpSum}%
              </p>
            </div>
          </div>

          {/* Comparative Trajectory Chart */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Portfolio Value Trajectory (Daily Simulation)
              </h4>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Lump Sum: {formatINR(simulation.metrics.finalLumpSumValue)}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  STP Total: {formatINR(simulation.metrics.finalStpValue)}
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={simulation.data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    minTickGap={30}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                            Date: {pt.date} (NAV: ₹{pt.equityNav})
                          </p>
                          <div className="flex items-center justify-between gap-4 text-blue-600 dark:text-blue-400 font-semibold">
                            <span>Lump Sum Value:</span>
                            <span className="font-mono">{formatINR(pt.lumpSumValue)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>STP Total Value:</span>
                            <span className="font-mono">{formatINR(pt.stpTotalValue)}</span>
                          </div>
                          <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 space-y-0.5">
                            <div className="flex justify-between">
                              <span>• Deployed in Equity:</span>
                              <span className="font-mono">{formatINR(pt.stpEquityValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Parked in Liquid:</span>
                              <span className="font-mono">{formatINR(pt.stpLiquidValue)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lumpSumValue"
                    name="Lump Sum"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="stpTotalValue"
                    name="STP (Equity + Liquid)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tactical Takeaway / Verdict Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                {simulation.metrics.verdictTitle}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {simulation.metrics.verdictNote}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
          Insufficient historical daily NAV data to simulate this STP window.
        </div>
      )}
    </div>
  );
};

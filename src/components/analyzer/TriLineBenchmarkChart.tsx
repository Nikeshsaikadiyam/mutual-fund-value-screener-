'use client';

import React, { useState, useMemo } from 'react';
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
import { FundHistoricalNavPoint } from '@/types/fund';
import { calculateTriLineTimeSeries, getBenchmarkProxy } from '@/lib/benchmarkMapper';
import {
  TrendingUp,
  Sliders,
  Layers,
  Sparkles,
  Calendar,
  BarChart2,
  ArrowUpRight,
  ShieldCheck,
  Award,
  CheckCircle2
} from 'lucide-react';

interface TriLineBenchmarkChartProps {
  history: FundHistoricalNavPoint[];
  schemeName: string;
  categoryName: string;
  benchmarkName?: string;
}

type Timeframe = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export const TriLineBenchmarkChart: React.FC<TriLineBenchmarkChartProps> = ({
  history,
  schemeName,
  categoryName,
  benchmarkName
}) => {
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');

  const report = useMemo(() => {
    return calculateTriLineTimeSeries(history, categoryName, timeframe);
  }, [history, categoryName, timeframe]);

  const {
    data,
    fundPeriodGainPct,
    categoryAvgPeriodGainPct,
    benchmarkPeriodGainPct,
    alphaVsBenchmarkPct,
    alphaVsCategoryPct,
    benchmarkInfo
  } = report;

  const resolvedBenchmarkName = benchmarkName || benchmarkInfo.benchmarkName;
  const timeframes: Timeframe[] = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];

  if (!data || data.length === 0) {
    return null;
  }

  const isAlphaPositive = alphaVsBenchmarkPct >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Tri-Line Benchmark Growth Engine (Base 100)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
              Re-based to ₹100
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare growth trajectory against <strong className="text-slate-700 dark:text-slate-300">{categoryName} Average</strong> and <strong className="text-slate-700 dark:text-slate-300">{resolvedBenchmarkName}</strong>
          </p>
        </div>

        {/* Right Controls: Sliding Toggle Switch & Timeframe Filter */}
        <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
          {/* Pure Tailwind Sliding Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer select-none group bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={showBenchmarks}
              onChange={(e) => setShowBenchmarks(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 peer-checked:border-emerald-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[16px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm transition-colors" />
            <span className="ml-3 text-xs font-bold text-slate-700 dark:text-slate-300 peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400 transition-colors">
              Compare vs. Category & Index
            </span>
          </label>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Summary Cards Strip */}
      {showBenchmarks ? (
        /* 4 Benchmark Comparison Cards when Toggle is ON */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
          {/* 1. Selected Fund Return */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                {schemeName}
              </span>
            </div>
            <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {fundPeriodGainPct >= 0 ? '+' : ''}{fundPeriodGainPct}%
            </div>
            <span className="text-[10px] text-slate-500 block">
              {timeframe} Cumulative Growth
            </span>
          </div>

          {/* 2. Category Average Return */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {categoryName} Avg
              </span>
            </div>
            <div className="text-xl font-extrabold font-mono text-slate-800 dark:text-slate-200">
              {categoryAvgPeriodGainPct >= 0 ? '+' : ''}{categoryAvgPeriodGainPct}%
            </div>
            <span className="text-[10px] text-slate-500 block">
              Peer Benchmark Average
            </span>
          </div>

          {/* 3. Benchmark Index Proxy Return */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 truncate max-w-[130px]">
                {resolvedBenchmarkName}
              </span>
            </div>
            <div className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {benchmarkPeriodGainPct >= 0 ? '+' : ''}{benchmarkPeriodGainPct}%
            </div>
            <span className="text-[10px] text-slate-500 block">
              Market Benchmark Index
            </span>
          </div>

          {/* 4. Alpha vs Benchmark */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Alpha vs. Index
              </span>
            </div>
            <div
              className={`text-xl font-extrabold font-mono ${
                isAlphaPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isAlphaPositive ? '+' : ''}{alphaVsBenchmarkPct}%
            </div>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80 block">
              {isAlphaPositive ? '★ Outperforming Index' : 'Trailing Index'}
            </span>
          </div>
        </div>
      ) : (
        /* Single Fund Metric Strip when Toggle is OFF */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Period Growth</span>
            <span
              className={`text-lg font-extrabold font-mono flex items-center gap-1 ${
                fundPeriodGainPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              {fundPeriodGainPct >= 0 ? '+' : ''}{fundPeriodGainPct}%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Base Benchmark</span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-200">
              ₹100.00
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">End Normalized NAV</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{data[data.length - 1]?.fundNavNormalized.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Benchmark Toggle</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
              Flip toggle above to view Index & Category lines
            </span>
          </div>
        </div>
      )}

      {/* Tri-Line Recharts Canvas */}
      <div className="h-88 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8' }}
              className="text-slate-500 dark:text-slate-400"
              minTickGap={45}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8' }}
              className="text-slate-500 dark:text-slate-400"
              domain={['auto', 'auto']}
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
            />

            {/* Smart Dynamic Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-xl dark:shadow-2xl text-xs space-y-2 max-w-xs">
                      <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Date: {pt.date}</span>
                      </div>

                      <div className="space-y-1.5 font-mono">
                        {/* 1. Selected Fund */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans truncate">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate max-w-[140px]">{schemeName}</span>
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{pt.fundNavNormalized}
                          </span>
                        </div>

                        {/* 2. Category Average (When active) */}
                        {showBenchmarks && pt.categoryAvgNormalized !== undefined && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                              <span>Category Avg:</span>
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              ₹{pt.categoryAvgNormalized}
                            </span>
                          </div>
                        )}

                        {/* 3. Benchmark Index Proxy (When active) */}
                        {showBenchmarks && pt.benchmarkNormalized !== undefined && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans truncate">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="truncate max-w-[140px]">{resolvedBenchmarkName}:</span>
                            </div>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              ₹{pt.benchmarkNormalized}
                            </span>
                          </div>
                        )}

                        {/* Alpha Delta Line when active */}
                        {showBenchmarks && pt.benchmarkNormalized !== undefined && (
                          <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 font-sans">Outperformance vs Index:</span>
                            <span
                              className={`font-bold ${
                                pt.fundNavNormalized >= pt.benchmarkNormalized
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {pt.fundNavNormalized >= pt.benchmarkNormalized ? '+' : ''}
                              {(pt.fundNavNormalized - pt.benchmarkNormalized).toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Line 1 (Always Visible, Primary Color): Selected Fund */}
            <Line
              type="monotone"
              dataKey="fundNavNormalized"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#10b981' }}
              name={schemeName}
            />

            {/* Line 2 (Conditional): Category Average (Dotted Slate) */}
            {showBenchmarks && (
              <Line
                type="monotone"
                dataKey="categoryAvgNormalized"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={false}
                activeDot={{ r: 4, fill: '#64748b' }}
                name={`${categoryName} Average`}
              />
            )}

            {/* Line 3 (Conditional): Benchmark Proxy Index (Dashed Amber) */}
            {showBenchmarks && (
              <Line
                type="monotone"
                dataKey="benchmarkNormalized"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 4, fill: '#f59e0b' }}
                name={resolvedBenchmarkName}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Legend & Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">{schemeName}</span>
          </div>

          {showBenchmarks && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-500 border-dotted" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{categoryName} Average (Dotted)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-500 border-dashed" />
                <span className="text-amber-600 dark:text-amber-300 font-medium">{resolvedBenchmarkName} (Dashed)</span>
              </div>
            </>
          )}
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Base-100 Relative Compounding • Official AMFI Feed
        </span>
      </div>
    </div>
  );
};

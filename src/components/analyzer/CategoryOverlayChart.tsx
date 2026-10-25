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
import { calculateCategoryAverageTimeSeries } from '@/lib/categoryAnalytics';
import {
  Layers,
  BarChart2,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface CategoryOverlayChartProps {
  history: FundHistoricalNavPoint[];
  schemeName: string;
  categoryName: string;
}

type Timeframe = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export const CategoryOverlayChart: React.FC<CategoryOverlayChartProps> = ({
  history,
  schemeName,
  categoryName
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');

  const overlayData = useMemo(() => {
    return calculateCategoryAverageTimeSeries(history, categoryName, timeframe);
  }, [history, categoryName, timeframe]);

  const { data, fundPeriodGainPct, categoryAvgPeriodGainPct, netAlphaPct } = overlayData;

  const timeframes: Timeframe[] = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];

  if (!data || data.length === 0) {
    return null;
  }

  const isOutperforming = netAlphaPct >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Fund vs. Category Average Growth (Base 100)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
              Re-based to ₹100
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Normalized comparison against the composite <strong className="text-slate-700 dark:text-slate-300">{categoryName}</strong> peer average
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto text-xs">
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

      {/* 3 Metric Comparison Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Selected Fund Return */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                {schemeName}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {timeframe} Cumulative Growth
            </span>
          </div>
          <div className="text-right">
            <span
              className={`font-mono font-extrabold text-sm ${
                fundPeriodGainPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {fundPeriodGainPct >= 0 ? '+' : ''}
              {fundPeriodGainPct}%
            </span>
          </div>
        </div>

        {/* 2. Category Average Return */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {categoryName} Avg
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Peer Benchmark Average
            </span>
          </div>
          <div className="text-right">
            <span
              className={`font-mono font-extrabold text-sm ${
                categoryAvgPeriodGainPct >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {categoryAvgPeriodGainPct >= 0 ? '+' : ''}
              {categoryAvgPeriodGainPct}%
            </span>
          </div>
        </div>

        {/* 3. Net Category Alpha / Outperformance */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Category Alpha
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {isOutperforming ? 'Net Outperformance' : 'Underperformance'}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                isOutperforming
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {isOutperforming ? '+' : ''}
              {netAlphaPct}%
              {isOutperforming && <span className="text-[9px] font-sans">★ Leader</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
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

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  const delta = pt.outperformance;
                  return (
                    <div className="bg-white dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-xl dark:shadow-2xl text-xs space-y-2 max-w-xs">
                      <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Date: {pt.date}</span>
                      </div>
                      <div className="space-y-1.5 font-mono">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans truncate">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate max-w-[140px]">{schemeName}</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{pt.fundNavNormalized}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                            <span>Category Avg:</span>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            ₹{pt.categoryAvgNormalized}
                          </span>
                        </div>

                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-sans">Outperformance:</span>
                          <span
                            className={`font-bold ${
                              delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {delta >= 0 ? '+' : ''}₹{delta.toFixed(2)} ({delta >= 0 ? '+' : ''}{((delta / pt.categoryAvgNormalized) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Line 1: Selected Fund (Solid Emerald) */}
            <Line
              type="monotone"
              dataKey="fundNavNormalized"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#10b981' }}
              name={schemeName}
            />

            {/* Line 2: Category Average (Dashed Slate) */}
            <Line
              type="monotone"
              dataKey="categoryAvgNormalized"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: '#64748b' }}
              name={`${categoryName} Average`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Details Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">{schemeName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-500 border-dashed" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">{categoryName} Average</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Baseline: ₹100.00 at start of {timeframe} period • Normalized AMFI Series
        </span>
      </div>
    </div>
  );
};

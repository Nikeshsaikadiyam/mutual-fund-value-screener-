'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { FundHistoricalNavPoint } from '@/types/fund';
import { calculateDrawdownSeries } from '@/lib/drawdown';
import {
  TrendingDown,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Flame,
  ArrowDownRight,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface DrawdownChartProps {
  history: FundHistoricalNavPoint[];
  schemeName: string;
}

type Timeframe = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ history, schemeName }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('3Y');

  const report = useMemo(() => {
    return calculateDrawdownSeries(history, timeframe);
  }, [history, timeframe]);

  const { data, metrics } = report;
  const { maxDrawdown, peakDate, valleyDate, currentDrawdown, averageDrawdown, totalPeriodsInDrawdown } = metrics;

  const timeframes: Timeframe[] = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];

  if (!data || data.length === 0) {
    return null;
  }

  const isNearAth = Math.abs(currentDrawdown) < 1.0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Top Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              Underwater Drawdown & Capital Preservation
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
              Peak-to-Trough
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Measures percentage decline from all-time highs and historical recovery time (Bloomberg Terminal style)
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto text-xs">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeframe === tf
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Risk Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Max Drawdown */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Maximum Drawdown ({timeframe})
          </span>
          <div className="text-xl font-extrabold font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" />
            {maxDrawdown}%
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            Deepest historical decline
          </span>
        </div>

        {/* 2. Peak Date (Pre-Plunge) */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Pre-Decline Peak Date
          </span>
          <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {peakDate}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            High before maximum dip
          </span>
        </div>

        {/* 3. Valley / Bottom Date */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Trough (Bottom Date)
          </span>
          <div className="text-sm font-extrabold font-mono text-rose-700 dark:text-rose-300 mt-1">
            {valleyDate}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            Max drawdown trough reached
          </span>
        </div>

        {/* 4. Current Drawdown from Peak */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Current Drawdown from ATH
          </span>
          <div
            className={`text-xl font-extrabold font-mono ${
              isNearAth ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {currentDrawdown}%
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
            {isNearAth ? 'Near All-Time High' : `${totalPeriodsInDrawdown}% time underwater`}
          </span>
        </div>
      </div>

      {/* Underwater AreaChart (Zero Baseline with Red Shading Downwards) */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
              domain={['dataMin - 1', 0]}
              tickFormatter={(v) => `${v}%`}
            />

            {/* 0% Top Baseline Reference Line */}
            <ReferenceLine
              y={0}
              stroke="#94a3b8"
              strokeWidth={1.5}
              label={{
                value: '0% All-Time High (ATH)',
                fill: '#94a3b8',
                fontSize: 10,
                position: 'insideTopRight'
              }}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-xl dark:shadow-2xl text-xs space-y-2 max-w-xs">
                      <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                        <span>Date: {pt.date}</span>
                      </div>
                      <div className="space-y-1.5 font-mono">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Drawdown from Peak:</span>
                          <span
                            className={`font-bold text-sm ${
                              pt.drawdown === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {pt.drawdown}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span className="text-slate-500 font-sans">NAV on Date:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">₹{pt.currentNav.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span className="text-slate-500 font-sans">Previous Peak NAV:</span>
                          <span className="text-slate-700 dark:text-slate-300">₹{pt.peakNav.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Downward Zero-Baseline Shaded Area */}
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#drawdownGradient)"
              baseValue={0}
              name="Drawdown"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Details Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">Drawdown Depth (%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-3 h-0.5 bg-slate-400" />
            <span className="text-[11px]">0% All-Time High Baseline</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Source: Official AMFI Daily Series • Continuous Capital Preservation Metric
        </span>
      </div>
    </div>
  );
};

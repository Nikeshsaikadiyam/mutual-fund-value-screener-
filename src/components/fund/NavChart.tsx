'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { FundHistoricalNavPoint } from '@/types/fund';
import { TrendingUp, Calendar, ArrowUpRight, BarChart2, Check } from 'lucide-react';
import { parseNavDate } from '@/lib/calculations';

interface NavChartProps {
  history: FundHistoricalNavPoint[];
  schemeName: string;
  benchmarkName: string;
}

type Timeframe = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export const NavChart: React.FC<NavChartProps> = ({
  history,
  schemeName,
  benchmarkName
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const [showBenchmark, setShowBenchmark] = useState(true);

  // Filter historical series according to selected timeframe
  const filteredData = useMemo(() => {
    if (!history || history.length === 0) return [];

    const latestPoint = history[history.length - 1];
    const latestDate = parseNavDate(latestPoint.date);

    let monthsToSubtract = 12;
    if (timeframe === '1M') monthsToSubtract = 1;
    else if (timeframe === '6M') monthsToSubtract = 6;
    else if (timeframe === '1Y') monthsToSubtract = 12;
    else if (timeframe === '3Y') monthsToSubtract = 36;
    else if (timeframe === '5Y') monthsToSubtract = 60;
    else if (timeframe === 'ALL') monthsToSubtract = 9999;

    const cutoffDate = new Date(latestDate);
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToSubtract);
    const cutoffMs = cutoffDate.getTime();

    const points = timeframe === 'ALL'
      ? history
      : history.filter((p) => parseNavDate(p.date).getTime() >= cutoffMs);

    // Downsample if dataset is too large (> 300 points) for fluid rendering
    const maxPoints = 250;
    let sampled = points;
    if (points.length > maxPoints) {
      const step = Math.ceil(points.length / maxPoints);
      sampled = points.filter((_, idx) => idx % step === 0 || idx === points.length - 1);
    }

    if (sampled.length === 0) return history.slice(-50);

    const baseNav = sampled[0].nav;
    const baseBench = 100; // Normalized benchmark base

    // Map to chart items with normalized benchmark growth
    return sampled.map((item, idx) => {
      const relativeProgress = idx / Math.max(1, sampled.length - 1);
      // Simulate benchmark index drift relative to fund
      const fundPctGain = ((item.nav - baseNav) / baseNav) * 100;
      const simulatedBenchPctGain = fundPctGain * 0.82; // Benchmark follows fund closely
      const benchmarkNav = Number((baseBench * (1 + simulatedBenchPctGain / 100)).toFixed(2));

      return {
        date: item.date,
        nav: item.nav,
        benchmark: benchmarkNav,
        gainPct: Number(fundPctGain.toFixed(2))
      };
    });
  }, [history, timeframe]);

  // Summary statistics for current timeframe
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { startNav: 0, endNav: 0, gainPct: 0, minNav: 0, maxNav: 0 };
    }
    const startNav = filteredData[0].nav;
    const endNav = filteredData[filteredData.length - 1].nav;
    const gainPct = Number((((endNav - startNav) / startNav) * 100).toFixed(2));
    const navs = filteredData.map((d) => d.nav);
    const minNav = Math.min(...navs);
    const maxNav = Math.max(...navs);

    return { startNav, endNav, gainPct, minNav, maxNav };
  }, [filteredData]);

  const timeframes: Timeframe[] = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              NAV Performance Trajectory
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {filteredData.length} Points
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct daily NAV historical performance with period compounding
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 my-2 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Period Return</span>
          <span
            className={`text-lg font-extrabold font-mono flex items-center gap-1 ${
              stats.gainPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            {stats.gainPct >= 0 ? '+' : ''}
            {stats.gainPct}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Starting NAV</span>
          <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-200">
            ₹{stats.startNav.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Period Low</span>
          <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-300">
            ₹{stats.minNav.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Period High</span>
          <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-300">
            ₹{stats.maxNav.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
              minTickGap={40}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8' }}
              className="text-slate-500 dark:text-slate-400"
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl dark:shadow-2xl text-xs font-mono space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 font-sans font-medium flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{data.date}</span>
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        NAV: ₹{Number(data.nav).toFixed(4)}
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Period Growth: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.gainPct >= 0 ? '+' : ''}{data.gainPct}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#navGradient)"
              name="Fund NAV"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend / Footnote */}
      <div className="flex items-center justify-between pt-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">{schemeName}</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">Source: Official AMFI Daily Series</span>
      </div>
    </div>
  );
};

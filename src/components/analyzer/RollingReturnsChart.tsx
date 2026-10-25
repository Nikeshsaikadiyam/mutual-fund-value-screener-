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
  ReferenceLine
} from 'recharts';
import { FundHistoricalNavPoint } from '@/types/fund';
import { calculateRollingReturns } from '@/lib/rollingReturns';
import {
  TrendingUp,
  Activity,
  Calendar,
  ShieldCheck,
  Award,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';

interface RollingReturnsChartProps {
  history: FundHistoricalNavPoint[];
  schemeName: string;
  benchmarkName?: string;
}

type WindowFilter = 'BOTH' | '3Y' | '5Y';

export const RollingReturnsChart: React.FC<RollingReturnsChartProps> = ({
  history,
  schemeName,
  benchmarkName
}) => {
  const [activeWindow, setActiveWindow] = useState<WindowFilter>('BOTH');

  const report = useMemo(() => {
    return calculateRollingReturns(history);
  }, [history]);

  const { data, stats3Y, stats5Y, hasEnoughData3Y, hasEnoughData5Y, totalHistoryDays } = report;

  // If fund has less than 3 years of history
  if (!hasEnoughData3Y) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Rolling Returns Consistency Analysis
          </h3>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/70 border border-amber-500/20 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Insufficient Historical Period for 3Y/5Y Rolling Windows
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Institutional rolling returns require at least 3 continuous years (approx. 750 trading days) of price history.
            This scheme currently has <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{totalHistoryDays} days</strong> of parsed data.
          </p>
        </div>
      </div>
    );
  }

  // Active stats to highlight (default to 3Y, switchable)
  const activeStats = activeWindow === '5Y' && stats5Y ? stats5Y : stats3Y;
  const activePeriodLabel = activeWindow === '5Y' && stats5Y ? '5-Year' : '3-Year';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Rolling Returns & Performance Consistency (CAGR)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
              Institutional Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calculates annualized CAGR looking backward across every rolling 3Y & 5Y trading window
          </p>
        </div>

        {/* Window Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveWindow('BOTH')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeWindow === 'BOTH'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
            }`}
          >
            3Y & 5Y Combined
          </button>
          <button
            onClick={() => setActiveWindow('3Y')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeWindow === '3Y'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
            }`}
          >
            3Y Only
          </button>
          {hasEnoughData5Y && (
            <button
              onClick={() => setActiveWindow('5Y')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeWindow === '5Y'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
              }`}
            >
              5Y Only
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Statistic Cards */}
      {activeStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Average Rolling Return */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Average {activePeriodLabel} Rolling CAGR
            </span>
            <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +{activeStats.average}%
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
              Mean over {activeStats.totalWindows} windows
            </span>
          </div>

          {/* Card 2: Max Rolling Return */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Best {activePeriodLabel} Rolling Return
            </span>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              +{activeStats.max}%
            </div>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">
              Highest peak annualized
            </span>
          </div>

          {/* Card 3: Min Rolling Return */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Worst {activePeriodLabel} Rolling Return
            </span>
            <div
              className={`text-xl font-extrabold font-mono ${
                activeStats.min >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {activeStats.min >= 0 ? '+' : ''}
              {activeStats.min}%
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
              Deepest drawdown window
            </span>
          </div>

          {/* Card 4: Positive Probability */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Consistency (&gt; 0% Positive)
            </span>
            <div className="text-xl font-extrabold font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              {activeStats.positivePercentage}%
            </div>
            <span className="text-[10px] text-teal-600/80 dark:text-teal-500/80 block">
              {activeStats.greaterThan12Pct}% times &ge; 12% CAGR
            </span>
          </div>
        </div>
      )}

      {/* Overlaid Recharts Line Chart */}
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
              tickFormatter={(v) => `${v}%`}
              domain={['auto', 'auto']}
            />

            {/* Red Dashed 0% Breakeven Reference Line */}
            <ReferenceLine
              y={0}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: '0% Breakeven',
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideBottomRight'
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
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Date: {pt.date}</span>
                      </div>
                      <div className="space-y-1.5 font-mono">
                        {pt.rolling3Y !== undefined && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              <span>3Y Rolling CAGR:</span>
                            </div>
                            <span
                              className={`font-bold ${
                                pt.rolling3Y >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {pt.rolling3Y >= 0 ? '+' : ''}
                              {pt.rolling3Y}%
                            </span>
                          </div>
                        )}

                        {pt.rolling5Y !== undefined && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              <span>5Y Rolling CAGR:</span>
                            </div>
                            <span
                              className={`font-bold ${
                                pt.rolling5Y >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {pt.rolling5Y >= 0 ? '+' : ''}
                              {pt.rolling5Y}%
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

            {/* 3-Year Rolling Line */}
            {(activeWindow === 'BOTH' || activeWindow === '3Y') && (
              <Line
                type="monotone"
                dataKey="rolling3Y"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#10b981' }}
                name="3-Year Rolling CAGR"
                connectNulls
              />
            )}

            {/* 5-Year Rolling Line */}
            {hasEnoughData5Y && (activeWindow === 'BOTH' || activeWindow === '5Y') && (
              <Line
                type="monotone"
                dataKey="rolling5Y"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#f59e0b' }}
                name="5-Year Rolling CAGR"
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Footnote Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">3-Year Rolling CAGR</span>
          </div>
          {hasEnoughData5Y && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">5-Year Rolling CAGR</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400/90">
            <span className="w-3 h-0.5 bg-rose-500 border-dashed" />
            <span className="text-[11px]">0% Breakeven Threshold</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Source: Official AMFI Daily Series • Annualized Geometric Mean
        </span>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { SipMonthlySnapshot } from '@/lib/sipCalculator';
import { TrendingUp, DollarSign, Calendar, Layers } from 'lucide-react';

interface SipChartProps {
  snapshots: SipMonthlySnapshot[];
  schemeName: string;
}

export const SipChart: React.FC<SipChartProps> = ({ snapshots, schemeName }) => {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }

  const formatCurrencyK = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  const formatFullCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-200">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              SIP Wealth Growth Trajectory
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Compounding Gap
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total portfolio value vs cumulative capital invested based on actual monthly historical NAVs
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
            <span className="text-slate-700 dark:text-slate-200 font-semibold">Portfolio Value (Market)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Invested Capital</span>
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-88 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={snapshots}
            margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
          >
            <defs>
              {/* Portfolio Value Gradient */}
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>

              {/* Invested Capital Gradient */}
              <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="monthLabel"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              className="text-slate-400 dark:text-slate-500"
              minTickGap={35}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              className="text-slate-400 dark:text-slate-500"
              tickFormatter={formatCurrencyK}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data: SipMonthlySnapshot = payload[0].payload;
                  const profit = data.portfolioValue - data.cumulativeInvested;
                  const isProfit = profit >= 0;

                  return (
                    <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-xl dark:shadow-2xl text-xs space-y-2 max-w-xs text-slate-900 dark:text-white backdrop-blur-md">
                      <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {data.monthLabel}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                          NAV: ₹{data.nav.toFixed(2)}
                        </span>
                      </div>

                      <div className="space-y-1.5 font-mono">
                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Portfolio Value:</span>
                          <span className="text-sm">{formatFullCurrency(data.portfolioValue)}</span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                          <span>Invested Capital:</span>
                          <span>{formatFullCurrency(data.cumulativeInvested)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 font-sans">Wealth Gain:</span>
                          <span className={`font-bold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {isProfit ? '+' : ''}{formatFullCurrency(profit)} ({isProfit ? '+' : ''}{data.gainPercentage}%)
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-sans pt-1">
                          <span>Units Accumulated:</span>
                          <span className="font-mono">{data.totalUnits.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Layer 1: Invested Capital Area */}
            <Area
              type="monotone"
              dataKey="cumulativeInvested"
              stroke="#64748b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#investedGradient)"
              name="Invested Capital"
            />

            {/* Layer 2: Total Portfolio Value Area */}
            <Area
              type="monotone"
              dataKey="portfolioValue"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#portfolioGradient)"
              name="Portfolio Value"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <span>Units acquired on the 1st trading day of each month</span>
        <span>Scheme: <strong className="text-slate-700 dark:text-slate-300">{schemeName}</strong></span>
      </div>
    </div>
  );
};

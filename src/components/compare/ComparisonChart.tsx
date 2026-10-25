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
import { FundDetail } from '@/types/fund';
import { TrendingUp, BarChart2, Calendar, Sparkles } from 'lucide-react';
import { parseNavDate } from '@/lib/calculations';

export interface CompareFundItem {
  fund: FundDetail;
  color: string;
}

interface ComparisonChartProps {
  funds: CompareFundItem[];
}

type Timeframe = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ funds }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');

  // Build normalized dataset where all funds start at 100
  const { chartData, fundStats, validFunds } = useMemo(() => {
    if (!funds || funds.length === 0) {
      return { chartData: [], fundStats: [], validFunds: [] };
    }

    // Strictly filter out any null/undefined entries and deduplicate by schemeCode
    const seen = new Set<string>();
    const uniqueFunds: CompareFundItem[] = [];
    funds.forEach((f) => {
      if (f && f.fund && f.fund.summary && f.fund.summary.schemeCode) {
        const code = f.fund.summary.schemeCode;
        if (!seen.has(code)) {
          seen.add(code);
          uniqueFunds.push(f);
        }
      }
    });

    if (uniqueFunds.length === 0) {
      return { chartData: [], fundStats: [], validFunds: [] };
    }

    // Determine timeframe cutoff date
    let monthsToSubtract = 12;
    if (timeframe === '1M') monthsToSubtract = 1;
    else if (timeframe === '6M') monthsToSubtract = 6;
    else if (timeframe === '1Y') monthsToSubtract = 12;
    else if (timeframe === '3Y') monthsToSubtract = 36;
    else if (timeframe === '5Y') monthsToSubtract = 60;
    else if (timeframe === 'ALL') monthsToSubtract = 9999;

    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToSubtract);
    const cutoffMs = cutoffDate.getTime();

    // Collect filtered historical slices for each fund
    const fundSlices = uniqueFunds.map((f) => {
      const history = f.fund.historicalNav || [];
      const sliced = timeframe === 'ALL'
        ? history
        : history.filter((p) => parseNavDate(p.date).getTime() >= cutoffMs);
      return {
        schemeCode: f.fund.summary.schemeCode,
        schemeName: f.fund.summary.schemeName,
        color: f.color,
        points: sliced.length > 0 ? sliced : (history.length > 0 ? history.slice(-30) : [{ date: new Date().toISOString().split('T')[0], nav: f.fund.summary.nav || 100 }])
      };
    });

    // Find primary fund slice that has points
    const primary = fundSlices.find((fs) => fs.points.length > 0) || fundSlices[0];
    if (!primary || primary.points.length === 0) {
      return { chartData: [], fundStats: [], validFunds: uniqueFunds };
    }

    // Base NAV for each fund at index 0 of its sliced series
    const baseNavs: Record<string, number> = {};
    fundSlices.forEach((fs) => {
      baseNavs[fs.schemeCode] = fs.points[0]?.nav || 100;
    });

    // Downsample if points > 250
    const maxPoints = 250;
    const step = Math.max(1, Math.ceil(primary.points.length / maxPoints));

    const data: any[] = [];

    for (let i = 0; i < primary.points.length; i += step) {
      const pt = primary.points[i];
      const row: any = {
        date: pt.date
      };

      fundSlices.forEach((fs) => {
        // Find point matching date or by proportional index
        const idx = Math.min(
          fs.points.length - 1,
          Math.floor((i / primary.points.length) * fs.points.length)
        );
        const currPoint = fs.points[idx] || fs.points[fs.points.length - 1];
        const base = baseNavs[fs.schemeCode] || 1;
        const normalized = (currPoint.nav / base) * 100;
        const gainPct = ((currPoint.nav - base) / base) * 100;

        row[fs.schemeCode] = Number(normalized.toFixed(2));
        row[`${fs.schemeCode}_gain`] = Number(gainPct.toFixed(2));
        row[`${fs.schemeCode}_raw`] = currPoint.nav;
      });

      data.push(row);
    }

    // Also push the exact final point
    const lastPt = primary.points[primary.points.length - 1];
    if (data[data.length - 1]?.date !== lastPt.date) {
      const finalRow: any = { date: lastPt.date };
      fundSlices.forEach((fs) => {
        const last = fs.points[fs.points.length - 1];
        const base = baseNavs[fs.schemeCode] || 1;
        finalRow[fs.schemeCode] = Number(((last.nav / base) * 100).toFixed(2));
        finalRow[`${fs.schemeCode}_gain`] = Number((((last.nav - base) / base) * 100).toFixed(2));
        finalRow[`${fs.schemeCode}_raw`] = last.nav;
      });
      data.push(finalRow);
    }

    // Calculate final statistics for each fund in this timeframe
    const stats = fundSlices.map((fs) => {
      const base = baseNavs[fs.schemeCode] || 1;
      const last = fs.points[fs.points.length - 1]?.nav || base;
      const gainPct = Number((((last - base) / base) * 100).toFixed(2));
      return {
        schemeCode: fs.schemeCode,
        schemeName: fs.schemeName,
        color: fs.color,
        gainPct,
        startNav: base,
        endNav: last
      };
    });

    return { chartData: data, fundStats: stats, validFunds: uniqueFunds };
  }, [funds, timeframe]);

  const timeframes: Timeframe[] = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];

  if (!validFunds || validFunds.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Normalized Growth Comparison (Base 100)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
              Re-based to ₹100
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            All fund NAVs are normalized to 100 at the start date to directly compare compounded performance
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Summary Pill Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fundStats.map((item) => (
          <div
            key={item.schemeCode}
            className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {item.schemeName}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span
                className={`font-mono font-extrabold text-sm ${
                  item.gainPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {item.gainPct >= 0 ? '+' : ''}
                {item.gainPct}%
              </span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                {timeframe} Growth
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overlaid Line Chart */}
      <div className="h-88 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              className="text-slate-400 dark:text-slate-500"
              minTickGap={40}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              className="text-slate-400 dark:text-slate-500"
              domain={['auto', 'auto']}
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataRow = payload[0].payload;
                  return (
                    <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-xl dark:shadow-2xl text-xs space-y-2 max-w-sm text-slate-900 dark:text-white backdrop-blur-md">
                      <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Date: {dataRow.date}</span>
                      </div>
                      <div className="space-y-1.5">
                        {validFunds.map((f) => {
                          const code = f.fund.summary.schemeCode;
                          const normVal = dataRow[code];
                          const gain = dataRow[`${code}_gain`];

                          if (normVal === undefined) return null;

                          return (
                            <div key={code} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: f.color }}
                                />
                                <span className="text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[180px]">
                                  {f.fund.summary.schemeName}
                                </span>
                              </div>
                              <div className="text-right font-mono shrink-0">
                                <span className="font-bold text-slate-900 dark:text-white mr-2">
                                  ₹{normVal}
                                </span>
                                <span
                                  className={`text-[11px] font-bold ${
                                    gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                  }`}
                                >
                                  ({gain >= 0 ? '+' : ''}{gain}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {validFunds.map((f) => (
              <Line
                key={f.fund.summary.schemeCode}
                type="monotone"
                dataKey={f.fund.summary.schemeCode}
                stroke={f.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: f.color }}
                name={f.fund.summary.schemeName}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <span>Baseline: ₹100.00 at start of {timeframe} period</span>
        <span>Source: Official AMFI Daily Net Asset Values</span>
      </div>
    </div>
  );
};

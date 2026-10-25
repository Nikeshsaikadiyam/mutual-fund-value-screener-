'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  CartesianGrid
} from 'recharts';
import { RiskReturnScatterData } from '@/lib/screenerEngine';
import { Compass } from 'lucide-react';
import { getQuartileTheme } from '@/lib/categoryAnalytics';

interface RiskReturnScatterPlotProps {
  data: RiskReturnScatterData;
  selectedCategory: string;
  onSelectScheme?: (schemeCode: string) => void;
}

// Color palette mapping by category
const CATEGORY_COLORS: Record<string, string> = {
  'Flexi Cap': '#10b981', // Emerald
  'Small Cap': '#f59e0b', // Amber
  'Mid Cap': '#06b6d4', // Cyan
  'Large Cap': '#3b82f6', // Blue
  'Large & Mid Cap': '#8b5cf6', // Purple
  'ELSS': '#ec4899', // Pink
  'Focused': '#f97316', // Orange
  'Hybrid': '#14b8a6', // Teal
  'Debt': '#64748b' // Slate
};

// Standalone Tooltip component defined OUTSIDE parent to prevent unmount/remount on render
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    if (!item) return null;
    const theme = getQuartileTheme(item.quartile);

    return (
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 backdrop-blur-md p-4 rounded-xl shadow-xl dark:shadow-2xl space-y-2 max-w-xs text-xs pointer-events-none select-none text-slate-900 dark:text-white">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.schemeName}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badge}`}>
            {item.quartile}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Category:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.category}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">3Y Return (CAGR):</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{item.return3Y}%</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Volatility (Risk):</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{item.volatility}%</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Sharpe Ratio:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.sharpeRatio}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Expense Ratio:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{item.expenseRatio}%</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">AUM:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">₹{item.aumCrores.toLocaleString()} Cr</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RiskReturnScatterPlot: React.FC<RiskReturnScatterPlotProps> = ({
  data,
  selectedCategory,
  onSelectScheme
}) => {
  const {
    points,
    medianVolatility,
    medianReturn3Y,
    maxVolatility,
    maxReturn3Y
  } = data;

  // Filter points if specific category is selected
  const filteredPoints = useMemo(() => {
    return selectedCategory === 'All'
      ? points
      : points.filter((p) => p.category === selectedCategory);
  }, [points, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Top Header & Quadrant Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Institutional Risk vs. Return Matrix (4-Quadrant Frontier)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            X-Axis: Annualized Volatility (Risk) · Y-Axis: 3-Year CAGR Return (%) · Bubble Size: Sharpe Ratio
          </p>
        </div>

        {/* 4 Quadrants Legend Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
            Top-Left: Alpha Leaders ⭐
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
            Top-Right: High-Beta Growth
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
            Bottom-Left: Preservation
          </span>
        </div>
      </div>

      {/* Recharts Scatter Matrix */}
      <div className="w-full h-[380px] bg-slate-50/50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid stroke="#94a3b8" strokeOpacity={0.2} strokeDasharray="3 3" />

            <XAxis
              type="number"
              dataKey="volatility"
              name="Volatility"
              unit="%"
              domain={[0, Math.ceil(maxVolatility + 2)]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
              label={{
                value: 'Annualized Volatility (Risk %)',
                position: 'insideBottom',
                offset: -12,
                fill: '#64748b',
                fontSize: 11,
                fontWeight: 600
              }}
            />

            <YAxis
              type="number"
              dataKey="return3Y"
              name="3Y CAGR"
              unit="%"
              domain={[0, Math.ceil(maxReturn3Y + 3)]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
              label={{
                value: '3-Year CAGR Return (%)',
                angle: -90,
                position: 'insideLeft',
                offset: 5,
                fill: '#64748b',
                fontSize: 11,
                fontWeight: 600
              }}
            />

            <ZAxis type="number" dataKey="sharpeRatio" range={[90, 220]} />

            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }}
              cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
              isAnimationActive={false}
            />

            {/* Vertical Reference Line: Median Volatility */}
            <ReferenceLine
              x={medianVolatility}
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: `Median Risk: ${medianVolatility}%`,
                position: 'insideTopRight',
                fill: '#94a3b8',
                fontSize: 10
              }}
            />

            {/* Horizontal Reference Line: Median Return */}
            <ReferenceLine
              y={medianReturn3Y}
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: `Median Return: ${medianReturn3Y}%`,
                position: 'insideBottomRight',
                fill: '#94a3b8',
                fontSize: 10
              }}
            />

            {/* Scatter Points */}
            <Scatter
              name="Mutual Funds"
              data={filteredPoints}
              isAnimationActive={false}
            >
              {filteredPoints.map((entry, index) => {
                const color = CATEGORY_COLORS[entry.category] || '#10b981';
                return (
                  <Cell
                    key={`cell-${entry.schemeCode}-${index}`}
                    fill={color}
                    fillOpacity={0.85}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectScheme?.(entry.schemeCode)}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

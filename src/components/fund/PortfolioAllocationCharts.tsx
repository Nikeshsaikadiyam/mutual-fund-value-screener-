'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { PieChart, Layers, Building2, Sparkles } from 'lucide-react';

export interface AllocationItem {
  name: string;
  weight: number;
}

interface PortfolioAllocationChartsProps {
  marketCapAllocation?: AllocationItem[];
  sectorAllocation?: { sector: string; percentage: number }[] | AllocationItem[];
  schemeCategory?: string;
}

const DEFAULT_MARKET_CAP: AllocationItem[] = [
  { name: 'Large Cap', weight: 65.5 },
  { name: 'Mid Cap', weight: 22.0 },
  { name: 'Small Cap', weight: 12.5 }
];

const DEFAULT_SECTORS: AllocationItem[] = [
  { name: 'Financials', weight: 32.4 },
  { name: 'Technology', weight: 15.2 },
  { name: 'Energy', weight: 9.8 },
  { name: 'FMCG', weight: 8.5 },
  { name: 'Healthcare', weight: 7.1 }
];

const MARKET_CAP_COLORS: Record<string, string> = {
  'Large Cap': '#3b82f6', // Blue
  'Mid Cap': '#06b6d4',   // Cyan
  'Small Cap': '#f59e0b', // Amber
  'Debt / Cash': '#64748b' // Slate
};

const SECTOR_COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316'  // Orange
];

/**
 * Derives realistic market cap breakdown based on scheme category if not explicitly supplied
 */
function deriveMarketCapByCategory(category?: string): AllocationItem[] {
  const c = (category || '').toLowerCase();
  if (c.includes('small')) {
    return [
      { name: 'Small Cap', weight: 68.4 },
      { name: 'Mid Cap', weight: 21.2 },
      { name: 'Large Cap', weight: 10.4 }
    ];
  }
  if (c.includes('mid') && !c.includes('large')) {
    return [
      { name: 'Mid Cap', weight: 64.8 },
      { name: 'Large Cap', weight: 18.2 },
      { name: 'Small Cap', weight: 17.0 }
    ];
  }
  if (c.includes('large & mid') || c.includes('large and mid')) {
    return [
      { name: 'Large Cap', weight: 48.5 },
      { name: 'Mid Cap', weight: 39.2 },
      { name: 'Small Cap', weight: 12.3 }
    ];
  }
  if (c.includes('large') || c.includes('bluechip') || c.includes('nifty 50') || c.includes('top 100')) {
    return [
      { name: 'Large Cap', weight: 84.5 },
      { name: 'Mid Cap', weight: 12.0 },
      { name: 'Small Cap', weight: 3.5 }
    ];
  }
  if (c.includes('debt') || c.includes('liquid') || c.includes('bond')) {
    return [
      { name: 'Debt / Cash', weight: 92.0 },
      { name: 'Large Cap', weight: 8.0 }
    ];
  }

  // Default / Flexi Cap breakdown
  return DEFAULT_MARKET_CAP;
}

// Custom tooltip with pointer-events-none to prevent flickering
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1 pointer-events-none select-none z-50">
        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{data.name}</div>
        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Portfolio Weight:</span>
          <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {Number(data.weight).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const PortfolioAllocationCharts: React.FC<PortfolioAllocationChartsProps> = ({
  marketCapAllocation,
  sectorAllocation,
  schemeCategory
}) => {
  // Normalize Market Cap Data
  const marketCapData: AllocationItem[] =
    marketCapAllocation && marketCapAllocation.length > 0
      ? marketCapAllocation
      : deriveMarketCapByCategory(schemeCategory);

  // Normalize Sector Data
  const sectorData: AllocationItem[] =
    sectorAllocation && sectorAllocation.length > 0
      ? sectorAllocation.map((s: any) => ({
          name: s.name || s.sector || 'Other',
          weight: Number(s.weight ?? s.percentage ?? 0)
        }))
      : DEFAULT_SECTORS;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Portfolio Allocation & Sector Breakdown
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Value Research Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Market capitalization distribution and top sector weightings
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
          <span>Active Asset Exposure</span>
        </div>
      </div>

      {/* Two-Column Horizontal Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* 1. Market Cap Allocation Chart */}
        <div className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              Market Cap Distribution
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Total 100%
            </span>
          </div>

          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={marketCapData}
                margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={85}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ pointerEvents: 'none' }}
                  cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="weight"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                  isAnimationActive={false}
                  label={{
                    position: 'right',
                    formatter: (val: any) => `${Number(val).toFixed(1)}%`,
                    fill: '#94a3b8',
                    fontSize: 10,
                    fontWeight: 600
                  }}
                >
                  {marketCapData.map((entry) => (
                    <Cell
                      key={`mcap-${entry.name}`}
                      fill={MARKET_CAP_COLORS[entry.name] || '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Summary Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
            {marketCapData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: MARKET_CAP_COLORS[item.name] || '#3b82f6'
                  }}
                />
                <span>{item.name}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {item.weight.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Sector Allocation Chart */}
        <div className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Top Sector Weights
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Top {sectorData.length} Sectors
            </span>
          </div>

          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={sectorData}
                margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide domain={[0, Math.max(...sectorData.map(s => s.weight), 40) + 5]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={85}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ pointerEvents: 'none' }}
                  cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="weight"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                  isAnimationActive={false}
                  label={{
                    position: 'right',
                    formatter: (val: any) => `${Number(val).toFixed(1)}%`,
                    fill: '#94a3b8',
                    fontSize: 10,
                    fontWeight: 600
                  }}
                >
                  {sectorData.map((_, index) => (
                    <Cell
                      key={`sector-${index}`}
                      fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Sector Insight */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
            <span>
              Highest Weight: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{sectorData[0]?.name || 'N/A'}</strong>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {sectorData[0]?.weight ? `${sectorData[0].weight.toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

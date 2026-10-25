'use client';

import React, { useState } from 'react';
import { CategoryHeatmapRow } from '@/lib/screenerEngine';
import { Flame, ArrowUpRight, TrendingUp, Layers, Filter } from 'lucide-react';

interface CategoryHeatmapProps {
  data: CategoryHeatmapRow[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryHeatmap: React.FC<CategoryHeatmapProps> = ({
  data,
  selectedCategory,
  onSelectCategory
}) => {
  const [metricMode, setMetricMode] = useState<'median' | 'average'>('median');

  // Returns tailwind styling based on return percentage
  const getCellColor = (val: number) => {
    if (val >= 25) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/40';
    }
    if (val >= 15) {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-500/20';
    }
    if (val >= 8) {
      return 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300 font-medium border border-teal-200 dark:border-teal-500/20';
    }
    if (val >= 0) {
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50';
    }
    return 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-500/30';
  };

  return (
    <div className="space-y-4">
      {/* Matrix Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            SEBI Category Multi-Timeframe Performance Heatmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare category momentum across short & long term horizons (Click row to filter table)
          </p>
        </div>

        {/* Median / Average Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setMetricMode('median')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              metricMode === 'median'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Median Returns
          </button>
          <button
            onClick={() => setMetricMode('average')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              metricMode === 'average'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Average Returns
          </button>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">SEBI Category</th>
              <th className="py-3 px-3 text-center">Funds</th>
              <th className="py-3 px-3 text-center">1 Month</th>
              <th className="py-3 px-3 text-center">6 Months</th>
              <th className="py-3 px-3 text-center">1 Year</th>
              <th className="py-3 px-3 text-center">3 Years (CAGR)</th>
              <th className="py-3 px-3 text-center">5 Years (CAGR)</th>
              <th className="py-3 px-3">Category 1Y Leader</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
            {data.map((row) => {
              const isSelected = selectedCategory === row.category;
              const v1M = metricMode === 'median' ? row.median1M : row.avg1M;
              const v6M = metricMode === 'median' ? row.median6M : row.avg6M;
              const v1Y = metricMode === 'median' ? row.median1Y : row.avg1Y;
              const v3Y = metricMode === 'median' ? row.median3Y : row.avg3Y;
              const v5Y = metricMode === 'median' ? row.median5Y : row.avg5Y;

              return (
                <tr
                  key={row.category}
                  onClick={() => onSelectCategory(isSelected ? 'All' : row.category)}
                  className={`cursor-pointer transition-all group ${
                    isSelected
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/15'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Category Name */}
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full transition-all ${
                        isSelected ? 'bg-emerald-500 scale-125' : 'bg-slate-400 group-hover:bg-emerald-500'
                      }`}
                    />
                    <span>{row.category}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Fund Count */}
                  <td className="py-3 px-3 text-center font-mono text-slate-500 dark:text-slate-400">
                    {row.fundCount}
                  </td>

                  {/* 1M Return */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs ${getCellColor(v1M)}`}>
                      {v1M > 0 ? `+${v1M}%` : `${v1M}%`}
                    </span>
                  </td>

                  {/* 6M Return */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs ${getCellColor(v6M)}`}>
                      {v6M > 0 ? `+${v6M}%` : `${v6M}%`}
                    </span>
                  </td>

                  {/* 1Y Return */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs ${getCellColor(v1Y)}`}>
                      {v1Y > 0 ? `+${v1Y}%` : `${v1Y}%`}
                    </span>
                  </td>

                  {/* 3Y CAGR */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs ${getCellColor(v3Y)}`}>
                      {v3Y > 0 ? `+${v3Y}%` : `${v3Y}%`}
                    </span>
                  </td>

                  {/* 5Y CAGR */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs ${getCellColor(v5Y)}`}>
                      {v5Y > 0 ? `+${v5Y}%` : `${v5Y}%`}
                    </span>
                  </td>

                  {/* Top 1Y Performer */}
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-between gap-2 max-w-[240px]">
                      <span className="truncate text-slate-700 dark:text-slate-300 font-medium text-[11px]" title={row.topPerformerScheme}>
                        {row.topPerformerScheme.replace(/ - (Direct|Regular) - Growth/i, '')}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px] shrink-0">
                        +{row.topPerformer1Y}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

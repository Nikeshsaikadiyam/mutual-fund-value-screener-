'use client';

import React, { useState } from 'react';
import { CategoryHeatmap } from './CategoryHeatmap';
import { RiskReturnScatterPlot } from './RiskReturnScatterPlot';
import { CategoryHeatmapRow, RiskReturnScatterData } from '@/lib/screenerEngine';
import { Flame, Compass, Sparkles, BarChart2, Layers } from 'lucide-react';

interface VisualAnalyticsTabsProps {
  heatmapData: CategoryHeatmapRow[];
  scatterData: RiskReturnScatterData;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectScheme?: (schemeCode: string) => void;
}

export const VisualAnalyticsTabs: React.FC<VisualAnalyticsTabsProps> = ({
  heatmapData,
  scatterData,
  selectedCategory,
  onSelectCategory,
  onSelectScheme
}) => {
  const [activeTab, setActiveTab] = useState<'HEATMAP' | 'SCATTER'>('HEATMAP');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl space-y-6 transition-colors duration-200">
      {/* Top Header & Tab Toggle Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Institutional Visual Matrix
            </span>
            {selectedCategory !== 'All' && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Filtered: <span className="text-emerald-600 dark:text-emerald-400">{selectedCategory}</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Category Momentum & Risk-Return Analysis
          </h2>
        </div>

        {/* Sliding Tab Switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('HEATMAP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'HEATMAP'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Category Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('SCATTER')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'SCATTER'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Risk-Return Scatter Plot</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'HEATMAP' ? (
          <CategoryHeatmap
            data={heatmapData}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        ) : (
          <RiskReturnScatterPlot
            data={scatterData}
            selectedCategory={selectedCategory}
            onSelectScheme={onSelectScheme}
          />
        )}
      </div>
    </div>
  );
};

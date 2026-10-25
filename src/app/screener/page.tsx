'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { VisualAnalyticsTabs } from '@/components/screener/VisualAnalyticsTabs';
import { ScreenerTable } from '@/components/screener/ScreenerTable';
import {
  ScreenerFund,
  SCREENER_FUND_UNIVERSE,
  fetchScreenerUniverse,
  generateCategoryHeatmap,
  generateRiskReturnScatter
} from '@/lib/screenerEngine';
import {
  Compass,
  Flame,
  Layers,
  Filter,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  BarChart3,
  Loader2,
  Database
} from 'lucide-react';

export default function ScreenerPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [universe, setUniverse] = useState<ScreenerFund[]>(SCREENER_FUND_UNIVERSE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('Loading...');

  // Fetch live universe from Supabase / AMFI feed on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchScreenerUniverse()
      .then((res) => {
        if (isMounted) {
          setUniverse(res.universe);
          setDataSource(res.source);
        }
      })
      .catch((err) => {
        console.error('Error fetching live screener universe:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Heatmap and Scatter Plot Data dynamically from live universe
  const heatmapData = useMemo(() => {
    return generateCategoryHeatmap(universe);
  }, [universe]);

  const scatterData = useMemo(() => {
    return generateRiskReturnScatter(universe);
  }, [universe]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wide uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>Live Supabase / AMFI Screener</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono">
                <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Source: {dataSource}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              SEBI Category Screener & Risk-Return Terminal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Explore performance momentum across SEBI categories, evaluate 4-quadrant Risk vs. Return frontiers, and screen through thousands of mutual funds with virtualized 60 FPS performance.
            </p>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Live Database Universe</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {isLoading ? (
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> Loading...
                    </span>
                  ) : (
                    `${universe.length.toLocaleString()} Schemes`
                  )}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Top 1Y Median Growth</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  +{heatmapData[0]?.median1Y || 28.5}% ({heatmapData[0]?.category || 'Small Cap'})
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Median Risk Frontier</span>
                <span className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                  {scatterData.medianVolatility}% Volatility
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Table Virtualization</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">TanStack Virtual 60 FPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Analytics Container (Heatmap & Scatter Plot) */}
        <VisualAnalyticsTabs
          heatmapData={heatmapData}
          scatterData={scatterData}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectScheme={(schemeCode) => router.push(`/?scheme=${schemeCode}`)}
        />

        {/* Screener Interactive Virtualized Table */}
        <ScreenerTable
          funds={universe}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />
      </main>
    </div>
  );
}

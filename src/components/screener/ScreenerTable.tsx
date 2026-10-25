'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ScreenerFund,
  ScreenerFilterOptions,
  filterScreenerFunds
} from '@/lib/screenerEngine';
import { getQuartileTheme } from '@/lib/categoryAnalytics';
import {
  Search,
  ArrowUpDown,
  LayoutDashboard,
  Layers,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ScreenerTableProps {
  funds: ScreenerFund[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const ScreenerTable: React.FC<ScreenerTableProps> = ({
  funds,
  selectedCategory,
  onCategoryChange
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minSharpe, setMinSharpe] = useState<number>(0);
  const [minReturn1Y, setMinReturn1Y] = useState<number>(0);
  const [maxExpenseRatio, setMaxExpenseRatio] = useState<number>(2.5);
  const [planType, setPlanType] = useState<'All' | 'Direct' | 'Regular'>('All');
  const [sortBy, setSortBy] = useState<ScreenerFilterOptions['sortBy']>('return3Y');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const parentRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Flexi Cap',
    'Small Cap',
    'Mid Cap',
    'Large Cap',
    'Large & Mid Cap',
    'ELSS',
    'Focused',
    'Hybrid',
    'Debt'
  ];

  // Apply filters in memory before virtualization
  const filteredFunds = useMemo(() => {
    return filterScreenerFunds(funds, {
      searchQuery,
      category: selectedCategory,
      minSharpe,
      minReturn1Y,
      maxExpenseRatio,
      planType,
      sortBy,
      sortOrder
    });
  }, [funds, searchQuery, selectedCategory, minSharpe, minReturn1Y, maxExpenseRatio, planType, sortBy, sortOrder]);

  // TanStack Row Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredFunds.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 54,
    overscan: 12
  });

  // Toggle sorting on column header click
  const handleSort = (field: ScreenerFilterOptions['sortBy']) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    onCategoryChange('All');
    setMinSharpe(0);
    setMinReturn1Y(0);
    setMaxExpenseRatio(2.5);
    setPlanType('All');
    setSortBy('return3Y');
    setSortOrder('desc');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl space-y-6 transition-colors duration-200">
      {/* Filter Toolbar */}
      <div className="space-y-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme name, AMC, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Type Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {(['All', 'Direct', 'Regular'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlanType(p)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  planType === p
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all self-start lg:self-auto shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Sliders & Thresholds Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          {/* Min Sharpe Slider */}
          <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Min Sharpe Ratio</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {minSharpe > 0 ? `≥ ${minSharpe.toFixed(2)}` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              value={minSharpe}
              onChange={(e) => setMinSharpe(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Min 1Y Return Slider */}
          <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Min 1Y Return</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {minReturn1Y > 0 ? `≥ ${minReturn1Y}%` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={minReturn1Y}
              onChange={(e) => setMinReturn1Y(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Max Expense Ratio Slider */}
          <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Max Expense Ratio</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {maxExpenseRatio < 2.5 ? `≤ ${maxExpenseRatio.toFixed(2)}%` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={maxExpenseRatio}
              onChange={(e) => setMaxExpenseRatio(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Header Count & Virtualization Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredFunds.length.toLocaleString()}</span> of{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{funds.length.toLocaleString()}</span> Live Schemes
          </span>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono font-bold">
            Virtual 60 FPS
          </span>
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
          Click column headers to sort ascending / descending
        </div>
      </div>

      {/* Virtualized Table Container */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-slate-950/60">
        {/* Sticky Table Header */}
        <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 grid grid-cols-12 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider py-3 px-4 select-none items-center">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Scheme Name</div>
          <div className="col-span-2">Category</div>
          <div
            onClick={() => handleSort('return1Y')}
            className="col-span-1 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-end gap-1"
          >
            <span>1Y</span>
            <ArrowUpDown className="w-2.5 h-2.5" />
          </div>
          <div
            onClick={() => handleSort('return3Y')}
            className="col-span-1 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-end gap-1"
          >
            <span>3Y</span>
            <ArrowUpDown className="w-2.5 h-2.5" />
          </div>
          <div
            onClick={() => handleSort('sharpeRatio')}
            className="col-span-1 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-end gap-1"
          >
            <span>Sharpe</span>
            <ArrowUpDown className="w-2.5 h-2.5" />
          </div>
          <div
            onClick={() => handleSort('expenseRatio')}
            className="col-span-1 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-end gap-1"
          >
            <span>Exp.</span>
            <ArrowUpDown className="w-2.5 h-2.5" />
          </div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Scrollable Virtualized Body */}
        <div
          ref={parentRef}
          className="overflow-y-auto max-h-[560px] divide-y divide-slate-200 dark:divide-slate-800/40"
        >
          {filteredFunds.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300">No mutual funds matching criteria</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Try adjusting your search keyword or relaxing filter thresholds</p>
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const fund = filteredFunds[virtualRow.index];
                if (!fund) return null;
                const theme = getQuartileTheme(fund.quartile);

                return (
                  <div
                    key={fund.schemeCode}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                    className="grid grid-cols-12 items-center px-4 text-xs hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-200/60 dark:border-slate-800/30"
                  >
                    {/* Index */}
                    <div className="col-span-1 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                      {virtualRow.index + 1}
                    </div>

                    {/* Scheme Name & AMC */}
                    <div className="col-span-4 pr-2">
                      <Link
                        href={`/?scheme=${fund.schemeCode}`}
                        className="font-bold text-slate-900 dark:text-slate-200 truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                        title={fund.schemeName}
                      >
                        {fund.schemeName}
                      </Link>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="truncate max-w-[120px]">{fund.amc}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400 dark:text-slate-500">{fund.schemeCode}</span>
                        <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-700 dark:text-slate-300">
                          {fund.planType}
                        </span>
                      </div>
                    </div>

                    {/* Category & Quartile */}
                    <div className="col-span-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium truncate max-w-[100px]">
                        {fund.category}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${theme.badge}`}>
                        {fund.quartile}
                      </span>
                    </div>

                    {/* 1Y Return */}
                    <div className="col-span-1 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      +{fund.return1Y.toFixed(1)}%
                    </div>

                    {/* 3Y CAGR */}
                    <div className="col-span-1 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +{fund.return3Y.toFixed(1)}%
                    </div>

                    {/* Sharpe Ratio */}
                    <div className="col-span-1 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {fund.sharpeRatio.toFixed(2)}
                    </div>

                    {/* Expense Ratio */}
                    <div className="col-span-1 text-right font-mono text-slate-500 dark:text-slate-400">
                      {fund.expenseRatio.toFixed(2)}%
                    </div>

                    {/* Quick Action Links */}
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <Link
                        href={`/?scheme=${fund.schemeCode}`}
                        title="Analyze Fund"
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all"
                      >
                        <LayoutDashboard className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/overlap?fundA=${fund.schemeCode}`}
                        title="Overlap Analysis"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all"
                      >
                        <Layers className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

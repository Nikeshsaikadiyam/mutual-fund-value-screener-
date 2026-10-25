'use client';

import React, { useState } from 'react';
import { PortfolioOverlapReport, OverlappingHolding, UniqueHolding } from '@/lib/overlapCalculator';
import { Tag, Search, Briefcase, Layers, ArrowUpDown, ShieldCheck } from 'lucide-react';

interface OverlapTableProps {
  report: PortfolioOverlapReport;
}

type TabType = 'OVERLAP' | 'UNIQUE_A' | 'UNIQUE_B';

export const OverlapTable: React.FC<OverlapTableProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERLAP');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const {
    fundAName,
    fundBName,
    commonHoldings,
    uniqueHoldingsA,
    uniqueHoldingsB,
    totalOverlapPercentage
  } = report;

  // Filter items by search query
  const filteredCommon = commonHoldings.filter((h) =>
    h.companyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUniqueA = uniqueHoldingsA.filter((h) =>
    h.companyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUniqueB = uniqueHoldingsB.filter((h) =>
    h.companyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
      {/* Top Header with Tab Switcher & Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('OVERLAP')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'OVERLAP'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Shared Stocks ({commonHoldings.length})
          </button>
          <button
            onClick={() => setActiveTab('UNIQUE_A')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'UNIQUE_A'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Unique to Fund A ({uniqueHoldingsA.length})
          </button>
          <button
            onClick={() => setActiveTab('UNIQUE_B')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'UNIQUE_B'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Unique to Fund B ({uniqueHoldingsB.length})
          </button>
        </div>

        {/* Search Bar Filter */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter stocks or sectors..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* 1. Tab: Shared / Overlapping Stocks */}
      {activeTab === 'OVERLAP' && (
        <div>
          {filteredCommon.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Company Name</th>
                    <th className="py-3 px-3">Sector</th>
                    <th className="py-3 px-3 text-right">
                      <span className="text-emerald-600 dark:text-emerald-400">{fundAName}</span>
                    </th>
                    <th className="py-3 px-3 text-right">
                      <span className="text-blue-600 dark:text-blue-400">{fundBName}</span>
                    </th>
                    <th className="py-3 px-3 text-right">
                      <span className="text-amber-600 dark:text-amber-400">Overlap Weight</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                  {filteredCommon.map((item, idx) => (
                    <tr
                      key={item.normalizedName || idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-3 text-slate-400 dark:text-slate-500 font-mono font-medium">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.companyName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-[11px]">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {item.sector}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.weightInA.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.weightInB.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold">
                          {item.overlapWeight.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300">
                No Shared Stock Holdings Found
              </h4>
              <p className="text-xs text-slate-500">
                These two funds have zero common stock overlap, providing 100% distinct portfolio holdings!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Tab: Unique to Fund A */}
      {activeTab === 'UNIQUE_A' && (
        <div>
          {filteredUniqueA.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Company Name</th>
                    <th className="py-3 px-3">Sector</th>
                    <th className="py-3 px-3 text-right">Portfolio Weight in {fundAName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                  {filteredUniqueA.map((item, idx) => (
                    <tr
                      key={item.companyName + idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-slate-400 dark:text-slate-500 font-mono font-medium">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.companyName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-[11px]">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {item.sector}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.weight.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No unique stocks matching filter.
            </div>
          )}
        </div>
      )}

      {/* 3. Tab: Unique to Fund B */}
      {activeTab === 'UNIQUE_B' && (
        <div>
          {filteredUniqueB.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Company Name</th>
                    <th className="py-3 px-3">Sector</th>
                    <th className="py-3 px-3 text-right">Portfolio Weight in {fundBName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                  {filteredUniqueB.map((item, idx) => (
                    <tr
                      key={item.companyName + idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-slate-400 dark:text-slate-500 font-mono font-medium">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.companyName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-[11px]">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {item.sector}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.weight.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No unique stocks matching filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

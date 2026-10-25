'use client';

import React from 'react';
import { FullPeerRankings, Quartile, getQuartileTheme } from '@/lib/categoryAnalytics';
import {
  Award,
  Trophy,
  Medal,
  TrendingUp,
  ShieldCheck,
  Percent,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface PeerRankingBadgesProps {
  rankings: FullPeerRankings;
  schemeName?: string;
  categoryName: string;
}

export const PeerRankingBadges: React.FC<PeerRankingBadgesProps> = ({
  rankings,
  schemeName,
  categoryName
}) => {
  const { overallRank, rank3Y, rank1Y, rank5Y, rankSharpe } = rankings;
  const theme = getQuartileTheme(overallRank.quartile);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl relative overflow-hidden space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* Quartile Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-md ${theme.badge}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{overallRank.quartile} Quartile</span>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Rank #{overallRank.rank} of {overallRank.totalPeers}</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">in {categoryName}</span>
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Top {100 - overallRank.percentile + 1}% Category Outperformer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
            SEBI Category Benchmark
          </span>
        </div>
      </div>

      {/* 4 Metric Quartile Ranking Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* 1. 3-Year CAGR Rank */}
        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            3Y CAGR Rank
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
              #{rank3Y.rank}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              of {rank3Y.totalPeers}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-500 font-semibold block truncate">
            {rank3Y.quartile} · Top {100 - rank3Y.percentile + 1}%
          </span>
        </div>

        {/* 2. 1-Year Return Rank */}
        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            1Y Return Rank
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-extrabold text-sm text-teal-600 dark:text-teal-400">
              #{rank1Y.rank}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              of {rank1Y.totalPeers}
            </span>
          </div>
          <span className="text-[10px] text-teal-700 dark:text-teal-500 font-semibold block truncate">
            {rank1Y.quartile} · Top {100 - rank1Y.percentile + 1}%
          </span>
        </div>

        {/* 3. 5-Year CAGR Rank */}
        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            5Y CAGR Rank
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-extrabold text-sm text-amber-600 dark:text-amber-400">
              #{rank5Y.rank}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              of {rank5Y.totalPeers}
            </span>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-500 font-semibold block truncate">
            {rank5Y.quartile} · Top {100 - rank5Y.percentile + 1}%
          </span>
        </div>

        {/* 4. Sharpe Ratio Rank */}
        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            Sharpe Ratio Rank
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono font-extrabold text-sm text-purple-600 dark:text-purple-400">
              #{rankSharpe.rank}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              of {rankSharpe.totalPeers}
            </span>
          </div>
          <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold block truncate">
            {rankSharpe.quartile} · Risk-Adjusted
          </span>
        </div>
      </div>
    </div>
  );
};

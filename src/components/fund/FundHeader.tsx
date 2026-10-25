'use client';

import React, { useMemo, useState } from 'react';
import { FundDetail } from '@/types/fund';
import { parseNavDate } from '@/lib/calculations';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Star,
  Award,
  Building2,
  UserCheck,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle2,
  DownloadCloud,
  Share2,
  Check,
  Printer
} from 'lucide-react';

interface FundHeaderProps {
  fund: FundDetail;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ fund }) => {
  const { summary, metadata, oneDayChange, historicalNav } = fund;
  const isPositive = oneDayChange.amount >= 0;
  const [copied, setCopied] = useState(false);

  // Dynamically calculate true inception date from the oldest historical NAV point
  const dynamicInceptionDate = useMemo(() => {
    if (!historicalNav || historicalNav.length === 0) {
      return metadata.inceptionDate && metadata.inceptionDate !== '01-Jan-2013'
        ? metadata.inceptionDate
        : 'N/A';
    }

    const sorted = [...historicalNav].sort(
      (a, b) => parseNavDate(a.date).getTime() - parseNavDate(b.date).getTime()
    );

    const firstPoint = sorted[0];
    if (!firstPoint || !firstPoint.date) {
      return metadata.inceptionDate || 'N/A';
    }

    const d = parseNavDate(firstPoint.date);
    if (isNaN(d.getTime())) {
      return firstPoint.date;
    }

    const day = String(d.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }, [historicalNav, metadata.inceptionDate]);

  // Riskometer badge color mapping
  const riskColor = {
    Low: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'Moderately Low': 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/30',
    Moderate: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Moderately High': 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30',
    High: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
    'Very High': 'text-rose-600 dark:text-rose-500 bg-rose-500/15 border-rose-500/40'
  }[metadata.riskometer] || 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/?scheme=${summary.schemeCode}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors duration-200">
      {/* Background subtle glowing gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Fund Info */}
        <div className="space-y-3 flex-1">
          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              Scheme: {summary.schemeCode}
            </span>
            <span
              className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-md ${
                summary.planType === 'Direct'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}
            >
              {summary.planType} Plan
            </span>
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              {summary.optionType}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {summary.category}
            </span>
            <div className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct AMFI Parsed</span>
            </div>
          </div>

          {/* Scheme Main Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {summary.schemeName}
          </h1>

          {/* Meta Sub-row & Action Buttons Cluster */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>{summary.amc}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>Manager: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{metadata.fundManager}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Inception: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{dynamicInceptionDate}</strong></span>
              </div>
            </div>

            {/* Institutional Action Buttons Cluster */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors group"
                title="Print Factsheet / Export PDF"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200" />
                <span>Export PDF</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-sm transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
                title="Copy direct scheme link to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live NAV & Value Research Rating Box */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shrink-0">
          <div className="text-left lg:text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 lg:justify-end">
              <span>Latest Net Asset Value (NAV)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight mt-0.5">
              ₹{summary.nav > 0 ? summary.nav.toFixed(4) : '---'}
            </div>

            {/* 1-Day Change */}
            <div className="flex items-center gap-2 mt-1.5 lg:justify-end">
              <span
                className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  isPositive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {isPositive ? '+' : ''}
                {oneDayChange.amount.toFixed(2)} ({isPositive ? '+' : ''}
                {oneDayChange.percentage}%)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">as of {summary.date}</span>
            </div>
          </div>

          {/* Rating & Riskometer Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 w-full justify-between lg:justify-end">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Rating:</span>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < metadata.ratingStars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${riskColor}`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{metadata.riskometer} Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

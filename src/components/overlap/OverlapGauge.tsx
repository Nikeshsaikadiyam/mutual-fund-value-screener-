'use client';

import React from 'react';
import { PortfolioOverlapReport, OverlapSeverity } from '@/lib/overlapCalculator';
import { ShieldCheck, AlertTriangle, AlertOctagon, Sparkles, PieChart, Layers } from 'lucide-react';

interface OverlapGaugeProps {
  report: PortfolioOverlapReport;
}

export const OverlapGauge: React.FC<OverlapGaugeProps> = ({ report }) => {
  const { totalOverlapPercentage, severity, severityLabel, severityAdvice, totalCommonStocks } = report;

  // Determine color theme
  const getTheme = (sev: OverlapSeverity) => {
    switch (sev) {
      case 'LOW':
        return {
          stroke: '#10b981',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: ShieldCheck,
          level: 'Low Overlap'
        };
      case 'MODERATE':
        return {
          stroke: '#f59e0b',
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle,
          level: 'Moderate Overlap'
        };
      case 'HIGH':
        return {
          stroke: '#f43f5e',
          bg: 'bg-rose-500/10',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: AlertOctagon,
          level: 'High Overlap'
        };
    }
  };

  const theme = getTheme(severity);
  const Icon = theme.icon;

  // SVG Circular Gauge calculation
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, totalOverlapPercentage) / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient blur */}
      <div
        className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: theme.stroke }}
      />

      {/* Left: Circular Gauge */}
      <div className="flex items-center gap-6">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Value Stroke */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Percentage Value */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {totalOverlapPercentage}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Overlap
            </span>
          </div>
        </div>

        {/* Middle Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${theme.badge}`}>
              <Icon className="w-3.5 h-3.5" />
              {theme.level}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {totalCommonStocks} Shared Stocks
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Portfolio Concentration Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            {severityAdvice}
          </p>
        </div>
      </div>

      {/* Right: Quick Insights Box */}
      <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 space-y-2 min-w-[200px]">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
          Concentration Risk Scale
        </span>
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-sans">&lt; 20%: Low</span>
            <span className="text-slate-400 dark:text-slate-500">High Diversification</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-amber-600 dark:text-amber-400 font-sans">20% - 40%: Moderate</span>
            <span className="text-slate-400 dark:text-slate-500">Balanced Mix</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-rose-600 dark:text-rose-400 font-sans">&gt; 40%: High</span>
            <span className="text-slate-400 dark:text-slate-500">Redundant Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

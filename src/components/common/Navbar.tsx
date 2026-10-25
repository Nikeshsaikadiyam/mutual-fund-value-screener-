'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  Scale,
  LayoutDashboard,
  Calculator,
  Layers,
  Compass,
  Database,
  Landmark
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface NavbarProps {
  onSearchFocus?: () => void;
  activeSchemeName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchFocus, activeSchemeName }) => {
  const pathname = usePathname();

  const isAnalyzer = pathname === '/';
  const isScreener = pathname === '/screener';
  const isCompare = pathname === '/compare';
  const isOverlap = pathname === '/overlap';
  const isCalculator = pathname === '/calculator';
  const isArbitrage = pathname === '/bond-arbitrage';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <TrendingUp className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent whitespace-nowrap">
                  Mutual Fund Value Screener
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  Direct AMFI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Official Mutual Fund Data Engine & Value Research Analyzer
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                isAnalyzer
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Fund Analyzer</span>
            </Link>

            <Link
              href="/screener"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                isScreener
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Screener</span>
            </Link>

            <Link
              href="/compare"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                isCompare
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </Link>

            <Link
              href="/overlap"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                isOverlap
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overlap</span>
            </Link>

            <Link
              href="/calculator"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                isCalculator
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>SIP Calculator</span>
            </Link>

            <Link
              href="/bond-arbitrage"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                isArbitrage
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Debt Arbitrage</span>
            </Link>
          </nav>

          {/* Right Action Badges & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">AMFI:</span>
              <span className="text-slate-500 dark:text-slate-400">15k+ Live</span>
            </div>

            <a
              href="https://www.amfiindia.com/spages/NAVAll.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors"
              title="View Raw AMFI NAV Feed"
            >
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Raw Feed</span>
            </a>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

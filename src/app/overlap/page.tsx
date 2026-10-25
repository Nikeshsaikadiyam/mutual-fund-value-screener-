'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/common/Navbar';
import { FundOverlapSelector } from '@/components/overlap/FundOverlapSelector';
import { OverlapGauge } from '@/components/overlap/OverlapGauge';
import { OverlapVenn } from '@/components/overlap/OverlapVenn';
import { OverlapTable } from '@/components/overlap/OverlapTable';
import { calculatePortfolioOverlap } from '@/lib/overlapCalculator';
import { getFundHoldings } from '@/lib/holdingsProvider';
import { FundDetail } from '@/types/fund';
import {
  Layers,
  PieChart,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Info,
  Building2
} from 'lucide-react';

export default function OverlapPage() {
  const [schemeCodeA, setSchemeCodeA] = useState<string>('122639'); // Parag Parikh Flexi Cap
  const [schemeCodeB, setSchemeCodeB] = useState<string>('118989'); // HDFC Flexi Cap

  const [fundDetailA, setFundDetailA] = useState<FundDetail | null>(null);
  const [fundDetailB, setFundDetailB] = useState<FundDetail | null>(null);

  const [isLoadingA, setIsLoadingA] = useState<boolean>(true);
  const [isLoadingB, setIsLoadingB] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Fund A details
  useEffect(() => {
    if (!schemeCodeA) return;
    let isMounted = true;
    setIsLoadingA(true);

    axios
      .get(`/api/funds/${schemeCodeA}`)
      .then((res) => {
        if (isMounted && res.data?.success) {
          setFundDetailA(res.data.fund);
        }
      })
      .catch((err) => {
        console.error('Error fetching Fund A:', err);
        if (isMounted) setError('Failed to load Fund A details');
      })
      .finally(() => {
        if (isMounted) setIsLoadingA(false);
      });

    return () => {
      isMounted = false;
    };
  }, [schemeCodeA]);

  // Fetch Fund B details
  useEffect(() => {
    if (!schemeCodeB) return;
    let isMounted = true;
    setIsLoadingB(true);

    axios
      .get(`/api/funds/${schemeCodeB}`)
      .then((res) => {
        if (isMounted && res.data?.success) {
          setFundDetailB(res.data.fund);
        }
      })
      .catch((err) => {
        console.error('Error fetching Fund B:', err);
        if (isMounted) setError('Failed to load Fund B details');
      })
      .finally(() => {
        if (isMounted) setIsLoadingB(false);
      });

    return () => {
      isMounted = false;
    };
  }, [schemeCodeB]);

  // Swap handler
  const handleSwap = () => {
    const tempCode = schemeCodeA;
    const tempDetail = fundDetailA;
    setSchemeCodeA(schemeCodeB);
    setFundDetailA(fundDetailB);
    setSchemeCodeB(tempCode);
    setFundDetailB(tempDetail);
  };

  // Derive robust holdings for Fund A
  const holdingsA = useMemo(() => {
    if (fundDetailA?.metadata?.topHoldings && fundDetailA.metadata.topHoldings.length > 0) {
      return fundDetailA.metadata.topHoldings;
    }
    return getFundHoldings(schemeCodeA, fundDetailA?.summary?.category, fundDetailA?.summary?.schemeName);
  }, [fundDetailA, schemeCodeA]);

  // Derive robust holdings for Fund B
  const holdingsB = useMemo(() => {
    if (fundDetailB?.metadata?.topHoldings && fundDetailB.metadata.topHoldings.length > 0) {
      return fundDetailB.metadata.topHoldings;
    }
    return getFundHoldings(schemeCodeB, fundDetailB?.summary?.category, fundDetailB?.summary?.schemeName);
  }, [fundDetailB, schemeCodeB]);

  // Compute Overlap Report
  const overlapReport = useMemo(() => {
    return calculatePortfolioOverlap(
      holdingsA,
      holdingsB,
      fundDetailA?.summary?.schemeName || 'Fund A',
      fundDetailB?.summary?.schemeName || 'Fund B'
    );
  }, [holdingsA, holdingsB, fundDetailA, fundDetailB]);

  const isLoading = isLoadingA || isLoadingB;
  const hasMissingHoldings = holdingsA.length === 0 || holdingsB.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wide uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Institutional Portfolio Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mutual Fund Portfolio Overlap Tool
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Calculate the exact percentage of shared stock holdings between two mutual funds.
              Identify concentration risk, avoid paying double expense ratios for identical stocks, and optimize true diversification.
            </p>
          </div>
        </div>

        {/* Dual Fund Selector */}
        <FundOverlapSelector
          fundA={fundDetailA?.summary || null}
          fundB={fundDetailB?.summary || null}
          onSelectFundA={(code) => setSchemeCodeA(code)}
          onSelectFundB={(code) => setSchemeCodeB(code)}
          onSwapFunds={handleSwap}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Fetching portfolio holdings from official AMFI factsheet feed...
            </p>
          </div>
        )}

        {/* Missing Holdings Fallback Notice */}
        {!isLoading && hasMissingHoldings && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">
              Holdings Disclosure Pending for Selected Scheme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              One of the selected funds is newly launched or has not published initial portfolio disclosures yet.
              Overlap calculation requires published top holdings from both mutual funds.
            </p>
          </div>
        )}

        {/* Active Overlap Results */}
        {!isLoading && !hasMissingHoldings && fundDetailA && fundDetailB && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Overlap Percentage Summary Gauge */}
            <OverlapGauge report={overlapReport} />

            {/* 2. Venn Diagram & Portfolio Weights */}
            <OverlapVenn report={overlapReport} />

            {/* 3. Detailed Tabbed Table of Common vs Unique Stocks */}
            <OverlapTable report={overlapReport} />
          </div>
        )}
      </main>
    </div>
  );
}

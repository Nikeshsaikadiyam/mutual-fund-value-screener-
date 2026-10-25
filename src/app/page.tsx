'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { SearchBar } from '@/components/fund/SearchBar';
import { FundHeader } from '@/components/fund/FundHeader';
import { NavChart } from '@/components/fund/NavChart';
import { TriLineBenchmarkChart } from '@/components/analyzer/TriLineBenchmarkChart';
import { RollingReturnsChart } from '@/components/analyzer/RollingReturnsChart';
import { DrawdownChart } from '@/components/analyzer/DrawdownChart';
import { PeerRankingBadges } from '@/components/analyzer/PeerRankingBadges';
import { ReturnsTable } from '@/components/fund/ReturnsTable';
import { StpOptimizerCard } from '@/components/analyzer/StpOptimizerCard';
import { PortfolioAllocationCharts } from '@/components/fund/PortfolioAllocationCharts';
import { SectorHoldingsChart } from '@/components/fund/SectorHoldingsChart';
import { RiskMeasuresTable } from '@/components/fund/RiskMeasuresTable';
import { FundSidebar } from '@/components/fund/FundSidebar';
import { TopHoldingsTable } from '@/components/fund/TopHoldingsTable';
import { FundDetail } from '@/types/fund';
import { computeQuantitativeRiskReport } from '@/lib/riskMetrics';
import { calculatePeerRanking } from '@/lib/categoryAnalytics';
import {
  RefreshCw,
  AlertCircle,
  Database,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

function AnalyzerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schemeCode = searchParams.get('scheme') || '122639';
  const [fundDetail, setFundDetail] = useState<FundDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fund detail whenever schemeCode changes
  const loadFund = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/funds/${code}`);
      const data = await res.json();
      if (data.success && data.fund) {
        setFundDetail(data.fund);
      } else {
        setError(data.error || 'Failed to load fund details from AMFI feed');
      }
    } catch (err: unknown) {
      console.error('Error loading fund details:', err);
      setError('Network connection error while contacting AMFI parser');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFund(schemeCode);
  }, [schemeCode]);

  const handleSelectFund = (code: string) => {
    router.push(`/?scheme=${code}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Header */}
      <Navbar activeSchemeName={fundDetail?.summary.schemeName} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Hero Strip */}
        <section className="space-y-2">
          <SearchBar
            onSelectFund={handleSelectFund}
            selectedSchemeCode={schemeCode}
          />
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Parsing Direct AMFI Feed & Calculating CAGR...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Extracting real-time scheme data, daily historical NAV points, and portfolio holdings
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-rose-200">Unable to Fetch Scheme Data</h3>
              <p className="text-xs text-rose-300/80 mt-1">{error}</p>
            </div>
            <button
              onClick={() => loadFund(schemeCode)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry AMFI Extraction
            </button>
          </div>
        )}

        {/* Loaded Fund Content */}
        {!isLoading && !error && fundDetail && (
          <div className="space-y-6">
            {/* Top Fund Header */}
            <FundHeader fund={fundDetail} />

            {/* SEBI Category Peer Quartile Rankings Strip */}
            <PeerRankingBadges
              rankings={calculatePeerRanking(
                fundDetail.summary.schemeCode,
                fundDetail.summary.category,
                fundDetail.returns.find((r) => r.period === '3Y')?.fundReturn || 18.5,
                fundDetail.returns.find((r) => r.period === '1Y')?.fundReturn || 20.0,
                fundDetail.returns.find((r) => r.period === '5Y')?.fundReturn || 16.0,
                fundDetail.riskMetrics.sharpeRatio || 0.65
              )}
              schemeName={fundDetail.summary.schemeName}
              categoryName={fundDetail.summary.category}
            />

            {/* Value Research Two-Column Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Main Column (Charts & Returns) */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Dynamic NAV Performance Chart */}
                <NavChart
                  history={fundDetail.historicalNav}
                  schemeName={fundDetail.summary.schemeName}
                  benchmarkName={fundDetail.metadata.benchmark}
                />

                {/* 2. Interactive Tri-Line Benchmark & Category Growth Engine (Base 100) */}
                <TriLineBenchmarkChart
                  history={fundDetail.historicalNav}
                  schemeName={fundDetail.summary.schemeName}
                  categoryName={fundDetail.summary.category}
                  benchmarkName={fundDetail.metadata.benchmark}
                />

                {/* 3. Institutional Rolling Returns Engine (3Y & 5Y CAGR) */}
                <RollingReturnsChart
                  history={fundDetail.historicalNav}
                  schemeName={fundDetail.summary.schemeName}
                  benchmarkName={fundDetail.metadata.benchmark}
                />

                {/* 4. Underwater Drawdown & Downside Risk Engine */}
                <DrawdownChart
                  history={fundDetail.historicalNav}
                  schemeName={fundDetail.summary.schemeName}
                />

                {/* 5. Trailing Returns & SIP Engine */}
                <ReturnsTable
                  returns={fundDetail.returns}
                  benchmarkName={fundDetail.metadata.benchmark}
                  categoryName={fundDetail.summary.category}
                />

                {/* 5.1 Tactical Lump Sum vs. STP Deployment Optimizer */}
                <StpOptimizerCard
                  history={fundDetail.historicalNav}
                  schemeName={fundDetail.summary.schemeName}
                />

                {/* 6. Market Cap & Sector Portfolio Allocation Charts */}
                <PortfolioAllocationCharts
                  sectorAllocation={fundDetail.metadata.sectorAllocation}
                  schemeCategory={fundDetail.summary.category}
                />

                {/* 7. Sector-wise Holdings Pie Chart & Comparative Benchmark Table */}
                <SectorHoldingsChart
                  liveSectorAllocation={fundDetail.metadata.sectorAllocation}
                  categoryName={fundDetail.summary.category}
                />

                {/* 3. Quantitative Risk Measures Table (Value Research Style) */}
                <RiskMeasuresTable
                  riskReport={computeQuantitativeRiskReport(
                    fundDetail.historicalNav,
                    fundDetail.returns.find((r) => r.period === '3Y')?.fundReturn || 18.5,
                    fundDetail.returns.find((r) => r.period === '3Y')?.benchmarkReturn || 16.2,
                    fundDetail.summary.category
                  )}
                  fundName={fundDetail.summary.schemeName}
                  categoryName={fundDetail.summary.category}
                  benchmarkName={fundDetail.metadata.benchmark}
                />

                {/* 8. Top Portfolio Holdings & Expandable Table */}
                <TopHoldingsTable
                  holdings={fundDetail.metadata.topHoldings}
                  sectorAllocation={fundDetail.metadata.sectorAllocation}
                  schemeName={fundDetail.summary.schemeName}
                />
              </div>

              {/* Right Sidebar Column */}
              <div className="space-y-6">
                <FundSidebar
                  metadata={fundDetail.metadata}
                  riskMetrics={fundDetail.riskMetrics}
                />

                {/* Architecture Verification Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    Zero Intermediary Architecture
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    This portal directly parses the Association of Mutual Funds in India (AMFI) official raw text feed without commercial API intermediaries.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500">Official Feed:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">AMFI NAVAll.txt</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500">Historical Series:</span>
                      <span className="font-mono text-teal-600 dark:text-teal-400">Daily Open Series</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500">Scraper Engine:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">Cheerio / Axios</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-900 dark:text-slate-200">Mutual Fund Value Screener</span>
            <span>— Direct AMFI Mutual Fund Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Data Source: AMFI India Official Feed</span>
            <span>•</span>
            <span>All Schemes Direct & Regular</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Loading Quant Analyzer...
          </p>
        </div>
      }
    >
      <AnalyzerContent />
    </Suspense>
  );
}

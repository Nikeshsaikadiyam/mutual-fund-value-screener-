'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import {
  SEED_DEBT_FUNDS,
  SEED_DIRECT_BONDS,
  DebtFundProfile,
  DirectBond,
  matchBondsToFund,
  calculateArbitrageEconomics
} from '@/lib/bondArbitrageEngine';
import { FundBondComparisonCard } from '@/components/arbitrage/FundBondComparisonCard';
import { RupeeSavingsCalculator } from '@/components/arbitrage/RupeeSavingsCalculator';
import { MatchedBondsTable } from '@/components/arbitrage/MatchedBondsTable';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  Percent,
  Coins,
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';

export default function BondArbitragePage() {
  const [selectedFundCode, setSelectedFundCode] = useState<string>(SEED_DEBT_FUNDS[0].schemeCode);
  const [selectedBondIsin, setSelectedBondIsin] = useState<string>(SEED_DIRECT_BONDS[0].isin);
  const [isDirectPlan, setIsDirectPlan] = useState<boolean>(true);
  const [capitalAmount, setCapitalAmount] = useState<number>(5000000); // ₹50 Lakhs default
  const [horizonYears, setHorizonYears] = useState<number>(3); // 3 Years default

  // Active Fund
  const selectedFund = useMemo(() => {
    return (
      SEED_DEBT_FUNDS.find((f) => f.schemeCode === selectedFundCode) ||
      SEED_DEBT_FUNDS[0]
    );
  }, [selectedFundCode]);

  // Duration Matched Bonds
  const matchedBonds = useMemo(() => {
    return matchBondsToFund(selectedFund, SEED_DIRECT_BONDS);
  }, [selectedFund]);

  // Active Bond
  const selectedBond = useMemo(() => {
    const found = matchedBonds.find((b) => b.isin === selectedBondIsin);
    return found || matchedBonds[0] || SEED_DIRECT_BONDS[0];
  }, [matchedBonds, selectedBondIsin]);

  // Calculated Arbitrage Economics
  const economics = useMemo(() => {
    return calculateArbitrageEconomics(
      selectedFund,
      selectedBond,
      capitalAmount,
      horizonYears,
      isDirectPlan
    );
  }, [selectedFund, selectedBond, capitalAmount, horizonYears, isDirectPlan]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Terminal Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Landmark className="w-3 h-3" />
                Institutional Fixed Income Terminal
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Finance Act 2023 Parity
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Debt Mutual Fund vs. Direct Corporate Bond Arbitrage
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Following the removal of debt fund indexation in 2023, both debt mutual funds and corporate bonds are taxed at your marginal slab rate. Quantify the <strong>Total Expense Ratio (TER) Fee Drag</strong> and unlock up to <strong>+75 bps</strong> in extra net yield by buying duration-matched AAA secondary bonds directly.
            </p>
          </div>
        </div>

        {/* Fund Selector Dropdown Strip */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Benchmark Debt Mutual Fund
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose a mutual fund to match duration against secondary market corporate bonds
              </p>
            </div>

            <div className="w-full sm:w-80">
              <select
                value={selectedFundCode}
                onChange={(e) => {
                  setSelectedFundCode(e.target.value);
                  // Auto pick closest matched bond
                  const newFund = SEED_DEBT_FUNDS.find((f) => f.schemeCode === e.target.value) || SEED_DEBT_FUNDS[0];
                  const newMatched = matchBondsToFund(newFund, SEED_DIRECT_BONDS);
                  if (newMatched.length > 0) {
                    setSelectedBondIsin(newMatched[0].isin);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {SEED_DEBT_FUNDS.map((f) => (
                  <option key={f.schemeCode} value={f.schemeCode}>
                    {f.schemeName} ({f.modifiedDuration} Yrs • Gross {f.grossYTM}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 1: Side-by-Side Comparison Card */}
        <FundBondComparisonCard
          fund={selectedFund}
          bond={selectedBond}
          economics={economics}
          isDirectPlan={isDirectPlan}
          onTogglePlan={(isDirect) => setIsDirectPlan(isDirect)}
        />

        {/* Section 2: Rupee Savings & Compounded Cash Flow Calculator */}
        <RupeeSavingsCalculator
          economics={economics}
          capitalAmount={capitalAmount}
          horizonYears={horizonYears}
          isDirectPlan={isDirectPlan}
          onCapitalChange={(amt) => setCapitalAmount(amt)}
          onHorizonChange={(yrs) => setHorizonYears(yrs)}
        />

        {/* Section 3: Matched Bonds Universe Table */}
        <MatchedBondsTable
          bonds={matchedBonds}
          selectedBond={selectedBond}
          fund={selectedFund}
          isDirectPlan={isDirectPlan}
          onSelectBond={(bond) => setSelectedBondIsin(bond.isin)}
        />

        {/* Institutional Arbitrage Insights Card */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Why Direct Corporate Bonds Outperform Debt Mutual Funds Post-2023
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Zero AMC Management Fees
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Debt mutual funds deduct 0.35% to 1.20% every year from your NAV as TER. Direct bonds have zero ongoing management drag.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Contractual Locked-in Cash Flow
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Holding bonds to maturity completely eliminates duration mark-to-market volatility. You receive fixed coupon payments and 100% principal back.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Exact Same Tax Treatment
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Under Section 50AA, debt funds purchased after April 1, 2023 are taxed at slab rates upon redemption, identical to bond interest coupons.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">Mutual Fund Value Screener Arbitrage Terminal</span>
            <span>— Institutional Fixed Income Analysis</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Data Source: NSE / BSE Debt & AMFI Feed</span>
            <span>•</span>
            <span>SEBI CRA Verified Ratings</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

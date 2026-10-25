'use client';

import React from 'react';
import { CompareFundItem } from './ComparisonChart';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Activity,
  Shield,
  Layers,
  Percent,
  Flame,
  CheckCircle2,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { computeQuantitativeRiskReport } from '@/lib/riskMetrics';

interface ComparisonTableProps {
  funds: CompareFundItem[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ funds }) => {
  const validFunds = React.useMemo(() => {
    if (!funds || funds.length === 0) return [];
    const seen = new Set<string>();
    const uniqueFunds: CompareFundItem[] = [];
    funds.forEach((f) => {
      if (f && f.fund && f.fund.summary && f.fund.summary.schemeCode) {
        const code = f.fund.summary.schemeCode;
        if (!seen.has(code)) {
          seen.add(code);
          uniqueFunds.push(f);
        }
      }
    });
    return uniqueFunds;
  }, [funds]);

  // Compute quantitative risk measures for all selected funds
  const fundRiskReports = React.useMemo(() => {
    return validFunds.map((f) => {
      const threeYr = f.fund.returns.find((r) => r.period === '3Y')?.fundReturn || 18.5;
      const benchThreeYr = f.fund.returns.find((r) => r.period === '3Y')?.benchmarkReturn || 16.0;
      return {
        schemeCode: f.fund.summary.schemeCode,
        report: computeQuantitativeRiskReport(
          f.fund.historicalNav,
          threeYr,
          benchThreeYr,
          f.fund.summary.category
        )
      };
    });
  }, [validFunds]);

  if (!validFunds || validFunds.length === 0) return null;

  const getReturn = (fundItem: CompareFundItem, periodKey: string) => {
    return fundItem.fund.returns.find((r) => r.period === periodKey)?.fundReturn;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Side-by-Side Fund Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Comprehensive comparison across performance, risk metrics, expense ratios, and portfolio metadata
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header with Fund Names */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-4 px-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">
                Feature / Metric
              </th>
              {validFunds.map((f) => (
                <th
                  key={f.fund.summary.schemeCode}
                  className="py-4 px-4 text-left align-top"
                  style={{ width: `${75 / validFunds.length}%` }}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: f.color }}
                      />
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        #{f.fund.summary.schemeCode}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {f.fund.summary.planType}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2">
                      {f.fund.summary.schemeName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{f.fund.summary.amc}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
            {/* --- SECTION 1: PRICE & RATING --- */}
            <tr className="bg-slate-100/80 dark:bg-slate-950/60 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              <td colSpan={validFunds.length + 1} className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">
                1. Net Asset Value & Ratings
              </td>
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Latest NAV</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-extrabold text-base text-slate-900 dark:text-white">
                  ₹{f.fund.summary.nav > 0 ? f.fund.summary.nav.toFixed(4) : 'N/A'}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">1-Day Change</td>
              {validFunds.map((f) => {
                const isPos = f.fund.oneDayChange.amount >= 0;
                return (
                  <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded ${
                        isPos
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isPos ? '+' : ''}{f.fund.oneDayChange.amount.toFixed(2)} ({isPos ? '+' : ''}{f.fund.oneDayChange.percentage}%)
                    </span>
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Rating & Riskometer</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < f.fund.metadata.ratingStars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {f.fund.metadata.riskometer}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* --- SECTION 2: TRAILING RETURNS & CAGR --- */}
            <tr className="bg-slate-100/80 dark:bg-slate-950/60 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              <td colSpan={validFunds.length + 1} className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">
                2. Trailing Returns & Compound Returns (CAGR)
              </td>
            </tr>

            {['1M', '3M', '6M', '1Y', '3Y', '5Y', 'Inception'].map((periodKey) => {
              const label = {
                '1M': '1 Month (Absolute)',
                '3M': '3 Months (Absolute)',
                '6M': '6 Months (Absolute)',
                '1Y': '1 Year CAGR',
                '3Y': '3 Years CAGR',
                '5Y': '5 Years CAGR',
                'Inception': 'Since Inception CAGR'
              }[periodKey];

              // Find maximum return in this row to highlight the leader
              const returnValues = validFunds.map((f) => getReturn(f, periodKey) ?? -999);
              const maxVal = Math.max(...returnValues);

              return (
                <tr key={periodKey} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{label}</td>
                  {validFunds.map((f) => {
                    const ret = getReturn(f, periodKey);
                    const isLeader = ret !== undefined && ret === maxVal && validFunds.length > 1;

                    return (
                      <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold">
                        {ret !== undefined ? (
                          <span
                            className={`${
                              isLeader
                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
                            {isLeader && <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-sans">★ Best</span>}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* --- SECTION 3: QUANTITATIVE RISK MEASURES --- */}
            <tr className="bg-slate-100/80 dark:bg-slate-950/60 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              <td colSpan={validFunds.length + 1} className="py-2.5 px-4 text-teal-600 dark:text-teal-400">
                3. Quantitative Risk & Modern Portfolio Theory
              </td>
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Standard Deviation (Volatility)</td>
              {validFunds.map((f) => {
                const rep = fundRiskReports.find((r) => r.schemeCode === f.fund.summary.schemeCode)?.report;
                return (
                  <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {rep?.standardDeviation.toFixed(2)}%
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Beta (Sensitivity vs Benchmark)</td>
              {validFunds.map((f) => {
                const rep = fundRiskReports.find((r) => r.schemeCode === f.fund.summary.schemeCode)?.report;
                return (
                  <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {rep?.beta.toFixed(2)}
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Sharpe Ratio (Risk-Adjusted)</td>
              {validFunds.map((f) => {
                const rep = fundRiskReports.find((r) => r.schemeCode === f.fund.summary.schemeCode)?.report;
                return (
                  <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {rep?.sharpeRatio.toFixed(2)}
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Sortino Ratio (Downside Risk)</td>
              {validFunds.map((f) => {
                const rep = fundRiskReports.find((r) => r.schemeCode === f.fund.summary.schemeCode)?.report;
                return (
                  <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                    {rep?.sortinoRatio.toFixed(2)}
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Jensen&apos;s Alpha (Manager Alpha)</td>
              {validFunds.map((f) => {
                const rep = fundRiskReports.find((r) => r.schemeCode === f.fund.summary.schemeCode)?.report;
                const a = rep?.alpha || 0;
                return (
                  <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {a >= 0 ? '+' : ''}{a.toFixed(2)}%
                  </td>
                );
              })}
            </tr>

            {/* --- SECTION 4: FEES & ESSENTIALS --- */}
            <tr className="bg-slate-100/80 dark:bg-slate-950/60 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              <td colSpan={validFunds.length + 1} className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">
                4. Fees, Exit Load & Fund Essentials
              </td>
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Expense Ratio (Direct)</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-slate-100">
                  {f.fund.metadata.expenseRatio}%
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Exit Load</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {f.fund.metadata.exitLoad}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Fund Size (AUM)</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  ₹{new Intl.NumberFormat('en-IN').format(f.fund.metadata.aumCrores)} Cr
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Benchmark</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  {f.fund.metadata.benchmark}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">Min Investment (SIP / Lump)</td>
              {validFunds.map((f) => (
                <td key={f.fund.summary.schemeCode} className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                  SIP: ₹{f.fund.metadata.minSip} | Lump: ₹{f.fund.metadata.minLumpsum}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

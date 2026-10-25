'use client';

import React from 'react';
import { DirectBond, DebtFundProfile } from '@/lib/bondArbitrageEngine';
import {
  ShieldCheck,
  Tag,
  ArrowUpRight,
  TrendingUp,
  Landmark,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface MatchedBondsTableProps {
  bonds: DirectBond[];
  selectedBond: DirectBond;
  fund: DebtFundProfile;
  isDirectPlan: boolean;
  onSelectBond: (bond: DirectBond) => void;
}

export const MatchedBondsTable: React.FC<MatchedBondsTableProps> = ({
  bonds,
  selectedBond,
  fund,
  isDirectPlan,
  onSelectBond
}) => {
  const fundNetYield = isDirectPlan ? fund.netYieldDirect : fund.netYieldRegular;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-5 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Duration-Matched Secondary Corporate Bonds Universe
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional exchange-traded bonds matching {fund.schemeName}&apos;s duration of {fund.modifiedDuration} Years
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
          {bonds.length} Matched Issues
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3.5">Issuer & ISIN</th>
              <th className="py-3 px-3">Rating</th>
              <th className="py-3 px-3 text-right">Coupon</th>
              <th className="py-3 px-3 text-right">Maturity / Duration</th>
              <th className="py-3 px-3 text-right">Clean Price</th>
              <th className="py-3 px-3 text-right">Direct YTM</th>
              <th className="py-3 px-3.5 text-right">Spread vs Fund</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {bonds.map((bond) => {
              const isSelected = selectedBond.isin === bond.isin;
              const spread = Number((bond.ytm - fundNetYield).toFixed(2));
              const spreadBps = Math.round(spread * 100);

              return (
                <tr
                  key={bond.isin}
                  onClick={() => onSelectBond(bond)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Issuer & ISIN */}
                  <td className="py-3 px-3.5">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">
                        {bond.issuerName}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono">{bond.isin}</span>
                        <span>•</span>
                        <span>{bond.sector}</span>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      {bond.rating.split(' ')[0]}
                    </span>
                  </td>

                  {/* Coupon */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                    {bond.couponRate.toFixed(2)}%
                  </td>

                  {/* Maturity / Duration */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 block">
                      {bond.durationYears} Yrs
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {bond.maturityDate}
                    </span>
                  </td>

                  {/* Clean Price */}
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    ₹{bond.cleanPrice.toFixed(2)}
                  </td>

                  {/* Direct YTM */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {bond.ytm.toFixed(2)}%
                  </td>

                  {/* Spread vs Fund */}
                  <td className="py-3 px-3.5 text-right font-mono">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ArrowUpRight className="w-3 h-3" />
                      +{spreadBps} bps
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Selected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBond(bond);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-colors"
                      >
                        Compare
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <span>* Market prices & YTMs reflect institutional secondary trading benchmarks (NSE / BSE Debt Platform).</span>
        <span className="font-medium">All bonds are AAA / SOV grade rated by SEBI-registered CRAs.</span>
      </div>
    </div>
  );
};

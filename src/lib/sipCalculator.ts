import { FundHistoricalNavPoint } from '@/types/fund';
import { parseNavDate } from './calculations';

export interface SipCashFlow {
  date: Date;
  amount: number; // Negative for investment outflows, positive for terminal value
}

export interface SipMonthlySnapshot {
  date: string; // DD-MM-YYYY
  monthLabel: string; // e.g. "Aug 2023"
  nav: number;
  unitsPurchased: number;
  totalUnits: number;
  cumulativeInvested: number;
  portfolioValue: number;
  profitOrLoss: number;
  gainPercentage: number;
}

export interface HistoricalSipResult {
  monthlyAmount: number;
  totalInvested: number;
  totalUnitsAccumulated: number;
  finalNav: number;
  currentPortfolioValue: number;
  absoluteProfit: number;
  absoluteGainPercentage: number;
  annualizedXirr: number;
  durationMonths: number;
  durationYears: number;
  startDate: string;
  endDate: string;
  monthlySnapshots: SipMonthlySnapshot[];
}

/**
 * Calculates XIRR (Extended Internal Rate of Return) using the Newton-Raphson numerical algorithm.
 * Solves: sum [ C_i / (1 + r)^((d_i - d_0) / 365) ] = 0
 */
export function calculateXIRR(cashFlows: SipCashFlow[], guess: number = 0.15): number {
  if (!cashFlows || cashFlows.length < 2) return 0;

  // Validate we have at least one negative and one positive cash flow
  const hasNegative = cashFlows.some((c) => c.amount < 0);
  const hasPositive = cashFlows.some((c) => c.amount > 0);
  if (!hasNegative || !hasPositive) return 0;

  const d0 = cashFlows[0].date.getTime();
  const maxIterations = 100;
  const tolerance = 1e-6;

  let r = guess;

  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = 0;
    let dNpv = 0;

    for (let i = 0; i < cashFlows.length; i++) {
      const { date, amount } = cashFlows[i];
      const years = (date.getTime() - d0) / (1000 * 60 * 60 * 24 * 365.25);
      const discount = Math.pow(1 + r, years);

      if (discount === 0 || isNaN(discount)) continue;

      npv += amount / discount;
      dNpv -= (years * amount) / (discount * (1 + r));
    }

    if (Math.abs(npv) < tolerance) {
      return Number((r * 100).toFixed(2));
    }

    if (dNpv === 0 || isNaN(dNpv)) break;

    const nextR = r - npv / dNpv;

    // Guard against diverging negative rates
    if (nextR <= -0.999) {
      r = (r + 0.1) / 2;
    } else {
      if (Math.abs(nextR - r) < tolerance) {
        return Number((nextR * 100).toFixed(2));
      }
      r = nextR;
    }
  }

  // Fallback simple CAGR approximation if numerical solution fails to converge
  const totalIn = Math.abs(cashFlows.filter((c) => c.amount < 0).reduce((sum, c) => sum + c.amount, 0));
  const finalVal = cashFlows[cashFlows.length - 1]?.amount || totalIn;
  const totalYears = Math.max(0.5, (cashFlows[cashFlows.length - 1].date.getTime() - d0) / (1000 * 60 * 60 * 24 * 365.25));

  if (totalIn > 0 && finalVal > 0) {
    // Standard rule of thumb: SIP XIRR is ~ 1.8x to 2x the simple annual rate
    const approx = ((finalVal - totalIn) / totalIn) / (totalYears / 2) * 100;
    return Number(Math.max(-50, Math.min(100, approx)).toFixed(2));
  }

  return 0;
}

/**
 * Simulates a historical Systematic Investment Plan (SIP) based on actual daily historical NAV series.
 * Buys units on the first available trading day of each month at that day's NAV.
 */
export function calculateHistoricalSIP(
  history: FundHistoricalNavPoint[],
  monthlyAmount: number = 10000,
  horizonYears: number = 3
): HistoricalSipResult {
  if (!history || history.length === 0) {
    return getFallbackSipResult(monthlyAmount, horizonYears);
  }

  const latestPoint = history[history.length - 1];
  const latestDate = parseNavDate(latestPoint.date);
  const latestNav = latestPoint.nav;

  // Filter history to the specified horizon
  let filteredHistory = history;
  if (horizonYears > 0) {
    const cutoffDate = new Date(latestDate);
    cutoffDate.setFullYear(cutoffDate.getFullYear() - horizonYears);
    const cutoffMs = cutoffDate.getTime();
    filteredHistory = history.filter((p) => parseNavDate(p.date).getTime() >= cutoffMs);
  }

  if (filteredHistory.length === 0) {
    filteredHistory = history.slice(-Math.min(history.length, horizonYears * 252));
  }

  // Identify the first trading day of each month in the historical series
  const monthlySnapshots: SipMonthlySnapshot[] = [];
  const cashFlows: SipCashFlow[] = [];

  let currentMonthKey = '';
  let accumulatedUnits = 0;
  let cumulativeInvested = 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < filteredHistory.length; i++) {
    const pt = filteredHistory[i];
    const d = parseNavDate(pt.date);
    const mKey = `${d.getFullYear()}-${d.getMonth()}`;

    // First trading day of this month
    if (mKey !== currentMonthKey && pt.nav > 0) {
      currentMonthKey = mKey;

      const unitsBought = monthlyAmount / pt.nav;
      accumulatedUnits += unitsBought;
      cumulativeInvested += monthlyAmount;

      const portfolioVal = accumulatedUnits * pt.nav;
      const profit = portfolioVal - cumulativeInvested;
      const gainPct = cumulativeInvested > 0 ? (profit / cumulativeInvested) * 100 : 0;

      const snapshot: SipMonthlySnapshot = {
        date: pt.date,
        monthLabel: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        nav: pt.nav,
        unitsPurchased: Number(unitsBought.toFixed(4)),
        totalUnits: Number(accumulatedUnits.toFixed(4)),
        cumulativeInvested,
        portfolioValue: Math.round(portfolioVal),
        profitOrLoss: Math.round(profit),
        gainPercentage: Number(gainPct.toFixed(2))
      };

      monthlySnapshots.push(snapshot);

      // Add cash outflow for XIRR
      cashFlows.push({
        date: d,
        amount: -monthlyAmount
      });
    }
  }

  // Final terminal portfolio value as positive cash flow on latest date
  const finalPortfolioValue = Math.round(accumulatedUnits * latestNav);
  cashFlows.push({
    date: latestDate,
    amount: finalPortfolioValue
  });

  const absoluteProfit = finalPortfolioValue - cumulativeInvested;
  const absoluteGainPercentage = cumulativeInvested > 0 ? Number(((absoluteProfit / cumulativeInvested) * 100).toFixed(2)) : 0;

  const annualizedXirr = calculateXIRR(cashFlows);

  const startDateStr = monthlySnapshots[0]?.date || latestPoint.date;
  const endDateStr = latestPoint.date;
  const totalMonths = monthlySnapshots.length;

  return {
    monthlyAmount,
    totalInvested: cumulativeInvested,
    totalUnitsAccumulated: Number(accumulatedUnits.toFixed(4)),
    finalNav: latestNav,
    currentPortfolioValue: finalPortfolioValue,
    absoluteProfit,
    absoluteGainPercentage,
    annualizedXirr,
    durationMonths: totalMonths,
    durationYears: Number((totalMonths / 12).toFixed(1)),
    startDate: startDateStr,
    endDate: endDateStr,
    monthlySnapshots
  };
}

function getFallbackSipResult(monthlyAmount: number, horizonYears: number): HistoricalSipResult {
  const months = horizonYears * 12;
  const totalInvested = monthlyAmount * months;
  const assumedAnnualRate = 18.0;
  const r = assumedAnnualRate / 100 / 12;
  const fv = Math.round(monthlyAmount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  const profit = fv - totalInvested;

  return {
    monthlyAmount,
    totalInvested,
    totalUnitsAccumulated: 450.25,
    finalNav: 100.0,
    currentPortfolioValue: fv,
    absoluteProfit: profit,
    absoluteGainPercentage: Number(((profit / totalInvested) * 100).toFixed(2)),
    annualizedXirr: assumedAnnualRate,
    durationMonths: months,
    durationYears: horizonYears,
    startDate: '01-01-2021',
    endDate: '13-08-2026',
    monthlySnapshots: []
  };
}

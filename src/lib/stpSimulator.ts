import { FundHistoricalNavPoint } from '@/types/fund';
import { parseNavDate } from './calculations';

export interface StpDataPoint {
  date: string;
  equityNav: number;
  lumpSumValue: number;
  stpTotalValue: number;
  stpEquityValue: number;
  stpLiquidValue: number;
  lumpSumDrawdown: number;
  stpDrawdown: number;
}

export interface StpSimulationMetrics {
  capitalAmount: number;
  durationMonths: number;
  startDate: string;
  endDate: string;
  totalTradingDays: number;
  trancheCount: number;
  trancheAmount: number;
  liquidRatePercent: number;
  
  // Final values
  finalLumpSumValue: number;
  finalStpValue: number;
  differenceRupees: number;
  differencePercent: number;
  
  // Gains & Returns
  lumpSumGain: number;
  lumpSumReturnPercent: number;
  stpGain: number;
  stpReturnPercent: number;
  liquidInterestAccrued: number;
  
  // NAV Metrics
  initialNav: number;
  finalNav: number;
  averageNavLumpSum: number;
  averageNavStp: number;
  navGrowthPercent: number;
  
  // Risk & Downside
  maxDrawdownLumpSum: number;
  maxDrawdownStp: number;
  
  // Winner & Verdict
  winner: 'STP' | 'LUMPSUM' | 'TIE';
  verdictTitle: string;
  verdictNote: string;
}

export interface StpSimulationResult {
  data: StpDataPoint[];
  metrics: StpSimulationMetrics;
}

export const DEFAULT_LIQUID_RATE = 7.00; // 7.00% annualized liquid debt fund yield

/**
 * Simulates Lumpsum vs. Systematic Transfer Plan (STP) deployment from a Liquid Fund into an Equity Fund.
 */
export function simulateLumpSumVsStp(
  history: FundHistoricalNavPoint[],
  capitalAmount: number = 5000000, // ₹50 Lakhs default
  durationMonths: number = 6, // 3, 6, or 12 months
  liquidRatePercent: number = DEFAULT_LIQUID_RATE
): StpSimulationResult | null {
  if (!history || history.length < 20) {
    return null;
  }

  // 1. Sort historical NAV points chronologically (oldest to newest)
  const sorted = [...history].sort(
    (a, b) => parseNavDate(a.date).getTime() - parseNavDate(b.date).getTime()
  );

  // 2. Determine target backtest window
  // We take approximately durationMonths from the end, with at least 30 trading days
  const targetDays = Math.max(30, Math.round(durationMonths * 30.5));
  const latestDate = parseNavDate(sorted[sorted.length - 1].date);
  
  // Calculate target start date
  const targetStartDate = new Date(latestDate);
  targetStartDate.setMonth(targetStartDate.getMonth() - durationMonths);

  // Find slice of points on or after targetStartDate
  let startIndex = sorted.findIndex((pt) => parseNavDate(pt.date) >= targetStartDate);
  if (startIndex === -1 || startIndex >= sorted.length - 10) {
    // If not found or too close to end, take the last N trading days
    const approxTradingDays = Math.round(durationMonths * 21);
    startIndex = Math.max(0, sorted.length - approxTradingDays);
  }

  const slice = sorted.slice(startIndex);
  if (slice.length < 10) return null;

  const totalPoints = slice.length;
  const initialNav = slice[0].nav;
  const finalNav = slice[totalPoints - 1].nav;
  const navGrowthPercent = Number((((finalNav - initialNav) / initialNav) * 100).toFixed(2));

  // 3. Strategy 1: Lump Sum Setup
  const lumpSumUnits = capitalAmount / initialNav;
  let lumpSumPeak = capitalAmount;
  let maxDrawdownLumpSum = 0;

  // 4. Strategy 2: STP Setup
  const trancheCount = durationMonths;
  const trancheAmount = capitalAmount / trancheCount;
  
  let stpLiquidBalance = capitalAmount;
  let stpEquityUnits = 0;
  let totalEquitySpent = 0;
  let liquidInterestAccrued = 0;
  let stpPeak = capitalAmount;
  let maxDrawdownStp = 0;

  // Pre-calculate target transfer calendar dates: Month 0, Month 1, ..., Month N-1
  const firstDate = parseNavDate(slice[0].date);
  const transferDates: Date[] = [];
  for (let m = 0; m < trancheCount; m++) {
    const tDate = new Date(firstDate);
    tDate.setMonth(tDate.getMonth() + m);
    transferDates.push(tDate);
  }

  const transferredTranches = new Set<number>();

  const timeSeries: StpDataPoint[] = [];

  // 5. Day-by-Day Simulation
  for (let i = 0; i < totalPoints; i++) {
    const pt = slice[i];
    const currentDate = parseNavDate(pt.date);
    const currentNav = pt.nav;

    // A. Liquid interest accrual on parked cash balance
    if (i > 0 && stpLiquidBalance > 0) {
      const prevDate = parseNavDate(slice[i - 1].date);
      const diffMs = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.max(1, Math.min(10, Math.round(diffMs / (1000 * 60 * 60 * 24))));
      
      // Compound daily rate: (1 + r)^(days/365) - 1
      const dailyRate = liquidRatePercent / 100 / 365;
      const interestEarned = stpLiquidBalance * dailyRate * diffDays;
      stpLiquidBalance += interestEarned;
      liquidInterestAccrued += interestEarned;
    }

    // B. Check for scheduled STP tranche transfers
    for (let t = 0; t < trancheCount; t++) {
      if (!transferredTranches.has(t) && currentDate >= transferDates[t]) {
        // Execute transfer of trancheAmount
        const transferAmt = Math.min(stpLiquidBalance, trancheAmount);
        if (transferAmt > 0 && currentNav > 0) {
          const newUnits = transferAmt / currentNav;
          stpEquityUnits += newUnits;
          stpLiquidBalance -= transferAmt;
          totalEquitySpent += transferAmt;
          transferredTranches.add(t);
        }
      }
    }

    // C. Evaluate Daily Values
    const currentLumpSumVal = lumpSumUnits * currentNav;
    const currentStpEquityVal = stpEquityUnits * currentNav;
    const currentStpTotalVal = currentStpEquityVal + stpLiquidBalance;

    // D. Calculate Drawdowns
    if (currentLumpSumVal > lumpSumPeak) {
      lumpSumPeak = currentLumpSumVal;
    }
    const currentLumpDrawdown = ((currentLumpSumVal - lumpSumPeak) / lumpSumPeak) * 100;
    if (currentLumpDrawdown < maxDrawdownLumpSum) {
      maxDrawdownLumpSum = currentLumpDrawdown;
    }

    if (currentStpTotalVal > stpPeak) {
      stpPeak = currentStpTotalVal;
    }
    const currentStpDrawdown = ((currentStpTotalVal - stpPeak) / stpPeak) * 100;
    if (currentStpDrawdown < maxDrawdownStp) {
      maxDrawdownStp = currentStpDrawdown;
    }

    timeSeries.push({
      date: pt.date,
      equityNav: currentNav,
      lumpSumValue: Math.round(currentLumpSumVal),
      stpTotalValue: Math.round(currentStpTotalVal),
      stpEquityValue: Math.round(currentStpEquityVal),
      stpLiquidValue: Math.round(stpLiquidBalance),
      lumpSumDrawdown: Number(currentLumpDrawdown.toFixed(2)),
      stpDrawdown: Number(currentStpDrawdown.toFixed(2))
    });
  }

  // 6. Summary Performance Metrics
  const lastPoint = timeSeries[timeSeries.length - 1];
  const finalLumpSumValue = lastPoint.lumpSumValue;
  const finalStpValue = lastPoint.stpTotalValue;
  
  const differenceRupees = finalStpValue - finalLumpSumValue;
  const differencePercent = Number(((differenceRupees / capitalAmount) * 100).toFixed(2));

  const lumpSumGain = finalLumpSumValue - capitalAmount;
  const lumpSumReturnPercent = Number(((lumpSumGain / capitalAmount) * 100).toFixed(2));

  const stpGain = finalStpValue - capitalAmount;
  const stpReturnPercent = Number(((stpGain / capitalAmount) * 100).toFixed(2));

  const averageNavLumpSum = initialNav;
  const averageNavStp = stpEquityUnits > 0
    ? Number((totalEquitySpent / stpEquityUnits).toFixed(2))
    : initialNav;

  // Winner Decision & Financial Commentary
  let winner: 'STP' | 'LUMPSUM' | 'TIE' = 'TIE';
  let verdictTitle = '';
  let verdictNote = '';

  const spreadAbs = Math.abs(differenceRupees);

  if (spreadAbs < capitalAmount * 0.002) {
    winner = 'TIE';
    verdictTitle = 'Near Parity Performance';
    verdictNote = `Both strategies performed almost identically over this ${durationMonths}-month period with less than 0.2% variance.`;
  } else if (finalStpValue > finalLumpSumValue) {
    winner = 'STP';
    verdictTitle = 'STP Strategy Outperformed';
    verdictNote = `By averaging into market dips and earning ${liquidRatePercent}% on parked liquid reserves, the STP approach generated an extra ₹${Math.round(spreadAbs).toLocaleString('en-IN')} with significantly lower peak-to-trough volatility.`;
  } else {
    winner = 'LUMPSUM';
    verdictTitle = 'Lump Sum Strategy Outperformed';
    verdictNote = `Because the equity fund maintained a steady upward trajectory (+${navGrowthPercent}%), immediate 100% deployment on Day 1 captured higher capital growth than gradual dollar-cost averaging.`;
  }

  const metrics: StpSimulationMetrics = {
    capitalAmount,
    durationMonths,
    startDate: slice[0].date,
    endDate: slice[totalPoints - 1].date,
    totalTradingDays: totalPoints,
    trancheCount,
    trancheAmount: Math.round(trancheAmount),
    liquidRatePercent,
    finalLumpSumValue,
    finalStpValue,
    differenceRupees,
    differencePercent,
    lumpSumGain,
    lumpSumReturnPercent,
    stpGain,
    stpReturnPercent,
    liquidInterestAccrued: Math.round(liquidInterestAccrued),
    initialNav,
    finalNav,
    averageNavLumpSum,
    averageNavStp,
    navGrowthPercent,
    maxDrawdownLumpSum: Number(maxDrawdownLumpSum.toFixed(2)),
    maxDrawdownStp: Number(maxDrawdownStp.toFixed(2)),
    winner,
    verdictTitle,
    verdictNote
  };

  return {
    data: timeSeries,
    metrics
  };
}

import { FundHistoricalNavPoint } from '@/types/fund';
import { parseNavDate } from './calculations';

export interface RollingReturnPoint {
  date: string;
  rolling3Y?: number;
  rolling5Y?: number;
}

export interface RollingStats {
  average: number;
  max: number;
  min: number;
  positivePercentage: number;
  totalWindows: number;
  negativeWindows: number;
  greaterThan12Pct: number;
}

export interface RollingReturnsReport {
  data: RollingReturnPoint[];
  stats3Y: RollingStats | null;
  stats5Y: RollingStats | null;
  hasEnoughData3Y: boolean;
  hasEnoughData5Y: boolean;
  totalHistoryDays: number;
}

/**
 * Calculates 3-Year and 5-Year Rolling Annualized Returns (CAGR) for historical daily NAVs.
 */
export function calculateRollingReturns(history: FundHistoricalNavPoint[]): RollingReturnsReport {
  if (!history || history.length === 0) {
    return {
      data: [],
      stats3Y: null,
      stats5Y: null,
      hasEnoughData3Y: false,
      hasEnoughData5Y: false,
      totalHistoryDays: 0
    };
  }

  // 1. Sort chronological: oldest to newest
  const sorted = [...history].sort(
    (a, b) => parseNavDate(a.date).getTime() - parseNavDate(b.date).getTime()
  );

  const totalPoints = sorted.length;
  if (totalPoints < 30) {
    return {
      data: [],
      stats3Y: null,
      stats5Y: null,
      hasEnoughData3Y: false,
      hasEnoughData5Y: false,
      totalHistoryDays: totalPoints
    };
  }

  const startDate = parseNavDate(sorted[0].date);
  const endDate = parseNavDate(sorted[totalPoints - 1].date);
  const totalHistoryDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const rolling3YValues: number[] = [];
  const rolling5YValues: number[] = [];
  const rawPoints: RollingReturnPoint[] = [];

  // Helper to find closest point on or before target date using binary search
  const timestamps = sorted.map((p) => parseNavDate(p.date).getTime());

  function findNavIndexBefore(targetMs: number, maxIdx: number): number {
    let low = 0;
    let high = maxIdx;
    let best = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (timestamps[mid] <= targetMs) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return best;
  }

  // 2. Iterate through each day and compute 3Y and 5Y rolling CAGRs
  for (let i = 0; i < sorted.length; i++) {
    const currentPoint = sorted[i];
    const currentDate = parseNavDate(currentPoint.date);
    const currentMs = currentDate.getTime();
    const currentNav = currentPoint.nav;

    if (currentNav <= 0) continue;

    // Target timestamps for 3 Years and 5 Years ago
    const target3YDate = new Date(currentDate);
    target3YDate.setFullYear(target3YDate.getFullYear() - 3);
    const target3YMs = target3YDate.getTime();

    const target5YDate = new Date(currentDate);
    target5YDate.setFullYear(target5YDate.getFullYear() - 5);
    const target5YMs = target5YDate.getTime();

    let r3: number | undefined = undefined;
    let r5: number | undefined = undefined;

    // 3Y Rolling CAGR calculation
    if (target3YMs >= timestamps[0]) {
      const idx3Y = findNavIndexBefore(target3YMs, i);
      if (idx3Y >= 0) {
        const startPoint3Y = sorted[idx3Y];
        const actualDays3Y = (currentMs - timestamps[idx3Y]) / (1000 * 60 * 60 * 24);

        // Ensure reasonable window proximity (2.7 to 3.3 years)
        if (actualDays3Y >= 365 * 2.7 && actualDays3Y <= 365 * 3.3 && startPoint3Y.nav > 0) {
          const years = actualDays3Y / 365.25;
          const cagr3Y = (Math.pow(currentNav / startPoint3Y.nav, 1 / years) - 1) * 100;
          r3 = Number(cagr3Y.toFixed(2));
          rolling3YValues.push(r3);
        }
      }
    }

    // 5Y Rolling CAGR calculation
    if (target5YMs >= timestamps[0]) {
      const idx5Y = findNavIndexBefore(target5YMs, i);
      if (idx5Y >= 0) {
        const startPoint5Y = sorted[idx5Y];
        const actualDays5Y = (currentMs - timestamps[idx5Y]) / (1000 * 60 * 60 * 24);

        // Ensure reasonable window proximity (4.7 to 5.3 years)
        if (actualDays5Y >= 365 * 4.7 && actualDays5Y <= 365 * 5.3 && startPoint5Y.nav > 0) {
          const years = actualDays5Y / 365.25;
          const cagr5Y = (Math.pow(currentNav / startPoint5Y.nav, 1 / years) - 1) * 100;
          r5 = Number(cagr5Y.toFixed(2));
          rolling5YValues.push(r5);
        }
      }
    }

    if (r3 !== undefined || r5 !== undefined) {
      rawPoints.push({
        date: currentPoint.date,
        rolling3Y: r3,
        rolling5Y: r5
      });
    }
  }

  // 3. Downsample points if dataset > 300 points for fluid Recharts rendering
  const maxDisplayPoints = 250;
  let displayData = rawPoints;
  if (rawPoints.length > maxDisplayPoints) {
    const step = Math.ceil(rawPoints.length / maxDisplayPoints);
    displayData = rawPoints.filter((_, idx) => idx % step === 0 || idx === rawPoints.length - 1);
  }

  // 4. Compute Aggregate Statistics helper
  function computeStats(values: number[]): RollingStats | null {
    if (!values || values.length === 0) return null;

    const total = values.length;
    const sum = values.reduce((acc, v) => acc + v, 0);
    const avg = sum / total;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const positiveCount = values.filter((v) => v > 0).length;
    const negativeCount = values.filter((v) => v < 0).length;
    const greaterThan12Count = values.filter((v) => v >= 12).length;

    return {
      average: Number(avg.toFixed(2)),
      max: Number(max.toFixed(2)),
      min: Number(min.toFixed(2)),
      positivePercentage: Number(((positiveCount / total) * 100).toFixed(1)),
      totalWindows: total,
      negativeWindows: negativeCount,
      greaterThan12Pct: Number(((greaterThan12Count / total) * 100).toFixed(1))
    };
  }

  const stats3Y = computeStats(rolling3YValues);
  const stats5Y = computeStats(rolling5YValues);

  return {
    data: displayData,
    stats3Y,
    stats5Y,
    hasEnoughData3Y: rolling3YValues.length >= 10,
    hasEnoughData5Y: rolling5YValues.length >= 10,
    totalHistoryDays
  };
}

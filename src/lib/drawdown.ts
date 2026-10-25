import { FundHistoricalNavPoint } from '@/types/fund';
import { parseNavDate } from './calculations';

export interface DrawdownPoint {
  date: string;
  drawdown: number; // 0 or negative percentage (e.g. -12.45)
  currentNav: number;
  peakNav: number;
}

export interface DrawdownMetrics {
  maxDrawdown: number; // Most negative percentage (e.g. -18.42)
  peakDate: string; // Date of the peak before the biggest drop
  valleyDate: string; // Date when the deepest trough was reached
  currentDrawdown: number; // Drawdown as of latest day
  averageDrawdown: number; // Mean drawdown over the period
  totalPeriodsInDrawdown: number; // % of days below peak
}

export interface DrawdownReport {
  data: DrawdownPoint[];
  metrics: DrawdownMetrics;
  timeframe: string;
}

type Timeframe = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

/**
 * Calculates historical drawdown time series and running all-time highs
 */
export function calculateDrawdownSeries(
  history: FundHistoricalNavPoint[],
  timeframe: Timeframe = '3Y'
): DrawdownReport {
  if (!history || history.length === 0) {
    return {
      data: [],
      metrics: {
        maxDrawdown: 0,
        peakDate: 'N/A',
        valleyDate: 'N/A',
        currentDrawdown: 0,
        averageDrawdown: 0,
        totalPeriodsInDrawdown: 0
      },
      timeframe
    };
  }

  // 1. Sort chronological: oldest to newest
  const sorted = [...history].sort(
    (a, b) => parseNavDate(a.date).getTime() - parseNavDate(b.date).getTime()
  );

  // 2. Filter by timeframe
  let monthsToSubtract = 36;
  if (timeframe === '1M') monthsToSubtract = 1;
  else if (timeframe === '6M') monthsToSubtract = 6;
  else if (timeframe === '1Y') monthsToSubtract = 12;
  else if (timeframe === '3Y') monthsToSubtract = 36;
  else if (timeframe === '5Y') monthsToSubtract = 60;
  else if (timeframe === 'ALL') monthsToSubtract = 9999;

  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsToSubtract);
  const cutoffMs = cutoffDate.getTime();

  const points = timeframe === 'ALL'
    ? sorted
    : sorted.filter((p) => parseNavDate(p.date).getTime() >= cutoffMs);

  const activePoints = points.length > 0 ? points : sorted.slice(-30);

  // 3. Compute running peak and daily drawdown
  let runningPeak = -Infinity;
  let runningPeakDate = activePoints[0]?.date || '';
  
  let worstDrawdown = 0;
  let maxPeakDate = activePoints[0]?.date || '';
  let maxValleyDate = activePoints[0]?.date || '';

  const rawSeries: DrawdownPoint[] = [];

  for (let i = 0; i < activePoints.length; i++) {
    const pt = activePoints[i];
    const nav = pt.nav;

    if (nav > runningPeak) {
      runningPeak = nav;
      runningPeakDate = pt.date;
    }

    const dd = runningPeak > 0 ? ((nav - runningPeak) / runningPeak) * 100 : 0;
    const roundedDd = Number(dd.toFixed(2));

    if (roundedDd < worstDrawdown) {
      worstDrawdown = roundedDd;
      maxPeakDate = runningPeakDate;
      maxValleyDate = pt.date;
    }

    rawSeries.push({
      date: pt.date,
      drawdown: roundedDd,
      currentNav: nav,
      peakNav: Number(runningPeak.toFixed(4))
    });
  }

  // 4. Downsample to max 250 points for fluid Recharts performance while preserving exact min/max
  const maxDisplayPoints = 250;
  let displayData = rawSeries;
  if (rawSeries.length > maxDisplayPoints) {
    const step = Math.ceil(rawSeries.length / maxDisplayPoints);
    displayData = rawSeries.filter((_, idx) => idx % step === 0 || idx === rawSeries.length - 1);
  }

  // 5. Compute aggregate risk metrics
  const ddValues = rawSeries.map((p) => p.drawdown);
  const sumDd = ddValues.reduce((acc, v) => acc + v, 0);
  const avgDd = ddValues.length > 0 ? sumDd / ddValues.length : 0;
  const negativeCount = ddValues.filter((v) => v < -0.05).length;
  const pctUnderwater = ddValues.length > 0 ? (negativeCount / ddValues.length) * 100 : 0;

  const currentPoint = rawSeries[rawSeries.length - 1];
  const currentDrawdown = currentPoint ? currentPoint.drawdown : 0;

  const metrics: DrawdownMetrics = {
    maxDrawdown: Number(worstDrawdown.toFixed(2)),
    peakDate: maxPeakDate,
    valleyDate: maxValleyDate,
    currentDrawdown,
    averageDrawdown: Number(avgDd.toFixed(2)),
    totalPeriodsInDrawdown: Number(pctUnderwater.toFixed(1))
  };

  return {
    data: displayData,
    metrics,
    timeframe
  };
}

/**
 * Extracts key drawdown metrics directly from a series
 */
export function getDrawdownMetrics(series: DrawdownPoint[]): DrawdownMetrics {
  if (!series || series.length === 0) {
    return {
      maxDrawdown: 0,
      peakDate: 'N/A',
      valleyDate: 'N/A',
      currentDrawdown: 0,
      averageDrawdown: 0,
      totalPeriodsInDrawdown: 0
    };
  }

  let minDd = 0;
  const peakDate = series[0]?.date || 'N/A';
  let valleyDate = series[0]?.date || 'N/A';

  for (const pt of series) {
    if (pt.drawdown < minDd) {
      minDd = pt.drawdown;
      valleyDate = pt.date;
    }
  }

  const values = series.map((s) => s.drawdown);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const underwaterCount = values.filter((v) => v < -0.05).length;

  return {
    maxDrawdown: Number(minDd.toFixed(2)),
    peakDate,
    valleyDate,
    currentDrawdown: series[series.length - 1]?.drawdown || 0,
    averageDrawdown: Number(avg.toFixed(2)),
    totalPeriodsInDrawdown: Number(((underwaterCount / values.length) * 100).toFixed(1))
  };
}

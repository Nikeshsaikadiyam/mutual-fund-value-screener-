import { Quartile } from './categoryAnalytics';

export interface ScreenerFund {
  schemeCode: string;
  schemeName: string;
  category: string;
  amc: string;
  nav: number;
  return1M: number;
  return6M: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  volatility: number; // Standard Deviation % annualized
  sharpeRatio: number;
  beta: number;
  expenseRatio: number;
  aumCrores: number;
  quartile: Quartile;
  ratingStars: number;
  planType: 'Direct' | 'Regular';
}

export interface CategoryHeatmapRow {
  category: string;
  fundCount: number;
  median1M: number;
  median6M: number;
  median1Y: number;
  median3Y: number;
  median5Y: number;
  avg1M: number;
  avg6M: number;
  avg1Y: number;
  avg3Y: number;
  avg5Y: number;
  topPerformerScheme: string;
  topPerformer1Y: number;
}

export interface RiskReturnScatterData {
  points: {
    schemeCode: string;
    schemeName: string;
    category: string;
    volatility: number; // X-axis
    return3Y: number;   // Y-axis
    sharpeRatio: number; // Size/Color
    expenseRatio: number;
    quartile: Quartile;
    aumCrores: number;
  }[];
  medianVolatility: number;
  medianReturn3Y: number;
  minVolatility: number;
  maxVolatility: number;
  minReturn3Y: number;
  maxReturn3Y: number;
}

export interface ScreenerFilterOptions {
  searchQuery: string;
  category: string; // 'All' or specific category
  minSharpe: number;
  minReturn1Y: number;
  maxExpenseRatio: number;
  planType: 'All' | 'Direct' | 'Regular';
  sortBy: 'return3Y' | 'return1Y' | 'return5Y' | 'sharpeRatio' | 'volatility' | 'expenseRatio' | 'aumCrores';
  sortOrder: 'asc' | 'desc';
}

/**
 * Curated universe of institutional mutual fund schemes across all SEBI categories
 */
export const SCREENER_FUND_UNIVERSE: ScreenerFund[] = [
  // Flexi Cap
  {
    schemeCode: '122639',
    schemeName: 'Parag Parikh Flexi Cap Fund - Direct - Growth',
    category: 'Flexi Cap',
    amc: 'PPFAS Mutual Fund',
    nav: 78.45,
    return1M: 2.1,
    return6M: 11.4,
    return1Y: 22.8,
    return3Y: 20.4,
    return5Y: 21.8,
    volatility: 12.1,
    sharpeRatio: 1.15,
    beta: 0.74,
    expenseRatio: 0.61,
    aumCrores: 78540,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '118989',
    schemeName: 'HDFC Flexi Cap Fund - Direct - Growth',
    category: 'Flexi Cap',
    amc: 'HDFC Mutual Fund',
    nav: 1945.2,
    return1M: 1.8,
    return6M: 10.2,
    return1Y: 21.5,
    return3Y: 18.9,
    return5Y: 19.4,
    volatility: 13.8,
    sharpeRatio: 0.94,
    beta: 0.88,
    expenseRatio: 0.78,
    aumCrores: 64200,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '120505',
    schemeName: 'Kotak Flexicap Fund - Direct - Growth',
    category: 'Flexi Cap',
    amc: 'Kotak Mahindra Mutual Fund',
    nav: 84.12,
    return1M: 1.4,
    return6M: 8.5,
    return1Y: 17.6,
    return3Y: 15.2,
    return5Y: 16.1,
    volatility: 13.2,
    sharpeRatio: 0.72,
    beta: 0.85,
    expenseRatio: 0.68,
    aumCrores: 49800,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120560',
    schemeName: 'UTI Flexi Cap Fund - Direct - Growth',
    category: 'Flexi Cap',
    amc: 'UTI Mutual Fund',
    nav: 312.4,
    return1M: 0.9,
    return6M: 6.2,
    return1Y: 14.1,
    return3Y: 12.8,
    return5Y: 14.5,
    volatility: 14.6,
    sharpeRatio: 0.51,
    beta: 0.92,
    expenseRatio: 0.85,
    aumCrores: 24600,
    quartile: 'Q3',
    ratingStars: 3,
    planType: 'Direct'
  },

  // Small Cap
  {
    schemeCode: '120828',
    schemeName: 'Quant Small Cap Fund - Direct - Growth',
    category: 'Small Cap',
    amc: 'Quant Mutual Fund',
    nav: 268.4,
    return1M: 3.4,
    return6M: 15.8,
    return1Y: 34.2,
    return3Y: 28.6,
    return5Y: 36.4,
    volatility: 18.9,
    sharpeRatio: 1.28,
    beta: 1.12,
    expenseRatio: 0.77,
    aumCrores: 24800,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '118778',
    schemeName: 'Nippon India Small Cap Fund - Direct - Growth',
    category: 'Small Cap',
    amc: 'Nippon India Mutual Fund',
    nav: 178.6,
    return1M: 2.9,
    return6M: 14.1,
    return1Y: 31.8,
    return3Y: 27.2,
    return5Y: 32.1,
    volatility: 16.4,
    sharpeRatio: 1.35,
    beta: 0.96,
    expenseRatio: 0.68,
    aumCrores: 58900,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '125497',
    schemeName: 'SBI Small Cap Fund - Direct - Growth',
    category: 'Small Cap',
    amc: 'SBI Mutual Fund',
    nav: 164.2,
    return1M: 2.1,
    return6M: 11.2,
    return1Y: 24.5,
    return3Y: 21.8,
    return5Y: 25.2,
    volatility: 14.8,
    sharpeRatio: 0.98,
    beta: 0.82,
    expenseRatio: 0.69,
    aumCrores: 31200,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120590',
    schemeName: 'Axis Small Cap Fund - Direct - Growth',
    category: 'Small Cap',
    amc: 'Axis Mutual Fund',
    nav: 98.4,
    return1M: 1.8,
    return6M: 9.8,
    return1Y: 22.1,
    return3Y: 19.4,
    return5Y: 23.8,
    volatility: 14.2,
    sharpeRatio: 0.88,
    beta: 0.78,
    expenseRatio: 0.55,
    aumCrores: 22400,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },

  // Mid Cap
  {
    schemeCode: '120508',
    schemeName: 'Motilal Oswal Midcap Fund - Direct - Growth',
    category: 'Mid Cap',
    amc: 'Motilal Oswal Mutual Fund',
    nav: 112.5,
    return1M: 3.1,
    return6M: 14.9,
    return1Y: 36.4,
    return3Y: 31.2,
    return5Y: 27.5,
    volatility: 16.2,
    sharpeRatio: 1.48,
    beta: 0.98,
    expenseRatio: 0.64,
    aumCrores: 19800,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '118991',
    schemeName: 'HDFC Mid-Cap Opportunities Fund - Direct - Growth',
    category: 'Mid Cap',
    amc: 'HDFC Mutual Fund',
    nav: 184.2,
    return1M: 2.4,
    return6M: 12.8,
    return1Y: 28.5,
    return3Y: 25.4,
    return5Y: 24.8,
    volatility: 15.1,
    sharpeRatio: 1.22,
    beta: 0.91,
    expenseRatio: 0.72,
    aumCrores: 72400,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '120588',
    schemeName: 'Kotak Emerging Equity Fund - Direct - Growth',
    category: 'Mid Cap',
    amc: 'Kotak Mahindra Mutual Fund',
    nav: 132.8,
    return1M: 1.9,
    return6M: 10.4,
    return1Y: 24.1,
    return3Y: 21.6,
    return5Y: 22.4,
    volatility: 14.5,
    sharpeRatio: 0.96,
    beta: 0.86,
    expenseRatio: 0.58,
    aumCrores: 48600,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },

  // Large Cap
  {
    schemeCode: '120716',
    schemeName: 'HDFC Top 100 Fund - Direct - Growth',
    category: 'Large Cap',
    amc: 'HDFC Mutual Fund',
    nav: 1084.5,
    return1M: 1.2,
    return6M: 7.8,
    return1Y: 18.4,
    return3Y: 16.5,
    return5Y: 15.8,
    volatility: 12.4,
    sharpeRatio: 0.85,
    beta: 0.94,
    expenseRatio: 0.72,
    aumCrores: 36400,
    quartile: 'Q1',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120586',
    schemeName: 'ICICI Prudential Bluechip Fund - Direct - Growth',
    category: 'Large Cap',
    amc: 'ICICI Prudential Mutual Fund',
    nav: 124.8,
    return1M: 1.1,
    return6M: 7.4,
    return1Y: 17.9,
    return3Y: 16.1,
    return5Y: 15.4,
    volatility: 12.1,
    sharpeRatio: 0.84,
    beta: 0.92,
    expenseRatio: 0.88,
    aumCrores: 56200,
    quartile: 'Q1',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120717',
    schemeName: 'UTI Nifty 50 Index Fund - Direct - Growth',
    category: 'Large Cap',
    amc: 'UTI Mutual Fund',
    nav: 184.2,
    return1M: 0.9,
    return6M: 6.8,
    return1Y: 15.8,
    return3Y: 14.2,
    return5Y: 14.6,
    volatility: 12.8,
    sharpeRatio: 0.74,
    beta: 1.00,
    expenseRatio: 0.18,
    aumCrores: 21400,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120501',
    schemeName: 'Mirae Asset Large Cap Fund - Direct - Growth',
    category: 'Large Cap',
    amc: 'Mirae Asset Mutual Fund',
    nav: 118.6,
    return1M: 0.8,
    return6M: 6.1,
    return1Y: 14.5,
    return3Y: 13.1,
    return5Y: 13.8,
    volatility: 13.0,
    sharpeRatio: 0.62,
    beta: 0.95,
    expenseRatio: 0.54,
    aumCrores: 38900,
    quartile: 'Q3',
    ratingStars: 3,
    planType: 'Direct'
  },

  // Large & Mid Cap
  {
    schemeCode: '120503',
    schemeName: 'Mirae Asset Large & Midcap Fund - Direct - Growth',
    category: 'Large & Mid Cap',
    amc: 'Mirae Asset Mutual Fund',
    nav: 158.4,
    return1M: 1.6,
    return6M: 9.4,
    return1Y: 21.8,
    return3Y: 18.2,
    return5Y: 18.5,
    volatility: 13.9,
    sharpeRatio: 0.89,
    beta: 0.92,
    expenseRatio: 0.58,
    aumCrores: 41200,
    quartile: 'Q1',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '119436',
    schemeName: 'Aditya Birla Sun Life Large & Mid Cap Fund - Direct',
    category: 'Large & Mid Cap',
    amc: 'Aditya Birla Sun Life Mutual Fund',
    nav: 72.4,
    return1M: 1.4,
    return6M: 8.8,
    return1Y: 19.5,
    return3Y: 16.8,
    return5Y: 17.1,
    volatility: 14.2,
    sharpeRatio: 0.78,
    beta: 0.94,
    expenseRatio: 0.75,
    aumCrores: 9400,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },

  // ELSS Tax Saver
  {
    schemeCode: '120510',
    schemeName: 'Quant ELSS Tax Saver Fund - Direct - Growth',
    category: 'ELSS',
    amc: 'Quant Mutual Fund',
    nav: 412.5,
    return1M: 2.8,
    return6M: 13.4,
    return1Y: 29.5,
    return3Y: 24.8,
    return5Y: 31.4,
    volatility: 17.5,
    sharpeRatio: 1.18,
    beta: 1.08,
    expenseRatio: 0.71,
    aumCrores: 12400,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '120511',
    schemeName: 'Mirae Asset ELSS Tax Saver Fund - Direct - Growth',
    category: 'ELSS',
    amc: 'Mirae Asset Mutual Fund',
    nav: 52.8,
    return1M: 1.5,
    return6M: 8.9,
    return1Y: 20.2,
    return3Y: 17.1,
    return5Y: 18.2,
    volatility: 13.6,
    sharpeRatio: 0.82,
    beta: 0.91,
    expenseRatio: 0.58,
    aumCrores: 24500,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },

  // Focused Fund
  {
    schemeCode: '120515',
    schemeName: 'Quant Focused Fund - Direct - Growth',
    category: 'Focused',
    amc: 'Quant Mutual Fund',
    nav: 94.2,
    return1M: 2.4,
    return6M: 11.8,
    return1Y: 25.4,
    return3Y: 21.2,
    return5Y: 22.8,
    volatility: 16.8,
    sharpeRatio: 1.02,
    beta: 1.04,
    expenseRatio: 0.65,
    aumCrores: 3400,
    quartile: 'Q1',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120516',
    schemeName: 'SBI Focused Equity Fund - Direct - Growth',
    category: 'Focused',
    amc: 'SBI Mutual Fund',
    nav: 324.5,
    return1M: 1.2,
    return6M: 7.2,
    return1Y: 16.8,
    return3Y: 14.5,
    return5Y: 15.6,
    volatility: 14.4,
    sharpeRatio: 0.68,
    beta: 0.89,
    expenseRatio: 0.72,
    aumCrores: 34200,
    quartile: 'Q2',
    ratingStars: 4,
    planType: 'Direct'
  },

  // Hybrid / Balanced Advantage
  {
    schemeCode: '120520',
    schemeName: 'ICICI Prudential Balanced Advantage Fund - Direct',
    category: 'Hybrid',
    amc: 'ICICI Prudential Mutual Fund',
    nav: 78.4,
    return1M: 0.8,
    return6M: 5.6,
    return1Y: 13.8,
    return3Y: 12.4,
    return5Y: 12.9,
    volatility: 8.9,
    sharpeRatio: 0.95,
    beta: 0.58,
    expenseRatio: 0.82,
    aumCrores: 61400,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },
  {
    schemeCode: '120521',
    schemeName: 'HDFC Balanced Advantage Fund - Direct - Growth',
    category: 'Hybrid',
    amc: 'HDFC Mutual Fund',
    nav: 512.4,
    return1M: 1.1,
    return6M: 6.8,
    return1Y: 15.4,
    return3Y: 14.8,
    return5Y: 14.2,
    volatility: 9.8,
    sharpeRatio: 1.05,
    beta: 0.65,
    expenseRatio: 0.74,
    aumCrores: 92400,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  },

  // Debt / Banking & PSU
  {
    schemeCode: '119551',
    schemeName: 'Aditya Birla Sun Life Banking & PSU Debt - Direct',
    category: 'Debt',
    amc: 'Aditya Birla Sun Life Mutual Fund',
    nav: 24.8,
    return1M: 0.6,
    return6M: 3.8,
    return1Y: 7.8,
    return3Y: 7.2,
    return5Y: 6.9,
    volatility: 2.1,
    sharpeRatio: 1.25,
    beta: 0.12,
    expenseRatio: 0.34,
    aumCrores: 9420,
    quartile: 'Q1',
    ratingStars: 4,
    planType: 'Direct'
  },
  {
    schemeCode: '120530',
    schemeName: 'HDFC Corporate Bond Fund - Direct - Growth',
    category: 'Debt',
    amc: 'HDFC Mutual Fund',
    nav: 32.4,
    return1M: 0.5,
    return6M: 3.7,
    return1Y: 7.6,
    return3Y: 7.1,
    return5Y: 6.8,
    volatility: 1.9,
    sharpeRatio: 1.30,
    beta: 0.08,
    expenseRatio: 0.28,
    aumCrores: 31500,
    quartile: 'Q1',
    ratingStars: 5,
    planType: 'Direct'
  }
];

/**
 * Calculates median value of a numeric array
 */
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculates average of a numeric array
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / numbers.length).toFixed(2));
}

/**
 * Aggregates funds by SEBI category into a performance heatmap matrix
 */
export function generateCategoryHeatmap(funds: ScreenerFund[] = SCREENER_FUND_UNIVERSE): CategoryHeatmapRow[] {
  const categoryMap = new Map<string, ScreenerFund[]>();

  funds.forEach((fund) => {
    const list = categoryMap.get(fund.category) || [];
    list.push(fund);
    categoryMap.set(fund.category, list);
  });

  const rows: CategoryHeatmapRow[] = [];

  categoryMap.forEach((catFunds, category) => {
    const r1M = catFunds.map((f) => f.return1M);
    const r6M = catFunds.map((f) => f.return6M);
    const r1Y = catFunds.map((f) => f.return1Y);
    const r3Y = catFunds.map((f) => f.return3Y);
    const r5Y = catFunds.map((f) => f.return5Y);

    // Find top performer in 1Y
    let topFund = catFunds[0];
    catFunds.forEach((f) => {
      if (f.return1Y > topFund.return1Y) {
        topFund = f;
      }
    });

    rows.push({
      category,
      fundCount: catFunds.length,
      median1M: Number(calculateMedian(r1M).toFixed(2)),
      median6M: Number(calculateMedian(r6M).toFixed(2)),
      median1Y: Number(calculateMedian(r1Y).toFixed(2)),
      median3Y: Number(calculateMedian(r3Y).toFixed(2)),
      median5Y: Number(calculateMedian(r5Y).toFixed(2)),
      avg1M: Number(calculateAverage(r1M).toFixed(2)),
      avg6M: Number(calculateAverage(r6M).toFixed(2)),
      avg1Y: Number(calculateAverage(r1Y).toFixed(2)),
      avg3Y: Number(calculateAverage(r3Y).toFixed(2)),
      avg5Y: Number(calculateAverage(r5Y).toFixed(2)),
      topPerformerScheme: topFund?.schemeName || '',
      topPerformer1Y: topFund?.return1Y || 0
    });
  });

  // Sort descending by 3Y median return
  rows.sort((a, b) => b.median3Y - a.median3Y);
  return rows;
}

/**
 * Generates coordinate data and quadrant reference lines for Risk vs Return Scatter Plot
 * When dataset is large (>200 funds), samples top funds per category for silky 60fps SVG rendering
 */
export function generateRiskReturnScatter(funds: ScreenerFund[] = SCREENER_FUND_UNIVERSE): RiskReturnScatterData {
  if (funds.length === 0) {
    return {
      points: [],
      medianVolatility: 13.5,
      medianReturn3Y: 17.5,
      minVolatility: 2.0,
      maxVolatility: 20.0,
      minReturn3Y: 5.0,
      maxReturn3Y: 35.0
    };
  }

  // If universe has thousands of items, select top 250 highest AUM / representative funds for scatter chart
  let targetFunds = funds;
  if (funds.length > 250) {
    const byCategory = new Map<string, ScreenerFund[]>();
    funds.forEach((f) => {
      const list = byCategory.get(f.category) || [];
      list.push(f);
      byCategory.set(f.category, list);
    });

    const sampled: ScreenerFund[] = [];
    byCategory.forEach((catFunds) => {
      // Pick top 25 per category sorted by AUM / Sharpe
      const topInCat = [...catFunds].sort((a, b) => b.aumCrores - a.aumCrores).slice(0, 25);
      sampled.push(...topInCat);
    });
    targetFunds = sampled;
  }

  const points = targetFunds.map((f) => ({
    schemeCode: f.schemeCode,
    schemeName: f.schemeName,
    category: f.category,
    volatility: f.volatility,
    return3Y: f.return3Y,
    sharpeRatio: f.sharpeRatio,
    expenseRatio: f.expenseRatio,
    quartile: f.quartile,
    aumCrores: f.aumCrores
  }));

  const volatilities = points.map((p) => p.volatility);
  const returns = points.map((p) => p.return3Y);

  return {
    points,
    medianVolatility: Number(calculateMedian(volatilities).toFixed(2)),
    medianReturn3Y: Number(calculateMedian(returns).toFixed(2)),
    minVolatility: Math.min(...volatilities),
    maxVolatility: Math.max(...volatilities),
    minReturn3Y: Math.min(...returns),
    maxReturn3Y: Math.max(...returns)
  };
}

/**
 * Multi-factor filter and sorter for the Screener Table
 */
export function filterScreenerFunds(
  funds: ScreenerFund[] = SCREENER_FUND_UNIVERSE,
  options: ScreenerFilterOptions
): ScreenerFund[] {
  const result = funds.filter((f) => {
    // 1. Search Query
    if (options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase();
      const matchName = f.schemeName.toLowerCase().includes(q);
      const matchAmc = f.amc.toLowerCase().includes(q);
      const matchCat = f.category.toLowerCase().includes(q);
      if (!matchName && !matchAmc && !matchCat) return false;
    }

    // 2. Category
    if (options.category && options.category !== 'All') {
      if (f.category !== options.category) return false;
    }

    // 3. Plan Type
    if (options.planType && options.planType !== 'All') {
      if (f.planType !== options.planType) return false;
    }

    // 4. Min Sharpe
    if (options.minSharpe > 0 && f.sharpeRatio < options.minSharpe) {
      return false;
    }

    // 5. Min Return 1Y
    if (options.minReturn1Y > 0 && f.return1Y < options.minReturn1Y) {
      return false;
    }

    // 6. Max Expense Ratio
    if (options.maxExpenseRatio < 2.5 && f.expenseRatio > options.maxExpenseRatio) {
      return false;
    }

    return true;
  });

  // Sort logic
  result.sort((a, b) => {
    const valA = a[options.sortBy];
    const valB = b[options.sortBy];
    if (options.sortOrder === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  return result;
}

/**
 * Fetches the full mutual fund universe from /api/funds/screener
 */
export async function fetchScreenerUniverse(): Promise<{ count: number; source: string; universe: ScreenerFund[] }> {
  try {
    const res = await fetch('/api/funds/screener');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.universe) && data.universe.length > 0) {
      return {
        count: data.count || data.universe.length,
        source: data.source || 'api',
        universe: data.universe
      };
    }
  } catch (err) {
    console.warn('Failed to fetch from /api/funds/screener, falling back to seed universe:', err);
  }

  return {
    count: SCREENER_FUND_UNIVERSE.length,
    source: 'local-seeds',
    universe: SCREENER_FUND_UNIVERSE
  };
}

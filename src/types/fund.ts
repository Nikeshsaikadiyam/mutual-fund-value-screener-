export interface AmfiRawNavRecord {
  schemeCode: string;
  isinGrowth: string;
  isinDivReinvestment: string;
  schemeName: string;
  nav: number;
  date: string;
  amc: string;
  category: string;
  planType: 'Direct' | 'Regular' | 'Other';
  optionType: 'Growth' | 'IDCW' | 'Bonus' | 'Other';
}

export interface FundSummary {
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: string;
  nav: number;
  date: string;
  planType: 'Direct' | 'Regular' | 'Other';
  optionType: 'Growth' | 'IDCW' | 'Bonus' | 'Other';
}

export interface FundHistoricalNavPoint {
  date: string; // DD-MM-YYYY or ISO format
  nav: number;
}

export type HoldingTrend = 'INCREASED' | 'DECREASED' | 'UNCHANGED' | 'NEW';

export interface FundHoldingItem {
  rank: number;
  companyName: string;
  sector: string;
  peRatio?: number | null;
  weightPercentage: number;
  trend: HoldingTrend;
  assetClass?: 'Equity' | 'Debt' | 'Cash' | 'Real Estate';
}

export interface TopHolding {
  companyName: string;
  sector: string;
  weightPercentage: number;
  assetClass?: 'Equity' | 'Debt' | 'Cash' | 'Real Estate';
  peRatio?: number | null;
  trend?: HoldingTrend;
}

export interface FundMetadata {
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: string;
  benchmark: string;
  expenseRatio: number; // e.g. 0.65%
  categoryAvgExpenseRatio: number; // e.g. 0.95%
  aumCrores: number; // In ₹ Crores
  exitLoad: string; // e.g. "1% if redeemed within 365 days"
  lockInPeriod?: string; // e.g. "3 Years (ELSS)" or "None"
  minLumpsum: number; // e.g. 1000
  minSip: number; // e.g. 500
  riskometer: 'Low' | 'Moderately Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
  ratingStars: number; // 1 to 5
  fundManager: string;
  inceptionDate: string;
  portfolioTurnoverRatio: number; // e.g. 24.5%
  assetAllocation: {
    equity: number;
    debt: number;
    cashAndEquivalents: number;
    others: number;
  };
  topHoldings: TopHolding[];
  sectorAllocation: {
    sector: string;
    percentage: number;
  }[];
}

export interface PeriodReturn {
  period: '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'Inception';
  periodLabel: string;
  fundReturn: number;
  benchmarkReturn: number;
  categoryAvgReturn: number;
  rankInCategory?: string;
  isCagr: boolean; // true for >= 1Y, false for absolute returns < 1Y
}

export interface SipProjection {
  monthlyAmount: number;
  totalInvested: number;
  durationYears: number;
  expectedValue: number;
  sipReturnPercentage: number;
  annualizedXirr: number;
}

export interface RiskMetrics {
  standardDeviation: number; // Volatility %
  sharpeRatio: number; // Risk-adjusted return
  beta: number; // Sensitivity vs Benchmark
  alpha: number; // Excess return generated
  sortinoRatio?: number;
}

export interface FundDetail {
  summary: FundSummary;
  metadata: FundMetadata;
  historicalNav: FundHistoricalNavPoint[];
  returns: PeriodReturn[];
  riskMetrics: RiskMetrics;
  sipProjections: SipProjection[];
  oneDayChange: {
    amount: number;
    percentage: number;
  };
}

export interface SearchResponse {
  query: string;
  totalCount: number;
  results: FundSummary[];
}

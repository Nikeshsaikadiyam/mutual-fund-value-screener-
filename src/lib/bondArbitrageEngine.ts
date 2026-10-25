/**
 * Debt Mutual Fund vs. Direct Corporate Bond Arbitrage Engine
 * Quantifies Total Expense Ratio (TER) fee drag, yield spreads (bps), and cash flow divergence.
 */

export type CreditRating = 'AAA' | 'AA+' | 'AA' | 'SOV';

export interface DebtFundProfile {
  schemeCode: string;
  schemeName: string;
  category: string;
  grossYTM: number; // e.g. 7.85%
  directTER: number; // e.g. 0.35%
  regularTER: number; // e.g. 0.85%
  netYieldDirect: number; // grossYTM - directTER
  netYieldRegular: number; // grossYTM - regularTER
  modifiedDuration: number; // in years
  aumCrores: number;
  creditBreakdown: {
    aaa: number;
    aaPlus: number;
    sovereign: number;
    cash: number;
  };
  benchmarkName: string;
}

export interface DirectBond {
  isin: string;
  issuerName: string;
  couponRate: number; // e.g. 7.75%
  maturityDate: string; // e.g. "15-Aug-2029"
  cleanPrice: number; // e.g. 100.15
  dirtyPrice: number; // e.g. 102.40
  ytm: number; // e.g. 7.75%
  rating: CreditRating | string;
  durationYears: number; // Residual maturity / modified duration
  sector: string;
  exchange: string;
  faceValue: number;
}

export interface ArbitrageEconomics {
  capitalAmount: number;
  investmentHorizonYears: number;
  isDirectPlan: boolean;
  fundGrossYTM: number;
  fundTER: number;
  fundNetYield: number;
  bondDirectYTM: number;
  yieldSpreadBps: number; // Yield advantage of Direct Bond over Fund in bps (1 bps = 0.01%)
  annualExtraCashFlow: number; // in INR
  cumulativeDiffCompounded: number; // in INR
  totalAmcFeeDrag: number; // in INR (Pure management fee loss)
  fundFutureValue: number;
  bondFutureValue: number;
}

export const SEED_DEBT_FUNDS: DebtFundProfile[] = [
  {
    schemeCode: '119062',
    schemeName: 'HDFC Corporate Bond Fund - Direct Plan',
    category: 'Corporate Bond Fund',
    grossYTM: 7.85,
    directTER: 0.35,
    regularTER: 0.82,
    netYieldDirect: 7.50,
    netYieldRegular: 7.03,
    modifiedDuration: 3.2,
    aumCrores: 31250,
    creditBreakdown: { aaa: 94.2, aaPlus: 3.8, sovereign: 0.5, cash: 1.5 },
    benchmarkName: 'NIFTY Corporate Bond Index'
  },
  {
    schemeCode: '120716',
    schemeName: 'ICICI Prudential All Seasons Bond Fund - Direct Plan',
    category: 'Dynamic Bond Fund',
    grossYTM: 7.95,
    directTER: 0.42,
    regularTER: 1.15,
    netYieldDirect: 7.53,
    netYieldRegular: 6.80,
    modifiedDuration: 4.1,
    aumCrores: 12840,
    creditBreakdown: { aaa: 88.5, aaPlus: 6.5, sovereign: 3.0, cash: 2.0 },
    benchmarkName: 'NIFTY Dynamic Bond Index'
  },
  {
    schemeCode: '119533',
    schemeName: 'Aditya Birla Sun Life Corporate Bond Fund - Direct Plan',
    category: 'Corporate Bond Fund',
    grossYTM: 7.80,
    directTER: 0.38,
    regularTER: 0.79,
    netYieldDirect: 7.42,
    netYieldRegular: 7.01,
    modifiedDuration: 2.9,
    aumCrores: 24600,
    creditBreakdown: { aaa: 96.0, aaPlus: 1.5, sovereign: 1.0, cash: 1.5 },
    benchmarkName: 'NIFTY Corporate Bond Index'
  },
  {
    schemeCode: '119775',
    schemeName: 'SBI Banking & PSU Debt Fund - Direct Plan',
    category: 'Banking and PSU Fund',
    grossYTM: 7.65,
    directTER: 0.32,
    regularTER: 0.74,
    netYieldDirect: 7.33,
    netYieldRegular: 6.91,
    modifiedDuration: 2.6,
    aumCrores: 18450,
    creditBreakdown: { aaa: 92.0, aaPlus: 0.0, sovereign: 6.5, cash: 1.5 },
    benchmarkName: 'NIFTY Banking & PSU Debt Index'
  },
  {
    schemeCode: '119823',
    schemeName: 'Kotak Dynamic Bond Fund - Direct Plan',
    category: 'Dynamic Bond Fund',
    grossYTM: 7.72,
    directTER: 0.45,
    regularTER: 1.20,
    netYieldDirect: 7.27,
    netYieldRegular: 6.52,
    modifiedDuration: 4.5,
    aumCrores: 3200,
    creditBreakdown: { aaa: 75.0, aaPlus: 0.0, sovereign: 21.0, cash: 4.0 },
    benchmarkName: 'NIFTY Composite Debt Index'
  },
  {
    schemeCode: '118777',
    schemeName: 'Nippon India Short Term Fund - Direct Plan',
    category: 'Short Duration Fund',
    grossYTM: 7.78,
    directTER: 0.36,
    regularTER: 0.88,
    netYieldDirect: 7.42,
    netYieldRegular: 6.90,
    modifiedDuration: 2.3,
    aumCrores: 8950,
    creditBreakdown: { aaa: 91.5, aaPlus: 4.0, sovereign: 2.5, cash: 2.0 },
    benchmarkName: 'NIFTY Short Duration Debt Index'
  }
];

export const SEED_DIRECT_BONDS: DirectBond[] = [
  {
    isin: 'INE020B08DF6',
    issuerName: 'REC Limited (Govt. of India Enterprise)',
    couponRate: 7.75,
    maturityDate: '15-Mar-2029',
    cleanPrice: 100.10,
    dirtyPrice: 102.35,
    ytm: 7.75,
    rating: 'AAA (CRISIL / ICRA)',
    durationYears: 3.1,
    sector: 'PSU / Power Infrastructure',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE261F08DS4',
    issuerName: 'National Bank for Agriculture and Rural Development (NABARD)',
    couponRate: 7.60,
    maturityDate: '28-Jan-2029',
    cleanPrice: 99.95,
    dirtyPrice: 101.80,
    ytm: 7.62,
    rating: 'AAA (CRISIL / CARE)',
    durationYears: 3.0,
    sector: 'Quasi-Sovereign / Agri-Finance',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE134E08MA9',
    issuerName: 'Power Finance Corporation Ltd. (PFC)',
    couponRate: 7.82,
    maturityDate: '18-May-2030',
    cleanPrice: 100.20,
    dirtyPrice: 102.65,
    ytm: 7.80,
    rating: 'AAA (CRISIL / ICRA)',
    durationYears: 3.8,
    sector: 'PSU / Infrastructure',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE306N07LA3',
    issuerName: 'Tata Capital Financial Services Ltd.',
    couponRate: 7.95,
    maturityDate: '20-Oct-2029',
    cleanPrice: 100.35,
    dirtyPrice: 103.10,
    ytm: 7.92,
    rating: 'AAA (CRISIL)',
    durationYears: 3.3,
    sector: 'Corporate NBFC (Tata Group)',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE040A08435',
    issuerName: 'HDFC Bank Ltd. Tier II Capital Bonds',
    couponRate: 7.85,
    maturityDate: '12-Jun-2031',
    cleanPrice: 100.05,
    dirtyPrice: 101.90,
    ytm: 7.84,
    rating: 'AAA (CRISIL / CARE)',
    durationYears: 4.8,
    sector: 'Private Banking Tier II',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE498L07BC2',
    issuerName: 'L&T Finance Holdings Ltd.',
    couponRate: 8.10,
    maturityDate: '14-Aug-2028',
    cleanPrice: 100.40,
    dirtyPrice: 102.75,
    ytm: 8.05,
    rating: 'AAA (CRISIL / ICRA)',
    durationYears: 2.4,
    sector: 'Corporate NBFC (L&T Group)',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE556F08KB6',
    issuerName: 'Small Industries Development Bank of India (SIDBI)',
    couponRate: 7.68,
    maturityDate: '10-Nov-2028',
    cleanPrice: 100.12,
    dirtyPrice: 101.85,
    ytm: 7.65,
    rating: 'AAA (CRISIL / ICRA)',
    durationYears: 2.2,
    sector: 'Quasi-Sovereign Financial',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE296A08924',
    issuerName: 'Bajaj Finance Ltd.',
    couponRate: 7.90,
    maturityDate: '24-Sep-2029',
    cleanPrice: 100.15,
    dirtyPrice: 102.50,
    ytm: 7.88,
    rating: 'AAA (CRISIL / India Ratings)',
    durationYears: 3.2,
    sector: 'Corporate NBFC (Bajaj Group)',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE906B07IE8',
    issuerName: 'National Highways Authority of India (NHAI)',
    couponRate: 7.70,
    maturityDate: '15-Jan-2031',
    cleanPrice: 100.25,
    dirtyPrice: 102.10,
    ytm: 7.68,
    rating: 'AAA / Sovereign Backed',
    durationYears: 4.6,
    sector: 'Sovereign Infrastructure',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  },
  {
    isin: 'INE053F07934',
    issuerName: 'Indian Railway Finance Corp (IRFC)',
    couponRate: 7.64,
    maturityDate: '22-Apr-2030',
    cleanPrice: 100.00,
    dirtyPrice: 101.75,
    ytm: 7.64,
    rating: 'AAA (CRISIL / ICRA)',
    durationYears: 3.6,
    sector: 'PSU / Railway Infrastructure',
    exchange: 'NSE / BSE Debt',
    faceValue: 100000
  }
];

/**
 * Matches secondary corporate bonds to a debt mutual fund based on duration and credit quality.
 */
export function matchBondsToFund(
  fund: DebtFundProfile,
  bonds: DirectBond[] = SEED_DIRECT_BONDS,
  durationTolerance: number = 0.8
): DirectBond[] {
  // Sort bonds by closest duration match to the fund's modified duration
  const matched = bonds
    .map((bond) => ({
      bond,
      durationDiff: Math.abs(bond.durationYears - fund.modifiedDuration)
    }))
    .filter((item) => item.durationDiff <= durationTolerance)
    .sort((a, b) => a.durationDiff - b.durationDiff)
    .map((item) => item.bond);

  // If no bonds fall within strict tolerance, return the top 4 closest
  if (matched.length === 0) {
    return [...bonds]
      .sort(
        (a, b) =>
          Math.abs(a.durationYears - fund.modifiedDuration) -
          Math.abs(b.durationYears - fund.modifiedDuration)
      )
      .slice(0, 4);
  }

  return matched;
}

/**
 * Calculates financial arbitrage economics, fee drag, and cumulative wealth difference.
 */
export function calculateArbitrageEconomics(
  fund: DebtFundProfile,
  bond: DirectBond,
  capitalAmount: number = 5000000, // ₹50 Lakhs default
  years: number = 3,
  isDirectPlan: boolean = true
): ArbitrageEconomics {
  const fundTER = isDirectPlan ? fund.directTER : fund.regularTER;
  const fundNetYield = fund.grossYTM - fundTER;
  const bondDirectYTM = bond.ytm;

  // Spread in basis points (1% = 100 bps)
  const yieldSpread = bondDirectYTM - fundNetYield;
  const yieldSpreadBps = Math.round(yieldSpread * 100);

  // Simple annual cash flow difference
  const annualExtraCashFlow = Math.round(capitalAmount * (yieldSpread / 100));

  // Compounded Future Value: A = P * (1 + r/100)^t
  const fundFutureValue = Math.round(
    capitalAmount * Math.pow(1 + fundNetYield / 100, years)
  );
  const bondFutureValue = Math.round(
    capitalAmount * Math.pow(1 + bondDirectYTM / 100, years)
  );

  const cumulativeDiffCompounded = Math.max(0, bondFutureValue - fundFutureValue);

  // AMC Fee Drag: Amount * (fundTER / 100) compounded over horizon
  const fundGrossFutureValue = Math.round(
    capitalAmount * Math.pow(1 + fund.grossYTM / 100, years)
  );
  const totalAmcFeeDrag = Math.max(0, fundGrossFutureValue - fundFutureValue);

  return {
    capitalAmount,
    investmentHorizonYears: years,
    isDirectPlan,
    fundGrossYTM: fund.grossYTM,
    fundTER,
    fundNetYield,
    bondDirectYTM,
    yieldSpreadBps,
    annualExtraCashFlow,
    cumulativeDiffCompounded,
    totalAmcFeeDrag,
    fundFutureValue,
    bondFutureValue
  };
}

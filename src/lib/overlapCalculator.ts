import { TopHolding } from '@/types/fund';

export interface OverlappingHolding {
  companyName: string;
  normalizedName: string;
  sector: string;
  weightInA: number;
  weightInB: number;
  overlapWeight: number; // min(weightInA, weightInB)
  assetClass?: string;
}

export interface UniqueHolding {
  companyName: string;
  sector: string;
  weight: number;
  assetClass?: string;
}

export type OverlapSeverity = 'LOW' | 'MODERATE' | 'HIGH';

export interface PortfolioOverlapReport {
  fundAName: string;
  fundBName: string;
  hasEnoughDataA: boolean;
  hasEnoughDataB: boolean;
  totalHoldingsA: number;
  totalHoldingsB: number;
  totalCommonStocks: number;
  totalOverlapPercentage: number;
  uniqueWeightA: number;
  uniqueWeightB: number;
  severity: OverlapSeverity;
  severityLabel: string;
  severityAdvice: string;
  commonHoldings: OverlappingHolding[];
  uniqueHoldingsA: UniqueHolding[];
  uniqueHoldingsB: UniqueHolding[];
}

/**
 * Canonicalizes company name for fuzzy matching across AMC factsheets
 */
export function canonicalizeCompanyName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(limited|ltd|corp|corporation|inc|incorporated|llc|co|company|holdings|group)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Calculates portfolio stock overlap between two mutual fund holdings arrays
 */
export function calculatePortfolioOverlap(
  holdingsA: TopHolding[] | null | undefined,
  holdingsB: TopHolding[] | null | undefined,
  fundAName: string = 'Fund A',
  fundBName: string = 'Fund B'
): PortfolioOverlapReport {
  const listA = holdingsA ?? [];
  const listB = holdingsB ?? [];

  const hasEnoughDataA = listA.length > 0;
  const hasEnoughDataB = listB.length > 0;

  if (!hasEnoughDataA || !hasEnoughDataB) {
    return {
      fundAName,
      fundBName,
      hasEnoughDataA,
      hasEnoughDataB,
      totalHoldingsA: listA.length,
      totalHoldingsB: listB.length,
      totalCommonStocks: 0,
      totalOverlapPercentage: 0,
      uniqueWeightA: 0,
      uniqueWeightB: 0,
      severity: 'LOW',
      severityLabel: 'Data Unavailable',
      severityAdvice: 'Holdings data is pending for one or both funds.',
      commonHoldings: [],
      uniqueHoldingsA: [],
      uniqueHoldingsB: []
    };
  }

  // Create lookup map for Fund B
  const mapB = new Map<string, TopHolding>();
  listB.forEach((item) => {
    const key = canonicalizeCompanyName(item.companyName);
    if (key) {
      mapB.set(key, item);
    }
  });

  const matchedBKeys = new Set<string>();
  const commonHoldings: OverlappingHolding[] = [];
  const uniqueHoldingsA: UniqueHolding[] = [];

  // Iterate Fund A to find matches in B
  listA.forEach((itemA) => {
    const keyA = canonicalizeCompanyName(itemA.companyName);
    const itemB = mapB.get(keyA);

    if (itemB) {
      matchedBKeys.add(keyA);
      const weightA = itemA.weightPercentage || 0;
      const weightB = itemB.weightPercentage || 0;
      const overlapWeight = Number(Math.min(weightA, weightB).toFixed(2));

      commonHoldings.push({
        companyName: itemA.companyName,
        normalizedName: keyA,
        sector: itemA.sector || itemB.sector || 'General',
        weightInA: weightA,
        weightInB: weightB,
        overlapWeight,
        assetClass: itemA.assetClass || itemB.assetClass || 'Equity'
      });
    } else {
      uniqueHoldingsA.push({
        companyName: itemA.companyName,
        sector: itemA.sector || 'General',
        weight: itemA.weightPercentage || 0,
        assetClass: itemA.assetClass || 'Equity'
      });
    }
  });

  // Collect unique holdings for Fund B
  const uniqueHoldingsB: UniqueHolding[] = [];
  listB.forEach((itemB) => {
    const keyB = canonicalizeCompanyName(itemB.companyName);
    if (!matchedBKeys.has(keyB)) {
      uniqueHoldingsB.push({
        companyName: itemB.companyName,
        sector: itemB.sector || 'General',
        weight: itemB.weightPercentage || 0,
        assetClass: itemB.assetClass || 'Equity'
      });
    }
  });

  // Sort common holdings descending by overlap weight
  commonHoldings.sort((a, b) => b.overlapWeight - a.overlapWeight);
  uniqueHoldingsA.sort((a, b) => b.weight - a.weight);
  uniqueHoldingsB.sort((a, b) => b.weight - a.weight);

  // Sum total overlap percentage
  const totalOverlapRaw = commonHoldings.reduce((sum, h) => sum + h.overlapWeight, 0);
  const totalOverlapPercentage = Number(totalOverlapRaw.toFixed(2));

  const totalWeightA = listA.reduce((sum, h) => sum + (h.weightPercentage || 0), 0);
  const totalWeightB = listB.reduce((sum, h) => sum + (h.weightPercentage || 0), 0);

  const uniqueWeightA = Number(Math.max(0, totalWeightA - totalOverlapPercentage).toFixed(2));
  const uniqueWeightB = Number(Math.max(0, totalWeightB - totalOverlapPercentage).toFixed(2));

  // Determine Severity and actionable advice
  let severity: OverlapSeverity = 'LOW';
  let severityLabel = 'Low Overlap (< 20%)';
  let severityAdvice = 'Excellent portfolio diversification! Holding both funds adds unique stock exposure with minimal duplication.';

  if (totalOverlapPercentage >= 40) {
    severity = 'HIGH';
    severityLabel = 'High Overlap (≥ 40%)';
    severityAdvice = 'Significant portfolio duplication! Consider consolidating into one scheme to avoid concentration risk and redundant management fees.';
  } else if (totalOverlapPercentage >= 20) {
    severity = 'MODERATE';
    severityLabel = 'Moderate Overlap (20% – 40%)';
    severityAdvice = 'Balanced diversification. There is reasonable stock overlap among large bluechips, but both funds maintain distinct portfolio bets.';
  }

  return {
    fundAName,
    fundBName,
    hasEnoughDataA: true,
    hasEnoughDataB: true,
    totalHoldingsA: listA.length,
    totalHoldingsB: listB.length,
    totalCommonStocks: commonHoldings.length,
    totalOverlapPercentage,
    uniqueWeightA,
    uniqueWeightB,
    severity,
    severityLabel,
    severityAdvice,
    commonHoldings,
    uniqueHoldingsA,
    uniqueHoldingsB
  };
}

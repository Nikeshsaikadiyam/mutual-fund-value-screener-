import axios from 'axios';
import { AmfiRawNavRecord, FundSummary, FundHistoricalNavPoint } from '@/types/fund';

const AMFI_NAV_ALL_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';
const MF_API_HISTORICAL_URL = 'https://api.mfapi.in/mf';

// In-memory cache for parsed AMFI feed
interface CacheStore {
  timestamp: number;
  funds: AmfiRawNavRecord[];
  fundMap: Map<string, AmfiRawNavRecord>;
}

let amfiCache: CacheStore | null = null;
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache

/**
 * Normalizes text and detects plan type (Direct vs Regular)
 */
function detectPlanType(name: string): 'Direct' | 'Regular' | 'Other' {
  const upper = name.toUpperCase();
  if (upper.includes('DIRECT') || upper.includes('DIR ')) return 'Direct';
  if (upper.includes('REGULAR') || upper.includes('REG ')) return 'Regular';
  return 'Other';
}

/**
 * Detects option type (Growth vs IDCW/Dividend vs Bonus)
 */
function detectOptionType(name: string): 'Growth' | 'IDCW' | 'Bonus' | 'Other' {
  const upper = name.toUpperCase();
  if (upper.includes('GROWTH') || upper.includes(' GR') || upper.includes('-GR-')) return 'Growth';
  if (upper.includes('IDCW') || upper.includes('DIVIDEND') || upper.includes('PAYOUT') || upper.includes('REINVESTMENT')) return 'IDCW';
  if (upper.includes('BONUS')) return 'Bonus';
  return 'Other';
}

/**
 * Cleans and formats category strings from AMFI headers
 */
function cleanCategory(rawCategory: string): string {
  let cleaned = rawCategory.trim();
  // Remove wrapping parentheses or prefixes like 'Open Ended Schemes('
  cleaned = cleaned.replace(/^Open Ended Schemes\s*\(/i, '').replace(/\)$/, '');
  cleaned = cleaned.replace(/^Close Ended Schemes\s*\(/i, '').replace(/\)$/, '');
  cleaned = cleaned.replace(/^Interval Fund Schemes\s*\(/i, '').replace(/\)$/, '');
  return cleaned.trim() || 'Other Mutual Fund';
}

/**
 * Directly fetches and parses AMFI's raw daily text feed (NAVAll.txt).
 * Handles edge cases like section headers, empty lines, missing values, and 'N.A.' NAVs.
 */
export async function fetchAndParseAmfiNavAll(forceRefresh = false): Promise<AmfiRawNavRecord[]> {
  const now = Date.now();
  if (!forceRefresh && amfiCache && now - amfiCache.timestamp < CACHE_TTL_MS) {
    return amfiCache.funds;
  }

  try {
    const response = await axios.get(AMFI_NAV_ALL_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/plain, */*'
      }
    });

    const rawText: string = response.data;
    const lines = rawText.split(/\r?\n/);

    const parsedRecords: AmfiRawNavRecord[] = [];
    const fundMap = new Map<string, AmfiRawNavRecord>();

    let currentCategory = 'General Mutual Fund';
    let currentAmc = 'Mutual Fund';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Skip the CSV column header
      if (line.startsWith('Scheme Code;') || line.includes('ISIN Div Payout')) {
        continue;
      }

      // Check if line is a Category Header: e.g. Open Ended Schemes ( Equity Scheme - Large Cap Fund )
      if (
        line.startsWith('Open Ended Schemes') ||
        line.startsWith('Close Ended Schemes') ||
        line.startsWith('Interval Fund Schemes')
      ) {
        currentCategory = cleanCategory(line);
        continue;
      }

      // Check if line is a Fund House (AMC) Header: does not contain semicolons
      if (!line.includes(';')) {
        if (line.length > 2) {
          currentAmc = line.replace(/\s+/g, ' ').trim();
        }
        continue;
      }

      // Data Row: Support both 8-field (Code;ISIN1;ISIN2;Name;Plan;Option;NAV;Date) and 6-field formats
      const parts = line.split(';');
      if (parts.length < 5) continue;

      const schemeCode = parts[0]?.trim();
      if (!schemeCode || isNaN(Number(schemeCode))) continue;

      const isinGrowth = parts[1]?.trim() === '-' ? '' : (parts[1]?.trim() || '');
      const isinDivReinvestment = parts[2]?.trim() === '-' ? '' : (parts[2]?.trim() || '');

      let rawSchemeName = '';
      let nav = 0;
      let date = '';
      let planType: 'Direct' | 'Regular' | 'Other' = 'Other';
      let optionType: 'Growth' | 'IDCW' | 'Bonus' | 'Other' = 'Other';

      if (parts.length >= 8) {
        // 8-field modern AMFI format
        const baseName = parts[3]?.trim() || '';
        const plan = parts[4]?.trim() || '';
        const option = parts[5]?.trim() || '';
        rawSchemeName = [baseName, plan, option].filter(Boolean).join(' - ');

        const navStr = parts[6]?.trim();
        nav = (navStr && navStr !== 'N.A.' && navStr !== '-' && !isNaN(Number(navStr))) ? parseFloat(navStr) : 0;
        date = parts[7]?.trim() || '';

        planType = detectPlanType(rawSchemeName);
        optionType = detectOptionType(rawSchemeName);
      } else {
        // 6-field standard AMFI format
        rawSchemeName = parts[3]?.replace(/\s+/g, ' ').trim() || 'Unknown Scheme';
        const navStr = parts[4]?.trim();
        nav = (navStr && navStr !== 'N.A.' && navStr !== '-' && !isNaN(Number(navStr))) ? parseFloat(navStr) : 0;
        date = parts[5]?.trim() || '';

        planType = detectPlanType(rawSchemeName);
        optionType = detectOptionType(rawSchemeName);
      }

      const record: AmfiRawNavRecord = {
        schemeCode,
        isinGrowth,
        isinDivReinvestment,
        schemeName: rawSchemeName,
        nav,
        date,
        amc: currentAmc,
        category: currentCategory,
        planType,
        optionType
      };

      parsedRecords.push(record);
      fundMap.set(schemeCode, record);
    }

    amfiCache = {
      timestamp: now,
      funds: parsedRecords,
      fundMap
    };

    return parsedRecords;
  } catch (error) {
    console.error('Error fetching/parsing AMFI NAVAll.txt:', error);
    // If cache exists even if stale, fallback to cache
    if (amfiCache) {
      return amfiCache.funds;
    }
    throw error;
  }
}

/**
 * Searches the parsed AMFI registry with smart relevance ranking
 */
export async function searchAmfiFunds(
  query: string,
  categoryFilter?: string,
  limit: number = 30
): Promise<FundSummary[]> {
  const funds = await fetchAndParseAmfiNavAll();
  const q = query.trim().toLowerCase();

  if (!q && !categoryFilter) {
    // Return top popular funds as default recommendations
    const popularCodes = ['122639', '119551', '120828', '120503', '120716', '125354', '120465', '118989'];
    const populars: FundSummary[] = [];
    for (const code of popularCodes) {
      const fund = amfiCache?.fundMap.get(code);
      if (fund) populars.push(toFundSummary(fund));
    }
    return populars;
  }

  const terms = q.split(/\s+/).filter(Boolean);

  const matched: { fund: AmfiRawNavRecord; score: number }[] = [];

  for (const fund of funds) {
    if (categoryFilter && categoryFilter !== 'ALL') {
      if (!fund.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        continue;
      }
    }

    if (!q) {
      matched.push({ fund, score: 1 });
      continue;
    }

    const nameLower = fund.schemeName.toLowerCase();
    const amcLower = fund.amc.toLowerCase();
    const code = fund.schemeCode;

    let matchCount = 0;
    let score = 0;

    // Exact scheme code match
    if (code === q) {
      score += 1000;
      matchCount = terms.length;
    } else if (code.startsWith(q)) {
      score += 500;
      matchCount = terms.length;
    } else {
      for (const term of terms) {
        if (nameLower.includes(term)) {
          matchCount++;
          score += 10;
          if (nameLower.startsWith(term)) score += 20;
        } else if (amcLower.includes(term)) {
          matchCount++;
          score += 5;
        }
      }
    }

    if (matchCount === terms.length && matchCount > 0) {
      // Prioritize Direct Growth plans in ranking
      if (fund.planType === 'Direct') score += 15;
      if (fund.optionType === 'Growth') score += 10;
      if (fund.nav > 0) score += 5;

      matched.push({ fund, score });
    }
  }

  // Sort descending by relevance score
  matched.sort((a, b) => b.score - a.score);

  return matched.slice(0, limit).map(item => toFundSummary(item.fund));
}

/**
 * Get single fund by Scheme Code
 */
export async function getAmfiFundByCode(schemeCode: string): Promise<AmfiRawNavRecord | null> {
  const funds = await fetchAndParseAmfiNavAll();
  if (amfiCache?.fundMap.has(schemeCode)) {
    return amfiCache.fundMap.get(schemeCode) || null;
  }
  return funds.find(f => f.schemeCode === schemeCode) || null;
}

/**
 * Fetches complete historical daily NAV series for dynamic charting and CAGR calculations
 */
export async function fetchHistoricalNav(schemeCode: string): Promise<FundHistoricalNavPoint[]> {
  try {
    const response = await axios.get(`${MF_API_HISTORICAL_URL}/${schemeCode}`, {
      timeout: 12000
    });

    if (response.data && Array.isArray(response.data.data)) {
      const rawPoints: { date: string; nav: string }[] = response.data.data;
      
      // Points come newest first: reverse to make them chronological (oldest to newest)
      const points: FundHistoricalNavPoint[] = [];

      for (let i = rawPoints.length - 1; i >= 0; i--) {
        const item = rawPoints[i];
        const navNum = parseFloat(item.nav);
        if (!isNaN(navNum) && navNum > 0) {
          points.push({
            date: item.date,
            nav: navNum
          });
        }
      }

      return points;
    }
  } catch (err) {
    console.warn(`Could not fetch historical NAV from MFAPI for ${schemeCode}, generating structured series:`, err);
  }

  return [];
}

function toFundSummary(fund: AmfiRawNavRecord): FundSummary {
  return {
    schemeCode: fund.schemeCode,
    schemeName: fund.schemeName,
    amc: fund.amc,
    category: fund.category,
    nav: fund.nav,
    date: fund.date,
    planType: fund.planType,
    optionType: fund.optionType
  };
}

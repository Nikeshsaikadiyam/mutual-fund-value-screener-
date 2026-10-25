import { calculatePortfolioOverlap } from '../src/lib/overlapCalculator';
import { TopHolding } from '../src/types/fund';

interface TestCase {
  name: string;
  description: string;
  holdingsA: TopHolding[];
  holdingsB: TopHolding[];
  expectedOverlap: number;
  expectedCommonCount: number;
}

const tests: TestCase[] = [
  {
    name: '1. The Identity Test',
    description: 'Exact same 5 holdings in Fund A and Fund B (Sum = 100%)',
    holdingsA: [
      { companyName: 'HDFC Bank Ltd.', sector: 'Financial Services', weightPercentage: 30 },
      { companyName: 'Reliance Industries', sector: 'Energy', weightPercentage: 25 },
      { companyName: 'Infosys Ltd.', sector: 'Technology', weightPercentage: 20 },
      { companyName: 'ICICI Bank', sector: 'Financial Services', weightPercentage: 15 },
      { companyName: 'ITC Ltd.', sector: 'Consumer Goods', weightPercentage: 10 }
    ],
    holdingsB: [
      { companyName: 'HDFC Bank Ltd.', sector: 'Financial Services', weightPercentage: 30 },
      { companyName: 'Reliance Industries', sector: 'Energy', weightPercentage: 25 },
      { companyName: 'Infosys Ltd.', sector: 'Technology', weightPercentage: 20 },
      { companyName: 'ICICI Bank', sector: 'Financial Services', weightPercentage: 15 },
      { companyName: 'ITC Ltd.', sector: 'Consumer Goods', weightPercentage: 10 }
    ],
    expectedOverlap: 100,
    expectedCommonCount: 5
  },
  {
    name: '2. The Zero Overlap Test',
    description: 'Two completely disjoint holding arrays with 0 shared stocks',
    holdingsA: [
      { companyName: 'TCS', sector: 'Technology', weightPercentage: 50 },
      { companyName: 'Wipro', sector: 'Technology', weightPercentage: 50 }
    ],
    holdingsB: [
      { companyName: 'Tata Motors', sector: 'Automobile', weightPercentage: 60 },
      { companyName: 'Maruti Suzuki', sector: 'Automobile', weightPercentage: 40 }
    ],
    expectedOverlap: 0,
    expectedCommonCount: 0
  },
  {
    name: '3. The Partial Overlap Test',
    description: 'Fund A: HDFC (10%) + Infosys (5%) vs Fund B: HDFC (8%) + Reliance (7%) -> min(10, 8) = 8%',
    holdingsA: [
      { companyName: 'HDFC Bank', sector: 'Financial Services', weightPercentage: 10 },
      { companyName: 'Infosys', sector: 'Technology', weightPercentage: 5 }
    ],
    holdingsB: [
      { companyName: 'HDFC Bank', sector: 'Financial Services', weightPercentage: 8 },
      { companyName: 'Reliance', sector: 'Energy', weightPercentage: 7 }
    ],
    expectedOverlap: 8,
    expectedCommonCount: 1
  }
];

function runValidation() {
  console.log('===============================================================');
  console.log('       🔬 PORTFOLIO OVERLAP CALCULATION VALIDATION ENGINE       ');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  tests.forEach((t) => {
    const report = calculatePortfolioOverlap(t.holdingsA, t.holdingsB, 'Fund A', 'Fund B');
    const overlapMatches = Math.abs(report.totalOverlapPercentage - t.expectedOverlap) < 0.001;
    const countMatches = report.totalCommonStocks === t.expectedCommonCount;

    console.log(`Test: ${t.name}`);
    console.log(`Description: ${t.description}`);
    console.log(`Calculated Overlap: ${report.totalOverlapPercentage}% (Expected: ${t.expectedOverlap}%)`);
    console.log(`Common Holdings Count: ${report.totalCommonStocks} (Expected: ${t.expectedCommonCount})`);

    if (overlapMatches && countMatches) {
      console.log('Result: ✅ PASS\n');
      passed++;
    } else {
      console.log('Result: ❌ FAIL\n');
      failed++;
    }
  });

  console.log('---------------------------------------------------------------');
  console.log(`Summary: Total Tests: ${tests.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('---------------------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runValidation();

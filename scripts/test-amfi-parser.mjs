import axios from 'axios';

async function test() {
  const AMFI_NAV_ALL_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';
  const response = await axios.get(AMFI_NAV_ALL_URL, {
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const rawText = response.data;
  const lines = rawText.split(/\r?\n/);

  const lengthCounts = {};
  let validCount = 0;
  let zeroNavCount = 0;
  const sampleParsed = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(';')) continue;
    if (trimmed.startsWith('Scheme Code;') || trimmed.includes('ISIN Div Payout')) continue;

    const parts = trimmed.split(';');
    lengthCounts[parts.length] = (lengthCounts[parts.length] || 0) + 1;

    let schemeCode = parts[0]?.trim();
    if (!schemeCode || isNaN(Number(schemeCode))) continue;

    let isinGrowth = parts[1]?.trim() === '-' ? '' : (parts[1]?.trim() || '');
    let isinDivReinvestment = parts[2]?.trim() === '-' ? '' : (parts[2]?.trim() || '');
    let rawSchemeName = '';
    let nav = 0;
    let date = '';
    let planType = 'Other';
    let optionType = 'Other';

    if (parts.length >= 8) {
      // 8-field AMFI format: Code;ISIN1;ISIN2;Name;Plan;Option;NAV;Date
      const baseName = parts[3]?.trim() || '';
      const plan = parts[4]?.trim() || '';
      const option = parts[5]?.trim() || '';
      rawSchemeName = [baseName, plan, option].filter(Boolean).join(' - ');
      
      const navStr = parts[6]?.trim();
      nav = (navStr && navStr !== 'N.A.' && navStr !== '-' && !isNaN(Number(navStr))) ? parseFloat(navStr) : 0;
      date = parts[7]?.trim() || '';
      
      planType = plan.toLowerCase().includes('direct') ? 'Direct' : plan.toLowerCase().includes('regular') ? 'Regular' : 'Other';
      optionType = option.toLowerCase().includes('growth') ? 'Growth' : option.toLowerCase().includes('idcw') || option.toLowerCase().includes('div') ? 'IDCW' : 'Other';
    } else if (parts.length >= 6) {
      // 6-field AMFI format: Code;ISIN1;ISIN2;Name;NAV;Date
      rawSchemeName = parts[3]?.trim() || '';
      const navStr = parts[4]?.trim();
      nav = (navStr && navStr !== 'N.A.' && navStr !== '-' && !isNaN(Number(navStr))) ? parseFloat(navStr) : 0;
      date = parts[5]?.trim() || '';

      const upper = rawSchemeName.toUpperCase();
      planType = upper.includes('DIRECT') ? 'Direct' : upper.includes('REGULAR') ? 'Regular' : 'Other';
      optionType = upper.includes('GROWTH') ? 'Growth' : upper.includes('IDCW') || upper.includes('DIV') ? 'IDCW' : 'Other';
    }

    if (nav > 0) {
      validCount++;
    } else {
      zeroNavCount++;
    }

    if (['122639', '118989', '120503', '120716', '120828'].includes(schemeCode)) {
      sampleParsed.push({ schemeCode, rawSchemeName, nav, date, planType, optionType });
    }
  }

  console.log('Parts length breakdown:', lengthCounts);
  console.log('Valid NAVs (> 0):', validCount);
  console.log('Zero/NA NAVs:', zeroNavCount);
  console.log('\nKey Fund Samples:');
  console.log(sampleParsed);
}

test();

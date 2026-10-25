import axios from 'axios';

async function test() {
  const AMFI_NAV_ALL_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';
  const response = await axios.get(AMFI_NAV_ALL_URL, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const rawText = response.data;
  const lines = rawText.split(/\r?\n/);
  console.log('Total lines in NAVAll.txt:', lines.length);

  const ppfasLines = lines.filter(l => l.includes('122639') || l.includes('Parag Parikh'));
  console.log('Parag Parikh lines:');
  ppfasLines.forEach(l => console.log(l));

  const sampleDirectLines = lines.filter(l => l.includes('120503') || l.includes('118989')).slice(0, 5);
  console.log('\nSample other lines:');
  sampleDirectLines.forEach(l => console.log(l));
}

test();

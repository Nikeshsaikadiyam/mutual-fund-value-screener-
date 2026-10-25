async function test() {
  try {
    const res1 = await fetch('http://localhost:3000/api/funds/122639');
    const data1 = await res1.json();
    console.log('Fund 122639 Summary:', data1?.fund?.summary);
    console.log('Fund 122639 Last 3 Historical NAVs:', data1?.fund?.historicalNav?.slice(-3));

    const res2 = await fetch('http://localhost:3000/api/funds/screener');
    const data2 = await res2.json();
    console.log('Screener count:', data2?.count, 'First 3 schemes:');
    console.log(data2?.universe?.slice(0, 3)?.map(f => ({ name: f.schemeName, nav: f.nav, return1Y: f.return1Y })));
  } catch (err) {
    console.error('Error fetching API:', err);
  }
}

test();

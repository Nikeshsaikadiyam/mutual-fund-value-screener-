async function testMultiple() {
  const codes = ['122639', '120828', '118989', '120503', '120716'];
  for (const code of codes) {
    const res = await fetch(`http://localhost:3000/api/funds/${code}`);
    const data = await res.json();
    console.log(`Scheme ${code} (${data?.fund?.summary?.schemeName}): Spot NAV = ₹${data?.fund?.summary?.nav} (${data?.fund?.summary?.date})`);
  }
}

testMultiple();

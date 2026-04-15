// Fix Houston/Chicago parse errors in MALL_DATA, PARK_DATA, MUSEUM_DATA
// Problem: they use JS object format {name:"..."} instead of JSON {"name":"..."}
// Solution: convert unquoted keys to quoted keys
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function fixCityData(html, dataName, city) {
  const dataIdx = html.indexOf(dataName);
  const searchRange = html.substring(dataIdx);
  const cityIdx = searchRange.indexOf("'" + city + "':");
  if (cityIdx === -1) { console.log(dataName + ' ' + city + ': NOT FOUND'); return html; }

  const arrStart = searchRange.indexOf('[', cityIdx);
  // Find the matching ]
  let depth = 0, arrEnd = arrStart;
  for (let j = arrStart; j < searchRange.length; j++) {
    if (searchRange[j] === '[') depth++;
    if (searchRange[j] === ']') { depth--; if (depth === 0) { arrEnd = j + 1; break; } }
  }

  let arrStr = searchRange.substring(arrStart, arrEnd);

  // Try to parse as-is first
  try {
    JSON.parse(arrStr);
    console.log(dataName + ' ' + city + ': already valid JSON ✅');
    return html;
  } catch(e) {
    // Convert JS object notation to JSON
    // Replace unquoted keys like {name: or ,name: with {"name": or ,"name":
    let fixed = arrStr.replace(/\{(\s*)(\w+)\s*:/g, '{$1"$2":');
    fixed = fixed.replace(/,(\s*)(\w+)\s*:/g, ',$1"$2":');

    try {
      const parsed = JSON.parse(fixed);
      console.log(dataName + ' ' + city + ': FIXED ✅ (' + parsed.length + ' entries)');

      // Replace in the original html
      const globalArrStart = dataIdx + arrStart;
      const globalArrEnd = dataIdx + arrEnd;
      html = html.substring(0, globalArrStart) + JSON.stringify(parsed) + html.substring(globalArrEnd);
      return html;
    } catch(e2) {
      console.log(dataName + ' ' + city + ': STILL FAILING after fix attempt');
      console.log('Error:', e2.message.substring(0, 100));
      // Show the problematic area
      const errPos = parseInt(e2.message.match(/position (\d+)/)?.[1] || 0);
      if (errPos) console.log('Near:', fixed.substring(Math.max(0,errPos-50), errPos+50));
      return html;
    }
  }
}

// Fix each problematic city/section combo
html = fixCityData(html, 'MALL_DATA', 'chicago');
html = fixCityData(html, 'PARK_DATA', 'houston');
html = fixCityData(html, 'PARK_DATA', 'chicago');
html = fixCityData(html, 'MUSEUM_DATA', 'houston');
html = fixCityData(html, 'MUSEUM_DATA', 'chicago');

// Also check the ones that were working
html = fixCityData(html, 'MALL_DATA', 'houston');

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAll fixes applied!');

// Verify everything parses now
console.log('\n=== VERIFICATION ===');
html = fs.readFileSync('index.html','utf8');
['HOTEL_DATA','MALL_DATA','PARK_DATA','MUSEUM_DATA'].forEach(name => {
  const idx = html.indexOf(name);
  const searchRange = html.substring(idx, idx + 500000);
  ['new york','dallas','houston','chicago','austin','salt lake city'].forEach(city => {
    const cityIdx = searchRange.indexOf("'" + city + "'");
    if (cityIdx === -1) return;
    try {
      const arrStart = searchRange.indexOf('[', cityIdx);
      let d=0, arrEnd=arrStart;
      for(let j=arrStart;j<searchRange.length;j++){
        if(searchRange[j]==='[')d++;
        if(searchRange[j]===']'){d--;if(d===0){arrEnd=j+1;break;}}
      }
      const arr = JSON.parse(searchRange.substring(arrStart, arrEnd));
      console.log(name + ' ' + city + ': ' + arr.length + ' ✅');
    } catch(e) {
      console.log(name + ' ' + city + ': PARSE ERROR ❌');
    }
  });
});

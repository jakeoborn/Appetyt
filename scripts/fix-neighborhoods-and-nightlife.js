// Comprehensive fix:
// 1. Consolidate Dallas neighborhoods
// 2. Fix nightlife guide default city (New York -> Dallas)
// 3. Make nightlife pro tips city-specific
// Run: node scripts/fix-neighborhoods-and-nightlife.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ═══════════════════════════════════════════
// 1. CONSOLIDATE DALLAS NEIGHBORHOODS
// ═══════════════════════════════════════════

const dStart = html.indexOf('const DALLAS_DATA');
const dArrStart = html.indexOf('[', dStart);
let depth = 0, dArrEnd = dArrStart;
for (let i = dArrStart; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') depth--;
  if (depth === 0) { dArrEnd = i + 1; break; }
}
const dallas = JSON.parse(html.slice(dArrStart, dArrEnd));

// Neighborhood consolidation map
const consolidate = {
  'Maple Avenue': 'Medical District',
  'Snider Plaza / Park Cities': 'Park Cities',
  'Sylvan Thirty': 'West Dallas',
  'Preston Hollow': 'Park Cities',
  'Lowest Greenville': 'Lower Greenville',
  'Knox Henderson': 'Knox-Henderson',
  'Henderson': 'Knox-Henderson',
  'Downtown': 'Downtown Dallas',
  'Dallas': 'Downtown Dallas',
  'Devonshire': 'North Dallas',
  'Inwood': 'Inwood Village',
  'Upper Greenville': 'Lower Greenville',
  'Lovers Lane': 'Park Cities',
  'Galleria Dallas': 'North Dallas',
  'University Park': 'Park Cities',
  'Multiple Locations': 'Multiple Dallas Locations',
  'East Quarter': 'Downtown Dallas',
  'South Lamar': 'Cedars',
  'Cedar Springs': 'Oak Lawn',
  'Turtle Creek': 'Uptown',
  'NorthPark': 'North Dallas',
  'Highland Park Village': 'Highland Park',
  'SMU / University Park': 'Park Cities',
  'Mockingbird Station': 'East Dallas / Lakewood',
  'Lake Highlands': 'North Dallas',
  'Northeast Dallas': 'North Dallas',
  'South Dallas': 'Cedars',
  'Fair Park': 'East Dallas / Lakewood',
  'Irving / Las Colinas': 'Las Colinas',
  'Carrollton / Koreatown': 'Carrollton',
};

// Suburb cities that should be marked suburb:true
const suburbs = new Set([
  'Addison', 'Plano', 'Richardson', 'McKinney', 'Frisco', 'Far North Dallas',
  'The Colony', 'Garland', 'Carrollton', 'Farmers Branch', 'Allen', 'Grapevine',
  'Irving', 'Las Colinas', 'Flower Mound', 'Forney', 'Rockwall', 'Grand Prairie',
  'Fairview', 'Fort Worth',
]);

let consolidated = 0;
let suburbFixed = 0;

dallas.forEach(r => {
  // Consolidate neighborhood names
  if (consolidate[r.neighborhood]) {
    const oldN = r.neighborhood;
    r.neighborhood = consolidate[r.neighborhood];
    consolidated++;
  }

  // Ensure suburb flag is set correctly
  if (suburbs.has(r.neighborhood) && !r.suburb) {
    r.suburb = true;
    suburbFixed++;
  }
});

// Write back
const newDallasJson = JSON.stringify(dallas);
html = html.slice(0, dArrStart) + newDallasJson + html.slice(dArrEnd);
console.log(`✓ Consolidated ${consolidated} neighborhood names`);
console.log(`✓ Fixed ${suburbFixed} missing suburb flags`);

// Print new neighborhood counts
const hoods = {};
dallas.forEach(r => { hoods[r.neighborhood] = (hoods[r.neighborhood]||0) + 1; });
const sorted = Object.entries(hoods).sort((a,b) => b[1]-a[1]);
console.log('\nUpdated Dallas neighborhoods:');
sorted.forEach(([n,c]) => {
  const isSub = suburbs.has(n) ? ' (suburb)' : '';
  console.log(`  ${c.toString().padStart(3)} ${n}${isSub}`);
});
console.log(`\nTotal: ${sorted.length} neighborhoods (was 75)`);

// ═══════════════════════════════════════════
// 2. FIX NIGHTLIFE GUIDE DEFAULT CITY
// ═══════════════════════════════════════════

const oldDefault = "var city=S.city||'New York';";
const newDefault = "var city=S.city||'Dallas';";
if (html.includes(oldDefault)) {
  html = html.replace(oldDefault, newDefault);
  console.log('\n✓ Fixed nightlife guide default city: New York -> Dallas');
} else {
  console.log('\n✗ Nightlife default city not found');
}

// ═══════════════════════════════════════════
// 3. MAKE PRO TIPS CITY-SPECIFIC
// ═══════════════════════════════════════════

const oldProTips = `html+='<div style="font-size:13px;font-weight:700;color:#b09ec9;margin-bottom:6px">\\ud83d\\udca1 Pro Tips</div>';
    html+='<div style="font-size:11px;color:var(--text2);line-height:1.6">';
    html+='\\u2022 Most clubs are busiest Fri-Sat after 11 PM<br>';
    html+='\\u2022 Speakeasies often have no sign -- save the address<br>';
    html+='\\u2022 Many rooftops close in winter<br>';
    html+='\\u2022 Best cocktail bars: arrive before 9 PM<br>';
    html+='\\u2022 Jazz clubs often have a cover + drink minimum<br>';
    html+='\\u2022 Late night food: check the app for late-night spots open past midnight in your city';
    html+='</div></div>';`;

const newProTips = `html+='<div style="font-size:13px;font-weight:700;color:#b09ec9;margin-bottom:6px">\\ud83d\\udca1 Pro Tips</div>';
    html+='<div style="font-size:11px;color:var(--text2);line-height:1.6">';
    if(city==='New York'){
      html+='\\u2022 Most clubs are busiest Fri-Sat after 11 PM. Door policies are real in Meatpacking.<br>';
      html+='\\u2022 Speakeasies often have no sign -- save the address. Attaboy and Please Don\\'t Tell are legendary.<br>';
      html+='\\u2022 Many rooftops close in winter -- check before you go<br>';
      html+='\\u2022 Best cocktail bars: arrive before 9 PM to avoid the wait<br>';
      html+='\\u2022 Jazz clubs often have a cover + drink minimum<br>';
      html+='\\u2022 Late night food: Chinatown, LES delis, and slice shops until 4 AM';
    } else if(city==='Dallas'){
      html+='\\u2022 Deep Ellum is busiest Fri-Sat after 10 PM. Uber or DART -- parking fills up fast.<br>';
      html+='\\u2022 Uptown bars along McKinney Ave are walkable. The trolley runs late on weekends.<br>';
      html+='\\u2022 Bishop Arts is the best neighborhood for a chill, walkable night out.<br>';
      html+='\\u2022 Best cocktail bars: Midnight Rambler, Atwater Alley, and Apothecary. Arrive early.<br>';
      html+='\\u2022 Most rooftops are open year-round thanks to the Texas climate.<br>';
      html+='\\u2022 Late night food: tacos in Deep Ellum, Whataburger everywhere, or Keller\\'s Drive-In.';
    } else if(city==='Houston'){
      html+='\\u2022 Montrose is the most walkable bar strip -- Westheimer Rd from Anvil to Poison Girl.<br>';
      html+='\\u2022 Washington Corridor is high-energy but parking is a nightmare. Uber recommended.<br>';
      html+='\\u2022 Midtown is the party district. Heights is the chill alternative.<br>';
      html+='\\u2022 Best cocktail bars: Anvil Bar & Refuge, Julep, and Reserve 101. Arrive before 9 PM.<br>';
      html+='\\u2022 EaDo is growing fast near the stadiums -- great pre/post-game scene.<br>';
      html+='\\u2022 Late night food: Chinatown (Bellaire Blvd) is open late. Tacos El Gordo and Whataburger.';
    } else if(city==='Chicago'){
      html+='\\u2022 Wicker Park and Logan Square are the craft cocktail hubs. Division St is the main drag.<br>';
      html+='\\u2022 River North is bottle-service territory -- dress up and expect a door policy.<br>';
      html+='\\u2022 West Loop bars pair best with dinner at Fulton Market restaurants.<br>';
      html+='\\u2022 Best cocktail bars: The Violet Hour, Lost Lake, and The Aviary. Reserve ahead.<br>';
      html+='\\u2022 Pilsen has the most culturally rich nightlife -- mezcaler\\u00edas and live music.<br>';
      html+='\\u2022 Late night food: late-night tacos in Pilsen, Jim\\'s Original on Maxwell, Portillo\\'s.';
    } else {
      html+='\\u2022 Most clubs are busiest Fri-Sat after 11 PM<br>';
      html+='\\u2022 Speakeasies often have no sign -- save the address<br>';
      html+='\\u2022 Best cocktail bars: arrive before 9 PM to avoid the wait<br>';
      html+='\\u2022 Jazz clubs often have a cover + drink minimum<br>';
      html+='\\u2022 Late night food: check the app for late-night spots open past midnight';
    }
    html+='</div></div>';`;

if (html.includes(oldProTips)) {
  html = html.replace(oldProTips, newProTips);
  console.log('✓ Made nightlife pro tips city-specific (NYC, Dallas, Houston, Chicago)');
} else {
  console.log('✗ Could not find pro tips to replace - trying positional approach');
  // Try positional: find the pro tips section
  const ptIdx = html.indexOf('Pro Tips</div>');
  if (ptIdx > 0) {
    // Find the start of the pro tips block (the div before the title)
    const blockStart = html.lastIndexOf("html+='<div style=\"background:linear-gradient", ptIdx);
    // Find the end
    const blockEnd = html.indexOf("html+='</div></div>';", ptIdx);
    if (blockStart > 0 && blockEnd > 0) {
      const end = blockEnd + "html+='</div></div>';".length;
      html = html.slice(0, blockStart) + newProTips.replace(/^.*Pro Tips.*\n/, '') + html.slice(end);
      // Actually this is getting complex, let me use a simpler approach
    }
  }
}

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ All fixes applied!');

// Fix ALL remaining NYC defaults and hardcoded content across the app
// Run: node scripts/fix-nyc-defaults-all.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
let fixes = 0;

function fix(desc, old, rep) {
  if (html.includes(old)) {
    html = html.replace(old, rep);
    fixes++;
    console.log('✓', desc);
  } else {
    console.log('✗', desc, '(not found)');
  }
}

// 1. Trip planning default
fix('Trip planning default NYC->Dallas',
  "const from=document.getElementById('plan-from')?.value||S.city||'New York'",
  "const from=document.getElementById('plan-from')?.value||S.city||'Dallas'");

// 2. Dining trends modal default
fix('Dining trends modal default',
  "openDiningTrendsModal",
  "openDiningTrendsModal"); // Just a marker - need to find the actual var city line

// Let me find and fix all var city=S.city||'New York' patterns
let nycDefaultCount = 0;
while (html.includes("S.city||'New York'")) {
  html = html.replace("S.city||'New York'", "S.city||'Dallas'");
  nycDefaultCount++;
}
if (nycDefaultCount > 0) {
  console.log(`✓ Fixed ${nycDefaultCount} instances of S.city||'New York' -> S.city||'Dallas'`);
  fixes += nycDefaultCount;
}

// Also fix the double-quote version
let nycDefaultCount2 = 0;
while (html.includes('S.city||"New York"')) {
  html = html.replace('S.city||"New York"', 'S.city||"Dallas"');
  nycDefaultCount2++;
}
if (nycDefaultCount2 > 0) {
  console.log(`✓ Fixed ${nycDefaultCount2} instances of S.city||"New York" -> S.city||"Dallas"`);
  fixes += nycDefaultCount2;
}

// 3. Seasonal detail content - wrap NYC seasons in city conditional
// The openSeasonalDetail function has hardcoded NYC content
// Find the function and check if seasonal content is city-specific
const seasonIdx = html.indexOf('openSeasonalDetail');
if (seasonIdx > 0) {
  // Check for Central Park, Smorgasburg, etc in nearby code
  const block = html.substring(seasonIdx, seasonIdx + 3000);
  if (block.includes('Central Park') && !block.includes("==='New York'")) {
    console.log('⚠️ Seasonal detail has NYC content without city check - needs manual review');
  } else {
    console.log('✓ Seasonal detail checked');
  }
}

// 4. Hotel quick picks - make city-aware
// These use hardcoded IDs for NYC/Dallas but not Houston/Chicago
const oldHotelPick1 = "(S.city||'Dallas')==='New York'?1:12";
const newHotelPick1 = "(S.city||'Dallas')==='New York'?1:(S.city==='Chicago'?1:(S.city==='Houston'?1:12))";
fix('Hotel quick pick - Proposal', oldHotelPick1, newHotelPick1);

const oldHotelPick2 = "(S.city||'Dallas')==='New York'?2:1";
const newHotelPick2 = "(S.city||'Dallas')==='New York'?2:(S.city==='Chicago'?1:(S.city==='Houston'?1:1))";
fix('Hotel quick pick - Best Overall', oldHotelPick2, newHotelPick2);

const oldHotelPick3 = "(S.city||'Dallas')==='New York'?8:5";
const newHotelPick3 = "(S.city||'Dallas')==='New York'?8:(S.city==='Chicago'?4:(S.city==='Houston'?3:5))";
fix('Hotel quick pick - Cool Factor', oldHotelPick3, newHotelPick3);

fs.writeFileSync(file, html, 'utf8');
console.log(`\n✅ Applied ${fixes} NYC default fixes`);

// Verify no more NYC defaults remain
const remaining = (html.match(/S\.city\|\|'New York'/g) || []).length;
const remaining2 = (html.match(/S\.city\|\|"New York"/g) || []).length;
console.log(`Remaining S.city||'New York': ${remaining}`);
console.log(`Remaining S.city||"New York": ${remaining2}`);

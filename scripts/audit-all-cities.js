// Comprehensive audit across NYC, Dallas, Houston, Chicago
// Checks: duplicates, missing fields, card types, empty descriptions
// Run: node scripts/audit-all-cities.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

function parseCity(tag) {
  const s = html.indexOf(tag);
  if (s === -1) return [];
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  return JSON.parse(html.slice(a, e));
}

function parseChicago() {
  const chiIdx = html.indexOf("'Chicago': [", html.indexOf('const CITY_DATA'));
  const chiArr = html.indexOf('[', chiIdx + 10);
  let d = 0, e = chiArr;
  for (let i = chiArr; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  return JSON.parse(html.slice(chiArr, e));
}

const cities = {
  'NYC': parseCity('const NYC_DATA'),
  'Dallas': parseCity('const DALLAS_DATA'),
  'Houston': parseCity('const HOUSTON_DATA'),
  'Chicago': parseChicago(),
};

const activityCuisines = ['Entertainment','Live Music','Jazz Club','Comedy Club','Museum','Art Museum',
  'Tourist Attraction','Attraction','Activity','Venue','Nightclub','Nightclub / Venue','Theater',
  'Performing Arts','Sports Venue','Comedy / Improv','Tourist Attraction / Museum','Observation Deck',
  'Shopping','Park','Cruise','Sports','Comedy','Architecture Tour'];

let totalIssues = 0;

for (const [cityName, data] of Object.entries(cities)) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${cityName}: ${data.length} spots`);
  console.log(`${'='.repeat(60)}`);

  // 1. DUPLICATES
  const names = {};
  data.forEach(r => {
    const key = r.name.toLowerCase().trim();
    if (!names[key]) names[key] = [];
    names[key].push(r.id);
  });
  const dupes = Object.entries(names).filter(([k, v]) => v.length > 1);
  if (dupes.length) {
    console.log(`\n  ❌ DUPLICATES (${dupes.length}):`);
    dupes.forEach(([name, ids]) => console.log(`    "${name}" -> IDs: ${ids.join(', ')}`));
    totalIssues += dupes.length;
  } else {
    console.log(`\n  ✅ No duplicates`);
  }

  // 2. MISSING CRITICAL FIELDS
  const missingDesc = data.filter(r => !r.description || r.description.length < 20);
  const missingAddr = data.filter(r => !r.address || r.address.length < 5);
  const missingIG = data.filter(r => !r.instagram || r.instagram.length < 2);
  const missingWeb = data.filter(r => !r.website || r.website.length < 5);
  const missingPhone = data.filter(r => !r.phone || r.phone.length < 5);
  const missingNeighborhood = data.filter(r => !r.neighborhood || r.neighborhood.length < 2);

  console.log(`\n  Missing fields:`);
  console.log(`    Description (<20 chars): ${missingDesc.length}`);
  if (missingDesc.length > 0 && missingDesc.length <= 20) {
    missingDesc.forEach(r => console.log(`      - ${r.name} (${r.description?.length || 0} chars)`));
  }
  console.log(`    Address: ${missingAddr.length}`);
  if (missingAddr.length > 0 && missingAddr.length <= 20) {
    missingAddr.forEach(r => console.log(`      - ${r.name}`));
  }
  console.log(`    Instagram: ${missingIG.length}`);
  if (missingIG.length <= 30) {
    missingIG.forEach(r => console.log(`      - ${r.name}`));
  }
  console.log(`    Website: ${missingWeb.length}`);
  if (missingWeb.length <= 30) {
    missingWeb.forEach(r => console.log(`      - ${r.name}`));
  }
  console.log(`    Phone: ${missingPhone.length}`);
  console.log(`    Neighborhood: ${missingNeighborhood.length}`);
  totalIssues += missingDesc.length + missingAddr.length;

  // 3. CARD TYPE AUDIT
  // Restaurants with activity-like cuisine that should be activity cards
  const shouldBeActivity = data.filter(r => {
    const c = (r.cuisine || '').toLowerCase();
    return c.match(/museum|tourist|attraction|observation|architecture|park|cruise|shopping/i)
      && !activityCuisines.some(ac => ac.toLowerCase() === c);
  });

  // Activities that might render as restaurant cards
  const misclassified = data.filter(r => {
    const c = (r.cuisine || '').toLowerCase();
    const isAct = activityCuisines.some(ac => ac.toLowerCase() === c) || c.match(/museum|tourist|attraction|observation/);
    const hasRestTags = (r.tags || []).some(t => /restaurant|dining|food|brunch|pizza|burger|taco|sushi|steak/i.test(t));
    return isAct && hasRestTags;
  });

  // Restaurants that are bars/rooftops (should NOT be activity cards)
  const barCheck = data.filter(r => {
    const c = (r.cuisine || '').toLowerCase();
    return activityCuisines.some(ac => ac.toLowerCase() === c) &&
      (c.match(/bar|rooftop|cocktail|wine|beer|brewery|whiskey|lounge/i));
  });

  if (shouldBeActivity.length || barCheck.length) {
    console.log(`\n  Card type issues:`);
    if (shouldBeActivity.length) {
      console.log(`    Should be activity card (${shouldBeActivity.length}):`);
      shouldBeActivity.forEach(r => console.log(`      - ${r.name} (cuisine: "${r.cuisine}")`));
    }
    if (barCheck.length) {
      console.log(`    Bars wrongly classified as activities (${barCheck.length}):`);
      barCheck.forEach(r => console.log(`      - ${r.name} (cuisine: "${r.cuisine}")`));
    }
    totalIssues += shouldBeActivity.length + barCheck.length;
  } else {
    console.log(`\n  ✅ Card types look correct`);
  }

  // 4. NEIGHBORHOOD CONSISTENCY
  const hoods = {};
  data.forEach(r => { const n = r.neighborhood || 'UNKNOWN'; hoods[n] = (hoods[n] || 0) + 1; });
  const singleHoods = Object.entries(hoods).filter(([n, c]) => c === 1 && n !== 'Multiple Locations');
  if (singleHoods.length > 10) {
    console.log(`\n  ⚠️ ${singleHoods.length} neighborhoods with only 1 restaurant (potential consolidation)`);
  }

  // 5. SCORE SANITY CHECK
  const badScores = data.filter(r => !r.score || r.score < 50 || r.score > 100);
  if (badScores.length) {
    console.log(`\n  ❌ Bad scores (${badScores.length}):`);
    badScores.forEach(r => console.log(`      - ${r.name} (score: ${r.score})`));
    totalIssues += badScores.length;
  }

  // 6. EMPTY/STUB ENTRIES (added as skips with no real data)
  const stubs = data.filter(r => r.lat === 0 && r.lng === 0);
  if (stubs.length) {
    console.log(`\n  ❌ STUB ENTRIES with lat/lng 0,0 (${stubs.length}):`);
    stubs.forEach(r => console.log(`      - ${r.name} (id: ${r.id})`));
    totalIssues += stubs.length;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`  TOTAL ISSUES: ${totalIssues}`);
console.log(`${'='.repeat(60)}`);

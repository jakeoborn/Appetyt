#!/usr/bin/env node
// Coord-precision audit. Flags suspected placeholder coords and coord/neighborhood mismatches.
//
// Two checks beyond audit-coordinates.js:
//   1. LOW PRECISION: lat OR lng has ≤4 decimal places (real Nominatim/Google geocoded coords have 6-7).
//      These are usually placeholder/rounded values from manual entry and tend to misplace pins.
//   2. NEIGHBORHOOD MISMATCH: coord is >0.6 mi from the centroid of its declared neighborhood,
//      and there's a different neighborhood whose centroid is closer. Catches things like
//      "Highland Park entry placed in Oak Lawn coords" (the bug we just hit).
//
// Run: node scripts/audit-coord-precision.js
// Optional flag: --city Dallas to limit to one city.

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

const ALL_CITIES = [
  'DALLAS_DATA','HOUSTON_DATA','CHICAGO_DATA','AUSTIN_DATA','SLC_DATA',
  'LV_DATA','SEATTLE_DATA','NYC_DATA','LA_DATA','PHX_DATA','SD_DATA',
  'MIAMI_DATA','CHARLOTTE_DATA',
];
const CITY_LABEL = c => c.replace(/_DATA$/, '');

const onlyCity = (() => {
  const i = process.argv.indexOf('--city');
  if (i < 0) return null;
  const v = (process.argv[i+1]||'').toLowerCase();
  return ALL_CITIES.find(c => CITY_LABEL(c).toLowerCase() === v) || null;
})();

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  try { return JSON.parse(slice); } catch {
    try { return (new Function('return ' + slice))(); } catch { return null; }
  }
}

// Pull NEIGHBORHOOD_COORDS object from the page.
function readNeighborhoodCoords() {
  const m = html.match(/const\s+NEIGHBORHOOD_COORDS\s*=\s*\{/);
  if (!m) return {};
  const start = m.index + m[0].length - 1; // points to '{'
  let d = 0, end = start;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') d++;
    if (html[i] === '}') { d--; if (d === 0) { end = i + 1; break; } }
  }
  try { return (new Function('return ' + html.slice(start, end)))(); } catch { return {}; }
}

function decimals(n) {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

function haversineMi(a, b) {
  const R = 3958.8;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(b[0]-a[0]);
  const dLng = toRad(b[1]-a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(lat1)*Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

const targetCities = onlyCity ? [onlyCity] : ALL_CITIES;

// Build per-city neighborhood centroid by averaging restaurant coords in that nbh.
// Avoids cross-city name collisions (Chinatown exists in NYC, LA, SF, SD, LV).
// Only include entries where coord is reasonably trusted (≥5 decimals).
const cityNbhCentroids = {}; // { cityLabel: { nbh: [lat, lng] } }
const cityArrays = {};
targetCities.forEach(constName => {
  const arr = readArray(constName);
  if (!arr) return;
  const cityLabel = CITY_LABEL(constName);
  cityArrays[cityLabel] = arr;
  const groups = {};
  arr.forEach(r => {
    if (typeof r.lat !== 'number' || typeof r.lng !== 'number' || r.suburb) return;
    if (!r.neighborhood) return;
    const dlat = decimals(r.lat), dlng = decimals(r.lng);
    if (Math.min(dlat, dlng) < 5) return; // exclude low-precision coords from centroid
    if (!groups[r.neighborhood]) groups[r.neighborhood] = [];
    groups[r.neighborhood].push([r.lat, r.lng]);
  });
  const out = {};
  Object.entries(groups).forEach(([n, pts]) => {
    if (pts.length < 3) return; // need ≥3 trusted points to define a centroid
    const sLat = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const sLng = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    out[n] = [sLat, sLng];
  });
  cityNbhCentroids[cityLabel] = out;
});

const lowPrecision = [];
const mismatches = [];

Object.entries(cityArrays).forEach(([cityLabel, arr]) => {
  const NCOORDS = cityNbhCentroids[cityLabel] || {};
  arr.forEach(r => {
    if (typeof r.lat !== 'number' || typeof r.lng !== 'number') return;
    const d = Math.min(decimals(r.lat), decimals(r.lng));
    if (d <= 3) {
      lowPrecision.push({ city: cityLabel, id: r.id, name: r.name, neighborhood: r.neighborhood,
        lat: r.lat, lng: r.lng, address: r.address || '', precision: d });
    }
    if (r.suburb) return;
    const myNbh = r.neighborhood;
    const myNbhCoords = NCOORDS[myNbh];
    if (!myNbhCoords) return;
    const myDist = haversineMi([r.lat, r.lng], myNbhCoords);
    if (myDist < 1.5) return;
    let best = null;
    Object.entries(NCOORDS).forEach(([n, c]) => {
      if (n === myNbh) return;
      const d = haversineMi([r.lat, r.lng], c);
      if (!best || d < best.d) best = { n, d };
    });
    if (best && best.d + 1.0 < myDist) {
      mismatches.push({ city: cityLabel, id: r.id, name: r.name, neighborhood: myNbh,
        lat: r.lat, lng: r.lng, address: r.address || '',
        nbhCentroidDistMi: +myDist.toFixed(2),
        closerNeighborhood: best.n, closerDistMi: +best.d.toFixed(2) });
    }
  });
});

console.log('='.repeat(70));
console.log('COORD PRECISION + NEIGHBORHOOD-MISMATCH AUDIT');
console.log('='.repeat(70));
console.log('Low precision coords (≤4 decimals):', lowPrecision.length);
console.log('Coord/neighborhood mismatches (>0.6 mi off, closer nbh exists):', mismatches.length);

console.log('\n--- LOW PRECISION (top 40) ---');
lowPrecision.slice(0, 40).forEach(o => {
  console.log(`[${o.city}] ${o.name} @ ${o.neighborhood} — lat=${o.lat}, lng=${o.lng} (${o.precision}d)  | id ${o.id}`);
  if (o.address) console.log(`    addr: ${o.address}`);
});
if (lowPrecision.length > 40) console.log(`... +${lowPrecision.length-40} more`);

console.log('\n--- NEIGHBORHOOD MISMATCH (top 40) ---');
mismatches.sort((a,b)=>b.nbhCentroidDistMi-a.nbhCentroidDistMi);
mismatches.slice(0, 40).forEach(o => {
  console.log(`[${o.city}] ${o.name} — declared "${o.neighborhood}" (${o.nbhCentroidDistMi}mi away) but coord is ${o.closerDistMi}mi from "${o.closerNeighborhood}"  | id ${o.id}`);
  if (o.address) console.log(`    addr: ${o.address}`);
});
if (mismatches.length > 40) console.log(`... +${mismatches.length-40} more`);

fs.writeFileSync(path.join(__dirname, 'coord-precision-report.json'),
  JSON.stringify({ lowPrecision, mismatches }, null, 2));
console.log('\nFull report → scripts/coord-precision-report.json');

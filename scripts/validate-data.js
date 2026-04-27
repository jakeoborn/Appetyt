#!/usr/bin/env node
// Data integrity validator — schema checks, duplicate names, coord bounds.
// Exits 1 if errors found. Run: node scripts/validate-data.js
// Wired into .git/hooks/pre-commit alongside validate-vocabulary.js.

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Bounds are intentionally wide to cover suburbs and metro areas.
// SLC includes Park City, SD includes North County, PHX includes Surprise/Cave Creek,
// Charlotte includes Lake Norman/Kannapolis, Dallas includes Fort Worth metro.
const CITY_BOUNDS = {
  NYC_DATA:       { lat: [40.4, 41.0], lng: [-74.4, -73.6] },
  DALLAS_DATA:    { lat: [32.5, 33.4], lng: [-97.6, -96.4] },
  AUSTIN_DATA:    { lat: [29.9, 30.7], lng: [-98.2, -97.4] },
  HOUSTON_DATA:   { lat: [29.4, 30.2], lng: [-95.9, -94.9] },
  SLC_DATA:       { lat: [40.2, 41.2], lng: [-112.3, -111.4] },
  SEATTLE_DATA:   { lat: [47.2, 48.0], lng: [-122.6, -121.9] },
  LA_DATA:        { lat: [33.6, 34.4], lng: [-118.7, -117.8] },
  CHICAGO_DATA:   { lat: [41.4, 42.2], lng: [-88.3, -87.4] },
  LV_DATA:        { lat: [35.8, 36.5], lng: [-115.6, -114.9] },
  PHX_DATA:       { lat: [33.1, 34.0], lng: [-112.6, -111.6] },
  SD_DATA:        { lat: [32.5, 33.3], lng: [-117.4, -116.8] },
  MIAMI_DATA:     { lat: [25.5, 26.1], lng: [-80.5, -80.0] },
  CHARLOTTE_DATA: { lat: [34.9, 35.7], lng: [-81.2, -80.4] },
  SANANTONIO_DATA:{ lat: [29.1, 29.9], lng: [-98.9, -98.2] },
  SF_DATA:        { lat: [37.6, 37.9], lng: [-122.6, -122.3] },
};

const REQUIRED_FIELDS = ['id', 'name', 'cuisine', 'neighborhood', 'score', 'lat', 'lng'];

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  try { return JSON.parse(html.slice(a, e)); } catch { return null; }
}

let errors = 0;
let warnings = 0;

function check(cityKey, arr) {
  if (!arr || !arr.length) { console.warn(`⚠️  ${cityKey}: no entries parsed`); warnings++; return; }

  const seenIds = new Set();
  // Duplicate check: same name + same address = real duplicate. Same name, different address = multi-location chain (ok).
  const seenNameAddr = new Map();
  const bounds = CITY_BOUNDS[cityKey];

  arr.forEach(r => {
    const ref = `${cityKey} #${r.id} "${r.name}"`;

    // 1. Required fields (price omitted — free attractions use price:0)
    REQUIRED_FIELDS.forEach(f => {
      if (r[f] === undefined || r[f] === null || r[f] === '') {
        console.error(`❌ ${ref}: missing required field "${f}"`);
        errors++;
      }
    });

    // 2. ID uniqueness within city
    if (seenIds.has(r.id)) {
      console.error(`❌ ${ref}: duplicate ID ${r.id} within ${cityKey}`);
      errors++;
    }
    seenIds.add(r.id);

    // 3. Duplicate: same name AND same address (multi-location chains are fine)
    const addrKey = String(r.name).toLowerCase().trim() + '|' + String(r.address || '').toLowerCase().trim();
    if (r.address && seenNameAddr.has(addrKey)) {
      console.error(`❌ ${cityKey}: same name+address "${r.name}" at "${r.address}" (IDs: ${seenNameAddr.get(addrKey)} and ${r.id})`);
      errors++;
    }
    seenNameAddr.set(addrKey, r.id);

    // 4. Coordinate bounds check (skip entries marked verify-coords — known pending lookups)
    const needsCoordVerify = Array.isArray(r.indicators) && r.indicators.includes('verify-coords');
    if (bounds && typeof r.lat === 'number' && typeof r.lng === 'number') {
      if ((r.lat === 0 || r.lng === 0) && !needsCoordVerify) {
        console.error(`❌ ${ref}: zero coordinates (lat:${r.lat}, lng:${r.lng}) — needs real coords`);
        errors++;
      } else if ((r.lat === 0 || r.lng === 0) && needsCoordVerify) {
        console.warn(`⚠️  ${ref}: zero coordinates marked verify-coords — needs lookup`);
        warnings++;
      } else if (r.lat < bounds.lat[0] || r.lat > bounds.lat[1] || r.lng < bounds.lng[0] || r.lng > bounds.lng[1]) {
        console.warn(`⚠️  ${ref}: coordinates out of metro bounds (lat:${r.lat}, lng:${r.lng})`);
        warnings++;
      }
    }

    // 5. Score range
    if (typeof r.score === 'number' && (r.score < 0 || r.score > 100)) {
      console.error(`❌ ${ref}: score ${r.score} out of range 0-100`);
      errors++;
    }

    // 6. Price tier — 0 is valid for free attractions/parks; 1-4 for restaurants
    if (r.price !== undefined && r.price !== 0 && (r.price < 1 || r.price > 4)) {
      console.error(`❌ ${ref}: price ${r.price} out of range (valid: 0=free, 1-4=tiers)`);
      errors++;
    }
  });
}

Object.keys(CITY_BOUNDS).forEach(cityKey => check(cityKey, readArray(cityKey)));

console.log(`\n── Data validation summary ──────────────────`);
console.log(`Errors: ${errors}  Warnings: ${warnings}`);

if (errors > 0) {
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  Warnings found (non-blocking).');
  process.exit(0);
} else {
  console.log('✅ Data validation passed.');
}

#!/usr/bin/env node
// Merge near-duplicate neighborhood names into canonical forms across:
// - each CITY_DATA restaurant array (`neighborhood` field)
// - CITY_NEIGHBORHOODS editorial object (keys)
// - NEIGHBORHOOD_COORDS object (keys)
// Also drops a few strict SLC editorial dupes (Peery Hotel, Park City sub-areas).
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// CITY_DATA restaurant-level renames (array `neighborhood` values).
const DATA_MAP = {
  'NYC_DATA': {
    'Park Slope': 'Park Slope / Prospect Heights',
    'Prospect Heights': 'Park Slope / Prospect Heights',
    'Fort Greene': 'Fort Greene / Clinton Hill',
    'Clinton Hill': 'Fort Greene / Clinton Hill',
  },
  'CHICAGO_DATA': {
    'Lakeview': 'Lakeview / Wrigleyville',
    'West Loop': 'West Loop / Fulton Market',
    'Fulton Market': 'West Loop / Fulton Market',
    'Little Italy': 'Little Italy / University Village',
    'University Village': 'Little Italy / University Village',
  },
  'SEATTLE_DATA': {
    'Downtown Seattle': 'Downtown',
  },
  'SLC_DATA': {
    'Millcreek Canyon': 'Millcreek',
    'Main Street (Park City)': 'Park City',
    'Park City (Canyons)': 'Park City',
    'Park City (Prospector)': 'Park City',
    'Downtown SLC (Peery Hotel)': 'Downtown SLC',
  },
};

// CITY_NEIGHBORHOODS editorial-key renames (keyed by display city name).
const CN_MAP = {
  'New York': DATA_MAP.NYC_DATA,
  'Chicago': Object.assign({}, DATA_MAP.CHICAGO_DATA, { 'Lakeview': 'Lakeview / Wrigleyville', 'West Loop': 'West Loop / Fulton Market' }),
  'Seattle': DATA_MAP.SEATTLE_DATA,
  'Salt Lake City': DATA_MAP.SLC_DATA,
};

function readBlock(constName, kind) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const openChar = kind === 'obj' ? '{' : '[';
  const closeChar = kind === 'obj' ? '}' : ']';
  const a = html.indexOf(openChar, s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === openChar) d++;
    if (html[i] === closeChar) { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e, raw: html.slice(a, e) };
}

function parse(block) {
  try { return JSON.parse(block.raw); } catch { return (new Function('return ' + block.raw))(); }
}

// --- 1) Rewrite each CITY_DATA restaurant.neighborhood ---
let totalRenames = 0;
Object.entries(DATA_MAP).forEach(([constName, map]) => {
  const blk = readBlock(constName, 'arr');
  if (!blk) { console.log(constName + ': not found'); return; }
  const arr = parse(blk);
  let renamed = 0;
  arr.forEach(r => {
    const orig = r.neighborhood;
    if (orig && map[orig]) { r.neighborhood = map[orig]; renamed++; }
  });
  totalRenames += renamed;
  console.log(constName + ' renamed ' + renamed + ' entries');
  html = html.slice(0, blk.a) + JSON.stringify(arr) + html.slice(blk.e);
});

// --- 2) Rewrite CITY_NEIGHBORHOODS editorial keys per city ---
const cnBlk = readBlock('CITY_NEIGHBORHOODS', 'obj');
if (cnBlk) {
  const cn = (new Function('return ' + cnBlk.raw))();
  Object.entries(CN_MAP).forEach(([city, map]) => {
    if (!cn[city]) return;
    const cityObj = cn[city];
    Object.entries(map).forEach(([oldKey, newKey]) => {
      if (!cityObj[oldKey]) return;
      if (cityObj[newKey]) {
        console.log('  CN ' + city + ': drop "' + oldKey + '" (canonical "' + newKey + '" already exists)');
        delete cityObj[oldKey];
      } else {
        cityObj[newKey] = cityObj[oldKey];
        delete cityObj[oldKey];
        console.log('  CN ' + city + ': rename "' + oldKey + '" -> "' + newKey + '"');
      }
    });
  });
  html = html.slice(0, cnBlk.a) + JSON.stringify(cn) + html.slice(cnBlk.e);
} else {
  console.log('CITY_NEIGHBORHOODS: not found');
}

// --- 3) NEIGHBORHOOD_COORDS: rename old keys to canonical (keep coords) ---
const ncBlk = readBlock('NEIGHBORHOOD_COORDS', 'obj');
if (ncBlk) {
  const nc = (new Function('return ' + ncBlk.raw))();
  let ncRenamed = 0;
  Object.values(DATA_MAP).forEach(map => {
    Object.entries(map).forEach(([oldKey, newKey]) => {
      if (nc[oldKey] && !nc[newKey]) {
        nc[newKey] = nc[oldKey];
        delete nc[oldKey];
        ncRenamed++;
      } else if (nc[oldKey] && nc[newKey]) {
        delete nc[oldKey];
      }
    });
  });
  console.log('NEIGHBORHOOD_COORDS renamed ' + ncRenamed + ' keys');
  html = html.slice(0, ncBlk.a) + JSON.stringify(nc) + html.slice(ncBlk.e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nTotal restaurant neighborhood renames: ' + totalRenames);
console.log('index.html written.');

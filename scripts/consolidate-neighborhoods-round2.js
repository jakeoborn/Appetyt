#!/usr/bin/env node
// Round 2 neighborhood consolidation: clean up remaining editorial/data dupes.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Merges: { CITY_DATA: { oldName: newName } }
const DATA_MAP = {
  'HOUSTON_DATA': {
    'East Downtown / EaDo': 'EaDo',
    'Uptown / Galleria': 'Galleria',
  },
  'SLC_DATA': {
    'Downtown Provo': 'Provo',
    'Provo (Riverwoods)': 'Provo',
    'Provo / BYU': 'Provo',
    'Fairpark / Marmalade': 'Marmalade',
  },
};

const CN_MAP = {
  'Houston': DATA_MAP.HOUSTON_DATA,
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

// Rewrite CITY_DATA neighborhoods
let totalRenames = 0;
Object.entries(DATA_MAP).forEach(([constName, map]) => {
  const blk = readBlock(constName, 'arr');
  if (!blk) return;
  const arr = parse(blk);
  let renamed = 0;
  arr.forEach(r => {
    if (r.neighborhood && map[r.neighborhood]) { r.neighborhood = map[r.neighborhood]; renamed++; }
  });
  totalRenames += renamed;
  console.log(constName + ' renamed ' + renamed + ' entries');
  html = html.slice(0, blk.a) + JSON.stringify(arr) + html.slice(blk.e);
});

// Rewrite CITY_NEIGHBORHOODS editorial keys
const cnBlk = readBlock('CITY_NEIGHBORHOODS', 'obj');
if (cnBlk) {
  const cn = (new Function('return ' + cnBlk.raw))();
  Object.entries(CN_MAP).forEach(([city, map]) => {
    if (!cn[city]) return;
    const cityObj = cn[city];
    Object.entries(map).forEach(([oldKey, newKey]) => {
      if (!cityObj[oldKey]) return;
      if (cityObj[newKey]) { delete cityObj[oldKey]; console.log('  drop ' + city + ' "' + oldKey + '"'); }
      else { cityObj[newKey] = cityObj[oldKey]; delete cityObj[oldKey]; console.log('  rename ' + city + ' "' + oldKey + '" -> "' + newKey + '"'); }
    });
  });
  html = html.slice(0, cnBlk.a) + JSON.stringify(cn) + html.slice(cnBlk.e);
}

// NEIGHBORHOOD_COORDS
const ncBlk = readBlock('NEIGHBORHOOD_COORDS', 'obj');
if (ncBlk) {
  const nc = (new Function('return ' + ncBlk.raw))();
  Object.values(DATA_MAP).forEach(map => {
    Object.entries(map).forEach(([oldKey, newKey]) => {
      if (nc[oldKey] && !nc[newKey]) { nc[newKey] = nc[oldKey]; delete nc[oldKey]; }
      else if (nc[oldKey] && nc[newKey]) delete nc[oldKey];
    });
  });
  html = html.slice(0, ncBlk.a) + JSON.stringify(nc) + html.slice(ncBlk.e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nTotal restaurant renames: ' + totalRenames);
console.log('index.html written.');

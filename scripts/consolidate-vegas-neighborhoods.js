#!/usr/bin/env node
// Vegas-only round 3 neighborhood consolidation: collapse slash-compound
// Downtown/Henderson/Summerlin/Paradise variants into their parent names.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const MAP = {
  'Downtown / Arts District':    'Downtown',
  'Downtown / Fremont East':     'Downtown (Fremont East)',
  'Downtown / Fremont Street':   'Downtown',
  'Downtown / Tivoli Village':   'Summerlin',
  'East Strip / Paradise':       'Paradise',
  'Henderson / Green Valley Ranch': 'Henderson',
  'Summerlin / West Vegas':      'Summerlin',
  'The Strip (Aria / Crystals)': 'The Strip (Aria)',
  'Spring Valley / Chinatown':   'Chinatown',
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

function parse(block) { try { return JSON.parse(block.raw); } catch { return (new Function('return ' + block.raw))(); } }

// LV_DATA restaurant neighborhoods
const blk = readBlock('LV_DATA', 'arr');
const arr = parse(blk);
let renamed = 0;
arr.forEach(r => {
  if (r.neighborhood && MAP[r.neighborhood]) { r.neighborhood = MAP[r.neighborhood]; renamed++; }
});
console.log('LV_DATA renamed ' + renamed + ' entries');
html = html.slice(0, blk.a) + JSON.stringify(arr) + html.slice(blk.e);

// CITY_NEIGHBORHOODS["Las Vegas"] editorial keys
const cnBlk = readBlock('CITY_NEIGHBORHOODS', 'obj');
if (cnBlk) {
  const cn = (new Function('return ' + cnBlk.raw))();
  const lv = cn['Las Vegas'] || {};
  Object.entries(MAP).forEach(([oldKey, newKey]) => {
    if (!lv[oldKey]) return;
    if (lv[newKey]) { delete lv[oldKey]; console.log('  drop "' + oldKey + '"'); }
    else { lv[newKey] = lv[oldKey]; delete lv[oldKey]; console.log('  rename "' + oldKey + '" -> "' + newKey + '"'); }
  });
  html = html.slice(0, cnBlk.a) + JSON.stringify(cn) + html.slice(cnBlk.e);
}

// NEIGHBORHOOD_COORDS
const ncBlk = readBlock('NEIGHBORHOOD_COORDS', 'obj');
if (ncBlk) {
  const nc = (new Function('return ' + ncBlk.raw))();
  Object.entries(MAP).forEach(([oldKey, newKey]) => {
    if (nc[oldKey] && !nc[newKey]) { nc[newKey] = nc[oldKey]; delete nc[oldKey]; }
    else if (nc[oldKey] && nc[newKey]) delete nc[oldKey];
  });
  html = html.slice(0, ncBlk.a) + JSON.stringify(nc) + html.slice(ncBlk.e);
}

fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

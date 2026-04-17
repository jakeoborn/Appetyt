#!/usr/bin/env node
// Fill missing website/instagram for top-score Chicago entries.
// Verified via firecrawl_search 2026-04-17.
// CHICAGO_DATA is strict JSON (double-quoted keys). IG stored without @ prefix.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const fills = {
  264: { instagram: 'atsumerurestaurant' },                                      // Atsumeru
  255: { instagram: 'pizz.amici' },                                              // Pizz'Amici
  256: { instagram: 'obelixchicago' },                                           // Obelix
  316: { website: 'https://www.bonyeonchicago.com/' },                           // Bonyeon
  408: { website: 'https://www.midosujichicago.com/', instagram: 'midosujichicago' }, // Midōsuji
  431: { instagram: 'temporischicago' },                                         // Temporis
  257: { instagram: 'maxwellstrading' },                                         // Maxwells Trading
  259: { instagram: 'mariscossanpedro' },                                        // Mariscos San Pedro
  266: { instagram: 'anelyachicago' },                                           // Anelya
};

const s = html.indexOf('const CHICAGO_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
let block = html.slice(a, e);
const after = html.slice(e);

let changes = 0;

Object.entries(fills).forEach(([idStr, patch]) => {
  const id = Number(idStr);
  const idMarker = '"id":' + id;
  const markerIdx = block.indexOf(idMarker);
  if (markerIdx < 0) { console.log('  MISS id=' + id); return; }
  // Validate boundary: next char must be `,` or `}`
  const nextCh = block[markerIdx + idMarker.length];
  if (nextCh !== ',' && nextCh !== '}') { console.log('  BAD BOUNDARY id=' + id); return; }
  // Check not a substring (e.g., "id":264 matching 2645 — but since we check next char, safe)

  // Find enclosing {} for this entry
  let openIdx = block.lastIndexOf('{', markerIdx);
  let depth = 0, closeIdx = -1;
  for (let i = openIdx; i < block.length; i++) {
    if (block[i] === '{') depth++;
    if (block[i] === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx < 0) { console.log('  NO CLOSE id=' + id); return; }
  const orig = block.slice(openIdx, closeIdx + 1);
  let next = orig;
  if (patch.website !== undefined) {
    next = next.replace(/"website":"[^"]*"/, `"website":"${patch.website}"`);
  }
  if (patch.instagram !== undefined) {
    next = next.replace(/"instagram":"[^"]*"/, `"instagram":"${patch.instagram}"`);
  }
  if (next !== orig) {
    block = block.slice(0, openIdx) + next + block.slice(closeIdx + 1);
    changes++;
    console.log('  Patched id=' + id + ' — ' + Object.keys(patch).join(', '));
  } else {
    console.log('  NO DIFF id=' + id);
  }
});

if (changes === 0) { console.error('NO CHANGES'); process.exit(1); }

html = before + block + after;
fs.writeFileSync(htmlPath, html);
console.log('\nDone: ' + changes + ' entries patched in CHICAGO_DATA');

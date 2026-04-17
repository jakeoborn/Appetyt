#!/usr/bin/env node
// Batch 3 — Chicago score 88-89 link fills. Verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const fills = {
  125: { instagram: 'calumetfisheries' },                                            // Calumet Fisheries
  263: { instagram: 'akahoshiramen' },                                                // Akahoshi Ramen
  289: { website: 'https://www.johnsfoodandwine.com/' },                              // John's Food and Wine (IG not clearly found)
  315: { website: 'https://www.blvdchicago.com/' },                                   // BLVD Steakhouse
  331: { website: 'https://petiteedith.com/' },                                       // Petite Edith
  334: { website: 'https://www.susuchicago.com/' },                                   // SuSu
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
  const nextCh = block[markerIdx + idMarker.length];
  if (nextCh !== ',' && nextCh !== '}') { console.log('  BAD BOUNDARY id=' + id); return; }
  let openIdx = block.lastIndexOf('{', markerIdx);
  let depth = 0, closeIdx = -1;
  for (let i = openIdx; i < block.length; i++) {
    if (block[i] === '{') depth++;
    if (block[i] === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx < 0) return;
  const orig = block.slice(openIdx, closeIdx + 1);
  let next = orig;
  if (patch.website !== undefined) next = next.replace(/"website":"[^"]*"/, `"website":"${patch.website}"`);
  if (patch.instagram !== undefined) next = next.replace(/"instagram":"[^"]*"/, `"instagram":"${patch.instagram}"`);
  if (next !== orig) {
    block = block.slice(0, openIdx) + next + block.slice(closeIdx + 1);
    changes++;
    console.log('  Patched id=' + id + ' — ' + Object.keys(patch).join(', '));
  }
});

if (changes === 0) { console.error('NO CHANGES'); process.exit(1); }
html = before + block + after;
fs.writeFileSync(htmlPath, html);
console.log('\nDone: ' + changes + ' entries patched');

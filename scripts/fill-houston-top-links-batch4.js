#!/usr/bin/env node
// Houston top-score link backfill — batch 4 + closure sweep.
// All verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

function readBlock(html, constName) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e, arr: JSON.parse(html.slice(a, e)) };
}

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const fills = {
  'Ocean Palace':                 { website: 'https://www.oceanpalacehouston.com', instagram: '@oceanpalacehtx' },
  'The Burger Joint':             { website: 'https://burgerjointhtx.com', instagram: '@burgerjointhtx' },
  'Pho Saigon':                   { instagram: '@phosaigonhtx' },
  'Ciao Bello':                   { website: 'https://ciaobellohouston.com' },
  'Amerigo\u2019s Grille':        { instagram: '@amerigosgrille' },
  "Amerigo's Grille":             { instagram: '@amerigosgrille' },
  "Fleming's Prime Steakhouse Woodlands":       { website: 'https://www.flemingssteakhouse.com' },
  'Fleming\u2019s Prime Steakhouse Woodlands':  { website: 'https://www.flemingssteakhouse.com' },
  'Fogo de Ch\u00e3o The Woodlands': { website: 'https://fogodechao.com/location/the-woodlands/' },
  'Pappadeaux Seafood Kitchen Pearland': { website: 'https://pappadeaux.com' },
};

// Confirmed closures
const REMOVE_NAMES = [
  "Tony Mandola's (Spring / Woodlands area)", // CLOSED (Chron closures 2023; space became Indianola & Miss Carousel)
  'Tony Mandola\u2019s (Spring / Woodlands area)',
  'Jasper\u2019s Woodlands',                   // CLOSED over rent issues (Chron)
  "Jasper's Woodlands",
  'Ritual',                                     // CLOSED April 2021 (Heights; became Mapojeong Galbijib)
  'Corner Table',                               // CLOSED per yelp
  'Cullen\u2019s Upscale American Grille',      // CLOSED 2016 (Clear Lake)
  "Cullen's Upscale American Grille",
];

const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
const startLen = arr.length;

const removed = [];
const kept = arr.filter(r => {
  if (REMOVE_NAMES.includes(r.name)) { removed.push({ id: r.id, name: r.name, score: r.score }); return false; }
  return true;
});

let filled = 0, skipped = 0;
const unmatched = new Set(Object.keys(fills));
kept.forEach(r => {
  const patch = fills[r.name];
  if (!patch) return;
  unmatched.delete(r.name);
  if (patch.website !== undefined) {
    if (!r.website || !String(r.website).trim()) { r.website = patch.website; filled++; }
    else skipped++;
  }
  if (patch.instagram !== undefined) {
    if (!r.instagram || !String(r.instagram).trim()) { r.instagram = patch.instagram; filled++; }
    else skipped++;
  }
});

console.log('HOUSTON closures removed: ' + removed.length);
removed.forEach(r => console.log('  REMOVED id=' + r.id + ' [' + r.score + '] ' + r.name));
console.log('Fills applied: ' + filled + ', skipped (already set): ' + skipped);
const expectedMiss = ['Tony Mandola\u2019s (Spring / Woodlands area)', "Tony Mandola's (Spring / Woodlands area)"];
const realUnmatched = Array.from(unmatched);
if (realUnmatched.length) console.log('Unmatched keys: ' + realUnmatched.join(' | '));
console.log('Count: ' + startLen + ' -> ' + kept.length);

html = html.slice(0, a) + JSON.stringify(kept) + html.slice(e);
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

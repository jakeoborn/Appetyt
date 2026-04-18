#!/usr/bin/env node
// Houston top-score link backfill — batch 3 + closure removals.
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

// Fills (by entry name)
const fills = {
  'Brenner\u2019s Steakhouse on the Bayou': { website: 'https://www.brennerssteakhouse.com/location/brenners-on-the-bayou/', instagram: '@brennerssteakhouse' },
  "Brenner's Steakhouse on the Bayou":        { website: 'https://www.brennerssteakhouse.com/location/brenners-on-the-bayou/', instagram: '@brennerssteakhouse' },
  "Perry's Steakhouse & Grille Katy":          { website: 'https://perryssteakhouse.com', instagram: '@perryssteakhouse' },
  'Perry\u2019s Steakhouse & Grille Katy':     { website: 'https://perryssteakhouse.com', instagram: '@perryssteakhouse' },
  "Perry's Steakhouse The Woodlands":          { website: 'https://perryssteakhouse.com', instagram: '@perryssteakhouse' },
  'Perry\u2019s Steakhouse The Woodlands':     { website: 'https://perryssteakhouse.com', instagram: '@perryssteakhouse' },
  'Burns Original BBQ':                        { instagram: '@burnsoriginalbbq' },
  'Korea Garden':                              { website: 'https://www.facebook.com/koreagardenhouston/' },
  'ChopnBlok':                                 { instagram: '@chopnblok_' },
};

// Closures confirmed via firecrawl (Houston).
const REMOVE_NAMES = [
  'Tris Restaurant',              // closed Jan 2025 after chef resignation
  'Mr. Peeples Shellfish & Steakhouse', // closed (Midtown/West U.)
  'Prego',                        // closed April 2024 after 40 years in Rice Village
  'Hubbell & Hudson Bistro',      // became TRIS; TRIS then closed
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
if (unmatched.size) console.log('Unmatched: ' + Array.from(unmatched).join(' | '));
console.log('Count: ' + startLen + ' -> ' + kept.length);

html = html.slice(0, a) + JSON.stringify(kept) + html.slice(e);
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

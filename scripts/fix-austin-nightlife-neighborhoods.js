#!/usr/bin/env node
// Reassign Austin venues on Red River Street and 6th Street from the generic
// "Downtown" bucket to their canonical strip neighborhoods ("Red River" and
// "6th Street"). Both are already in NEIGHBORHOOD_COORDS, CITY_NEIGHBORHOODS,
// nightlife tips, and the nightlife hood list — but no venues were assigned
// to them, so their Nightlife detail page rendered empty.

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
let arr;
try { arr = JSON.parse(html.slice(a, e)); }
catch { arr = new Function('return ' + html.slice(a, e))(); }

// Explicit ID lists — chosen by scanning Downtown venues and excluding outliers:
// LBJ Library (2313 Red River, 20+ blocks north of the strip — it's UT campus area)
// Moderna Pizzeria (1717 W 6th — far west, Clarksville-adjacent, not the 6th St strip)
const redRiverIds = [
  5048, // Moonshine Patio Bar & Grill (303 Red River)
  5079, // Stubb's Bar-B-Q (801 Red River)
  5103, // Garrison (101 Red River)
  5114, // Mohawk (912 Red River)
  5231, // Cheer Up Charlies (900 Red River)
];
const sixthStreetIds = [
  5059, // Midnight Cowboy (313 E 6th)
  5171, // 6th Street Entertainment District (E 6th)
  5306, // Angler (301 W 6th)
  5467, // Maggie Mae's (323 E 6th)
  5469, // The Dead Rabbit Austin (204 E 6th)
  5470, // Marlow (700 E 6th)
  5471, // Pete's Dueling Piano Bar (421 E 6th)
  5472, // POP Champagne Lounge (301 W 6th)
  5473, // Devil May Care (512 W 6th)
  5493, // Ruth's Chris Steak House (107 W 6th)
  5574, // Black Sheep Coffee (600 W 6th)
];

let rrChanged = 0, sixthChanged = 0, skipped = 0;
arr.forEach(r => {
  if (redRiverIds.includes(r.id)) {
    if (r.neighborhood === 'Red River') { skipped++; return; }
    r.neighborhood = 'Red River';
    rrChanged++;
  } else if (sixthStreetIds.includes(r.id)) {
    if (r.neighborhood === '6th Street') { skipped++; return; }
    r.neighborhood = '6th Street';
    sixthChanged++;
  }
});

console.log(`Red River reassignments: ${rrChanged}`);
console.log(`6th Street reassignments: ${sixthChanged}`);
console.log(`Already-correct (skipped): ${skipped}`);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

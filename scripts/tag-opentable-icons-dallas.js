#!/usr/bin/env node
// Tag Dallas restaurants that appear on OpenTable's Icons list with
// indicators: [..., "opentable-icon"]. Source: opentable.com/icons/dallas
// Verified 2026-04-17 via firecrawl scrape.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Exact id matches verified via normalized-name lookup against CURRENT DALLAS_DATA.
// ids correspond to:
//   23  Al Biernat's
//   99  Bob's Steak & Chop House
//   69  Gemma
//   20  Mamani
//   148 Mister Charles
//   126 Mot Hai Ba
//   49  Nick & Sam's Steakhouse
//   186 Quarter Acre
//   104 Roots Southern Table
//   15  Tei-An
//   73  Town Hearth
//   128 The Charles
//   158 The Mansion on Turtle Creek
//   224 Fearing's
//   150 Jose
//   77  Beatrice (Restaurant Beatrice on OT)
const TARGET_IDS = [15, 20, 23, 49, 69, 73, 77, 99, 104, 126, 128, 148, 150, 158, 186, 224];
const INDICATOR = 'opentable-icon';

const s = html.indexOf('const DALLAS_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));

let tagged = 0, already = 0, missing = 0;
TARGET_IDS.forEach(id => {
  const r = arr.find(x => x.id === id);
  if (!r) { console.log('  MISS id=' + id); missing++; return; }
  r.indicators = r.indicators || [];
  if (r.indicators.includes(INDICATOR)) { already++; return; }
  r.indicators.push(INDICATOR);
  tagged++;
  console.log('  +icon id=' + id + ' ' + r.name);
});

console.log('\nTagged: ' + tagged + ' | already: ' + already + ' | missed: ' + missing);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

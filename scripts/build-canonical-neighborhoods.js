#!/usr/bin/env node
// Build the canonical neighborhoods list per city from current data.
// Output: scripts/data/canonical-neighborhoods.json
// Intent: validate-vocabulary.js can read this and fail pre-commit if a new
// entry uses a neighborhood that isn't on the canonical list (typo prevention).
// Re-run whenever neighborhoods change legitimately.

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  try { return JSON.parse(slice); } catch {
    try { return (new Function('return ' + slice))(); } catch { return null; }
  }
}

const CITIES = {
  'DALLAS_DATA':      'Dallas',
  'HOUSTON_DATA':     'Houston',
  'CHICAGO_DATA':     'Chicago',
  'AUSTIN_DATA':      'Austin',
  'SLC_DATA':         'Salt Lake City',
  'LV_DATA':          'Las Vegas',
  'SEATTLE_DATA':     'Seattle',
  'NYC_DATA':         'New York',
  'LA_DATA':          'Los Angeles',
  'PHX_DATA':         'Phoenix',
  'SD_DATA':          'San Diego',
  'MIAMI_DATA':       'Miami',
  'CHARLOTTE_DATA':   'Charlotte',
  'SANANTONIO_DATA':  'San Antonio',
  'SF_DATA':          'San Francisco',
};

const canonical = {};

Object.entries(CITIES).forEach(([constName, cityName]) => {
  const arr = readArray(constName);
  if (!arr) return;
  const counts = {};
  arr.forEach(r => {
    const n = r.neighborhood;
    if (!n) return;
    counts[n] = (counts[n] || 0) + 1;
  });
  canonical[cityName] = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
});

const outDir = path.join(__dirname, 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'canonical-neighborhoods.json');
fs.writeFileSync(outPath, JSON.stringify(canonical, null, 2));

console.log('Canonical neighborhoods written to', outPath);
let total = 0;
Object.entries(canonical).forEach(([city, list]) => {
  total += list.length;
  console.log(`  ${city}: ${list.length} neighborhoods`);
});
console.log(`  Total: ${total} across ${Object.keys(canonical).length} cities`);

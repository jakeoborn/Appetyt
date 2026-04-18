#!/usr/bin/env node
// Audit near-duplicate neighborhood names per city.
// Flags pairs that look like variants of the same neighborhood (substring
// overlap, slash-separated compound names, or case differences).
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
  try { return JSON.parse(html.slice(a, e)); } catch { try { return (new Function('return ' + html.slice(a, e)))(); } catch { return null; } }
}

const CITIES = {
  DALLAS_DATA: 'Dallas', HOUSTON_DATA: 'Houston', CHICAGO_DATA: 'Chicago',
  AUSTIN_DATA: 'Austin', SLC_DATA: 'Salt Lake City', LV_DATA: 'Las Vegas',
  SEATTLE_DATA: 'Seattle', NYC_DATA: 'New York',
};

function normalize(n) {
  return String(n).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

Object.entries(CITIES).forEach(([k, city]) => {
  const arr = readArray(k);
  if (!arr) return;
  const counts = new Map();
  arr.forEach(r => {
    const n = r.neighborhood;
    if (!n) return;
    counts.set(n, (counts.get(n) || 0) + 1);
  });
  const names = [...counts.keys()].sort();
  const flagged = new Set();
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i], b = names[j];
      const na = normalize(a), nb = normalize(b);
      if (na === nb) { flagged.add(a); flagged.add(b); continue; }
      // One is substring of the other (e.g. "Park Slope" vs "Park Slope / Prospect Heights")
      if (na.includes(nb) || nb.includes(na)) { flagged.add(a); flagged.add(b); continue; }
      // Slash variant: shared segment
      const aSegs = na.split(/\s+\/\s+|\s*\/\s*|\s+\|\s+/).filter(Boolean);
      const bSegs = nb.split(/\s+\/\s+|\s*\/\s*|\s+\|\s+/).filter(Boolean);
      if (aSegs.length > 1 || bSegs.length > 1) {
        const overlap = aSegs.some(seg => bSegs.includes(seg));
        if (overlap) { flagged.add(a); flagged.add(b); }
      }
    }
  }
  if (flagged.size === 0) return;
  console.log('\n=== ' + city + ' === potential duplicate neighborhood names');
  [...flagged].sort().forEach(n => {
    console.log('  "' + n + '"  (' + counts.get(n) + ' spots)');
  });
});

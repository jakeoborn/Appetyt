#!/usr/bin/env node
// Per-neighborhood attraction count audit using the exact A.classify() logic
// from index.html. Surfaces neighborhoods with 0 attractions across every city.
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
  try { return JSON.parse(slice); } catch { try { return (new Function('return ' + slice))(); } catch { return null; } }
}

// Mirror the A.classify from index.html, line 6719-ish.
const LANDMARK_NAMES = /\b(radio city|madison square garden|carnegie hall|forest hills stadium|kennedy center|hollywood bowl|moulin rouge|apollo theater)\b/;
function isAttraction(r) {
  if (!r) return false;
  const cu = String(r.cuisine || '').toLowerCase();
  const tags = (r.tags || []).map(t => String(t).toLowerCase());
  const name = String(r.name || '').toLowerCase();
  if (LANDMARK_NAMES.test(name)) return true;
  if (
    cu.match(/museum|gallery|attraction|landmark|theater|theatre|cinema|bowling|arcade|gaming|aquarium|zoo|entertainment|sightseeing|observation|botanical|tourist/)
    || cu === 'park'
    || (cu.match(/\bpark\b/) && !cu.match(/grill|kitchen|restaurant|bar|pub/))
    || tags.some(t => /museum|park|landmark|attraction|aquarium|zoo|activity|entertainment|sightseeing|tourist/.test(t))
  ) return true;
  return false;
}

const CITIES = {
  DALLAS_DATA: 'Dallas', HOUSTON_DATA: 'Houston', CHICAGO_DATA: 'Chicago',
  AUSTIN_DATA: 'Austin', SLC_DATA: 'Salt Lake City', LV_DATA: 'Las Vegas',
  SEATTLE_DATA: 'Seattle', NYC_DATA: 'New York',
};

const out = {};
Object.entries(CITIES).forEach(([k, city]) => {
  const arr = readArray(k);
  if (!arr) return;
  const byHood = new Map();
  arr.forEach(r => {
    const hood = r.neighborhood || '(none)';
    if (!byHood.has(hood)) byHood.set(hood, { total: 0, attractions: 0, names: [] });
    const h = byHood.get(hood);
    h.total++;
    if (isAttraction(r)) { h.attractions++; h.names.push(r.name); }
  });
  out[city] = [...byHood.entries()]
    .map(([hood, s]) => ({ hood, total: s.total, attractions: s.attractions, names: s.names }))
    .sort((a, b) => a.attractions - b.attractions || b.total - a.total);
});

let grandZero = 0, grandTotal = 0;
Object.entries(out).forEach(([city, rows]) => {
  const zero = rows.filter(r => r.attractions === 0);
  grandZero += zero.length;
  grandTotal += rows.length;
  console.log('\n=== ' + city + ' === (' + rows.length + ' neighborhoods, ' + zero.length + ' with 0 attractions)');
  const interesting = rows.filter(r => r.total >= 5).slice(0, 20);
  interesting.forEach(r => {
    console.log('  ' + (r.attractions === 0 ? 'ZERO  ' : String(r.attractions).padStart(2) + '    ') + r.hood.padEnd(38) + ' total=' + r.total);
  });
});
console.log('\n' + grandZero + ' / ' + grandTotal + ' neighborhoods have ZERO attractions');

fs.writeFileSync(path.join(__dirname, 'attractions-by-neighborhood.json'), JSON.stringify(out, null, 2));
console.log('\nFull report -> scripts/attractions-by-neighborhood.json');

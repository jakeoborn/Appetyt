// Scan index.html for all *_DATA arrays and count cards missing photoUrl.
// Skips SF_DATA per user request.

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
const SKIP = new Set(['SF_DATA']);

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const dataLineRegex = /^const\s+([A-Z][A-Z0-9_]*_DATA)\s*=\s*\[/;

const results = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(dataLineRegex);
  if (!m) continue;
  const name = m[1];
  if (SKIP.has(name)) continue;

  // Single-line arrays only (most cities)
  const line = lines[i];
  const start = line.indexOf('=[') + 1;
  const end = line.lastIndexOf('];');
  if (end < 0) {
    // Multi-line array — skip for now, separate handling
    results.push({name, line: i+1, total: '?', empty: '?', note: 'multi-line'});
    continue;
  }
  let arr;
  try {
    arr = JSON.parse(line.slice(start, end + 1));
  } catch (e) {
    results.push({name, line: i+1, total: '?', empty: '?', note: 'parse-fail: '+e.message.slice(0,50)});
    continue;
  }

  const empty = arr.filter(c => !c.photoUrl).length;
  const total = arr.length;
  results.push({name, line: i+1, total, empty, note: ''});
}

// Print
results.sort((a,b) => (b.empty || 0) - (a.empty || 0));
console.log('CITY_DATA           LINE   TOTAL  EMPTY  PCT');
console.log('-------------------------------------------------------');
for (const r of results) {
  const pct = (r.total > 0 && r.empty !== '?') ? Math.round(100*r.empty/r.total)+'%' : '-';
  console.log(
    r.name.padEnd(20),
    String(r.line).padStart(5),
    String(r.total).padStart(6),
    String(r.empty).padStart(6),
    pct.padStart(5),
    r.note
  );
}

const totalEmpty = results.reduce((s,r)=> s + (typeof r.empty==='number'? r.empty : 0), 0);
const totalCards = results.reduce((s,r)=> s + (typeof r.total==='number'? r.total : 0), 0);
console.log('-------------------------------------------------------');
console.log('TOTALS:', totalCards, 'cards,', totalEmpty, 'missing photo (', Math.round(100*totalEmpty/totalCards)+'%', ')');

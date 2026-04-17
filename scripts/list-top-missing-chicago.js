#!/usr/bin/env node
// List top-score Chicago entries that are missing website and/or instagram.
// Output: scripts/top-missing-chicago.json
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

const arr = readArray('CHICAGO_DATA');
if (!arr) { console.error('Could not read CHICAGO_DATA'); process.exit(1); }

const missing = arr
  .filter(r => {
    const webBad = !r.website || !String(r.website).trim();
    const igBad = !r.instagram || !String(r.instagram).trim();
    return webBad || igBad;
  })
  .map(r => ({
    id: r.id,
    name: r.name,
    score: r.score || 0,
    cuisine: r.cuisine,
    neighborhood: r.neighborhood,
    address: r.address,
    missingWeb: !r.website || !String(r.website).trim(),
    missingIG: !r.instagram || !String(r.instagram).trim(),
    website: r.website || '',
    instagram: r.instagram || '',
  }))
  .sort((a, b) => b.score - a.score);

console.log('Total Chicago with missing: ' + missing.length);
console.log('\nTop 30 by score:');
missing.slice(0, 30).forEach(m => {
  const tags = [m.missingWeb ? 'web' : '', m.missingIG ? 'ig' : ''].filter(Boolean).join('+');
  console.log('  [' + m.score + '] ' + m.name.padEnd(35) + ' (' + tags + ') ' + m.cuisine + ' — ' + m.neighborhood);
});

fs.writeFileSync(path.join(__dirname, 'top-missing-chicago.json'), JSON.stringify(missing, null, 2));
console.log('\nFull list → scripts/top-missing-chicago.json');

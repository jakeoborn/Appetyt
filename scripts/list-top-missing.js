#!/usr/bin/env node
// Usage: node scripts/list-top-missing.js <CITY_CONST> [limit]
// Lists top-score entries from <CITY_CONST> missing website or instagram.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const constName = process.argv[2];
const limit = parseInt(process.argv[3] || '30', 10);
if (!constName) {
  console.error('Usage: node list-top-missing.js <CITY_CONST> [limit]');
  process.exit(1);
}

const s = html.indexOf('const ' + constName);
if (s < 0) { console.error('Const ' + constName + ' not found.'); process.exit(1); }
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const slice = html.slice(a, e);
let arr;
try { arr = JSON.parse(slice); }
catch { arr = (new Function('return ' + slice))(); }

const missing = arr
  .filter(r => {
    const webBad = !r.website || !String(r.website).trim();
    const igBad = !r.instagram || !String(r.instagram).trim();
    return webBad || igBad;
  })
  .map(r => ({
    id: r.id, name: r.name, score: r.score || 0,
    cuisine: r.cuisine, neighborhood: r.neighborhood, address: r.address,
    missingWeb: !r.website || !String(r.website).trim(),
    missingIG: !r.instagram || !String(r.instagram).trim(),
    website: r.website || '', instagram: r.instagram || '',
  }))
  .sort((a, b) => b.score - a.score);

console.log(constName + ': ' + missing.length + ' with at least one missing link');
console.log('\nTop ' + limit + ' by score:');
missing.slice(0, limit).forEach(m => {
  const tags = [m.missingWeb ? 'web' : '', m.missingIG ? 'ig' : ''].filter(Boolean).join('+');
  console.log('  [' + m.score + '] ' + m.name.padEnd(38) + ' (' + tags + ') ' + (m.cuisine || '') + ' — ' + (m.neighborhood || ''));
});

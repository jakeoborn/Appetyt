'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const REMOVE_IDS = [2041, 2043, 2044]; // Sunn's, L'Industrie Pizzeria, Rolo's — already exist at 1227, 1063, 1231

let html = fs.readFileSync(FILE, 'utf8');

const m = html.match(/const NYC_DATA\s*=\s*\[/);
const startIdx = m.index + m[0].length;
let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

let data = eval('[' + html.slice(startIdx, closeIdx) + ']');
const before = data.length;
data = data.filter(r => !REMOVE_IDS.includes(r.id));
const after = data.length;
console.log(`Removed ${before - after} cards (IDs: ${REMOVE_IDS.join(', ')})`);

const newBlock = data.map(c => JSON.stringify(c)).join(',\n');
html = html.slice(0, startIdx) + '\n' + newBlock + '\n' + html.slice(closeIdx);

// Verify parse
const m2 = html.match(/const NYC_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
let count;
try { count = eval('[' + html.slice(s2, p2 - 1) + ']').length; }
catch (e) { console.error('Parse error:', e.message); process.exit(1); }
console.log(`NYC count after removal: ${count} (expected ${after})`);
if (count !== after) { console.error('Count mismatch!'); process.exit(1); }

fs.writeFileSync(FILE, html, 'utf8');
console.log('✅ Done');

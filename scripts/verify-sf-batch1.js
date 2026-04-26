// Quick post-insert integrity check.
// Extracts SF_DATA, parses as JSON-ish (it's an array of object-literals — node won't parse directly),
// and confirms count + IDs 5050..5073 present + indicators valid.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');

const text = fs.readFileSync(HTML, 'utf8');
const m = /const SF_DATA=\[/.exec(text);
const openIdx = m.index + 'const SF_DATA='.length;

let depth = 0, closeIdx = -1, inStr = false, sc = '', esc = false;
for (let i = openIdx; i < text.length; i++) {
  const c = text[i];
  if (esc) { esc = false; continue; }
  if (inStr) {
    if (c === '\\') { esc = true; continue; }
    if (c === sc) inStr = false;
    continue;
  }
  if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { closeIdx = i; break; } }
}
const arr = text.slice(openIdx, closeIdx + 1);

// Sanity: count IDs in 5050-5073 range
const idMatches = arr.match(/id:50\d\d/g) || [];
const ids5050plus = idMatches.filter(x => {
  const n = parseInt(x.slice(3), 10);
  return n >= 5050 && n <= 5073;
});
console.log('Found ' + ids5050plus.length + ' IDs in 5050-5073 range');

// Count top-level cards
let d = 0, n = 0; inStr = false; sc = ''; esc = false;
for (let i = 0; i < arr.length; i++) {
  const c = arr[i];
  if (esc) { esc = false; continue; }
  if (inStr) { if (c === '\\') { esc = true; continue; } if (c === sc) inStr = false; continue; }
  if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
  if (c === '{') { if (d === 1) n++; d++; }
  else if (c === '}') d--;
  else if (c === '[' && i === 0) d++;
}
// adjust: we started with d=0 then [ takes us to 1; objects sit at d=1 entering {
console.log('Top-level objects in SF_DATA: ' + n);

// Indicators check — ensure no invalid IDs in the 24 new cards
const valid = new Set(['vegetarian','black-owned','women-owned','lgbtq-friendly','hole-in-the-wall','halal','dive-bar','brewery','outdoor-only','byob']);
// Find every indicators:[...] block, but only inside cards 5050-5073.
// Simpler: walk the new cards substring (last 24 objects).
// Since the script is just a sanity check, we'll grep all indicators arrays.
const indMatches = arr.match(/indicators:\[[^\]]*\]/g) || [];
const flat = new Set();
for (const block of indMatches) {
  const items = block.match(/"([^"]+)"/g) || [];
  for (const it of items) flat.add(it.replace(/"/g, ''));
}
const invalid = [...flat].filter(x => !valid.has(x));
console.log('Distinct indicator values across SF_DATA: ' + flat.size);
if (invalid.length) console.log('INVALID indicators present: ' + invalid.join(', '));
else console.log('All indicator values are valid.');

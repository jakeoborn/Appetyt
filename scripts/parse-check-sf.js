// Extract SF_DATA from index.html and eval it to verify it parses cleanly.
const fs = require('fs');
const path = require('path');
const text = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = /const SF_DATA=\[/.exec(text);
const openIdx = m.index + 'const SF_DATA='.length;
let depth = 0, closeIdx = -1, inStr = false, sc = '', esc = false;
for (let i = openIdx; i < text.length; i++) {
  const c = text[i];
  if (esc) { esc = false; continue; }
  if (inStr) { if (c === '\\') { esc = true; continue; } if (c === sc) inStr = false; continue; }
  if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { closeIdx = i; break; } }
}
const arr = text.slice(openIdx, closeIdx + 1);
let data;
try {
  data = eval(arr); // it's a JS array literal, not strict JSON
} catch (e) {
  console.error('PARSE FAILED:', e.message);
  process.exit(1);
}
console.log('Parsed OK. SF_DATA.length = ' + data.length);
const ids = data.map(c => c.id).sort((a,b) => a-b);
console.log('ID range: ' + ids[0] + ' .. ' + ids[ids.length-1]);
const newOnes = data.filter(c => c.id >= 5050 && c.id <= 5073);
console.log('Cards in 5050-5073: ' + newOnes.length);
console.log('Names:');
for (const c of newOnes) console.log('  ' + c.id + '  ' + c.name);

// Indicator validity for new cards
const valid = new Set(['vegetarian','black-owned','women-owned','lgbtq-friendly','hole-in-the-wall','halal','dive-bar','brewery','outdoor-only','byob']);
const bad = [];
for (const c of newOnes) {
  for (const ind of (c.indicators || [])) {
    if (!valid.has(ind)) bad.push(c.name + ': ' + ind);
  }
}
if (bad.length) {
  console.log('INVALID INDICATORS:');
  for (const b of bad) console.log('  ' + b);
} else {
  console.log('All indicators on new cards are valid.');
}

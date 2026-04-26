// Pull canonical NYC_DATA from copy 2 (line 77977), parse it, validate
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');

// Line 77977 (1-indexed) is array index 77976
const startIdx = 77976;
// Find the line containing `];` closing NYC_DATA
let endIdx = startIdx;
for (let i = startIdx; i < startIdx + 20; i++) {
  if (/\]\s*;?\s*$/.test(lines[i])) { endIdx = i; break; }
}
console.log('NYC_DATA spans copy-2 lines', startIdx+1, '→', endIdx+1);

// Combine into one block
let block = lines.slice(startIdx, endIdx+1).join('\n');
console.log('Block length:', block.length);

// Strip leading "];" if present (it closes some prior array)
const leadingClose = block.match(/^\s*\];/);
if (leadingClose) {
  console.log('Leading "];" detected — that belongs to a prior array, will not include');
  block = block.slice(leadingClose[0].length);
}

// The block should now start with `const NYC_DATA = [`
const m = block.match(/^\s*const\s+NYC_DATA\s*=\s*\[/);
if (!m) {
  console.error('Block does not start with const NYC_DATA = [');
  console.error('First 200:', block.slice(0,200));
  process.exit(1);
}

// Find array start position
const arrStart = block.indexOf('[');
// Find LAST `]` — should be array close
const lastClose = block.lastIndexOf(']');
const arrText = block.slice(arrStart, lastClose+1);
console.log('Array text length:', arrText.length);

let parsed;
try {
  parsed = JSON.parse(arrText);
  console.log('Parsed:', parsed.length, 'cards');
} catch (e) {
  console.error('JSON.parse failed:', e.message);
  // Find error position
  const m2 = e.message.match(/position (\d+)/);
  if (m2) {
    const pos = parseInt(m2[1],10);
    console.error('Around:', JSON.stringify(arrText.slice(Math.max(0,pos-40), pos))+'[ERR]'+JSON.stringify(arrText.slice(pos, pos+40)));
  }
  process.exit(1);
}

// Sanity-check ids
const ids = parsed.map(c => c.id).filter(Boolean);
console.log('ID range:', Math.min(...ids), '→', Math.max(...ids));
console.log('Sample first:', parsed[0].name);
console.log('Sample last:', parsed[parsed.length-1].name);

// Save canonical NYC_DATA as JSON
fs.writeFileSync(path.join(__dirname,'data','nyc-data-canonical.json'), JSON.stringify(parsed, null, 2));
console.log('Wrote → scripts/data/nyc-data-canonical.json');

// Compare every CITY_DATA between copy 1 (line < 49567) and copy 2 (line >= 49567)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');

const RE = /^const ([A-Z_]+_DATA)\s*=\s*\[/;
const hits = {};
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(RE);
  if (m) (hits[m[1]] = hits[m[1]] || []).push({line:i+1, idx:i});
}

const SPLIT = 49567;
function parse(line) {
  try {
    const start = line.indexOf('=[') + 1;
    const end = line.lastIndexOf('];');
    if (end <= start) return null;
    return JSON.parse(line.slice(start, end + 1));
  } catch (e) { return null; }
}
// Some CITY_DATA span multiple lines (e.g. SF_DATA). Need to read multi-line.
function readMultiLine(arr, idx) {
  // Concatenate from arr[idx] until we hit `];` at end
  let s = arr[idx];
  if (/\];/.test(s)) return s;
  let j = idx + 1;
  while (j < arr.length && j < idx + 5000) {
    s += '\n' + arr[j];
    if (/\];\s*$/.test(arr[j])) return s;
    j++;
  }
  return s;
}

console.log('CITY_DATA card-count comparison (copy1 vs copy2):');
console.log('  var                  copy1   copy2   diff');
console.log('  ----                 -----   -----   ----');
for (const [k, v] of Object.entries(hits)) {
  if (v.length < 2) continue;
  const c1 = v.find(x => x.line < SPLIT);
  const c2 = v.find(x => x.line >= SPLIT);
  if (!c1 || !c2) continue;
  const a1 = parse(readMultiLine(lines, c1.idx));
  const a2 = parse(readMultiLine(lines, c2.idx));
  const n1 = a1 ? a1.length : '?';
  const n2 = a2 ? a2.length : '?';
  const diff = (typeof n1 === 'number' && typeof n2 === 'number') ? (n1 - n2) : '?';
  const flag = diff !== 0 ? ' <- COPY1 IS NEWER' : '';
  console.log(`  ${k.padEnd(20)} ${String(n1).padStart(5)}   ${String(n2).padStart(5)}   ${String(diff).padStart(4)}${flag}`);
}

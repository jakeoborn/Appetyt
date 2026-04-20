const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const m = html.match(/const PARK_DATA\s*=\s*\{/);
const start = m.index + m[0].length - 1;
let d = 0, inStr = false, esc = false, sc = null, end = -1;
for (let i = start; i < html.length; i++) {
  const c = html[i];
  if (esc) { esc = false; continue; }
  if (c === '\\' && inStr) { esc = true; continue; }
  if (inStr) { if (c === sc) { inStr = false; sc = null; } continue; }
  if (c === '"' || c === "'" || c === '`') { inStr = true; sc = c; continue; }
  if (c === '{') d++;
  if (c === '}') { d--; if (d === 0) { end = i + 1; break; } }
}
console.log('start:', start, 'end:', end, 'len:', end - start);
const slice = html.substring(start, end);
try { JSON.parse(slice); console.log('JSON parse OK'); }
catch (e) {
  console.log('JSON parse fail:', e.message.substring(0, 120));
  try { const o = new Function('return ' + slice)(); console.log('Function eval OK, top keys:', Object.keys(o).slice(0, 5)); }
  catch (e2) { console.log('Function eval also failed:', e2.message.substring(0, 200)); }
}
// Print first 200 and last 100 chars
console.log('\nFirst 200 chars:');
console.log(slice.substring(0, 200));
console.log('\nLast 100 chars:');
console.log(slice.substring(slice.length - 100));

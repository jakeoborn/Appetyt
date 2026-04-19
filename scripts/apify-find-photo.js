// Find a restaurant's current photoUrl by name regex in any city.
// Usage: node scripts/apify-find-photo.js <cityVar> <nameRegex>
const fs = require('fs');
const cityVar = process.argv[2];
const names = process.argv.slice(3);
const html = fs.readFileSync('index.html', 'utf8');
const re = new RegExp('const ' + cityVar + '\\s*=\\s*\\[');
const m = html.match(re);
if (!m) { console.error('var not found'); process.exit(1); }
const start = m.index + m[0].length - 1;
let d = 0, inStr = false, esc = false, sc = null, end = -1;
for (let i = start; i < html.length; i++) {
  const c = html[i];
  if (esc) { esc = false; continue; }
  if (c === '\\' && inStr) { esc = true; continue; }
  if (inStr) { if (c === sc) { inStr = false; sc = null; } continue; }
  if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
  if (c === '[') d++;
  if (c === ']') { d--; if (!d) { end = i + 1; break; } }
}
const arr = JSON.parse(html.substring(start, end));
for (const n of names) {
  const pat = new RegExp(n, 'i');
  const r = arr.find(x => pat.test(x.name || ''));
  if (r) console.log(`${r.name}\n  photoUrl: ${r.photoUrl || '(empty)'}`);
  else console.log(`No match for /${n}/`);
}

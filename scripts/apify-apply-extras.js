// Apply entries from scripts/apify-extra-photos-{city}.json to index.html.
// Only touches entries that currently have no photoUrl.
// Usage: node scripts/apify-apply-extras.js <CITY_VAR>
const fs = require('fs');

const cityVar = process.argv[2];
if (!cityVar) { console.error('Usage: node apify-apply-extras.js <CITY_VAR>'); process.exit(1); }
const cityShort = cityVar.replace('_DATA', '').toLowerCase();

const extrasPath = `scripts/apify-extra-photos-${cityShort}.json`;
if (!fs.existsSync(extrasPath)) { console.error('Missing ' + extrasPath); process.exit(1); }
const extras = JSON.parse(fs.readFileSync(extrasPath, 'utf8'));

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
const byId = new Map(arr.filter(x => x && x.id).map(x => [x.id, x]));

let applied = 0, skipped = 0;
const sourceCount = {};
for (const e of extras) {
  if (!e.ok) continue;
  const entry = byId.get(e.id);
  if (!entry) continue;
  // Only apply when photoUrl is currently empty — never overwrite a curated one.
  if (entry.photoUrl && /^https?:\/\//.test(entry.photoUrl)) { skipped++; continue; }
  entry.photoUrl = e.url;
  sourceCount[e.source] = (sourceCount[e.source] || 0) + 1;
  applied++;
}
const newSlice = JSON.stringify(arr);
fs.writeFileSync('index.html', html.substring(0, start) + newSlice + html.substring(end));
console.log(`Applied ${applied} extra photos to ${cityVar}. Skipped ${skipped} (already had photo).`);
console.log('Source breakdown:', sourceCount);

// Generic city query extractor. Writes scripts/apify-{city}-queries.json
// Usage: node scripts/apify-extract.js <CITY_VAR>
//   node scripts/apify-extract.js LA_DATA
const fs = require('fs');

const cityVar = process.argv[2];
if (!cityVar) { console.error('Usage: node apify-extract.js <CITY_VAR>'); process.exit(1); }
const cityShort = cityVar.replace('_DATA', '').toLowerCase();

const html = fs.readFileSync('index.html', 'utf8');

function extractArray(varDecl) {
  const re = new RegExp('const ' + varDecl + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) throw new Error('not found: ' + varDecl);
  const start = m.index + m[0].length - 1;
  let depth = 0, inStr = false, esc = false, sc = null;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (ch === sc) { inStr = false; sc = null; } continue; }
    if (ch === '"' || ch === "'") { inStr = true; sc = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) {
      const slice = html.substring(start, i + 1);
      try { return JSON.parse(slice); } catch { return (new Function('return ' + slice))(); }
    }}
  }
  throw new Error('unclosed array: ' + varDecl);
}

const data = extractArray(cityVar);
console.log(`${cityVar} entries:`, data.length);

const queries = [];
const snapshot = [];
for (const r of data) {
  if (!r || !r.id || !r.name) continue;
  const q = r.address ? `${r.name}, ${r.address}` : r.name;
  queries.push(q);
  snapshot.push({
    id: r.id, name: r.name, address: r.address || '',
    current: {
      phone: r.phone || '', website: r.website || '', instagram: r.instagram || '',
      lat: r.lat, lng: r.lng, photoUrl: r.photoUrl || ''
    }
  });
}

const out = `scripts/apify-${cityShort}-queries.json`;
fs.writeFileSync(out, JSON.stringify({ queries, snapshot }, null, 2));
console.log(`Wrote ${queries.length} queries to ${out}`);

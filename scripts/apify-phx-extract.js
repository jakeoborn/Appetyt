// Extract PHX_DATA entries and emit Apify-ready batch query input.
// Output: scripts/apify-phx-queries.json
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

function extractArray(varDecl) {
  const re = new RegExp(varDecl + '\\s*=\\s*\\[');
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

const phx = extractArray('const PHX_DATA');
console.log('Phoenix entries:', phx.length);

const queries = phx
  .filter(r => r && r.name && r.address)
  .map(r => `${r.name}, ${r.address}`);

const snapshot = phx.map(r => ({
  id: r.id,
  name: r.name,
  address: r.address,
  current: {
    phone: r.phone || '',
    website: r.website || '',
    instagram: r.instagram || '',
    lat: r.lat,
    lng: r.lng,
    photoUrl: r.photoUrl || ''
  }
}));

fs.writeFileSync('scripts/apify-phx-queries.json', JSON.stringify({ queries, snapshot }, null, 2));
console.log('Wrote', queries.length, 'queries to scripts/apify-phx-queries.json');

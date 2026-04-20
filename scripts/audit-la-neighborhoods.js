// LA neighborhood audit.
const fs = require('fs');
const path = require('path');
const { NBH_BOUNDS, inBox, inNeighborhood } = require('./neighborhood-bounds');

const CITY = 'la';
const VAR = 'LA_DATA';
const STATE_BOX_CA = [32.5, 42.0, -124.5, -114.1];
const TOL_DEG = 0.0045;

function extractDataArray(html, v) {
  const patterns = ['const ' + v + '=[', 'const ' + v + ' =[', 'const ' + v + ' = ['];
  let s = -1; for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { s = i + p.length - 1; break; } }
  if (s < 0) throw new Error(v + ' not found');
  let d = 0, e = -1;
  for (let i = s; i < html.length; i++) { if (html[i] === '[') d++; else if (html[i] === ']') { d--; if (!d) { e = i; break; } } }
  return eval('(' + html.slice(s, e + 1) + ')');
}
const distBox = (lat, lng, b) => {
  const dLa = lat < b[0] ? b[0] - lat : lat > b[1] ? lat - b[1] : 0;
  const dLn = lng < b[2] ? b[2] - lng : lng > b[3] ? lng - b[3] : 0;
  return Math.sqrt(dLa * dLa + dLn * dLn);
};
function minDist(lat, lng, n) {
  const e = (NBH_BOUNDS[CITY] || {})[n];
  if (!e) return 0;
  const boxes = Array.isArray(e[0]) ? e : [e];
  return Math.min(...boxes.map(b => distBox(lat, lng, b)));
}
function candidates(lat, lng) {
  const hits = [];
  for (const [n, e] of Object.entries(NBH_BOUNDS[CITY])) {
    if (!e) continue;
    const boxes = Array.isArray(e[0]) ? e : [e];
    if (boxes.some(b => inBox(lat, lng, b))) hits.push(n);
  }
  return hits;
}
function addrCity(a) { if (!a) return null; const m = a.match(/,\s*([A-Za-z][A-Za-z\s.'-]+?),\s*CA\b/); return m ? m[1].trim() : null; }

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const data = extractDataArray(html, VAR);
const outliers = [];
let checked = 0, inB = 0, noB = 0;
for (const r of data) {
  if (r.lat == null || r.lng == null) continue;
  checked++;
  if (!inBox(r.lat, r.lng, STATE_BOX_CA)) continue;
  const res = inNeighborhood(r.lat, r.lng, CITY, r.neighborhood);
  if (res.reason === 'no-bounds-for-neighborhood') { noB++; continue; }
  if (res.ok) { inB++; continue; }
  const d = minDist(r.lat, r.lng, r.neighborhood);
  if (d <= TOL_DEG) { inB++; continue; }
  outliers.push({
    id: r.id, name: r.name, neighborhood: r.neighborhood, addr_city: addrCity(r.address),
    lat: r.lat, lng: r.lng, address: r.address, dist_deg: +d.toFixed(4),
    severity: d > 0.05 ? 'severe' : d > 0.015 ? 'moderate' : 'edge',
    suggested: candidates(r.lat, r.lng),
  });
}
const bySev = { severe: [], moderate: [], edge: [] };
outliers.forEach(o => bySev[o.severity].push(o));
fs.writeFileSync(path.join(__dirname, 'la-neighborhood-audit.json'),
  JSON.stringify({ city: 'LA', checked, in_bounds: inB, no_bounds: noB, severe: bySev.severe, moderate: bySev.moderate, edge: bySev.edge }, null, 2));
console.log('LA: checked=' + checked + ' in=' + inB + ' no-bounds=' + noB + ' severe=' + bySev.severe.length + ' moderate=' + bySev.moderate.length + ' edge=' + bySev.edge.length);
for (const sev of ['severe', 'moderate', 'edge']) {
  if (!bySev[sev].length) continue;
  console.log('\n— ' + sev.toUpperCase() + ' (' + bySev[sev].length + ') —');
  for (const o of bySev[sev]) {
    const sug = o.suggested.length ? '→ ' + o.suggested.slice(0, 4).join('|') : '→ (no match)';
    const addr = o.addr_city ? '  addr="' + o.addr_city + '"' : '';
    console.log('  #' + o.id + '  ' + (o.name || '').padEnd(34).slice(0, 34) + '  [' + o.neighborhood + ']  d=' + o.dist_deg + addr + '  ' + sug);
    console.log('      ' + (o.address || '').slice(0, 80) + '  @  ' + o.lat.toFixed(4) + ',' + o.lng.toFixed(4));
  }
}

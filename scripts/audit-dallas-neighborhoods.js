// Audit Dallas cards whose (lat,lng) falls outside their claimed
// neighborhood's bounding box. Same format as audit-slc-neighborhoods.js:
// severity buckets (severe >5km, moderate >1.5km, edge >500m) with
// ~500m tolerance before flagging.

const fs = require('fs');
const path = require('path');
const { NBH_BOUNDS, inBox, inNeighborhood } = require('./neighborhood-bounds');

const CITY = 'dallas';
const VAR = 'DALLAS_DATA';
const STATE_BOX_TX = [25.8, 36.6, -106.7, -93.5];
const TOL_DEG = 0.0045;

function extractDataArray(html, varName) {
  const patterns = ['const ' + varName + '=[', 'const ' + varName + ' =['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error(varName + ' not found');
  let depth = 0, end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (!depth) { end = i; break; } }
  }
  return eval('(' + html.slice(start, end + 1) + ')');
}

function distFromBox(lat, lng, box) {
  const [latMin, latMax, lngMin, lngMax] = box;
  const dLat = lat < latMin ? latMin - lat : lat > latMax ? lat - latMax : 0;
  const dLng = lng < lngMin ? lngMin - lng : lng > lngMax ? lng - lngMax : 0;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

function minDistToClaimed(lat, lng, neighborhood) {
  const entry = (NBH_BOUNDS[CITY] || {})[neighborhood];
  if (!entry) return 0;
  const boxes = Array.isArray(entry[0]) ? entry : [entry];
  return Math.min(...boxes.map(b => distFromBox(lat, lng, b)));
}

function candidateNeighborhoods(lat, lng) {
  const table = NBH_BOUNDS[CITY];
  const hits = [];
  for (const [name, entry] of Object.entries(table)) {
    if (!entry) continue;
    const boxes = Array.isArray(entry[0]) ? entry : [entry];
    if (boxes.some(b => inBox(lat, lng, b))) hits.push(name);
  }
  return hits;
}

function extractAddrCity(addr) {
  if (!addr) return null;
  const m = addr.match(/,\s*([A-Za-z][A-Za-z\s.'-]+?),\s*TX\b/);
  return m ? m[1].trim() : null;
}

function run() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const data = extractDataArray(html, VAR);
  const outliers = [];
  let checked = 0, inBounds = 0, noBounds = 0, outOfState = 0;

  for (const r of data) {
    if (r.lat == null || r.lng == null) continue;
    checked++;
    if (!inBox(r.lat, r.lng, STATE_BOX_TX)) { outOfState++; continue; }
    const res = inNeighborhood(r.lat, r.lng, CITY, r.neighborhood);
    if (res.reason === 'no-bounds-for-neighborhood') { noBounds++; continue; }
    if (res.ok) { inBounds++; continue; }
    const dist = minDistToClaimed(r.lat, r.lng, r.neighborhood);
    if (dist <= TOL_DEG) { inBounds++; continue; }
    const suggested = candidateNeighborhoods(r.lat, r.lng);
    outliers.push({
      id: r.id, name: r.name, neighborhood: r.neighborhood,
      addr_city: extractAddrCity(r.address),
      lat: r.lat, lng: r.lng, address: r.address,
      dist_deg: +dist.toFixed(4),
      severity: dist > 0.05 ? 'severe' : dist > 0.015 ? 'moderate' : 'edge',
      suggested,
    });
  }

  const bySev = { severe: [], moderate: [], edge: [] };
  outliers.forEach(o => bySev[o.severity].push(o));

  const report = {
    city: 'Dallas', total_checked: checked, in_bounds: inBounds,
    out_of_bounds: outliers.length, no_bounds: noBounds, out_of_state: outOfState,
    severe: bySev.severe, moderate: bySev.moderate, edge: bySev.edge,
  };
  fs.writeFileSync(path.join(__dirname, 'dallas-neighborhood-audit.json'), JSON.stringify(report, null, 2));

  console.log('Dallas neighborhood audit');
  console.log('  checked=' + checked + '  in=' + inBounds + '  no-bounds=' + noBounds
    + '  out-of-state=' + outOfState);
  console.log('  severe=' + bySev.severe.length + '  moderate=' + bySev.moderate.length + '  edge=' + bySev.edge.length);
  for (const sev of ['severe', 'moderate', 'edge']) {
    if (!bySev[sev].length) continue;
    console.log('');
    console.log('— ' + sev.toUpperCase() + ' (' + bySev[sev].length + ') —');
    for (const o of bySev[sev]) {
      const sug = o.suggested.length ? '→ ' + o.suggested.slice(0, 4).join('|') : '→ (no match)';
      const addr = o.addr_city ? '  addr="' + o.addr_city + '"' : '';
      console.log('  #' + o.id + '  ' + (o.name || '').padEnd(36).slice(0, 36)
        + '  [' + o.neighborhood + ']  d=' + o.dist_deg + addr + '  ' + sug);
      console.log('      ' + (o.address || '').slice(0, 80) + '  @  ' + o.lat.toFixed(4) + ',' + o.lng.toFixed(4));
    }
  }
}

run();

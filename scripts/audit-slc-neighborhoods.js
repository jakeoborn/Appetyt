// Audit SLC cards whose (lat,lng) falls outside the bounding box of the
// neighborhood they are assigned to. Produces a JSON report of outliers
// with suggested reassignments based on which other neighborhood box(es)
// actually contain the coords.

const fs = require('fs');
const path = require('path');
const { NBH_BOUNDS, STATE_BOX_UT, inBox, inNeighborhood } = require('./neighborhood-bounds');

// 0.0045° ≈ 500m at SLC latitude — absorbs geocoding jitter and
// addresses on the very edge of the canonical neighborhood boundary.
const TOL_DEG = 0.0045;

function distFromBox(lat, lng, box) {
  const [latMin, latMax, lngMin, lngMax] = box;
  const dLat = lat < latMin ? latMin - lat : lat > latMax ? lat - latMax : 0;
  const dLng = lng < lngMin ? lngMin - lng : lng > lngMax ? lng - lngMax : 0;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

function minDistToClaimed(lat, lng, city, neighborhood) {
  const entry = (NBH_BOUNDS[city] || {})[neighborhood];
  if (!entry) return 0;
  const boxes = Array.isArray(entry[0]) ? entry : [entry];
  return Math.min(...boxes.map(b => distFromBox(lat, lng, b)));
}

function extractDataArray(html, varName) {
  const start = html.indexOf('const ' + varName);
  if (start < 0) throw new Error(varName + ' not found');
  const open = html.indexOf('[', start);
  let depth = 0, end = -1;
  for (let i = open; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (!depth) { end = i; break; } }
  }
  return eval('(' + html.slice(open, end + 1) + ')');
}

function candidateNeighborhoods(lat, lng, city) {
  const table = NBH_BOUNDS[city];
  const hits = [];
  for (const [name, entry] of Object.entries(table)) {
    if (entry === null || entry === undefined) continue;
    const boxes = Array.isArray(entry[0]) ? entry : [entry];
    if (boxes.some(b => inBox(lat, lng, b))) hits.push(name);
  }
  return hits;
}

function run() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const data = extractDataArray(html, 'SLC_DATA');
  const outliers = [];
  const outOfState = [];
  let checked = 0, inBounds = 0, noBounds = 0, catchall = 0;

  for (const r of data) {
    if (r.lat == null || r.lng == null) continue;
    checked++;
    if (!inBox(r.lat, r.lng, STATE_BOX_UT)) {
      outOfState.push({ id: r.id, name: r.name, neighborhood: r.neighborhood, lat: r.lat, lng: r.lng, address: r.address });
      continue;
    }
    const res = inNeighborhood(r.lat, r.lng, 'slc', r.neighborhood);
    if (res.reason === 'no-bounds-for-neighborhood') { noBounds++; continue; }
    if (res.reason === 'catchall') { catchall++; continue; }
    if (res.ok) { inBounds++; continue; }
    const dist = minDistToClaimed(r.lat, r.lng, 'slc', r.neighborhood);
    if (dist <= TOL_DEG) { inBounds++; continue; }
    const suggestions = candidateNeighborhoods(r.lat, r.lng, 'slc');
    outliers.push({
      id: r.id,
      name: r.name,
      neighborhood: r.neighborhood,
      lat: r.lat,
      lng: r.lng,
      address: r.address,
      suburb: !!r.suburb,
      dist_deg: +dist.toFixed(4),
      severity: dist > 0.05 ? 'severe' : dist > 0.015 ? 'moderate' : 'edge',
      suggested: suggestions,
    });
  }

  const report = {
    city: 'Salt Lake City',
    total_checked: checked,
    in_bounds: inBounds,
    out_of_bounds: outliers.length,
    no_bounds_defined: noBounds,
    catchall: catchall,
    out_of_state: outOfState.length,
    outliers,
    out_of_state_rows: outOfState,
  };

  const outPath = path.join(__dirname, 'slc-neighborhood-audit.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log('SLC neighborhood audit');
  console.log('  checked:      ' + checked);
  console.log('  in-bounds:    ' + inBounds);
  console.log('  out-of-box:   ' + outliers.length);
  console.log('  no-bounds:    ' + noBounds);
  console.log('  catchall:     ' + catchall);
  console.log('  out-of-state: ' + outOfState.length);
  console.log('');
  const bySev = { severe: [], moderate: [], edge: [] };
  outliers.forEach(o => bySev[o.severity].push(o));
  console.log('By severity:  severe=' + bySev.severe.length + '  moderate=' + bySev.moderate.length + '  edge=' + bySev.edge.length);
  for (const sev of ['severe', 'moderate', 'edge']) {
    if (!bySev[sev].length) continue;
    console.log('');
    console.log('— ' + sev.toUpperCase() + ' (' + bySev[sev].length + ') —');
    for (const o of bySev[sev]) {
      const sug = o.suggested.length ? '→ ' + o.suggested.join('|') : '→ (no match in any nbhd box)';
      console.log('  #' + o.id + '  ' + o.name + '  [' + o.neighborhood + ']  d=' + o.dist_deg + '  ' + sug);
      console.log('      ' + (o.address || '').slice(0, 80) + '  @  ' + o.lat.toFixed(4) + ',' + o.lng.toFixed(4));
    }
  }
  console.log('');
  console.log('Report: ' + outPath);
}

run();

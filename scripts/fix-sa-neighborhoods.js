// San Antonio neighborhood relabel fixes.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 6016, to: 'North San Antonio', reason: '2Bros BBQ: 12656 West Ave 78216 + coords (29.56,-98.50) — north central SA, not Monte Vista' },
  { id: 6026, to: 'North San Antonio', reason: 'Meadow: 555 W Bitters Rd 78216 + coords (29.54,-98.51) — North SA, not Southtown' },
  { id: 6027, to: 'North San Antonio', reason: 'Pinch Boil House: 226 W Bitters Rd 78216 + coords (29.57,-98.49) — North SA, not Pearl' },
  { id: 6019, to: 'North San Antonio', reason: 'Dough Pizzeria Napoletana: 6989 Blanco Rd 78216 + coords (29.52,-98.51) — north central, not Alamo Heights' },
  { id: 6040, to: 'Alamo Heights',     reason: 'Tre Trattoria: 555 E Basse Rd 78209 + coords (29.50,-98.47) — Alamo Heights, not Pearl' },
  { id: 6043, to: 'Alamo Heights',     reason: 'Folc: 226 E Olmos Dr 78212 + coords (29.47,-98.48) — Olmos Park / Alamo Heights, not Southtown' },
];

function findCityRange(html) {
  const patterns = ['const SANANTONIO_DATA = [', 'const SANANTONIO_DATA =[', 'const SANANTONIO_DATA=['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('SANANTONIO_DATA not found');
  let depth = 0, end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (!depth) { end = i; break; } }
  }
  return { start, end };
}

function findCardSlice(html, id, cityRange) {
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1;
  for (const a of anchors) {
    const i = html.indexOf(a, cityRange.start);
    if (i >= 0 && i < cityRange.end) { at = i; break; }
  }
  if (at < 0) return null;
  let depth = 0, start = -1;
  for (let i = at; i >= 0; i--) {
    if (html[i] === '}') depth++;
    else if (html[i] === '{') { if (!depth) { start = i; break; } depth--; }
  }
  if (start < 0) return null;
  depth = 0; let end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (!depth) { end = i; break; } }
  }
  return end > 0 ? { start, end } : null;
}

function run() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  let cityRange = findCityRange(html);
  const applied = [], skipped = [];
  for (const fix of FIXES) {
    const slice = findCardSlice(html, fix.id, cityRange);
    if (!slice) { skipped.push({ ...fix, why: 'not found in SANANTONIO_DATA' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const m = obj.match(/"neighborhood":"([^"]*)"/);
    if (!m) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    if (m[1] === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + m[1] + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: m[1], to: fix.to, reason: fix.reason });
    cityRange = findCityRange(html);
  }
  fs.writeFileSync(indexPath, html);
  console.log('San Antonio neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  fs.writeFileSync(path.join(__dirname, 'sa-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped }, null, 2));
}

run();

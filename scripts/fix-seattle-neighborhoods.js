// Seattle neighborhood relabel fixes. Scoped to SEATTLE_DATA only.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 9008, to: 'Ballard',       reason: 'Rupee Bar: 6307 24th Ave NW 98107 + coords (47.67,-122.39) — Ballard, not Capitol Hill' },
  { id: 9359, to: 'South Seattle', reason: "Nate's Wings & Waffles: 9261 57th Ave S 98118 + coords (47.52,-122.26) — Rainier Beach / South Seattle" },
  { id: 9409, to: 'Wedgwood',      reason: 'Flying Squirrel Pizza: 8310 5th Ave NE 98115 + coords (47.69,-122.32) — Wedgwood/Maple Leaf edge, not Georgetown' },
  { id: 9447, to: 'Eastlake',      reason: 'Paju Dakgalbi: 2236 Eastlake Ave E 98102 + coords (47.64,-122.33) — Eastlake, not Lynnwood' },
];

const COORD_BUGS = [
  { id: 9419, name: 'Bamboo Sushi Bellevue',       issue: 'addr 10000 NE 8th St Bellevue 98004 but coord 47.66,-122.30 is UDist, not Bellevue (~47.62,-122.19)' },
  { id: 9422, name: 'Bin on the Lake',             issue: 'addr 1200 Carillon Point Kirkland 98033 but coord 47.62,-122.36 is Queen Anne, not Kirkland (~47.67,-122.21)' },
  { id: 9449, name: 'Altstadt German Bierhalle',   issue: 'addr 209 1st Ave S 98104 (Pioneer Sq) but coord 47.67,-122.32 is UDist, not Pioneer Sq (~47.60,-122.33)' },
  { id: 9463, name: 'Din Tai Fung Seattle',        issue: 'addr 2621 NE 46th St 98105 (U-Village) but coord 47.61,-122.34 is Downtown, not U-Village (~47.66,-122.30)' },
  { id: 9472, name: 'Szechuan Cuisine',            issue: 'addr 4560 University Way NE 98105 (UDist) but coord 47.60,-122.32 is Pioneer Sq, not UDist (~47.66,-122.31)' },
  { id: 9473, name: 'Monkey Tree Vietnamese',      issue: 'addr 5000 University Way NE 98105 (UDist) but coord 47.67,-122.38 is Ballard, not UDist (~47.66,-122.31)' },
];

function findCityRange(html) {
  const patterns = ['const SEATTLE_DATA=[', 'const SEATTLE_DATA =['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('SEATTLE_DATA not found');
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
    if (!slice) { skipped.push({ ...fix, why: 'not found in SEATTLE_DATA' }); continue; }
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
  console.log('Seattle neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('\nCOORD BUGS flagged for user: ' + COORD_BUGS.length);
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name + ' — ' + b.issue);
  fs.writeFileSync(path.join(__dirname, 'seattle-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS }, null, 2));
}

run();

// Apply neighborhood relabel fixes for Chicago cards surfaced by
// audit-chicago-neighborhoods.js. Only SEVERE cases where zip + coords
// clearly indicate a different neighborhood.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 105, to: 'Logan Square',   reason: 'Reno: 2607 N Milwaukee Ave 60647 + coords (41.93,-87.71) — Logan Square' },
  { id: 114, to: 'South Loop',     reason: 'Apolonia: 105 E Cermak Rd 60616 + coords (41.85,-87.62) — South Loop/Motor Row' },
  { id: 209, to: 'Lincoln Square', reason: 'Aroy Thai: 4654 N Damen Ave 60625 + coords (41.97,-87.68) — Lincoln Square' },
  { id: 345, to: 'Logan Square',   reason: 'Bixi Beer: 2515 N Milwaukee Ave 60647 + coords (41.93,-87.70) — Logan Square' },
  { id: 510, to: 'Chatham',        reason: 'Soul Vegetarian South: 203 E 75th St 60619 + coords (41.76,-87.62) — Chatham' },
  { id: 539, to: 'Bronzeville',    reason: "Reggio's Chatham: 4438 S Cottage Grove 60653 + coords (41.81,-87.61) — Bronzeville/Kenwood (44th St is Bronzeville territory)" },
];

const NO_BUCKET = [
  { id: 128, name: 'Arami',  issue: '5700 S Cicero Ave 60638 — Garfield Ridge (SW side). Labeled West Town. No matching Chicago neighborhood bucket; defer to user (coord may also be wrong).' },
  { id: 457, name: 'Herb',   issue: '6857 W Belmont Ave 60634 — Dunning/Belmont Cragin (NW side). Labeled Lakeview. No matching bucket; defer.' },
];

// Find CHICAGO_DATA slice bounds — Chicago ids collide with Dallas/other
// city ids, so id lookups must be scoped within this array only.
function findCityRange(html) {
  const patterns = ['const CHICAGO_DATA=[', 'const CHICAGO_DATA =['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('CHICAGO_DATA not found');
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
    if (!slice) { skipped.push({ ...fix, why: 'not found' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const m = obj.match(/"neighborhood":"([^"]*)"/);
    if (!m) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    // Check id to confirm we found the right card
    const idMatch = obj.match(/"id":(\d+)/);
    if (!idMatch || +idMatch[1] !== fix.id) { skipped.push({ ...fix, why: 'wrong card (found id=' + (idMatch && idMatch[1]) + ')' }); continue; }
    if (m[1] === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + m[1] + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: m[1], to: fix.to, reason: fix.reason });
    // Re-locate cityRange after each mutation (offsets may have shifted)
    cityRange = findCityRange(html);
  }
  fs.writeFileSync(indexPath, html);
  console.log('Chicago neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('');
  console.log('NO GOOD BUCKET — deferred to user:');
  for (const n of NO_BUCKET) console.log('  #' + n.id + '  ' + n.name + '  — ' + n.issue);

  fs.writeFileSync(
    path.join(__dirname, 'chicago-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, no_bucket: NO_BUCKET }, null, 2)
  );
}

run();

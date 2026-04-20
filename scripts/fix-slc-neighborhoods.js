// Apply neighborhood relabel fixes for SLC cards surfaced by
// audit-slc-neighborhoods.js. Uses {"id":NNNNN ...} as a unique anchor.
// Prints before/after per card.

const fs = require('fs');
const path = require('path');

const FIXES = [
  // id, from-neighborhood, to-neighborhood, reason
  { id: 11113, to: 'Suburban SLC', reason: 'Great Salt Lake / Antelope Island is in Davis County (Syracuse), not NSL' },
  { id: 11134, to: 'Sandy',        reason: "Kenny J's BBQ: 9745 S 700 E Sandy" },
  { id: 11257, to: 'Ogden',        reason: 'Ogden Eccles Dinosaur Park is in Ogden, not NSL' },
  { id: 11382, to: 'Holladay',     reason: 'Cafe Madrid: 2080 E 3900 S, 84124 (Holladay zip)' },
  { id: 11428, to: 'Sandy',        reason: 'Fratelli Ristorante: 9236 Village Shop Dr, Sandy' },
  { id: 11433, to: 'Holladay',     reason: 'Iceberg Drive Inn: 3900 S 900 E, 84124 (Holladay zip)' },
  { id: 11388, to: 'Westside SLC', reason: 'Squatters Airport is at SLC International, 84116 (NW side, not Downtown)' },
];

function findCardSlice(html, id) {
  // Anchor: `"id":<id>,` or `"id":<id>}` appears once per card.
  // Card objects can have id at the start OR the end of the object, so we
  // find the anchor then walk brace depth outward to locate the enclosing
  // `{ ... }` — this works regardless of field order inside the object.
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1;
  for (const a of anchors) { at = html.indexOf(a); if (at >= 0) break; }
  if (at < 0) return null;

  // Walk backward: find the `{` that opens this card's object.
  let depth = 0, start = -1;
  for (let i = at; i >= 0; i--) {
    const c = html[i];
    if (c === '}') depth++;
    else if (c === '{') { if (depth === 0) { start = i; break; } depth--; }
  }
  if (start < 0) return null;

  // Walk forward from start: find the matching `}`.
  depth = 0;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (!depth) { end = i; break; } }
  }
  return end > 0 ? { start, end } : null;
}

function run() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const before = html.length;
  const applied = [];
  const skipped = [];

  for (const fix of FIXES) {
    const slice = findCardSlice(html, fix.id);
    if (!slice) { skipped.push({ ...fix, why: 'card not found' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const nbhdMatch = obj.match(/"neighborhood":"([^"]*)"/);
    if (!nbhdMatch) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    const fromNbh = nbhdMatch[1];
    if (fromNbh === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + fromNbh + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: fromNbh, to: fix.to, reason: fix.reason });
  }

  fs.writeFileSync(indexPath, html);
  const after = html.length;

  console.log('SLC neighborhood fixes');
  console.log('  file size: ' + before + ' → ' + after + ' (Δ ' + (after - before) + ')');
  console.log('  applied:   ' + applied.length);
  console.log('  skipped:   ' + skipped.length);
  console.log('');
  for (const a of applied) {
    console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
    console.log('      ' + a.reason);
  }
  if (skipped.length) {
    console.log('');
    console.log('Skipped:');
    for (const s of skipped) console.log('  #' + s.id + '  ' + s.why);
  }

  fs.writeFileSync(
    path.join(__dirname, 'slc-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped }, null, 2)
  );
}

run();

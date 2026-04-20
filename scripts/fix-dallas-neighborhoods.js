// Apply neighborhood relabel fixes for Dallas cards surfaced by
// audit-dallas-neighborhoods.js. Only SEVERE cases where address +
// coords jointly indicate an unambiguous wrong neighborhood label.
//
// NOTE: a prior agent's Dallas-fix script lives at
// fix-dallas-neighborhoods-other-agent.js with 50+ fixes, ~7/11
// sampled are already reflected in index.html. The IDs below do
// NOT overlap with that script.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 120,  to: 'Far North Dallas', reason: "Deli News: 17062 Preston Rd 75248 — zip + coords (32.98,-96.80) are Far North Dallas" },
  { id: 1092, to: 'Oak Cliff',        reason: "Kendall Karsen's: 3939 S Polk 75224 — zip + coords (32.70,-96.84) are Oak Cliff, not Cedars" },
  { id: 1096, to: 'Addison',          reason: 'Velvet Taco: 15104 Dallas Pkwy, Addison TX 75248 — address explicitly says Addison, label was Deep Ellum' },
];

// Cards with coord/address conflicts — data bugs not neighborhood bugs.
// Documented here for user review; not auto-applying.
const COORD_BUGS = [
  { id: 409, name: 'Ella', issue: 'Card address "7949 Walnut Hill Ln 75230" (Preston Hollow) with coords 32.7345,-96.8559 (Oak Cliff). Other-agent script proposes neighborhood=Oak Cliff based on a different address ("2306 W Clarendon Dr"). Need verified source of truth.' },
  { id: 410, name: 'III Forks', issue: 'Card address "5100 Belt Line Rd, Addison 75254" with coords 33.0887,-96.8398 (Plano). Other-agent script proposes neighborhood=Frisco based on "1303 Legacy Dr, Frisco". Need verified source.' },
];

function findCardSlice(html, id) {
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1; for (const a of anchors) { at = html.indexOf(a); if (at >= 0) break; }
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
  const applied = [], skipped = [];
  for (const fix of FIXES) {
    const slice = findCardSlice(html, fix.id);
    if (!slice) { skipped.push({ ...fix, why: 'not found' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const m = obj.match(/"neighborhood":"([^"]*)"/);
    if (!m) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    if (m[1] === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + m[1] + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: m[1], to: fix.to, reason: fix.reason });
  }
  fs.writeFileSync(indexPath, html);

  console.log('Dallas neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) {
    console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
    console.log('      ' + a.reason);
  }
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('');
  console.log('COORD BUGS flagged for user review:');
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name + '  — ' + b.issue);

  fs.writeFileSync(
    path.join(__dirname, 'dallas-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS }, null, 2)
  );
}

run();

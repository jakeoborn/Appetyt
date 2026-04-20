// LA neighborhood relabel fixes.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 2018, to: 'West LA',      reason: 'Sushi Ginza Onodera: 11651 Santa Monica Blvd 90025 + coords (34.04,-118.46) — Sawtelle/West LA' },
  { id: 2115, to: 'Downtown LA',  reason: "Mastro's Steakhouse: 1200 S Figueroa 90015 + coords (34.04,-118.27) — DTLA" },
  { id: 2223, to: 'Los Feliz',    reason: 'Holy Basil: 3170 Glendale Blvd 90039 + coords (34.12,-118.26) — Atwater Village / Los Feliz' },
  { id: 2246, to: 'Little Tokyo', reason: 'Bar Sawa: 111 S San Pedro St 90012 + coords (34.05,-118.24) — Little Tokyo' },
  { id: 2351, to: 'Brentwood',    reason: 'Pie Room: 11678 San Vicente Blvd 90049 + coords (34.05,-118.46) — Brentwood' },
];

const COORD_BUGS = [
  { id: 2099, name: 'Causita',         issue: "1700 Sunset Blvd 90026 (Echo Park) but coord 34.04,-118.46 is West LA (same coord as Sushi Ginza Onodera — likely swapped)" },
  { id: 2112, name: 'Sichuan Impression', issue: '23 W Valley Blvd Alhambra 91801 but coord 34.05,-118.44 is West LA (should be ~34.09,-118.13)' },
  { id: 2402, name: 'Hollywood Bowl',  issue: '2301 N Highland 90068 (Hollywood Hills) but coord 33.89,-118.41 is Manhattan Beach' },
  { id: 2013, name: 'Petit Trois',     issue: '718 Highland Ave 90038 (Hollywood) but coord 34.16,-118.28 is Glendale' },
];

function findCityRange(html) {
  const patterns = ['const LA_DATA=[', 'const LA_DATA =['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('LA_DATA not found');
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
    if (!slice) { skipped.push({ ...fix, why: 'not found in LA_DATA' }); continue; }
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
  console.log('LA neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('\nCOORD BUGS: ' + COORD_BUGS.length);
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name + ' — ' + b.issue);
  fs.writeFileSync(path.join(__dirname, 'la-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS }, null, 2));
}

run();

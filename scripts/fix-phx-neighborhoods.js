// Phoenix neighborhood relabel fixes.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 3262, to: 'West Phoenix',    reason: 'Tortas El Güero: 3421 N 19th Ave 85015 + coords (33.49,-112.10) — West Phoenix' },
  { id: 3138, to: 'Paradise Valley', reason: 'Hash Kitchen: 8777 N Scottsdale Rd 85253 + coords (33.56,-111.93) — Paradise Valley zip 85253' },
  { id: 3231, to: 'Uptown',          reason: 'AZ Wilderness Brewing: 5813 N 7th St 85014 + coords (33.52,-112.06) — Uptown Phoenix' },
  { id: 3284, to: 'West Phoenix',    reason: 'State 48 Brewery: 3063 N 28th Dr 85017 + coords (33.50,-112.12) — West Phoenix' },
  { id: 3427, to: 'Scottsdale',      reason: 'Hiro Sushi: 9393 N 90th St 85258 + coords (33.57,-111.89) — central Scottsdale (just south of North Scottsdale band)' },
];

const COORD_BUGS = [
  { id: 3010, name: "Bad Jimmy's", issue: '7620 E Indian School Rd Scottsdale 85251 but coord 33.53,-112.06 is Central Phoenix, not Scottsdale (should be ~33.49,-111.92)' },
  { id: 3125, name: 'Pita Jungle', issue: '7366 E Shea Blvd Scottsdale 85260 but coord 33.46,-112.08 is Phoenix, not N Scottsdale (should be ~33.58,-111.92)' },
  { id: 3265, name: 'AZ/88',       issue: '7353 E Scottsdale Mall 85251 (Old Town) but coord 33.65,-111.93 is far N Scottsdale, not Old Town (should be ~33.495,-111.925)' },
];

function findCityRange(html) {
  const patterns = ['const PHX_DATA = [', 'const PHX_DATA =[', 'const PHX_DATA=['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('PHX_DATA not found');
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
    if (!slice) { skipped.push({ ...fix, why: 'not found in PHX_DATA' }); continue; }
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
  console.log('Phoenix neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('\nCOORD BUGS: ' + COORD_BUGS.length);
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name + ' — ' + b.issue);
  fs.writeFileSync(path.join(__dirname, 'phx-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS }, null, 2));
}

run();

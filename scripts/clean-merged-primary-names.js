// Post-process cleanup: for entries with locations[] length >= 2, strip
// location-suffixes from the primary `name` so the card title is the brand
// (e.g., "Slackwater (Ogden)" → "Slackwater").
// The per-location label is already carried by locations[].name.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
  }
  return -1;
}

function locateArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return null;
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  return { arrS, arrE };
}

function parseArray(varName) {
  const pos = locateArray(varName);
  const src = html.substring(pos.arrS, pos.arrE);
  try { return JSON.parse(src); }
  catch (e) { return new Function('return ' + src)(); }
}

// Strip location suffix in three passes:
//   1. Trailing "(anything)"
//   2. Trailing directional words (North/South/East/West/Downtown/...) that
//      aren't actually part of the brand — if stripped candidate is still ≥4 chars.
//   3. Trailing neighborhood word matching one of the entry's locations[].neighborhood.
function cleanBrandName(name, locs) {
  let n = String(name || '').trim();
  // Pass 1: parens
  n = n.replace(/\s*\([^)]*\)\s*$/, '').trim();
  // Pass 2: neighborhoods from locations[]
  const nbhdWords = new Set();
  (locs || []).forEach(l => {
    const nb = String(l.neighborhood || l.name || '').trim();
    if (nb) nbhdWords.add(nb.toLowerCase());
  });
  for (const nb of nbhdWords) {
    // Try multiple variants: exact "Name Downtown", "Name Downtown SLC" etc.
    const re = new RegExp('\\s+' + nb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    const cand = n.replace(re, '').trim();
    if (cand !== n && cand.length >= 4) { n = cand; break; }
  }
  // Pass 3: common directional/zone trailers
  const trailers = ['North','South','East','West','Downtown','Uptown','Midtown','Central','Heights','Domain','Airport','Galleria','Park City'];
  for (const t of trailers) {
    const re = new RegExp('\\s+' + t + '$');
    const cand = n.replace(re, '').trim();
    if (cand !== n && cand.length >= 4) { n = cand; break; }
  }
  return n;
}

const cities = {
  'Dallas': 'const DALLAS_DATA',
  'Houston': 'const HOUSTON_DATA',
  'Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA',
  'Salt Lake City': 'const SLC_DATA',
  'Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA',
  'New York': 'const NYC_DATA',
};

const changes = [];

// Edit bottom-up
const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});

ordered.forEach(([city, varName]) => {
  const data = parseArray(varName);
  let touched = 0;
  data.forEach(r => {
    if (!Array.isArray(r.locations) || r.locations.length < 2) return;
    const oldName = r.name;
    const newName = cleanBrandName(oldName, r.locations);
    if (newName && newName !== oldName) {
      r.name = newName;
      touched++;
      changes.push({ city, id: r.id, from: oldName, to: newName });
    }
  });
  if (touched) {
    const pos = locateArray(varName);
    html = html.substring(0, pos.arrS) + JSON.stringify(data) + html.substring(pos.arrE);
  }
});

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('scripts/clean-primary-names-report.json', JSON.stringify(changes, null, 2));

console.log(`Cleaned ${changes.length} primary names:`);
changes.forEach(c => console.log(`  ${c.city}#${c.id}: "${c.from}" → "${c.to}"`));

// Austin neighborhood relabel fixes. Scoped to AUSTIN_DATA only because
// Austin ids (5000s) could overlap with other cities' ranges.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 5026, to: 'North Lamar',  reason: 'Barley Swine: 6555 Burnet Rd 78757 + coords (30.34,-97.74) — North Lamar/Allandale' },
  { id: 5082, to: 'South Lamar',  reason: 'Tacodeli Spyglass: 1500 Spyglass Dr 78746 + coords (30.26,-97.79) — south of Zilker' },
  { id: 5112, to: 'North Austin', reason: 'Tare: 12414 Alderbrook Dr 78727 + coords (30.42,-97.70) — Wells Branch/North Austin' },
  { id: 5139, to: 'Downtown',     reason: "Perry's Steakhouse: 114 W 7th St 78701 + coords (30.27,-97.74) — Downtown, not Domain" },
  { id: 5148, to: 'South Austin', reason: "G'Raj Mahal: 9900 I-35 78748 + coords (30.16,-97.79) — South Austin/Slaughter, not Rainey Street" },
  { id: 5159, to: 'North Lamar',  reason: 'La Pâtisserie: 7301 Burnet Rd 78757 + coords (30.35,-97.74) — North Lamar' },
  { id: 5179, to: 'South Austin', reason: 'Pasta | Bar: 7800 S 1st St 78745 + coords (30.19,-97.79) — South Austin' },
  { id: 5194, to: 'North Lamar',  reason: "Dan's Hamburgers: 5602 N Lamar Blvd 78751 + coords (30.32,-97.73) — North Lamar" },
  { id: 5229, to: 'North Austin', reason: 'Slab BBQ: 9012 Research Blvd 78758 + coords (30.37,-97.72) — North Austin' },
  { id: 5250, to: 'South Austin', reason: 'Rosen + Sage: 6603 Menchaca Rd 78745 + coords (30.21,-97.81) — South Austin' },
  { id: 5286, to: 'South Austin', reason: 'Cajun BBQ: 4404 W William Cannon 78749 + coords (30.22,-97.84) — South Austin/Oak Hill edge' },
  { id: 5287, to: 'South Austin', reason: 'El Marisquero: 2056 W Stassney 78745 + coords (30.22,-97.80) — South Austin' },
  { id: 5338, to: 'South Austin', reason: "Laala's: 3008 Davis Ln 78745 + coords (30.19,-97.83) — South Austin" },
  { id: 5408, to: 'North Austin', reason: 'Meridian Hive: 10001 Metric Blvd 78758 + coords (30.38,-97.72) — North Austin' },
  { id: 5577, to: 'Zilker',       reason: 'Juliet Italian: 1500 Barton Springs Rd 78704 + coords (30.26,-97.76) — Zilker' },
];

const COORD_BUGS = [
  { id: 5015, name: "Torchy's Tacos (S 1st)", issue: "1311 S 1st St 78704 — coords 30.17,-97.78 are far south at William Cannon, should be ~30.245,-97.756" },
  { id: 5136, name: 'Dee Dee',                issue: '4200 E MLK Blvd 78721 — coords 30.22,-97.83 are far SW, should be ~30.28,-97.70' },
  { id: 5140, name: 'Salt Traders',           issue: 'Esperanza Crossing 78758 (Domain) — coords 30.27,-97.78 are Barton Creek, should be ~30.40,-97.72' },
  { id: 5245, name: 'Pho Please',             issue: '10901 N Lamar 78753 — coords 30.24,-97.73 are central, should be ~30.39,-97.70' },
  { id: 5271, name: 'Ramen Del Barrio',       issue: '7858 Shoal Creek Blvd 78757 — coords 30.17,-97.79 are far south, should be ~30.35,-97.74' },
  { id: 5313, name: 'Oink BBQ',               issue: '1620 E 6th St 78702 — coords 30.15,-97.79 are far SW, should be ~30.26,-97.72' },
  { id: 5315, name: 'Easy Tiger',             issue: '1501 E 7th St 78702 — coords 30.24,-97.79 are west of E 7th, should be ~30.26,-97.72' },
  { id: 5326, name: "Austin's Pizza",         issue: '3638 S Lamar 78704 — coords 30.21,-97.83 are Oak Hill, should be ~30.24,-97.79' },
  { id: 5334, name: 'Austin Java',            issue: '1608 Barton Springs Rd 78704 — coords 30.22,-97.80 are south, should be ~30.262,-97.768' },
  { id: 5352, name: 'Rosedale Kitchen',       issue: '5765 Airport Blvd 78752 — coords 30.20,-97.67 are SE, should be ~30.32,-97.71' },
  { id: 5366, name: 'Uchi ko North',          issue: 'Name says "North" but address 9600 S I-35 is South Austin — card data is internally inconsistent' },
];

const NO_BUCKET = [
  { id: 5019, name: 'Salt Lick BBQ (Driftwood)',       town: 'Driftwood' },
  { id: 5033, name: 'InterStellar BBQ',                town: '78750 / Four Points / Anderson Mill' },
  { id: 5064, name: 'Jester King Brewery',             town: 'Dripping Springs area (78736)' },
  { id: 5092, name: 'Pieous',                          town: '78737 / Dripping Springs' },
  { id: 5161, name: 'Oasis on the Lake',               town: '78732 / Lake Travis' },
  { id: 5189, name: "Jack Allen's Kitchen",            town: '78735 / Oak Hill' },
  { id: 5220, name: 'Uchi Round Rock',                 town: 'Round Rock' },
  { id: 5222, name: "Tucci's Italian",                 town: 'Cedar Park' },
  { id: 5224, name: 'The Hideaway on Lake Travis',     town: 'Point Venture' },
  { id: 5307, name: 'Trattoria Lisina',                town: 'Driftwood' },
  { id: 5341, name: 'Loro Bee Caves',                  town: 'Bee Cave' },
  { id: 5411, name: 'Whip My Soul',                    town: '78726 / Four Points' },
  { id: 5422, name: 'Loro Round Rock',                 town: 'Round Rock' },
  { id: 5446, name: 'Loro Cedar Park',                 town: 'Cedar Park' },
  { id: 5455, name: 'Loro Georgetown',                 town: 'Georgetown' },
  { id: 5566, name: "Jim's Smokehouse",                town: '78732 / Lake Travis' },
];

function findCityRange(html) {
  const patterns = ['const AUSTIN_DATA=[', 'const AUSTIN_DATA =['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('AUSTIN_DATA not found');
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
    if (!slice) { skipped.push({ ...fix, why: 'not found in AUSTIN_DATA' }); continue; }
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
  console.log('Austin neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('');
  console.log('COORD BUGS (need verified coords from user): ' + COORD_BUGS.length);
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name + ' — ' + b.issue);
  console.log('');
  console.log('NO BUCKET (outer metro towns): ' + NO_BUCKET.length);
  for (const n of NO_BUCKET) console.log('  #' + n.id + '  ' + n.name + ' — ' + n.town);
  fs.writeFileSync(
    path.join(__dirname, 'austin-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS, no_bucket: NO_BUCKET }, null, 2)
  );
}

run();

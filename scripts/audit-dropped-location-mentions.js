// For each of the 35 merged entries I rewrote, compare the OLD description
// (from scripts/description-update-report.json) against the entry's
// locations[] array. Any neighborhood/city named in the old description that
// does NOT appear in locations[] is a factual claim my rewrite may have
// dropped — flag it for review (possibly add to locations[] if real, or
// restore to the new description).

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const report = JSON.parse(fs.readFileSync('scripts/description-update-report.json', 'utf8'));

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
  }
  return -1;
}

function parseArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  const src = html.substring(arrS, arrE);
  try { return JSON.parse(src); } catch { return new Function('return ' + src)(); }
}

const cities = {
  'Dallas': 'const DALLAS_DATA','Houston': 'const HOUSTON_DATA','Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA','Salt Lake City': 'const SLC_DATA','Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA','New York': 'const NYC_DATA',
};

const allData = {};
Object.entries(cities).forEach(([c,v]) => { allData[c] = parseArray(v); });

// Known neighborhood/sub-city names for each city (from the data itself).
// We'll collect all neighborhoods per city + all city names and treat those
// as location-words to watch.
const nbhdsByCity = {};
Object.entries(allData).forEach(([c, data]) => {
  const set = new Set();
  data.forEach(r => { if (r.neighborhood) set.add(String(r.neighborhood).trim()); });
  nbhdsByCity[c] = set;
});

// Also collect common city/ski-town mentions that might appear in descriptions
const KNOWN_ZONES = [
  // Utah zones that aren't neighborhoods in our SLC_DATA but are commonly referenced
  'Park City','Provo','Ogden','Sandy','Herriman','Holladay','Draper','Sugar House','Cottonwood Heights','South Jordan','West Valley','Marmalade',
  // Texas suburbs
  'Pearland','Katy','The Woodlands','Galleria','Memorial','Rice Village','Rockwall','Addison','Plano','Frisco',
  // Seattle metro
  'Bellevue','Redmond','Ballard','Capitol Hill','Belltown','Fremont','South Lake Union','West Seattle','University District','Pike Place','Chinatown-International District','Chinatown',
  // Austin zones
  'East Austin','South Lamar','North Lamar','Mueller','Domain','Rainey Street','South Congress','North Austin','Downtown Austin',
  // NYC/other common
  'Brooklyn','Manhattan','Queens','Williamsburg','Midtown','Downtown','Chinatown',
];

function extractMentionedZones(text, city) {
  const lower = (text || '').toLowerCase();
  const hits = new Set();
  KNOWN_ZONES.forEach(z => {
    const esc = z.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp('\\b' + esc + '\\b', 'i').test(lower)) hits.add(z);
  });
  (nbhdsByCity[city] || []).forEach(n => {
    const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp('\\b' + esc + '\\b', 'i').test(lower)) hits.add(n);
  });
  return [...hits];
}

function normalizeZone(z) {
  return String(z || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

const problems = [];

report.applied.forEach(entry => {
  const { city, id, old, next } = entry;
  const arr = allData[city] || [];
  const r = arr.find(x => x.id === id);
  if (!r) return;
  const locs = Array.isArray(r.locations) ? r.locations : [];
  const locZones = new Set(
    locs.flatMap(l => [l.neighborhood, l.name]).filter(Boolean).map(normalizeZone)
  );
  if (r.neighborhood) locZones.add(normalizeZone(r.neighborhood));

  const oldMentions = extractMentionedZones(old, city);
  const newMentions = extractMentionedZones(next, city);

  // A dropped mention: zone mentioned in OLD, not in locations[], and not in NEW.
  // We care about zones that were real callouts in the old copy.
  const dropped = oldMentions.filter(z => {
    const nz = normalizeZone(z);
    if (locZones.has(nz)) return false; // already covered in locations[]
    if (newMentions.map(normalizeZone).includes(nz)) return false; // still in new desc
    return true;
  });

  if (dropped.length) {
    problems.push({
      city, id, name: r.name,
      locationsArr: locs.map(l => l.neighborhood || l.name),
      dropped,
      oldFragment: (old.match(new RegExp('[^.]*\\b(' + dropped.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b[^.]*\\.', 'i')) || ['<snip>'])[0],
      newDesc: next,
    });
  }
});

fs.writeFileSync('scripts/dropped-mentions-audit.json', JSON.stringify(problems, null, 2));

console.log(`=== DROPPED LOCATION MENTIONS: ${problems.length} entries to review ===\n`);
problems.forEach(p => {
  console.log(`${p.city}#${p.id} "${p.name}"`);
  console.log(`  locations[]: ${p.locationsArr.join(' | ')}`);
  console.log(`  dropped: ${p.dropped.join(', ')}`);
  console.log(`  old said: "${p.oldFragment.trim()}"`);
  console.log(`  new says: "${p.newDesc}"`);
  console.log('');
});

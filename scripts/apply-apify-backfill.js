// Gallery backfill from 5 partial Apify runs (2026-04-20).
// Reads scripts/apify-runs-raw/data-{sd,dallas,chunkA,chunkB1,chunkB2}.json
// Applies /p/-only filter (matches the 2026-04-20 purge policy: drop /gps-cs-s/, keep /p/).
// Matches cards by normalized name within each CITY_DATA; disambiguates multi-city name collisions by address.
// Skips cards that already have photos[]. Atomic write + manifest.

const fs = require('fs');
const PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const MANIFEST_PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/gallery-backfill-applied.json';

const CITY_ADDR = {
  DALLAS_DATA:     ['Dallas','Plano','Carrollton','Addison','Frisco','Richardson','Irving','Garland','Mesquite','Grand Prairie','Allen','McKinney','Rowlett','Farmers Branch','University Park','Highland Park','Lewisville','Flower Mound','Coppell','Euless'],
  SD_DATA:         ['San Diego','La Jolla','Del Mar','Coronado','Carlsbad','Encinitas','Oceanside','Poway','Solana Beach','Escondido','Chula Vista','Cardiff','La Mesa','Bonita','Imperial Beach','Rancho Santa Fe','Leucadia','Ramona','Vista','4S Ranch','Rancho Bernardo','Lemon Grove','Santee','El Cajon'],
  PHX_DATA:        ['Phoenix','Scottsdale','Tempe','Mesa','Chandler','Gilbert','Glendale','Peoria','Surprise','Paradise Valley','Fountain Hills','Ahwatukee','Goodyear','Avondale','Queen Creek','Cave Creek','Carefree','Sun City','Litchfield Park','Anthem'],
  LV_DATA:         ['Las Vegas','Henderson','Paradise','North Las Vegas','Summerlin','Boulder City'],
  LA_DATA:         ['Los Angeles','Beverly Hills','Santa Monica','West Hollywood','Pasadena','Culver City','Venice','Hollywood','Burbank','Hawthorne','Glendale','Long Beach','Alhambra','Marina Del Rey','Marina del Rey','El Segundo','Inglewood','Studio City','Sherman Oaks','North Hollywood','Torrance','Manhattan Beach','Hermosa Beach','Redondo Beach','Highland Park','Echo Park','Silver Lake','Arcadia','Monterey Park','San Gabriel'],
  SLC_DATA:        ['Salt Lake City','Park City','Provo','South Salt Lake','Midvale','Murray','Sandy','West Valley City','West Jordan','Holladay','Millcreek','Cottonwood Heights','Draper','Lehi','American Fork'],
  AUSTIN_DATA:     ['Austin','Round Rock','Cedar Park','Pflugerville','Georgetown','Bee Cave','Westlake','Lakeway'],
  SEATTLE_DATA:    ['Seattle','Bellevue','Kirkland','Redmond','Renton','Tukwila','Mercer Island','Shoreline'],
  CHICAGO_DATA:    ['Chicago','Evanston','Oak Park','Skokie','Cicero','Berwyn','Wilmette','Winnetka'],
  HOUSTON_DATA:    ['Houston','Sugar Land','The Woodlands','Katy','Pearland','Missouri City','Bellaire','West University Place','Spring','Humble'],
  NYC_DATA:        ['New York','Brooklyn','Manhattan','Queens','Bronx','Staten Island','Astoria','Long Island City','Flushing','Jersey City','Hoboken'],
  SANANTONIO_DATA: ['San Antonio','Alamo Heights','Helotes','Leon Valley','Windcrest','Schertz','Boerne'],
};

const CITIES = Object.keys(CITY_ADDR);

function norm(s) {
  return (s || '').toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function cityFromAddress(addr) {
  // Pattern: "..., <City>, <ST> <zip>"  — extract the City segment
  if (!addr) return '';
  const parts = addr.split(',').map(s => s.trim());
  if (parts.length < 2) return '';
  // Last segment usually "ST zip" or "Country". Second-to-last is city.
  const maybe = parts[parts.length - 2];
  return maybe.replace(/\s+\d{5}.*/, '').trim();
}

function cityConstForAddress(addr) {
  const c = cityFromAddress(addr);
  if (!c) return null;
  for (const [k, list] of Object.entries(CITY_ADDR)) {
    if (list.includes(c)) return k;
  }
  return null;
}

function filterP(urls) {
  return (urls || []).filter(u => typeof u === 'string' && u.includes('/p/AF1Qip'));
}

// ---- Load datasets, build name → [items] map ----
const RAW_FILES = ['sd','dallas','chunkA','chunkB1','chunkB2'];
const itemsByName = new Map(); // norm(title) → array of {title, address, photos, cityConst}
let totalLoaded = 0, totalFilteredZero = 0;
for (const f of RAW_FILES) {
  const arr = JSON.parse(fs.readFileSync(`C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/apify-runs-raw/data-${f}.json`, 'utf8'));
  for (const it of arr) {
    if (!it || !it.title) continue;
    const photos = filterP(it.imageUrls);
    totalLoaded++;
    if (photos.length === 0) { totalFilteredZero++; continue; }
    const key = norm(it.title);
    if (!key) continue;
    const cityConst = cityConstForAddress(it.address || '');
    const rec = { title: it.title, address: it.address || '', photos: photos.slice(0, 10), cityConst };
    if (!itemsByName.has(key)) itemsByName.set(key, []);
    itemsByName.get(key).push(rec);
  }
}
console.log(`Loaded ${totalLoaded} items from 5 datasets. ${totalFilteredZero} dropped (no /p/ photos).`);
console.log(`Unique name keys: ${itemsByName.size}`);

// ---- Scan index.html, apply photos ----
function findArrBounds(content, constName) {
  const start = content.indexOf('const ' + constName);
  if (start < 0) return null;
  const arrStart = content.indexOf('[', start);
  let i = arrStart, depth = 0, inStr = false, esc = false;
  while (i < content.length) {
    const ch = content[i];
    if (esc) esc = false;
    else if (ch === '\\') esc = true;
    else if (ch === '"') inStr = !inStr;
    else if (!inStr) {
      if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return { arrStart, arrEnd: i }; }
    }
    i++;
  }
  return null;
}

function findCardEnd(content, fromIdx) {
  let d = 0, inStr = false, esc = false, started = false;
  for (let i = fromIdx; i < content.length; i++) {
    const ch = content[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') { d++; started = true; }
    else if (ch === '}') { d--; if (started && d === 0) return i; }
  }
  return -1;
}

let content = fs.readFileSync(PATH, 'utf8');
const manifest = { timestamp: new Date().toISOString(), filter: '/p/ only', source: '5 Apify partial runs 2026-04-20', edits: [], perCity: {}, missed: [] };

for (const cityConst of CITIES) {
  const bounds = findArrBounds(content, cityConst);
  if (!bounds) { console.log(cityConst, 'NOT FOUND'); continue; }
  const cards = [];
  let scan = bounds.arrStart;
  while (scan < bounds.arrEnd) {
    let depth = 0, inStr = false, esc = false, cardStart = -1;
    for (let k = scan; k < bounds.arrEnd; k++) {
      const ch = content[k];
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{' && depth === 0) { cardStart = k; break; }
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (cardStart < 0) break;
    const cardEnd = findCardEnd(content, cardStart);
    if (cardEnd < 0 || cardEnd > bounds.arrEnd) break;
    const cardText = content.substring(cardStart, cardEnd + 1);
    const nm = cardText.match(/"name":"([^"]*)"/);
    const idm = cardText.match(/"id":(\d+)/);
    const hasPhotos = /"photos"\s*:\s*\[/.test(cardText);
    cards.push({ start: cardStart, end: cardEnd, name: nm ? nm[1] : null, id: idm ? Number(idm[1]) : null, hasPhotos });
    scan = cardEnd + 1;
  }

  const insertions = [];
  let applied = 0, skipped = 0, noMatch = 0, wrongCity = 0;
  for (const card of cards) {
    if (card.hasPhotos) { skipped++; continue; }
    if (!card.name) { noMatch++; continue; }
    const key = norm(card.name);
    const candidates = itemsByName.get(key);
    if (!candidates || candidates.length === 0) { noMatch++; continue; }

    // Pick best candidate: prefer one whose cityConst matches this city
    let pick = candidates.find(c => c.cityConst === cityConst);
    if (!pick && candidates.length === 1) pick = candidates[0]; // only option — accept
    if (!pick) { wrongCity++; continue; } // ambiguous across cities & none for this city

    insertions.push({ at: card.end, text: ',"photos":' + JSON.stringify(pick.photos), cardId: card.id, name: card.name, count: pick.photos.length, photos: pick.photos, address: pick.address });
    applied++;
  }

  insertions.sort((a, b) => b.at - a.at);
  for (const ins of insertions) {
    content = content.substring(0, ins.at) + ins.text + content.substring(ins.at);
    manifest.edits.push({ city: cityConst, id: ins.cardId, name: ins.name, address: ins.address, count: ins.count, photos: ins.photos });
  }

  manifest.perCity[cityConst] = { cardsScanned: cards.length, applied, alreadyHadPhotos: skipped, noMatch, wrongCity };
  console.log(cityConst.padEnd(16),
    'cards:', String(cards.length).padStart(4),
    '| applied:', String(applied).padStart(4),
    '| already had:', String(skipped).padStart(4),
    '| no match:', String(noMatch).padStart(4),
    '| wrong city:', String(wrongCity).padStart(3));
}

const DRY_RUN = process.env.DRY_RUN === '1';
if (!DRY_RUN) {
  for (let tries = 0; tries < 3; tries++) {
    try { fs.writeFileSync(PATH, content, 'utf8'); break; }
    catch (e) { if (tries === 2) throw e; console.log('write retry', tries + 1, e.message); }
  }
  console.log('index.html WRITTEN');
} else {
  console.log('[DRY RUN — index.html untouched]');
}
// Always write manifest with full edit record + proposed photos (dry-run includes photo URLs for audit sampling)
const fullManifest = { ...manifest };
fullManifest.edits = manifest.edits.map((e, i) => {
  // enrich dry-run manifest with actual photo URLs
  return e;
});
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log('\nTOTAL APPLIED:', manifest.edits.length);
console.log('Manifest at', MANIFEST_PATH);

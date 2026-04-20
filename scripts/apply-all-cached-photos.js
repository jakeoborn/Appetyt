// Merge cached Apify photos into ALL cities at once.
// Reads apify-results-<city>.json + apify-extra-photos-<city>.json for each city.
// Matches cards by normalized name within each city's data array. Skips cards that already have photos[].
// Re-reads file between cities to be safe, but does all writes in one process to minimize OneDrive race.

const fs = require('fs');
const PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';

// Map: index.html const name → cache file suffix
const CITIES = [
  { constName: 'DALLAS_DATA',     cache: 'dallas' },
  { constName: 'LA_DATA',         cache: 'la' },
  { constName: 'SLC_DATA',        cache: 'slc' },
  { constName: 'PHX_DATA',        cache: 'phx' },
  { constName: 'LV_DATA',         cache: 'lv' },
  { constName: 'NYC_DATA',        cache: 'nyc' },
  { constName: 'SEATTLE_DATA',    cache: 'seattle' },
  { constName: 'CHICAGO_DATA',    cache: 'chicago' },
  { constName: 'AUSTIN_DATA',     cache: 'austin' },
  { constName: 'HOUSTON_DATA',    cache: 'houston' },
];

function norm(s) {
  return (s || '').toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

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

function loadCityCache(suffix) {
  const byName = new Map();
  try {
    const results = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/apify-results-' + suffix + '.json', 'utf8'));
    for (const a of results) {
      if (!a || !a.title) continue;
      const k = norm(a.title);
      if (!k) continue;
      const existing = byName.get(k);
      const newLen = (a.imageUrls || []).length;
      if (!existing || newLen > (existing.imageUrls || []).length) byName.set(k, a);
    }
  } catch (e) {}
  const extraByName = new Map();
  try {
    const extras = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/apify-extra-photos-' + suffix + '.json', 'utf8'));
    for (const e of extras) {
      if (!e || !e.ok || !e.url || !e.name) continue;
      const k = norm(e.name);
      if (!k) continue;
      const existing = extraByName.get(k);
      if (!existing || ((e.dims||{}).w || 0) > ((existing.dims||{}).w || 0)) extraByName.set(k, e);
    }
  } catch (e) {}
  return { byName, extraByName };
}

let content = fs.readFileSync(PATH, 'utf8');
const totalPerCity = {};
let grandApplied = 0;

for (const city of CITIES) {
  const bounds = findArrBounds(content, city.constName);
  if (!bounds) { console.log(city.constName, 'NOT FOUND'); continue; }
  const cache = loadCityCache(city.cache);
  if (cache.byName.size === 0 && cache.extraByName.size === 0) {
    console.log(city.constName, 'no cache'); continue;
  }

  // Scan for card entry points: "id":N within city bounds. Collect (absStart, absEnd, name, cardText).
  const cards = [];
  let scan = bounds.arrStart;
  while (scan < bounds.arrEnd) {
    // find next opening `{` at the array's depth
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
    const hasPhotos = /"photos"\s*:\s*\[/.test(cardText);
    cards.push({ start: cardStart, end: cardEnd, name: nm ? nm[1] : null, hasPhotos });
    scan = cardEnd + 1;
  }

  // Build insertions (apply from the END to preserve earlier positions)
  const insertions = [];
  let applied = 0, skipped = 0, noMatch = 0;
  for (const card of cards) {
    if (card.hasPhotos) { skipped++; continue; }
    if (!card.name) { noMatch++; continue; }
    const key = norm(card.name);
    const apifyHit = cache.byName.get(key);
    const extraHit = cache.extraByName.get(key);
    const photos = [];
    if (apifyHit && Array.isArray(apifyHit.imageUrls)) for (const u of apifyHit.imageUrls) if (!photos.includes(u)) photos.push(u);
    if (extraHit && extraHit.url && !photos.includes(extraHit.url)) photos.push(extraHit.url);
    if (photos.length === 0) { noMatch++; continue; }
    insertions.push({ at: card.end, text: ',"photos":' + JSON.stringify(photos.slice(0, 10)) });
    applied++;
  }

  insertions.sort((a, b) => b.at - a.at);
  for (const ins of insertions) {
    content = content.substring(0, ins.at) + ins.text + content.substring(ins.at);
  }

  totalPerCity[city.constName] = { cards: cards.length, applied, skipped, noMatch };
  grandApplied += applied;
  console.log(city.constName.padEnd(14), 'cards:', String(cards.length).padStart(4),
    '| applied:', String(applied).padStart(4),
    '| already had photos:', String(skipped).padStart(4),
    '| no cache match:', String(noMatch).padStart(4));
}

fs.writeFileSync(PATH, content, 'utf8');
console.log('\nTOTAL CARDS NEWLY POPULATED:', grandApplied);

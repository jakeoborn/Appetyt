// Build a merge plan: for each Dallas card, find photos from cached Apify data
// by matching on name. Produces dallas-photo-plan.json.
// Uses ONLY existing cached data — zero new API spend.

const fs = require('fs');

const indexHtml = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');
const apifyResults = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/apify-results-dallas.json', 'utf8'));
const extraPhotos = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/apify-extra-photos-dallas.json', 'utf8'));

// Normalize name for matching
function norm(s) {
  return (s || '').toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Index cached data by normalized name
const apifyByName = new Map();
for (const a of apifyResults) {
  const key = norm(a.title);
  if (!key) continue;
  if (!apifyByName.has(key) || (a.imageUrls && a.imageUrls.length > (apifyByName.get(key).imageUrls||[]).length)) {
    apifyByName.set(key, a);
  }
}
const extraByName = new Map();
for (const e of extraPhotos) {
  const key = norm(e.name);
  if (!key) continue;
  if (e.ok && e.url) {
    const prev = extraByName.get(key);
    if (!prev || (e.dims && e.dims.w > (prev.dims||{}).w)) extraByName.set(key, e);
  }
}

console.log('Apify-results entries (by name):', apifyByName.size);
console.log('Extra-photos entries (by name):', extraByName.size);

// Extract Dallas cards
const start = indexHtml.indexOf('const DALLAS_DATA');
const arrStart = indexHtml.indexOf('[', start);
let i = arrStart, depth = 0, inStr = false, esc = false, arrEnd = -1;
while (i < indexHtml.length) {
  const ch = indexHtml[i];
  if (esc) esc = false;
  else if (ch === '\\') esc = true;
  else if (ch === '"') inStr = !inStr;
  else if (!inStr) {
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
  }
  i++;
}
const dallasText = indexHtml.substring(arrStart, arrEnd + 1);

// Iterate top-level card objects
const cards = [];
let j = 1, dj = 0, js = -1, jnStr = false, jesc = false;
while (j < dallasText.length - 1) {
  const ch = dallasText[j];
  if (jesc) jesc = false;
  else if (ch === '\\') jesc = true;
  else if (ch === '"') jnStr = !jnStr;
  else if (!jnStr) {
    if (ch === '{') { if (dj === 0) js = j; dj++; }
    else if (ch === '}') { dj--; if (dj === 0) { cards.push({text: dallasText.substring(js, j+1), absStart: arrStart + js, absEnd: arrStart + j}); js = -1; } }
  }
  j++;
}

// For each card, find photos from cache
const plan = [];
let matched = 0, unmatched = 0;
for (const card of cards) {
  const nameMatch = card.text.match(/"name":"([^"]*)"/);
  const idMatch = card.text.match(/"id":(\d+)/);
  if (!nameMatch) continue;
  const name = nameMatch[1];
  const id = idMatch ? parseInt(idMatch[1]) : null;
  const key = norm(name);
  const apifyHit = apifyByName.get(key);
  const extraHit = extraByName.get(key);

  const photos = [];
  if (apifyHit && Array.isArray(apifyHit.imageUrls) && apifyHit.imageUrls.length) {
    for (const u of apifyHit.imageUrls) photos.push(u);
  }
  if (extraHit && extraHit.url && !photos.includes(extraHit.url)) {
    photos.push(extraHit.url);
  }
  if (photos.length === 0) { unmatched++; continue; }
  matched++;
  plan.push({
    id,
    name,
    cardAbsStart: card.absStart,
    cardAbsEnd: card.absEnd,
    photos: photos.slice(0, 10), // cap at 10
    sources: {
      apify: !!apifyHit,
      extra: !!extraHit,
    },
  });
}

console.log();
console.log('Dallas cards:', cards.length);
console.log('Matched (have photos from cache):', matched);
console.log('Unmatched (no cache hit):', unmatched);
console.log();
console.log('Sample matches:');
for (const p of plan.slice(0, 10)) {
  console.log(' ', p.name, '→', p.photos.length, 'photos', '[apify:'+p.sources.apify+' extra:'+p.sources.extra+']');
}

fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/dallas-photo-plan.json', JSON.stringify(plan, null, 2));
console.log('\nWrote scripts/dallas-photo-plan.json (', plan.length, 'cards )');

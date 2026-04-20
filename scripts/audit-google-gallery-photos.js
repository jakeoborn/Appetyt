// Audit all restaurant cards for the "Mamani pattern":
// - photoUrl is PROFESSIONAL (restaurant site / Sanity / Squarespace / og:image)
// - photos[] is ENTIRELY /gps-cs-s/ Google curated user photos (our lowest tier)
//
// Also flag sub-patterns:
// - photos[] is a MIX — has /p/ owner photos we should keep, plus /gps-cs-s/ we should drop
// - photoUrl itself is /gps-cs-s/ (the hero is user-submitted) — separate bucket
//
// Output: scripts/google-gallery-audit.json with per-city breakdowns.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

// Extract every card via balanced-brace parsing. Each city array starts with
// `const NAME_DATA=[` — from there we walk the array and collect each top-level
// object (cards) using brace/bracket/string-aware scanning. Handles nested
// `locations:[{...}]` and other nested structures the naive regex trips on.
function extractCards(html) {
  const results = []; // { name, startIdx, json }
  const arrStart = /const ([A-Z_]+_DATA)\s*=\s*\[/g;
  let am;
  while ((am = arrStart.exec(html))) {
    const cityVar = am[1];
    let i = am.index + am[0].length; // just after `[`
    let depth = 1; // inside the outer array
    while (i < html.length && depth > 0) {
      // skip whitespace
      while (i < html.length && /\s/.test(html[i])) i++;
      if (i >= html.length) break;
      const ch = html[i];
      if (ch === ']' && depth === 1) { i++; depth = 0; break; }
      if (ch === ',') { i++; continue; }
      if (ch !== '{') { i++; continue; } // defensive
      // walk a balanced object
      const objStart = i;
      let b = 0;
      let inStr = false, esc = false;
      while (i < html.length) {
        const c = html[i];
        if (inStr) {
          if (esc) esc = false;
          else if (c === '\\') esc = true;
          else if (c === '"') inStr = false;
        } else {
          if (c === '"') inStr = true;
          else if (c === '{') b++;
          else if (c === '}') { b--; if (b === 0) { i++; break; } }
        }
        i++;
      }
      const objText = html.slice(objStart, i);
      results.push({ cityVar, startIdx: objStart, json: objText });
    }
  }
  return results;
}

const classify = (url) => {
  if (!url) return 'empty';
  if (url.indexOf('/gps-cs-s/') > -1) return 'gps-cs-s';           // Google curated user photo (lowest tier)
  if (url.indexOf('googleusercontent.com/p/') > -1) return 'p-owner'; // Google owner-uploaded
  if (url.indexOf('googleusercontent.com/') > -1) return 'google-other';
  if (url.indexOf('cdn.sanity.io') > -1) return 'sanity';
  if (url.indexOf('images.squarespace-cdn.com') > -1) return 'squarespace';
  if (url.indexOf('wixstatic.com') > -1) return 'wixstatic';
  if (url.indexOf('cloudinary.com') > -1) return 'cloudinary';
  if (url.indexOf('shopify.com') > -1) return 'shopify';
  if (/\b(instagram|facebook|tiktok|twitter|x\.com)\b/.test(url)) return 'social';
  return 'pro-cdn'; // treat any other non-google host as pro-CDN (restaurant site / PR CDN)
};
const isPro = (c) => c === 'sanity' || c === 'squarespace' || c === 'wixstatic' || c === 'cloudinary' || c === 'shopify' || c === 'pro-cdn';

const findings = {
  mamaniPattern: [],      // photoUrl pro, all photos[] are /gps-cs-s/ → clear photos[]
  mixedGallery: [],       // photos[] has both /p/ owner + /gps-cs-s/ → drop /gps-cs-s/ only
  allUserPhotos: [],      // photoUrl /gps-cs-s/ AND photos[] all /gps-cs-s/ → no pro source anywhere, flag
  partialUser: [],        // photoUrl pro, photos[] mixed but has some /p/ owner — keep gallery, just note
};

const cards = extractCards(html);
let scanned = 0;
let withPhotos = 0;
let parseFail = 0;

for (const card of cards) {
  scanned++;
  let obj;
  try { obj = JSON.parse(card.json); } catch (e) { parseFail++; continue; }
  if (!Array.isArray(obj.photos) || !obj.photos.length) continue;
  withPhotos++;

  const cls = obj.photos.map(classify);
  const heroCls = classify(obj.photoUrl || '');
  const allGps = cls.every(c => c === 'gps-cs-s');
  const anyGps = cls.some(c => c === 'gps-cs-s');
  const anyPOwner = cls.some(c => c === 'p-owner');
  const heroPro = isPro(heroCls);
  const heroGps = heroCls === 'gps-cs-s';

  const short = { id: obj.id, name: obj.name, city: card.cityVar, heroCls, photoCount: obj.photos.length, cls };

  if (heroPro && allGps) {
    findings.mamaniPattern.push(short);
  } else if (heroPro && anyGps && anyPOwner) {
    findings.mixedGallery.push({ ...short, gpsToRemove: cls.filter(c => c === 'gps-cs-s').length, ownerToKeep: cls.filter(c => c === 'p-owner').length });
  } else if (heroGps && allGps) {
    findings.allUserPhotos.push(short);
  } else if (heroPro && anyGps && !anyPOwner) {
    // heroPro + photos[] has /gps-cs-s/ AND other stuff like google-other / unknown
    findings.partialUser.push(short);
  }
}

const summary = {
  scanned,
  withPhotos,
  parseFail,
  mamaniPatternCount: findings.mamaniPattern.length,
  mixedGalleryCount: findings.mixedGallery.length,
  allUserPhotosCount: findings.allUserPhotos.length,
  partialUserCount: findings.partialUser.length,
};

fs.writeFileSync('scripts/google-gallery-audit.json', JSON.stringify({ summary, findings }, null, 2));

console.log('=== SCAN SUMMARY ===');
console.log(summary);
console.log('');
console.log('=== MAMANI PATTERN (pro hero + all-user-photos gallery — safe to clear) ===');
console.log('Count:', findings.mamaniPattern.length);
findings.mamaniPattern.slice(0, 40).forEach(r => console.log('  ', r.city, '#' + r.id, r.name, '(' + r.photoCount, 'photos to clear)'));
if (findings.mamaniPattern.length > 40) console.log('  ...and', findings.mamaniPattern.length - 40, 'more');
console.log('');
console.log('=== MIXED GALLERY (pro hero + owner /p/ photos kept + /gps-cs-s/ removed) ===');
console.log('Count:', findings.mixedGallery.length);
findings.mixedGallery.slice(0, 20).forEach(r => console.log('  ', r.city, '#' + r.id, r.name, '(keep', r.ownerToKeep, 'owner, drop', r.gpsToRemove, 'curated)'));
if (findings.mixedGallery.length > 20) console.log('  ...and', findings.mixedGallery.length - 20, 'more');
console.log('');
console.log('=== ALL-USER-PHOTOS (hero AND gallery all user-submitted — no pro source)  ===');
console.log('Count:', findings.allUserPhotos.length);
findings.allUserPhotos.slice(0, 20).forEach(r => console.log('  ', r.city, '#' + r.id, r.name, '(' + r.photoCount, 'photos)'));
if (findings.allUserPhotos.length > 20) console.log('  ...and', findings.allUserPhotos.length - 20, 'more');
console.log('');
console.log('Full report → scripts/google-gallery-audit.json');

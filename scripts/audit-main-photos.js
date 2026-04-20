const fs = require('fs');
const path = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const content = fs.readFileSync(path, 'utf8');

// Bad-photoUrl heuristics: logos, wordmarks, social-share images, bare CDN paths, known meta images
const BAD_FILENAME_PARTS = [
  'socialshare', 'social-share', 'social_share',
  'wordmark', 'word-mark',
  'og-image', 'og_image', 'ogimage',
  'meta-image', 'meta_image', 'metaimage',
  'matashare',               // sushi nakazawa S3 meta
  '_logo', '-logo', 'logo_', 'logo-', '/logo.', 'logomark',
  'open-graph', 'open_graph', 'opengraph',
  'facebook-image', 'fb-share',
  'twitter-card', 'twitter_card',
];

function isBadPhotoUrl(url) {
  if (!url) return { bad: true, reason: 'empty' };
  const lower = url.toLowerCase();

  // Empty Squarespace path (trailing slash with no filename)
  if (/squarespace\.com\/.*\/\d+\/?$/.test(lower) && !/\.(png|jpg|jpeg|webp|gif)/i.test(lower)) {
    return { bad: true, reason: 'empty-squarespace' };
  }

  for (const part of BAD_FILENAME_PARTS) {
    if (lower.includes(part)) return { bad: true, reason: 'filename-match:' + part };
  }

  // Squarespace + PNG + format=NNNNw is almost always a social-share export
  if (lower.includes('squarespace.com') && /\.png(\?|$)/.test(lower)) {
    return { bad: true, reason: 'squarespace-png' };
  }

  // Shopify/wixstatic/wordpress raw uploads that are typically logos (heuristic: contains "logo")
  if (lower.includes('logo') && /\.(png|svg)(\?|$)/.test(lower)) {
    return { bad: true, reason: 'logo-file' };
  }

  return { bad: false };
}

function isGoodPhotoUrl(url) {
  if (!url) return false;
  // Google Maps-hosted photos are the gold standard
  return /lh3\.googleusercontent\.com\/(p\/AF1Q|gps-cs-s\/|gps-proxy\/)/.test(url);
}

function extractPhotos(window) {
  const photoUrlMatch = window.match(/"photoUrl":"([^"]*)"/);
  const photoUrl = photoUrlMatch ? photoUrlMatch[1] : null;
  const photoUrlIdx = photoUrlMatch ? window.indexOf('"photoUrl":"') : -1;
  const photosIdx = window.indexOf('"photos":[');
  let photos = null;
  if (photosIdx !== -1) {
    const start = photosIdx + '"photos":['.length;
    let i = start, inStr = false, esc = false;
    while (i < window.length) {
      const c = window[i];
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = !inStr;
      else if (!inStr && c === ']') break;
      i++;
    }
    const arrStr = '[' + window.substring(start, i) + ']';
    try { photos = JSON.parse(arrStr); } catch (e) { photos = null; }
  }
  return { photoUrl, photos, photoUrlIdx, photosIdx };
}

// Ensure photoUrl and photos both belong to the SAME card by checking no
// intermediate `"name":"..."` of a new card appears between them.
function fieldsAreSameCard(window) {
  const photoUrlIdx = window.indexOf('"photoUrl"');
  const photosIdx = window.indexOf('"photos":[');
  if (photoUrlIdx < 0 || photosIdx < 0) return false;
  const first = Math.min(photoUrlIdx, photosIdx);
  const last = Math.max(photoUrlIdx, photosIdx);
  // Another `"name":"..."` between them means we crossed into the next card
  const between = window.substring(first + 20, last);
  if (/"name":"[^"]+"/.test(between)) return false;
  // Also guard: the card object must terminate (we expect `}` after the last field, not too far)
  return true;
}

// Scan all cards: iterate "name":"..." followed (within 6KB) by "photoUrl":"..." AND "photos":[
const nameRe = /"name":"([^"\\]+)"/g;
const candidates = [];
let m;
while ((m = nameRe.exec(content)) !== null) {
  const win = content.substring(m.index, Math.min(content.length, m.index + 8000));
  // Require both photoUrl and photos to be within the window AND same card
  if (!win.includes('"photoUrl"') || !win.includes('"photos":[')) continue;
  if (!fieldsAreSameCard(win)) continue;
  const { photoUrl, photos, photoUrlIdx } = extractPhotos(win);
  if (!Array.isArray(photos) || photos.length < 2) continue;
  const bad = isBadPhotoUrl(photoUrl);
  if (!bad.bad) continue;
  // Find the first GOOD photo in photos[]
  const goodIdx = photos.findIndex(p => isGoodPhotoUrl(p));
  if (goodIdx < 0) continue;
  candidates.push({
    name: m[1],
    matchPos: m.index,
    currentUrl: photoUrl,
    reason: bad.reason,
    newUrl: photos[goodIdx],
    goodIdx,
    photosCount: photos.length,
  });
}

// Dedupe by (name + currentUrl) — same card can match multiple times; also different restaurants can share name
const seen = new Set();
const unique = [];
for (const c of candidates) {
  const key = c.name + '|' + c.currentUrl;
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(c);
}

console.log('BAD PHOTO CANDIDATES:', unique.length);
console.log();
// Group by reason
const byReason = {};
for (const c of unique) {
  byReason[c.reason] = (byReason[c.reason] || 0) + 1;
}
console.log('By reason:', byReason);
console.log();

// Save full report
const report = unique.map(c => ({
  name: c.name,
  reason: c.reason,
  currentUrl: c.currentUrl,
  newUrl: c.newUrl,
  goodPhotoIdx: c.goodIdx,
  photosCount: c.photosCount,
}));
fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/main-photo-audit.json', JSON.stringify(report, null, 2));
console.log('Wrote scripts/main-photo-audit.json');
console.log();
console.log('First 20:');
for (const c of unique.slice(0, 20)) {
  console.log('  [' + c.reason + '] ' + c.name);
  console.log('    old:', c.currentUrl.substring(0, 120));
  console.log('    new:', c.newUrl.substring(0, 120));
}

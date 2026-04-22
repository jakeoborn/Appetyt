// Apply approved photoUrl swaps to index.html.
// Scopes lookup to a specific city's *_DATA array to avoid id collisions across cities.
//
// Usage: node scripts/apply-photo-swaps.js <swaps-json-path>
// Swap file shape: [{ city, name, address, newPhotoUrl }]
const fs = require('fs');

const SWAPS_PATH = process.argv[2];
if (!SWAPS_PATH) { console.error('usage: apply-photo-swaps.js <swaps-json>'); process.exit(1); }
const swaps = JSON.parse(fs.readFileSync(SWAPS_PATH, 'utf8'));
const HTML_PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
let html = fs.readFileSync(HTML_PATH, 'utf8');

function findCityArrayBounds(htmlStr, cityKey) {
  const re = new RegExp('const\\s+' + cityKey + '_DATA\\s*=\\s*\\[', 'g');
  const m = re.exec(htmlStr);
  if (!m) return null;
  const start = htmlStr.indexOf('[', m.index + m[0].length - 1);
  let i = start, d = 0, inStr = false, esc = false;
  while (i < htmlStr.length) {
    const ch = htmlStr[i];
    if (esc) esc = false;
    else if (ch === '\\') esc = true;
    else if (ch === '"') inStr = !inStr;
    else if (!inStr) {
      if (ch === '[') d++;
      else if (ch === ']') { d--; if (d === 0) return { start, end: i }; }
    }
    i++;
  }
  return null;
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function swapInScope(htmlStr, scope, name, address, newUrl) {
  // Find the card object containing both name and address
  const region = htmlStr.substring(scope.start, scope.end);
  // Match the exact name as JSON-encoded
  const nameEsc = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const nameRe = new RegExp('"name":"' + escapeRegex(nameEsc) + '"', 'g');
  let m;
  const matches = [];
  while ((m = nameRe.exec(region)) !== null) matches.push(m.index);
  if (!matches.length) return { ok: false, reason: 'name-not-found' };

  // Walk each match, find the enclosing { ... } card, verify address present
  for (const idx of matches) {
    // Walk backward to find the opening '{'
    let i = idx, depth = 0;
    let inStr = false, esc = false;
    let openIdx = -1;
    // Walk forward first to find closing brace and verify
    let j = idx, dj = 1;
    // Backward search for opening
    let bi = idx;
    while (bi > 0) {
      const ch = region[bi];
      if (ch === '}') depth++;
      else if (ch === '{') { if (depth === 0) { openIdx = bi; break; } depth--; }
      bi--;
    }
    if (openIdx < 0) continue;
    // Forward search for matching close
    let fi = openIdx, fd = 0, fStr = false, fEsc = false;
    let closeIdx = -1;
    while (fi < region.length) {
      const ch = region[fi];
      if (fEsc) fEsc = false;
      else if (ch === '\\') fEsc = true;
      else if (ch === '"') fStr = !fStr;
      else if (!fStr) {
        if (ch === '{') fd++;
        else if (ch === '}') { fd--; if (fd === 0) { closeIdx = fi; break; } }
      }
      fi++;
    }
    if (closeIdx < 0) continue;
    const card = region.substring(openIdx, closeIdx + 1);
    // Verify address present (loose match — allow partial)
    if (address && !card.includes('"address":"' + address.split(',')[0])) {
      // Try matching just street part
    }
    // Replace photoUrl in this card only
    const purlRe = /"photoUrl":"([^"]*)"/;
    const pm = card.match(purlRe);
    if (!pm) return { ok: false, reason: 'no-photoUrl-field' };
    const newCard = card.replace(purlRe, '"photoUrl":"' + newUrl.replace(/"/g, '\\"') + '"');
    if (newCard === card) return { ok: false, reason: 'unchanged' };
    const absStart = scope.start + openIdx;
    const absEnd = scope.start + closeIdx + 1;
    const before = htmlStr.substring(0, absStart);
    const after = htmlStr.substring(absEnd);
    return { ok: true, htmlOut: before + newCard + after, oldUrl: pm[1] };
  }
  return { ok: false, reason: 'no-card-matched' };
}

// City key normalization (file uses NYC, LA, SD, SLC, LV, etc.)
const CITY_KEYS = {
  'NYC': 'NYC', 'LA': 'LA', 'SD': 'SD', 'SLC': 'SLC', 'LV': 'LV', 'PHX': 'PHX',
  'DALLAS': 'DALLAS', 'HOUSTON': 'HOUSTON', 'AUSTIN': 'AUSTIN', 'CHICAGO': 'CHICAGO',
  'SEATTLE': 'SEATTLE', 'MIAMI': 'MIAMI', 'CHARLOTTE': 'CHARLOTTE', 'SANANTONIO': 'SANANTONIO',
};

let applied = 0, failed = 0;
const log = [];
for (const swap of swaps) {
  const cityKey = CITY_KEYS[swap.city] || swap.city;
  const scope = findCityArrayBounds(html, cityKey);
  if (!scope) { log.push({ ...swap, status: 'fail', reason: 'city-array-not-found' }); failed++; continue; }
  const r = swapInScope(html, scope, swap.name, swap.address, swap.newPhotoUrl);
  if (!r.ok) { log.push({ ...swap, status: 'fail', reason: r.reason }); failed++; continue; }
  html = r.htmlOut;
  log.push({ city: swap.city, name: swap.name, status: 'ok', oldUrl: r.oldUrl, newUrl: swap.newPhotoUrl });
  applied++;
}

if (applied > 0) {
  fs.writeFileSync(HTML_PATH, html);
  console.log(`✓ wrote ${HTML_PATH}`);
}
console.log(`Applied: ${applied}, Failed: ${failed}`);
for (const e of log) {
  if (e.status === 'ok') {
    console.log(`  ✓ [${e.city}] ${e.name}`);
    console.log(`    - ${(e.oldUrl||'').substring(0, 100)}`);
    console.log(`    + ${(e.newUrl||'').substring(0, 100)}`);
  } else {
    console.log(`  ✗ [${e.city}] ${e.name}  reason=${e.reason}`);
  }
}

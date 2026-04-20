// Apply gallery purges identified in scripts/google-gallery-audit.json:
//   Bucket A (mamaniPattern): clear photos[] entirely.
//   Bucket B (mixedGallery):  drop /gps-cs-s/ entries, keep /p/ owner.
//
// Strategy: walk cards via balanced-brace (same as the audit), gather target
// edits, then apply from end→start so earlier offsets remain valid. Writes
// index.html once with OneDrive-sync retry.
const fs = require('fs');
const path = 'index.html';

function tryWrite(html, retries = 6) {
  for (let i = 0; i < retries; i++) {
    try { fs.writeFileSync(path, html, 'utf8'); return; }
    catch (e) {
      if (i === retries - 1) throw e;
      const until = Date.now() + 600;
      while (Date.now() < until) {}
    }
  }
}

const html = fs.readFileSync(path, 'utf8');
const audit = JSON.parse(fs.readFileSync('scripts/google-gallery-audit.json', 'utf8'));

// Build target id→action map, keyed by cityVar+id for robustness
const actions = {}; // `${cityVar}#${id}` → 'clear' | 'filter'
audit.findings.mamaniPattern.forEach(r => { actions[`${r.city}#${r.id}`] = 'clear'; });
audit.findings.mixedGallery.forEach(r => { actions[`${r.city}#${r.id}`] = 'filter'; });

console.log('Loaded', audit.findings.mamaniPattern.length, 'Bucket A targets,',
  audit.findings.mixedGallery.length, 'Bucket B targets.');

// Balanced-brace walk: collect each card's json + startIdx + cityVar
function extractCards(h) {
  const results = [];
  const arrStart = /const ([A-Z_]+_DATA)\s*=\s*\[/g;
  let am;
  while ((am = arrStart.exec(h))) {
    const cityVar = am[1];
    let i = am.index + am[0].length;
    let depth = 1;
    while (i < h.length && depth > 0) {
      while (i < h.length && /\s/.test(h[i])) i++;
      if (i >= h.length) break;
      const ch = h[i];
      if (ch === ']' && depth === 1) { i++; depth = 0; break; }
      if (ch === ',') { i++; continue; }
      if (ch !== '{') { i++; continue; }
      const objStart = i;
      let b = 0;
      let inStr = false, esc = false;
      while (i < h.length) {
        const c = h[i];
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
      results.push({ cityVar, startIdx: objStart, endIdx: i });
    }
  }
  return results;
}

const cards = extractCards(html);

// Collect edits as { from, to, replacement } for each target card's photos[] block
const edits = [];
let bucketACount = 0, bucketBCount = 0, skipped = 0;

for (const card of cards) {
  const slice = html.slice(card.startIdx, card.endIdx);
  // Parse minimal fields we need: id + photos array. Full parse is safer.
  let obj;
  try { obj = JSON.parse(slice); } catch (e) { continue; }
  const key = `${card.cityVar}#${obj.id}`;
  const action = actions[key];
  if (!action) continue;
  if (!Array.isArray(obj.photos) || !obj.photos.length) { skipped++; continue; }

  // Locate the photos:[...] span inside the card slice so we can splice into html
  const photosStart = slice.indexOf('"photos":[');
  if (photosStart < 0) { skipped++; continue; }
  const arrOpen = photosStart + '"photos":['.length;
  // find matching closing ] — photos[] entries are strings so a naive depth scan is fine
  let p = arrOpen, depth = 1, inStr = false, esc = false;
  while (p < slice.length && depth > 0) {
    const c = slice[p];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true;
      else if (c === '[') depth++;
      else if (c === ']') depth--;
    }
    p++;
  }
  // p now points one past the closing `]`
  const arrCloseIdx = p - 1; // index of `]`
  const arrAbsStart = card.startIdx + arrOpen; // absolute in html (just after `[`)
  const arrAbsClose = card.startIdx + arrCloseIdx; // absolute `]` position

  let newPhotos;
  if (action === 'clear') {
    newPhotos = []; bucketACount++;
  } else {
    newPhotos = obj.photos.filter(u => u.indexOf('/gps-cs-s/') === -1);
    bucketBCount++;
  }
  // Serialize new array content (just the inside of [])
  const inner = newPhotos.map(u => JSON.stringify(u)).join(',');

  edits.push({ from: arrAbsStart, to: arrAbsClose, replacement: inner, name: obj.name, city: card.cityVar, id: obj.id, was: obj.photos.length, now: newPhotos.length });
}

// Apply edits in reverse order so earlier offsets remain valid
edits.sort((a, b) => b.from - a.from);
let updated = html;
for (const e of edits) {
  updated = updated.slice(0, e.from) + e.replacement + updated.slice(e.to);
}

console.log('');
console.log('Bucket A (clear):', bucketACount, 'cards');
console.log('Bucket B (filter /gps-cs-s/):', bucketBCount, 'cards');
console.log('Skipped (no photos[] or structural):', skipped);
console.log('Total edits prepared:', edits.length);
console.log('Diff size (chars):', html.length - updated.length, 'chars removed');

// Sanity: did we touch every expected target?
const hitKeys = new Set(edits.map(e => `${e.city}#${e.id}`));
const missed = Object.keys(actions).filter(k => !hitKeys.has(k));
if (missed.length) {
  console.log('⚠️  Targets not matched (likely missing photos[] or structural mismatch):', missed.length);
  missed.slice(0, 10).forEach(k => console.log('    ', k));
}

tryWrite(updated);
console.log('Wrote', path);

// Dump edit manifest for audit trail
fs.writeFileSync('scripts/gallery-purge-applied.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  bucketACount,
  bucketBCount,
  skipped,
  missed,
  edits: edits.map(e => ({ city: e.city, id: e.id, name: e.name, was: e.was, now: e.now, action: e.was === e.now ? 'noop' : (e.now === 0 ? 'clear' : 'filter') })),
}, null, 2));
console.log('Manifest → scripts/gallery-purge-applied.json');

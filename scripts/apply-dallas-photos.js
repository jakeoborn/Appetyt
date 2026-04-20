// Apply dallas-photo-plan.json to index.html.
// Re-finds each card by id+name in the CURRENT file state (safe against concurrent edits elsewhere).
// Inserts "photos":[...] before the closing `}` of each matched Dallas card that doesn't already have photos.

const fs = require('fs');
const path = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
let content = fs.readFileSync(path, 'utf8');
const plan = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/dallas-photo-plan.json', 'utf8'));

// Bound to DALLAS_DATA to avoid mismatching cards in other cities with same name
const dallasStart = content.indexOf('const DALLAS_DATA');
if (dallasStart < 0) { console.error('DALLAS_DATA not found'); process.exit(1); }
const dallasArrStart = content.indexOf('[', dallasStart);
let di = dallasArrStart, dDepth = 0, dInStr = false, dEsc = false, dallasArrEnd = -1;
while (di < content.length) {
  const ch = content[di];
  if (dEsc) dEsc = false;
  else if (ch === '\\') dEsc = true;
  else if (ch === '"') dInStr = !dInStr;
  else if (!dInStr) {
    if (ch === '[') dDepth++;
    else if (ch === ']') { dDepth--; if (dDepth === 0) { dallasArrEnd = di; break; } }
  }
  di++;
}
console.log('DALLAS_DATA bounds:', dallasArrStart, '-', dallasArrEnd);

function findCardEnd(fromIdx) {
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

let applied = 0, skippedHasPhotos = 0, notFound = 0, outOfRange = 0;

// Sort plan by id descending so we insert from end to start — keeps earlier indices valid
plan.sort((a, b) => (b.id || 0) - (a.id || 0));

for (const p of plan) {
  // Re-find card by id AND name in current content, bounded to Dallas range
  const searchRegion = content.substring(0, dallasArrEnd + 1);
  const idStr = '"id":' + p.id + ',';
  let idx = searchRegion.indexOf(idStr);
  // Make sure the matched id is in DALLAS_DATA
  if (idx < dallasArrStart || idx > dallasArrEnd) { notFound++; continue; }
  // Walk back to find opening `{`
  let braceStart = idx;
  let depth = 0;
  while (braceStart > dallasArrStart) {
    const ch = content[braceStart];
    if (ch === '}') depth++;
    else if (ch === '{') { if (depth === 0) break; depth--; }
    braceStart--;
  }
  const braceEnd = findCardEnd(braceStart);
  if (braceEnd < 0 || braceEnd > dallasArrEnd) { notFound++; continue; }
  const card = content.substring(braceStart, braceEnd + 1);
  // Verify name matches
  const nameMatch = card.match(/"name":"([^"]*)"/);
  if (!nameMatch || nameMatch[1] !== p.name) { notFound++; continue; }
  // Skip if already has photos field
  if (/"photos"\s*:\s*\[/.test(card)) { skippedHasPhotos++; continue; }
  // Build photos insertion
  const photosJson = ',"photos":' + JSON.stringify(p.photos);
  // Insert immediately before the closing `}`
  content = content.substring(0, braceEnd) + photosJson + content.substring(braceEnd);
  applied++;
}

fs.writeFileSync(path, content, 'utf8');
console.log('Applied:', applied);
console.log('Skipped (already has photos):', skippedHasPhotos);
console.log('Not found / mismatched:', notFound);
console.log('Out of Dallas range:', outOfRange);

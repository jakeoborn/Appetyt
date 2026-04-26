// Insert SF Batch 1 (24 cards, IDs 5050-5073) into SF_DATA in index.html.
// UTF-8 throughout to preserve multi-byte chars (ñ, ü, ä, °, em-dash, etc).
// Per feedback_insert_script_collision.md: match `const SF_DATA=[` literally.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');
const CARDS = path.join(ROOT, 'scripts', 'sf-batch1-cards.json');

const text = fs.readFileSync(HTML, 'utf8');
const cards = JSON.parse(fs.readFileSync(CARDS, 'utf8'));

console.log('Loaded ' + cards.length + ' cards (IDs ' + cards[0].id + '..' + cards[cards.length - 1].id + ')');

// Find SF_DATA declaration
const declMatch = /const SF_DATA=\[/.exec(text);
if (!declMatch) { console.error('FATAL: const SF_DATA=[ not found'); process.exit(1); }
const openIdx = declMatch.index + 'const SF_DATA='.length; // index of [

// Walk bracket depth from openIdx (string-aware)
let depth = 0, closeIdx = -1, inStr = false, sc = '', esc = false;
for (let i = openIdx; i < text.length; i++) {
  const c = text[i];
  if (esc) { esc = false; continue; }
  if (inStr) {
    if (c === '\\') { esc = true; continue; }
    if (c === sc) inStr = false;
    continue;
  }
  if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { closeIdx = i; break; } }
}
if (closeIdx === -1) { console.error('FATAL: matching ] not found'); process.exit(1); }
console.log('SF_DATA span: [' + openIdx + ', ' + closeIdx + ']');

const inner = text.slice(openIdx + 1, closeIdx);

function countTopLevelObjects(s) {
  let d = 0, n = 0, instr = false, sc2 = '', esc2 = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (esc2) { esc2 = false; continue; }
    if (instr) {
      if (c === '\\') { esc2 = true; continue; }
      if (c === sc2) instr = false;
      continue;
    }
    if (c === '"' || c === "'") { instr = true; sc2 = c; continue; }
    if (c === '{') { if (d === 0) n++; d++; }
    else if (c === '}') d--;
  }
  return n;
}
const before = countTopLevelObjects(inner);
console.log('Existing card count: ' + before);

const newCardsJson = cards.map(c => JSON.stringify(c)).join(',');
const trimmed = inner.replace(/\s+$/, '');
const sep = trimmed.length > 0 ? ',' : '';
const newInner = trimmed + sep + newCardsJson;

const newText = text.slice(0, openIdx + 1) + newInner + text.slice(closeIdx);

const after = countTopLevelObjects(newInner);
console.log('Post-insert count: ' + after);
if (after !== before + cards.length) {
  console.error('FATAL: count mismatch — expected ' + (before + cards.length) + ', got ' + after);
  process.exit(1);
}

fs.writeFileSync(HTML, newText, 'utf8');
const finalLen = fs.statSync(HTML).size;
console.log('Wrote ' + finalLen + ' bytes (was ' + Buffer.byteLength(text, 'utf8') + ', delta +' + (finalLen - Buffer.byteLength(text, 'utf8')) + ')');
console.log('OK');

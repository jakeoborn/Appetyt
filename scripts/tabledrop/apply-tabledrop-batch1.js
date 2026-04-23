#!/usr/bin/env node
// Apply TableDrop reserveUrl + bookingInfo to existing NYC cards.
// Data source: scripts/tabledrop/tabledrop-data.json (extracted from tabledrop.nyc on 2026-04-23)
// Safe re-run: idempotent — overwrites existing reserveUrl/bookingInfo on listed cards only.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const HTML_PATH = path.join(ROOT, 'index.html');
const DATA_PATH = path.join(__dirname, 'tabledrop-data.json');

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// Merge booking rows (have full info) + url-only rows (reserveUrl only).
const updates = [];
data.bookings.forEach(b => {
  if (b.cardId && !b.missingCard) updates.push({id: b.cardId, reserveUrl: b.reserveUrl, bookingInfo: b.summary});
});
data.urlsOnly.forEach(u => {
  if (u.cardId && !u.missingCard) {
    const row = {id: u.cardId};
    if (u.reserveUrl) row.reserveUrl = u.reserveUrl;
    if (u.bookingInfo) row.bookingInfo = u.bookingInfo;
    else if (u.notes) row.bookingInfo = u.notes;
    updates.push(row);
  }
});

// Polo Bar: phone-only, no reserveUrl but add bookingInfo note.
const polo = data.urlsOnly.find(u => /Polo Bar/i.test(u.name));
if (polo && polo.cardId && polo.notes) {
  // already pushed with bookingInfo via the loop above if cardId set; check:
  const existing = updates.find(u => u.id === polo.cardId);
  if (!existing) updates.push({id: polo.cardId, bookingInfo: polo.notes});
}

console.log('Applying updates to', updates.length, 'NYC cards');

let html = fs.readFileSync(HTML_PATH, 'utf8');

// Locate NYC_DATA array bounds so we only modify inside it (ID collisions across cities possible).
let nycStart = html.indexOf('const NYC_DATA=');
if (nycStart < 0) nycStart = html.indexOf('const NYC_DATA =');
if (nycStart < 0) throw new Error('NYC_DATA not found');
const arrOpen = html.indexOf('[', nycStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}
const beforeArr = html.slice(0, arrOpen);
let arrText = html.slice(arrOpen, arrClose);
const afterArr = html.slice(arrClose);

function escapeJsonString(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// For each update: find `id:<id>,` (or `"id":<id>,`) inside arrText, walk forward counting
// braces from the surrounding { to find card end, then inject reserveUrl/bookingInfo before
// the final `}` (replacing existing ones if present).
let applied = 0, notFound = [];

for (const u of updates) {
  // Match either `"id":1004,` (JSON) or `id:1004,` (unquoted) — must be followed by
  // comma or whitespace, not another digit.
  const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + u.id + '(?=[,}\\s])');
  const m = idRe.exec(arrText);
  if (!m) { notFound.push(u.id); continue; }

  // walk back to find the enclosing `{`
  let start = m.index;
  let bDepth = 0;
  while (start > 0) {
    const c = arrText[start];
    if (c === '}') bDepth++;
    else if (c === '{') { if (bDepth === 0) break; bDepth--; }
    start--;
  }
  if (arrText[start] !== '{') { notFound.push(u.id); continue; }

  // walk forward to find matching `}`
  let end = start, fDepth = 0;
  for (let i = start; i < arrText.length; i++) {
    if (arrText[i] === '{') fDepth++;
    else if (arrText[i] === '}') { fDepth--; if (fDepth === 0) { end = i; break; } }
  }
  if (end === start) { notFound.push(u.id); continue; }

  let card = arrText.slice(start, end + 1); // includes braces

  // Strip existing reserveUrl and bookingInfo fields.
  card = card.replace(/,\s*"?reserveUrl"?\s*:\s*(?:null|"(?:[^"\\]|\\.)*")/g, '');
  card = card.replace(/,\s*"?bookingInfo"?\s*:\s*(?:null|"(?:[^"\\]|\\.)*")/g, '');

  // Build injection string.
  const parts = [];
  if (u.reserveUrl) parts.push('"reserveUrl":"' + escapeJsonString(u.reserveUrl) + '"');
  if (u.bookingInfo) parts.push('"bookingInfo":"' + escapeJsonString(u.bookingInfo) + '"');
  if (!parts.length) { continue; }
  const injection = ',' + parts.join(',');

  // Inject before final `}`
  const newCard = card.slice(0, -1) + injection + '}';
  arrText = arrText.slice(0, start) + newCard + arrText.slice(end + 1);
  applied++;
}

if (notFound.length) {
  console.error('Not found for ids:', notFound);
}
console.log('Applied:', applied, '/', updates.length);

const newHtml = beforeArr + arrText + afterArr;
if (newHtml === html) {
  console.log('No changes needed.');
  process.exit(0);
}

fs.writeFileSync(HTML_PATH, newHtml);
console.log('Wrote index.html (' + (newHtml.length - html.length) + ' byte delta)');

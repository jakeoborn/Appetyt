/**
 * Seattle Batch 1 — 1 new card (ID 9560)
 * Venues: Lucerna
 * Run: node scripts/seattle-batch1-1card.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── EASTLAKE ──────────────────────────────────────────────────────────────
  {
    id: 9560,
    name: "Lucerna",
    address: "1201 Eastlake Ave E, Seattle, WA 98102",
    lat: 47.6310588, lng: -122.3275081,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "Italian",
    price: 3,
    description: "Intimate Eastlake Italian restaurant with a focus on house-made pasta and seasonal Pacific Northwest ingredients — a neighborhood gem for handcrafted dishes and an approachable wine list.",
    dishes: [],
    score: 83,
    neighborhood: "Eastlake",
    tags: ["Italian", "Pasta", "Date Night", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 524;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const SEATTLE_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} SEATTLE_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const SEATTLE_DATA\s*=\s*\[/)[0].length;

let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify
const m2 = html.match(/const SEATTLE_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
let cardCount;
try { cardCount = eval('[' + html.slice(s2, p2 - 1) + ']').length; }
catch (e) { console.error('Parse error:', e.message); process.exit(1); }

const expected = PREV_COUNT + NEW_CARDS.length;
if (cardCount !== expected) { console.error(`Count mismatch: got ${cardCount}, expected ${expected}`); process.exit(1); }
console.log(`Seattle card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new Seattle cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

/**
 * NYC Batch 2 — 1 new card (ID 2039)
 * Venues: Bourbon Steak NYC (Mina Group)
 * Run: node scripts/nyc-batch2-1card.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── MIDTOWN ───────────────────────────────────────────────────────────────
  {
    id: 2039,
    name: "Bourbon Steak",
    address: "160 Central Park South, New York, NY 10019",
    lat: 40.7661739, lng: -73.9785098,
    phone: "(212) 484-5120",
    website: "https://bourbonsteaknyc.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 5:30–10pm · Fri–Sat 5:30–10:30pm · Sun 5–9pm",
    cuisine: "Steakhouse",
    price: 4,
    description: "Michael Mina's acclaimed steakhouse at the JW Marriott Essex House on Central Park South — USDA prime and American Wagyu steaks, butter-poached lobster, and a vast whiskey program with sweeping Central Park views.",
    dishes: ["Butter-Poached Lobster", "Wagyu Beef Tenderloin", "Duck Fat Fries", "Prime Bone-In Ribeye"],
    score: 87,
    neighborhood: "Midtown",
    tags: ["Steakhouse", "Fine Dining", "Date Night", "Cocktails", "Views"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    group: "Mina Group",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 985;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const NYC_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} NYC_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const NYC_DATA\s*=\s*\[/)[0].length;

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
const m2 = html.match(/const NYC_DATA\s*=\s*\[/);
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
console.log(`NYC card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new NYC cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

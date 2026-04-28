/**
 * Charlotte Batch 1 — 1 new card (ID 8255)
 * Venues: Bourbon Steak Charlotte (Mina Group, coming soon 2026)
 * Run: node scripts/charlotte-batch1-1card.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── UPTOWN ────────────────────────────────────────────────────────────────
  {
    id: 8255,
    name: "Bourbon Steak",
    address: "201 E Trade St, Charlotte, NC 28202",
    lat: 35.2261489, lng: -80.8414747,
    phone: "",
    website: "https://michaelmina.net/restaurants/bourbon-steak-charlotte",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "",
    cuisine: "Steakhouse",
    price: 4,
    description: "Michael Mina's acclaimed Bourbon Steak coming to Uptown Charlotte — USDA prime and American Wagyu steaks, butter-poached Maine lobster, and a premium whiskey program at The Ritz-Carlton.",
    dishes: ["Butter-Poached Lobster", "Wagyu Beef Tenderloin", "Duck Fat Fries", "Prime Bone-In Ribeye"],
    score: 88,
    neighborhood: "Uptown",
    tags: ["Steakhouse", "Fine Dining", "Date Night", "Cocktails", "Hotel Bar"],
    indicators: ["coming-soon"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    group: "Mina Group",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 253;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const CHARLOTTE_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} CHARLOTTE_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const CHARLOTTE_DATA\s*=\s*\[/)[0].length;

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
const m2 = html.match(/const CHARLOTTE_DATA\s*=\s*\[/);
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
console.log(`Charlotte card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new Charlotte cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

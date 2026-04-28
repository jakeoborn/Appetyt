/**
 * LA Batch 2 — 3 new cards (IDs 2544–2546)
 * Venues: Pizzeria Sei, Kuya Lord, Camélia
 * Run: node scripts/la-batch2-3cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── PICO-ROBERTSON ────────────────────────────────────────────────────────
  {
    id: 2544,
    name: "Pizzeria Sei",
    address: "8781 W Pico Blvd, Los Angeles, CA 90035",
    lat: 34.0547759, lng: -118.3833123,
    phone: "",
    website: "https://pizzeriasei.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Wed–Mon 5–10pm · Tue closed",
    cuisine: "Pizza",
    price: 2,
    description: "California-meets-Naples wood-fired pizza from a veteran LA chef — blistered Neapolitan pies with premium toppings in an intimate neighborhood restaurant that's become one of LA's most beloved pizzerias.",
    dishes: ["Margherita", "Cacio e Pepe Pizza", "Wood-Fired Clam Pizza"],
    score: 88,
    neighborhood: "Pico-Robertson",
    tags: ["Pizza", "Italian", "Date Night", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── EAST HOLLYWOOD ────────────────────────────────────────────────────────
  {
    id: 2545,
    name: "Kuya Lord",
    address: "5003 Melrose Ave, Los Angeles, CA 90029",
    lat: 34.0836885, lng: -118.3095008,
    phone: "",
    website: "https://kuyalord.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Wed–Sun 11am–3pm · Thu–Sun 5–9pm · Mon–Tue closed",
    cuisine: "Filipino",
    price: 2,
    description: "LA's definitive Filipino restaurant from James Beard-nominated chef Nico Vera — soulful traditional dishes like kare-kare, sisig, and lechon kawali served in a bright, welcoming East Hollywood storefront.",
    dishes: ["Kare-Kare", "Sisig", "Lechon Kawali", "Pancit"],
    score: 89,
    neighborhood: "East Hollywood",
    tags: ["Filipino", "Local Favorites", "Lunch", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── ARTS DISTRICT ─────────────────────────────────────────────────────────
  {
    id: 2546,
    name: "Camélia",
    address: "1850 Industrial St, Los Angeles, CA 90021",
    lat: 34.0354531, lng: -118.2328561,
    phone: "",
    website: "https://cameliarestaurant.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Tue–Thu 5:30–10pm · Fri–Sat 5:30–10:30pm · Sun–Mon closed",
    cuisine: "French",
    price: 3,
    description: "Romantic Arts District French restaurant in a converted warehouse with exposed brick and candlelight — classical French technique applied to seasonal California produce with an extensive natural wine list.",
    dishes: ["Duck Confit", "French Onion Soup", "Steak au Poivre"],
    score: 87,
    neighborhood: "Arts District",
    tags: ["French", "Date Night", "Fine Dining", "Natural Wine", "Romantic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 533;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const LA_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} LA_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const LA_DATA\s*=\s*\[/)[0].length;

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
const m2 = html.match(/const LA_DATA\s*=\s*\[/);
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
console.log(`LA card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new LA cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

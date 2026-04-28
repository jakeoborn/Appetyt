/**
 * SLC/Park City Batch 1 — 5 new cards (IDs 11686–11690)
 * Venues: Twisted Fern, Fletcher's, Tekila Mexican Grill, Salt & Olive, Roux SLC
 * All data from live website fetches + Nominatim geocoding. No training data used.
 * Run: node scripts/slc-batch1-5cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── PARK CITY ─────────────────────────────────────────────────────────────
  {
    id: 11686,
    name: "Twisted Fern",
    address: "1300 Snow Creek Dr Suite RS, Park City, UT 84060",
    lat: 40.6620320, lng: -111.5076554,
    phone: "(435) 731-8238",
    website: "https://www.twistedfern.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Daily 5–9pm",
    cuisine: "New American",
    price: 2,
    description: "Inventive New American restaurant with creative seasonal menus, thoughtful vegan options, and a welcoming patio — a Park City standout for adventurous flavors and genuinely attentive service.",
    dishes: ["Nashville Hot Maitake Sandwich", "Garlic and Sesame Chickpeas", "Fried Brussels Sprouts", "Blackened Octopus", "Party Scallops"],
    score: 84,
    neighborhood: "Park City",
    tags: ["New American", "Vegetarian Friendly", "Patio", "Date Night"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 11687,
    name: "Fletcher's",
    address: "562 Main St, Park City, UT 84060",
    lat: 40.6453115, lng: -111.4965855,
    phone: "(435) 649-1111",
    website: "",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu & Sun 5–9:30pm · Fri–Sat 5–10pm",
    cuisine: "American",
    price: 3,
    description: "Contemporary American restaurant on historic Main Street Park City serving refined seasonal menus with local Utah ingredients in a warm, inviting setting.",
    dishes: [],
    score: 84,
    neighborhood: "Park City",
    tags: ["American", "Date Night", "Main Street", "Fine Dining"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 11688,
    name: "Tekila Mexican Grill",
    address: "255 Main St, Park City, UT 84060",
    lat: 40.6416609, lng: -111.4949606,
    phone: "",
    website: "",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Daily 11:30am–10pm",
    cuisine: "Mexican",
    price: 2,
    description: "Lively Mexican grill on Park City's historic Main Street serving tacos, enchiladas, margaritas, and classic Mexican fare in a festive, welcoming atmosphere.",
    dishes: [],
    score: 78,
    neighborhood: "Park City",
    tags: ["Mexican", "Margaritas", "Main Street", "Casual"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── DOWNTOWN SLC ──────────────────────────────────────────────────────────
  {
    id: 11689,
    name: "Salt & Olive",
    address: "270 S 300 E, Salt Lake City, UT 84111",
    lat: 40.7582022, lng: -111.8824825,
    phone: "(801) 906-8389",
    website: "https://www.saltandoliveutah.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Sun 11:30am–10pm (Fri–Sat until 10:30pm)",
    cuisine: "Italian",
    price: 2,
    description: "Industrial-chic downtown SLC Italian restaurant with everything handmade from scratch — wood-fired pizzas, fresh gnocchi, housemade pasta, and a welcoming bar in a converted warehouse space.",
    dishes: ["Wood-Fired Margherita Pizza", "Truffle Pizza", "Gnocchi", "Lamb Lollipops", "Beef Carpaccio"],
    score: 83,
    neighborhood: "Downtown SLC",
    tags: ["Italian", "Pizza", "Pasta", "Vegetarian Friendly", "Cocktails"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── CENTRAL CITY ─────────────────────────────────────────────────────────
  {
    id: 11690,
    name: "Roux SLC",
    address: "515 E 300 S, Salt Lake City, UT 84102",
    lat: 40.7628443, lng: -111.8553120,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Tock",
    reserveUrl: "",
    hours: "",
    cuisine: "French",
    price: 3,
    description: "An intimate French-inspired fusion restaurant in Salt Lake City offering seasonal menus and a curated Tock reservation experience — a destination for refined, creative French cooking.",
    dishes: [],
    score: 83,
    neighborhood: "Central City",
    tags: ["French", "Fusion", "Fine Dining", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 569;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const SLC_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} SLC_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const SLC_DATA\s*=\s*\[/)[0].length;

let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify count
const m2 = html.match(/const SLC_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
const block = '[' + html.slice(s2, p2 - 1) + ']';
let cardCount;
try {
  cardCount = eval(block).length;
} catch (e) {
  console.error('Parse error after insert:', e.message);
  process.exit(1);
}

const expected = PREV_COUNT + NEW_CARDS.length;
if (cardCount !== expected) {
  console.error(`Count mismatch: got ${cardCount}, expected ${expected}`);
  process.exit(1);
}
console.log(`SLC card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new SLC cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

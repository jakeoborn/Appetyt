/**
 * LA Batch 3 — 5 new cards (IDs 2547–2551)
 * Source: TimeOut LA best restaurants (remaining 5 not yet in app)
 * Venues: Mariscos Jalisco, Leo's Taco Truck, Tomat, Sushi Gen, RVR
 * Run: node scripts/la-batch3-5cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── BOYLE HEIGHTS ─────────────────────────────────────────────────────────
  {
    id: 2547,
    name: "Mariscos Jalisco",
    address: "3040 E Olympic Blvd, Los Angeles, CA 90023",
    lat: 34.0211071, lng: -118.2128274,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Sun 9am–7pm",
    cuisine: "Mexican",
    price: 1,
    description: "Legendary Boyle Heights taco truck serving LA's most iconic seafood tacos for decades — deep-fried shrimp tacos with housemade red salsa and avocado, plus shrimp aguachile and tostadas. A TimeOut LA top restaurant.",
    dishes: ["Taco de Camaron", "Aguachile", "Poseidon Tostada"],
    score: 90,
    neighborhood: "Boyle Heights",
    tags: ["Mexican", "Tacos", "Seafood", "Local Favorites", "Casual"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── LITTLE ARMENIA / HOLLYWOOD ────────────────────────────────────────────
  {
    id: 2548,
    name: "Leo's Taco Truck",
    address: "5525 W Sunset Blvd, Los Angeles, CA 90027",
    lat: 34.0985882, lng: -118.3097957,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 11am–3am",
    cuisine: "Mexican",
    price: 1,
    description: "One of LA's most beloved taco trucks, famous for al pastor carved tableside from a vertical spit with pineapple — the late-night lines are legendary but the tacos are worth every minute. TimeOut LA essential.",
    dishes: ["Taco al Pastor", "Mulita al Pastor", "Quesataco al Pastor"],
    score: 89,
    neighborhood: "Little Armenia",
    tags: ["Mexican", "Tacos", "Street Food", "Local Favorites", "Late Night"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── WESTCHESTER ───────────────────────────────────────────────────────────
  {
    id: 2549,
    name: "Tomat",
    address: "6261 W 87th St, Los Angeles, CA 90045",
    lat: 33.9586743, lng: -118.3946775,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Wed–Sun 8am–2:30pm · Wed–Sat 5:30–10pm",
    cuisine: "New American",
    price: 3,
    description: "All-day farm-to-table gem near LAX blending British, Persian, and Japanese influences — produce from an adjacent garden drives inventive daytime café dishes and refined dinner plates. One of TimeOut LA's top restaurants.",
    dishes: ["Barbari Bread with Roasted Tomato Butter", "Dry-Aged Duck with Saffron & Pomegranate", "Jeweled Chirashi", "Sticky Toffee Pudding"],
    score: 88,
    neighborhood: "Westchester",
    tags: ["New American", "Farm-to-Table", "Breakfast & Brunch", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── LITTLE TOKYO ──────────────────────────────────────────────────────────
  {
    id: 2550,
    name: "Sushi Gen",
    address: "422 E 2nd St, Los Angeles, CA 90012",
    lat: 34.0467296, lng: -118.2387113,
    phone: "(213) 617-0552",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Tue–Fri 11:15am–2pm, 5:30–9:45pm · Sat 5–9:45pm · Sun–Mon closed",
    cuisine: "Japanese",
    price: 2,
    description: "A revered Little Tokyo institution proving great sushi doesn't require great expense — perpetually packed at lunch for the legendary sashimi deluxe, with decades of quality and remarkably reasonable prices. TimeOut LA essential.",
    dishes: ["Sashimi Deluxe", "Toro Nigiri", "Uni", "Ikura", "Omakase at the Bar"],
    score: 91,
    neighborhood: "Little Tokyo",
    tags: ["Japanese", "Sushi", "Lunch", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── VENICE ────────────────────────────────────────────────────────────────
  {
    id: 2551,
    name: "RVR",
    address: "1305 Abbot Kinney Blvd, Los Angeles, CA 90291",
    lat: 33.9911850, lng: -118.4677964,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Tue–Sun 5:30–11pm · Mon closed",
    cuisine: "Japanese",
    price: 3,
    description: "Chef Travis Lett's Venice izakaya with a California lens — charcoal-grilled yakitori, produce-forward Japanese small plates, and serious cooking reflecting time spent in Japan. A TimeOut LA top pick on Abbot Kinney.",
    dishes: ["Roasted Maitake in Miso Butter", "Yakitori (Lamb & Duck)", "Crispy Chicken Karaage", "Pork Rib Gyoza", "Warm Mochi Beignets"],
    score: 88,
    neighborhood: "Venice",
    tags: ["Japanese", "Izakaya", "Date Night", "Cocktails", "Abbot Kinney"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 536;

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

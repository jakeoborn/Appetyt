/**
 * Miami Batch 2 — 4 new cards (IDs 4269–4272)
 * Source: miamiandbeaches.com/things-to-do/nightlife
 * Venues: Mango's Tropical Cafe, Twist South Beach, Gaythering, Gramps
 * Run: node scripts/miami-batch2-4cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── SOUTH BEACH ───────────────────────────────────────────────────────────
  {
    id: 4269,
    name: "Mango's Tropical Cafe",
    address: "900 Ocean Dr, Miami Beach, FL 33139",
    lat: 25.7778270, lng: -80.1298780,
    phone: "(305) 673-4422",
    website: "https://mangos.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 11am–4am",
    cuisine: "Latin American",
    price: 2,
    description: "Iconic Ocean Drive landmark with live salsa and samba performances, Cuban-Latin food, and non-stop entertainment — a Miami Beach institution for over 30 years where performers take the show to the street.",
    dishes: ["Cuban Sandwich", "Mojito", "Empanadas"],
    score: 78,
    neighborhood: "South Beach",
    tags: ["Latin", "Live Music", "Cuban", "Cocktails", "Happy Hour", "Nightlife"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4270,
    name: "Twist",
    address: "1057 Washington Ave, Miami Beach, FL 33139",
    lat: 25.7800000, lng: -80.1347000,
    phone: "(305) 538-9478",
    website: "https://twistsobe.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 1pm–5am",
    cuisine: "Cocktails",
    price: 2,
    description: "South Beach's premier LGBTQ+ nightlife destination for 25+ years — seven distinct bars and dance floors across multiple levels, with drag shows, themed nights, and a welcoming community atmosphere on Washington Ave.",
    dishes: [],
    score: 80,
    neighborhood: "South Beach",
    tags: ["Cocktails", "Nightlife", "Live Entertainment"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4271,
    name: "Gaythering",
    address: "1409 Lincoln Rd, Miami Beach, FL 33139",
    lat: 25.7920250, lng: -80.1393500,
    phone: "(305) 763-8788",
    website: "https://gaythering.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 3pm–3am",
    cuisine: "Cocktails",
    price: 2,
    description: "LGBTQ+ hotel bar and lounge on Lincoln Road with nightly themed events, craft cocktails, and a welcoming community vibe — a popular stop on South Beach's gay nightlife circuit.",
    dishes: [],
    score: 79,
    neighborhood: "South Beach",
    tags: ["Cocktails", "Nightlife", "Happy Hour"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── WYNWOOD ───────────────────────────────────────────────────────────────
  {
    id: 4272,
    name: "Gramps",
    address: "176 NW 24th St, Miami, FL 33127",
    lat: 25.7996340, lng: -80.1963750,
    phone: "(305) 699-2669",
    website: "https://gramps.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri 5pm–3am · Sat–Sun 2pm–3am",
    cuisine: "Cocktails",
    price: 2,
    description: "Wynwood's beloved dive bar and outdoor patio with craft cocktails, live music, local DJs, ping pong, and a laid-back neighborhood vibe — an anchor of Miami's arts district nightlife scene since 2013.",
    dishes: [],
    score: 82,
    neighborhood: "Wynwood",
    tags: ["Cocktails", "Dive Bar", "Live Music", "Outdoor", "Wynwood"],
    indicators: ["dive-bar"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 267;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const MIAMI_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} MIAMI_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const MIAMI_DATA\s*=\s*\[/)[0].length;

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
const m2 = html.match(/const MIAMI_DATA\s*=\s*\[/);
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
console.log(`Miami card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new Miami cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

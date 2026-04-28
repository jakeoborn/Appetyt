/**
 * SF Batch 6 — 14 new cards (IDs 5153–5166)
 * Sources: Mina Group (International Smoke), Infatuation SF cocktail list,
 *          FriendlyTraveler SF bars guide.
 * All addresses/coords verified. Run: node scripts/sf-batch6-14cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── SOMA ─────────────────────────────────────────────────────────────────
  {
    id: 5153,
    name: "International Smoke",
    address: "301 Mission St, San Francisco, CA 94105",
    lat: 37.7904075, lng: -122.3961867,
    phone: "(415) 660-2656",
    website: "https://internationalsmoke.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Sat 5–9pm · Happy Hour Mon–Sat 4–6pm",
    cuisine: "American",
    price: 4,
    description: "Ayesha Curry and Michael Mina's global BBQ restaurant at Salesforce Tower — wood-fire and smoke meet international spice in Korean short ribs, Peking pork belly bao, and smoked cocktails.",
    dishes: ["Korean Gochujang St Louis Pork Ribs", "Peking Smoked Pork Belly Bao", "Binchotan-Grilled Lobster Tail", "S'mores with Tableside Smoke"],
    score: 82,
    neighborhood: "SoMa",
    tags: ["BBQ", "American", "Happy Hour", "Cocktails", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    group: "Mina Group",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5154,
    name: "Natoma Cabana",
    address: "90 Natoma St, San Francisco, CA 94105",
    lat: 37.7876097, lng: -122.3985898,
    phone: "(415) 996-6531",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Sat 2pm–2am · Sun 2–9pm",
    cuisine: "Cocktails",
    price: 2,
    description: "Hidden SoMa cocktail bar tucked into a Natoma Street alley with craft cocktails, a private upstairs room, and a welcoming neighborhood vibe — one of SF's best-kept secrets.",
    dishes: [],
    score: 83,
    neighborhood: "SoMa",
    tags: ["Cocktails", "Happy Hour", "Hidden Gem", "Neighborhood Bar"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5155,
    name: "Local Edition",
    address: "691 Market St, San Francisco, CA 94105",
    lat: 37.7875747, lng: -122.4032007,
    phone: "(415) 795-1375",
    website: "https://localeditionsf.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri 4:30pm–2am · Sat 6pm–2am · Sun closed",
    cuisine: "Cocktails",
    price: 2,
    description: "Jazz-age speakeasy housed in the historic San Francisco Examiner building — live jazz performances, artful cocktails, and a sophisticated underground atmosphere beneath SoMa.",
    dishes: [],
    score: 84,
    neighborhood: "SoMa",
    tags: ["Cocktails", "Speakeasy", "Live Jazz", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5156,
    name: "The Pawn Shop",
    address: "993 Mission St, San Francisco, CA 94103",
    lat: 37.7810812, lng: -122.4084223,
    phone: "",
    website: "https://www.thepawnshopsf.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Tue–Thu 5–9pm · Fri–Sat 5–10pm",
    cuisine: "Spanish",
    price: 3,
    description: "Hidden Spanish and Mediterranean tapas bar and late-night speakeasy in SoMa — shareable plates, curated cocktails, and one of SF's top clandestine dining and drinking destinations.",
    dishes: [],
    score: 84,
    neighborhood: "SoMa",
    tags: ["Tapas", "Cocktails", "Speakeasy", "Spanish", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5157,
    name: "Rise Over Run",
    address: "33 Turk St, San Francisco, CA 94102",
    lat: 37.7832350, lng: -122.4096460,
    phone: "(415) 523-9797",
    website: "",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Sat 5–10:30pm",
    cuisine: "New American",
    price: 2,
    description: "Rooftop bar and restaurant at The Line Hotel with an open-air solarium, fireplace, and sweeping downtown SF views — creative cocktails and New American plates above the Tenderloin.",
    dishes: ["Double Royale with Cheese", "Fried Chicken Tenders"],
    score: 78,
    neighborhood: "Tenderloin",
    tags: ["Rooftop", "Cocktails", "American", "Hotel Bar", "Views"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COW HOLLOW / MARINA ───────────────────────────────────────────────────
  {
    id: 5158,
    name: "Flores",
    address: "2030 Union St, San Francisco, CA 94123",
    lat: 37.7976467, lng: -122.4326817,
    phone: "(415) 796-2926",
    website: "",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–9:30pm · Fri–Sat 11am–10:30pm · Sun 11am–9:30pm",
    cuisine: "Mexican",
    price: 2,
    description: "Lively Cow Hollow Mexican restaurant with craft margaritas, mezcal cocktails, fried fish tacos, and fresh seafood — a sunny Union Street staple with a great happy hour.",
    dishes: ["Fried Fish Tacos", "Guacamole & Chips", "Fresh Seafood"],
    score: 81,
    neighborhood: "Cow Hollow",
    tags: ["Mexican", "Margaritas", "Happy Hour", "Patio", "Cocktails"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5159,
    name: "Left Door",
    address: "1905 Union St, San Francisco, CA 94123",
    lat: 37.7975942, lng: -122.4307445,
    phone: "(415) 295-2042",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Tue–Thu 5pm–midnight · Fri–Sat 5pm–1am · Sun 4–11pm · Mon closed",
    cuisine: "Cocktails",
    price: 2,
    description: "Intimate speakeasy-style bar on Union Street with a cozy fireplace, meticulously crafted cocktails, and a moody atmosphere — a neighborhood gem for dates and nightcaps in Cow Hollow.",
    dishes: [],
    score: 80,
    neighborhood: "Cow Hollow",
    tags: ["Cocktails", "Speakeasy", "Date Night", "Happy Hour", "Fireplace"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5160,
    name: "Super Mensch",
    address: "2336 Chestnut St, San Francisco, CA 94123",
    lat: 37.8004118, lng: -122.4419863,
    phone: "(415) 682-6164",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Tue–Sun 11am–9pm · Mon closed",
    cuisine: "Deli",
    price: 2,
    description: "Modern Jewish deli on Chestnut Street combining hand-carved pastrami, matzah ball soup, and house-made rye bread with California influences and creative cocktails.",
    dishes: ["Hand-Carved Pastrami Sandwich", "Matzah Ball Soup", "Latkes", "Reuben Sandwich"],
    score: 82,
    neighborhood: "Marina",
    tags: ["Deli", "Sandwiches", "Cocktails", "Breakfast & Brunch", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NORTH BEACH ───────────────────────────────────────────────────────────
  {
    id: 5161,
    name: "Long Weekend",
    address: "270 Columbus Ave, San Francisco, CA 94133",
    lat: 37.7977645, lng: -122.4062737,
    phone: "(415) 903-9563",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Wed 5pm–midnight · Thu–Sat 5pm–2am · Sun 3–11pm · Mon–Tue closed",
    cuisine: "Cocktails",
    price: 2,
    description: "Rotating-theme immersive cocktail bar in a historic 1920s North Beach bank building — currently Havana-inspired with live Cuban music, daiquiris, and mojitos in a dramatic setting.",
    dishes: [],
    score: 83,
    neighborhood: "North Beach",
    tags: ["Cocktails", "Themed Bar", "Live Music", "Date Night", "Immersive"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5162,
    name: "The Devil's Acre",
    address: "256 Columbus Ave, San Francisco, CA 94133",
    lat: 37.7974814, lng: -122.4059556,
    phone: "(415) 766-4363",
    website: "https://thedevilsacre.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Tue–Thu 4:30pm–1am · Fri–Sat 4:30pm–2am · Sun 4–10pm · Mon closed",
    cuisine: "Cocktails",
    price: 2,
    description: "Atmospheric North Beach cocktail bar inspired by SF's Barbary Coast era — featuring a mahogany backbar dating to 1868 and craft cocktails crafted in the spirit of the raucous 1850s.",
    dishes: [],
    score: 85,
    neighborhood: "North Beach",
    tags: ["Cocktails", "Date Night", "Happy Hour", "Historic", "Speakeasy"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    hh: "Tue–Fri 4:30–7pm",
    trending: false,
    verified: "2026-04-28"
  },

  // ── CASTRO / UPPER MARKET ─────────────────────────────────────────────────
  {
    id: 5163,
    name: "Churchill",
    address: "198 Church St, San Francisco, CA 94114",
    lat: 37.7678473, lng: -122.4291843,
    phone: "",
    website: "https://churchillsf.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Sun–Thu 4pm–midnight · Fri–Sat 4pm–2am · Happy Hour daily 4–7pm",
    cuisine: "Cocktails",
    price: 2,
    description: "WWII-inspired cocktail bar in Duboce Triangle specializing in hand-crafted cocktails and an extensive whiskey selection in a warmly decorated neighborhood setting at Church and Market.",
    dishes: [],
    score: 80,
    neighborhood: "Castro",
    tags: ["Cocktails", "Whiskey", "Happy Hour", "Neighborhood Bar"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    hh: "Daily 4–7pm",
    trending: false,
    verified: "2026-04-28"
  },

  // ── HAIGHT-ASHBURY ────────────────────────────────────────────────────────
  {
    id: 5164,
    name: "Bar Jambroni",
    address: "698 Haight St, San Francisco, CA 94117",
    lat: 37.7718146, lng: -122.4336330,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Wine Bar",
    price: 2,
    description: "Cozy Lower Haight wine bar and restaurant with an approachable natural wine list and eclectic food pairings in a relaxed neighborhood setting.",
    dishes: [],
    score: 82,
    neighborhood: "Haight-Ashbury",
    tags: ["Wine Bar", "Natural Wine", "Date Night", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOPA ──────────────────────────────────────────────────────────────────
  {
    id: 5165,
    name: "Fool's Errand",
    address: "639A Divisadero St, San Francisco, CA 94117",
    lat: 37.7754092, lng: -122.4377197,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Wine Bar",
    price: 2,
    description: "Natural wine bar on Divisadero in NoPa with a curated selection of low-intervention wines and light snacks in an intimate neighborhood setting.",
    dishes: [],
    score: 83,
    neighborhood: "NoPa",
    tags: ["Wine Bar", "Natural Wine", "NoPa", "Date Night", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── EXCELSIOR / OUTER MISSION ─────────────────────────────────────────────
  {
    id: 5166,
    name: "The Halfway Club",
    address: "1166 Geneva Ave, San Francisco, CA 94112",
    lat: 37.7143665, lng: -122.4369240,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "American",
    price: 1,
    description: "No-frills Excelsior neighborhood bar with stiff drinks, solid bar food, and an unpretentious local vibe on Geneva Avenue — a genuine neighborhood institution.",
    dishes: [],
    score: 77,
    neighborhood: "Mission",
    tags: ["Bar Food", "Neighborhood Bar", "Local Favorites", "Casual"],
    indicators: ["dive-bar"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 152;

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const SF_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} SF_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const SF_DATA\s*=\s*\[/)[0].length;

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
const m2 = html.match(/const SF_DATA\s*=\s*\[/);
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
console.log(`SF card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new SF cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

/**
 * Miami Batch 1 — 17 new cards (IDs 4252–4268)
 * Source: Michelin Guide Miami (guide.michelin.com/us/en/florida/miami/restaurants)
 * All addresses verified via Nominatim. Missing from existing MIAMI_DATA.
 * Run: node scripts/miami-batch1-17cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── DOWNTOWN / BRICKELL ───────────────────────────────────────────────────
  {
    id: 4252,
    name: "Tam Tam",
    address: "99 NW 1st St, Miami, FL 33128",
    lat: 25.7753098, lng: -80.1949645,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Vietnamese",
    price: 2,
    description: "Michelin-selected Vietnamese restaurant in Downtown Miami with vibrant, fresh flavors and creative interpretations of classic Vietnamese dishes in a casual, welcoming setting.",
    dishes: [],
    score: 79,
    neighborhood: "Downtown Miami",
    tags: ["Vietnamese", "Casual", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4253,
    name: "Kaori",
    address: "871 S Miami Ave, Miami, FL 33130",
    lat: 25.7657809, lng: -80.1932009,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "Asian",
    price: 3,
    description: "Michelin-selected pan-Asian restaurant in Brickell offering refined, contemporary interpretations of Asian cuisine with premium ingredients and a curated cocktail program.",
    dishes: [],
    score: 80,
    neighborhood: "Brickell",
    tags: ["Asian", "Date Night", "Cocktails"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── WYNWOOD ───────────────────────────────────────────────────────────────
  {
    id: 4254,
    name: "Ossobuco",
    address: "62 NW 27th St, Miami, FL 33127",
    lat: 25.8021461, lng: -80.1963081,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Contemporary",
    price: 3,
    description: "Michelin-selected contemporary restaurant in Wynwood offering inventive seasonal dishes in a vibrant arts-district setting — a creative neighbor to the neighborhood's murals and galleries.",
    dishes: [],
    score: 80,
    neighborhood: "Wynwood",
    tags: ["Contemporary", "Date Night", "Wynwood"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── DESIGN DISTRICT ───────────────────────────────────────────────────────
  {
    id: 4255,
    name: "Sushi Yasu Tanaka",
    address: "140 NE 39th St, Suite 241, Miami, FL 33137",
    lat: 25.8125375, lng: -80.1918741,
    phone: "",
    website: "",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "",
    cuisine: "Japanese",
    price: 2,
    description: "Michelin-starred omakase sushi counter in the Design District — chef Yasu Tanaka delivers a focused, intimate experience with pristine nigiri and exceptional Japanese technique at surprisingly approachable prices.",
    dishes: ["Omakase Nigiri", "Otoro", "Uni", "Ikura"],
    score: 91,
    neighborhood: "Design District",
    tags: ["Japanese", "Sushi", "Omakase", "Date Night", "Fine Dining"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4256,
    name: "Michael's Genuine Food & Drink",
    address: "130 NE 40th St, Miami, FL 33137",
    lat: 25.8132532, lng: -80.1926943,
    phone: "(305) 573-5550",
    website: "https://michaelsgenuine.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–10pm · Fri–Sat 11:30am–11pm · Sun 11am–9pm",
    cuisine: "New American",
    price: 3,
    description: "Michelin-selected Design District landmark from James Beard Award winner Michael Schwartz — wood-fired, farm-to-table New American cooking with a celebrated brunch and one of Miami's most beloved neighborhood atmospheres.",
    dishes: ["Wood Oven Roasted Chicken", "Crispy Pig's Ear", "Fresh Burrata", "Wood Roasted Local Fish"],
    score: 88,
    neighborhood: "Design District",
    tags: ["New American", "Brunch", "Farm-to-Table", "Date Night", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4257,
    name: "Torno Subito Miami",
    address: "191 NE 40th St, Miami, FL 33137",
    lat: 25.8136101, lng: -80.1918403,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "Italian",
    price: 4,
    description: "Michelin-starred Italian restaurant from three-Michelin-starred chef Massimo Bottura — a playful homage to Italian coastal summers with pasta, pizza, and seafood dishes rooted in nostalgic Riviera flavors.",
    dishes: ["Tagliatelle al Ragù", "Tortellini", "Grilled Fish"],
    score: 90,
    neighborhood: "Design District",
    tags: ["Italian", "Fine Dining", "Date Night", "Pasta"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4258,
    name: "L'Atelier de Joël Robuchon Miami",
    address: "151 NE 41st St, Suite 235, Miami, FL 33137",
    lat: 25.8147167, lng: -80.1922565,
    phone: "",
    website: "https://latelier-miami.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "",
    cuisine: "French",
    price: 4,
    description: "The legendary workshop-style counter restaurant from the late Joël Robuchon — guests sit at a lacquered bar watching chefs craft extraordinary French cuisine with signature dishes like Le Caviar and the famous pomme purée.",
    dishes: ["Le Caviar", "L'Oeuf de Poule", "Le Poulet", "La Pomme Purée"],
    score: 92,
    neighborhood: "Design District",
    tags: ["French", "Fine Dining", "Date Night", "Tasting Menu"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── BUENA VISTA ───────────────────────────────────────────────────────────
  {
    id: 4259,
    name: "El Turco",
    address: "184 NE 50th Terr, Miami, FL 33137",
    lat: 25.8218265, lng: -80.1920956,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Mediterranean",
    price: 2,
    description: "Michelin-selected neighborhood Mediterranean in Buena Vista with Turkish and Eastern Mediterranean flavors — sharable mezze, hand-rolled breads, and bold spices in a warm, casual setting.",
    dishes: [],
    score: 79,
    neighborhood: "Buena Vista",
    tags: ["Mediterranean", "Turkish", "Casual", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── LITTLE HAVANA ─────────────────────────────────────────────────────────
  {
    id: 4260,
    name: "The Gibson Room",
    address: "2224 SW 22nd St, Miami, FL 33145",
    lat: 25.7503368, lng: -80.2307080,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "American",
    price: 3,
    description: "Michelin Bib Gourmand neighborhood cocktail bar and American kitchen — carefully crafted cocktails and seasonal food in a relaxed, inviting Silver Bluff setting that punches well above its price point.",
    dishes: [],
    score: 86,
    neighborhood: "Little Havana",
    tags: ["Cocktails", "American", "Neighborhood Bar", "Happy Hour"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── SOUTH BEACH / MID BEACH ───────────────────────────────────────────────
  {
    id: 4261,
    name: "Lucali",
    address: "1930 Bay Rd, Miami Beach, FL 33139",
    lat: 25.7951908, lng: -80.1439249,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Wed–Mon 6–11pm · Tue closed",
    cuisine: "Pizza",
    price: 2,
    description: "Michelin-selected Miami Beach outpost of the legendary Brooklyn pizzeria — thin, blistered pies baked in a wood-fired oven, topped with the finest ingredients and eaten in a candlelit, intimate room.",
    dishes: ["Margherita Pizza", "Calzone"],
    score: 86,
    neighborhood: "Mid Beach",
    tags: ["Pizza", "Italian", "Date Night", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4262,
    name: "Joe's Stone Crab",
    address: "11 Washington Ave, Miami Beach, FL 33139",
    lat: 25.7684081, lng: -80.1352398,
    phone: "(305) 673-0365",
    website: "https://joesstonecrab.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Tue–Sat 11:30am–2pm, 5–10pm · Sun 5–10pm · Mon closed",
    cuisine: "Seafood",
    price: 3,
    description: "Michelin-selected Miami Beach institution since 1913 — the world-famous stone crab claws served chilled with mustard sauce alongside key lime pie have made this a must-visit South Florida landmark for over a century.",
    dishes: ["Stone Crab Claws", "Key Lime Pie", "Hash Browns", "Coleslaw"],
    score: 88,
    neighborhood: "South Beach",
    tags: ["Seafood", "Local Favorites", "Historic", "Miami Classic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── LITTLE RIVER ──────────────────────────────────────────────────────────
  {
    id: 4263,
    name: "Kojin 2.0",
    address: "8222 NE 2nd Ave, Miami, FL 33138",
    lat: 25.8500659, lng: -80.1927992,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "Contemporary",
    price: 3,
    description: "Michelin Bib Gourmand contemporary restaurant in Little River with a global pantry and bold, playful flavors — an exciting neighborhood destination driving Miami's emerging northern dining scene.",
    dishes: [],
    score: 86,
    neighborhood: "Little River",
    tags: ["Contemporary", "Fusion", "Date Night", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4268,
    name: "Sunny's Steakhouse",
    address: "7357 NW Miami Ct, Miami, FL 33150",
    lat: 25.8429453, lng: -80.1968505,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "Steakhouse",
    price: 4,
    description: "Michelin-selected neighborhood steakhouse in Little River with expertly cooked prime beef, classic sides, and a warm, unpretentious atmosphere that's earned a loyal following in Miami's emerging north neighborhoods.",
    dishes: [],
    score: 82,
    neighborhood: "Little River",
    tags: ["Steakhouse", "Date Night", "Fine Dining"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── CORAL GABLES ──────────────────────────────────────────────────────────
  {
    id: 4264,
    name: "Bachour",
    address: "2020 Salzedo St, Coral Gables, FL 33134",
    lat: 25.7541352, lng: -80.2609398,
    phone: "",
    website: "https://bachourmiami.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Sat 8am–6pm · Sun 8am–5pm",
    cuisine: "Bakery",
    price: 2,
    description: "Michelin-selected patisserie and all-day café from world-renowned pastry chef Antonio Bachour — extraordinary croissants, tarts, cakes, and pastries in a bright Coral Gables setting.",
    dishes: ["Croissants", "Tarts", "Eclairs", "Entremet Cakes"],
    score: 84,
    neighborhood: "Coral Gables",
    tags: ["Bakery", "Breakfast & Brunch", "Coffee", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COCONUT GROVE ─────────────────────────────────────────────────────────
  {
    id: 4265,
    name: "Krüs Kitchen",
    address: "3413 Main Hwy, Miami, FL 33133",
    lat: 25.7275370, lng: -80.2427279,
    phone: "",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "New American",
    price: 3,
    description: "Michelin-starred neighborhood restaurant in Coconut Grove — globally inspired contemporary cooking with local Florida ingredients, a thoughtful natural wine list, and a welcoming, unpretentious atmosphere above Los Félix.",
    dishes: [],
    score: 90,
    neighborhood: "Coconut Grove",
    tags: ["New American", "Contemporary", "Natural Wine", "Date Night", "Fine Dining"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4266,
    name: "Los Félix",
    address: "3413 Main Hwy, Miami, FL 33133",
    lat: 25.7275500, lng: -80.2427500,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Mexican",
    price: 3,
    description: "Michelin Bib Gourmand Mexican restaurant in Coconut Grove celebrating the bold flavors of Mexico City — handmade tortillas, wood-grilled meats, and inventive cocktails in a vibrant, design-forward space.",
    dishes: ["Wood-Grilled Meats", "Handmade Tortillas", "Margaritas"],
    score: 86,
    neighborhood: "Coconut Grove",
    tags: ["Mexican", "Margaritas", "Date Night", "Cocktails"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 4267,
    name: "Chug's Diner",
    address: "3444 Main Hwy, Suite 21, Miami, FL 33133",
    lat: 25.7274930, lng: -80.2433960,
    phone: "",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "",
    cuisine: "Cuban",
    price: 2,
    description: "Michelin Bib Gourmand Cuban diner in Coconut Grove serving elevated takes on classic Cuban comfort food — crispy croquetas, pressed Cubans, and traditional plates in a cheerful, retro-diner setting.",
    dishes: ["Cuban Sandwich", "Croquetas", "Ropa Vieja", "Café Cubano"],
    score: 86,
    neighborhood: "Coconut Grove",
    tags: ["Cuban", "Breakfast & Brunch", "Casual", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 250;

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

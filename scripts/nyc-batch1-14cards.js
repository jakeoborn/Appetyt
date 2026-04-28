/**
 * NYC Batch 1 — 14 new cards (IDs 2025–2038)
 * Venues: Santi, Harry's, The Ned NoMad, L'adresse, Chez Nous, Monkey Bar,
 *         Hillstone, Lure Fishbar, Upland, Quality Bistro, Boucherie West Village,
 *         Crane Club, Brasserie Fouquet's, Riverpark
 * All data from live website fetches + Nominatim geocoding. No training data used.
 * Run: node scripts/nyc-batch1-14cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── MIDTOWN EAST ─────────────────────────────────────────────────────────
  {
    id: 2025,
    name: "Santi",
    address: "11 E 53rd St, New York, NY 10022",
    lat: 40.7600277, lng: -73.9745727,
    phone: "(646) 860-0971",
    website: "https://santinyc.com",
    instagram: "@santinewyorkcity",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Mon–Fri 11:30am–10pm · Sat 5–10pm · Sun closed",
    cuisine: "Italian",
    price: 4,
    description: "Chef Michael White's Italian flagship in Midtown East with a dedicated flour-and-water pasta kitchen — known for artisanal pasta, seafood crudos, arancini, and refined northern Italian cooking.",
    dishes: ["Arancini with Truffle", "Steak Tartare", "Tuna Crudo", "Focaccia", "Fresh Pasta"],
    score: 88,
    neighborhood: "Midtown East",
    tags: ["Fine Dining", "Pasta", "Date Night", "Business Lunch"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 2026,
    name: "Monkey Bar",
    address: "60 E 54th St, New York, NY 10022",
    lat: 40.7598705, lng: -73.9728518,
    phone: "(212) 404-0365",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Daily 11:45am–10:30pm",
    cuisine: "American",
    price: 4,
    description: "Iconic New York dining room with famed Edward Sorel murals serving luxury American cuisine — from otoro tartare with caviar to lobster spaghetti — in a storied Midtown setting since 1936.",
    dishes: ["Otoro Tartare with Caviar", "Truffle Mafaldine", "Dry-Aged NY Strip", "Wagyu Meatballs", "Lobster Spaghetti"],
    score: 88,
    neighborhood: "Midtown East",
    tags: ["Fine Dining", "Classic NYC", "Date Night", "Business Lunch", "Cocktails"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FINANCIAL DISTRICT ────────────────────────────────────────────────────
  {
    id: 2027,
    name: "Harry's New York Bar",
    address: "1 Hanover Square, New York, NY 10004",
    lat: 40.7045901, lng: -74.0097854,
    phone: "(212) 785-9200",
    website: "https://www.harrysbarrestaurant.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Mon & Sun 4–11pm · Tue–Sat 11:30am–midnight",
    cuisine: "American",
    price: 4,
    description: "Wall Street institution since 1972 celebrated for in-house 28-day dry-aged steaks and a legendary tableside-carved Beef Wellington — a trusted Financial District landmark for power lunches and after-work gatherings.",
    dishes: ["Beef Wellington (tableside carved)", "28-Day Dry-Aged Steak", "Oysters", "Tuna Tartare"],
    score: 86,
    neighborhood: "Financial District",
    tags: ["Steakhouse", "Classic NYC", "Business Lunch", "Fine Dining"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOMAD / FLATIRON ──────────────────────────────────────────────────────
  {
    id: 2028,
    name: "The Ned NoMad",
    address: "1170 Broadway, New York, NY 10001",
    lat: 40.7449246, lng: -73.9885960,
    phone: "(212) 722-0555",
    website: "https://thened.com/nomad",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "",
    cuisine: "Italian",
    price: 4,
    description: "A members' club hotel in NoMad featuring Cecconi's Italian restaurant, rooftop bar, and multiple social spaces — a destination for cocktails, dinner, and New York social life in a beautifully restored Beaux-Arts building.",
    dishes: [],
    score: 85,
    neighborhood: "Flatiron / NoMad",
    tags: ["Italian", "Hotel Bar", "Rooftop", "Date Night", "Cocktails"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 2029,
    name: "L'adresse",
    address: "1184 Broadway, New York, NY 10001",
    lat: 40.7456301, lng: -73.9885565,
    phone: "",
    website: "",
    instagram: "@ladressenyc",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "",
    cuisine: "New American",
    price: 3,
    description: "A cozy New American bistro tucked into NoMad celebrating seasonal ingredients through approachable yet refined cuisine with an intimate neighborhood atmosphere.",
    dishes: [],
    score: 82,
    neighborhood: "Flatiron / NoMad",
    tags: ["New American", "Date Night", "Brunch", "Neighborhood Gem"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FLATIRON ──────────────────────────────────────────────────────────────
  {
    id: 2030,
    name: "Hillstone",
    address: "378 Park Ave S, New York, NY 10016",
    lat: 40.7426436, lng: -73.9848488,
    phone: "(212) 689-1090",
    website: "https://hillstonerestaurant.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Fri 11:30am–10pm",
    cuisine: "American",
    price: 3,
    description: "Beloved Flatiron institution serving American comfort classics alongside a full sushi menu — known for consistent quality, a warm energetic atmosphere, and reliable neighborhood dining.",
    dishes: [],
    score: 84,
    neighborhood: "Flatiron",
    tags: ["American", "Business Lunch", "Sushi", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 2031,
    name: "Upland",
    address: "345 Park Ave S, New York, NY 10010",
    lat: 40.7417075, lng: -73.9850339,
    phone: "(212) 686-1006",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Lunch Mon–Fri 11:30am–3pm · Brunch Sat–Sun 11:30am–3pm · Dinner Sun–Thu 5–10pm · Fri–Sat 5–11pm",
    cuisine: "New American",
    price: 3,
    description: "California-inspired New American restaurant in the Flatiron known for roasted meats, wood-fired dishes, and handmade pasta — a lively spot with serious food and excellent cocktails.",
    dishes: ["Cheeseburger", "Fire Roasted Salmon", "Bucatini Cacio e Pepe", "Margherita Pizza"],
    score: 86,
    neighborhood: "Flatiron",
    tags: ["New American", "Brunch", "Date Night", "Cocktails", "Pizza"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── GREENWICH VILLAGE ─────────────────────────────────────────────────────
  {
    id: 2032,
    name: "Chez Nous",
    address: "5 W 8th St, New York, NY 10011",
    lat: 40.7326372, lng: -73.9968132,
    phone: "(212) 321-0111",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Daily 7am–11pm",
    cuisine: "French",
    price: 3,
    description: "Classic French bistro in the historic Marlton Hotel in Greenwich Village — serving rotisserie chicken, king salmon, and refined French classics all day in an intimate, warmly lit setting.",
    dishes: ["Poulet Rotisserie", "Ora King Salmon", "Tagliatelle Homard", "NY Strip"],
    score: 85,
    neighborhood: "Greenwich Village",
    tags: ["French", "Date Night", "Brunch", "Hotel"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── SOHO ──────────────────────────────────────────────────────────────────
  {
    id: 2033,
    name: "Lure Fishbar",
    address: "142 Mercer St, New York, NY 10012",
    lat: 40.7249072, lng: -73.9982343,
    phone: "",
    website: "https://lurefishbar.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Dinner Mon–Sat 5–10pm · Sun 4–9pm · Brunch Sat–Sun 11:30am–4pm",
    cuisine: "Seafood",
    price: 4,
    description: "Nautically designed SoHo seafood destination with an extensive raw bar, creative fish preparations, sea urchin pasta, and a full sushi menu — a beloved neighborhood institution for oceanic indulgence.",
    dishes: ["Sea Urchin Bucatini with Crab", "Crispy Asian Snapper for Two", "Branzino St. Tropez", "Classic Lobster Roll", "Shellfish Plateau"],
    score: 87,
    neighborhood: "SoHo",
    tags: ["Seafood", "Sushi", "Date Night", "Raw Bar"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MIDTOWN WEST ──────────────────────────────────────────────────────────
  {
    id: 2034,
    name: "Quality Bistro",
    address: "120 W 55th St, New York, NY 10019",
    lat: 40.7632322, lng: -73.9788560,
    phone: "(212) 433-3330",
    website: "",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "",
    cuisine: "French",
    price: 4,
    description: "A grand French brasserie in Midtown with dramatic Belle Époque décor, an expansive raw bar, and classic French fare from Dover sole meunière to chateaubriand — executed at a grand scale.",
    dishes: ["Corn Crème Brûlée", "Chateaubriand", "Black Truffle Cacio e Pepe", "Dover Sole Meunière", "Moroccan Fried Chicken"],
    score: 87,
    neighborhood: "Midtown West",
    tags: ["French", "Fine Dining", "Business Lunch", "Date Night", "Raw Bar"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── WEST VILLAGE ──────────────────────────────────────────────────────────
  {
    id: 2035,
    name: "Boucherie West Village",
    address: "99 7th Ave S, New York, NY 10014",
    lat: 40.7330542, lng: -74.0029005,
    phone: "(212) 837-1616",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Mon–Fri 11am–midnight · Sat–Sun 10am–midnight",
    cuisine: "French",
    price: 4,
    description: "A Parisian-style steakhouse and brasserie in the West Village with meats aged in-house — classic steak frites, rich braises, and côte de boeuf for two in a lively neighborhood bistro setting.",
    dishes: ["Steak Frites", "Entrecôte Grillée", "Lobster Linguine", "Boeuf Bourguignon", "Côte de Boeuf pour Deux"],
    score: 87,
    neighborhood: "West Village",
    tags: ["French", "Steakhouse", "Date Night", "Brunch", "Cocktails"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MEATPACKING DISTRICT ──────────────────────────────────────────────────
  {
    id: 2036,
    name: "Crane Club",
    address: "85 10th Ave, New York, NY 10011",
    lat: 40.7434562, lng: -74.0075595,
    phone: "(212) 970-2200",
    website: "",
    instagram: "@craneclubrestaurant",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Wed 5–10pm · Thu–Sat 5–11pm · Sun closed",
    cuisine: "American",
    price: 4,
    description: "Chef Melissa Rodriguez's wood-fire American restaurant by Tao Group on the High Line — serving charred vegetables, wood-smoked shellfish, and prime beef in a dramatic West Chelsea setting.",
    dishes: ["Charred Lobster Salad", "Wood-Smoked Clams", "Beef Short Rib", "Shrimp Crudo"],
    score: 90,
    neighborhood: "Meatpacking District",
    tags: ["Fine Dining", "Date Night", "Wood Fire", "American", "Chef Driven"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── TRIBECA ───────────────────────────────────────────────────────────────
  {
    id: 2037,
    name: "Brasserie Fouquet's",
    address: "456 Greenwich St, New York, NY 10013",
    lat: 40.7236343, lng: -74.0096105,
    phone: "(917) 965-2584",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Dinner Sun–Thu 5–10pm · Fri–Sat 5–11pm · Brunch Sat–Sun 7:30am–4pm",
    cuisine: "French",
    price: 4,
    description: "A reimagining of the legendary Champs-Élysées brasserie founded in 1899, now in Tribeca at Hôtel Barrière — serving classic French cuisine in an art deco setting that evokes the grandeur of Paris.",
    dishes: [],
    score: 87,
    neighborhood: "Tribeca",
    tags: ["French", "Fine Dining", "Date Night", "Brunch", "Hotel"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── GRAMERCY ──────────────────────────────────────────────────────────────
  {
    id: 2038,
    name: "Riverpark",
    address: "450 E 29th St, New York, NY 10016",
    lat: 40.7395197, lng: -73.9734647,
    phone: "(212) 706-4131",
    website: "",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Mon–Fri 11:30am–3pm & 4–9pm",
    cuisine: "New American",
    price: 3,
    description: "A relaxed New American restaurant on the East River with a working farm garden supplying the kitchen — a peaceful respite serving seasonal American cuisine overlooking the waterfront.",
    dishes: [],
    score: 83,
    neighborhood: "Gramercy",
    tags: ["New American", "Waterfront", "Business Lunch", "Outdoor Seating"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 971;

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

// Verify count
const m2 = html.match(/const NYC_DATA\s*=\s*\[/);
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
console.log(`NYC card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new NYC cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

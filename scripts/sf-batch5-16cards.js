/**
 * SF Batch 5 — 16 new cards (IDs 5137–5152)
 * Sources: hi neighbor group, flour+water hospitality, mina group, bacchus management,
 *          proof positive, absinthe group, outer sunset/richmond sub-agent research.
 * All data from official website fetches. Kaiyō/Whitechapel/Horsefeather skipped (site down / events-only / no verified address).
 * Run: node scripts/sf-batch5-16cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── OUTER SUNSET ─────────────────────────────────────────────────────────
  {
    id: 5137,
    name: "Thanh Long",
    address: "4101 Judah St, San Francisco, CA 94122",
    lat: 37.7603, lng: -122.5061,
    phone: "(415) 665-1146",
    website: "https://www.thanhlongsf.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/r/thanh-long-reservations-san-francisco",
    hours: "Wed–Thu & Sun 4:30–8pm · Fri–Sat 4:30–8:45pm · Mon–Tue closed",
    cuisine: "Vietnamese",
    price: 3,
    description: "SF's first Vietnamese restaurant (est. 1971), the original home of AN's Famous Garlic Noodles and Garlic Roasted Dungeness Crab, still family-run in the Outer Sunset after 50+ years.",
    dishes: ["AN's Famous Garlic Roasted Dungeness Crab", "AN's Famous Garlic Noodles", "Colossal Royal Tiger Prawns", "Shaken Beef"],
    score: 88,
    neighborhood: "Outer Sunset",
    tags: ["Seafood", "Vietnamese", "Local Favorites", "Iconic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── INNER SUNSET ─────────────────────────────────────────────────────────
  {
    id: 5138,
    name: "Ebisu",
    address: "1283 9th Ave, San Francisco, CA 94122",
    lat: 37.7644, lng: -122.4665,
    phone: "(415) 566-1770",
    website: "https://ebisusushi.com",
    instagram: "@ebisu_sushi_sf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Tue–Sat 11:30am–2pm & 5–9pm · Sun–Mon closed",
    cuisine: "Japanese",
    price: 2,
    description: "Family-owned Inner Sunset sushi institution for 40+ years, celebrated for ultra-fresh fish, a long specialty roll menu, and consistently lively lines that move fast — no reservations required.",
    dishes: ["10-piece nigiri omakase set", "Dragon Roll", "Romeo Juliet Roll", "Chirashi platter"],
    score: 83,
    neighborhood: "Inner Sunset",
    tags: ["Sushi", "Local Favorites"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5139,
    name: "San Tung",
    address: "1031 Irving St, San Francisco, CA 94122",
    lat: 37.7637, lng: -122.4690,
    phone: "(415) 242-0828",
    website: "https://www.santungsf.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon & Thu–Sun 11am–3pm & 4:30–8:30pm · Tue–Wed closed",
    cuisine: "Chinese",
    price: 2,
    description: "Est. 1986, this Inner Sunset staple is renowned citywide for its cult-favorite dry fried chicken wings and handmade Northern Chinese dumplings — rated Top 21 Best Wings in America, drawing weekend waits of up to two hours.",
    dishes: ["Original Dry Fried Chicken Wings", "Noodles with Black Bean Sauce", "Shrimp & Chive Dumplings", "Honey Walnut Prawn"],
    score: 87,
    neighborhood: "Inner Sunset",
    tags: ["Chinese", "Local Favorites", "Iconic"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── OUTER RICHMOND ───────────────────────────────────────────────────────
  {
    id: 5140,
    name: "Dragon Beaux",
    address: "5700 Geary Blvd, San Francisco, CA 94121",
    lat: 37.7805, lng: -122.4806,
    phone: "(415) 333-8899",
    website: "https://dragonbeaux.com",
    instagram: "@dragonbeaux",
    reservation: "Yelp",
    reserveUrl: "https://dragonbeaux.com/reservations",
    hours: "Mon–Fri 11am–3pm & 5–8:45pm · Sat–Sun 10am–3pm & 5–8:45pm",
    cuisine: "Chinese",
    price: 3,
    description: "From the owners of Koi Palace, this upscale Outer Richmond dim sum spot puts a creative spin on classics — colored soup dumplings by day, premium hot pot by night. Michelin Guide noted.",
    dishes: ["Rainbow Soup Dumplings (five colored skins)", "Sea Bass Dumplings", "Baked BBQ Pork Puff Pastry", "Winter Melon Hot Pot with Roasted Squab"],
    score: 88,
    neighborhood: "Outer Richmond",
    tags: ["Dim Sum", "Chinese", "Brunch"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5141,
    name: "PPQ Dungeness Island",
    address: "5821 Geary Blvd, San Francisco, CA 94121",
    lat: 37.7800, lng: -122.4820,
    phone: "(415) 386-8266",
    website: "https://ppqcrabsf.com",
    instagram: "",
    reservation: "Yelp",
    reserveUrl: "https://www.yelp.com/reservations/ppq-dungeness-island-san-francisco",
    hours: "Wed–Fri 4–9pm · Sat–Sun noon–9pm · Mon–Tue closed",
    cuisine: "Vietnamese",
    price: 3,
    description: "Outer Richmond seafood destination specializing in whole Dungeness crab and Maine lobster prepared eight different ways, anchored by the iconic house garlic noodles.",
    dishes: ["Dungeness Crab (8 preparations)", "Maine Lobster", "House Garlic Noodle", "Crab Garlic Noodle"],
    score: 84,
    neighborhood: "Outer Richmond",
    tags: ["Seafood", "Vietnamese"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── INNER RICHMOND ───────────────────────────────────────────────────────
  {
    id: 5142,
    name: "Pho Huynh Sang",
    address: "239 Clement St, San Francisco, CA 94118",
    lat: 37.7830, lng: -122.4619,
    phone: "(415) 379-9008",
    website: "https://phohuynhsang.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/r/pho-huynh-sang-vietnamese-cuisine-san-francisco",
    hours: "Tue–Sun 11am–3:30pm & 5:30–9pm · Mon closed",
    cuisine: "Vietnamese",
    price: 2,
    description: "A beloved Clement Street pho house serving rich, authentic Vietnamese noodle soups and vermicelli dishes with a loyal Inner Richmond following.",
    dishes: ["Pho Tai Chin Gan Bo Vien", "Bun Bo Hue Spicy Beef Noodle Soup", "Pho Mi Hai San", "Bun Bo Xao"],
    score: 80,
    neighborhood: "Inner Richmond",
    tags: ["Vietnamese", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FILLMORE ─────────────────────────────────────────────────────────────
  {
    id: 5143,
    name: "7 Adams",
    address: "1963 Sutter St, San Francisco, CA 94115",
    lat: 37.7861, lng: -122.4326,
    phone: "(415) 655-9154",
    website: "https://www.7adamsrestaurant.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "https://resy.com/cities/sf/7-adams",
    hours: "Mon–Thu 5:30–9pm · Fri–Sat 5–10pm · Sun 5–9pm",
    cuisine: "American",
    price: 4,
    description: "Michelin-starred Fillmore tasting menu destination from chefs David and Serena Fisher, with seasonal California-driven cuisine in three formats: 5-course dinner ($87), 7-course menu ($127), or immersive 8–10 course chef's counter ($157).",
    dishes: [],
    score: 92,
    neighborhood: "Fillmore",
    tags: ["Fine Dining", "Michelin Star", "Tasting Menu", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── UNION SQUARE ─────────────────────────────────────────────────────────
  {
    id: 5144,
    name: "Bourbon Steak",
    address: "335 Powell St, San Francisco, CA 94102",
    lat: 37.7877, lng: -122.4090,
    phone: "(415) 770-0291",
    website: "https://michaelmina.net/restaurants/bourbon-steak-san-francisco",
    instagram: "",
    reservation: "SevenRooms",
    reserveUrl: "https://www.sevenrooms.com/explore/bourbonsteaksanfrancisco/reservations/create/search",
    hours: "Mon–Thu & Sun 5–9pm · Fri–Sat 5–10pm",
    cuisine: "Steakhouse",
    price: 4,
    description: "Michael Mina's modern California steakhouse at the Westin St. Francis on Union Square, featuring premium dry-aged beef, refined California seafood, and signature tableside presentations.",
    dishes: [],
    score: 88,
    neighborhood: "Union Square",
    tags: ["Steakhouse", "Fine Dining", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FINANCIAL DISTRICT ───────────────────────────────────────────────────
  {
    id: 5145,
    name: "The Vault Steakhouse",
    address: "555 California St, San Francisco, CA 94104",
    lat: 37.7921, lng: -122.4037,
    phone: "(415) 508-4675",
    website: "https://www.vaultsteakhouse.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/r/the-vault-steakhouse-reservations-san-francisco",
    hours: "Mon–Fri 4–9pm · Sat 5–9pm · Sun closed",
    cuisine: "Steakhouse",
    price: 4,
    description: "A modern steakhouse housed inside the former Bank of America vault at 555 California, with live piano nightly and classic-to-progressive steakhouse dining in a dramatic underground space.",
    dishes: [],
    score: 85,
    neighborhood: "Financial District",
    tags: ["Steakhouse", "Fine Dining", "Live Music", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5146,
    name: "The Vault Garden",
    address: "555 California St, San Francisco, CA 94104",
    lat: 37.7921, lng: -122.4037,
    phone: "(415) 508-4675",
    website: "https://www.vaultgarden.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/r/the-vault-restaurant-reservations-san-francisco",
    hours: "Mon–Fri 11:30am–9pm · Sat–Sun closed",
    cuisine: "American",
    price: 3,
    description: "An urban outdoor retreat on the plaza of 555 California offering contemporary American dining in a heated, covered space — ideal for FiDi business lunches and after-work gatherings with daily happy hour.",
    dishes: ["Heirloom Tomato Panzanella Salad"],
    score: 78,
    neighborhood: "Financial District",
    tags: ["Lunch", "Outdoor", "Happy Hour"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── POTRERO HILL ─────────────────────────────────────────────────────────
  {
    id: 5147,
    name: "La Connessa",
    address: "1695 Mariposa St, San Francisco, CA 94107",
    lat: 37.7636, lng: -122.4003,
    phone: "(628) 221-0123",
    website: "https://www.laconnessa.com",
    instagram: "@laconnessa",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/r/la-connessa-reservations-san-francisco",
    hours: "Dinner nightly · check website for current hours",
    cuisine: "Italian",
    price: 3,
    description: "A Potrero Hill Italian restaurant with a wood-fired menu spanning housemade focaccia, handmade pasta, and whole fish — notable for Tajarin al Nero with Fort Bragg uni and the classic Agnolotti del Plin.",
    dishes: ["Focaccia di Recco", "Tajarin al Nero with Fort Bragg Uni", "Agnolotti del Plin", "Tagliatelle Bolognese", "Bavette Tagliata"],
    score: 85,
    neighborhood: "Potrero Hill",
    tags: ["Italian", "Pasta", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NORTH BEACH ──────────────────────────────────────────────────────────
  {
    id: 5148,
    name: "Flour + Water Pizzeria",
    address: "532 Columbus Ave, San Francisco, CA 94133",
    lat: 37.8001, lng: -122.4096,
    phone: "",
    website: "https://www.fwpizzeria.com",
    instagram: "",
    reservation: "Resy",
    reserveUrl: "https://resy.com/cities/san-francisco-ca/venues/fw-pizzeria-north-beach",
    hours: "Daily 11:30am–10pm",
    cuisine: "Italian",
    price: 2,
    description: "The Flour+Water group's North Beach outpost serving Neapolitan-style pizza crafted from cold-fermented dough — a casual dine-in experience on Columbus Avenue for daily pizza parties.",
    dishes: [],
    score: 82,
    neighborhood: "North Beach",
    tags: ["Pizza", "Italian", "Casual"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MISSION ──────────────────────────────────────────────────────────────
  {
    id: 5149,
    name: "Flour + Water Pasta Shop",
    address: "3000 20th St, San Francisco, CA 94110",
    lat: 37.7592, lng: -122.4110,
    phone: "",
    website: "https://www.flourandwaterpastashop.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 11:30am–5:30pm",
    cuisine: "Italian",
    price: 2,
    description: "A daytime pasta production space and lunch spot in the Mission courtyard shared with Penny Roma, where artisans hand-make fresh pasta daily and serve sandwiches and hot pasta dishes through the afternoon.",
    dishes: [],
    score: 78,
    neighborhood: "Mission",
    tags: ["Pasta", "Italian", "Lunch", "Casual"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COW HOLLOW ───────────────────────────────────────────────────────────
  {
    id: 5150,
    name: "Morella",
    address: "2001 Chestnut St, San Francisco, CA 94123",
    lat: 37.8006, lng: -122.4364,
    phone: "(628) 286-9698",
    website: "https://www.morellasf.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/r/morella-san-francisco",
    hours: "Tue–Wed 4:30–10pm · Thu–Fri 4:30pm–late · Sat brunch 11am–3pm & dinner 4:30pm–late · Sun brunch 11am–3pm & dinner 4:30–9pm · Mon closed",
    cuisine: "Argentine",
    price: 3,
    description: "A Cow Hollow restaurant celebrating the gastronomic fusion of Italian and Argentine culinary traditions — traditional empanadas, wood-smoked meats, house-made pastas, and cocktails on Chestnut Street.",
    dishes: ["Dungeness Crab Sorrentinos", "Carbonara", "Lamb Chops", "Asado Octopus Salad", "Empanadas"],
    score: 84,
    neighborhood: "Cow Hollow",
    tags: ["Argentine", "Pasta", "Brunch", "Late Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── HAYES VALLEY ─────────────────────────────────────────────────────────
  {
    id: 5151,
    name: "Arbor",
    address: "384 Hayes St, San Francisco, CA 94102",
    lat: 37.7770, lng: -122.4227,
    phone: "(415) 626-1211",
    website: "https://arborsf.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 11:30am–9pm",
    cuisine: "American",
    price: 1,
    description: "A fast-casual Hayes Valley neighborhood spot with organic, locally-sourced California-American fare — solid Niman Ranch burgers, a vegan burger, and fried-chicken sandwich at approachable prices.",
    dishes: ["Arbor Cheeseburger", "Vegan Burger", "Fried-Chicken Sandwich", "Cheesy Mushroom Fries"],
    score: 77,
    neighborhood: "Hayes Valley",
    tags: ["Burgers", "Casual", "Vegetarian-Friendly"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── SOMA ─────────────────────────────────────────────────────────────────
  {
    id: 5152,
    name: "Bosco",
    address: "888 Brannan St, San Francisco, CA 94103",
    lat: 37.7720, lng: -122.4054,
    phone: "(415) 430-6580",
    website: "https://www.boscosf.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "https://www.opentable.com/booking/restref/availability?lang=en-US&restRef=1464586",
    hours: "Tue–Thu 5–9pm · Fri–Sat 5–10pm",
    cuisine: "Italian",
    price: 3,
    description: "A contemporary Italian restaurant in SoMa's Brannan corridor serving house bolognese, meatballs, and seasonal pastas alongside an extensive cocktail and wine program.",
    dishes: ["Bosco Bolognese", "Bosco Meatballs"],
    score: 80,
    neighborhood: "SoMa",
    tags: ["Italian", "Pasta", "Dinner"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ─── INSERT ──────────────────────────────────────────────────────────────────
const PREV_COUNT = 136;

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
const closeIdx = pos - 1; // index of closing ]

const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify count
const m2 = html.match(/const SF_DATA\s*=\s*\[/);
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
console.log(`SF card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new SF cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

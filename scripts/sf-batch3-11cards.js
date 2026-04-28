/**
 * SF Batch 3 — 11 new cards (IDs 5106–5116)
 * Neighborhoods: Potrero Hill, Cole Valley, Haight-Ashbury, NoPa,
 * Castro (×2), SoMa (×2), Mission, Fort Mason, Embarcadero
 *
 * Skipped (closed): Aperto (Nov 2025), Ragazza (Mar 2025)
 * Skipped (already in SF_DATA): Lazy Bear, Cotogna, Tartine Manufactory
 * Run: node scripts/sf-batch3-11cards.js
 */

'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── POTRERO HILL ──────────────────────────────────────────────────────────
  {
    id: 5106,
    name: "Chez Maman",
    address: "1401 18th St, San Francisco, CA 94107",
    lat: 37.7625, lng: -122.3967,
    phone: "(415) 655-9542",
    website: "chezmamanrestos.com",
    instagram: "@chezmamansf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri 11:30am–10pm | Sat–Sun brunch 10:30am–3pm, dinner to 10pm",
    cuisine: "French",
    price: 2,
    description: "A beloved Potrero Hill institution since 2002 where genuine French comfort cooking meets an unpretentious neighborhood bistro. Crepes both savory and sweet, duck confit, moules poulette, steak frites — the kind of meal that feels like being invited to a French friend's apartment without the airline ticket.",
    dishes: ["Savory and sweet crepes", "French Onion Soup", "Duck Confit", "Steak Frites", "Moules Poulette (mussels)"],
    score: 82,
    neighborhood: "Potrero Hill",
    tags: ["French", "Brunch", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COLE VALLEY ───────────────────────────────────────────────────────────
  {
    id: 5107,
    name: "Zazie",
    address: "941 Cole St, San Francisco, CA 94117",
    lat: 37.7653, lng: -122.4501,
    phone: "(415) 564-5332",
    website: "zaziesf.com",
    instagram: "@zazie_sf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Daily brunch 9am–3pm (walk-in only) | Dinner Mon–Sun (OpenTable)",
    cuisine: "French",
    price: 2,
    description: "Cole Valley's quintessential neighborhood brunch — Provençal French cooking and American comfort in a cafe that runs tip-free, with menu prices that reflect living wages and full benefits for staff. Gingerbread pancakes and lemon ricotta miracle pancakes for weekend walks-in; cassoulet and classic French bistro for dinner.",
    dishes: ["Eggs Benedict with smoked salmon", "Gingerbread pancakes", "Miracle pancakes with lemon ricotta", "French toast", "Cassoulet (dinner)"],
    score: 82,
    neighborhood: "Cole Valley",
    tags: ["Brunch", "French", "Local Favorites"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── HAIGHT-ASHBURY ────────────────────────────────────────────────────────
  {
    id: 5108,
    name: "Magnolia Brewing",
    address: "1398 Haight St, San Francisco, CA 94117",
    lat: 37.7703, lng: -122.4452,
    phone: "(415) 864-7468",
    website: "magnoliabrewing.com",
    instagram: "@magnoliahaight",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Wed 11:30am–9pm | Thu–Fri 11:30am–10pm | Sat 11am–10pm | Sun 11am–9pm | Bar stays open later",
    cuisine: "American",
    price: 1,
    description: "A Haight & Masonic cornerstone since 1997 in a 1903 building — recently restored to local ownership and still brewing everything in-house. Craft ales from Proving Ground IPA to Kalifornia Kölsch, plus double smashburgers and cochinita pibil tacos in the neighborhood's most authentic brewpub.",
    dishes: ["Proving Ground IPA (house-brewed)", "Kalifornia Kölsch", "LSD (Lemon Safe Daiquiri) with lavender", "Double Smashburgers with salsa fresca", "Cochinita Pibil Tacos"],
    score: 81,
    neighborhood: "Haight-Ashbury",
    tags: ["Brewery", "Casual", "Local Favorites"],
    indicators: ["brewery"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOPA ──────────────────────────────────────────────────────────────────
  {
    id: 5109,
    name: "Nopalito",
    address: "306 Broderick St, San Francisco, CA 94117",
    lat: 37.7734, lng: -122.4390,
    phone: "(415) 437-0303",
    website: "nopalitosf.com",
    instagram: "@nopalitosf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Tue, Thu–Sun 11:30am–9pm | Wed 4:30pm–9pm",
    cuisine: "Mexican",
    price: 1,
    description: "Chef Gonzalo Guzman's James Beard-nominated celebration of his mother's Veracruz kitchen, built on organic masa, house-made chorizo, and ingredients that wouldn't embarrass any taquería in Mexico City. No compromises: traditional mole poblano, crunchy totopos con chile, tacos de pescado — all from scratch in the NoPa neighborhood.",
    dishes: ["Mole Poblano con Pollo", "Chile Rellenos (roasted poblano with cheese)", "Torta de Chilorio (chorizo, queso fresco, adobo bread)", "Totopos con Chile", "Tacos de Pescado"],
    score: 87,
    neighborhood: "NoPa",
    tags: ["Mexican", "Local Favorites", "James Beard Nominated"],
    indicators: ["vegetarian", "hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── CASTRO ────────────────────────────────────────────────────────────────
  {
    id: 5110,
    name: "Blackbird Bar",
    address: "2124 Market St, San Francisco, CA 94114",
    lat: 37.7672, lng: -122.4296,
    phone: "(415) 872-5310",
    website: "blackbirdbar.com",
    instagram: "@blackbirdbarsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon 5pm–11pm | Tue–Thu 5pm–12am | Fri 4pm–2am | Sat 2pm–2am | Sun 2pm–11pm | Happy Hour Mon–Fri 5–8pm",
    cuisine: "Cocktails",
    price: 2,
    description: "A literary-themed cocktail bar on Market Street where the craft drinks are as considered as the aesthetic is understated. The Leather Bound Book (rye, bourbon, cardamaro, absinthe, tobacco bitters) and Where There's Smoke, There's Fire (mezcal, habanero jam, Aperol) are among Castro's most thoughtful pours.",
    dishes: ["Leather Bound Book (rye, bourbon, cardamaro, absinthe, tobacco bitters)", "Where There's Smoke, There's Fire (mezcal, Aperol, habanero jam)", "The Peruvian Lady (pisco, amaro nonino, plum bitters)", "The Georgia Gentleman (bourbon, peach jam, lavender)", "Early Bird (vodka, elderflower, lemon)"],
    score: 82,
    neighborhood: "Castro",
    tags: ["Cocktails", "Happy Hour", "Date Night"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5111,
    name: "Twin Peaks Tavern",
    address: "401 Castro St, San Francisco, CA 94114",
    lat: 37.7624, lng: -122.4350,
    phone: "(415) 864-9470",
    website: "twinpeakstavern.com",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Wed 12pm–2am | Sun 10am–2am | Thu–Sat varies",
    cuisine: "Bar",
    price: 1,
    description: "A Castro cornerstone since 1935 and a landmark in LGBTQ+ history: when the bar installed its then-radical floor-to-ceiling windows in 1972, it made queer life visible on the street at a time when gay bars hid behind blacked-out glass. Classic cocktails and beers at the corner of Market and Castro, conversation-forward with no food service.",
    dishes: ["Classic cocktails", "Draft beers", "Signature house drinks"],
    score: 83,
    neighborhood: "Castro",
    tags: ["Historic", "Iconic", "Local Favorites"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── SOMA ─────────────────────────────────────────────────────────────────
  {
    id: 5112,
    name: "Saison",
    address: "178 Townsend St, San Francisco, CA 94107",
    lat: 37.7707, lng: -122.4030,
    phone: "415-828-7990",
    website: "saisonsf.com",
    instagram: "@saisonsf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Thu 5:30pm–9pm | Fri–Sat 5pm–9pm | Closed Sun–Mon",
    cuisine: "Fine Dining",
    price: 4,
    description: "Two-Michelin-starred open wood-fire tasting menu in SoMa where Chef Richard Lee sends nearly every dish through live flame. Ember-grilled trout with crackling skin, sea urchin with charred sourdough and brown butter, smoked cod — a singular focus on terroir and what fire does to great California ingredients. Reservations released the 1st of each month.",
    dishes: ["Sea urchin with grilled sourdough, brown butter, tamari", "Charred cabbage with wood-fire embers", "Wood-grilled trout with crackling skin", "Wagyu beef over coals", "Smoked cod preparation"],
    score: 95,
    neighborhood: "SoMa",
    tags: ["Fine Dining", "Michelin Star", "Date Night", "Tasting Menu"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5113,
    name: "Benu",
    address: "22 Hawthorne St, San Francisco, CA 94105",
    lat: 37.7855, lng: -122.3991,
    phone: "(415) 685-4860",
    website: "benusf.com",
    instagram: "@benu_sf",
    reservation: "Tock",
    reserveUrl: "",
    hours: "Tue–Sat dinner | Closed Sun–Mon",
    cuisine: "Fine Dining",
    price: 4,
    description: "San Francisco's first three-Michelin-star restaurant. Chef Corey Lee's personal tasting menu opens with a thousand-year-old quail egg and builds through a deeply Korean-inflected lens: soup dumplings, XO-sauced BBQ quail, a wine list with 300+ selections. The most culturally specific and emotionally resonant fine dining room in the city.",
    dishes: ["Thousand-year-old quail egg (opening course)", "Xiao long bao (soup dumplings)", "Korean beef barbecue with house XO sauce", "Barbecued quail", "Seasonal seafood, vegetable, and meat tasting progression"],
    score: 98,
    neighborhood: "SoMa",
    tags: ["Fine Dining", "Michelin Star", "Tasting Menu", "Date Night", "Critics Pick"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MISSION ───────────────────────────────────────────────────────────────
  {
    id: 5114,
    name: "Sons & Daughters",
    address: "2875 18th St, San Francisco, CA 94103",
    lat: 37.7617, lng: -122.4108,
    phone: "(415) 994-7933",
    website: "sonsanddaughterssf.com",
    instagram: "@sonsanddaughterssf",
    reservation: "Tock",
    reserveUrl: "",
    hours: "Tue–Sat 5:30pm–8pm | Closed Sun–Mon",
    cuisine: "Fine Dining",
    price: 4,
    description: "Two-Michelin-starred New Nordic tasting menu, relocated in 2025 to a Mission District space with an expanded kitchen and open-kitchen dining room. Seasonality and sustainability drive every course — Northern California produce through classical European technique. The $315 menu is among the city's most refined evenings.",
    dishes: ["Seasonal New Nordic tasting menu ($315)", "Northern California produce compositions", "Open-kitchen counter experience", "Curated wine program"],
    score: 94,
    neighborhood: "Mission",
    tags: ["Fine Dining", "Michelin Star", "Tasting Menu", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FORT MASON ────────────────────────────────────────────────────────────
  {
    id: 5115,
    name: "The Interval at Long Now",
    address: "2 Marina Blvd, San Francisco, CA 94123",
    lat: 37.8069, lng: -122.4322,
    phone: "(415) 561-6582",
    website: "longnow.org/interval",
    instagram: "@theinterval",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon 5pm–10pm | Tue–Fri 10am–11pm | Sat 5pm–11pm | Sun 3pm–10pm",
    cuisine: "Cocktails",
    price: 2,
    description: "Home of the Long Now Foundation: an award-winning bar-café-museum at Fort Mason with floor-to-ceiling library shelves, a mechanical orrery by Brian Eno, and an exhibitions program designed around 10,000-year thinking. The craft cocktail program honors classical traditions; the room is the best place in the city for a conversation that actually goes somewhere.",
    dishes: ["Classical and seasonal craft cocktails", "Artisan coffee and tea", "Evolving cocktail menu built on classical techniques"],
    score: 85,
    neighborhood: "Fort Mason",
    tags: ["Cocktails", "Iconic", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── EMBARCADERO ───────────────────────────────────────────────────────────
  {
    id: 5116,
    name: "Hog Island Oyster Co.",
    address: "1 Ferry Building, San Francisco, CA 94111",
    lat: 37.7955, lng: -122.3935,
    phone: "(415) 391-7117",
    website: "hogislandoysters.com",
    instagram: "@hogislandoysterco",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–8pm | Fri–Sun 11am–8pm",
    cuisine: "Seafood",
    price: 2,
    description: "The Tomales Bay oyster farm's San Francisco home in the historic Ferry Building, with floor-to-ceiling windows over the bay and Bay Bridge. A raw bar of impeccably fresh Sweetwater, Peale Passage, and Harstine Island oysters alongside clam chowder, steamed clams, and craft cocktails — the city's most scenic place to eat a dozen.",
    dishes: ["Hog Island Sweetwater oysters", "Atlantic and Pacific oyster selection (Peale Passage, Harstine Island, Glacier Point)", "Oyster stew", "Steamed clams", "House clam chowder"],
    score: 88,
    neighborhood: "Embarcadero",
    tags: ["Seafood", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ── Insert logic (same as sf-batch2-32cards.js) ───────────────────────────
const html = fs.readFileSync(FILE, 'utf8');
const declarationPattern = /const SF_DATA\s*=\s*\[/g;
let match;
const positions = [];
while ((match = declarationPattern.exec(html)) !== null) positions.push(match.index);

if (!positions.length) { console.error('SF_DATA not found'); process.exit(1); }
console.log(`Found ${positions.length} SF_DATA declaration(s)`);

const cardJson = NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
const insertBlock = ',\n' + cardJson;
let output = html;
let offset = 0;

for (let i = positions.length - 1; i >= 0; i--) {
  const pos = positions[i] + offset;
  let depth = 0, inStr = false, escape = false, insertAt = -1;
  for (let j = pos; j < output.length; j++) {
    const ch = output[j];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inStr) { escape = true; continue; }
    if (ch === '"' && !escape) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) { insertAt = j; break; } }
  }
  if (insertAt === -1) { console.error('Could not find closing ]'); process.exit(1); }
  output = output.slice(0, insertAt) + insertBlock + '\n' + output.slice(insertAt);
  offset += insertBlock.length + 1;
}

const sfStart = output.indexOf('const SF_DATA');
const sfEnd = output.indexOf('];', sfStart);
const block = output.slice(sfStart, sfEnd);
const cardCount = [...block.matchAll(/"id":\d+/g)].length;
console.log(`SF card count after insert: ${cardCount} (expected ${105 + NEW_CARDS.length})`);

if (cardCount !== 105 + NEW_CARDS.length) { console.error('Count mismatch'); process.exit(1); }

fs.writeFileSync(FILE, output, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new SF cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

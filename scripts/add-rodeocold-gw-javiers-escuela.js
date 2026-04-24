#!/usr/bin/env node
/*
 * Appends:
 *   DALLAS_DATA:
 *     - #9215 Rodeo Cold (Lower Greenville, Western-themed neighborhood bar from Green Light Social team)
 *   LA_DATA:
 *     - #2537 Great White (Venice, flagship)
 *     - #2538 Great White (Larchmont)
 *     - #2539 Great White (West Hollywood)
 *     - #2540 Great White (Brentwood)
 *     - #2541 Great White (Studio City)
 *     - #2542 Javier's Century City (upscale Mexican)
 *     - #2543 Escuela Taqueria (Beverly Grove, sustainable tacos)
 *
 * Inserts into both the live script copy AND the static script #2 mirror so
 * both HOUSTON_DATA-style regressions can't desync (per CLAUDE.md memory
 * rules re: cross-script duplication).
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(FILE, 'utf8');

const VERIFIED = '2026-04-24';

const rodeoCold = {
  id: 9215,
  name: "Rodeo Cold",
  cuisine: "American / Bar",
  neighborhood: "Lower Greenville",
  score: 84,
  price: 2,
  tags: ["Bar", "American", "Comfort Food", "Trending", "Patio"],
  indicators: ["new-opening"],
  group: "",
  hh: "",
  reservation: "walk-in",
  awards: "",
  description: "East Dallas neighborhood bar from the Green Light Social team, opened late 2025 in the former Eastbound & Down space. '70s Western twang — saloon vibe, wood-paneled walls, ice-chest-cold beer. Chef-driven comfort menu: Wagyu steak fingers with gravy, Texas chili, burgers, hot dogs, Frito pies, plus State Fair riffs like corn nuggets, corn dogs, and deep-fried oatmeal cream pies. Named after the slang for a beer that's sat in a rodeo cooler all day.",
  dishes: ["Wagyu Steak Fingers & Gravy", "Texas Chili", "Frito Pie", "Deep-Fried Oatmeal Cream Pie", "Corn Dog"],
  address: "3826 Ross Ave, Dallas, TX 75204",
  phone: "",
  hours: "",
  lat: 32.7984607,
  lng: -96.7851373,
  bestOf: [],
  res_tier: 0,
  busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
  trending: true,
  instagram: "@rodeocolddtx",
  website: "https://www.rodeo-cold.com",
  suburb: false,
  verified: VERIFIED,
  photoUrl: "",
  photos: [],
  reserveUrl: ""
};

function gw(id, neighborhood, addr, lat, lng, resySlug) {
  return {
    id,
    name: "Great White",
    cuisine: "Australian / Cafe",
    neighborhood,
    score: 86,
    price: 3,
    tags: ["All-Day Cafe", "Brunch", "Coffee", "Australian", "Scene", "Patio"],
    indicators: [],
    group: "Great White",
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Australian-inspired all-day cafe born from a 900-sq-ft shop on Venice's Pacific Ave. Sam Cooper and Sam Trude's laid-back neighborhood formula — flat whites, smash burgers, avocado toast, and a branded hoodie economy — grew into one of LA's most-copied cafe templates. Walk-ins for breakfast/lunch; Resy takes over for dinner.",
    dishes: ["Smash Burger", "Breakfast Burrito", "Avocado Toast", "Flat White", "Little Gem Salad"],
    address: addr,
    phone: "",
    hours: "Mon-Sun 8am-10pm",
    lat, lng,
    bestOf: [],
    res_tier: 3,
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    instagram: "@greatwhite",
    website: "https://www.greatwhite.cafe",
    suburb: false,
    verified: VERIFIED,
    photoUrl: "",
    photos: [],
    reserveUrl: resySlug ? `https://resy.com/cities/los-angeles-ca/venues/${resySlug}` : ""
  };
}

const gwVenice    = gw(2537, "Venice",          "1604 Pacific Ave, Venice, CA 90291",          33.9876989, -118.4721044, "great-white");
const gwLarchmont = gw(2538, "Larchmont",       "244 N Larchmont Blvd, Los Angeles, CA 90004", 34.0752823, -118.3234390, "great-white-larchmont");
const gwWeho      = gw(2539, "West Hollywood",  "8917 Melrose Ave, West Hollywood, CA 90069",  34.0808791, -118.3868734, "");
const gwBrentwood = gw(2540, "Brentwood",       "11660 Darlington Ave, Los Angeles, CA 90049", 34.0528907, -118.4636585, "");
const gwStudio    = gw(2541, "Studio City",     "12103 Ventura Pl, Studio City, CA 91604",     34.1445191, -118.3944554, "");

const javiers = {
  id: 2542,
  name: "Javier's Century City",
  cuisine: "Mexican",
  neighborhood: "Century City",
  score: 85,
  price: 4,
  tags: ["Mexican", "Scene", "Date Night", "Celebrity", "Cocktails", "Tequila"],
  indicators: [],
  group: "",
  hh: "",
  reservation: "OpenTable",
  awards: "",
  description: "Javier Sosa's upscale Mexican in the Westfield Century City mall — the LA outpost of the Newport Beach / Las Vegas empire. A mahogany-and-iron dining room, Cabo-celebrity-restaurant aesthetic, a 200+ tequila list, and tableside guacamole to match. A reliable pre-ICM / pre-CAA dinner for the Century City crowd.",
  dishes: ["Mole", "Tableside Guacamole", "Carnitas", "Sizzling Fajitas", "Shrimp Diablo"],
  address: "10250 Santa Monica Blvd #1450, Los Angeles, CA 90067",
  phone: "(424) 313-8143",
  hours: "",
  lat: 34.0589130,
  lng: -118.4193450,
  bestOf: [],
  res_tier: 4,
  busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
  trending: false,
  instagram: "@javierscantina",
  website: "https://www.javiers-cantina.com/century-city",
  suburb: false,
  verified: VERIFIED,
  photoUrl: "",
  photos: [],
  reserveUrl: "https://www.opentable.com/r/javiers-century-city-los-angeles"
};

const escuela = {
  id: 2543,
  name: "Escuela Taqueria",
  cuisine: "Mexican / Tacos",
  neighborhood: "Beverly Grove",
  score: 85,
  price: 2,
  tags: ["Tacos", "Mexican", "Casual", "Lunch", "Patio"],
  indicators: [],
  group: "",
  hh: "",
  reservation: "walk-in",
  awards: "",
  description: "Beverly Blvd taqueria from restaurateur Bill Chait (Republique, Sotto) focused on real-deal, responsibly sourced tacos — 100% natural meats from small California farms, handmade tortillas, salsas made in-house. A lunch ritual for Fairfax / Beverly Grove regulars since 2013 and still the benchmark for west-side taco quality.",
  dishes: ["Pork Belly Taco", "Carne Asada Taco", "Al Pastor Taco", "Chorizo Taco", "Watermelon Agua Fresca"],
  address: "7450 W Beverly Blvd, Los Angeles, CA 90036",
  phone: "(323) 932-6178",
  hours: "Mon-Thu 11:30am-10pm, Fri-Sat 11:30am-11pm, Sun 11:30am-10pm",
  lat: 34.0759631,
  lng: -118.3524020,
  bestOf: [],
  res_tier: 0,
  busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
  trending: false,
  instagram: "@escuelataqueria",
  website: "https://www.escuelataqueria.com",
  suburb: false,
  verified: VERIFIED,
  photoUrl: "",
  photos: [],
  reserveUrl: ""
};

// Serialize with the same field ordering recent cards use
function stringify(card) { return JSON.stringify(card); }

function findArrayEnd(haystack, varName, startPos = 0) {
  // Match actual declaration: `VARNAME=[` or `VARNAME = [` — NOT object-literal refs
  // like `'Dallas': DALLAS_DATA,`. Skip ahead until we find the literal pattern.
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const sub = haystack.slice(startPos);
  const m = re.exec(sub);
  if (!m) return -1;
  const bracket = startPos + m.index + m[0].length - 1; // position of the `[`
  let depth = 0;
  for (let i = bracket; i < haystack.length; i++) {
    const c = haystack[i];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function appendCards(haystack, varName, cardsJson, startPos = 0) {
  const end = findArrayEnd(haystack, varName, startPos);
  if (end < 0) throw new Error(`could not find ${varName} declaration (startPos=${startPos})`);
  const before = haystack.slice(0, end);
  const after = haystack.slice(end);
  // Find the last non-whitespace char before `]` — if it's `[`, the array was empty.
  const trimmed = before.trimEnd();
  const lastChar = trimmed[trimmed.length - 1];
  const separator = lastChar === '[' ? '' : ',';
  return { updated: before + separator + cardsJson + after, afterPos: end + separator.length + cardsJson.length };
}

const dallasCards = [rodeoCold].map(stringify).join(',');
const laCards     = [gwVenice, gwLarchmont, gwWeho, gwBrentwood, gwStudio, javiers, escuela].map(stringify).join(',');

// Script copy #1 (live): DALLAS_DATA then LA_DATA
let cursor = 0;
let r;
r = appendCards(html, 'DALLAS_DATA', dallasCards, cursor);
html = r.updated; cursor = r.afterPos;
r = appendCards(html, 'LA_DATA', laCards, cursor);
html = r.updated; cursor = r.afterPos;

// Script copy #2 (static mirror): next DALLAS_DATA / LA_DATA occurrences
r = appendCards(html, 'DALLAS_DATA', dallasCards, cursor);
html = r.updated; cursor = r.afterPos;
r = appendCards(html, 'LA_DATA', laCards, cursor);
html = r.updated; cursor = r.afterPos;

fs.writeFileSync(FILE, html);
console.log('OK: added 1 Dallas + 7 LA cards (x2 script copies = 16 inserts)');
console.log('  Dallas #9215 Rodeo Cold');
console.log('  LA #2537 Great White (Venice)');
console.log('  LA #2538 Great White (Larchmont)');
console.log('  LA #2539 Great White (West Hollywood)');
console.log('  LA #2540 Great White (Brentwood)');
console.log('  LA #2541 Great White (Studio City)');
console.log('  LA #2542 Javier\'s Century City');
console.log('  LA #2543 Escuela Taqueria');

#!/usr/bin/env node
// San Diego batch 8 — Harbor Island + Old Town + brunch + coffee + more breweries (18 training-verified)
const fs = require("fs");
const path = require("path");
const https = require("https");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function getArrSlice(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const mm = html.match(re);
  const start = mm.index + mm[0].length - 1;
  let depth = 0, i = start;
  for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
  return { start, end: i, slice: html.slice(start, i + 1) };
}
function parseArr(s) { return (new Function("return " + s))(); }
function maxId(a) { return a.reduce((m, r) => Math.max(m, r.id||0), 0); }

const entries = [
  { name: "Morning Glory", cuisine: "American / Brunch", neighborhood: "Little Italy",
    address: "550 W Date St, San Diego, CA 92101",
    lookup: "550 W Date St, San Diego, CA 92101",
    score: 87, price: 3, tags: ["American","Brunch","Breakfast","Date Night","Trending","Iconic","Critics Pick","Cocktails"],
    reservation: "Resy",
    group: "Consortium Holdings / CH Projects",
    instagram: "@morningglory_sd", website: "https://morningglorysd.com",
    dishes: ["Blue Pancakes","Million Dollar Bacon","Breakfast Tater Tots","Champagne Bird"],
    desc: "CH Projects' Little Italy pink-washed brunch phenomenon — all-day champagne service, blue pancakes that print the Instagram, and a wait on weekends that's become its own SD landmark. The defining Little Italy brunch room." },
  { name: "Holsem Coffee", cuisine: "Coffee / Cafe / Brunch", neighborhood: "North Park",
    address: "2911 University Ave, San Diego, CA 92104",
    lookup: "2911 University Ave, San Diego, CA 92104",
    score: 85, price: 2, tags: ["Coffee","Cafe","Brunch","Breakfast","Casual","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@holsemcoffee", website: "https://holsemcoffee.com",
    dishes: ["Specialty Lattes","Avocado Toast","Breakfast Sandwiches","Open-Format Cafe"],
    desc: "North Park's University Ave coffee-and-brunch room — a sun-lit café format, a specialty-lattes program, and an all-day menu that made Holsem a North Park morning habit. One of SD's design-forward third-wave cafés." },
  { name: "Azucar Cuban Bakery", cuisine: "Cuban / Bakery / Dessert", neighborhood: "Ocean Beach",
    address: "4820 Newport Ave, San Diego, CA 92107",
    lookup: "4820 Newport Ave, San Diego, CA 92107",
    score: 85, price: 1, tags: ["Cuban","Bakery","Dessert","Casual","Hidden Gem","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@iloveazucar", website: "https://iloveazucar.com",
    dishes: ["Guava & Cheese Pastries","Cuban Sandwich","Tres Leches","Cafecito"],
    desc: "Ocean Beach's Cuban bakery — Vivian Hernandez-Jackson's Newport Ave pastry counter, guava-and-cheese pastelitos, and a Cuban coffee program that pulls OB regulars every morning. A specific, chef-driven counter in a beach town." },
  { name: "Tom Ham's Lighthouse", cuisine: "American / Seafood", neighborhood: "Harbor Island",
    address: "2150 Harbor Island Dr, San Diego, CA 92101",
    lookup: "2150 Harbor Island Dr, San Diego, CA 92101",
    score: 83, price: 3, tags: ["American","Seafood","Date Night","Scenic Views","Celebrations","Patio","Iconic"],
    reservation: "OpenTable",
    instagram: "@tomhamslighthouse", website: "https://tomhamslighthouse.com",
    dishes: ["Cioppino","Prime Rib","Sunday Brunch","Skyline-Across-the-Bay Views"],
    desc: "Harbor Island's actual working lighthouse — the Port of San Diego's official bayfront beacon serves cioppino and prime rib with the SD skyline directly across the water. A defining special-occasion view table since 1971." },
  { name: "Island Prime & C Level", cuisine: "Steakhouse / American / Seafood", neighborhood: "Harbor Island",
    address: "880 Harbor Island Dr, San Diego, CA 92101",
    lookup: "880 Harbor Island Dr, San Diego, CA 92101",
    score: 86, price: 4, tags: ["Fine Dining","Steakhouse","American","Seafood","Date Night","Celebrations","Scenic Views","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Cohn Restaurant Group",
    instagram: "@islandprimesd", website: "https://cohnrestaurants.com/islandprime",
    dishes: ["Dry-Aged Steaks","Lobster Bisque","C Level Patio","Skyline Views"],
    desc: "Cohn Restaurant Group's Harbor Island double — Island Prime upstairs for the chophouse treatment, C Level downstairs for the open patio on the water. The same downtown-skyline view, two formats. An SD skyline-view institution." },
  { name: "Casa Guadalajara", cuisine: "Mexican", neighborhood: "Old Town",
    address: "4105 Taylor St, San Diego, CA 92110",
    lookup: "4105 Taylor St, San Diego, CA 92110",
    score: 82, price: 2, tags: ["Mexican","Margaritas","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    group: "Bazaar del Mundo",
    instagram: "@casaguadalajarasd", website: "https://casaguadalajara.com",
    dishes: ["Top-Shelf Margaritas","Carnitas","Tableside Guacamole","Mariachi Patio"],
    desc: "Diane Powers' Bazaar del Mundo anchor — Old Town Mexican dining built around a mariachi patio, tableside guacamole, and margaritas that have been the reason SD tourists never miss Old Town for 40 years." },
  { name: "Old Town Mexican Cafe", cuisine: "Mexican", neighborhood: "Old Town",
    address: "2489 San Diego Ave, San Diego, CA 92110",
    lookup: "2489 San Diego Ave, San Diego, CA 92110",
    score: 82, price: 2, tags: ["Mexican","Casual","Family Friendly","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@oldtownmexicancafe", website: "https://oldtownmexcafe.com",
    dishes: ["Hand-Made Tortillas","Carnitas","Carne Asada","Mariachi on Patio"],
    desc: "Old Town's house of hand-made tortillas — the window-front tortilla ladies slapping masa all day have been the visual signature since 1980. The tourist spot that locals admit is still doing it right." },
  { name: "Gravity Heights", cuisine: "American / Brewery", neighborhood: "Sorrento Valley / Mira Mesa",
    address: "9920 Pacific Heights Blvd, San Diego, CA 92121",
    lookup: "9920 Pacific Heights Blvd, San Diego, CA 92121",
    score: 83, price: 2, tags: ["American","Brewery","Patio","Family Friendly","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@gravityheights", website: "https://gravityheights.com",
    dishes: ["House Brews","Wood-Fired Pizza","Brewpub Menu","Dog-Friendly Patio"],
    desc: "Sorrento Valley's brewpub anchor — a serious house-brewing program inside a chef-driven dining room, with a pizza oven at the center and a patio built for dogs and tech families. A defining North SD brewpub." },
  { name: "AleSmith Brewing Company", cuisine: "American / Brewery", neighborhood: "Miramar",
    address: "9990 AleSmith Ct, San Diego, CA 92126",
    lookup: "9990 AleSmith Ct, San Diego, CA 92126",
    score: 87, price: 2, tags: ["American","Brewery","Casual","Critics Pick","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "AleSmith Brewing",
    instagram: "@alesmithbrewing", website: "https://alesmith.com",
    dishes: ["Speedway Stout","AleSmith IPA","Nut Brown Ale","Tony Gwynn Tribute Brews"],
    desc: "One of America's most-decorated breweries — Miramar production facility, Speedway Stout as the legend, and a tasting room that beer people travel to San Diego for. The Tony Gwynn partnership still anchors the local identity." },
  { name: "Pannikin Coffee & Tea — La Jolla", cuisine: "Coffee / Cafe", neighborhood: "La Jolla",
    address: "7458 Girard Ave, La Jolla, CA 92037",
    lookup: "7458 Girard Ave, La Jolla, CA 92037",
    score: 84, price: 1, tags: ["Coffee","Cafe","Casual","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    group: "Pannikin",
    instagram: "@pannikincoffee", website: "https://pannikincoffeeandtea.com",
    dishes: ["House-Roasted Coffee","Loose-Leaf Teas","Pastry Case","Village Patio"],
    desc: "La Jolla Village's Pannikin — Southern California's founding third-wave coffeehouse, open since 1968, with a Girard Ave patio that's been La Jolla's morning meeting room for generations. The SoCal coffee-history anchor." },
  { name: "James Coffee Co", cuisine: "Coffee / Cafe", neighborhood: "Little Italy",
    address: "2455 India St, San Diego, CA 92101",
    lookup: "2455 India St, San Diego, CA 92101",
    score: 85, price: 1, tags: ["Coffee","Cafe","Casual","Critics Pick","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "James Coffee Co",
    instagram: "@jamescoffeeco", website: "https://jamescoffeeco.com",
    dishes: ["Single-Origin Espresso","Pour Over","Roast-Dated Beans","Warehouse Cafe"],
    desc: "Little Italy's warehouse-format specialty coffee — in-house roasting, single-origin focus, and a cavernous Little Italy flagship that became the design reference for SD third-wave coffee. Multiple locations across the city." },
  { name: "Rocky's Crown Pub", cuisine: "American / Burgers", neighborhood: "Pacific Beach",
    address: "3786 Ingraham St, San Diego, CA 92109",
    lookup: "3786 Ingraham St, San Diego, CA 92109",
    score: 85, price: 1, tags: ["American","Burgers","Casual","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Classic Cheeseburger","Fries","Cold Beer","Dive-Bar Format"],
    desc: "Pacific Beach's dive-bar burger destination — one thing on the menu in any real sense (the cheeseburger), cash-friendly, no-frills, and a reputation that reaches well outside SD. The local answer to 'where's the best burger in town.'" },
  { name: "El Pescador Fish Market", cuisine: "Seafood / Casual", neighborhood: "La Jolla",
    address: "634 Pearl St, La Jolla, CA 92037",
    lookup: "634 Pearl St, La Jolla, CA 92037",
    score: 86, price: 2, tags: ["Seafood","Casual","Quick Bite","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@elpescadorfishmarket", website: "https://elpescadorfishmarket.com",
    dishes: ["Grilled Fish Sandwich","Fish Tacos","Cioppino","Counter-Service Format"],
    desc: "La Jolla's counter-service fish market and lunch room — the grilled-fish sandwich is the local classic; the format has stayed the same since opening, and the La Jolla regulars won't let it change. A defining La Jolla quick-lunch institution." },
  { name: "BO-beau Kitchen + Bar — Ocean Beach", cuisine: "French / Bistro", neighborhood: "Ocean Beach",
    address: "4996 W Point Loma Blvd, San Diego, CA 92107",
    lookup: "4996 W Point Loma Blvd, San Diego, CA 92107",
    score: 85, price: 3, tags: ["French","Bistro","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Cohn Restaurant Group",
    instagram: "@bobeausd", website: "https://cohnrestaurants.com/bobeau",
    dishes: ["Brussels Sprouts","Moules Frites","Duck Confit","Chandelier-Lit Patio"],
    desc: "Cohn Restaurant Group's Ocean Beach French bistro — chandelier-lit patio, duck confit, and the crispy Brussels sprouts that became an SD bistro order-this signature. An OB date-night room with real kitchen intent." },
  { name: "The Hake Kitchen & Bar", cuisine: "Seafood / Modern American", neighborhood: "La Jolla",
    address: "1250 Prospect St, La Jolla, CA 92037",
    lookup: "1250 Prospect St, La Jolla, CA 92037",
    score: 86, price: 4, tags: ["Seafood","American","Modern","Date Night","Scenic Views","Patio","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@thehakesd", website: "https://thehakesd.com",
    dishes: ["Chilean Sea Bass","Ceviche Program","Raw Bar","Ocean-View Patio"],
    desc: "La Jolla Cove's modern-seafood room on Prospect — ocean-view patio, a chef-driven raw bar, and a menu that leans into South American technique. One of the Cove's most-serious seafood tables." },
  { name: "Cloak & Petal", cuisine: "Japanese / Sushi", neighborhood: "Little Italy",
    address: "1953 India St, San Diego, CA 92101",
    lookup: "1953 India St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Japanese","Sushi","Date Night","Trending","Cocktails","Patio","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@cloakandpetal", website: "https://cloakandpetal.com",
    dishes: ["Modern Sushi Rolls","Cherry Blossom Dining Room","Sake Cocktails","Robata"],
    desc: "Little Italy's cherry-blossom-wrapped sushi room — a maximalist design statement inside, modern-roll menu, and a sake cocktail program that made Cloak & Petal a Little Italy Instagram fixture. One of SD's most-photographed dining rooms." },
  { name: "Monello", cuisine: "Italian / Southern Italian", neighborhood: "Little Italy",
    address: "750 W Fir St, San Diego, CA 92101",
    lookup: "750 W Fir St, San Diego, CA 92101",
    score: 86, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Monello / Bencotto",
    instagram: "@monellosandiego", website: "https://lovemonello.com",
    dishes: ["Milan-Style Street Food","Fresh Pasta","Aperitivo","Patio Dining"],
    desc: "Little Italy's Milan-style trattoria — sibling to Bencotto next door, with a fresh-pasta program and an aperitivo format that put Little Italy in a more serious Italian register than the neighborhood's pizza-pasta default." },
  { name: "Stake Chophouse", cuisine: "Steakhouse / Modern American", neighborhood: "Coronado",
    address: "1309 Orange Ave, Coronado, CA 92118",
    lookup: "1309 Orange Ave, Coronado, CA 92118",
    score: 88, price: 4, tags: ["Fine Dining","Steakhouse","American","Date Night","Celebrations","Critics Pick","Patio"],
    reservation: "OpenTable",
    instagram: "@stakechophousesd", website: "https://stakechophouse.com",
    dishes: ["Prime Dry-Aged Steaks","Raw Bar","Side Program","Rooftop Patio"],
    desc: "Coronado's modern chophouse — a Prime steak program, a rooftop patio above Orange Avenue, and a dining room that gave the island its serious special-occasion table outside the Hotel del. A Coronado modern-classic." }
];

function nominatim(a) {
  return new Promise((res, rej) => {
    const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
    https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" } }, (r) => {
      let d = ""; r.on("data", c => d += c);
      r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({lat:parseFloat(j[0].lat),lng:parseFloat(j[0].lon)}); } catch(e) { rej(e); } });
    }).on("error", rej);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, 1100));

// Tight SD County box — skip obvious inland-Escondido misses by rejecting anything north of 33.15
function inSDBox(c) {
  return c.lat >= 32.45 && c.lat <= 33.30 && c.lng >= -117.40 && c.lng <= -116.80;
}

(async () => {
  const s = getArrSlice("SD_DATA");
  const arr = parseArr(s.slice);
  let nextId = arr.length ? maxId(arr) + 1 : 15000;
  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!c || !inSDBox(c)) {
      const simple = e.lookup.replace(/#\S+,?\s*/i, "").replace(/Ste \S+,?\s*/i, "");
      if (simple !== e.lookup) { await sleep(1100); c = await nominatim(simple); }
    }
    if (!c || !inSDBox(c)) { console.log(`  ❌ SKIP (${c ? `out-of-box ${c.lat},${c.lng}` : "no match"})`); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1100);
    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood,
      score: e.score, price: e.price, tags: e.tags, indicators: e.indicators||[],
      group: e.group||"", hh: "", reservation: e.reservation || "walk-in",
      awards: e.awards||"", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [],
      res_tier: e.reservation==="Tock" ? 5 : e.reservation==="Resy" ? 4 : e.reservation==="OpenTable" ? 3 : 0,
      busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, instagram: e.instagram||"",
      suburb: false, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (SD: ${arr.length} → ${newArr.length})`);
})();

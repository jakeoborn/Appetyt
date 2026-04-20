#!/usr/bin/env node
// San Diego batch 20 — Mission Bay + Old Town + UTC + Del Mar + Mission Valley + East County + Poway + Rancho Bernardo + Harbor Island + Kearny Mesa (20)
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
  { name: "Tidal at Paradise Point Resort", cuisine: "American / Modern", neighborhood: "Mission Bay",
    address: "1404 Vacation Rd, San Diego, CA 92109",
    lookup: "1404 Vacation Rd, San Diego, CA 92109",
    score: 85, price: 4, tags: ["Fine Dining","American","Modern","Date Night","Scenic Views","Patio","Celebrations","Critics Pick"],
    reservation: "OpenTable",
    group: "Paradise Point Resort",
    instagram: "@paradisepoint", website: "https://paradisepoint.com/dine/tidal",
    dishes: ["Seasonal Tasting","Bay-Facing Patio","Local Seafood","Resort Fine Dining"],
    desc: "Paradise Point Resort's flagship Mission Bay dining room — a bayfront patio on the resort's private island, seasonal tasting menu, and one of SD's defining resort-dinner settings. Anniversaries and Mission Bay weddings default to Tidal." },
  { name: "Cafe Pacifica", cuisine: "American / Seafood / Californian", neighborhood: "Old Town",
    address: "2414 San Diego Ave, San Diego, CA 92110",
    lookup: "2414 San Diego Ave, San Diego, CA 92110",
    score: 86, price: 3, tags: ["American","Seafood","Californian","Date Night","Iconic","Critics Pick","Patio"],
    reservation: "OpenTable",
    instagram: "@cafepacifica", website: "https://cafepacifica.com",
    dishes: ["Fresh Catch","Griddled Mustard Catfish","Old Town Since 1980","Historic Casa de Bandini Block"],
    desc: "Old Town's chef-driven seafood room since 1980 — the griddled mustard catfish has been on the menu for four decades, a small Old Town dining room that reads as a serious-kitchen holdout on the tourist strip. An Old Town insider anchor." },
  { name: "The Chart House — Mission Bay", cuisine: "American / Seafood", neighborhood: "Mission Bay",
    address: "1458 Quivira Rd, San Diego, CA 92109",
    lookup: "1458 Quivira Rd, San Diego, CA 92109",
    score: 83, price: 4, tags: ["American","Seafood","Date Night","Scenic Views","Celebrations","Iconic","Patio"],
    reservation: "OpenTable",
    group: "The Chart House",
    instagram: "@charthouse", website: "https://chart-house.com",
    dishes: ["Prime Rib","Fresh Catch","Salad Bar","Mission Bay Waterfront"],
    desc: "The Chart House's Mission Bay waterfront location — a boat-dock-adjacent dining room, the prime rib and salad bar format that defines the brand, and the kind of bayfront reservation SD families have used for formal dinners for generations." },
  { name: "Donovan's Steakhouse — La Jolla", cuisine: "Steakhouse", neighborhood: "La Jolla / UTC",
    address: "4340 La Jolla Village Dr, San Diego, CA 92122",
    lookup: "4340 La Jolla Village Dr, San Diego, CA 92122",
    score: 88, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations","Iconic","Critics Pick"],
    reservation: "OpenTable",
    group: "Donovan's",
    instagram: "@donovanssteakhouse", website: "https://donovanssteakhouse.com",
    dishes: ["USDA Prime Steaks","Dry-Aged Program","Piano Bar","UTC Power-Dinner Room"],
    desc: "La Jolla/UTC's old-school chophouse — USDA Prime steaks, a dry-aged program, a piano bar, and the kind of dining room where San Diego's biggest business dinners still happen. A defining SD power-dinner table." },
  { name: "Mastro's Ocean Club — Del Mar", cuisine: "Steakhouse / Seafood", neighborhood: "Del Mar",
    address: "11990 El Camino Real, San Diego, CA 92130",
    lookup: "11990 El Camino Real, San Diego, CA 92130",
    score: 90, price: 4, tags: ["Fine Dining","Steakhouse","Seafood","Date Night","Celebrations","Critics Pick","Scenic Views","Iconic"],
    reservation: "OpenTable",
    group: "Landry's / Mastro's Restaurants",
    instagram: "@mastrosrestaurants", website: "https://mastrosrestaurants.com",
    dishes: ["USDA Prime Bone-In Ribeye","Seafood Tower","Butter Cake","Piano Bar"],
    desc: "Mastro's Ocean Club's Del Mar Highlands location — an ocean-view dining room with a piano bar, the seafood tower and butter-cake desserts that are the brand's national signatures, and one of North County's defining special-occasion rooms." },
  { name: "En Fuego Cantina & Grill", cuisine: "Mexican", neighborhood: "Del Mar",
    address: "1342 Camino Del Mar, Del Mar, CA 92014",
    lookup: "1342 Camino Del Mar, Del Mar, CA 92014",
    score: 82, price: 3, tags: ["Mexican","Margaritas","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@enfuegodelmar", website: "https://enfuegocantina.com",
    dishes: ["Mahi-Mahi Tacos","Tableside Guacamole","Margaritas","Del Mar Village Patio"],
    desc: "Del Mar Village's Mexican cantina on Camino Del Mar — tableside guacamole, a mahi-mahi taco signature, and a patio that fills during Del Mar Racetrack season. A Del Mar Village everyday." },
  { name: "Zel's Del Mar", cuisine: "American / Bar", neighborhood: "Del Mar",
    address: "1247 Camino Del Mar, Del Mar, CA 92014",
    lookup: "1247 Camino Del Mar, Del Mar, CA 92014",
    score: 84, price: 3, tags: ["American","Bar","Date Night","Patio","Cocktails","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@zelsdelmar", website: "https://zelsdelmar.com",
    dishes: ["Craft Cocktails","Burger Program","Del Mar Patio","Horse-Racing Season Bar"],
    desc: "Del Mar Village's corner bar-and-grill on Camino Del Mar — a craft cocktail program, a good burger, and a patio that turns into Del Mar's horse-racing headquarters every summer. A Del Mar locals' standby." },
  { name: "Carnitas' Snack Shack — Embarcadero", cuisine: "American / Mexican Fusion", neighborhood: "Downtown / Embarcadero",
    address: "1004 N Harbor Dr, San Diego, CA 92101",
    lookup: "1004 N Harbor Dr, San Diego, CA 92101",
    score: 85, price: 2, tags: ["American","Mexican","Casual","Scenic Views","Patio","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Carnitas' Snack Shack",
    instagram: "@carnitassnackshack", website: "https://carnitassnackshack.com",
    dishes: ["Carnitas Sandwich","Triple Threat Pork Plate","Harbor-View Patio","Broadway Pier Location"],
    desc: "Carnitas' Snack Shack's Broadway Pier Embarcadero location — the North Park brand's waterfront chapter, a harbor-view patio, and the same carnitas sandwich that made the SD brand a citywide institution. A defining Embarcadero casual." },
  { name: "Bully's East", cuisine: "American / Steakhouse", neighborhood: "Mission Valley",
    address: "2401 Camino del Rio S, San Diego, CA 92108",
    lookup: "2401 Camino del Rio S, San Diego, CA 92108",
    score: 83, price: 3, tags: ["American","Steakhouse","Date Night","Iconic","Local Favorites","Family Friendly"],
    reservation: "OpenTable",
    group: "Bully's Restaurants",
    instagram: "@bullyseast", website: "https://bullyseast.com",
    dishes: ["Prime Rib","Steak Sandwich","Mission Valley Since 1969","Old-School SD Steakhouse"],
    desc: "Mission Valley's old-school SD steakhouse since 1969 — prime rib, a longtime steak-sandwich signature, and the kind of dimly-lit dining room where SD families have cut birthday cakes across three generations. A defining SD steakhouse holdover." },
  { name: "Casa de Pico", cuisine: "Mexican", neighborhood: "La Mesa",
    address: "5500 Grossmont Center Dr, La Mesa, CA 91942",
    lookup: "5500 Grossmont Center Dr, La Mesa, CA 91942",
    score: 82, price: 2, tags: ["Mexican","Family Friendly","Patio","Iconic","Local Favorites","Margaritas"],
    reservation: "OpenTable",
    suburb: true,
    group: "Bazaar del Mundo",
    instagram: "@casadepico", website: "https://casadepico.com",
    dishes: ["Margaritas","Combination Plates","Mariachi Patio","Fountain Courtyard"],
    desc: "Diane Powers' Bazaar del Mundo Mexican at Grossmont Center — a sprawling tile-and-fountain patio with mariachis, combination plates, and the East County family-crowd Mexican default across generations." },
  { name: "Hamburger Factory Family Restaurant", cuisine: "American / Burgers", neighborhood: "Poway",
    address: "14122 Midland Rd, Poway, CA 92064",
    lookup: "14122 Midland Rd, Poway, CA 92064",
    score: 83, price: 2, tags: ["American","Burgers","Family Friendly","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@hamburgerfactory", website: "https://hamburgerfactory.com",
    dishes: ["Old-Town-Style Burger","Curly Fries","Kids-Menu Program","Poway Since 1981"],
    desc: "Poway's Hamburger Factory — an Old Poway-themed family-burger dining room since 1981, with a kid-crowd reputation that makes it the East County family-dinner default. A Poway constant." },
  { name: "Bernardo Winery & Cafe Merlot", cuisine: "Californian / Winery", neighborhood: "Rancho Bernardo",
    address: "13330 Paseo del Verano Norte, San Diego, CA 92128",
    lookup: "13330 Paseo del Verano Norte, San Diego, CA 92128",
    score: 85, price: 3, tags: ["American","Californian","Winery","Date Night","Patio","Critics Pick","Iconic","Scenic Views"],
    reservation: "OpenTable",
    suburb: true,
    group: "Bernardo Winery",
    instagram: "@bernardowinery", website: "https://bernardowinery.com",
    dishes: ["Chef-Driven Lunch Program","Wine Tasting","Rancho Bernardo Patio","Historic Vineyard Grounds"],
    desc: "Bernardo Winery — SoCal's longest-continuously-operating winery since 1889, with Cafe Merlot as the on-property chef-driven restaurant set in a vineyard-historic-district format. A Rancho Bernardo daytime destination." },
  { name: "Corvette Diner", cuisine: "American / Diner", neighborhood: "Point Loma / Liberty Station",
    address: "2965 Historic Decatur Rd, San Diego, CA 92106",
    lookup: "2965 Historic Decatur Rd, San Diego, CA 92106",
    score: 83, price: 2, tags: ["American","Diner","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Cohn Restaurant Group",
    instagram: "@corvettediner", website: "https://cohnrestaurants.com/corvettediner",
    dishes: ["'50s Diner Menu","Singing Waitstaff","Kid Arcade","Liberty Station Since 2010 (Original 1987)"],
    desc: "Cohn Restaurant Group's kid-and-retro-themed diner — singing waitstaff, a '50s-music soundtrack, and a menu of diner classics. The original Corvette Diner opened in 1987 and moved to Liberty Station in 2010 — a defining SD family-diner institution." },
  { name: "Olive Tree Marketplace", cuisine: "Mediterranean / Greek / Deli", neighborhood: "Ocean Beach",
    address: "4805 Narragansett Ave, San Diego, CA 92107",
    lookup: "4805 Narragansett Ave, San Diego, CA 92107",
    score: 83, price: 1, tags: ["Mediterranean","Greek","Deli","Casual","Quick Bite","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@olivetreeob", website: "",
    dishes: ["Gyros","Greek Salad","Imported Olive Oils","OB Market Since 1983"],
    desc: "Ocean Beach's Greek market-and-deli since 1983 — imported olive oils and feta cheeses on the shelves, a gyro-and-Greek-salad counter, and the kind of Narragansett Ave institution that OB has protected across every phase of neighborhood change." },
  { name: "Donovan's Prime Seafood Grill", cuisine: "Seafood / Steakhouse", neighborhood: "Gaslamp",
    address: "570 K St, San Diego, CA 92101",
    lookup: "570 K St, San Diego, CA 92101",
    score: 87, price: 4, tags: ["Fine Dining","Seafood","Steakhouse","Date Night","Celebrations","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Donovan's",
    instagram: "@donovansseafood", website: "https://donovansseafood.com",
    dishes: ["Prime Steaks","Fresh Seafood","Petco-Adjacent Room","Padres Game-Day Reservation"],
    desc: "Donovan's Gaslamp sister — a surf-and-turf version of the Donovan's Steakhouse brand, a block from Petco Park, with a reservation book that fills for every Padres home stand. The Gaslamp Donovan's chapter." },
  { name: "Coasterra", cuisine: "Modern Mexican", neighborhood: "Harbor Island",
    address: "880 Harbor Island Dr, San Diego, CA 92101",
    lookup: "880 Harbor Island Dr, San Diego, CA 92101",
    score: 86, price: 4, tags: ["Fine Dining","Mexican","Modern","Date Night","Scenic Views","Celebrations","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Cohn Restaurant Group",
    instagram: "@coasterra", website: "https://cohnrestaurants.com/coasterra",
    dishes: ["Modern Mexican Tasting","Tequila/Mezcal Library","Skyline Views","Harbor Island Patio"],
    desc: "Cohn Restaurant Group's Harbor Island modern-Mexican — a vast waterfront dining room with the SD skyline in the windows, a 200+ agave bar, and the kind of regional-Mexican menu that put the Harbor Island complex on the SD fine-dining map." },
  { name: "You & Yours Distilling Co.", cuisine: "American / Cocktail Bar / Distillery", neighborhood: "East Village",
    address: "1495 G St, San Diego, CA 92101",
    lookup: "1495 G St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["American","Distillery","Cocktail Bar","Date Night","Critics Pick","Trending","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@youandyours", website: "https://youandyours.com",
    dishes: ["In-House Distilled Spirits","Sun Gun Gin","Vodka & Whiskey","Cocktail Flights"],
    desc: "East Village's urban distillery-and-cocktail-bar — California's first urban distillery open for tours and tastings, in-house Sun Gun gin and house-distilled vodka, and the kind of East Village format that doesn't exist elsewhere in SD." },
  { name: "The Red Fox Room", cuisine: "American / Steakhouse / Bar", neighborhood: "North Park",
    address: "2223 El Cajon Blvd, San Diego, CA 92104",
    lookup: "2223 El Cajon Blvd, San Diego, CA 92104",
    score: 84, price: 3, tags: ["American","Steakhouse","Bar","Date Night","Iconic","Local Favorites","Cocktails","Live Music"],
    reservation: "walk-in",
    group: "Lafayette Hotel",
    instagram: "@redfoxsd", website: "https://lafayettehotelsd.com",
    dishes: ["Steaks","Piano Bar","Tuba-Shaped Bar","Since 1945"],
    desc: "The Red Fox Room inside the Lafayette Hotel on El Cajon Blvd — SD's longest-running piano-bar steak-and-chops room, open since 1945, with paneling from a 16th-century English manor. A defining old-SD bar. Part of the Lafayette Hotel reopening." },
  { name: "Boxing Monk Sichuan Kitchen", cuisine: "Chinese / Sichuan", neighborhood: "Point Loma",
    address: "3361 Rosecrans St, San Diego, CA 92110",
    lookup: "3361 Rosecrans St, San Diego, CA 92110",
    score: 85, price: 2, tags: ["Chinese","Sichuan","Casual","Critics Pick","Trending","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "@boxingmonksd", website: "https://boxingmonksd.com",
    dishes: ["Dan Dan Noodles","Mapo Tofu","Numbing-Spicy Program","Chef-Driven Sichuan"],
    desc: "Point Loma's chef-driven Sichuan — numbing-hot mapo tofu, dan dan noodles done to Chengdu spec, and a Rosecrans St dining room that raised the ceiling on what Sichuan cooking looks like outside of Convoy. A Point Loma specialist." },
  { name: "The Butcher Shop Steakhouse", cuisine: "American / Steakhouse", neighborhood: "Kearny Mesa",
    address: "5255 Kearny Villa Rd, San Diego, CA 92123",
    lookup: "5255 Kearny Villa Rd, San Diego, CA 92123",
    score: 83, price: 3, tags: ["American","Steakhouse","Date Night","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@butchershopsd", website: "https://butchershopsandiego.com",
    dishes: ["USDA Prime Steaks","Pit Cooking","Piano Bar Lounge","Since 1962"],
    desc: "Kearny Mesa's Butcher Shop Steakhouse since 1962 — pit-cooked prime steaks, a piano bar lounge, and the kind of Kearny Villa Rd dining room where SD's military and airport-adjacent crowd has been ordering the same cut for 60 years." }
];

function nominatim(a, attempts = 3) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const result = await new Promise((res, rej) => {
          const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
          const req = https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" }, timeout: 10000 }, (r) => {
            let d = ""; r.on("data", c => d += c);
            r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({lat:parseFloat(j[0].lat),lng:parseFloat(j[0].lon)}); } catch(e) { rej(e); } });
          });
          req.on("error", rej);
          req.on("timeout", () => { req.destroy(); rej(new Error("timeout")); });
        });
        return resolve(result);
      } catch (e) {
        if (i === attempts - 1) { console.log(`  ⚠ nominatim failed: ${e.message}`); return resolve(null); }
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    resolve(null);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, 1100));

function inSDBox(c, name) {
  const gaslampTight = /Gaslamp|East Village|Little Italy|Downtown \/ Embarcadero|^Downtown$/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

const manualFallback = {
  "Donovan's Prime Seafood Grill": { lat: 32.7091, lng: -117.1614 },  // 570 K St Gaslamp
  "You & Yours Distilling Co.":    { lat: 32.7117, lng: -117.1532 }   // 1495 G St East Village
};

(async () => {
  const s = getArrSlice("SD_DATA");
  const arr = parseArr(s.slice);
  let nextId = arr.length ? maxId(arr) + 1 : 15000;
  const existingNames = new Set(arr.map(r => r.name.toLowerCase()));
  const built = [];
  for (const e of entries) {
    if (existingNames.has(e.name.toLowerCase())) { console.log(`⏭  DUP: ${e.name}`); continue; }
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!c || !inSDBox(c, e.neighborhood)) {
      if (manualFallback[e.name]) { c = manualFallback[e.name]; console.log(`  ↪ manual fallback`); }
    }
    if (!c || !inSDBox(c, e.neighborhood)) { console.log(`  ❌ SKIP (${c ? `out-of-box ${c.lat},${c.lng}` : "no match"})`); continue; }
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
      suburb: !!e.suburb, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (SD: ${arr.length} → ${newArr.length})`);
})();

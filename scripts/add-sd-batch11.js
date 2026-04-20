#!/usr/bin/env node
// San Diego batch 11 — Convoy Asian + La Jolla breakfast institutions + Coronado Orange Ave + North County coastal (18)
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
  { name: "Phuong Trang", cuisine: "Vietnamese", neighborhood: "Kearny Mesa",
    address: "4170 Convoy St, San Diego, CA 92111",
    lookup: "4170 Convoy St, San Diego, CA 92111",
    score: 86, price: 2, tags: ["Vietnamese","Casual","Family Friendly","Critics Pick","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://phuongtrangsd.com",
    dishes: ["Pho","Bún Bò Huế","Bánh Xèo","Five-Spice Roasted Duck"],
    desc: "Kearny Mesa's Vietnamese banquet-format restaurant — a menu that crosses northern and central regions, a dining room that fills for weekend family dinners, and a reputation among SD Vietnamese families as the default. One of Convoy's most-cited rooms." },
  { name: "Buga Korean BBQ", cuisine: "Korean / BBQ", neighborhood: "Clairemont",
    address: "5580 Clairemont Mesa Blvd, San Diego, CA 92117",
    lookup: "5580 Clairemont Mesa Blvd, San Diego, CA 92117",
    score: 85, price: 3, tags: ["Korean","BBQ","Date Night","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://bugakoreanbbq.com",
    dishes: ["Tableside Charcoal BBQ","Prime Marinated Short Rib","Banchan Program","Kimchi Stew"],
    desc: "Clairemont's tableside-charcoal Korean BBQ — a serious banchan spread, charcoal (not gas) grills built into every table, and a reputation as SD's Korean BBQ reference for two decades. The Clairemont destination table." },
  { name: "Cross Street Chicken & Beer", cuisine: "Korean / Fried Chicken", neighborhood: "Kearny Mesa",
    address: "4698 Convoy St, San Diego, CA 92111",
    lookup: "4698 Convoy St, San Diego, CA 92111",
    score: 84, price: 2, tags: ["Korean","Fried Chicken","Casual","Late Night","Trending","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@crossstreetchickensd", website: "https://crossstreetsd.com",
    dishes: ["Korean Fried Chicken","Soy Garlic Wings","Spicy KFC","Beer Program"],
    desc: "Convoy District's Korean fried chicken bar — soy-garlic, spicy, and original crispy styles, a Korean beer and soju list, and the kind of late-night dining-room crowd that defines the Convoy after-hours scene." },
  { name: "Common Theory Public House", cuisine: "American / Gastropub", neighborhood: "Kearny Mesa",
    address: "4805 Convoy St, San Diego, CA 92111",
    lookup: "4805 Convoy St, San Diego, CA 92111",
    score: 84, price: 2, tags: ["American","Gastropub","Patio","Date Night","Local Favorites","Craft Beer"],
    reservation: "OpenTable",
    instagram: "@commontheorysd", website: "https://commontheorysd.com",
    dishes: ["Asian-Fusion Gastropub","Short Rib Bao","40+ Craft Taps","Convoy Patio"],
    desc: "Convoy District's American-meets-Asian gastropub — a 40+ tap craft program, short rib bao as the crossover signature, and a patio that reads like Convoy's answer to North Park's 30th Street. The Convoy all-day room." },
  { name: "China Max", cuisine: "Chinese / Cantonese", neighborhood: "Kearny Mesa",
    address: "4698 Convoy St Ste 101, San Diego, CA 92111",
    lookup: "4698 Convoy St, San Diego, CA 92111",
    score: 86, price: 2, tags: ["Chinese","Cantonese","Casual","Family Friendly","Critics Pick","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://chinamaxsd.com",
    dishes: ["Live Seafood","Peking Duck","Lobster in XO Sauce","Banquet Format"],
    desc: "Kearny Mesa's Hong Kong-style Cantonese — live seafood tanks, a Peking duck program, and the kind of banquet-size menu SD's Chinese families use for weddings and reunions. A Convoy Cantonese anchor." },
  { name: "The Cottage", cuisine: "American / Breakfast / Brunch", neighborhood: "La Jolla",
    address: "7702 Fay Ave, La Jolla, CA 92037",
    lookup: "7702 Fay Ave, La Jolla, CA 92037",
    score: 85, price: 2, tags: ["American","Breakfast","Brunch","Patio","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@thecottagelj", website: "https://cottagelajolla.com",
    dishes: ["Granola","Eggs Benedict","Lemon Ricotta Pancakes","Garden Patio"],
    desc: "La Jolla's cottage-style breakfast institution since 1987 — a garden patio that tourists circle and locals book, a brunch line that tells you the weekend's rhythm, and the kind of from-scratch morning kitchen the Village never let go of." },
  { name: "Harry's Coffee Shop", cuisine: "American / Diner / Breakfast", neighborhood: "La Jolla",
    address: "7545 Girard Ave, La Jolla, CA 92037",
    lookup: "7545 Girard Ave, La Jolla, CA 92037",
    score: 84, price: 1, tags: ["American","Diner","Breakfast","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@harryslajolla", website: "https://harryscoffeeshop.com",
    dishes: ["Silver Dollar Pancakes","Corned Beef Hash","Diner Counter","La Jolla Regulars Since 1960"],
    desc: "La Jolla's 1960 diner — a Girard Ave counter, silver-dollar pancakes, and a rotating cast of La Jolla regulars who've been ordering the same breakfast longer than most of SD's fine-dining rooms have existed. A Village institution." },
  { name: "Duke's La Jolla", cuisine: "American / Hawaiian / Seafood", neighborhood: "La Jolla",
    address: "1216 Prospect St, La Jolla, CA 92037",
    lookup: "1216 Prospect St, La Jolla, CA 92037",
    score: 84, price: 3, tags: ["American","Hawaiian","Seafood","Scenic Views","Date Night","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Duke's Restaurants",
    instagram: "@dukeslajolla", website: "https://dukeslajolla.com",
    dishes: ["Hula Pie","Mac Nut Mahi","Duke's Margarita","Cove-Facing Lanai"],
    desc: "La Jolla Cove's Hawaiian-themed oceanfront — a lanai aimed straight at the Cove, mac-nut-crusted mahi, and the Hula Pie dessert that's been a La Jolla celebration move for a generation. The defining La Jolla ocean-view casual dinner." },
  { name: "Jose's Court Room", cuisine: "Mexican", neighborhood: "La Jolla",
    address: "1037 Prospect St, La Jolla, CA 92037",
    lookup: "1037 Prospect St, La Jolla, CA 92037",
    score: 83, price: 2, tags: ["Mexican","Margaritas","Scenic Views","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@josescourtroom", website: "",
    dishes: ["Margaritas","Combination Plates","Prospect St Patio","Sunset Bar Crowd"],
    desc: "La Jolla Village's long-running Mexican-and-margaritas room — a sunset bar crowd that fills the Prospect St windows, the kind of unfussy combination-plate kitchen that the Village has protected for decades. The La Jolla Village margarita move." },
  { name: "The Shores Restaurant", cuisine: "American / Seafood", neighborhood: "La Jolla Shores",
    address: "8110 Camino del Oro, La Jolla, CA 92037",
    lookup: "8110 Camino del Oro, La Jolla, CA 92037",
    score: 85, price: 3, tags: ["American","Seafood","Scenic Views","Date Night","Patio","Celebrations","Iconic"],
    reservation: "OpenTable",
    group: "La Jolla Shores Hotel",
    instagram: "@theshoreslj", website: "https://theshoresrestaurant.com",
    dishes: ["Beachfront Dining","Local Seafood","Sunday Brunch","Pacific-on-the-Plate"],
    desc: "La Jolla Shores Hotel's beach-level restaurant — literally steps off the sand, the most-directly-ocean-facing dining room in La Jolla Shores, and a seafood menu that reads the Pacific on the plate. A La Jolla anniversary standby." },
  { name: "Kono's Cafe", cuisine: "American / Breakfast", neighborhood: "Pacific Beach",
    address: "704 Garnet Ave, San Diego, CA 92109",
    lookup: "704 Garnet Ave, San Diego, CA 92109",
    score: 85, price: 1, tags: ["American","Breakfast","Casual","Iconic","Local Favorites","Scenic Views"],
    reservation: "walk-in",
    instagram: "@konoscafe", website: "https://konoscafe.com",
    dishes: ["Kono's Breakfast Burrito","Surfer's Special","Crystal Pier Views","Weekend Line"],
    desc: "Pacific Beach's surf-culture breakfast counter at the base of Crystal Pier — the Kono's breakfast burrito became SoCal surf-breakfast shorthand, and the morning line down the boardwalk has been part of PB's weekend identity for 40 years." },
  { name: "Miguel's Cocina — Coronado", cuisine: "Mexican", neighborhood: "Coronado",
    address: "1351 Orange Ave, Coronado, CA 92118",
    lookup: "1351 Orange Ave, Coronado, CA 92118",
    score: 83, price: 2, tags: ["Mexican","Margaritas","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    group: "Brigantine Family",
    instagram: "@miguelscocina", website: "https://miguelscocina.com",
    dishes: ["Famous White Sauce","Combination Plates","Margaritas","Patio Dining"],
    desc: "Coronado's Mexican Orange Ave fixture — the 'famous white sauce' shows up on every Coronado dinner conversation, the patio fills every weekend, and the Brigantine Family's Mexican room anchors the island's casual-dinner scene." },
  { name: "The Brigantine — Coronado", cuisine: "American / Seafood", neighborhood: "Coronado",
    address: "1333 Orange Ave, Coronado, CA 92118",
    lookup: "1333 Orange Ave, Coronado, CA 92118",
    score: 83, price: 3, tags: ["American","Seafood","Date Night","Patio","Iconic","Local Favorites","Family Friendly"],
    reservation: "OpenTable",
    group: "Brigantine Family",
    instagram: "@brigantinerestaurants", website: "https://brigantine.com",
    dishes: ["Swordfish","Fresh Catch","Oyster Bar","Happy Hour"],
    desc: "The Brig — Coronado's flagship Brigantine since 1969, the original of the SD seafood chain, with the swordfish plate and happy-hour program that defined SD's suburban-seafood format for half a century. A Coronado weekly call." },
  { name: "Village Pizzeria — Coronado", cuisine: "Italian / Pizza", neighborhood: "Coronado",
    address: "1206 Orange Ave, Coronado, CA 92118",
    lookup: "1206 Orange Ave, Coronado, CA 92118",
    score: 82, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@villagepizzeriacoronado", website: "https://villagepizzeriacoronado.com",
    dishes: ["NY-Style Pizza","Calzones","Family Patio","Little-League-Post-Game Crowd"],
    desc: "Coronado's Orange Ave pizza parlor — NY-style pies, a family patio, and the post-little-league-game crowd that every Coronado kid remembers. An island everyday room." },
  { name: "101 Cafe", cuisine: "American / Diner / Breakfast", neighborhood: "Oceanside",
    address: "631 S Coast Hwy 101, Oceanside, CA 92054",
    lookup: "631 S Coast Hwy 101, Oceanside, CA 92054",
    score: 85, price: 1, tags: ["American","Diner","Breakfast","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@101cafe", website: "https://101cafe.net",
    dishes: ["101 Breakfast","Hash Browns","Chrome-Diner Booths","Highway 101 Memorabilia"],
    desc: "Oceanside's 1928 roadside diner on old Highway 101 — chrome booths, an interior that has barely changed, and a menu that reads like California roadside breakfast from the decade the highway was cut. A defining California-coast diner." },
  { name: "Valle at Mission Pacific Hotel", cuisine: "Mexican / Contemporary Baja", neighborhood: "Oceanside",
    address: "201 N Myers St, Oceanside, CA 92054",
    lookup: "201 N Myers St, Oceanside, CA 92054",
    score: 95, price: 4, tags: ["Fine Dining","Mexican","Baja","Date Night","Celebrations","Critics Pick","Michelin","Trending","Iconic"],
    awards: "Michelin 2 Stars",
    reservation: "Tock",
    suburb: true,
    group: "Mission Pacific Hotel",
    instagram: "@vallemissionpacific", website: "https://vallemissionpacific.com",
    dishes: ["Baja Tasting Menu","Valle de Guadalupe Wines","Modern Regional Mexican","Rooftop-Adjacent Room"],
    desc: "Chef Roberto Alcocer's Oceanside Baja-Mexican — the first Michelin 2-star restaurant in San Diego County, a tasting-menu format drawing from the Valle de Guadalupe, and a dining room inside the Mission Pacific that redefined what North County fine dining meant. A destination reservation." },
  { name: "Swami's Cafe", cuisine: "American / Breakfast / Brunch", neighborhood: "Encinitas",
    address: "1163 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "1163 S Coast Hwy 101, Encinitas, CA 92024",
    score: 83, price: 1, tags: ["American","Breakfast","Brunch","Casual","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    suburb: true,
    group: "Swami's Cafe",
    instagram: "@swamiscafe", website: "https://swamiscafe.com",
    dishes: ["Swami's Special","Buddha Bowl","Garden Patio","Surf-to-Breakfast Crowd"],
    desc: "Encinitas's 101-corridor breakfast institution — named for the Swami's surf break a block away, a menu built around the post-surf breakfast, and a garden patio that fills at sunrise. A Encinitas morning anchor." },
  { name: "Fish 101", cuisine: "Seafood / Casual", neighborhood: "Leucadia / Encinitas",
    address: "1468 N Coast Hwy 101, Encinitas, CA 92024",
    lookup: "1468 N Coast Hwy 101, Encinitas, CA 92024",
    score: 85, price: 2, tags: ["Seafood","Casual","Patio","Family Friendly","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@fish101restaurant", website: "https://fish101restaurant.com",
    dishes: ["Local Fish Sandwich","Grilled Plates","Clam Chowder","Leucadia Patio"],
    desc: "Leucadia's order-counter fish room — locally-caught fish sandwiches and grilled plates, a breezy 101-corridor patio, and a format that made it one of North County's most-used quick-seafood calls." }
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

function inSDBox(c) {
  return c.lat >= 32.45 && c.lat <= 33.40 && c.lng >= -117.40 && c.lng <= -116.75;
}

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
      suburb: !!e.suburb, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (SD: ${arr.length} → ${newArr.length})`);
})();

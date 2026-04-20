#!/usr/bin/env node
// San Diego batch 23 — La Jolla + Coronado + Solana Beach + Oceanside + Encinitas + Hillcrest LGBTQ bars + Mira Mesa brewery (20)
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
  { name: "Farmer's Table — La Jolla", cuisine: "American / Farm-to-Table", neighborhood: "La Jolla / UTC",
    address: "8799 La Jolla Village Dr, San Diego, CA 92037",
    lookup: "8799 La Jolla Village Dr, San Diego, CA 92037",
    score: 84, price: 3, tags: ["American","Farm-to-Table","Brunch","Patio","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    group: "Farmer's Table",
    instagram: "@farmerstable", website: "https://farmerstablesd.com",
    dishes: ["Farm-Driven Menu","Weekend Brunch Program","Patio Dining","UTC Corner"],
    desc: "Farmer's Table's La Jolla/UTC location — the SD-born farm-to-table brand's follow-up to the La Mesa original, with a Sunday brunch program and a patio-centric dining room that anchors the La Jolla Village UTC edge." },
  { name: "Backyard Kitchen & Tap", cuisine: "American / Gastropub", neighborhood: "Pacific Beach",
    address: "832 Garnet Ave, San Diego, CA 92109",
    lookup: "832 Garnet Ave, San Diego, CA 92109",
    score: 83, price: 3, tags: ["American","Gastropub","Patio","Rooftop","Cocktails","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@backyardkitchenandtap", website: "https://backyardkitchenandtap.com",
    dishes: ["Rooftop Patio","Burger Program","Craft Beer List","PB Garnet Ave"],
    desc: "Pacific Beach's Garnet Ave multi-level gastropub — rooftop deck, sports-TV main floor, and a kitchen that holds up past the bar-food default. A defining PB bar-with-a-real-kitchen room." },
  { name: "Night & Day Cafe", cuisine: "American / Breakfast / Brunch", neighborhood: "Coronado",
    address: "847 Orange Ave, Coronado, CA 92118",
    lookup: "847 Orange Ave, Coronado, CA 92118",
    score: 82, price: 2, tags: ["American","Breakfast","Brunch","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Breakfast Burrito","All-Day Diner Menu","Coronado Regulars' Counter","Since 1958"],
    desc: "Coronado's Night & Day Cafe on Orange Ave — an all-day diner-format counter running since 1958, the kind of island institution where the servers know the regulars by their Navy posting years. A Coronado constant." },
  { name: "Tony's Jacal", cuisine: "Mexican", neighborhood: "Solana Beach",
    address: "621 Valley Ave, Solana Beach, CA 92075",
    lookup: "621 Valley Ave, Solana Beach, CA 92075",
    score: 85, price: 2, tags: ["Mexican","Casual","Family Friendly","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@tonysjacal", website: "https://tonysjacal.com",
    dishes: ["Chile Verde","Combination Plates","Fountain Courtyard","Since 1946"],
    desc: "Solana Beach's Tony's Jacal since 1946 — SD County's longest-continuously-running Mexican restaurant, a fountain courtyard patio, and the kind of three-generation family-dinner default that North County hasn't let go of in 80 years." },
  { name: "The Brigantine — Del Mar", cuisine: "American / Seafood", neighborhood: "Del Mar",
    address: "3263 Camino Del Mar, Del Mar, CA 92014",
    lookup: "3263 Camino Del Mar, Del Mar, CA 92014",
    score: 83, price: 3, tags: ["American","Seafood","Date Night","Patio","Iconic","Family Friendly"],
    reservation: "OpenTable",
    suburb: true,
    group: "Brigantine Family",
    instagram: "@brigantinerestaurants", website: "https://brigantine.com",
    dishes: ["Swordfish","Happy Hour Program","Del Mar Patio","Near Racetrack"],
    desc: "The Brig's Del Mar Village location — Brigantine Family format near the racetrack, with the same swordfish, happy hour, and Del Mar-scale dining room reliability that defined the North County Brigantine default." },
  { name: "Ki's Restaurant", cuisine: "American / Californian / Vegetarian", neighborhood: "Cardiff-by-the-Sea",
    address: "2591 S Coast Hwy 101, Cardiff, CA 92007",
    lookup: "2591 S Coast Hwy 101, Cardiff, CA 92007",
    score: 84, price: 2, tags: ["American","Californian","Vegetarian","Brunch","Casual","Scenic Views","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@kisrestaurant", website: "https://kisrestaurant.com",
    dishes: ["Avocado Toast","Breakfast Burritos","Ocean-View Patio","Cardiff Surf-Culture Anchor"],
    desc: "Cardiff-by-the-Sea's surf-culture café on the 101 — ocean-view patio across from the break, a vegetarian-friendly breakfast menu, and the kind of Cardiff morning constant that made Ki's part of the North County coastal identity." },
  { name: "Dark Horse Coffee Roasters — North Park", cuisine: "Coffee / Cafe", neighborhood: "North Park",
    address: "3260 University Ave, San Diego, CA 92104",
    lookup: "3260 University Ave, San Diego, CA 92104",
    score: 85, price: 1, tags: ["Coffee","Cafe","Casual","Critics Pick","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Dark Horse Coffee",
    instagram: "@darkhorsecoffee", website: "https://darkhorsecoffeeroasters.com",
    dishes: ["In-House Roasted Coffee","Pour Over Program","Espresso Counter","North Park Roastery"],
    desc: "North Park's Dark Horse Coffee — in-house roasting, direct-trade sourcing, and a University Ave café that reads as one of SD's defining third-wave coffee rooms. A North Park roaster-café anchor." },
  { name: "Revolution Roasters", cuisine: "Coffee / Cafe", neighborhood: "Oceanside",
    address: "1114 S Cleveland St, Oceanside, CA 92054",
    lookup: "1114 S Cleveland St, Oceanside, CA 92054",
    score: 84, price: 1, tags: ["Coffee","Cafe","Casual","Local Favorites","Trending"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@revolutionroasters", website: "https://revolutionroasters.com",
    dishes: ["Specialty Espresso","Single-Origin Pour-Overs","Oceanside Roastery","Cleveland St Cafe"],
    desc: "Oceanside's Revolution Roasters — an Oceanside-based specialty coffee roaster with a Cleveland St café flagship, and a program that put North County specialty coffee on the SD map." },
  { name: "Zanzibar Cafe", cuisine: "Mediterranean / Cafe / Bakery", neighborhood: "La Jolla",
    address: "707 Pearl St, La Jolla, CA 92037",
    lookup: "707 Pearl St, La Jolla, CA 92037",
    score: 83, price: 2, tags: ["Mediterranean","Cafe","Bakery","Breakfast","Casual","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@zanzibarcafe", website: "",
    dishes: ["Mediterranean Breakfast","Pastry Case","La Jolla Pearl St Counter","Since 1995"],
    desc: "La Jolla Village's Zanzibar — a Mediterranean-style all-day café on Pearl St since the mid-90s, a pastry counter and breakfast program that locals have kept in the morning rotation for three decades. A Pearl St constant." },
  { name: "Beach Break Cafe", cuisine: "American / Breakfast / Brunch", neighborhood: "Oceanside",
    address: "1802 S Coast Hwy, Oceanside, CA 92054",
    lookup: "1802 S Coast Hwy, Oceanside, CA 92054",
    score: 84, price: 2, tags: ["American","Breakfast","Brunch","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@beachbreakcafe", website: "https://beachbreakcafe.com",
    dishes: ["Stuffed French Toast","Country Breakfast","Oceanside Surf-Breakfast Line","Coast Hwy"],
    desc: "Oceanside's Beach Break Cafe on South Coast Highway — a stuffed-French-toast-driven menu, weekend lines around the block, and a surf-culture breakfast crowd that has made it the Oceanside morning anchor." },
  { name: "Rudford's Restaurant", cuisine: "American / Diner", neighborhood: "Normal Heights",
    address: "2900 El Cajon Blvd, San Diego, CA 92104",
    lookup: "2900 El Cajon Blvd, San Diego, CA 92104",
    score: 83, price: 1, tags: ["American","Diner","Breakfast","Late Night","Iconic","Local Favorites","24-Hour"],
    reservation: "walk-in",
    instagram: "@rudfordsrestaurant", website: "",
    dishes: ["24-Hour Diner Menu","Cherry Pie","Blue-Plate Specials","Since 1949"],
    desc: "Normal Heights' 24-hour diner since 1949 — blue-plate specials, a cherry pie case, and an El Cajon Blvd counter that has been feeding SD's overnight shift workers and late-night crowd for over 75 years." },
  { name: "Karl Strauss Brewing Co. — Mira Mesa", cuisine: "American / Brewery", neighborhood: "Mira Mesa",
    address: "9675 Scranton Rd, San Diego, CA 92121",
    lookup: "9675 Scranton Rd, San Diego, CA 92121",
    score: 82, price: 2, tags: ["American","Brewery","Casual","Patio","Family Friendly","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Karl Strauss Brewing",
    instagram: "@karlstrauss", website: "https://karlstrauss.com",
    dishes: ["House Beers","Brewpub Menu","Mira Mesa Production Brewery","Garden Patio"],
    desc: "Karl Strauss's Mira Mesa production brewery and flagship brewpub — a sprawling garden patio, a full pub kitchen, and the suburban-brewery format that the SD craft-beer pioneer scaled from downtown." },
  { name: "Mission Brewery", cuisine: "American / Brewery", neighborhood: "East Village",
    address: "1441 L St, San Diego, CA 92101",
    lookup: "1441 L St, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Iconic","Local Favorites","Craft Beer","Historic"],
    reservation: "walk-in",
    group: "Mission Brewery",
    instagram: "@missionbrewery", website: "https://missionbrewery.com",
    dishes: ["Amber Ale","Shipwrecked IPA","Historic 1894 Wonder Bread Building","East Village Taproom"],
    desc: "East Village's Mission Brewery inside a 1894 Wonder Bread bakery building — a historic industrial taproom with high ceilings and brick walls, a craft-beer program that anchors the East Village brewery spine. A defining SD historic-building brewery." },
  { name: "Rich's San Diego", cuisine: "American / Bar / Nightclub", neighborhood: "Hillcrest",
    address: "1051 University Ave, San Diego, CA 92103",
    lookup: "1051 University Ave, San Diego, CA 92103",
    score: 83, price: 2, tags: ["American","Bar","Nightclub","LGBTQ+","Late Night","Dance Floor","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@richssd", website: "https://richssandiego.com",
    dishes: ["Dance Floor","DJ Program","LGBTQ+ Nightclub","Hillcrest Late Night Since 1985"],
    desc: "Hillcrest's Rich's since 1985 — a University Ave LGBTQ+ dance club that has been central to the SD gay-nightlife identity for four decades. The Hillcrest club reference." },
  { name: "Gossip Grill", cuisine: "American / Bar / Restaurant", neighborhood: "Hillcrest",
    address: "1220 University Ave, San Diego, CA 92103",
    lookup: "1220 University Ave, San Diego, CA 92103",
    score: 83, price: 2, tags: ["American","Bar","LGBTQ+","Patio","Late Night","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@gossipgrill", website: "https://gossipgrill.com",
    dishes: ["Pub Menu","Women-Focused LGBTQ+ Format","Patio Program","Hillcrest Bar Anchor"],
    desc: "Hillcrest's Gossip Grill — SD's rare women-focused LGBTQ+ bar-and-restaurant on University Ave, a patio-and-dining-room format, and a Hillcrest community space that fills every weekend. A defining Hillcrest LGBTQ+ anchor." },
  { name: "Lestat's Coffee House", cuisine: "Coffee / Cafe", neighborhood: "Normal Heights",
    address: "3343 Adams Ave, San Diego, CA 92116",
    lookup: "3343 Adams Ave, San Diego, CA 92116",
    score: 83, price: 1, tags: ["Coffee","Cafe","Casual","Late Night","24-Hour","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Lestat's",
    instagram: "@lestatscoffee", website: "https://lestats.com",
    dishes: ["24-Hour Coffee House","Pastry Case","Live Music Room","Adams Ave Since 1999"],
    desc: "Normal Heights' Lestat's since 1999 — a 24-hour coffee house, a small live-music room attached, and an Adams Ave counter that has been SD's overnight coffee default for a quarter century." },
  { name: "Cafe Virtuoso", cuisine: "Coffee / Cafe", neighborhood: "Barrio Logan / Logan Heights",
    address: "1616 National Ave, San Diego, CA 92113",
    lookup: "1616 National Ave, San Diego, CA 92113",
    score: 85, price: 1, tags: ["Coffee","Cafe","Casual","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@cafevirtuoso", website: "https://cafevirtuoso.com",
    dishes: ["Organic Fair-Trade Roasting","Espresso Counter","Barrio Logan Roastery","Cafe + Classroom"],
    desc: "Barrio Logan's Cafe Virtuoso — an organic, fair-trade roastery with a working cafe attached, barista training classes, and a National Ave production facility that reads as one of SD's most-ethically-intentional coffee programs." },
  { name: "Encontro North Park", cuisine: "Italian / Modern", neighborhood: "North Park",
    address: "2325 El Cajon Blvd, San Diego, CA 92104",
    lookup: "2325 El Cajon Blvd, San Diego, CA 92104",
    score: 86, price: 3, tags: ["Italian","Modern","Date Night","Patio","Trending","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@encontronp", website: "https://encontronorthpark.com",
    dishes: ["House-Made Pasta","Wood-Fired Pizza","Natural Wine List","North Park El Cajon Blvd"],
    desc: "North Park's modern Italian on El Cajon Blvd — a handmade pasta program, wood-fired pizza, a natural wine list, and a North Park dining room that's become part of the neighborhood's newer-Italian conversation alongside Caffe Calabria and Ambrogio15." },
  { name: "Roxy Encinitas", cuisine: "Thai / Asian Fusion", neighborhood: "Encinitas",
    address: "517 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "517 S Coast Hwy 101, Encinitas, CA 92024",
    score: 83, price: 2, tags: ["Thai","Asian Fusion","Casual","Family Friendly","Local Favorites","Iconic","Patio"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@roxyencinitas", website: "https://roxyencinitas.com",
    dishes: ["Thai Curry","Asian Fusion Menu","101 Corridor Patio","Encinitas Since 1980"],
    desc: "Encinitas's Roxy since 1980 — a Thai-and-Pan-Asian dining room on the 101, a vegetarian-friendly menu, and a sidewalk patio that's been part of the Encinitas downtown fabric for four decades." },
  { name: "Bub's at the Beach — Oceanside", cuisine: "American / Bar / Sports", neighborhood: "Oceanside",
    address: "109 Pier View Way, Oceanside, CA 92054",
    lookup: "109 Pier View Way, Oceanside, CA 92054",
    score: 81, price: 2, tags: ["American","Bar","Sports","Patio","Casual","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@bubsatthebeach", website: "https://bubsatthebeach.com",
    dishes: ["Pier-Adjacent Bar Menu","Tater Tot Program","Sports TV Wall","Oceanside Pier"],
    desc: "Oceanside's pier-adjacent sports bar — a bar menu with a tater tot program that became an Oceanside argument, a Pier View Way patio, and the crowd that fills every Chargers/Padres TV day. An Oceanside everyday anchor." }
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
        if (i === attempts - 1) { console.log(`  ⚠ ${e.message}`); return resolve(null); }
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    resolve(null);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, 1100));

function inSDBox(c, name) {
  const gaslampTight = /Gaslamp|East Village|Little Italy|^Downtown$|^Downtown \/ Embarcadero$/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

const manualFallback = {
  "Mission Brewery":  { lat: 32.7085, lng: -117.1545 }  // 1441 L St East Village
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

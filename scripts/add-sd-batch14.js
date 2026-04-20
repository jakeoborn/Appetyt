#!/usr/bin/env node
// San Diego batch 14 — A.R. Valentien + University Heights + Barrio Logan + La Mesa + Escondido + Oceanside/Carlsbad (18)
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
  { name: "A.R. Valentien", cuisine: "Californian / Fine Dining", neighborhood: "La Jolla / Torrey Pines",
    address: "11480 N Torrey Pines Rd, La Jolla, CA 92037",
    lookup: "11480 N Torrey Pines Rd, La Jolla, CA 92037",
    score: 91, price: 4, tags: ["Fine Dining","Californian","Date Night","Celebrations","Critics Pick","Scenic Views","Iconic"],
    reservation: "OpenTable",
    group: "The Lodge at Torrey Pines",
    instagram: "@arvalentien", website: "https://arvalentien.com",
    dishes: ["Farm-Driven Tasting","Local Sonoma Seafood","Craftsman-Era Dining Room","Golf-Course View"],
    desc: "Chef Jeff Jackson's Californian fine-dining flagship at The Lodge at Torrey Pines — a Craftsman-era dining room overlooking the Torrey Pines golf course, a farm-driven menu with long-standing SD-grower relationships, and one of North SD's most-decorated special-occasion tables." },
  { name: "The Med at La Valencia Hotel", cuisine: "Mediterranean / Californian", neighborhood: "La Jolla",
    address: "1132 Prospect St, La Jolla, CA 92037",
    lookup: "1132 Prospect St, La Jolla, CA 92037",
    score: 87, price: 4, tags: ["Fine Dining","Mediterranean","Californian","Date Night","Scenic Views","Patio","Iconic","Celebrations"],
    reservation: "OpenTable",
    group: "La Valencia Hotel",
    instagram: "@lavalenciahotel", website: "https://lavalencia.com/dining",
    dishes: ["Mediterranean Tasting","Cove-Facing Patio","Sunday Brunch","Pink Lady Hotel Setting"],
    desc: "La Jolla's Pink Lady hotel — La Valencia since 1926 — runs The Med as its fine-dining anchor, with a Cove-facing patio that reads like La Jolla's postcard. Mediterranean-Californian menu and the kind of Sunday brunch La Jolla families have used for generations." },
  { name: "The Taco Stand — La Jolla", cuisine: "Mexican / Tacos", neighborhood: "La Jolla",
    address: "621 Pearl St, La Jolla, CA 92037",
    lookup: "621 Pearl St, La Jolla, CA 92037",
    score: 86, price: 1, tags: ["Mexican","Tacos","Casual","Quick Bite","Iconic","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "The Taco Stand",
    instagram: "@letstaco", website: "https://letstacoaboutit.com",
    dishes: ["Baja Fish Taco","Adobada","Al Pastor","Handmade Tortillas"],
    desc: "The TJ-import taco shop's La Jolla counter — handmade tortillas, adobada-trompo, and a Pearl St line that tells you why The Taco Stand is one of the fastest-growing SD-born brands. The Village street-taco shorthand." },
  { name: "Con Pane Rustic Breads & Cafe", cuisine: "Bakery / Cafe", neighborhood: "Point Loma / Liberty Station",
    address: "2750 Dewey Rd Ste 104, San Diego, CA 92106",
    lookup: "2750 Dewey Rd, San Diego, CA 92106",
    score: 87, price: 1, tags: ["Bakery","Cafe","Casual","Critics Pick","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@conpanesd", website: "https://conpanebread.com",
    dishes: ["Sourdough Loaves","Morning Buns","Sandwich Program","Liberty Station Courtyard"],
    desc: "Liberty Station's artisan bakery anchor — Chef Catherine Perez's long-ferment sourdough, morning buns, and a sandwich counter that generates the Liberty Station morning-and-lunch line. One of SD's reference bread programs." },
  { name: "Kairoa Brewing Company", cuisine: "American / Brewery", neighborhood: "University Heights",
    address: "4601 Park Blvd, San Diego, CA 92116",
    lookup: "4601 Park Blvd, San Diego, CA 92116",
    score: 83, price: 2, tags: ["American","Brewery","Gastropub","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Kairoa Brewing",
    instagram: "@kairoabrewing", website: "https://kairoabrewing.com",
    dishes: ["New Zealand-Hopped Beers","Lamb Burger","Aotearoa-Themed Menu","Park Blvd Patio"],
    desc: "University Heights' New Zealand-themed brewpub — Aotearoa-hopped beers, a lamb-burger-driven menu, and a Park Blvd building whose rooftop patio became a UH weekend call. A University Heights beer-room original." },
  { name: "Small Bar", cuisine: "American / Bar", neighborhood: "University Heights",
    address: "4628 Park Blvd, San Diego, CA 92116",
    lookup: "4628 Park Blvd, San Diego, CA 92116",
    score: 83, price: 2, tags: ["American","Bar","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@smallbarsd", website: "https://smallbarsd.com",
    dishes: ["Craft Beer Rotation","Bar Menu","Park Blvd Patio","Neighborhood Room"],
    desc: "CH Projects' University Heights neighborhood beer-and-bar-menu room — the shorthand UH regulars default to when they want a controlled craft-beer program without the scene. A CH Projects everyday anchor." },
  { name: "Ponce's Mexican Restaurant", cuisine: "Mexican", neighborhood: "Kensington",
    address: "4050 Adams Ave, San Diego, CA 92116",
    lookup: "4050 Adams Ave, San Diego, CA 92116",
    score: 83, price: 2, tags: ["Mexican","Margaritas","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@poncesmexican", website: "https://poncesmexican.com",
    dishes: ["Enchiladas","Combination Plates","Margaritas","Kensington Crowd Since 1969"],
    desc: "Kensington's Adams Ave Mexican fixture since 1969 — enchiladas, combination plates, and a margarita crowd of Kensington regulars who treat Ponce's as a three-generation default. A longtime SD neighborhood Mexican." },
  { name: "Mujeres Brew House", cuisine: "American / Brewery", neighborhood: "Barrio Logan",
    address: "1983 Julian Ave, San Diego, CA 92113",
    lookup: "1983 Julian Ave, San Diego, CA 92113",
    score: 85, price: 2, tags: ["American","Brewery","Casual","Women-Owned","Trending","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@mujeresbrewhouse", website: "https://mujeresbrewhouse.com",
    dishes: ["Women-Brewed Program","Mexican-Influenced Beers","Community Taproom","Barrio Logan Anchor"],
    desc: "Barrio Logan's women-led brewery — the only women-owned Latina-led brewery in San Diego County, a beer program that draws from Mexican ingredient culture, and a Barrio Logan taproom that functions as a community hub. A specific, locally-important room." },
  { name: "BO-beau Kitchen + Garden — La Mesa", cuisine: "French / Bistro", neighborhood: "La Mesa",
    address: "8384 La Mesa Blvd, La Mesa, CA 91942",
    lookup: "8384 La Mesa Blvd, La Mesa, CA 91942",
    score: 84, price: 3, tags: ["French","Bistro","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    group: "Cohn Restaurant Group",
    instagram: "@bobeaula mesa", website: "https://cohnrestaurants.com/bobeau-la-mesa",
    dishes: ["Moules Frites","Brussels Sprouts","Garden Patio","Duck Confit"],
    desc: "Cohn Restaurant Group's La Mesa Village French bistro — a garden patio that reads as East County's closest thing to a European streetscape, moules frites, duck confit, and the crispy Brussels that the family built into a multi-location SD signature." },
  { name: "The Brigantine — La Mesa", cuisine: "American / Seafood", neighborhood: "La Mesa",
    address: "8330 La Mesa Blvd, La Mesa, CA 91942",
    lookup: "8330 La Mesa Blvd, La Mesa, CA 91942",
    score: 82, price: 3, tags: ["American","Seafood","Date Night","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    group: "Brigantine Family",
    instagram: "@brigantinerestaurants", website: "https://brigantine.com",
    dishes: ["Fresh Catch","Swordfish","Happy Hour","La Mesa Village Patio"],
    desc: "The Brig's La Mesa Village location — the Brigantine Family's East County seafood room, with the same swordfish and happy-hour format that defines the brand, tuned for La Mesa Village's main street." },
  { name: "Hacienda de Vega", cuisine: "Mexican", neighborhood: "Escondido",
    address: "2608 S Escondido Blvd, Escondido, CA 92025",
    lookup: "2608 S Escondido Blvd, Escondido, CA 92025",
    score: 85, price: 3, tags: ["Mexican","Date Night","Scenic Views","Patio","Iconic","Celebrations","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@haciendadevega", website: "https://haciendadevega.com",
    dishes: ["Mole Poblano","Chiles en Nogada","Koi-Pond Patio","Hacienda-Style Dining Rooms"],
    desc: "Escondido's hacienda-style Mexican destination — koi-pond gardens, multiple dining patios, and a regional Mexican menu with a mole program that North County residents book for anniversaries. A defining Escondido special-occasion room." },
  { name: "Vintana Wine + Dine", cuisine: "Californian / Modern American", neighborhood: "Escondido",
    address: "1205 Auto Park Way, Escondido, CA 92029",
    lookup: "1205 Auto Park Way, Escondido, CA 92029",
    score: 86, price: 4, tags: ["Fine Dining","Californian","American","Date Night","Scenic Views","Patio","Critics Pick","Celebrations"],
    reservation: "OpenTable",
    suburb: true,
    group: "Carl Schroeder",
    instagram: "@vintanawine", website: "https://vintanawineanddine.com",
    dishes: ["Chef's Market Menu","Rooftop Patio","Wine List Anchor","Carl Schroeder Program"],
    desc: "Chef Carl Schroeder's second-floor Escondido restaurant above Lexus of Escondido — a rooftop patio with North County hills views, a market-driven menu, and a wine list that rivals anything North County has. A specific destination in an unlikely location." },
  { name: "333 Pacific", cuisine: "American / Seafood / Steakhouse", neighborhood: "Oceanside",
    address: "333 N Pacific St, Oceanside, CA 92054",
    lookup: "333 N Pacific St, Oceanside, CA 92054",
    score: 86, price: 4, tags: ["Fine Dining","American","Seafood","Steakhouse","Date Night","Scenic Views","Celebrations","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    group: "Cohn Restaurant Group",
    instagram: "@333pacific", website: "https://cohnrestaurants.com/333pacific",
    dishes: ["Chilean Sea Bass","Prime Steaks","Sushi Bar","Pier-Adjacent Ocean Views"],
    desc: "Cohn Restaurant Group's Oceanside fine-dining flagship — directly across from the Oceanside Pier, a raw bar and steakhouse format, and the defining North County pier-view special-occasion room since 2008." },
  { name: "Senor Grubby's", cuisine: "Mexican", neighborhood: "Carlsbad",
    address: "377 Carlsbad Village Dr, Carlsbad, CA 92008",
    lookup: "377 Carlsbad Village Dr, Carlsbad, CA 92008",
    score: 83, price: 2, tags: ["Mexican","Casual","Family Friendly","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@senorgrubbys", website: "https://senorgrubbys.com",
    dishes: ["California Burrito","Fish Tacos","Carne Asada Fries","Carlsbad Village Patio"],
    desc: "Carlsbad Village's no-pretense Mexican — California burrito, carne asada fries, and a patio crowd that has treated Señor Grubby's as the Village everyday default for two decades. A Carlsbad Village shorthand." },
  { name: "Belching Beaver Brewery — Vista", cuisine: "American / Brewery", neighborhood: "Vista",
    address: "980 Park Center Dr, Vista, CA 92081",
    lookup: "980 Park Center Dr, Vista, CA 92081",
    score: 84, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    suburb: true,
    group: "Belching Beaver",
    instagram: "@belchingbeaver", website: "https://belchingbeaver.com",
    dishes: ["Peanut Butter Milk Stout","Phantom Bride IPA","Tasting Room Program","North County Flagship"],
    desc: "Vista's Belching Beaver — the peanut butter milk stout that became a North County craft-beer argument, a taproom that drew the Vista brewery crowd, and one of North County's most-distributed SD-born brands. The NC beer-flag call." },
  { name: "Vigilucci's Pizzeria Trattoria", cuisine: "Italian / Pizza", neighborhood: "Encinitas",
    address: "1440 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "1440 S Coast Hwy 101, Encinitas, CA 92024",
    score: 83, price: 2, tags: ["Italian","Pizza","Date Night","Patio","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    group: "Vigilucci's",
    instagram: "@vigiluccis", website: "https://vigiluccis.com",
    dishes: ["Wood-Fired Pizza","House-Made Pasta","101-Patio","Vigilucci Family Program"],
    desc: "The Vigilucci family's Encinitas pizzeria-trattoria — Roberto Vigilucci's multi-location North County Italian empire with the Encinitas 101 location as the family-patio anchor. House-made pasta, wood-fired pizza, and a North County Italian standby." },
  { name: "Pacific Coast Grill", cuisine: "American / Seafood", neighborhood: "Cardiff-by-the-Sea",
    address: "2526 S Coast Hwy 101, Cardiff, CA 92007",
    lookup: "2526 S Coast Hwy 101, Cardiff, CA 92007",
    score: 85, price: 3, tags: ["American","Seafood","Date Night","Scenic Views","Patio","Local Favorites","Iconic"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@pacificcoastgrill", website: "https://pacificcoastgrill.com",
    dishes: ["Pacific Catch","Seared Tuna","Cardiff 101 Patio","Sunset Ocean Views"],
    desc: "Cardiff-by-the-Sea's oceanfront American — a 101-corridor patio that drops into the Pacific, seared tuna and catch-of-the-day program, and one of North County's longest-running coastal-view rooms." },
  { name: "Queen's Lobster Escondido — Hacienda", cuisine: "SKIP", neighborhood: "", address: "", lookup: "" }
].filter(e => e.cuisine !== "SKIP");

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

function inSDBox(c, name) {
  const gaslampTight = /Gaslamp|East Village|Little Italy/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
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
    if (!c || !inSDBox(c, e.neighborhood)) {
      const simple = e.lookup.replace(/#\S+,?\s*/i, "").replace(/Ste \S+,?\s*/i, "");
      if (simple !== e.lookup) { await sleep(1100); c = await nominatim(simple); }
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

#!/usr/bin/env node
// San Diego batch 7 — more La Jolla + rooftop bars + iconic bakeries/breweries/coffee (18 training-verified)
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
  { name: "Herringbone La Jolla", cuisine: "Seafood / Modern American", neighborhood: "La Jolla",
    address: "7837 Herschel Ave, La Jolla, CA 92037",
    lookup: "7837 Herschel Ave, La Jolla, CA 92037",
    score: 86, price: 3, tags: ["Seafood","American","Date Night","Critics Pick","Patio","Trending"],
    reservation: "OpenTable",
    instagram: "@herringbonelj", website: "https://herringboneeats.com",
    dishes: ["Whole Roasted Fish","Oyster Bar","Brunch Program","Live-Tree Dining Room"],
    desc: "La Jolla Village seafood room in a 100-year-old warehouse — live olive trees inside, raw bar, and a sprawling dining room that anchored La Jolla's modern-seafood scene. One of the Village's most-photographed interiors." },
  { name: "Whisknladle", cuisine: "Californian / Farm-to-Table", neighborhood: "La Jolla",
    address: "1044 Wall St, La Jolla, CA 92037",
    lookup: "1044 Wall St, La Jolla, CA 92037",
    score: 87, price: 3, tags: ["Californian","Farm-to-Table","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@whisknladlelj", website: "https://whisknladle.com",
    dishes: ["House-Made Charcuterie","Seasonal Small Plates","Wood-Fired Pizza","Patio Program"],
    desc: "La Jolla Village farm-to-table — chef-driven since 2008, with an in-house charcuterie program and a Wall St patio that reads like a European café transplanted. A La Jolla local's weekly call." },
  { name: "Piatti La Jolla", cuisine: "Italian", neighborhood: "La Jolla Shores",
    address: "2182 Avenida de la Playa, La Jolla, CA 92037",
    lookup: "2182 Avenida de la Playa, La Jolla, CA 92037",
    score: 85, price: 3, tags: ["Italian","Date Night","Family Friendly","Patio","Local Favorites","Iconic"],
    reservation: "OpenTable",
    group: "Piatti Restaurants",
    instagram: "@piattilajolla", website: "https://piatti.com",
    dishes: ["House-Made Pasta","Wood-Fired Pizza","Veal Saltimbocca","Beachside Patio"],
    desc: "La Jolla Shores' Italian neighborhood room — a block from the beach, house-made pasta, and the kind of sidewalk patio that generations of La Jolla families have circled. The Shores Italian shorthand." },
  { name: "Catania", cuisine: "Italian / Coastal Italian", neighborhood: "La Jolla",
    address: "7863 Girard Ave, La Jolla, CA 92037",
    lookup: "7863 Girard Ave, La Jolla, CA 92037",
    score: 86, price: 3, tags: ["Italian","Date Night","Scenic Views","Patio","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@cataniarestaurant", website: "https://cataniarestaurant.com",
    dishes: ["Wood-Fired Pizza","House-Made Pasta","Whole Branzino","Rooftop Patio"],
    desc: "La Jolla Village's coastal Italian rooftop — third-floor patio with ocean glimpses, a wood-fired oven at the center of the kitchen, and a pasta program that turned a Girard Ave rooftop into a La Jolla date-night regular." },
  { name: "Barbarella Restaurant", cuisine: "Mediterranean / Eclectic", neighborhood: "La Jolla Shores",
    address: "2171 Avenida de la Playa, La Jolla, CA 92037",
    lookup: "2171 Avenida de la Playa, La Jolla, CA 92037",
    score: 84, price: 3, tags: ["Mediterranean","American","Patio","Date Night","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@barbarellarestaurant", website: "https://barbarellarestaurant.com",
    dishes: ["Eclectic Menu","Pasta","Steaks","Patio Dining"],
    desc: "La Jolla Shores' eclectic neighborhood bistro — open since the 1980s, a dog-friendly patio across from the beach, and a menu that wanders from pasta to paella. A Shores institution that refuses to be any one thing." },
  { name: "Hob Nob Hill", cuisine: "American / Diner / Breakfast", neighborhood: "Bankers Hill",
    address: "2271 First Ave, San Diego, CA 92101",
    lookup: "2271 First Ave, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Diner","Breakfast","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@hobnobhillsd", website: "https://hobnobhill.com",
    dishes: ["Liver & Onions","Corned Beef Hash","Pot Roast","1944-Era Diner Menu"],
    desc: "Bankers Hill's 1944 diner — corned beef hash, liver and onions, and a menu that reads like postwar SD never left. Counter service, booths, and a crowd of regulars who've been ordering the same breakfast for 40 years." },
  { name: "Karl Strauss Brewing Company — Downtown", cuisine: "American / Brewery", neighborhood: "Downtown",
    address: "1157 Columbia St, San Diego, CA 92101",
    lookup: "1157 Columbia St, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "Karl Strauss Brewing",
    instagram: "@karlstrauss", website: "https://karlstrauss.com",
    dishes: ["Red Trolley Ale","Mosaic Session IPA","Brewpub Burger","Pretzel"],
    desc: "SD's founding craft brewpub — opened 1989 by Karl Strauss, credited as the first craft brewery in modern San Diego. The downtown Columbia St original remains the flagship and the local shorthand for 'SD craft beer origin story.'" },
  { name: "The Nolen Rooftop Bar", cuisine: "Cocktail Bar / Rooftop", neighborhood: "Gaslamp",
    address: "453 Sixth Ave, San Diego, CA 92101",
    lookup: "453 Sixth Ave, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Cocktail Bar","Rooftop","Scenic Views","Date Night","Trending","Patio"],
    reservation: "walk-in",
    instagram: "@thenolenrooftop", website: "https://thenolenrooftop.com",
    dishes: ["Craft Cocktails","Sunset Skyline Views","Small Plates","DJ Program"],
    desc: "Gaslamp rooftop bar atop the Courtyard by Marriott — skyline views from downtown to Petco, a cocktail program that holds up to the altitude, and one of Gaslamp's defining sunset-to-late-night rooftops." },
  { name: "Altitude Sky Lounge", cuisine: "Cocktail Bar / Rooftop", neighborhood: "Gaslamp",
    address: "660 K St, San Diego, CA 92101",
    lookup: "660 K St, San Diego, CA 92101",
    score: 83, price: 3, tags: ["Cocktail Bar","Rooftop","Scenic Views","Patio","Iconic"],
    reservation: "walk-in",
    group: "Marriott Marquis Gaslamp",
    instagram: "@altitudeskylounge", website: "https://altitudeskylounge.com",
    dishes: ["Craft Cocktails","Petco Park Views","Small Plates","Game-Night Program"],
    desc: "The Marriott Marquis Gaslamp rooftop — looking directly over Petco Park, SD's most-used game-night rooftop and one of the city's first serious sky lounges. Still the Gaslamp landmark rooftop." },
  { name: "Modern Times Beer Lomaland Fermentorium", cuisine: "American / Brewery", neighborhood: "Point Loma",
    address: "3725 Greenwood St, San Diego, CA 92110",
    lookup: "3725 Greenwood St, San Diego, CA 92110",
    score: 85, price: 2, tags: ["American","Brewery","Casual","Patio","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Modern Times Beer",
    instagram: "@moderntimesbeer", website: "https://moderntimesbeer.com",
    dishes: ["Black House Coffee Stout","Orderville IPA","Vegan Brewpub Menu","Mural-Covered Taproom"],
    desc: "Modern Times' Point Loma production brewery and tasting room — the mural-wrapped Lomaland home base of one of SD's most design-forward beer brands. Fully vegan kitchen, coffee-beer program, and the kind of taproom that reads like a destination gallery." },
  { name: "Societe Brewing Company", cuisine: "American / Brewery", neighborhood: "Kearny Mesa",
    address: "8262 Clairemont Mesa Blvd, San Diego, CA 92111",
    lookup: "8262 Clairemont Mesa Blvd, San Diego, CA 92111",
    score: 85, price: 2, tags: ["American","Brewery","Casual","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Societe Brewing",
    instagram: "@societebrewing", website: "https://societebrewing.com",
    dishes: ["The Pupil IPA","The Harlot Belgian","The Apprentice IPA","Taproom Pours Only"],
    desc: "One of San Diego's most-respected breweries — Kearny Mesa production facility, The Pupil IPA as the reference, and a program disciplined enough that local brewers name-drop Societe as the technique benchmark. The beer-geek taproom." },
  { name: "Ballast Point Little Italy", cuisine: "American / Brewery", neighborhood: "Little Italy",
    address: "2215 India St, San Diego, CA 92101",
    lookup: "2215 India St, San Diego, CA 92101",
    score: 82, price: 2, tags: ["American","Brewery","Casual","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Ballast Point Brewing",
    instagram: "@ballastpoint", website: "https://ballastpoint.com",
    dishes: ["Sculpin IPA","Grapefruit Sculpin","Brewpub Kitchen","India Street Patio"],
    desc: "Ballast Point's Little Italy flagship — India Street patio, Sculpin IPA on every table, and one of the SD craft-beer brands that helped define the city's IPA reputation. The in-town Ballast Point move." },
  { name: "Donut Bar", cuisine: "Dessert / Donuts / Bakery", neighborhood: "Downtown",
    address: "631 B St, San Diego, CA 92101",
    lookup: "631 B St, San Diego, CA 92101",
    score: 84, price: 1, tags: ["Dessert","Bakery","Casual","Quick Bite","Iconic","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@donutbarsd", website: "https://donutbar.com",
    dishes: ["Creme Brulee Donut","Big Poppa Tart","Homer Pink","Same-Day Only"],
    desc: "Downtown's destination donut counter — oversized, over-top creations, a same-day-only model, and a morning line that stretches down B Street. One of SD's most-photographed bakery programs." },
  { name: "Nomad Donuts", cuisine: "Dessert / Donuts / Bakery", neighborhood: "North Park",
    address: "4504 30th St, San Diego, CA 92116",
    lookup: "4504 30th St, San Diego, CA 92116",
    score: 84, price: 1, tags: ["Dessert","Bakery","Brunch","Quick Bite","Critics Pick","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@nomaddonuts", website: "https://nomaddonuts.com",
    dishes: ["Brioche Donuts","Cardamom-Saffron","Matcha","Seasonal Rotating Menu"],
    desc: "North Park's chef-driven donut shop — brioche-base donuts, globally-sourced flavors (cardamom-saffron, matcha, black sesame), and a rotation that treats the format like pastry. The SD donut-snob answer." },
  { name: "Raised by Wolves", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "La Jolla / UTC",
    address: "4545 La Jolla Village Dr, San Diego, CA 92122",
    lookup: "4545 La Jolla Village Dr, San Diego, CA 92122",
    score: 90, price: 4, tags: ["Cocktail Bar","Speakeasy","Date Night","Critics Pick","Trending","Hidden Gem"],
    reservation: "Resy",
    group: "Consortium Holdings / CH Projects",
    instagram: "@raisedbywolvessd", website: "https://raisedbywolves.bar",
    dishes: ["Rare Spirits Collection","Hidden Back Room","Spirits-Forward Cocktails","Retail Bottle Shop"],
    desc: "CH Projects' Westfield UTC speakeasy — a retail spirits shop fronting one of the country's most-serious cocktail back rooms, with a rare-spirits library that bartenders travel for. A national cocktail destination hidden in a La Jolla mall." },
  { name: "Bread & Cie", cuisine: "Bakery / Cafe / French", neighborhood: "Hillcrest",
    address: "350 University Ave, San Diego, CA 92103",
    lookup: "350 University Ave, San Diego, CA 92103",
    score: 84, price: 1, tags: ["Bakery","Cafe","Breakfast","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@breadandciebakery", website: "https://breadandciebakery.com",
    dishes: ["Rustic Breads","Morning Buns","Sandwiches","Coffee Counter"],
    desc: "Hillcrest's European-style bakery since 1995 — rustic breads, pastry case, and the sandwich counter that has fed the neighborhood for three decades. The SD artisan bakery reference." },
  { name: "Brick & Bell Cafe", cuisine: "Bakery / Cafe / Breakfast", neighborhood: "La Jolla",
    address: "928 Silverado St, La Jolla, CA 92037",
    lookup: "928 Silverado St, La Jolla, CA 92037",
    score: 83, price: 1, tags: ["Bakery","Cafe","Breakfast","Brunch","Casual","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@brickandbellcafe", website: "https://brickandbellcafe.com",
    dishes: ["Scones","Quiche","Sandwiches","Cafe Patio"],
    desc: "La Jolla Village's from-scratch bakery-café — scones, quiche, sandwich board, and a side-street patio that the Village treats as a second living room. A La Jolla morning anchor." },
  { name: "Bird Rock Coffee Roasters", cuisine: "Coffee / Cafe", neighborhood: "Bird Rock / La Jolla",
    address: "5627 La Jolla Blvd, San Diego, CA 92037",
    lookup: "5627 La Jolla Blvd, San Diego, CA 92037",
    score: 87, price: 1, tags: ["Coffee","Cafe","Casual","Critics Pick","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Bird Rock Coffee",
    instagram: "@birdrockcoffee", website: "https://birdrockcoffee.com",
    dishes: ["Single-Origin Pour Over","Direct-Trade Espresso","Nitro Cold Brew","Roast-Dated Beans"],
    desc: "SD's serious single-origin coffee anchor — direct-trade sourcing, roast-dated beans, and a Bird Rock flagship café that coffee people across the country cite as the SD reference. Multiple locations; La Jolla Blvd is the original." }
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

// Sanity-clamp: every SD coord must be within 32.45-33.30 lat, -117.35 to -116.80 lng
// (covers Chula Vista/Coronado to Oceanside and Del Mar to Mountain Empire)
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

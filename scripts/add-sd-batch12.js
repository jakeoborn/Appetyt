#!/usr/bin/env node
// San Diego batch 12 — Gaslamp institutions + East Village breweries + North Park bars + Bay Park + more Coronado (18)
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
  { name: "Don Chido", cuisine: "Mexican", neighborhood: "Gaslamp",
    address: "527 Fifth Ave, San Diego, CA 92101",
    lookup: "527 5th Ave, San Diego, CA 92101",
    score: 84, price: 3, tags: ["Mexican","Date Night","Patio","Margaritas","Cocktails","Trending"],
    reservation: "OpenTable",
    instagram: "@donchidosd", website: "https://donchido.com",
    dishes: ["Tableside Guacamole","Street Corn","Mezcal Flights","Open-Air Patio"],
    desc: "Gaslamp's contemporary Mexican on 5th Ave — tableside guacamole service, a deep tequila and mezcal bar, and an indoor-outdoor format that reads as Gaslamp's modern Mexican move. A reliable main-strip dinner call." },
  { name: "Cafe Sevilla", cuisine: "Spanish / Tapas", neighborhood: "Gaslamp",
    address: "353 Fifth Ave, San Diego, CA 92101",
    lookup: "353 5th Ave, San Diego, CA 92101",
    score: 84, price: 3, tags: ["Spanish","Tapas","Date Night","Live Music","Iconic","Cocktails"],
    reservation: "OpenTable",
    group: "Cafe Sevilla",
    instagram: "@cafesevilla", website: "https://cafesevilla.com",
    dishes: ["Paella Valenciana","Tapas Program","Flamenco Dinner Show","Sangria"],
    desc: "Gaslamp's Spanish institution since 1987 — paella Valenciana, a live flamenco dinner show in the downstairs dining room, and a tapas bar that has anchored SD's Spanish scene for almost four decades." },
  { name: "Trattoria La Strada", cuisine: "Italian", neighborhood: "Gaslamp",
    address: "702 Fifth Ave, San Diego, CA 92101",
    lookup: "702 5th Ave, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Italian","Date Night","Patio","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@trattorialastradasd", website: "https://trattorialastrada.com",
    dishes: ["Osso Buco","House-Made Pasta","Gaslamp Patio Corner","Tuscan Program"],
    desc: "Gaslamp's Tuscan-style trattoria since 1993 — a 5th Ave corner patio, osso buco, and a Gaslamp regular's dinner default when the 5th Ave crowd gets too loud. The Gaslamp Italian old-guard." },
  { name: "Osetra Seafood & Steakhouse", cuisine: "Seafood / Steakhouse", neighborhood: "Gaslamp",
    address: "904 Fifth Ave, San Diego, CA 92101",
    lookup: "904 5th Ave, San Diego, CA 92101",
    score: 84, price: 4, tags: ["Fine Dining","Seafood","Steakhouse","Date Night","Celebrations","Cocktails","Iconic"],
    reservation: "OpenTable",
    instagram: "@osetrarestaurant", website: "https://osetrasd.com",
    dishes: ["Whole Fish Program","Prime Steaks","15,000-Bottle Wine Tower","3-Story Format"],
    desc: "Gaslamp's three-story seafood-and-steak room — a 15,000-bottle climate-controlled wine tower as the dining-room centerpiece, prime steaks and whole-fish program, and the kind of special-occasion Gaslamp real estate that still fills on a Saturday." },
  { name: "Coin-Op Game Room — North Park", cuisine: "American / Bar", neighborhood: "North Park",
    address: "3926 30th St, San Diego, CA 92104",
    lookup: "3926 30th St, San Diego, CA 92104",
    score: 82, price: 2, tags: ["American","Bar","Casual","Late Night","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@coinopnorthpark", website: "https://coinopsd.com",
    dishes: ["50+ Arcade Games","Craft Cocktails","Bar Menu","Late-Night Program"],
    desc: "North Park's arcade bar on 30th Street — 50+ cabinet games from the '80s and '90s, a craft-cocktail program that takes itself seriously, and a late-night crowd that made Coin-Op a defining North Park after-dinner move." },
  { name: "Basic Bar + Pizza", cuisine: "Italian / Pizza", neighborhood: "East Village",
    address: "410 10th Ave, San Diego, CA 92101",
    lookup: "410 10th Ave, San Diego, CA 92101",
    score: 85, price: 2, tags: ["Italian","Pizza","Casual","Late Night","Cocktails","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@basicpizzasd", website: "https://barbasic.com",
    dishes: ["White Pizza","Mashed Potato Pizza","Late-Night Slices","Industrial Warehouse Room"],
    desc: "CH Projects' East Village industrial pizzeria — thin-crust Trenton-style pies, the white-sauce mashed-potato pizza that became the order-this signature, and a warehouse-scale dining room that reads as CH Projects' format-defining moment." },
  { name: "Monkey Paw Brewing Co.", cuisine: "American / Brewery", neighborhood: "East Village",
    address: "805 16th St, San Diego, CA 92101",
    lookup: "805 16th St, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Late Night","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@monkeypawbeer", website: "https://monkeypawbrewing.com",
    dishes: ["House Brews","Pub Menu","Craft-Beer-First Program","East Village Taproom"],
    desc: "East Village's craft-first neighborhood brewery — house brews in a no-frills taproom, a dive-bar-adjacent format, and the kind of beer-first room that served as a template for a generation of SD indie brewers." },
  { name: "Half Door Brewing Co.", cuisine: "American / Brewery", neighborhood: "East Village",
    address: "903 Island Ave, San Diego, CA 92101",
    lookup: "903 Island Ave, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Brewery","Patio","Casual","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Half Door Brewing",
    instagram: "@halfdoorbrewing", website: "https://halfdoorbrewing.com",
    dishes: ["House Brews","Irish Pub Menu","Island Ave Patio","Craft Beer Program"],
    desc: "East Village's Irish-framed brewpub — a two-story brick building, house-brewed craft beer with a proper Irish-pub kitchen, and the kind of patio that the Padres game crowd uses as the post-game room." },
  { name: "Kindred", cuisine: "Vegan / Cocktail Bar", neighborhood: "South Park",
    address: "1503 30th St, San Diego, CA 92102",
    lookup: "1503 30th St, San Diego, CA 92102",
    score: 88, price: 3, tags: ["Vegan","Cocktail Bar","Date Night","Critics Pick","Trending","Iconic"],
    reservation: "walk-in",
    instagram: "@kindredbar", website: "https://kindredbar.com",
    dishes: ["Vegan Small Plates","Black Metal Dining Room","Craft Cocktails","Goth-Design Program"],
    desc: "South Park's black-metal-themed vegan cocktail bar — gothic Art Nouveau interior, an all-vegan chef-driven menu that surprises meat eaters, and a cocktail program that puts Kindred in SD's national cocktail-critic conversation. One of the most-specific rooms in the city." },
  { name: "Crazee Burger", cuisine: "American / Burgers", neighborhood: "Normal Heights",
    address: "3201 Adams Ave, San Diego, CA 92116",
    lookup: "3201 Adams Ave, San Diego, CA 92116",
    score: 83, price: 2, tags: ["American","Burgers","Casual","Local Favorites","Iconic","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@crazeeburgersd", website: "https://crazeeburger.com",
    dishes: ["Wild-Game Burgers","Buffalo Burger","Elk","Kangaroo"],
    desc: "Normal Heights' wild-game burger counter — buffalo, elk, ostrich, kangaroo, and a chef-scale-grind program that gave an Adams Ave neighborhood shop a national burger-nerd reputation. A defining SD quirky-specialist room." },
  { name: "3rd Corner Wine Shop & Bistro", cuisine: "American / Wine Bar", neighborhood: "Ocean Beach",
    address: "2265 Bacon St, San Diego, CA 92107",
    lookup: "2265 Bacon St, San Diego, CA 92107",
    score: 84, price: 3, tags: ["American","Wine Bar","Date Night","Critics Pick","Local Favorites","Cocktails"],
    reservation: "walk-in",
    group: "3rd Corner",
    instagram: "@3rdcornersd", website: "https://3rdcorner.com",
    dishes: ["700+ Wine Retail","Chef-Driven Bistro Menu","Wine Dinner Program","Retail-Plus-Restaurant Format"],
    desc: "Ocean Beach's retail-wine-plus-bistro — 700+ bottles on the shelves available as retail or in-room markup, a chef-driven bistro kitchen, and one of the few SD formats that works both ways. A defining OB date-night room." },
  { name: "Bang Bang", cuisine: "Japanese / Asian Fusion", neighborhood: "Gaslamp",
    address: "526 Market St, San Diego, CA 92101",
    lookup: "526 Market St, San Diego, CA 92101",
    score: 86, price: 3, tags: ["Japanese","Asian Fusion","Date Night","Cocktails","Trending","Critics Pick","Late Night"],
    reservation: "Resy",
    group: "Consortium Holdings / CH Projects",
    instagram: "@bangbangsd", website: "https://bangbangsd.com",
    dishes: ["Sushi Rolls","Dim Sum","Hello Kitty Cocktails","DJ Late-Night Program"],
    desc: "CH Projects' Gaslamp pan-Asian dinner-to-dance room — sushi and dim sum, a Hello Kitty-themed cocktail program, and a DJ program that turns Bang Bang into the downtown after-hours call. A Gaslamp landmark format." },
  { name: "The Mission — North Park", cuisine: "American / Breakfast / Brunch", neighborhood: "North Park",
    address: "2801 University Ave, San Diego, CA 92104",
    lookup: "2801 University Ave, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Breakfast","Brunch","Casual","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "The Mission",
    instagram: "@themissionsd", website: "https://themission3.com",
    dishes: ["Chilaquiles","Papas Locas","Rosemary Bread French Toast","All-Day Breakfast"],
    desc: "The Mission's North Park location — the multi-location SD brunch brand's 30th-and-University anchor. The same chilaquiles and papas locas as the Mission Beach original, in the heart of North Park's morning rhythm." },
  { name: "Bottlecraft Beer Shop", cuisine: "American / Bottle Shop / Bar", neighborhood: "Little Italy",
    address: "2161 India St, San Diego, CA 92101",
    lookup: "2161 India St, San Diego, CA 92101",
    score: 85, price: 2, tags: ["American","Bottle Shop","Casual","Craft Beer","Critics Pick","Local Favorites","Patio"],
    reservation: "walk-in",
    group: "Bottlecraft",
    instagram: "@bottlecraftbeer", website: "https://bottlecraftbeer.com",
    dishes: ["700+ Bottles","16+ Rotating Taps","Retail + Taproom","Indoor-Outdoor"],
    desc: "Little Italy's retail-bottle-shop-plus-taproom — 700+ packaged craft beers on the shelves, rotating rare-SD-brewery taps, and a format that made Bottlecraft an SD craft-beer landmark. Pour on-site or buy to take home." },
  { name: "Bay Park Fish Co.", cuisine: "Seafood / Casual", neighborhood: "Bay Park",
    address: "4121 Morena Blvd, San Diego, CA 92117",
    lookup: "4121 Morena Blvd, San Diego, CA 92117",
    score: 85, price: 2, tags: ["Seafood","Casual","Family Friendly","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@bayparkfishco", website: "https://bayparkfishco.com",
    dishes: ["Mesquite-Grilled Fish","Fish Tacos","Fresh Fish Case","Bay Park Neighborhood Room"],
    desc: "Bay Park's order-counter seafood room off Morena Blvd — mesquite-grilled whole fish, a fresh case, and a neighborhood-kitchen reputation so consistent that chefs around SD quietly send friends here. A defining Bay Park local." },
  { name: "Breakfast Republic — North Park", cuisine: "American / Breakfast / Brunch", neighborhood: "North Park",
    address: "2730 University Ave, San Diego, CA 92104",
    lookup: "2730 University Ave, San Diego, CA 92104",
    score: 83, price: 2, tags: ["American","Breakfast","Brunch","Casual","Family Friendly","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Breakfast Republic",
    instagram: "@breakfastrepublic", website: "https://breakfastrepublic.com",
    dishes: ["Pancake Flight","Bennie Variations","Avocado Bacon Toast","Rooster-Theme Interior"],
    desc: "Breakfast Republic's North Park flagship — a rooster-themed brunch brand that grew out of North Park into a multi-location SD staple. The North Park room is the original and the one locals keep even after the brand expanded." },
  { name: "Prepkitchen — Little Italy", cuisine: "Californian / Farm-to-Table", neighborhood: "Little Italy",
    address: "1660 India St, San Diego, CA 92101",
    lookup: "1660 India St, San Diego, CA 92101",
    score: 84, price: 3, tags: ["Californian","Farm-to-Table","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    group: "Whisknladle Hospitality",
    instagram: "@prepkitchensd", website: "https://prepkitchen.com",
    dishes: ["Seasonal Menu","House-Made Pasta","Craft Cocktails","India Street Patio"],
    desc: "Whisknladle Hospitality's Little Italy sibling — the same farm-to-table discipline the La Jolla flagship built, reformatted into a smaller Little Italy corner with an India St patio. A defining Little Italy neighborhood-kitchen move." },
  { name: "Cafe 1134", cuisine: "American / Cafe / Breakfast", neighborhood: "Coronado",
    address: "1134 Orange Ave, Coronado, CA 92118",
    lookup: "1134 Orange Ave, Coronado, CA 92118",
    score: 82, price: 2, tags: ["American","Cafe","Breakfast","Brunch","Casual","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@cafe1134coronado", website: "",
    dishes: ["Quiche","Espresso","Sandwiches","Sidewalk Patio"],
    desc: "Coronado's Orange Ave café — quiche, sandwich board, a serious espresso counter, and a sidewalk patio that's been the Coronado morning meeting room for locals and Hotel Del guests alike. An island everyday anchor." }
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

// Reject Escondido-north false positives by clamping lat max to 33.30 for Gaslamp/downtown addresses
function inSDBox(c, name) {
  // Special tight-clamp for known Gaslamp/Downtown/East Village/Little Italy hits that Nominatim regularly misroutes
  const gaslampTight = /Gaslamp|East Village|Downtown|Little Italy/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
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

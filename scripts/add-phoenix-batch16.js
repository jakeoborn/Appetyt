#!/usr/bin/env node
// Phoenix batch 16 — Historic Phoenix + Scottsdale craft + Tempe Indian (7 high-confidence picks)
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
  { name: "Honey Bear's BBQ", cuisine: "BBQ / Southern", neighborhood: "Central Phoenix",
    address: "2824 N Central Ave, Phoenix, AZ 85004",
    lookup: "2824 N Central Ave, Phoenix, AZ 85004",
    score: 86, price: 2, tags: ["BBQ","Southern","American","Casual","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@honeybearsbbq", website: "https://honeybearsbbq.com",
    dishes: ["Pulled Pork Sandwich","Ribs","Brisket","Sweet Potato Pie"],
    desc: "Operating since 1986 — a Central Ave BBQ and soul-food institution that predates Phoenix's current Q renaissance by two decades. Pulled pork with the right shred, ribs with the bark, and sweet-potato pie that anchors the soul-food-for-dessert argument. A community anchor, not a trend." },
  { name: "Restaurant Progress", cuisine: "Contemporary / Fine Dining", neighborhood: "Grand Avenue",
    address: "702 W Grand Ave, Phoenix, AZ 85007",
    lookup: "702 W Grand Ave, Phoenix, AZ 85007",
    score: 88, price: 4, tags: ["Fine Dining","Contemporary","American","Date Night","Patio","Critics Pick","Trending"],
    reservation: "Resy",
    group: "Eric Flatt",
    instagram: "@restaurantprogress", website: "https://restaurantprogress.com",
    dishes: ["Seasonal Tasting","Hand-Cut Pasta","Wood-Fired Entrée","Wine Pairing"],
    desc: "Chef Eric Flatt's Grand Ave dining room — a chef-driven, seasonal-menu restaurant that turned a Grand Avenue arts-corridor space into a legitimate fine-dining destination. Monthly-rotating menu, natural wine list, and a dining room quiet enough for the kitchen to do the talking." },
  { name: "Goldwater Brewing Co", cuisine: "Brewery / Pub", neighborhood: "Old Town Scottsdale",
    address: "3608 N Goldwater Blvd, Scottsdale, AZ 85251",
    lookup: "3608 N Goldwater Blvd, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Brewery","Pub","American","Casual","Patio","Local Favorites"],
    reservation: "walk-in",
    group: "Goldwater Brewing",
    instagram: "@goldwaterbrewing", website: "https://goldwaterbrewing.com",
    dishes: ["House IPA","Mesquite-Smoked Lager","Pub Burger","Brewery Plates"],
    desc: "Old Town Scottsdale brewery inside a historic 1930s building — AZ-ingredient-leaning beer program, mesquite-smoked lagers, and a taproom patio that catches the Old Town bar-crawl foot traffic without being part of it. The more adult Scottsdale brewery option." },
  { name: "The Pemberton", cuisine: "Bar / Event Venue", neighborhood: "Downtown Phoenix",
    address: "1121 N Central Ave, Phoenix, AZ 85004",
    lookup: "1121 N Central Ave, Phoenix, AZ 85004",
    score: 84, price: 3, tags: ["Bar","Cocktails","Patio","Late Night","Trending","Historic","Iconic","Event Venue"],
    reservation: "walk-in",
    instagram: "@thepembertonphx", website: "https://thepembertonphx.com",
    dishes: ["Craft Cocktails","Food Truck Rotation","Live Music","Patio Service"],
    desc: "A 1920s Central Ave historic home turned into a community bar-and-event space — rotating food trucks in the courtyard, live music nights, cocktail program that leans classic. Downtown Phoenix's most specific hang for people who want a bar and don't want a club." },
  { name: "Taco Guild", cuisine: "Mexican / Modern", neighborhood: "Central Phoenix",
    address: "546 E Osborn Rd, Phoenix, AZ 85012",
    lookup: "546 E Osborn Rd, Phoenix, AZ 85012",
    score: 87, price: 3, tags: ["Mexican","Modern","Date Night","Patio","Historic","Iconic","Cocktails"],
    reservation: "OpenTable",
    instagram: "@tacoguild", website: "https://tacoguild.com",
    dishes: ["Short Rib Taco","Duck Confit Taco","Tableside Guacamole","Mezcal Cocktail"],
    desc: "Inside a converted 1893 Methodist church — stained-glass windows, soaring ceilings, and a modern-Mexican menu that takes the taco template seriously. Short rib taco is the signature; duck confit taco is the sleeper. One of Phoenix's most architecturally specific dining rooms." },
  { name: "Chico Malo", cuisine: "Modern Mexican / Sinaloan", neighborhood: "Downtown Phoenix",
    address: "50 W Jefferson St, Phoenix, AZ 85003",
    lookup: "50 W Jefferson St, Phoenix, AZ 85003",
    score: 85, price: 3, tags: ["Mexican","Modern","Date Night","Cocktails","Patio","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@chicomalo_phx", website: "https://chicomaloaz.com",
    dishes: ["Aguachile","Al Pastor","Short Rib Tacos","Tequila & Mezcal Flight"],
    desc: "A Sinaloan-inspired modern Mexican room on Jefferson across from Chase Field — aguachile done with the right citric acid, Al Pastor off a real trompo, and a tequila program that takes its agave seriously. Pre-game Diamondbacks anchor without phoning it in." },
  { name: "Second Story Liquor Bar", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "Old Town Scottsdale",
    address: "4228 N Goldwater Blvd, Scottsdale, AZ 85251",
    lookup: "4228 N Goldwater Blvd, Scottsdale, AZ 85251",
    score: 87, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Hidden Gem","Critics Pick"],
    reservation: "walk-in",
    instagram: "@secondstoryliquorbar", website: "",
    dishes: ["Classic Cocktails","Whiskey Program","Small Plates","Late-Night Menu"],
    desc: "A second-floor Old Town Scottsdale speakeasy-style cocktail bar — dim, wood-and-velvet interior, a whiskey collection that runs deep, and classic-cocktail execution that rivals anything in Downtown Phoenix. The adult alternative to Saddlebag Trail's volume." }
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

(async () => {
  const s = getArrSlice("PHX_DATA");
  const arr = parseArr(s.slice);
  let nextId = maxId(arr) + 1;
  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    const c = await nominatim(e.lookup);
    if (!c) { console.log(`  ❌ SKIP`); continue; }
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

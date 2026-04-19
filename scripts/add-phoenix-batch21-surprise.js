#!/usr/bin/env node
// Phoenix batch 21 — SURPRISE AZ section (11 verified via Firecrawl, sourced from City of Surprise tourism + each restaurant's own website/Yelp)
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
  { name: "Babbo Italian Eatery", cuisine: "Italian", neighborhood: "Surprise",
    address: "16433 W Bell Rd, Surprise, AZ 85374",
    lookup: "16433 W Bell Rd, Surprise, AZ 85374",
    score: 84, price: 2, tags: ["Italian","Casual","Family Friendly","Local Favorites","Patio"],
    reservation: "OpenTable",
    group: "Babbo Italian Eatery",
    instagram: "@babboitalianeatery", website: "https://www.babboitalian.com",
    dishes: ["Lasagna","Chicken Parmigiana","Meatballs","Fettuccine Alfredo"],
    desc: "A longtime Arizona Italian chain with a flagship-feel location on Bell Road at 165th — Babbo's been the West Valley Italian-family-dinner default for over a decade. Fresh pastas, stone-oven pizzas, and the kind of generous portions that made Italian-American a category. Multiple AZ locations; Surprise is the NW Valley anchor." },
  { name: "Barrio Queen — Surprise", cuisine: "Modern Mexican", neighborhood: "Surprise",
    address: "13434 N Prasada Pkwy, Surprise, AZ 85388",
    lookup: "13434 N Prasada Pkwy, Surprise, AZ 85388",
    score: 86, price: 3, tags: ["Mexican","Modern","Casual","Date Night","Patio","Local Favorites","Cocktails"],
    reservation: "OpenTable",
    group: "Barrio Queen",
    instagram: "@barrioqueen", website: "https://www.barrioqueen.com",
    dishes: ["Tableside Guacamole","Birria Tacos","Mole Poblano","Tequila & Mezcal Flight"],
    desc: "The Valley's upscale Mexican chain dropped a location into Surprise's Prasada development — vibrant interior, proper tableside guac, and a tequila program that's rare in the NW Valley. The Mexican dinner Surprise had been waiting for." },
  { name: "Angry Crab Shack — Surprise", cuisine: "Seafood / Cajun", neighborhood: "Surprise",
    address: "11340 W Bell Rd, Surprise, AZ 85378",
    lookup: "11340 W Bell Rd, Surprise, AZ 85378",
    score: 83, price: 2, tags: ["Seafood","Cajun","Casual","Family Friendly","Local Favorites","Late Night"],
    reservation: "walk-in",
    group: "Angry Crab Shack",
    instagram: "@angrycrabshack", website: "https://www.angrycrabshack.com",
    dishes: ["Cajun Seafood Boil","Shrimp Garlic Butter","Snow Crab","Corn & Potato Combo"],
    desc: "Cajun-inspired seafood boil in a bag — put on a bib, pour it out, eat with your hands. An Arizona-grown casual-seafood chain at Bellmar Plaza on Bell Rd. The Surprise location anchors the NW Valley branch of this Phoenix-born format." },
  { name: "The Toast Craft Kitchen & Cocktails", cuisine: "American / Brunch", neighborhood: "Surprise",
    address: "17058 W Bell Rd Ste 104, Surprise, AZ 85374",
    lookup: "17058 W Bell Rd, Surprise, AZ 85374",
    score: 86, price: 3, tags: ["American","Brunch","Date Night","Patio","Cocktails","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@thetoastcraftkitchen", website: "https://thetoastaz.com",
    dishes: ["Avocado Toast","Signature Benedict","Craft Cocktail Brunch","Seasonal Entrée"],
    desc: "A creatively delicious husband-and-wife-owned neighborhood spot for breakfast, brunch, lunch, and dinner — Surprise's most-considered day-into-night restaurant, with a cocktail program that punches above the NW Valley average." },
  { name: "Oregano's Pizza Bistro — Surprise", cuisine: "Italian / Pizza", neighborhood: "Surprise",
    address: "16555 W Greenway Rd Ste 326, Surprise, AZ 85388",
    lookup: "16555 W Greenway Rd, Surprise, AZ 85388",
    score: 84, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Oregano's Pizza Bistro",
    instagram: "@oreganos", website: "https://oreganos.com",
    dishes: ["Deep-Dish Pizza","Pizza Cookie","Stuffed Pizza Sandwich","Italian Salad"],
    desc: "The Arizona-born Italian family chain that treats every dinner like a Chicago-family-reunion — deep-dish pizza, famous pizza-cookie dessert, red-checkered-tablecloth interior. Multiple AZ locations; Surprise is the West Valley anchor at Greenway." },
  { name: "Rio Mirage Cafe — Surprise", cuisine: "Mexican / Sonoran", neighborhood: "Surprise",
    address: "13863 W Bell Rd, Surprise, AZ 85379",
    lookup: "13863 W Bell Rd, Surprise, AZ 85379",
    score: 84, price: 2, tags: ["Mexican","Sonoran","Casual","Family Friendly","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@riomiragecafe", website: "https://riomiragecafe.com",
    dishes: ["Green Corn Tamales","Cheese Crisp","Chimichanga","Carne Asada"],
    desc: "Authentic Mexican cuisine featuring Sonoran-style recipes handed down for generations — the kind of family-run Mexican that the West Valley does better than the trendy spots in Scottsdale. Green corn tamales and cheese crisps are the Arizona-specific orders." },
  { name: "Irish Wolfhound Pub", cuisine: "Irish Pub", neighborhood: "Surprise",
    address: "16811 N Litchfield Rd Ste 102, Surprise, AZ 85374",
    lookup: "16811 N Litchfield Rd, Surprise, AZ 85374",
    score: 84, price: 2, tags: ["Irish Pub","European","Bar","Casual","Local Favorites","Late Night","Live Music","Patio"],
    reservation: "walk-in",
    instagram: "@irishwolfhoundpub", website: "https://irishwolfhoundpub.com",
    dishes: ["Irish Stew","Fish & Chips","Shepherd's Pie","Guinness Pour"],
    desc: "Traditional Irish menu and favorite Irish beers on Litchfield Road — the NW Valley's Irish pub anchor. Shepherd's pie, fish-and-chips, proper Guinness pour, and the kind of dark-wood interior that feels right on a rainy AZ night (all five of them a year)." },
  { name: "Bonfire Craft Kitchen & Tap House", cuisine: "American / Gastropub", neighborhood: "Surprise",
    address: "15332 W Bell Rd, Surprise, AZ 85374",
    lookup: "15332 W Bell Rd, Surprise, AZ 85374",
    score: 84, price: 2, tags: ["American","Gastropub","Sports Bar","Casual","Family Friendly","Patio","Local Favorites","Beer"],
    reservation: "OpenTable",
    instagram: "@bonfirecraftkitchen", website: "",
    dishes: ["Wood-Fired Pizza","Smash Burger","BBQ Plate","Craft Beer Tap"],
    desc: "A locally owned and operated Surprise restaurant and sports bar serving up wood-fired pizza, burgers, BBQ, and craft taps. Patio, big-screen game-day energy, and a menu that reads broader than it needs to — reliable NW Valley dinner out." },
  { name: "Spencer's Place", cuisine: "Coffee / Cafe", neighborhood: "Surprise",
    address: "15341 W Waddell Rd Ste B101, Surprise, AZ 85379",
    lookup: "15341 W Waddell Rd, Surprise, AZ 85379",
    score: 87, price: 2, tags: ["Coffee Shop","Cafe","Casual","Family Friendly","Local Favorites","Brunch","Community"],
    reservation: "walk-in",
    instagram: "@spencersplaceaz", website: "https://spencersplaceaz.com",
    dishes: ["Signature Lattes","Breakfast Sandwich","Pastry Case","Espresso Drinks"],
    desc: "A coffee bistro that offers amazing treats while providing work opportunities for adults with intellectual and developmental disabilities. A Surprise community anchor — the kind of neighborhood café that earns its regulars for both the coffee and the mission. Waddell Rd flagship." },
  { name: "Hurricane Grill & Wings", cuisine: "American / Wings", neighborhood: "Surprise",
    address: "11340 W Bell Rd Ste 104, Surprise, AZ 85378",
    lookup: "11340 W Bell Rd, Surprise, AZ 85378",
    score: 82, price: 2, tags: ["American","Wings","Sports Bar","Casual","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Hurricane Grill & Wings",
    instagram: "@hurricanegrill", website: "https://hurricanewings.com",
    dishes: ["Jumbo Wings (35+ Sauces)","Wraps","Burgers","Beach-Grill Menu"],
    desc: "Beach-grill fare and award-winning jumbo wings with more than 35 different sauces and rubs — a Florida-born chain that built a Surprise location at Bellmar Plaza. Sports-bar atmosphere, wing-sauce menu that reads like a spirits list." },
  { name: "O.H.S.O. Brewery — Surprise", cuisine: "Brewery / American", neighborhood: "Surprise",
    address: "13434 N Prasada Pkwy, Surprise, AZ 85388",
    lookup: "13434 N Prasada Pkwy, Surprise, AZ 85388",
    score: 84, price: 2, tags: ["Brewery","American","Casual","Patio","Family Friendly","Dog-Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "O.H.S.O.",
    instagram: "@ohsobrewery", website: "https://ohsobrewery.com",
    dishes: ["House IPA","Smash Burger","Loaded Nachos","Brunch Bloody Mary"],
    desc: "The O.H.S.O. Brewery Surprise location at the Prasada development — same dog-friendly patio formula as the Arcadia and Gilbert originals, brewpub kitchen, and a beer program that anchors the chain. The NW Valley's most-loved craft-beer spot." }
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
      suburb: true, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

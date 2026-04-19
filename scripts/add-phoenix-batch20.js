#!/usr/bin/env node
// Phoenix batch 20 — Apify-verified Old Town Scottsdale dives + wine bars + hotel lounges
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
  { name: "Coach House", cuisine: "Dive Bar", neighborhood: "Old Town Scottsdale",
    address: "7011 E Indian School Rd, Scottsdale, AZ 85251",
    lookup: "7011 E Indian School Rd, Scottsdale, AZ 85251",
    score: 86, price: 1, tags: ["Dive Bar","Bar","Historic","Iconic","Late Night","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@coachhousescottsdale", website: "",
    dishes: ["Cheap Beer","Whiskey Shots","Year-Round Christmas Lights","Jukebox"],
    desc: "Scottsdale's oldest dive bar — operating since 1959 on Indian School Road. Open-air patio covered in Christmas lights year-round, wood-paneled walls, and a crowd that mixes Old Town locals with whoever happens to wander in at 2 a.m. A genuine Phoenix dive bar." },
  { name: "Patty's First Avenue Lounge", cuisine: "Dive Bar", neighborhood: "Old Town Scottsdale",
    address: "7220 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "7220 E 1st Ave, Scottsdale, AZ 85251",
    score: 84, price: 1, tags: ["Dive Bar","Bar","Historic","Iconic","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@pattysfirstavenue", website: "",
    dishes: ["Cheap Drinks","Signed Dollar Bills on Walls","Early-Open Bar","Jukebox"],
    desc: "A casual Old Town dive bar famous for the dollar-bill-lined walls — decades of signed bills from Scottsdale regulars, tourists, and bachelor parties. Open early morning through 2 a.m. daily. Formality zero, authenticity 10." },
  { name: "The Hot Chick", cuisine: "Bar / Arcade / American", neighborhood: "Old Town Scottsdale",
    address: "4363 N 75th St, Scottsdale, AZ 85251",
    lookup: "4363 N 75th St, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Bar","American","Casual","Late Night","Trending","Live Music"],
    reservation: "walk-in",
    instagram: "@thehotchickaz", website: "",
    dishes: ["Fried Chicken Plates","Classic Arcade Games","70s Throwback Cocktails","Comfort Bar Food"],
    desc: "Retro-groovy '70s arcade bar in the Entertainment District — throwback tunes, classic arcade games, and comfort-food chicken plates. Format that turns a bar visit into a party-game ritual; the kind of room where the crowd fluctuates between arcade and dance floor." },
  { name: "CAKE Nightclub", cuisine: "Nightclub", neighborhood: "Old Town Scottsdale",
    address: "4405 N Saddlebag Trl, Scottsdale, AZ 85251",
    lookup: "4405 N Saddlebag Trl, Scottsdale, AZ 85251",
    score: 83, price: 4, tags: ["Nightclub","Dance","Late Night","Scene","Cocktails","Trending"],
    reservation: "walk-in",
    instagram: "@cakenightclubscottsdale", website: "",
    dishes: ["Bottle Service","VIP Tables","Cake Doll Performers","DJ Sets"],
    desc: "A posh chandelier-filled nightclub on Saddlebag Trl — bottle service, 'Cake Doll' performers, and DJ nights that run the Old Town Scottsdale weekend format. All-in on the theatrics; reserve a table if you want to sit." },
  { name: "Jamie's Bottle Shop", cuisine: "Wine Bar / Shop", neighborhood: "Old Town Scottsdale",
    address: "7013 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "7013 E 1st Ave, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["Wine Bar","Casual","Date Night","Trending","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "@jamiesbottleshop", website: "",
    dishes: ["Natural Wine by the Glass","Retail Bottle Selection","Cheese Board","Small Plates"],
    desc: "Welcoming wine shop and tasting space in Old Town Scottsdale — a thoughtful selection of bottles for sipping onsite or taking home. Small cheese-and-charcuterie menu, natural-wine-leaning list, and a format that splits the difference between shop and bar. An Old Town addition that has quickly earned its regulars." },
  { name: "The Mix Up Bar at Royal Palms Resort", cuisine: "Cocktail Lounge", neighborhood: "Arcadia",
    address: "5200 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "5200 E Camelback Rd, Phoenix, AZ 85018",
    score: 86, price: 3, tags: ["Cocktails","Lounge","Date Night","Romantic","Patio","Historic","Scenic Views"],
    reservation: "OpenTable",
    group: "Royal Palms Resort",
    instagram: "@royalpalmsresort", website: "https://royalpalmshotel.com",
    dishes: ["Expertly-Crafted Cocktails","Small Plates","Sunset Service","Romantic Garden Setting"],
    desc: "Elevated cocktail lounge at Royal Palms Resort — expertly crafted drinks in a lush, romantic resort setting next to T. Cook's. The kind of Arcadia hotel bar where an evening cocktail becomes a proper occasion without the Saddlebag Trail volume." },
  { name: "The Grapevine Restaurant & Karaoke Bar", cuisine: "Karaoke Bar / Mediterranean", neighborhood: "Old Town Scottsdale",
    address: "4013 N Brown Ave, Scottsdale, AZ 85251",
    lookup: "4013 N Brown Ave, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Bar","Karaoke","Live Music","Mediterranean","Late Night","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@thegrapevineaz", website: "",
    dishes: ["Karaoke Schedule","Mediterranean Bites","Craft Cocktail","Rooftop Patio"],
    desc: "Beloved Old Town rooftop karaoke bar with Mediterranean bites and non-stop singing energy — the Scottsdale-after-dinner sing-through that every local eventually ends up at. Historic Old Town Brown Ave setting; queue early for prime slots." },
  { name: "Living Room Wine Cafe & Lounge", cuisine: "Wine Bar / Cafe", neighborhood: "Chandler",
    address: "2801 N Alma School Rd, Chandler, AZ 85224",
    lookup: "2801 N Alma School Rd, Chandler, AZ 85224",
    score: 84, price: 3, tags: ["Wine Bar","Cafe","Date Night","Brunch","Patio","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@livingroomwinecafeaz", website: "",
    dishes: ["Wine by the Glass","Weekend Brunch","Seasonal Lunch","Cheese Board"],
    desc: "Upscale wine café in Chandler with glass-and-bottle service paired with lunch, dinner, and weekend brunch. The format the East Valley had been missing: a serious wine bar that works for a daytime meal and a Friday-night date. Reliable Chandler date-night." },
  { name: "The Plaza Bar at Fairmont Scottsdale Princess", cuisine: "Hotel Lounge", neighborhood: "North Scottsdale",
    address: "7575 E Princess Dr, Scottsdale, AZ 85255",
    lookup: "7575 E Princess Dr, Scottsdale, AZ 85255",
    score: 85, price: 4, tags: ["Cocktails","Lounge","Date Night","Romantic","Patio","Scenic Views"],
    reservation: "OpenTable",
    group: "Fairmont Hotels",
    instagram: "@fairmontscottsdale", website: "https://fairmont.com",
    dishes: ["Signature Cocktails","Bar Bites","Resort Patio Service","Seasonal Menu"],
    desc: "Stylish indoor-outdoor lounge at the Fairmont Scottsdale Princess — cocktails and bar bites in one of North Scottsdale's best-appointed resorts. A drink-and-watch-the-desert-sunset destination; the patio is the point." },
  { name: "OH Pool Bar + Cabanas at Hotel Valley Ho", cuisine: "Pool Bar / Resort", neighborhood: "Old Town Scottsdale",
    address: "6850 E Main St, Scottsdale, AZ 85251",
    lookup: "6850 E Main St, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["Rooftop","Pool","Bar","Cocktails","Date Night","Historic","Iconic","Scene"],
    reservation: "walk-in",
    group: "Hotel Valley Ho",
    instagram: "@hotelvalleyho", website: "https://hotelvalleyho.com",
    dishes: ["Poolside Cocktails","Cabana Service","Frozen Drinks","Resort Bar Menu"],
    desc: "The Hotel Valley Ho pool deck — the mid-century resort's signature pool bar, still serving the classic poolside cocktail program in the 1956 original building. Cabana reservations available; the scene stays steady from afternoon through evening." },
  { name: "Wine Girl", cuisine: "Wine Bar", neighborhood: "Old Town Scottsdale",
    address: "7135 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "7135 E 1st Ave, Scottsdale, AZ 85251",
    score: 84, price: 3, tags: ["Wine Bar","Bar","Date Night","Trending","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@winegirlscottsdale", website: "",
    dishes: ["Bubbles Program","Cocktails","Weekly Trivia","Small Plates"],
    desc: "Chic, lively Old Town wine bar with bubbles, cocktails, and weekly trivia nights. A 1st Avenue storefront scale and a crowd that turns over through the week — date-night early, trivia regulars later. Old Town's most approachable wine-bar format." },
  { name: "One Handsome Bastard", cuisine: "Cocktail Bar", neighborhood: "Old Town Scottsdale",
    address: "7042 E Indian School Rd, Scottsdale, AZ 85251",
    lookup: "7042 E Indian School Rd, Scottsdale, AZ 85251",
    score: 84, price: 3, tags: ["Cocktails","Bar","Date Night","Trending","Hidden Gem","Patio"],
    reservation: "walk-in",
    instagram: "@onehandsomebastard", website: "",
    dishes: ["Craft Cocktails","Seasonal Menu","Small Plates","Patio Service"],
    desc: "Indian School Road cocktail bar in the Arts District — the name is the attitude, and the drink program holds up its end. Small, loud-enough, and very Old Town — a weekday alternative to the Saddlebag Trail nightclub format." },
  { name: "Rockbar Inc.", cuisine: "Bar / Live Music", neighborhood: "Old Town Scottsdale",
    address: "4245 N Craftsman Ct, Scottsdale, AZ 85251",
    lookup: "4245 N Craftsman Ct, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["Bar","Live Music","Rock","Casual","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@rockbarinc", website: "",
    dishes: ["Live Rock Music","Whiskey Selection","Bar Food","Cheap Beer"],
    desc: "Rock-themed bar with live music in the 5th Ave Shopping District — Craftsman Ct location, real stage, a booking calendar that leans heavier rock than the rest of Old Town. A Scottsdale live-music room that's kept the right crowd." },
  { name: "Shiv Supper Club", cuisine: "Indian / Supper Club", neighborhood: "Old Town Scottsdale",
    address: "7373 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "7373 E Camelback Rd, Scottsdale, AZ 85251",
    score: 86, price: 4, tags: ["Indian","Modern","Date Night","Cocktails","Trending","Patio","Supper Club"],
    reservation: "OpenTable",
    instagram: "@shivsupperclub", website: "",
    dishes: ["Modern Indian Tasting","Tandoor Program","Craft Cocktails","Supper Club Service"],
    desc: "An Indian-inspired supper club and cocktail lounge on Camelback Road in the Entertainment District — modern Indian menu, tandoor-driven cooking, and a cocktail program calibrated to the food. A more-ambitious alternative to Scottsdale's usual Indian-restaurant format." },
  { name: "Yellow Spruce Roasters & Wine Bar", cuisine: "Coffee / Wine Bar", neighborhood: "Old Town Scottsdale",
    address: "3902 N Brown Ave, Scottsdale, AZ 85251",
    lookup: "3902 N Brown Ave, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Coffee Shop","Wine Bar","Cafe","Casual","Date Night","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@yellowsprucecoffee", website: "",
    dishes: ["House-Roasted Coffee","Wine by the Glass","Small Plates","Evening Transition Menu"],
    desc: "Hybrid coffee roastery by day and wine bar by night in Historic Old Town — the kind of multi-purpose room Brown Ave needed. Third-wave coffee program mornings, a tight wine list that appears after 4 p.m. Gets the format right." }
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

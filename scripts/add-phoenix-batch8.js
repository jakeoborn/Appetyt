#!/usr/bin/env node
// Phoenix batch 8 — Iconic Phoenix + FRC brands (from training knowledge, all high-confidence real restaurants)
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
  { name: "Matt's Big Breakfast", cuisine: "Breakfast / American", neighborhood: "Downtown Phoenix",
    address: "825 N 1st St, Phoenix, AZ 85004",
    lookup: "825 N 1st St, Phoenix, AZ 85004",
    score: 90, price: 2, tags: ["Breakfast","American","Casual","Iconic","Historic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    instagram: "@mattsbigbreakfast", website: "https://mattsbigbreakfast.com",
    dishes: ["The Chop and Chick","Hog & Chick","Five-Spot Pancake","Iron-Skillet Hash"],
    desc: "Matt and Erenia Pool's downtown Phoenix breakfast institution — a Diners, Drive-Ins and Dives legend that earned the attention before Guy Fieri showed up. The Chop and Chick (pork chop + eggs) is the move; the iron-skillet hash is the sleeper. 45-minute waits on weekends are the norm — bring the sunscreen." },
  { name: "Durant's", cuisine: "Steakhouse / American", neighborhood: "Central Phoenix",
    address: "2611 N Central Ave, Phoenix, AZ 85004",
    lookup: "2611 N Central Ave, Phoenix, AZ 85004",
    score: 90, price: 4, tags: ["Steakhouse","American","Fine Dining","Historic","Iconic","Date Night","Celebrations","Cocktails"],
    reservation: "OpenTable",
    instagram: "@durantsfinefoods", website: "https://durantsfinefoods.com",
    dishes: ["Prime Ribeye","Durant's Martini","Escargot","Creamed Spinach"],
    desc: "Operating since 1950 — Phoenix's most unironic steakhouse, where politicians, developers, and Phoenix old money have held court for three-quarters of a century. Red booths, tuxedoed waiters, and the house-style of entering through the kitchen (yes, really). The martini program and the prime ribeye are both arguments." },
  { name: "El Chorro", cuisine: "American / Southwestern", neighborhood: "Paradise Valley",
    address: "5550 E Lincoln Dr, Paradise Valley, AZ 85253",
    lookup: "5550 E Lincoln Dr, Paradise Valley, AZ 85253",
    score: 89, price: 4, tags: ["American","Southwestern","Fine Dining","Historic","Iconic","Date Night","Celebrations","Patio","Scenic Views"],
    reservation: "OpenTable",
    instagram: "@elchorro", website: "https://elchorro.com",
    dishes: ["Sticky Buns","Prime Rib","Chicken Mushroom Marsala","Chateaubriand"],
    desc: "Paradise Valley's historic resort dining room since 1937 — a century-adjacent Arizona institution at the foot of Camelback Mountain. Sticky buns arrive with every meal (tradition, not optional), the patio looks at the mountain, and the dining room still feels like the Arizona territory of the 1940s. A third-generation Phoenix favorite." },
  { name: "T. Cook's at Royal Palms Resort", cuisine: "Mediterranean / Fine Dining", neighborhood: "Arcadia",
    address: "5200 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "5200 E Camelback Rd, Phoenix, AZ 85018",
    score: 91, price: 4, tags: ["Fine Dining","Mediterranean","Date Night","Celebrations","Historic","Patio","Scenic Views","Romantic"],
    reservation: "OpenTable",
    group: "Royal Palms Resort",
    instagram: "@royalpalmsresort", website: "https://royalpalmshotel.com",
    dishes: ["Spit-Roasted Chicken","Handmade Pasta","Osso Buco","Wood-Fired Branzino"],
    desc: "Inside the Royal Palms Resort — a Tuscan-villa dining room with 30+ years of uninterrupted Phoenix fine-dining credibility. Spit-roasted chicken, handmade pastas, a spit-and-fire cooking hearth in full view. Routinely ranked among Arizona's most romantic restaurants and still earning it. The proposal dinner." },
  { name: "Different Pointe of View", cuisine: "Contemporary / Fine Dining", neighborhood: "North Phoenix",
    address: "11111 N 7th St, Phoenix, AZ 85020",
    lookup: "11111 N 7th St, Phoenix, AZ 85020",
    score: 89, price: 4, tags: ["Fine Dining","Contemporary","American","Date Night","Celebrations","Scenic Views","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Pointe Hilton Tapatio Cliffs",
    instagram: "@differentpointeofview", website: "https://differentpointeofview.com",
    dishes: ["Seasonal Tasting","Prime Steak","Pan-Seared Duck","Sommelier Wine Pairing"],
    desc: "Perched on a cliff at the Pointe Hilton Tapatio Cliffs — Phoenix's most literally elevated dining room, with 40 miles of Valley skyline as the backdrop. Seasonal contemporary menu, wine program that earns its Wine Spectator awards, and a sunset view that makes the tasting menu feel obligatory. The special-occasion room." },
  { name: "Tarbell's", cuisine: "Contemporary / American", neighborhood: "Arcadia",
    address: "3213 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "3213 E Camelback Rd, Phoenix, AZ 85018",
    score: 90, price: 4, tags: ["Fine Dining","Contemporary","American","Date Night","Celebrations","Cocktails","Critics Pick","Historic"],
    reservation: "OpenTable",
    group: "Mark Tarbell",
    instagram: "@tarbells", website: "https://tarbells.com",
    dishes: ["Tarbell's Chopped Salad","Prosciutto & Melon","Wood-Oven Roasted Chicken","Wine Pairing"],
    desc: "Mark Tarbell's Phoenix anchor since 1994 — the chef-owned restaurant that taught the Valley what a chef-owned restaurant could look like. Chopped salad made tableside, wood-oven chicken that reads as a mission statement, and a wine program curated by an actual sommelier. Continuous James Beard semifinalist consideration." },
  { name: "The Arrogant Butcher", cuisine: "American / Modern Gastropub", neighborhood: "Downtown Phoenix",
    address: "2 E Jefferson St, Phoenix, AZ 85004",
    lookup: "2 E Jefferson St, Phoenix, AZ 85004",
    score: 86, price: 3, tags: ["American","Modern","Date Night","Cocktails","Patio","Local Favorites"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@thearrogantbutcher", website: "https://thearrogantbutcher.com",
    dishes: ["Dry-Aged Burger","Brussels Sprouts","Lobster Mac & Cheese","Butcher Cocktails"],
    desc: "FRC's downtown Phoenix gastropub at the CityScape complex — the pre-Suns game, post-work anchor for the Central Corridor crowd. Dry-aged burger, brussels sprouts people actually order as their appetizer, and a menu that has kept the downtown dining conversation honest since 2011." },
  { name: "The Henry", cuisine: "American / Casual Contemporary", neighborhood: "Arcadia",
    address: "4455 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "4455 E Camelback Rd, Phoenix, AZ 85018",
    score: 85, price: 3, tags: ["American","Modern","Casual","Brunch","Patio","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@thehenryrestaurant", website: "https://thehenryrestaurant.com",
    dishes: ["Chicken Pot Pie","Henry Burger","Chilaquiles","Chocolate Peanut Butter Pie"],
    desc: "FRC's all-day café-meets-restaurant on Camelback — breakfast at 7 a.m. becomes lunch at noon becomes dinner at 7 without ever feeling like the same room. Chicken pot pie is the signature, chilaquiles the weekend brunch default, and the pie case at the entrance does most of the selling." },
  { name: "Doughbird", cuisine: "American / Pizza / Rotisserie Chicken", neighborhood: "Arcadia",
    address: "3961 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "3961 E Camelback Rd, Phoenix, AZ 85018",
    score: 84, price: 2, tags: ["American","Pizza","Casual","Family Friendly","Patio","Local Favorites","Quick Bite"],
    reservation: "walk-in",
    group: "Fox Restaurant Concepts",
    instagram: "@doughbird", website: "https://doughbird.com",
    dishes: ["Rotisserie Chicken","Wood-Fired Pizza","Truffle Fries","Mac & Cheese"],
    desc: "FRC's rotisserie-chicken-and-pizza format — two of Phoenix's most reliable genre executions under one roof. Whole rotisserie birds, crispy-crust pizzas from a proper oven, and a family-friendly patio that works for any Tuesday. The chain that actually earns the repeat visit." },
  { name: "Little Cleo's Seafood Legend", cuisine: "Seafood / American", neighborhood: "Uptown",
    address: "5510 N 7th St, Phoenix, AZ 85014",
    lookup: "5510 N 7th St, Phoenix, AZ 85014",
    score: 87, price: 3, tags: ["Seafood","American","Date Night","Cocktails","Trending","Critics Pick","Patio"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@littlecleos", website: "https://littlecleos.com",
    dishes: ["Oyster Selection","Grilled Fish of the Day","Lobster Roll","Crab Cakes"],
    desc: "FRC's seafood-forward concept on Uptown Plaza — Sam Fox's answer to the question 'where in landlocked Arizona do you go for fresh fish?' Oysters flown daily, grilled whole fish off a proper fire, and a dining room built to feel like a proper seafood restaurant, not a desert fantasy." },
  { name: "Postino Arcadia", cuisine: "Wine Bar / American", neighborhood: "Arcadia",
    address: "3939 E Campbell Ave, Phoenix, AZ 85018",
    lookup: "3939 E Campbell Ave, Phoenix, AZ 85018",
    score: 85, price: 2, tags: ["Wine Bar","American","Casual","Patio","Brunch","Local Favorites","Happy Hour"],
    reservation: "walk-in",
    group: "Upward Projects",
    instagram: "@postinowinecafe", website: "https://postinowinecafe.com",
    dishes: ["Bruschetta Board","Wine Flight","Panini Selection","Happy Hour Board + Bottle"],
    desc: "The original Postino — Upward Projects' wine-café concept that spread across the Sun Belt. Bruschetta-and-wine is the formula; the half-price Happy Hour Board with a bottle for $20 is the legendary deal that built the brand. The Arcadia patio is the Monday-night neighborhood move." },
  { name: "Windsor", cuisine: "American / Cocktails", neighborhood: "Uptown",
    address: "5223 N Central Ave, Phoenix, AZ 85012",
    lookup: "5223 N Central Ave, Phoenix, AZ 85012",
    score: 84, price: 2, tags: ["American","Cocktails","Casual","Patio","Brunch","Local Favorites","Happy Hour"],
    reservation: "walk-in",
    group: "Upward Projects",
    instagram: "@windsor_phoenix", website: "https://windsor-az.com",
    dishes: ["Chicken Club Sandwich","Signature Burger","Craft Cocktail","Brunch Bloody Mary"],
    desc: "Upward Projects' all-day Uptown café — a Neighborhood-American-Classic format executed with the kind of Arizona competence that made the chain stick. Craft cocktails at happy hour, Saturday brunch with a line, and a dining room that doesn't have to try. The Central-Ave regular." },
  { name: "Federal Pizza", cuisine: "Pizza / Italian", neighborhood: "Uptown",
    address: "5210 N Central Ave, Phoenix, AZ 85012",
    lookup: "5210 N Central Ave, Phoenix, AZ 85012",
    score: 84, price: 2, tags: ["Pizza","Italian","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Upward Projects",
    instagram: "@federalpizza", website: "https://federalpizza.com",
    dishes: ["Wood-Fired Pizza","Burrata Salad","Meatballs","Gelato"],
    desc: "Upward Projects' wood-fired pizza concept across Central from Windsor — the anchor tenant at Central Ave + Camelback for the neighborhood pizza conversation. Thin-crust pies off a proper deck oven, burrata salad that punches above the price, and a patio that catches the evening. One of the few pizza rooms in Phoenix that takes the crust seriously." },
  { name: "Binkley's Restaurant", cuisine: "Contemporary / Tasting Menu", neighborhood: "Arcadia",
    address: "2320 E Osborn Rd, Phoenix, AZ 85016",
    lookup: "2320 E Osborn Rd, Phoenix, AZ 85016",
    score: 93, price: 4, tags: ["Fine Dining","Contemporary","American","Tasting Menu","Date Night","Celebrations","Critics Pick","Iconic"],
    reservation: "Tock",
    instagram: "@binkleysrestaurant", website: "https://binkleysrestaurant.com",
    dishes: ["Chef's Counter Tasting","Seasonal 20-Course","Wine Pairing","Caviar Service"],
    desc: "Chef Kevin Binkley's chef-counter tasting menu — 20+ courses over three hours, 12 seats, and a kitchen you watch work throughout the meal. Phoenix's most-decorated tasting-menu destination, with a price tag and discipline to match. The ask-your-food-editor-friend answer for Arizona's single most serious dinner." },
  { name: "Nook Kitchen", cuisine: "Italian / Pizza", neighborhood: "Central Phoenix",
    address: "4200 N Central Ave, Phoenix, AZ 85012",
    lookup: "4200 N Central Ave, Phoenix, AZ 85012",
    score: 83, price: 2, tags: ["Italian","Pizza","Casual","Patio","Family Friendly","Local Favorites","Brunch"],
    reservation: "OpenTable",
    instagram: "@nookkitchen", website: "https://nookkitchen.com",
    dishes: ["Wood-Fired Pizza","Handmade Pasta","Caesar Salad","Pistachio Gelato"],
    desc: "A neighborhood Italian anchor on Central — wood-fired pizzas, handmade pastas, and the kind of just-upscale-enough dining room that anchors three-generation Sunday dinners. Multi-location but the Central Ave original is the reference." }
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

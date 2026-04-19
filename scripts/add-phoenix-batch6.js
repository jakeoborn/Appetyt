#!/usr/bin/env name
// Phoenix batch 6 — Old Town Scottsdale + Scottsdale upscale (18 verified via Timeout/OldTownScottsdaleAZ via Apify)
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
  { name: "Talavera at Four Seasons Scottsdale", cuisine: "Spanish / Steakhouse", neighborhood: "Scottsdale",
    address: "10600 E Crescent Moon Dr, Scottsdale, AZ 85262",
    lookup: "10600 E Crescent Moon Dr, Scottsdale, AZ 85262",
    score: 93, price: 4, tags: ["Fine Dining","Spanish","Steakhouse","Date Night","Celebrations","Scenic Views","Cocktails","Critics Pick"],
    reservation: "OpenTable",
    group: "Four Seasons",
    instagram: "@talaverascottsdale", website: "https://fourseasons.com/scottsdale",
    dishes: ["Paella","Charred Octopus with Mojo Picón","Chateaubriand","Gin Bar Selection"],
    desc: "The Four Seasons' signature dining room in the Sonoran foothills, where executive chef Mel Mecinas has built one of Arizona's most specific menus — Spanish-rooted, smoke-forward, technically rigorous. Paella cooked over coals, charred octopus with mojo picón, and a Gin Bar that treats the spirit like a wine program. Views for days; the resort dining argument ends here." },
  { name: "The Mission", cuisine: "Modern Latin American", neighborhood: "Old Town Scottsdale",
    address: "3815 N Brown Ave, Scottsdale, AZ 85251",
    lookup: "3815 N Brown Ave, Scottsdale, AZ 85251",
    score: 90, price: 3, tags: ["Modern","Latin","Date Night","Cocktails","Critics Pick","Patio","Iconic"],
    reservation: "Resy",
    group: "Common Era Hospitality",
    instagram: "@themissionaz", website: "https://themissionaz.com",
    dishes: ["Tableside Guacamole","Confit Pork Tacos","Duck Confit Empanadas","Mezcal Flight"],
    desc: "A modern-Latin dining room in Old Town wrapped around a glowing Himalayan salt rock wall — Matt Carter's kitchen has kept the tasting-menu-in-a-taco-room formula at the top of Scottsdale's dining conversation for a decade. Confit pork tacos, duck empanadas, a mezcal list that can be talked through by the bartender. Still the Old Town reservation out-of-towners fail to get." },
  { name: "Franco's Italian Caffe", cuisine: "Italian / Tuscan", neighborhood: "Old Town Scottsdale",
    address: "4327 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "4327 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 89, price: 4, tags: ["Fine Dining","Italian","Tuscan","Date Night","Celebrations","Wine Bar","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@francosrestaurant", website: "",
    dishes: ["Bistecca Fiorentina","Handmade Pappardelle","Merenghata Cake","Tuscan Wine List"],
    desc: "Chef Franco Fazzuoli's Tuscan dining room has been Scottsdale's quiet Italian benchmark for over two decades. Bistecca Fiorentina carved tableside, handmade pastas, and a dessert case anchored by the merenghata cake that regulars call ahead to reserve a slice of. Old-world service that doesn't pretend to be anything else." },
  { name: "Sel Restaurant", cuisine: "Contemporary / Tasting Menu", neighborhood: "Old Town Scottsdale",
    address: "7044 E Main St, Scottsdale, AZ 85251",
    lookup: "7044 E Main St, Scottsdale, AZ 85251",
    score: 90, price: 4, tags: ["Fine Dining","Contemporary","Tasting Menu","Date Night","Celebrations","Critics Pick"],
    reservation: "Tock",
    instagram: "@selrestaurant", website: "",
    dishes: ["Prix-Fixe Tasting","Seasonal Crudo","Wine Pairing","Chef's Table"],
    desc: "Chef-owned and chef-driven — Brandon Levine turned a former Old Town art gallery into one of Scottsdale's most intentional tasting-menu rooms. Five-to-nine course prix-fixe that changes with the season, wine pairings that actually consider each plate, and a dining room quiet enough to make the dish the whole conversation. The Scottsdale equivalent of a New York chef's counter." },
  { name: "Hash Kitchen", cuisine: "Breakfast / Brunch", neighborhood: "North Scottsdale",
    address: "8777 N Scottsdale Rd, Scottsdale, AZ 85253",
    lookup: "8777 N Scottsdale Rd, Scottsdale, AZ 85253",
    score: 86, price: 2, tags: ["Brunch","American","Casual","Family Friendly","Local Favorites","Trending","Cocktails","Scene"],
    reservation: "walk-in",
    group: "Common Era Hospitality",
    instagram: "@hashkitchen", website: "https://hashkitchen.com",
    dishes: ["Cannoli Pancakes","Build-Your-Own Bloody Mary (30+ Garnishes)","Churro French Toast","Mimosa Tower"],
    desc: "The Common Era brunch concept that invented the 30-garnish Bloody Mary bar and refused to apologize. DJ spins from 10 a.m., cannoli pancakes and churro French toast headline the menu, and the mimosa tower is a social-media rite of passage. Scottsdale brunch at maximum energy." },
  { name: "Craft 64", cuisine: "Brewpub / Pizza", neighborhood: "Old Town Scottsdale",
    address: "6922 E Main St, Scottsdale, AZ 85251",
    lookup: "6922 E Main St, Scottsdale, AZ 85251",
    score: 86, price: 2, tags: ["Brewery","Pizza","Italian","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@craft64", website: "https://craft64.net",
    dishes: ["Wood-Fired Margherita","30 Arizona Beers on Tap","Calabrese Pizza","House Cocktail"],
    desc: "A 1930s bungalow on Main Street turned into one of Arizona's most serious craft-beer arguments — 30 Arizona brewers on tap at a time, wood-fired pizzas pulled off the deck next to them. The pairing-format pub Scottsdale had been quietly missing. Patio at sunset is worth the walk." },
  { name: "Fat Ox", cuisine: "Italian / Fine Dining", neighborhood: "Scottsdale",
    address: "6316 N Scottsdale Rd Ste A, Scottsdale, AZ 85253",
    lookup: "6316 N Scottsdale Rd, Scottsdale, AZ 85253",
    score: 91, price: 4, tags: ["Fine Dining","Italian","Steakhouse","Seafood","Date Night","Celebrations","Critics Pick","Cocktails"],
    reservation: "OpenTable",
    instagram: "@fatoxrestaurant", website: "https://fatoxrestaurant.com",
    dishes: ["Mesquite-Grilled Branzino","Prime Ribeye","Handmade Pappardelle","Wood-Fired Octopus"],
    desc: "Chef Matt Carter's second-act Italian next to his flagship — Sicilian technique meets Scottsdale mesquite. Handmade pasta, mesquite-grilled whole fish, prime steaks for the table everyone thinks is celebrating something. One of the valley's most consistent high-end rooms." },
  { name: "Maple & Ash Scottsdale", cuisine: "Steakhouse / Wood-Fired", neighborhood: "Old Town Scottsdale",
    address: "7135 E Camelback Rd Ste 130, Scottsdale, AZ 85251",
    lookup: "7135 E Camelback Rd, Scottsdale, AZ 85251",
    score: 91, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations","Cocktails","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "What If... Syndicate",
    instagram: "@mapleandash", website: "https://mapleandash.com",
    dishes: ["I Don't Give a F*@#! Tasting Menu","Wood-Fired Ribeye","Oysters","Caviar Service"],
    desc: "The Chicago-born wood-fired steakhouse that landed at Fashion Square and became Old Town's most theatrical dinner. The 'I Don't Give a F*@#!' chef's tasting menu is ordered at 70% of tables; wood-hearth ribeyes arrive with actual smoke in the dining room; the caviar-and-champagne cart is real. Expensive, excellent, unapologetic." },
  { name: "Francine", cuisine: "French Riviera / Mediterranean", neighborhood: "Old Town Scottsdale",
    address: "4710 N Goldwater Blvd, Scottsdale, AZ 85251",
    lookup: "4710 N Goldwater Blvd, Scottsdale, AZ 85251",
    score: 89, price: 4, tags: ["Fine Dining","French","Mediterranean","Date Night","Patio","Cocktails","Trending","Critics Pick"],
    reservation: "OpenTable",
    group: "Kevin Boehm Hospitality",
    instagram: "@francinerestaurant", website: "https://francinerestaurant.com",
    dishes: ["Whole Grilled Branzino","Niçoise Salad","Steak Frites","Lavender Spritz"],
    desc: "A French Riviera fever-dream on the Scottsdale Waterfront — blue-and-white striped awnings, pastel-pink dining room, and a menu of Mediterranean classics calibrated for a hot-weather patio. Whole branzino, niçoise done right, steak frites that hold up to the aesthetic. Scottsdale's current Instagram dining heavyweight." },
  { name: "Ocean 44", cuisine: "Seafood / Steakhouse", neighborhood: "Old Town Scottsdale",
    address: "4748 N Goldwater Blvd, Scottsdale, AZ 85251",
    lookup: "4748 N Goldwater Blvd, Scottsdale, AZ 85251",
    score: 90, price: 4, tags: ["Fine Dining","Seafood","Steakhouse","Date Night","Celebrations","Critics Pick","Scenic Views"],
    reservation: "OpenTable",
    group: "Mastro's/Ocean",
    instagram: "@ocean44", website: "https://ocean44.com",
    dishes: ["Chilean Sea Bass","Whole Maine Lobster","Alaskan King Crab","Sommelier Wine Pairing"],
    desc: "The Mastro's family's seafood-forward restaurant on the Scottsdale Waterfront — luxury fish program, extensive wine cellar, piano bar, the full fine-dining-steakhouse-but-seafood package. Chilean sea bass is the regulars' order; whole Maine lobster is the celebration dish. Waterside view included." },
  { name: "Citizen Public House", cuisine: "Modern American / Gastropub", neighborhood: "Old Town Scottsdale",
    address: "7111 E 5th Ave Ste E, Scottsdale, AZ 85251",
    lookup: "7111 E 5th Ave, Scottsdale, AZ 85251",
    score: 87, price: 3, tags: ["American","Gastropub","Date Night","Cocktails","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@citizenpublichouse", website: "https://citizenpublichouse.com",
    dishes: ["Original Chopped Salad","Bone Marrow","Short Rib Stroganoff","Whiskey Flight"],
    desc: "Chef Bernie Kantak's gastropub anchor — the Original Chopped Salad that started a Valley-wide trend still arrives with the same pine-nuts-and-orzo build, and the short rib stroganoff remains a winter regular. Bar program leans whiskey-heavy, dining room stays loud in the right way. Old Town's consistent modern-American room." },
  { name: "Marcellino Ristorante", cuisine: "Italian / Fine Dining", neighborhood: "Old Town Scottsdale",
    address: "7114 E Stetson Dr Ste 110, Scottsdale, AZ 85251",
    lookup: "7114 E Stetson Dr, Scottsdale, AZ 85251",
    score: 91, price: 4, tags: ["Fine Dining","Italian","Date Night","Celebrations","Historic","Critics Pick","Wine Bar"],
    reservation: "OpenTable",
    instagram: "@marcellinoaz", website: "https://marcellinoristorante.com",
    dishes: ["Tableside Veal Osso Buco","Handmade Tortelli","Osso Buco","Italian Wine Selection"],
    desc: "Chef-owner Marcellino Verzino runs one of Arizona's most formal Italian dining rooms with the kind of old-school hospitality that hasn't changed — tableside pasta service, hand-rolled tortelli, wine list that goes deep Italian. A Scottsdale celebration restaurant where the ritual is the meal." },
  { name: "Nobu Scottsdale", cuisine: "Japanese / Peruvian", neighborhood: "Old Town Scottsdale",
    address: "7014 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "7014 E Camelback Rd, Scottsdale, AZ 85251",
    score: 90, price: 4, tags: ["Fine Dining","Japanese","Peruvian","Date Night","Celebrations","Cocktails","Iconic"],
    reservation: "OpenTable",
    group: "Nobu Hospitality",
    instagram: "@nobuscottsdale", website: "https://noburestaurants.com/scottsdale",
    dishes: ["Black Cod Miso","Yellowtail Jalapeño","Rock Shrimp Tempura","Omakase"],
    desc: "Nobu Matsuhisa's Scottsdale outpost at Fashion Square — the same Japanese-Peruvian signature menu that launched a global empire, now serving the Valley. Black cod miso, yellowtail jalapeño, rock shrimp tempura — the greatest-hits plates that read the same in Scottsdale as they do in Tokyo. Book the omakase." },
  { name: "Toca Madera Scottsdale", cuisine: "Modern Mexican / Mexican Steakhouse", neighborhood: "Old Town Scottsdale",
    address: "4736 N Goldwater Blvd, Scottsdale, AZ 85251",
    lookup: "4736 N Goldwater Blvd, Scottsdale, AZ 85251",
    score: 88, price: 4, tags: ["Modern","Mexican","Date Night","Celebrations","Cocktails","Scene","Trending"],
    reservation: "OpenTable",
    group: "Noble 33",
    instagram: "@tocamadera", website: "https://tocamaderascottsdale.com",
    dishes: ["Wagyu Carne Asada","Smoked Short Rib","Mezcal Flight","Margarita Toca"],
    desc: "A modern-Mexican dining-and-nightlife concept on the Scottsdale Waterfront — DJ spinning, high-energy service, a menu that builds from fire-roasted seafood up to wagyu carne asada. Mezcal and tequila program as serious as any in the state. Dinner turns into a scene by 10 p.m." },
  { name: "Shinbay", cuisine: "Japanese / Omakase", neighborhood: "Old Town Scottsdale",
    address: "3720 N Scottsdale Rd Ste 201, Scottsdale, AZ 85251",
    lookup: "3720 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 93, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Critics Pick","Celebrations"],
    reservation: "Tock",
    instagram: "@shinbayomakase", website: "",
    dishes: ["Omakase Counter","Edomae-Style Sushi","Sake Pairing","Seasonal Sashimi"],
    desc: "Scottsdale's most serious omakase — eight-seat counter, chef-driven pacing, fish flown from Toyosu, and a sake list built with the same specificity as the nigiri. The argument for Scottsdale as a Japanese-food city starts and ends at Shinbay's counter. Book weeks out." },
  { name: "Culinary Dropout Scottsdale", cuisine: "American / Gastropub", neighborhood: "Old Town Scottsdale",
    address: "7135 E Camelback Rd Ste 125, Scottsdale, AZ 85251",
    lookup: "7135 E Camelback Rd, Scottsdale, AZ 85251",
    score: 86, price: 2, tags: ["American","Gastropub","Casual","Patio","Local Favorites","Family Friendly","Scene","Brewery"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@culinarydropout", website: "https://culinarydropout.com",
    dishes: ["Fried Chicken","Soft Pretzel Fondue","Korean Fried Cauliflower","Pork Green Chile"],
    desc: "Fox Restaurant Concepts' flagship at Fashion Square — sprawling patio with live music most nights, menu of shareable gastropub plates with genuine point of view. Soft pretzel fondue is the appetizer everyone orders; the fried chicken is the best case for comfort-food chain restaurants. Arizona's most specific casual-dining concept." },
  { name: "Olive & Ivy", cuisine: "Mediterranean / Modern", neighborhood: "Old Town Scottsdale",
    address: "7135 E Camelback Rd Ste 195, Scottsdale, AZ 85251",
    lookup: "7135 E Camelback Rd, Scottsdale, AZ 85251",
    score: 86, price: 3, tags: ["Mediterranean","Modern","Date Night","Patio","Cocktails","Scenic Views"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@oliveandivy", website: "https://oliveandivyrestaurant.com",
    dishes: ["Grilled Mediterranean Branzino","Chicken Shawarma","Hummus Plate","Mediterranean Mezze"],
    desc: "Fox Restaurants' Mediterranean flagship on the Scottsdale Waterfront, running a bright, produce-driven menu with one of Arizona's better waterside patios. Grilled branzino, shawarma, a mezze plate built for sharing. The reliable Old Town date-night-with-parents answer." },
  { name: "Kazimierz World Wine Bar", cuisine: "Wine Bar / Jazz", neighborhood: "Old Town Scottsdale",
    address: "7137 E Stetson Dr, Scottsdale, AZ 85251",
    lookup: "7137 E Stetson Dr, Scottsdale, AZ 85251",
    score: 88, price: 3, tags: ["Wine Bar","Bar","Cocktails","Live Music","Date Night","Hidden Gem","Iconic","Late Night"],
    reservation: "walk-in",
    instagram: "@kazbarscottsdale", website: "",
    dishes: ["2000+ Bottle Wine List","Jazz Nights","Whiskey Flight","Cheese Board"],
    desc: "A hidden wine-cellar bar beneath Stetson Drive with 2,000+ bottles, a live-jazz schedule most nights, and the kind of dim, bookshelf-and-velvet atmosphere Old Town doesn't usually allow. Kazimierz rewards the people who figure out where the door is. Late-night, low-lit, real." }
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

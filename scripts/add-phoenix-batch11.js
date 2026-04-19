#!/usr/bin/env node
// Phoenix batch 11 — More AZ institutions + Upward Projects + Hillstone brands (training-verified)
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
  { name: "Joyride Taco House", cuisine: "Mexican / Tacos", neighborhood: "Uptown",
    address: "5202 N Central Ave, Phoenix, AZ 85012",
    lookup: "5202 N Central Ave, Phoenix, AZ 85012",
    score: 84, price: 2, tags: ["Mexican","Tacos","Casual","Family Friendly","Patio","Local Favorites"],
    reservation: "walk-in",
    group: "Upward Projects",
    instagram: "@joyridetacos", website: "https://joyridetacos.com",
    dishes: ["Crispy Pork Belly Taco","Carnitas","Chicken Tinga","House Margarita"],
    desc: "Upward Projects' taco joint on Uptown Plaza — bright primary-color patio, casual walk-up format, and a menu of crispy and soft tacos that doesn't try to be more than it is. The neighborhood taco-on-a-Tuesday default for Central-corridor regulars." },
  { name: "Original ChopShop", cuisine: "Healthy / Cafe", neighborhood: "Arcadia",
    address: "3370 E Indian School Rd, Phoenix, AZ 85018",
    lookup: "3370 E Indian School Rd, Phoenix, AZ 85018",
    score: 83, price: 2, tags: ["Healthy","Cafe","Salads","Casual","Quick Bite","Family Friendly","Vegetarian","Local Favorites"],
    indicators: ["vegetarian"],
    reservation: "walk-in",
    group: "Original ChopShop",
    instagram: "@originalchopshop", website: "https://originalchopshop.com",
    dishes: ["Protein Bowls","Açaí Bowl","Vegetarian Burrito","Kale Superfood Salad"],
    desc: "Arizona-grown healthy-bowl chain that started in Arcadia and spread nationally — protein bowls, açaí bowls, and grain-forward plates that don't apologize for their wellness-forward format. The regulars treat it as a default weekday lunch; the salad game is legitimately strong." },
  { name: "Cartel Coffee Lab Tempe", cuisine: "Coffee / Cafe", neighborhood: "Tempe",
    address: "225 W University Dr, Tempe, AZ 85281",
    lookup: "225 W University Dr, Tempe, AZ 85281",
    score: 86, price: 2, tags: ["Coffee Shop","Cafe","Casual","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Cartel Coffee Lab",
    instagram: "@cartelcoffeelab", website: "https://cartelcoffeelab.com",
    dishes: ["Single-Origin Pour-Over","Cortado","Cold Brew","House Pastry"],
    desc: "Arizona's third-wave coffee pioneer, started in Tempe in 2008 — on-site roastery, pour-over bar, and a reputation that helped build the AZ specialty-coffee scene from zero. Cortados pulled properly, beans rotated seasonally, and a counter crowd of local roasters comparing notes." },
  { name: "The Americano", cuisine: "Steakhouse / Italian", neighborhood: "Scottsdale",
    address: "6900 E Shea Blvd, Scottsdale, AZ 85254",
    lookup: "6900 E Shea Blvd, Scottsdale, AZ 85254",
    score: 87, price: 4, tags: ["Fine Dining","Steakhouse","Italian","Date Night","Celebrations","Cocktails","Patio"],
    reservation: "OpenTable",
    group: "Maggiore Family",
    instagram: "@theamericanoscottsdale", website: "https://theamericanorestaurant.com",
    dishes: ["Dry-Aged Ribeye","Handmade Pasta","Veal Parmesan","House Cocktail"],
    desc: "The Maggiore family's North Scottsdale steakhouse-meets-Italian-trattoria — dry-aged beef, handmade pasta, and a leather-booth dining room that reads old-money Scottsdale without trying too hard. The third-generation Maggiore restaurant lineage continues." },
  { name: "Sushi Roku Scottsdale", cuisine: "Japanese / Sushi", neighborhood: "Old Town Scottsdale",
    address: "7277 E Camelback Rd #1, Scottsdale, AZ 85251",
    lookup: "7277 E Camelback Rd, Scottsdale, AZ 85251",
    score: 86, price: 4, tags: ["Japanese","Sushi","Fine Dining","Date Night","Celebrations","Cocktails","Scene"],
    reservation: "OpenTable",
    group: "Innovative Dining Group",
    instagram: "@sushirokuscottsdale", website: "https://sushiroku.com",
    dishes: ["Albacore Sashimi with Crispy Onion","Dynamite Roll","Miso Black Cod","Sake Pairing"],
    desc: "The IDG sushi-restaurant chain's Scottsdale outpost at Scottsdale Fashion Square — sleek mid-century-ish interior, albacore sashimi with crispy onion as the anchor, and a dining room scaled for the Camelback Rd business-dinner set." },
  { name: "True Food Kitchen Biltmore", cuisine: "Healthy / Contemporary", neighborhood: "Biltmore",
    address: "2502 E Camelback Rd Ste 133, Phoenix, AZ 85016",
    lookup: "2502 E Camelback Rd, Phoenix, AZ 85016",
    score: 85, price: 2, tags: ["Healthy","Modern","Vegetarian","Casual","Family Friendly","Patio","Local Favorites"],
    indicators: ["vegetarian"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts / Dr. Andrew Weil",
    instagram: "@truefoodkitchen", website: "https://truefoodkitchen.com",
    dishes: ["Ancient Grains Bowl","Edamame Dumplings","Sustainable Seafood","Medicine Man Cocktail"],
    desc: "The original True Food Kitchen — Fox Restaurant Concepts' Dr. Andrew Weil-advised healthy-eating concept that went national from this Biltmore strip. Produce-forward menu, anti-inflammatory sourcing, and a format that made wellness-dining mainstream. Phoenix was the test lab." },
  { name: "Houston's Scottsdale", cuisine: "American / Contemporary", neighborhood: "Scottsdale",
    address: "6113 N Scottsdale Rd, Scottsdale, AZ 85250",
    lookup: "6113 N Scottsdale Rd, Scottsdale, AZ 85250",
    score: 86, price: 3, tags: ["American","Modern","Date Night","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Hillstone Restaurant Group",
    instagram: "", website: "https://hillstone.com",
    dishes: ["Hawaiian Ribeye","Spinach Dip","Veggie Burger","Pan-Seared Scottish Salmon"],
    desc: "The Hillstone Restaurant Group's Scottsdale location — dimly-lit dark-wood dining room, veggie burger that has earned a cult following, Hawaiian ribeye that regulars order without looking at the menu. Walk-in only, no reservations; the bar is the move." },
  { name: "Hillstone Phoenix", cuisine: "American / Contemporary", neighborhood: "Biltmore",
    address: "2650 E Camelback Rd, Phoenix, AZ 85016",
    lookup: "2650 E Camelback Rd, Phoenix, AZ 85016",
    score: 87, price: 3, tags: ["American","Modern","Date Night","Patio","Iconic","Cocktails"],
    reservation: "walk-in",
    group: "Hillstone Restaurant Group",
    instagram: "", website: "https://hillstone.com",
    dishes: ["Hawaiian Ribeye","Veggie Burger","Warm Artichoke Dip","Crispy Fried Chicken Sandwich"],
    desc: "The Biltmore Hillstone — the flagship chain's Phoenix room, and arguably the best-executed of the Valley's Hillstone properties. Same no-reservations model, same artichoke dip tradition, same dark-wood-and-booth interior that has carried the brand for three decades. Plan the wait." },
  { name: "Fleming's Prime Steakhouse Scottsdale", cuisine: "Steakhouse", neighborhood: "North Scottsdale",
    address: "20753 N Pima Rd, Scottsdale, AZ 85255",
    lookup: "20753 N Pima Rd, Scottsdale, AZ 85255",
    score: 86, price: 4, tags: ["Fine Dining","Steakhouse","American","Date Night","Celebrations","Cocktails"],
    reservation: "OpenTable",
    group: "Bloomin' Brands",
    instagram: "@flemingssteakhouse", website: "https://flemingssteakhouse.com",
    dishes: ["Prime Bone-In Ribeye","Wagyu Carpaccio","Wedge Salad","100 Wines by the Glass"],
    desc: "The Arizona flagship of the upscale steakhouse chain — 100 wines by the glass is the marquee feature, prime dry-aged beef the reliable order, and a dining room that fills the expense-account and anniversary gaps in North Scottsdale." },
  { name: "Morning Squeeze", cuisine: "Breakfast / Brunch", neighborhood: "Old Town Scottsdale",
    address: "4233 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "4233 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Breakfast","Brunch","American","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@morningsqueezeaz", website: "https://morningsqueeze.com",
    dishes: ["Breakfast Burrito","Fresh-Squeezed OJ","Pancakes","Avocado Toast"],
    desc: "Scottsdale Road brunch cafe with a patio scaled for the crowd that shows up at 10 a.m. on a Saturday. Fresh-squeezed juices (the name earns itself), breakfast burritos that anchor the menu, and a format that works for a casual weekday or a post-spa brunch." },
  { name: "Ghost Ranch: Modern Southwest Cuisine", cuisine: "Southwestern / Mexican", neighborhood: "Tempe",
    address: "1006 E University Dr, Tempe, AZ 85281",
    lookup: "1006 E University Dr, Tempe, AZ 85281",
    score: 87, price: 3, tags: ["Southwestern","Mexican","Modern","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Aaron Chamberlin",
    instagram: "@ghostranchrestaurant", website: "https://ghostranchaz.com",
    dishes: ["Tableside Guacamole","Wood-Fired Tomahawk","Duck Carnitas","Prickly Pear Margarita"],
    desc: "Chef Aaron Chamberlin's modern-Southwestern dining room in Tempe — Georgia O'Keeffe-era color palette, wood-fired grill, menu that treats the Sonoran Desert as a pantry rather than a theme. The post-ASU grown-up date-night answer." },
  { name: "Texaz Grill", cuisine: "Texas / Chicken-Fried Steak", neighborhood: "Central Phoenix",
    address: "6003 N 16th St, Phoenix, AZ 85016",
    lookup: "6003 N 16th St, Phoenix, AZ 85016",
    score: 84, price: 2, tags: ["American","Southern","Casual","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@texazgrill", website: "https://texazgrill.com",
    dishes: ["Chicken-Fried Steak","Carne Asada","Ribeye","Catfish"],
    desc: "Phoenix's chicken-fried steak pilgrimage — a 16th Street institution since 1985 serving the Texas-style-but-larger version of the dish. Ribeyes, catfish, and a dining room where regulars have had the same Monday table for decades." },
  { name: "Los Sombreros Cafe & Cantina", cuisine: "Mexican", neighborhood: "Old Town Scottsdale",
    address: "2534 N Scottsdale Rd, Scottsdale, AZ 85257",
    lookup: "2534 N Scottsdale Rd, Scottsdale, AZ 85257",
    score: 85, price: 3, tags: ["Mexican","Casual","Patio","Date Night","Local Favorites","Historic"],
    reservation: "OpenTable",
    instagram: "@lossombrerosrestaurant", website: "https://lossombros.com",
    dishes: ["Mole Poblano","Chile Rellenos","Pork Carnitas","Margarita"],
    desc: "Scottsdale Road Mexican institution since 1995 — Azucena Tovar's family recipes, moles simmered all day, and a hacienda-style dining room with one of Scottsdale's quieter patios. A traditional Mexican restaurant that refuses to trend." },
  { name: "Hanny's", cuisine: "American / Bar", neighborhood: "Downtown Phoenix",
    address: "40 N 1st St, Phoenix, AZ 85004",
    lookup: "40 N 1st St, Phoenix, AZ 85004",
    score: 85, price: 3, tags: ["American","Bar","Cocktails","Date Night","Historic","Iconic","Late Night","Patio"],
    reservation: "OpenTable",
    instagram: "@hannysphx", website: "https://hannys.com",
    dishes: ["Wood-Fired Pizza","Craft Cocktail","Oysters","Tomato Soup"],
    desc: "A 1940s downtown Phoenix department-store building turned bar-and-restaurant — marble bar, art-deco detail, and a cocktail program that treats the space seriously. Pre-show dinner for Herberger / Orpheum / Symphony Hall; one of DTPHX's most architectural rooms." },
  { name: "Dick's Hideaway", cuisine: "American / Dive Bar", neighborhood: "Central Phoenix",
    address: "6008 N 16th St, Phoenix, AZ 85016",
    lookup: "6008 N 16th St, Phoenix, AZ 85016",
    score: 85, price: 2, tags: ["American","Dive Bar","Bar","Casual","Historic","Iconic","Late Night","Local Favorites"],
    reservation: "walk-in",
    group: "Richardson's",
    instagram: "", website: "",
    dishes: ["Burger","Chicken-Fried Steak","Breakfast Burrito","Bloody Mary"],
    desc: "Richardson's sister dive-bar on 16th Street — the 24-hour-ish hideaway that regulars call from the airport. Red-lit interior, strong pours, a menu that runs the Central Corridor comfort-food canon, and a no-reservations policy that has kept the crowd honest. A Phoenix nightcap." },
  { name: "Churn", cuisine: "Ice Cream / Dessert", neighborhood: "Uptown",
    address: "5223 N Central Ave, Phoenix, AZ 85012",
    lookup: "5223 N Central Ave, Phoenix, AZ 85012",
    score: 85, price: 1, tags: ["Dessert","Ice Cream","Casual","Quick Bite","Family Friendly","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Upward Projects",
    instagram: "@churncentral", website: "https://churnaz.com",
    dishes: ["Small-Batch Ice Cream","Housemade Fudge","Retro Candy","Sundae"],
    desc: "Upward Projects' retro ice-cream-and-candy shop on Central Ave — 1950s soda-counter interior, small-batch ice cream made upstairs, and a candy wall that reads like a grandparent's vacation memory. The Windsor / Federal Pizza block's dessert round-up." }
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

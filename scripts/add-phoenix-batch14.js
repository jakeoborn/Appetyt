#!/usr/bin/env node
// Phoenix batch 14 — Downtown cocktail scene + Scottsdale Italian + historic Phoenix (training-verified)
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
  { name: "Bitter & Twisted Cocktail Parlour", cuisine: "Cocktail Bar", neighborhood: "Downtown Phoenix",
    address: "1 W Jefferson St, Phoenix, AZ 85003",
    lookup: "1 W Jefferson St, Phoenix, AZ 85003",
    score: 88, price: 3, tags: ["Cocktails","Bar","Historic","Iconic","Date Night","Late Night","Critics Pick","Trending"],
    reservation: "walk-in",
    group: "Ross Simon",
    instagram: "@bitterandtwistedaz", website: "https://bitterandtwistedaz.com",
    dishes: ["110+ Page Cocktail Menu","Gin Selection","Tapas Plates","Rare Spirit Program"],
    desc: "Ross Simon's Downtown Phoenix cocktail encyclopedia — a 110-page drinks menu, one of the country's deepest gin selections, and a bar program that's earned national awards since opening in 2014. The second room in Simon's Downtown Phoenix cocktail-bar stable (Little Rituals being the other)." },
  { name: "AZ/88", cuisine: "American / Modern", neighborhood: "Old Town Scottsdale",
    address: "7353 E Scottsdale Mall, Scottsdale, AZ 85251",
    lookup: "7353 E Scottsdale Mall, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Patio","Iconic","Art Installation","Cocktails"],
    reservation: "walk-in",
    instagram: "@az88", website: "https://az88.com",
    dishes: ["Blueprint Chicken","AZ/88 Burger","Rotating Art Installations","Cocktail Program"],
    desc: "At Scottsdale Civic Center — an American-modern dining room inside a contemporary-art gallery. Rotating art installations change the dining room's character every few months, the menu rotates seasonally, and the bar program holds up independently. Scottsdale's most quietly-specific restaurant." },
  { name: "Virtù Honest Craft", cuisine: "Mediterranean / Contemporary", neighborhood: "Scottsdale",
    address: "3701 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "3701 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 90, price: 4, tags: ["Fine Dining","Mediterranean","Italian","Date Night","Critics Pick","Iconic","Patio"],
    reservation: "Resy",
    group: "Gio Osso",
    instagram: "@virtuaz", website: "https://virtuaz.com",
    dishes: ["Handmade Pasta","Grilled Whole Fish","Wood-Fired Vegetables","Wine Pairing"],
    desc: "Chef Gio Osso's Scottsdale flagship — Mediterranean-leaning contemporary cuisine, handmade pasta, wood-fired whole fish, and a dining room that has carried James Beard semifinalist recognition several years running. Old Town-adjacent; one of the Valley's most critically-consistent kitchens." },
  { name: "Pizzeria Virtù", cuisine: "Italian / Neapolitan Pizza", neighborhood: "Old Town Scottsdale",
    address: "6952 E Main St, Scottsdale, AZ 85251",
    lookup: "6952 E Main St, Scottsdale, AZ 85251",
    score: 86, price: 2, tags: ["Italian","Pizza","Casual","Patio","Local Favorites","Date Night"],
    reservation: "walk-in",
    group: "Gio Osso",
    instagram: "@pizzeriavirtuaz", website: "https://pizzeriavirtu.com",
    dishes: ["Margherita","Diavola","Wood-Fired Calzone","Burrata"],
    desc: "Gio Osso's Old Town pizzeria companion to Virtù — Neapolitan-style pies out of a wood-fired oven, handmade burrata plates, and a sidewalk-adjacent patio in the heart of Old Town. The casual spinoff of a James Beard-caliber kitchen." },
  { name: "La Stalla Cucina Rustica", cuisine: "Italian", neighborhood: "Scottsdale",
    address: "5650 N Scottsdale Rd, Paradise Valley, AZ 85253",
    lookup: "5650 N Scottsdale Rd, Paradise Valley, AZ 85253",
    score: 86, price: 3, tags: ["Italian","Date Night","Patio","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@lastallaaz", website: "https://lastallaaz.com",
    dishes: ["Handmade Pasta","Osso Buco","Wood-Fired Pizza","Tiramisu"],
    desc: "Paradise Valley-adjacent Italian that has been a quiet Scottsdale date-night since 2007. Rustic-Italian menu, handmade pastas, and a dining room that avoids Old Town's Entertainment-District volume. The grown-up Italian alternative." },
  { name: "El Bravo Mexican Restaurant", cuisine: "Mexican / Sonoran", neighborhood: "North Phoenix",
    address: "8338 N 7th St, Phoenix, AZ 85020",
    lookup: "8338 N 7th St, Phoenix, AZ 85020",
    score: 88, price: 1, tags: ["Mexican","Sonoran","Casual","Iconic","Historic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://elbravomexicanrestaurant.com",
    dishes: ["Green Corn Tamales","Red Chile Burrito","Machaca","Cheese Crisp"],
    desc: "Since 1974 — a family-owned Sonoran Mexican restaurant on North 7th that has been feeding Phoenix families for three generations without a menu overhaul. Green corn tamales (specific Arizona-Sonoran specialty), red chile burrito, and the kind of dining room that treats Sunday lunch as a family obligation." },
  { name: "Sip Coffee & Beer House", cuisine: "Coffee / Beer / Cafe", neighborhood: "Arcadia",
    address: "3213 E Indian School Rd, Phoenix, AZ 85016",
    lookup: "3213 E Indian School Rd, Phoenix, AZ 85016",
    score: 86, price: 2, tags: ["Coffee Shop","Beer","Cafe","Casual","Patio","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Barter & Shake",
    instagram: "@sipcoffee_beerhouse", website: "https://sipaz.com",
    dishes: ["Espresso","Local Draft Beer","Breakfast Sandwich","Brunch Plates"],
    desc: "Coffee shop on top, craft-beer list through the afternoon, and the entrance to Undertow tiki bar hidden downstairs. Sip is a Barter & Shake concept that doubles as a useful day-café and a cool pre-game for a tiki reservation. Multi-use by design." },
  { name: "Giant Coffee", cuisine: "Coffee / Cafe", neighborhood: "Coronado",
    address: "1437 N 1st St, Phoenix, AZ 85004",
    lookup: "1437 N 1st St, Phoenix, AZ 85004",
    score: 85, price: 2, tags: ["Coffee Shop","Cafe","Casual","Patio","Local Favorites","Brunch"],
    reservation: "walk-in",
    instagram: "@giantcoffeephx", website: "https://giantcoffeephx.com",
    dishes: ["Ham Sandwich","House Drip Coffee","Seasonal Pastry","Breakfast Burrito"],
    desc: "A Coronado neighborhood coffee shop inside a mid-century gas station shell — the ham sandwich is the cult order (house-cured, served on a proper roll), and the coffee program has been a Central Phoenix standard for over a decade. The unironic morning stop for the Coronado-1st-Street corridor." },
  { name: "The Womack", cuisine: "Cocktail Bar / Jazz Club", neighborhood: "Uptown",
    address: "5749 N 7th St, Phoenix, AZ 85014",
    lookup: "5749 N 7th St, Phoenix, AZ 85014",
    score: 87, price: 3, tags: ["Cocktails","Bar","Jazz","Live Music","Date Night","Late Night","Trending","Critics Pick"],
    reservation: "walk-in",
    instagram: "@thewomackphx", website: "https://thewomack.com",
    dishes: ["Craft Cocktail Program","Live Jazz","Small Plates","Rare Spirit Flight"],
    desc: "Uptown jazz-and-cocktail bar named for funk/soul legend Bobby Womack — live jazz most nights, a cocktail program that treats classics and originals with equal seriousness, and a vibe engineered for the listen-to-the-music crowd. Phoenix's best current live-music-plus-drinks combo." },
  { name: "Crust Simply Italian", cuisine: "Italian / Pizza", neighborhood: "Old Town Scottsdale",
    address: "7133 E Stetson Dr, Scottsdale, AZ 85251",
    lookup: "7133 E Stetson Dr, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@crustsimplyitalian", website: "https://crustsimplyitalian.com",
    dishes: ["Wood-Fired Pizza","Bolognese","Italian Sub","Cannoli"],
    desc: "Old Town Scottsdale's casual Italian-and-pizza corner at Stetson Drive — wood-fired pies, solid pastas, and a patio that catches the Old Town evening crowd. One of the more reliable casual Italian dinners in the neighborhood." },
  { name: "Butters Pancakes & Cafe", cuisine: "Breakfast / Pancakes", neighborhood: "Scottsdale",
    address: "6590 E Thomas Rd, Scottsdale, AZ 85251",
    lookup: "6590 E Thomas Rd, Scottsdale, AZ 85251",
    score: 85, price: 2, tags: ["Breakfast","American","Casual","Family Friendly","Local Favorites","Brunch"],
    reservation: "walk-in",
    group: "Butters",
    instagram: "@butterspancakes", website: "https://butterspancakes.com",
    dishes: ["Buttermilk Pancakes","Bacon","Breakfast Burrito","Eggs Benedict"],
    desc: "Scottsdale's pancake-anchored family breakfast spot — handmade buttermilk stacks, seasonal pancake specials that change every month, and the kind of weekend-morning line that tells you it's a local rite. Multiple AZ locations; Thomas Road is a busy one." },
  { name: "Joe's Real BBQ", cuisine: "BBQ / Southern", neighborhood: "Gilbert",
    address: "301 N Gilbert Rd, Gilbert, AZ 85234",
    lookup: "301 N Gilbert Rd, Gilbert, AZ 85234",
    score: 88, price: 2, tags: ["BBQ","American","Casual","Historic","Iconic","Family Friendly","Local Favorites","Patio"],
    reservation: "walk-in",
    group: "Joe Johnston",
    instagram: "@joesrealbbq", website: "https://joesrealbbq.com",
    dishes: ["Smoked Brisket","Pulled Pork","Hot Links","Smoked Turkey"],
    desc: "Joe Johnston's Gilbert barbecue institution since 1998 — the anchor of the Johnston family's Gilbert restaurant trio (Joe's Farm Grill and Liberty Market are the siblings). Smoked brisket sliced thick, pulled pork pulled properly, and the kind of barbecue lineage that has helped define Arizona Q." },
  { name: "Tee Pee Mexican Food", cuisine: "Mexican / Sonoran", neighborhood: "Arcadia",
    address: "4144 E Indian School Rd, Phoenix, AZ 85018",
    lookup: "4144 E Indian School Rd, Phoenix, AZ 85018",
    score: 85, price: 1, tags: ["Mexican","Sonoran","Casual","Historic","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@teepeemexicanfood", website: "https://teepeemexicanfood.com",
    dishes: ["Green Corn Tamales","Chimichanga","Cheese Crisp","Red Chile Burro"],
    desc: "Since 1964 on Indian School Road — a Sonoran Mexican institution that claims a visit from George W. Bush in 2004 and has never marketed the fact. Green corn tamales, cheese crisps, chimichangas — the Arizona-specific Mexican format done at the Tee Pee standard for six decades." },
  { name: "Caffe Boa", cuisine: "Italian / Mediterranean", neighborhood: "Tempe",
    address: "398 S Mill Ave #102, Tempe, AZ 85281",
    lookup: "398 S Mill Ave, Tempe, AZ 85281",
    score: 85, price: 3, tags: ["Italian","Mediterranean","Date Night","Patio","Local Favorites","Wine Bar","Historic"],
    reservation: "OpenTable",
    instagram: "@caffeboa", website: "https://caffeboa.com",
    dishes: ["Handmade Pasta","Wood-Fired Pizza","Osso Buco","Italian Wine List"],
    desc: "A Mill Avenue Italian room that has outlasted most of Tempe's downtown dining churn — handmade pasta, wood-fired pizza, and a wine list that leans heavy on Italian regions. The grown-up Tempe date-night option, blocks from the ASU campus but not of it." }
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

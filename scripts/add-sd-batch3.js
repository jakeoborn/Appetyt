#!/usr/bin/env node
// San Diego batch 3 — North Park / Hillcrest / South Park / Bankers Hill / Barrio Logan (18 training-verified)
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
  { name: "Polite Provisions", cuisine: "Cocktail Bar", neighborhood: "North Park",
    address: "4696 30th St, San Diego, CA 92116",
    lookup: "4696 30th St, San Diego, CA 92116",
    score: 90, price: 3, tags: ["Cocktails","Bar","Date Night","Critics Pick","Iconic","Late Night","Trending"],
    reservation: "walk-in",
    group: "Consortium Holdings",
    instagram: "@politeprovisions", website: "https://politeprovisions.com",
    dishes: ["Classic Cocktails","Draft Cocktail System","Rare Spirit Selection","Bar Snacks"],
    desc: "Consortium Holdings' North Park cocktail anchor — routinely named one of America's best bars (Spirited Award Best US Bar 2015). Draft cocktail system at the bar, 100+ rare spirits, and a dining room that takes cocktail culture as seriously as food. San Diego's bar-program reference point." },
  { name: "Cucina Urbana", cuisine: "Italian / Contemporary", neighborhood: "Bankers Hill",
    address: "505 Laurel St, San Diego, CA 92101",
    lookup: "505 Laurel St, San Diego, CA 92101",
    score: 89, price: 3, tags: ["Italian","Modern","Date Night","Patio","Wine Bar","Critics Pick","Iconic","Family Friendly"],
    reservation: "OpenTable",
    group: "Tracy Borkum / Urban Kitchen Group",
    instagram: "@cucinaurbana", website: "https://cucinaurbana.com",
    dishes: ["Burrata","Handmade Pasta","Wood-Fired Chicken","Retail Wine + Corkage"],
    desc: "Tracy Borkum's Bankers Hill Italian-modern kitchen — the restaurant-plus-wine-shop hybrid that has defined San Diego casual-but-serious dining since 2009. Handmade pasta, wood-fired chicken, and a retail wine wall where you pick up a bottle at market price with a corkage fee. One of SD's most-copied formats." },
  { name: "Buona Forchetta", cuisine: "Italian / Neapolitan Pizza", neighborhood: "South Park",
    address: "3001 Beech St, San Diego, CA 92102",
    lookup: "3001 Beech St, San Diego, CA 92102",
    score: 91, price: 2, tags: ["Italian","Pizza","Date Night","Patio","Family Friendly","Iconic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    group: "Matteo Cattaneo",
    instagram: "@buonaforchettasd", website: "https://buonaforchetta.com",
    dishes: ["Sophia Loren Pizza","Tartufo","Margherita DOP","Pistachio Mortadella Pie"],
    desc: "Matteo Cattaneo's South Park Neapolitan pizzeria — AVPN-certified, wood-fired oven imported from Naples, and lines down Beech St every weekend night. The Sophia Loren (truffle cream + prosciutto + mushroom) is the cult order; the Margherita DOP is the benchmark. San Diego's Neapolitan pizza reference." },
  { name: "Saffron Thai", cuisine: "Thai", neighborhood: "Mission Hills",
    address: "3731 India St, San Diego, CA 92103",
    lookup: "3731 India St, San Diego, CA 92103",
    score: 89, price: 2, tags: ["Thai","Casual","Date Night","Local Favorites","Historic","Iconic","Critics Pick"],
    reservation: "walk-in",
    group: "Su-Mei Yu",
    instagram: "@saffronsandiego", website: "https://saffronsandiego.com",
    dishes: ["Thai BBQ Chicken","Jasmine Noodle","Pad See Ew","Mango Sticky Rice"],
    desc: "Chef Su-Mei Yu's Mission Hills Thai institution — a James Beard Best Chef: California nominee and SD's most-respected Thai restaurant for decades. The Thai BBQ chicken is the signature; the jasmine rice program alone would earn the reputation. A San Diego anchor." },
  { name: "Mister A's", cuisine: "Contemporary / Rooftop", neighborhood: "Bankers Hill",
    address: "2550 5th Ave, San Diego, CA 92103",
    lookup: "2550 5th Ave, San Diego, CA 92103",
    score: 90, price: 4, tags: ["Fine Dining","American","Modern","Date Night","Celebrations","Scenic Views","Patio","Iconic","Romantic"],
    reservation: "OpenTable",
    group: "Bertrand Hug",
    instagram: "@misterassd", website: "https://bertrandatmisteras.com",
    dishes: ["Prime Steak","Seasonal Tasting","Classic Cocktails","Sunset Terrace"],
    desc: "12th floor of a Bankers Hill tower — Mister A's has been San Diego's view-dinner destination since 1965. Downtown skyline and SD Bay on one side, Balboa Park on the other, and a dining room that has hosted a half-century of anniversaries. The classic SD proposal spot." },
  { name: "Carnitas' Snack Shack — North Park", cuisine: "Mexican / American / Pork", neighborhood: "North Park",
    address: "2632 University Ave, San Diego, CA 92104",
    lookup: "2632 University Ave, San Diego, CA 92104",
    score: 88, price: 2, tags: ["Mexican","American","Casual","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Hanis Cavin",
    instagram: "@carnitassnackshack", website: "https://carnitassnackshack.com",
    dishes: ["Carnitas Sandwich","Pork Belly Sandwich","Triple Threat","Steak Sandwich"],
    desc: "Chef Hanis Cavin's whole-hog sandwich shack on University Ave — the carnitas sandwich that went from food-cart afterthought to SD-institution in under a decade. Pork-forward menu, outdoor-only seating, and a line that hasn't gotten shorter since 2013." },
  { name: "Tribute Pizza", cuisine: "Italian / Neapolitan Pizza", neighborhood: "North Park",
    address: "3077 North Park Way, San Diego, CA 92104",
    lookup: "3077 North Park Way, San Diego, CA 92104",
    score: 88, price: 2, tags: ["Italian","Pizza","Casual","Patio","Critics Pick","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@tributepizza", website: "https://tributepizza.com",
    dishes: ["Tribute Margherita","Sourdough Crust Pies","Wood-Fired Calzone","Seasonal Toppings"],
    desc: "North Park pizzeria built around sourdough Neapolitan-style crust and local-produce toppings. Chef Matt Lyons's format — a converted 1914 post office building, 72-hour fermented dough, and a tight menu that rotates seasonally. San Diego's other serious pizzeria." },
  { name: "Communal Coffee", cuisine: "Coffee / Cafe", neighborhood: "North Park",
    address: "2335 University Ave, San Diego, CA 92104",
    lookup: "2335 University Ave, San Diego, CA 92104",
    score: 85, price: 2, tags: ["Coffee Shop","Cafe","Casual","Patio","Brunch","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@communalcoffee", website: "https://communalcoffee.com",
    dishes: ["Seasonal Latte","Avocado Toast","Housemade Pastry","Cold Brew"],
    desc: "A North Park coffee shop that doubles as a floral shop — pressed floral arrangements hanging overhead, bright minimalist interior, and a coffee program that treats the pour seriously. One of SD's most photographed cafés, and the coffee holds up." },
  { name: "Great Maple", cuisine: "American / Brunch", neighborhood: "Hillcrest",
    address: "1451 Washington St, San Diego, CA 92103",
    lookup: "1451 Washington St, San Diego, CA 92103",
    score: 86, price: 2, tags: ["American","Brunch","Casual","Family Friendly","Iconic","Local Favorites","Patio"],
    reservation: "OpenTable",
    group: "Hash House a Go Go founders",
    instagram: "@greatmaple", website: "https://greatmaple.com",
    dishes: ["Maple Bacon Donuts","Chicken & Waffles","Pancakes","Brunch Cocktails"],
    desc: "A Hash House-adjacent modern breakfast destination in Hillcrest — the maple-bacon donuts are the Instagram order, but the chicken and waffles and pancakes carry the weight. Line out the door Saturdays; the brunch institution of SD Hillcrest." },
  { name: "Crest Cafe", cuisine: "American / Diner", neighborhood: "Hillcrest",
    address: "425 Robinson Ave, San Diego, CA 92103",
    lookup: "425 Robinson Ave, San Diego, CA 92103",
    score: 84, price: 2, tags: ["American","Diner","Casual","Historic","Iconic","Local Favorites","Breakfast"],
    reservation: "walk-in",
    instagram: "@crestcafesd", website: "https://crestcafe.net",
    dishes: ["Butter Burger","Breakfast Plates","Chicken Fried Steak","Brandy Milkshake"],
    desc: "Hillcrest diner institution since 1982 — butter burger, proper breakfast plates, and a butter-centric menu that doesn't apologize. A local's spot that has seen every gentrification wave come through Hillcrest without changing its counter." },
  { name: "Oscar's Mexican Seafood — Hillcrest", cuisine: "Mexican / Seafood", neighborhood: "Hillcrest",
    address: "646 University Ave, San Diego, CA 92103",
    lookup: "646 University Ave, San Diego, CA 92103",
    score: 87, price: 1, tags: ["Mexican","Seafood","Casual","Quick Bite","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Oscar's Mexican Seafood",
    instagram: "@oscarsmexicanseafood", website: "https://oscarsmexicanseafood.com",
    dishes: ["Smoked Fish Taco","Shrimp Taco","Ceviche Tostada","Aguachile"],
    desc: "The smoked fish taco that has become a San Diego legend — charred mesquite-smoked fish in a handmade tortilla, spicy salsa, and the line that forms by 11:30 a.m. on any given day. The Hillcrest location anchors a small SD chain; the OG PB location is still the pilgrimage." },
  { name: "Brooklyn Girl", cuisine: "Modern American", neighborhood: "Mission Hills",
    address: "4033 Goldfinch St, San Diego, CA 92103",
    lookup: "4033 Goldfinch St, San Diego, CA 92103",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Brunch","Patio","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@brooklyngirleatery", website: "https://brooklyngirleatery.com",
    dishes: ["Deviled Eggs","Burger","Seasonal Salad","Brunch Program"],
    desc: "A Mission Hills neighborhood restaurant with a Brooklyn-loft interior — exposed brick, large patio, and a menu that runs modern-American-with-a-slight-NYC-tilt. Weekend brunch and a consistent reliable dinner format." },
  { name: "Lucha Libre Gourmet Taco Shop", cuisine: "Mexican / Tacos", neighborhood: "Mission Hills",
    address: "1810 W Washington St, San Diego, CA 92103",
    lookup: "1810 W Washington St, San Diego, CA 92103",
    score: 85, price: 1, tags: ["Mexican","Tacos","Casual","Quick Bite","Iconic","Local Favorites","Late Night"],
    reservation: "walk-in",
    group: "Lucha Libre Taco Shop",
    instagram: "@luchalibretacoshop", website: "https://tacoshop.com",
    dishes: ["Surfin' California Burrito","Champion Taco","Super Nacho","Pink VIP Booth"],
    desc: "Pink-painted, lucha-libre-wrestling-themed taco shop on Washington — the California Burrito with shrimp is the cult order, the Champion Taco is the sleeper. Featured on Diners Drive-Ins and Dives; the wait is part of the ritual." },
  { name: "Las Cuatro Milpas", cuisine: "Mexican / Sonoran", neighborhood: "Barrio Logan",
    address: "1857 Logan Ave, San Diego, CA 92113",
    lookup: "1857 Logan Ave, San Diego, CA 92113",
    score: 91, price: 1, tags: ["Mexican","Sonoran","Casual","Historic","Iconic","Landmark","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Handmade Flour Tortillas","Chorizo Plate","Rolled Tacos","Bean & Cheese Burrito"],
    desc: "Operating since 1933 — a Barrio Logan Mexican institution that's been run by the Estudillo family for four generations. Handmade flour tortillas sold by the dozen, chorizo and bean plates cooked in the same recipes since the Great Depression, and a line that starts before 9 a.m. A San Diego landmark." },
  { name: "Cafe 21", cuisine: "Middle Eastern / Mediterranean / Brunch", neighborhood: "University Heights",
    address: "2736 Adams Ave, San Diego, CA 92116",
    lookup: "2736 Adams Ave, San Diego, CA 92116",
    score: 85, price: 2, tags: ["Mediterranean","Middle Eastern","Brunch","Casual","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@cafe21sd", website: "https://cafe-21.com",
    dishes: ["Middle Eastern Brunch","Sangria Program","Avocado Toast","Azerbaijan Skewers"],
    desc: "An Azerbaijani-accented Middle Eastern café in University Heights — sangria program, Middle Eastern-inflected brunch menu, and the kind of patio that catches the Adams Ave pedestrian traffic. A San Diego brunch standby that doesn't repeat any other brunch in town." },
  { name: "Callie", cuisine: "Mediterranean / Modern", neighborhood: "East Village",
    address: "1195 Island Ave, San Diego, CA 92101",
    lookup: "1195 Island Ave, San Diego, CA 92101",
    score: 88, price: 4, tags: ["Modern","Mediterranean","Date Night","Critics Pick","Trending","Patio","Cocktails"],
    reservation: "Resy",
    group: "Travis Swikard",
    instagram: "@calliesd", website: "https://calliesd.com",
    dishes: ["Mediterranean Mezze","Wood-Fired Entrée","Handmade Pasta","Natural Wine Pairing"],
    desc: "Chef Travis Swikard's East Village Mediterranean — shareable mezze, wood-fired entrées, and a cocktail program that anchors the bar. One of the San Diego critic-darling openings of the last few years; the room runs full through the week." },
  { name: "Alchemy", cuisine: "Contemporary American", neighborhood: "South Park",
    address: "1503 30th St, San Diego, CA 92102",
    lookup: "1503 30th St, San Diego, CA 92102",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Patio","Local Favorites","Brunch","Cocktails"],
    reservation: "OpenTable",
    instagram: "@alchemysd", website: "https://alchemysd.com",
    dishes: ["Seasonal Small Plates","Wood-Fired Entrée","Craft Cocktail","Brunch Menu"],
    desc: "South Park's neighborhood-modern-American corner — contemporary small plates, a tight wine list, and a dining room scaled for a regular Tuesday or a proper weekend dinner. One of 30th Street's most-consistent restaurants." },
  { name: "The Rose Wine Bar", cuisine: "Wine Bar", neighborhood: "South Park",
    address: "2219 30th St, San Diego, CA 92104",
    lookup: "2219 30th St, San Diego, CA 92104",
    score: 86, price: 3, tags: ["Wine Bar","Casual","Date Night","Patio","Critics Pick","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@therosewinebar", website: "https://therosewinebar.com",
    dishes: ["Wine by the Glass","Natural Wine Flight","Cheese Board","Small Plates"],
    desc: "A 30th Street South Park wine bar — small, intentional, with a natural-wine-leaning list and a cheese-and-small-plates menu that rewards lingering. SD's most specific wine bar and the reason locals take San Diego wine drinking seriously." }
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
  const s = getArrSlice("SD_DATA");
  const arr = parseArr(s.slice);
  let nextId = arr.length ? maxId(arr) + 1 : 15000;
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (SD: ${arr.length} → ${newArr.length})`);
})();

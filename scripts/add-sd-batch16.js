#!/usr/bin/env node
// San Diego batch 16 — Hillcrest + OB + Bird Rock + Bonita + La Jolla + East Village + Old Town + Solana Beach + Shelter Island (22)
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
  { name: "Hash House a Go Go — Hillcrest", cuisine: "American / Brunch", neighborhood: "Hillcrest",
    address: "3628 Fifth Ave, San Diego, CA 92103",
    lookup: "3628 5th Ave, San Diego, CA 92103",
    score: 84, price: 2, tags: ["American","Brunch","Breakfast","Family Friendly","Iconic","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Hash House a Go Go",
    instagram: "@hashhouseagogo", website: "https://hashhouseagogo.com",
    dishes: ["Farm-Sized Pancakes","Sage Fried Chicken Benedict","Big Ol' Meatloaf","Weekend Line"],
    desc: "Hillcrest's oversize-American flagship — Hash House a Go Go's Fifth Ave original with farm-sized pancakes, sage fried chicken Benedict, and a weekend line that became an SD brunch fixture. The Hillcrest brunch reference." },
  { name: "Baja Betty's", cuisine: "Mexican", neighborhood: "Hillcrest",
    address: "1421 University Ave, San Diego, CA 92103",
    lookup: "1421 University Ave, San Diego, CA 92103",
    score: 82, price: 2, tags: ["Mexican","Margaritas","LGBTQ+","Patio","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@bajabettysd", website: "https://bajabettyssd.com",
    dishes: ["100+ Tequilas","Combination Plates","Margarita Program","Hillcrest Patio"],
    desc: "Hillcrest's LGBTQ+-welcoming Mexican anchor — a 100+ tequila list, a University Ave patio, and a crowd that has made Baja Betty's the Hillcrest neighborhood Mexican-cantina default for over two decades." },
  { name: "Sunshine Co. Saloon", cuisine: "American / Bar", neighborhood: "Ocean Beach",
    address: "5028 Newport Ave, San Diego, CA 92107",
    lookup: "5028 Newport Ave, San Diego, CA 92107",
    score: 82, price: 1, tags: ["American","Bar","Late Night","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@sunshinecosaloon", website: "",
    dishes: ["Dive Bar Format","Cheap Drinks","OB Locals' Patio","Since 1976"],
    desc: "Ocean Beach's Newport Ave dive-bar anchor since 1976 — an unreconstructed OB patio, cheap drinks, and a regulars' crowd that has been the same for four decades. The OB locals' default." },
  { name: "Pizza Port — Ocean Beach", cuisine: "Pizza / Brewery", neighborhood: "Ocean Beach",
    address: "1956 Bacon St, San Diego, CA 92107",
    lookup: "1956 Bacon St, San Diego, CA 92107",
    score: 83, price: 2, tags: ["Pizza","Brewery","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Pizza Port",
    instagram: "@pizzaport", website: "https://pizzaport.com",
    dishes: ["Pepperoni Pizza","Seasonal IPAs","Wings","OB Crowd"],
    desc: "The Pizza Port family's Ocean Beach outpost — same award-winning craft-beer-and-pizza format as the Solana Beach original, tuned for OB's boardwalk crowd. One of OB's defining casual rooms." },
  { name: "Bahia Don Bravo", cuisine: "Mexican", neighborhood: "Bird Rock",
    address: "5504 La Jolla Blvd, La Jolla, CA 92037",
    lookup: "5504 La Jolla Blvd, La Jolla, CA 92037",
    score: 84, price: 1, tags: ["Mexican","Casual","Quick Bite","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@bahiadonbravo", website: "https://bahiadonbravo.com",
    dishes: ["California Burrito","Fish Taco","Carne Asada","Bird Rock Neighborhood Counter"],
    desc: "Bird Rock's order-counter Mexican — a California burrito and fish taco program, and a La Jolla Blvd locals' crowd that treats Don Bravo as the Bird Rock everyday default. A Bird Rock anchor." },
  { name: "Romesco Baja Med Bistro", cuisine: "Mexican / Baja Med", neighborhood: "Bonita",
    address: "4346 Bonita Rd, Bonita, CA 91902",
    lookup: "4346 Bonita Rd, Bonita, CA 91902",
    score: 89, price: 3, tags: ["Fine Dining","Mexican","Baja","Date Night","Critics Pick","Iconic","Hidden Gem"],
    reservation: "OpenTable",
    suburb: true,
    group: "Javier Plascencia",
    instagram: "@romescobajamed", website: "https://romescorestaurant.com",
    dishes: ["Baja Med Tasting","Valle de Guadalupe Wines","Chef's Table","Plascencia Family Program"],
    desc: "Chef Javier Plascencia's South Bay Baja-Med flagship — the Tijuana-defining chef's SD outpost, a Valle de Guadalupe-forward menu, and one of the rooms that defined Baja Med cuisine for the region. A regional-chef landmark." },
  { name: "Roppongi Restaurant & Sushi Bar", cuisine: "Pan-Asian / Sushi", neighborhood: "La Jolla",
    address: "875 Prospect St, La Jolla, CA 92037",
    lookup: "875 Prospect St, La Jolla, CA 92037",
    score: 86, price: 4, tags: ["Pan-Asian","Japanese","Sushi","Date Night","Cocktails","Patio","Iconic","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@roppongila", website: "https://roppongiusa.com",
    dishes: ["Pan-Asian Small Plates","Polynesian Crab Stack","Sushi Program","Prospect St Patio"],
    desc: "La Jolla Village's pan-Asian tapas-and-sushi institution since 1998 — a Polynesian crab stack that became the SD signature small plate, a Prospect St patio, and the kind of room that defined upscale-Asian-fusion dining in La Jolla." },
  { name: "Cafe 222", cuisine: "American / Breakfast", neighborhood: "East Village",
    address: "222 Island Ave, San Diego, CA 92101",
    lookup: "222 Island Ave, San Diego, CA 92101",
    score: 84, price: 2, tags: ["American","Breakfast","Brunch","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@cafe222sd", website: "https://cafe222.com",
    dishes: ["Peanut Butter French Toast","Pumpkin Waffle","Eggy Buddy Breakfast","Island Ave Counter"],
    desc: "East Village's compact breakfast-only room since 1992 — peanut butter French toast, pumpkin waffles, and a tight Island Ave counter that is one of downtown SD's longest-running breakfast institutions. An East Village morning default." },
  { name: "Broken Yolk Cafe — Pacific Beach", cuisine: "American / Breakfast", neighborhood: "Pacific Beach",
    address: "1851 Garnet Ave, San Diego, CA 92109",
    lookup: "1851 Garnet Ave, San Diego, CA 92109",
    score: 83, price: 2, tags: ["American","Breakfast","Brunch","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Broken Yolk Cafe",
    instagram: "@brokenyolkcafe", website: "https://thebrokenyolkcafe.com",
    dishes: ["The Iron Man Omelette","Breakfast Burritos","12-Egg Omelette Challenge","Garnet Ave Original"],
    desc: "The Broken Yolk's Pacific Beach original — open since 1979, a Garnet Ave breakfast institution, and the SD all-day breakfast brand that grew from this one PB room into a multi-location operation." },
  { name: "Puerto La Boca", cuisine: "Argentinian / Steakhouse", neighborhood: "Little Italy",
    address: "2060 India St, San Diego, CA 92101",
    lookup: "2060 India St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Argentinian","Steakhouse","Date Night","Patio","Iconic","Local Favorites","Celebrations"],
    reservation: "OpenTable",
    instagram: "@puertolaboca", website: "https://puertolaboca.com",
    dishes: ["Argentinian Steaks","Chimichurri","Empanadas","Mendoza Wine List"],
    desc: "Little Italy's Argentinian steakhouse — imported Argentinian cuts with a house chimichurri, an empanada program, and a Mendoza-focused wine list. An India Street South American anchor that gives Little Italy a non-Italian dinner option with the same format discipline." },
  { name: "Rockin' Baja Lobster — Old Town", cuisine: "Mexican / Seafood", neighborhood: "Old Town",
    address: "3890 Twiggs St, San Diego, CA 92110",
    lookup: "3890 Twiggs St, San Diego, CA 92110",
    score: 82, price: 2, tags: ["Mexican","Seafood","Family Friendly","Patio","Iconic","Local Favorites","Margaritas"],
    reservation: "OpenTable",
    group: "Rockin' Baja Lobster",
    instagram: "@rockinbajalobster", website: "https://rockinbaja.com",
    dishes: ["Bucket of Lobster","Margaritas","Old Town Patio","All-You-Can-Eat Beans & Rice"],
    desc: "Old Town's bucket-of-lobster Mexican — the signature 'Rockin' Baja Bucket' with grilled lobster and shrimp, margaritas, and an Old Town patio crowd. One of Old Town's defining family-sized seafood moves." },
  { name: "Waterfront Bar & Grill", cuisine: "American / Bar", neighborhood: "Little Italy",
    address: "2044 Kettner Blvd, San Diego, CA 92101",
    lookup: "2044 Kettner Blvd, San Diego, CA 92101",
    score: 83, price: 1, tags: ["American","Bar","Casual","Late Night","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@waterfrontbarandgrill", website: "https://waterfrontbarandgrill.com",
    dishes: ["Cheeseburger","Bloody Marys","Since 1933","SD's Oldest Bar"],
    desc: "San Diego's oldest bar — the Waterfront opened in 1933 as the first SD bar to receive a post-Prohibition liquor license. Kettner Blvd, a burger-and-Bloody Mary crowd, and the kind of neighborhood-history room that Little Italy regulars have protected across every wave of redevelopment." },
  { name: "JSix Restaurant", cuisine: "Modern American / Californian", neighborhood: "East Village",
    address: "616 J St, San Diego, CA 92101",
    lookup: "616 J St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["American","Californian","Modern","Date Night","Cocktails","Patio","Critics Pick"],
    reservation: "OpenTable",
    group: "Hotel Solamar",
    instagram: "@jsixrestaurant", website: "https://jsixrestaurant.com",
    dishes: ["Farm-Driven Tasting","Raw Bar","Craft Cocktails","Hotel Solamar Rooftop Pool-Adjacent"],
    desc: "Hotel Solamar's East Village flagship — a farm-driven modern-American menu, a raw bar, and a cocktail program that made JSix a defining East Village hotel-dining room since opening. A chef-driven hotel kitchen that punches above its format." },
  { name: "Parakeet Cafe — Solana Beach", cuisine: "Australian / Brunch / Cafe", neighborhood: "Solana Beach",
    address: "140 S Cedros Ave, Solana Beach, CA 92075",
    lookup: "140 S Cedros Ave, Solana Beach, CA 92075",
    score: 85, price: 2, tags: ["Australian","Cafe","Brunch","Breakfast","Healthy","Patio","Trending","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    group: "Parakeet Cafe",
    instagram: "@parakeetcafe", website: "https://parakeetcafe.com",
    dishes: ["Açaí Bowls","Avocado Toast","Single-Origin Coffee","Pink-and-Green Cedros Patio"],
    desc: "Solana Beach's Australian-style brunch café — pink-and-green Cedros Design District patio, açaí bowls and flat whites, and a brand that grew from this Cedros Ave flagship into a multi-city operation. A defining North County brunch-destination." },
  { name: "Blue Ribbon Pizzeria", cuisine: "Italian / Pizza", neighborhood: "Encinitas",
    address: "897 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "897 S Coast Hwy 101, Encinitas, CA 92024",
    score: 85, price: 2, tags: ["Italian","Pizza","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@blueribbonpizza", website: "https://blueribbonpizzeria.com",
    dishes: ["Wood-Fired Neapolitan","House-Made Pasta","Calabrian Pie","Encinitas 101 Patio"],
    desc: "Encinitas's wood-fired pizzeria on the 101 — chef-driven Neapolitan-style dough, a calabrian-chile signature pie, and a sidewalk patio that's a defining 101-corridor weekend room in Encinitas." },
  { name: "Spices Thai Cafe", cuisine: "Thai", neighborhood: "Hillcrest",
    address: "3900 Fifth Ave, San Diego, CA 92103",
    lookup: "3900 5th Ave, San Diego, CA 92103",
    score: 83, price: 2, tags: ["Thai","Casual","Patio","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "", website: "https://spicesthaicafe.com",
    dishes: ["Pad See Ew","Crispy Fish","Green Curry","Hillcrest Patio"],
    desc: "Hillcrest's Fifth Ave Thai standard — pad see ew, crispy fish, green curry, and a sidewalk patio that feeds the Hillcrest everyday lunch-and-dinner crowd. A neighborhood Thai default." },
  { name: "Luigi's At the Beach", cuisine: "Italian / Pizza", neighborhood: "Mission Beach",
    address: "3210 Mission Blvd, San Diego, CA 92109",
    lookup: "3210 Mission Blvd, San Diego, CA 92109",
    score: 83, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Late Night","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@luigisatthebeach", website: "https://luigisatthebeach.com",
    dishes: ["Late-Night Slices","NY-Style Pizza","Calzones","Mission Blvd Counter"],
    desc: "Mission Beach's NY-style pizza counter on Mission Blvd — late-night slices, the kind of after-bar option MB needs, and a longtime MB pizza default. A Mission Blvd everyday." },
  { name: "Tobey's 19th Hole Cafe", cuisine: "American / Diner", neighborhood: "Balboa Park",
    address: "2600 Golf Course Dr, San Diego, CA 92102",
    lookup: "2600 Golf Course Dr, San Diego, CA 92102",
    score: 82, price: 1, tags: ["American","Diner","Breakfast","Casual","Hidden Gem","Local Favorites","Iconic","Scenic Views"],
    reservation: "walk-in",
    instagram: "@tobeys19thhole", website: "",
    dishes: ["Breakfast Burrito","Golf-Course Patio","Navy/Locals Crowd","Affordable Diner Prices"],
    desc: "Balboa Park Golf Course's clubhouse diner — a golf-course-patio breakfast hidden in plain sight, a Navy-and-locals crowd, and the kind of affordable breakfast burrito that has been the SD worst-kept secret for decades." },
  { name: "Fathom Bistro, Bait & Tackle", cuisine: "American / Seafood / Bar", neighborhood: "Shelter Island",
    address: "1776 Shelter Island Dr, San Diego, CA 92106",
    lookup: "1776 Shelter Island Dr, San Diego, CA 92106",
    score: 84, price: 2, tags: ["American","Seafood","Bar","Patio","Scenic Views","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@fathombistro", website: "https://fathombistro.com",
    dishes: ["Craft Beer Program","Bait Shop Attached","Shelter Island Patio","Sunset Bay Views"],
    desc: "Shelter Island's pier-end bait-shop-and-bistro — a working-pier format with a craft-beer bar, a fishing tackle shop attached, and a patio that runs right to the Shelter Island bay. A Shelter Island sunset constant." },
  { name: "Harney Sushi — Old Town", cuisine: "Japanese / Sushi", neighborhood: "Old Town",
    address: "3964 Harney St, San Diego, CA 92110",
    lookup: "3964 Harney St, San Diego, CA 92110",
    score: 84, price: 3, tags: ["Japanese","Sushi","Date Night","Cocktails","Late Night","Trending","Local Favorites"],
    reservation: "OpenTable",
    group: "Harney Sushi",
    instagram: "@harneysushi", website: "https://harneysushi.com",
    dishes: ["Sustainably-Sourced Sushi","DJ-Night Program","Hot Rolls","Old Town Patio"],
    desc: "Old Town's DJ-forward sushi room — a sustainability-first sourcing program, late-night DJ nights, and a dining room that gave Old Town a specifically-modern sushi option in a neighborhood otherwise defined by its margarita patios." },
  { name: "Pappalecco", cuisine: "Italian / Cafe / Gelato", neighborhood: "Little Italy",
    address: "1602 State St, San Diego, CA 92101",
    lookup: "1602 State St, San Diego, CA 92101",
    score: 86, price: 2, tags: ["Italian","Cafe","Gelato","Breakfast","Casual","Patio","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Pappalecco",
    instagram: "@pappalecco", website: "https://pappalecco.com",
    dishes: ["Panini","Italian Pastry Case","Handmade Gelato","Tuscan Cafe Format"],
    desc: "Little Italy's Tuscan café — handmade gelato, a panini-and-pastry counter, and a State St format that reads directly from an Italian town square. A Little Italy daily-stop default." },
  { name: "The Tipsy Crow", cuisine: "American / Bar", neighborhood: "Gaslamp",
    address: "770 Fifth Ave, San Diego, CA 92101",
    lookup: "770 5th Ave, San Diego, CA 92101",
    score: 82, price: 2, tags: ["American","Bar","Late Night","Cocktails","Dance Floor","Iconic","Trending"],
    reservation: "walk-in",
    instagram: "@thetipsycrow", website: "https://thetipsycrow.com",
    dishes: ["Main Bar","The Nest Dance Floor","The Underground Speakeasy","Three-Level Format"],
    desc: "Gaslamp's three-level bar-and-dance-floor — main bar at street level, The Nest dance floor upstairs, and The Underground speakeasy below. The most-visited Gaslamp nightlife format since opening, tuned for SD's downtown weekend crowd." }
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

function inSDBox(c, name) {
  const gaslampTight = /Gaslamp|East Village|Little Italy/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

// Manual fallbacks for the Chula-Vista-5th-Ave and Escondido-4th-Ave false positives
const manualFallback = {
  "Hash House a Go Go — Hillcrest": { lat: 32.7474, lng: -117.1612 },  // 3628 5th Ave Hillcrest
  "Spices Thai Cafe":                { lat: 32.7481, lng: -117.1612 },  // 3900 5th Ave Hillcrest
  "La Puerta":                       { lat: 32.7105, lng: -117.1593 },
  "The Tipsy Crow":                  { lat: 32.7129, lng: -117.1596 }   // 770 5th Ave Gaslamp
};

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
      if (manualFallback[e.name]) { c = manualFallback[e.name]; console.log(`  ↪ manual fallback`); }
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

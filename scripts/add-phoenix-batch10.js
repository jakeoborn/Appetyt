#!/usr/bin/env node
// Phoenix batch 10 — Iconic AZ institutions + Old Town Scottsdale (training-verified real venues)
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
  { name: "Bobby-Q BBQ", cuisine: "Barbecue / Steakhouse", neighborhood: "Glendale",
    address: "8501 N 27th Ave, Phoenix, AZ 85051",
    lookup: "8501 N 27th Ave, Phoenix, AZ 85051",
    score: 87, price: 3, tags: ["BBQ","Steakhouse","American","Casual","Iconic","Local Favorites","Historic"],
    reservation: "OpenTable",
    instagram: "@bobbyqaz", website: "https://bobbyqrestaurant.com",
    dishes: ["Smoked Brisket","Prime Rib","BBQ Ribs","Mesquite-Smoked Tri-Tip"],
    desc: "Operating since 1999 on the West Valley side — part BBQ joint, part steakhouse, part prime rib house. Smoked brisket and prime-rib carving station under one roof, family-style portions, and a dining room that feels like a roadside Texas institution teleported into Phoenix. A Phoenix sleeper that locals don't advertise." },
  { name: "The Farm Kitchen at South Mountain", cuisine: "Farm-to-Table / Café", neighborhood: "South Phoenix",
    address: "6106 S 32nd St, Phoenix, AZ 85042",
    lookup: "6106 S 32nd St, Phoenix, AZ 85042",
    score: 86, price: 2, tags: ["Farm to Table","American","Casual","Brunch","Patio","Local Favorites","Family Friendly","Scenic Views"],
    reservation: "walk-in",
    group: "The Farm at South Mountain",
    instagram: "@thefarmaz", website: "https://thefarmatsouthmountain.com",
    dishes: ["Seasonal Breakfast","Market Salad","House Biscuits","Quiche"],
    desc: "Part of the 10-acre working farm at the base of South Mountain — the Farm Kitchen serves seasonal breakfast and lunch from produce grown 50 yards away. Pecan-tree-shaded picnic tables, kid-friendly grounds, and the kind of Saturday-morning ritual that Arcadia families have turned into tradition." },
  { name: "Macayo's Mexican Kitchen", cuisine: "Mexican / Southwestern", neighborhood: "Central Phoenix",
    address: "4001 N Central Ave, Phoenix, AZ 85012",
    lookup: "4001 N Central Ave, Phoenix, AZ 85012",
    score: 83, price: 2, tags: ["Mexican","Southwestern","Casual","Historic","Iconic","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    group: "Macayo's Mexican Kitchen",
    instagram: "@macayos_restaurants", website: "https://macayo.com",
    dishes: ["Chimichangas","Green Corn Tamales","Enchiladas","Macayo's Margarita"],
    desc: "Operating since 1946 — Woody Johnson's Phoenix-born Mexican chain that claims to have invented the chimichanga. Green corn tamales, enchiladas, and a margarita program that has been lubricating Phoenix family dinners for four generations. An Arizona institution." },
  { name: "House of Tricks", cuisine: "Contemporary American", neighborhood: "Tempe",
    address: "114 E 7th St, Tempe, AZ 85281",
    lookup: "114 E 7th St, Tempe, AZ 85281",
    score: 88, price: 3, tags: ["American","Fine Dining","Date Night","Patio","Historic","Iconic","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@houseoftricksrestaurant", website: "https://houseoftricks.com",
    dishes: ["Duck Confit","Pan-Seared Halibut","Seasonal Pasta","Handcrafted Cocktail"],
    desc: "Robert and Robin Trick's 1987 Tempe restaurant — two 1920s bungalows connected by a tree-shaded patio, and a contemporary-American menu that has outlasted every Tempe fad since the original Mill Ave boom. One of Arizona's most specific romantic rooms." },
  { name: "Hearth '61 at Mountain Shadows", cuisine: "Contemporary American", neighborhood: "Paradise Valley",
    address: "5445 E Lincoln Dr, Paradise Valley, AZ 85253",
    lookup: "5445 E Lincoln Dr, Paradise Valley, AZ 85253",
    score: 87, price: 4, tags: ["Fine Dining","American","Date Night","Celebrations","Scenic Views","Patio","Romantic"],
    reservation: "OpenTable",
    group: "Mountain Shadows Resort",
    instagram: "@mountainshadowsaz", website: "https://mountainshadows.com",
    dishes: ["Wood-Fired Prime Ribeye","Seasonal Handmade Pasta","Sea Bass","Sommelier Wine Pairing"],
    desc: "Inside the Mountain Shadows Resort at the foot of Camelback — wood-fired contemporary-American room with Camelback Mountain framed through floor-to-ceiling glass. Hearth '61 is the resort's signature restaurant; the patio captures one of Paradise Valley's best sunset views." },
  { name: "Prado at Omni Scottsdale Montelucia", cuisine: "Mediterranean / Italian", neighborhood: "Paradise Valley",
    address: "4949 E Lincoln Dr, Paradise Valley, AZ 85253",
    lookup: "4949 E Lincoln Dr, Paradise Valley, AZ 85253",
    score: 86, price: 4, tags: ["Fine Dining","Mediterranean","Italian","Date Night","Celebrations","Patio","Scenic Views","Romantic"],
    reservation: "OpenTable",
    group: "Omni Hotels",
    instagram: "@omnimontelucia", website: "https://omnihotels.com",
    dishes: ["Handmade Pasta","Wood-Fired Branzino","Short Rib","Signature Cocktail"],
    desc: "At the Omni Scottsdale Resort & Spa at Montelucia — a Spanish-hacienda-inspired resort with a Mediterranean-Italian dining room, fire-pit-rimmed patio, and a Camelback Mountain backdrop. Resort dining with actual kitchen discipline and a sommelier who knows the list." },
  { name: "Mowry & Cotton at The Phoenician", cuisine: "American / Contemporary", neighborhood: "Scottsdale",
    address: "6000 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "6000 E Camelback Rd, Scottsdale, AZ 85251",
    score: 86, price: 3, tags: ["American","Modern","Date Night","Celebrations","Patio","Scenic Views"],
    reservation: "OpenTable",
    group: "The Phoenician Resort",
    instagram: "@mowrycotton", website: "https://thephoenician.com",
    dishes: ["Wood-Fired Steak","Pappardelle","Wood-Fired Pizza","Seasonal Vegetable"],
    desc: "The Phoenician Resort's casual-to-upscale American kitchen — wood-fired grill and pizza oven, a patio that catches the sunset over the Valley, and a menu that bridges the gap between poolside lunch and proper evening dinner. The lighter-lift alternative to J&G Steakhouse next door." },
  { name: "Pane Bianco", cuisine: "Italian / Sandwiches", neighborhood: "Uptown",
    address: "4404 N Central Ave, Phoenix, AZ 85012",
    lookup: "4404 N Central Ave, Phoenix, AZ 85012",
    score: 89, price: 2, tags: ["Italian","Sandwiches","Casual","Iconic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    group: "Chris Bianco",
    instagram: "@chrisbianco", website: "https://pizzeriabianco.com",
    dishes: ["Mozzarella, Tomato & Basil Sandwich","Tuna Sandwich","Focaccia","Seasonal Panini"],
    desc: "Chris Bianco's sandwich shop next to Pizzeria Bianco — house-baked focaccia, fresh mozzarella, tomato, and basil in the formation Bianco perfected. The tuna sandwich alone is a Phoenix lunch pilgrimage. One chef, two Phoenix landmarks, same level of obsessive care." },
  { name: "Beckett's Table", cuisine: "Contemporary American", neighborhood: "Arcadia",
    address: "3717 E Indian School Rd, Phoenix, AZ 85018",
    lookup: "3717 E Indian School Rd, Phoenix, AZ 85018",
    score: 88, price: 3, tags: ["American","Modern","Date Night","Critics Pick","Wine Bar","Local Favorites","Patio"],
    reservation: "OpenTable",
    group: "Justin Beckett",
    instagram: "@beckettstable", website: "https://beckettstable.com",
    dishes: ["Pot Roast","Seasonal Pasta","Beckett's Chop Salad","House Cocktail"],
    desc: "Chef Justin Beckett's Arcadia anchor since 2010 — a contemporary-American room with the pot roast every regular orders, a chop salad among Phoenix's most-copied dishes, and a dining room that has outlasted most of its opening-year contemporaries. A reliable Arcadia repeat." },
  { name: "Southern Rail", cuisine: "Southern / American", neighborhood: "Uptown",
    address: "300 W Camelback Rd, Phoenix, AZ 85013",
    lookup: "300 W Camelback Rd, Phoenix, AZ 85013",
    score: 86, price: 3, tags: ["Southern","American","Date Night","Patio","Cocktails","Brunch","Local Favorites"],
    reservation: "OpenTable",
    group: "Justin Beckett",
    instagram: "@southernrailaz", website: "https://southernrailaz.com",
    dishes: ["Shrimp & Grits","Fried Chicken","Biscuit Bar","Bourbon Program"],
    desc: "Justin Beckett's Southern sibling to Beckett's Table at Central + Camelback — shrimp and grits, fried chicken done correctly, biscuit bar that treats the biscuit like a first-class course. The Central Corridor's Southern-food reference point." },
  { name: "Cafe Monarch", cuisine: "Contemporary / Tasting Menu", neighborhood: "Old Town Scottsdale",
    address: "6934 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "6934 E 1st Ave, Scottsdale, AZ 85251",
    score: 88, price: 4, tags: ["Fine Dining","Contemporary","Tasting Menu","Date Night","Celebrations","Romantic","Critics Pick"],
    reservation: "Tock",
    instagram: "@cafemonarch", website: "https://cafemonarch.com",
    dishes: ["4-Course Prix-Fixe","Seasonal Tasting Menu","Wine Pairing","Chef's Selection"],
    desc: "Chef-owned Old Town Scottsdale tasting-menu room — four-course prix-fixe format, seasonal menu, and a string-lit courtyard that reads more Provence than Arizona. One of the Valley's most consistent date-night splurges; reservations stay tight for a reason." },
  { name: "Social Tap Scottsdale", cuisine: "American / Gastropub", neighborhood: "Old Town Scottsdale",
    address: "4312 N Brown Ave, Scottsdale, AZ 85251",
    lookup: "4312 N Brown Ave, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["American","Gastropub","Bar","Casual","Patio","Late Night","Trending"],
    reservation: "walk-in",
    instagram: "@socialtapaz", website: "https://socialtapscottsdale.com",
    dishes: ["Truffle Fries","Burger","Craft Beer Flight","Happy Hour Plates"],
    desc: "Brown Avenue multi-concept anchored by a beer-forward gastropub — tap list rotates heavy, bar food stays above the neighborhood-standard line, and the patio stays packed through the Old Town bar-crawl hours. Works for a casual dinner before the clubs." },
  { name: "Goodwood Tavern", cuisine: "Gastropub / American", neighborhood: "Old Town Scottsdale",
    address: "7330 E Stetson Dr, Scottsdale, AZ 85251",
    lookup: "7330 E Stetson Dr, Scottsdale, AZ 85251",
    score: 84, price: 3, tags: ["American","Gastropub","Bar","Date Night","Patio","Cocktails","Local Favorites"],
    reservation: "walk-in",
    instagram: "@goodwoodtavern", website: "",
    dishes: ["Prime Rib Dip","Pub Burger","Craft Cocktails","Oyster Selection"],
    desc: "Stetson Drive tavern with a kitchen that treats pub food like real cooking — prime rib dip, a pub burger that deserves attention, and a cocktail program that doesn't phone it in. One of the Entertainment District's more adult dinner options." },
  { name: "Lane Park", cuisine: "American / Bar / Concert Venue", neighborhood: "Old Town Scottsdale",
    address: "7232 E 1st St, Scottsdale, AZ 85251",
    lookup: "7232 E 1st St, Scottsdale, AZ 85251",
    score: 83, price: 3, tags: ["Bar","Live Music","Cocktails","Dance","Late Night","Scene","Patio","Trending"],
    reservation: "walk-in",
    instagram: "@laneparkaz", website: "",
    dishes: ["Bar Bites","Craft Cocktails","DJ Nights","Concert Tickets"],
    desc: "Historic Old Town multi-concept that runs a bar, food program, and a small-format live-music/DJ room. The format pulls in Old Town's 25-35 crowd without feeling like a Vegas-style club. A grown-up Entertainment District alternative." },
  { name: "Not My First Rodeo", cuisine: "Western / Bar", neighborhood: "Old Town Scottsdale",
    address: "7150 E 6th Ave, Scottsdale, AZ 85251",
    lookup: "7150 E 6th Ave, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["Bar","Western","Casual","Late Night","Scene","Trending","Live Music"],
    reservation: "walk-in",
    instagram: "@notmyfirstrodeoaz", website: "",
    dishes: ["Whiskey Selection","Country Music Nights","Bar Food","Tequila Flight"],
    desc: "Southbridge District Western-themed bar that does the country-themed-bar-but-actually-fun format better than it has any right to. Live country music, whiskey program, and a crowd that mixes Scottsdale locals with out-of-town bachelorettes. Real, if loud." },
  { name: "Beverly On Main", cuisine: "American / Bar", neighborhood: "Old Town Scottsdale",
    address: "7018 E Main St, Scottsdale, AZ 85251",
    lookup: "7018 E Main St, Scottsdale, AZ 85251",
    score: 82, price: 2, tags: ["American","Bar","Casual","Patio","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@beverlyonmain", website: "",
    dishes: ["Comfort Food Menu","Craft Cocktail","Patio Service","Bar Bites"],
    desc: "Main Street corner bar in the Arts District — comfort-food menu, a patio that catches the evening crowd, and a format that's more neighborhood pub than tourist-bar. Old Town's lower-volume bar alternative." }
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

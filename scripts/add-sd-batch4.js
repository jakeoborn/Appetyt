#!/usr/bin/env node
// San Diego batch 4 — Convoy Asian + more Little Italy + Old Town + Ocean Beach (18 training-verified)
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
  { name: "RakiRaki Ramen & Tsukemen", cuisine: "Japanese / Ramen", neighborhood: "Kearny Mesa",
    address: "4646 Convoy St, San Diego, CA 92111",
    lookup: "4646 Convoy St, San Diego, CA 92111",
    score: 88, price: 2, tags: ["Japanese","Ramen","Casual","Late Night","Critics Pick","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@rakirakisd", website: "https://rakirakisd.com",
    dishes: ["Tonkotsu Ramen","Dry Tsukemen","Mazesoba","Pork Buns"],
    desc: "Convoy District's ramen reference — Tonkotsu broth simmered long, the dry tsukemen that made them the SD ramen argument, and a Kearny Mesa dining room that fills every night. One of the Convoy Asian corridor's most-respected rooms." },
  { name: "Okan", cuisine: "Japanese / Izakaya", neighborhood: "Kearny Mesa",
    address: "3860 Convoy St Ste 110, San Diego, CA 92111",
    lookup: "3860 Convoy St, San Diego, CA 92111",
    score: 89, price: 3, tags: ["Japanese","Izakaya","Date Night","Critics Pick","Michelin","Trending"],
    awards: "Michelin Recommended",
    reservation: "Tock",
    instagram: "@okansd", website: "https://okansd.com",
    dishes: ["Yakitori","Chicken Katsu","Seasonal Small Plates","Sake Flight"],
    desc: "Chef Yukito Ota's Convoy St izakaya — Michelin-recommended, with a yakitori program that treats each skewer with reverence. Small menu, quiet dining room, and a sake list curated with intent. One of San Diego's most-respected Japanese tables." },
  { name: "Tajima Ramen Kearny Mesa", cuisine: "Japanese / Ramen", neighborhood: "Kearny Mesa",
    address: "4681 Convoy St, San Diego, CA 92111",
    lookup: "4681 Convoy St, San Diego, CA 92111",
    score: 86, price: 2, tags: ["Japanese","Ramen","Casual","Quick Bite","Local Favorites","Late Night"],
    reservation: "walk-in",
    group: "Tajima Ramen",
    instagram: "@tajimaramensd", website: "https://tajimaramen.com",
    dishes: ["Tonkotsu Ramen","Tajima Black Ramen","Gyoza","Pork Bao"],
    desc: "The Convoy St Tajima — the San Diego-born ramen chain's Kearny Mesa flagship. Tajima Black (black garlic oil) is the signature; the tonkotsu is the classic call. Multi-location SD brand with the Convoy room as the anchor." },
  { name: "Tsuruhashi Japanese BBQ", cuisine: "Japanese / Yakiniku", neighborhood: "Kearny Mesa",
    address: "3904 Convoy St, San Diego, CA 92111",
    lookup: "3904 Convoy St, San Diego, CA 92111",
    score: 86, price: 3, tags: ["Japanese","Yakiniku","Date Night","Celebrations","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@tsuruhashisd", website: "https://tsuruhashisd.com",
    dishes: ["Premium Wagyu","Tableside Yakiniku Grill","Banchan-Style Sides","Sake Pairing"],
    desc: "San Diego's Japanese yakiniku reference — tableside charcoal grill, premium wagyu, and an omakase-adjacent tasting format at the counter. The Convoy District's answer to K-town BBQ, with proper Japanese technique." },
  { name: "Jasmine Seafood Restaurant", cuisine: "Chinese / Cantonese / Dim Sum", neighborhood: "Kearny Mesa",
    address: "4380 Kearny Mesa Rd, San Diego, CA 92111",
    lookup: "4380 Kearny Mesa Rd, San Diego, CA 92111",
    score: 87, price: 2, tags: ["Chinese","Cantonese","Dim Sum","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://jasmineseafoodsd.com",
    dishes: ["Dim Sum Carts","Peking Duck","Salt & Pepper Shrimp","Live Seafood"],
    desc: "Kearny Mesa Cantonese banquet-style restaurant — dim sum carts on weekends, live seafood tanks, and the kind of family-sized Cantonese dinner format SD's Chinese community has anchored for years. The SD dim sum go-to." },
  { name: "Sushi Tadokoro", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Old Town",
    address: "2244 San Diego Ave, San Diego, CA 92110",
    lookup: "2244 San Diego Ave, San Diego, CA 92110",
    score: 90, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Critics Pick","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@sushitadokoro", website: "https://sushitadokoro.com",
    dishes: ["Edomae Omakase","Seasonal Sashimi","Aged Fish","Quail Egg Shooter"],
    desc: "Chef Shun Tadokoro's Old Town sushi counter — a low-key tile-floor room that happens to serve one of San Diego's most serious omakase. No website hype; regulars protect the reservation. Tadokoro has been running this program for 20+ years." },
  { name: "Kettner Exchange", cuisine: "Contemporary American", neighborhood: "Little Italy",
    address: "2001 Kettner Blvd, San Diego, CA 92101",
    lookup: "2001 Kettner Blvd, San Diego, CA 92101",
    score: 87, price: 3, tags: ["American","Modern","Date Night","Patio","Critics Pick","Cocktails","Rooftop"],
    reservation: "OpenTable",
    group: "Brian Redzikowski",
    instagram: "@kettnerexchange", website: "https://kettnerexchange.com",
    dishes: ["Crispy Duck Salad","Wagyu Tartare","Smoked Beef Short Rib","Rooftop Patio Cocktails"],
    desc: "Chef Brian Redzikowski's Little Italy modern-American — two-story dining room with a rooftop patio, pan-Asian-inflected menu, and a wagyu tartare that became a SD Instagram staple. One of Little Italy's most-booked rooms." },
  { name: "Davanti Enoteca", cuisine: "Italian", neighborhood: "Little Italy",
    address: "1655 India St, San Diego, CA 92101",
    lookup: "1655 India St, San Diego, CA 92101",
    score: 87, price: 3, tags: ["Italian","Date Night","Patio","Cocktails","Local Favorites","Family Friendly"],
    reservation: "OpenTable",
    group: "Scott Harris",
    instagram: "@davantienoteca", website: "https://davantienoteca.com",
    dishes: ["Focaccia with Honeycomb & Stracciatella","Handmade Pasta","Wood-Fired Pizza","Italian Wine List"],
    desc: "Scott Harris's Italian enoteca in Little Italy — the focaccia with honeycomb and fresh stracciatella is the signature opener, handmade pastas anchor the menu, and an Italian wine list that runs deep-regional. Multiple locations across the US; the Little Italy SD room fits in the neighborhood." },
  { name: "The Crack Shack", cuisine: "American / Fried Chicken", neighborhood: "Little Italy",
    address: "2266 Kettner Blvd, San Diego, CA 92101",
    lookup: "2266 Kettner Blvd, San Diego, CA 92101",
    score: 86, price: 2, tags: ["American","Casual","Patio","Family Friendly","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Richard Blais / Juniper & Ivy",
    instagram: "@thecrackshack", website: "https://crackshack.com",
    dishes: ["Fried Chicken Sandwich","Schmaltz Chicken","Deviled Eggs","Beer Program"],
    desc: "Richard Blais's fried-chicken-and-egg concept next door to Juniper & Ivy — open-air dining room with a bocce court, a beer program, and fried chicken that spun off into a multi-city chain. The casual sister to the fine-dining flagship." },
  { name: "Animae", cuisine: "Asian-American / Modern", neighborhood: "Downtown San Diego",
    address: "969 Pacific Hwy, San Diego, CA 92101",
    lookup: "969 Pacific Hwy, San Diego, CA 92101",
    score: 89, price: 4, tags: ["Fine Dining","Asian","Modern","Date Night","Celebrations","Scenic Views","Cocktails"],
    reservation: "OpenTable",
    group: "Brian Malarkey",
    instagram: "@animae_sd", website: "https://animaesd.com",
    dishes: ["Pan-Asian Tasting","Ocean-View Dining","Dim Sum Service","Signature Cocktails"],
    desc: "Chef Brian Malarkey's Asian-American modern concept on the SD waterfront — harbor views, a dining room built around a pan-Asian menu that pulls from Japan, China, Thailand, and Korea. The big-room downtown Malarkey flagship." },
  { name: "Noble Experiment", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "East Village",
    address: "777 G St, San Diego, CA 92101",
    lookup: "777 G St, San Diego, CA 92101",
    score: 89, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Critics Pick","Iconic","Hidden Gem"],
    reservation: "Resy",
    group: "Consortium Holdings",
    instagram: "@nobleexperimentsd", website: "https://nobleexperimentsd.com",
    dishes: ["Classic Prohibition Cocktails","Rare Spirit Flights","Skull-Wall Decor","Secret-Entry Format"],
    desc: "Entered through Neighborhood restaurant's keg-cooler door — Consortium Holdings' East Village speakeasy has a wall of skulls, a tight cocktail list, and a reservation process that requires a text message. One of America's most specific speakeasy formats." },
  { name: "Hodad's — Ocean Beach", cuisine: "American / Burgers", neighborhood: "Ocean Beach",
    address: "5010 Newport Ave, San Diego, CA 92107",
    lookup: "5010 Newport Ave, San Diego, CA 92107",
    score: 87, price: 2, tags: ["American","Burgers","Casual","Historic","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    group: "Hodad's",
    instagram: "@hodadies", website: "https://hodadies.com",
    dishes: ["Double Bacon Cheeseburger","Onion Rings","Chili Fries","Shake"],
    desc: "Since 1969 on Newport Ave — the Hodad's bacon cheeseburger that Guy Fieri made national-TV-famous. A VW-bus-painted interior, a line out the door at noon, and the OB burger that San Diego regulars return to every visit. A Pacific-Coast icon." },
  { name: "Phil's BBQ", cuisine: "BBQ / American", neighborhood: "Point Loma",
    address: "3750 Sports Arena Blvd, San Diego, CA 92110",
    lookup: "3750 Sports Arena Blvd, San Diego, CA 92110",
    score: 87, price: 2, tags: ["BBQ","American","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Phil's BBQ",
    instagram: "@philsbbq", website: "https://philsbbq.com",
    dishes: ["Baby Back Ribs","Mr. Pig Sandwich","Beef Brisket","Apple Cole Slaw"],
    desc: "San Diego's BBQ benchmark since 1998 — baby back ribs that built a loyal following, the Mr. Pig sandwich that shows up on best-of lists, and the kind of line that tells you the recipe hasn't changed. Multiple SD locations; Sports Arena is the flagship." },
  { name: "JRDN at Tower23", cuisine: "Contemporary American / Seafood", neighborhood: "Pacific Beach",
    address: "723 Felspar St, San Diego, CA 92109",
    lookup: "723 Felspar St, San Diego, CA 92109",
    score: 86, price: 4, tags: ["Fine Dining","Seafood","American","Date Night","Scenic Views","Patio","Romantic"],
    reservation: "OpenTable",
    group: "Tower23 Hotel",
    instagram: "@jrdnsandiego", website: "https://jrdn.com",
    dishes: ["Seasonal Seafood","Wagyu Steak","Brunch Menu","Ocean Views"],
    desc: "At the Tower23 boutique hotel — Pacific Beach's ocean-view fine-dining spot, with the boardwalk traffic below and the sunset straight through the window. The PB special-occasion restaurant; book the patio." },
  { name: "The Fishery", cuisine: "Seafood", neighborhood: "Pacific Beach",
    address: "5040 Cass St, San Diego, CA 92109",
    lookup: "5040 Cass St, San Diego, CA 92109",
    score: 87, price: 3, tags: ["Seafood","American","Date Night","Local Favorites","Patio","Historic","Iconic"],
    reservation: "OpenTable",
    instagram: "@thefisheryofpb", website: "https://thefishery.com",
    dishes: ["Fresh Catch","Fish Market","Seafood Risotto","Crab Cakes"],
    desc: "Part fish market, part restaurant — a Pacific Beach institution since 1979. Walk in for a whole fish to take home; sit down for a dinner from the same case. Fresh catch of the day format, and the kind of unpretentious seafood room PB regulars guard." },
  { name: "World Famous", cuisine: "Seafood / American / Breakfast", neighborhood: "Pacific Beach",
    address: "711 Pacific Beach Dr, San Diego, CA 92109",
    lookup: "711 Pacific Beach Dr, San Diego, CA 92109",
    score: 84, price: 3, tags: ["Seafood","American","Breakfast","Brunch","Patio","Scenic Views","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@worldfamousoceanfront", website: "https://worldfamoussandiego.com",
    dishes: ["Lobster Eggs Benedict","Fish Tacos","Breakfast Burrito","Ocean-View Patio"],
    desc: "PB's boardwalk-facing breakfast-and-seafood landmark — lobster eggs benedict, fish tacos, and a patio that puts the Pacific on the table. Iconic tourist spot that still holds up for the locals on a Saturday morning." },
  { name: "Wormwood", cuisine: "Modern American / Eclectic", neighborhood: "Little Italy",
    address: "2161 India St, San Diego, CA 92101",
    lookup: "2161 India St, San Diego, CA 92101",
    score: 88, price: 4, tags: ["Fine Dining","Modern","American","Date Night","Critics Pick","Cocktails","Trending"],
    reservation: "Resy",
    instagram: "@wormwoodsd", website: "https://wormwoodsd.com",
    dishes: ["Seasonal Tasting","Whimsical Plating","Eclectic Small Plates","Cocktail Pairing"],
    desc: "A small Little Italy modern-American room with a tasting-menu-optional format — chef-driven, whimsical plating, and a menu that changes enough that regulars return for what's next. One of SD's more specific fine-dining openings." },
  { name: "Cowboy Star Butcher Shop — adjacent", cuisine: "SKIP", neighborhood: "", address: "", lookup: "" }
].filter(e => e.cuisine !== "SKIP");

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

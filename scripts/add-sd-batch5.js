#!/usr/bin/env node
// San Diego batch 5 — North County (Carlsbad/Encinitas/Oceanside/Solana Beach/Del Mar) + Coronado + Mission Beach (18 training-verified)
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
  { name: "Campfire", cuisine: "Modern American / Wood Fire", neighborhood: "Carlsbad",
    address: "2725 State St, Carlsbad, CA 92008",
    lookup: "2725 State St, Carlsbad, CA 92008",
    score: 90, price: 3, tags: ["Modern","American","Wood Fire","Date Night","Critics Pick","Michelin","Patio"],
    awards: "Michelin Recommended",
    reservation: "OpenTable",
    instagram: "@campfirecarlsbad", website: "https://thisiscampfire.com",
    dishes: ["Wood-Fired Vegetables","Smoked Short Rib","Cast-Iron Baked Bread","S'mores"],
    desc: "Chef Andrew Bachelier's Carlsbad Village modernist — an open hearth at the center of the room, a menu built around wood fire, and a S'mores format at the end that became the Instagram signature. Michelin-recommended and the reason the Village is on SD fine-dining maps." },
  { name: "Herb & Sea", cuisine: "Coastal American / Seafood", neighborhood: "Encinitas",
    address: "131 W D St, Encinitas, CA 92024",
    lookup: "131 W D St, Encinitas, CA 92024",
    score: 87, price: 3, tags: ["American","Seafood","Date Night","Critics Pick","Cocktails","Patio","Trending"],
    reservation: "OpenTable",
    group: "Brian Malarkey",
    instagram: "@herbandsea", website: "https://herbandsea.com",
    dishes: ["Crispy Half Chicken","Whole Branzino","Wagyu Meatballs","Cocktail Program"],
    desc: "Brian Malarkey's Encinitas coastal-American — the follow-up to Herb & Wood, sized for the 101 corridor. Cocktail bar up front, dining room behind, and a menu that earned a Top Chef-sized following on its own merits. One of North County's most-booked rooms." },
  { name: "The Plot", cuisine: "Plant-Based / Vegan", neighborhood: "Oceanside",
    address: "1733 S Coast Hwy, Oceanside, CA 92054",
    lookup: "1733 S Coast Hwy, Oceanside, CA 92054",
    score: 86, price: 2, tags: ["Vegan","Plant-Based","Healthy","Brunch","Patio","Critics Pick","Trending"],
    reservation: "OpenTable",
    group: "Davin Waite / Jessica Waite",
    instagram: "@theplotrestaurant", website: "https://theplotrestaurant.com",
    dishes: ["Plant-Based Burger","Jackfruit Tacos","Whole Roasted Cauliflower","Zero-Waste Program"],
    desc: "Jessica and Davin Waite's Oceanside plant-based flagship — a zero-waste operating model, a kitchen that treats vegetables with the same rigor Davin brings to sushi next door, and a menu even committed omnivores talk about. North County's most specific vegan room." },
  { name: "Wrench + Rodent Seabasstropub", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Oceanside",
    address: "1815 S Coast Hwy, Oceanside, CA 92054",
    lookup: "1815 S Coast Hwy, Oceanside, CA 92054",
    score: 89, price: 4, tags: ["Japanese","Sushi","Omakase","Date Night","Critics Pick","Hidden Gem","Iconic"],
    reservation: "Tock",
    group: "Davin Waite",
    instagram: "@wrenchandrodent", website: "https://wrenchandrodent.com",
    dishes: ["Davin Waite Omakase","Local Fish Program","Zero-Waste Sushi","Seasonal Nigiri"],
    desc: "Chef Davin Waite's Oceanside sushi counter — sustainability-first, local-fish-forward, and the kind of omakase that built its reputation before anyone thought to Instagram it. A defining North County sushi room." },
  { name: "Pamplemousse Grille", cuisine: "French / Contemporary", neighborhood: "Solana Beach",
    address: "514 Via de la Valle, Solana Beach, CA 92075",
    lookup: "514 Via de la Valle, Solana Beach, CA 92075",
    score: 89, price: 4, tags: ["Fine Dining","French","Contemporary","Date Night","Celebrations","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Jeffrey Strauss",
    instagram: "@pamplemoussegrille", website: "https://pgrille.com",
    dishes: ["Veal Medallions","Rack of Lamb","Dover Sole","Tableside Caesar"],
    desc: "Chef Jeffrey Strauss's Solana Beach fine-dining institution — across from the Del Mar Racetrack, serving rack of lamb and tableside Caesar to a crowd that has been loyal since the '90s. One of North County's most-seasoned special-occasion rooms." },
  { name: "Claire's on Cedros", cuisine: "American / Breakfast / Brunch", neighborhood: "Solana Beach",
    address: "246 N Cedros Ave, Solana Beach, CA 92075",
    lookup: "246 N Cedros Ave, Solana Beach, CA 92075",
    score: 85, price: 2, tags: ["American","Breakfast","Brunch","Patio","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@clairesoncedros", website: "https://clairesoncedros.com",
    dishes: ["Buttermilk Pancakes","Huevos Rancheros","Avocado Toast","Crab Cake Benedict"],
    desc: "Solana Beach's Cedros Design District breakfast anchor — a sun-washed patio, a from-scratch kitchen, and the kind of weekend line that tells you everything. One of North County's defining brunch rooms." },
  { name: "Fidel's Little Mexico", cuisine: "Mexican", neighborhood: "Solana Beach",
    address: "607 Valley Ave, Solana Beach, CA 92075",
    lookup: "607 Valley Ave, Solana Beach, CA 92075",
    score: 83, price: 2, tags: ["Mexican","Casual","Margaritas","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@fidelslittlemexico", website: "https://fidelslittlemexico.com",
    dishes: ["Combination Plates","Margaritas","Chile Relleno","Carne Asada"],
    desc: "A Solana Beach Mexican institution running since 1960 — combo plates, strong margaritas, and a patio crowd that has been coming for three generations. Unpretentious, consistent, and the North County Mexican shorthand." },
  { name: "Pizza Port Solana Beach", cuisine: "Pizza / Brewery", neighborhood: "Solana Beach",
    address: "135 N Hwy 101, Solana Beach, CA 92075",
    lookup: "135 N Hwy 101, Solana Beach, CA 92075",
    score: 84, price: 2, tags: ["Pizza","Brewery","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Pizza Port",
    instagram: "@pizzaport", website: "https://pizzaport.com",
    dishes: ["Pepperoni Pizza","Seasonal IPAs","Wings","Salad"],
    desc: "The original Pizza Port — a Solana Beach brewpub that helped define San Diego craft beer in the '80s. Wood-booth seating, surfer crowd, award-winning house beers, and pizza as the foundation. A North County anchor that spawned a regional chain." },
  { name: "Jake's Del Mar", cuisine: "American / Seafood", neighborhood: "Del Mar",
    address: "1660 Coast Blvd, Del Mar, CA 92014",
    lookup: "1660 Coast Blvd, Del Mar, CA 92014",
    score: 85, price: 3, tags: ["American","Seafood","Scenic Views","Date Night","Patio","Iconic","Celebrations"],
    reservation: "OpenTable",
    instagram: "@jakesdelmar", website: "https://jakesdelmar.com",
    dishes: ["Mac Nut Mahi","Pacific Salmon","Hula Pie","Ocean-View Seating"],
    desc: "Del Mar's beachfront American — sand-level windows, mac-nut-crusted mahi, and a Hula Pie dessert that has anchored anniversaries and post-racetrack dinners for decades. One of North County's defining ocean-view rooms." },
  { name: "Poseidon on the Beach", cuisine: "American / Seafood", neighborhood: "Del Mar",
    address: "1670 Coast Blvd, Del Mar, CA 92014",
    lookup: "1670 Coast Blvd, Del Mar, CA 92014",
    score: 84, price: 3, tags: ["American","Seafood","Scenic Views","Patio","Date Night","Iconic"],
    reservation: "OpenTable",
    instagram: "@poseidondelmar", website: "https://poseidonrestaurant.com",
    dishes: ["Seafood Pasta","Grilled Fish","Sunset Patio Service","Cocktails"],
    desc: "Del Mar's other beachfront fixture — next door to Jake's, with the same ocean at the same table height. Runs as Del Mar's casual ocean-view seafood room; sunset drink service is the move." },
  { name: "Pacifica Del Mar", cuisine: "American / Seafood", neighborhood: "Del Mar",
    address: "1555 Camino Del Mar Ste 321, Del Mar, CA 92014",
    lookup: "1555 Camino Del Mar, Del Mar, CA 92014",
    score: 86, price: 4, tags: ["Fine Dining","American","Seafood","Scenic Views","Date Night","Patio","Celebrations","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@pacificadelmar", website: "https://pacificadelmar.com",
    dishes: ["Mustard Catfish","Alaskan Halibut","Sugar Spice Salmon","Sunset Patio"],
    desc: "Del Mar Plaza's top-floor seafood room — ocean horizon from every seat, a sugar-spice salmon that's been a signature since the '90s, and the kind of patio that makes Del Mar feel like a resort. A North County fine-dining anchor." },
  { name: "1500 Ocean", cuisine: "Modern American / Coastal", neighborhood: "Coronado",
    address: "1500 Orange Ave, Coronado, CA 92118",
    lookup: "1500 Orange Ave, Coronado, CA 92118",
    score: 89, price: 4, tags: ["Fine Dining","Modern","American","Coastal","Date Night","Celebrations","Critics Pick","Scenic Views"],
    reservation: "OpenTable",
    group: "Hotel del Coronado",
    instagram: "@hoteldel", website: "https://hoteldel.com/dining/1500-ocean",
    dishes: ["Coastal Tasting Menu","Local Seafood","Private Cabana Dining","Ocean-View Service"],
    desc: "Hotel del Coronado's flagship fine-dining room — oceanfront, resort-polished service, and a coastal menu that leans on local growers and the Pacific at the door. The defining Coronado special-occasion table." },
  { name: "Coronado Brewing Company", cuisine: "American / Brewery", neighborhood: "Coronado",
    address: "170 Orange Ave, Coronado, CA 92118",
    lookup: "170 Orange Ave, Coronado, CA 92118",
    score: 82, price: 2, tags: ["American","Brewery","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Coronado Brewing",
    instagram: "@coronadobrewing", website: "https://coronadobrewing.com",
    dishes: ["Orange Avenue Wit","Mermaid's Red","Brewpub Burger","Fish Tacos"],
    desc: "The Coronado brewpub flagship — Orange Avenue Wit and Mermaid's Red pouring since the '90s, pub-food-plus kitchen, and a patio on Coronado's main drag. The beer-first move in a town not otherwise known for its brewing." },
  { name: "Leroy's Kitchen + Lounge", cuisine: "Modern American", neighborhood: "Coronado",
    address: "1015 Orange Ave, Coronado, CA 92118",
    lookup: "1015 Orange Ave, Coronado, CA 92118",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Cocktails","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@leroyscoronado", website: "https://leroyskitchenandlounge.com",
    dishes: ["Farm-to-Table Menu","Craft Cocktails","Small Plates","Seasonal Program"],
    desc: "Coronado's farm-to-table room on Orange Avenue — seasonal small plates, a serious cocktail bar, and the kind of neighborhood reservation that Coronado regulars keep weekly. The island's most-cited modern-American table." },
  { name: "MooTime Creamery", cuisine: "Ice Cream / Dessert", neighborhood: "Coronado",
    address: "1025 Orange Ave, Coronado, CA 92118",
    lookup: "1025 Orange Ave, Coronado, CA 92118",
    score: 82, price: 1, tags: ["Dessert","Ice Cream","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@mootimecreamery", website: "https://mootime.com",
    dishes: ["Handmade Ice Cream","Waffle Cones","Sundaes","Dipped Cones"],
    desc: "Coronado's Orange Avenue ice cream counter — made in-house, served in waffle cones, and the kids'-program end of every Coronado dinner for decades. An island institution." },
  { name: "Clayton's Coffee Shop", cuisine: "American / Diner / Breakfast", neighborhood: "Coronado",
    address: "979 Orange Ave, Coronado, CA 92118",
    lookup: "979 Orange Ave, Coronado, CA 92118",
    score: 83, price: 1, tags: ["American","Diner","Breakfast","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@claytonscoffeeshop", website: "",
    dishes: ["Diner Breakfast","Chicken Fried Steak","Tableside Jukebox","Bottomless Coffee"],
    desc: "Coronado's mid-century diner — counter seating, tableside jukeboxes, diner-priced breakfast, and a crowd of locals and Navy families that makes the room feel frozen in time. The Coronado counter-service institution." },
  { name: "The Mission Mission Beach", cuisine: "American / Breakfast / Brunch", neighborhood: "Mission Beach",
    address: "3795 Mission Blvd, San Diego, CA 92109",
    lookup: "3795 Mission Blvd, San Diego, CA 92109",
    score: 84, price: 2, tags: ["American","Breakfast","Brunch","Casual","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "The Mission",
    instagram: "@themissionsd", website: "https://themission3.com",
    dishes: ["Chilaquiles","Papas Locas","Rosemary Bread French Toast","All-Day Breakfast"],
    desc: "The Mission's original location — a Mission Beach breakfast landmark that built the multi-location brand. Chilaquiles, papas locas, and the weekend line that tells you when to arrive. A defining SD brunch room." },
  { name: "Cannonball", cuisine: "Japanese / Sushi / Bar", neighborhood: "Mission Beach",
    address: "3105 Ocean Front Walk, San Diego, CA 92109",
    lookup: "3105 Ocean Front Walk, San Diego, CA 92109",
    score: 84, price: 3, tags: ["Japanese","Sushi","Rooftop","Scenic Views","Cocktails","Date Night","Patio"],
    reservation: "OpenTable",
    group: "Clique Hospitality",
    instagram: "@cannonballsd", website: "https://cannonball.sandiego.com",
    dishes: ["Sushi Rolls","Sake Cocktails","Rooftop Patio","Ocean-View Dining"],
    desc: "Clique Hospitality's Mission Beach rooftop — three stories above the boardwalk, sushi-forward menu, and a sunset cocktail scene that defines summer in MB. One of SD's most-photographed ocean-view patios." }
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
    let c = await nominatim(e.lookup);
    if (!c) {
      // Retry with simplified address
      const simple = e.lookup.replace(/Ste \S+,?\s*/i, "");
      if (simple !== e.lookup) {
        await sleep(1100);
        c = await nominatim(simple);
      }
    }
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

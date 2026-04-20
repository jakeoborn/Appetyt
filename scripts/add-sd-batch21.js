#!/usr/bin/env node
// San Diego batch 21 — East Village + Little Italy Hall + University Heights sweets + Convoy markets + breweries + small plates (20)
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
  { name: "Tajima Ramen — Downtown", cuisine: "Japanese / Ramen", neighborhood: "East Village",
    address: "901 E St, San Diego, CA 92101",
    lookup: "901 E St, San Diego, CA 92101",
    score: 85, price: 2, tags: ["Japanese","Ramen","Casual","Late Night","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Tajima Ramen",
    instagram: "@tajimaramensd", website: "https://tajimaramen.com",
    dishes: ["Tajima Black Ramen","Tonkotsu","Gyoza","Late-Night Downtown Crowd"],
    desc: "Tajima's Downtown location — the SD-born ramen chain's East Village room, with the Tajima Black (black-garlic oil) as the house signature, and a late-night crowd that pulls the Gaslamp overflow for post-midnight bowls." },
  { name: "El Indio", cuisine: "Mexican", neighborhood: "Mission Hills / Middletown",
    address: "3695 India St, San Diego, CA 92103",
    lookup: "3695 India St, San Diego, CA 92103",
    score: 85, price: 1, tags: ["Mexican","Casual","Quick Bite","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@elindiosandiego", website: "https://el-indio.com",
    dishes: ["Taquito Originator","Handmade Tortillas","Freeway-Adjacent Counter","San Diego Since 1940"],
    desc: "San Diego's El Indio since 1940 — the Ralph Pesqueira family shop that claims to have invented the taquito (rolled, deep-fried tacos), handmade tortillas on the spot, and an India St counter that has been a Mission Hills freeway-adjacent constant for 85 years." },
  { name: "Spicy City", cuisine: "Chinese / Sichuan", neighborhood: "Mira Mesa",
    address: "6755 Mira Mesa Blvd #101, San Diego, CA 92121",
    lookup: "6755 Mira Mesa Blvd, San Diego, CA 92121",
    score: 86, price: 2, tags: ["Chinese","Sichuan","Casual","Critics Pick","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Numbing-Spicy Sichuan","Dry-Fried Chicken","Fish Hot Pot","Mira Mesa Strip Mall"],
    desc: "Mira Mesa's Sichuan-specialty dining room — numbing-and-hot preparations, a dry-fried chicken the regional community benchmarks against Chengdu, and a strip-mall format that quietly made Mira Mesa an SD Chinese-food argument separate from Convoy." },
  { name: "Little Italy Food Hall", cuisine: "Food Hall / Various", neighborhood: "Little Italy",
    address: "550 W Date St, San Diego, CA 92101",
    lookup: "550 W Date St, San Diego, CA 92101",
    score: 85, price: 2, tags: ["Food Hall","Casual","Patio","Family Friendly","Trending","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Ballast Point Hospitality",
    instagram: "@littleitalyfoodhall", website: "https://littleitalyfoodhall.com",
    dishes: ["Ambrogio15 Pizza","Mein St Kitchen","Wicked Maine Lobster","Central Little Italy Plaza"],
    desc: "Little Italy's central food hall in the Piazza della Famiglia — multiple operators under one roof (including a Little Italy Ambrogio15 counter), a heated open-air piazza format, and the kind of lunch-and-evening hall that became the Little Italy plaza's anchor." },
  { name: "Stella Jean's Ice Cream", cuisine: "Dessert / Ice Cream", neighborhood: "University Heights",
    address: "4404 Park Blvd, San Diego, CA 92116",
    lookup: "4404 Park Blvd, San Diego, CA 92116",
    score: 85, price: 1, tags: ["Dessert","Ice Cream","Casual","Family Friendly","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@stellajeansicecream", website: "https://stellajeans.com",
    dishes: ["House-Made Ice Cream","Rotating Seasonal Flavors","Brown Butter Caramel","University Heights Counter"],
    desc: "University Heights' small-batch ice cream counter — house-made flavors with a brown-butter-caramel signature, a rotating seasonal list, and a Park Blvd shop that locals line up at every warm afternoon." },
  { name: "Moniker General — Liberty Station", cuisine: "American / Cafe / Retail", neighborhood: "Point Loma / Liberty Station",
    address: "2820 Historic Decatur Rd Ste 120, San Diego, CA 92106",
    lookup: "2820 Historic Decatur Rd, San Diego, CA 92106",
    score: 84, price: 2, tags: ["American","Cafe","Casual","Patio","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@moniker_general", website: "https://monikergeneral.com",
    dishes: ["Specialty Coffee","Breakfast Program","Retail Goods","Liberty Station Courtyard"],
    desc: "Liberty Station's retail-and-café hybrid — a specialty coffee counter, all-day breakfast and sandwich menu, and a design shop in the same format. One of Liberty Station's defining day-into-evening anchors." },
  { name: "Jimmy Love's", cuisine: "American / Bar / Live Music", neighborhood: "Gaslamp",
    address: "672 Fifth Ave, San Diego, CA 92101",
    lookup: "672 5th Ave, San Diego, CA 92101",
    score: 82, price: 2, tags: ["American","Bar","Live Music","Late Night","Dance Floor","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@jimmyloves_sd", website: "https://jimmyloves.com",
    dishes: ["Live Band Program","Dance Floor","Sunday Jazz Brunch","Gaslamp Main Drag"],
    desc: "Gaslamp's Jimmy Love's — a live-band-every-night format on 5th Ave, a Sunday jazz brunch, and the kind of Gaslamp nightlife-plus-kitchen dining room that has been running on live music since opening. A main-drag institution." },
  { name: "The Fish Market — Del Mar", cuisine: "Seafood", neighborhood: "Solana Beach",
    address: "640 Via de la Valle, Solana Beach, CA 92075",
    lookup: "640 Via de la Valle, Solana Beach, CA 92075",
    score: 84, price: 3, tags: ["Seafood","Date Night","Family Friendly","Patio","Iconic","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    group: "The Fish Market",
    instagram: "@thefishmarketsd", website: "https://thefishmarket.com",
    dishes: ["Fresh Fish Case","Mesquite-Grilled Catch","Sushi Bar","North County Sister Location"],
    desc: "The Fish Market's Del Mar/Solana Beach sister location — same mesquite-grill, sushi bar, and oyster counter format as the Embarcadero original, tuned for the Del Mar Racetrack crowd's post-race dinner. A North County seafood default." },
  { name: "Sbicca Del Mar", cuisine: "Modern American / Californian", neighborhood: "Del Mar",
    address: "215 15th St, Del Mar, CA 92014",
    lookup: "215 15th St, Del Mar, CA 92014",
    score: 86, price: 4, tags: ["Fine Dining","American","Californian","Date Night","Celebrations","Patio","Critics Pick","Iconic","Scenic Views"],
    reservation: "OpenTable",
    suburb: true,
    group: "Sbicca",
    instagram: "@sbiccadelmar", website: "https://sbiccadelmar.com",
    dishes: ["Chef's Tasting","Ocean-View Rooftop Patio","Seasonal Program","15th Street Del Mar"],
    desc: "Chef Susan Sbicca's Del Mar modern-American since 2002 — a rooftop patio with Del Mar ocean glimpses, a seasonal chef-driven menu, and a Del Mar dining room that locals treat as the reservation-first special-occasion room on 15th Street." },
  { name: "Swell Cafe", cuisine: "Coffee / Cafe", neighborhood: "Bird Rock",
    address: "5676 La Jolla Blvd, San Diego, CA 92037",
    lookup: "5676 La Jolla Blvd, San Diego, CA 92037",
    score: 83, price: 1, tags: ["Coffee","Cafe","Casual","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@swellcafebirdrock", website: "https://swellcafe.com",
    dishes: ["Espresso Program","Açaí Bowls","Breakfast Sandwiches","Bird Rock Patio"],
    desc: "Bird Rock's corner cafe — a specialty espresso program, açaí bowls, and a La Jolla Blvd patio that has become the neighborhood's default morning meeting room. A Bird Rock constant." },
  { name: "Mitsuwa Marketplace", cuisine: "Japanese / Food Hall", neighborhood: "Kearny Mesa",
    address: "4240 Kearny Mesa Rd, San Diego, CA 92111",
    lookup: "4240 Kearny Mesa Rd, San Diego, CA 92111",
    score: 85, price: 2, tags: ["Japanese","Food Hall","Casual","Family Friendly","Critics Pick","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Mitsuwa",
    instagram: "", website: "https://mitsuwa.com",
    dishes: ["Santouka Ramen Counter","Japanese Grocery","Bakery Hokkaido","Food Court Stalls"],
    desc: "Kearny Mesa's Japanese marketplace — a Santouka ramen counter inside the food court, a proper Japanese grocery, Hokkaido Baker pastry, and the kind of under-one-roof Japanese-food-hall format SD otherwise lacks. A Convoy Japanese anchor." },
  { name: "Hillcrest Brewing Company", cuisine: "American / Brewery", neighborhood: "Hillcrest",
    address: "1458 University Ave, San Diego, CA 92103",
    lookup: "1458 University Ave, San Diego, CA 92103",
    score: 82, price: 2, tags: ["American","Brewery","LGBTQ+","Patio","Casual","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Hillcrest Brewing",
    instagram: "@hillcrestbrewingcompany", website: "https://hillcrestbrewingcompany.com",
    dishes: ["House-Brewed Beers","Pizza Program","Beer-Garden Patio","LGBTQ+-Welcoming Taproom"],
    desc: "Hillcrest's LGBTQ+-welcoming brewpub — house brews, a pizza-and-pub menu, and a University Ave patio. The Hillcrest brewery for the neighborhood's queer-community craft-beer crowd." },
  { name: "The Kebab Shop — East Village", cuisine: "Mediterranean / Turkish", neighborhood: "East Village",
    address: "630 Ninth Ave, San Diego, CA 92101",
    lookup: "630 9th Ave, San Diego, CA 92101",
    score: 84, price: 2, tags: ["Mediterranean","Turkish","Casual","Quick Bite","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "The Kebab Shop",
    instagram: "@thekebabshop", website: "https://thekebabshop.com",
    dishes: ["Turkish Döner Rotisserie","Beef & Lamb Kebab","Pita Wraps","Counter Service"],
    desc: "The Kebab Shop — SD-born multi-location Turkish kebab counter, an East Village original, with rotisserie beef-and-lamb döner, pita wraps, and a format that grew from SD into one of California's defining fast-casual kebab brands." },
  { name: "Sessions Market", cuisine: "American / Cafe / Market", neighborhood: "La Jolla Shores",
    address: "2252 Avenida De La Playa, La Jolla, CA 92037",
    lookup: "2252 Avenida De La Playa, La Jolla, CA 92037",
    score: 86, price: 2, tags: ["American","Cafe","Market","Casual","Patio","Trending","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@sessionsmarket", website: "https://sessionsmarket.com",
    dishes: ["Morning Coffee","Sandwich Counter","Grab-and-Go Program","La Jolla Shores Patio"],
    desc: "La Jolla Shores' market-plus-café — a chef-driven grab-and-go counter, morning coffee, and an Avenida De La Playa patio a block from the beach. A Shores surf-to-breakfast anchor." },
  { name: "Nate's Garden Grill", cuisine: "American / Californian / Farm-to-Table", neighborhood: "City Heights",
    address: "3120 Euclid Ave, San Diego, CA 92105",
    lookup: "3120 Euclid Ave, San Diego, CA 92105",
    score: 84, price: 2, tags: ["American","Californian","Farm-to-Table","Casual","Patio","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "@natesgardengrill", website: "https://natesgardengrill.com",
    dishes: ["Community-Garden-Sourced Menu","Smashburger","Garden Patio","City Heights Neighborhood Room"],
    desc: "City Heights' community-garden-adjacent restaurant — produce picked from the Nate Howard garden next door, a smashburger-plus-greens format, and a dining room that reads as a rare chef-driven room in a under-resourced SD neighborhood." },
  { name: "Kilowatt Brewing — Barrio Logan", cuisine: "American / Brewery", neighborhood: "Barrio Logan",
    address: "2260 Main St, San Diego, CA 92113",
    lookup: "2260 Main St, San Diego, CA 92113",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Kilowatt Brewing",
    instagram: "@kilowattbrewing", website: "https://kilowattbrewing.com",
    dishes: ["Kilowatt Kölsch","Taproom Pours","Barrio Logan Taproom","Rotating Hazy IPAs"],
    desc: "Kilowatt's Barrio Logan industrial taproom — a Kölsch-and-hazy program, a Main St production-and-tasting space, and the kind of Barrio Logan brewery dining room that makes the neighborhood's beer corridor work." },
  { name: "Bolt Brewery — La Mesa", cuisine: "American / Brewery", neighborhood: "La Mesa",
    address: "8179 Center St, La Mesa, CA 91942",
    lookup: "8179 Center St, La Mesa, CA 91942",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    suburb: true,
    group: "Bolt Brewery",
    instagram: "@boltbrewery", website: "https://boltbrewery.com",
    dishes: ["House Brews","Brewpub Kitchen","La Mesa Village Patio","Tasting Flights"],
    desc: "La Mesa Village's Bolt Brewery — a craft-beer-first brewpub with a full kitchen, a patio that sits in the La Mesa Village corridor, and one of East County's defining neighborhood-brewery dining rooms." },
  { name: "Tartine Coronado", cuisine: "French / Cafe / Bakery", neighborhood: "Coronado",
    address: "1106 First St, Coronado, CA 92118",
    lookup: "1106 First St, Coronado, CA 92118",
    score: 83, price: 2, tags: ["French","Cafe","Bakery","Breakfast","Brunch","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@tartinecoronado", website: "https://tartinecoronado.com",
    dishes: ["Quiche","Croissants","From-Scratch Bistro Menu","Coronado Ferry Landing-Adjacent"],
    desc: "Coronado's Tartine — quiche, croissants, and a from-scratch French-bistro menu in a Ferry Landing-adjacent dining room on 1st St. A defining Coronado morning-and-lunch French café." },
  { name: "Crab Hut", cuisine: "Cajun / Seafood", neighborhood: "Kearny Mesa",
    address: "4646 Convoy St, San Diego, CA 92111",
    lookup: "4646 Convoy St, San Diego, CA 92111",
    score: 84, price: 3, tags: ["Seafood","Cajun","Casual","Family Friendly","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Crab Hut",
    instagram: "@crabhutsd", website: "https://crab-hut.com",
    dishes: ["Cajun Crab Boil","Garlic Noodles","Bag-to-Table Format","Convoy District"],
    desc: "Convoy's Cajun crab-boil room — bags of crawfish-and-crab in garlic butter dumped on paper-lined tables, garlic noodles, and the kind of messy-hands dining room that became one of Convoy's most-photographed formats." },
  { name: "Bankers Hill Bar + Restaurant", cuisine: "Modern American", neighborhood: "Bankers Hill",
    address: "2202 Fourth Ave, San Diego, CA 92101",
    lookup: "2202 4th Ave, San Diego, CA 92101",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Patio","Cocktails","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@bankershillbar", website: "https://bankershillsd.com",
    dishes: ["Modern American Menu","Craft Cocktails","4th Ave Dining Room","Bankers Hill Neighborhood Room"],
    desc: "Bankers Hill's neighborhood modern-American — a 4th Ave dining room with an elevated bar program, a menu that reads as Bankers Hill's grown-up dinner option, and the kind of room that supports the 5th Ave fine-dining spine with a more casual counterpart." }
];

function nominatim(a, attempts = 3) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const result = await new Promise((res, rej) => {
          const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
          const req = https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" }, timeout: 10000 }, (r) => {
            let d = ""; r.on("data", c => d += c);
            r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({lat:parseFloat(j[0].lat),lng:parseFloat(j[0].lon)}); } catch(e) { rej(e); } });
          });
          req.on("error", rej);
          req.on("timeout", () => { req.destroy(); rej(new Error("timeout")); });
        });
        return resolve(result);
      } catch (e) {
        if (i === attempts - 1) { console.log(`  ⚠ ${e.message}`); return resolve(null); }
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    resolve(null);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, 1100));

function inSDBox(c, name) {
  const gaslampTight = /Gaslamp|East Village|Little Italy|^Downtown$/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

const manualFallback = {
  "Tajima Ramen — Downtown":       { lat: 32.7177, lng: -117.1545 },  // 901 E St East Village
  "Jimmy Love's":                  { lat: 32.7126, lng: -117.1593 },  // 672 5th Ave Gaslamp
  "The Kebab Shop — East Village": { lat: 32.7137, lng: -117.1547 },  // 630 9th Ave East Village
  "Bankers Hill Bar + Restaurant": { lat: 32.7317, lng: -117.1630 }   // 2202 4th Ave Bankers Hill
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

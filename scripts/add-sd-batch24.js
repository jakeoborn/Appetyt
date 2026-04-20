#!/usr/bin/env node
// San Diego batch 24 — South Bay + Ramona + Carlsbad + Carmel Valley + Convoy + North Park BBQ/pizza + La Jolla Shores + Leucadia + Mira Mesa (20)
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
  { name: "Rubio's Coastal Grill — Mission Bay", cuisine: "Mexican / Fast Casual", neighborhood: "Pacific Beach",
    address: "4504 E Mission Bay Dr, San Diego, CA 92109",
    lookup: "4504 E Mission Bay Dr, San Diego, CA 92109",
    score: 82, price: 1, tags: ["Mexican","Casual","Quick Bite","Iconic","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Rubio's Coastal Grill",
    instagram: "@rubioscoastalgrill", website: "https://rubios.com",
    dishes: ["The Original Fish Taco","Since 1983","Baja-Style Batter","Coastal Menu"],
    desc: "Rubio's Coastal Grill's Mission Bay original since 1983 — Ralph Rubio is credited with popularizing the Baja-style fish taco in the U.S. from this San Diego original, a format that grew from one MB stand into a Southwest-wide chain." },
  { name: "Third Avenue Alehouse", cuisine: "American / Gastropub", neighborhood: "Chula Vista",
    address: "269 3rd Ave, Chula Vista, CA 91910",
    lookup: "269 3rd Ave, Chula Vista, CA 91910",
    score: 82, price: 2, tags: ["American","Gastropub","Craft Beer","Patio","Local Favorites","Casual"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@thirdaveheo", website: "https://thirdavenuealehouse.com",
    dishes: ["50+ Craft Taps","Gastropub Menu","Chula Vista Third Ave","South Bay Beer-Nerd Room"],
    desc: "Chula Vista's Third Avenue Alehouse — 50+ craft taps in a South Bay dining room that reads as the region's most-serious beer-nerd-and-kitchen anchor, and one of the defining Chula Vista Third Ave downtown rooms." },
  { name: "Ramona Cafe", cuisine: "American / Diner / Breakfast", neighborhood: "Ramona",
    address: "628 Main St, Ramona, CA 92065",
    lookup: "628 Main St, Ramona, CA 92065",
    score: 83, price: 1, tags: ["American","Diner","Breakfast","Casual","Iconic","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@ramonacafe", website: "https://ramonacafe.com",
    dishes: ["Cinnamon Rolls","Country Breakfast","Old-Town Diner Menu","Ramona Since 1970s"],
    desc: "Ramona's Main Street diner since the 1970s — house-made cinnamon rolls the size of dinner plates, a country-breakfast menu, and a backcountry-SD regulars' counter that has been the Ramona morning anchor for five decades." },
  { name: "Bistro West", cuisine: "Modern American / Californian", neighborhood: "Carlsbad",
    address: "4960 Avenida Encinas, Carlsbad, CA 92008",
    lookup: "4960 Avenida Encinas, Carlsbad, CA 92008",
    score: 85, price: 3, tags: ["American","Californian","Date Night","Patio","Family Friendly","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    group: "West Restaurants",
    instagram: "@bistrowest", website: "https://bistrowest.com",
    dishes: ["Chef-Driven Menu","West Steak Sister","Patio Program","Carlsbad Avenida Encinas"],
    desc: "Carlsbad's Bistro West — the sister to West Steak & Seafood on Avenida Encinas, a chef-driven Californian dining room with a dedicated on-site farm supplying the kitchen. A North County farm-to-table anchor." },
  { name: "Craft House Gastropub", cuisine: "American / Gastropub", neighborhood: "Carmel Valley",
    address: "13940 Carmel Valley Rd, San Diego, CA 92130",
    lookup: "13940 Carmel Valley Rd, San Diego, CA 92130",
    score: 84, price: 3, tags: ["American","Gastropub","Craft Beer","Patio","Local Favorites","Date Night"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@crafthousegp", website: "https://crafthousegastropub.com",
    dishes: ["Craft-Beer-Paired Menu","Burger Program","Carmel Valley Patio","Neighborhood Anchor"],
    desc: "Carmel Valley's chef-driven gastropub — a craft-beer-first program paired with a sharply-edited menu, and a Carmel Valley dining room that gave the Del Mar Heights corridor a neighborhood-beer-kitchen anchor." },
  { name: "BCD Tofu House — Convoy", cuisine: "Korean / Tofu", neighborhood: "Kearny Mesa",
    address: "4638 Convoy St, San Diego, CA 92111",
    lookup: "4638 Convoy St, San Diego, CA 92111",
    score: 83, price: 2, tags: ["Korean","Casual","Family Friendly","Local Favorites","Late Night","Iconic"],
    reservation: "walk-in",
    group: "BCD Tofu House",
    instagram: "@bcdtofuhouse", website: "https://bcdtofu.com",
    dishes: ["Soondubu Jjigae (Tofu Stew)","Banchan","BCD Beef","LA-Import Brand"],
    desc: "BCD Tofu House — the LA Koreatown-founded brand's Convoy location, the soondubu jjigae (spicy soft-tofu stew) as the house signature, and one of the late-night Korean defaults in the Convoy corridor." },
  { name: "Las Olas Mexican Food", cuisine: "Mexican", neighborhood: "Cardiff-by-the-Sea",
    address: "2655 S Coast Hwy 101, Cardiff, CA 92007",
    lookup: "2655 S Coast Hwy 101, Cardiff, CA 92007",
    score: 85, price: 2, tags: ["Mexican","Casual","Patio","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    suburb: true,
    group: "Las Olas",
    instagram: "@lasolas1981", website: "https://lasolasmex.com",
    dishes: ["Fish Tacos","Carnitas","Surf-Break Patio","Cardiff Since 1981"],
    desc: "Cardiff-by-the-Sea's surf-culture Mexican since 1981 — fish tacos and carnitas across from the Cardiff Reef surf break, a 101-corridor patio, and a North County anchor that generations of surf crews have put on the post-session rotation." },
  { name: "Lefty's Chicago Pizzeria — North Park", cuisine: "Italian / Pizza", neighborhood: "North Park",
    address: "3448 30th St, San Diego, CA 92104",
    lookup: "3448 30th St, San Diego, CA 92104",
    score: 84, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Lefty's Chicago Pizzeria",
    instagram: "@leftyschicagopizza", website: "https://leftyspizza.com",
    dishes: ["Chicago Deep-Dish Pizza","Italian Beef Sandwich","Thin-Crust Tavern Style","30th Street North Park"],
    desc: "North Park's Lefty's — SD's reference Chicago-style deep-dish, an Italian beef sandwich that transplants call the closest to home, and a 30th Street dining room that anchored the Chicago-crowd pizza conversation in the neighborhood." },
  { name: "Grand Ole BBQ y Asado", cuisine: "American / BBQ", neighborhood: "North Park",
    address: "3302 El Cajon Blvd, San Diego, CA 92104",
    lookup: "3302 El Cajon Blvd, San Diego, CA 92104",
    score: 87, price: 2, tags: ["American","BBQ","Casual","Critics Pick","Iconic","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Grand Ole BBQ y Asado",
    instagram: "@grandolebbq", website: "https://grandolebbq.com",
    dishes: ["Texas Brisket","Asado Program","Smoked Pork Belly","Counter Service + Yard Patio"],
    desc: "Chef Andy Harris's Texas-meets-Argentine BBQ — brisket smoked overnight, an asado board program, and a dining yard that gave North Park its reference BBQ room. One of SD's defining BBQ operations with national-level recognition." },
  { name: "Louisiana Purchase", cuisine: "American / Creole / Cajun", neighborhood: "North Park",
    address: "2305 University Ave, San Diego, CA 92104",
    lookup: "2305 University Ave, San Diego, CA 92104",
    score: 86, price: 3, tags: ["American","Creole","Cajun","Date Night","Patio","Critics Pick","Trending","Local Favorites"],
    reservation: "OpenTable",
    group: "Quinnton Austin",
    instagram: "@louisianapurchasesd", website: "https://louisianapurchasesd.com",
    dishes: ["Gumbo","Po' Boys","Shrimp + Grits","North Park Creole Destination"],
    desc: "Chef Quinnton Austin's North Park Louisiana Creole — gumbo, po' boys, and shrimp-and-grits that reads as serious-Crescent-City cooking, and a University Ave dining room that became one of the SD buzzy-opening reference points." },
  { name: "Caroline's Seaside Cafe", cuisine: "American / Breakfast / Brunch", neighborhood: "La Jolla Shores",
    address: "2004 Avenida De La Playa, La Jolla, CA 92037",
    lookup: "2004 Avenida De La Playa, La Jolla, CA 92037",
    score: 85, price: 2, tags: ["American","Breakfast","Brunch","Scenic Views","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@carolinesseasidecafe", website: "https://carolinesseasidecafe.com",
    dishes: ["Cinnamon-Crunch French Toast","Ocean-View Patio","La Jolla Shores Morning","Since 2013"],
    desc: "La Jolla Shores' Caroline's — an Avenida De La Playa café with an ocean-view patio, cinnamon-crunch French toast as the morning call, and the kind of Shores breakfast line that runs out the door every weekend." },
  { name: "The Crab Catcher", cuisine: "American / Seafood", neighborhood: "La Jolla",
    address: "1298 Prospect St, La Jolla, CA 92037",
    lookup: "1298 Prospect St, La Jolla, CA 92037",
    score: 84, price: 4, tags: ["Fine Dining","American","Seafood","Date Night","Scenic Views","Iconic","Celebrations","Patio"],
    reservation: "OpenTable",
    instagram: "@thecrabcatcher", website: "https://crabcatcher.com",
    dishes: ["Fresh Catch Program","Cove-View Dining","Bouillabaisse","La Jolla Since 1987"],
    desc: "La Jolla Village's Crab Catcher since 1987 — a two-story Prospect St dining room with La Jolla Cove views, a bouillabaisse and fresh-catch program, and the kind of Cove-view restaurant that anchored La Jolla's special-occasion scene for decades." },
  { name: "Privateer Coal Fire Pizza", cuisine: "Italian / Pizza", neighborhood: "Oceanside",
    address: "504 N Coast Hwy, Oceanside, CA 92054",
    lookup: "504 N Coast Hwy, Oceanside, CA 92054",
    score: 84, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Patio","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@privateerpizza", website: "https://privateerpizza.com",
    dishes: ["Coal-Fired Pizza","New Haven Apizza Style","House-Made Burrata","Oceanside 101"],
    desc: "Oceanside's coal-fired pizzeria on the 101 — a coal-oven New Haven-apizza-style program, house-made burrata, and a dining room that gave Oceanside a specific-pizza-format anchor alongside the surfside breakfast crowd." },
  { name: "Eppig Brewing — North Park", cuisine: "American / Brewery", neighborhood: "North Park",
    address: "3052 El Cajon Blvd Ste 105, San Diego, CA 92104",
    lookup: "3052 El Cajon Blvd, San Diego, CA 92104",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Women-Led","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Eppig Brewing",
    instagram: "@eppigbrewing", website: "https://eppigbrewing.com",
    dishes: ["Continental-Style Lagers","Pilsner Program","El Cajon Blvd Taproom","Women-Led Program"],
    desc: "North Park's Eppig Brewing — a women-led Continental-style brewery with a pilsner-and-lager-first program that quietly became one of the most-specific SD brewing identities. An El Cajon Blvd taproom anchor." },
  { name: "Le Papagayo", cuisine: "Mediterranean / Latin Fusion", neighborhood: "Leucadia / Encinitas",
    address: "1002 N Coast Hwy 101, Encinitas, CA 92024",
    lookup: "1002 N Coast Hwy 101, Encinitas, CA 92024",
    score: 85, price: 3, tags: ["Mediterranean","Latin","Date Night","Patio","Local Favorites","Iconic","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@lepapagayo", website: "https://lepapagayo.com",
    dishes: ["Mediterranean-Latin Tapas","Paella","101-Corridor Patio","Leucadia Crowd"],
    desc: "Leucadia's Le Papagayo on the 101 — a Mediterranean-meets-Latin tapas format, a paella program, and a sidewalk patio that has been the Leucadia weekend dinner default for two decades. A defining Leucadia date-night room." },
  { name: "OB Warehouse Kitchen & Taps", cuisine: "American / Gastropub", neighborhood: "Ocean Beach",
    address: "4871 Newport Ave, San Diego, CA 92107",
    lookup: "4871 Newport Ave, San Diego, CA 92107",
    score: 82, price: 2, tags: ["American","Gastropub","Craft Beer","Patio","Casual","Local Favorites"],
    reservation: "walk-in",
    instagram: "@obwarehousesd", website: "https://obwarehouse.com",
    dishes: ["Rotating Craft Beer","Brewpub Menu","Newport Ave Corner","OB Locals' Room"],
    desc: "Ocean Beach's Newport Ave gastropub — a rotating-tap craft-beer program, a tight pub kitchen, and the kind of corner room that fits the OB locals' after-work rotation. An OB main-drag anchor." },
  { name: "The Original 40 Brewing Company", cuisine: "American / Brewery", neighborhood: "North Park",
    address: "3117 University Ave, San Diego, CA 92104",
    lookup: "3117 University Ave, San Diego, CA 92104",
    score: 82, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    instagram: "@o40brew", website: "https://original40brew.com",
    dishes: ["House Brews","Gastropub Menu","University Ave Patio","North Park Neighborhood Brewery"],
    desc: "North Park's Original 40 Brewing Co — a house-beer-and-kitchen format on University Ave, named for the original 40-acre grant that became North Park, and a neighborhood brewery anchor in the North Park beer spine." },
  { name: "Callahan's Pub & Brewery", cuisine: "American / Pub / Brewery", neighborhood: "Mira Mesa / Scripps Ranch",
    address: "9841 Mira Mesa Blvd, San Diego, CA 92131",
    lookup: "9841 Mira Mesa Blvd, San Diego, CA 92131",
    score: 83, price: 2, tags: ["American","Pub","Brewery","Patio","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@callahanspub", website: "https://callahanspub.com",
    dishes: ["House-Brewed Beers","Irish-Pub Menu","Scripps Ranch Patio","Since 1989"],
    desc: "Scripps Ranch's Callahan's Pub & Brewery since 1989 — an Irish-pub format with house-brewed beers, a neighborhood-room patio, and one of the defining suburban-SD brewpubs that has fed the Mira Mesa/Scripps Ranch families for over 35 years." },
  { name: "Ranchos Cocina", cuisine: "Mexican / Vegetarian", neighborhood: "North Park",
    address: "3910 30th St, San Diego, CA 92104",
    lookup: "3910 30th St, San Diego, CA 92104",
    score: 84, price: 2, tags: ["Mexican","Vegetarian","Vegan","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Ranchos",
    instagram: "@ranchoscocina", website: "https://ranchoscocina.com",
    dishes: ["Vegetarian Mexican","Seitan Chimichanga","Vegan Options","North Park Since 1990s"],
    desc: "North Park's Ranchos Cocina — a vegetarian/vegan-leaning Mexican kitchen on 30th Street, a seitan chimichanga signature, and a neighborhood dining room that has fed SD's plant-based Mexican-food eaters since the 1990s." },
  { name: "Hooleys Irish Pub & Grill — La Mesa", cuisine: "Irish / American / Pub", neighborhood: "La Mesa",
    address: "5500 Grossmont Center Dr, La Mesa, CA 91942",
    lookup: "5500 Grossmont Center Dr, La Mesa, CA 91942",
    score: 82, price: 2, tags: ["Irish","American","Pub","Family Friendly","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    suburb: true,
    group: "Hooleys",
    instagram: "@hooleyspubs", website: "https://hooleys.com",
    dishes: ["Fish & Chips","Guinness Stew","Corned Beef + Cabbage","East County Patio"],
    desc: "Hooleys La Mesa — the multi-location SD Irish-pub's Grossmont Center location, with a full Irish-plus-American menu, a family-friendly patio, and the kind of East County neighborhood anchor that defines suburban SD pub dining." }
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
  const gaslampTight = /Gaslamp|East Village|Little Italy|^Downtown$|^Downtown \/ Embarcadero$/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

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

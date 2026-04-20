#!/usr/bin/env node
// San Diego batch 19 — breweries + Hillcrest/Kensington institutions + North Park + RSF + Coronado + North County (20)
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
  { name: "Pure Project Brewing — Miramar", cuisine: "American / Brewery", neighborhood: "Miramar",
    address: "9030 Kenamar Dr, San Diego, CA 92121",
    lookup: "9030 Kenamar Dr, San Diego, CA 92121",
    score: 86, price: 2, tags: ["American","Brewery","Casual","Trending","Local Favorites","Craft Beer","Critics Pick"],
    reservation: "walk-in",
    group: "Pure Project",
    instagram: "@pureprojectbrewing", website: "https://pureprojectbrewing.com",
    dishes: ["Hazy IPAs","Mixed-Culture Program","Patio Tasting Room","Miramar Production Brewery"],
    desc: "Pure Project's Miramar production facility — mixed-culture and hazy IPA program that beer nerds rank among SD's most-respected, a large tasting-room format, and a Miramar brewery-corridor destination." },
  { name: "North Park Beer Co.", cuisine: "American / Brewery", neighborhood: "North Park",
    address: "3038 University Ave, San Diego, CA 92104",
    lookup: "3038 University Ave, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    instagram: "@northparkbeerco", website: "https://northparkbeerco.com",
    dishes: ["Hop-Fu IPA","Taproom Program","University Ave Corner","North Park Brewery Walk"],
    desc: "North Park's neighborhood brewery — a corner taproom on University Ave, a Hop-Fu IPA that defines the house style, and one of the anchor stops on the North Park craft-brewery walk." },
  { name: "Thorn Brewing Co. — Barrio Logan", cuisine: "American / Brewery", neighborhood: "Barrio Logan",
    address: "1876 Logan Ave, San Diego, CA 92113",
    lookup: "1876 Logan Ave, San Diego, CA 92113",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Thorn Brewing",
    instagram: "@thornbrewing", website: "https://thornbrewing.com",
    dishes: ["Thorny-Brown Ale","Seasonal Rotation","Barrio Logan Taproom","Art-Wall Interior"],
    desc: "Barrio Logan's Thorn — the multi-location SD brewery's Logan Ave taproom, with mural-covered walls that read as part of the Barrio art corridor and a Thorny brown ale as the house signature." },
  { name: "Fall Brewing Co.", cuisine: "American / Brewery", neighborhood: "North Park",
    address: "4575 30th St, San Diego, CA 92116",
    lookup: "4575 30th St, San Diego, CA 92116",
    score: 85, price: 2, tags: ["American","Brewery","Casual","Trending","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Fall Brewing",
    instagram: "@fallbrewingco", website: "https://fallbrewingco.com",
    dishes: ["Plain Lager","Punk-Themed Taproom","Skate-Video Loop","30th Street Neighborhood"],
    desc: "North Park's punk-rock brewery — a 30th Street taproom with skate videos on loop, the crystal-clear 'Plain' lager as the house signature, and a dining room that hitched the neighborhood's craft-beer identity to its music scene." },
  { name: "Resident Brewing Company", cuisine: "American / Brewery", neighborhood: "Downtown",
    address: "1065 Fourth Ave, San Diego, CA 92101",
    lookup: "1065 4th Ave, San Diego, CA 92101",
    score: 82, price: 2, tags: ["American","Brewery","Casual","Patio","Craft Beer","Local Favorites"],
    reservation: "walk-in",
    group: "Resident Brewing",
    instagram: "@residentbrewing", website: "https://residentbrewing.com",
    dishes: ["Hazy IPA Program","4th Ave Taproom","Downtown Beer Walk","Tight-Format Brewpub"],
    desc: "Downtown's Fourth Ave brewery attached to The Local Eatery — a small-footprint production facility feeding a full dining room, and one of the downtown brewery-walk anchors that kept craft beer in the Gaslamp-adjacent grid." },
  { name: "Bitter Brothers Brewing Co.", cuisine: "American / Brewery", neighborhood: "Bay Park",
    address: "4140 Morena Blvd, San Diego, CA 92117",
    lookup: "4140 Morena Blvd, San Diego, CA 92117",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Local Favorites","Craft Beer","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@bitterbrothersbrewing", website: "https://bitterbrothersbrewing.com",
    dishes: ["Saison Program","Rotating Taps","Bay Park Taproom","Quiet-Format Brewery"],
    desc: "Bay Park's Morena Blvd brewery — a tight saison-and-rotating-taps program, a quiet locals-only taproom, and one of the most-respected Bay Park brewing operations outside the Convoy beer corridor." },
  { name: "Culture Brewing Co. — Ocean Beach", cuisine: "American / Brewery", neighborhood: "Ocean Beach",
    address: "4845 Newport Ave, San Diego, CA 92107",
    lookup: "4845 Newport Ave, San Diego, CA 92107",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Culture Brewing",
    instagram: "@culturebrewingco", website: "https://culturebrewingco.com",
    dishes: ["Mosaic Pale Ale","Tasting Flights","OB Newport Ave Taproom","Craft-Only Program"],
    desc: "Culture Brewing's Ocean Beach taproom — a Mosaic pale ale as the house call, a no-food/beer-only format that leans on nearby OB kitchens, and a Newport Ave corner room that fits the OB regulars' after-work rotation." },
  { name: "Ichiban — Hillcrest", cuisine: "Japanese", neighborhood: "Hillcrest",
    address: "1449 University Ave, San Diego, CA 92103",
    lookup: "1449 University Ave, San Diego, CA 92103",
    score: 82, price: 1, tags: ["Japanese","Casual","Quick Bite","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@ichibanhillcrest", website: "",
    dishes: ["Chicken Teriyaki Bowl","Udon","Hillcrest Since 1987","Counter Service"],
    desc: "Hillcrest's no-frills Japanese counter since 1987 — chicken teriyaki bowl, udon soup, a University Ave room that has been the Hillcrest cheap-eats Japanese default for almost 40 years." },
  { name: "Sushi on Fifth", cuisine: "Japanese / Sushi", neighborhood: "Hillcrest",
    address: "3809 Fifth Ave, San Diego, CA 92103",
    lookup: "3809 5th Ave, San Diego, CA 92103",
    score: 83, price: 2, tags: ["Japanese","Sushi","Casual","LGBTQ+","Local Favorites","Happy Hour"],
    reservation: "walk-in",
    instagram: "@sushionfifth", website: "https://sushionfifth.com",
    dishes: ["Hillcrest Rolls","Happy Hour Program","LGBTQ+-Welcoming Room","5th Ave Crossroads"],
    desc: "Hillcrest's 5th Ave sushi — an LGBTQ+-welcoming dining room, a serious happy-hour rolls program, and a Hillcrest neighborhood reservation that the Uptown crowd default to." },
  { name: "Mama's Bakery & Lebanese Deli", cuisine: "Lebanese / Bakery", neighborhood: "North Park",
    address: "4237 Alabama St, San Diego, CA 92104",
    lookup: "4237 Alabama St, San Diego, CA 92104",
    score: 86, price: 1, tags: ["Lebanese","Middle Eastern","Bakery","Casual","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@mamasbakerysd", website: "https://mamasbakery.net",
    dishes: ["Saj Flatbread","Za'atar Man'oushe","Lebanese Pastries","Mom-Run Counter Since 1989"],
    desc: "North Park's Lebanese bakery-deli since 1989 — saj flatbread cooked on the dome ovens in front of you, za'atar man'oushe, and a matriarch-run dining room that reads more Beirut than North Park. A defining hidden-in-plain-sight SD room." },
  { name: "Kensington Cafe", cuisine: "American / Brunch", neighborhood: "Kensington",
    address: "4141 Adams Ave, San Diego, CA 92116",
    lookup: "4141 Adams Ave, San Diego, CA 92116",
    score: 84, price: 2, tags: ["American","Brunch","Breakfast","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@kensingtoncafesd", website: "https://kensingtoncafesd.com",
    dishes: ["Kenny's Benedict","Pancake Program","Neighborhood Brunch","Kensington Village Patio"],
    desc: "Kensington Village's brunch anchor on Adams Ave — a classic diner-plus benedict-and-pancake menu, a neighborhood patio that runs the Kensington Sunday rhythm, and a locals' room across from Bleu Bohème." },
  { name: "The Smoking Goat", cuisine: "Modern American / Farm-to-Table", neighborhood: "North Park",
    address: "3408 30th St, San Diego, CA 92104",
    lookup: "3408 30th St, San Diego, CA 92104",
    score: 87, price: 3, tags: ["American","Modern","Farm-to-Table","Date Night","Critics Pick","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@thesmokinggoatsd", website: "https://thesmokinggoatrestaurant.com",
    dishes: ["Seasonal Tasting","Roasted Bone Marrow","Farm-to-Table Program","30th Street Patio"],
    desc: "Chef Fred Piehl's North Park 30th Street modern-American — a farm-driven seasonal menu, a roasted bone marrow signature, and a dining room that North Park regulars have kept on the weekly rotation for over a decade. A defining North Park chef-kitchen." },
  { name: "Influx Cafe", cuisine: "Coffee / Cafe", neighborhood: "Golden Hill",
    address: "1948 Broadway, San Diego, CA 92102",
    lookup: "1948 Broadway, San Diego, CA 92102",
    score: 83, price: 1, tags: ["Coffee","Cafe","Breakfast","Casual","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@influxcafesd", website: "https://influxcafe.com",
    dishes: ["Specialty Lattes","Breakfast Sandwiches","Design-Forward Cafe","Golden Hill Corner"],
    desc: "Golden Hill's Broadway coffee-and-breakfast cafe — a design-forward space, specialty espresso program, and a neighborhood crowd that has made Influx part of the Golden Hill morning rhythm." },
  { name: "Veladora at The Inn at Rancho Santa Fe", cuisine: "Californian / Modern American", neighborhood: "Rancho Santa Fe",
    address: "5951 Linea Del Cielo, Rancho Santa Fe, CA 92067",
    lookup: "5951 Linea Del Cielo, Rancho Santa Fe, CA 92067",
    score: 87, price: 4, tags: ["Fine Dining","Californian","American","Date Night","Celebrations","Patio","Critics Pick","Scenic Views"],
    reservation: "OpenTable",
    suburb: true,
    group: "The Inn at Rancho Santa Fe",
    instagram: "@theinnatrsf", website: "https://theinnatrsf.com",
    dishes: ["Seasonal Tasting","Garden-Sourced Menu","Historic Hacienda Setting","Fireside Patio"],
    desc: "Rancho Santa Fe's Veladora inside The Inn's 1920s hacienda — a seasonal-tasting menu with garden-sourced produce, a fireside patio that reads as RSF's defining resort dinner, and the kind of private-village setting that North County anniversaries default to." },
  { name: "Lil' Frenchie", cuisine: "French / Cafe / Bakery", neighborhood: "Coronado",
    address: "1166 Orange Ave, Coronado, CA 92118",
    lookup: "1166 Orange Ave, Coronado, CA 92118",
    score: 85, price: 2, tags: ["French","Cafe","Bakery","Breakfast","Brunch","Trending","Patio"],
    reservation: "walk-in",
    instagram: "@lilfrenchiesd", website: "https://lilfrenchiecoronado.com",
    dishes: ["Croissants","Buckwheat Crepes","Quiche","Orange Ave Patio"],
    desc: "Coronado's French cafe on Orange Ave — croissants, buckwheat crepes, a from-scratch pastry program, and a sidewalk patio that reads as the island's most-convincing transplanted Parisian corner." },
  { name: "Peohe's", cuisine: "American / Seafood / Pacific Rim", neighborhood: "Coronado",
    address: "1201 First St, Coronado, CA 92118",
    lookup: "1201 First St, Coronado, CA 92118",
    score: 83, price: 4, tags: ["Fine Dining","American","Seafood","Pacific Rim","Date Night","Scenic Views","Celebrations","Iconic"],
    reservation: "OpenTable",
    group: "Specialty Restaurants",
    instagram: "@peohessd", website: "https://peohes.com",
    dishes: ["Pacific Rim Seafood","Tropical Atrium","Skyline-Across-the-Bay Views","Ferry Landing Setting"],
    desc: "Coronado Ferry Landing's Pacific Rim-seafood institution — a tropical atrium dining room with koi ponds, a view straight across the bay to downtown SD, and a special-occasion Coronado format that's been running for four decades." },
  { name: "Bluewater Boathouse Seafood Grill", cuisine: "American / Seafood", neighborhood: "Coronado",
    address: "1701 Strand Way, Coronado, CA 92118",
    lookup: "1701 Strand Way, Coronado, CA 92118",
    score: 83, price: 3, tags: ["American","Seafood","Date Night","Scenic Views","Patio","Iconic","Family Friendly"],
    reservation: "OpenTable",
    group: "Bluewater Grill",
    instagram: "@bluewatergrill", website: "https://bluewatergrill.com",
    dishes: ["Fresh Catch Program","Mesquite-Grilled Fish","Boathouse Setting","Coronado Bay Views"],
    desc: "Coronado's Bluewater Boathouse — a waterfront boathouse-style seafood room on Strand Way, a mesquite-grill program, and a Coronado Bay view that anchors the format. The Bluewater Grill family's island location." },
  { name: "Stratford Court Cafe", cuisine: "American / Brunch", neighborhood: "Del Mar",
    address: "1307 Stratford Ct, Del Mar, CA 92014",
    lookup: "1307 Stratford Ct, Del Mar, CA 92014",
    score: 84, price: 2, tags: ["American","Brunch","Breakfast","Casual","Family Friendly","Local Favorites","Patio","Iconic"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@stratfordcourtcafe", website: "https://stratfordcourtcafe.com",
    dishes: ["Crumble Coffee Cake","Hot Breakfast Sandwich","Del Mar Village Courtyard","Morning Regulars"],
    desc: "Del Mar Village's Stratford Court café — a cottage-courtyard morning-only format, crumble coffee cake and hot breakfast sandwiches, and a regulars' crowd that has been the Del Mar Village weekday morning default for decades." },
  { name: "Paon Restaurant & Wine Bar", cuisine: "French / Contemporary", neighborhood: "Carlsbad",
    address: "2975 Roosevelt St, Carlsbad, CA 92008",
    lookup: "2975 Roosevelt St, Carlsbad, CA 92008",
    score: 88, price: 4, tags: ["Fine Dining","French","Contemporary","Date Night","Celebrations","Patio","Critics Pick","Wine Bar"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@paoncarlsbad", website: "https://paoncarlsbad.com",
    dishes: ["French Tasting Menu","Village Patio","Extensive Wine Cellar","Tableside Chateaubriand"],
    desc: "Carlsbad Village's French fine-dining flagship — a tableside chateaubriand, an exhaustive wine program, and a Carlsbad Village patio that reads like a European city square. A defining North County special-occasion anchor." },
  { name: "Solterra Winery & Kitchen", cuisine: "Californian / Winery", neighborhood: "Leucadia / Encinitas",
    address: "934 N Coast Hwy 101, Encinitas, CA 92024",
    lookup: "934 N Coast Hwy 101, Encinitas, CA 92024",
    score: 85, price: 3, tags: ["American","Californian","Wine Bar","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@solterrawinery", website: "https://solterrawinery.com",
    dishes: ["On-Site Winemaking","Chef-Driven Menu","Leucadia 101 Patio","Flight Program"],
    desc: "Leucadia's 101-corridor urban winery — producing wine on-site, pairing from a chef-driven kitchen, and a Leucadia patio that reads as North County's most-earnest wine-and-dine format." }
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
  const gaslampTight = /Gaslamp|East Village|Little Italy|Downtown/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

const manualFallback = {
  "Resident Brewing Company":  { lat: 32.7191, lng: -117.1625 }  // 1065 4th Ave Downtown
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

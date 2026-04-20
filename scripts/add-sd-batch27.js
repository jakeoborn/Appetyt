#!/usr/bin/env node
// San Diego batch 27 — final push to 500 (25 institutional picks: Encinitas 101 + Kensington + College Area + Loma Portal + OB + Lafayette Hotel)
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
  { name: "El Callejon", cuisine: "Mexican", neighborhood: "Encinitas",
    address: "345 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "345 S Coast Hwy 101, Encinitas, CA 92024",
    score: 85, price: 3, tags: ["Mexican","Date Night","Patio","Tequila","Iconic","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@elcallejon", website: "https://elcallejon.com",
    dishes: ["400+ Tequilas","Traditional Mexican","Encinitas 101 Patio","Tequila-Library Program"],
    desc: "Encinitas's El Callejon on the 101 — a 400+ bottle tequila library, a traditional Mexican dining room, and a sidewalk patio that made El Callejon one of North County's defining Mexican-and-tequila destination rooms." },
  { name: "St. Tropez Bistro & Bakery", cuisine: "French / Bakery / Cafe", neighborhood: "Encinitas",
    address: "947 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "947 S Coast Hwy 101, Encinitas, CA 92024",
    score: 84, price: 2, tags: ["French","Bakery","Cafe","Breakfast","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@sttropezbistro", website: "https://sttropezbistro.com",
    dishes: ["Croissants","Quiche","Crepes","Encinitas 101 Cafe Patio"],
    desc: "Encinitas's French bistro-and-bakery on the 101 — croissants, crepes, and a sidewalk patio that reads as a convincing Provençal transplant on the Encinitas beach strip. A defining North County French café." },
  { name: "CUCINA sorella", cuisine: "Italian", neighborhood: "Kensington",
    address: "4055 Adams Ave, San Diego, CA 92116",
    lookup: "4055 Adams Ave, San Diego, CA 92116",
    score: 87, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Trending","Local Favorites"],
    reservation: "OpenTable",
    group: "Urban Kitchen Group / Tracy Borkum",
    instagram: "@cucinasorella", website: "https://urbankitchengroup.com/cucinasorella",
    dishes: ["House-Made Pasta","Wood-Fired Dishes","Kensington Patio","Tracy Borkum Format"],
    desc: "Chef Tracy Borkum's Kensington Italian — the Urban Kitchen Group's neighborhood CUCINA sibling on Adams Ave, a wood-fired and hand-made pasta menu, and one of the defining Kensington chef-driven dinner reservations." },
  { name: "Scotch & Sirloin", cuisine: "American / Steakhouse", neighborhood: "Kearny Mesa",
    address: "7707 Balboa Ave, San Diego, CA 92111",
    lookup: "7707 Balboa Ave, San Diego, CA 92111",
    score: 83, price: 4, tags: ["Fine Dining","American","Steakhouse","Date Night","Iconic","Local Favorites","Historic"],
    reservation: "OpenTable",
    instagram: "@scotchsirloin", website: "https://scotchandsirloin.net",
    dishes: ["Prime Rib","Hand-Cut Steaks","Tableside Cesar","Kearny Mesa Since 1968"],
    desc: "Kearny Mesa's Scotch & Sirloin since 1968 — a dark-wood chophouse, prime rib and hand-cut steaks, tableside Caesar, and the kind of old-guard Balboa Ave dining room where SD's Kearny Mesa military and airport-adjacent crowd has had the same steak for 55+ years." },
  { name: "Miguel's Cocina — 4S Ranch", cuisine: "Mexican", neighborhood: "Rancho Bernardo",
    address: "10514 Craftsman Way, San Diego, CA 92127",
    lookup: "10514 Craftsman Way, San Diego, CA 92127",
    score: 83, price: 2, tags: ["Mexican","Margaritas","Patio","Family Friendly","Local Favorites","Iconic"],
    reservation: "OpenTable",
    suburb: true,
    group: "Brigantine Family",
    instagram: "@miguelscocina", website: "https://miguelscocina.com",
    dishes: ["Famous White Sauce","Combination Plates","Margaritas","4S Ranch Patio"],
    desc: "Miguel's Cocina's 4S Ranch location — the Brigantine Family's Rancho Bernardo-area Mexican, with the same 'famous white sauce' signature that defines every Miguel's location. A North Inland family-dinner default." },
  { name: "Trattoria Acqua", cuisine: "Italian", neighborhood: "La Jolla",
    address: "1298 Prospect St Ste F, La Jolla, CA 92037",
    lookup: "1298 Prospect St, La Jolla, CA 92037",
    score: 87, price: 4, tags: ["Fine Dining","Italian","Date Night","Scenic Views","Patio","Celebrations","Iconic","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@trattoriaacqua", website: "https://trattoriaacqua.com",
    dishes: ["Handmade Pasta","Cove-View Terrace","Extensive Italian Wine List","La Jolla Since 1995"],
    desc: "La Jolla Cove's Trattoria Acqua since 1995 — a Prospect St Italian with a vine-covered terrace overlooking La Jolla Cove, a handmade pasta program, and a wine list that reads as the Cove's serious Italian anchor. A defining La Jolla special-occasion room." },
  { name: "The Barrel Room", cuisine: "American / Wine Bar / Modern", neighborhood: "Rancho Bernardo",
    address: "16765 Bernardo Center Dr, San Diego, CA 92128",
    lookup: "16765 Bernardo Center Dr, San Diego, CA 92128",
    score: 84, price: 3, tags: ["American","Modern","Wine Bar","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@thebarrelroomsd", website: "https://thebarrelroomsd.com",
    dishes: ["Chef-Driven Menu","500+ Wine List","Craft Cocktails","Rancho Bernardo Neighborhood"],
    desc: "Rancho Bernardo's wine-forward chef-driven restaurant — a 500+ wine list, a seasonal menu, and a Bernardo Center Dr dining room that anchors North Inland SD's serious-wine-plus-kitchen community." },
  { name: "Liberty Call Whiskey House — Kensington", cuisine: "American / Whiskey Bar", neighborhood: "Kensington",
    address: "4120 Adams Ave, San Diego, CA 92116",
    lookup: "4120 Adams Ave, San Diego, CA 92116",
    score: 84, price: 3, tags: ["American","Whiskey Bar","Cocktails","Date Night","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Liberty Call",
    instagram: "@libertycallwh", website: "https://libertycallwhiskeyhouse.com",
    dishes: ["200+ Whiskeys","House-Made Bitters Program","Adams Ave Bar","Kensington Neighborhood Cocktail Room"],
    desc: "Kensington's Liberty Call Whiskey House — 200+ whiskeys on the back bar, a cocktail program built around house-distilled Liberty Call spirits, and an Adams Ave dining-room format that gave Kensington its serious brown-liquor bar." },
  { name: "Jong Ga House", cuisine: "Korean / BBQ", neighborhood: "College Area",
    address: "4541 El Cajon Blvd, San Diego, CA 92115",
    lookup: "4541 El Cajon Blvd, San Diego, CA 92115",
    score: 83, price: 2, tags: ["Korean","BBQ","Casual","Late Night","24-Hour","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Tableside Korean BBQ","Soondubu Jjigae","24-Hour Dining","El Cajon Blvd Location"],
    desc: "College Area's 24-hour Korean BBQ — tableside grilling, soondubu jjigae, banchan program, and a College Area crowd that fills the El Cajon Blvd dining room late into the morning. An SD 24-hour Korean anchor." },
  { name: "Ortega's Bistro", cuisine: "Mexican", neighborhood: "Hillcrest",
    address: "141 University Ave, San Diego, CA 92103",
    lookup: "141 University Ave, San Diego, CA 92103",
    score: 84, price: 2, tags: ["Mexican","Casual","Margaritas","Patio","Local Favorites","Family Friendly","Iconic"],
    reservation: "walk-in",
    instagram: "@ortegasbistro", website: "https://ortegasbistro.com",
    dishes: ["Puerto Nuevo-Style Lobster","Carnitas","Ortega Family Recipes","Hillcrest Patio"],
    desc: "Hillcrest's Ortega's Bistro — Puerto Nuevo-style lobster, carnitas, and a Ortega family menu transplanted from the Baja fishing village to University Ave. A defining Hillcrest Mexican specialist." },
  { name: "Lotus Cafe & Juice Bar", cuisine: "American / Vegetarian / Healthy", neighborhood: "Encinitas",
    address: "765 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "765 S Coast Hwy 101, Encinitas, CA 92024",
    score: 84, price: 2, tags: ["American","Vegetarian","Vegan","Healthy","Brunch","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@lotuscafesd", website: "https://lotuscafesd.com",
    dishes: ["Juice Bar Program","Vegetarian-Focused Menu","Encinitas 101 Patio","Surf-to-Healthy-Lunch Crowd"],
    desc: "Encinitas's Lotus Cafe on the 101 — a vegetarian-focused menu with a juice bar, a sidewalk patio that's been part of the Encinitas surf-culture-plus-wellness routine for two decades. A North County healthy-lunch default." },
  { name: "Milton's Delicatessen", cuisine: "American / Deli / Jewish", neighborhood: "Del Mar",
    address: "2660 Via de la Valle, Del Mar, CA 92014",
    lookup: "2660 Via de la Valle, Del Mar, CA 92014",
    score: 84, price: 2, tags: ["American","Deli","Jewish","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@miltonsdelicatessen", website: "https://miltonsdeli.com",
    dishes: ["Reuben Sandwich","Matzo Ball Soup","Deli Case","Flower Hill Since 1994"],
    desc: "Del Mar's Flower Hill deli since 1994 — Reuben sandwiches, matzo ball soup, a glass deli case, and a Jewish-American menu that runs as the North County deli default. A Del Mar neighborhood constant." },
  { name: "Rose Donuts & Cafe", cuisine: "Dessert / Donuts", neighborhood: "Point Loma",
    address: "3201 Rosecrans St, San Diego, CA 92110",
    lookup: "3201 Rosecrans St, San Diego, CA 92110",
    score: 83, price: 1, tags: ["Dessert","Donuts","Casual","Late Night","24-Hour","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Classic Glazed Donut","Jelly-Filled","24-Hour Format","Point Loma Corner"],
    desc: "Point Loma's 24-hour Rose Donuts on Rosecrans — classic old-school yeast-and-cake donuts, no-frills counter, and a Rosecrans corner that feeds SD's overnight-shift workers and Point Loma's early-morning commuters." },
  { name: "The Local Eatery & Drinking Hole — Pacific Beach", cuisine: "American / Bar", neighborhood: "Pacific Beach",
    address: "1466 Garnet Ave, San Diego, CA 92109",
    lookup: "1466 Garnet Ave, San Diego, CA 92109",
    score: 82, price: 2, tags: ["American","Bar","Patio","Casual","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "The Local",
    instagram: "@thelocalsd", website: "https://thelocalsandiego.com",
    dishes: ["Burger Program","Craft Beer List","PB Garnet Ave","Neighborhood Gastropub"],
    desc: "The Local's Pacific Beach location on Garnet Ave — a burger-and-craft-beer format, a PB dining room that reads as the neighborhood everyday default, and part of the multi-location SD Local brand." },
  { name: "OB Brewery", cuisine: "American / Brewery", neighborhood: "Ocean Beach",
    address: "5041 Newport Ave, San Diego, CA 92107",
    lookup: "5041 Newport Ave, San Diego, CA 92107",
    score: 82, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    instagram: "@obbrewery", website: "https://obbrewery.com",
    dishes: ["House-Brewed Beer","Newport Ave Taproom","Surf-Themed Interior","OB Locals' Brewery"],
    desc: "Ocean Beach's neighborhood brewery on Newport Ave — house-brewed beers, a surf-themed taproom, and a OB-main-drag format that fits the OB after-beach rotation. A Newport Ave craft-beer anchor." },
  { name: "White Rice Filipino", cuisine: "Filipino", neighborhood: "Normal Heights",
    address: "4177 Adams Ave, San Diego, CA 92116",
    lookup: "4177 Adams Ave, San Diego, CA 92116",
    score: 84, price: 2, tags: ["Filipino","Casual","Critics Pick","Hidden Gem","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@whitericefilipino", website: "",
    dishes: ["Adobo","Pancit","Lumpia","Filipino Home-Style Menu"],
    desc: "Normal Heights' Filipino kitchen on Adams Ave — adobo, pancit, lumpia, and a tight Filipino home-style menu that runs as SD's rare storefront Filipino option. A defining Normal Heights hidden-in-plain-sight chapter." },
  { name: "Cafe Bella Italia", cuisine: "Italian", neighborhood: "Pacific Beach",
    address: "1525 Garnet Ave, San Diego, CA 92109",
    lookup: "1525 Garnet Ave, San Diego, CA 92109",
    score: 84, price: 3, tags: ["Italian","Date Night","Patio","Iconic","Local Favorites","Family Friendly"],
    reservation: "OpenTable",
    instagram: "@cafebellaitalia", website: "https://cafebellaitalia.com",
    dishes: ["House-Made Pasta","Wood-Fired Pizza","Garnet Ave Dining Room","PB Italian Anchor"],
    desc: "Pacific Beach's Cafe Bella Italia on Garnet Ave — family-run Italian with house-made pasta, wood-fired pizza, and the kind of PB neighborhood-dinner reservation that has been the locals' Italian default for two decades." },
  { name: "Aladdin Mediterranean Cafe", cuisine: "Mediterranean / Middle Eastern", neighborhood: "College Area",
    address: "5365 El Cajon Blvd, San Diego, CA 92115",
    lookup: "5365 El Cajon Blvd, San Diego, CA 92115",
    score: 83, price: 2, tags: ["Mediterranean","Middle Eastern","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@aladdinsd", website: "https://aladdincafesd.com",
    dishes: ["Shawarma","Kebab Program","Hummus & Tabbouleh","College Area Since 1993"],
    desc: "College Area's Aladdin Mediterranean Cafe since 1993 — an El Cajon Blvd Middle Eastern kitchen, a full shawarma-and-kebab menu, and a SDSU-adjacent dining room that has been the campus-corridor Middle Eastern default for three decades." },
  { name: "Viewpoint Brewing Co.", cuisine: "American / Brewery", neighborhood: "Del Mar",
    address: "2201 San Dieguito Dr, Del Mar, CA 92014",
    lookup: "2201 San Dieguito Dr, Del Mar, CA 92014",
    score: 85, price: 3, tags: ["American","Brewery","Date Night","Scenic Views","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    group: "Viewpoint Brewing",
    instagram: "@viewpointbrewing", website: "https://viewpointbrewing.com",
    dishes: ["House-Brewed Beer","Chef-Driven Menu","San Dieguito Lagoon Patio","North County Brewpub Anchor"],
    desc: "Del Mar's Viewpoint Brewing — a chef-driven brewpub with a patio overlooking the San Dieguito Lagoon, house beer program, and a dining room that gave the Del Mar/Solana Beach corridor its most-serious brewery-plus-kitchen format." },
  { name: "Harumama Noodles & Buns", cuisine: "Japanese / Ramen", neighborhood: "Little Italy",
    address: "1739 India St, San Diego, CA 92101",
    lookup: "1739 India St, San Diego, CA 92101",
    score: 85, price: 2, tags: ["Japanese","Ramen","Casual","Date Night","Trending","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    instagram: "@harumamanoodles", website: "https://harumamanoodles.com",
    dishes: ["Character-Shaped Steamed Buns","Tonkotsu Ramen","Instagram-Famous Bao","Little Italy India St"],
    desc: "Little Italy's Harumama — character-shaped steamed bao (pandas, pigs, cartoon characters) that made Harumama an SD Instagram staple, a serious tonkotsu ramen program behind the photogenic front, and a India St dining room that balances both." },
  { name: "Quixote — Lafayette Hotel", cuisine: "Mexican / Modern", neighborhood: "North Park",
    address: "2223 El Cajon Blvd, San Diego, CA 92104",
    lookup: "2223 El Cajon Blvd, San Diego, CA 92104",
    score: 87, price: 4, tags: ["Fine Dining","Mexican","Modern","Date Night","Patio","Critics Pick","Trending"],
    reservation: "Resy",
    group: "Lafayette Hotel",
    instagram: "@quixotesd", website: "https://lafayettehotelsd.com",
    dishes: ["Modern Mexican Tasting","Lafayette Hotel Dining Room","Chef-Driven Program","Open Kitchen"],
    desc: "Quixote at the Lafayette Hotel — one of the restaurants inside the buzzed-about Lafayette Hotel reopening, a modern-Mexican program with an open kitchen, and a North Park dining room that anchors the Lafayette's food-and-drink revival." },
  { name: "Beginner's Diner — Lafayette Hotel", cuisine: "American / Diner", neighborhood: "North Park",
    address: "2223 El Cajon Blvd, San Diego, CA 92104",
    lookup: "2223 El Cajon Blvd, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Diner","Breakfast","Brunch","Casual","Trending","Iconic"],
    reservation: "walk-in",
    group: "Lafayette Hotel",
    instagram: "@beginnersdiner", website: "https://lafayettehotelsd.com",
    dishes: ["Retro Diner Menu","Counter Service","Lafayette Hotel","North Park"],
    desc: "Beginner's Diner inside the Lafayette Hotel — a retro-diner format alongside Quixote and the Red Fox Room in the Lafayette's post-reopening restaurant lineup. A defining Lafayette Hotel breakfast-and-brunch chapter." },
  { name: "Ciccia Osteria", cuisine: "Italian", neighborhood: "Barrio Logan",
    address: "1809 Logan Ave, San Diego, CA 92113",
    lookup: "1809 Logan Ave, San Diego, CA 92113",
    score: 86, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Trending","Hidden Gem","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@cicciaosteria", website: "https://cicciaosteria.com",
    dishes: ["House-Made Pasta","Neapolitan Program","Barrio Logan Patio","Chef-Driven Italian in Barrio"],
    desc: "Barrio Logan's chef-driven Italian — house-made pasta, a Neapolitan-style cooking program, and a Logan Ave dining room that put Italian cooking into the Barrio Logan corridor as a defining specialty chapter." },
  { name: "Original Sab-E-Lee Thai", cuisine: "Thai", neighborhood: "Linda Vista",
    address: "2405 Ulric St, San Diego, CA 92111",
    lookup: "2405 Ulric St, San Diego, CA 92111",
    score: 86, price: 2, tags: ["Thai","Casual","Critics Pick","Hidden Gem","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@sabeleethai", website: "https://sabelee.com",
    dishes: ["Authentic Thai Menu","Spicy-Level Warnings","Northern Thai Specialties","Linda Vista Since 2004"],
    desc: "Linda Vista's Sab-E-Lee Thai since 2004 — the SD Thai-community reference for regional Thai cooking, a menu of spicier preparations than other SD Thai rooms usually attempt, and a strip-mall format that Thai-food-serious locals treat as the SD default." },
  { name: "Pacific Shores Cocktail Lounge", cuisine: "American / Bar / Dive", neighborhood: "Ocean Beach",
    address: "4927 Newport Ave, San Diego, CA 92107",
    lookup: "4927 Newport Ave, San Diego, CA 92107",
    score: 83, price: 1, tags: ["American","Bar","Dive","Late Night","Iconic","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "@pacshoresob", website: "",
    dishes: ["Dive-Bar Cocktails","Mid-Century Interior","Ocean Beach Since 1941","Tropical-Diorama Decor"],
    desc: "Ocean Beach's Pacific Shores since 1941 — a mid-century tropical-diorama dive on Newport Ave, the oldest continuously-operating bar in OB, with a black-vinyl-booths interior that has barely changed in 80 years. A defining Ocean Beach institution." }
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

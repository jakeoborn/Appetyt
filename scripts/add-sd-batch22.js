#!/usr/bin/env node
// San Diego batch 22 — Indian/Persian/Sichuan/Korean + vegan + OB Italian + Encinitas + Embarcadero + Carlsbad (20)
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
  { name: "Royal India — Gaslamp", cuisine: "Indian", neighborhood: "Gaslamp",
    address: "329 Market St, San Diego, CA 92101",
    lookup: "329 Market St, San Diego, CA 92101",
    score: 83, price: 3, tags: ["Indian","Date Night","Iconic","Local Favorites","Family Friendly"],
    reservation: "OpenTable",
    group: "Royal India",
    instagram: "@royalindiasd", website: "https://royalindiasd.com",
    dishes: ["Tandoor Program","Butter Chicken","Lamb Vindaloo","Lunch Buffet"],
    desc: "Gaslamp's long-running Indian dining room — a tandoor-forward menu, a daily lunch buffet that's been a downtown power-lunch default for two decades, and a Market St location that anchors the Indian scene in the Gaslamp grid." },
  { name: "Bandar Fine Persian Cuisine", cuisine: "Persian", neighborhood: "Gaslamp",
    address: "825 Fifth Ave, San Diego, CA 92101",
    lookup: "825 5th Ave, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Persian","Middle Eastern","Date Night","Iconic","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@bandarsd", website: "https://bandarrestaurant.com",
    dishes: ["Koobideh Kebabs","Chelow Kebab","Saffron Rice","Downtown Persian Since 1993"],
    desc: "Gaslamp's Bandar since 1993 — SD's defining Persian restaurant, with a full koobideh kebab program, chelow kebab, and a 5th Ave dining room that generations of SD's Persian community have used as the home-away-from-home special-occasion room." },
  { name: "Himalayan Cuisine", cuisine: "Nepali / Indian", neighborhood: "Hillcrest",
    address: "1040 University Ave, San Diego, CA 92103",
    lookup: "1040 University Ave, San Diego, CA 92103",
    score: 83, price: 2, tags: ["Nepali","Indian","Casual","Family Friendly","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@himalayancuisinesd", website: "https://himalayancuisinesd.com",
    dishes: ["Momos","Chicken Tikka Masala","Daal Bhat","Hillcrest Lunch Buffet"],
    desc: "Hillcrest's Nepali-Indian dining room — momo dumplings, a full North Indian menu, and a University Ave room that has been one of SD's defining Himalayan restaurants. A Hillcrest neighborhood institution." },
  { name: "Surati Farsan Mart", cuisine: "Indian / Gujarati / Sweets", neighborhood: "Kearny Mesa",
    address: "4145 Convoy St, San Diego, CA 92111",
    lookup: "4145 Convoy St, San Diego, CA 92111",
    score: 85, price: 1, tags: ["Indian","Vegetarian","Sweets","Casual","Quick Bite","Hidden Gem","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://suratimart.com",
    dishes: ["Gujarati Farsan","Indian Sweets","Chaat Counter","Convoy Vegetarian Specialist"],
    desc: "Convoy's Gujarati sweets and farsan counter — Indian snacks, chaat, and a case full of barfi and ladoos, with a tight cafeteria-style sit-down room. The SD Gujarati community's shop-and-eat anchor." },
  { name: "Soltan Banoo", cuisine: "Persian", neighborhood: "University Heights",
    address: "4645 Park Blvd, San Diego, CA 92116",
    lookup: "4645 Park Blvd, San Diego, CA 92116",
    score: 84, price: 2, tags: ["Persian","Middle Eastern","Casual","Family Friendly","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@soltanbanoosd", website: "https://soltanbanoo.com",
    dishes: ["Koobideh","Joojeh Kebab","Tahdig","University Heights Patio"],
    desc: "University Heights' Persian kebab house — house-ground koobideh, joojeh, the crispy tahdig rice regulars fight for, and a Park Blvd dining room that runs as UH's defining Persian family-table default." },
  { name: "Plumeria Vegetarian Restaurant", cuisine: "Thai / Vegetarian / Vegan", neighborhood: "University Heights",
    address: "4661 Park Blvd, San Diego, CA 92116",
    lookup: "4661 Park Blvd, San Diego, CA 92116",
    score: 84, price: 2, tags: ["Thai","Vegetarian","Vegan","Casual","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@plumeriavegetarian", website: "https://plumeriavegetarian.com",
    dishes: ["Vegan Pad Thai","Massaman Curry","Mock-Duck Program","University Heights Room"],
    desc: "University Heights' all-vegetarian Thai kitchen — a vegan pad thai, mock-duck applications across the menu, and a Park Blvd dining room that SD's plant-based Thai eaters have treated as the default for two decades." },
  { name: "Eve Encinitas", cuisine: "Vegan / Plant-Based", neighborhood: "Encinitas",
    address: "575 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "575 S Coast Hwy 101, Encinitas, CA 92024",
    score: 84, price: 2, tags: ["Vegan","Plant-Based","Healthy","Brunch","Patio","Critics Pick","Trending","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@eveencinitas", website: "https://eveencinitas.com",
    dishes: ["Raw + Cooked Vegan","Bowls","Wellness Shots","101 Corridor Patio"],
    desc: "Encinitas' plant-based café on the 101 — bowls, wellness shots, a raw-and-cooked vegan menu, and a surf-coastal Encinitas crowd that made Eve one of the defining North County wellness rooms." },
  { name: "Chin's Szechwan Cuisine", cuisine: "Chinese / Sichuan", neighborhood: "Kearny Mesa",
    address: "4433 Convoy St, San Diego, CA 92111",
    lookup: "4433 Convoy St, San Diego, CA 92111",
    score: 83, price: 2, tags: ["Chinese","Sichuan","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Chin's",
    instagram: "", website: "https://chinsszechwan.com",
    dishes: ["Mongolian Beef","General Tso's","Kung Pao","Convoy Since 1987"],
    desc: "Convoy's Chin's Szechwan since 1987 — the Chin family's multi-location Chinese-American-meets-Sichuan dining room, with generations of SD regulars treating the Convoy St location as the family-table default." },
  { name: "SURF Korean BBQ", cuisine: "Korean / BBQ", neighborhood: "Kearny Mesa",
    address: "4465 Convoy St Ste 100, San Diego, CA 92111",
    lookup: "4465 Convoy St, San Diego, CA 92111",
    score: 84, price: 3, tags: ["Korean","BBQ","Date Night","Family Friendly","Local Favorites","Late Night"],
    reservation: "walk-in",
    instagram: "@surfkoreanbbq", website: "https://surfkoreanbbq.com",
    dishes: ["Tableside Grill","Marinated Short Rib","All-You-Can-Eat Program","Banchan Spread"],
    desc: "Convoy's Korean BBQ — tableside grills, marinated short rib, a banchan program that feeds the table before you order, and an all-you-can-eat format that Convoy's KBBQ regulars use as a reliable default." },
  { name: "The Smoking Gun", cuisine: "American / Gastropub", neighborhood: "Gaslamp",
    address: "555 Market St, San Diego, CA 92101",
    lookup: "555 Market St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["American","Gastropub","Cocktails","Patio","Late Night","Trending","Critics Pick"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@smokinggunsd", website: "https://thesmokinggunsd.com",
    dishes: ["Smoked Meats","Craft Cocktails","Kitchen-Forward Bar Menu","Gaslamp Corner"],
    desc: "CH Projects' Gaslamp gastropub — a smoked-meats-forward menu, a serious cocktail program, and a Market St corner that reads as the Gaslamp's grown-up alternative to the main-drag bar crawl. A defining CH Projects downtown room." },
  { name: "Leucadia Donut Shoppe", cuisine: "Dessert / Donuts", neighborhood: "Leucadia / Encinitas",
    address: "315 N Coast Hwy 101, Encinitas, CA 92024",
    lookup: "315 N Coast Hwy 101, Encinitas, CA 92024",
    score: 85, price: 1, tags: ["Dessert","Donuts","Bakery","Casual","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@leucadiadonutshop", website: "",
    dishes: ["Old-School Donuts","Maple Bar","Apple Fritter","Leucadia Since 1971"],
    desc: "Leucadia's 1971 donut shop — classic old-school yeast-and-cake donuts, apple fritters the size of a dinner plate, and a 101-corridor counter that North County surf crews have protected for five decades. A Leucadia constant." },
  { name: "Cafe Moto", cuisine: "Coffee / Cafe", neighborhood: "Barrio Logan",
    address: "2619 National Ave, San Diego, CA 92113",
    lookup: "2619 National Ave, San Diego, CA 92113",
    score: 86, price: 1, tags: ["Coffee","Cafe","Casual","Critics Pick","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Cafe Moto",
    instagram: "@cafemoto", website: "https://cafemoto.com",
    dishes: ["In-House Roasted Coffee","Direct-Trade Beans","Barrio Logan Roastery","Espresso Counter"],
    desc: "Cafe Moto's Barrio Logan roastery-and-café — one of SD's longest-running third-wave coffee roasters, a National Ave production facility with a café counter, and one of the SD coffee-origins stops on the craft-coffee map." },
  { name: "Picchu Peruvian", cuisine: "Peruvian", neighborhood: "Ocean Beach",
    address: "4191 Voltaire St, San Diego, CA 92107",
    lookup: "4191 Voltaire St, San Diego, CA 92107",
    score: 85, price: 2, tags: ["Peruvian","Casual","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@picchuperuviansd", website: "https://picchuperuvian.com",
    dishes: ["Ceviche Program","Lomo Saltado","Aji de Gallina","OB Peruvian Specialist"],
    desc: "Ocean Beach's Peruvian kitchen on Voltaire St — a ceviche bar, lomo saltado, and a dining room that runs as SD's most-specific Peruvian room outside the festival circuit. An OB specialist chapter." },
  { name: "Piacere Mio", cuisine: "Italian", neighborhood: "South Park",
    address: "1947 30th St, San Diego, CA 92102",
    lookup: "1947 30th St, San Diego, CA 92102",
    score: 85, price: 3, tags: ["Italian","Date Night","Patio","Local Favorites","Critics Pick","Iconic"],
    reservation: "OpenTable",
    instagram: "@piaceremiosouthpark", website: "https://piaceremiosouthpark.com",
    dishes: ["House-Made Pasta","Tuscan Program","South Park Dining Room","Neighborhood Italian Anchor"],
    desc: "South Park's Tuscan-style neighborhood Italian — a house-made pasta program, a 30th Street dining room, and a South Park-family crowd that has made Piacere Mio one of the neighborhood's longest-running dinner reservations." },
  { name: "Costa Brava Spanish Tapas", cuisine: "Spanish / Tapas", neighborhood: "Pacific Beach",
    address: "1653 Garnet Ave, San Diego, CA 92109",
    lookup: "1653 Garnet Ave, San Diego, CA 92109",
    score: 83, price: 3, tags: ["Spanish","Tapas","Date Night","Patio","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@costabravapb", website: "https://costabravapb.com",
    dishes: ["Paella Valenciana","Tapas Program","Sangria","PB Garnet Ave Patio"],
    desc: "Pacific Beach's long-running Spanish tapas room — paella Valenciana, a sangria-and-small-plates format, and a PB Garnet Ave dining room that feeds the neighborhood's grown-up dinner crowd. A PB Spanish anchor." },
  { name: "Donna Jean", cuisine: "Vegan / Plant-Based / Cocktails", neighborhood: "Bankers Hill",
    address: "2949 Fifth Ave, San Diego, CA 92103",
    lookup: "2949 5th Ave, San Diego, CA 92103",
    score: 87, price: 3, tags: ["Vegan","Plant-Based","Cocktails","Date Night","Trending","Critics Pick","Patio"],
    reservation: "Resy",
    instagram: "@donnajeansd", website: "https://donnajeansd.com",
    dishes: ["Plant-Based Chef's Menu","Craft Cocktails","5th Ave Patio","Trust Restaurant Group Format"],
    desc: "Bankers Hill's plant-based chef-driven dining room — a fully-vegan menu that surprises omnivores, a craft cocktail program that holds up beside the city's best bars, and one of the most-specific new dining rooms in SD. A defining Bankers Hill chef-kitchen." },
  { name: "Board & Brew — Carlsbad", cuisine: "American / Sandwiches", neighborhood: "Carlsbad",
    address: "201 Oak Ave, Carlsbad, CA 92008",
    lookup: "201 Oak Ave, Carlsbad, CA 92008",
    score: 85, price: 1, tags: ["American","Sandwiches","Casual","Quick Bite","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    group: "Board & Brew",
    instagram: "@boardandbrew", website: "https://boardandbrew.com",
    dishes: ["Ham + Cheese Sandwich","Mexi-Turkey","Secret Sauce Program","Carlsbad Since 1979"],
    desc: "Carlsbad's Board & Brew since 1979 — the sandwich shop North County surfers built the brand around, secret sauce, order-at-the-window format, and a Carlsbad Village original that spawned a multi-location SD-born brand." },
  { name: "West Steak & Seafood", cuisine: "Steakhouse / Seafood", neighborhood: "Carlsbad",
    address: "4980 Avenida Encinas, Carlsbad, CA 92008",
    lookup: "4980 Avenida Encinas, Carlsbad, CA 92008",
    score: 87, price: 4, tags: ["Fine Dining","Steakhouse","Seafood","Date Night","Celebrations","Critics Pick","Iconic"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@weststeakandseafood", website: "https://weststeakandseafood.com",
    dishes: ["USDA Prime Dry-Aged Steak","Chilean Sea Bass","Wine Cellar","Carlsbad Fine-Dining Room"],
    desc: "Carlsbad's West Steak & Seafood — a white-tablecloth steakhouse-and-seafood dining room, a dry-aged beef program, a wine cellar that reads as Carlsbad's deepest, and a North County special-occasion anchor." },
  { name: "Portside Pier", cuisine: "American / Seafood / Food Hall", neighborhood: "Downtown / Embarcadero",
    address: "1360 N Harbor Dr, San Diego, CA 92101",
    lookup: "1360 N Harbor Dr, San Diego, CA 92101",
    score: 84, price: 3, tags: ["American","Seafood","Scenic Views","Patio","Food Hall","Family Friendly","Iconic"],
    reservation: "OpenTable",
    group: "Brigantine Family",
    instagram: "@portsidepiersd", website: "https://portsidepier.com",
    dishes: ["Brigantine Seafood","Ketch Grill & Taps","Portside Coffee","Harbor-Pier Format"],
    desc: "The Brigantine Family's Embarcadero four-restaurant pier complex — Brigantine up top, Ketch Grill & Taps in the middle, Miguel's Cocina and Portside Coffee on the pier. Harbor-view dining on a working pier." },
  { name: "The Venetian", cuisine: "Italian", neighborhood: "Point Loma",
    address: "3663 Voltaire St, San Diego, CA 92107",
    lookup: "3663 Voltaire St, San Diego, CA 92107",
    score: 84, price: 3, tags: ["Italian","Date Night","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@thevenetiansd", website: "https://thevenetiansd.com",
    dishes: ["Neapolitan Pizza","Veal Marsala","House-Made Pasta","Point Loma Since 1965"],
    desc: "Point Loma's Voltaire St Italian since 1965 — the Zivkovich family's red-sauce Neapolitan dining room, a Point Loma generations-long family-dinner institution, and a Voltaire St room that anchored the neighborhood's Italian identity." }
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

const manualFallback = {
  "Royal India — Gaslamp":            { lat: 32.7108, lng: -117.1611 },
  "Bandar Fine Persian Cuisine":      { lat: 32.7136, lng: -117.1594 },
  "Donna Jean":                       { lat: 32.7417, lng: -117.1614 },  // 2949 5th Ave Bankers Hill
  "The Smoking Gun":                  { lat: 32.7107, lng: -117.1605 }
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

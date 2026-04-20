#!/usr/bin/env node
// San Diego batch 9 — East Village/Shelter Island/South Bay/Encinitas/RSF/Escondido (21 training-verified, final push to 150)
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
  { name: "The Blind Burro", cuisine: "Mexican", neighborhood: "East Village",
    address: "639 J St, San Diego, CA 92101",
    lookup: "639 J St, San Diego, CA 92101",
    score: 84, price: 2, tags: ["Mexican","Margaritas","Date Night","Patio","Local Favorites","Cocktails"],
    reservation: "OpenTable",
    instagram: "@blindburrosd", website: "https://blindburro.com",
    dishes: ["Braised Short Rib Tacos","Tableside Guacamole","100+ Tequilas","Petco Park-Adjacent Patio"],
    desc: "East Village's modern Mexican — a block from Petco Park, with a 100+ tequila library, tableside guacamole, and a patio that fills for every Padres home game. One of East Village's most-used pre-game rooms." },
  { name: "Soda & Swine", cuisine: "American / Meatballs / Pizza", neighborhood: "Normal Heights",
    address: "2943 Adams Ave, San Diego, CA 92116",
    lookup: "2943 Adams Ave, San Diego, CA 92116",
    score: 84, price: 2, tags: ["American","Pizza","Casual","Family Friendly","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@sodaandswine", website: "https://sodaandswine.com",
    dishes: ["Meatball Sliders","Neapolitan Pizza","Craft Soda","Beer Program"],
    desc: "CH Projects' meatball-and-pizza format — Normal Heights flagship with slider-sized meatball sandwiches, Neapolitan pies, and the kind of neighborhood-run dining room CH Projects built the brand on." },
  { name: "El Zarape", cuisine: "Mexican / Tacos", neighborhood: "University Heights",
    address: "4642 Park Blvd, San Diego, CA 92116",
    lookup: "4642 Park Blvd, San Diego, CA 92116",
    score: 85, price: 1, tags: ["Mexican","Tacos","Casual","Quick Bite","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@elzarapesd", website: "https://elzarapesd.com",
    dishes: ["Lobster Burrito","Scallop Taco","Fish Taco","Counter Line"],
    desc: "University Heights' order-counter taco shop — the lobster burrito is the local-legend call; the scallop taco and fish taco share the top of the shortlist. A neighborhood institution that regulars quietly protect." },
  { name: "Sea180° Coastal Tavern", cuisine: "American / Seafood", neighborhood: "Imperial Beach",
    address: "100 Palm Ave, Imperial Beach, CA 91932",
    lookup: "100 Palm Ave, Imperial Beach, CA 91932",
    score: 84, price: 3, tags: ["American","Seafood","Scenic Views","Date Night","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Pier South Resort",
    instagram: "@sea180", website: "https://sea180.com",
    dishes: ["Raw Bar","Local Seafood","Beachfront Patio","Pacific-Facing Dining"],
    desc: "Imperial Beach's pier-end coastal restaurant at Pier South Resort — a Pacific-facing patio that runs right to the sand, a raw-bar program, and the South Bay's most-serious ocean-view table." },
  { name: "TJ Oyster Bar", cuisine: "Mexican / Seafood", neighborhood: "Bonita",
    address: "4526 Bonita Rd, Bonita, CA 91902",
    lookup: "4526 Bonita Rd, Bonita, CA 91902",
    score: 86, price: 2, tags: ["Mexican","Seafood","Casual","Critics Pick","Iconic","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@tjoysterbar", website: "",
    dishes: ["Chocolata Clams","Aguachile","Ostiones (Oysters)","Tostada de Pulpo"],
    desc: "South Bay's Baja-style mariscos institution — raw chocolata clams, aguachile, and a crowd that drives from across SD County for the kind of Tijuana-dock menu you otherwise cross the border for. A local-legend seafood counter." },
  { name: "Tacos El Gordo — Chula Vista", cuisine: "Mexican / Tacos", neighborhood: "Chula Vista",
    address: "689 H St, Chula Vista, CA 91910",
    lookup: "689 H St, Chula Vista, CA 91910",
    score: 87, price: 1, tags: ["Mexican","Tacos","Casual","Late Night","Iconic","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    group: "Tacos El Gordo",
    instagram: "@tacoselgordo", website: "https://tacoselgordo.com",
    dishes: ["Adobada Taco","Al Pastor Trompo","Suadero","Lengua"],
    desc: "Tijuana's most-famous taquería crossed the border to Chula Vista — the adobada trompo, masa prep in-house, separate lines per meat. The SD tacos-arguably reference outside the border itself." },
  { name: "Stone Brewing World Bistro & Gardens — Escondido", cuisine: "American / Brewery", neighborhood: "Escondido",
    address: "1999 Citracado Pkwy, Escondido, CA 92029",
    lookup: "1999 Citracado Pkwy, Escondido, CA 92029",
    score: 86, price: 3, tags: ["American","Brewery","Patio","Date Night","Family Friendly","Iconic","Critics Pick","Scenic Views"],
    reservation: "OpenTable",
    suburb: true,
    group: "Stone Brewing",
    instagram: "@stonebrewing", website: "https://stonebrewing.com",
    dishes: ["Stone IPA","Arrogant Bastard","Elevated Brewpub Menu","Koi-Pond Gardens"],
    desc: "Stone's original Escondido production campus — sprawling koi-pond gardens, a chef-driven brewpub kitchen, and one of the country's destination brewery-restaurant compounds since 2006. The North County Stone experience." },
  { name: "Humphreys by the Bay", cuisine: "American / Seafood", neighborhood: "Shelter Island",
    address: "2241 Shelter Island Dr, San Diego, CA 92106",
    lookup: "2241 Shelter Island Dr, San Diego, CA 92106",
    score: 83, price: 3, tags: ["American","Seafood","Scenic Views","Date Night","Celebrations","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Humphreys",
    instagram: "@humphreysbythebay", website: "https://humphreysbythebay.com",
    dishes: ["Sunday Jazz Brunch","Local Seafood","Concert-Venue Patio","Bayfront Dining"],
    desc: "Shelter Island's bayfront restaurant and concert venue — the Humphreys Concerts series has run here for 40+ years, with a dining room overlooking Shelter Island harbor. The SD marina-view classic." },
  { name: "The Pearl Hotel Restaurant", cuisine: "Modern American / Mid-Century", neighborhood: "Point Loma",
    address: "1410 Rosecrans St, San Diego, CA 92106",
    lookup: "1410 Rosecrans St, San Diego, CA 92106",
    score: 84, price: 3, tags: ["American","Modern","Date Night","Patio","Cocktails","Iconic","Local Favorites"],
    reservation: "OpenTable",
    group: "The Pearl Hotel",
    instagram: "@thepearlsd", website: "https://thepearlsd.com",
    dishes: ["Taco Tuesday","Dive-In Movie Nights","Modern Small Plates","Mid-Century Poolside"],
    desc: "Point Loma's mid-century motor-lodge-turned-boutique — a poolside dining room with Taco Tuesdays and Dive-In movie nights that have become weekly SD events. The Pearl's format is its own category." },
  { name: "Union Kitchen & Tap — Encinitas", cuisine: "American / Gastropub", neighborhood: "Encinitas",
    address: "1108 S Coast Hwy 101, Encinitas, CA 92024",
    lookup: "1108 S Coast Hwy 101, Encinitas, CA 92024",
    score: 83, price: 2, tags: ["American","Gastropub","Patio","Date Night","Local Favorites","Craft Beer"],
    reservation: "OpenTable",
    suburb: true,
    group: "Union Kitchen & Tap",
    instagram: "@unionencinitas", website: "https://localunion101.com",
    dishes: ["Craft Beer Program","Brussels Sprouts","Short Rib","101 Patio"],
    desc: "Encinitas's 101 corridor gastropub — a serious craft-beer list, chef-driven comfort menu, and a sidewalk patio that's been one of North County's most-used bar dinners since opening." },
  { name: "Solace & The Moonlight Lounge", cuisine: "American / Modern", neighborhood: "Encinitas",
    address: "25 E E St, Encinitas, CA 92024",
    lookup: "25 E E St, Encinitas, CA 92024",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Patio","Cocktails","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    group: "Matt Gordon",
    instagram: "@solaceencinitas", website: "https://eatatsolace.com",
    dishes: ["Wood-Fired Menu","Farm-Sourced Plates","Moonlight Lounge Cocktails","Patio Program"],
    desc: "Chef Matt Gordon's Encinitas modern-American — a downstairs dining room with a wood-fired kitchen, the Moonlight Lounge upstairs for cocktails, and a farm-to-table sourcing program that locals treat as the Encinitas standard." },
  { name: "Haggo's Organic Taco", cuisine: "Mexican / Tacos", neighborhood: "Leucadia / Encinitas",
    address: "310 N El Camino Real, Encinitas, CA 92024",
    lookup: "310 N El Camino Real, Encinitas, CA 92024",
    score: 83, price: 1, tags: ["Mexican","Tacos","Casual","Organic","Local Favorites","Hidden Gem","Family Friendly"],
    reservation: "walk-in",
    suburb: true,
    instagram: "@haggostacos", website: "",
    dishes: ["Organic Fish Tacos","Tempeh Tacos","Surfer's Breakfast Burrito","Strip-Mall Counter"],
    desc: "Leucadia's organic taco counter — a surf-culture taqueria in a nondescript strip mall, famous among North County dawn patrols for tempeh tacos and fish tacos made from sustainably-sourced catches." },
  { name: "Market Restaurant + Bar", cuisine: "Californian / Farm-to-Table", neighborhood: "Del Mar",
    address: "3702 Via de la Valle, Del Mar, CA 92014",
    lookup: "3702 Via de la Valle, Del Mar, CA 92014",
    score: 90, price: 4, tags: ["Fine Dining","Californian","Farm-to-Table","Date Night","Celebrations","Critics Pick","Iconic","Michelin"],
    awards: "Michelin Recommended",
    reservation: "OpenTable",
    suburb: true,
    group: "Carl Schroeder",
    instagram: "@marketdelmar", website: "https://marketdelmar.com",
    dishes: ["Farm-Menu Tasting","Local Seafood","Seasonal Program","Counter Seats at the Kitchen"],
    desc: "Chef Carl Schroeder's Del Mar farm-to-table flagship — open since 2006, a menu built from daily produce calls to local growers, and a counter-at-the-kitchen option that reads like Del Mar's omakase for Californian. Michelin-recommended and a North County benchmark." },
  { name: "Mille Fleurs", cuisine: "French / Contemporary", neighborhood: "Rancho Santa Fe",
    address: "6009 Paseo Delicias, Rancho Santa Fe, CA 92067",
    lookup: "6009 Paseo Delicias, Rancho Santa Fe, CA 92067",
    score: 89, price: 4, tags: ["Fine Dining","French","Date Night","Celebrations","Critics Pick","Iconic"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "", website: "https://millefleurs.com",
    dishes: ["Daily Farmers Market Menu","Rack of Lamb","Sweetbreads","Grand Cru Wine List"],
    desc: "Rancho Santa Fe's French institution — open since 1981 inside the RSF village, with a daily farmers' market menu and a wine list that reads like RSF's private cellar. The SD County special-occasion Francophile table." },
  { name: "Azuki Sushi", cuisine: "Japanese / Sushi", neighborhood: "Bankers Hill",
    address: "2321 5th Ave, San Diego, CA 92101",
    lookup: "2321 5th Ave, San Diego, CA 92101",
    score: 86, price: 4, tags: ["Fine Dining","Japanese","Sushi","Date Night","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@azukisushi", website: "https://azukisushi.com",
    dishes: ["Omakase Counter","Seasonal Nigiri","Sake Program","Bankers Hill Dining Room"],
    desc: "Bankers Hill's serious sushi counter — an omakase-forward format, a sake program that locals actually drink from, and a reservation book that quietly marks Azuki as one of SD's most-respected sushi rooms outside of La Jolla and Convoy." },
  { name: "Bobboi Natural Gelato", cuisine: "Dessert / Gelato", neighborhood: "La Jolla",
    address: "8008 Girard Ave, La Jolla, CA 92037",
    lookup: "8008 Girard Ave, La Jolla, CA 92037",
    score: 85, price: 1, tags: ["Dessert","Gelato","Casual","Iconic","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@bobboi_natural_gelato", website: "https://bobboi.com",
    dishes: ["Italian-Trained Gelato","Fresh Fruit Sorbetto","Seasonal Flavors","Girard Ave Window"],
    desc: "La Jolla Village's Italian-trained gelato counter — a Girard Ave window, seasonal flavor rotation, and a product that gelato travelers rank alongside Rome. The La Jolla gelato reference." },
  { name: "Napizza — Little Italy", cuisine: "Italian / Pizza", neighborhood: "Little Italy",
    address: "1702 India St, San Diego, CA 92101",
    lookup: "1702 India St, San Diego, CA 92101",
    score: 84, price: 1, tags: ["Italian","Pizza","Casual","Quick Bite","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Napizza",
    instagram: "@napizza", website: "https://napizza.com",
    dishes: ["Roman-Style Pizza al Taglio","72-Hour Dough","Mortadella Pie","Sold by the Slice"],
    desc: "Little Italy's Roman-style pizza counter — pizza al taglio sold by weight, 72-hour dough, and the kind of slice program Romans actually recognize. The Little Italy grab-and-go anchor." },
  { name: "Rare Society — Solana Beach", cuisine: "Steakhouse / Modern American", neighborhood: "Solana Beach",
    address: "230 S Cedros Ave, Solana Beach, CA 92075",
    lookup: "230 S Cedros Ave, Solana Beach, CA 92075",
    score: 88, price: 4, tags: ["Fine Dining","Steakhouse","American","Date Night","Critics Pick","Trending","Patio"],
    reservation: "Resy",
    suburb: true,
    group: "Trust Restaurant Group / Brad Wise",
    instagram: "@raresocietysd", website: "https://raresocietysd.com",
    dishes: ["Dry-Aged Steak Program","Smoked Short Rib","Modern Chophouse Format","Cedros Patio"],
    desc: "Chef Brad Wise's Solana Beach chophouse — the original Rare Society, a modern steakhouse inside the Cedros Design District with a dry-aged program that made the Trust Restaurant Group a North County steakhouse force." },
  { name: "Hundred Proof", cuisine: "Modern American / Bar", neighborhood: "University Heights",
    address: "4130 Park Blvd, San Diego, CA 92103",
    lookup: "4130 Park Blvd, San Diego, CA 92103",
    score: 85, price: 3, tags: ["American","Modern","Cocktails","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    group: "Trust Restaurant Group / Brad Wise",
    instagram: "@hundredproofsd", website: "https://hundredproofsd.com",
    dishes: ["Chef-Driven Bar Menu","Whiskey Program","Open Kitchen","Park Blvd Patio"],
    desc: "Brad Wise's University Heights bar-and-kitchen — a serious whiskey program, open-kitchen format, and a Park Blvd patio that has become a University Heights weekly call. Trust Restaurant Group's barroom format." },
  { name: "City Tacos — Normal Heights", cuisine: "Mexican / Tacos", neighborhood: "Normal Heights",
    address: "3028 University Ave, San Diego, CA 92104",
    lookup: "3028 University Ave, San Diego, CA 92104",
    score: 84, price: 1, tags: ["Mexican","Tacos","Casual","Quick Bite","Local Favorites","Trending","Critics Pick"],
    reservation: "walk-in",
    group: "City Tacos",
    instagram: "@citytacosca", website: "https://citytacos.com",
    dishes: ["Gobernador","El Mar (Shrimp)","Vegetarian Taco Program","Craft Cocktails"],
    desc: "Normal Heights' chef-driven taco shop — a quick-service counter, craft-cocktail bar, and a menu that made the taqueria one of SD's most-decorated modern taco programs. The Normal Heights neighborhood shorthand." },
  { name: "Pacific Beach Fish Shop", cuisine: "Seafood / Casual", neighborhood: "Pacific Beach",
    address: "1775 Garnet Ave, San Diego, CA 92109",
    lookup: "1775 Garnet Ave, San Diego, CA 92109",
    score: 83, price: 2, tags: ["Seafood","Casual","Patio","Family Friendly","Local Favorites","Quick Bite"],
    reservation: "walk-in",
    group: "The Fish Shop",
    instagram: "@thefishshopsd", website: "https://thefishshopsd.com",
    dishes: ["Build-Your-Own Fish Tacos","Grilled Fish Plate","Poke Bowls","Garnet Ave Patio"],
    desc: "Pacific Beach's order-counter fish shop — build-your-own fish tacos and grilled plates from a fresh case, a Garnet Ave patio, and a format that became a multi-location SD brand. The PB easy-lunch call." }
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

function inSDBox(c) {
  return c.lat >= 32.45 && c.lat <= 33.40 && c.lng >= -117.40 && c.lng <= -116.75;
}

(async () => {
  const s = getArrSlice("SD_DATA");
  const arr = parseArr(s.slice);
  let nextId = arr.length ? maxId(arr) + 1 : 15000;
  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!c || !inSDBox(c)) {
      const simple = e.lookup.replace(/#\S+,?\s*/i, "").replace(/Ste \S+,?\s*/i, "");
      if (simple !== e.lookup) { await sleep(1100); c = await nominatim(simple); }
    }
    if (!c || !inSDBox(c)) { console.log(`  ❌ SKIP (${c ? `out-of-box ${c.lat},${c.lng}` : "no match"})`); continue; }
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

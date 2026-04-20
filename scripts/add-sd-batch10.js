#!/usr/bin/env node
// San Diego batch 10 — Point Loma + Liberty Station + more Little Italy + Mission Hills + North Park cluster (18 training-verified)
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
  { name: "Point Loma Seafoods", cuisine: "Seafood / Casual", neighborhood: "Point Loma",
    address: "2805 Emerson St, San Diego, CA 92106",
    lookup: "2805 Emerson St, San Diego, CA 92106",
    score: 88, price: 2, tags: ["Seafood","Casual","Quick Bite","Iconic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    instagram: "@pointlomaseafoods", website: "https://pointlomaseafoods.com",
    dishes: ["Smoked Tuna Sandwich","Fresh Fish Case","Ceviche","Harbor-View Deck"],
    desc: "San Diego's defining fish-market-and-lunch-counter since 1963 — boats unload on the dock, the smoked tuna sandwich is the legend, and the upstairs harbor-view deck has been an SD institution for three generations. One of the most-cited seafood counters on the West Coast." },
  { name: "Solare Ristorante", cuisine: "Italian", neighborhood: "Point Loma / Liberty Station",
    address: "2820 Roosevelt Rd, San Diego, CA 92106",
    lookup: "2820 Roosevelt Rd, San Diego, CA 92106",
    score: 85, price: 3, tags: ["Italian","Date Night","Patio","Local Favorites","Critics Pick","Live Music"],
    reservation: "OpenTable",
    instagram: "@solareristorante", website: "https://solarelounge.com",
    dishes: ["House-Made Pasta","Wood-Fired Pizza","Lounge Cocktails","Live Jazz Program"],
    desc: "Liberty Station's Italian anchor — chef Accursio Lotá in the kitchen, a separate lounge with live jazz, and a dining room that has quietly been one of SD's most-consistent Italian tables for over a decade. A Point Loma date-night standard." },
  { name: "Slater's 50/50 — Liberty Station", cuisine: "American / Burgers", neighborhood: "Point Loma / Liberty Station",
    address: "2750 Dewey Rd, San Diego, CA 92106",
    lookup: "2750 Dewey Rd, San Diego, CA 92106",
    score: 82, price: 2, tags: ["American","Burgers","Casual","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Slater's 50/50",
    instagram: "@slaters5050", website: "https://slaters5050.com",
    dishes: ["50/50 Burger (Ground Bacon + Beef)","Peanut Butter Bacon Burger","Craft Beer Program","Patio"],
    desc: "The indulgent burger chain's Liberty Station box — the 50/50 patty is ground bacon blended into ground beef, the menu reads like a dare, and the craft-beer list is taken seriously. A Liberty Station go-to for oversize American comfort food." },
  { name: "Civico 1845", cuisine: "Italian / Calabrian", neighborhood: "Little Italy",
    address: "1845 India St, San Diego, CA 92101",
    lookup: "1845 India St, San Diego, CA 92101",
    score: 87, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@civico1845", website: "https://civico1845.com",
    dishes: ["Calabrian Specialties","House-Made Pasta","'Nduja Program","Vegan Italian Menu"],
    desc: "Brothers Dario and Pietro Gallo's Little Italy Calabrian — one of the few rooms in SD with a dedicated 'nduja program and a parallel vegan Italian menu. Patio on India St, tight dining room, and a cooking style you don't find elsewhere in Little Italy." },
  { name: "Buon Appetito", cuisine: "Italian", neighborhood: "Little Italy",
    address: "1609 India St, San Diego, CA 92101",
    lookup: "1609 India St, San Diego, CA 92101",
    score: 84, price: 3, tags: ["Italian","Date Night","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@buonappetitosd", website: "https://buonappetitosd.com",
    dishes: ["Osso Buco","House-Made Pasta","Tableside Preparations","India Street Patio"],
    desc: "Little Italy's old-school Italian trattoria — white-tablecloth format, osso buco, tableside preparations, and a crowd of Little Italy regulars who've been ordering the same pasta for 20 years. A defining Little Italy old-guard room." },
  { name: "Mimmo's Italian Village", cuisine: "Italian / Deli", neighborhood: "Little Italy",
    address: "1743 India St, San Diego, CA 92101",
    lookup: "1743 India St, San Diego, CA 92101",
    score: 83, price: 1, tags: ["Italian","Casual","Quick Bite","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@mimmosvillage", website: "",
    dishes: ["Italian Sub","Lasagna","Counter-Service Format","Family-Run for Decades"],
    desc: "Little Italy's family-run counter-service Italian — a deli-and-cafeteria format, oversize subs, homemade lasagna, and the neighborhood's working-lunch move for generations of India St regulars." },
  { name: "Bencotto Italian Kitchen", cuisine: "Italian", neighborhood: "Little Italy",
    address: "750 W Fir St, San Diego, CA 92101",
    lookup: "750 W Fir St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Monello / Bencotto",
    instagram: "@bencottoitaliankitchen", website: "https://lovebencotto.com",
    dishes: ["Fresh Pasta Program","Build-Your-Own Pasta Format","Aperitivo","Fir St Corner"],
    desc: "Little Italy's build-your-own-pasta format — fresh pasta, chef-built signature combinations or customer-chosen sauces, and a sibling dining room to Monello next door. The Fir St corner anchor of the Bencotto/Monello family." },
  { name: "Pete's Seafood & Sandwich", cuisine: "Seafood / Sandwiches", neighborhood: "Mission Hills",
    address: "963 W Washington St, San Diego, CA 92103",
    lookup: "963 W Washington St, San Diego, CA 92103",
    score: 85, price: 2, tags: ["Seafood","Casual","Quick Bite","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@petesseafood", website: "https://petesseafoodsd.com",
    dishes: ["Tuna Melt","Grilled Fish Sandwich","Chowder","Counter Format"],
    desc: "Mission Hills' counter-service fish sandwich shop — tuna melts, grilled-fish sandwiches, and a reputation among chefs and regulars as the SD sandwich-counter reference for seafood. A defining Mission Hills quick-lunch call." },
  { name: "Nolita Hall", cuisine: "American / Pizza / Bar", neighborhood: "Little Italy",
    address: "2305 India St, San Diego, CA 92101",
    lookup: "2305 India St, San Diego, CA 92101",
    score: 84, price: 2, tags: ["American","Pizza","Casual","Patio","Cocktails","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@nolitahallsd", website: "https://nolitahall.com",
    dishes: ["Detroit-Style Pizza","Chicken Wings","Communal Patio","Beer Program"],
    desc: "CH Projects' Little Italy beer-and-pizza hall — Detroit-style square pies, a serious beer program, and a large indoor-outdoor format that became one of Little Italy's after-work standards. The casual CH Projects move." },
  { name: "Farmer's Bottega", cuisine: "Californian / Farm-to-Table", neighborhood: "Mission Hills",
    address: "860 W Washington St, San Diego, CA 92103",
    lookup: "860 W Washington St, San Diego, CA 92103",
    score: 85, price: 3, tags: ["Californian","Farm-to-Table","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@farmersbottega", website: "https://farmersbottega.com",
    dishes: ["Farmer's Salad","Seasonal Pasta","Weekend Brunch","Reclaimed-Barn-Wood Dining Room"],
    desc: "Mission Hills' farm-to-table neighborhood room — reclaimed-wood interior, produce sourced from SD County growers, and a weekend brunch line that tells you the locals put it on the weekly list. A defining Mission Hills room." },
  { name: "Shakespeare Pub & Grille", cuisine: "British / Gastropub", neighborhood: "Mission Hills",
    address: "3701 India St, San Diego, CA 92103",
    lookup: "3701 India St, San Diego, CA 92103",
    score: 82, price: 2, tags: ["British","Gastropub","Casual","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@shakespearepub", website: "https://shakespearepub.com",
    dishes: ["Fish & Chips","Bangers & Mash","Full English Breakfast","Beer Garden"],
    desc: "Mission Hills' British pub — fish and chips, bangers and mash, a full English breakfast on weekends, and a beer garden that stays full for Premier League matches. SD's defining English expat room since 1996." },
  { name: "Starlite", cuisine: "Modern American", neighborhood: "Mission Hills",
    address: "3175 India St, San Diego, CA 92103",
    lookup: "3175 India St, San Diego, CA 92103",
    score: 86, price: 3, tags: ["American","Modern","Date Night","Cocktails","Critics Pick","Iconic","Patio"],
    reservation: "OpenTable",
    instagram: "@starlitesandiego", website: "https://starlitesandiego.com",
    dishes: ["Starlite Mule","Chef-Driven Bar Menu","Design-Forward Dining Room","Cocktail Program"],
    desc: "Mission Hills' design-destination modern-American since 2008 — a sunken dining room with a light-sculpture ceiling, a Moscow Mule (in the original copper mug) that helped launch the SD cocktail revival, and a chef-driven menu that has outlasted most of its peers." },
  { name: "Jayne's Gastropub", cuisine: "American / Gastropub", neighborhood: "North Park",
    address: "4677 30th St, San Diego, CA 92116",
    lookup: "4677 30th St, San Diego, CA 92116",
    score: 86, price: 3, tags: ["American","Gastropub","Date Night","Patio","Critics Pick","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@jaynesgastropub", website: "https://jaynesgastropub.com",
    dishes: ["Sunday Pot Pie","Burger","Patio Program","Seasonal Cocktails"],
    desc: "Jayne Battle's North Park gastropub since 2007 — the pot pie Sundays became a neighborhood ritual, the burger a local-best-of, and the back patio one of North Park's longest-running neighborhood-room reservations. A defining 30th Street room." },
  { name: "West Coast Tavern", cuisine: "American / Gastropub", neighborhood: "North Park",
    address: "2895 University Ave, San Diego, CA 92104",
    lookup: "2895 University Ave, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Gastropub","Cocktails","Patio","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@westcoasttavern", website: "https://westcoasttavern.com",
    dishes: ["Brunch Program","Burger","Craft Cocktails","North Park Theatre-Adjacent"],
    desc: "Inside the 1928 North Park Theatre building — a two-story American tavern, weekend brunch crowd, and a bar that the theatre's show traffic funnels into every night. A North Park institution tied to the neighborhood's music calendar." },
  { name: "Mr. Moto Pizza House", cuisine: "Italian / Pizza", neighborhood: "North Park",
    address: "3385 30th St, San Diego, CA 92104",
    lookup: "3385 30th St, San Diego, CA 92104",
    score: 82, price: 1, tags: ["Italian","Pizza","Casual","Late Night","Local Favorites","Quick Bite"],
    reservation: "walk-in",
    group: "Mr. Moto Pizza",
    instagram: "@mrmotopizzahouse", website: "https://mrmotopizzahouse.com",
    dishes: ["NY-Style Slices","Sold by the Slice","Late-Night Counter","Beer Window"],
    desc: "North Park's NY-style slice counter — wide pies, sold by the slice, a beer window, and a late-night crowd that makes Mr. Moto the 30th St after-hours pizza call. The North Park slice move." },
  { name: "Breakfast Bitch", cuisine: "American / Brunch", neighborhood: "North Park",
    address: "3825 30th St, San Diego, CA 92104",
    lookup: "3825 30th St, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Brunch","Breakfast","Casual","LGBTQ+","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@breakfastbitch", website: "https://breakfastbitch.com",
    dishes: ["Mimosa Flights","Stuffed French Toast","Bennie Variations","Weekend Line"],
    desc: "North Park's LGBTQ+-owned bitchy-brunch phenomenon — mimosa flights, music-driven service, and a weekend line that became an SD brunch-destination ritual. One of the most specific brunch personalities in the city." },
  { name: "Park & Rec", cuisine: "American / Cocktail Bar", neighborhood: "University Heights",
    address: "4612 Park Blvd, San Diego, CA 92116",
    lookup: "4612 Park Blvd, San Diego, CA 92116",
    score: 85, price: 2, tags: ["American","Cocktail Bar","Patio","Local Favorites","Critics Pick","Trending"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@parkandrec", website: "https://parkandrecsd.com",
    dishes: ["Craft Cocktails","Patio Program","Bar Menu","Park Blvd Corner"],
    desc: "CH Projects' University Heights indoor-outdoor corner bar — one of the group's most-used neighborhood rooms, with a Park Blvd patio that locals default to. The casual-CH Projects University Heights anchor." },
  { name: "Sycamore Den", cuisine: "American / Cocktail Bar", neighborhood: "Normal Heights",
    address: "3391 Adams Ave, San Diego, CA 92116",
    lookup: "3391 Adams Ave, San Diego, CA 92116",
    score: 85, price: 2, tags: ["American","Cocktail Bar","Date Night","Critics Pick","Local Favorites","Trending","Late Night"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@sycamoredensd", website: "https://sycamoreden.com",
    dishes: ["Den-Lodge Cocktails","Small-Format Bar Menu","Wood-Paneled Room","Late-Night Program"],
    desc: "CH Projects' Normal Heights 1970s ski-lodge-themed cocktail bar — wood paneling, den-room format, and a cocktail list that reads like a national bar program dropped into a neighborhood corner. One of the most-specific cocktail rooms in SD." }
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
  const existingNames = new Set(arr.map(r => r.name.toLowerCase()));
  for (const e of entries) {
    if (existingNames.has(e.name.toLowerCase())) { console.log(`⏭  DUP: ${e.name}`); continue; }
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

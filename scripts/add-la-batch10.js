#!/usr/bin/env node
// LA batch 10 — Eater LA Venice (9 new, carefully written PL-voice cards)
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
  { name: "Dudley Market", cuisine: "Seafood / American", neighborhood: "Venice",
    address: "9 Dudley Ave, Venice, CA 90291",
    lookup: "9 Dudley Ave, Venice, CA 90291",
    score: 87, price: 3, tags: ["Seafood","American","Date Night","Patio","Wine Bar","Critics Pick"],
    reservation: "Resy",
    instagram: "@dudley_market", website: "https://dudleymarket.com",
    dishes: ["Raw Oysters","Crudo of the Day","Fried Fish Sando","House-Cut Fries"],
    desc: "Chef Jesse Barber's Venice seafood counter-turned-dinner-room — locally caught fish, a small crudo program, natural wine, and HiFi vinyl spinning after dark. The fried fish sando is the sleeper order; the oyster program is the dinner centerpiece. One block from the beach, loud in the best way." },
  { name: "Coucou", cuisine: "French Bistro", neighborhood: "Venice",
    address: "218 Main St, Venice, CA 90291",
    lookup: "218 Main St, Venice, CA 90291",
    score: 88, price: 3, tags: ["French","Date Night","Patio","Cocktails","Critics Pick","Trending"],
    reservation: "Resy",
    instagram: "@coucou_venice", website: "",
    dishes: ["Steak Frites","Hamachi Ceviche","$25 Martini","Chocolate Mousse"],
    desc: "Venice's Main Street French bistro with updated classics and a bar program that earns the $25 martini price tag. Steak frites with the correct peppercorn sauce, hamachi ceviche that reads more coastal-California than French, and a dining room that's become a Venice weekend reservation before it even finished its first summer." },
  { name: "La Isla Bonita", cuisine: "Mexican / Seafood", neighborhood: "Venice",
    address: "400 Rose Ave, Venice, CA 90291",
    lookup: "400 Rose Ave, Venice, CA 90291",
    score: 85, price: 2, tags: ["Mexican","Seafood","Casual","Local Favorites","Quick Bite","Hidden Gem"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Ceviche Tostada","Shrimp Tostada","Coctel de Camarones","Fish Tacos"],
    desc: "A taco-truck-turned-sit-down that made ceviche tostadas Venice's most reliable beach lunch. Chopped fish and shrimp piled over crisp corn tostadas, seafood cocteles that belong at a Sinaloa pier, and tacos that will forever embarrass every Westside gentrified taco chain. Cash-preferred; plan parking." },
  { name: "The Wee Chippy", cuisine: "British / Fish and Chips", neighborhood: "Venice",
    address: "1301 Ocean Front Walk, Venice, CA 90291",
    lookup: "1301 Ocean Front Walk, Venice, CA 90291",
    score: 82, price: 2, tags: ["British","Seafood","Casual","Quick Bite","Patio"],
    reservation: "walk-in",
    instagram: "@theweechippy", website: "",
    dishes: ["Cod Fish & Chips","Gluten-Free Fish","Malt Vinegar","Mushy Peas"],
    desc: "Boardwalk fish-and-chips done the way a Brit would actually recognize it. Beer batter that shatters, hand-cut fries fried twice, malt vinegar on the table. Also runs a gluten-free batter program that a shocking number of chippies don't. A Venice beach-walk lunch with real integrity." },
  { name: "El Huarique", cuisine: "Peruvian", neighborhood: "Venice",
    address: "1301 Ocean Front Walk Ste 10, Venice, CA 90291",
    lookup: "1301 Ocean Front Walk, Venice, CA 90291",
    score: 84, price: 2, tags: ["Peruvian","Casual","Quick Bite","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@elhuariqueperuvian", website: "",
    dishes: ["Pollo a la Brasa","Ceviche Clásico","Lomo Saltado","Aji Verde"],
    desc: "Boardwalk-adjacent Peruvian counter serving the rotisserie-chicken-and-aji-verde formula that every good Peruvian place gets right. Lomo saltado with proper char, ceviche with the right leche de tigre acidity, plantains that haven't turned to mush. Venice's most under-discussed lunch at the sand." },
  { name: "American Beauty", cuisine: "Steakhouse / Californian", neighborhood: "Venice",
    address: "425 Rose Ave, Venice, CA 90291",
    lookup: "425 Rose Ave, Venice, CA 90291",
    score: 88, price: 4, tags: ["Steakhouse","California","Date Night","Cocktails","Critics Pick","Patio"],
    reservation: "Resy",
    instagram: "@americanbeautyvenice", website: "https://americanbeautyla.com",
    dishes: ["Almond-Wood Grilled Ribeye","Signature Hash Browns","Tableside Caesar","Wagyu Tartare"],
    desc: "The Venice answer to the modern-steakhouse question. Almond-wood grills bringing a subtle smoke to the ribeye, hash browns that became their own cult order, and a Caesar done tableside with anchovies you can see. Patio is lit; room stays loud; one of Rose Avenue's most-booked dinners." },
  { name: "Market Venice", cuisine: "Italian / Californian", neighborhood: "Venice",
    address: "72 Market St, Venice, CA 90291",
    lookup: "72 Market St, Venice, CA 90291",
    score: 86, price: 3, tags: ["Italian","California","Date Night","Patio","Local Favorites"],
    reservation: "Resy",
    instagram: "@marketvenice", website: "",
    dishes: ["Handmade Pasta","Crispy Fried Potatoes","Seasonal Salad","Whole Branzino"],
    desc: "Venice's market-driven Italian where the pasta program changes with the farm delivery. Punchy salads with proper acid, fried potatoes you'd swear belonged at a French bistro, a weekly-rotating menu that rewards return visits. Patio is small and the reservation tightens every year." },
  { name: "Only The Wild Ones", cuisine: "Wine Bar", neighborhood: "Venice",
    address: "1031 Abbot Kinney Blvd, Venice, CA 90291",
    lookup: "1031 Abbot Kinney Blvd, Venice, CA 90291",
    score: 85, price: 3, tags: ["Wine Bar","Natural Wine","Date Night","Trending","Cocktails"],
    reservation: "walk-in",
    instagram: "@onlythewildones", website: "",
    dishes: ["Natural Wine Flight","Seasonal Small Plates","Cheese Board","House Vermouth"],
    desc: "Abbot Kinney wine-and-vinyl bar with a tightly curated natural list and bartenders who can actually talk through it. Small plates that are better than they need to be, listening-room atmosphere most of the night, and one of the prettier bar programs on the Westside. Walk-in; arrive before the crowd." },
  { name: "Hinano Cafe", cuisine: "Burgers / Dive Bar", neighborhood: "Venice",
    address: "15 Washington Blvd, Venice, CA 90292",
    lookup: "15 Washington Blvd, Venice, CA 90292",
    score: 84, price: 1, tags: ["American","Burgers","Dive Bar","Historic","Iconic","Local Favorites","Live Music"],
    reservation: "walk-in",
    instagram: "@hinanocafe", website: "",
    dishes: ["Burger","Fries","Cheap Draft Beer","Peanut Shells on the Floor"],
    desc: "Operating since 1962 on the Venice Pier end of Washington Blvd, Hinano is the rare dive bar where the burger is actually famous — loose patty, soft bun, yellow American, all the details right. Peanut shells on the floor, live music some nights, and a crowd mixing surfers, Venice lifers, and Brentwood refugees. The anti-Abbot-Kinney." }
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
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const s = getArrSlice("LA_DATA");
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
      score: e.score, price: e.price, tags: e.tags, indicators: [],
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
})();

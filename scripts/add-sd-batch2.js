#!/usr/bin/env node
// San Diego batch 2 — Gaslamp + Downtown + La Jolla flagships (training-verified)
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
  // Addison retry with known resort coords (Fairmont Grand Del Mar location)
  { name: "Addison at The Fairmont Grand Del Mar", cuisine: "Contemporary / Tasting Menu", neighborhood: "Del Mar",
    address: "5200 Grand Del Mar Way, San Diego, CA 92130",
    lookup: "5300 Grand Del Mar Ct, San Diego, CA 92130",
    score: 98, price: 4, tags: ["Fine Dining","Contemporary","Tasting Menu","Date Night","Celebrations","Critics Pick","Iconic","Michelin"],
    awards: "Michelin 3-Star",
    reservation: "Tock",
    group: "Fairmont Grand Del Mar",
    instagram: "@addisondelmar", website: "https://addisondelmar.com",
    dishes: ["10-Course Tasting Menu","Wine Pairing","Caviar Course","Seasonal Degustation"],
    desc: "Chef William Bradley's Michelin three-star at the Fairmont Grand Del Mar — San Diego's only three-star restaurant and the first in California to earn the top rank outside LA/SF. Tasting-menu format, polished service, a Relais & Châteaux dining room that justifies every course. One of the most serious special-occasion dinners in the western US." },
  { name: "Lionfish", cuisine: "Seafood / Modern", neighborhood: "Gaslamp Quarter",
    address: "435 5th Ave, San Diego, CA 92101",
    lookup: "435 5th Ave, San Diego, CA 92101",
    score: 88, price: 4, tags: ["Seafood","Modern","Date Night","Celebrations","Cocktails","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Pendry San Diego",
    instagram: "@lionfishsd", website: "https://lionfishsd.com",
    dishes: ["Sushi Program","Whole Grilled Branzino","Seafood Tower","Signature Cocktail"],
    desc: "Pendry Hotel Gaslamp's modern seafood flagship — sushi program, whole grilled branzino, and a dining room engineered for a proper Gaslamp dinner. The Pendry opened in 2017 and Lionfish has been the anchor since." },
  { name: "Lola 55", cuisine: "Mexican / Tacos", neighborhood: "East Village",
    address: "1290 F St, San Diego, CA 92101",
    lookup: "1290 F St, San Diego, CA 92101",
    score: 87, price: 2, tags: ["Mexican","Tacos","Casual","Patio","Cocktails","Critics Pick","Trending"],
    reservation: "walk-in",
    instagram: "@lola55sd", website: "https://lola55.com",
    dishes: ["Al Pastor Taco","Brisket Taco","Elote Kernel","Tequila Flight"],
    desc: "Modern East Village taqueria — nixtamalized-masa tortillas made in-house, al pastor off a proper trompo, brisket tacos that draw out the stadium-game crowd. One of East Village's most-referenced casual dinners, a block from Petco Park." },
  { name: "Cowboy Star", cuisine: "Steakhouse / Modern", neighborhood: "East Village",
    address: "640 10th Ave, San Diego, CA 92101",
    lookup: "640 10th Ave, San Diego, CA 92101",
    score: 89, price: 4, tags: ["Fine Dining","Steakhouse","American","Date Night","Celebrations","Cocktails","Iconic"],
    reservation: "OpenTable",
    instagram: "@cowboystarsd", website: "https://cowboystar.com",
    dishes: ["Dry-Aged Ribeye","Wagyu Tomahawk","Tableside Steak Tartare","In-House Butcher Shop"],
    desc: "East Village steakhouse with an in-house butcher shop attached — dry-aged program visible through the window, wagyu tomahawks carved tableside, and a cocktail bar that holds its own. The San Diego chophouse argument." },
  { name: "Rustic Root", cuisine: "American / Rooftop", neighborhood: "Gaslamp Quarter",
    address: "535 5th Ave, San Diego, CA 92101",
    lookup: "535 5th Ave, San Diego, CA 92101",
    score: 86, price: 3, tags: ["American","Rooftop","Date Night","Patio","Cocktails","Brunch","Scenic Views"],
    reservation: "OpenTable",
    instagram: "@rusticrootsd", website: "https://rusticrootsd.com",
    dishes: ["Rooftop Patio","Seasonal Menu","Brunch Program","Signature Cocktails"],
    desc: "Gaslamp rooftop dining room — open-air patio looking over 5th Ave, a modern-American menu that scales across brunch/lunch/dinner, and one of the Gaslamp's most consistent rooftop scenes. A reliable pre-show or post-Padres-game stop." },
  { name: "Grant Grill", cuisine: "American / Contemporary", neighborhood: "Downtown San Diego",
    address: "326 Broadway, San Diego, CA 92101",
    lookup: "326 Broadway, San Diego, CA 92101",
    score: 89, price: 4, tags: ["Fine Dining","American","Date Night","Celebrations","Historic","Iconic","Cocktails"],
    reservation: "OpenTable",
    group: "The US Grant Hotel",
    instagram: "@grantgrillsd", website: "https://grantgrill.com",
    dishes: ["Mock Turtle Soup","Dry-Aged Steak","Seasonal Tasting","Classic Cocktail Program"],
    desc: "Inside the 1910 US Grant Hotel — a historic grill room with a century of downtown San Diego business-and-power dining behind it. Mock turtle soup on the menu as the house classic, dry-aged steaks, and a cocktail bar that stays sharp for the hotel-guest crowd." },
  { name: "Prohibition", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "Gaslamp Quarter",
    address: "548 5th Ave, San Diego, CA 92101",
    lookup: "548 5th Ave, San Diego, CA 92101",
    score: 88, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Historic","Iconic","Late Night"],
    reservation: "walk-in",
    instagram: "@prohibitionsd", website: "https://prohibitionsd.com",
    dishes: ["Classic Prohibition-Era Cocktails","Rare Spirit Program","Jazz Nights","Dress-Code Service"],
    desc: "Gaslamp basement speakeasy accessed through an unmarked door — jazz most nights, dress code enforced, cocktail menu that reads like a Prohibition-era field manual. Entry is part of the experience; the cocktails earn the ceremony." },
  { name: "The Marine Room", cuisine: "Contemporary / Coastal", neighborhood: "La Jolla",
    address: "2000 Spindrift Dr, La Jolla, CA 92037",
    lookup: "2000 Spindrift Dr, La Jolla, CA 92037",
    score: 89, price: 4, tags: ["Fine Dining","Coastal","American","Date Night","Celebrations","Romantic","Scenic Views","Historic","Iconic"],
    reservation: "OpenTable",
    group: "La Jolla Beach & Tennis Club",
    instagram: "@themarineroomsd", website: "https://marineroom.com",
    dishes: ["High-Tide Breakfast Menu","Dover Sole","Halibut","Classic French Technique"],
    desc: "Operating since 1941 — the restaurant at La Jolla Beach & Tennis Club, famously on the water with waves crashing against the windows during high tide. High-tide breakfast is a San Diego bucket-list event; the dinner menu is classic French technique applied to Pacific seafood." },
  { name: "George's at the Cove", cuisine: "Californian / Coastal", neighborhood: "La Jolla",
    address: "1250 Prospect St, La Jolla, CA 92037",
    lookup: "1250 Prospect St, La Jolla, CA 92037",
    score: 90, price: 4, tags: ["Fine Dining","California","Modern","Date Night","Celebrations","Scenic Views","Patio","Iconic","Rooftop"],
    reservation: "OpenTable",
    group: "George's at the Cove",
    instagram: "@georgesatthecove", website: "https://georgesatthecove.com",
    dishes: ["Modern California Tasting","Rooftop Ocean Terrace","Local Seafood","California Wine List"],
    desc: "Chef Trey Foshee's three-concept La Jolla landmark — the Ocean Terrace rooftop, California Modern dining room, and Level 2 bar — all overlooking La Jolla Cove. The San Diego restaurant most likely to end up on a national best-of-US list; the rooftop view is one of SoCal's most famous dining views." },
  { name: "Nine-Ten", cuisine: "Californian / Contemporary", neighborhood: "La Jolla",
    address: "910 Prospect St, La Jolla, CA 92037",
    lookup: "910 Prospect St, La Jolla, CA 92037",
    score: 89, price: 4, tags: ["Fine Dining","California","Modern","Date Night","Celebrations","Patio","Critics Pick"],
    reservation: "OpenTable",
    group: "Grande Colonial La Jolla",
    instagram: "@ninetensd", website: "https://nine-ten.com",
    dishes: ["Mercy of the Chef Tasting","Seasonal Market Menu","California Wine","Patio Dining"],
    desc: "Inside the historic Grande Colonial La Jolla hotel — chef Jason Knibb's California-seasonal dining room, with a 'Mercy of the Chef' tasting menu format that rewards trusting the kitchen. Intimate, polished, and one of La Jolla's most consistently excellent dinners." },
  { name: "Puesto La Jolla", cuisine: "Mexican / Tacos", neighborhood: "La Jolla",
    address: "1026 Wall St, La Jolla, CA 92037",
    lookup: "1026 Wall St, La Jolla, CA 92037",
    score: 88, price: 2, tags: ["Mexican","Tacos","Casual","Patio","Date Night","Local Favorites","Iconic"],
    reservation: "OpenTable",
    group: "Puesto",
    instagram: "@puestomextacos", website: "https://eatpuesto.com",
    dishes: ["Melted Cheese Taco","Chicken Al Pastor","Shrimp Taco","Mezcal Program"],
    desc: "Puesto's La Jolla original — the melted-cheese-on-the-tortilla format that has turned Puesto into a multi-city California chain. La Jolla Village patio, Mexico-sourced produce, and a mezcal program that takes the spirit seriously. A reliable upscale-casual dinner." },
  { name: "Eddie V's La Jolla", cuisine: "Seafood / Steakhouse", neighborhood: "La Jolla",
    address: "1270 Prospect St, La Jolla, CA 92037",
    lookup: "1270 Prospect St, La Jolla, CA 92037",
    score: 87, price: 4, tags: ["Fine Dining","Seafood","Steakhouse","Date Night","Celebrations","Live Music","Cocktails","Scenic Views"],
    reservation: "OpenTable",
    group: "Darden / Eddie V's",
    instagram: "@eddievs", website: "https://eddiev.com",
    dishes: ["Chilean Sea Bass","Prime Ribeye","Live Jazz V Lounge","Oysters"],
    desc: "The Eddie V's La Jolla outpost — upscale seafood-and-steakhouse chain with live jazz in the V Lounge every night, Chilean sea bass as the anchor order, and one of La Jolla's better-booked special-occasion dinners. A consistent chain-done-right." },
  { name: "Galaxy Taco", cuisine: "Mexican / Tacos", neighborhood: "La Jolla",
    address: "2259 Avenida De La Playa, La Jolla, CA 92037",
    lookup: "2259 Avenida De La Playa, La Jolla, CA 92037",
    score: 87, price: 2, tags: ["Mexican","Tacos","Casual","Patio","Local Favorites","Critics Pick","Trending"],
    reservation: "walk-in",
    group: "Trey Foshee",
    instagram: "@galaxytaco", website: "https://galaxytaco.com",
    dishes: ["Handmade Blue Corn Tortillas","Octopus Taco","Pozole Rojo","Mexican Hot Chocolate"],
    desc: "Chef Trey Foshee's (George's at the Cove) La Jolla Shores taqueria — handmade blue-corn tortillas pressed and griddled in-house, regional Mexican fillings, and a beach-walking crowd that turns the patio over through the afternoon. The Shores lunch anchor." },
  { name: "Juniper and Ivy Sister — NOT LISTED (placeholder comment)", cuisine: "SKIP", neighborhood: "", address: "", lookup: "" }
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
    let c = await nominatim(e.lookup);
    if (!c && e.name.startsWith("Addison")) {
      // Manual fallback for Addison (Fairmont Grand Del Mar)
      c = { lat: 32.9528, lng: -117.2119 };
      console.log(`  Using manual coords for Addison`);
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

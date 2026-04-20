#!/usr/bin/env node
// San Diego batch 25 — institutional-only (multi-decade anchors + hospitality-group multi-loc) (17)
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
  { name: "Casa de Bandini", cuisine: "Mexican", neighborhood: "Carlsbad",
    address: "1901 Calle Barcelona, Carlsbad, CA 92009",
    lookup: "1901 Calle Barcelona, Carlsbad, CA 92009",
    score: 84, price: 3, tags: ["Mexican","Patio","Family Friendly","Iconic","Celebrations","Margaritas"],
    reservation: "OpenTable",
    suburb: true,
    group: "Bazaar del Mundo",
    instagram: "@casadebandini", website: "https://casadebandini.com",
    dishes: ["Birdbath Margarita","Carnitas","Mariachi Fountain Patio","Moved from Old Town 2009"],
    desc: "Diane Powers' Bazaar del Mundo Mexican — originally Old Town's 1829 Casa de Bandini adobe, the restaurant moved to this Carlsbad Calle Barcelona space in 2009. The birdbath margaritas and mariachi-patio format moved with it. A Bazaar del Mundo North County anchor." },
  { name: "Kaiserhof Restaurant & Bar", cuisine: "German", neighborhood: "Ocean Beach",
    address: "2253 Sunset Cliffs Blvd, San Diego, CA 92107",
    lookup: "2253 Sunset Cliffs Blvd, San Diego, CA 92107",
    score: 85, price: 3, tags: ["German","Date Night","Patio","Iconic","Local Favorites","Beer Garden"],
    reservation: "OpenTable",
    instagram: "@kaiserhofsd", website: "https://kaiserhofrestaurant.com",
    dishes: ["Schweinshaxe (Pork Shank)","Jaegerschnitzel","German Beer List","Beer Garden Patio"],
    desc: "Ocean Beach's German institution since 1987 — schweinshaxe pork shank, jaegerschnitzel, a serious German and Bavarian beer list, and the kind of beer-garden patio where SD's German expat community has been anchored for almost 40 years." },
  { name: "Studio Diner", cuisine: "American / Diner", neighborhood: "Kearny Mesa",
    address: "4701 Ruffin Rd, San Diego, CA 92123",
    lookup: "4701 Ruffin Rd, San Diego, CA 92123",
    score: 83, price: 2, tags: ["American","Diner","Breakfast","Late Night","Casual","24-Hour","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@studiodinersd", website: "https://studiodiner.com",
    dishes: ["Diner Breakfast","Chili Size","24-Hour Format","Stu Segall Production Studios-Adjacent"],
    desc: "Kearny Mesa's Studio Diner — a 24-hour stainless-steel diner inside Stu Segall Productions' film studio complex, a full American diner menu that feeds SD's overnight crews and airport-adjacent crowd. An unexpected SD constant." },
  { name: "Burger Lounge — Kensington", cuisine: "American / Burgers", neighborhood: "Kensington",
    address: "4161 Adams Ave, San Diego, CA 92116",
    lookup: "4161 Adams Ave, San Diego, CA 92116",
    score: 84, price: 2, tags: ["American","Burgers","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Burger Lounge",
    instagram: "@burgerlounge", website: "https://burgerlounge.com",
    dishes: ["Grass-Fed Lounge Burger","Organic Menu Program","House-Made Lemonade","Kensington Original Since 2007"],
    desc: "The Kensington Burger Lounge original since 2007 — SD chef Dean Loring's grass-fed-organic burger-shop format that grew from this Adams Ave storefront into a multi-state chain. A Kensington SD-born anchor." },
  { name: "D Bar — Hillcrest", cuisine: "American / Dessert Bar", neighborhood: "Hillcrest",
    address: "3930 Fifth Ave, San Diego, CA 92103",
    lookup: "3930 5th Ave, San Diego, CA 92103",
    score: 85, price: 3, tags: ["American","Dessert","Date Night","Cocktails","Trending","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    group: "Chef Keegan Gerhard",
    instagram: "@dbarsd", website: "https://dbarsandiego.com",
    dishes: ["Pastry-Program Desserts","Elevated Small Plates","Craft Cocktails","Hillcrest Dining Room"],
    desc: "Chef Keegan Gerhard's Hillcrest dessert bar — a full savory menu plus a pastry-chef-driven dessert program that reads as one of SD's most-specific after-dinner rooms. The Gerhard pastry reputation anchors the format." },
  { name: "Casa Sol y Mar", cuisine: "Mexican", neighborhood: "Carmel Valley / Del Mar Heights",
    address: "12865 El Camino Real, San Diego, CA 92130",
    lookup: "12865 El Camino Real, San Diego, CA 92130",
    score: 83, price: 3, tags: ["Mexican","Date Night","Patio","Family Friendly","Local Favorites","Margaritas"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@casasolymar", website: "https://casasolymar.com",
    dishes: ["Sinaloa-Style Mexican","Molcajete","Hand-Made Tortillas","Del Mar Highlands Patio"],
    desc: "Del Mar Highlands' Mexican room — Sinaloa-influenced menu, molcajete service, a patio fountain courtyard, and a North County family-dinner default for Carmel Valley for over two decades." },
  { name: "Water Grill", cuisine: "Seafood / Fine Dining", neighborhood: "Gaslamp",
    address: "615 J St, San Diego, CA 92101",
    lookup: "615 J St, San Diego, CA 92101",
    score: 88, price: 4, tags: ["Fine Dining","Seafood","Date Night","Celebrations","Critics Pick","Iconic","Oyster Bar"],
    reservation: "OpenTable",
    group: "King's Seafood Company",
    instagram: "@watergrillsd", website: "https://watergrill.com",
    dishes: ["Raw Bar Program","Whole Fish","Shellfish Tower","Petco-Park-Adjacent Dining Room"],
    desc: "King's Seafood Company's Water Grill — the LA seafood institution's Gaslamp sister at 6th and J, a raw bar that's cited among the country's best, and the kind of Padres-game-night special-occasion seafood room SD was missing." },
  { name: "The Brigantine — Shelter Island", cuisine: "American / Seafood", neighborhood: "Point Loma",
    address: "2725 Shelter Island Dr, San Diego, CA 92106",
    lookup: "2725 Shelter Island Dr, San Diego, CA 92106",
    score: 83, price: 3, tags: ["American","Seafood","Scenic Views","Date Night","Iconic","Patio","Family Friendly"],
    reservation: "OpenTable",
    group: "Brigantine Family",
    instagram: "@brigantinerestaurants", website: "https://brigantine.com",
    dishes: ["Swordfish","Happy Hour Program","Bay-Facing Patio","Shelter Island Marina Views"],
    desc: "The Brig's Shelter Island location — bayfront patio on Shelter Island's marina strip, the same Brigantine Family swordfish and happy-hour format that anchors the brand, in one of the most-scenic Brig settings in SD." },
  { name: "Filippi's Pizza Grotto — Escondido", cuisine: "Italian / Pizza", neighborhood: "Escondido",
    address: "114 W Grand Ave, Escondido, CA 92025",
    lookup: "114 W Grand Ave, Escondido, CA 92025",
    score: 82, price: 2, tags: ["Italian","Pizza","Family Friendly","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    group: "Filippi's",
    instagram: "@filippispizzagrotto", website: "https://realcheesepizza.com",
    dishes: ["NY-Style Pizza","Red-Checkered Tablecloths","Deli Entrance","Escondido Village Sister Location"],
    desc: "Filippi's Escondido Village location — the Little Italy original's North County sister, with the same deli-entrance format, red-checkered tablecloths, and Italian-American menu that's been fed from the 1950 SD Filippi's playbook." },
  { name: "Oggi's Pizza & Brewing — Del Mar", cuisine: "Italian / Pizza / Brewery", neighborhood: "Del Mar",
    address: "12840 Carmel Country Rd, San Diego, CA 92130",
    lookup: "12840 Carmel Country Rd, San Diego, CA 92130",
    score: 82, price: 2, tags: ["Italian","Pizza","Brewery","Family Friendly","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    group: "Oggi's Sports Brewhouse Pizza",
    instagram: "@oggissportsbrewhousepizza", website: "https://oggis.com",
    dishes: ["House-Brewed Beer","Deep-Dish Pizza","Sports TVs","Del Mar Original Since 1991"],
    desc: "Oggi's Pizza & Brewing Del Mar original since 1991 — the SD-born pizza-and-brewery chain's founding location, a sports-bar-plus-brewpub format that grew from this Del Mar Highlands room into a multi-state operation." },
  { name: "The Original Pancake House — Kearny Mesa", cuisine: "American / Breakfast", neighborhood: "Kearny Mesa",
    address: "3906 Convoy St, San Diego, CA 92111",
    lookup: "3906 Convoy St, San Diego, CA 92111",
    score: 83, price: 2, tags: ["American","Breakfast","Brunch","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "The Original Pancake House",
    instagram: "@originalpancakehouse", website: "https://originalpancakehouse.com",
    dishes: ["Dutch Baby","Apple Pancake","German Pancake","Family-Breakfast Crowd"],
    desc: "The Original Pancake House — the national breakfast chain's SD Convoy location, a Dutch Baby and apple pancake that are the brand's signature anchors, and a weekend line that fills Kearny Mesa's family-breakfast slot." },
  { name: "Urge American Gastropub — Rancho Bernardo", cuisine: "American / Gastropub / Brewery", neighborhood: "Rancho Bernardo",
    address: "16761 Bernardo Center Dr, San Diego, CA 92128",
    lookup: "16761 Bernardo Center Dr, San Diego, CA 92128",
    score: 83, price: 3, tags: ["American","Gastropub","Brewery","Patio","Family Friendly","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    suburb: true,
    group: "Urge Gastropub",
    instagram: "@urgegastropub", website: "https://urgegastropub.com",
    dishes: ["Chef-Driven Gastropub Menu","50+ Craft Taps","Rancho Bernardo Patio","North Inland SD Anchor"],
    desc: "Urge Common House Rancho Bernardo — a craft-beer gastropub that anchored the Rancho Bernardo town center, 50+ taps, chef-driven menu, and a dining room that serves as the North Inland SD neighborhood anchor." },
  { name: "Iron Fist Brewing Co.", cuisine: "American / Brewery", neighborhood: "Vista",
    address: "1305 Hot Springs Way, Vista, CA 92081",
    lookup: "1305 Hot Springs Way, Vista, CA 92081",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Family Friendly","Patio","Craft Beer","Local Favorites"],
    reservation: "walk-in",
    suburb: true,
    group: "Iron Fist Brewing",
    instagram: "@ironfistbrewing", website: "https://ironfistbrewing.com",
    dishes: ["Belgian-Style Brewing","Hop-Forward IPAs","Vista Taproom","North County Brewery Walk"],
    desc: "Vista's Iron Fist Brewing — a Belgian-style program crossed with hop-forward California IPAs, a Hot Springs Way taproom, and one of the North County brewery-walk anchors. A defining Vista craft brewery." },
  { name: "Acqua al 2", cuisine: "Italian", neighborhood: "Gaslamp",
    address: "322 Fifth Ave, San Diego, CA 92101",
    lookup: "322 5th Ave, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Iconic","Celebrations"],
    reservation: "OpenTable",
    group: "Acqua al 2",
    instagram: "@acquaal2sd", website: "https://acquaal2.com",
    dishes: ["Blueberry Steak","Assaggio di Primi","Florence-Import Brand","Gaslamp Dining Room"],
    desc: "Gaslamp's Acqua al 2 since 2008 — the Florence Italian-institution brand's SD outpost, the signature blueberry steak and assaggio di primi pasta tasting, and one of the defining 5th Ave Italian date-night rooms." },
  { name: "Kansas City Barbeque", cuisine: "American / BBQ", neighborhood: "Downtown",
    address: "600 W Market St, San Diego, CA 92101",
    lookup: "600 W Market St, San Diego, CA 92101",
    score: 84, price: 2, tags: ["American","BBQ","Bar","Casual","Iconic","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "@kcbbq", website: "https://kansascitybbq.net",
    dishes: ["Kansas City-Style Ribs","Pulled Pork","Top Gun Filming Location","Since 1984"],
    desc: "Downtown's Kansas City Barbeque since 1984 — the bar where the Top Gun piano scene was filmed, with memorabilia on every wall, a serious Kansas City-style BBQ menu, and a Market St location that is one of SD's rare movie-history tourist-and-local overlaps." },
  { name: "The Big Kitchen", cuisine: "American / Breakfast", neighborhood: "Golden Hill",
    address: "3003 Grape St, San Diego, CA 92102",
    lookup: "3003 Grape St, San Diego, CA 92102",
    score: 85, price: 1, tags: ["American","Breakfast","Brunch","Casual","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    group: "Judy The Beauty on Duty",
    instagram: "@bigkitchensd", website: "https://bigkitchensandiego.com",
    dishes: ["Judy's Breakfast Menu","Home-Fry Program","Whoopi Goldberg's Former Waitress Gig","Golden Hill Since 1980"],
    desc: "Golden Hill's Big Kitchen since 1980 — Judy 'The Beauty on Duty' Forman's legendary corner breakfast room, where Whoopi Goldberg waited tables before her break. A Grape St counter that reads as one of SD's most-character-driven breakfast institutions." },
  { name: "Tin Fish Gaslamp", cuisine: "American / Seafood", neighborhood: "Gaslamp",
    address: "170 Sixth Ave, San Diego, CA 92101",
    lookup: "170 6th Ave, San Diego, CA 92101",
    score: 82, price: 2, tags: ["American","Seafood","Casual","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Tin Fish",
    instagram: "@tinfishsd", website: "https://thetinfish.net",
    dishes: ["Fish Tacos","Fried Fish Baskets","Petco-Park-Adjacent Patio","Padres Game-Day Crowd"],
    desc: "Gaslamp's Tin Fish — a casual walk-up seafood counter directly across from Petco Park, fish tacos and fried baskets, and a patio that turns into one of SD's busiest Padres game-day rooms." }
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
  "Water Grill":     { lat: 32.7096, lng: -117.1604 },   // 615 J St Gaslamp
  "Acqua al 2":      { lat: 32.7106, lng: -117.1611 },   // 322 5th Ave Gaslamp
  "Tin Fish Gaslamp":{ lat: 32.7090, lng: -117.1576 }    // 170 6th Ave Gaslamp (across from Petco)
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

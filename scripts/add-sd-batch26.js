#!/usr/bin/env node
// San Diego batch 26 — institutional-only Point Loma docks + Coronado + hospitality groups + multi-decade anchors (20)
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
  { name: "Fisherman's Landing", cuisine: "American / Seafood", neighborhood: "Point Loma",
    address: "2838 Garrison St, San Diego, CA 92106",
    lookup: "2838 Garrison St, San Diego, CA 92106",
    score: 82, price: 2, tags: ["American","Seafood","Scenic Views","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@fishermanslanding", website: "https://fishermanslanding.com",
    dishes: ["Fresh Catch Fish Sandwich","Clam Chowder","Dock-View Counter","Since 1966"],
    desc: "Point Loma's working-sportfishing dock since 1966 — a no-frills restaurant attached to the tuna/yellowtail fleet, a fish sandwich where the catch literally came off the dock outside. A defining SD dock-counter institution." },
  { name: "H&M Landing", cuisine: "American / Seafood", neighborhood: "Point Loma",
    address: "2803 Emerson St, San Diego, CA 92106",
    lookup: "2803 Emerson St, San Diego, CA 92106",
    score: 82, price: 2, tags: ["American","Seafood","Scenic Views","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@hmlanding", website: "https://hmlanding.com",
    dishes: ["Dock-to-Plate Fish","Clam Chowder","Sportfishing Fleet Counter","Since 1935"],
    desc: "Point Loma's H&M Landing since 1935 — SD's oldest operating sportfishing landing with an attached counter-service restaurant, where the offshore fleet's catch ends up on the menu. The oldest tuna-tower counter in the city." },
  { name: "Red Sails Inn", cuisine: "American / Seafood", neighborhood: "Point Loma",
    address: "2614 Shelter Island Dr, San Diego, CA 92106",
    lookup: "2614 Shelter Island Dr, San Diego, CA 92106",
    score: 83, price: 3, tags: ["American","Seafood","Patio","Scenic Views","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@redsailsinn", website: "https://redsailsinn.com",
    dishes: ["Cioppino","Clam Chowder","Shelter Island Patio","Since 1957"],
    desc: "Shelter Island's Red Sails Inn since 1957 — a working-waterfront restaurant on Shelter Island Dr, with a nautical dining room, cioppino and chowder program, and a patio that overlooks the marina. A Shelter Island institution." },
  { name: "House of Blues San Diego", cuisine: "American / Live Music", neighborhood: "Gaslamp",
    address: "1055 Fifth Ave, San Diego, CA 92101",
    lookup: "1055 5th Ave, San Diego, CA 92101",
    score: 83, price: 3, tags: ["American","Live Music","Late Night","Bar","Iconic","Gaslamp"],
    reservation: "OpenTable",
    group: "House of Blues",
    instagram: "@houseofbluessd", website: "https://houseofblues.com/sandiego",
    dishes: ["Southern-Inspired Menu","Sunday Gospel Brunch","Concert Hall Program","Since 2005"],
    desc: "The Gaslamp House of Blues — a two-story live-music concert hall and restaurant since 2005, with the Southern-themed kitchen and Sunday Gospel Brunch that anchors the national HOB brand. A defining SD concert-and-dinner room." },
  { name: "Spice & Rice Thai Kitchen", cuisine: "Thai", neighborhood: "La Jolla",
    address: "7734 Girard Ave, La Jolla, CA 92037",
    lookup: "7734 Girard Ave, La Jolla, CA 92037",
    score: 84, price: 2, tags: ["Thai","Casual","Family Friendly","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@spiceandricelajolla", website: "https://spicenrice.com",
    dishes: ["Pad Thai","Green Curry","La Jolla Village Since 1988","Neighborhood Thai Default"],
    desc: "La Jolla Village's Spice & Rice Thai since 1988 — a Girard Ave neighborhood Thai kitchen that has been the Village default for almost 40 years. A La Jolla everyday constant." },
  { name: "Primavera Ristorante", cuisine: "Italian", neighborhood: "Coronado",
    address: "932 Orange Ave, Coronado, CA 92118",
    lookup: "932 Orange Ave, Coronado, CA 92118",
    score: 85, price: 4, tags: ["Fine Dining","Italian","Date Night","Celebrations","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@primaveracoronado", website: "https://primavera1st.com",
    dishes: ["Veal Piccata","House-Made Pasta","Tuscan Wine List","Coronado Since 1987"],
    desc: "Coronado's Italian dining room since 1987 — veal piccata, house-made pasta, a deep Tuscan wine list, and an Orange Ave dining room that locals have treated as the island's serious Italian special-occasion anchor for three decades." },
  { name: "Koon Thai Kitchen", cuisine: "Thai", neighborhood: "Kearny Mesa",
    address: "4660 Convoy St, San Diego, CA 92111",
    lookup: "4660 Convoy St, San Diego, CA 92111",
    score: 84, price: 2, tags: ["Thai","Casual","Family Friendly","Late Night","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@koonthaikitchen", website: "https://koonthaikitchen.com",
    dishes: ["Boat Noodle","Pad See Ew","Northern Thai Specialties","Convoy Late-Night Thai"],
    desc: "Convoy's Koon Thai — a Northern Thai-leaning menu, boat noodle soup, and a dining room that fills with Thai-community regulars late into the night. One of Convoy's defining Thai specialist rooms." },
  { name: "Lou & Mickey's", cuisine: "American / Steakhouse / Seafood", neighborhood: "Gaslamp",
    address: "224 Fifth Ave, San Diego, CA 92101",
    lookup: "224 5th Ave, San Diego, CA 92101",
    score: 85, price: 4, tags: ["Fine Dining","American","Steakhouse","Seafood","Date Night","Celebrations","Iconic","Gaslamp"],
    reservation: "OpenTable",
    group: "Cohn Restaurant Group",
    instagram: "@louandmickeys", website: "https://cohnrestaurants.com/louandmickeys",
    dishes: ["Prime Steaks","Seafood Tower","Convention-Center-Adjacent","Since 1999"],
    desc: "Cohn Restaurant Group's Lou & Mickey's since 1999 — a Gaslamp steakhouse-and-seafood room across from the Convention Center, a seafood-tower and prime-steak program, and one of the downtown convention-crowd default reservations for 25+ years." },
  { name: "The Sicilian Thing Pizza", cuisine: "Italian / Pizza", neighborhood: "Little Italy",
    address: "2330 First Ave, San Diego, CA 92101",
    lookup: "2330 1st Ave, San Diego, CA 92101",
    score: 83, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "The Sicilian Thing",
    instagram: "@thesicilianthing", website: "https://thesicilianthing.com",
    dishes: ["Sicilian Square Pizza","Cannoli","Little Italy Counter","Multi-Location SD Brand"],
    desc: "Little Italy's Sicilian-square pizza counter — a multi-location SD pizzeria with 1st Ave as the cornerstone, Sicilian-style thick-crust squares, and a from-scratch cannoli program. A Little Italy neighborhood default." },
  { name: "Harry's Bar & American Grill — Rancho Santa Fe", cuisine: "American / Steakhouse", neighborhood: "Rancho Santa Fe",
    address: "6055 Paseo Delicias, Rancho Santa Fe, CA 92067",
    lookup: "6055 Paseo Delicias, Rancho Santa Fe, CA 92067",
    score: 86, price: 4, tags: ["Fine Dining","American","Steakhouse","Date Night","Celebrations","Iconic","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@harrysbarrsf", website: "https://harrysbarrsf.com",
    dishes: ["Dry-Aged Steaks","Tableside Caesar","Paseo Delicias Dining Room","RSF Village Anchor"],
    desc: "Rancho Santa Fe Village's Harry's Bar since the 90s — a Paseo Delicias dining room with dry-aged steaks, tableside Caesar, and the kind of small-town-upscale atmosphere that RSF regulars have kept on the weekly rotation for a generation." },
  { name: "Manhattan of La Jolla", cuisine: "Italian / Steakhouse", neighborhood: "La Jolla",
    address: "7766 Fay Ave, La Jolla, CA 92037",
    lookup: "7766 Fay Ave, La Jolla, CA 92037",
    score: 84, price: 4, tags: ["Fine Dining","Italian","Steakhouse","Date Night","Celebrations","Iconic","Live Music"],
    reservation: "OpenTable",
    group: "Empress Hotel La Jolla",
    instagram: "@manhattanoflajolla", website: "https://manhattanoflajolla.com",
    dishes: ["Italian Steakhouse Menu","Live Piano","Empress Hotel Dining Room","Since 1983"],
    desc: "La Jolla's Manhattan of La Jolla inside the Empress Hotel since 1983 — an Italian-and-steakhouse menu, live piano, and a Fay Ave dining room that has run as one of the Village's old-guard special-occasion tables for 40+ years." },
  { name: "Flower Child — Fashion Valley", cuisine: "Californian / Healthy / Vegetarian", neighborhood: "Mission Valley",
    address: "7051 Friars Rd, San Diego, CA 92108",
    lookup: "7051 Friars Rd, San Diego, CA 92108",
    score: 83, price: 2, tags: ["Californian","Healthy","Vegetarian","Brunch","Casual","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Fox Restaurant Concepts",
    instagram: "@iamaflowerchild", website: "https://iamaflowerchild.com",
    dishes: ["Bowls","Mother Earth Bowl","Juices & Wellness Shots","Fashion Valley Mall"],
    desc: "Fox Restaurant Concepts' Flower Child at Fashion Valley — a wellness-focused fast-casual format from the North Italia / True Food Kitchen parent, bowls and wraps with a from-scratch kitchen, and a mall-adjacent dining room anchored by the group's SD Fox footprint." },
  { name: "Pomegranate Russian Restaurant", cuisine: "Russian / Armenian", neighborhood: "North Park",
    address: "2312 El Cajon Blvd, San Diego, CA 92104",
    lookup: "2312 El Cajon Blvd, San Diego, CA 92104",
    score: 85, price: 2, tags: ["Russian","Armenian","Eastern European","Casual","Hidden Gem","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@pomegranatesd", website: "https://pomegranatesd.com",
    dishes: ["Borscht","Pelmeni","Khachapuri","Authentic Russian-Armenian Menu"],
    desc: "North Park's Russian-Armenian kitchen on El Cajon Blvd — borscht, pelmeni dumplings, Georgian khachapuri, and a family-run dining room that runs as SD's most-specific Eastern-European restaurant. A defining hidden-in-plain-sight SD chapter." },
  { name: "Pizza Nova — Point Loma", cuisine: "Italian / Pizza", neighborhood: "Point Loma",
    address: "5050 N Harbor Dr, San Diego, CA 92106",
    lookup: "5050 N Harbor Dr, San Diego, CA 92106",
    score: 83, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Patio","Iconic","Local Favorites","Scenic Views"],
    reservation: "OpenTable",
    group: "Pizza Nova",
    instagram: "@pizzanova", website: "https://pizzanova.net",
    dishes: ["Gourmet Pizza","Harbor-View Patio","Point Loma Harbor Drive","Multi-Location SD Brand"],
    desc: "Pizza Nova's Point Loma Harbor Dr location — a multi-location SD gourmet-pizza brand's most-scenic room, with a harbor-front patio that faces the marina. A defining SD-scale pizza-plus-scenery format." },
  { name: "Spike Africa's", cuisine: "American / Seafood / Bar", neighborhood: "Downtown",
    address: "411 Broadway, San Diego, CA 92101",
    lookup: "411 Broadway, San Diego, CA 92101",
    score: 84, price: 3, tags: ["American","Seafood","Bar","Date Night","Patio","Cocktails","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@spikeafricas", website: "https://spikeafricas.com",
    dishes: ["Oyster Bar","Raw Bar Program","Rooftop Deck","Maritime-Themed Dining Room"],
    desc: "Downtown's Spike Africa's — a maritime-themed seafood room with a rooftop deck, named after legendary sailor Spike Africa, with an oyster and raw bar program that reads as one of the Broadway corridor's defining seafood rooms." },
  { name: "Sam Woo BBQ", cuisine: "Chinese / Cantonese / BBQ", neighborhood: "Kearny Mesa",
    address: "4333 Convoy St, San Diego, CA 92111",
    lookup: "4333 Convoy St, San Diego, CA 92111",
    score: 84, price: 2, tags: ["Chinese","Cantonese","BBQ","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Sam Woo",
    instagram: "", website: "",
    dishes: ["Cantonese BBQ","Roast Duck","Char Siu Pork","Hanging-Duck Window"],
    desc: "Convoy's Sam Woo BBQ — the multi-state Cantonese-BBQ brand's SD location, with roast duck and char siu hanging in the window, and a format that the SD Cantonese community has protected as one of the defining Convoy Chinese-BBQ rooms." },
  { name: "Brockton Villa", cuisine: "American / Californian", neighborhood: "La Jolla",
    address: "1235 Coast Blvd, La Jolla, CA 92037",
    lookup: "1235 Coast Blvd, La Jolla, CA 92037",
    score: 86, price: 3, tags: ["American","Californian","Scenic Views","Date Night","Patio","Iconic","Local Favorites","Brunch"],
    reservation: "OpenTable",
    instagram: "@brocktonvilla", website: "https://brocktonvilla.com",
    dishes: ["Coast Toast (French Toast Soufflé)","La Jolla Cove View","Historic 1894 Beach Cottage","Since 1992"],
    desc: "La Jolla Cove's Brockton Villa since 1992 — inside an 1894 beach cottage directly above the Cove, with the 'Coast Toast' soufflé French toast as the SD brunch-legend signature. One of the defining La Jolla Cove-view dining rooms." },
  { name: "Cafe Japengo", cuisine: "Pan-Asian / Japanese", neighborhood: "La Jolla / UTC",
    address: "8960 University Center Ln, San Diego, CA 92122",
    lookup: "8960 University Center Ln, San Diego, CA 92122",
    score: 85, price: 4, tags: ["Fine Dining","Pan-Asian","Japanese","Date Night","Critics Pick","Iconic","Sushi"],
    reservation: "OpenTable",
    group: "Hyatt Regency La Jolla at Aventine",
    instagram: "@cafejapengo", website: "https://cafejapengo.com",
    dishes: ["Pan-Asian Fusion","Sushi Bar","Dramatic Atrium Dining Room","Aventine Since 1992"],
    desc: "La Jolla's Cafe Japengo since 1992 — inside the Hyatt Regency La Jolla at Aventine, a high-ceiling atrium dining room with a serious sushi bar and Pan-Asian menu that made it one of SD's defining '90s modern-Asian restaurants. A UTC anchor." },
  { name: "The Rabbit Hole", cuisine: "American / Bar", neighborhood: "Normal Heights",
    address: "3377 Adams Ave, San Diego, CA 92116",
    lookup: "3377 Adams Ave, San Diego, CA 92116",
    score: 82, price: 2, tags: ["American","Bar","Late Night","Casual","Patio","Local Favorites","Cocktails"],
    reservation: "walk-in",
    instagram: "@therabbitholesd", website: "https://therabbitholesd.com",
    dishes: ["Dive-Meets-Cocktail Format","Patio Program","Adams Ave Locals","Normal Heights Neighborhood Room"],
    desc: "Normal Heights' Rabbit Hole on Adams Ave — a patio-and-cocktail dive format, a neighborhood crowd that treats it as a weekly after-dinner default, and one of the Adams Ave bar-corridor anchors." },
  { name: "Pizza Port — Carlsbad Village", cuisine: "Pizza / Brewery", neighborhood: "Carlsbad",
    address: "571 Carlsbad Village Dr, Carlsbad, CA 92008",
    lookup: "571 Carlsbad Village Dr, Carlsbad, CA 92008",
    score: 83, price: 2, tags: ["Pizza","Brewery","Casual","Family Friendly","Local Favorites","Craft Beer","Iconic"],
    reservation: "walk-in",
    suburb: true,
    group: "Pizza Port",
    instagram: "@pizzaport", website: "https://pizzaport.com",
    dishes: ["Pepperoni Pizza","House-Brewed Beers","Carlsbad Village Patio","North County Brewpub"],
    desc: "Pizza Port's Carlsbad Village location — the SD-born craft-beer-and-pizza brand's North County chapter, with the same award-winning beer program and pizza-first format that the Solana Beach original set the template for." }
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
  "Lou & Mickey's":       { lat: 32.7057, lng: -117.1605 },  // 224 5th Ave Gaslamp
  "House of Blues San Diego": { lat: 32.7152, lng: -117.1613 }, // 1055 5th Ave
  "Spike Africa's":       { lat: 32.7162, lng: -117.1650 }   // 411 Broadway
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

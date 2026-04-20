#!/usr/bin/env node
// San Diego batch 13 — North Park + South Park + PB bars + Little Italy Italian + Fashion Valley + Hillcrest/Bankers Hill (18)
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
  { name: "Bar Pink", cuisine: "American / Bar", neighborhood: "North Park",
    address: "3829 30th St, San Diego, CA 92104",
    lookup: "3829 30th St, San Diego, CA 92104",
    score: 81, price: 1, tags: ["American","Bar","Late Night","Casual","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@barpink", website: "",
    dishes: ["Dive Bar Drinks","Stiff Pours","North Park DJ Nights","Vinyl Decor"],
    desc: "North Park's pink-neon dive bar on 30th — a music-programmed room with theme DJ nights, stiff pours, and the kind of North Park crowd that makes Bar Pink a post-dinner default since the neighborhood's first wave of reinvention." },
  { name: "The Haven Pizzeria", cuisine: "Italian / Pizza", neighborhood: "Normal Heights",
    address: "4051 Adams Ave, San Diego, CA 92116",
    lookup: "4051 Adams Ave, San Diego, CA 92116",
    score: 84, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    instagram: "@havenpizzeria", website: "https://thehavenpizzeria.com",
    dishes: ["NY-Style Pizza","Detroit Style","Craft Beer Program","Normal Heights Locals' Call"],
    desc: "Normal Heights' neighborhood pizza parlor — NY-style by the slice or whole pie, a rotating Detroit format, and a Normal Heights regular's lineup that keeps the Adams Ave booths full every weekend." },
  { name: "Station Tavern & Burgers", cuisine: "American / Burgers / Bar", neighborhood: "South Park",
    address: "2204 Fern St, San Diego, CA 92104",
    lookup: "2204 Fern St, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Burgers","Bar","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@stationtavern", website: "https://stationtavern.com",
    dishes: ["Station Burger","Patio Beer Garden","Dog-Friendly Format","South Park Community Room"],
    desc: "South Park's neighborhood burger-and-beer-garden anchor — a wide-open dog-friendly patio, a Station Burger that runs as the Fern St local default, and the kind of neighborhood room that the South Park community treats as a weekly ritual." },
  { name: "Whistle Stop Bar", cuisine: "American / Bar", neighborhood: "South Park",
    address: "2236 Fern St, San Diego, CA 92104",
    lookup: "2236 Fern St, San Diego, CA 92104",
    score: 82, price: 1, tags: ["American","Bar","Late Night","Live Music","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@whistlestopsd", website: "https://whistlestopbar.com",
    dishes: ["Dive Bar Cocktails","Live Indie Music","South Park After-Dinner","DJ Nights"],
    desc: "South Park's live-music-and-dive-vibe corner — an indie-leaning music calendar, a DJ-night rotation, and the neighborhood after-dinner move for Fern St regulars. One of the SD indie music scene's most-loyal stages." },
  { name: "Duck Dive", cuisine: "American / Gastropub", neighborhood: "Pacific Beach",
    address: "4650 Mission Blvd, San Diego, CA 92109",
    lookup: "4650 Mission Blvd, San Diego, CA 92109",
    score: 84, price: 2, tags: ["American","Gastropub","Patio","Cocktails","Local Favorites","Trending","Late Night"],
    reservation: "walk-in",
    instagram: "@theduckdive", website: "https://theduckdive.com",
    dishes: ["Elevated Bar Food","Craft Cocktails","PB Patio Bar","Weekend Brunch"],
    desc: "Pacific Beach's chef-driven gastropub — Mission Blvd corner with a serious cocktail bar, weekend brunch line, and the kind of elevated bar food that raised the ceiling on what PB was supposed to be. A PB mainstay." },
  { name: "Miss B's Coconut Club", cuisine: "Caribbean / Tiki / Bar", neighborhood: "Mission Beach",
    address: "3704 Mission Blvd, San Diego, CA 92109",
    lookup: "3704 Mission Blvd, San Diego, CA 92109",
    score: 83, price: 2, tags: ["Caribbean","Tiki","Bar","Patio","Date Night","Trending","Cocktails"],
    reservation: "walk-in",
    instagram: "@missbscoconutclub", website: "https://missbscoconutclub.com",
    dishes: ["Jerk Chicken Tacos","Caribbean Rum Program","Piña Colada","Beachfront Patio"],
    desc: "Mission Beach's Caribbean-tiki — jerk chicken tacos, a serious rum bar, and a two-story Mission Blvd patio one block from the sand. A defining summer-in-SD rum-and-patio anchor." },
  { name: "PB AleHouse", cuisine: "American / Gastropub", neighborhood: "Pacific Beach",
    address: "721 Grand Ave, San Diego, CA 92109",
    lookup: "721 Grand Ave, San Diego, CA 92109",
    score: 82, price: 2, tags: ["American","Gastropub","Rooftop","Scenic Views","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@pbalehouse", website: "https://pbalehouse.com",
    dishes: ["House-Brewed Beer","Fish Tacos","Rooftop Views","PB Grand Ave Corner"],
    desc: "Pacific Beach's house-brewing rooftop anchor on Grand Ave — an upstairs patio with ocean glimpses, fish tacos and pub fare, and one of the PB Grand Ave strip's defining rooftop formats." },
  { name: "The Grass Skirt", cuisine: "Tiki / Cocktail Bar", neighborhood: "Pacific Beach",
    address: "910 Grand Ave, San Diego, CA 92109",
    lookup: "910 Grand Ave, San Diego, CA 92109",
    score: 86, price: 3, tags: ["Tiki","Cocktail Bar","Hidden Gem","Date Night","Critics Pick","Trending"],
    reservation: "Resy",
    group: "Consortium Holdings / CH Projects",
    instagram: "@grassskirtsd", website: "https://thegrassskirt.com",
    dishes: ["Classic Tiki Cocktails","Hidden Back-of-House Format","Flaming Volcano Bowls","Bamboo Dining Room"],
    desc: "CH Projects' Pacific Beach speakeasy-tiki — entered through a poke shop front, a back-room tiki den with cocktails in volcano bowls, and a format that reads as SD's most-serious tiki program. A PB hidden-bar landmark." },
  { name: "Queenstown Public House", cuisine: "New Zealand / Gastropub", neighborhood: "Little Italy",
    address: "1557 Columbia St, San Diego, CA 92101",
    lookup: "1557 Columbia St, San Diego, CA 92101",
    score: 84, price: 3, tags: ["American","Gastropub","Patio","Date Night","Trending","Critics Pick","Brunch"],
    reservation: "OpenTable",
    instagram: "@queenstownpublichouse", website: "https://queenstownpublichouse.com",
    dishes: ["Kiwi-Style Menu","Breakfast Bowls","NZ Wines","Craftsman-Bungalow Patio"],
    desc: "Little Italy's New Zealand-themed gastropub inside a craftsman bungalow — a Kiwi-sourced wine list, all-day brunch program, and a sprawling wraparound porch that locals keep coming back to. A Little Italy neighborhood original." },
  { name: "Ambrogio15", cuisine: "Italian / Milanese / Pizza", neighborhood: "Little Italy",
    address: "1935 India St, San Diego, CA 92101",
    lookup: "1935 India St, San Diego, CA 92101",
    score: 87, price: 3, tags: ["Italian","Pizza","Date Night","Critics Pick","Patio","Trending"],
    reservation: "OpenTable",
    group: "Ambrogio15",
    instagram: "@ambrogio15", website: "https://ambrogio15.com",
    dishes: ["Milan-Style Pizza","House-Made Pasta","Aperitivo","Extended Italian Fermentation"],
    desc: "Little Italy's Milanese-style pizzeria — an unusually long-fermentation dough, Milan-inflected menu, and a reservation-sheet reputation that made Ambrogio15 one of SD's most-referenced Italian rooms. A specific Little Italy chef-kitchen." },
  { name: "Barbusa", cuisine: "Italian / Sicilian", neighborhood: "Little Italy",
    address: "1917 India St, San Diego, CA 92101",
    lookup: "1917 India St, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Italian","Sicilian","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    group: "Busalacchi Family",
    instagram: "@barbusa_sandiego", website: "https://barbusa.com",
    dishes: ["Sicilian Pasta","Whole Fish","Family-Recipe Menu","India Street Patio"],
    desc: "Little Italy's Busalacchi-family Sicilian — a third-generation Little Italy family's dining room, Sicilian-specific pasta program, and a patio that runs like Little Italy's family-kitchen default. A Little Italy heritage room." },
  { name: "North Italia — Fashion Valley", cuisine: "Italian", neighborhood: "Mission Valley",
    address: "7055 Friars Rd, San Diego, CA 92108",
    lookup: "7055 Friars Rd, San Diego, CA 92108",
    score: 84, price: 3, tags: ["Italian","Date Night","Family Friendly","Patio","Local Favorites"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@northitaliarestaurants", website: "https://northitaliarestaurants.com",
    dishes: ["House-Made Pasta","Wood-Fired Pizza","Happy Hour","Indoor-Outdoor Patio"],
    desc: "Fox Restaurant Concepts' Italian at Fashion Valley — a multi-location brand by Sam Fox, with a pasta-and-pizza menu that delivers the Fox Restaurant group's polish in a Mission Valley mall setting. A reliable cross-city name for the SD visit." },
  { name: "True Food Kitchen — Fashion Valley", cuisine: "Californian / Healthy", neighborhood: "Mission Valley",
    address: "7007 Friars Rd, San Diego, CA 92108",
    lookup: "7007 Friars Rd, San Diego, CA 92108",
    score: 83, price: 3, tags: ["Californian","Healthy","Vegetarian","Brunch","Patio","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@truefoodkitchen", website: "https://truefoodkitchen.com",
    dishes: ["Anti-Inflammatory Menu","Bowls","Seasonal Program","Andrew Weil Partnership"],
    desc: "Dr. Andrew Weil and Fox Restaurant Concepts' health-first concept at Fashion Valley — anti-inflammatory seasonal menu, bowls, and one of the defining mall-restaurant rooms that pulls a wellness crowd that keeps the Friars Rd patio full." },
  { name: "Din Tai Fung — UTC", cuisine: "Taiwanese / Dumplings", neighborhood: "La Jolla / UTC",
    address: "4545 La Jolla Village Dr, San Diego, CA 92122",
    lookup: "4545 La Jolla Village Dr, San Diego, CA 92122",
    score: 87, price: 3, tags: ["Taiwanese","Chinese","Dumplings","Date Night","Family Friendly","Critics Pick","Iconic","Trending"],
    reservation: "walk-in",
    group: "Din Tai Fung",
    instagram: "@dintaifungusa", website: "https://dintaifungusa.com",
    dishes: ["Xiao Long Bao (Soup Dumplings)","Truffle XLB","Pork Dumplings","Visible Dumpling Kitchen"],
    desc: "The Taiwanese soup-dumpling global institution's Westfield UTC location — 18-fold xiao long bao, a visible dumpling-making kitchen, and the kind of wait that tells you everything. SD's destination dumpling room." },
  { name: "Urban Mo's Bar & Grill", cuisine: "American / Bar", neighborhood: "Hillcrest",
    address: "308 University Ave, San Diego, CA 92103",
    lookup: "308 University Ave, San Diego, CA 92103",
    score: 83, price: 2, tags: ["American","Bar","LGBTQ+","Patio","Late Night","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@urbanmos", website: "https://urbanmos.com",
    dishes: ["Patio Drag Brunch","Line-Dancing Nights","Pride Parade Headquarters","Universal Pub Menu"],
    desc: "Hillcrest's LGBTQ+ landmark since 1988 — drag brunch on the patio, line-dancing nights, the Pride Parade's unofficial headquarters, and the San Diego gay bar reference. A defining Hillcrest institution." },
  { name: "Martinis Above Fourth", cuisine: "American / Piano Bar / Cabaret", neighborhood: "Hillcrest",
    address: "3940 Fourth Ave, San Diego, CA 92103",
    lookup: "3940 Fourth Ave, San Diego, CA 92103",
    score: 84, price: 3, tags: ["American","Piano Bar","LGBTQ+","Cabaret","Date Night","Cocktails","Iconic"],
    reservation: "walk-in",
    instagram: "@martinisabovefourth", website: "https://martinisabovefourth.com",
    dishes: ["Piano Bar Program","Broadway Cabaret","Craft Cocktails","Sing-Along Nights"],
    desc: "Hillcrest's table-cabaret-and-piano-bar — Broadway-style entertainment, martini-program bar, and one of the most-specific night-out formats SD has. The defining Hillcrest cabaret room." },
  { name: "Extraordinary Desserts", cuisine: "Dessert / Bakery / Cafe", neighborhood: "Bankers Hill",
    address: "2929 Fifth Ave, San Diego, CA 92103",
    lookup: "2929 Fifth Ave, San Diego, CA 92103",
    score: 86, price: 2, tags: ["Dessert","Bakery","Cafe","Date Night","Iconic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    group: "Karen Krasne",
    instagram: "@extraordinarydessertssd", website: "https://extraordinarydesserts.com",
    dishes: ["Passion Fruit Cake","Viking Cake","French Pastry Case","Tea Program"],
    desc: "Karen Krasne's Bankers Hill dessert room — a French-trained pastry program with the Passion Fruit Cake as the SD dessert-shorthand, and a glass case that stops people on 5th Ave. A defining SD after-dinner destination since 1988." },
  { name: "Parc Bistro-Brasserie", cuisine: "French / Brasserie", neighborhood: "Bankers Hill",
    address: "2760 Fifth Ave, San Diego, CA 92103",
    lookup: "2760 Fifth Ave, San Diego, CA 92103",
    score: 86, price: 3, tags: ["French","Brasserie","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@parcbistrobrasserie", website: "https://parcbistrosd.com",
    dishes: ["Steak Frites","Escargot","French Onion Soup","Balboa-Park-Adjacent Patio"],
    desc: "Bankers Hill's Parisian brasserie across from Balboa Park — escargot, steak frites, French onion, and a 5th Ave patio that reads like the most-convincing SD Paris-transplant. A defining Bankers Hill French room." }
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
  const gaslampTight = /Gaslamp|East Village|Downtown|Little Italy/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.40 && c.lng >= -117.40 && c.lng <= -116.75;
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
    if (!c || !inSDBox(c, e.neighborhood)) {
      const simple = e.lookup.replace(/#\S+,?\s*/i, "").replace(/Ste \S+,?\s*/i, "");
      if (simple !== e.lookup) { await sleep(1100); c = await nominatim(simple); }
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

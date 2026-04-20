#!/usr/bin/env node
// San Diego batch 18 — Downtown + Little Italy old-guard + Convoy + Point Loma + OB/PB/MB (20)
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
  { name: "Blue Point Coastal Cuisine", cuisine: "Seafood / American", neighborhood: "Gaslamp",
    address: "565 Fifth Ave, San Diego, CA 92101",
    lookup: "565 5th Ave, San Diego, CA 92101",
    score: 86, price: 4, tags: ["Fine Dining","Seafood","American","Date Night","Celebrations","Iconic","Local Favorites"],
    reservation: "OpenTable",
    group: "Cohn Restaurant Group",
    instagram: "@bluepointsd", website: "https://cohnrestaurants.com/bluepoint",
    dishes: ["Wood-Grilled Seafood","Oyster Bar","Craft Cocktails","Gaslamp Dining Room Since 1998"],
    desc: "Cohn Restaurant Group's Gaslamp seafood anchor since 1998 — wood-grilled local fish, an oyster bar, and a corner dining room at 5th and Market that has been the Gaslamp seafood-dinner standard for a quarter century." },
  { name: "Dobson's Bar & Restaurant", cuisine: "American / Upscale Casual", neighborhood: "Downtown",
    address: "956 Broadway Circle, San Diego, CA 92101",
    lookup: "956 Broadway, San Diego, CA 92101",
    score: 85, price: 3, tags: ["American","Bar","Date Night","Iconic","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@dobsonssd", website: "https://dobsonsrestaurant.com",
    dishes: ["Mussel Bisque en Croute","Prime Steak","Downtown Power Lunch","Since 1983"],
    desc: "Downtown's Dobson's since 1983 — the mussel bisque en croûte became the SD power-lunch shorthand, the dining room has been a downtown-counsel-and-editor ritual for 40 years, and the mahogany bar is a defining SD grown-up room." },
  { name: "Athens Market Taverna", cuisine: "Greek", neighborhood: "Downtown",
    address: "109 W F St, San Diego, CA 92101",
    lookup: "109 W F St, San Diego, CA 92101",
    score: 83, price: 2, tags: ["Greek","Casual","Patio","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "", website: "https://athensmarkettaverna.com",
    dishes: ["Gyros","Moussaka","Saganaki Flambé","Downtown Since 1977"],
    desc: "Downtown's Greek institution since 1977 — gyros, moussaka, and saganaki flambéed tableside. The F Street dining room has anchored SD's Greek scene since before the Gaslamp was the Gaslamp." },
  { name: "Osteria Panevino", cuisine: "Italian", neighborhood: "Gaslamp",
    address: "722 Fifth Ave, San Diego, CA 92101",
    lookup: "722 5th Ave, San Diego, CA 92101",
    score: 83, price: 3, tags: ["Italian","Date Night","Patio","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@panevinosandiego", website: "https://panevinosandiego.com",
    dishes: ["House-Made Pasta","Wood-Fired Pizza","Tuscan Wine List","Gaslamp Sidewalk Patio"],
    desc: "Gaslamp's long-running Italian — a Tuscan-forward menu, a 5th Ave sidewalk patio, and the kind of dining room that absorbs the Gaslamp dinner crowd when the corner cocktail bars get too loud." },
  { name: "Henry's Pub", cuisine: "American / Pub", neighborhood: "Gaslamp",
    address: "618 Fifth Ave, San Diego, CA 92101",
    lookup: "618 5th Ave, San Diego, CA 92101",
    score: 80, price: 2, tags: ["American","Pub","Bar","Late Night","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@henryspubsd", website: "",
    dishes: ["Pub Burger","Game Day Crowd","Gaslamp Main Drag","Late-Night Kitchen"],
    desc: "Gaslamp's straightforward corner pub on 5th Ave — burgers, game-day TVs, late-night kitchen, and a Gaslamp main-drag regular. An uncomplicated Gaslamp weekday default." },
  { name: "Filippi's Pizza Grotto", cuisine: "Italian / Pizza", neighborhood: "Little Italy",
    address: "1747 India St, San Diego, CA 92101",
    lookup: "1747 India St, San Diego, CA 92101",
    score: 85, price: 2, tags: ["Italian","Pizza","Casual","Family Friendly","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Filippi's",
    instagram: "@filippispizzagrotto", website: "https://realcheesepizza.com",
    dishes: ["NY-Style Pizza","Spaghetti with Meatballs","Cheese-Shop Entrance","Little Italy Since 1950"],
    desc: "Little Italy's Filippi's Pizza Grotto since 1950 — you enter through the Filippi's deli/cheese shop in front, dining room in back. Red-checkered tablecloths, generations-old Italian-American menu, and a Little Italy family-table rite of passage for 75 years." },
  { name: "Mona Lisa Italian Foods", cuisine: "Italian / Deli", neighborhood: "Little Italy",
    address: "2061 India St, San Diego, CA 92101",
    lookup: "2061 India St, San Diego, CA 92101",
    score: 84, price: 2, tags: ["Italian","Deli","Casual","Quick Bite","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "", website: "https://monalisaitalianfoods.com",
    dishes: ["Italian Cold Cuts","Imported Cheeses","Deli Counter","Sit-Down Room Since 1956"],
    desc: "Little Italy's Mona Lisa Italian Foods since 1956 — a deli-and-grocery up front, a family-run sit-down Italian room behind. Three generations of Little Italy's original Italian families have used Mona Lisa as the shop-and-dine anchor." },
  { name: "Old Venice", cuisine: "Italian", neighborhood: "Point Loma",
    address: "2910 Canon St, San Diego, CA 92106",
    lookup: "2910 Canon St, San Diego, CA 92106",
    score: 83, price: 3, tags: ["Italian","Date Night","Patio","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@oldvenicerestaurant", website: "https://oldvenicerestaurant.com",
    dishes: ["Traditional Italian","House-Made Pasta","Canon St Patio","Point Loma Since 1992"],
    desc: "Point Loma's longtime Italian on Canon St since 1992 — a traditional menu, a neighborhood dining room, and a patio that the Point Loma Italian-American community has anchored on for three decades." },
  { name: "Sessions Public", cuisine: "American / Gastropub", neighborhood: "Point Loma",
    address: "4204 Voltaire St, San Diego, CA 92107",
    lookup: "4204 Voltaire St, San Diego, CA 92107",
    score: 86, price: 3, tags: ["American","Gastropub","Craft Beer","Patio","Critics Pick","Local Favorites","Trending"],
    reservation: "OpenTable",
    instagram: "@sessionspublic", website: "https://sessionspublic.com",
    dishes: ["Chef-Driven Gastropub Menu","30+ Craft Taps","Kenney Farms Program","Voltaire St Patio"],
    desc: "Point Loma's Voltaire Street chef-driven gastropub — a 30+ craft-tap list, farm-sourced rotating menu, and a dining room that reads as the Point Loma neighborhood-kitchen reference. A defining chef-driven Voltaire room." },
  { name: "Newport Pizza & Ale House", cuisine: "Italian / Pizza", neighborhood: "Ocean Beach",
    address: "5050 Newport Ave, San Diego, CA 92107",
    lookup: "5050 Newport Ave, San Diego, CA 92107",
    score: 82, price: 2, tags: ["Italian","Pizza","Bar","Craft Beer","Casual","Local Favorites","Late Night"],
    reservation: "walk-in",
    instagram: "@newportpizzaob", website: "",
    dishes: ["NY-Style Slices","40+ Craft Beers","Patio on Newport Ave","OB Late-Night Crowd"],
    desc: "Ocean Beach's Newport Ave pizza-and-beer-bar — NY-style slices by the pie, a 40+ tap craft-beer list, and one of OB's longest-running late-night pizza calls on the main drag." },
  { name: "Dumpling Inn", cuisine: "Chinese / Shanghainese", neighborhood: "Kearny Mesa",
    address: "4625 Convoy Ct, San Diego, CA 92111",
    lookup: "4625 Convoy Ct, San Diego, CA 92111",
    score: 86, price: 2, tags: ["Chinese","Shanghainese","Casual","Critics Pick","Hidden Gem","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://dumplinginnsd.com",
    dishes: ["Soup Dumplings (XLB)","Hand-Pulled Noodles","Scallion Pancakes","Pork Dumplings"],
    desc: "Kearny Mesa's no-frills Shanghainese dumpling house — soup dumplings, hand-pulled noodles, and a tiny dining room off Convoy Ct that has been SD's Shanghai-style reference for years. A Convoy hidden-in-plain-sight institution." },
  { name: "Shabu Shabu House", cuisine: "Japanese / Shabu Shabu", neighborhood: "Kearny Mesa",
    address: "4771 Convoy St, San Diego, CA 92111",
    lookup: "4771 Convoy St, San Diego, CA 92111",
    score: 84, price: 3, tags: ["Japanese","Shabu Shabu","Date Night","Family Friendly","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Tableside Hot Pot","Thinly-Sliced Wagyu","Broth Program","Convoy Neighborhood Room"],
    desc: "Convoy's Japanese shabu-shabu room — tableside simmering hot pot, thinly-sliced wagyu, and a format that the Convoy Japanese community protects. A defining Convoy Japanese specialist." },
  { name: "Yakyudori Yakitori & Ramen", cuisine: "Japanese / Yakitori", neighborhood: "Kearny Mesa",
    address: "4898 Convoy St, San Diego, CA 92111",
    lookup: "4898 Convoy St, San Diego, CA 92111",
    score: 85, price: 2, tags: ["Japanese","Yakitori","Ramen","Casual","Late Night","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "https://yakyudori.com",
    dishes: ["Yakitori Skewers","Chicken Offal Program","Tonkotsu Ramen","Convoy Late Night"],
    desc: "Convoy's serious yakitori — full-bird butchery, offal skewers (heart, gizzard, skin, knee), tonkotsu ramen for the rest, and a dining room that reads like a Tokyo alley stall. A Convoy specialist Japanese chapter." },
  { name: "Sushi Diner II", cuisine: "Japanese / Sushi", neighborhood: "Kearny Mesa",
    address: "7947 Balboa Ave, San Diego, CA 92111",
    lookup: "7947 Balboa Ave, San Diego, CA 92111",
    score: 84, price: 2, tags: ["Japanese","Sushi","Casual","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@sushidinersd", website: "",
    dishes: ["All-You-Can-Eat Sushi","Chef's Special Rolls","Quality-to-Price Reputation","Kearny Mesa Strip Mall"],
    desc: "Kearny Mesa's value-benchmark sushi — all-you-can-eat format with chef-grade fish, a Balboa Ave strip-mall location that tells you nothing, and the kind of quality-to-price reputation that keeps the dining room lined up every night." },
  { name: "Zenbu Sushi Bar & Restaurant", cuisine: "Japanese / Sushi", neighborhood: "La Jolla",
    address: "7660 Fay Ave, La Jolla, CA 92037",
    lookup: "7660 Fay Ave, La Jolla, CA 92037",
    score: 87, price: 4, tags: ["Japanese","Sushi","Fine Dining","Date Night","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Matt Rimel",
    instagram: "@zenbusushi", website: "https://zenbusushi.com",
    dishes: ["Chef's Omakase","Sustainably-Sourced Fish","La Jolla Dining Room","Matt Rimel Program"],
    desc: "Matt Rimel's La Jolla Village sushi — a sustainability-first sourcing program (Rimel owns the boats), chef's omakase at the counter, and a Fay Ave dining room that has been one of La Jolla's most-serious sushi rooms for two decades." },
  { name: "Drift La Jolla", cuisine: "American / Burgers", neighborhood: "La Jolla",
    address: "1020 Prospect St, La Jolla, CA 92037",
    lookup: "1020 Prospect St, La Jolla, CA 92037",
    score: 84, price: 2, tags: ["American","Burgers","Casual","Patio","Scenic Views","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@driftlajolla", website: "https://driftlajolla.com",
    dishes: ["Smash Burger","Modern Burger Program","Prospect St Patio","Cove-Adjacent Format"],
    desc: "La Jolla Village's modern burger-and-beer counter on Prospect — a chef-driven smash burger, a Cove-adjacent patio, and a format that gave La Jolla its burger-shop anchor a block from the ocean." },
  { name: "Beaumont's Eatery", cuisine: "American / Gastropub", neighborhood: "Bird Rock",
    address: "5662 La Jolla Blvd, La Jolla, CA 92037",
    lookup: "5662 La Jolla Blvd, La Jolla, CA 92037",
    score: 84, price: 3, tags: ["American","Gastropub","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@beaumontseatery", website: "https://beaumontseatery.com",
    dishes: ["Elevated Gastropub","Craft Cocktails","La Jolla Blvd Patio","Rooftop Seating"],
    desc: "Bird Rock's chef-driven gastropub — a two-story La Jolla Blvd building with a rooftop patio, an elevated menu that reads more like a restaurant than a bar, and a Bird Rock neighborhood dinner room." },
  { name: "Coaster Saloon", cuisine: "American / Bar", neighborhood: "Mission Beach",
    address: "744 Ventura Pl, San Diego, CA 92109",
    lookup: "744 Ventura Pl, San Diego, CA 92109",
    score: 82, price: 1, tags: ["American","Bar","Dive","Late Night","Iconic","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "@coastersaloon", website: "",
    dishes: ["Dive Bar","Cheap Drinks","Roller-Coaster-Adjacent","Mission Beach Since 1934"],
    desc: "Mission Beach's original dive since 1934 — right next to the Giant Dipper roller coaster, cheap drinks, and the kind of unreconstructed MB room that has seen 90 summers without changing. The Mission Beach constant." },
  { name: "Cass Street Bar & Grill", cuisine: "American / Bar / Burgers", neighborhood: "Pacific Beach",
    address: "4612 Cass St, San Diego, CA 92109",
    lookup: "4612 Cass St, San Diego, CA 92109",
    score: 82, price: 1, tags: ["American","Bar","Burgers","Dive","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@cassstbarandgrill", website: "https://cassstreetbarandgrill.com",
    dishes: ["Cass Street Burger","Cheap Pitchers","PB Dive Format","Local Crowd"],
    desc: "Pacific Beach's Cass Street locals' dive — cheap pitchers, an actually-good burger, and the kind of PB corner room that locals have kept out of the beach-tourist rotation for decades." },
  { name: "Lamont Street Grill", cuisine: "American / Creole / Cajun", neighborhood: "Pacific Beach",
    address: "4445 Lamont St, San Diego, CA 92109",
    lookup: "4445 Lamont St, San Diego, CA 92109",
    score: 85, price: 3, tags: ["American","Creole","Cajun","Date Night","Patio","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@lamontstreetgrill", website: "https://lamontstreetgrill.com",
    dishes: ["Crab Cakes","Blackened Fish","Fireside Garden Patio","Since 1985"],
    desc: "Pacific Beach's fireside garden-patio Creole-Cajun since 1985 — crab cakes, blackened fish, and a back-patio garden with outdoor fireplaces that makes Lamont Street feel transplanted from the Quarter. A PB special-occasion anchor." }
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
  "Blue Point Coastal Cuisine":  { lat: 32.7118, lng: -117.1594 },
  "Dobson's Bar & Restaurant":   { lat: 32.7148, lng: -117.1637 },
  "Osteria Panevino":            { lat: 32.7128, lng: -117.1596 },
  "Henry's Pub":                 { lat: 32.7122, lng: -117.1593 }
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

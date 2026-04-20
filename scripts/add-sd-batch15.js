#!/usr/bin/env node
// San Diego batch 15 — Gaslamp classics + East Village + North Park breweries + Point Loma + Mission Beach (17)
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
  { name: "Kitchen 1540", cuisine: "Modern American / Californian", neighborhood: "Del Mar",
    address: "1540 Camino Del Mar, Del Mar, CA 92014",
    lookup: "1540 Camino Del Mar, Del Mar, CA 92014",
    score: 88, price: 4, tags: ["Fine Dining","American","Californian","Date Night","Celebrations","Patio","Scenic Views","Critics Pick"],
    reservation: "OpenTable",
    suburb: true,
    group: "L'Auberge Del Mar",
    instagram: "@kitchen1540", website: "https://laubergedelmar.com/dine",
    dishes: ["Chef's Tasting","Local Seafood","Ocean-View Patio","Resort-Tier Service"],
    desc: "L'Auberge Del Mar's fine-dining flagship — a seaside resort dining room perched above the Del Mar bluffs, a chef's tasting that pulls from SD County growers, and the kind of resort kitchen North County anniversaries quietly default to." },
  { name: "Cesarina", cuisine: "Italian / Roman", neighborhood: "Point Loma",
    address: "4161 Voltaire St, San Diego, CA 92107",
    lookup: "4161 Voltaire St, San Diego, CA 92107",
    score: 89, price: 3, tags: ["Italian","Roman","Date Night","Critics Pick","Trending","Patio","Hidden Gem"],
    reservation: "OpenTable",
    instagram: "@cesarinarestaurant", website: "https://cesarinarestaurant.com",
    dishes: ["Cacio e Pepe","House-Made Pasta","Tortellini in Brodo","Family-Style Patio"],
    desc: "Chef Cesarina Mezzoni's Point Loma Italian — a Voltaire St courtyard, a pasta-first menu that reads directly from Rome, and a reservation book that turned a Point Loma neighborhood into a pasta-destination corner. One of SD's most-talked-about Italian openings." },
  { name: "OB Noodle House", cuisine: "Vietnamese / Pan-Asian", neighborhood: "Ocean Beach",
    address: "2218 Cable St, San Diego, CA 92107",
    lookup: "2218 Cable St, San Diego, CA 92107",
    score: 86, price: 2, tags: ["Vietnamese","Asian Fusion","Casual","Cocktails","Late Night","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@obnoodlehouse", website: "https://obnoodlehouse.com",
    dishes: ["Bahn Mi Bar","Pho","Sake Cocktails","OB Late-Night Crowd"],
    desc: "Ocean Beach's bold Asian-fusion noodle house — a banh mi bar, pho program, sake cocktails, and a dining room that helped raise the ceiling for OB beyond surf-shack breakfasts. One of OB's most-cited late-night rooms." },
  { name: "Hello Betty Fish House", cuisine: "American / Seafood", neighborhood: "Oceanside",
    address: "211 Mission Ave, Oceanside, CA 92054",
    lookup: "211 Mission Ave, Oceanside, CA 92054",
    score: 85, price: 3, tags: ["American","Seafood","Date Night","Scenic Views","Patio","Rooftop","Local Favorites","Iconic"],
    reservation: "OpenTable",
    suburb: true,
    group: "Cohn Restaurant Group",
    instagram: "@hellobettysd", website: "https://cohnrestaurants.com/hellobetty",
    dishes: ["Rooftop Patio","Fish Tacos","Clam Chowder","Oceanside-Pier Views"],
    desc: "Cohn Restaurant Group's Oceanside pier-adjacent fish house — a rooftop patio aimed at the pier, chef-driven coastal-American menu, and one of the defining Oceanside casual-dinner-with-a-view rooms." },
  { name: "The Lion's Share", cuisine: "Modern American / Wild Game", neighborhood: "Little Italy",
    address: "629 Kettner Blvd, San Diego, CA 92101",
    lookup: "629 Kettner Blvd, San Diego, CA 92101",
    score: 87, price: 3, tags: ["American","Modern","Wild Game","Date Night","Cocktails","Critics Pick","Trending"],
    reservation: "OpenTable",
    instagram: "@thelionsshare", website: "https://thelionssharesd.com",
    dishes: ["Wild Boar","Elk","Rabbit","Craft Cocktail Program"],
    desc: "Little Italy's wild-game-forward modern-American — an elk-and-boar-and-rabbit menu that you don't find elsewhere in SD, a cocktail program that holds up on its own, and a dining room that makes the proposition specific. A defining Little Italy chef-kitchen." },
  { name: "La Puerta", cuisine: "Mexican / Cantina", neighborhood: "Gaslamp",
    address: "560 Fourth Ave, San Diego, CA 92101",
    lookup: "560 4th Ave, San Diego, CA 92101",
    score: 84, price: 2, tags: ["Mexican","Cantina","Casual","Margaritas","Late Night","Iconic","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@lapuertasd", website: "https://lapuertasd.com",
    dishes: ["Tequila & Mezcal List","Modern Tacos","Tableside Guacamole","Late-Night Patio"],
    desc: "Gaslamp's taco-and-tequila cantina — a 200+ bottle agave list, a taco-and-small-plates menu that travels with Gaslamp's crowd, and a corner patio that became the Gaslamp go-to for the pre-game Padres rotation." },
  { name: "Werewolf", cuisine: "American / Gastropub", neighborhood: "Gaslamp",
    address: "627 Fourth Ave, San Diego, CA 92101",
    lookup: "627 4th Ave, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Gastropub","Late Night","Patio","Cocktails","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@werewolf_sandiego", website: "https://werewolfsd.com",
    dishes: ["Truffle Fries","Burger Program","Craft Cocktails","Whiskey Bar"],
    desc: "Gaslamp's American gastropub-and-whiskey-bar — truffle fries, a serious whiskey program, and a corner-room format that made Werewolf a Gaslamp after-game regular. The Gaslamp adult-drink neighborhood move." },
  { name: "Neighborhood", cuisine: "American / Gastropub", neighborhood: "East Village",
    address: "777 G St, San Diego, CA 92101",
    lookup: "777 G St, San Diego, CA 92101",
    score: 85, price: 2, tags: ["American","Gastropub","Craft Beer","Casual","Cocktails","Late Night","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@neighborhoodsd", website: "https://neighborhoodsd.com",
    dishes: ["Duck Fat Fries","Burger","20+ Rotating Taps","Downtown Beer-Bar Template"],
    desc: "The CH Projects original — opened 2008, the downtown beer-bar-with-a-serious-kitchen format that launched the Consortium Holdings empire. Duck fat fries and a rotating tap program still define what an East Village weeknight looks like." },
  { name: "Maryjane's Diner — Hard Rock Hotel", cuisine: "American / Diner", neighborhood: "Gaslamp",
    address: "207 Fifth Ave, San Diego, CA 92101",
    lookup: "207 5th Ave, San Diego, CA 92101",
    score: 81, price: 2, tags: ["American","Diner","Breakfast","Late Night","Casual","Iconic","Family Friendly"],
    reservation: "walk-in",
    group: "Hard Rock Hotel",
    instagram: "@hardrockhotelsd", website: "https://hardrockhotels.com/san-diego",
    dishes: ["24-Hour Breakfast","Stuffed French Toast","Diner Milkshakes","Rock-Themed Interior"],
    desc: "The 24-hour diner inside Hard Rock Hotel Gaslamp — stuffed French toast, massive milkshakes, rock-memorabilia walls, and the kind of late-night format that absorbs Gaslamp's post-bar crowd. A Gaslamp downtown constant." },
  { name: "Crust Pizzeria Napoletana", cuisine: "Italian / Neapolitan Pizza", neighborhood: "North Park",
    address: "4237 Iowa St, San Diego, CA 92104",
    lookup: "4237 Iowa St, San Diego, CA 92104",
    score: 86, price: 2, tags: ["Italian","Pizza","Date Night","Critics Pick","Local Favorites","Hidden Gem"],
    reservation: "OpenTable",
    instagram: "@crustsandiego", website: "https://crustpizzeria.com",
    dishes: ["VPN-Certified Neapolitan Pizza","Margherita DOP","Burrata","Italian Wine List"],
    desc: "North Park's VPN-certified Neapolitan pizzeria — Naples-spec flour, San Marzano DOP tomatoes, a 900°F wood oven, and a dining room whose pizza program reads directly from the Associazione Verace Pizza Napoletana rulebook. A defining SD true-Neapolitan room." },
  { name: "Mike Hess Brewing — North Park", cuisine: "American / Brewery", neighborhood: "North Park",
    address: "3812 Grim Ave, San Diego, CA 92104",
    lookup: "3812 Grim Ave, San Diego, CA 92104",
    score: 83, price: 2, tags: ["American","Brewery","Casual","Patio","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "Mike Hess Brewing",
    instagram: "@mikehessbrewing", website: "https://mikehessbrewing.com",
    dishes: ["Mike Hess IPA","Grazias Cream Ale","Taproom Pours","Dog-Friendly Patio"],
    desc: "North Park's Mike Hess Brewing flagship — a cream-ale-and-IPA lineup, a dog-friendly Grim Ave patio, and one of the SD craft-beer brands that helped define the North Park beer-district identity." },
  { name: "Bivouac Ciderworks", cuisine: "American / Cider Bar", neighborhood: "North Park",
    address: "3986 30th St, San Diego, CA 92104",
    lookup: "3986 30th St, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Cider","Bar","Casual","Patio","Trending","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@bivouacciderworks", website: "https://bivouacciderworks.com",
    dishes: ["House-Made Cider","Rotating Cider Taps","Small Plates","Outdoor-Themed Taproom"],
    desc: "North Park's outdoor-adventure-themed ciderworks — house-fermented cider, a rotating tap program, and a 30th Street dining room that gave the neighborhood its first proper cider bar. A specific North Park chapter." },
  { name: "Tiger! Tiger! Tavern", cuisine: "American / Bar", neighborhood: "North Park",
    address: "3025 El Cajon Blvd, San Diego, CA 92104",
    lookup: "3025 El Cajon Blvd, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Bar","Craft Beer","Casual","Late Night","Local Favorites","Iconic","Trending"],
    reservation: "walk-in",
    instagram: "@tigertigertavern", website: "https://tigertigertavern.com",
    dishes: ["32+ Rotating Taps","Chef-Driven Bar Menu","Patio Program","Indie-Music Spillover"],
    desc: "North Park's El Cajon Blvd craft-beer tavern — 32+ rotating taps, a serious chef-driven bar-food menu, and the kind of dining room that feels simultaneously like a record shop and a kitchen. A defining North Park beer-and-food-before-the-show stop." },
  { name: "Blind Lady Ale House", cuisine: "American / Brewery / Pizza", neighborhood: "Normal Heights",
    address: "3416 Adams Ave, San Diego, CA 92116",
    lookup: "3416 Adams Ave, San Diego, CA 92116",
    score: 87, price: 2, tags: ["American","Brewery","Pizza","Casual","Patio","Family Friendly","Iconic","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Blind Lady Ale House",
    instagram: "@blindladyalehouse", website: "https://blindladyalehouse.com",
    dishes: ["Tinmouth Maine Pizza","32 Rotating Taps","Family-Style Dining","Cask Ale Program"],
    desc: "Normal Heights' family-friendly craft-beer destination — a pizza program that takes dough seriously, a 32-tap rotating list that beer geeks across SD use as reference, and a dining room that lets the kids run while the adults order the cask list. A defining SD beer-bar." },
  { name: "Saska's Steakhouse & Sushi", cuisine: "Steakhouse / Sushi", neighborhood: "Mission Beach",
    address: "3768 Mission Blvd, San Diego, CA 92109",
    lookup: "3768 Mission Blvd, San Diego, CA 92109",
    score: 83, price: 3, tags: ["American","Steakhouse","Sushi","Late Night","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@saskas_sd", website: "https://saskas.com",
    dishes: ["Steak Menu","Sushi Bar","Open Until 3 AM","Mission Beach Since 1951"],
    desc: "Mission Beach's steakhouse-and-sushi survivor since 1951 — open until 3 AM, a locals-only late-night crowd, and the kind of Mission Beach room where the generation of 1970s MB regulars still orders the same cut. An MB institution." },
  { name: "The Red Door", cuisine: "Modern American / Farm-to-Table", neighborhood: "Mission Hills",
    address: "741 W Washington St, San Diego, CA 92103",
    lookup: "741 W Washington St, San Diego, CA 92103",
    score: 86, price: 3, tags: ["American","Modern","Farm-to-Table","Date Night","Patio","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Trish Watlington",
    instagram: "@thereddoorsd", website: "https://thereddoorsd.com",
    dishes: ["Farm-to-Table Program","Chef's Garden Produce","Seasonal Menu","Mission Hills Patio"],
    desc: "Chef-owner Trish Watlington's Mission Hills modern-American — a literal chef's farm in Ramona supplying the kitchen, a daily-seasonal menu that runs Mission Hills' slow-food reputation, and a Washington St dining room that reads as Mission Hills' farm-to-table anchor." },
  { name: "Sammy's Woodfired Pizza & Grill — La Jolla", cuisine: "American / Pizza", neighborhood: "La Jolla",
    address: "702 Pearl St, La Jolla, CA 92037",
    lookup: "702 Pearl St, La Jolla, CA 92037",
    score: 82, price: 2, tags: ["American","Pizza","Casual","Family Friendly","Patio","Local Favorites","Iconic"],
    reservation: "OpenTable",
    group: "Sammy's Woodfired",
    instagram: "@sammysrestaurants", website: "https://sammyspizza.com",
    dishes: ["Woodfired Pizza","Messy Sundae","Kid-Friendly Program","La Jolla Patio"],
    desc: "SD chef Sami Ladeki's Woodfired — the La Jolla location of an SD-born mini-chain, with a wood oven, the iconic 'Messy Sundae' dessert, and a family-friendly format that's been the go-to for Pearl St birthdays for 30 years." }
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
  const gaslampTight = /Gaslamp|East Village|Little Italy/.test(name || "");
  if (gaslampTight) return c.lat >= 32.68 && c.lat <= 32.76 && c.lng >= -117.22 && c.lng <= -117.10;
  return c.lat >= 32.45 && c.lat <= 33.45 && c.lng >= -117.45 && c.lng <= -116.70;
}

(async () => {
  const s = getArrSlice("SD_DATA");
  const arr = parseArr(s.slice);
  let nextId = arr.length ? maxId(arr) + 1 : 15000;
  const existingNames = new Set(arr.map(r => r.name.toLowerCase()));
  const built = [];
  const manualFallback = {
    "Maryjane's Diner — Hard Rock Hotel": { lat: 32.7107, lng: -117.1578 },
    "La Puerta": { lat: 32.7105, lng: -117.1593 },
    "Werewolf": { lat: 32.7120, lng: -117.1593 }
  };
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

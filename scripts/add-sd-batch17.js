#!/usr/bin/env node
// San Diego batch 17 — final push to 300; Golden Hill + Kensington + Bird Rock + University Heights + Del Mar + more (22)
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
  { name: "Havana 1920", cuisine: "Cuban", neighborhood: "Gaslamp",
    address: "548 Fifth Ave, San Diego, CA 92101",
    lookup: "548 5th Ave, San Diego, CA 92101",
    score: 84, price: 3, tags: ["Cuban","Date Night","Cocktails","Live Music","Patio","Iconic"],
    reservation: "OpenTable",
    instagram: "@havana1920sd", website: "https://havana1920.com",
    dishes: ["Ropa Vieja","Mojitos","Live Latin Band","Upstairs Cigar Lounge"],
    desc: "Gaslamp's Cuban-themed room on 5th Ave — ropa vieja, a mojito program, live Latin music, and an upstairs cigar lounge that reads as 1920s Havana transplanted. One of Gaslamp's most-specific international rooms." },
  { name: "Saiko Sushi — Coronado", cuisine: "Japanese / Sushi", neighborhood: "Coronado",
    address: "1144 Orange Ave, Coronado, CA 92118",
    lookup: "1144 Orange Ave, Coronado, CA 92118",
    score: 84, price: 3, tags: ["Japanese","Sushi","Date Night","Local Favorites","Critics Pick","Patio"],
    reservation: "OpenTable",
    group: "Saiko Sushi",
    instagram: "@saikosushi", website: "https://saikosushi.com",
    dishes: ["Chef-Driven Sushi","Hot Rolls","Omakase Option","Coronado Orange Ave Patio"],
    desc: "Saiko's Coronado room — a chef-driven sushi counter with an omakase option, an Orange Ave patio, and the kind of Coronado-dinner reliability that locals have made part of the island's rotation." },
  { name: "Ritual Kitchen & Beer Garden", cuisine: "American / Gastropub", neighborhood: "North Park",
    address: "4095 30th St, San Diego, CA 92104",
    lookup: "4095 30th St, San Diego, CA 92104",
    score: 83, price: 2, tags: ["American","Gastropub","Patio","Casual","Craft Beer","Local Favorites"],
    reservation: "walk-in",
    instagram: "@ritualnorthpark", website: "https://ritualtavern.com",
    dishes: ["Gastropub Menu","Craft Beer Garden","Brunch Program","North Park 30th Street"],
    desc: "North Park's 30th Street gastropub-and-beer-garden — a chef-driven menu with a tight craft-beer list, a weekend brunch program, and the kind of back-patio room that North Park regulars default to. A 30th Street everyday." },
  { name: "Bronx Pizza", cuisine: "Italian / Pizza", neighborhood: "Hillcrest",
    address: "111 Washington St, San Diego, CA 92103",
    lookup: "111 Washington St, San Diego, CA 92103",
    score: 85, price: 1, tags: ["Italian","Pizza","Casual","Quick Bite","Iconic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@bronxpizza", website: "https://bronxpizza.com",
    dishes: ["NY-Style Slices","Whole Pies Only","Cash Only","Since 1993"],
    desc: "Hillcrest's no-frills NY-style pizza counter since 1993 — whole pies only for sit-down, cash-only, and a dining room that refuses to move past its original format. The Hillcrest pizza argument." },
  { name: "Caffe Calabria", cuisine: "Italian / Cafe / Pizza", neighborhood: "North Park",
    address: "3933 30th St, San Diego, CA 92104",
    lookup: "3933 30th St, San Diego, CA 92104",
    score: 87, price: 2, tags: ["Italian","Coffee","Pizza","Casual","Iconic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    instagram: "@caffecalabria", website: "https://caffecalabria.com",
    dishes: ["House-Roasted Espresso","VPN Neapolitan Pizza","30th Street Cafe","Italian Wine List"],
    desc: "North Park's Italian café-and-pizzeria since 1986 — in-house espresso roasting, VPN-certified Neapolitan pizza at night, and a 30th Street dining room that has anchored North Park's Italian identity for four decades." },
  { name: "Pop Pie Co.", cuisine: "American / Australian / Pies", neighborhood: "University Heights",
    address: "4404 Park Blvd, San Diego, CA 92116",
    lookup: "4404 Park Blvd, San Diego, CA 92116",
    score: 86, price: 2, tags: ["American","Australian","Bakery","Casual","Critics Pick","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Pop Pie Co.",
    instagram: "@poppiecompany", website: "https://poppieco.com",
    dishes: ["Australian Savory Pies","Chicken Curry Pie","Lamb & Rosemary","Park Blvd Counter"],
    desc: "University Heights' Australian savory-pie counter — chicken curry, lamb-and-rosemary, and a small-format Park Blvd kitchen that grew from a single location into an SD-born pies brand. A specific UH everyday default." },
  { name: "Wayfarer Bread & Pastry", cuisine: "Bakery", neighborhood: "Bird Rock",
    address: "5666 La Jolla Blvd, San Diego, CA 92037",
    lookup: "5666 La Jolla Blvd, San Diego, CA 92037",
    score: 89, price: 2, tags: ["Bakery","Cafe","Breakfast","Casual","Critics Pick","Trending","Iconic","Hidden Gem"],
    reservation: "walk-in",
    group: "Crystal Sawyer / Wayfarer",
    instagram: "@wayfarerbread", website: "https://wayfarerbread.com",
    dishes: ["Naturally-Leavened Bread","Croissants","Seasonal Pastry Case","Morning-Only Format"],
    desc: "Chef Crystal Sawyer's Bird Rock bakery — a naturally-leavened bread program, laminated pastry case that sells out daily, and a morning-only format that has made Wayfarer the SD baker's-reference bread shop. A specific Bird Rock destination." },
  { name: "Manpuku", cuisine: "Japanese / Donburi", neighborhood: "North Park",
    address: "3784 30th St, San Diego, CA 92104",
    lookup: "3784 30th St, San Diego, CA 92104",
    score: 83, price: 2, tags: ["Japanese","Casual","Quick Bite","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@manpukunp", website: "",
    dishes: ["Donburi Bowls","Unagi Rice","Karaage Chicken","Ramen Program"],
    desc: "North Park's tiny Japanese donburi shop — unagi rice bowls, karaage, and a ramen program in a 30th Street format that has quietly been one of the neighborhood's Japanese defaults. A North Park hidden room." },
  { name: "Bleu Boheme", cuisine: "French / Bistro", neighborhood: "Kensington",
    address: "4090 Adams Ave, San Diego, CA 92116",
    lookup: "4090 Adams Ave, San Diego, CA 92116",
    score: 87, price: 3, tags: ["French","Bistro","Date Night","Patio","Critics Pick","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@bleuboheme", website: "https://bleuboheme.com",
    dishes: ["Moules Frites","Escargot","French Onion Soup","Kensington Village Patio"],
    desc: "Kensington's French bistro in the Village — moules frites, escargot, French onion, and the kind of Adams Ave storefront that Kensington regulars have treated as their neighborhood Paris for over a decade. A Kensington date-night anchor." },
  { name: "Blue Water Seafood Market & Grill", cuisine: "Seafood / Casual", neighborhood: "Mission Hills",
    address: "3667 India St, San Diego, CA 92103",
    lookup: "3667 India St, San Diego, CA 92103",
    score: 86, price: 2, tags: ["Seafood","Casual","Quick Bite","Iconic","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@bluewaterseafoodsd", website: "https://bluewaterseafoodsandiego.com",
    dishes: ["Mesquite-Grilled Fish Tacos","Sashimi Platter","Fresh Fish Case","Mission Hills Counter"],
    desc: "Mission Hills' order-counter market-and-grill — mesquite-grilled fish tacos, a fresh case that supplies retail and the kitchen from the same ice, and a format SD regulars call one of the best fish taco rooms in the city. A defining Mission Hills everyday." },
  { name: "El Camino", cuisine: "Mexican / Cantina", neighborhood: "Little Italy",
    address: "2400 India St, San Diego, CA 92101",
    lookup: "2400 India St, San Diego, CA 92101",
    score: 84, price: 2, tags: ["Mexican","Cantina","Margaritas","Late Night","Patio","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Consortium Holdings / CH Projects",
    instagram: "@elcaminosd", website: "https://elcaminosd.com",
    dishes: ["Mezcal Program","Tacos","Late-Night Patio","Day of the Dead Decor"],
    desc: "CH Projects' Little Italy Mexican cantina — a Day of the Dead-themed interior, a deep mezcal program, and a late-night India Street patio that has been the CH Projects neighborhood late-night option for years." },
  { name: "Krakatoa Cafe", cuisine: "Coffee / Cafe", neighborhood: "Golden Hill",
    address: "1128 25th St, San Diego, CA 92102",
    lookup: "1128 25th St, San Diego, CA 92102",
    score: 83, price: 1, tags: ["Coffee","Cafe","Casual","Hidden Gem","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@krakatoacoffee", website: "",
    dishes: ["Espresso Program","Breakfast Sandwiches","Garden Patio","Golden Hill Neighborhood Cafe"],
    desc: "Golden Hill's corner coffee-and-breakfast-garden — a tree-canopied 25th Street patio, an espresso program that doesn't need to outrun the neighborhood competition, and one of the most-specific Golden Hill locals' morning rooms." },
  { name: "Turf Supper Club", cuisine: "American / Steakhouse", neighborhood: "Golden Hill",
    address: "1116 25th St, San Diego, CA 92102",
    lookup: "1116 25th St, San Diego, CA 92102",
    score: 85, price: 2, tags: ["American","Steakhouse","Casual","Late Night","Iconic","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "@turfsupperclub", website: "https://turfsupperclub.com",
    dishes: ["Grill-Your-Own Steak","Fireside Cooking","Old-School Lounge","Since 1952"],
    desc: "Golden Hill's grill-your-own steakhouse since 1952 — pick a raw steak at the counter, cook it yourself over a table grill in the dining room, order a cocktail from the old-school lounge. The most-specific SD retro dinner format still running." },
  { name: "Barrio Star", cuisine: "Mexican", neighborhood: "Bankers Hill",
    address: "2706 Fifth Ave, San Diego, CA 92103",
    lookup: "2706 5th Ave, San Diego, CA 92103",
    score: 84, price: 3, tags: ["Mexican","Date Night","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    group: "Isabel Cruz",
    instagram: "@barriostarsd", website: "https://barriostar.com",
    dishes: ["Isabel Cruz Program","Carne Asada","Fresh Margaritas","5th Ave Patio"],
    desc: "Chef Isabel Cruz's Bankers Hill Mexican — a 5th Ave sister to Isabel's Cantina in PB, with the same Pan-Latin palate Cruz has used to anchor SD Mexican dining for two decades. A Bankers Hill standby." },
  { name: "Isabel's Cantina", cuisine: "Pan-Asian / Latin", neighborhood: "Pacific Beach",
    address: "966 Felspar St, San Diego, CA 92109",
    lookup: "966 Felspar St, San Diego, CA 92109",
    score: 85, price: 3, tags: ["Pan-Asian","Latin","Date Night","Breakfast","Patio","Iconic","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    group: "Isabel Cruz",
    instagram: "@isabelscantina", website: "https://isabelscantina.com",
    dishes: ["Coconut French Toast","Pan-Asian Breakfast","Bali-Room Decor","Weekend Brunch"],
    desc: "Chef Isabel Cruz's Pacific Beach flagship — a Pan-Asian-meets-Latin breakfast menu with a coconut French toast that defined SD brunch ambition, a Felspar St dining room that reads like Bali transplanted, and a Cruz program that has shaped SD cooking since the '90s." },
  { name: "Fig Tree Cafe — Liberty Station", cuisine: "American / Breakfast / Brunch", neighborhood: "Point Loma / Liberty Station",
    address: "2400 Historic Decatur Rd, San Diego, CA 92106",
    lookup: "2400 Historic Decatur Rd, San Diego, CA 92106",
    score: 82, price: 2, tags: ["American","Breakfast","Brunch","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Fig Tree Cafe",
    instagram: "@figtreecafe", website: "https://figtreecafesandiego.com",
    dishes: ["From-Scratch Breakfast","Stuffed French Toast","Liberty Station Courtyard","Weekend Brunch Program"],
    desc: "Liberty Station's from-scratch breakfast café — stuffed French toast, a patio in the Liberty Station courtyard, and a multi-location SD brunch brand whose Liberty Station room is the family-crowd default." },
  { name: "Cucina Enoteca — Del Mar", cuisine: "Italian", neighborhood: "Del Mar",
    address: "2730 Via de la Valle, Del Mar, CA 92014",
    lookup: "2730 Via de la Valle, Del Mar, CA 92014",
    score: 87, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Local Favorites","Trending"],
    reservation: "OpenTable",
    suburb: true,
    group: "Urban Kitchen Group / Tracy Borkum",
    instagram: "@cucinaenoteca", website: "https://urbankitchengroup.com/cucinaenoteca",
    dishes: ["Chef-Driven Italian","Wood-Fired Pizza","Reclaimed-Wood Dining Room","300+ Wine List"],
    desc: "Chef-restaurateur Tracy Borkum's Del Mar Italian — Flower Hill Promenade dining room built from reclaimed architectural salvage, a deep wine list, and the Urban Kitchen Group's most-polished room. A defining North County Italian special-occasion call." },
  { name: "Better Buzz Coffee — Pacific Beach", cuisine: "Coffee / Cafe", neighborhood: "Pacific Beach",
    address: "4655 Cass St, San Diego, CA 92109",
    lookup: "4655 Cass St, San Diego, CA 92109",
    score: 84, price: 1, tags: ["Coffee","Cafe","Casual","Local Favorites","Iconic","Trending","Brunch"],
    reservation: "walk-in",
    group: "Better Buzz",
    instagram: "@betterbuzzcoffee", website: "https://betterbuzzcoffee.com",
    dishes: ["Best Drink Ever","Specialty Lattes","Açaí Bowls","PB Flagship"],
    desc: "The Pacific Beach flagship of Better Buzz — SD's home-grown specialty-coffee brand, with the 'Best Drink Ever' espresso shake that became the brand's SD signature. The PB location is the most-photographed of the SD-wide chain." },
  { name: "Madison on Park", cuisine: "American / Wine Bar / Modern", neighborhood: "University Heights",
    address: "4622 Park Blvd, San Diego, CA 92116",
    lookup: "4622 Park Blvd, San Diego, CA 92116",
    score: 86, price: 3, tags: ["American","Modern","Wine Bar","Date Night","Critics Pick","Patio","Trending"],
    reservation: "OpenTable",
    group: "Lisa Altmann",
    instagram: "@madisononpark", website: "https://madisononpark.com",
    dishes: ["Wine-Forward Menu","Seasonal Small Plates","Park Blvd Patio","Intimate Dining Room"],
    desc: "Chef-owner Lisa Altmann's University Heights modern-American — a Park Blvd wine-forward dining room with a tight seasonal menu and the kind of intimate service that gave UH its most-reservation-watched opening in recent memory." },
  { name: "Cafe Coyote", cuisine: "Mexican", neighborhood: "Old Town",
    address: "2461 San Diego Ave, San Diego, CA 92110",
    lookup: "2461 San Diego Ave, San Diego, CA 92110",
    score: 82, price: 2, tags: ["Mexican","Margaritas","Patio","Family Friendly","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@cafecoyote", website: "https://cafecoyoteoldtown.com",
    dishes: ["Tableside Guacamole","Margaritas","Mariachi Patio","Old Town Since 1989"],
    desc: "Old Town's Cafe Coyote since 1989 — a tableside-guacamole, margarita-and-mariachi patio, and the kind of Old Town family-crowd room that has been the tourist-and-local common ground for three decades. A defining Old Town patio." },
  { name: "Marisi", cuisine: "Italian / Contemporary", neighborhood: "La Jolla",
    address: "7722 Fay Ave, La Jolla, CA 92037",
    lookup: "7722 Fay Ave, La Jolla, CA 92037",
    score: 89, price: 4, tags: ["Fine Dining","Italian","Date Night","Celebrations","Critics Pick","Trending","Patio"],
    reservation: "Resy",
    instagram: "@marisilajolla", website: "https://marisilajolla.com",
    dishes: ["House-Made Pasta","Whole Fish","Wood-Fired Program","La Jolla Fay Ave Dining Room"],
    desc: "La Jolla Village's contemporary Italian — a pasta program benchmarked against the best of modern Italian openings, a wood-fired kitchen, and the kind of reservation book that tells you Marisi has quickly become one of La Jolla's most-specific dinner tables." },
  { name: "Flying Pig Pub & Kitchen — Oceanside", cuisine: "American / Gastropub", neighborhood: "Oceanside",
    address: "510 Mission Ave, Oceanside, CA 92054",
    lookup: "510 Mission Ave, Oceanside, CA 92054",
    score: 85, price: 3, tags: ["American","Gastropub","Date Night","Patio","Craft Beer","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    suburb: true,
    instagram: "@flyingpigsd", website: "https://flyingpigpubandkitchen.com",
    dishes: ["Elevated Gastropub Menu","Brussels Sprouts","Craft Cocktails","Mission Ave Patio"],
    desc: "Oceanside's chef-driven gastropub on Mission Ave — a menu that treats pub food as an actual kitchen exercise, a craft-beer-and-cocktail bar, and one of the Oceanside downtown rooms that helped reframe what Oceanside dining could be." }
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

const manualFallback = {
  "Havana 1920":         { lat: 32.7115, lng: -117.1594 },
  "Barrio Star":         { lat: 32.7390, lng: -117.1614 }   // 2706 5th Ave Bankers Hill
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

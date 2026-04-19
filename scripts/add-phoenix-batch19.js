#!/usr/bin/env node
// Phoenix batch 19 — Apify-verified cocktail bars + Valley nightlife standouts (15 entries)
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
  { name: "Highball", cuisine: "Cocktail Bar", neighborhood: "Midtown",
    address: "1514 N 7th Ave, Phoenix, AZ 85007",
    lookup: "1514 N 7th Ave, Phoenix, AZ 85007",
    score: 89, price: 3, tags: ["Cocktails","Bar","Date Night","Late Night","Critics Pick","Iconic","Historic"],
    reservation: "walk-in",
    instagram: "@highballphx", website: "",
    dishes: ["Classic Cocktail Program","Seasonal Menu","Precision Highballs","Rare Spirit Selection"],
    desc: "Old-school classy, dimly lit cocktail room with some of the most precisely made drinks in town — annual Spirited Award nominations tell the story. 7th Ave in the Willo neighborhood; small, serious, and the kind of bar that made Phoenix a legitimate cocktail city." },
  { name: "Barcoa Agaveria", cuisine: "Agave / Cocktail Bar", neighborhood: "Downtown Phoenix",
    address: "132 S Central Ave, Phoenix, AZ 85004",
    lookup: "132 S Central Ave, Phoenix, AZ 85004",
    score: 88, price: 3, tags: ["Cocktails","Bar","Mexican","Date Night","Critics Pick","Trending"],
    reservation: "walk-in",
    instagram: "@barcoaagaveria", website: "",
    dishes: ["Tequila Flight","Mezcal Program","Sotol Selection","Bacanora"],
    desc: "Downtown Phoenix agave specialist on two floors — the Valley's deepest tequila, mezcal, sotol, and bacanora selection plus cocktails to match. Shares a building with Little Rituals; together they anchor DTPHX's serious-drink block." },
  { name: "Quartz", cuisine: "Cocktail Bar / Experimental", neighborhood: "Downtown Phoenix",
    address: "341 W Van Buren St, Phoenix, AZ 85003",
    lookup: "341 W Van Buren St, Phoenix, AZ 85003",
    score: 88, price: 4, tags: ["Cocktails","Bar","Speakeasy","Date Night","Critics Pick","Trending","Hidden Gem"],
    reservation: "Resy",
    instagram: "@quartzbarphx", website: "",
    dishes: ["Signature Gem Cocktails","The Cave Reservation","Experimental Menu","Spirit Flight"],
    desc: "Gem-themed downtown cocktail bar with a reservations-only inner 'Cave' room pouring wildly experimental drinks — camel fat, hay, fizzy olive, technique-forward formats that stretch what a cocktail can be. Two formats in one room: front bar for walk-ins, Cave for bookings." },
  { name: "Bar 1912", cuisine: "Cocktail Bar", neighborhood: "Melrose",
    address: "4130 N 7th Ave, Phoenix, AZ 85013",
    lookup: "4130 N 7th Ave, Phoenix, AZ 85013",
    score: 86, price: 3, tags: ["Cocktails","Bar","Hidden Gem","Date Night","Historic","Trending"],
    reservation: "walk-in",
    instagram: "@bar1912phx", website: "",
    dishes: ["Local-Ingredient Cocktails","House Tinctures","Seasonal Menu","Desert Botanicals"],
    desc: "A quintessentially Phoenix cocktail bar tucked behind a restaurant inside an old dry cleaners — local ingredients, house-made tinctures, and a casual desert vibe. The bar bar — the kind of place the regulars don't talk about to keep it from getting busier." },
  { name: "Killer Whale Sex Club", cuisine: "Cocktail Bar", neighborhood: "Downtown Phoenix",
    address: "922 N 6th St, Phoenix, AZ 85004",
    lookup: "922 N 6th St, Phoenix, AZ 85004",
    score: 85, price: 2, tags: ["Cocktails","Bar","Late Night","Trending","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    group: "Pour Bastard",
    instagram: "@killerwhalesexclub", website: "",
    dishes: ["Signature Bizarre Cocktails","Dark Bar Program","Late Menu","Shot Specials"],
    desc: "Dark, loud, and rowdy cocktail bar from Pour Bastard — the name is the vibe-check. Signature bizarre drinks delivered with unrelenting personality, a crowd that skews industry-after-work, and a format built on not giving a damn about decorum. Phoenix's most specific dive-plus-cocktail-bar experiment." },
  { name: "FYPM", cuisine: "Cocktail Bar", neighborhood: "Roosevelt Row",
    address: "509 E Roosevelt St, Phoenix, AZ 85004",
    lookup: "509 E Roosevelt St, Phoenix, AZ 85004",
    score: 86, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Trending","Hidden Gem"],
    reservation: "walk-in",
    group: "Pour Bastard / Pretty Penny",
    instagram: "@fypmphx", website: "",
    dishes: ["Clarified Cocktails","Pink-Neon Menu","Experimental Spirits","Seasonal Drinks"],
    desc: "Pink-neon futurism cocktail bar hidden inside Disco Dragon from the Killer Whale Sex Club and Pretty Penny team. Clarified cocktails — a technique-heavy format that filters drinks to a crystal-clear finish — plus late hours and a vibe best described as 'pick a lane and own it.'" },
  { name: "Carry On", cuisine: "Immersive Cocktail Experience", neighborhood: "Downtown Phoenix",
    address: "1 N 1st St, Phoenix, AZ 85004",
    lookup: "1 N 1st St, Phoenix, AZ 85004",
    score: 87, price: 4, tags: ["Cocktails","Immersive","Date Night","Trending","Critics Pick","Speakeasy"],
    reservation: "Tock",
    group: "Barter & Shake",
    instagram: "@carryonphx", website: "",
    dishes: ["90-Minute Flight Experience","Themed Cocktails","Theatrical Service","Plane Fuselage Dining"],
    desc: "A 90-minute immersive cocktail experience aboard a vintage airplane fuselage — craft drinks paired with a first-class-flight theatrical format, complete with in-flight menu cards and aviation details. The Barter & Shake group's most ambitious immersive concept yet." },
  { name: "The Ostrich", cuisine: "Speakeasy / Cocktail Bar", neighborhood: "Chandler",
    address: "10 N San Marcos Pl, Chandler, AZ 85225",
    lookup: "10 N San Marcos Pl, Chandler, AZ 85225",
    score: 87, price: 3, tags: ["Cocktails","Speakeasy","Bar","Date Night","Historic","Hidden Gem","Iconic"],
    reservation: "walk-in",
    instagram: "@theostrichchandler", website: "",
    dishes: ["Inventive Cocktails","Hidden-Entry Format","Classic Drinks","Prohibition Program"],
    desc: "A subterranean speakeasy below Crust Pizza in a 1920s basement space next to the San Marcos Hotel — pouring inventive cocktails in a funky, crowded room. One of Arizona's most specific speakeasy experiences; Chandler locals protect it like it's their own." },
  { name: "The White Rabbit", cuisine: "Speakeasy / Cocktail Bar", neighborhood: "Gilbert",
    address: "207 N Gilbert Rd, Gilbert, AZ 85234",
    lookup: "207 N Gilbert Rd, Gilbert, AZ 85234",
    score: 86, price: 3, tags: ["Cocktails","Speakeasy","Bar","Date Night","Hidden Gem","Historic"],
    reservation: "walk-in",
    instagram: "@thewhiterabbitgilbert", website: "",
    dishes: ["Password-Required Entry","Craft Cocktails","Seasonal Menu","Basement Bar"],
    desc: "Password-required basement speakeasy in Gilbert's Heritage Court building — a genuinely fun hidden cocktail den in old downtown Gilbert, complete with a Wonderland-themed visual identity and a cocktail program that doesn't phone in the theme. A real rabbit hole." },
  { name: "Don Wood's Say When", cuisine: "Rooftop Bar / Cocktail Bar", neighborhood: "Uptown",
    address: "400 W Camelback Rd, Phoenix, AZ 85013",
    lookup: "400 W Camelback Rd, Phoenix, AZ 85013",
    score: 86, price: 3, tags: ["Rooftop","Cocktails","Bar","Date Night","Scenic Views","Trending","Brunch"],
    reservation: "walk-in",
    group: "Bitter & Twisted",
    instagram: "@saywhen_phx", website: "",
    dishes: ["Classic Cocktails with Twists","Small Bites","Weekend Brunch","Skyline Views"],
    desc: "Escapist mid-century rooftop bar at the Rise Hotel — twists on classic cocktails from the Bitter & Twisted team, small bites, and weekend brunch. The 7th Ave corridor's best reason to look up, with the right late-afternoon sunset angle." },
  { name: "Upstairs at Flint", cuisine: "Cocktail Lounge", neighborhood: "Biltmore",
    address: "2425 E Camelback Rd, Phoenix, AZ 85016",
    lookup: "2425 E Camelback Rd, Phoenix, AZ 85016",
    score: 86, price: 4, tags: ["Cocktails","Lounge","Date Night","Scenic Views","Cocktails","Patio","Trending"],
    reservation: "walk-in",
    group: "Flint by Baltair",
    instagram: "@upstairsatflint", website: "",
    dishes: ["Craft Cocktails","Small Plates","Sunset Views","Seasonal Menu"],
    desc: "Upscale date-night cocktail lounge above Flint by Baltair with Piestewa Peak and Biltmore views — the Camelback Road adult drinking room. Quiet, refined, and a proper alternative to the louder Old Town Scottsdale scene." },
  { name: "Lon's Last Drop", cuisine: "Cocktail Bar", neighborhood: "Paradise Valley",
    address: "5532 N Palo Cristi Rd, Paradise Valley, AZ 85253",
    lookup: "5532 N Palo Cristi Rd, Paradise Valley, AZ 85253",
    score: 87, price: 3, tags: ["Cocktails","Bar","Date Night","Patio","Historic","Iconic","Romantic"],
    reservation: "walk-in",
    group: "Hermosa Inn",
    instagram: "@lonshermosainn", website: "https://www.hermosainn.com",
    dishes: ["Classic Cocktails","Garden Setting","Seasonal Drinks","Small Plates"],
    desc: "Intimate cocktail spot at the historic Hermosa Inn — a lovely garden setting where the kitchen arguably outpaces the bar, though the bar holds its own. A Paradise Valley hidden jewel; most visitors never know it exists off the Lon's restaurant patio." },
  { name: "Coabana", cuisine: "Cuban / Cocktail Bar", neighborhood: "Downtown Phoenix",
    address: "1 E Washington St, Phoenix, AZ 85004",
    lookup: "1 E Washington St, Phoenix, AZ 85004",
    score: 85, price: 3, tags: ["Cocktails","Cuban","Bar","Date Night","Latin","Trending","Cocktails"],
    reservation: "OpenTable",
    instagram: "@coabanaphx", website: "",
    dishes: ["Rum-Forward Cocktails","Cuban Mojito","Cuban Fare","Tropical Menu"],
    desc: "Cuban-inspired cocktail bar downtown — rum-forward drinks, Cuban food menu, and a modern tropical setting that works as a pre-show Chase Field stop or a late-night rum finish. Wide rum list curated with intent." },
  { name: "The Brickyard Downtown", cuisine: "Cocktail Bar / Restaurant", neighborhood: "Chandler",
    address: "85 W Boston St, Chandler, AZ 85225",
    lookup: "85 W Boston St, Chandler, AZ 85225",
    score: 85, price: 3, tags: ["American","Cocktails","Bar","Date Night","Patio","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@thebrickyarddowntown", website: "",
    dishes: ["Craft Cocktails","Seasonal Kitchen","Brunch Program","Patio Service"],
    desc: "Playful downtown Chandler cocktail bar with an expansive drink list and food that rivals its bigger-name peers. Patio on Boston Street, a drinks menu that leans whiskey and agave, and one of the most consistent Chandler dinners." },
  { name: "Tell Your Friends", cuisine: "Speakeasy / Cocktail Bar", neighborhood: "North Scottsdale",
    address: "17797 N Scottsdale Rd, Scottsdale, AZ 85255",
    lookup: "17797 N Scottsdale Rd, Scottsdale, AZ 85255",
    score: 86, price: 3, tags: ["Cocktails","Speakeasy","Bar","Date Night","Live Music","Trending","Hidden Gem"],
    reservation: "walk-in",
    group: "Americano",
    instagram: "@tellyourfriendsaz", website: "",
    dishes: ["Prohibition-Era Cocktails","Jazz Nights","Elevated Bar Snacks","Speakeasy Format"],
    desc: "A Roaring-20s-style cocktail bar beneath Americano with glitzy lighting, nightly jazz/lounge music, and elevated bar snacks. North Scottsdale's proper speakeasy — the entrance is part of the experience; the drink program backs up the theatrics." }
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

(async () => {
  const s = getArrSlice("PHX_DATA");
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

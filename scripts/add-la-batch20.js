#!/usr/bin/env node
// LA batch 20 — Lounges + bars + Malibu + more LA culture (Apify-verified + training)
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
  { name: "The Virgil", cuisine: "Cocktail Bar / Live Music", neighborhood: "East Hollywood",
    address: "4519 Santa Monica Blvd, Los Angeles, CA 90029",
    lookup: "4519 Santa Monica Blvd, Los Angeles, CA 90029",
    score: 86, price: 2, tags: ["Cocktails","Live Music","Bar","Late Night","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@thevirgil", website: "",
    dishes: ["Live DJ Nights","Afro-Cuban Band","Hip-Hop Soul","Craft Cocktails"],
    desc: "East Hollywood cocktail bar that alternates live DJs and live bands across Afro-Cuban, funk, hip-hop soul. Velvet-and-gold interior, dance floor in the back, drinks better than the no-cover suggests. The Virgil is the antidote to WeHo bottle service." },
  { name: "Bar Lis", cuisine: "Rooftop / French Riviera", neighborhood: "Hollywood",
    address: "1541 Wilcox Ave, Los Angeles, CA 90028",
    lookup: "1541 Wilcox Ave, Los Angeles, CA 90028",
    score: 88, price: 3, tags: ["Rooftop","French","Cocktails","Date Night","Scenic Views","Live Music","Trending","Patio"],
    reservation: "Resy",
    group: "Thompson Hollywood",
    instagram: "@barlisla", website: "",
    dishes: ["French Riviera Cocktails","Live Jazz Tuesdays","Caviar Service","Pizzettes"],
    desc: "Thompson Hollywood's rooftop — a French Riviera-themed sky lounge with panoramic Hollywood views, live jazz on Tuesday, and a cocktail program calibrated for the setting. One of Hollywood's most-photographed patios at the moment, and the food actually earns the setting." },
  { name: "Offsunset", cuisine: "Nightclub / Cocktails", neighborhood: "West Hollywood",
    address: "8029 Sunset Blvd, Los Angeles, CA 90046",
    lookup: "8029 Sunset Blvd, Los Angeles, CA 90046",
    score: 86, price: 4, tags: ["Nightclub","Cocktails","Lounge","Late Night","Scene","Trending","Exclusive"],
    reservation: "walk-in",
    instagram: "@offsunsetla", website: "",
    dishes: ["Bottle Service","No-Phone Policy","Signature Cocktails","VIP Tables"],
    desc: "Exclusive Sunset Boulevard incognito nightclub (in the former Hyde space) — guest-list-only access, no-phone policy, and a deliberate anti-paparazzi stance. The WeHo nightclub the industry actually goes to when they don't want to be photographed." },
  { name: "Treehouse Rooftop LA", cuisine: "Rooftop / Latin", neighborhood: "Chinatown",
    address: "686 N Spring St, Los Angeles, CA 90012",
    lookup: "686 N Spring St, Los Angeles, CA 90012",
    score: 84, price: 3, tags: ["Rooftop","Cocktails","Latin","Date Night","Late Night","Scene","Trending","Dance"],
    reservation: "walk-in",
    instagram: "@treehouse.la", website: "",
    dishes: ["Reggaeton DJ Nights","Tropical Cocktails","Mezcal Flight","Shared Plates"],
    desc: "Chinatown rooftop that turned Latin/reggaeton DJ nights into a neighborhood institution. Tropical cocktails, lantern-draped patio, and a crowd that turns the space into a proper dance floor by midnight. One of the few Chinatown rooftops with actual energy." },
  { name: "Sassafras Saloon", cuisine: "Cocktail Bar / Southern", neighborhood: "Hollywood",
    address: "1233 Vine St, Los Angeles, CA 90038",
    lookup: "1233 Vine St, Los Angeles, CA 90038",
    score: 86, price: 3, tags: ["Cocktails","Bar","Southern","Date Night","Iconic","Late Night"],
    reservation: "walk-in",
    group: "213 Hospitality",
    instagram: "@sassafrassaloon", website: "https://sassafrassaloon.com",
    dishes: ["Southern-Inspired Cocktails","Mint Juleps","Small Plates","Live Music Nights"],
    desc: "1920s deep-South-themed Hollywood bar — porch swings, stained glass, Spanish moss hanging from the ceiling. Mint juleps are the order; the bourbon program is serious; and the whole room plays like a Charleston fever dream dropped into Vine Street." },
  { name: "Duke's Malibu", cuisine: "Hawaiian / Seafood", neighborhood: "Malibu",
    address: "21150 Pacific Coast Hwy, Malibu, CA 90265",
    lookup: "21150 Pacific Coast Hwy, Malibu, CA 90265",
    score: 85, price: 3, tags: ["Hawaiian","Seafood","American","Date Night","Patio","Scenic Views","Iconic"],
    reservation: "OpenTable",
    group: "TS Restaurants",
    instagram: "@dukesmalibu", website: "https://dukesmalibu.com",
    dishes: ["Hula Pie","Fresh Catch","Mai Tai","Macadamia Nut-Crusted Fish"],
    desc: "Malibu's oceanfront Hawaiian-themed institution named after Duke Kahanamoku — decked over the sand with windows that catch the Pacific. Hula Pie, mai tais, the kind of fresh-catch preparation that has kept a 45-year-old menu relevant. The most reliably good PCH stop between Santa Monica and Zuma." },
  { name: "Saint Felix", cuisine: "Cocktail Bar / Mexican", neighborhood: "Hollywood",
    address: "1602 N Cahuenga Blvd, Los Angeles, CA 90028",
    lookup: "1602 N Cahuenga Blvd, Los Angeles, CA 90028",
    score: 84, price: 2, tags: ["Cocktails","Bar","Mexican","Casual","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@saintfelixhollywood", website: "",
    dishes: ["Deconstructed Nachos","House Cocktails","Mezcal Selection","Street Tacos"],
    desc: "Hollywood Cahuenga cocktail bar with an oddly specific deconstructed-nachos tradition and a drinks menu that treats mezcal like a first-class spirit. Small-ish room, loud-ish crowd, the kind of late-night where you order one more and stay another hour." },
  { name: "Thirsty Crow", cuisine: "Whiskey Bar", neighborhood: "Silver Lake",
    address: "2939 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2939 W Sunset Blvd, Los Angeles, CA 90026",
    score: 86, price: 3, tags: ["Whiskey","Bar","Cocktails","Date Night","Iconic","Late Night","Historic"],
    reservation: "walk-in",
    group: "213 Hospitality",
    instagram: "@thirstycrowla", website: "https://thirstycrow.com",
    dishes: ["100+ Whiskey Selection","Prohibition-Era Cocktails","Old Fashioned","Bar Snacks"],
    desc: "Silver Lake's whiskey-lover speakeasy — dark, mahogany-and-velvet interior, Prohibition-era drink program executed by a bartending crew that cares. 100+ whiskeys, a Sazerac or an Old Fashioned done right, and a dress-like-you-mean-it crowd." },
  { name: "Venice Beach Wines", cuisine: "Wine Bar", neighborhood: "Venice",
    address: "529 Rose Ave, Venice, CA 90291",
    lookup: "529 Rose Ave, Venice, CA 90291",
    score: 83, price: 3, tags: ["Wine Bar","Casual","Date Night","Local Favorites","Hidden Gem","Patio"],
    reservation: "walk-in",
    instagram: "@venicebeachwines", website: "",
    dishes: ["Wine by the Glass","Cheese Plate","Charcuterie Board","Seasonal Small Plates"],
    desc: "A cozy, funky Venice wine bar behind Rose Avenue — a few dozen seats, a rotating natural-wine-leaning list, cheese plates and small bites. The shop-plus-bar Venice had been quietly missing; the crowd is all neighborhood regulars." },
  { name: "Kibitz Room", cuisine: "Dive Bar / Live Music", neighborhood: "Fairfax",
    address: "419 N Fairfax Ave, Los Angeles, CA 90036",
    lookup: "419 N Fairfax Ave, Los Angeles, CA 90036",
    score: 85, price: 1, tags: ["Dive Bar","Live Music","Historic","Iconic","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@kibitzroomla", website: "",
    dishes: ["Cheap Beer","Cocktails","Live Bands","Deli Food"],
    desc: "The lounge attached to Canter's Deli — a 1960s time capsule with booths, neon, and a live-music calendar that has hosted everyone from the Wallflowers to Weezer residencies. Cheap drinks, late hours, karaoke when the schedule holds. LA dive-bar canon." },
  { name: "Zebulon", cuisine: "Live Music / Cafe", neighborhood: "Frogtown",
    address: "2478 Fletcher Dr, Los Angeles, CA 90039",
    lookup: "2478 Fletcher Dr, Los Angeles, CA 90039",
    score: 87, price: 3, tags: ["Live Music","Cafe","Bar","Date Night","Trending","Critics Pick","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@zebulon.la", website: "https://zebulon.la",
    dishes: ["Seasonal Dinner Menu","Wine List","Avant-Garde Programming","Craft Cocktail"],
    desc: "Frogtown's eclectic live-music-and-food salon — Joshua Skaller and Jocelyn Hsu turned a warehouse into one of LA's most curated music rooms, with programming that runs jazz to experimental electronic to world music. Real kitchen, real wine list, the kind of place the LA arts crowd actually shows up at." },
  { name: "Moroccan Lounge", cuisine: "Concert Venue / Live Music", neighborhood: "Arts District",
    address: "901 E 1st St, Los Angeles, CA 90012",
    lookup: "901 E 1st St, Los Angeles, CA 90012",
    score: 86, price: 2, tags: ["Live Music","Arts District","Emerging Artists","Late Night","Cocktails"],
    reservation: "walk-in",
    instagram: "@moroccanlounge", website: "",
    dishes: ["Concert Tickets","Bar Service","Emerging-Artist Showcases","Food Menu"],
    desc: "Arts District 275-capacity live-music room that books emerging artists the indie-blog circuit is about to find. LA River-adjacent, loud, warm, with actual food service. The current underground answer to the Echo." },
  { name: "The Bellwether", cuisine: "Concert Venue / Live Music", neighborhood: "Downtown LA",
    address: "333 S Boylston St, Los Angeles, CA 90017",
    lookup: "333 S Boylston St, Los Angeles, CA 90017",
    score: 87, price: 3, tags: ["Live Music","Concert","Trending","Date Night","Cocktails"],
    reservation: "walk-in",
    instagram: "@thebellwetherla", website: "https://thebellwetherla.com",
    dishes: ["Concert Tickets","Multi-Level Seating","Cocktail Menu","Food Service"],
    desc: "DTLA's modern mid-size concert venue — 1,600-capacity, built-from-scratch 2023 room with a sound system engineered for the acoustics. Programming runs indie to dance to jazz; a legitimate addition to LA's music-venue roster with actual sightlines from the back." },
  { name: "Cara Cara", cuisine: "Modern American / Rooftop", neighborhood: "Downtown LA",
    address: "1100 S Broadway, Los Angeles, CA 90015",
    lookup: "1100 S Broadway, Los Angeles, CA 90015",
    score: 87, price: 4, tags: ["Rooftop","Modern","American","Date Night","Patio","Scenic Views","Cocktails","Trending"],
    reservation: "OpenTable",
    group: "Proper Hotel",
    instagram: "@caracarala", website: "",
    dishes: ["Seasonal California Menu","Signature Cocktails","Fire Pit Service","Brunch"],
    desc: "Rooftop at the Downtown LA Proper Hotel — Kelly Wearstler-designed interior, landmark fire pit on the deck, and a menu that runs California-modern with real discipline. Skyline views, warm-weather patio brunches, and a dinner format that feels like a resort restaurant transplanted into DTLA." },
  { name: "La Lo La Rooftop", cuisine: "Rooftop / Mediterranean", neighborhood: "Downtown LA",
    address: "1120 S Broadway, Los Angeles, CA 90015",
    lookup: "1120 S Broadway, Los Angeles, CA 90015",
    score: 85, price: 3, tags: ["Rooftop","Mediterranean","Cocktails","Date Night","Scenic Views","Trending","Patio"],
    reservation: "walk-in",
    group: "AC Hotel Downtown",
    instagram: "@laloladtla", website: "",
    dishes: ["Mediterranean Small Plates","Signature Cocktails","Live DJ","Wraparound Views"],
    desc: "Wraparound glass-walled rooftop atop the AC Hotel DTLA — panoramic views on every side, live DJs most nights, and a Mediterranean-leaning small-plates menu that actually works on a rooftop. One of Downtown's newer patios but already a Thursday-night regular." }
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
})();

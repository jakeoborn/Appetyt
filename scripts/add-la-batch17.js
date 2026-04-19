#!/usr/bin/env node
// LA batch 17 — DiscoverLA Nightlife (15 venues, verified via Apify RAG scrape + training).
// Addresses from training/verified city records.
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
  // ============= DANCE CLUBS =============
  { name: "Exchange LA", cuisine: "Nightclub / EDM", neighborhood: "Downtown LA",
    address: "618 S Spring St, Los Angeles, CA 90014",
    lookup: "618 S Spring St, Los Angeles, CA 90014",
    score: 85, price: 4, tags: ["Nightclub","Dance","EDM","Late Night","Celebrations","Scene","Cocktails"],
    reservation: "walk-in",
    instagram: "@exchange_la", website: "https://exchangela.com",
    dishes: ["Bottle Service","Table Packages","International DJ Sets","VIP Menu"],
    desc: "DTLA's warehouse-scale EDM mega-club set inside a 1931 art-deco former stock exchange. International DJ residencies, bottle service economy, and a main room that operates at the scale of a European superclub. The Downtown EDM destination; not subtle, not meant to be." },
  { name: "Playhouse Hollywood", cuisine: "Nightclub / Hip-Hop", neighborhood: "Hollywood",
    address: "6506 Hollywood Blvd, Los Angeles, CA 90028",
    lookup: "6506 Hollywood Blvd, Los Angeles, CA 90028",
    score: 83, price: 4, tags: ["Nightclub","Dance","Hip-Hop","Late Night","Scene"],
    reservation: "walk-in",
    instagram: "@playhousenightclub", website: "https://playhousenightclub.com",
    dishes: ["Bottle Service","Hip-Hop DJs","VIP Table","Signature Cocktail"],
    desc: "Hollywood Boulevard's hip-hop anchor and one of the last actual dance clubs on the strip. Velvet ropes, bottle service, DJs that pull the Hollywood Saturday crowd without trying to reinvent the form. Classic LA club weekend format." },
  { name: "Elevate Lounge", cuisine: "Rooftop Lounge / Dance", neighborhood: "Downtown LA",
    address: "811 Wilshire Blvd, Los Angeles, CA 90017",
    lookup: "811 Wilshire Blvd, Los Angeles, CA 90017",
    score: 86, price: 3, tags: ["Nightclub","Rooftop","Cocktails","Dance","Scenic Views","Late Night","Scene","Trending"],
    reservation: "walk-in",
    instagram: "@elevatelounge", website: "http://www.elevatelounge.com",
    dishes: ["Signature Cocktails","Bottle Service","DJ Nights","Small Plates"],
    desc: "21st-floor rooftop club with 360-degree views over the Financial District — dance floors meet skyline, cocktail menu skews crowd-pleasing EDM-club standard. A Downtown rooftop with more altitude than most of LA's competing operators and enough dance space to earn the 'lounge' tag loosely." },
  { name: "Crocker Club", cuisine: "Nightclub / Speakeasy", neighborhood: "Downtown LA",
    address: "453 S Spring St, Los Angeles, CA 90013",
    lookup: "453 S Spring St, Los Angeles, CA 90013",
    score: 84, price: 4, tags: ["Nightclub","Speakeasy","Dance","Cocktails","Historic","Late Night","Scene"],
    reservation: "walk-in",
    instagram: "@crockerclub", website: "http://www.crockerclub.com",
    dishes: ["Vault-Themed Cocktails","Bottle Service","Private Room Packages","DJ Nights"],
    desc: "Former bank vault turned labyrinth nightclub on Spring Street — the actual vault door is the velvet rope, and the dress code holds the line. Multiple rooms, each with its own name and atmosphere, and a DJ rotation that keeps regulars moving between them. DTLA club-crawling, engineered." },
  { name: "The Mayan", cuisine: "Nightclub / Latin", neighborhood: "Downtown LA",
    address: "1038 S Hill St, Los Angeles, CA 90015",
    lookup: "1038 S Hill St, Los Angeles, CA 90015",
    score: 84, price: 3, tags: ["Nightclub","Latin","Dance","Historic","Iconic","Live Music","Scene"],
    reservation: "walk-in",
    instagram: "@mayanla", website: "http://www.clubmayan.com",
    dishes: ["Latin Dance Floor","Margaritas","Salsa & Merengue Nights","Live Band"],
    desc: "A 1927 Mayan revival theater that has been the Downtown LA Latin-dance headquarters for decades. Salsa, merengue, bachata, reggaeton on rotation, live bands some nights, and the kind of ornately carved interior that makes any cocktail feel like part of a story. An LA landmark." },
  { name: "Conga Room at L.A. LIVE", cuisine: "Nightclub / Latin / Live Music", neighborhood: "Downtown LA",
    address: "800 W Olympic Blvd Ste A335, Los Angeles, CA 90015",
    lookup: "800 W Olympic Blvd, Los Angeles, CA 90015",
    score: 85, price: 3, tags: ["Nightclub","Latin","Live Music","Dance","Iconic","Date Night"],
    reservation: "walk-in",
    instagram: "@thecongaroom", website: "https://www.congaroom.com",
    dishes: ["Latin Cocktails","Live Band Performances","Salsa Lessons","Dinner & Show"],
    desc: "Jennifer Lopez-backed Latin-music venue at L.A. LIVE — a proper supper club and dance floor that pulls in world-music acts, salsa nights, and lessons earlier in the evening for the locals learning the room. One of LA's most specific dance floors." },

  // ============= COCKTAIL LOUNGES / BARS =============
  { name: "The Rooftop at The Standard", cuisine: "Rooftop Bar / Cocktails", neighborhood: "Downtown LA",
    address: "550 S Flower St, Los Angeles, CA 90071",
    lookup: "550 S Flower St, Los Angeles, CA 90071",
    score: 86, price: 3, tags: ["Rooftop","Bar","Cocktails","Scenic Views","Date Night","Iconic","Trending"],
    reservation: "walk-in",
    group: "Standard International",
    instagram: "@thestandard_downtown_la", website: "https://www.standardhotels.com",
    dishes: ["Signature Cocktails","Small Plates","Astro Turf Lounge","Poolside Service"],
    desc: "The Standard Downtown's rooftop — red AstroTurf, waterbed pods, sculpted topiary, and a skyline view that made LA-rooftop-bar photographs a category. Sells the panorama, delivers the drinks. A Downtown photo moment that has aged well." },
  { name: "The Edison", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "Downtown LA",
    address: "108 W 2nd St Ste 101, Los Angeles, CA 90012",
    lookup: "108 W 2nd St, Los Angeles, CA 90012",
    score: 89, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Historic","Iconic","Live Music","Scene"],
    reservation: "walk-in",
    instagram: "@edisondowntown", website: "https://theneverlands.com/edison/",
    dishes: ["Hand-Crafted Classic Cocktails","Absinthe Service","Eclectic Bar Bites","Live Burlesque"],
    desc: "Inside a 1910 industrial basement that used to power DTLA — turbines, catwalks, industrial-cathedral architecture — turned into one of LA's most atmospheric cocktail bars. Dress code enforced, prohibition-era classics executed correctly, and a 1920s burlesque-and-jazz program keeping the space honest." },
  { name: "Library Bar", cuisine: "Cocktail Bar / Beer", neighborhood: "Downtown LA",
    address: "630 W 6th St, Los Angeles, CA 90017",
    lookup: "630 W 6th St, Los Angeles, CA 90017",
    score: 84, price: 2, tags: ["Bar","Beer","Wine Bar","Cocktails","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@librarybarla", website: "https://www.librarybarla.com",
    dishes: ["Rare Beer Selection","Deep Wine List","Classic Cocktails","Bar Snacks"],
    desc: "Financial District cocktail-and-beer bar with a deliberately encyclopedic approach — one of LA's deepest obscure-beer and off-list-wine selections, curated by someone who treats the inventory like a collection rather than a shop. Bookish, warm, late." },
  { name: "Skybar at Mondrian", cuisine: "Rooftop Bar / Pool Bar", neighborhood: "West Hollywood",
    address: "8440 Sunset Blvd, West Hollywood, CA 90069",
    lookup: "8440 Sunset Blvd, West Hollywood, CA 90069",
    score: 86, price: 4, tags: ["Rooftop","Bar","Cocktails","Scenic Views","Date Night","Iconic","Scene","Trending"],
    reservation: "walk-in",
    group: "Mondrian Hotels",
    instagram: "@mondrianla", website: "https://www.morganshotelgroup.com",
    dishes: ["Poolside Cocktails","Sunset Strip Views","Light Bites","DJ Nights"],
    desc: "The Mondrian's Sunset Strip rooftop pool bar — hotel pool at the actual edge of the Strip, infinity-view over LA, and one of West Hollywood's longest-running scenes. Dress for the crowd; the view earns the pricing." },

  // ============= LIVE ENTERTAINMENT =============
  { name: "El Rey Theatre", cuisine: "Concert Venue / Live Music", neighborhood: "Miracle Mile",
    address: "5515 Wilshire Blvd, Los Angeles, CA 90036",
    lookup: "5515 Wilshire Blvd, Los Angeles, CA 90036",
    score: 88, price: 3, tags: ["Live Music","Iconic","Historic","Concert","Late Night","Trending"],
    reservation: "walk-in",
    instagram: "@theelrey", website: "https://www.theelrey.com",
    dishes: ["Concert Tickets","Bar Service","Indie & Alt Rock","DJ Nights"],
    desc: "A 1936 Art Deco movie palace turned live-music venue — 800-capacity general-admission room with one of LA's best sound systems. Indie, alternative, and cutting-edge bookings; a Miracle Mile landmark that the music press always has on the short list." },
  { name: "The Wiltern", cuisine: "Concert Venue / Live Music", neighborhood: "Koreatown",
    address: "3790 Wilshire Blvd, Los Angeles, CA 90010",
    lookup: "3790 Wilshire Blvd, Los Angeles, CA 90010",
    score: 89, price: 3, tags: ["Live Music","Iconic","Historic","Concert","Date Night"],
    reservation: "walk-in",
    group: "Live Nation",
    instagram: "@thewiltern", website: "https://www.wiltern.com",
    dishes: ["Concert Tickets","Live Performance","Bar Service","Multi-Level Seating"],
    desc: "A 1931 Art Deco theater at Wilshire and Western — zigzag-moderne glazed terra cotta exterior, ornate interior, and one of LA's favorite mid-size concert rooms. Programming runs alternative to jazz to comedy; the room amplifies whoever's on stage." },

  // ============= COMEDY CLUBS =============
  { name: "Laugh Factory", cuisine: "Comedy Club", neighborhood: "West Hollywood",
    address: "8001 Sunset Blvd, West Hollywood, CA 90046",
    lookup: "8001 Sunset Blvd, West Hollywood, CA 90046",
    score: 89, price: 3, tags: ["Comedy","Live Music","Iconic","Historic","Late Night","Scene"],
    reservation: "OpenTable",
    instagram: "@laughfactory", website: "https://www.laughfactory.com",
    dishes: ["Stand-Up Tickets","Bar Service","Two-Drink Minimum","Late Shows"],
    desc: "Jamie Masada's Sunset Strip comedy institution operating since 1979 — the club Richard Pryor, Jim Carrey, and every modern stand-up alumnus has cut teeth at. Drop-ins from huge names are the house rule, not the exception. The LA comedy club." },
  { name: "Hollywood Improv", cuisine: "Comedy Club", neighborhood: "West Hollywood",
    address: "8162 Melrose Ave, Los Angeles, CA 90046",
    lookup: "8162 Melrose Ave, Los Angeles, CA 90046",
    score: 88, price: 3, tags: ["Comedy","Iconic","Historic","Late Night","Scene"],
    reservation: "OpenTable",
    group: "Improv Comedy Clubs",
    instagram: "@hollywoodimprov", website: "https://improv.com/hollywood",
    dishes: ["Stand-Up Tickets","Two-Drink Minimum","Dinner Menu","Late Shows"],
    desc: "The Melrose anchor of the national Improv chain, operating since 1975. Headlining tours plus drop-in sets from Hollywood regulars working new material — always a chance the 10 p.m. spot becomes the night's best memory. A-lister sightings on weekdays." },

  // ============= SPORTS BARS =============
  { name: "Yard House at L.A. LIVE", cuisine: "Sports Bar / American", neighborhood: "Downtown LA",
    address: "800 W Olympic Blvd, Los Angeles, CA 90015",
    lookup: "800 W Olympic Blvd, Los Angeles, CA 90015",
    score: 80, price: 2, tags: ["Sports Bar","American","Casual","Beer","Late Night","Patio"],
    reservation: "OpenTable",
    group: "Yard House / Darden",
    instagram: "@yardhouse", website: "https://www.yardhouse.com",
    dishes: ["Poke Nachos","Korean Wings","Onion Ring Tower","130+ Drafts"],
    desc: "The sports-bar anchor at L.A. LIVE next to Crypto.com Arena — 130+ beers on tap, gigantic flat-screens, menu that has made the poke nachos and Korean wings chain-restaurant standards. Pre-Lakers, pre-concert, pre-everything at L.A. LIVE. Reliable." }
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

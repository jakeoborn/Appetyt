#!/usr/bin/env node
// LA batch 19 — DTLA rooftops + iconic WeHo/Hollywood nightclubs (verified via Apify LA scrapes)
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
  // ============= DTLA ROOFTOPS =============
  { name: "Perch LA", cuisine: "French / Rooftop", neighborhood: "Downtown LA",
    address: "448 S Hill St, Los Angeles, CA 90013",
    lookup: "448 S Hill St, Los Angeles, CA 90013",
    score: 87, price: 3, tags: ["Rooftop","French","Cocktails","Date Night","Scenic Views","Iconic","Trending"],
    reservation: "OpenTable",
    instagram: "@perchla", website: "https://perchla.com",
    dishes: ["French Onion Soup","Moules Frites","Craft Cocktail","Weekend DJ"],
    desc: "15 floors above Pershing Square — one of DTLA's first serious rooftop bars and still the French-bistro-on-a-roof benchmark. Fire pits, 360-degree views, weekend DJs past 10 p.m., and a moules-frites program that actually works outdoors. Perch has been packed since 2011 and the formula still earns it." },
  { name: "Spire 73", cuisine: "Rooftop Bar / American", neighborhood: "Downtown LA",
    address: "900 Wilshire Blvd, Los Angeles, CA 90017",
    lookup: "900 Wilshire Blvd, Los Angeles, CA 90017",
    score: 88, price: 4, tags: ["Rooftop","Bar","Cocktails","Date Night","Scenic Views","Iconic","Trending"],
    reservation: "OpenTable",
    group: "InterContinental Los Angeles Downtown",
    instagram: "@spire73", website: "",
    dishes: ["Signature Cocktails","Small Plates","Fire Pit Service","Champagne Pairing"],
    desc: "73rd floor of the InterContinental — the tallest open-air bar in the Western Hemisphere. Fire pits at the edge of a glass rail, skyline wrapping on three sides, and a cocktail menu calibrated for the 900-foot altitude. Not cheap; the view is the entire pricing model." },
  { name: "71 Above", cuisine: "Fine Dining / Rooftop", neighborhood: "Downtown LA",
    address: "633 W 5th St, Los Angeles, CA 90071",
    lookup: "633 W 5th St, Los Angeles, CA 90071",
    score: 89, price: 4, tags: ["Fine Dining","Rooftop","American","Date Night","Celebrations","Scenic Views","Cocktails"],
    reservation: "OpenTable",
    instagram: "@71aboveofficial", website: "https://71above.com",
    dishes: ["Seasonal Tasting","Caviar Service","Bone Marrow","Wine Pairing"],
    desc: "71st floor of the US Bank Tower — the highest restaurant west of the Mississippi, with floor-to-ceiling glass and views that make the tasting menu feel earned. New-American menu, wine program that actually belongs in a sky lounge, and the LA proposal-dinner that most visitors don't yet know about." },
  { name: "Cabra", cuisine: "Peruvian / Rooftop", neighborhood: "Downtown LA",
    address: "1060 S Broadway, Los Angeles, CA 90015",
    lookup: "1060 S Broadway, Los Angeles, CA 90015",
    score: 88, price: 3, tags: ["Peruvian","Rooftop","Date Night","Patio","Cocktails","Critics Pick","Trending"],
    reservation: "Resy",
    group: "Boka Restaurant Group",
    instagram: "@cabrala", website: "",
    dishes: ["Ceviche Mixto","Pisco Sour","Pollo a la Brasa","Lomo Saltado"],
    desc: "Stephanie Izard's Peruvian rooftop at The Hoxton — the Chicago chef's LA outpost, cooking Peruvian-by-way-of-pan-Latin with the discipline of a Michelin-adjacent kitchen. Pisco bar is a menu item on its own; ceviches rotate seasonally. DTLA's rooftop with real chef credentials behind it." },
  { name: "Level 8 / Golden Hour", cuisine: "Rooftop / Multi-Concept", neighborhood: "Downtown LA",
    address: "1020 S Figueroa St, Los Angeles, CA 90015",
    lookup: "1020 S Figueroa St, Los Angeles, CA 90015",
    score: 87, price: 3, tags: ["Rooftop","Cocktails","Dance","Pool","Trending","Scene","Date Night","Live Music"],
    reservation: "Resy",
    group: "Houston Hospitality",
    instagram: "@level8la", website: "https://level8la.com",
    dishes: ["Rotating Carousel Bar","Pool Cocktails","DJ Sets","Signature Spritz"],
    desc: "Houston Hospitality's eight-concept rooftop at the Moxy DTLA — a rotating carousel bar, pool deck, live DJ stages, and enough separate rooms to stretch dinner into a four-hour night. The Golden Hour sunset patio is the opening move; Sinners y Santos (wrestlers, confessional, theater) is the late act." },
  { name: "LA Cha Cha Cha", cuisine: "Mexican / Rooftop", neighborhood: "Arts District",
    address: "812 E 3rd St, Los Angeles, CA 90013",
    lookup: "812 E 3rd St, Los Angeles, CA 90013",
    score: 86, price: 3, tags: ["Mexican","Rooftop","Cocktails","Date Night","Patio","Trending","Scene"],
    reservation: "Resy",
    instagram: "@lachachachala", website: "",
    dishes: ["Churros","Al Pastor Tacos","Margarita","Mezcal Flight"],
    desc: "Mexico City transplant on an Arts District rooftop — palm fronds, pink walls, DJ some nights, and a savory-and-sweet menu that makes the churros mandatory. Tacos al pastor come off a trompo; the margaritas land where they're supposed to. Currently one of the Arts District's most photographed patios." },
  { name: "Bar Clara at Hotel Per La", cuisine: "Rooftop / Cocktails", neighborhood: "Downtown LA",
    address: "649 S Olive St, Los Angeles, CA 90014",
    lookup: "649 S Olive St, Los Angeles, CA 90014",
    score: 86, price: 3, tags: ["Rooftop","Bar","Cocktails","Date Night","Scenic Views","Trending","Patio"],
    reservation: "walk-in",
    group: "Hotel Per La",
    instagram: "@hotelperla", website: "https://hotelperla.com",
    dishes: ["Cocktail Program","Poolside Booths","Small Plates","Rooftop Dining"],
    desc: "The Hotel Per La's rooftop — the casual cousin to San Laurel downstairs. Stylish layout with poolside banquettes, cocktails from a team that takes the program seriously, and a view over DTLA that's quiet enough on a Tuesday to feel like a find." },

  // ============= HOLLYWOOD / WEHO NIGHTCLUBS =============
  { name: "Avalon Hollywood", cuisine: "Nightclub / EDM", neighborhood: "Hollywood",
    address: "1735 N Vine St, Hollywood, CA 90028",
    lookup: "1735 N Vine St, Hollywood, CA 90028",
    score: 88, price: 4, tags: ["Nightclub","Dance","EDM","Historic","Iconic","Late Night","Scene","Live Music"],
    reservation: "walk-in",
    instagram: "@avalonhollywood", website: "https://avalonhollywood.com",
    dishes: ["International DJ Sets","Bottle Service","Avaland Residencies","VIP Packages"],
    desc: "Operating since 1927 (originally The Earl Carroll Theatre). The Beatles played their second US appearance here; today it's Hollywood's most legitimate EDM room, with the Avaland residency series and a lighting rig that would embarrass most Vegas clubs. 2,000 capacity, proper sound, the dance-club benchmark." },
  { name: "Bardot Hollywood", cuisine: "Lounge / Nightclub", neighborhood: "Hollywood",
    address: "1737 N Vine St, Los Angeles, CA 90028",
    lookup: "1737 N Vine St, Los Angeles, CA 90028",
    score: 85, price: 4, tags: ["Nightclub","Cocktails","Lounge","Date Night","Scene","Trending","Late Night"],
    reservation: "walk-in",
    instagram: "@bardothollywood", website: "",
    dishes: ["Craft Cocktails","Bottle Service","DJ Nights","VIP Tables"],
    desc: "Above Avalon — the upstairs chic-glamour lounge that made old-Hollywood nightlife stylish again. School Night Mondays (live indie bookings) are the cult; the velvet-booth vibe runs the rest of the week. Dress for the door." },
  { name: "Sound Nightclub", cuisine: "Nightclub / Techno / House", neighborhood: "Hollywood",
    address: "1642 N Las Palmas Ave, Los Angeles, CA 90028",
    lookup: "1642 N Las Palmas Ave, Los Angeles, CA 90028",
    score: 87, price: 4, tags: ["Nightclub","Dance","Late Night","Scene","Trending","Live Music"],
    reservation: "walk-in",
    instagram: "@soundnightclub", website: "",
    dishes: ["Techno/House DJ Sets","Bottle Service","VIP Packages","Late Shows"],
    desc: "The Hollywood underground-electronic destination — booking rotation reads like a Boiler Room lineup (Jamie Jones, Seth Troxler, The Martinez Brothers residencies). Dark, bass-forward sound system, cavernous room, genuinely serious music crowd. The antidote to Strip-club EDM." },
  { name: "Sunset at EDITION", cuisine: "Nightclub / Disco", neighborhood: "West Hollywood",
    address: "9040 W Sunset Blvd, West Hollywood, CA 90069",
    lookup: "9040 W Sunset Blvd, West Hollywood, CA 90069",
    score: 89, price: 4, tags: ["Nightclub","Dance","Disco","Late Night","Scene","Trending","Iconic","Cocktails"],
    reservation: "walk-in",
    group: "Ian Schrager / EDITION Hotels",
    instagram: "@weho_edition", website: "",
    dishes: ["Disco DJ Residencies","Bottle Service","Champagne Program","Signature Cocktails"],
    desc: "Ian Schrager's Studio 54-inspired basement club at the West Hollywood EDITION — mirror-ceiling disco balls, brass accents, and the former Studio 54 sound-system guy consulting on the room. The nightlife-as-art-installation format that made Schrager famous, executed at full volume in 2026." },
  { name: "Zouk LA", cuisine: "Nightclub / EDM", neighborhood: "West Hollywood",
    address: "643 N La Cienega Blvd, West Hollywood, CA 90069",
    lookup: "643 N La Cienega Blvd, West Hollywood, CA 90069",
    score: 85, price: 4, tags: ["Nightclub","Dance","EDM","Late Night","Scene","Trending"],
    reservation: "walk-in",
    group: "Zouk Group",
    instagram: "@zouklosangeles", website: "",
    dishes: ["International DJ Residencies","Bottle Service","VIP Tables","Outdoor Patio"],
    desc: "The Singapore-based Zouk Group's LA outpost on La Cienega — global-brand EDM format, glam interior, LED lighting calibrated to the drop. Outdoor patio for the breaks between DJ sets. A proper international nightlife brand, translated." },
  { name: "Poppy", cuisine: "Nightclub / Exclusive", neighborhood: "West Hollywood",
    address: "765 N La Cienega Blvd, West Hollywood, CA 90069",
    lookup: "765 N La Cienega Blvd, West Hollywood, CA 90069",
    score: 86, price: 4, tags: ["Nightclub","Cocktails","Scene","Late Night","Exclusive","Trending"],
    reservation: "walk-in",
    group: "h.wood Group",
    instagram: "@poppyla", website: "",
    dishes: ["Bottle Service","Whimsical Cocktails","Reservation List","VIP Tables"],
    desc: "The h.wood Group's hardest-reservation WeHo spot — whimsical garden-meets-Victorian-library décor, a door policy that's its own marketing, and a bottle-service model that separates the regulars from the tourists. If you get in, behave. If you don't, Nice Guy next door." },
  { name: "Or Bar", cuisine: "Cocktail Bar / Lounge", neighborhood: "West Hollywood",
    address: "8228 Santa Monica Blvd, West Hollywood, CA 90046",
    lookup: "8228 Santa Monica Blvd, West Hollywood, CA 90046",
    score: 85, price: 3, tags: ["Cocktails","Bar","Lounge","Date Night","Trending","Scene"],
    reservation: "Resy",
    instagram: "@orbarweho", website: "",
    dishes: ["Craft Cocktails","Champagne Service","Bar Snacks","DJ Nights"],
    desc: "A glitzy disco-era cocktail bar in the former Gold Coast space — 3,700-piece custom crystal chandelier overhead, velvet banquettes, and a drink menu that reads as serious as the lighting. WeHo cocktail bar that doesn't try to hide the glamour." },
  { name: "Tail O' the Pup", cuisine: "Hot Dogs / American", neighborhood: "West Hollywood",
    address: "8512 Santa Monica Blvd, West Hollywood, CA 90069",
    lookup: "8512 Santa Monica Blvd, West Hollywood, CA 90069",
    score: 83, price: 1, tags: ["American","Hot Dogs","Casual","Quick Bite","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@tailothepup", website: "https://tailothepuphotdogs.com",
    dishes: ["Classic Hot Dog","Chili Dog","Fries","Root Beer Float"],
    desc: "The giant hot-dog-shaped Googie-architecture stand that has been part of LA's skyline on and off since 1946, now reopened at a new Santa Monica Blvd corner in 2022. Classic dog, chili dog, crinkle fries, a root-beer float — the Americana standard, now on better buns." }
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

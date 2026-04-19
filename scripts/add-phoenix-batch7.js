#!/usr/bin/env node
// Phoenix batch 7 — Old Town Scottsdale Entertainment District (15 verified via Apify OldTownScottsdaleAZ)
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
  { name: "Bottled Blonde", cuisine: "Pizza / Nightclub", neighborhood: "Old Town Scottsdale",
    address: "7340 E Indian Plaza, Scottsdale, AZ 85251",
    lookup: "7340 E Indian Plaza, Scottsdale, AZ 85251",
    score: 82, price: 3, tags: ["Italian","Pizza","Nightclub","Dance","Late Night","Scene","Trending"],
    reservation: "walk-in",
    group: "Evening Entertainment Group",
    instagram: "@bottledblondeaz", website: "https://bottledblonde.com",
    dishes: ["Pizza by the Slice","Craft Cocktails","Bottle Service","DJ Sets"],
    desc: "A pizzeria by day, nightclub by 10 p.m. — one of Old Town Scottsdale's most high-energy crossover venues. Pizza slides out of the oven until 2 a.m., DJs take over the patio, and the front-half-restaurant-back-half-club format turns every weekend into a loud dinner. Not subtle, exactly the Scottsdale vibe people fly in for." },
  { name: "El Hefe Super Macho Taqueria", cuisine: "Mexican / Nightclub", neighborhood: "Old Town Scottsdale",
    address: "4425 N Saddlebag Trail, Scottsdale, AZ 85251",
    lookup: "4425 N Saddlebag Trail, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["Mexican","Nightclub","Tacos","Late Night","Cocktails","Scene","Patio","Trending"],
    reservation: "walk-in",
    group: "Evening Entertainment Group",
    instagram: "@elhefeaz", website: "",
    dishes: ["Tacos","Margaritas","Burritos","DJ Patio Nights"],
    desc: "Saddlebag Trail's taqueria-by-day / open-air club-by-night — massive patio, DJ nights, margaritas poured aggressively. Tacos are legit enough to anchor a pre-game. The Entertainment District's most reliable dinner-into-dancing pivot." },
  { name: "Hula's Modern Tiki", cuisine: "Tiki / Polynesian", neighborhood: "Old Town Scottsdale",
    address: "7213 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "7213 E 1st Ave, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Tiki","Bar","Polynesian","Cocktails","Date Night","Casual","Patio"],
    reservation: "OpenTable",
    instagram: "@hulasmoderntiki", website: "https://hulasmoderntiki.com",
    dishes: ["Mai Tai","Volcano Bowl","Pork Belly Sliders","Kalua Pig Sliders"],
    desc: "Old Town's mid-century tiki bar done with actual respect for the form — rum program takes itself seriously, pupus are better than they need to be, and the patio catches the right desert evening air. Not a theme-park tiki; a Hawaiian-born family running a real program." },
  { name: "Dierks Bentley's Whiskey Row", cuisine: "Bar / Country", neighborhood: "Old Town Scottsdale",
    address: "4420 N Saddlebag Trail, Scottsdale, AZ 85251",
    lookup: "4420 N Saddlebag Trail, Scottsdale, AZ 85251",
    score: 81, price: 2, tags: ["Bar","Country","Live Music","Late Night","Scene","Patio"],
    reservation: "walk-in",
    instagram: "@whiskeyrowscottsdale", website: "https://whiskeyrow.com",
    dishes: ["Whiskey Selection","Country Cocktails","Bar Food","Live Country"],
    desc: "Country singer Dierks Bentley's namesake bar in the Entertainment District — live country music, whiskey program, and a rowdy Western-forward bar scene that pulls in Scottsdale's country-bar crowd plus out-of-town bachelorettes. Multiple locations around the country; Scottsdale is one of the bigger ones." },
  { name: "Maya Day & Night Club", cuisine: "Nightclub / Day Club", neighborhood: "Old Town Scottsdale",
    address: "7333 E Indian Plaza, Scottsdale, AZ 85251",
    lookup: "7333 E Indian Plaza, Scottsdale, AZ 85251",
    score: 82, price: 4, tags: ["Nightclub","Day Club","Dance","Pool","Late Night","Scene","Trending"],
    reservation: "walk-in",
    group: "Evening Entertainment Group",
    instagram: "@mayascottsdale", website: "https://mayascottsdale.com",
    dishes: ["Bottle Service","Pool Day Club","DJ Nights","Cabana Packages"],
    desc: "An indoor-outdoor day-and-night club format the Vegas strip would recognize — pool scene during the day, EDM/hip-hop DJ sets after dark, and Scottsdale's most direct answer to Vegas-style bottle-service venues. Dress code; doorman; weekend energy." },
  { name: "Riot House", cuisine: "Nightclub", neighborhood: "Old Town Scottsdale",
    address: "4425 N Saddlebag Trail Ste 105, Scottsdale, AZ 85251",
    lookup: "4425 N Saddlebag Trail, Scottsdale, AZ 85251",
    score: 81, price: 4, tags: ["Nightclub","Dance","Late Night","Scene","Trending","Cocktails"],
    reservation: "walk-in",
    instagram: "@riothousescottsdale", website: "",
    dishes: ["Bottle Service","VIP Tables","DJ Sets","Signature Cocktails"],
    desc: "Saddlebag Trail nightclub anchored in the heart of the Entertainment District — bottle service, EDM programming, and a crowd that turns over at the velvet rope at 11 p.m. Loud, packed, weekend-dependent." },
  { name: "Wasted Grain", cuisine: "Bar / Live Music / Multi-Concept", neighborhood: "Old Town Scottsdale",
    address: "7295 E Stetson Dr, Scottsdale, AZ 85251",
    lookup: "7295 E Stetson Dr, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["Bar","Live Music","Cocktails","Late Night","Patio","Scene"],
    reservation: "walk-in",
    instagram: "@wastedgrain", website: "https://wastedgrain.com",
    dishes: ["Craft Cocktails","Live Music Downstairs","Bar Snacks","Whiskey Program"],
    desc: "Stetson Drive multi-concept — upstairs is a cocktail lounge, downstairs is a live-music room. The format is smarter than the Entertainment District's usual EDM-only play; bookings run country, rock, and indie, and the whiskey list is legitimate. Old Town's most adult nightlife venue." },
  { name: "Rusty Spur Saloon", cuisine: "Saloon / Western", neighborhood: "Old Town Scottsdale",
    address: "7245 E Main St, Scottsdale, AZ 85251",
    lookup: "7245 E Main St, Scottsdale, AZ 85251",
    score: 86, price: 1, tags: ["Bar","Western","Saloon","Historic","Iconic","Live Music","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@rustyspursaloon", website: "https://rustyspursaloon.com",
    dishes: ["Cheap Beer","Live Country Music","Cowboy Mule","Bar Food"],
    desc: "Old Town's iconic Western saloon since 1958 — swinging doors, live country music from noon to 1 a.m. most days, and a regular crowd of cowboys, out-of-towners, and bachelor parties mixed three ways. Cheap beer, loud music, the unironic Scottsdale experience." },
  { name: "ZuZu Lounge at Hotel Valley Ho", cuisine: "Modern American / Mid-Century Lounge", neighborhood: "Old Town Scottsdale",
    address: "6850 E Main St, Scottsdale, AZ 85251",
    lookup: "6850 E Main St, Scottsdale, AZ 85251",
    score: 87, price: 3, tags: ["American","Modern","Date Night","Cocktails","Historic","Iconic","Patio"],
    reservation: "OpenTable",
    group: "Hotel Valley Ho",
    instagram: "@hotelvalleyho", website: "https://hotelvalleyho.com",
    dishes: ["Wagyu Beef Tartare","Signature Mule","Seasonal Menu","Poolside Service"],
    desc: "The iconic mid-century Hotel Valley Ho's lounge-and-restaurant — terrazzo floors, 1956 architecture preserved in full, a cocktail program that leans updated-classic, and a dining room that still reads like a Palm Springs time capsule. Scottsdale's most specific hotel restaurant." },
  { name: "Hi-Fi Kitchen and Cocktails", cuisine: "American / Cocktail Bar", neighborhood: "Old Town Scottsdale",
    address: "4420 N Saddlebag Trail, Scottsdale, AZ 85251",
    lookup: "4420 N Saddlebag Trail, Scottsdale, AZ 85251",
    score: 84, price: 3, tags: ["American","Cocktails","Bar","Date Night","Patio","Late Night","Trending"],
    reservation: "walk-in",
    instagram: "@hifikitchen", website: "",
    dishes: ["Craft Cocktails","Shared Small Plates","Vinyl DJ Nights","Patio Service"],
    desc: "Saddlebag Trail cocktail bar and kitchen with a vinyl-forward music programming and a menu that tries harder than most Entertainment District bars. Craft drinks, shareable plates, and a patio that catches the golden hour. A grown-up stop on a loud block." },
  { name: "WET Deck at W Scottsdale", cuisine: "Pool Bar / Rooftop", neighborhood: "Old Town Scottsdale",
    address: "7277 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "7277 E Camelback Rd, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["Rooftop","Pool","Bar","Cocktails","Day Club","Scene","Trending"],
    reservation: "walk-in",
    group: "W Hotels",
    instagram: "@wscottsdale", website: "https://marriott.com",
    dishes: ["Pool Cocktails","Frozen Drinks","Cabana Service","DJ Day Party"],
    desc: "W Scottsdale's rooftop pool deck — the pool-party scene that anchors Old Town's day-club rotation. Weekend DJ sets, cabana bookings, and cocktails calibrated for swimsuit-in-sun consumption. The Vegas-pool format, Scottsdale version." },
  { name: "Bourbon and Bones Chophouse & Bar", cuisine: "Steakhouse / Whiskey Bar", neighborhood: "Old Town Scottsdale",
    address: "4200 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "4200 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 86, price: 4, tags: ["Fine Dining","Steakhouse","Whiskey","Bar","Date Night","Celebrations","Cocktails"],
    reservation: "OpenTable",
    instagram: "@bourbonandbonesaz", website: "https://bourbonandbonesaz.com",
    dishes: ["Dry-Aged Ribeye","Bone Marrow","200+ Bourbon Selection","Smoked Old Fashioned"],
    desc: "A bourbon-forward chophouse at Scottsdale Waterfront — 200+ whiskeys behind the bar, dry-aged steaks off a proper broiler, and the smoked old fashioned service tableside. The steakhouse-plus-whiskey-bar format done honestly." },
  { name: "Brat Haus", cuisine: "German / Beer Garden", neighborhood: "Old Town Scottsdale",
    address: "3622 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "3622 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["German","Beer","Bar","Casual","Family Friendly","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@brathaus", website: "",
    dishes: ["House Bratwurst","German Pretzel","Schnitzel","German Beer Selection"],
    desc: "German-style beer garden in Old Town's Arts District — handmade bratwurst, soft pretzels with mustard, and a proper German-beer tap list. Dog-friendly patio, communal tables, and the kind of casual-crossover vibe Scottsdale gets right when it isn't trying to be Vegas." },
  { name: "Atlas Bistro", cuisine: "Contemporary / BYOB", neighborhood: "Scottsdale",
    address: "2515 N Scottsdale Rd Ste 2, Scottsdale, AZ 85257",
    lookup: "2515 N Scottsdale Rd, Scottsdale, AZ 85257",
    score: 89, price: 4, tags: ["Fine Dining","Contemporary","Date Night","Celebrations","BYOB","Critics Pick","Wine Bar"],
    reservation: "OpenTable",
    instagram: "@atlasbistroscottsdale", website: "https://atlasbistro.net",
    dishes: ["Rotating Prix-Fixe","Seasonal Tasting","Cheese Board","BYOB Service"],
    desc: "A BYOB fine-dining prix-fixe that's quietly become one of Scottsdale's most respected tasting rooms. Chef-driven menu rotates weekly, wine corkage is nominal (bring the bottle you've been saving), and the dining room stays just small enough for every course to feel considered." },
  { name: "Porter's Saloon", cuisine: "Saloon / Western / Historic", neighborhood: "Old Town Scottsdale",
    address: "3944 N Brown Ave, Scottsdale, AZ 85251",
    lookup: "3944 N Brown Ave, Scottsdale, AZ 85251",
    score: 84, price: 1, tags: ["Bar","Saloon","Western","Historic","Iconic","Late Night"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Cheap Beer","Whiskey Shots","Country Music","Bar Classics"],
    desc: "One of Old Town's original Western saloons on Brown Avenue — the unironic version of the concept, with Stetson-wearing regulars who have been propping up the bar for decades. Cheap drinks, country jukebox, zero tourist-saloon compromises." }
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

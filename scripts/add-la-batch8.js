#!/usr/bin/env node
// LA batch 8 — Time Out LA Best Bars (March 2026, 16 new) — PL voice
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
  { name: "Thunderbolt", cuisine: "Cocktail Bar", neighborhood: "Historic Filipinotown",
    address: "1263 W Temple St, Los Angeles, CA 90026",
    lookup: "1263 W Temple St, Los Angeles, CA 90026",
    score: 88, price: 3, tags: ["Cocktails","Bar","Date Night","Critics Pick","Trending"],
    instagram: "@thunderboltla", website: "",
    dishes: ["Zero-Waste Cocktail","Signature Highball","Seasonal Spirit-Forward","Bar Snacks"],
    desc: "Award-winning cocktail bar where the mixology program runs tech-forward and zero-waste — meaning every garnish, infusion, and byproduct has a second life. Casual Filipinotown corner; drinks that would cost double in Beverly Hills. One of LA's most-hyped bar programs, and the hype is earned." },
  { name: "Accomplice", cuisine: "Cocktail Bar", neighborhood: "Mar Vista",
    address: "3811 Grand View Blvd, Los Angeles, CA 90066",
    lookup: "3811 Grand View Blvd, Los Angeles, CA 90066",
    score: 87, price: 3, tags: ["Cocktails","Bar","Date Night","Critics Pick"],
    instagram: "@accomplicemarvista", website: "",
    dishes: ["Ever-Changing Cocktail Menu","Amaro Selection","House Spritz","Bar Bites"],
    desc: "L-shaped cocktail bar sharing space with Mar Vista's Little Fatty — the Westside's best bar program hiding in a mid-block. Menu rotates so often the bartenders don't memorize it; spirits selection punches wildly above the room. Go early; it gets crowded." },
  { name: "Dan Sung Sa", cuisine: "Korean / Bar / Anju", neighborhood: "Koreatown",
    address: "3317 W 6th St, Los Angeles, CA 90020",
    lookup: "3317 W 6th St, Los Angeles, CA 90020",
    score: 87, price: 2, tags: ["Korean","Bar","Late Night","Iconic","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Anju Platter","Soju Cocktails","Grilled Skewers","Kimchi Pancake"],
    desc: "The K-town drinking institution that turned Korean drinking snacks (anju) into a full dining format. Dim, claustrophobic-in-a-good-way, walls papered with decades of receipts. Soju flows, skewers sizzle, and the 2 a.m. crowd never really leaves. One of LA's most specific bar experiences." },
  { name: "Capri Club", cuisine: "Aperitivo Bar / Italian", neighborhood: "Eagle Rock",
    address: "4604 Eagle Rock Blvd, Los Angeles, CA 90041",
    lookup: "4604 Eagle Rock Blvd, Los Angeles, CA 90041",
    score: 86, price: 3, tags: ["Italian","Cocktails","Wine Bar","Date Night","Trending","Patio"],
    instagram: "@capriclub", website: "",
    dishes: ["Negroni","Amaro Flight","Aperol Spritz","Snack Plate"],
    desc: "Ultra-trendy Eagle Rock aperitivo bar with the biggest amaro selection on the east side and a negroni that the amateur drinks crowd keeps crediting as their best. Italian-bar aesthetic done with taste; patio packs by 6 p.m. A reason to make the Eagle Rock drive." },
  { name: "Everson Royce Bar", cuisine: "Cocktail Bar / Patio", neighborhood: "Arts District",
    address: "1936 E 7th St, Los Angeles, CA 90021",
    lookup: "1936 E 7th St, Los Angeles, CA 90021",
    score: 86, price: 2, tags: ["Cocktails","Bar","Patio","Casual","Local Favorites"],
    instagram: "@eversonroycebar", website: "https://eversonroycebar.com",
    dishes: ["Classic Cocktails","Burger","Patio Bites","Beer & Wine"],
    desc: "The Arts District patio where the cocktails stay reasonably priced and the burger is better than it has any right to be. Indoor-outdoor flow, low-key room, no attitude — the anti-Hollywood bar. A regular move for the DTLA-adjacent crowd that doesn't want to dress up." },
  { name: "The Roger Room", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "Beverly Grove",
    address: "370 N La Cienega Blvd, Los Angeles, CA 90048",
    lookup: "370 N La Cienega Blvd, Los Angeles, CA 90048",
    score: 87, price: 3, tags: ["Cocktails","Speakeasy","Bar","Date Night","Hidden Gem","Iconic"],
    instagram: "@therogerroomla", website: "",
    dishes: ["Craft Cocktails","Off-Menu Specials","House Aperitif","Bartender's Choice"],
    desc: "The neon 'PSYCHIC' sign is the only signage; what's behind it is one of LA's best-preserved cocktail rooms. Tight menu, stronger off-menu options, bartenders who actually care. The speakeasy concept executed without the speakeasy LARP." },
  { name: "Night on Earth", cuisine: "Cocktail Bar", neighborhood: "Hollywood",
    address: "3256 Cahuenga Blvd W, Los Angeles, CA 90068",
    lookup: "3256 Cahuenga Blvd W, Los Angeles, CA 90068",
    score: 85, price: 3, tags: ["Cocktails","Bar","Date Night","Trending"],
    instagram: "@nightonearth_la", website: "",
    dishes: ["Signature Cocktails","Flavor-Driven Highball","Seasonal Drink","Small Plates"],
    desc: "Futuristic Hollywood cocktail bar built around an all-star drinks lineup from some of LA's best bartenders. Flavor-forward, less concerned with spirit collecting than with making things taste right. The Cahuenga corridor's current reservation-worthy bar." },
  { name: "Bar Benjamin", cuisine: "Cocktail Bar / American", neighborhood: "Fairfax",
    address: "7174 Melrose Ave, Los Angeles, CA 90046",
    lookup: "7174 Melrose Ave, Los Angeles, CA 90046",
    score: 85, price: 3, tags: ["Cocktails","Bar","Date Night","Patio"],
    instagram: "@barbenjamin.la", website: "",
    dishes: ["Welcome Mini Cocktail","Spirit-Forward Menu","Bar Snacks","Seasonal Highball"],
    desc: "The cocktail companion to Benjamin Hollywood — a free mini cocktail arrives with your table, which is either an old-fashioned gesture or a hospitality flex depending on your mood. Competitive drinks menu; easier reservation than the neighboring dining room." },
  { name: "Tokyo Noir", cuisine: "Japanese / Izakaya / Speakeasy", neighborhood: "Long Beach",
    address: "1731 E 4th St, Long Beach, CA 90802",
    lookup: "1731 E 4th St, Long Beach, CA 90802",
    score: 86, price: 3, tags: ["Japanese","Bar","Speakeasy","Date Night","Cocktails","Hidden Gem"],
    instagram: "@tokyonoir.lb", website: "",
    dishes: ["Japanese-Style Highball","Seafood Izakaya Plates","Whisky Selection","Yakitori"],
    desc: "Long Beach speakeasy built in a Japanese bartending tradition — light-touch drinks, precision ice, seafood-forward izakaya food that's fresher than most bar menus attempt. The room looks like a detective film set; the cocktails don't fool around." },
  { name: "Death & Company Los Angeles", cuisine: "Cocktail Bar", neighborhood: "Arts District",
    address: "810 E 3rd St, Los Angeles, CA 90013",
    lookup: "810 E 3rd St, Los Angeles, CA 90013",
    score: 91, price: 4, tags: ["Cocktails","Bar","Date Night","Critics Pick","Iconic","Speakeasy"],
    group: "Death & Co",
    instagram: "@deathandcompanyla", website: "https://deathandcompany.com",
    dishes: ["Original D&Co Cocktails","Rare Spirits","Seasonal Menu","Bar Snacks"],
    desc: "The NYC Death & Co landed in the Arts District with the drink program intact — dense menu, rare spirits you won't see anywhere else in LA, and bartenders who talk about technique because they earned the right to. One of the best cocktail rooms in LA by any honest measure." },
  { name: "Apothéke", cuisine: "Cocktail Bar / Botanical", neighborhood: "Chinatown",
    address: "1746 N Spring St, Los Angeles, CA 90012",
    lookup: "1746 N Spring St, Los Angeles, CA 90012",
    score: 86, price: 3, tags: ["Cocktails","Bar","Date Night","Speakeasy","Trending"],
    instagram: "@apothekela", website: "",
    dishes: ["Botanical Cocktails","Prescription Menu","House Bitters","Bar Plates"],
    desc: "Apothecary-themed Chinatown bar where the drinks menu reads as prescriptions and the ingredients are actual herbs, spices, tinctures. Could be cringe; isn't, because they follow through on the craft. Drinks are detail-heavy and genuinely delicious. Great date-night move." },
  { name: "The Let's Go Disco & Cocktail Club", cuisine: "Cocktail Bar / Dance", neighborhood: "Arts District",
    address: "710 E 4th Pl, Los Angeles, CA 90013",
    lookup: "710 E 4th Pl, Los Angeles, CA 90013",
    score: 84, price: 3, tags: ["Cocktails","Bar","Dance","Late Night","Trending"],
    instagram: "@letsgodiscoclub", website: "",
    dishes: ["Tropical Cocktails","Disco Punch","Seasonal Specials","Bar Snacks"],
    desc: "Disco-floor cocktail lounge where the drinks actually compete with the playlist. Dance-friendly, loose, a place that works for a bar date or a full night out. Arts District's most reliable drink-then-dance handoff." },
  { name: "Big Bar", cuisine: "Cocktail Bar", neighborhood: "Los Feliz",
    address: "1927 Hillhurst Ave, Los Angeles, CA 90027",
    lookup: "1927 Hillhurst Ave, Los Angeles, CA 90027",
    score: 85, price: 2, tags: ["Cocktails","Bar","Patio","Casual","Local Favorites"],
    instagram: "@bigbarlosangeles", website: "",
    dishes: ["Classic Cocktails","Seasonal Menu","Craft Beer","Small Plates"],
    desc: "Los Feliz neighborhood cocktail bar in a converted Craftsman bungalow. The bar program is serious; the vibe isn't. Patio is the move on warm nights, the cocktail list has genuine depth for a walk-in neighborhood room. A low-key LA classic." },
  { name: "Walt's Bar", cuisine: "Beer Bar / Craft", neighborhood: "Eagle Rock",
    address: "4680 Eagle Rock Blvd, Los Angeles, CA 90041",
    lookup: "4680 Eagle Rock Blvd, Los Angeles, CA 90041",
    score: 82, price: 2, tags: ["Bar","Beer","Casual","Patio","Local Favorites"],
    instagram: "@waltsbar", website: "",
    dishes: ["Craft Beer Selection","Cocktails","Pub Snacks","Board Games"],
    desc: "Eagle Rock's game-friendly craft-beer bar with enough board games to make a weekend of it. Reasonable tap list, cocktails for people who want them, a laid-back vibe that reads very specifically northeast-LA. Not trying to be a scene; just working." },
  { name: "The Bamboo Club", cuisine: "Tiki Bar", neighborhood: "Long Beach",
    address: "3522 E Anaheim St, Long Beach, CA 90804",
    lookup: "3522 E Anaheim St, Long Beach, CA 90804",
    score: 87, price: 3, tags: ["Cocktails","Tiki","Bar","Date Night","Critics Pick","Iconic"],
    instagram: "@bambooclublb", website: "",
    dishes: ["Mai Tai","Tropical Rum Cocktails","Vinyl Night Snacks","Bartender's Choice"],
    desc: "Long Beach tiki room named by Time Out as LA County's best tiki bar, and the rum program earns that call. Tropical cocktails that respect the Don-the-Beachcomber canon, vinyl nights, bamboo-and-tiki-torch set dressing that's been built with real intent rather than a theme-park version." },
  { name: "All Season Brewing Co.", cuisine: "Brewery / Bar", neighborhood: "Mid-Wilshire",
    address: "800 S La Brea Ave, Los Angeles, CA 90036",
    lookup: "800 S La Brea Ave, Los Angeles, CA 90036",
    score: 83, price: 2, tags: ["Brewery","Bar","Casual","Patio","Family Friendly"],
    instagram: "@allseasonbrewing", website: "",
    dishes: ["Craft Beer Flights","House IPA","Cocktail Menu","Brewery Plates"],
    desc: "La Brea-adjacent brewery-bar that punches above the strip-mall address. Extensive beer list, decent cocktails for non-beer drinkers, room big enough to take a group. Weekend-brunch-turned-late-afternoon the specialty." }
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
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
      score: e.score, price: e.price, tags: e.tags, indicators: [],
      group: e.group||"", hh: "", reservation: "walk-in",
      awards: "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [], res_tier: 0, busyness: null, waitTime: null,
      popularTimes: null, lastUpdated: null, trending: false,
      instagram: e.instagram||"", suburb: false,
      website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
})();

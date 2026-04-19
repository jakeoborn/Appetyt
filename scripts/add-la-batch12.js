#!/usr/bin/env node
// LA batch 12 — Eater LA Echo Park (13 new, PL-voice cards)
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
  { name: "Men & Beasts", cuisine: "Modern Chinese / Vegetarian", neighborhood: "Echo Park",
    address: "2100 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2100 W Sunset Blvd, Los Angeles, CA 90026",
    score: 87, price: 3, tags: ["Chinese","Modern","Vegetarian","Date Night","Trending","Critics Pick"],
    indicators: ["vegetarian"],
    reservation: "Resy",
    instagram: "@menandbeasts", website: "",
    dishes: ["Pan-Fried Dumplings","Seasonal Vegetable Plates","Gongfu Tea Ceremony","Tofu Mapo"],
    desc: "The former Cosa Buona space reopened as a modern Chinese room with a vegan-leaning menu that carnivores still put on their best-of lists. Pan-fried dumplings, seasonal vegetable progressions, and a gongfu-style tea ceremony that treats the leaves with the same attention most places save for wine. Echo Park's most specific opening of the year." },
  { name: "Henrietta", cuisine: "Deli / Market / Wine Bar", neighborhood: "Echo Park",
    address: "343 Glendale Blvd, Los Angeles, CA 90026",
    lookup: "343 Glendale Blvd, Los Angeles, CA 90026",
    score: 85, price: 3, tags: ["Deli","Wine Bar","Sandwiches","Casual","Trending","Patio"],
    reservation: "walk-in",
    instagram: "@henrietta.la", website: "",
    dishes: ["Muffaletta Sandwich","Cured Meat Board","Independent-Producer Wine","Market Salad"],
    desc: "All-day deli and wine market on Glendale — sandwiches on house bread, charcuterie board with provenance noted, and a wine list built around small independent producers you can also take home in a bottle. The retail-and-restaurant format other Echo Park openings keep trying to pull off; this one actually did." },
  { name: "The Hummingbird", cuisine: "Peruvian / Nikkei", neighborhood: "Echo Park",
    address: "1600 N Alvarado St, Los Angeles, CA 90026",
    lookup: "1600 N Alvarado St, Los Angeles, CA 90026",
    score: 88, price: 3, tags: ["Peruvian","Japanese","Seafood","Date Night","Cocktails","Critics Pick","Trending"],
    reservation: "Resy",
    instagram: "@thehummingbird.la", website: "",
    dishes: ["Nikkei Hand Roll","Ceviche Classico","Pisco Sour","Lomo Saltado"],
    desc: "Ricardo Zarate (Mo-Chica, Picca) opened one of LA's most specific ceviche programs inside an Echo Park dining room that feels transplanted from Lima. Peruvian-Japanese Nikkei hand rolls, ceviches with the aji-limo acidity right, a pisco bar that takes the spirit seriously. Chef-driven cooking without the fine-dining price." },
  { name: "Honey Hi", cuisine: "Cafe / Healthy", neighborhood: "Echo Park",
    address: "1620 Sunset Blvd, Los Angeles, CA 90026",
    lookup: "1620 Sunset Blvd, Los Angeles, CA 90026",
    score: 84, price: 2, tags: ["Cafe","Healthy","Brunch","Casual","Vegetarian","Local Favorites"],
    indicators: ["vegetarian"],
    reservation: "walk-in",
    instagram: "@honeyhi", website: "https://honey-hi.com",
    dishes: ["Bone Broth Bowl","Gluten-Free Egg Plate","Mezze Plate","Housemade Chai"],
    desc: "Daytime café with a gluten-free, produce-centered menu that was doing wellness cooking before it was marketable. Everything sourced carefully, every plate earns its place, and the room feels like the smart friend's kitchen. Echo Park's reliable brunch for the people who ask about the oil." },
  { name: "Alejandra's Quesadilla Cart", cuisine: "Oaxacan / Mexican", neighborhood: "Echo Park",
    address: "1246 Echo Park Ave, Los Angeles, CA 90026",
    lookup: "1246 Echo Park Ave, Los Angeles, CA 90026",
    score: 85, price: 1, tags: ["Mexican","Oaxacan","Street Food","Casual","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Blue Corn Quesadilla","Squash Blossom Filling","Tinga","Quesabirria"],
    desc: "Alejandra has been griddling blue-corn quesadillas on Echo Park Ave long enough to have her own cult following. Masa made fresh, squash blossoms when they're in, tinga when you want something spicier, a line that tells you everything. Cash, sidewalk, the old rules." },
  { name: "Bar Flores", cuisine: "Cocktail Bar / Mexican", neighborhood: "Echo Park",
    address: "1542 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "1542 W Sunset Blvd, Los Angeles, CA 90026",
    score: 85, price: 3, tags: ["Cocktails","Bar","Mexican","Date Night","Trending","Patio"],
    reservation: "walk-in",
    instagram: "@barfloresla", website: "",
    dishes: ["Agave Cocktails","Mezcal Flight","Snacks Plate","Michelada"],
    desc: "Echo Park agave-spirits cocktail bar with a tight drinks program and enough snacks to round into a light dinner. Pairs with Lowboy next door — one room, one bill, two pacing options. The current Sunset Boulevard move when you don't want to book dinner." },
  { name: "Donna's", cuisine: "Italian American", neighborhood: "Echo Park",
    address: "1538 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "1538 W Sunset Blvd, Los Angeles, CA 90026",
    score: 89, price: 3, tags: ["Italian","American","Date Night","Patio","Cocktails","Critics Pick","Trending"],
    reservation: "Resy",
    instagram: "@donnasla", website: "https://donnasla.com",
    dishes: ["Pomodoro Spaghetti & Meatballs","Chicken Parmigiana","Fried Calamari","House Tiramisu"],
    desc: "Echo Park's East-Coast-Italian-American cult favorite — red-sauce classics cooked with enough restraint to feel like an updated Marco Polo. Spaghetti and meatballs are on every table; chicken parm doesn't get delegated to the lunch menu; the tiramisu stays on the call-sheet. Reservations tight; arrive early." },
  { name: "Kien Giang Bakery", cuisine: "Vietnamese / Bakery", neighborhood: "Echo Park",
    address: "1471 Echo Park Ave, Los Angeles, CA 90026",
    lookup: "1471 Echo Park Ave, Los Angeles, CA 90026",
    score: 84, price: 1, tags: ["Vietnamese","Bakery","Sandwiches","Casual","Quick Bite","Historic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Bánh Mì","Vietnamese Iced Coffee","Pâté Chaud","Pandan Waffle"],
    desc: "Operating since 1980 and still the neighborhood's bánh mì reference point. Baguettes baked right, pâté layered properly, the coffee cut with condensed milk the way it's meant to be. A cash-friendly Echo Park institution that has outlasted three waves of gentrification without changing the menu." },
  { name: "Bacetti Trattoria", cuisine: "Italian / Roman", neighborhood: "Echo Park",
    address: "1509 Echo Park Ave, Los Angeles, CA 90026",
    lookup: "1509 Echo Park Ave, Los Angeles, CA 90026",
    score: 87, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Wine Bar"],
    reservation: "Resy",
    instagram: "@bacettila", website: "",
    dishes: ["Cacio e Pepe","Carbonara","Amatriciana","Saltimbocca"],
    desc: "Echo Park's Roman trattoria — the big four Roman pastas (cacio e pepe, carbonara, amatriciana, gricia) done to the book, a room designed with actual intent, and a wine list that reads like someone spent a sabbatical in Lazio. Not a scene, not trying to be. One of LA's most adult Italian rooms." },
  { name: "Valerie Echo Park", cuisine: "Cafe / Bakery / Brunch", neighborhood: "Echo Park",
    address: "1665 Echo Park Ave, Los Angeles, CA 90026",
    lookup: "1665 Echo Park Ave, Los Angeles, CA 90026",
    score: 84, price: 2, tags: ["Cafe","Bakery","Brunch","Casual","Patio","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@valeriela", website: "",
    dishes: ["Quiche","Sandwich of the Day","Pastry Case","Drip Coffee"],
    desc: "The off-Sunset café Echo Park locals don't advertise. Savory breakfast options, a pastry case that rewards showing up early, and a patio tucked out of the traffic. Weekend brunch without the brunch line." },
  { name: "The Douglas", cuisine: "Bar / Gastropub", neighborhood: "Echo Park",
    address: "1400 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "1400 W Sunset Blvd, Los Angeles, CA 90026",
    score: 83, price: 2, tags: ["Bar","American","Casual","Patio","Local Favorites","Cocktails"],
    reservation: "walk-in",
    instagram: "@thedouglasla", website: "",
    dishes: ["Craft Beer List","Wine by the Glass","Bar Burger","Shared Plates"],
    desc: "Neighborhood bar-plus-food that gets the basics right — beer list with genuine range, wine by the glass priced for the casual, and a bar burger that's actually worth the detour. Echo Park's good-hangover-day spot." },
  { name: "Ototo", cuisine: "Japanese / Izakaya / Sake Bar", neighborhood: "Echo Park",
    address: "1360 Allison Ave, Los Angeles, CA 90026",
    lookup: "1360 Allison Ave, Los Angeles, CA 90026",
    score: 89, price: 3, tags: ["Japanese","Izakaya","Sake","Cocktails","Date Night","Critics Pick","Trending"],
    reservation: "Resy",
    instagram: "@ototo.la", website: "https://ototo.la",
    dishes: ["Chicken Karaage","Japanese Curry","Sake Flight","Yakitori"],
    desc: "Chef Charles Namba and sommelier Courtney Kaplan's second Echo Park room — an izakaya whose sake list is routinely called one of the three best in the US. Japanese curry, karaage, yakitori — the bar-food canon elevated with the kind of product-focus you'd expect from a Michelin-adjacent room. The reservation most Echo Park regulars chase." },
  { name: "Angel's Tijuana Tacos", cuisine: "Mexican / Tacos", neighborhood: "Echo Park",
    address: "1185 W Sunset Blvd, Los Angeles, CA 90012",
    lookup: "1185 W Sunset Blvd, Los Angeles, CA 90012",
    score: 87, price: 1, tags: ["Mexican","Street Food","Casual","Late Night","Local Favorites","Iconic","Trending"],
    reservation: "walk-in",
    instagram: "@angelstijuanatacos", website: "",
    dishes: ["Tijuana-Style Carne Asada","Adobada","Cabeza","Quesataco"],
    desc: "Angel's started as a taco stand, went viral, and turned into one of the most photographed tacos in LA — and the food holds up. Tijuana-style carne asada over a flour tortilla, adobada with the right char, quesatacos that earn every dollar. Open late; the line is the local endorsement." }
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

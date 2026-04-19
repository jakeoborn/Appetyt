#!/usr/bin/env node
// Phoenix batch 4 — Infatuation top 20 (new-only) — PL voice
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
  { name: "Sottise", cuisine: "French / Bistro", neighborhood: "Downtown Phoenix",
    address: "1025 N 2nd St, Phoenix, AZ 85004",
    lookup: "1025 N 2nd St, Phoenix, AZ 85004",
    score: 88, price: 3, tags: ["French","Date Night","Cocktails","Wine Bar","Critics Pick"],
    instagram: "@sottisephx", website: "",
    dishes: ["Steak Frites","Duck Rillettes","Orange Wine","Low-ABV Cocktails"],
    desc: "A charming downtown hideaway that made the decision to be a French bistro without being fussy about it. Steak frites that have the sauce right, duck rillettes on the little plates, an orange wine list that's actually been curated, and low-ABV cocktails for the mid-week. One of the Phoenix restaurants Infatuation highlights as legit." },
  { name: "Ollie Vaughn's", cuisine: "Cafe / Bakery / Brunch", neighborhood: "Miracle Mile",
    address: "1526 E McDowell Rd, Phoenix, AZ 85006",
    lookup: "1526 E McDowell Rd, Phoenix, AZ 85006",
    score: 85, price: 2, tags: ["Cafe","Brunch","Bakery","Casual","Local Favorites"],
    instagram: "@ollievaughns", website: "",
    dishes: ["Flaky Croissant","Breakfast Sandwich","House Drip","Seasonal Scone"],
    desc: "The low-key, high-reward brunch spot that Phoenix locals recommend when they don't want to give up their actual secret. Coffee that stands on its own, laminated croissants, and a breakfast sandwich that puts most egg-bagel operations to shame. Miracle Mile's most reliable morning." },
  { name: "Gallo Blanco", cuisine: "Mexican", neighborhood: "Garfield",
    address: "928 E Pierce St, Phoenix, AZ 85006",
    lookup: "928 E Pierce St, Phoenix, AZ 85006",
    score: 84, price: 2, tags: ["Mexican","Casual","Cocktails","Patio","Local Favorites"],
    instagram: "@galloblancocafe", website: "https://galloblancocafe.com",
    dishes: ["Carne Asada","Enchiladas","Churros","Prickly Pear Margarita"],
    desc: "Big, shareable Mexican plates in a dining room built for a table of six that grew to eight by 7:30. Carne asada, enchiladas, churros that actually get ordered, and a patio that becomes one of the better Garfield scenes by happy hour. Works for a weeknight and a birthday both." },
  { name: "Lovebite Dumplings", cuisine: "Chinese / Dumplings", neighborhood: "Downtown Phoenix",
    address: "116 E Roosevelt St, Phoenix, AZ 85004",
    lookup: "116 E Roosevelt St, Phoenix, AZ 85004",
    score: 82, price: 1, tags: ["Chinese","Casual","Quick Bite","Late Night"],
    instagram: "@lovebite.dumplings", website: "",
    dishes: ["Pan-Fried Pork Dumplings","Soup Dumplings","Scallion Pancake","Dan Dan Noodles"],
    desc: "A grab-and-go dumpling shack on Roosevelt that charges half what it should for the quality. Pan-fried pork stickers with the right crust, soup dumplings that hold their soup, and a noodle menu that goes deeper than it looks. The best casual Chinese food Downtown Phoenix has going." }
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
      score: e.score, price: e.price, tags: e.tags, indicators: [], group: "", hh: "",
      reservation: "walk-in", awards: "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [], res_tier: 0, busyness: null, waitTime: null, popularTimes: null,
      lastUpdated: null, trending: false, instagram: e.instagram||"",
      suburb: false, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

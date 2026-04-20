#!/usr/bin/env node
// Phoenix batch 28 - final 3 picks to hit 500.
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
  for (; i < html.length; i++) { const c = html[i]; if (c === "[") depth++; else if (c === "]") { depth--; if (depth === 0) break; } }
  return { start, end: i, slice: html.slice(start, i + 1) };
}
function parseArr(s) { return (new Function("return " + s))(); }
function maxId(a) { return a.reduce((m, r) => Math.max(m, r.id || 0), 0); }

const MANUAL = {
  "122 N 2nd St, Phoenix, AZ 85004": { lat: 33.4511, lng: -112.0721 },
  "1114 S Central Ave, Phoenix, AZ 85004": { lat: 33.4360, lng: -112.0738 },
  "15233 N Scottsdale Rd, Scottsdale, AZ 85254": { lat: 33.6189, lng: -111.9262 },
};

const entries = [
  { name: "Compass Arizona Grill", cuisine: "American / Southwest", neighborhood: "Downtown Phoenix",
    address: "122 N 2nd St, Phoenix, AZ 85004", lookup: "122 N 2nd St, Phoenix, AZ 85004",
    score: 83, price: 3, tags: ["American","Southwest","Scenic Views","Date Night","Iconic","Hotel Dining","Wine","Hospitality Group"],
    reservation: "OpenTable", group: "Hyatt", instagram: "@compassarizonagrill", website: "https://compassarizonagrill.com",
    dishes: ["Sunset Tasting","Arizona Beef Tenderloin","Prickly Pear Old Fashioned","24th-Floor View"],
    desc: "The Hyatt Regency's 24th-floor revolving restaurant has been Downtown Phoenix's special-occasion room since 1976 — a two-hour full rotation, Southwest-meets-American cooking, and a sunset-over-Camelback view that still earns the room its anniversary-dinner reputation. The skyline classic." },
  { name: "Gus's World Famous Fried Chicken", cuisine: "American / Fried Chicken", neighborhood: "Downtown Phoenix",
    address: "1114 S Central Ave, Phoenix, AZ 85004", lookup: "1114 S Central Ave, Phoenix, AZ 85004",
    score: 84, price: 2, tags: ["American","Fried Chicken","Casual","Local Favorites","Counter Service","Iconic","Southern"],
    reservation: "walk-in", instagram: "@gusfriedchicken", website: "https://gusfriedchicken.com",
    dishes: ["Hot & Spicy Fried Chicken","Fried Pickles","Baked Beans","Sweet Tea"],
    desc: "The Memphis cult-fried-chicken export that landed in Downtown Phoenix in 2019 — cayenne-dusted chicken that hits the exact brittle-skin, moist-meat mark, served in a room that keeps the Mason's Café warehouse bones of the Memphis original. The Central Avenue fried-chicken destination." },
  { name: "Morton's The Steakhouse", cuisine: "Steakhouse", neighborhood: "North Scottsdale",
    address: "15233 N Scottsdale Rd, Scottsdale, AZ 85254", lookup: "15233 N Scottsdale Rd, Scottsdale, AZ 85254",
    score: 85, price: 4, tags: ["Steakhouse","Fine Dining","Date Night","Iconic","Wine","Cocktails","Hospitality Group","Business Dining"],
    reservation: "OpenTable", group: "Morton's Restaurant Group / Landry's", instagram: "@mortons", website: "https://mortons.com",
    dishes: ["Prime Ribeye","Sea Bass","Hot Chocolate Cake","Old Fashioned"],
    desc: "The Morton's Chicago-steakhouse format at its North Scottsdale flagship — USDA Prime cuts aged and trimmed the same way since 1978, a dimly-lit dining room that still reads \"closing-a-deal\" more than \"trendy,\" and a bar program that makes the after-work crowd stick for the second round. Business-dinner standard for a reason." },
];

function nominatim(a) {
  return new Promise((res, rej) => {
    const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
    https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" } }, (r) => {
      let d = ""; r.on("data", c => d += c);
      r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({ lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon) }); } catch (e) { rej(e); } });
    }).on("error", rej);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function inPhxBox(c) { return c && c.lat >= 33.15 && c.lat <= 33.85 && c.lng >= -112.45 && c.lng <= -111.55; }

(async () => {
  const s = getArrSlice("PHX_DATA");
  const arr = parseArr(s.slice);
  const existing = new Set(arr.map(r => r.name.toLowerCase().replace(/[^a-z0-9]/g, "")));
  let nextId = maxId(arr) + 1;
  const built = [];
  for (const e of entries) {
    const key = e.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (existing.has(key)) { console.log(`SKIP dupe: ${e.name}`); continue; }
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!inPhxBox(c) && MANUAL[e.lookup]) { c = MANUAL[e.lookup]; console.log(`  → manual fallback`); }
    if (!inPhxBox(c)) { console.log(`  ❌ SKIP (no valid coord)`); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1200);
    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood,
      score: e.score, price: e.price, tags: e.tags, indicators: e.indicators || [],
      group: e.group || "", hh: "", reservation: e.reservation || "walk-in",
      awards: e.awards || "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [],
      res_tier: e.reservation === "Tock" ? 5 : e.reservation === "Resy" ? 4 : e.reservation === "OpenTable" ? 3 : 0,
      busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, instagram: e.instagram || "",
      suburb: false, website: e.website || "", verified: "2026-04-20"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

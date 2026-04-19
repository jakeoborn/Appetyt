#!/usr/bin/env node
// Phoenix batch 18 — 5 high-confidence training picks (chef-owned Phoenix + Scottsdale)
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
  { name: "The Clever Koi", cuisine: "Asian / Modern", neighborhood: "Uptown",
    address: "4236 N Central Ave, Phoenix, AZ 85012",
    lookup: "4236 N Central Ave, Phoenix, AZ 85012",
    score: 87, price: 3, tags: ["Asian","Modern","Date Night","Cocktails","Critics Pick","Trending","Patio"],
    reservation: "OpenTable",
    group: "Nelson Kwock / Jared Porter",
    instagram: "@thecleverkoi", website: "https://thecleverkoi.com",
    dishes: ["Steamed Pork Buns","Ramen","Korean Fried Chicken","Sake Pairing"],
    desc: "Chefs Nelson Kwock and Jared Porter's modern pan-Asian dining room on Central Ave — ramen, steamed buns, and Korean fried chicken done with the discipline of a chef-owned kitchen. One of Phoenix's most consistent Asian-modern rooms for over a decade." },
  { name: "The Parlor Pizzeria", cuisine: "Italian / Pizza", neighborhood: "Arcadia",
    address: "1916 E Camelback Rd, Phoenix, AZ 85016",
    lookup: "1916 E Camelback Rd, Phoenix, AZ 85016",
    score: 87, price: 2, tags: ["Italian","Pizza","Casual","Patio","Historic","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "Upward Projects-adjacent",
    instagram: "@theparlorpizzeria", website: "https://theparlorpizzeria.com",
    dishes: ["Wood-Fired Pizza","Burrata Salad","Meatballs","Tiramisu"],
    desc: "A 1950s beauty parlor turned wood-fired pizzeria — the name earns itself. Chef Aric Mei's menu of crispy-crust pies, meatballs that anchor the appetizer list, and a Camelback Rd patio that catches the late-afternoon light. One of Phoenix's most architecturally-specific restaurant buildings." },
  { name: "The Herb Box", cuisine: "Contemporary American", neighborhood: "Old Town Scottsdale",
    address: "7134 E Stetson Dr, Scottsdale, AZ 85251",
    lookup: "7134 E Stetson Dr, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["American","Contemporary","Date Night","Patio","Brunch","Local Favorites","Cocktails"],
    reservation: "OpenTable",
    instagram: "@herbboxscottsdale", website: "https://herbbox.com",
    dishes: ["Seasonal Salad","Wood-Fired Chicken","Handmade Pasta","Brunch Program"],
    desc: "A Stetson Drive contemporary-American room that has built its reputation around seasonal produce and a clean-cooking aesthetic. The chopped-salad-and-protein-plate format that Scottsdale lunch regulars trust; the brunch program that Old Town locals book Saturdays around." },
  { name: "Hand Cut Burgers and Chophouse", cuisine: "American / Burgers / Steakhouse", neighborhood: "Old Town Scottsdale",
    address: "7135 E Camelback Rd Ste 154, Scottsdale, AZ 85251",
    lookup: "7135 E Camelback Rd, Scottsdale, AZ 85251",
    score: 84, price: 3, tags: ["American","Burgers","Steakhouse","Casual","Date Night","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@handcutburgers", website: "https://handcutburgers.com",
    dishes: ["Hand-Cut Burger","Dry-Aged Ribeye","Truffle Fries","Chocolate Cream Pie"],
    desc: "FRC's burger-and-chophouse concept at Scottsdale Fashion Square — hand-ground burgers, dry-aged beef program, and a menu that sits between casual burger joint and proper steakhouse. The Fashion Square reliable dinner." },
  { name: "El Chullo Peruvian Restaurant", cuisine: "Peruvian", neighborhood: "Arcadia",
    address: "1025 E Indian School Rd, Phoenix, AZ 85014",
    lookup: "1025 E Indian School Rd, Phoenix, AZ 85014",
    score: 84, price: 2, tags: ["Peruvian","Casual","Family Friendly","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@elchulloperuvian", website: "https://elchulloperuvian.com",
    dishes: ["Lomo Saltado","Ceviche Mixto","Aji de Gallina","Pollo a la Brasa"],
    desc: "Phoenix's Peruvian family-run anchor on Indian School Road — classic Lima preparations (lomo saltado with the right wok heat, ceviche with proper leche de tigre, aji de gallina), and a dining room that plays like a Lima neighborhood restaurant transplanted. Quiet, consistent, legit." }
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

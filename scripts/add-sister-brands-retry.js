#!/usr/bin/env node
// Retry the 4 Nominatim-skipped sister-brand entries with simplified addresses.
// Original: scripts/add-sister-brands-batch1.js (2026-04-19)
const fs = require("fs");
const path = require("path");
const https = require("https");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function getArrSlice(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const m = html.match(re);
  if (!m) throw new Error(`Cannot find ${name}`);
  const start = m.index + m[0].length - 1;
  let depth = 0, i = start;
  for (; i < html.length; i++) {
    const c = html[i];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) break; }
  }
  return { start, end: i, slice: html.slice(start, i + 1) };
}
function parseArr(slice) { return (new Function("return " + slice))(); }
function maxId(arr) { return arr.reduce((m, r) => Math.max(m, r.id || 0), 0); }

// Keep the full street address (with suite) as the stored value,
// but use a simplified query for Nominatim lookup.
const entries = [
  {
    target: "HOUSTON_DATA", city: "Houston", brand: "Sweetgreen", neighborhood: "Heights",
    address: "600 N Shepherd Dr Suite 149, Houston, TX 77007",
    lookup: "600 N Shepherd Dr, Houston, TX 77007",
    cuisine: "Salads / Fast Casual",
    website: "https://www.sweetgreen.com",
    desc: "Seasonal salad chain at M-K-T Heights. Warm grain bowls, house-made dressings, and the Harvest Bowl cult classic. Multiple Houston-area locations including Heights and Montrose."
  },
  {
    target: "HOUSTON_DATA", city: "Houston", brand: "CAVA", neighborhood: "Heights",
    address: "250 W 20th St Suite 400, Houston, TX 77008",
    lookup: "250 W 20th St, Houston, TX 77008",
    cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/houston-heights-tx",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. The Heights location is one of several in Houston."
  },
  {
    target: "CHICAGO_DATA", city: "Chicago", brand: "CAVA", neighborhood: "Streeterville",
    address: "270 E Ontario St 01-100, Chicago, IL 60611",
    lookup: "270 E Ontario St, Chicago, IL 60611",
    cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/Streeterville-IL",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. Streeterville location in the Ontario/Fairbanks corridor."
  },
  {
    target: "LA_DATA", city: "Los Angeles", brand: "CAVA", neighborhood: "Hollywood",
    address: "6200 Sunset Blvd Suite #1130, Los Angeles, CA 90028",
    lookup: "6200 Sunset Blvd, Los Angeles, CA 90028",
    cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/hollywood-ca",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. The Hollywood location at Sunset + Vine is one of many LA-area spots."
  }
];

const BRAND = {
  "Sweetgreen": {
    score: 80, price: 2,
    tags: ["Healthy", "Casual", "Fast Casual", "Family Friendly"],
    indicators: ["vegetarian"],
    group: "Sweetgreen Inc.",
    instagram: "@sweetgreen",
    dishes: ["Harvest Bowl", "Crispy Rice Bowl", "Kale Caesar", "Seasonal Bowl"]
  },
  "CAVA": {
    score: 76, price: 1,
    tags: ["Healthy", "Casual", "Fast Casual"],
    indicators: ["vegetarian"],
    group: "CAVA Group",
    instagram: "@cava",
    dishes: ["Harissa Chicken Bowl", "Falafel Pita", "Crazy Feta Dip", "Lemon Herb Tahini"]
  }
};

function nominatim(address) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    https.get(url, { headers: { "User-Agent": "DimHour-DataAudit/1.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.length === 0) return resolve(null);
          resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
        } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const cityMap = {};
  for (const target of new Set(entries.map(e => e.target))) {
    const s = getArrSlice(target);
    const arr = parseArr(s.slice);
    cityMap[target] = { slice: s, arr, nextId: maxId(arr) + 1 };
  }

  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.brand} @ ${e.lookup}…`);
    const coords = await nominatim(e.lookup);
    if (!coords) {
      console.log(`  ❌ still no Nominatim result — SKIPPING`);
      continue;
    }
    console.log(`  ✓ ${coords.lat}, ${coords.lng}`);
    await sleep(1100);

    const defaults = BRAND[e.brand];
    const cm = cityMap[e.target];
    const id = cm.nextId++;
    const brandCities = {
      "Sweetgreen": ["Dallas", "New York", "Houston", "Austin", "Chicago", "Los Angeles"],
      "CAVA":       ["Dallas",              "Houston", "Austin", "Chicago", "Los Angeles"]
    };
    const links = brandCities[e.brand].filter(c => c !== e.city);

    const entry = {
      id, name: e.brand, cuisine: e.cuisine,
      neighborhood: e.neighborhood,
      score: defaults.score, price: defaults.price,
      tags: defaults.tags, indicators: defaults.indicators,
      group: defaults.group, hh: "", reservation: "walk-in",
      awards: "", description: e.desc, dishes: defaults.dishes,
      address: e.address, phone: "", hours: "",
      lat: coords.lat, lng: coords.lng,
      bestOf: [], res_tier: 4, busyness: null, waitTime: null,
      popularTimes: null, lastUpdated: null, trending: false,
      instagram: defaults.instagram, suburb: false,
      website: e.website, verified: "2026-04-19",
      cityLinks: links
    };
    built.push({ target: e.target, entry });
  }

  for (const target of Object.keys(cityMap)) {
    const cm = cityMap[target];
    const adds = built.filter(b => b.target === target).map(b => b.entry);
    if (adds.length === 0) continue;
    const newArr = cm.arr.concat(adds);
    const newSlice = JSON.stringify(newArr);
    html = html.slice(0, cm.slice.start) + newSlice + html.slice(cm.slice.end + 1);
    for (const other of Object.keys(cityMap)) {
      if (other === target) continue;
      const s2 = getArrSlice(other);
      cityMap[other].slice = s2;
    }
    console.log(`${target}: added ${adds.length} entries`);
  }

  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Retry added ${built.length} sister-brand entries`);
})();

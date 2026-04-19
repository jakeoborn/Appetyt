#!/usr/bin/env node
// Add missing Shake Shack / Sweetgreen / CAVA sister brand entries across cities
// Addresses verified via firecrawl_search 2026-04-19
// Coords verified via OpenStreetMap Nominatim before insertion
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

function parseArr(slice) {
  return (new Function("return " + slice))();
}

function maxId(arr) { return arr.reduce((m, r) => Math.max(m, r.id || 0), 0); }

const entries = [
  // SHAKE SHACK
  { target: "HOUSTON_DATA", city: "Houston", brand: "Shake Shack", neighborhood: "Rice Village",
    address: "6205 Kirby Dr, Houston, TX 77005", cuisine: "Burgers / Fast Casual",
    website: "https://shakeshack.com/location/rice-village-tx",
    desc: "NYC burger chain delivering the ShackBurger, crinkle-cut fries, and frozen custard concretes. The Rice Village location sits at 6205 Kirby near the campus and is reliably packed weekends. Multiple Houston-metro locations."
  },
  { target: "AUSTIN_DATA", city: "Austin", brand: "Shake Shack", neighborhood: "South Lamar",
    address: "1100 S Lamar Blvd, Austin, TX 78704", cuisine: "Burgers / Fast Casual",
    website: "https://shakeshack.com/location/south-lamar-austin-tx",
    desc: "NYC burger chain delivering the ShackBurger, crinkle-cut fries, and frozen custard concretes. The South Lamar location at 1100 S Lamar is one of several Austin-metro spots with a patio and dog-friendly seating."
  },
  { target: "CHICAGO_DATA", city: "Chicago", brand: "Shake Shack", neighborhood: "River North",
    address: "66 E Ohio St, Chicago, IL 60611", cuisine: "Burgers / Fast Casual",
    website: "https://shakeshack.com/location/river-north-chicago-il",
    desc: "NYC burger chain delivering the ShackBurger, crinkle-cut fries, and frozen custard concretes. The River North location on East Ohio Street is one of several in Chicago (also at Chicago Athletic Association on S Michigan)."
  },
  { target: "LV_DATA", city: "Las Vegas", brand: "Shake Shack", neighborhood: "The Strip (New York-New York)",
    address: "3790 S Las Vegas Blvd, Las Vegas, NV 89109", cuisine: "Burgers / Fast Casual",
    website: "https://shakeshack.com/location/nyny-hotel-lv-blvd-nv",
    desc: "NYC burger chain in its Vegas home at New York-New York Hotel on the Strip. ShackBurger, crinkle-cut fries, and frozen custard concretes at Strip-adjacent pricing. Walk-up window off the Strip sidewalk."
  },
  { target: "LA_DATA", city: "Los Angeles", brand: "Shake Shack", neighborhood: "West Hollywood",
    address: "8520 Santa Monica Blvd, Los Angeles, CA 90069", cuisine: "Burgers / Fast Casual",
    website: "https://shakeshack.com/location/west-hollywood-santa-monica-la-cienega-ca",
    desc: "NYC burger chain delivering the ShackBurger, crinkle-cut fries, and frozen custard concretes. The West Hollywood location at Santa Monica & La Cienega is one of several LA-metro spots. Patio seating and dog-friendly."
  },

  // SWEETGREEN
  { target: "HOUSTON_DATA", city: "Houston", brand: "Sweetgreen", neighborhood: "Heights",
    address: "600 N Shepherd Dr Suite 149, Houston, TX 77007", cuisine: "Salads / Fast Casual",
    website: "https://www.sweetgreen.com",
    desc: "Seasonal salad chain at M-K-T Heights. Warm grain bowls, house-made dressings, and the Harvest Bowl cult classic. Multiple Houston-area locations including Heights and Montrose."
  },
  { target: "AUSTIN_DATA", city: "Austin", brand: "Sweetgreen", neighborhood: "South Congress",
    address: "1007 S Congress Ave, Austin, TX 78704", cuisine: "Salads / Fast Casual",
    website: "https://www.sweetgreen.com/locations/south-congress/",
    desc: "Seasonal salad chain on South Congress. Warm grain bowls, house-made dressings, and the Harvest Bowl cult classic. One of several Austin-metro locations including West Lake Hills and The Domain."
  },
  { target: "CHICAGO_DATA", city: "Chicago", brand: "Sweetgreen", neighborhood: "West Loop / Fulton Market",
    address: "1000 W Randolph St, Chicago, IL 60607", cuisine: "Salads / Fast Casual",
    website: "https://www.sweetgreen.com/locations/fulton-market/",
    desc: "Seasonal salad chain in Fulton Market. Warm grain bowls, house-made dressings, and the Harvest Bowl cult classic. Multiple Chicago locations across the Loop, River North, and Lincoln Park."
  },
  { target: "LA_DATA", city: "Los Angeles", brand: "Sweetgreen", neighborhood: "Downtown",
    address: "601 W 5th St, Los Angeles, CA 90071", cuisine: "Salads / Fast Casual",
    website: "https://www.sweetgreen.com/locations/5th-grand/",
    desc: "Seasonal salad chain in Downtown LA at 5th + Grand. Warm grain bowls, house-made dressings, and the Harvest Bowl cult classic. Sweetgreen was founded in DC but LA is one of its densest markets with dozens of locations."
  },

  // CAVA
  { target: "HOUSTON_DATA", city: "Houston", brand: "CAVA", neighborhood: "Heights",
    address: "250 W 20th St Suite 400, Houston, TX 77008", cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/houston-heights-tx",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. The Heights location is one of several in Houston."
  },
  { target: "AUSTIN_DATA", city: "Austin", brand: "CAVA", neighborhood: "Downtown",
    address: "515 Congress Ave, Austin, TX 78701", cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/6th-and-congress-tx",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. The 6th and Congress downtown location is one of several in Austin."
  },
  { target: "CHICAGO_DATA", city: "Chicago", brand: "CAVA", neighborhood: "Streeterville",
    address: "270 E Ontario St 01-100, Chicago, IL 60611", cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/Streeterville-IL",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. Streeterville location in the Ontario/Fairbanks corridor."
  },
  { target: "LA_DATA", city: "Los Angeles", brand: "CAVA", neighborhood: "Hollywood",
    address: "6200 Sunset Blvd Suite #1130, Los Angeles, CA 90028", cuisine: "Mediterranean / Fast Casual",
    website: "https://cava.com/locations/hollywood-ca",
    desc: "DC-born Mediterranean fast casual chain that does the customizable grain bowl right. Harissa chicken, falafel, hummus, and the signature Crazy Feta over rice, greens, or pita. The Hollywood location at Sunset + Vine is one of many LA-area spots."
  }
];

// Brand defaults
const BRAND = {
  "Shake Shack": {
    score: 75, price: 2,
    tags: ["Casual", "Fast Casual", "Patio"],
    indicators: [],
    group: "Shake Shack",
    instagram: "@shakeshack",
    dishes: ["ShackBurger", "Shack Stack", "Crinkle-cut Fries", "Frozen Custard Concrete"]
  },
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

// Nominatim lookup
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
    console.log(`Resolving ${e.brand} @ ${e.address}…`);
    const coords = await nominatim(e.address);
    if (!coords) {
      console.log(`  ❌ Nominatim returned no result — SKIPPING`);
      continue;
    }
    console.log(`  ✓ ${coords.lat}, ${coords.lng}`);
    await sleep(1100); // Nominatim rate-limit: 1 req/sec

    const defaults = BRAND[e.brand];
    const cm = cityMap[e.target];
    const id = cm.nextId++;
    const existingCities = entries
      .filter(x => x.brand === e.brand && x.city !== e.city)
      .map(x => x.city === "Los Angeles" ? "Los Angeles" : x.city);
    // Include Dallas/NYC as those entries exist for SS, SG. Just use brand presence.
    const brandCities = {
      "Shake Shack": ["Dallas", "New York", "Houston", "Austin", "Chicago", "Las Vegas", "Los Angeles"],
      "Sweetgreen":  ["Dallas", "New York", "Houston", "Austin", "Chicago", "Los Angeles"],
      "CAVA":        ["Dallas",              "Houston", "Austin", "Chicago", "Los Angeles"]
    };
    const links = brandCities[e.brand].filter(c => c !== e.city);

    const entry = {
      id,
      name: e.brand,
      cuisine: e.cuisine,
      neighborhood: e.neighborhood,
      score: defaults.score,
      price: defaults.price,
      tags: defaults.tags,
      indicators: defaults.indicators,
      group: defaults.group,
      hh: "",
      reservation: "walk-in",
      awards: "",
      description: e.desc,
      dishes: defaults.dishes,
      address: e.address,
      phone: "",
      hours: "",
      lat: coords.lat,
      lng: coords.lng,
      bestOf: [],
      res_tier: 4,
      busyness: null,
      waitTime: null,
      popularTimes: null,
      lastUpdated: null,
      trending: false,
      instagram: defaults.instagram,
      suburb: false,
      website: e.website,
      verified: "2026-04-19",
      cityLinks: links
    };
    built.push({ target: e.target, entry });
  }

  // Insert new entries into each array, rewrite the slice
  for (const target of Object.keys(cityMap)) {
    const cm = cityMap[target];
    const adds = built.filter(b => b.target === target).map(b => b.entry);
    if (adds.length === 0) continue;
    const newArr = cm.arr.concat(adds);
    const newSlice = JSON.stringify(newArr);
    html = html.slice(0, cm.slice.start) + newSlice + html.slice(cm.slice.end + 1);
    // Recompute offsets for subsequent targets since length has changed
    for (const other of Object.keys(cityMap)) {
      if (other === target) continue;
      const s2 = getArrSlice(other);
      cityMap[other].slice = s2;
    }
    console.log(`${target}: added ${adds.length} entries`);
  }

  // Now update existing Dallas + NYC sister-brand entries to include new cities in cityLinks
  const brandCities = {
    "Shake Shack": ["Dallas", "New York", "Houston", "Austin", "Chicago", "Las Vegas", "Los Angeles"],
    "Sweetgreen":  ["Dallas", "New York", "Houston", "Austin", "Chicago", "Los Angeles"],
    "CAVA":        ["Dallas",              "Houston", "Austin", "Chicago", "Los Angeles"]
  };
  // Update #318 (Dallas SS), #1086 (NYC SS), #329 (Dallas SG), #1166 (NYC SG), #325 (Dallas CAVA)
  function updateCityLinks(id, newLinks) {
    const re = new RegExp(`("id":${id}\\b[^}]*?"cityLinks":)\\[[^\\]]*\\]`);
    if (re.test(html)) {
      html = html.replace(re, `$1${JSON.stringify(newLinks)}`);
      console.log(`  updated cityLinks on #${id} -> ${JSON.stringify(newLinks)}`);
      return true;
    }
    // If no cityLinks present, append before closing brace
    const re2 = new RegExp(`(\\{[^{}]*"id":${id}\\b[^{}]*?)\\}`);
    if (re2.test(html)) {
      html = html.replace(re2, `$1,"cityLinks":${JSON.stringify(newLinks)}}`);
      console.log(`  added cityLinks to #${id} -> ${JSON.stringify(newLinks)}`);
      return true;
    }
    return false;
  }
  updateCityLinks(318,  brandCities["Shake Shack"].filter(c => c !== "Dallas"));
  updateCityLinks(1086, brandCities["Shake Shack"].filter(c => c !== "New York"));
  updateCityLinks(329,  brandCities["Sweetgreen"].filter(c => c !== "Dallas"));
  updateCityLinks(1166, brandCities["Sweetgreen"].filter(c => c !== "New York"));
  updateCityLinks(325,  brandCities["CAVA"].filter(c => c !== "Dallas"));

  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length} sister-brand entries + backfilled cityLinks`);
})();

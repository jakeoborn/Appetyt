#!/usr/bin/env node
// Phoenix expansion batch from Eater Phoenix maps (Steakhouses + Brunch) — verified 2026-04-19
// All addresses via phoenix.eater.com; coords via OpenStreetMap Nominatim.
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

// All 17 verified via Eater Phoenix maps 2026-04-19
const entries = [
  // STEAKHOUSES (from phoenix.eater.com/maps/best-steakhouses-steak-restaurants-phoenix-arizona)
  { name: "Mastro's Steakhouse", cuisine: "Steakhouse", neighborhood: "Scottsdale",
    address: "8852 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
    lookup: "8852 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
    score: 90, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations"],
    group: "Landry's", instagram: "@mastrosrestaurants",
    website: "https://www.mastrosrestaurants.com/location/mastros-steakhouse-scottsdale",
    dishes: ["Bone-In Ribeye","Wagyu Tomahawk","Warm Butter Cake","Seafood Tower"],
    desc: "Modern white-tablecloth steakhouse with a vast wagyu and bone-in selection. The legendary warm butter cake is the dessert every table orders. Scottsdale's go-to for special occasions." },
  { name: "Arrowhead Grill", cuisine: "Steakhouse", neighborhood: "Glendale",
    address: "8280 W Union Hills Dr Ste 110, Glendale, AZ 85308",
    lookup: "8280 W Union Hills Dr, Glendale, AZ 85308",
    score: 85, price: 3, tags: ["Steakhouse","Local Favorites","Date Night"],
    instagram: "@arrowheadgrillaz", website: "https://arrowheadgrill.com",
    dishes: ["10oz Delmonico","Prime Rib","Loaded Baked Potato","Bread Pudding"],
    desc: "Local steakhouse with a relaxed West Valley feel and consistent kitchen. The 10-ounce Delmonico melts in the mouth; regulars come weekly." },
  { name: "Dominick's Steakhouse", cuisine: "Steakhouse", neighborhood: "Scottsdale",
    address: "15169 N Scottsdale Rd, Scottsdale, AZ 85254",
    lookup: "15169 N Scottsdale Rd, Scottsdale, AZ 85254",
    score: 88, price: 4, tags: ["Fine Dining","Steakhouse","Rooftop","Date Night","Celebrations"],
    group: "Kelly's Dominick's", instagram: "@dominicksaz",
    website: "https://dominickssteakhouse.com",
    dishes: ["A5 Wagyu","Crispy Shrimp Deviled Eggs","Dry-Aged Porterhouse","Lobster Mac"],
    desc: "Elegant rooftop steakhouse with a pool bar and modern décor. A5 Wagyu and premium cuts come with playful starters like crispy shrimp deviled eggs." },
  { name: "Steak 44", cuisine: "Steakhouse", neighborhood: "Biltmore",
    address: "5101 N 44th St, Phoenix, AZ 85018",
    lookup: "5101 N 44th St, Phoenix, AZ 85018",
    score: 91, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations","Critics Pick"],
    group: "Mastro's/Steak 44", instagram: "@steak44",
    website: "https://steak44.com",
    dishes: ["Dry-Aged Ribeye","48oz Porterhouse","Bacon Lollipops","Truffle Mac"],
    desc: "High-end aged-steak destination with a 3,000-bottle wine vault in the historic Steak 44 building. Bacon lollipops and dry-aged ribeyes anchor the menu." },
  { name: "Le Ame", cuisine: "French Steakhouse", neighborhood: "Arcadia",
    address: "4360 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "4360 E Camelback Rd, Phoenix, AZ 85018",
    score: 87, price: 4, tags: ["Fine Dining","French","Steakhouse","Date Night"],
    instagram: "@leamephx", website: "",
    dishes: ["Filet Mignon","Steak Frites","Escargot","Crème Brûlée"],
    desc: "Fine-dining French steakhouse channeling 19th-century Parisian flair. The filet mignon and steak frites are the non-negotiables; the dining room feels like a private club." },
  { name: "Buck & Rider", cuisine: "Seafood / Steakhouse", neighborhood: "Arcadia",
    address: "4225 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "4225 E Camelback Rd, Phoenix, AZ 85018",
    score: 88, price: 3, tags: ["Seafood","Steakhouse","Date Night","Patio"],
    group: "LGO Hospitality", instagram: "@buckandrider",
    website: "https://buckandrider.com",
    dishes: ["Center-Cut Filet","32oz Bone-In Ribeye","Tower of Seafood","Dover Sole"],
    desc: "Fresh-seafood headliner that also sends out cuts like a 32-ounce bone-in ribeye. The tower of seafood is the table centerpiece." },
  { name: "J&G Steakhouse", cuisine: "Steakhouse", neighborhood: "Scottsdale",
    address: "6000 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "6000 E Camelback Rd, Scottsdale, AZ 85251",
    score: 87, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations","Scenic Views"],
    group: "Jean-Georges", instagram: "@thephoenician",
    website: "https://www.thephoenician.com/dining/jg-steakhouse",
    dishes: ["Bone-In Ribeye","Black Truffle Cheese Fritters","Miso-Glazed Salmon","Roasted Garlic"],
    desc: "Jean-Georges Vongerichten's luxury steakhouse perched atop the Phoenician resort. Butter-soft bone-in ribeye and divine black truffle cheese fritters; views to match." },
  { name: "The Stockyards Steakhouse", cuisine: "Steakhouse", neighborhood: "East Phoenix",
    address: "5009 E Washington St UNIT 115, Phoenix, AZ 85034",
    lookup: "5009 E Washington St, Phoenix, AZ 85034",
    score: 84, price: 3, tags: ["Steakhouse","Historic","Local Favorites"],
    instagram: "@stockyardssteakhouse", website: "https://stockyardssteakhouse.com",
    dishes: ["Prime Bone-In Ribeye","Biscuit & Cornbread Basket","Cowboy Filet","Prime Rib"],
    desc: "Arizona's first steakhouse, anchoring what used to be the largest stockyards in the western U.S. Iconic biscuit-and-cornbread basket and perfectly cooked cuts." },

  // BRUNCH (from phoenix.eater.com/maps/best-brunch-places-breakfast-phoenix-arizona-restaurants)
  { name: "SugarJam Southern Kitchen", cuisine: "Southern / Brunch", neighborhood: "Scottsdale",
    address: "15111 N Hayden Rd, Scottsdale, AZ 85260",
    lookup: "15111 N Hayden Rd, Scottsdale, AZ 85260",
    score: 85, price: 2, tags: ["Brunch","Southern","Casual","Local Favorites"],
    instagram: "@sugarjamaz", website: "https://sugarjam.com",
    dishes: ["Fried Chicken & Waffles","Shrimp & Grits","Biscuits","Bottomless Mimosas"],
    desc: "Reliable Scottsdale destination for Southern-style brunch with DJs and packed dining rooms on weekends. Fried chicken and waffles is the move." },
  { name: "SumoMaya", cuisine: "Mexican / Asian", neighborhood: "Scottsdale",
    address: "6560 N Scottsdale Rd, Scottsdale, AZ 85253",
    lookup: "6560 N Scottsdale Rd, Scottsdale, AZ 85253",
    score: 84, price: 3, tags: ["Brunch","Mexican","Asian","Date Night","Cocktails"],
    group: "Common Era Hospitality", instagram: "@sumomaya",
    website: "https://sumomayarestaurant.com",
    dishes: ["Carne Asada Scramble","Pork Al Pastor Pad Thai","Duck Carnitas Tacos","Bottomless Brunch"],
    desc: "Vibrant Mexican–Asian fusion brunch with unlimited shared plates. Carne asada scramble and pork al pastor pad Thai are the crowd-pleasers." },
  { name: "Otro Cafe", cuisine: "Mexican / Brunch", neighborhood: "Uptown",
    address: "6035 N 7th St, Phoenix, AZ 85014",
    lookup: "6035 N 7th St, Phoenix, AZ 85014",
    score: 86, price: 2, tags: ["Brunch","Mexican","Casual","Cocktails"],
    instagram: "@otrocafephx", website: "https://www.otrocafe.com",
    dishes: ["El Español","Barbacoa and Eggs","Chilaquiles","Horchata Latte"],
    desc: "All-day Mexico City-inspired cafe serving brunch from 8 a.m. to 4 p.m. El Español and barbacoa and eggs are the locals' orders." },
  { name: "Lon's at the Hermosa Inn", cuisine: "Southwest American", neighborhood: "Paradise Valley",
    address: "5532 N Palo Cristi Rd, Paradise Valley, AZ 85253",
    lookup: "5532 N Palo Cristi Rd, Paradise Valley, AZ 85253",
    score: 92, price: 4, tags: ["Fine Dining","Brunch","Patio","Date Night","Scenic Views"],
    group: "Hermosa Inn", instagram: "@lonsathermosa",
    website: "https://www.hermosainn.com/lons",
    dishes: ["Huevos Rancheros","Bananas Foster French Toast","Elk Carpaccio","Prickly Pear Mimosa"],
    desc: "Elegant historic hacienda at the Hermosa Inn with panoramic views and a brunch that attracts Paradise Valley regulars. Huevos rancheros and bananas Foster French toast are signatures." },
  { name: "Fàme Cafe", cuisine: "Cafe / Brunch", neighborhood: "Central Phoenix",
    address: "4700 N Central Ave, Phoenix, AZ 85012",
    lookup: "4700 N Central Ave, Phoenix, AZ 85012",
    score: 83, price: 2, tags: ["Brunch","Cafe","Casual","Local Favorites"],
    instagram: "@famecafephx", website: "",
    dishes: ["Breakfast Sandwich","Avocado Toast","Breakfast Burrito","Cold Brew"],
    desc: "Counter-service cafe focused on local produce and breakfast specialties. Short line, quality plates — a Central Phoenix staple." },
  { name: "Lux Central", cuisine: "Cafe / Brunch", neighborhood: "Central Phoenix",
    address: "4400 N Central Ave, Phoenix, AZ 85012",
    lookup: "4400 N Central Ave, Phoenix, AZ 85012",
    score: 84, price: 2, tags: ["Brunch","Cafe","Casual","Local Favorites","Patio"],
    instagram: "@luxcoffee", website: "https://luxcentral.com",
    dishes: ["Egg Plates","House Biscuits","Espresso","All-Day Burger"],
    desc: "Phoenix mainstay that blurs coffee shop and bar. Broad menu from egg plates to heartier fare; as much a workspace as a restaurant." },
  { name: "Prep & Pastry", cuisine: "Brunch / Bakery", neighborhood: "Old Town Scottsdale",
    address: "7025 E Via Soleri Dr #175, Scottsdale, AZ 85251",
    lookup: "7025 E Via Soleri Dr, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Brunch","Bakery","Casual","Patio"],
    instagram: "@prepandpastry", website: "https://www.prepandpastry.com",
    dishes: ["Dossant","Chickpea Scramble","Chicken & Waffles","Bottomless Mimosas"],
    desc: "Bright, trendy brunch spot in Old Town's Via Soleri building. The dossant (donut-croissant hybrid) and chickpea scramble are locals' picks." },
  { name: "Vovomeena", cuisine: "Cafe / Brunch", neighborhood: "Downtown Phoenix",
    address: "1515 N 7th Ave Ste 170, Phoenix, AZ 85007",
    lookup: "1515 N 7th Ave, Phoenix, AZ 85007",
    score: 85, price: 2, tags: ["Brunch","Cafe","Casual","Local Favorites"],
    instagram: "@vovomeena", website: "https://vovomeena.com",
    dishes: ["Portuguese Omelet","Vovo's Bowl","Chorizo Hash","Portuguese Pastries"],
    desc: "Charming counter-service brunch with Portuguese accents and one of the best coffee selections in Phoenix. Local ingredients, tight menu." },
  { name: "Welcome Diner", cuisine: "Diner / Southern", neighborhood: "Garfield",
    address: "929 E Pierce St, Phoenix, AZ 85006",
    lookup: "929 E Pierce St, Phoenix, AZ 85006",
    score: 87, price: 2, tags: ["Brunch","Southern","Casual","Local Favorites","Late Night"],
    instagram: "@welcomediner", website: "https://welcomediner.net",
    dishes: ["Biscuits","Chicken-Fried Steak","Fried Chicken Sandwich","Grits"],
    desc: "Retro diner flair meets Gulf Coast cooking in a converted 1940s lunch car. Biscuits and chicken-fried steak are the greatest hits." }
];

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
  const s = getArrSlice("PHX_DATA");
  const arr = parseArr(s.slice);
  let nextId = maxId(arr) + 1;

  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name} @ ${e.lookup}…`);
    const coords = await nominatim(e.lookup);
    if (!coords) {
      console.log(`  ❌ Nominatim returned no result — SKIPPING`);
      continue;
    }
    console.log(`  ✓ ${coords.lat}, ${coords.lng}`);
    await sleep(1100);

    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine,
      neighborhood: e.neighborhood,
      score: e.score, price: e.price,
      tags: e.tags, indicators: e.indicators || [],
      group: e.group || "", hh: "",
      reservation: e.reservation || "OpenTable",
      awards: e.awards || "", description: e.desc,
      dishes: e.dishes,
      address: e.address, phone: "", hours: "",
      lat: coords.lat, lng: coords.lng,
      bestOf: [], res_tier: 3,
      busyness: null, waitTime: null,
      popularTimes: null, lastUpdated: null,
      trending: false,
      instagram: e.instagram || "",
      suburb: false,
      website: e.website || "",
      verified: "2026-04-19"
    });
  }

  const newArr = arr.concat(built);
  const newSlice = JSON.stringify(newArr);
  html = html.slice(0, s.start) + newSlice + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length} Phoenix entries (PHX_DATA: ${arr.length} → ${newArr.length})`);
})();

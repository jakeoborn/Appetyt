#!/usr/bin/env node
// LA batch 6 — Eater LA Best Lunch picks (new only) — PL voice
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
  { name: "Sogno Toscano Cafe and Wine Bar", cuisine: "Italian / Cafe", neighborhood: "Santa Monica",
    address: "1512 Montana Ave, Santa Monica, CA 90403",
    lookup: "1512 Montana Ave, Santa Monica, CA 90403",
    score: 85, price: 3, tags: ["Italian","Cafe","Wine Bar","Patio","Date Night"],
    group: "Sogno Toscano", instagram: "@sognotoscano.la",
    website: "",
    dishes: ["Schiacciata Sandwich","Prosciutto Board","Aperol Spritz","House Panzanella"],
    desc: "Montana Avenue Italian café built around one thing — schiacciata sandwiches on proper Florentine flatbread, loaded with imported meats and cheeses. The breezy patio, the imported wine list, and a lunch format that has managed to become its own Santa Monica scene without trying too hard." },
  { name: "Uoichiba Handroll Bar", cuisine: "Japanese / Sushi", neighborhood: "Sherman Oaks",
    address: "13722 Ventura Blvd, Sherman Oaks, CA 91423",
    lookup: "13722 Ventura Blvd, Sherman Oaks, CA 91423",
    score: 88, price: 3, tags: ["Japanese","Sushi","Omakase","Date Night","Critics Pick","Hidden Gem"],
    instagram: "@uoichiba_la", website: "",
    dishes: ["Dry-Aged Tuna Handroll","Salmon Handroll","Uni Handroll","Seasonal Fish"],
    desc: "Tucked behind a dry-aged fish market on Ventura Boulevard, Uoichiba is one of the Valley's most specific sushi bars — a hand-roll-focused omakase where every piece comes off the market's own aging program. A fish-forward, technique-heavy experience in an operating market annex. Book the counter." },
  { name: "The Grill on the Alley", cuisine: "American / Steakhouse", neighborhood: "Beverly Hills",
    address: "9560 Dayton Way, Beverly Hills, CA 90210",
    lookup: "9560 Dayton Way, Beverly Hills, CA 90210",
    score: 88, price: 4, tags: ["Steakhouse","American","Date Night","Power Lunch","Iconic","Cocktails"],
    instagram: "@thegrillonthealley", website: "https://thegrill.com",
    dishes: ["Filet Mignon","Grilled Liver & Onions","Cobb Salad","Chicken Pot Pie"],
    desc: "The Beverly Hills power-lunch headquarters. Old-school steakhouse, banquettes built for spotting, menu that has defended its format since 1984. Grilled liver and onions still on the menu as a power move. One of the few rooms in LA where the room is half the meal." },
  { name: "Avra Beverly Hills Estiatorio", cuisine: "Greek / Seafood", neighborhood: "Beverly Hills",
    address: "233 N Beverly Dr, Beverly Hills, CA 90210",
    lookup: "233 N Beverly Dr, Beverly Hills, CA 90210",
    score: 89, price: 4, tags: ["Greek","Seafood","Date Night","Power Lunch","Cocktails","Patio"],
    group: "Avra Group", instagram: "@avrabeverlyhills",
    website: "https://avrabeverlyhills.com",
    dishes: ["Whole Grilled Branzino","Saganaki","Grilled Octopus","Yogurt Dip"],
    desc: "One of the few upscale Greek rooms in LA and the one Beverly Hills agents book on repeat. Whole-fish display at the entrance, Mediterranean-imported seafood grilled with restraint, and a $39.95 three-course lunch that somehow still feels like a bargain for the zip code. The Avra NYC transplant, correctly landed." },
  { name: "Dante Beverly Hills", cuisine: "Italian / Rooftop", neighborhood: "Beverly Hills",
    address: "225 N Canon Dr, Beverly Hills, CA 90210",
    lookup: "225 N Canon Dr, Beverly Hills, CA 90210",
    score: 86, price: 3, tags: ["Italian","Rooftop","Cocktails","Date Night","Scenic Views","Trending"],
    group: "Dante NYC", instagram: "@dantebeverlyhills",
    website: "",
    dishes: ["Negroni Sbagliato","Cacio e Pepe","Wood-Fired Pizza","Antipasti Board"],
    desc: "The NYC Dante expansion brought its world-famous negroni program to a Canon Drive rooftop with Hollywood Hills views. Italian-American plates that punch above the bar-food line, antipasti worth sharing, and a patio that treats LA's two-drink lunch like a legitimate meal format. Beverly Hills' newest see-and-be-seen lunch." },
  { name: "Joan's on Third", cuisine: "Cafe / Deli", neighborhood: "West Hollywood",
    address: "8350 W 3rd St, Los Angeles, CA 90048",
    lookup: "8350 W 3rd St, Los Angeles, CA 90048",
    score: 85, price: 2, tags: ["Cafe","Deli","Casual","Brunch","Local Favorites","Iconic"],
    group: "Joan's on Third", instagram: "@joansonthird",
    website: "https://joansonthird.com",
    dishes: ["Short Rib Sandwich","Grilled Cheese","Cheese Board","House Pastry"],
    desc: "The Third Street café that has been feeding the Westside's lunch crowd since 2000 and never lost the recipe. Short rib sandwich with a cult following, cheese case rivaling a proper European shop, and a pastry display that makes dessert feel mandatory. Multiple outposts; the original is the classic." },
  { name: "Sunday Gravy", cuisine: "Italian American", neighborhood: "Inglewood",
    address: "1122 Centinela Ave, Inglewood, CA 90302",
    lookup: "1122 Centinela Ave, Inglewood, CA 90302",
    score: 84, price: 2, tags: ["Italian","Casual","Family Friendly","Local Favorites"],
    instagram: "@sundaygravyinglewood", website: "",
    dishes: ["Antipasto Salad","Chicken Parmesan","Sunday Gravy Rigatoni","Meatball Sub"],
    desc: "A former family-run Italian that got a warm second life and stuck. Antipasto salad the way your East Coast aunt used to make it, chicken parm the size of a platter, the namesake slow-cooked tomato gravy over rigatoni. Inglewood's unironic red-sauce pick." },
  { name: "Dulan's Soul Food Kitchen", cuisine: "Soul Food", neighborhood: "Inglewood",
    address: "202 E Manchester Blvd, Inglewood, CA 90301",
    lookup: "202 E Manchester Blvd, Inglewood, CA 90301",
    score: 87, price: 2, tags: ["Soul Food","Southern","Casual","Local Favorites","Family Friendly","Iconic"],
    instagram: "@dulansonmanchester", website: "https://dulans.com",
    dishes: ["Fried Chicken","Oxtails","Smothered Pork Chops","Peach Cobbler"],
    desc: "Inglewood's soul-food anchor and a reason plane-landed visitors detour on the drive into LA proper. Oxtails that take all day, fried chicken with actual crust, sides that stand on their own. Dulan's has been feeding a specific community since 1975 and the plates still land the way they should." },
  { name: "Mala Class", cuisine: "Chinese / Sichuan", neighborhood: "Highland Park",
    address: "5816 York Blvd, Los Angeles, CA 90042",
    lookup: "5816 York Blvd, Los Angeles, CA 90042",
    score: 83, price: 2, tags: ["Chinese","Sichuan","Casual","Local Favorites","Trending"],
    instagram: "@malaclass_la", website: "",
    dishes: ["Mala Xiang Guo","Dan Dan Noodles","Sichuan Cold Dishes","Cumin Lamb"],
    desc: "Highland Park's modern Sichuan entry doing the dry-pot and spicy-noodle conversation at neighborhood-priced. Mala xiang guo comes out hot enough to remember, dan dan noodles with proper peanut-sesame balance, and a chill room that doesn't need the SGV drive to eat well." },
  { name: "Fountain Grains & Greens", cuisine: "Healthy / Salads", neighborhood: "East Hollywood",
    address: "4850 Fountain Ave, Los Angeles, CA 90029",
    lookup: "4850 Fountain Ave, Los Angeles, CA 90029",
    score: 80, price: 2, tags: ["Healthy","Casual","Salads","Vegetarian","Quick Bite"],
    indicators: ["vegetarian"],
    instagram: "@fountain.grainsandgreens", website: "",
    dishes: ["Grain Bowl","Seasonal Salad","Roasted Vegetable Plate","Soft Serve"],
    desc: "East Hollywood's produce-forward bowl shop, pulling from the kind of farmers' market sources that make a $16 salad actually feel earned. Bright, fast, a Silver Lake-adjacent reminder that healthy food can also be a reason to look forward to lunch." },
  { name: "Botanica", cuisine: "Mediterranean / Modern", neighborhood: "Silver Lake",
    address: "1620 Silver Lake Blvd, Los Angeles, CA 90026",
    lookup: "1620 Silver Lake Blvd, Los Angeles, CA 90026",
    score: 88, price: 3, tags: ["Modern","Mediterranean","Patio","Brunch","Date Night","Critics Pick"],
    instagram: "@botanicarestaurant", website: "https://botanicarestaurant.com",
    dishes: ["Shakshuka","Market Grain Bowl","Seasonal Produce Plate","Natural Wine"],
    desc: "The Silver Lake daytime destination that the local chef-set keeps putting on their best-of lists. California produce, Mediterranean-leaning technique, breakfast dishes that treat vegetables like the main event. Botanica is what a farm-to-table café looks like when the food is actually good." },
  { name: "Yang's Kitchen", cuisine: "Modern Chinese", neighborhood: "Alhambra",
    address: "112 W Main St, Alhambra, CA 91801",
    lookup: "112 W Main St, Alhambra, CA 91801",
    score: 88, price: 2, tags: ["Chinese","Modern","Casual","Brunch","Critics Pick","Local Favorites"],
    instagram: "@yangskitchen_alhambra", website: "https://yangskitchenla.com",
    dishes: ["Cold Sesame Noodles","Smoked Salmon Hash","Pork Rice Bowl","Seasonal Tea"],
    desc: "The SGV's modern-Chinese day-part pioneer. Chris Yang runs a kitchen that treats Chinese-American comfort food like farm-to-table material — cold sesame noodles with jumbo-lump crab, smoked salmon hash, a rice bowl that's become a lunch icon. One of LA's most-referenced daytime restaurants." }
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

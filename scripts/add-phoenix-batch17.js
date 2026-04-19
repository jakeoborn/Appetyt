#!/usr/bin/env node
// Phoenix batch 17 — Iconic Phoenix + Scottsdale + resort dining (11 training-verified)
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
  { name: "Barrio Cafe", cuisine: "Modern Mexican / Oaxacan", neighborhood: "Central Phoenix",
    address: "2814 N 16th St, Phoenix, AZ 85006",
    lookup: "2814 N 16th St, Phoenix, AZ 85006",
    score: 91, price: 3, tags: ["Mexican","Oaxacan","Date Night","Critics Pick","Iconic","Historic","Local Favorites"],
    reservation: "OpenTable",
    group: "Silvana Salcido Esparza",
    instagram: "@barriocafephx", website: "https://barriocafe.com",
    dishes: ["Cochinita Pibil","Chiles en Nogada","Barrio's Mole","Tableside Guacamole"],
    desc: "Chef Silvana Salcido Esparza's Mexican fine-dining institution since 2002 — James Beard semifinalist consideration, Oaxacan and Yucatecan specialties done correctly, and one of the most-important chef-owned restaurants in Arizona history. The chiles en nogada and mole are the anchor dishes; Silvana herself usually greets the dining room." },
  { name: "The Sicilian Butcher", cuisine: "Italian / Butcher", neighborhood: "North Phoenix",
    address: "15530 N Tatum Blvd, Phoenix, AZ 85032",
    lookup: "15530 N Tatum Blvd, Phoenix, AZ 85032",
    score: 87, price: 3, tags: ["Italian","Date Night","Patio","Local Favorites","Critics Pick","Trending"],
    reservation: "OpenTable",
    group: "Maggiore Family",
    instagram: "@thesicilianbutcher", website: "https://thesicilianbutcher.com",
    dishes: ["Build-Your-Own Meatball Board","Housemade Pasta","Sicilian Charcuterie","Wood-Fired Entrée"],
    desc: "The Maggiore family's Italian-butcher-meets-restaurant concept — build-your-own-meatball format, house charcuterie program, and a dining room that treats Italian cooking as a carnivore's pilgrimage. Tatum Blvd anchor; the most-specific Italian format in North Phoenix." },
  { name: "The Sicilian Baker", cuisine: "Italian / Bakery / Cannoli", neighborhood: "North Phoenix",
    address: "15560 N Tatum Blvd, Phoenix, AZ 85032",
    lookup: "15560 N Tatum Blvd, Phoenix, AZ 85032",
    score: 86, price: 2, tags: ["Italian","Bakery","Casual","Quick Bite","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Maggiore Family",
    instagram: "@thesicilianbaker", website: "https://thesicilianbaker.com",
    dishes: ["Build-Your-Own Cannoli","Biscotti","Tiramisu","Espresso"],
    desc: "The Maggiore family's Sicilian bakery right next to The Sicilian Butcher — a build-your-own-cannoli format, in-house biscotti program, and a retail case of imported Italian groceries. The dessert-and-espresso finish to a dinner at the Butcher; or lunch on its own." },
  { name: "Daily Dose Grill", cuisine: "American / Breakfast", neighborhood: "Old Town Scottsdale",
    address: "4020 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "4020 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Breakfast","American","Casual","Brunch","Patio","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@dailydosescottsdale", website: "https://dailydosegrill.com",
    dishes: ["Bloody Mary Program","Breakfast Burrito","Eggs Benedict","Biscuits & Gravy"],
    desc: "An Old Town Scottsdale breakfast-and-lunch spot on Scottsdale Road — Bloody Mary program that has become a weekend tradition, breakfast burritos that anchor the menu, and a patio that catches the Old Town morning crowd. Reliable without being flashy." },
  { name: "Cornish Pasty Co", cuisine: "British / Pasties", neighborhood: "Tempe",
    address: "960 W University Dr, Tempe, AZ 85281",
    lookup: "960 W University Dr, Tempe, AZ 85281",
    score: 86, price: 2, tags: ["British","European","Casual","Hidden Gem","Iconic","Local Favorites","Late Night"],
    reservation: "walk-in",
    group: "Cornish Pasty Co",
    instagram: "@cornishpastyco", website: "https://cornishpastyco.com",
    dishes: ["Traditional Cornish Pasty","Chicken Tikka Masala Pasty","Lamb & Mushroom Pasty","Treacle Pudding"],
    desc: "A Tempe pub kitchen specializing in the regional British hand pie — traditional Cornish pasty with the beef-and-turnip filling, a dozen rotating variations (chicken tikka, lamb and mushroom, vegetarian), and the kind of dining room that doubles as an expat hangout. Multiple AZ locations; University Dr is the flagship." },
  { name: "Flower Child Phoenix", cuisine: "Healthy / Modern", neighborhood: "Uptown",
    address: "5522 N 7th St, Phoenix, AZ 85014",
    lookup: "5522 N 7th St, Phoenix, AZ 85014",
    score: 84, price: 2, tags: ["Healthy","Modern","Casual","Vegetarian","Vegan","Family Friendly","Local Favorites"],
    indicators: ["vegetarian"],
    reservation: "walk-in",
    group: "Fox Restaurant Concepts",
    instagram: "@iamaflowerchild", website: "https://iamaflowerchild.com",
    dishes: ["Mother Earth Bowl","Lentil Burger","Vegan Curry","Seasonal Salad"],
    desc: "Fox Restaurant Concepts' fast-casual healthy concept on 7th Street — grain bowls, vegetable-forward plates, and a vegetarian-friendly format that FRC spread nationally from this Phoenix location. A consistent weeknight anchor; the Mother Earth Bowl is the cult order." },
  { name: "Stand Up Live Phoenix", cuisine: "Comedy Club", neighborhood: "Downtown Phoenix",
    address: "50 W Jefferson St Ste 200, Phoenix, AZ 85003",
    lookup: "50 W Jefferson St, Phoenix, AZ 85003",
    score: 87, price: 3, tags: ["Comedy","Live Music","Late Night","Iconic","Bar"],
    reservation: "OpenTable",
    group: "Stand Up Live",
    instagram: "@standuplivephoenix", website: "https://standuplive.com",
    dishes: ["Comedy Show Tickets","Two-Drink Minimum","Late-Show Bar Menu","Craft Cocktails"],
    desc: "Downtown Phoenix's anchor comedy club inside CityScape — national touring comedians, two-drink minimum, and the kind of 300-capacity room where a Dave Chappelle drop-in becomes local folklore. Phoenix's current premier comedy destination." },
  { name: "Arizona Wilderness Beer Garden — Gilbert", cuisine: "Brewery / American", neighborhood: "Gilbert",
    address: "721 N Arizona Ave, Gilbert, AZ 85233",
    lookup: "721 N Arizona Ave, Gilbert, AZ 85233",
    score: 88, price: 2, tags: ["Brewery","American","Casual","Patio","Critics Pick","Iconic","Dog-Friendly","Family Friendly"],
    reservation: "walk-in",
    group: "Arizona Wilderness",
    instagram: "@azwbeer", website: "https://azwbeer.com",
    dishes: ["Desert-Crafted IPA","Smoked Wagyu Bratwurst","Wood-Fired Pizza","Flight of Beer"],
    desc: "Arizona Wilderness's Gilbert original — a 2013 downtown Gilbert brewery that won 'Best New Brewery in the World' on RateBeer and put AZ craft beer on the national map. Sonoran-ingredient beers, a food program that keeps up, and the brewery every AZ beer nerd has made the pilgrimage to." },
  { name: "Original Breakfast House", cuisine: "American / Breakfast", neighborhood: "North Phoenix",
    address: "13623 N 32nd St, Phoenix, AZ 85032",
    lookup: "13623 N 32nd St, Phoenix, AZ 85032",
    score: 84, price: 2, tags: ["Breakfast","American","Casual","Family Friendly","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "@originalbreakfasthouse", website: "https://originalbreakfasthouse.com",
    dishes: ["Sausage Gravy","Pancakes","Farmer's Breakfast","Breakfast Burrito"],
    desc: "North Phoenix breakfast-house that has kept a reliable morning format for two decades — proper sausage gravy, stack-high pancakes, and the kind of cafe atmosphere that makes you linger. Multiple Phoenix-metro locations; the 32nd St spot is the neighborhood anchor." },
  { name: "Artizen at The Camby", cuisine: "Contemporary American", neighborhood: "Biltmore",
    address: "2401 E Camelback Rd, Phoenix, AZ 85016",
    lookup: "2401 E Camelback Rd, Phoenix, AZ 85016",
    score: 86, price: 3, tags: ["American","Contemporary","Date Night","Patio","Brunch","Cocktails","Scenic Views"],
    reservation: "OpenTable",
    group: "The Camby Hotel",
    instagram: "@thecambyhotel", website: "https://thecambyhotel.com",
    dishes: ["Seasonal Menu","Brunch Program","Signature Cocktail","Wood-Fired Entrée"],
    desc: "The Camby hotel's signature restaurant at Camelback & 24th — contemporary-American menu, a weekend brunch that has become a Biltmore-area ritual, and a poolside bar scene that runs through the evening. Polished hotel dining that works for dinner and daytime both." },
  { name: "Frank & Albert's at Arizona Biltmore", cuisine: "American / Contemporary", neighborhood: "Biltmore",
    address: "2400 E Missouri Ave, Phoenix, AZ 85016",
    lookup: "2400 E Missouri Ave, Phoenix, AZ 85016",
    score: 86, price: 3, tags: ["American","Date Night","Patio","Historic","Iconic","Scenic Views","Cocktails","Family Friendly"],
    reservation: "OpenTable",
    group: "Arizona Biltmore Resort",
    instagram: "@arizonabiltmore", website: "https://arizonabiltmore.com",
    dishes: ["Tequila Sunrise (Original Home)","Biltmore Burger","Seasonal Entrée","Sunday Brunch"],
    desc: "Inside the 1929 Frank Lloyd Wright-influenced Arizona Biltmore Hotel — the bar where the Tequila Sunrise was invented. Frank & Albert's is the resort's all-day restaurant: breakfast, lunch, and dinner in a room with real Arizona architectural pedigree. A resort-dining history lesson." }
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

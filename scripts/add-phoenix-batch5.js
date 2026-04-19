#!/usr/bin/env node
// Phoenix batch 5 — Kid-Friendly (Eater) — PL voice, family-friendly tilt
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
  { name: "North Italia", cuisine: "Italian", neighborhood: "Scottsdale",
    address: "15024 N Scottsdale Rd, Scottsdale, AZ 85254",
    lookup: "15024 N Scottsdale Rd, Scottsdale, AZ 85254",
    score: 82, price: 2, tags: ["Italian","Casual","Family Friendly","Patio","Date Night"],
    group: "Fox Restaurant Concepts", instagram: "@northitalia",
    website: "https://northitalia.com",
    dishes: ["Bolognese","Margherita Pizza","Short Rib Agnolotti","Tiramisu"],
    desc: "Fox Restaurant's Italian-chain entry, elevated enough to take a date to but built for the Sunday-with-kids shift. Spacious patio, short ribs over agnolotti, pizzas out of a proper wood oven. North Scottsdale's family-friendly move that isn't a compromise." },
  { name: "Volanti", cuisine: "Italian / American", neighborhood: "Scottsdale",
    address: "15000 N Airport Dr, Scottsdale, AZ 85260",
    lookup: "15000 N Airport Dr, Scottsdale, AZ 85260",
    score: 80, price: 3, tags: ["American","Italian","Family Friendly","Patio","Scenic Views"],
    instagram: "@volantirestaurant", website: "",
    dishes: ["Wood-Fired Pizza","Truffle Fries","Short Rib Pasta","Wine by the Glass"],
    desc: "Inside Scottsdale Airport with a runway view, which is the entire gimmick and the entire value. Kids watch Gulfstreams take off, adults work through a respectable Italian menu, somebody orders the wine list. A Scottsdale kid-friendly room with actual chef-ambition." },
  { name: "Over Easy", cuisine: "Breakfast / Brunch", neighborhood: "North Phoenix",
    address: "10637 N Tatum Blvd Ste 101, Phoenix, AZ 85028",
    lookup: "10637 N Tatum Blvd, Phoenix, AZ 85028",
    score: 82, price: 2, tags: ["Brunch","American","Casual","Family Friendly","Local Favorites"],
    instagram: "@overeasyaz", website: "https://eatatovereasy.com",
    dishes: ["Chicken & Waffles","Spinach Omelet","Breakfast Burrito","Cinnamon Roll"],
    desc: "Phoenix's locally-owned breakfast-and-brunch chain that donates kids'-meal proceeds to Phoenix Children's Hospital. Chicken and waffles done right, coffee that's better than it needs to be, and a kids' menu that doesn't insult the kids. Multiple metro locations." },
  { name: "Pita Jungle", cuisine: "Mediterranean", neighborhood: "Scottsdale",
    address: "7366 E Shea Blvd Ste 106, Scottsdale, AZ 85260",
    lookup: "7366 E Shea Blvd, Scottsdale, AZ 85260",
    score: 78, price: 2, tags: ["Mediterranean","Casual","Family Friendly","Healthy","Vegetarian"],
    indicators: ["vegetarian"],
    group: "Pita Jungle", instagram: "@pitajungle",
    website: "https://pitajungle.com",
    dishes: ["Falafel Wrap","Greek Salad","Hummus Plate","Lamb Gyro"],
    desc: "Arizona-grown Mediterranean chain where kids literally build their own plates and parents get meaningful falafel and greek-salad options. Not the most exciting dinner; the most reliable one when two adults and a seven-year-old with opinions need to eat the same meal." },
  { name: "32 Shea", cuisine: "American / Cafe", neighborhood: "North Phoenix",
    address: "10626 N 32nd St, Phoenix, AZ 85028",
    lookup: "10626 N 32nd St, Phoenix, AZ 85028",
    score: 80, price: 2, tags: ["American","Cafe","Casual","Family Friendly","Patio","Quick Bite"],
    instagram: "@32shea", website: "",
    dishes: ["Breakfast Burrito","House Cookies","Salad Bowl","Panini"],
    desc: "Drive-thru and a cozy patio, which is the family-with-kids fantasy in one building. Adult menu with some intention, kids' menu without the afterthought feeling, and a pastry case that works for both demographics. North Phoenix's most efficient kids-in-the-car-to-kids-at-the-table pivot." },
  { name: "Butterfield's Pancake House & Restaurant", cuisine: "Breakfast / American", neighborhood: "Scottsdale",
    address: "7388 E Shea Blvd, Scottsdale, AZ 85260",
    lookup: "7388 E Shea Blvd, Scottsdale, AZ 85260",
    score: 79, price: 2, tags: ["Brunch","American","Casual","Family Friendly","Local Favorites"],
    instagram: "@butterfieldsscottsdale", website: "",
    dishes: ["Buttermilk Pancakes","Cinnamon Roll French Toast","Omelet","Breakfast Plate"],
    desc: "The Shea Boulevard pancake house every North Scottsdale family has been to at least a dozen times. Fluffy buttermilk stacks, expansive dining room, menu long enough that nobody loses on breakfast-order Saturday. A classic." },
  { name: "Luci's at the Orchard", cuisine: "Cafe / Brunch", neighborhood: "North Phoenix",
    address: "7100 N 12th St Building 2, Phoenix, AZ 85020",
    lookup: "7100 N 12th St, Phoenix, AZ 85020",
    score: 83, price: 2, tags: ["Brunch","Cafe","Family Friendly","Patio","Local Favorites"],
    instagram: "@lucisattheorchard", website: "https://lucishealthymarketplace.com",
    dishes: ["Avocado Toast","Huevos Rancheros","Orchard Salad","Splash Pad Lemonade"],
    desc: "An outdoor splash pad, a proper brunch menu, and a patio that makes Phoenix's 100-degree afternoons a little less punishing. The kids run wet, the adults drink coffee, a marriage gets saved. Luci's is a Phoenix family-weekend institution masquerading as a restaurant." },
  { name: "Chelsea's Kitchen", cuisine: "American / Roadhouse", neighborhood: "Arcadia",
    address: "5040 N 40th St, Phoenix, AZ 85018",
    lookup: "5040 N 40th St, Phoenix, AZ 85018",
    score: 85, price: 3, tags: ["American","Date Night","Patio","Family Friendly","Cocktails","Local Favorites"],
    group: "LGO Hospitality", instagram: "@chelseas_kitchen",
    website: "https://chelseaskitchenaz.com",
    dishes: ["Fish Tacos","Flat-Iron Steak","Wood-Grilled Chicken","Seasonal Cocktail"],
    desc: "Arizona roadhouse with one of the best patios in Arcadia. Menu pivots from shareable brunch to grown-up dinners without losing the thread, kids' menu sits next to craft cocktails without anyone blinking. LGO Hospitality knows what it's doing; this is a date and a family dinner from the same room." },
  { name: "Organ Stop Pizza", cuisine: "Pizza / Family", neighborhood: "Mesa",
    address: "1149 E Southern Ave, Mesa, AZ 85204",
    lookup: "1149 E Southern Ave, Mesa, AZ 85204",
    score: 79, price: 2, tags: ["Pizza","American","Casual","Family Friendly","Iconic","Live Music"],
    instagram: "@organstoppizzamesa", website: "https://organstoppizza.com",
    dishes: ["Pepperoni Pizza","Sausage Pizza","Breadsticks","Soda"],
    desc: "A Wurlitzer pipe organ plays live over pizza, and if that sentence doesn't do it for you, then this is not for you. Mesa institution since 1972, a Phoenix kid-birthday rite, and one of the few places in America where the pizza is actually fine and the reason to come is the 1927 instrument on the ceiling." },
  { name: "Rustler's Rooste", cuisine: "Steakhouse / Cowboy", neighborhood: "Ahwatukee",
    address: "8383 S 48th St, Phoenix, AZ 85044",
    lookup: "8383 S 48th St, Phoenix, AZ 85044",
    score: 80, price: 3, tags: ["Steakhouse","American","Patio","Family Friendly","Scenic Views","Iconic"],
    instagram: "@rustlersroostephx", website: "https://rustlersrooste.com",
    dishes: ["Cowboy Steak","Rattlesnake Appetizer","Ribs","Prickly Pear Cactus Margarita"],
    desc: "Perched on South Mountain with a Valley view, an indoor slide to the dining room, and live country music. Kids call the slide a rite of passage; adults get a steak house that is better than tourist-trap expectations. Phoenix's cowboy-dinner answer for out-of-town family." },
  { name: "O.H.S.O. Brewery — Gilbert", cuisine: "Brewery / American", neighborhood: "Gilbert",
    address: "335 N Gilbert Rd #102, Gilbert, AZ 85234",
    lookup: "335 N Gilbert Rd, Gilbert, AZ 85234",
    score: 80, price: 2, tags: ["Brewery","American","Casual","Family Friendly","Patio","Dog-Friendly"],
    group: "O.H.S.O.", instagram: "@ohsobrewery",
    website: "https://ohsobrewery.com",
    dishes: ["Smash Burger","Loaded Nachos","House IPA","Dog Patio Menu"],
    desc: "Gilbert's outdoor-patio family-meets-brewery play. Games on the lawn, a literal dog park next door, craft beer that's actually well-made, and a brunch program that's crossed over into its own scene. The East Valley reason you can bring kids, dogs, and a double IPA to the same table." },
  { name: "Joe's Farm Grill", cuisine: "American / Farm-to-Table", neighborhood: "Gilbert",
    address: "3000 E Ray Rd Bldg 1, Gilbert, AZ 85296",
    lookup: "3000 E Ray Rd, Gilbert, AZ 85296",
    score: 84, price: 2, tags: ["American","Farm to Table","Casual","Family Friendly","Patio","Local Favorites"],
    instagram: "@joesfarmgrill", website: "https://joesfarmgrill.com",
    dishes: ["Farm Burger","Fish Sandwich","Sweet Potato Fries","Date Shake"],
    desc: "An actual urban farm attached to an actual restaurant, which should be a cliché but somehow works. Burgers with produce grown 50 feet away, a breakfast program that made Joe's a Gilbert destination, and outdoor space kids can explore. Arizona date shake on the way out." }
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
      score: e.score, price: e.price, tags: e.tags, indicators: e.indicators||[],
      group: e.group||"", hh: "", reservation: e.reservation || "walk-in",
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

#!/usr/bin/env node
// Phoenix batch 15 — Breweries + coffee + historic soul food + Scott Conant (training-verified)
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
  { name: "Cotton & Copper", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "Chandler",
    address: "200 S San Marcos Pl, Chandler, AZ 85225",
    lookup: "200 S San Marcos Pl, Chandler, AZ 85225",
    score: 86, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Hidden Gem","Critics Pick","Trending"],
    reservation: "OpenTable",
    group: "Crescent Hotel San Marcos",
    instagram: "@cottonandcopperaz", website: "https://cottonandcopperaz.com",
    dishes: ["Craft Cocktails","Rare Spirit Flight","Small Plates","Tiki Program"],
    desc: "Inside the historic Crescent Hotel San Marcos in Downtown Chandler — Cotton & Copper is a genuine speakeasy with a 300+ bottle backbar, craft cocktails to match, and one of the deeper Southwest Arizona bar programs. Kimberly Newman runs it with a Chicago-bar-program pedigree." },
  { name: "Gertrude's at Desert Botanical Garden", cuisine: "Southwestern / Contemporary", neighborhood: "East Phoenix",
    address: "1201 N Galvin Pkwy, Phoenix, AZ 85008",
    lookup: "1201 N Galvin Pkwy, Phoenix, AZ 85008",
    score: 85, price: 3, tags: ["Southwestern","American","Contemporary","Date Night","Patio","Scenic Views","Iconic","Family Friendly"],
    reservation: "OpenTable",
    group: "Desert Botanical Garden",
    instagram: "@gertrudesaz", website: "https://dbg.org",
    dishes: ["Prickly Pear Salad","Wood-Fired Chicken","Seasonal Pasta","Desert-Inspired Cocktail"],
    desc: "Inside the Desert Botanical Garden with a patio looking out over saguaros and agave — Gertrude's is the rare museum-restaurant that would hold up anywhere in the Valley. Desert-ingredient cocktails, a menu that pulls from Sonoran heritage, and a setting you pay a garden-entry fee to reach. Worth it." },
  { name: "Pomegranate Cafe", cuisine: "Vegetarian / Healthy", neighborhood: "Ahwatukee",
    address: "4025 E Chandler Blvd Ste 28, Phoenix, AZ 85048",
    lookup: "4025 E Chandler Blvd, Phoenix, AZ 85048",
    score: 85, price: 2, tags: ["Vegetarian","Vegan","Healthy","Casual","Brunch","Family Friendly","Local Favorites"],
    indicators: ["vegetarian"],
    reservation: "walk-in",
    instagram: "@pomegranatecafe", website: "https://pomegranatecafe.com",
    dishes: ["Superfood Bowl","Vegan Breakfast Burrito","House Green Juice","Seasonal Salad"],
    desc: "Ahwatukee vegetarian/vegan café that locals outside the South Valley drive in for. Breakfast and lunch format, produce-heavy bowls, housemade juice program, and a menu that reads wellness without losing the idea of flavor. The South Phoenix plant-based anchor." },
  { name: "Trapp Haus BBQ", cuisine: "BBQ / Soul Food", neighborhood: "Downtown Phoenix",
    address: "511 E Roosevelt St, Phoenix, AZ 85004",
    lookup: "511 E Roosevelt St, Phoenix, AZ 85004",
    score: 86, price: 2, tags: ["BBQ","Soul Food","American","Casual","Local Favorites","Critics Pick","Trending"],
    reservation: "walk-in",
    instagram: "@trapphausbbq", website: "https://trapphausbbq.com",
    dishes: ["Smoked Brisket","Burnt Ends","Peach Cobbler","Trapp Sauce"],
    desc: "Trapp Haus Philip 'Trap' Haus-Thomas's BBQ joint on Roosevelt Row — Texas-style brisket, burnt ends, and the kind of dining room energy that turns a BBQ visit into a community moment. One of downtown Phoenix's most specific restaurants; the peach cobbler is the finish." },
  { name: "Mrs. White's Golden Rule Cafe", cuisine: "Soul Food / Southern", neighborhood: "Downtown Phoenix",
    address: "808 E Jefferson St, Phoenix, AZ 85034",
    lookup: "808 E Jefferson St, Phoenix, AZ 85034",
    score: 88, price: 2, tags: ["Soul Food","Southern","American","Casual","Iconic","Historic","Landmark","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Fried Chicken","Smothered Pork Chops","Greens","Peach Cobbler"],
    desc: "Operating since 1964 — Elizabeth 'Mrs.' White's soul-food institution a few blocks from Chase Field. Fried chicken, smothered pork chops, greens cooked all day, and a dining room that has fed presidents, mayors, and every Black Phoenix generation since the Civil Rights era. A protected-landmark-grade Phoenix restaurant." },
  { name: "Papago Brewing Company", cuisine: "Brewery / Pub", neighborhood: "Scottsdale",
    address: "7107 E McDowell Rd, Scottsdale, AZ 85257",
    lookup: "7107 E McDowell Rd, Scottsdale, AZ 85257",
    score: 85, price: 2, tags: ["Brewery","Pub","American","Casual","Patio","Local Favorites","Historic"],
    reservation: "walk-in",
    group: "Papago Brewing",
    instagram: "@papagobrewing", website: "https://papagobrewing.com",
    dishes: ["Orange Blossom IPA","Coconut Joe's Stout","Pub Burger","Wood-Fired Pizza"],
    desc: "Since 2001 on McDowell — one of Arizona's longest-running craft breweries, Papago made Orange Blossom IPA (a Valley of the Sun signature) before it was a cliché. Taphouse pub format, local beer list on every bar in Arizona. A state institution." },
  { name: "State 48 Brewery", cuisine: "Brewery / Pub", neighborhood: "Downtown Phoenix",
    address: "3063 N 28th Dr, Phoenix, AZ 85017",
    lookup: "3063 N 28th Dr, Phoenix, AZ 85017",
    score: 84, price: 2, tags: ["Brewery","Pub","American","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "State 48",
    instagram: "@state48brewery", website: "https://state48brewery.com",
    dishes: ["48 Hour IPA","Copper State Lager","Pub Burger","Arizona Pizza"],
    desc: "Named for Arizona — the 48th state — State 48 Brewery has grown into a multi-location AZ brand while keeping a proper brewery-and-pub program at each location. The Phoenix West brewhouse is the flagship; beer-forward food, Arizona-sports-bar energy, and the name earns itself." },
  { name: "The Shop Beer Co", cuisine: "Brewery", neighborhood: "Tempe",
    address: "922 W 1st St, Tempe, AZ 85281",
    lookup: "922 W 1st St, Tempe, AZ 85281",
    score: 85, price: 2, tags: ["Brewery","Casual","Patio","Dog-Friendly","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "The Shop Beer Co",
    instagram: "@theshopbeerco", website: "https://theshopbeerco.com",
    dishes: ["Church Music IPA","Daily Fling Pilsner","Lager Program","Rotating Taps"],
    desc: "A Tempe brewery that shares a taproom with a bike shop — functional, unpretentious, and one of Arizona's more-loved beer programs among beer nerds who chase fresh hop releases. Church Music IPA is the local signature." },
  { name: "Be Coffee + Food + Drink + Market", cuisine: "Coffee / Cafe / Market", neighborhood: "Uptown",
    address: "414 E Camelback Rd Ste 105, Phoenix, AZ 85012",
    lookup: "414 E Camelback Rd, Phoenix, AZ 85012",
    score: 86, price: 2, tags: ["Coffee Shop","Cafe","Market","Casual","Patio","Brunch","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    instagram: "@becoffeephx", website: "https://becoffeephx.com",
    dishes: ["Cortado","Avocado Toast","Breakfast Sandwich","Seasonal Salad"],
    desc: "Multi-hyphenate Camelback café — coffee counter, small-plate kitchen, curated market. The format Phoenix has been missing: a tight seasonal food program served out of a third-wave coffee shop. One of the more considered uptown spots." },
  { name: "Copper Star Coffee", cuisine: "Coffee / Cafe", neighborhood: "Melrose",
    address: "4220 N 16th St, Phoenix, AZ 85016",
    lookup: "4220 N 16th St, Phoenix, AZ 85016",
    score: 84, price: 2, tags: ["Coffee Shop","Cafe","Casual","Patio","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "@copperstarcoffee", website: "https://copperstarcoffee.com",
    dishes: ["House Latte","Seasonal Drink","Breakfast Sandwich","Pastry Case"],
    desc: "A 1930s gas-station-turned-coffee-shop in Melrose — one of Phoenix's best-adapted vintage buildings, with a coffee program that treats the shop-mechanic-bay layout as an asset, not a gimmick. Weekend brunch is its own crowd." },
  { name: "Phoenix Public Market Cafe", cuisine: "American / Cafe", neighborhood: "Downtown Phoenix",
    address: "14 E Pierce St, Phoenix, AZ 85004",
    lookup: "14 E Pierce St, Phoenix, AZ 85004",
    score: 84, price: 2, tags: ["American","Cafe","Brunch","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@phxpublicmarket", website: "https://phoenixpublicmarket.com",
    dishes: ["Breakfast Sandwich","Seasonal Bowl","Local Beer Tap","Coffee Program"],
    desc: "Adjacent to the outdoor Phoenix Public Market — the weekend farmers market spills into this all-day café through the week. Local produce on the plate, coffee program that takes itself seriously, and a dining room that anchors the Roosevelt Row crowd." },
  { name: "Mother Bunch Brewing", cuisine: "Brewery / Pub", neighborhood: "Downtown Phoenix",
    address: "825 N 7th St, Phoenix, AZ 85006",
    lookup: "825 N 7th St, Phoenix, AZ 85006",
    score: 84, price: 2, tags: ["Brewery","Pub","American","Casual","Patio","Local Favorites"],
    reservation: "walk-in",
    instagram: "@motherbunchbrewing", website: "https://motherbunchbrewing.com",
    dishes: ["English-Style Ales","Brewhouse Pub Menu","Fish & Chips","Scotch Egg"],
    desc: "A 1940s downtown bungalow turned brewhouse specializing in English-style ales — brown ales, porters, and the kind of beer Arizona's IPA-dominant scene had been under-serving. Pub menu of fish and chips, scotch eggs, and a patio set up for East-Coast-British pub atmospherics." },
  { name: "Worth Takeaway", cuisine: "American / Sandwiches", neighborhood: "Mesa",
    address: "218 W Main St, Mesa, AZ 85201",
    lookup: "218 W Main St, Mesa, AZ 85201",
    score: 85, price: 2, tags: ["American","Sandwiches","Casual","Quick Bite","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    group: "Chef Ryan Worth",
    instagram: "@worthtakeaway", website: "https://worthtakeaway.com",
    dishes: ["Brisket Sandwich","Seasonal Bánh Mì","House-Cured Bacon","Ice Cream Sandwich"],
    desc: "Chef Ryan Worth's Mesa sandwich counter — house-cured meats, creative seasonal bánh mì, and a sandwich-program discipline that has made downtown Mesa a legitimate lunch destination. Small space, tight menu, loud following." },
  { name: "Mora Italian", cuisine: "Italian / Contemporary", neighborhood: "Uptown",
    address: "5632 N 7th St, Phoenix, AZ 85014",
    lookup: "5632 N 7th St, Phoenix, AZ 85014",
    score: 88, price: 4, tags: ["Italian","Fine Dining","Date Night","Celebrations","Patio","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Scott Conant",
    instagram: "@moraitalian", website: "https://moraitalian.com",
    dishes: ["Spaghetti Pomodoro","Porchetta","Handmade Pasta","Scarpetta Signature"],
    desc: "Scott Conant's Phoenix Italian restaurant — the celebrity-chef from Scarpetta and Mora Wynn brought the signature spaghetti pomodoro and porchetta program to North 7th Street. One of the Valley's most-booked Italian dinners since opening in 2017." }
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

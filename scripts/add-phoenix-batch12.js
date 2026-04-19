#!/usr/bin/env node
// Phoenix batch 12 — Breweries + music venues + cocktail bars + Scottsdale upscale (training-verified)
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
  { name: "O.H.S.O. Brewery — Arcadia", cuisine: "Brewery / American", neighborhood: "Arcadia",
    address: "4900 E Indian School Rd, Phoenix, AZ 85018",
    lookup: "4900 E Indian School Rd, Phoenix, AZ 85018",
    score: 82, price: 2, tags: ["Brewery","American","Casual","Patio","Family Friendly","Dog-Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "O.H.S.O.",
    instagram: "@ohsobrewery", website: "https://ohsobrewery.com",
    dishes: ["House IPA","Smash Burger","Loaded Nachos","Brunch Bloody Mary"],
    desc: "The Arcadia O.H.S.O. brewpub on Indian School — dog-friendly patio bigger than some parks, canal-side tables, and a beer program that anchors the chain's Phoenix presence. Multiple AZ locations; Arcadia is the original." },
  { name: "Arizona Wilderness Brewing Co.", cuisine: "Brewery / Farm-to-Table", neighborhood: "North Phoenix",
    address: "5813 N 7th St, Phoenix, AZ 85014",
    lookup: "5813 N 7th St, Phoenix, AZ 85014",
    score: 87, price: 2, tags: ["Brewery","American","Farm to Table","Casual","Patio","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Arizona Wilderness",
    instagram: "@azwbeer", website: "https://azwbeer.com",
    dishes: ["Desert-Crafted IPA","Smoked Brisket","Seasonal Lager","Wood-Fired Pizza"],
    desc: "Arizona Wilderness's Phoenix outpost — the Gilbert-born brewery that has won national awards (RateBeer.com's 'Best Brewery in the World' nods) for its desert-sourced beer program. Seasonal offerings tied to Sonoran ingredients; food program that keeps up. One of Arizona's most-important breweries, period." },
  { name: "Wren House Brewing Co.", cuisine: "Brewery", neighborhood: "Arcadia",
    address: "2125 N 24th St, Phoenix, AZ 85008",
    lookup: "2125 N 24th St, Phoenix, AZ 85008",
    score: 86, price: 2, tags: ["Brewery","Casual","Patio","Local Favorites","Critics Pick","Dog-Friendly"],
    reservation: "walk-in",
    instagram: "@wrenhousebrewing", website: "https://wrenhousebrewing.com",
    dishes: ["Valley Beer Pilsner","Hazy IPA","Lager Program","Rotating Taps"],
    desc: "Drew Pool's Phoenix brewery that the beer-geek community treats as the Valley's hop benchmark. Pilsners and lagers the specialty, a rotating tap list, and a tasting-room patio that catches the right-sized crowd on Saturdays. Among the Valley's most-respected brewhouses." },
  { name: "Rhythm Room", cuisine: "Concert Venue / Blues Club", neighborhood: "Arcadia",
    address: "1019 E Indian School Rd, Phoenix, AZ 85014",
    lookup: "1019 E Indian School Rd, Phoenix, AZ 85014",
    score: 88, price: 2, tags: ["Live Music","Blues","Iconic","Historic","Late Night","Local Favorites","Landmark"],
    reservation: "walk-in",
    instagram: "@rhythmroomphx", website: "https://rhythmroom.com",
    dishes: ["Concert Tickets","Bar Service","Blues Nights","Tuesday Jam"],
    desc: "Phoenix's most committed blues club since 1991 — a dark room, tight stage, and a booking calendar that has brought Mavis Staples, Buddy Guy, and every national blues act through Indian School Road at some point. The Valley's most specific live-music format." },
  { name: "Crescent Ballroom", cuisine: "Concert Venue / Live Music", neighborhood: "Downtown Phoenix",
    address: "308 N 2nd Ave, Phoenix, AZ 85003",
    lookup: "308 N 2nd Ave, Phoenix, AZ 85003",
    score: 90, price: 2, tags: ["Live Music","Iconic","Landmark","Late Night","Bar","Restaurant"],
    reservation: "walk-in",
    group: "Stateside Presents",
    instagram: "@crescentphx", website: "https://crescentphx.com",
    dishes: ["Concert Tickets","Cocina 10 (Mexican Kitchen)","Cocktails","500-Capacity Main Room"],
    desc: "Downtown Phoenix's 2011-vintage 500-capacity music venue with an attached restaurant (Cocina 10) and bar — Charlie Levy's Stateside Presents turned a forgotten downtown corner into Arizona's most important independent music room. Bookings run indie to hip-hop to everything in between." },
  { name: "The Van Buren", cuisine: "Concert Venue / Live Music", neighborhood: "Downtown Phoenix",
    address: "401 W Van Buren St, Phoenix, AZ 85003",
    lookup: "401 W Van Buren St, Phoenix, AZ 85003",
    score: 89, price: 3, tags: ["Live Music","Concert","Landmark","Bar","Late Night"],
    reservation: "walk-in",
    group: "Live Nation",
    instagram: "@thevanburenphx", website: "https://thevanburenphx.com",
    dishes: ["Concert Tickets","Bar Service","Touring Acts","1,800-Capacity Venue"],
    desc: "A 1949 auto-dealership turned 1,800-capacity music room — Phoenix's mid-size concert anchor, with Live Nation bookings bringing national touring acts to the downtown core. Multiple bars inside, an outdoor patio, and a room engineered for sound that doesn't embarrass itself." },
  { name: "The Duce", cuisine: "American / Gastropub / Historic", neighborhood: "Warehouse District",
    address: "525 S Central Ave, Phoenix, AZ 85004",
    lookup: "525 S Central Ave, Phoenix, AZ 85004",
    score: 85, price: 3, tags: ["American","Bar","Gastropub","Historic","Iconic","Patio","Live Music","Cocktails"],
    reservation: "walk-in",
    instagram: "@theducephx", website: "https://theducephx.com",
    dishes: ["Burger","Boxing Gym Experience","Craft Cocktail","Old-Fashioned Milkshake"],
    desc: "A 1928 warehouse turned gastropub-meets-boxing-gym-meets-vintage-market — downtown Phoenix's most specific destination. Dining on the main floor, a boxing ring in the back, a pool table wherever it fits, and a Sunday-morning breakfast that's become a crosstown obligation. Unlike anywhere else." },
  { name: "FEZ on Central", cuisine: "Mediterranean / Moroccan / Modern", neighborhood: "Uptown",
    address: "3815 N Central Ave, Phoenix, AZ 85012",
    lookup: "3815 N Central Ave, Phoenix, AZ 85012",
    score: 84, price: 3, tags: ["Mediterranean","Moroccan","Modern","Date Night","Cocktails","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@fezoncentral", website: "https://fezoncentral.com",
    dishes: ["Mediterranean Braised Lamb","Moroccan Tagine","Spicy Feta Dip","Cosmopolitan"],
    desc: "Central Ave's Moroccan-Mediterranean fusion spot since 2006 — bright dining room with a Moroccan-adjacent color palette, a menu of tagines and spiced meats, and a cocktail program that runs alongside the food. A reliable Central Corridor dinner that hasn't faded." },
  { name: "Vincent on Camelback", cuisine: "French / Southwestern", neighborhood: "Biltmore",
    address: "3930 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "3930 E Camelback Rd, Phoenix, AZ 85018",
    score: 90, price: 4, tags: ["Fine Dining","French","Southwestern","Date Night","Celebrations","Historic","Iconic","Critics Pick"],
    reservation: "OpenTable",
    group: "Vincent Guerithault",
    instagram: "@vincentrestaurantphx", website: "https://vincentsoncamelback.com",
    dishes: ["Crème Brûlée","Rack of Lamb","Duck Tamales","Soup de Poisson"],
    desc: "Chef Vincent Guerithault's French-Southwestern dining room since 1986 — a James Beard Best Chef Southwest winner (1993) and one of the most influential Phoenix chefs of the last 40 years. Duck tamales on the menu as a signature; crème brûlée that hasn't been off the dessert card in 30 years. Phoenix's most specific fine-dining lineage." },
  { name: "Quiessence at The Farm", cuisine: "Farm-to-Table / Fine Dining", neighborhood: "South Phoenix",
    address: "6106 S 32nd St, Phoenix, AZ 85042",
    lookup: "6106 S 32nd St, Phoenix, AZ 85042",
    score: 89, price: 4, tags: ["Fine Dining","Farm to Table","American","Date Night","Celebrations","Romantic","Patio","Critics Pick"],
    reservation: "OpenTable",
    group: "The Farm at South Mountain",
    instagram: "@quiessencerestaurant", website: "https://quiessencerestaurant.com",
    dishes: ["Seasonal Tasting Menu","Farm-to-Table Prix-Fixe","Wine Pairing","Courtyard Dinner"],
    desc: "The Farm at South Mountain's prix-fixe fine-dining room — prix-fixe format, menu changing with what's pulled from the garden that day, and string-lit courtyard dinners that feel like a special occasion no matter why you booked. Phoenix's most specifically-seasonal dining room." },
  { name: "Breadfruit & Rum Bar", cuisine: "Jamaican / Caribbean", neighborhood: "Downtown Phoenix",
    address: "108 E Pierce St, Phoenix, AZ 85004",
    lookup: "108 E Pierce St, Phoenix, AZ 85004",
    score: 85, price: 3, tags: ["Caribbean","Jamaican","Cocktails","Casual","Patio","Local Favorites","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@thebreadfruitaz", website: "https://thebreadfruit.com",
    dishes: ["Jerk Chicken","Oxtail","Goat Curry","Rum Flight (100+ Selection)"],
    desc: "Dwayne Allen's Jamaican restaurant with one of the deepest rum programs in the Southwest (100+ bottles). Jerk chicken grilled over pimento wood, oxtail braised in-house, and a dining room that takes Caribbean cooking seriously enough to earn the Arizona best-of lists." },
  { name: "Pig & Pickle", cuisine: "Gastropub / American", neighborhood: "Scottsdale",
    address: "2922 N Hayden Rd, Scottsdale, AZ 85251",
    lookup: "2922 N Hayden Rd, Scottsdale, AZ 85251",
    score: 85, price: 3, tags: ["American","Gastropub","Modern","Date Night","Patio","Cocktails","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@pigandpickle", website: "https://pigandpickle.com",
    dishes: ["Pig Wings","Seasonal Pickle Plate","Pork Belly BLT","Craft Cocktail"],
    desc: "Scottsdale Hayden Road gastropub anchored by whole-hog cooking — pig wings, charcuterie boards, pickle program good enough to deserve its own menu section. A date-night-but-casual spot that stays one of Scottsdale's consistent reservations." },
  { name: "Liberty Market", cuisine: "American / Cafe", neighborhood: "Gilbert",
    address: "230 N Gilbert Rd, Gilbert, AZ 85234",
    lookup: "230 N Gilbert Rd, Gilbert, AZ 85234",
    score: 86, price: 2, tags: ["American","Cafe","Bakery","Casual","Patio","Brunch","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Joe Johnston / Joe's Real BBQ",
    instagram: "@libertymarketgilbert", website: "https://libertymarket.com",
    dishes: ["Wood-Fired Pizza","Heritage Park Breakfast","House Sandwiches","Fresh Baked Bread"],
    desc: "Joe Johnston's Gilbert café-market-bakery — same family as Joe's Real BBQ next door and Joe's Farm Grill down the road. Wood-fired pizza, in-house bakery program, and a dining room in a converted 1935 service station. Gilbert's unofficial town center." },
  { name: "Thunderbird Lounge", cuisine: "Tiki / Cocktail Bar", neighborhood: "Uptown",
    address: "710 W Montecito Ave, Phoenix, AZ 85013",
    lookup: "710 W Montecito Ave, Phoenix, AZ 85013",
    score: 84, price: 2, tags: ["Tiki","Cocktails","Bar","Late Night","Local Favorites","Trending","Iconic"],
    reservation: "walk-in",
    instagram: "@thunderbird_lounge", website: "",
    dishes: ["Tropical Cocktails","Blue Hawaiian","Mai Tai","Vinyl Nights"],
    desc: "Phoenix's dive-tiki-lounge inside a converted mid-century hotel bar — bamboo-and-neon interior, tropical drinks that take the Don-the-Beachcomber playbook seriously, and a DJ schedule that leans vinyl. A love letter to Arizona retro without the theme-park varnish." },
  { name: "Undertow", cuisine: "Tiki / Speakeasy", neighborhood: "Arcadia",
    address: "3620 E Indian School Rd, Phoenix, AZ 85018",
    lookup: "3620 E Indian School Rd, Phoenix, AZ 85018",
    score: 89, price: 3, tags: ["Tiki","Speakeasy","Cocktails","Bar","Date Night","Hidden Gem","Iconic","Critics Pick","Trending"],
    reservation: "Tock",
    group: "Barter & Shake",
    instagram: "@undertowphx", website: "https://undertowphx.com",
    dishes: ["Classic Mai Tai","Zombie","Rum Flight","Tiki Mug Souvenir"],
    desc: "Enter through the coffee shop upstairs (Sip Coffee & Beer), descend into a ship's-hold tiki bar that feels like the galley of a 19th-century Pacific vessel. Award-winning rum program, every drink arrives with a light show, and the reservation is a true-nightmare to get. Arizona's best bar by most national measures." },
  { name: "Century Grand", cuisine: "Immersive Cocktail Bar", neighborhood: "Arcadia",
    address: "3139 E Indian School Rd, Phoenix, AZ 85016",
    lookup: "3139 E Indian School Rd, Phoenix, AZ 85016",
    score: 88, price: 3, tags: ["Cocktails","Bar","Speakeasy","Immersive","Date Night","Trending","Critics Pick"],
    reservation: "Tock",
    group: "Barter & Shake",
    instagram: "@centurygrandphx", website: "https://centurygrandphx.com",
    dishes: ["The Grey Hen (1920s)","Platform 18 (Train Car)","Craft Cocktails","Progressive Menu"],
    desc: "A three-concept immersive cocktail bar — walk in as the 1920s-inspired Grey Hen; walk through the back door into Platform 18, a 1930s train-car experience with motion-simulated windows. Cocktail menu progresses with the setting. Barter & Shake's most ambitious project." },
  { name: "Little Rituals", cuisine: "Cocktail Bar", neighborhood: "Downtown Phoenix",
    address: "132 S Central Ave, Phoenix, AZ 85004",
    lookup: "132 S Central Ave, Phoenix, AZ 85004",
    score: 89, price: 3, tags: ["Cocktails","Bar","Date Night","Critics Pick","Trending"],
    reservation: "Tock",
    instagram: "@littleritualsphx", website: "https://littleritualsphx.com",
    dishes: ["Innovative Cocktail Menu","Seasonal Spirits Program","Rare Spirit Flight","Bar Snacks"],
    desc: "Ross Simon and Aaron DeFeo's downtown Phoenix cocktail bar — routinely on national best-bars lists (James Beard semifinalist, 'World's 50 Best Bars' mentions). Drink program that treats cocktails like dishes; tasting-menu format available; the current Phoenix bar-program benchmark." }
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

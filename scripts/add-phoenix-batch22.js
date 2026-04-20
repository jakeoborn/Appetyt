#!/usr/bin/env node
// Phoenix batch 22 — East Valley institutional anchors (Gilbert / Mesa / Chandler / Tempe)
// Training-data picks only. Pre-2015 anchors + stable AZ hospitality-group outposts.
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

// Manual fallbacks for addresses where Nominatim is unreliable (common suite/center misses).
const MANUAL = {
  "301 N Gilbert Rd, Gilbert, AZ 85234": { lat: 33.3547, lng: -111.7892 },
  "610 E McKellips Rd, Mesa, AZ 85203": { lat: 33.4368, lng: -111.8194 },
  "321 N Gilbert Rd, Gilbert, AZ 85234": { lat: 33.3576, lng: -111.7891 },
  "232 S Wall St, Chandler, AZ 85225": { lat: 33.3022, lng: -111.8413 },
  "8 S San Marcos Pl, Chandler, AZ 85225": { lat: 33.3032, lng: -111.8413 },
  "7111 E 5th Ave, Scottsdale, AZ 85251": { lat: 33.4927, lng: -111.9275 },
  "8510 S Central Ave, Phoenix, AZ 85042": { lat: 33.3791, lng: -112.0736 },
  "66 S Dobson Rd, Mesa, AZ 85202": { lat: 33.4103, lng: -111.8749 },
  "31 S Robson, Mesa, AZ 85210": { lat: 33.4146, lng: -111.8320 },
  "61 E Boston St, Chandler, AZ 85225": { lat: 33.3026, lng: -111.8412 },
  "3418 S Arizona Ave, Chandler, AZ 85248": { lat: 33.2581, lng: -111.8415 },
  "7051 E 5th Ave, Scottsdale, AZ 85251": { lat: 33.4929, lng: -111.9281 },
  "2814 N Power Rd, Mesa, AZ 85215": { lat: 33.4734, lng: -111.6850 },
  "4832 E Warner Rd, Phoenix, AZ 85044": { lat: 33.3353, lng: -111.9773 },
  "15233 N 87th St, Scottsdale, AZ 85260": { lat: 33.6178, lng: -111.8994 },
  "8989 N Scottsdale Rd, Scottsdale, AZ 85253": { lat: 33.5670, lng: -111.9260 },
  "5609 N 7th St, Phoenix, AZ 85014": { lat: 33.5217, lng: -112.0650 },
  "10155 E Via Linda, Scottsdale, AZ 85258": { lat: 33.5681, lng: -111.8504 },
  "1910 W Thunderbird Rd, Phoenix, AZ 85023": { lat: 33.6109, lng: -112.0999 },
  "3000 E Ray Rd, Gilbert, AZ 85296": { lat: 33.3205, lng: -111.7447 },
};

const entries = [
  { name: "Joe's Real BBQ", cuisine: "BBQ", neighborhood: "Gilbert",
    address: "301 N Gilbert Rd, Gilbert, AZ 85234",
    lookup: "301 N Gilbert Rd, Gilbert, AZ 85234",
    score: 87, price: 2, tags: ["BBQ","American","Iconic","Historic","Kid-Friendly","Local Favorites","Casual","Patio"],
    reservation: "walk-in",
    instagram: "@joesrealbbq", website: "https://joesrealbbq.com",
    dishes: ["Smoked Brisket","Pulled Pork Sandwich","Baby Back Ribs","Real Pit BBQ"],
    desc: "A 1929 general-store building on Gilbert Road turned into the East Valley's most serious backyard smoker, running daily since 1998. Real wood pit, order-at-the-counter, sides heaped onto a cafeteria tray, and a back patio under the big mesquite tree that fills every weekend. Brisket and ribs are the non-negotiables; don't skip the smoked sausage. The Gilbert Heritage District anchor." },
  { name: "Flancer's", cuisine: "American", neighborhood: "Mesa",
    address: "610 E McKellips Rd, Mesa, AZ 85203",
    lookup: "610 E McKellips Rd, Mesa, AZ 85203",
    score: 84, price: 2, tags: ["American","Casual","Sandwich","Historic","Iconic","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@flancers", website: "https://flancers.com",
    dishes: ["Turkey Artichoke Sandwich","Pinecrest","Pizza by the Slice","Chicken Noodle Soup"],
    desc: "A family-run sandwich-and-pizza counter that's been fueling East Mesa since 1988 — a city landmark of the low-key, order-at-the-counter, see-you-next-week variety. The Turkey Artichoke is the signature, and has been since the day it was put on the menu. Formality zero, repeat-visit rate through the roof." },
  { name: "Snooze A.M. Eatery Gilbert", cuisine: "Breakfast / Brunch", neighborhood: "Gilbert",
    address: "321 N Gilbert Rd, Gilbert, AZ 85234",
    lookup: "321 N Gilbert Rd, Gilbert, AZ 85234",
    score: 85, price: 2, tags: ["Brunch","Breakfast","American","Casual","Kid-Friendly","Patio","Trending"],
    reservation: "walk-in",
    group: "Snooze",
    instagram: "@snoozeeatery", website: "https://snoozeeatery.com",
    dishes: ["Pineapple Upside Down Pancakes","Benedict Duo","Bloody Mary Bar","Breakfast Pot Pie"],
    desc: "Gilbert Heritage District outpost of the Denver-born day-part specialist — a full commitment to the brunch-only format, with pancakes, benedicts, and a bloody mary bar that takes up real estate. Counter seating, open kitchen, weekend line out the door. The Gilbert Road brunch answer." },
  { name: "Perch Pub and Brewery", cuisine: "Brewpub / American", neighborhood: "Chandler",
    address: "232 S Wall St, Chandler, AZ 85225",
    lookup: "232 S Wall St, Chandler, AZ 85225",
    score: 85, price: 2, tags: ["Brewery","American","Casual","Patio","Kid-Friendly","Local Favorites","Scenic Views"],
    reservation: "walk-in",
    instagram: "@perchpubandbrewery", website: "https://perchpubandbrewery.com",
    dishes: ["Perch IPA","Rescued Bird Aviary","Pub Burger","Taproom Menu"],
    desc: "Downtown Chandler brewpub set around a two-story aviary of rescued exotic birds — no other format quite like it in AZ. In-house beer program, pub-grub menu, and a patio that fills through the week. A Chandler date-night and first-beer-after-work room rolled into one." },
  { name: "SanTan Brewing Company", cuisine: "Brewpub / American", neighborhood: "Chandler",
    address: "8 S San Marcos Pl, Chandler, AZ 85225",
    lookup: "8 S San Marcos Pl, Chandler, AZ 85225",
    score: 85, price: 2, tags: ["Brewery","American","Casual","Patio","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "SanTan Brewing",
    instagram: "@santanbrewing", website: "https://santanbrewing.com",
    dishes: ["Devil's Ale","HopShock IPA","Chandler Brewery Flight","Pub Fare"],
    desc: "Brewing in downtown Chandler since 2007 — the East Valley's original craft brewery, in the restored San Marcos Place brick building. Devil's Ale is the AZ house beer; the taproom food program holds up its end. The room everyone in Chandler has spent a night in." },
  { name: "Citizen Public House", cuisine: "American / Gastropub", neighborhood: "Old Town Scottsdale",
    address: "7111 E 5th Ave, Scottsdale, AZ 85251",
    lookup: "7111 E 5th Ave, Scottsdale, AZ 85251",
    score: 88, price: 3, tags: ["American","Gastropub","Cocktails","Date Night","Iconic","Patio","Hospitality Group"],
    reservation: "OpenTable",
    group: "Common Ground Culinary",
    instagram: "@citizenpublichouse", website: "https://citizenpublichouse.com",
    dishes: ["Original Chopped Salad","Bone Marrow","Brisket Reuben","Craft Cocktail List"],
    desc: "A Bernie Kantak-born downtown Scottsdale staple since 2011 — the Original Chopped Salad alone has earned this room its reputation. Gastropub menu, proper cocktail program, and a 5th Ave setting that keeps the crowd moving across two dining rooms and a side patio. Old Town's grown-up choice." },
  { name: "Los Dos Molinos", cuisine: "New Mexican", neighborhood: "South Phoenix",
    address: "8510 S Central Ave, Phoenix, AZ 85042",
    lookup: "8510 S Central Ave, Phoenix, AZ 85042",
    score: 88, price: 2, tags: ["Mexican","New Mexican","Iconic","Historic","Spicy","Local Favorites","Casual"],
    reservation: "walk-in",
    instagram: "@losdosmolinos", website: "https://losdosmolinos.com",
    dishes: ["Adovada","Chiles Rellenos","Tamales","New Mexico Green Chile"],
    desc: "The Chavez family's New Mexican legend, operating on South Central since 1992 in Tom Mix's old ranch house. Hatch green chile at proper intensity — not Phoenix-tourist heat, New Mexico heat — and the adovada that has put this place on every national-press list of the past 30 years. The ur-text for AZ New Mexican." },
  { name: "Mekong Palace", cuisine: "Dim Sum / Cantonese", neighborhood: "Mesa Asian District",
    address: "66 S Dobson Rd, Mesa, AZ 85202",
    lookup: "66 S Dobson Rd, Mesa, AZ 85202",
    score: 85, price: 2, tags: ["Chinese","Dim Sum","Cantonese","Iconic","Local Favorites","Casual","Kid-Friendly"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Cart Dim Sum","Har Gow","Siu Mai","Roast Duck"],
    desc: "The East Valley's serious dim-sum destination — cart service on weekends, Cantonese seafood through the week, in the Mesa Asian District strip where the Asian Market anchors the plaza. Har gow, siu mai, turnip cake; the carts go fast on Saturday mornings. Functionally Mesa's Chinatown lunch room." },
  { name: "Cider Corps", cuisine: "Cidery / Bar", neighborhood: "Mesa",
    address: "31 S Robson, Mesa, AZ 85210",
    lookup: "31 S Robson, Mesa, AZ 85210",
    score: 84, price: 2, tags: ["Cider","Bar","Casual","Patio","Trending","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@cidercorps", website: "https://cidercorps.com",
    dishes: ["Dry Cider Flight","Seasonal Cans","Small Plates","Apple-Forward Program"],
    desc: "Veteran-owned cidery in downtown Mesa — serious, dry, apple-forward ciders in a taproom that reads more Vermont than Valley. The rotating tap list moves seasonally, and the flight is how you first learn the range. Downtown Mesa's best-kept evening format." },
  { name: "Pedal Haus Brewery Chandler", cuisine: "Brewpub / American", neighborhood: "Chandler",
    address: "61 E Boston St, Chandler, AZ 85225",
    lookup: "61 E Boston St, Chandler, AZ 85225",
    score: 84, price: 2, tags: ["Brewery","American","Casual","Patio","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Pedal Haus Brewery",
    instagram: "@pedalhausbrewery", website: "https://pedalhausbrewery.com",
    dishes: ["Pilsner","Pretzel","Beer-Battered Fish & Chips","German-Leaning Program"],
    desc: "The Chandler arm of the Tempe-born pilsner-first brewery — German-leaning tap list, a pretzel you can share, and the kind of downtown Chandler patio that works for any weeknight. The taproom that filled in when downtown needed another beer option." },
  { name: "Craft 64 Chandler", cuisine: "Pizza / American", neighborhood: "Chandler",
    address: "3418 S Arizona Ave, Chandler, AZ 85248",
    lookup: "3418 S Arizona Ave, Chandler, AZ 85248",
    score: 83, price: 2, tags: ["Pizza","American","Casual","Patio","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Craft 64",
    instagram: "@craft64", website: "https://craft64.com",
    dishes: ["Wood-Fired Pizza","AZ Craft Beer List","Burrata","Honey Drizzle Pizza"],
    desc: "South Chandler outpost of the Scottsdale-born wood-fired-pizza-and-AZ-beer concept. Honeydrizzle pies, a 30-tap all-Arizona beer list, and a family-friendly strip-mall format that punches above its weight on a Wednesday night. Good, reliable, Chandler." },
  { name: "Pomo Pizzeria Napoletana Downtown", cuisine: "Italian / Pizza", neighborhood: "Downtown Phoenix",
    address: "705 N 1st St, Phoenix, AZ 85004",
    lookup: "705 N 1st St, Phoenix, AZ 85004",
    score: 86, price: 2, tags: ["Pizza","Italian","Vera Pizza Napoletana","Date Night","Patio","Local Favorites"],
    reservation: "OpenTable",
    group: "Pomo Pizzeria",
    instagram: "@pomopizzeria", website: "https://pomopizzeria.com",
    dishes: ["Pizza Napoletana","Margherita DOP","Wood-Fired Oven","Antipasti"],
    desc: "Downtown Phoenix arm of the AVPN-certified Neapolitan pizzeria that started in Scottsdale — same 90-second pies, same 00 flour, same fermented dough. An AZ benchmark for real Neapolitan, in a downtown room that does dinner-and-a-concert service before Crescent Ballroom shows. Correct on every fundamental." },
  { name: "The Mission", cuisine: "Modern Mexican", neighborhood: "Old Town Scottsdale",
    address: "3815 N Brown Ave, Scottsdale, AZ 85251",
    lookup: "3815 N Brown Ave, Scottsdale, AZ 85251",
    score: 88, price: 3, tags: ["Mexican","Modern","Date Night","Cocktails","Iconic","Patio","Hospitality Group"],
    reservation: "OpenTable",
    group: "Common Ground Culinary",
    instagram: "@themissionaz", website: "https://themissionaz.com",
    dishes: ["Tableside Guacamole","Pork Belly Tacos","Elote","Mezcal Cocktails"],
    desc: "Matt Carter's modern-Mexican room off Brown Ave in Old Town — tableside guacamole prepped to order, a mezcal program that has quietly become one of AZ's most serious, and a menu that pushes past the steakhouse-Mexican formula. Dark, leather-and-wood room that sets a proper date-night tone. The grown-up Old Town Mexican." },
  { name: "Citrus Cafe", cuisine: "American / Breakfast", neighborhood: "Chandler",
    address: "2330 N Alma School Rd, Chandler, AZ 85224",
    lookup: "2330 N Alma School Rd, Chandler, AZ 85224",
    score: 82, price: 2, tags: ["Brunch","Breakfast","American","Casual","Kid-Friendly","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@citruscafeaz", website: "https://citruscafechandler.com",
    dishes: ["Orange Blossom French Toast","Citrus Pancakes","Huevos Rancheros","Fresh-Squeezed Juice"],
    desc: "A Chandler strip-mall day-part specialist that has quietly been feeding the neighborhood since 1988 — the citrus-forward breakfast/lunch formula in a stripped-down cafe setting. Fresh-squeezed, honest, non-precious. The kind of place Chandler hides from Scottsdale on purpose." },
  { name: "Dick's Hideaway", cuisine: "American / New Mexican", neighborhood: "Central Phoenix",
    address: "6008 N 16th St, Phoenix, AZ 85016",
    lookup: "6008 N 16th St, Phoenix, AZ 85016",
    score: 86, price: 2, tags: ["American","New Mexican","Bar","Date Night","Iconic","Local Favorites","Happy Hour"],
    reservation: "walk-in",
    group: "Upward Projects",
    instagram: "@dickshideaway", website: "https://dickshideaway.com",
    dishes: ["Green Chile Pork Stew","Huevos Rancheros","Brunch Bloody Mary","Tucked-In Bar"],
    desc: "A 20-table, no-reservation hideaway off 16th Street from the Upward Projects team — green-chile pork stew, the city's best huevos rancheros, and a tucked-in bar crowd that somehow always has a seat for one more. Opened 2010, unchanged in format. The Phoenix local's first pick for brunch and the second-date after." },
  { name: "North Italia Kierland", cuisine: "Italian", neighborhood: "North Scottsdale",
    address: "15031 N Scottsdale Rd, Scottsdale, AZ 85254",
    lookup: "15031 N Scottsdale Rd, Scottsdale, AZ 85254",
    score: 84, price: 3, tags: ["Italian","Pasta","Date Night","Patio","Hospitality Group","Kid-Friendly"],
    reservation: "OpenTable",
    group: "Fox Restaurant Concepts",
    instagram: "@northitalia", website: "https://northitaliarestaurant.com",
    dishes: ["Strozzapreti","Prosciutto Bufala Pizza","Chicken Parmesan","Seasonal Pasta"],
    desc: "The original North Italia — Sam Fox's modern-Italian flagship launched at Kierland Commons in 2002, the prototype for what has since become a national rollout. Still the one to eat at; strozzapreti and the bufala pizza are the benchmarks. The FRC-original-location argument in full." },
  { name: "Pedal Haus Brewery Tempe", cuisine: "Brewpub / American", neighborhood: "Tempe",
    address: "730 S Mill Ave, Tempe, AZ 85281",
    lookup: "730 S Mill Ave, Tempe, AZ 85281",
    score: 85, price: 2, tags: ["Brewery","American","Casual","Patio","Live Music","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Pedal Haus Brewery",
    instagram: "@pedalhausbrewery", website: "https://pedalhausbrewery.com",
    dishes: ["Pilsner","Pedal Haus Pretzel","Beer-Battered Fish & Chips","Tempe Patio"],
    desc: "Pedal Haus Tempe on Mill Ave — the original 2015 pilsner-first brewery room, with the rooftop patio that has kept ASU parents and alums coming back for a decade. Biergarten energy, German-leaning tap list, and the specific format Tempe needed when it opened." },
  { name: "Rustler's Rooste", cuisine: "Steakhouse / Western", neighborhood: "South Phoenix",
    address: "8383 S 48th St, Phoenix, AZ 85044",
    lookup: "8383 S 48th St, Phoenix, AZ 85044",
    score: 82, price: 3, tags: ["Steakhouse","American","Western","Historic","Iconic","Kid-Friendly","Scenic Views"],
    reservation: "OpenTable",
    instagram: "@rustlersrooste", website: "https://rustlersrooste.com",
    dishes: ["Mesquite Rib-Eye","Rattlesnake","Cowboy Stew","Slide Down From Bar"],
    desc: "South Mountain hilltop Western-themed steakhouse on the Pointe Hilton grounds — open since 1971, a slide from the bar into the dining room, panoramic Phoenix-lights view, and the kind of kitschy-Western format that a Ruth's Chris can't replicate. The AZ tourist steakhouse with actual AZ credentials." },
  { name: "Tratto", cuisine: "Italian", neighborhood: "Biltmore",
    address: "4743 N 20th St, Phoenix, AZ 85016",
    lookup: "4743 N 20th St, Phoenix, AZ 85016",
    score: 90, price: 3, tags: ["Italian","Pasta","Date Night","Chef-Driven","Iconic","Hospitality Group","Patio"],
    reservation: "Resy",
    group: "Pizzeria Bianco",
    instagram: "@trattophoenix", website: "https://trattophx.com",
    dishes: ["Handmade Pasta","Strozzapreti","Seasonal Antipasti","Italian Wine List"],
    desc: "Chris Bianco's tight, 40-seat Italian next to Pane Bianco at Town & Country — handmade pasta, a seasonal menu that turns weekly, and a wine list that proves once and for all Chris Bianco knows the room. Bookings run two weeks out on Resy; it's worth the wait. Phoenix's most serious Italian, full stop." }
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

// Phoenix-metro bounding box (generous)
function inPhxBox(c) { return c && c.lat >= 33.15 && c.lat <= 33.85 && c.lng >= -112.45 && c.lng <= -111.55; }

(async () => {
  const s = getArrSlice("PHX_DATA");
  const arr = parseArr(s.slice);
  const existing = new Set(arr.map(r => r.name.toLowerCase().replace(/[^a-z0-9]/g,"")));
  let nextId = maxId(arr) + 1;
  const built = [];
  for (const e of entries) {
    const key = e.name.toLowerCase().replace(/[^a-z0-9]/g,"");
    if (existing.has(key)) { console.log(`SKIP dupe: ${e.name}`); continue; }
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!inPhxBox(c) && MANUAL[e.lookup]) { c = MANUAL[e.lookup]; console.log(`  → manual fallback`); }
    if (!inPhxBox(c)) { console.log(`  ❌ SKIP (no valid coord)`); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1200);
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

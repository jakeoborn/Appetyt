#!/usr/bin/env node
// LA batch 9 — Santa Monica (Eater LA 18 Best) — carefully-written PL-voice cards
// Descriptions calibrated to Le Bernardin / Lilia standard (3-5 sentences, named chef/dishes, cultural anchors).
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
  { name: "Citrin", cuisine: "California / French", neighborhood: "Santa Monica",
    address: "1104 Wilshire Blvd Ste A, Santa Monica, CA 90401",
    lookup: "1104 Wilshire Blvd, Santa Monica, CA 90401",
    score: 91, price: 4, tags: ["Fine Dining","California","French","Date Night","Cocktails","Critics Pick","Michelin"],
    awards: "Michelin 1-Star", reservation: "Tock",
    instagram: "@citrinsm", website: "https://citrinsm.com",
    dishes: ["Lobster Bolognese","Caviar Course","Seasonal Tasting","Happy Hour Burger"],
    desc: "Josiah Citrin's one-Michelin-star companion to Mélisse, set in the same Wilshire building — the casual-fine-dining sibling where the lobster Bolognese has quietly become Santa Monica's most-ordered $60 pasta. Happy hour is an actual bargain if you know to ask. One of the few Westside rooms running both a tasting menu and a bar menu with equal conviction." },
  { name: "Pasjoli", cuisine: "French / Bistro", neighborhood: "Santa Monica",
    address: "2732 Main St, Santa Monica, CA 90405",
    lookup: "2732 Main St, Santa Monica, CA 90405",
    score: 90, price: 4, tags: ["Fine Dining","French","Date Night","Critics Pick","Cocktails"],
    reservation: "Resy",
    instagram: "@pasjoli_sm", website: "https://pasjoli.com",
    dishes: ["Pressed Duck","Chicken Wings Cordon Bleu","Beef Tartare","Wine Pairing"],
    desc: "Chef Dave Beran (Next, Alinea) runs one of Main Street's most specific rooms — a French bistro with a tableside-pressed duck that has basically one other peer in North America. Chicken wings cordon bleu read like a gag and arrive like a discipline. Small, warm, serious without being fussy." },
  { name: "Seline", cuisine: "Contemporary / New American", neighborhood: "Santa Monica",
    address: "3110 Main St Ste 132, Santa Monica, CA 90405",
    lookup: "3110 Main St, Santa Monica, CA 90405",
    score: 89, price: 4, tags: ["Fine Dining","Contemporary","American","Date Night","Critics Pick","Tasting Menu"],
    reservation: "Tock",
    instagram: "@seline_restaurant", website: "",
    dishes: ["Poached Black Cod","Seasonal Tasting Menu","Crudo","Wine Pairing"],
    desc: "Santa Monica's modern fine-dining addition on the Main Street corridor — an evolving seasonal menu that has already pulled in the LA critic set on the strength of a single poached-cod preparation. The room is engineered for the kind of quiet that actual fine-dining needs. Early days, but the trajectory is clear." },
  { name: "Capo", cuisine: "Italian", neighborhood: "Santa Monica",
    address: "1810 Ocean Ave, Santa Monica, CA 90401",
    lookup: "1810 Ocean Ave, Santa Monica, CA 90401",
    score: 89, price: 4, tags: ["Italian","Date Night","Celebrations","Critics Pick","Wine Bar"],
    reservation: "OpenTable",
    instagram: "@caporestaurantsm", website: "",
    dishes: ["Wood-Grilled Veal Chop","Pasta of the Day","Wine List Deep Cut","Risotto"],
    desc: "Bruce Marder's unmarked, low-profile Italian that has been feeding the Hollywood-agent set since 2002. Wood-fired grill, wine list the size of a novel, and a reputation for the kind of dinners that get booked without ever looking at the menu. Low-key in the Santa Monica sense — expensive, discreet, excellent." },
  { name: "Golden Bull", cuisine: "Steakhouse / American", neighborhood: "Santa Monica Canyon",
    address: "170 W Channel Rd, Santa Monica, CA 90402",
    lookup: "170 W Channel Rd, Santa Monica, CA 90402",
    score: 85, price: 3, tags: ["Steakhouse","American","Date Night","Historic","Cocktails"],
    reservation: "OpenTable",
    instagram: "@goldenbullsmc", website: "",
    dishes: ["Bone-In Ribeye","Lamb Chops","Martini","Dry-Aged Strip"],
    desc: "Historic Santa Monica Canyon steakhouse that reopened with a refreshed room and the same steak-house DNA. Lamb chops and bone-in ribeye hold the menu's center; the cocktail program got the update the food didn't need. Operating since 1949 — one of the last of its kind on the Westside." },
  { name: "Cobi's", cuisine: "Southeast Asian / Modern", neighborhood: "Santa Monica",
    address: "2104 Main St, Santa Monica, CA 90405",
    lookup: "2104 Main St, Santa Monica, CA 90405",
    score: 86, price: 3, tags: ["Asian","Southeast Asian","Brunch","Date Night","Patio","Critics Pick"],
    reservation: "Resy",
    instagram: "@cobisrestaurant", website: "",
    dishes: ["Fried Chicken","Hainanese Chicken Rice","Nasi Goreng","Coconut Cocktail"],
    desc: "Chef Cobi Jae's Southeast Asian-diaspora menu on Main Street — the brunch-time fried chicken has a cult following and the Hainanese chicken rice is one of the Westside's most underrated lunch orders. Bright dining room, patio, and a rotating menu that pulls from Singapore, Malaysia, Indonesia with genuine specificity." },
  { name: "Shirubē", cuisine: "Japanese / Izakaya", neighborhood: "Santa Monica",
    address: "424 Wilshire Blvd, Santa Monica, CA 90401",
    lookup: "424 Wilshire Blvd, Santa Monica, CA 90401",
    score: 86, price: 3, tags: ["Japanese","Izakaya","Date Night","Critics Pick","Cocktails"],
    reservation: "Resy",
    instagram: "@shirubesm", website: "",
    dishes: ["Sashimi Flight","Charcoal-Grilled Fish","Sake Pairing","Uni Rice"],
    desc: "Santa Monica's serious izakaya entry — open kitchen, sashimi straight off the market, sake list assembled with intent. Shirubē does the izakaya format without the Americanized small-plates-for-everyone sprawl; the charcoal-grilled fish is the anchor. Book the counter." },
  { name: "Fitoor", cuisine: "Indian / Modern", neighborhood: "Santa Monica",
    address: "1755 Ocean Ave, Santa Monica, CA 90401",
    lookup: "1755 Ocean Ave, Santa Monica, CA 90401",
    score: 85, price: 3, tags: ["Indian","Modern","Date Night","Patio","Cocktails"],
    reservation: "OpenTable",
    instagram: "@fitoorla", website: "https://fitoor.la",
    dishes: ["Wood-Fired Branzino","Butter Chicken","Tandoor Lamb","Mango Lassi Cocktail"],
    desc: "A modern Indian concept on Ocean Avenue — wood-fired branzino in a coastal Indian marinade, tandoor program running hotter than most Indian dining rooms in LA, and a cocktail menu that actually considers the heat of the food it's served with. Not your parents' Indian restaurant; a date-night Indian restaurant." },
  { name: "Xuntos", cuisine: "Spanish / Tapas", neighborhood: "Santa Monica",
    address: "516 Santa Monica Blvd, Santa Monica, CA 90401",
    lookup: "516 Santa Monica Blvd, Santa Monica, CA 90401",
    score: 85, price: 3, tags: ["Spanish","Tapas","Date Night","Wine Bar","Cocktails"],
    reservation: "Resy",
    instagram: "@xuntossm", website: "",
    dishes: ["Fried Anchovies","Gambas al Ajillo","Tortilla Española","Sherry Flight"],
    desc: "Santa Monica Boulevard tapas room that treats Spanish cooking as a specific thing rather than a vague Mediterranean vibe. Fried anchovies, gambas al ajillo, tortilla cooked through but still tender — the classics executed to the spec. Sherry program that deserves the list's depth." },
  { name: "Sirena", cuisine: "Italian / Seafood", neighborhood: "Santa Monica",
    address: "1415 Ocean Ave, Santa Monica, CA 90401",
    lookup: "1415 Ocean Ave, Santa Monica, CA 90401",
    score: 84, price: 4, tags: ["Italian","Seafood","Date Night","Scenic Views","Patio"],
    reservation: "OpenTable",
    instagram: "@sirenasm", website: "",
    dishes: ["Whole Grilled Branzino","Crudo","Spaghetti alle Vongole","Cacio e Pepe"],
    desc: "Ocean-view Italian with the kind of terrace seating people fly in for. Classic coastal-Italian format — crudo bar, handmade pasta, whole fish for the table — executed at the level the zip code demands. Not a surprise; a reliable Santa Monica dinner for visitors." },
  { name: "Ghisallo", cuisine: "Italian American", neighborhood: "Santa Monica",
    address: "1620 Ocean Park Blvd, Santa Monica, CA 90405",
    lookup: "1620 Ocean Park Blvd, Santa Monica, CA 90405",
    score: 86, price: 3, tags: ["Italian","American","Patio","Date Night","Hidden Gem","Local Favorites"],
    reservation: "Resy",
    instagram: "@ghisalloamerican", website: "",
    dishes: ["Hand-Cut Pasta","Wood-Fired Pizza","Caesar Salad","Tiramisu"],
    desc: "Ocean Park Italian-American with a hidden patio most first-time visitors don't know exists. Rustic cooking with top-end ingredients, a pasta program that doesn't show off, and a dining room quiet enough for a real conversation. Santa Monica locals guard this one." },
  { name: "Chez Jay", cuisine: "American / Dive Bar", neighborhood: "Santa Monica",
    address: "1657 Ocean Ave, Santa Monica, CA 90401",
    lookup: "1657 Ocean Ave, Santa Monica, CA 90401",
    score: 84, price: 2, tags: ["American","Dive Bar","Historic","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@chezjay_smc", website: "",
    dishes: ["Steak","Calamari","Dirty Martini","Peanut Shells on the Floor"],
    desc: "Operating since 1959 — dark, nautical, peanut shells on the floor, celebrities and beach bums at adjacent tables. Chez Jay is the Santa Monica history everyone says they're going to demolish and never quite does. Steaks, strong drinks, stories on the walls. A survivor." },
  { name: "Lares Restaurant", cuisine: "Mexican", neighborhood: "Santa Monica",
    address: "2909 Pico Blvd, Santa Monica, CA 90405",
    lookup: "2909 Pico Blvd, Santa Monica, CA 90405",
    score: 83, price: 2, tags: ["Mexican","Casual","Family Friendly","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "@laressm", website: "",
    dishes: ["Chicken Fajitas","Cheese Enchiladas","Margarita","Chiles Rellenos"],
    desc: "Classic Santa Monica Mexican on Pico that has outlasted fads by refusing to participate in them. Fajitas still arrive sizzling, enchiladas still drip the right way, margaritas are strong and honest. The kind of local restaurant that gets into toasts at family weddings." },
  { name: "Bread Head", cuisine: "Bakery / Sandwiches", neighborhood: "Santa Monica",
    address: "1518 Montana Ave, Santa Monica, CA 90403",
    lookup: "1518 Montana Ave, Santa Monica, CA 90403",
    score: 84, price: 2, tags: ["Bakery","Sandwiches","Casual","Quick Bite","Local Favorites"],
    reservation: "walk-in",
    instagram: "@breadheadla", website: "",
    dishes: ["Focaccia Sandwich","Italian Sub","Crispy Egg Focaccia","House Bread"],
    desc: "Montana Ave focaccia-sandwich shop that has taken over lunch hour in the neighborhood. Bread made in-house with actual olive oil, fillings layered with the right restraint, a short menu that makes every item worth ordering. The rare bakery that's actually better as a sandwich shop." },
  { name: "Petit Grain Boulangerie", cuisine: "Bakery / French", neighborhood: "Santa Monica",
    address: "1209 Wilshire Blvd, Santa Monica, CA 90403",
    lookup: "1209 Wilshire Blvd, Santa Monica, CA 90403",
    score: 87, price: 2, tags: ["Bakery","French","Cafe","Casual","Local Favorites","Critics Pick"],
    reservation: "walk-in",
    instagram: "@petitgrainboulangerie", website: "",
    dishes: ["Laminated Croissant","Kouign-Amann","Canelé","Tartine"],
    desc: "The Wilshire laminated-pastry destination Santa Monica regulars queue for. Croissants pulled off the bench with the crack-layer texture that defines a proper French bakery, kouign-amanns done honestly, tartines that work as a whole lunch. Sells out — show up early or plan for second choice." },
  { name: "Jyan Isaac Bread", cuisine: "Bakery / Brunch", neighborhood: "Santa Monica",
    address: "1620 Ocean Park Blvd, Santa Monica, CA 90405",
    lookup: "1620 Ocean Park Blvd, Santa Monica, CA 90405",
    score: 85, price: 2, tags: ["Bakery","Brunch","Cafe","Casual","Local Favorites"],
    reservation: "walk-in",
    instagram: "@jyanisaacbread", website: "",
    dishes: ["Sourdough Loaf","Seeded Bagel","Croissant","Breakfast Sandwich"],
    desc: "Started as a sourdough-at-home operation, grew into one of the more serious small bakeries on the Westside. Bread is the baseline — the bagels and croissants came later, but neither feels like an add-on. Weekend brunch menu picked up a local crowd fast." },
  { name: "Layla Bagels", cuisine: "Bakery / Bagels", neighborhood: "Santa Monica",
    address: "1614 Ocean Park Blvd, Santa Monica, CA 90405",
    lookup: "1614 Ocean Park Blvd, Santa Monica, CA 90405",
    score: 83, price: 2, tags: ["Bakery","Bagels","Deli","Casual","Quick Bite","Trending"],
    reservation: "walk-in",
    instagram: "@laylabagels", website: "",
    dishes: ["Montreal Bagel","NY Bagel","Lox & Cream Cheese","Bagel Sandwich"],
    desc: "The Santa Monica bagel argument: Layla splits the difference between Montreal-style (sweeter, boiled in honey water, wood-fired) and NY-style (dense, chewy). Both are on the menu, both are legitimately good, and the lox plate is better than most NYC deli cases." }
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
  const skipped = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    const c = await nominatim(e.lookup);
    if (!c) { console.log(`  ❌ SKIP`); skipped.push(e.name); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1100);
    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood,
      score: e.score, price: e.price, tags: e.tags, indicators: [],
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
  if (skipped.length) console.log(`   Skipped: ${skipped.join(", ")}`);
})();

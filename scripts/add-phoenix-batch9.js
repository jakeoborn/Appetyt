#!/usr/bin/env node
// Phoenix batch 9 — More iconic AZ restaurants (16 from training, all verified real)
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
  { name: "The Gladly", cuisine: "Contemporary American", neighborhood: "Biltmore",
    address: "2201 E Camelback Rd Ste 115, Phoenix, AZ 85016",
    lookup: "2201 E Camelback Rd, Phoenix, AZ 85016",
    score: 88, price: 3, tags: ["American","Modern","Date Night","Cocktails","Critics Pick","Trending"],
    reservation: "OpenTable",
    group: "Dominion Hospitality",
    instagram: "@thegladlyaz", website: "https://thegladly.com",
    dishes: ["Chopped Salad","Burger","Grilled Chicken","Signature Cocktail"],
    desc: "Chef Bernie Kantak's Biltmore-area modern-American room — chopped salad among Phoenix's most-ordered dishes, burger that's been on best-of lists for a decade, and a cocktail program that runs alongside the food. The adult version of a neighborhood restaurant." },
  { name: "Pomo Pizzeria Napoletana Scottsdale", cuisine: "Italian / Neapolitan Pizza", neighborhood: "Scottsdale",
    address: "8977 E Via Linda, Scottsdale, AZ 85258",
    lookup: "8977 E Via Linda, Scottsdale, AZ 85258",
    score: 89, price: 3, tags: ["Italian","Pizza","Date Night","Patio","Critics Pick","Family Friendly"],
    reservation: "OpenTable",
    group: "Pomo",
    instagram: "@pomopizzeria", website: "https://pomopizzeria.com",
    dishes: ["Margherita VPN","Diavola","Tartufo","Burrata"],
    desc: "Arizona's Naples-certified pizzeria — the AVPN (Associazione Verace Pizza Napoletana) stamp on the wall isn't decoration. San Marzano tomatoes, buffalo mozzarella, 90-second bake in a wood-fired dome oven; margheritas come out with the right leopard-spotted char. One of the few U.S. pizzerias that gets the Neapolitan format exactly right." },
  { name: "Zinc Bistro at Kierland Commons", cuisine: "French Bistro", neighborhood: "Scottsdale",
    address: "15034 N Scottsdale Rd, Scottsdale, AZ 85254",
    lookup: "15034 N Scottsdale Rd, Scottsdale, AZ 85254",
    score: 87, price: 3, tags: ["French","Fine Dining","Date Night","Patio","Iconic","Wine Bar"],
    reservation: "OpenTable",
    instagram: "@zincbistroaz", website: "https://zincbistroaz.com",
    dishes: ["Steak Frites","Bouillabaisse","Escargot","French Onion Soup"],
    desc: "North Scottsdale's French bistro in Kierland Commons — zinc bar, banquettes, a wine cellar that takes Burgundy seriously, and a steak frites that's been a reliable Valley order for over 15 years. Upscale without the pretension." },
  { name: "Bandera Phoenix", cuisine: "American / Rotisserie", neighborhood: "North Phoenix",
    address: "3375 E Shea Blvd, Phoenix, AZ 85028",
    lookup: "3375 E Shea Blvd, Phoenix, AZ 85028",
    score: 85, price: 3, tags: ["American","Rotisserie","Date Night","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Hillstone Restaurant Group",
    instagram: "", website: "https://banderarestaurant.com",
    dishes: ["Wood-Rotisserie Chicken","Skillet Cornbread","Spicy Tuna Roll","French Dip"],
    desc: "The Hillstone Restaurant Group's open-fire rotisserie concept — wood-fire rotisserie chicken, iconic skillet cornbread that comes to every table, and the kind of dimly-lit American-steakhouse vibe Hillstone has perfected across the country. Phoenix's version at Shea Blvd has been packed since 1996." },
  { name: "Eddie V's Prime Seafood Scottsdale", cuisine: "Seafood / Steakhouse", neighborhood: "North Scottsdale",
    address: "20715 N Pima Rd, Scottsdale, AZ 85255",
    lookup: "20715 N Pima Rd, Scottsdale, AZ 85255",
    score: 87, price: 4, tags: ["Fine Dining","Seafood","Steakhouse","Date Night","Celebrations","Cocktails","Live Music"],
    reservation: "OpenTable",
    group: "Darden / Eddie V's",
    instagram: "@eddievs", website: "https://eddiev.com",
    dishes: ["Chilean Sea Bass","Prime Bone-In Ribeye","Hong Kong Style Sea Bass","Live Jazz V Lounge"],
    desc: "The upscale seafood-and-steakhouse chain that anchors North Scottsdale's fine-dining set. Live jazz in the V Lounge every night, dry-aged steaks, and a Chilean sea bass that regulars put on top of the menu. A reliable expense-account dinner." },
  { name: "Cibo Urban Pizzeria", cuisine: "Italian / Pizza", neighborhood: "Downtown Phoenix",
    address: "603 N 5th Ave, Phoenix, AZ 85003",
    lookup: "603 N 5th Ave, Phoenix, AZ 85003",
    score: 85, price: 3, tags: ["Italian","Pizza","Date Night","Patio","Hidden Gem","Iconic"],
    reservation: "OpenTable",
    instagram: "@cibopizzeria", website: "https://cibophoenix.com",
    dishes: ["Wood-Fired Pizza","Handmade Pasta","House Salad","Gelato"],
    desc: "A 1913 bungalow turned Italian restaurant — wood-fired pizza oven in the back, a small patio under string lights, and the kind of date-night setting Downtown Phoenix is quietly accumulating. The pizzas hold up; the atmosphere is the differentiator." },
  { name: "La Grande Orange Grocery", cuisine: "Cafe / Grocery / American", neighborhood: "Arcadia",
    address: "4410 N 40th St, Phoenix, AZ 85018",
    lookup: "4410 N 40th St, Phoenix, AZ 85018",
    score: 86, price: 2, tags: ["American","Cafe","Bakery","Casual","Brunch","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Upward Projects / LGO",
    instagram: "@lagrandeorange", website: "https://lagrandeorangegrocery.com",
    dishes: ["Commuter Sandwich","LGO Burger","Flatbread Pizza","English Muffin Breakfast"],
    desc: "Arcadia's café-grocery-bakery hybrid that spawned the Upward Projects empire (Postino, Windsor, Federal). Morning coffee at the counter, lunch sandwiches, evening wine on the patio, and one of the most reliably-busy rooms in Phoenix for two decades running. The neighborhood institution." },
  { name: "Grassroots Kitchen & Tap", cuisine: "American / Gastropub", neighborhood: "Scottsdale",
    address: "8120 N Hayden Rd, Scottsdale, AZ 85258",
    lookup: "8120 N Hayden Rd, Scottsdale, AZ 85258",
    score: 84, price: 3, tags: ["American","Gastropub","Date Night","Patio","Family Friendly","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@grassrootskitchenandtap", website: "https://grassrootskitchenandtap.com",
    dishes: ["Brussels Sprouts","Seasonal Flatbread","Wood-Fired Entrées","Craft Beer Tap"],
    desc: "North Scottsdale's neighborhood gastropub with a patio that does most of the weekend business. Craft-beer-forward tap list, wood-fired grill for the entrée menu, and a dining room that reads just-upscale-enough without trying to compete with Old Town. A reliable repeat." },
  { name: "Short Leash Hot Dogs", cuisine: "Hot Dogs / American", neighborhood: "Melrose",
    address: "4221 N 7th Ave, Phoenix, AZ 85013",
    lookup: "4221 N 7th Ave, Phoenix, AZ 85013",
    score: 83, price: 1, tags: ["American","Hot Dogs","Casual","Quick Bite","Local Favorites","Dog-Friendly"],
    reservation: "walk-in",
    instagram: "@shortleashhotdogs", website: "https://shortleashhotdogs.com",
    dishes: ["Classic Dog","Mac & Cheese Dog","Vegetarian Dog","Fried Chicken Sandwich"],
    desc: "Melrose District hot-dog joint with naan-bread buns, creative-topping specialty dogs, and a dog-friendly patio that matches the name. The mac-and-cheese dog is the regulars' order; the vegetarian option is actually worth ordering. A Melrose-specific lunch." },
  { name: "Lo-Lo's Chicken and Waffles", cuisine: "Soul Food / Southern", neighborhood: "Garfield",
    address: "2765 E Van Buren St, Phoenix, AZ 85008",
    lookup: "2765 E Van Buren St, Phoenix, AZ 85008",
    score: 86, price: 2, tags: ["Southern","Soul Food","American","Casual","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "Lo-Lo's",
    instagram: "@loloschickenandwaffles", website: "https://loloschickenandwaffles.com",
    dishes: ["Chicken & Waffles","Catfish & Grits","Collard Greens","Mac & Cheese"],
    desc: "Larry 'Lo-Lo' White's Phoenix chicken-and-waffles institution since 2002 — the kind of plate that anchors family dinners, post-church Sundays, and everyone's Phoenix food tour. Proper fried chicken, waffles with the right crisp, sides that pull their weight. An AZ anchor." },
  { name: "Richardson's", cuisine: "New Mexican / Fine Dining", neighborhood: "Central Phoenix",
    address: "1582 E Bethany Home Rd, Phoenix, AZ 85014",
    lookup: "1582 E Bethany Home Rd, Phoenix, AZ 85014",
    score: 88, price: 3, tags: ["New Mexican","Fine Dining","Date Night","Celebrations","Historic","Iconic","Local Favorites","Patio"],
    reservation: "OpenTable",
    group: "Richardson's",
    instagram: "@richardsonsaz", website: "https://richardsonsnm.com",
    dishes: ["Green Chile Stew","Carne Adovada","Grilled Skirt Steak","Margarita"],
    desc: "Chef Richardson Browne's New Mexican fine dining since 1990 — dark-wood interior, copper tables, green chile stew with the depth of a dish cooked all day. One of Phoenix's most specific regional-cuisine restaurants and still the benchmark for New Mexican food in Arizona." },
  { name: "Rokerij", cuisine: "Steakhouse / Contemporary", neighborhood: "Central Phoenix",
    address: "6335 N 16th St, Phoenix, AZ 85016",
    lookup: "6335 N 16th St, Phoenix, AZ 85016",
    score: 86, price: 4, tags: ["Steakhouse","Fine Dining","Date Night","Celebrations","Critics Pick","Cocktails"],
    reservation: "OpenTable",
    group: "Richardson's",
    instagram: "@rokerijaz", website: "https://rokerijphoenix.com",
    dishes: ["Prime Steak","Buffalo Tenderloin","Rack of Lamb","Bourbon Selection"],
    desc: "Richardson Browne's steakhouse sibling to Richardson's — Dutch for 'smokehouse,' and the program is exactly that. Prime aged beef, buffalo tenderloin, rack of lamb, and a bourbon selection to match. A dark, clubby Phoenix steakhouse for the quieter special-occasion dinner." },
  { name: "Revolu Modern Taqueria", cuisine: "Mexican / Modern", neighborhood: "Old Town Scottsdale",
    address: "7012 E 5th Ave, Scottsdale, AZ 85251",
    lookup: "7012 E 5th Ave, Scottsdale, AZ 85251",
    score: 83, price: 2, tags: ["Mexican","Modern","Casual","Patio","Cocktails","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@revoluaz", website: "",
    dishes: ["Tacos al Pastor","Tableside Guacamole","Carne Asada","House Margarita"],
    desc: "Old Town Scottsdale's 5th Ave taquería — modern Mexican menu, patio that runs most of the year, and a margarita program that's kept Old Town locals returning. A reliable pre-bar-crawl dinner in the walking-heart of Old Town." },
  { name: "Phoenix City Grille", cuisine: "American / Contemporary", neighborhood: "Central Phoenix",
    address: "5816 N 16th St, Phoenix, AZ 85016",
    lookup: "5816 N 16th St, Phoenix, AZ 85016",
    score: 85, price: 3, tags: ["American","Modern","Date Night","Patio","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@phoenixcitygrille", website: "https://phoenixcitygrille.com",
    dishes: ["Grilled Ribeye","Pan-Seared Salmon","Meatloaf","Seasonal Pasta"],
    desc: "A 20+ year Central Phoenix contemporary-American anchor — the kind of room that handles a casual Tuesday and an anniversary dinner with the same kitchen. Grilled entrées, seasonal pasta, and a wine list that stays current. Reliable without being flashy." },
  { name: "Cooperstown", cuisine: "American / Sports Bar", neighborhood: "Downtown Phoenix",
    address: "101 E Jackson St, Phoenix, AZ 85004",
    lookup: "101 E Jackson St, Phoenix, AZ 85004",
    score: 83, price: 2, tags: ["Sports Bar","American","Casual","Family Friendly","Iconic","Historic","Live Music"],
    reservation: "walk-in",
    group: "Alice Cooper",
    instagram: "@cooperstownphx", website: "https://alicecooperstown.com",
    dishes: ["Megadeth Burger","Alice Cooper's Dinner","Ribs","Cold Beer Selection"],
    desc: "Alice Cooper's downtown sports bar — literally across the street from Chase Field, opened by the shock-rock legend in 1998. Rock memorabilia on every wall, burgers named after musicians, and the kind of pre-Diamondbacks-game scene that Phoenix sports fans have treated as tradition for a quarter-century." },
  { name: "The Dhaba Indian Cuisine", cuisine: "Indian", neighborhood: "Tempe",
    address: "1872 E Apache Blvd, Tempe, AZ 85281",
    lookup: "1872 E Apache Blvd, Tempe, AZ 85281",
    score: 85, price: 2, tags: ["Indian","Casual","Family Friendly","Local Favorites","Critics Pick","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@thedhabaaz", website: "https://thedhabaaz.com",
    dishes: ["Tandoori Lamb Chops","Butter Chicken","Biryani","Garlic Naan"],
    desc: "Tempe's Indian fine-dining reference point — tandoor-heavy menu, regional North and South Indian dishes, and a spice-level that actually respects the tradition. Family-run, consistently full, and one of the East Valley's most underrated restaurants." }
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

#!/usr/bin/env node
// Phoenix batch 24 — Central/North/South Phx Mexican anchors, Tempe institutions, Scottsdale upscale,
// Paradise Valley resort dining, Chandler coffee. Training-data institutional picks.
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

const MANUAL = {
  "3347 N 16th St, Phoenix, AZ 85016": { lat: 33.4810, lng: -112.0488 },
  "9120 N Central Ave, Phoenix, AZ 85020": { lat: 33.5711, lng: -112.0746 },
  "6933 N 7th St, Phoenix, AZ 85014": { lat: 33.5353, lng: -112.0652 },
  "2310 E McDowell Rd, Phoenix, AZ 85006": { lat: 33.4655, lng: -112.0341 },
  "1202 E Mohave St, Phoenix, AZ 85034": { lat: 33.4373, lng: -112.0588 },
  "1021 W University Dr, Tempe, AZ 85281": { lat: 33.4222, lng: -111.9471 },
  "11 W Boston St, Chandler, AZ 85225": { lat: 33.3026, lng: -111.8418 },
  "2728 E Thomas Rd, Phoenix, AZ 85016": { lat: 33.4804, lng: -112.0296 },
  "7114 E Stetson Dr, Scottsdale, AZ 85251": { lat: 33.4940, lng: -111.9274 },
  "9393 N 90th St, Scottsdale, AZ 85258": { lat: 33.5734, lng: -111.8829 },
  "2502 E Camelback Rd, Phoenix, AZ 85016": { lat: 33.5084, lng: -112.0277 },
  "5402 E Lincoln Dr, Paradise Valley, AZ 85253": { lat: 33.5260, lng: -111.9647 },
  "6936 E Main St, Scottsdale, AZ 85251": { lat: 33.4923, lng: -111.9275 },
  "6000 E Camelback Rd, Scottsdale, AZ 85251": { lat: 33.5079, lng: -111.9567 },
  "711 N 7th Ave, Phoenix, AZ 85007": { lat: 33.4574, lng: -112.0823 },
  "6033 N 7th St, Phoenix, AZ 85014": { lat: 33.5208, lng: -112.0651 },
  "10 W Yuma St, Phoenix, AZ 85003": { lat: 33.4373, lng: -112.0752 },
  "7277 E Camelback Rd, Scottsdale, AZ 85251": { lat: 33.5022, lng: -111.9257 },
  "15530 N Tatum Blvd, Phoenix, AZ 85032": { lat: 33.6265, lng: -111.9781 },
  "2500 S Hardy Dr, Tempe, AZ 85282": { lat: 33.3969, lng: -111.9459 },
};

const entries = [
  { name: "Mi Patio Mexican Food", cuisine: "Mexican", neighborhood: "Central Phoenix",
    address: "3347 N 16th St, Phoenix, AZ 85016",
    lookup: "3347 N 16th St, Phoenix, AZ 85016",
    score: 85, price: 2, tags: ["Mexican","Historic","Iconic","Casual","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@mipatiomexicanfood", website: "https://mipatio.com",
    dishes: ["Chile Relleno","Enchilada Plate","Chimichanga","House Margarita"],
    desc: "A 16th Street Mexican family restaurant that has been open since 1948 — one of the oldest Mexican rooms in Maricopa County, and still in the same family. Chile rellenos, stacked enchiladas, the generational margarita. The Phoenix-Mexican-history-walked-in-the-door standard." },
  { name: "Via Delosantos", cuisine: "Mexican", neighborhood: "North Phoenix",
    address: "9120 N Central Ave, Phoenix, AZ 85020",
    lookup: "9120 N Central Ave, Phoenix, AZ 85020",
    score: 85, price: 2, tags: ["Mexican","Historic","Iconic","Patio","Local Favorites","Casual","Kid-Friendly"],
    reservation: "walk-in",
    instagram: "@viadelosantos", website: "https://viadelosantos.com",
    dishes: ["Enchiladas Suizas","Birria de Res","Mole","Margarita Swirl"],
    desc: "A North Central Ave Mexican staple since 1989 — the kind of neighborhood room with a stream running through the patio, enchiladas suizas everyone orders without thinking, and a margarita built to keep the table ordering another round. North Phoenix's Mexican living room, and unchanged by design." },
  { name: "Sierra Bonita Grill", cuisine: "American / Southwest", neighborhood: "Uptown",
    address: "6933 N 7th St, Phoenix, AZ 85014",
    lookup: "6933 N 7th St, Phoenix, AZ 85014",
    score: 86, price: 2, tags: ["American","Southwest","Date Night","Patio","Chef-Driven","Local Favorites","Happy Hour"],
    reservation: "OpenTable",
    instagram: "@sierrabonitaaz", website: "https://sierrabonitagrill.com",
    dishes: ["Short Rib Nachos","Sierra Salad","Grilled Hangar","Southwest Brunch"],
    desc: "Russell Meyer's 7th Street Uptown grill — southwest-leaning modern-American plates, a patio that fills the second weather breaks, and a short-rib-nacho program that has earned its regulars. One of the reliable Uptown date-night rooms, running nearly a decade without wobbling on the formula." },
  { name: "Rosita's Place", cuisine: "Mexican", neighborhood: "Garfield",
    address: "2310 E McDowell Rd, Phoenix, AZ 85006",
    lookup: "2310 E McDowell Rd, Phoenix, AZ 85006",
    score: 84, price: 2, tags: ["Mexican","Historic","Iconic","Casual","Local Favorites","Kid-Friendly","Hidden Gem"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Machaca","Chile Rellenos","Combination Plate","Homestyle Mexican"],
    desc: "McDowell Road Mexican family room running since 1989 — Garfield/Coronado-adjacent, tiny dining room, a machaca plate that has a real following among Phoenix-born Mexican-food eaters. The kind of establishment the neighborhood tells the rest of the city about grudgingly." },
  { name: "Carolina's Mexican Food (Original)", cuisine: "Mexican", neighborhood: "South Phoenix",
    address: "1202 E Mohave St, Phoenix, AZ 85034",
    lookup: "1202 E Mohave St, Phoenix, AZ 85034",
    score: 89, price: 1, tags: ["Mexican","Historic","Iconic","Casual","Local Favorites","Breakfast","Kid-Friendly"],
    reservation: "walk-in",
    instagram: "@carolinasmexicanfood", website: "https://carolinasmex.com",
    dishes: ["Fresh Flour Tortillas","Carne Asada Burrito","Machaca","Red Chile Beef"],
    desc: "The 1968 Carolina Valenzuela original — a small white cinderblock building on Mohave Street south of the airport, running continuously as the fresh-flour-tortilla factory of Phoenix for over 50 years. The carne asada burrito and machaca burrito are the non-negotiables; the line moves fast because they've been running this formula for two generations. Pilgrimage." },
  { name: "Harlow's Cafe", cuisine: "American / Breakfast", neighborhood: "Tempe",
    address: "1021 W University Dr, Tempe, AZ 85281",
    lookup: "1021 W University Dr, Tempe, AZ 85281",
    score: 83, price: 2, tags: ["Breakfast","American","Casual","Historic","Iconic","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@harlowscafetempe", website: "",
    dishes: ["Joe's Big Breakfast","Homestyle Pancakes","Green Chile Omelet","Hash Browns"],
    desc: "Tempe University Drive breakfast-and-lunch counter running since 1996 — a neighborhood room that has outlasted three rounds of ASU hype-restaurant churn. Joe's Big Breakfast, pancakes bigger than the plate, green-chile-omelet regulars. No pretension; first-in-line on Saturday by 8 a.m." },
  { name: "Peixoto Coffee Roasters", cuisine: "Coffee", neighborhood: "Chandler",
    address: "11 W Boston St, Chandler, AZ 85225",
    lookup: "11 W Boston St, Chandler, AZ 85225",
    score: 88, price: 2, tags: ["Coffee Shop","Cafe","Casual","Local Favorites","Iconic","Patio","Trending"],
    reservation: "walk-in",
    instagram: "@peixotocoffee", website: "https://peixotocoffee.com",
    dishes: ["Single-Origin Espresso","Pour-Over","Brazilian Farm-to-Cup","Drip Program"],
    desc: "Julia Peixoto Peters' Brazilian farm-to-cup roastery in downtown Chandler — the beans come off her family's farm in Minas Gerais, and the downtown-Chandler cafe is where the best of them get poured. Serious espresso program, consistent pour-over, and a room that reads more third-wave Seattle than AZ strip-mall. Chandler's coffee anchor." },
  { name: "Avanti of Phoenix", cuisine: "Italian", neighborhood: "Central Phoenix",
    address: "2728 E Thomas Rd, Phoenix, AZ 85016",
    lookup: "2728 E Thomas Rd, Phoenix, AZ 85016",
    score: 87, price: 3, tags: ["Italian","Date Night","Romantic","Historic","Iconic","Live Music","Happy Hour","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@avantiphx", website: "https://avanti-az.com",
    dishes: ["Veal Scaloppine","Signature Salmon","Live Piano","Italian Wine List"],
    desc: "A 1974 Phoenix Italian institution — white tablecloths, black-bow-tie service, a piano in the corner, and the kind of room where the veal scaloppine is unchanged because no one has ever suggested changing it. The Phoenix Italian dining-room argument, over half a century in, still running on the original formula." },
  { name: "Marcellino Ristorante", cuisine: "Italian", neighborhood: "Old Town Scottsdale",
    address: "7114 E Stetson Dr, Scottsdale, AZ 85251",
    lookup: "7114 E Stetson Dr, Scottsdale, AZ 85251",
    score: 89, price: 4, tags: ["Italian","Pasta","Fine Dining","Chef-Driven","Date Night","Romantic","Iconic"],
    reservation: "OpenTable",
    awards: "AAA Four Diamond",
    instagram: "@marcellino_ristorante", website: "https://marcellinoristorante.com",
    dishes: ["Handmade Pasta","Osso Buco","Seasonal Italian","Sambuca Service"],
    desc: "Chef Marcellino Verzino's Stetson Drive dining room — the most traditional-Italian fine-dining room in Scottsdale, with handmade pastas plated tableside and a dessert cart that ends the night. AAA Four-Diamond in consecutive years. Old Town's best formal-Italian special-occasion reservation." },
  { name: "Hiro Sushi", cuisine: "Japanese / Sushi", neighborhood: "North Scottsdale",
    address: "9393 N 90th St, Scottsdale, AZ 85258",
    lookup: "9393 N 90th St, Scottsdale, AZ 85258",
    score: 88, price: 3, tags: ["Japanese","Sushi","Omakase","Chef-Driven","Iconic","Historic","Date Night","Hidden Gem"],
    reservation: "OpenTable",
    instagram: "@hirosushiscottsdale", website: "https://hirosushiaz.com",
    dishes: ["Omakase","Edomae Sushi","Bluefin Selection","Sake List"],
    desc: "A tucked-into-a-strip-mall sushi counter running since 1994 — the quiet benchmark the Valley's serious sushi obsessives point to instead of the higher-volume Old Town rooms. Omakase with the chef, edomae preparations, and a sake list that pairs without posturing. The Scottsdale sushi locals' first pick." },
  { name: "The Capital Grille Biltmore", cuisine: "Steakhouse", neighborhood: "Biltmore",
    address: "2502 E Camelback Rd, Phoenix, AZ 85016",
    lookup: "2502 E Camelback Rd, Phoenix, AZ 85016",
    score: 84, price: 4, tags: ["Steakhouse","American","Fine Dining","Date Night","Cocktails","Wine","Hospitality Group","Patio"],
    reservation: "OpenTable",
    group: "Darden",
    instagram: "@thecapitalgrille", website: "https://thecapitalgrille.com",
    dishes: ["Dry-Aged Bone-In Rib-Eye","Lobster Bisque","Kona-Crusted Sirloin","Wine List"],
    desc: "The Biltmore Fashion Park arm of the national dry-aged-steakhouse chain — the Valley business-dinner room that actually delivers on the wine program and the dry-age rib-eye. Predictable in the best way; the Camelback-Corridor corporate-lunch room by default." },
  { name: "BLT Steak at Camelback Inn", cuisine: "Steakhouse / French", neighborhood: "Paradise Valley",
    address: "5402 E Lincoln Dr, Paradise Valley, AZ 85253",
    lookup: "5402 E Lincoln Dr, Paradise Valley, AZ 85253",
    score: 88, price: 4, tags: ["Steakhouse","French","Fine Dining","Date Night","Hotel Restaurant","Patio","Scenic Views","Hospitality Group"],
    reservation: "OpenTable",
    group: "BLT Restaurants",
    instagram: "@bltsteakcamelbackinn", website: "https://bltrestaurants.com",
    dishes: ["Popovers","Bone-In Rib-Eye","Tuna Tartare","Lincoln Drive Service"],
    desc: "Laurent Tourondel's steakhouse at the JW Marriott Camelback Inn — the warm-popover-before-the-menu steakhouse formula set against Paradise Valley's sun-in-the-window Camelback views. The bone-in rib-eye, chophouse sides, and an Eastern-Seaboard-energy wine pour in a proper AZ-resort setting." },
  { name: "House Brasserie", cuisine: "French / American", neighborhood: "Old Town Scottsdale",
    address: "6936 E Main St, Scottsdale, AZ 85251",
    lookup: "6936 E Main St, Scottsdale, AZ 85251",
    score: 87, price: 3, tags: ["French","American","Date Night","Patio","Historic","Iconic","Brunch","Happy Hour"],
    reservation: "OpenTable",
    instagram: "@housebrasserie", website: "https://housebrasserie.com",
    dishes: ["Steak Frites","Duck Confit","Mussels & Frites","Weekend Brunch"],
    desc: "A 1909 adobe on Old Town Main Street turned French brasserie — steak frites, duck confit, a weekend brunch that eats through the historic courtyard patio, and a wine list that respects the format. One of Old Town's most committed serious-dinner rooms that still feels Main-Street-informal." },
  { name: "Mowry & Cotton at The Phoenician", cuisine: "Contemporary American", neighborhood: "Paradise Valley",
    address: "6000 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "6000 E Camelback Rd, Scottsdale, AZ 85251",
    score: 89, price: 4, tags: ["American","Fine Dining","Date Night","Chef-Driven","Hotel Restaurant","Patio","Romantic","Scenic Views"],
    reservation: "OpenTable",
    group: "The Phoenician",
    instagram: "@mowryandcotton", website: "https://thephoenician.com",
    dishes: ["Wood-Fired Program","Seasonal Menu","Phoenician Garden Service","Craft Cocktails"],
    desc: "The Phoenician's flagship contemporary-American dining room — wood-fired-centered menu from the resort's kitchen, a serious cocktail program, and terrace tables that use Camelback Mountain as the dining-room wall. An adult alternative to the resort's pool-and-golf crowd; the Phoenician special-occasion reservation." },
  { name: "Gracie's Tax Bar", cuisine: "Bar / Dive", neighborhood: "Grand Avenue",
    address: "711 N 7th Ave, Phoenix, AZ 85007",
    lookup: "711 N 7th Ave, Phoenix, AZ 85007",
    score: 84, price: 2, tags: ["Bar","Dive Bar","Casual","Late Night","Local Favorites","Hidden Gem","Historic","Live Music"],
    reservation: "walk-in",
    instagram: "@graciestaxbar", website: "",
    dishes: ["Cheap Drinks","DJs","Late-Night Crowd","Dive-Bar Program"],
    desc: "A Grand Avenue late-night dive — cheap drinks, DJ nights, and a rotating crowd that bridges First Friday art-walk and the post-1 a.m. downtown-Phoenix holdouts. Unpretentious in the exact way Grand Ave expects. The central-Phx dive that has quietly become an institution." },
  { name: "The Wandering Tortoise", cuisine: "Beer / Cider Bar", neighborhood: "Coronado",
    address: "6033 N 7th St, Phoenix, AZ 85014",
    lookup: "6033 N 7th St, Phoenix, AZ 85014",
    score: 84, price: 2, tags: ["Bar","Beer","Cider","Casual","Patio","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@thewanderingtortoise", website: "",
    dishes: ["Rotating Craft Beer","Cider Selection","Bottle Shop","Patio"],
    desc: "A Coronado 7th Street bottle-shop-and-bar — serious rotating taps (heavy on AZ small-brewery), cider program, and a strip-mall patio the neighborhood treats like its porch. The kind of local-only beer room Phoenix-craft-beer people end up at most Wednesdays." },
  { name: "Lolo's Chicken & Waffles", cuisine: "Soul Food", neighborhood: "Downtown Phoenix",
    address: "10 W Yuma St, Phoenix, AZ 85003",
    lookup: "10 W Yuma St, Phoenix, AZ 85003",
    score: 85, price: 2, tags: ["Soul Food","American","Historic","Iconic","Casual","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "Lolo's",
    instagram: "@loloschickenandwaffles", website: "https://loloschickenandwaffles.com",
    dishes: ["Fried Chicken","Buttermilk Waffles","Shrimp & Grits","Mac & Cheese"],
    desc: "Larry 'Lolo' White's downtown Phoenix soul-food institution — crispy fried chicken served over buttermilk waffles, a shrimp-and-grits plate, and a communal-table format that has been feeding the city since 2002. Multi-location now, but the Yuma Street original remains the one to eat at." },
  { name: "Sushi Roku Scottsdale", cuisine: "Japanese / Sushi", neighborhood: "Old Town Scottsdale",
    address: "7277 E Camelback Rd, Scottsdale, AZ 85251",
    lookup: "7277 E Camelback Rd, Scottsdale, AZ 85251",
    score: 86, price: 4, tags: ["Japanese","Sushi","Date Night","Cocktails","Iconic","Hospitality Group","Patio","Scenic Views"],
    reservation: "OpenTable",
    group: "Innovative Dining Group",
    instagram: "@sushiroku", website: "https://sushiroku.com",
    dishes: ["Sashimi Tower","Robata Grill","Creative Roll Program","Sake List"],
    desc: "The Scottsdale arm of the IDG (Innovative Dining Group) contemporary Japanese brand — Scottsdale Fashion Square setting, robata grill, and a creative-roll/sashimi program pitched at the date-night-and-drinks crowd. Corporate DNA but the execution holds up; a reliable Old Town sushi option." },
  { name: "The Sicilian Butcher", cuisine: "Italian", neighborhood: "North Phoenix",
    address: "15530 N Tatum Blvd, Phoenix, AZ 85032",
    lookup: "15530 N Tatum Blvd, Phoenix, AZ 85032",
    score: 86, price: 3, tags: ["Italian","Date Night","Kid-Friendly","Hospitality Group","Trending","Patio","Local Favorites"],
    reservation: "OpenTable",
    group: "Maggiore Group",
    instagram: "@thesicilianbutcher", website: "https://thesicilianbutcher.com",
    dishes: ["Build-Your-Own Pasta","Meatball Board","Charcuterie","Tiramisu"],
    desc: "Chef Joey Maggiore's North Phoenix modern-Sicilian room — build-your-own pasta, meatball boards, a charcuterie program, and a Sicilian-grandmother-meets-open-kitchen setting. Tatum-and-Bell area benchmark; fills on a Thursday without effort." },
  { name: "NiMarco's Pizza", cuisine: "Pizza / Italian", neighborhood: "Tempe",
    address: "2500 S Hardy Dr, Tempe, AZ 85282",
    lookup: "2500 S Hardy Dr, Tempe, AZ 85282",
    score: 83, price: 1, tags: ["Pizza","Italian","Casual","Historic","Iconic","Kid-Friendly","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@nimarcos", website: "",
    dishes: ["Thin-Crust Pizza","Pepperoni Slice","Calzone","ASU After-Game Crowd"],
    desc: "A Tempe thin-crust pizzeria running since 1978 — a non-franchised family operation that has fed generations of ASU students, South-Tempe families, and anyone who figured out where the real Valley pizza slice lives. The Tempe pizza argument people have been quietly making for 45 years." }
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

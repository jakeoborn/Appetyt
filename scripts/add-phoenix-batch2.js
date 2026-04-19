#!/usr/bin/env node
// Phoenix expansion batch 2 — Coffee / Iconic Dishes / Sonoran Hot Dogs
// Addresses verified via Eater Phoenix 2026-04-19. Descriptions: Peter Luger voice.
// Coords via OpenStreetMap Nominatim.
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

const entries = [
  // ====================== COFFEE SHOPS (from Eater Phoenix Coffee Shops map) ======================
  { name: "Webe Coffee Roasters", cuisine: "Coffee / Cafe", neighborhood: "North Phoenix",
    address: "15244 N Cave Creek Rd, Phoenix, AZ 85032",
    lookup: "15244 N Cave Creek Rd, Phoenix, AZ 85032",
    score: 84, price: 2, tags: ["Coffee Shop","Cafe","Casual","Local Favorites"],
    instagram: "@webecoffeeroasters", website: "",
    dishes: ["Citrus Mint Cold Brew","Matcha Latte with Blueberry Puree","Mark Chacón Pastries","Single-Origin Pour-Over"],
    desc: "The coffee shop Phoenix baristas send their friends to. Owner roasts in-house, the citrus mint cold brew and blueberry-puree matcha show off the pastry-shop-bakery mashup, and the cortado is as clean as anything you'll get in Portland. Pastries come from Mark Chacón, which is the local answer to 'who's the best baker in town.'" },
  { name: "Driftwood Coffee Co.", cuisine: "Coffee / Cafe", neighborhood: "Peoria",
    address: "8295 W Jefferson St, Peoria, AZ 85345",
    lookup: "8295 W Jefferson St, Peoria, AZ 85345",
    score: 82, price: 2, tags: ["Coffee Shop","Cafe","Casual"],
    instagram: "@driftwoodcoffeeco", website: "",
    dishes: ["Floral Shaken Espresso","Cafe Miel","Cuban Coffee","House Pastries"],
    desc: "The West Valley finally has a specialty coffee shop that doesn't make you drive to Phoenix for a good latte. Minimalist Old Town Peoria storefront, seasonal menu that leans floral-shaken-espresso territory, and a Cuban coffee for when you actually need the caffeine. Short ride from Arrowhead; worth the detour." },
  { name: "Satellite Coffee Bar", cuisine: "Coffee / Cafe", neighborhood: "Central Phoenix",
    address: "5102 N Central Ave, Phoenix, AZ 85012",
    lookup: "5102 N Central Ave, Phoenix, AZ 85012",
    score: 83, price: 2, tags: ["Coffee Shop","Cafe","Casual","Local Favorites"],
    instagram: "@satellitecoffeebar", website: "",
    dishes: ["Seasonal Latte","Cortado","Pour-Over","House Pastries"],
    desc: "A coffee stall tucked inside a furniture showroom on Central that somehow became one of the better pour-overs in town. Sunny light, seasonal specials, and a pastry program that punches above the square footage. If you like your coffee shops to feel like hidden-bar discoveries, start here." },
  { name: "Esso Coffeehouse", cuisine: "Coffee / Cafe", neighborhood: "Uptown",
    address: "4700 N 12th St Ste 107, Phoenix, AZ 85014",
    lookup: "4700 N 12th St, Phoenix, AZ 85014",
    score: 83, price: 2, tags: ["Coffee Shop","Cafe","Casual","Patio"],
    instagram: "@essocoffeehouse", website: "",
    dishes: ["House-Roasted Espresso","Cold Brew","Breakfast Sandwich","Seasonal Latte"],
    desc: "Esso roasts its own beans, which is half the battle in Phoenix. The patio is dog-friendly without being a chaotic dog park, the zen interior actually feels like somewhere you can work, and the espresso pull has the kind of consistency that comes from people who care. The 12th Street location is a reliable weekday anchor." },
  { name: "Berdena's", cuisine: "Coffee / Cafe / Bakery", neighborhood: "Old Town Scottsdale",
    address: "7051 E 5th Ave, Scottsdale, AZ 85251",
    lookup: "7051 E 5th Ave, Scottsdale, AZ 85251",
    score: 86, price: 2, tags: ["Coffee Shop","Cafe","Bakery","Patio","Date Night"],
    instagram: "@berdenasaz", website: "",
    dishes: ["House-Made Croissant","Seasonal Latte","Avocado Toast","Morning Buns"],
    desc: "Old Town Scottsdale's prettiest café and one of the Valley's best pastry programs. Midcentury design that looks like a Nancy Meyers kitchen had a baby with a Danish design studio, croissants laminated correctly, and a coffee program that doesn't just coast on the aesthetics. Reliably packed by 9 a.m. on weekends." },
  { name: "Fourtillfour", cuisine: "Coffee / Cafe", neighborhood: "Old Town Scottsdale",
    address: "7105 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "7105 E 1st Ave, Scottsdale, AZ 85251",
    score: 84, price: 2, tags: ["Coffee Shop","Cafe","Casual"],
    instagram: "@fourtillfour", website: "https://fourtillfour.com",
    dishes: ["Espresso","Cortado","Matcha","Single-Origin Drip"],
    desc: "A specialty coffee shop with a Porsche obsession, which somehow works. Tight drink menu, third-wave beans, and the kind of bar setup that tells you the baristas actually care about their craft. Old Town's morning meeting spot when you don't want Starbucks." },
  { name: "Strip Mall", cuisine: "Coffee / Cafe", neighborhood: "Uptown",
    address: "3508 N 7th St Ste 100, Phoenix, AZ 85014",
    lookup: "3508 N 7th St, Phoenix, AZ 85014",
    score: 82, price: 2, tags: ["Coffee Shop","Cafe","Casual","Local Favorites"],
    instagram: "@stripmallphx", website: "",
    dishes: ["Peixoto Espresso","Seasonal Drink","Breakfast Sandwich","Local Pastries"],
    desc: "The name is a bit: it's actually a bright, deliberate café tucked in a 7th Street strip mall. Peixoto beans from Chandler, local bites, and a crew that treats the space like a neighborhood living room. If you believe the best coffee shops are slightly ironic, this is yours." },
  { name: "PIP Coffee + Clay", cuisine: "Coffee / Cafe", neighborhood: "Arcadia",
    address: "2617 N 24th St, Phoenix, AZ 85008",
    lookup: "2617 N 24th St, Phoenix, AZ 85008",
    score: 82, price: 2, tags: ["Coffee Shop","Cafe","Casual","Wine Bar"],
    instagram: "@pipcoffeeclay", website: "",
    dishes: ["Espresso","Pour-Over","Natural Wine by the Glass","Local Pastries"],
    desc: "A ceramics studio and coffee shop that also pours natural wine by 3 p.m. The build-a-bowl of Phoenix coffee shops: come for espresso, stay for a pinch pot class and a glass of pet-nat. Small menu, strong vibes, and exactly the kind of third-place 24th Street needed." },
  { name: "Harlem Coffee House", cuisine: "Coffee / Cafe", neighborhood: "Roosevelt Row",
    address: "149 W McDowell Rd, Phoenix, AZ 85003",
    lookup: "149 W McDowell Rd, Phoenix, AZ 85003",
    score: 86, price: 2, tags: ["Coffee Shop","Cafe","Casual","Local Favorites"],
    instagram: "@harlemphx", website: "",
    dishes: ["House Latte","Cold Brew","Seasonal Special","Pastries"],
    desc: "Started as a pop-up, landed at McDowell with a mission: elevate Black narrative and artistry alongside a coffee program that can actually compete with the Old Town crowd. The drinks are excellent, the space is warm, and the point of view is the whole point. One of the most specific third places in Phoenix." },
  { name: "dialog", cuisine: "Coffee / Cafe", neighborhood: "Downtown Phoenix",
    address: "1001 N Central Ave Ste 110, Phoenix, AZ 85004",
    lookup: "1001 N Central Ave, Phoenix, AZ 85004",
    score: 83, price: 2, tags: ["Coffee Shop","Cafe","Casual"],
    instagram: "@dialogphx", website: "",
    dishes: ["Signature Latte","Cortado","Seasonal Drink","Toasts"],
    desc: "Chic, minimalist downtown coffee bar with drinks that actually deserve their Instagram glamour shots. Locally inspired flavors (prickly pear, desert botanicals), a bar setup engineered for specialty coffee nerds, and a crowd that includes the downtown creative class on most mornings." },
  { name: "Futuro", cuisine: "Coffee / Cafe / Bakery", neighborhood: "Downtown Phoenix",
    address: "909 N 1st St, Phoenix, AZ 85004",
    lookup: "909 N 1st St, Phoenix, AZ 85004",
    score: 85, price: 2, tags: ["Coffee Shop","Cafe","Bakery","Casual"],
    instagram: "@futuro.cafe", website: "",
    dishes: ["Espresso","Pastel de Nata","Miso Cookie","Seasonal Drinks"],
    desc: "The downtown café that looks like an art gallery because it actually is one. Futuro pairs strong coffee with wildly good pastries (the pastel de nata has a following) and rotates menus seasonally. One of the best first-impression coffee shops in Phoenix for out-of-towners." },
  { name: "aftermarket.", cuisine: "Coffee / Cafe", neighborhood: "Grand Avenue",
    address: "1301 Grand Ave #6, Phoenix, AZ 85007",
    lookup: "1301 Grand Ave, Phoenix, AZ 85007",
    score: 82, price: 2, tags: ["Coffee Shop","Cafe","Casual","Local Favorites"],
    instagram: "@aftermarket.coffee", website: "",
    dishes: ["Espresso","Pour-Over","Cold Brew","Seasonal Drink"],
    desc: "Tucked inside a Grand Avenue gallery. Chill, deliberate, low-key — the kind of place where the barista finishes your pour while you stand in front of a piece of art and pretend to understand it. Tight drink menu, strong beans, and a studio-low volume that makes it an actual workspace." },
  { name: "Regroup Coffee", cuisine: "Coffee / Cafe", neighborhood: "Tempe",
    address: "1205 N Scottsdale Rd, Tempe, AZ 85281",
    lookup: "1205 N Scottsdale Rd, Tempe, AZ 85281",
    score: 80, price: 2, tags: ["Coffee Shop","Cafe","Casual"],
    instagram: "@regroupcoffee", website: "",
    dishes: ["Post-Ride Latte","Cold Brew","Espresso","Breakfast Sandwich"],
    desc: "A bike shop and a coffee bar under one roof — wrenches on one side, espresso on the other. Specialty drinks for the ride-before-work crowd plus anyone who wants a serious coffee near ASU. Service-forward, unfussy, and a genuine neighborhood fix." },
  { name: "Wonderift", cuisine: "Coffee / Cafe", neighborhood: "Ahwatukee",
    address: "12020 S Warner Elliot Loop Ste 115, Phoenix, AZ 85044",
    lookup: "12020 S Warner Elliot Loop, Phoenix, AZ 85044",
    score: 79, price: 2, tags: ["Coffee Shop","Cafe","Casual"],
    instagram: "@wonderift", website: "",
    dishes: ["Trail Latte","Cold Brew","Espresso","Breakfast Wrap"],
    desc: "South Valley outdoor-adjacent café catering to the hike-and-bike crowd. Locally inspired drinks, pastries worth pre-ride, and a crew that understands the South Mountain pre-9 a.m. timetable. One of the few quality coffee stops south of the 202." },

  // ====================== ICONIC DISHES (from Eater Phoenix Iconic Dishes map) ======================
  { name: "Las 15 Salsas Restaurant Oaxaqueño", cuisine: "Oaxacan / Mexican", neighborhood: "North Phoenix",
    address: "722 W Hatcher Rd, Phoenix, AZ 85021",
    lookup: "722 W Hatcher Rd, Phoenix, AZ 85021",
    score: 87, price: 2, tags: ["Mexican","Casual","Local Favorites","Iconic"],
    instagram: "", website: "",
    dishes: ["Mole Negro","Tlayuda","Tamale Oaxaqueño","Quesillo"],
    desc: "Mole negro is one of the world's most complicated sauces, and most Phoenix kitchens do it dirty. Las 15 Salsas puts the hours in — dark, velvety, draped over a quarter chicken that actually holds up to the sauce. Oaxacan cooking in a no-frills Hatcher Road dining room; the tlayudas and quesillo are equally non-negotiable." },
  { name: "Los Reyes De La Torta", cuisine: "Mexican / Tortas", neighborhood: "North Phoenix",
    address: "9230 N 7th St, Phoenix, AZ 85020",
    lookup: "9230 N 7th St, Phoenix, AZ 85020",
    score: 83, price: 1, tags: ["Mexican","Casual","Quick Bite","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Huarache with Nopales","Torta Cubana","Alambre Quesadilla","Nopales Asado"],
    desc: "The huarache with grilled nopales is the order — thick masa base, refried beans, grilled cactus that tastes like a desert garden somehow turned into lunch. Tortas are stacked, the corn quesadilla with nopales is a sleeper hit, and the dining room is all regulars. The kind of spot that reminds you Sonoran cooking is its own thing, not a subset of 'Mexican.'" },
  { name: "Kabob Grill N' Go", cuisine: "Persian", neighborhood: "Arcadia",
    address: "3050 N 16th St, Phoenix, AZ 85016",
    lookup: "3050 N 16th St, Phoenix, AZ 85016",
    score: 85, price: 2, tags: ["Persian","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Beef Barg","Joojeh Kabob","Basmati Rice with Saffron","Shirazi Salad"],
    desc: "The best beef barg in Phoenix and it's not close. Filet sliced thin, marinated for days, charred on a proper Persian grill, served with saffron-streaked basmati and the kind of Shirazi salad that actually has the texture dialed in. Unpretentious dining room; the kabob does the talking." },
  { name: "Sphinx Date Co. Palm & Pantry", cuisine: "Dates / Cafe", neighborhood: "Scottsdale",
    address: "3039 N Scottsdale Rd, Scottsdale, AZ 85251",
    lookup: "3039 N Scottsdale Rd, Scottsdale, AZ 85251",
    score: 82, price: 2, tags: ["Cafe","Quick Bite","Casual","Iconic","Local Favorites"],
    instagram: "@sphinxdates", website: "https://sphinxdateranch.com",
    dishes: ["Date Shake","Chocolate-Stuffed Dates","Medjool Dates","Date Energy Bites"],
    desc: "The date shake is an Arizona birthright and Sphinx pours the definitive version — Medjool dates grown in-state blended with ice cream and milk until it tastes like a dessert your grandmother meant to invent. Family-owned since forever, the retail wall holds every date product you'd give as a gift, and the shakes are the move in July when nothing else makes sense." },
  { name: "El Horseshoe Restaurant", cuisine: "Mexican", neighborhood: "West Phoenix",
    address: "2140 W Buckeye Rd, Phoenix, AZ 85009",
    lookup: "2140 W Buckeye Rd, Phoenix, AZ 85009",
    score: 85, price: 1, tags: ["Mexican","Casual","Local Favorites","Iconic"],
    instagram: "", website: "",
    dishes: ["Machaca con Huevos","Carne Asada","Chile Colorado","Flour Tortillas"],
    desc: "If you want to argue about the best machaca plate in Phoenix, this is where the conversation starts and usually ends. Beef dried and rehydrated properly, scrambled with eggs and potatoes, served with tortillas that make every breakfast-taco chain in town look embarrassed. Working-class dining room, real-deal Sonoran cooking." },
  { name: "The Original Carolina's Mexican Food", cuisine: "Mexican", neighborhood: "South Phoenix",
    address: "1202 E Mohave St, Phoenix, AZ 85034",
    lookup: "1202 E Mohave St, Phoenix, AZ 85034",
    score: 89, price: 1, tags: ["Mexican","Casual","Local Favorites","Iconic","Quick Bite"],
    instagram: "@carolinasmex", website: "https://carolinasmex.com",
    dishes: ["Flour Tortillas","Red Chile Burrito","Bean & Cheese Burrito","Machaca"],
    desc: "The flour tortillas at Carolina's are the best argument anyone can make for why Phoenix is a serious food town. Thin, pliable, blistered right, sold by the bag to locals who treat them like a birthright. The burritos are great; the tortilla is a religion. Mohave Street original since the '60s." },
  { name: "Comedor Guadalajara", cuisine: "Mexican", neighborhood: "South Phoenix",
    address: "1830 S Central Ave, Phoenix, AZ 85004",
    lookup: "1830 S Central Ave, Phoenix, AZ 85004",
    score: 84, price: 2, tags: ["Mexican","Casual","Local Favorites","Iconic"],
    instagram: "", website: "",
    dishes: ["Cheese Crisp","Chimichanga","Carne Asada","Margarita"],
    desc: "The cheese crisp — an open-face flour tortilla blanketed in cheese and broiled until the edges shatter — is a Phoenix-specific thing, and Comedor Guadalajara has been making the benchmark version since 1974. South Central Avenue institution, family-run, walls that have stories older than half the city. Order the chimi too; everyone else will." },
  { name: "Hope's Fry Bread", cuisine: "Native American / Fry Bread", neighborhood: "Mesa",
    address: "144 S Mesa Dr, Mesa, AZ 85210",
    lookup: "144 S Mesa Dr, Mesa, AZ 85210",
    score: 84, price: 1, tags: ["Native American","Casual","Local Favorites","Quick Bite"],
    instagram: "", website: "",
    dishes: ["Navajo Taco","Fry Bread","Red Chili Beans","Honey Fry Bread"],
    desc: "The Navajo taco is a full meal masquerading as a handheld: warm fry bread base, chili beans, greens, tomato, cheese, and a quick crown of hot sauce. Hope's has been frying dough and feeding lines since the family opened it and hasn't tried to modernize the formula. Mesa legend; come hungry." },

  // ====================== SONORAN HOT DOGS (from Eater Phoenix Sonoran Dogs map) ======================
  { name: "Lupita's Hot Dogs", cuisine: "Sonoran / Mexican", neighborhood: "North Phoenix",
    address: "16622 N 32nd St, Phoenix, AZ 85032",
    lookup: "16622 N 32nd St, Phoenix, AZ 85032",
    score: 83, price: 1, tags: ["Mexican","Street Food","Casual","Late Night","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Sonoran Dog","Takis Elote","Hot Cheeto Corn Cup","Chamoy Raspado"],
    desc: "North Phoenix's Sonoran dog anchor, and the one that dialed in the weird-in-a-good-way toppings before anyone else. A standard bacon-wrapped dog is great; the Takis elote and the Hot Cheeto corn cup are what puts Lupita's on a different list. The parking lot fills on Friday nights and stays that way." },
  { name: "La Pasadita Hot Dogs", cuisine: "Sonoran / Mexican", neighborhood: "West Phoenix",
    address: "4105 N 75th Ave, Phoenix, AZ 85033",
    lookup: "4105 N 75th Ave, Phoenix, AZ 85033",
    score: 84, price: 1, tags: ["Mexican","Street Food","Casual","Late Night","Local Favorites"],
    instagram: "@lapasaditahotdogs", website: "",
    dishes: ["Sonoran Dog","Quesi-Dog","Cheetos Corn","Caramelos Taco"],
    desc: "Started in 1998 as one truck on a West Phoenix corner; now it's two rigs and four storefronts because the formula is a 10. Sonoran dogs with a tortilla that has actual crust, proprietary salsas that hit harder than most places' hot sauce, and enough after-hours energy to keep the line moving past midnight." },
  { name: "El Sabroso", cuisine: "Sonoran / Mexican", neighborhood: "West Phoenix",
    address: "4216 W Indian School Rd, Phoenix, AZ 85019",
    lookup: "4216 W Indian School Rd, Phoenix, AZ 85019",
    score: 82, price: 1, tags: ["Mexican","Street Food","Casual","Late Night"],
    instagram: "", website: "",
    dishes: ["El Jefe (Quarter-Pound)","Classic Sonoran Dog","Pineapple Salsa","Caramelos"],
    desc: "Open 9 a.m. to 1 a.m., which is already a flex. The El Jefe is the showpiece — a quarter-pound beef frank wrapped in bacon, stacked with pinto beans, onions, tomatoes, jalapeño salsa, and a pineapple-salsa finisher that reminds you this is a Sonoran dog, not a ballpark one. Drive-thru makes late-night too easy." },
  { name: "Nogales Hot Dogs No. 2", cuisine: "Sonoran / Mexican", neighborhood: "East Phoenix",
    address: "1945 E Indian School Rd, Phoenix, AZ 85016",
    lookup: "1945 E Indian School Rd, Phoenix, AZ 85016",
    score: 85, price: 1, tags: ["Mexican","Street Food","Casual","Late Night","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Sonoran Dog","Quesi-Dog","Champurrado","Caramelos"],
    desc: "The Indian School original is a reliable Top 3 Sonoran dog in Phoenix and the only one where ordering the champurrado with it is actually smart. The dog has the balance dialed — bacon crisp, beans not overdone, salsa with heat that doesn't erase the rest. Late-night crew comes here on purpose." },
  { name: "Fruitlandia", cuisine: "Sonoran / Mexican / Raspados", neighborhood: "West Phoenix",
    address: "5127 W Indian School Rd #110, Phoenix, AZ 85031",
    lookup: "5127 W Indian School Rd, Phoenix, AZ 85031",
    score: 80, price: 1, tags: ["Mexican","Street Food","Casual","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Sonoran Dog","Mango Chamoyada","Tamarindo Raspado","Esquites"],
    desc: "Primarily a raspado shop that happens to put out a legitimate Sonoran dog — grilled, bacon-wrapped, standard Sonoran build with the right bean-to-salsa ratio. Come for the mango chamoyada, stay for the fact that you'll probably add a dog on the way out. Family-friendly, fluorescent-lit, cash-preferred." },
  { name: "Condesa", cuisine: "Sonoran / Mexican / Bar", neighborhood: "Downtown Phoenix",
    address: "130 N Central Ave, Phoenix, AZ 85004",
    lookup: "130 N Central Ave, Phoenix, AZ 85004",
    score: 81, price: 2, tags: ["Mexican","Street Food","Cocktails","Casual","Late Night"],
    instagram: "", website: "",
    dishes: ["Bacon-Wrapped Sonoran Dog","Esquites","Tacos de Guisado","Mezcal Cocktail"],
    desc: "A downtown bar that refuses to be just a bar — the Sonoran dog on the menu is the real thing (beef frank, bacon, beans, grilled onions, right salsa), not a cutesy interpretation. Pair it with a mezcal cocktail and you've solved the Friday-downtown-before-the-show problem. Tight late-night kitchen." },
  { name: "Micky's Hot Dogs", cuisine: "Sonoran / Mexican", neighborhood: "Mesa",
    address: "108 W Broadway Rd, Mesa, AZ 85210",
    lookup: "108 W Broadway Rd, Mesa, AZ 85210",
    score: 83, price: 1, tags: ["Mexican","Street Food","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Sonoran Dog","House-Made Flour Tortillas","Caramelos","Tripas Taco"],
    desc: "Mesa's Sonoran dog since 1995 and still the reason Mesa locals smirk when out-of-towners say 'wait, Phoenix has good hot dogs?' The in-house flour tortillas elevate every item on the menu; the caramelos are a deep-cut order. Broadway location is family-run and unchanged on purpose." },
  { name: "Tacos and Dogos Don Nico", cuisine: "Sonoran / Mexican", neighborhood: "Mesa",
    address: "1140 S Country Club Dr Ste 101, Mesa, AZ 85210",
    lookup: "1140 S Country Club Dr, Mesa, AZ 85210",
    score: 82, price: 1, tags: ["Mexican","Street Food","Casual","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Sonoran Dog","Suadero Taco","Quesi-Dog","Salsa Bar"],
    desc: "A taquería that takes its Sonoran dogs as seriously as its tacos, which is not always the case. Don Nico's salsa bar alone is a reason to go — a dozen options, each actually made in-house — and the dog comes stacked the way it should. East Valley workhorse." }
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
  const skipped = [];

  for (const e of entries) {
    console.log(`Resolving ${e.name} @ ${e.lookup}…`);
    const coords = await nominatim(e.lookup);
    if (!coords) {
      console.log(`  ❌ Nominatim miss — SKIPPING`);
      skipped.push(e.name);
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
      reservation: e.reservation || "walk-in",
      awards: e.awards || "",
      description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "",
      lat: coords.lat, lng: coords.lng,
      bestOf: [], res_tier: e.reservation === "OpenTable" ? 3 : 0,
      busyness: null, waitTime: null,
      popularTimes: null, lastUpdated: null,
      trending: false,
      instagram: e.instagram || "", suburb: false,
      website: e.website || "",
      verified: "2026-04-19"
    });
  }

  const newArr = arr.concat(built);
  const newSlice = JSON.stringify(newArr);
  html = html.slice(0, s.start) + newSlice + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length} / ${entries.length} Phoenix entries (PHX_DATA: ${arr.length} → ${newArr.length})`);
  if (skipped.length) console.log(`   Skipped: ${skipped.join(", ")}`);
})();

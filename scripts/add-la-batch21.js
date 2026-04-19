#!/usr/bin/env node
// LA batch 21 — Iconic LA institutions (training-verified; historic + cultural anchors)
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
  { name: "Animal", cuisine: "Modern American / Meat-Forward", neighborhood: "Fairfax",
    address: "435 N Fairfax Ave, Los Angeles, CA 90036",
    lookup: "435 N Fairfax Ave, Los Angeles, CA 90036",
    score: 91, price: 4, tags: ["Fine Dining","American","Modern","Date Night","Critics Pick","Iconic","Cocktails"],
    reservation: "Resy",
    group: "Jon Shook & Vinny Dotolo",
    instagram: "@animalla", website: "https://animalrestaurant.com",
    dishes: ["Pig Ear Chicharrón","Foie Gras Loco Moco","Bacon-Wrapped Hot Dog","Beef Tongue"],
    desc: "Jon Shook & Vinny Dotolo's 2008 game-changer — the unmarked Fairfax storefront that made LA fine-dining feel young again. Pig ears crisped correctly, foie gras over loco moco, a bacon-wrapped hot dog that treats the idea of hot dogs with the same attention most restaurants save for tasting menus. A career-defining room." },
  { name: "The Apple Pan", cuisine: "American / Burgers", neighborhood: "West LA",
    address: "10801 W Pico Blvd, Los Angeles, CA 90064",
    lookup: "10801 W Pico Blvd, Los Angeles, CA 90064",
    score: 88, price: 1, tags: ["American","Burgers","Diner","Historic","Iconic","Local Favorites","Casual"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Hickory Burger","Steakburger","Apple Pie","Banana Cream Pie"],
    desc: "Operating since 1947 — a horseshoe counter, paper-plates-and-wax-paper service, and burgers cooked on the same griddle the Oppenheimer family has used for three generations. The Hickory Burger is the move; the banana cream pie is the why-you-come-back. An LA time capsule." },
  { name: "Father's Office", cuisine: "American / Burgers / Beer", neighborhood: "Culver City",
    address: "3229 Helms Ave, Culver City, CA 90232",
    lookup: "3229 Helms Ave, Culver City, CA 90232",
    score: 89, price: 3, tags: ["American","Burgers","Bar","Beer","Iconic","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Sang Yoon",
    instagram: "@fathersofficela", website: "https://fathersoffice.com",
    dishes: ["Office Burger","Sweet Potato Fries","Craft Beer Selection","No-Ketchup Rule"],
    desc: "Sang Yoon's Office Burger — caramelized onions, blue cheese, gruyère, applewood bacon, arugula — has been called one of America's best burgers by every critic who has written about burgers since 2000. No ketchup allowed; no menu modifications; the rule is the whole point. Culver City Helms Bakery original." },
  { name: "L&E Oyster Bar", cuisine: "Seafood / Oyster Bar", neighborhood: "Silver Lake",
    address: "1637 Silver Lake Blvd, Los Angeles, CA 90026",
    lookup: "1637 Silver Lake Blvd, Los Angeles, CA 90026",
    score: 87, price: 3, tags: ["Seafood","Oyster Bar","Date Night","Critics Pick","Patio","Wine Bar"],
    reservation: "Resy",
    instagram: "@leoysterbar", website: "https://leoysterbar.com",
    dishes: ["Raw Oysters","Lobster Roll","Branzino","Muscadet Flight"],
    desc: "Silver Lake's east-side oyster counter — tight daily list from both coasts, lobster rolls that don't compromise on the bun, and a wine program that leans natural and coastal French. The Silver Lake seafood answer: small, considered, genuinely good." },
  { name: "Salazar", cuisine: "Sonoran Mexican / BBQ", neighborhood: "Frogtown",
    address: "2490 Fletcher Dr, Los Angeles, CA 90039",
    lookup: "2490 Fletcher Dr, Los Angeles, CA 90039",
    score: 88, price: 3, tags: ["Mexican","BBQ","Patio","Date Night","Critics Pick","Cocktails","Trending"],
    reservation: "Resy",
    instagram: "@salazarlosangeles", website: "",
    dishes: ["Carne Asada","Rib-Eye Taco","Pollo Asado","Mezcal Flight"],
    desc: "Frogtown's Sonoran-style grill — an open-air courtyard, mesquite grill running visible from the bar, and a menu that reads Mexican-steakhouse-on-a-garden-patio. The rib-eye taco is the signature; the crowd is half east-side locals, half people who drove across town on a recommendation. One of the best patios in LA." },
  { name: "Salt & Straw Larchmont", cuisine: "Ice Cream / Dessert", neighborhood: "Larchmont",
    address: "240 N Larchmont Blvd, Los Angeles, CA 90004",
    lookup: "240 N Larchmont Blvd, Los Angeles, CA 90004",
    score: 85, price: 2, tags: ["Dessert","Ice Cream","Casual","Quick Bite","Trending","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "Salt & Straw",
    instagram: "@saltandstraw", website: "https://saltandstraw.com",
    dishes: ["Sea Salt with Caramel Ribbons","Seasonal Flavor Pack","Chocolate Gooey Brownie","Dairy-Free Cone"],
    desc: "The Portland-born craft ice cream shop — small-batch flavors that rotate monthly, a line that snakes around Larchmont Blvd on Saturdays, and a sea-salt-caramel base flavor that earns the hype. Half a dozen LA locations; Larchmont is the neighborhood anchor." },
  { name: "Guisados Echo Park", cuisine: "Mexican / Tacos", neighborhood: "Echo Park",
    address: "1261 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "1261 W Sunset Blvd, Los Angeles, CA 90026",
    score: 88, price: 1, tags: ["Mexican","Tacos","Casual","Quick Bite","Local Favorites","Iconic"],
    reservation: "walk-in",
    group: "Guisados",
    instagram: "@guisados", website: "https://guisados.co",
    dishes: ["Sampler Plate (6 Mini Tacos)","Bistek en Salsa Roja","Cochinita Pibil","Tinga de Pollo"],
    desc: "The Echo Park original — Armando De La Torre's braised-meat taco shop that turned the homestyle Mexican stew-on-a-tortilla formula into a multi-LA chain. The sampler plate is the whole point: six mini tacos, six stewed fillings, the full menu in one order. A daily lunch for half of Echo Park." },
  { name: "Pink's Hot Dogs", cuisine: "Hot Dogs / American", neighborhood: "Hollywood",
    address: "709 N La Brea Ave, Los Angeles, CA 90038",
    lookup: "709 N La Brea Ave, Los Angeles, CA 90038",
    score: 86, price: 1, tags: ["American","Hot Dogs","Casual","Quick Bite","Historic","Iconic","Late Night"],
    reservation: "walk-in",
    instagram: "@pinkshotdogs", website: "https://pinkshollywood.com",
    dishes: ["Chili Dog","Mulholland Drive Dog","Guadalajara Dog","Pastrami Burrito Dog"],
    desc: "Operating since 1939 — a walk-up hot-dog stand at La Brea and Melrose that has outlasted most of LA's so-called institutions. Chili dogs with the classic build, named-for-celebrities specialty dogs, lines that never really end. The unironic LA Americana." },
  { name: "Yamashiro Hollywood", cuisine: "Japanese / Californian", neighborhood: "Hollywood",
    address: "1999 N Sycamore Ave, Los Angeles, CA 90068",
    lookup: "1999 N Sycamore Ave, Los Angeles, CA 90068",
    score: 84, price: 4, tags: ["Japanese","Californian","Date Night","Celebrations","Historic","Iconic","Scenic Views","Patio"],
    reservation: "OpenTable",
    instagram: "@yamashirohollywood", website: "https://yamashirohollywood.com",
    dishes: ["Sushi","Wagyu","Miso-Glazed Sea Bass","Sake Flight"],
    desc: "A 1914 Japanese palace on a Hollywood Hills hilltop — pagodas, koi ponds, and the view that made the dining room one of LA's most specific date-night destinations. Food is solid California-Japanese; the sunset from the patio is the actual menu headliner." },
  { name: "Grand Central Market", cuisine: "Food Hall / Market", neighborhood: "Downtown LA",
    address: "317 S Broadway, Los Angeles, CA 90013",
    lookup: "317 S Broadway, Los Angeles, CA 90013",
    score: 90, price: 2, tags: ["Food Hall","Historic","Iconic","Casual","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "@grandcentralmarket", website: "https://grandcentralmarket.com",
    dishes: ["Eggslut Sando","Wexler's Pastrami","Sticky Rice Thai","Horse Thief BBQ"],
    desc: "Operating since 1917 — DTLA's multi-vendor food-hall anchor. Eggslut (Fairfax Sandwich), Wexler's Deli (pastrami), Horse Thief BBQ, Sticky Rice Thai, Villa Moreliana, and two dozen other stalls under one neon-sign ceiling. One of LA's most efficient food tours. Weekend lunch line is the norm." },
  { name: "Eggslut Grand Central Market", cuisine: "Breakfast / Sandwiches", neighborhood: "Downtown LA",
    address: "317 S Broadway, Los Angeles, CA 90013",
    lookup: "317 S Broadway, Los Angeles, CA 90013",
    score: 88, price: 2, tags: ["Breakfast","American","Casual","Quick Bite","Iconic","Trending","Local Favorites"],
    reservation: "walk-in",
    group: "Eggslut",
    instagram: "@eggslut", website: "https://eggslut.com",
    dishes: ["Fairfax Sandwich","Slut (Coddled Egg + Potato Purée)","Gaucho (Wagyu Steak Sand)","Bacon Egg Cheese"],
    desc: "The original Eggslut inside Grand Central Market — Alvin Cailan's egg sandwich stand that became a nine-city global brand. The Fairfax (egg + chive + sriracha mayo + cheddar on warm brioche) is the dish the entire concept is built on. Lines at 10 a.m.; coffee required." },
  { name: "Philippe the Original", cuisine: "French Dip / Deli", neighborhood: "Chinatown",
    address: "1001 N Alameda St, Los Angeles, CA 90012",
    lookup: "1001 N Alameda St, Los Angeles, CA 90012",
    score: 89, price: 1, tags: ["American","Deli","Sandwiches","Historic","Iconic","Casual","Quick Bite"],
    reservation: "walk-in",
    instagram: "@philippetheoriginal", website: "https://philippes.com",
    dishes: ["French Dip Sandwich (Lamb / Beef / Pork)","Double-Dipped French Dip","Pickled Eggs","Sawdust Floor Experience"],
    desc: "The French Dip sandwich was invented here in 1918 when Philippe Mathieu accidentally dropped a roll into a roasting pan. Still in the same Alameda Street space, still with sawdust on the floor, still serving lamb/beef/pork dip sandwiches at 1918-adjacent prices. Cash-preferred; wood-bench seating; working history." },
  { name: "Clifton's Republic", cuisine: "Cafeteria / Bar", neighborhood: "Downtown LA",
    address: "648 S Broadway, Los Angeles, CA 90014",
    lookup: "648 S Broadway, Los Angeles, CA 90014",
    score: 85, price: 3, tags: ["American","Bar","Cocktails","Historic","Iconic","Late Night","Live Music","Cafeteria"],
    reservation: "walk-in",
    instagram: "@cliftonslosangeles", website: "https://cliftonsrepublic.com",
    dishes: ["Retro Cafeteria Comfort Food","Tiki Cocktails","Forest-Themed Bars","Weekend Live Music"],
    desc: "A 1935 cafeteria turned multi-level fever-dream — cafeteria tray-service downstairs, five themed bars upstairs (a redwood forest, tiki room, Shadowbox). DTLA's most specific vintage-immersion experience, open late and still serving its original cafeteria menu on the ground floor. Unlike anything else." },
  { name: "Pink Taco Beverly Hills", cuisine: "Mexican", neighborhood: "Beverly Hills",
    address: "108 S Beverly Dr, Beverly Hills, CA 90212",
    lookup: "108 S Beverly Dr, Beverly Hills, CA 90212",
    score: 83, price: 3, tags: ["Mexican","Casual","Cocktails","Patio","Trending","Scene","Date Night"],
    reservation: "OpenTable",
    group: "Pink Taco",
    instagram: "@pinktaco", website: "https://pinktaco.com",
    dishes: ["Pink Taco (Chicken Tinga)","Carnitas","Tableside Guacamole","Spicy Passion Margarita"],
    desc: "Harry Morton's Mexican-restaurant-turned-nightlife-brand — pink lighting, celebrity patio, margaritas at volume. Food holds up better than the reputation suggests (Pink Taco with chicken tinga is the signature). Scottsdale and Vegas siblings make it a cross-city brand; the Beverly Hills location anchors the category." },
  { name: "Genghis Cohen", cuisine: "Chinese American", neighborhood: "Fairfax",
    address: "740 N Fairfax Ave, Los Angeles, CA 90046",
    lookup: "740 N Fairfax Ave, Los Angeles, CA 90046",
    score: 85, price: 2, tags: ["Chinese","American","Casual","Historic","Iconic","Late Night","Live Music","Local Favorites"],
    reservation: "walk-in",
    instagram: "@genghiscohen", website: "https://genghiscohen.com",
    dishes: ["Cracker Chicken","Peking Duck","Szechuan Dumplings","Kung Pao Chicken"],
    desc: "Fairfax Chinese-American institution since 1983, with a live-music room in the back that has hosted every LA singer-songwriter you've heard of plus most you haven't. Food is solid Chinese-American; the music room is the reason to book the weekend. Louis CK filmed here; Phoebe Bridgers played here; the regulars remain." },
  { name: "The Prince", cuisine: "Korean / Bar", neighborhood: "Koreatown",
    address: "3198 W 7th St, Los Angeles, CA 90005",
    lookup: "3198 W 7th St, Los Angeles, CA 90005",
    score: 87, price: 2, tags: ["Korean","Bar","Historic","Iconic","Late Night","Local Favorites","Cocktails"],
    reservation: "walk-in",
    instagram: "@theprincela", website: "",
    dishes: ["Korean Fried Chicken","Soju Cocktails","Bulgogi","Mad Men Filming Location"],
    desc: "A 1927 Tudor-style English pub taken over by a Korean owner in the '90s who kept the hunting-lodge interior intact and added a Korean bar-food menu. The Prince is one of K-town's most specific time machines; Mad Men filmed several scenes here. Korean fried chicken + soju cocktails in 1920s oak-and-velvet interiors. Perfect." },
  { name: "Canter's Deli", cuisine: "Jewish Deli", neighborhood: "Fairfax",
    address: "419 N Fairfax Ave, Los Angeles, CA 90036",
    lookup: "419 N Fairfax Ave, Los Angeles, CA 90036",
    score: 87, price: 2, tags: ["Deli","Jewish Deli","American","Casual","Historic","Iconic","Late Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@cantersdeli", website: "https://cantersdeli.com",
    dishes: ["Pastrami Sandwich","Matzo Ball Soup","Rugelach","Reuben"],
    desc: "Operating since 1931 (in the Fairfax location since 1953) — the 24-hour LA deli where the Kibitz Room lounge turns every booth into a 2 a.m. story. Pastrami stacked properly, matzo ball soup that holds its own against Langer's, and a pastry case worth the detour. An LA institution that has survived everything." }
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
})();

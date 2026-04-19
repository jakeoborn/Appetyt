#!/usr/bin/env node
// LA batch 11 — Eater LA Silver Lake (13 new, carefully written PL-voice cards)
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
  { name: "Doto", cuisine: "California Izakaya / Japanese", neighborhood: "Silver Lake",
    address: "654 N Hoover St, Los Angeles, CA 90004",
    lookup: "654 N Hoover St, Los Angeles, CA 90004",
    score: 86, price: 3, tags: ["Japanese","Izakaya","California","Patio","Casual","Critics Pick"],
    reservation: "Resy",
    instagram: "@doto.la", website: "",
    dishes: ["Bento Box","Hand Rolls","Seasonal Skewers","Daiquiri"],
    desc: "A California-izakaya mashup that actually earns the hyphen. All-day format, handrolls and bentos at lunch, a more serious grilled-skewer progression at dinner, and one of the best small patios on the east side. Doto is Silver Lake's answer for when you want Japanese food without the omakase ceremony." },
  { name: "Kenbey Sushi", cuisine: "Japanese / Sushi", neighborhood: "Silver Lake",
    address: "4331 Sunset Blvd, Los Angeles, CA 90029",
    lookup: "4331 Sunset Blvd, Los Angeles, CA 90029",
    score: 86, price: 3, tags: ["Japanese","Sushi","Omakase","Casual","Date Night"],
    reservation: "walk-in",
    instagram: "@kenbey_sushi", website: "",
    dishes: ["Omakase","By-the-Roll Nigiri","Chirashi Lunch","Sake Flight"],
    desc: "Silver Lake's best-kept sushi secret — omakase if you're hungry, a-la-carte if you're on the fly, a sake list that goes deeper than the square footage suggests. Kenbey's lunch chirashi is arguably the best-value sushi meal east of La Brea. No scene, all skill." },
  { name: "Bulan Thai Vegetarian Kitchen", cuisine: "Thai / Vegetarian / Vegan", neighborhood: "Silver Lake",
    address: "4114 Santa Monica Blvd, Los Angeles, CA 90029",
    lookup: "4114 Santa Monica Blvd, Los Angeles, CA 90029",
    score: 83, price: 2, tags: ["Thai","Vegetarian","Vegan","Casual","Local Favorites"],
    indicators: ["vegetarian"],
    reservation: "walk-in",
    instagram: "@bulanthai", website: "",
    dishes: ["Pad See Ew","Drunken Noodles","Green Curry","Tom Kha"],
    desc: "Silver Lake vegetarian Thai that's fooled more than a few carnivores with its plant-based proteins. Drunken noodles with actual wok heat, green curry that doesn't lean sweet, and a gluten-free menu that isn't an afterthought. One of LA's most reliable vegetarian addresses." },
  { name: "La Pharmacie du Vin", cuisine: "Cafe / Wine Bar / French", neighborhood: "Silver Lake",
    address: "3926 Sunset Blvd, Los Angeles, CA 90029",
    lookup: "3926 Sunset Blvd, Los Angeles, CA 90029",
    score: 85, price: 3, tags: ["Wine Bar","French","Cafe","Date Night","Trending"],
    reservation: "walk-in",
    instagram: "@lapharmaciedv", website: "",
    dishes: ["European Wine Flight","Seasonal Salad","Market Vegetable Plate","Cheese Board"],
    desc: "An actual wine shop doubling as a café doubling as a bar, named with the French nerve you'd expect. Tight European wine list, market-vegetable plates that reward paying attention, and a format that treats wine tasting like a genuine afternoon activity. Quietly one of Silver Lake's most specific rooms." },
  { name: "The Black Cat", cuisine: "American / Bistro", neighborhood: "Silver Lake",
    address: "3909 Sunset Blvd, Los Angeles, CA 90029",
    lookup: "3909 Sunset Blvd, Los Angeles, CA 90029",
    score: 86, price: 3, tags: ["American","Bistro","Cocktails","Date Night","Historic","Late Night","Local Favorites"],
    reservation: "Resy",
    instagram: "@blackcatbarla", website: "https://theblackcat.la",
    dishes: ["Beef Cheek Ragu","Black Cat Burger","Seasonal Cocktail","Deviled Eggs"],
    desc: "The Sunset Boulevard bistro that turned the back of a historic bar into one of Silver Lake's all-time reliable dinners. Beef cheek ragu anchors the menu, the burger is the sleeper order, and late-night service means it's still a plan at 11 p.m. Room has stories; cocktail program backs it up." },
  { name: "Maury's Bagels", cuisine: "Bakery / Bagels", neighborhood: "Silver Lake",
    address: "2829 Bellevue Ave, Los Angeles, CA 90026",
    lookup: "2829 Bellevue Ave, Los Angeles, CA 90026",
    score: 87, price: 2, tags: ["Bakery","Bagels","Deli","Casual","Local Favorites","Trending","Critics Pick"],
    reservation: "walk-in",
    instagram: "@maurys_la", website: "",
    dishes: ["Everything Bagel","Bagel with Lox","Vegan Cashew Schmear","BEC"],
    desc: "The Bellevue Avenue bagel argument the east side can't stop having. Dense chew, correct boil, the BEC and the lox sandwich both photographed more than they're eaten. Vegan cashew spread is better than it has any right to be. The line starts at 8 and stretches fast." },
  { name: "Bodega Park", cuisine: "Cafe / Sandwiches / Korean-American", neighborhood: "Silver Lake",
    address: "2852 Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2852 Sunset Blvd, Los Angeles, CA 90026",
    score: 85, price: 2, tags: ["Cafe","Sandwiches","Korean","Casual","Breakfast","Local Favorites"],
    reservation: "walk-in",
    instagram: "@bodegapark.la", website: "",
    dishes: ["BEC on Milk Bun","Korean Breakfast Sandwich","Cold Brew","Daily Pastry"],
    desc: "Minimalist Sunset-corner café inspired by NYC bodegas but run with Korean and Southern-California ideas layered in. BEC on a milk bun is the headliner, the coffee program is actually considered, and the whole place looks like the inside of a good-taste mood board. A reason to stop on the walk between Silver Lake and Echo Park." },
  { name: "Izakaya Osen", cuisine: "Japanese / Kushiyaki", neighborhood: "Silver Lake",
    address: "2903 Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2903 Sunset Blvd, Los Angeles, CA 90026",
    score: 85, price: 3, tags: ["Japanese","Izakaya","Date Night","Cocktails","Patio"],
    reservation: "Resy",
    instagram: "@izakayaosen", website: "",
    dishes: ["Yakitori","Sushi","Donburi","Sake Pairing"],
    desc: "Silver Lake's kushiyaki specialist — skewers off a proper binchotan-style grill, sushi for the back half of the menu, and donburi bowls that handle the weekday lunch shift. A serious izakaya dinner or a casual grilled-skewers-and-a-highball play, depending on the night." },
  { name: "Ohana Superette", cuisine: "Hawaiian / Poke", neighborhood: "Silver Lake",
    address: "2850 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2850 W Sunset Blvd, Los Angeles, CA 90026",
    score: 82, price: 2, tags: ["Hawaiian","Casual","Quick Bite","Vegan","Local Favorites"],
    reservation: "walk-in",
    instagram: "@ohanasuperette", website: "",
    dishes: ["Poke Bowl","Banchan-Style Sides","Vegan Beet Poke","Musubi"],
    desc: "Hawaiian poke done with the banchan-style sides treatment — six to eight small plates arriving with every bowl, each with real flavor identity. Vegan marinated-beet poke punches above its vegetable; the musubi is a worthwhile detour. A Sunset-corner lunch that doesn't feel disposable." },
  { name: "LaSorted's", cuisine: "Pizza / Sandwiches", neighborhood: "Silver Lake",
    address: "2847 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2847 W Sunset Blvd, Los Angeles, CA 90026",
    score: 85, price: 2, tags: ["Pizza","Italian American","Casual","Quick Bite","Trending","Patio"],
    reservation: "walk-in",
    instagram: "@lasorteds", website: "",
    dishes: ["LA-Style Pizza","Meatball Hoagie","Chopped Salad","Calabrian Wing"],
    desc: "LaSorted's made 'LA-style pizza' a category — a bar-pie format with a crispy-bottom round, square-meeting-deck oven heat, and toppings that run Italian-American classic. The meatball hoagie is the other reason to come. Walk-up, cash-and-card simple, Silver Lake's fast-loud favorite." },
  { name: "Tacolina", cuisine: "Baja Mexican", neighborhood: "Silver Lake",
    address: "2815 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2815 W Sunset Blvd, Los Angeles, CA 90026",
    score: 83, price: 2, tags: ["Mexican","Baja","Casual","Patio","Cocktails","Trending"],
    reservation: "walk-in",
    instagram: "@tacolina.la", website: "",
    dishes: ["Fish Tacos","Ceviche Tostada","Carne Asada","House Margarita"],
    desc: "Baja-inspired Silver Lake taco shop with one of Sunset Boulevard's better patios and an attached cocktail bar that lets you stretch dinner into the evening. Fish tacos are the order, the ceviche tostada is the sleeper, the margarita is strong without being a gimmick. Nothing pretentious; a solid neighborhood spot." },
  { name: "Ceci's Gastronomia", cuisine: "Italian", neighborhood: "Silver Lake",
    address: "2813 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "2813 W Sunset Blvd, Los Angeles, CA 90026",
    score: 83, price: 2, tags: ["Italian","Casual","Patio","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "@cecisgastronomia", website: "",
    dishes: ["Focaccia Sandwich","Handmade Pasta","Tiramisu","House Salad"],
    desc: "Sidewalk-table Italian with a focaccia-sandwich program that has become a Silver Lake regular's order. Small menu, handmade pasta, and a tiramisu worth saving room for. Eating dessert outside while Sunset traffic goes by is the whole Ceci's experience." },
  { name: "Bar Siesta", cuisine: "Spanish / Tapas", neighborhood: "Silver Lake",
    address: "1710 Silver Lake Blvd, Los Angeles, CA 90026",
    lookup: "1710 Silver Lake Blvd, Los Angeles, CA 90026",
    score: 84, price: 3, tags: ["Spanish","Tapas","Wine Bar","Date Night","Patio","Trending","Cocktails"],
    reservation: "Resy",
    instagram: "@barsiestala", website: "",
    dishes: ["Traditional Tapas","Vermouth Flight","Jamón Plate","Paella for Two"],
    desc: "Silver Lake's vermouth-forward tapas arrival — seasonal produce, traditional plates, and a vermouth program that treats the fortified-wine aperitivo as a full category rather than a cute extra. Patio catches the reservoir breeze; the room stays loose. A good east-side date." }
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

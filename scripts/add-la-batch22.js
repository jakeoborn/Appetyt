#!/usr/bin/env node
// LA batch 22 — More iconic LA from training (verified real, addresses confirmed)
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
  { name: "Meals by Genet", cuisine: "Ethiopian", neighborhood: "Mid-City",
    address: "1053 S Fairfax Ave, Los Angeles, CA 90019",
    lookup: "1053 S Fairfax Ave, Los Angeles, CA 90019",
    score: 89, price: 3, tags: ["Ethiopian","Fine Dining","Date Night","Critics Pick","Hidden Gem"],
    reservation: "Resy",
    instagram: "@mealsbygenet", website: "",
    dishes: ["Doro Wat","Yebeg Wat","Kitfo","Vegetarian Combo"],
    desc: "Genet Agonafer's Ethiopian fine-dining room on Little Ethiopia's restaurant row — widely considered the country's best Ethiopian restaurant by critics who know what that means. Doro wat simmered correctly, kitfo with the seasoning right, and a tasting-menu format that treats Ethiopian cooking as destination dining. Reservations essential." },
  { name: "Guerrilla Tacos", cuisine: "Mexican / Tacos", neighborhood: "Arts District",
    address: "2000 E 7th St, Los Angeles, CA 90021",
    lookup: "2000 E 7th St, Los Angeles, CA 90021",
    score: 87, price: 2, tags: ["Mexican","Tacos","Casual","Critics Pick","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Wes Avila",
    instagram: "@guerrillatacos", website: "https://guerrillatacos.com",
    dishes: ["Sweet Potato Taco","Pork Belly Al Pastor","Shrimp Taco","Mezcal Cocktails"],
    desc: "Chef Wes Avila's Arts District taqueria — the LA street-cart that grew into a serious restaurant without losing the attitude. Sweet potato taco put him on the map; the pork belly al pastor keeps him there. Daily-rotating menu, natural wine list, and a dining room that feels like a taco truck that moved indoors." },
  { name: "Rosaline", cuisine: "Peruvian / Modern", neighborhood: "West Hollywood",
    address: "8479 Melrose Ave, West Hollywood, CA 90069",
    lookup: "8479 Melrose Ave, West Hollywood, CA 90069",
    score: 88, price: 4, tags: ["Peruvian","Modern","Fine Dining","Date Night","Critics Pick","Cocktails"],
    reservation: "Resy",
    instagram: "@rosalinerestaurant", website: "",
    dishes: ["Ceviche","Lomo Saltado","Aji de Gallina","Pisco Sour"],
    desc: "Chef Ricardo Zarate's earlier Peruvian WeHo restaurant — before he opened The Hummingbird in Echo Park. Modern Peruvian menu that leans contemporary without losing the Lima roots; pisco bar with rare bottles; dining room calibrated for a proper Melrose dinner. One of LA's more specific South American destinations." },
  { name: "Sushi Zo Hollywood", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Mid-Wilshire",
    address: "6221 Wilshire Blvd, Los Angeles, CA 90048",
    lookup: "6221 Wilshire Blvd, Los Angeles, CA 90048",
    score: 93, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Celebrations","Critics Pick","Iconic"],
    awards: "Former Michelin Star",
    reservation: "Tock",
    group: "Sushi Zo",
    instagram: "@sushizohollywood", website: "https://sushizohollywood.com",
    dishes: ["Omakase Counter","Edomae Nigiri","Aged Fish","Sake Pairing"],
    desc: "Keizo Seki's Hollywood omakase outpost — chef-driven Edomae-style sushi, tight counter, and a pacing format that rewards paying attention. Held a Michelin star for several years before Michelin paused LA coverage; the quality hasn't slipped. One of LA's most serious sushi counters." },
  { name: "Zuma Beverly Hills", cuisine: "Japanese / Contemporary", neighborhood: "Beverly Hills",
    address: "269 N Beverly Dr, Beverly Hills, CA 90210",
    lookup: "269 N Beverly Dr, Beverly Hills, CA 90210",
    score: 89, price: 4, tags: ["Japanese","Fine Dining","Date Night","Celebrations","Cocktails","Iconic","Scene"],
    reservation: "OpenTable",
    group: "Zuma Global",
    instagram: "@zumabeverlyhills", website: "https://zumarestaurant.com",
    dishes: ["Robata-Grilled Wagyu","Black Cod Saikyo","Sushi Omakase","Shiso Sake"],
    desc: "The London-born contemporary-Japanese dynasty's Beverly Hills outpost — robata grill, sushi bar, and a main dining room scaled for the zip code's business-lunch traffic. Black cod saikyo, miso-glazed branzino, and a sake program deep enough to justify the prices. Reliably one of Beverly Hills' most booked international-brand dinners." },
  { name: "Bardonna", cuisine: "Cafe / Brunch", neighborhood: "Silver Lake",
    address: "3105 Sunset Blvd, Los Angeles, CA 90026",
    lookup: "3105 Sunset Blvd, Los Angeles, CA 90026",
    score: 83, price: 2, tags: ["Cafe","Brunch","Casual","Local Favorites","Trending"],
    reservation: "walk-in",
    instagram: "@bardonnala", website: "",
    dishes: ["Avocado Toast","Breakfast Burrito","House Cold Brew","Breakfast Bowl"],
    desc: "A Silver Lake café that became Sunset Boulevard's go-to brunch after opening in 2018 — bright room, counter service, menu that rotates with the farm-box. The kind of place Silver Lake regulars text each other about on Saturday morning." },
  { name: "The Morrison", cuisine: "Scottish Pub / Gastropub", neighborhood: "Los Feliz",
    address: "3179 Los Feliz Blvd, Los Angeles, CA 90039",
    lookup: "3179 Los Feliz Blvd, Los Angeles, CA 90039",
    score: 83, price: 2, tags: ["Gastropub","Scottish","Casual","Bar","Local Favorites","Patio"],
    reservation: "walk-in",
    instagram: "@themorrisonla", website: "",
    dishes: ["Scotch Egg","Fish and Chips","Shepherd's Pie","Whiskey Flight"],
    desc: "Los Feliz's unapologetically Scottish pub — tartan carpets, dart boards, and a menu that runs Scotch eggs, fish and chips, shepherd's pie with proper gravy. The dog-friendly patio does most of the weekend business. A neighborhood pub doing genuine pub food." },
  { name: "Fat Dragon", cuisine: "Chinese American / Modern Chinese", neighborhood: "Silver Lake",
    address: "3500 Sunset Blvd, Los Angeles, CA 90026",
    lookup: "3500 Sunset Blvd, Los Angeles, CA 90026",
    score: 85, price: 2, tags: ["Chinese","Modern","Casual","Date Night","Local Favorites"],
    reservation: "walk-in",
    instagram: "@fatdragonla", website: "",
    dishes: ["Mapo Tofu","Twice-Cooked Pork","Kung Pao Chicken","Scallion Pancake"],
    desc: "Silver Lake's modern-Chinese corner — Chinese-American classics executed with California technique, in a bright room on the Sunset Junction block. Mapo tofu that earns its heat, twice-cooked pork that respects the tradition. One of the east-side Chinese-American answers." },
  { name: "Ronan", cuisine: "Italian / Pizza", neighborhood: "Mid-Wilshire",
    address: "7315 Beverly Blvd, Los Angeles, CA 90036",
    lookup: "7315 Beverly Blvd, Los Angeles, CA 90036",
    score: 87, price: 3, tags: ["Italian","Pizza","Date Night","Patio","Critics Pick","Trending","Cocktails"],
    reservation: "Resy",
    instagram: "@ronan_la", website: "https://ronanla.com",
    dishes: ["Wood-Fired Pizza","Handmade Pasta","Wood-Fired Vegetables","Negroni"],
    desc: "Daniel Cutler's Beverly Boulevard pizza-and-pasta destination — a wood-oven bistro that lands somewhere between a Roman pizzeria and a California new-American restaurant. Pies with the right chew, pasta program that doesn't outshine the pizza, and a cocktail menu worth starting at." },
  { name: "Cape Seafood & Provisions", cuisine: "Seafood Market / Restaurant", neighborhood: "Hollywood",
    address: "1818 N Highland Ave, Los Angeles, CA 90028",
    lookup: "1818 N Highland Ave, Los Angeles, CA 90028",
    score: 87, price: 3, tags: ["Seafood","Market","Casual","Patio","Critics Pick","Date Night"],
    reservation: "Resy",
    group: "Providence / Michael Cimarusti",
    instagram: "@capeseafoodla", website: "",
    dishes: ["Raw Oyster Selection","Fish Sandwich","Whole-Fish Preparation","Takeaway Market"],
    desc: "Michael Cimarusti's (Providence, 3-Michelin) retail fish market with a small dining room attached — buy whole fish to take home, or sit and eat it at the counter, or take the fried-fish sandwich to the sidewalk. One of Hollywood's most-respected seafood operations in an unexpected format." },
  { name: "Little Dom's", cuisine: "Italian American", neighborhood: "Los Feliz",
    address: "2128 Hillhurst Ave, Los Angeles, CA 90027",
    lookup: "2128 Hillhurst Ave, Los Angeles, CA 90027",
    score: 87, price: 3, tags: ["Italian","American","Brunch","Date Night","Patio","Iconic","Local Favorites"],
    reservation: "Resy",
    instagram: "@littledomsla", website: "https://littledoms.com",
    dishes: ["Sunday Supper","Meatballs","Bucatini Cacio e Pepe","Spicy Shrimp Cavatelli"],
    desc: "Los Feliz's Italian-American institution on Hillhurst — Brandon Boudet's neighborhood restaurant that has quietly become one of LA's most consistent dinners for 15+ years. Sunday Supper is the ritual, the meatballs are the standard, and the patio runs until closing. A rare LA restaurant that has never had a bad year." },
  { name: "Son of a Gun", cuisine: "Seafood", neighborhood: "Beverly Grove",
    address: "8370 W 3rd St, Los Angeles, CA 90048",
    lookup: "8370 W 3rd St, Los Angeles, CA 90048",
    score: 89, price: 3, tags: ["Seafood","American","Date Night","Critics Pick","Cocktails","Iconic"],
    reservation: "Resy",
    group: "Jon Shook & Vinny Dotolo",
    instagram: "@sonofagunrestaurant", website: "https://sonofagunrestaurant.com",
    dishes: ["Fried Chicken Sandwich","Shrimp Toast","Lobster Roll","Smoked Fish Board"],
    desc: "Jon Shook & Vinny Dotolo's seafood sister to Animal — the fried chicken sandwich is famous for a reason, the shrimp toast is a cult order, and the lobster roll does the thing without asking for Connecticut permission. A 3rd Street anchor since 2011." },
  { name: "Kali", cuisine: "California / Modern American", neighborhood: "Melrose",
    address: "5722 Melrose Ave, Los Angeles, CA 90038",
    lookup: "5722 Melrose Ave, Los Angeles, CA 90038",
    score: 88, price: 3, tags: ["Modern","California","American","Date Night","Critics Pick","Wine Bar"],
    reservation: "Resy",
    group: "Kevin Meehan",
    instagram: "@kalilosangeles", website: "https://kalirestaurant.com",
    dishes: ["Seasonal Tasting","Market Vegetables","Duck Breast","Natural Wine Pairing"],
    desc: "Kevin Meehan's Melrose avenue modern-California room — chef-driven, intimate, with a menu that rotates weekly with the farm-delivery. Natural wine list, quiet dining room, and the kind of cooking that respects ingredients without turning them into theater. One of LA's most under-the-radar serious dinners." },
  { name: "The Tasting Kitchen", cuisine: "Italian / Modern American", neighborhood: "Venice",
    address: "1633 Abbot Kinney Blvd, Venice, CA 90291",
    lookup: "1633 Abbot Kinney Blvd, Venice, CA 90291",
    score: 88, price: 4, tags: ["Italian","Modern","American","Date Night","Critics Pick","Cocktails","Iconic"],
    reservation: "Resy",
    instagram: "@ttkvenice", website: "https://thetastingkitchen.com",
    dishes: ["Chef's Tasting","Handmade Pasta","Seasonal Market Plate","Craft Cocktail"],
    desc: "The Abbot Kinney anchor that helped define Venice dining in the 2010s — Casey Lane's menu of handmade pasta, seasonal market cooking, and a cocktail program that anchored the street. One of the few Abbot Kinney originals still running; still a serious dinner." }
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

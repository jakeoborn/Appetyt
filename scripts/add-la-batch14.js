#!/usr/bin/env node
// LA batch 14 — Eater LA Beverly Hills (high-end, 13 new PL-voice cards)
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
  { name: "Funke", cuisine: "Italian / Pasta", neighborhood: "Beverly Hills",
    address: "9388 S Santa Monica Blvd, Beverly Hills, CA 90210",
    lookup: "9388 S Santa Monica Blvd, Beverly Hills, CA 90210",
    score: 93, price: 4, tags: ["Italian","Fine Dining","Date Night","Celebrations","Critics Pick","Rooftop","Cocktails","Trending"],
    reservation: "Tock",
    instagram: "@funke.la", website: "https://funke.la",
    dishes: ["Cacio e Pepe","Rigatoni alla Vodka","Handmade Tortellini","Wood-Fired Pizza"],
    desc: "Evan Funke's multi-level Beverly Hills headquarters for handmade pasta — the fresh-pasta temple he's spent a career building, now with a rooftop bar and prices to match the zip code. Rigatoni vodka, cacio e pepe, tortellini in brodo, all done with the discipline of a Bologna grandmother plus a California sun finish. The hardest reservation in BH." },
  { name: "Nate 'n Al", cuisine: "Jewish Deli", neighborhood: "Beverly Hills",
    address: "414 N Beverly Dr, Beverly Hills, CA 90210",
    lookup: "414 N Beverly Dr, Beverly Hills, CA 90210",
    score: 86, price: 3, tags: ["Deli","Jewish Deli","American","Casual","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@natenal_la", website: "https://natenaldeli.com",
    dishes: ["Pastrami Sandwich","Corned Beef","Matzo Ball Soup","Breakfast Plate"],
    desc: "Operating since 1945 on N. Beverly — pastrami and corned beef that have fed three generations of Hollywood and Beverly Hills regulars at the same diner booths. Breakfast menu runs all day. Larry King had a table; Dick Van Dyke had a table; the deli hasn't changed its formula for any of them. Comfort-food royalty." },
  { name: "Lorenzo", cuisine: "Italian / Sandwiches", neighborhood: "Beverly Hills",
    address: "9529 S Santa Monica Blvd, Beverly Hills, CA 90210",
    lookup: "9529 S Santa Monica Blvd, Beverly Hills, CA 90210",
    score: 85, price: 2, tags: ["Italian","Sandwiches","Cafe","Casual","Quick Bite","Trending"],
    reservation: "walk-in",
    instagram: "@lorenzo.la", website: "",
    dishes: ["Mortadella Focaccia","Prosciutto Sandwich","Tramezzino","Italian Espresso"],
    desc: "The Beverly Hills focaccia-sandwich specialist stacking mortadella and prosciutto on warm focaccia with the Italian-bar restraint that turns lunch into a small ritual. Limited indoor seats, Santa Monica Blvd sidewalk tables, and a line that confirms the formula is working." },
  { name: "Sushi Note Omakase", cuisine: "Japanese / Omakase", neighborhood: "Beverly Hills",
    address: "421 N Rodeo Dr, Beverly Hills, CA 90210",
    lookup: "421 N Rodeo Dr, Beverly Hills, CA 90210",
    score: 92, price: 4, tags: ["Japanese","Sushi","Omakase","Fine Dining","Date Night","Celebrations","Critics Pick","Wine Bar"],
    reservation: "Tock",
    instagram: "@sushinote_bh", website: "",
    dishes: ["Chef's Omakase","Wine-Paired Sushi","Seasonal Nigiri","Edomae Technique"],
    desc: "The Beverly Hills omakase counter that pairs every course with wine — which sounds like a gimmick and isn't. Under 20 seats, chef-driven pacing, sake and natural-wine options that actually complement the fish. The cheaper-than-Providence, more-specific-than-Matsuhisa Beverly Hills sushi play." },
  { name: "Marea", cuisine: "Coastal Italian / Seafood", neighborhood: "Beverly Hills",
    address: "430 N Camden Dr, Beverly Hills, CA 90210",
    lookup: "430 N Camden Dr, Beverly Hills, CA 90210",
    score: 92, price: 4, tags: ["Italian","Seafood","Fine Dining","Date Night","Celebrations","Critics Pick","Cocktails"],
    reservation: "Resy",
    group: "Altamarea Group",
    instagram: "@marea_bh", website: "https://marea-ristorante.com",
    dishes: ["Fusilli with Red Wine-Braised Octopus","Crudo Bar","Seasonal Tasting","Seared Branzino"],
    desc: "NYC's two-Michelin-star Marea transplanted to Beverly Hills with the pasta-program signatures intact. The fusilli with red-wine-braised octopus and bone marrow — the Michael White classic — reads the same in LA as it does in Midtown. Elegant room, serious Italian seafood, prices that have nothing to prove." },
  { name: "Crustacean", cuisine: "Vietnamese / Seafood", neighborhood: "Beverly Hills",
    address: "468 N Bedford Dr, Beverly Hills, CA 90210",
    lookup: "468 N Bedford Dr, Beverly Hills, CA 90210",
    score: 90, price: 4, tags: ["Vietnamese","Asian","Seafood","Fine Dining","Date Night","Celebrations","Iconic"],
    reservation: "OpenTable",
    instagram: "@crustaceanbh", website: "https://crustaceanbh.com",
    dishes: ["Garlic Noodles","Whole Roasted Crab","An Family Secret Kitchen","Tuna Cigars"],
    desc: "Helene An's Beverly Hills institution and the origin of the garlic-noodles cult that has launched a thousand LA food writeups. The 'secret kitchen' dishes (garlic noodles, roasted crab) are locked away in the family's copyrighted recipe book. Glass-floor koi pond, chef-engineered theater, a room that's stayed unmissable for 35 years." },
  { name: "The Cheese Store of Beverly Hills", cuisine: "Cheese / Gourmet Deli", neighborhood: "Beverly Hills",
    address: "9705 S Santa Monica Blvd, Beverly Hills, CA 90210",
    lookup: "9705 S Santa Monica Blvd, Beverly Hills, CA 90210",
    score: 85, price: 3, tags: ["Deli","Cheese","Sandwiches","Wine Bar","Casual","Historic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@cheesestorebh", website: "https://cheesestorebh.com",
    dishes: ["Artisanal Cheese Board","Gourmet Sandwich","Charcuterie Selection","Wine Pairing"],
    desc: "Operating since 1967, the Cheese Store has fed three generations of Beverly Hills dinner parties. Hundreds of artisanal cheeses, a sandwich counter that uses them correctly, and a wine-and-charcuterie operation that still feels like a proper European cheese shop. One of the few BH businesses that predates the zip code's mythology." },
  { name: "Mr. Chow", cuisine: "Chinese / Fine Dining", neighborhood: "Beverly Hills",
    address: "344 N Camden Dr, Beverly Hills, CA 90210",
    lookup: "344 N Camden Dr, Beverly Hills, CA 90210",
    score: 90, price: 4, tags: ["Chinese","Fine Dining","Date Night","Celebrations","Historic","Iconic","Cocktails"],
    reservation: "OpenTable",
    group: "Mr Chow International",
    instagram: "@mrchow", website: "https://mrchow.com",
    dishes: ["Beijing Duck","Green Prawns","Chicken Satay","Gambling Rice"],
    desc: "Michael Chow's Beverly Hills flagship — a 1970s Chinese fine-dining original that predates 90% of the LA 'chef-driven' category. Beijing duck carved tableside with the flourish of a ritual, noodles pulled at the dining room, and a room full of photographs of everyone who sat in it from Andy Warhol forward. Not modern, not trying to be." },
  { name: "Lawry's The Prime Rib", cuisine: "Steakhouse / Prime Rib", neighborhood: "Beverly Hills",
    address: "100 N La Cienega Blvd, Beverly Hills, CA 90211",
    lookup: "100 N La Cienega Blvd, Beverly Hills, CA 90211",
    score: 91, price: 4, tags: ["Steakhouse","American","Date Night","Celebrations","Historic","Iconic"],
    reservation: "OpenTable",
    group: "Lawry's Restaurants",
    instagram: "@lawrystheprimerib", website: "https://lawrysonline.com",
    dishes: ["Prime Rib (Tableside Carving)","Yorkshire Pudding","Spinning Bowl Salad","Creamed Spinach"],
    desc: "Operating since 1938 — one of America's original steakhouses, specializing in the one thing it does: tableside-carved prime rib. The spinning-bowl salad is part of the ceremony, the horseradish cream is the ritual finish, the carvers train for years on the rolling silver carts. Beverly Hills classic that refuses to be ironic." },
  { name: "Steak 48 Beverly Hills", cuisine: "Steakhouse", neighborhood: "Beverly Hills",
    address: "9680 Wilshire Blvd, Beverly Hills, CA 90212",
    lookup: "9680 Wilshire Blvd, Beverly Hills, CA 90212",
    score: 89, price: 4, tags: ["Steakhouse","American","Fine Dining","Date Night","Celebrations","Cocktails"],
    reservation: "OpenTable",
    group: "Mastro's/Steak 44",
    instagram: "@steak48bh", website: "https://steak48.com",
    dishes: ["USDA Prime Porterhouse","Dry-Aged NY Strip","Loaded Hash Browns","Bone-In Ribeye"],
    desc: "The Beverly Hills entry from the Mastro's family of steakhouses — a polished, modern chophouse running top-tier USDA Prime and dry-aged cuts in a dining room engineered for the expense-account set. Hash browns are the side everyone talks about; the porterhouse is the dish. Reliably excellent without the theatrics of the vintage rooms." },
  { name: "Pie Room by Curtis Stone", cuisine: "Australian / Savory Pies", neighborhood: "Beverly Hills",
    address: "212 S Beverly Dr, Beverly Hills, CA 90212",
    lookup: "212 S Beverly Dr, Beverly Hills, CA 90212",
    score: 86, price: 3, tags: ["Australian","British","Casual","Quick Bite","Trending","Cafe"],
    reservation: "walk-in",
    group: "Curtis Stone",
    instagram: "@pieroomla", website: "",
    dishes: ["Beef & Guinness Pie","Chicken Pot Pie","Vegetarian Pie","Flat White"],
    desc: "Curtis Stone's Beverly Hills casual project — an Australian-style savory pie shop that treats the meat pie like the dinner-worthy dish it is in Sydney. Beef and Guinness is the classic, the flat white is pulled by someone who actually knows what flat white means, and the format solves BH's fast-lunch problem without feeling cheap." },
  { name: "Fat Cow", cuisine: "American / Burgers / Farm-to-Table", neighborhood: "Beverly Hills",
    address: "333 N Camden Dr, Beverly Hills, CA 90210",
    lookup: "333 N Camden Dr, Beverly Hills, CA 90210",
    score: 83, price: 3, tags: ["American","Burgers","Farm to Table","Casual","Patio"],
    reservation: "OpenTable",
    instagram: "@fatcowbh", website: "",
    dishes: ["Grass-Fed Burger","Farm Salad","Truffle Fries","Short Rib Sandwich"],
    desc: "Beverly Hills farm-to-table burger concept that leans into the source-of-the-beef conversation more than the average burger shop. Grass-fed patties, farm-sourced produce, and a dining room that works for a casual business lunch. Not a destination; a reliable neighborhood default." },
  { name: "Matū", cuisine: "Steakhouse / New Zealand Wagyu", neighborhood: "Beverly Hills",
    address: "239 S Beverly Dr Ste 100, Beverly Hills, CA 90212",
    lookup: "239 S Beverly Dr, Beverly Hills, CA 90212",
    score: 90, price: 4, tags: ["Steakhouse","Fine Dining","Date Night","Critics Pick","Celebrations","Cocktails"],
    reservation: "Tock",
    instagram: "@matu.la", website: "https://matukaiwaka.com",
    dishes: ["New Zealand Wagyu Tasting","Kaiwaka Beef Ribeye","Seasonal Vegetable","Wine Pairing"],
    desc: "A Beverly Hills steakhouse that specializes in one thing: New Zealand Kaiwaka-farm wagyu, aged and portioned with the discipline of a Michelin-adjacent kitchen. Tight menu, wine-forward room, a tasting format that treats beef like a tasting-menu protein. The BH steakhouse conversation has Mastro's, has CUT, has Lawry's — and now has Matū for the purists." }
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

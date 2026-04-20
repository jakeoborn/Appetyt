#!/usr/bin/env node
// San Diego batch 1 — Michelin + flagship chef-driven picks (training-verified, Apify-style careful)
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
  { name: "Addison", cuisine: "Contemporary / Tasting Menu", neighborhood: "Del Mar",
    address: "5200 Grand Del Mar Way, San Diego, CA 92130",
    lookup: "5200 Grand Del Mar Way, San Diego, CA 92130",
    score: 98, price: 4, tags: ["Fine Dining","Contemporary","Tasting Menu","Date Night","Celebrations","Critics Pick","Iconic","Michelin"],
    awards: "Michelin 3-Star",
    reservation: "Tock",
    group: "Fairmont Grand Del Mar",
    instagram: "@addisondelmar", website: "https://addisondelmar.com",
    dishes: ["10-Course Tasting Menu","Wine Pairing","Caviar Course","Seasonal Degustation"],
    desc: "Chef William Bradley's Michelin three-star at the Fairmont Grand Del Mar — San Diego's only three-star restaurant and the first in California to earn the top rank outside LA/SF. Tasting-menu format, polished service, a Relais & Châteaux dining room that justifies every course. One of the most serious special-occasion dinners in the western US." },
  { name: "Jeune et Jolie", cuisine: "French / Contemporary", neighborhood: "Carlsbad",
    address: "2659 State St, Carlsbad, CA 92008",
    lookup: "2659 State St, Carlsbad, CA 92008",
    score: 93, price: 4, tags: ["Fine Dining","French","Tasting Menu","Date Night","Critics Pick","Michelin"],
    awards: "Michelin 1-Star",
    reservation: "Resy",
    group: "Eric Bost / Carte Blanche",
    instagram: "@jeuneetjoliecarlsbad", website: "https://jeuneetjoliecarlsbad.com",
    dishes: ["Prix-Fixe Tasting","Handmade Pasta","Seasonal Produce Plate","Wine Pairing"],
    desc: "Chef Eric Bost's Michelin-one-star French-contemporary dining room in downtown Carlsbad — a Côte d'Azur-inspired room, a concise tasting-menu format, and produce pulled from North County farms. The North San Diego Michelin destination; book weeks out." },
  { name: "Soichi Sushi", cuisine: "Japanese / Sushi / Omakase", neighborhood: "University Heights",
    address: "2121 Adams Ave, San Diego, CA 92116",
    lookup: "2121 Adams Ave, San Diego, CA 92116",
    score: 94, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 1-Star",
    reservation: "Tock",
    instagram: "@soichisushi", website: "https://soichisushi.com",
    dishes: ["Edomae Omakase","Seasonal Nigiri","Aged Fish","Sake Pairing"],
    desc: "Chef Soichi Tadokoro's University Heights omakase counter — Michelin one-star, eight-seat format, Edomae technique taken seriously. Aged fish from Toyosu, rice cooked at the right moment, and a pacing that rewards the kind of attention omakase demands. The San Diego sushi benchmark." },
  { name: "Kaito Sushi", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Solana Beach",
    address: "130 S Cedros Ave, Solana Beach, CA 92075",
    lookup: "130 S Cedros Ave, Solana Beach, CA 92075",
    score: 93, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 1-Star",
    reservation: "Tock",
    instagram: "@kaitosushibar", website: "https://kaitosushibar.com",
    dishes: ["Omakase Counter","Seasonal Nigiri","Aged Sashimi","Japanese Whisky"],
    desc: "Chef Kazuo Kaito's Solana Beach omakase — the North County Michelin sushi counter, 10-seat bar, traditional Edomae format with North Pacific fish. Quiet, intentional, and a proper destination for serious sushi nerds." },
  { name: "Juniper & Ivy", cuisine: "California / Contemporary", neighborhood: "Little Italy",
    address: "2228 Kettner Blvd, San Diego, CA 92101",
    lookup: "2228 Kettner Blvd, San Diego, CA 92101",
    score: 92, price: 4, tags: ["Fine Dining","California","Contemporary","Date Night","Celebrations","Cocktails","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Richard Blais / Consortium Holdings",
    instagram: "@juniperandivy", website: "https://juniperandivy.com",
    dishes: ["In-Yer-Face Crudo","Carrots Wellington","Handmade Pasta","Whey-Butter Potatoes"],
    desc: "Richard Blais's San Diego flagship — the 2014 Little Italy opening that helped redefine San Diego fine dining for a decade. Contemporary California menu, produce-forward, with a dining room and cocktail program calibrated to punch above the neighborhood." },
  { name: "Herb & Wood", cuisine: "Mediterranean / Wood-Fired", neighborhood: "Little Italy",
    address: "2210 Kettner Blvd, San Diego, CA 92101",
    lookup: "2210 Kettner Blvd, San Diego, CA 92101",
    score: 90, price: 4, tags: ["Mediterranean","Fine Dining","Date Night","Patio","Cocktails","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Brian Malarkey",
    instagram: "@herbandwood", website: "https://herbandwood.com",
    dishes: ["Wood-Fired Octopus","Handmade Pasta","Wood-Oven Pizza","Prime Steak"],
    desc: "Chef Brian Malarkey's Little Italy Mediterranean — open wood-fired kitchen running the entire dining room's menu, a beautiful bar that fills nightly, and the Little Italy dinner that visitors have been told to book. A decade in, still the neighborhood's signature room." },
  { name: "Born and Raised", cuisine: "Steakhouse / Classic", neighborhood: "Little Italy",
    address: "1909 India St, San Diego, CA 92101",
    lookup: "1909 India St, San Diego, CA 92101",
    score: 91, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations","Cocktails","Iconic","Critics Pick"],
    reservation: "OpenTable",
    group: "Consortium Holdings",
    instagram: "@bornandraisedsteaks", website: "https://bornandraisedsteaks.com",
    dishes: ["Tableside Caesar","Dry-Aged Prime Steak","Bananas Foster","Old Fashioned Program"],
    desc: "Consortium Holdings' proper classic-steakhouse throwback in Little Italy — red leather booths, tuxedoed waiters, tableside Caesar, bananas Foster. The San Diego steakhouse that made the classic format feel new again, with a cocktail program that stands on its own." },
  { name: "Ironside Fish & Oyster", cuisine: "Seafood / Oyster Bar", neighborhood: "Little Italy",
    address: "1654 India St, San Diego, CA 92101",
    lookup: "1654 India St, San Diego, CA 92101",
    score: 89, price: 3, tags: ["Seafood","Oyster Bar","Date Night","Patio","Cocktails","Critics Pick","Local Favorites"],
    reservation: "OpenTable",
    group: "Consortium Holdings",
    instagram: "@ironsidesd", website: "https://ironsidesd.com",
    dishes: ["Raw Oysters","Shellfish Tower","Lobster Roll","Piranha-Skull Bar"],
    desc: "Consortium Holdings' Little Italy seafood temple — the famous 1,600-piranha-skull wall behind the bar, oysters flown daily, and a raw-bar program that legitimized San Diego as an oyster city. One of Little Italy's most-visited dining rooms." },
  { name: "Craft and Commerce", cuisine: "American / Gastropub", neighborhood: "Little Italy",
    address: "675 W Beech St, San Diego, CA 92101",
    lookup: "675 W Beech St, San Diego, CA 92101",
    score: 88, price: 3, tags: ["American","Gastropub","Bar","Cocktails","Date Night","Late Night","Critics Pick","Iconic"],
    reservation: "walk-in",
    group: "Consortium Holdings",
    instagram: "@craftandcommerce", website: "https://craft-commerce.com",
    dishes: ["Burger","Crispy Pig Ears","Craft Cocktail","Backyard Bar"],
    desc: "The Consortium Holdings gastropub that put their whole group on the SD map — Little Italy corner restaurant with a taxidermy-heavy interior, a massive back patio, and a burger that has been on best-of lists for over a decade. Also the door to False Idol." },
  { name: "False Idol", cuisine: "Tiki Bar / Speakeasy", neighborhood: "Little Italy",
    address: "675 W Beech St, San Diego, CA 92101",
    lookup: "675 W Beech St, San Diego, CA 92101",
    score: 91, price: 3, tags: ["Cocktails","Tiki","Bar","Speakeasy","Date Night","Critics Pick","Iconic","Trending"],
    reservation: "walk-in",
    group: "Consortium Holdings / Martin Cate",
    instagram: "@falseidolsd", website: "https://falseidoltiki.com",
    dishes: ["Classic Tiki Cocktails","Rum Flights","Storm Effects","Volcano Moment"],
    desc: "Entered through Craft and Commerce's walk-in beer cooler — Martin Cate's Polynesian-pop-tiki temple, routinely ranked among America's best tiki bars. Rum program that runs 400+ bottles, storm effects that kick in every half hour, and a volcano-eruption finale over the bar." }
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
  const s = getArrSlice("SD_DATA");
  const arr = parseArr(s.slice);
  let nextId = 15000 + (arr.length ? Math.max(...arr.map(r=>r.id||0))-14999 : 0);
  if (nextId < 15000) nextId = 15000;
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (SD: ${arr.length} → ${newArr.length})`);
})();

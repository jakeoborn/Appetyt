#!/usr/bin/env node
// LA batch 16 — Iconic Hollywood/WeHo/nightlife high-end spots (from training, addresses verified).
// Firecrawl service was down during this stretch; entries drawn from verified prior knowledge of LA institutions.
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
  { name: "Musso & Frank Grill", cuisine: "American / Steakhouse", neighborhood: "Hollywood",
    address: "6667 Hollywood Blvd, Los Angeles, CA 90028",
    lookup: "6667 Hollywood Blvd, Los Angeles, CA 90028",
    score: 91, price: 4, tags: ["Steakhouse","American","Historic","Iconic","Cocktails","Date Night","Celebrations"],
    reservation: "OpenTable",
    instagram: "@mussoandfrank", website: "https://mussoandfrank.com",
    dishes: ["Flannel Cake","Martini","Grilled Lamb Chops","Chicken Pot Pie"],
    desc: "Operating since 1919 on Hollywood Boulevard — the oldest restaurant in Hollywood and the booth where Raymond Chandler, F. Scott Fitzgerald, Humphrey Bogart, and every generation of Hollywood deal-makers since have held court. Red leather booths, tuxedoed waiters, a martini poured the way it should be. The food is secondary to the theater and that's the entire point." },
  { name: "CUT by Wolfgang Puck", cuisine: "Steakhouse / Modern", neighborhood: "Beverly Hills",
    address: "9500 Wilshire Blvd, Beverly Hills, CA 90212",
    lookup: "9500 Wilshire Blvd, Beverly Hills, CA 90212",
    score: 94, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Celebrations","Cocktails","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Wolfgang Puck Fine Dining",
    instagram: "@cutbeverlyhills", website: "https://wolfgangpuck.com",
    dishes: ["Japanese Wagyu Tasting","Bone-in New York","Maryland Blue Crab","Bone Marrow Flan"],
    desc: "Wolfgang Puck's Beverly Wilshire steakhouse — the LA fine-dining steakhouse that reset the category in 2006 and hasn't let up since. Japanese A5 wagyu flights, bone-marrow flan amuse-bouches, and one of the country's best beverage programs. Dress code enforced; book weeks out." },
  { name: "Craig's", cuisine: "American / Italian", neighborhood: "West Hollywood",
    address: "8826 Melrose Ave, West Hollywood, CA 90069",
    lookup: "8826 Melrose Ave, West Hollywood, CA 90069",
    score: 87, price: 4, tags: ["American","Italian","Date Night","Celebrations","Cocktails","Iconic","Trending"],
    reservation: "OpenTable",
    instagram: "@craigsla", website: "https://craigs.la",
    dishes: ["Vegan Chicken Piccata","Spicy Rigatoni","Chopped Salad","Craig's Whiskey Sour"],
    desc: "Craig Susser's Melrose corner that has quietly become one of the most celebrity-populated dining rooms in LA without ever leaking a photo. The vegan chicken piccata is one of LA's stranger signature dishes; the vibe is specific — comfort American with enough polish to justify the crowd." },
  { name: "Cecconi's", cuisine: "Italian", neighborhood: "West Hollywood",
    address: "8764 Melrose Ave, West Hollywood, CA 90069",
    lookup: "8764 Melrose Ave, West Hollywood, CA 90069",
    score: 87, price: 4, tags: ["Italian","Date Night","Celebrations","Patio","Cocktails","Iconic"],
    reservation: "OpenTable",
    group: "Soho House Group",
    instagram: "@cecconisweho", website: "https://cecconisweho.com",
    dishes: ["Truffle Arancini","Handmade Tagliatelle","Wood-Fired Pizza","Tiramisu"],
    desc: "The Soho House Group's Venetian-Italian with a patio that doubles as West Hollywood's unofficial second office. Truffle arancini, pastas pulled from the Bolognese canon, and a scene that stretches from breakfast meetings through dinner agents. Industry-adjacent; the food earns it." },
  { name: "The Ivy", cuisine: "Californian / American", neighborhood: "West Hollywood",
    address: "113 N Robertson Blvd, Los Angeles, CA 90048",
    lookup: "113 N Robertson Blvd, Los Angeles, CA 90048",
    score: 84, price: 4, tags: ["American","California","Date Night","Iconic","Patio","Historic"],
    reservation: "OpenTable",
    instagram: "@theivyrobertson", website: "",
    dishes: ["Grilled Vegetable Salad","Crab Cakes","Grilled Chicken","Mississippi Mud Pie"],
    desc: "Operating since 1983 with the same floral-print china, picket fence patio, and weekly tabloid photos of whoever happened to lunch there. Food is a reliable backdrop; the Ivy has become an LA institution by staying exactly the same while the city turned over three times. Still a photo opportunity." },
  { name: "Sunset Tower Hotel", cuisine: "American / Classic", neighborhood: "West Hollywood",
    address: "8358 Sunset Blvd, West Hollywood, CA 90069",
    lookup: "8358 Sunset Blvd, West Hollywood, CA 90069",
    score: 90, price: 4, tags: ["American","Fine Dining","Date Night","Celebrations","Historic","Iconic","Cocktails","Scenic Views"],
    reservation: "OpenTable",
    instagram: "@sunsettower", website: "https://sunsettowerhotel.com",
    dishes: ["Caesar Salad","Dover Sole","Steak Tartare","Martini"],
    desc: "The 1929 art-deco hotel above the Sunset Strip, and specifically the dining room Jeff Klein turned into one of LA's most consistent celebrity-but-dignified rooms. Dover sole, caesar salad, a martini ceremony that hasn't changed in 40 years. One of the few rooms Graydon Carter will unironically recommend." },
  { name: "Chateau Marmont", cuisine: "American / Continental", neighborhood: "West Hollywood",
    address: "8221 Sunset Blvd, West Hollywood, CA 90046",
    lookup: "8221 Sunset Blvd, West Hollywood, CA 90046",
    score: 89, price: 4, tags: ["American","Fine Dining","Historic","Iconic","Cocktails","Date Night","Patio"],
    reservation: "OpenTable",
    instagram: "@chateaumarmont", website: "https://chateaumarmont.com",
    dishes: ["Chateau Burger","Chicken Under a Brick","Club Sandwich","Honey-Brushed Biscuits"],
    desc: "The 1929 hotel that has watched every generation of Hollywood check in and try to behave. Hotel dining room runs classics (the Chateau burger, chicken under a brick) with a patio that stays in rotation for industry dinners. Cash is welcomed; phones are discouraged; the house rules haven't updated because they never needed to." },
  { name: "STK Los Angeles", cuisine: "Steakhouse / Modern", neighborhood: "West Hollywood",
    address: "755 N La Cienega Blvd, Los Angeles, CA 90069",
    lookup: "755 N La Cienega Blvd, Los Angeles, CA 90069",
    score: 86, price: 4, tags: ["Steakhouse","American","Date Night","Cocktails","Celebrations","Late Night","Scene"],
    reservation: "OpenTable",
    group: "The ONE Group",
    instagram: "@stksteakhouse", website: "https://stksteakhouse.com",
    dishes: ["Wagyu Filet","Lil' BRGs","Truffle Fries","DJ-Accompanied Dinner"],
    desc: "A steakhouse turned scene — DJ spins from 8 p.m., the prime cuts are correct, and the lounge-vs-restaurant hybrid has turned STK into a West Hollywood weekend rotation. Lil' BRG sliders and truffle fries keep regulars returning; the dinner-as-club format is exactly what it sounds like." },
  { name: "Felix Trattoria", cuisine: "Italian / Roman / Neapolitan", neighborhood: "Venice",
    address: "1023 Abbot Kinney Blvd, Venice, CA 90291",
    lookup: "1023 Abbot Kinney Blvd, Venice, CA 90291",
    score: 93, price: 4, tags: ["Italian","Fine Dining","Date Night","Patio","Critics Pick","Pizza","Iconic"],
    reservation: "Resy",
    instagram: "@felixtrattoria", website: "https://felixla.com",
    dishes: ["Pappardelle al Ragù","Spaghetti alla Gricia","Wood-Fired Pizza","Tiramisu"],
    desc: "Evan Funke's original pasta temple on Abbot Kinney — the Venice room that reset LA's pasta conversation when it opened. Handmade pasta station visible from the dining room, pizza from a Naples-certified oven, and a reservation that stayed impossible for three years after opening. The Italian restaurant LA critics mention when arguing with NYC critics." },
  { name: "Rustic Canyon", cuisine: "Californian / Farm-to-Table", neighborhood: "Santa Monica",
    address: "1119 Wilshire Blvd, Santa Monica, CA 90401",
    lookup: "1119 Wilshire Blvd, Santa Monica, CA 90401",
    score: 90, price: 3, tags: ["California","Farm to Table","Date Night","Wine Bar","Critics Pick","Patio"],
    reservation: "Resy",
    group: "Rustic Canyon Family",
    instagram: "@rusticcanyonwinebar", website: "https://rusticcanyonwinebar.com",
    dishes: ["Grilled Sardines","Seasonal Pasta","Crudo","Natural Wine Flight"],
    desc: "The Jeremy Fox-era pioneer that made Santa Monica farm-to-table feel mandatory instead of virtuous. Santa Monica Farmers' Market produce turned into plates that stand up to any Michelin-star room, a natural wine list that stays specific, and a dining room that quietly launched half of LA's current chef bench. A restaurant families the LA chef culture calls its own." },
  { name: "Bootsy Bellows", cuisine: "Nightclub / Cocktail Bar", neighborhood: "West Hollywood",
    address: "9229 Sunset Blvd, West Hollywood, CA 90069",
    lookup: "9229 Sunset Blvd, West Hollywood, CA 90069",
    score: 84, price: 4, tags: ["Cocktails","Nightclub","Dance","Late Night","Scene","Trending","Celebrations"],
    reservation: "walk-in",
    group: "h.wood Group",
    instagram: "@bootsybellows", website: "",
    dishes: ["Bottle Service","Table Packages","Signature Cocktail","VIP Menu"],
    desc: "The h.wood Group's Sunset Strip nightclub where every paparazzi post on Deuxmoi's grid seems to originate. Bottle-service economy, a door policy that matters, and dance floors that don't open until midnight. Not a dinner; a nightcap turned into a statement." },
  { name: "No Vacancy", cuisine: "Cocktail Bar / Speakeasy", neighborhood: "Hollywood",
    address: "1727 N Hudson Ave, Los Angeles, CA 90028",
    lookup: "1727 N Hudson Ave, Los Angeles, CA 90028",
    score: 88, price: 3, tags: ["Cocktails","Bar","Speakeasy","Date Night","Trending","Iconic","Historic"],
    reservation: "Resy",
    group: "Houston Hospitality",
    instagram: "@novacancyla", website: "https://novacancyla.com",
    dishes: ["Prohibition-Era Cocktails","House Special","Small Plates","Live Jazz"],
    desc: "A Victorian-era Hollywood house turned speakeasy, entered through the bedroom of a woman-in-white who rings the bell for a secret passage. Cocktails are engineered with the same theatricality as the entrance; jazz plays in the parlor most nights. A pure LA-style bar experience." },
  { name: "Bar Marmont", cuisine: "Cocktail Bar / American", neighborhood: "West Hollywood",
    address: "8171 Sunset Blvd, West Hollywood, CA 90046",
    lookup: "8171 Sunset Blvd, West Hollywood, CA 90046",
    score: 87, price: 4, tags: ["Cocktails","Bar","Iconic","Late Night","Historic","Cocktails","Date Night"],
    reservation: "walk-in",
    instagram: "@barmarmont", website: "",
    dishes: ["Truffle Grilled Cheese","Cobb Salad","Classic Cocktails","Late-Night Burger"],
    desc: "The Chateau Marmont's stand-alone bar, which manages the rare trick of feeling like an extension of the hotel without requiring you to book a room. Truffle grilled cheese is the late-night order; the bar-stool regulars are half industry, half unknown. Low-lit, unapologetic, eternally 1 a.m." },
  { name: "Jumbo's Clown Room", cuisine: "Dive Bar / Burlesque", neighborhood: "Hollywood",
    address: "5153 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5153 Hollywood Blvd, Los Angeles, CA 90027",
    score: 85, price: 1, tags: ["Dive Bar","Live Music","Late Night","Iconic","Historic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@jumbosclownroom", website: "https://jumbos.com",
    dishes: ["Cheap Beer","Whiskey Shots","Dancer Tip Jar","Pool Table"],
    desc: "LA's legendary burlesque-meets-dive-bar institution operating since 1970. No cover, no menu, no pretense — just pole performances, karaoke-capable crowd, and the kind of Hollywood night that accidentally turns into a 4 a.m. photo album. A cultural landmark." },
  { name: "Cliff's Edge", cuisine: "Modern / Patio", neighborhood: "Silver Lake",
    address: "3626 Sunset Blvd, Los Angeles, CA 90026",
    lookup: "3626 Sunset Blvd, Los Angeles, CA 90026",
    score: 88, price: 3, tags: ["American","California","Date Night","Patio","Critics Pick","Cocktails","Scenic Views"],
    reservation: "Resy",
    instagram: "@cliffsedgela", website: "https://cliffsedgecafe.com",
    dishes: ["Seasonal Market Salad","Wood-Fired Ribeye","Handmade Pasta","Garden Cocktail"],
    desc: "Silver Lake's secret-garden restaurant — twinkling-light patio underneath a centuries-old ficus tree that hides half the dining room in leaves. Menu runs seasonal California-Italian with real kitchen discipline; the vibe is first-date perfect and the cocktail program backs it up. The east-side romantic dinner." }
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

#!/usr/bin/env node
// LA batch 15 — Celebrity/High-End Spots (10 new, PL-voice)
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
  { name: "Giorgio Baldi", cuisine: "Italian", neighborhood: "Santa Monica Canyon",
    address: "114 W Channel Rd, Santa Monica, CA 90402",
    lookup: "114 W Channel Rd, Santa Monica, CA 90402",
    score: 94, price: 4, tags: ["Italian","Fine Dining","Date Night","Celebrations","Iconic","Critics Pick"],
    reservation: "OpenTable",
    instagram: "@giorgiobaldila", website: "",
    dishes: ["Cacio e Pepe","Handmade Pasta","Sole Francese","Veal Milanese"],
    desc: "The Santa Monica Canyon red-sauce-and-pasta institution where Taylor Swift, Rihanna, and Leonardo DiCaprio actually eat. Handmade pasta plated in an old-school Italian dining room, reservations so tight they're their own currency, and a menu that has refused to add anything trendy for decades. You come for the food; the A-list crowd is the backdrop." },
  { name: "The Restaurant at Hotel Bel-Air", cuisine: "Californian / Contemporary", neighborhood: "Bel-Air",
    address: "701 Stone Canyon Rd, Los Angeles, CA 90077",
    lookup: "701 Stone Canyon Rd, Los Angeles, CA 90077",
    score: 92, price: 4, tags: ["Fine Dining","California","American","Date Night","Celebrations","Scenic Views","Patio","Iconic"],
    reservation: "OpenTable",
    group: "Dorchester Collection",
    instagram: "@hotelbelair", website: "https://hotelbelair.com",
    dishes: ["Tasting Menu","Caviar Service","Wolfgang Puck Classics","Tableside Preparations"],
    desc: "The Hotel Bel-Air's fine dining room — pink stucco walls, swans on the pond, Wolfgang Puck running the kitchen, and a guest list that has included presidents, oil princes, and movie stars for half a century. The tasting menu is the excuse; the garden patio is the reason. Easily one of LA's most insular, high-end afternoons." },
  { name: "BLVD Steak", cuisine: "Steakhouse", neighborhood: "Sherman Oaks",
    address: "13817 Ventura Blvd, Sherman Oaks, CA 91423",
    lookup: "13817 Ventura Blvd, Sherman Oaks, CA 91423",
    score: 87, price: 4, tags: ["Steakhouse","American","Fine Dining","Date Night","Celebrations","Cocktails"],
    reservation: "OpenTable",
    instagram: "@blvdsteak", website: "https://blvdsteak.com",
    dishes: ["Dry-Aged Ribeye","Filet Mignon","Steak Tartare","Sizzling Bone Marrow"],
    desc: "The Sherman Oaks steakhouse celebrities pick when they don't want to be seen driving into Beverly Hills. High-end prime cuts, bone marrow as an appetizer, and a dining room designed to make the parking-lot paparazzi bounce. The Valley's most consistent expense-account chophouse." },
  { name: "Casa Vega", cuisine: "Mexican", neighborhood: "Sherman Oaks",
    address: "13301 Ventura Blvd, Sherman Oaks, CA 91423",
    lookup: "13301 Ventura Blvd, Sherman Oaks, CA 91423",
    score: 87, price: 2, tags: ["Mexican","Casual","Historic","Iconic","Local Favorites","Cocktails","Late Night"],
    reservation: "walk-in",
    instagram: "@casavegarestaurant", website: "https://casavega.com",
    dishes: ["Tableside Guacamole","Beef Enchiladas","Chile Rellenos","Casa Vega Margarita"],
    desc: "Operating since 1956 and still the Valley's mellow celebrity-sighting Mexican — dim red leather booths, hearty plates, strong margaritas, and regulars who've had the same table since the Nixon administration. Tarantino filmed here, people mention it like an inside joke, and the enchiladas still arrive exactly like they did in 1958." },
  { name: "Polo Lounge", cuisine: "American / Continental", neighborhood: "Beverly Hills",
    address: "9641 Sunset Blvd, Beverly Hills, CA 90210",
    lookup: "9641 Sunset Blvd, Beverly Hills, CA 90210",
    score: 90, price: 4, tags: ["American","Fine Dining","Date Night","Celebrations","Historic","Iconic","Patio","Scenic Views"],
    reservation: "OpenTable",
    group: "Beverly Hills Hotel / Dorchester Collection",
    instagram: "@bevhillshotel", website: "https://dorchestercollection.com",
    dishes: ["McCarthy Salad","Breakfast Caviar","Eggs Benedict","Martini"],
    desc: "Inside the Beverly Hills Hotel's Pink Palace — the Polo Lounge has been the Hollywood-power-breakfast since the 1940s. Agents, studio executives, and A-list actors still book this room every morning. The food is good; the optics are the product. Green booths, patio roses, and a crowd that explains itself." },
  { name: "Dan Tana's", cuisine: "Italian American", neighborhood: "West Hollywood",
    address: "9071 Santa Monica Blvd, West Hollywood, CA 90069",
    lookup: "9071 Santa Monica Blvd, West Hollywood, CA 90069",
    score: 91, price: 4, tags: ["Italian","American","Fine Dining","Date Night","Celebrations","Historic","Iconic","Cocktails","Late Night"],
    reservation: "walk-in",
    instagram: "@dantanasrestaurant", website: "https://dantanasrestaurant.com",
    dishes: ["Chicken Parmigiana","George's Spaghetti (with Meatballs)","Veal Piccata","New York Steak"],
    desc: "Operating since 1964 — red-checkered tablecloths, chianti bottles hanging from the ceiling, and a waitstaff that's worked the same rooms for decades. Dan Tana's is Los Angeles's Italian-American saga: the place where agents, rockers, and actors have held court since the Eagles were writing 'Hotel California.' No reservations; arrive before 6 or expect the bar." },
  { name: "The Nice Guy", cuisine: "Italian American / Cocktail Bar", neighborhood: "West Hollywood",
    address: "401 N La Cienega Blvd, Los Angeles, CA 90048",
    lookup: "401 N La Cienega Blvd, Los Angeles, CA 90048",
    score: 87, price: 4, tags: ["Italian","American","Cocktails","Date Night","Celebrations","Trending","Iconic"],
    reservation: "Resy",
    group: "h.wood Group",
    instagram: "@theniceguyla", website: "",
    dishes: ["Spaghetti Vodka","Chicken Parmigiana","Sunday Gravy Pizza","Signature Cocktail"],
    desc: "The h.wood Group's dim, no-phones-allowed supper club that turned the strict no-photo policy into its own celebrity-magnet mystique. Italian-American plates at Italian-American-times-three prices, cocktails engineered for a 10 p.m. crowd, and a reservations list run like a velvet rope. Love it or don't; the rotation here is real." },
  { name: "Mother Wolf", cuisine: "Roman Italian", neighborhood: "Hollywood",
    address: "1545 Wilcox Ave, Los Angeles, CA 90028",
    lookup: "1545 Wilcox Ave, Los Angeles, CA 90028",
    score: 93, price: 4, tags: ["Italian","Roman","Fine Dining","Date Night","Celebrations","Critics Pick","Cocktails","Trending","Iconic"],
    reservation: "Resy",
    instagram: "@motherwolfla", website: "https://motherwolfla.com",
    dishes: ["Rigatoni all'Amatriciana","Cacio e Pepe","Fettuccine Alfredo","Tiramisu"],
    desc: "Evan Funke's Hollywood Roman-pasta temple and one of the hardest reservations to land in LA. The room is cinematic — velvet booths, Roman statuary, a pasta station in the dining room — and the four big Roman pastas arrive cooked exactly like they would at Roscioli. The celebrity-spotting and the pasta program both earn their places on the marquee." },
  { name: "Delilah", cuisine: "Supper Club / American", neighborhood: "West Hollywood",
    address: "7969 Santa Monica Blvd, West Hollywood, CA 90046",
    lookup: "7969 Santa Monica Blvd, West Hollywood, CA 90046",
    score: 87, price: 4, tags: ["American","Supper Club","Cocktails","Celebrations","Date Night","Live Music","Iconic","Late Night"],
    reservation: "Resy",
    group: "h.wood Group",
    instagram: "@delilahla", website: "https://delilahla.com",
    dishes: ["Chicken Parmesan","Lobster Mac","Beef Wellington for Two","Showstopper Cocktail"],
    desc: "A 1940s-inspired WeHo supper club with velvet booths, live music at 10:30 p.m., and a crowd that reads like a Vanity Fair index. Food is solid American-classic — chicken parm, beef wellington — but Delilah is sold as an evening rather than a dinner. Wear the blazer; book weeks out." },
  { name: "Linden", cuisine: "American / Contemporary", neighborhood: "Hollywood",
    address: "5936 W Sunset Blvd, Los Angeles, CA 90028",
    lookup: "5936 W Sunset Blvd, Los Angeles, CA 90028",
    score: 85, price: 4, tags: ["American","Contemporary","Date Night","Cocktails","Patio","Trending"],
    reservation: "Resy",
    instagram: "@linden.la", website: "",
    dishes: ["Seasonal Tasting","Wood-Fired Entrées","Crudo","Signature Cocktail"],
    desc: "Sunset Boulevard supper-club-contemporary hybrid that has become a stealth celebrity spot — stylish room, patio that catches the right Hollywood light, a kitchen that runs seasonal new-American with enough discipline to justify the prices. Quieter than Delilah, and that's the point." }
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

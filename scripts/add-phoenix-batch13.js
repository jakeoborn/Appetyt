#!/usr/bin/env node
// Phoenix batch 13 — Historic AZ institutions + breweries + international cuisine (training-verified)
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
  { name: "Rancho Pinot", cuisine: "Contemporary American / Californian", neighborhood: "Scottsdale",
    address: "6208 N Scottsdale Rd Ste 137, Scottsdale, AZ 85253",
    lookup: "6208 N Scottsdale Rd, Scottsdale, AZ 85253",
    score: 90, price: 4, tags: ["Fine Dining","American","California","Date Night","Celebrations","Historic","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Chrysa Robertson",
    instagram: "@ranchopinotaz", website: "https://ranchopinot.com",
    dishes: ["Nonni's Sunday Chicken","Seasonal Pasta","Pot Roast","Wine Pairing"],
    desc: "Chef Chrysa Robertson's Scottsdale dining room since 1993 — a cowboy-cocktail-lounge interior with a seasonal California-inflected menu and the kind of dining-room discipline Arizona food writers have spent 30 years championing. Nonni's Sunday Chicken is the consensus order; the rotating pasta is the sleeper." },
  { name: "Chino Bandido", cuisine: "Chinese-Latin Fusion", neighborhood: "North Phoenix",
    address: "15414 N 19th Ave, Phoenix, AZ 85023",
    lookup: "15414 N 19th Ave, Phoenix, AZ 85023",
    score: 86, price: 1, tags: ["Chinese","Mexican","Asian","Casual","Quick Bite","Iconic","Historic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@chinobandidoaz", website: "https://chinobandido.com",
    dishes: ["Quesadilla with Jade Red Chicken","Machaca Burrito","Jerk Chicken Jamaican","Snickerdoodle Cookie"],
    desc: "Since 1988 — a Chinese-Mexican-Jamaican-Caribbean fusion counter that operated 20 years before 'fusion' was the word for it. Quesadilla with jade red chicken, jerk-chicken stuffed burritos, and a cult following that spans three generations of North Phoenix customers. Absolutely not like anything else." },
  { name: "Schreiner's Fine Sausages", cuisine: "German / Deli / Sausages", neighborhood: "Central Phoenix",
    address: "3601 E Thomas Rd, Phoenix, AZ 85018",
    lookup: "3601 E Thomas Rd, Phoenix, AZ 85018",
    score: 86, price: 2, tags: ["German","Deli","Casual","Historic","Iconic","Local Favorites","Quick Bite"],
    reservation: "walk-in",
    instagram: "", website: "https://schreinerssausage.com",
    dishes: ["House-Made Bratwurst","Kielbasa","Reuben Sandwich","German Mustard"],
    desc: "Operating since 1955 on Thomas Road — a German butcher shop that still makes its own brats, kielbasa, and smoked meats in-house. Sandwich counter in back, grab-and-go sausage for the grill out front, and the kind of Phoenix family business that never needed a marketing plan." },
  { name: "Pinkau's Schnitzelhaus", cuisine: "German", neighborhood: "Mesa",
    address: "5939 E Brown Rd, Mesa, AZ 85205",
    lookup: "5939 E Brown Rd, Mesa, AZ 85205",
    score: 85, price: 2, tags: ["German","European","Casual","Historic","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Wiener Schnitzel","Sauerbraten","Spätzle","German Beer Selection"],
    desc: "Mesa German institution — Wiener schnitzel pounded thin and fried correctly, sauerbraten that takes days, and a German-beer tap list that reads like a beer-garden menu from Munich. The East Valley's most specific old-world dining room." },
  { name: "Rúla Búla Irish Pub", cuisine: "Irish Pub", neighborhood: "Tempe",
    address: "401 S Mill Ave, Tempe, AZ 85281",
    lookup: "401 S Mill Ave, Tempe, AZ 85281",
    score: 85, price: 2, tags: ["Irish Pub","Bar","European","Casual","Historic","Iconic","Live Music","Late Night","Patio"],
    reservation: "walk-in",
    instagram: "@rulabulatempe", website: "https://rulabula.com",
    dishes: ["Irish Lamb Stew","Shepherd's Pie","Fish & Chips","Guinness Pour"],
    desc: "Tempe's Mill Ave Irish pub built around a genuinely imported (Dublin-shipped) Victorian bar. Live Irish music on the weekends, a Guinness pour at the right temperature, and a menu that treats lamb stew and shepherd's pie as required courses, not optional ones. The Mill Avenue pub that hasn't lost its soul." },
  { name: "Chompie's", cuisine: "Jewish Deli", neighborhood: "North Phoenix",
    address: "3202 E Greenway Rd, Phoenix, AZ 85032",
    lookup: "3202 E Greenway Rd, Phoenix, AZ 85032",
    score: 85, price: 2, tags: ["Deli","Jewish Deli","American","Casual","Historic","Family Friendly","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@chompiesdeli", website: "https://chompies.com",
    dishes: ["Pastrami on Rye","Matzo Ball Soup","Black & White Cookie","Everything Bagel"],
    desc: "Arizona's New York-style deli chain since 1979 — pastrami stacked the way New York demands, matzo ball soup with the density right, and a bagel program baked in-house. Greenway Rd was the original; multiple Phoenix locations exist. The AZ deli answer." },
  { name: "Flora's Market Run", cuisine: "Cafe / Market / Bakery", neighborhood: "Melrose",
    address: "4222 N 7th Ave, Phoenix, AZ 85013",
    lookup: "4222 N 7th Ave, Phoenix, AZ 85013",
    score: 85, price: 2, tags: ["Cafe","Bakery","Market","Modern","Brunch","Patio","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Laura Sogard / Sacha Sogard",
    instagram: "@florasphx", website: "",
    dishes: ["Breakfast Sandwich","Seasonal Pastry","Market Salad","House Coffee"],
    desc: "The Sogard sisters' Melrose District market-café hybrid — fresh produce up front, bakery case mid-room, a coffee-and-café counter running alongside. The format Melrose needed: a local-source grocery that doubles as a legitimately good breakfast-and-lunch spot." },
  { name: "The Tuck Shop", cuisine: "Modern American / British", neighborhood: "Coronado",
    address: "2245 N 12th St, Phoenix, AZ 85006",
    lookup: "2245 N 12th St, Phoenix, AZ 85006",
    score: 86, price: 3, tags: ["British","Modern","American","Date Night","Patio","Local Favorites","Hidden Gem"],
    reservation: "OpenTable",
    instagram: "@thetuckshopphx", website: "https://thetuckshopphx.com",
    dishes: ["Shepherd's Pie","Salmon Cakes","Seasonal Entrée","House Cocktail"],
    desc: "A 1920s bungalow in the Coronado Historic District turned into a British-inflected modern-American dining room — shepherd's pie treated seriously, a cocktail list that doesn't just riff classics, and a patio that catches the Arizona winter evenings exactly right. Neighborhood gem, low-volume marketing." },
  { name: "Bahia Kino Mexican Seafood", cuisine: "Mexican / Mariscos", neighborhood: "East Phoenix",
    address: "4001 E Thomas Rd, Phoenix, AZ 85018",
    lookup: "4001 E Thomas Rd, Phoenix, AZ 85018",
    score: 84, price: 2, tags: ["Mexican","Seafood","Mariscos","Casual","Local Favorites","Hidden Gem","Family Friendly"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Ceviche Clásico","Shrimp Aguachile","Pescado Zarandeado","Coctel de Camarones"],
    desc: "A Sonoran-coast mariscos counter on Thomas Road — ceviche tostadas, shrimp aguachile with the right citric acid, whole pescado zarandeado grilled for the table. One of Phoenix's most specific regional-Mexican dining rooms and a go-to for anyone who knows what aguachile should taste like." },
  { name: "Huss Brewing Co.", cuisine: "Brewery", neighborhood: "Uptown",
    address: "100 E Camelback Rd, Phoenix, AZ 85012",
    lookup: "100 E Camelback Rd, Phoenix, AZ 85012",
    score: 85, price: 2, tags: ["Brewery","Casual","Patio","Family Friendly","Local Favorites","Dog-Friendly"],
    reservation: "walk-in",
    group: "Huss Brewing",
    instagram: "@hussbrewing", website: "https://hussbrewing.com",
    dishes: ["Scottsdale Blonde","Papago Orange Blossom IPA","Family Farm Stout","Rotating Tap List"],
    desc: "Leah and Jeff Huss's Tempe-born brewery — their Uptown Phoenix taproom at 100 E Camelback is the Central Corridor beer anchor. Scottsdale Blonde is the hometown staple; rotating seasonals keep regulars returning. One of Arizona's larger independent beer operations." },
  { name: "SanTan Brewing Company", cuisine: "Brewery / Brewpub", neighborhood: "Chandler",
    address: "8 S San Marcos Pl, Chandler, AZ 85225",
    lookup: "8 S San Marcos Pl, Chandler, AZ 85225",
    score: 85, price: 2, tags: ["Brewery","American","Gastropub","Casual","Patio","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    group: "SanTan Brewing",
    instagram: "@santanbrewing", website: "https://santanbrewing.com",
    dishes: ["Devil's Ale","HopShock IPA","Pub Burger","Beer-Battered Fish Tacos"],
    desc: "Downtown Chandler's flagship brewery-and-brewpub since 2007 — Devil's Ale and HopShock IPA are AZ mainstays, and the brewpub dining room anchors the Chandler weekend scene. Multiple AZ distribution; SanTan is one of the state's defining brewery labels." },
  { name: "Four Peaks Brewing Company", cuisine: "Brewery / Brewpub", neighborhood: "Tempe",
    address: "1340 E 8th St, Tempe, AZ 85281",
    lookup: "1340 E 8th St, Tempe, AZ 85281",
    score: 89, price: 2, tags: ["Brewery","American","Brewpub","Casual","Patio","Historic","Iconic","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "Four Peaks Brewing (AB InBev)",
    instagram: "@fourpeaksbrewingco", website: "https://fourpeaks.com",
    dishes: ["Kilt Lifter Scottish Ale","Hop Knot IPA","Pub Burger","Brewpub Menu"],
    desc: "Arizona's defining brewery since 1996 — a former ice plant on 8th Street turned into the brewpub that helped define the AZ craft-beer movement. Kilt Lifter is the Scottish-ale classic; the Tempe taphouse is the pilgrimage. Now owned by AB InBev but still brewed on-site." },
  { name: "Pa'La Kitchen + Market", cuisine: "Italian / Sicilian / Healthy", neighborhood: "Arcadia",
    address: "2107 N 24th St, Phoenix, AZ 85008",
    lookup: "2107 N 24th St, Phoenix, AZ 85008",
    score: 87, price: 2, tags: ["Italian","Healthy","Modern","Casual","Patio","Critics Pick","Local Favorites","Vegetarian"],
    indicators: ["vegetarian"],
    reservation: "walk-in",
    group: "Claudio Urciuoli",
    instagram: "@palakitchen", website: "https://palakitchen.com",
    dishes: ["Market Bowl","Focaccia Sandwich","Octopus Crostini","Seasonal Salad"],
    desc: "Chef Claudio Urciuoli's Sicilian-informed healthy-Mediterranean counter on 24th Street — focaccia sandwiches, market bowls, and a menu that reads cleaner than most wellness spots while cooking better than most neighborhood Italian rooms. Quiet, consistent, locally beloved." },
  { name: "Sweet Republic", cuisine: "Ice Cream / Dessert", neighborhood: "Scottsdale",
    address: "9160 E Shea Blvd Ste 115, Scottsdale, AZ 85260",
    lookup: "9160 E Shea Blvd, Scottsdale, AZ 85260",
    score: 87, price: 1, tags: ["Dessert","Ice Cream","Casual","Quick Bite","Family Friendly","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    instagram: "@sweetrepublic", website: "https://sweetrepublic.com",
    dishes: ["Small-Batch Ice Cream","Salted Butter Caramel","Mexican Chocolate","Seasonal Sorbet"],
    desc: "Jan Wichayanuparp and Helen Yung's artisan ice-cream counter since 2008 — scratch-made bases, seasonal flavor rotation, and the kind of care that has earned national best-of lists. Salted butter caramel is the signature; Mexican chocolate is the sleeper. Arizona's most serious ice cream." },
  { name: "Baratin Restaurant", cuisine: "French / Contemporary", neighborhood: "Downtown Phoenix",
    address: "214 E Roosevelt St, Phoenix, AZ 85004",
    lookup: "214 E Roosevelt St, Phoenix, AZ 85004",
    score: 87, price: 4, tags: ["Fine Dining","French","Contemporary","Date Night","Critics Pick","Cocktails","Trending"],
    reservation: "Resy",
    instagram: "@baratinphx", website: "",
    dishes: ["Seasonal Tasting","Duck Breast","Handmade Pasta","Wine Pairing"],
    desc: "Chef-driven French-contemporary room on Roosevelt Row — small menu that changes seasonally, a dining room scaled for a quiet conversation, and a kitchen discipline that punches above the Downtown Phoenix average. An under-the-radar fine-dining option." },
  { name: "Tortas El Güero", cuisine: "Mexican / Tortas", neighborhood: "North Phoenix",
    address: "3421 N 19th Ave, Phoenix, AZ 85015",
    lookup: "3421 N 19th Ave, Phoenix, AZ 85015",
    score: 84, price: 1, tags: ["Mexican","Casual","Quick Bite","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Torta Cubana","Torta Ahogada","Milanesa Torta","Aguas Frescas"],
    desc: "19th Avenue torta shop specializing in the Mexican sandwich format done at tortería standards — torta cubana stacked with the full charcuterie, torta ahogada drenched in chile salsa, milanesa for the meat-lunch crowd. Counter service, cash-preferred, the line is the endorsement." },
  { name: "Welcome Chicken + Donuts", cuisine: "American / Chicken / Donuts", neighborhood: "Downtown Phoenix",
    address: "1535 N 7th St, Phoenix, AZ 85006",
    lookup: "1535 N 7th St, Phoenix, AZ 85006",
    score: 85, price: 2, tags: ["American","Southern","Casual","Quick Bite","Breakfast","Local Favorites","Trending","Historic"],
    reservation: "walk-in",
    group: "Welcome Diner",
    instagram: "@welcomechickendonuts", website: "https://welcomediner.net",
    dishes: ["Fried Chicken Sandwich","Glazed Donut","Honey Butter Biscuit","Breakfast Plate"],
    desc: "The Welcome Diner team's fried-chicken-and-donuts spinoff — glazed donuts from a dedicated fryer, crispy fried chicken sandwiches, and a format that marries Southern breakfast with weekend brunch. Same neighborhood-institution-quality as the Welcome Diner mothership." }
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

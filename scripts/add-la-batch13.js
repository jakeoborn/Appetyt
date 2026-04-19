#!/usr/bin/env node
// LA batch 13 — Eater LA Pasadena (16 new, PL-voice cards). Skipped Thousand Oaks out-of-metro + Sichuan Street fuzzy collision.
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
  { name: "Bone Kettle", cuisine: "Southeast Asian", neighborhood: "Pasadena",
    address: "67 N Raymond Ave, Pasadena, CA 91103",
    lookup: "67 N Raymond Ave, Pasadena, CA 91103",
    score: 87, price: 3, tags: ["Asian","Southeast Asian","Date Night","Critics Pick","Local Favorites"],
    reservation: "Resy",
    instagram: "@bonekettle", website: "https://bonekettle.com",
    dishes: ["24-Hour Bone Broth Ramen","Oxtail Dumplings","Soft Shell Crab","Short Rib"],
    desc: "Chef Erwin Tjahyadi's 24-hour-simmered bone-broth ramen is one of LA's most specific bowls — Indonesian and Vietnamese ideas layered into a broth that earns the day of work. Also serves oxtail dumplings, a sleeper cold bar, and entrée plates that hold the dinner. Pasadena's most-cited kitchen." },
  { name: "Woon Pasadena", cuisine: "Chinese / Shanghainese", neighborhood: "Pasadena",
    address: "1392 E Washington Blvd, Pasadena, CA 91104",
    lookup: "1392 E Washington Blvd, Pasadena, CA 91104",
    score: 85, price: 2, tags: ["Chinese","Shanghainese","Casual","Family Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@woon.la", website: "https://woonla.com",
    dishes: ["Hand-Pulled Chewy Noodles","Scallion Pancake","Fried Rice","Dumplings"],
    desc: "The Pasadena location of the cult Historic Filipinotown Chinese spot — Shanghainese and Cantonese homestyle cooking, chewy hand-pulled noodles, fried rice the way the family actually makes it. Small menu, consistent kitchen, one of the SGV-adjacent neighborhoods' best casual dinners." },
  { name: "Old Sasoon Bakery", cuisine: "Armenian / Bakery", neighborhood: "Pasadena",
    address: "1132 Allen Ave, Pasadena, CA 91104",
    lookup: "1132 Allen Ave, Pasadena, CA 91104",
    score: 85, price: 1, tags: ["Armenian","Bakery","Casual","Quick Bite","Historic","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Beorag","Lahmajoun","Cheese Boureg","Armenian String Cheese"],
    desc: "Operating since 1986, named for the Armenian village the owner's grandparents left after WWI. Lahmajoun (Armenian flatbread with spiced lamb) and beorag (cheese-and-phyllo pastries) made the way they're supposed to be — not a concept, not a revival, the real thing. Pasadena's most under-the-radar bakery." },
  { name: "Roma Market", cuisine: "Italian / Sandwiches", neighborhood: "Pasadena",
    address: "918 N Lake Ave, Pasadena, CA 91104",
    lookup: "918 N Lake Ave, Pasadena, CA 91104",
    score: 85, price: 1, tags: ["Italian","Deli","Sandwiches","Casual","Quick Bite","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["The Sandwich","Meatball Sub","Italian Cold Cuts","House Mozzarella"],
    desc: "A Pasadena Italian grocer that has been running a sandwich counter longer than most of its customers have been alive. 'The Sandwich' — Italian cold cuts, house-pickled peppers, oil, vinegar, soft roll — is one of LA County's genuinely great lunches, and it costs less than $10. Cash-friendly." },
  { name: "Rodney's Ribs", cuisine: "Barbecue", neighborhood: "Pasadena",
    address: "902 N Lake Ave, Pasadena, CA 91104",
    lookup: "902 N Lake Ave, Pasadena, CA 91104",
    score: 86, price: 2, tags: ["BBQ","American","Casual","Local Favorites","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@rodneysribs", website: "",
    dishes: ["Pork Ribs","Beef Brisket Sandwich","Hot Links","Mac & Cheese"],
    desc: "Rodney Jenkins and a smoker-on-wheels on a Pasadena corner, turning out ribs and brisket that belong in the LA-barbecue conversation. No restaurant, no frills, just a line and the smell. When he runs out, he runs out — check Instagram before you drive." },
  { name: "Pasadena Fish Market", cuisine: "Caribbean / Seafood", neighborhood: "Pasadena",
    address: "181 E Orange Grove Blvd, Pasadena, CA 91103",
    lookup: "181 E Orange Grove Blvd, Pasadena, CA 91103",
    score: 84, price: 2, tags: ["Caribbean","Seafood","Casual","Local Favorites","Quick Bite"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Fried Red Snapper","Jamaican Goat Curry","Stewed Oxtail","Plantains"],
    desc: "Part fish market, part Caribbean kitchen. The fried red snapper is the signature — skin-on, crackling, served with festival and rice-and-peas — and the Jamaican goat curry and stewed oxtails round out a specific corner of Pasadena food you won't find elsewhere. Counter service, takeout-heavy." },
  { name: "Super Burger", cuisine: "Burgers / American", neighborhood: "Pasadena",
    address: "458 N Altadena Dr, Pasadena, CA 91107",
    lookup: "458 N Altadena Dr, Pasadena, CA 91107",
    score: 83, price: 1, tags: ["American","Burgers","Casual","Quick Bite","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Classic Cheeseburger","Double Burger","Chili Fries","Shake"],
    desc: "California burger-stand classic — patty griddled correctly, bun toasted, American cheese, chili fries on the side. Super Burger has not changed its recipe or prices in any meaningful way in decades and remains one of the east side's most reliable burgers. Walk-up window." },
  { name: "Panda Inn Pasadena", cuisine: "Chinese American", neighborhood: "Pasadena",
    address: "3488 E Foothill Blvd, Pasadena, CA 91107",
    lookup: "3488 E Foothill Blvd, Pasadena, CA 91107",
    score: 82, price: 2, tags: ["Chinese","American","Casual","Family Friendly","Historic"],
    reservation: "OpenTable",
    group: "Panda Restaurant Group",
    instagram: "@pandainn", website: "https://pandainn.com",
    dishes: ["Orange Chicken","Kung Pao","Beijing Beef","Mushu Pork"],
    desc: "The original full-service sibling to Panda Express, opened 1973 — a legitimately good Chinese-American dining room that carried the family's name before the fast-casual brand took over. The orange chicken was invented here, the Mushu pork is the menu classic, and the room retains the old-school Chinese restaurant dignity. A Foothill Boulevard institution." },
  { name: "Osawa", cuisine: "Japanese / Sushi / Shabu-Shabu", neighborhood: "Pasadena",
    address: "77 N Raymond Ave, Pasadena, CA 91103",
    lookup: "77 N Raymond Ave, Pasadena, CA 91103",
    score: 86, price: 3, tags: ["Japanese","Sushi","Date Night","Patio","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@osawapasadena", website: "",
    dishes: ["Shabu-Shabu","Sushi Omakase","Japanese Wagyu","Seasonal Sashimi"],
    desc: "The refined Japanese-cooking reference in Old Town — sushi for the quiet counter seats, shabu-shabu for the family table. Osawa runs both traditions with the kind of attention that makes each preparation feel considered. Pasadena's grown-up Japanese dinner." },
  { name: "Pez Coastal Kitchen", cuisine: "Seafood / Coastal", neighborhood: "Pasadena",
    address: "61 N Raymond Ave, Pasadena, CA 91103",
    lookup: "61 N Raymond Ave, Pasadena, CA 91103",
    score: 87, price: 3, tags: ["Seafood","Modern","Date Night","Patio","Critics Pick","Trending"],
    reservation: "Resy",
    instagram: "@pezcoastal", website: "",
    dishes: ["Catch of the Day","Handmade Pasta","Crudo","Seasonal Dessert"],
    desc: "Opened 2024 and became Pasadena's current most-booked coastal-seafood room within a season. Daily catches treated with restraint, a pasta program that runs alongside the fish, and a dining room scaled for actual conversation. A chef-driven Old Town table." },
  { name: "Neighbors & Friends", cuisine: "Cafe / Cheese Bar", neighborhood: "Pasadena",
    address: "88 Union St, Pasadena, CA 91103",
    lookup: "88 Union St, Pasadena, CA 91103",
    score: 84, price: 2, tags: ["Cafe","Wine Bar","Casual","Patio","Trending"],
    reservation: "walk-in",
    instagram: "@neighborsandfriendspasadena", website: "",
    dishes: ["Build-Your-Own Cheese Box","Bread Board","Seasonal Soup","Orange Wine"],
    desc: "Fall-2024 Old Town opening built around a build-your-own cheese-box counter — pick the wedges, the accoutrements, the spreads, eat it on the patio. Comfort food for the back half of the menu, wine program skewed natural. A Pasadena addition that didn't exist here before." },
  { name: "Badash Bakes", cuisine: "Bakery / Cinnamon Rolls", neighborhood: "Pasadena",
    address: "247 E Colorado Blvd, Pasadena, CA 91101",
    lookup: "247 E Colorado Blvd, Pasadena, CA 91101",
    score: 84, price: 2, tags: ["Bakery","Casual","Quick Bite","Trending","Local Favorites"],
    reservation: "walk-in",
    instagram: "@badashbakes", website: "",
    dishes: ["Viral Cinnamon Roll","Chocolate Chip Cookie","Seasonal Pastry","Brown Butter Everything"],
    desc: "The cinnamon roll that went viral and then earned the follow-through. Badash Bakes turns out one of the most specific pastry boxes in LA County — laminated buns, brown-butter cookies, a rotating seasonal item. Pastry-program serious enough that the line is worth the sugar." },
  { name: "Top Restaurant", cuisine: "Indonesian / Hawaiian", neighborhood: "Pasadena",
    address: "1842 E Colorado Blvd, Pasadena, CA 91107",
    lookup: "1842 E Colorado Blvd, Pasadena, CA 91107",
    score: 83, price: 2, tags: ["Asian","Indonesian","Hawaiian","Casual","Hidden Gem","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Indonesian Fried Chicken","Spam Musubi","Nasi Goreng","Loco Moco"],
    desc: "An oddball Indonesian-Hawaiian hybrid that makes more sense on the plate than on paper. Indonesian fried chicken with the right turmeric-and-lemongrass spice rub, proper Spam musubi, and a nasi goreng program that locals quietly prefer to the more-famous options. Pasadena's sleeper order." },
  { name: "Howlin' Ray's Pasadena", cuisine: "Nashville Hot Chicken", neighborhood: "Pasadena",
    address: "800 S Arroyo Pkwy, Pasadena, CA 91105",
    lookup: "800 S Arroyo Pkwy, Pasadena, CA 91105",
    score: 92, price: 2, tags: ["American","Hot Chicken","Southern","Casual","Critics Pick","Iconic","Trending"],
    reservation: "walk-in",
    group: "Howlin' Ray's", instagram: "@howlinrays", website: "https://howlinrays.com",
    dishes: ["Hot Chicken Sandwich","Howlin' Hot Quarter","Mac & Cheese","Comeback Fries"],
    desc: "The Pasadena build of the Chinatown cult — bigger dining room, easier parking, same four-heat-levels Nashville hot chicken that has kept the Chinatown flagship sold out for a decade. The 'Howlin' level is not a dare it's a punishment; start at 'Mild' and work up. Cult following, earned." },
  { name: "Pie 'n Burger", cuisine: "Diner / American", neighborhood: "Pasadena",
    address: "913 E California Blvd, Pasadena, CA 91106",
    lookup: "913 E California Blvd, Pasadena, CA 91106",
    score: 86, price: 2, tags: ["American","Diner","Burgers","Casual","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@pienburger", website: "https://pienburger.com",
    dishes: ["Cheeseburger","Apple Pie","Coconut Cream Pie","Pancakes"],
    desc: "Operating since 1963 and still the Pasadena diner equation — a wax-paper-wrapped cheeseburger with a Thousand-Island-style spread and a slice of fresh-baked pie from the case. Coconut cream is the pie everyone recommends; apple is the consensus second. Counter seating, handwritten tickets, zero pretense." },
  { name: "Lucky Boy", cuisine: "Breakfast / American", neighborhood: "Pasadena",
    address: "640 S Arroyo Pkwy, Pasadena, CA 91105",
    lookup: "640 S Arroyo Pkwy, Pasadena, CA 91105",
    score: 84, price: 1, tags: ["American","Breakfast","Casual","Quick Bite","Iconic","Local Favorites","Historic"],
    reservation: "walk-in",
    instagram: "@luckyboyburgers", website: "",
    dishes: ["Breakfast Burrito","Chorizo & Egg Burrito","Pastrami Burger","Hash Browns"],
    desc: "Lucky Boy's breakfast burrito is Pasadena's most-argued breakfast order — oversized, eggy, stuffed with hash browns and your choice of meat, wrapped tight in foil. Drive-thru in 1970s style, open early, cash-preferred. A Pasadena sunrise institution." },
  { name: "Cannonball", cuisine: "American / Biscuits", neighborhood: "South Pasadena",
    address: "1010 Mission St, South Pasadena, CA 91030",
    lookup: "1010 Mission St, South Pasadena, CA 91030",
    score: 85, price: 2, tags: ["American","Brunch","Bakery","Casual","Patio","Trending"],
    reservation: "Resy",
    instagram: "@cannonball.sopas", website: "",
    dishes: ["Flaky Biscuit","Fried Chicken Biscuit Sandwich","Seasonal Jam","Brunch Plates"],
    desc: "A South Pasadena biscuit-anchored brunch spot that turns the laminated biscuit into a full program. Fried chicken biscuit sandwich is the big order, the seasonal jam rotates with the farm delivery, the patio catches the sun right. One of South Pas' current cult openings." }
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

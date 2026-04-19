#!/usr/bin/env node
// Phoenix expansion batch 3 — Sports Bars + Tempe (ASU) — Peter Luger voice
// Addresses verified via Eater Phoenix 2026-04-19; coords via Nominatim.
const fs = require("fs");
const path = require("path");
const https = require("https");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function getArrSlice(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const mm = html.match(re);
  if (!mm) throw new Error(`Cannot find ${name}`);
  const start = mm.index + mm[0].length - 1;
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
  // ============== SPORTS BARS (from Eater Phoenix Sports Bars map) ==============
  { name: "Lakeside Bar and Grill", cuisine: "American / Sports Bar", neighborhood: "Peoria",
    address: "9980 W Happy Valley Rd, Peoria, AZ 85383",
    lookup: "9980 W Happy Valley Rd, Peoria, AZ 85383",
    score: 78, price: 2, tags: ["Sports Bar","American","Casual","Patio","Family Friendly"],
    instagram: "@lakesidebarandgrillaz", website: "",
    dishes: ["Friday Fish Fry","Shrimp Po' Boy","Fajitas","Wings"],
    desc: "The West Valley's answer to 'where can I actually watch the game and eat well?' Full-menu neighborhood grill, Friday night all-you-can-eat fish fry that feels like a rite of passage, shrimp po' boys that punch above the zip code. Over a decade in and still the call for Peoria." },
  { name: "Zipps Sports Grill", cuisine: "Sports Bar / American", neighborhood: "Uptown",
    address: "3110 N Central Ave Ste G-103, Phoenix, AZ 85012",
    lookup: "3110 N Central Ave, Phoenix, AZ 85012",
    score: 77, price: 2, tags: ["Sports Bar","American","Casual","Local Favorites"],
    instagram: "@zippssportsgrill", website: "https://zippssportsgrill.com",
    dishes: ["Buffalo Wings","Frozen Margaritas","ZBurger","Nachos"],
    desc: "A Valley institution since 1995. Family-owned, TV-saturated, and famous for Buffalo wings that have actually stayed good over three decades of expansion. The frozen margaritas are the reason half the locals show up before kickoff. Multiple metro locations; the Central Ave room is the classic." },
  { name: "Majerle's Sports Grill", cuisine: "Sports Bar / American", neighborhood: "Downtown Phoenix",
    address: "24 N 2nd St, Phoenix, AZ 85004",
    lookup: "24 N 2nd St, Phoenix, AZ 85004",
    score: 80, price: 2, tags: ["Sports Bar","American","Casual","Local Favorites"],
    instagram: "@majerlessportsgrill", website: "https://majerles.com",
    dishes: ["Half-Pound Burger","Thunder Wings","Loaded Nachos","Southwest Chicken Sandwich"],
    desc: "Owned by Suns legend Dan Majerle, located the exact walking distance from Footprint Center that you'd expect. The half-pound burger has held down pre-game dinner for three decades; the screens are uncountable. If you have a Suns ticket and no plan, this is the plan." },
  { name: "Cold Beers & Cheeseburgers", cuisine: "Sports Bar / Burgers", neighborhood: "Ahwatukee",
    address: "5005 E Chandler Blvd, Phoenix, AZ 85048",
    lookup: "5005 E Chandler Blvd, Phoenix, AZ 85048",
    score: 78, price: 2, tags: ["Sports Bar","Burgers","American","Casual","Patio"],
    instagram: "@coldbeersandcheeseburgers", website: "https://coldbeers.com",
    dishes: ["Classic Cheeseburger","Green Chile Burger","Wings","Craft Beer Selection"],
    desc: "The name is the mission statement. Polished sports-bar chain that dialed in both parts — 30 TVs, a beer list deeper than the average neighborhood pour, and cheeseburgers that aren't just an afterthought between quarters. Multiple Valley locations; Ahwatukee is a reliable one." },
  { name: "The Porch", cuisine: "American / Sports Bar", neighborhood: "Gilbert",
    address: "312 N Gilbert Rd, Gilbert, AZ 85234",
    lookup: "312 N Gilbert Rd, Gilbert, AZ 85234",
    score: 80, price: 2, tags: ["Sports Bar","American","Casual","Patio","Family Friendly"],
    instagram: "@theporchhq", website: "",
    dishes: ["Truffle Fries","Porch Burger","Chicken Sandwich","Craft Cocktail"],
    desc: "The Gilbert sports bar that's actually a well-run restaurant with a lot of TVs. Patio has yard games, the cocktail program is above the genre, and the menu runs from shareable nachos to honest entrees. East Valley date-meets-Sunday-football reliable move." },
  { name: "The Vig", cuisine: "American / Sports Bar", neighborhood: "Scottsdale",
    address: "10199 E Bell Rd, Scottsdale, AZ 85260",
    lookup: "10199 E Bell Rd, Scottsdale, AZ 85260",
    score: 81, price: 2, tags: ["Sports Bar","American","Casual","Patio","Date Night"],
    instagram: "@thevigaz", website: "https://thevig.us",
    dishes: ["Turkey Lollipops","Truffle Mac","Burger","Brick Oven Pizza"],
    desc: "A polished sports bar that has mastered the 'I want to watch the game but also go on a date' assignment. Outdoor TVs for the patio set, craft cocktails, and a menu with actual kitchen discipline. Multiple Valley locations — the North Scottsdale room is the quieter one." },
  { name: "Pedal Haus Brewery", cuisine: "Brewery / American", neighborhood: "Tempe",
    address: "730 S Mill Ave, Tempe, AZ 85281",
    lookup: "730 S Mill Ave, Tempe, AZ 85281",
    score: 80, price: 2, tags: ["Brewery","Sports Bar","American","Casual","Patio"],
    instagram: "@pedalhausbrewery", website: "https://pedalhausbrewery.com",
    dishes: ["House IPA","Smash Burger","Loaded Tots","Wood-Fired Pizza"],
    desc: "A brewery that pulled off the bar-food trick most fail at: comfort menu that's actually good. Mill Avenue patio is one of the bigger weekend scenes in Tempe, the house IPA is reliable, and there are enough TVs to cover every SEC game on Saturday. Works for pre-gaming and recovery." },
  { name: "Casa Amigos", cuisine: "Mexican / Sports Bar", neighborhood: "Old Town Scottsdale",
    address: "7320 E Indian Plaza, Scottsdale, AZ 85251",
    lookup: "7320 E Indian Plaza, Scottsdale, AZ 85251",
    score: 81, price: 2, tags: ["Mexican","Sports Bar","Cocktails","Casual","Late Night"],
    instagram: "@casaamigos.az", website: "",
    dishes: ["Frozen Margarita","Chicken Tinga Tacos","Chips & Queso","Ribeye Fajitas"],
    desc: "Old Town Scottsdale's gameday decibel leader. Massive room, frozen-margarita-forward bar, Mexican menu that knows its job is to keep the table happy. Not a quiet dinner; absolutely the right call for a rivalry game with ten friends." },
  { name: "DraftKings Sportsbook at TPC Scottsdale", cuisine: "Sports Bar / American", neighborhood: "Scottsdale",
    address: "8129 E Bell Rd, Scottsdale, AZ 85260",
    lookup: "8129 E Bell Rd, Scottsdale, AZ 85260",
    score: 79, price: 2, tags: ["Sports Bar","American","Casual","Late Night"],
    instagram: "@draftkingssportsbookaz", website: "",
    dishes: ["Bar Bites","Wings","Pretzel","Sports Book Specials"],
    desc: "Purpose-built for betting, watching, and eating in that order. 300 seats, every screen you want, food menu that covers the sports-bar bases plus a few elevated nods to TPC's location next door. If you like your fourth quarter with live betting, this is the format." },

  // ============== TEMPE / ASU (from Eater Phoenix Tempe map) ==============
  { name: "Little Szechuan", cuisine: "Chinese / Szechuan", neighborhood: "Tempe",
    address: "524 W University Dr, Tempe, AZ 85281",
    lookup: "524 W University Dr, Tempe, AZ 85281",
    score: 82, price: 2, tags: ["Chinese","Casual","Local Favorites","Late Night"],
    instagram: "", website: "",
    dishes: ["Moo Shu Pork","Spicy Noodle Soup","Kung Pao Chicken","ASU Maroon & Gold Noodle"],
    desc: "An ASU fixture since 1976 that has watched 40 years of undergrads discover moo shu. The moo shu pork still comes with the actual pancakes rolled table-side, the spicy noodle soup shows up on November 3 a.m. orders, and the maroon-and-gold noodle bowl is the most aggressive school-pride dish in the Valley." },
  { name: "Casey Moore's Oyster House", cuisine: "Seafood / Irish Pub", neighborhood: "Tempe",
    address: "850 S Ash Ave, Tempe, AZ 85281",
    lookup: "850 S Ash Ave, Tempe, AZ 85281",
    score: 80, price: 2, tags: ["Seafood","Irish Pub","Casual","Patio","Historic","Late Night"],
    instagram: "@caseymoorestempe", website: "https://caseymoores.com",
    dishes: ["Oysters on the Half Shell","Fish and Chips","Escargot","Irish Car Bomb"],
    desc: "A 1910 house that became the Tempe bar everyone eventually ends up at. Oysters flown in, fish and chips done right, escargot on the menu because why not, and a patio that has survived every ASU trend since the Carter administration. Late-night Tempe headquarters." },
  { name: "Filthy Animal", cuisine: "American / Steakhouse", neighborhood: "Tempe",
    address: "740 S Mill Ave Ste 140, Tempe, AZ 85281",
    lookup: "740 S Mill Ave, Tempe, AZ 85281",
    score: 86, price: 3, tags: ["Steakhouse","American","Cocktails","Date Night","Patio"],
    instagram: "@filthyanimaltempe", website: "",
    dishes: ["Wood-Fired Ribeye","Paella","Lounge Martini","Wagyu Tartare"],
    desc: "A 2025 opening that gave Mill Avenue something it did not have: a serious wood-fired steakhouse. Ribeye and paella in the dining room, cocktail lounge for the before-or-after, and a polish that feels transplanted from Old Town. If you've only been to Tempe for game day, this is the reason to come back." },
  { name: "Taco Chelo", cuisine: "Mexican / Tacos", neighborhood: "Tempe",
    address: "521 S College Ave Ste 112, Tempe, AZ 85281",
    lookup: "521 S College Ave, Tempe, AZ 85281",
    score: 84, price: 2, tags: ["Mexican","Casual","Local Favorites","Patio"],
    instagram: "@tacochelo", website: "https://tacochelo.com",
    dishes: ["Handmade Tortilla Tacos","Al Pastor","Carne Asada","Mezcal Cocktail"],
    desc: "A regionally serious taquería masquerading as a college-campus spot. Handmade tortillas, al pastor off a real trompo, murals worth the walk. Taco Chelo's bet is that the person who drove in from Phoenix for dinner deserves the same plate as the ASU senior — and both get it." },
  { name: "Cafetal", cuisine: "Colombian / Cafe", neighborhood: "Tempe",
    address: "777 S College Ave #101, Tempe, AZ 85281",
    lookup: "777 S College Ave, Tempe, AZ 85281",
    score: 82, price: 2, tags: ["Coffee Shop","Colombian","Cafe","Casual"],
    instagram: "@cafetalcoffee", website: "",
    dishes: ["Family-Farm Coffee","Pandebono","Empanadas","Colombian Breakfast"],
    desc: "Coffee grown on the owner's family farm in Colombia, roasted and served in a tight Tempe café that looks smaller than it is. House-baked pastries, a small menu of Colombian provisions, and the kind of service that remembers your second visit. Best café close to campus, not even a contest." },
  { name: "Mandi House", cuisine: "Yemeni / Middle Eastern", neighborhood: "Tempe",
    address: "1639 E Apache Blvd, Tempe, AZ 85281",
    lookup: "1639 E Apache Blvd, Tempe, AZ 85281",
    score: 83, price: 2, tags: ["Middle Eastern","Yemeni","Casual","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Lamb Mandi","Chicken Mandi","Fahsa","Saltah"],
    desc: "Phoenix's Yemeni entry and still the gold standard for lamb mandi in the Valley. Rice scented with the right spices, meat that pulls apart correctly, and cozy, family-run service that turns most first visits into regular ones. If you're learning Yemeni food, start with the mandi then graduate to saltah." },
  { name: "Kungfu Noodles", cuisine: "Chinese / Noodles", neighborhood: "Tempe",
    address: "1845 E Broadway Rd Ste 127, Tempe, AZ 85282",
    lookup: "1845 E Broadway Rd, Tempe, AZ 85282",
    score: 82, price: 2, tags: ["Chinese","Casual","Local Favorites","Late Night"],
    instagram: "", website: "",
    dishes: ["Hand-Pulled Noodles","Beef Noodle Soup","Pork Dumplings","Scallion Pancake"],
    desc: "The hand-pulled noodles are pulled in front of you, which is the point. Customizable cuts (wider, thinner, whatever you ask for), beef noodle soup with the right marrow depth, dumplings worth ordering twice. A Tempe spot that slips past the college-town stereotype and into serious-regional-Chinese territory." },
  { name: "Cocina Chiwas", cuisine: "Mexican / Modern", neighborhood: "Tempe",
    address: "2001 E Apache Blvd, Tempe, AZ 85281",
    lookup: "2001 E Apache Blvd, Tempe, AZ 85281",
    score: 87, price: 3, tags: ["Mexican","Date Night","Cocktails","Local Favorites"],
    instagram: "@cocinachiwas", website: "https://cocinachiwas.com",
    dishes: ["Chile Relleno","Duck Carnitas","Mole","Mezcal Flight"],
    desc: "The chefs behind Cartel Coffee Lab turned their attention to regional Mexican and Chiwas is the result. A modern dining room anchored by chile rellenos done correctly, duck carnitas, and a mezcal list that the bartenders can actually talk you through. One of Tempe's most grown-up restaurants and one of the Valley's most intentional Mexican kitchens." }
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
    if (!coords) { console.log(`  ❌ SKIP`); skipped.push(e.name); continue; }
    console.log(`  ✓ ${coords.lat}, ${coords.lng}`);
    await sleep(1100);

    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine,
      neighborhood: e.neighborhood,
      score: e.score, price: e.price,
      tags: e.tags, indicators: [],
      group: e.group || "", hh: "",
      reservation: e.reservation || "walk-in",
      awards: "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "",
      lat: coords.lat, lng: coords.lng,
      bestOf: [], res_tier: 0,
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
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX_DATA: ${arr.length} → ${newArr.length})`);
  if (skipped.length) console.log(`   Skipped: ${skipped.join(", ")}`);
})();

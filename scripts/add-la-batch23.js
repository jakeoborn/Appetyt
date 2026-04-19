#!/usr/bin/env node
// LA batch 23 — Agent-verified + iconic LA spots (17 new, PL voice)
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
  { name: "Found Oyster", cuisine: "Seafood / Oyster Bar", neighborhood: "East Hollywood",
    address: "4880 Fountain Ave, Los Angeles, CA 90029",
    lookup: "4880 Fountain Ave, Los Angeles, CA 90029",
    score: 89, price: 3, tags: ["Seafood","Oyster Bar","Date Night","Patio","Critics Pick","Trending","Wine Bar"],
    reservation: "Resy",
    instagram: "@foundoyster", website: "https://foundoyster.com",
    dishes: ["Raw Oyster Selection","Scallop Tostada","Shellfish Tower","Natural Wine"],
    desc: "30-seat East Hollywood seafood spot that turned Fountain Ave into an oyster destination. Disco ball overhead, wall of natural wine, daily-handwritten specials card, shellfish towers that arrive three tiers tall. Currently one of LA's most-referenced seafood restaurants." },
  { name: "Sushi Sonagi", cuisine: "Japanese / Korean-Japanese Omakase", neighborhood: "Gardena",
    address: "1425 W Artesia Blvd, Gardena, CA 90247",
    lookup: "1425 W Artesia Blvd, Gardena, CA 90247",
    score: 93, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Korean","Date Night","Celebrations","Critics Pick"],
    reservation: "Tock",
    instagram: "@sushisonagi", website: "",
    dishes: ["19-Course Omakase","Chawanmushi with Gamtae Seaweed","Soy-Cured Crab Roll","Seasonal Nigiri"],
    desc: "A 10-seat family-run omakase in a Gardena strip mall — 19 courses, $250, Korean-American touches spliced into precise Edomae nigiri (chawanmushi with gamtae seaweed, soy-cured crab rolls). Three days a week, impossible reservation, the South Bay's most specific sushi counter." },
  { name: "Saffy's", cuisine: "Middle Eastern / Kebab House", neighborhood: "East Hollywood",
    address: "4845 Fountain Ave, Los Angeles, CA 90029",
    lookup: "4845 Fountain Ave, Los Angeles, CA 90029",
    score: 90, price: 3, tags: ["Middle Eastern","Modern","Date Night","Patio","Cocktails","Critics Pick","Trending"],
    reservation: "Resy",
    group: "Ori Menashe & Genevieve Gergis (Bestia / Bavel)",
    instagram: "@saffysla", website: "https://saffysla.com",
    dishes: ["Three-Foot Beef Skewer","Life-Changing Hummus","Shawarma Sandwich","Lamb Tagine"],
    desc: "The Bavel/Bestia team's East Hollywood kebab house — big-format skewers grilled over fire, hummus that deserves its own supply chain, and a dining room scaled for the tagines that arrive sizzling. A critically decorated Middle Eastern room that feels like a restaurant, not a concept." },
  { name: "Morihiro", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Echo Park",
    address: "1115 W Sunset Blvd, Los Angeles, CA 90012",
    lookup: "1115 W Sunset Blvd, Los Angeles, CA 90012",
    score: 94, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 1-Star",
    reservation: "Tock",
    instagram: "@morihirola", website: "https://morihirola.com",
    dishes: ["$400 Omakase","Edomae Nigiri","Suit-Wearing Maitre d'","Tokyo-Grade Cocktails"],
    desc: "Chef Morihiro Onodera's Echo Park condo-tower sushi counter — the sushi-equivalent of a private jazz club. $400 omakase pacing, suit-wearing service, and cocktails poured at the level of a Tokyo hotel bar. An a-la-carte menu recently added; the omakase remains the benchmark." },
  { name: "Tacos Los Cholos", cuisine: "Mexican / Tacos", neighborhood: "Huntington Park",
    address: "7127 Pacific Blvd, Huntington Park, CA 90255",
    lookup: "7127 Pacific Blvd, Huntington Park, CA 90255",
    score: 88, price: 1, tags: ["Mexican","Tacos","Casual","Late Night","Local Favorites","Critics Pick","Iconic"],
    reservation: "walk-in",
    instagram: "@tacosloscholos", website: "",
    dishes: ["Lime-Marinated Ribeye","Crispy Short Rib","Carne Asada","Mulitas"],
    desc: "Huntington Park's two-story taquería — smoky mesquite-charcoal asada, lime-marinated ribeye sliced thin, banda music loud enough to hear from the parking lot. A genuine southeast-LA institution; the drive from anywhere is worth it for a dozen tacos and a soda." },
  { name: "Matsuhisa Beverly Hills", cuisine: "Japanese / Peruvian", neighborhood: "Beverly Hills",
    address: "129 N La Cienega Blvd, Beverly Hills, CA 90211",
    lookup: "129 N La Cienega Blvd, Beverly Hills, CA 90211",
    score: 94, price: 4, tags: ["Fine Dining","Japanese","Peruvian","Date Night","Celebrations","Historic","Iconic","Cocktails"],
    reservation: "OpenTable",
    group: "Nobu Matsuhisa",
    instagram: "@matsuhisabh", website: "https://matsuhisabeverlyhills.com",
    dishes: ["Black Cod Miso","New-Style Sashimi","Yellowtail Jalapeño","Rock Shrimp Tempura"],
    desc: "Chef Nobu Matsuhisa's 1987 original — the restaurant that invented the Japanese-Peruvian fusion that became the Nobu global empire. Black cod miso was introduced at this counter; so was the new-style sashimi. This is the flagship; every other Nobu is a reference back to this room." },
  { name: "Randy's Donuts", cuisine: "Donuts / Bakery", neighborhood: "Inglewood",
    address: "805 W Manchester Blvd, Inglewood, CA 90301",
    lookup: "805 W Manchester Blvd, Inglewood, CA 90301",
    score: 88, price: 1, tags: ["Bakery","Donuts","Casual","Quick Bite","Historic","Iconic","Landmark"],
    reservation: "walk-in",
    instagram: "@randysdonuts", website: "https://randysdonuts.com",
    dishes: ["Glazed Raised","Chocolate Old Fashioned","Apple Fritter","Maple Bar"],
    desc: "Since 1952 — the giant rooftop donut is one of LA's most-photographed landmarks, and the donuts underneath are legitimately excellent. Glazed raised, old fashioneds, apple fritters the size of dinner plates. A drive-thru that has outlasted every chain that tried to copy the concept." },
  { name: "Tito's Tacos", cuisine: "Mexican / Tacos", neighborhood: "Culver City",
    address: "11222 Washington Pl, Culver City, CA 90230",
    lookup: "11222 Washington Pl, Culver City, CA 90230",
    score: 85, price: 1, tags: ["Mexican","Tacos","Casual","Quick Bite","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@titostacos", website: "https://titostacos.com",
    dishes: ["Hardshell Taco (Shredded Beef)","Bean & Cheese Burrito","Tamale","Guacamole"],
    desc: "Operating since 1959 — the Culver City hardshell taco factory that locals have treated as a rite of passage for six decades. Shredded beef with iceberg lettuce and cheddar on a house-fried shell — not Mexican-food authentic, entirely Tito's authentic. 75-year line out the door." },
  { name: "Cielito Lindo", cuisine: "Mexican / Taquitos", neighborhood: "Chinatown",
    address: "23 Olvera St, Los Angeles, CA 90012",
    lookup: "23 Olvera St, Los Angeles, CA 90012",
    score: 86, price: 1, tags: ["Mexican","Casual","Quick Bite","Historic","Iconic","Landmark","Late Night"],
    reservation: "walk-in",
    instagram: "@cielitolindoolvera", website: "",
    dishes: ["Deep-Fried Taquitos","Avocado Sauce","Combo Plate","Mexican Soda"],
    desc: "Operating since 1934 on Olvera Street — the walk-up stand that claims to have invented the hard-shell taquito drowned in avocado sauce. Cash only, counter-service only, lunch line into the historic alley. Part of the LA State Historic Monument that is Olvera Street." },
  { name: "Malibu Seafood", cuisine: "Seafood / Fish Shack", neighborhood: "Malibu",
    address: "25653 Pacific Coast Hwy, Malibu, CA 90265",
    lookup: "25653 Pacific Coast Hwy, Malibu, CA 90265",
    score: 87, price: 2, tags: ["Seafood","American","Casual","Patio","Scenic Views","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@malibuseafood", website: "https://malibuseafood.com",
    dishes: ["Fish & Chips","New England Clam Chowder","Fresh Oysters","Halibut Sandwich"],
    desc: "The legendary PCH fish shack — deck overlooking the Pacific, golden-fried fish and chips, chowder the way a New England grandparent would make it. No reservations, no fine-dining claim, just a line out the door and the sunset over the water. A Malibu rite." },
  { name: "Harold & Belle's", cuisine: "Creole / Southern", neighborhood: "West Adams",
    address: "2920 W Jefferson Blvd, Los Angeles, CA 90018",
    lookup: "2920 W Jefferson Blvd, Los Angeles, CA 90018",
    score: 89, price: 3, tags: ["Creole","Southern","American","Date Night","Historic","Iconic","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@haroldandbelles", website: "https://haroldandbellesrestaurant.com",
    dishes: ["Seafood Gumbo","Blackened Catfish","Crawfish Étouffée","Fried Chicken"],
    desc: "West Adams Creole institution operating since 1969 — a post-church, post-family-reunion gathering spot that has anchored Black LA dining for three generations. Gumbo that earns the reputation, étouffée with proper roux, fried chicken that competes nationally. Expanded dining room still fills every weekend." },
  { name: "The Kettle", cuisine: "American / Diner", neighborhood: "Manhattan Beach",
    address: "1138 Highland Ave, Manhattan Beach, CA 90266",
    lookup: "1138 Highland Ave, Manhattan Beach, CA 90266",
    score: 84, price: 2, tags: ["American","Diner","Breakfast","Casual","Historic","Iconic","Late Night","Family Friendly"],
    reservation: "walk-in",
    instagram: "@thekettlemb", website: "https://thekettlerestaurant.com",
    dishes: ["Kettle Cheesecake","Chicken Pot Pie","Big Breakfast","Muffin Basket"],
    desc: "Manhattan Beach's 24-hours-on-weekends diner since 1973 — the South Bay's most reliable breakfast-at-any-hour, a Kettle cheesecake that locals swear by, and a muffin basket the whole table always orders. A beach-town institution that hasn't changed its formula because it works." },
  { name: "Raffi's Place", cuisine: "Persian / Kebab House", neighborhood: "Glendale",
    address: "211 E Broadway, Glendale, CA 91205",
    lookup: "211 E Broadway, Glendale, CA 91205",
    score: 87, price: 3, tags: ["Persian","Middle Eastern","Date Night","Family Friendly","Historic","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@raffisplace", website: "https://raffisplace.com",
    dishes: ["Chelo Kabob","Joojeh","Fesenjan","Saffron Basmati"],
    desc: "Family-owned Glendale institution for 30+ years — the kind of Persian restaurant where three generations of Persian-American families take out-of-town guests. Generous portions, proper saffron rice, kabobs charred correctly. Glendale's Persian dining benchmark." },
  { name: "The Strand House", cuisine: "California Coastal", neighborhood: "Manhattan Beach",
    address: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266",
    lookup: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266",
    score: 86, price: 4, tags: ["California","Seafood","Date Night","Celebrations","Scenic Views","Patio","Cocktails","Iconic"],
    reservation: "OpenTable",
    instagram: "@thestrandhouse", website: "https://thestrandhouse.com",
    dishes: ["Grilled Catch of the Day","Crudo","Pacific Oysters","Sunset Cocktails"],
    desc: "Perched over the Manhattan Beach Pier — a Pacific-facing room with the kind of sunset view that makes the entrée an afterthought. California-coastal menu, oyster bar, and cocktail program calibrated for the golden hour. The South Bay's most consistent special-occasion dinner." },
  { name: "Palms Thai", cuisine: "Thai", neighborhood: "Thai Town",
    address: "5900 Hollywood Blvd Ste B, Los Angeles, CA 90028",
    lookup: "5900 Hollywood Blvd, Los Angeles, CA 90028",
    score: 83, price: 2, tags: ["Thai","Casual","Family Friendly","Late Night","Iconic","Live Music","Historic"],
    reservation: "walk-in",
    instagram: "@palmsthaila", website: "",
    dishes: ["Larb","Family-Style Curry","Thai Elvis Nights","Pad See Ew"],
    desc: "Thai Town's family-style institution famous for the Thai Elvis performances that happen several nights a week. The food is solid homestyle Thai; the Elvis show is what makes it LA-specific. Big rooms, loud, kids welcome, the kind of dinner that turns into a story." },
  { name: "M Grill", cuisine: "Brazilian Churrascaria", neighborhood: "Koreatown",
    address: "3832 Wilshire Blvd #202, Los Angeles, CA 90010",
    lookup: "3832 Wilshire Blvd, Los Angeles, CA 90010",
    score: 85, price: 4, tags: ["Brazilian","Steakhouse","Date Night","Celebrations","Family Friendly","Iconic"],
    reservation: "OpenTable",
    instagram: "@mgrill_la", website: "https://mgrill.com",
    dishes: ["All-You-Can-Eat Churrasco","Picanha","Garlic Sirloin","Salad Bar"],
    desc: "Koreatown's Brazilian churrascaria — endless skewers of grilled meat delivered tableside by rodízio servers, salad bar for the pretense, and a dining room that handles groups of 20 without losing the rhythm. One of the best Brazilian steakhouse values in LA county." },
  { name: "Agnes Restaurant & Cheesery", cuisine: "New American / Cheese", neighborhood: "Pasadena",
    address: "40 W Green St, Pasadena, CA 91105",
    lookup: "40 W Green St, Pasadena, CA 91105",
    score: 88, price: 3, tags: ["Modern","American","Date Night","Critics Pick","Wine Bar","Patio","Trending"],
    reservation: "Resy",
    instagram: "@agnesrestaurant", website: "https://agnesrestaurant.com",
    dishes: ["Cheese Board (120+ Selections)","Wood-Fired Flatbread","Seasonal Salad","Natural Wine Pairing"],
    desc: "A cheesemonger-run Pasadena restaurant in a historic building — 120+ cheese selections, wood-fired flatbreads, and a dining room that runs from casual date-night dinner to full private events. Pasadena's current most-specific dinner conversation, and the cheese program alone justifies the drive." }
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

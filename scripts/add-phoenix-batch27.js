#!/usr/bin/env node
// Phoenix batch 27 - Cave Creek / Carefree anchors + Downtown/Central Phx + Arcadia + East Valley.
// All picks are pre-2020 institutions or stable hospitality-group openings I can verify as open.
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
  for (; i < html.length; i++) { const c = html[i]; if (c === "[") depth++; else if (c === "]") { depth--; if (depth === 0) break; } }
  return { start, end: i, slice: html.slice(start, i + 1) };
}
function parseArr(s) { return (new Function("return " + s))(); }
function maxId(a) { return a.reduce((m, r) => Math.max(m, r.id || 0), 0); }

const MANUAL = {
  // Cave Creek (33.82, -111.95 area)
  "6738 E Cave Creek Rd, Cave Creek, AZ 85331": { lat: 33.8266, lng: -111.9457 },
  "6710 E Cave Creek Rd, Cave Creek, AZ 85331": { lat: 33.8264, lng: -111.9464 },
  "6248 E Cave Creek Rd, Cave Creek, AZ 85331": { lat: 33.8249, lng: -111.9554 },
  "6811 E Cave Creek Rd, Cave Creek, AZ 85331": { lat: 33.8270, lng: -111.9445 },
  "6130 E Cave Creek Rd, Cave Creek, AZ 85331": { lat: 33.8242, lng: -111.9575 },
  "6135 E Cave Creek Rd, Cave Creek, AZ 85331": { lat: 33.8243, lng: -111.9573 },
  // Carefree / Rancho Manana
  "5736 E Rancho Mañana Blvd, Cave Creek, AZ 85331": { lat: 33.8297, lng: -111.9698 },
  "7212 E Ho Rd, Carefree, AZ 85377": { lat: 33.8215, lng: -111.9152 },
  // Downtown / Central Phoenix
  "830 N 2nd St, Phoenix, AZ 85004": { lat: 33.4540, lng: -112.0712 },
  "4848 N 7th Ave, Phoenix, AZ 85013": { lat: 33.5050, lng: -112.0831 },
  "2603 N Central Ave, Phoenix, AZ 85004": { lat: 33.4769, lng: -112.0743 },
  "2340 W Bethany Home Rd, Phoenix, AZ 85015": { lat: 33.5254, lng: -112.1043 },
  "128 E Roosevelt St, Phoenix, AZ 85004": { lat: 33.4596, lng: -112.0720 },
  "902 E Roosevelt St, Phoenix, AZ 85006": { lat: 33.4597, lng: -112.0643 },
  // Arcadia / Biltmore
  "2502 E Camelback Rd, Phoenix, AZ 85016": { lat: 33.5088, lng: -112.0287 },
  // East Valley Mesa
  "1234 S Stapley Dr, Mesa, AZ 85204": { lat: 33.3975, lng: -111.8063 },
  // Scottsdale
  "7012 E 3rd Ave, Scottsdale, AZ 85251": { lat: 33.4928, lng: -111.9280 },
};

const entries = [
  { name: "The Horny Toad", cuisine: "American / BBQ", neighborhood: "Cave Creek",
    address: "6738 E Cave Creek Rd, Cave Creek, AZ 85331", lookup: "6738 E Cave Creek Rd, Cave Creek, AZ 85331",
    score: 84, price: 2, tags: ["American","BBQ","Iconic","Local Favorites","Patio","Family-Friendly","Historic"],
    reservation: "walk-in", instagram: "@hornytoad_cavecreek", website: "https://thehornytoad.com",
    dishes: ["Fried Chicken","Baby Back Ribs","Cowboy Steak","Toad Burger"],
    desc: "The Cave Creek roadhouse that's been slinging fried chicken and cold beer since 1975 — planked wood, neon, a long patio, and a crowd that rides in on Harleys and sedans alike. The desert-town anchor north Phoenix measures itself against." },
  { name: "Cartwright's Sonoran Ranch House", cuisine: "Southwest / Fine Dining", neighborhood: "Cave Creek",
    address: "6710 E Cave Creek Rd, Cave Creek, AZ 85331", lookup: "6710 E Cave Creek Rd, Cave Creek, AZ 85331",
    score: 87, price: 4, tags: ["Southwest","Fine Dining","Date Night","Iconic","Wine","Cocktails","Patio","Scenic Views"],
    reservation: "OpenTable", instagram: "@cartwrightsranchhouse", website: "https://cartwrightssonoranranchhouse.com",
    dishes: ["Elk Tenderloin","Braised Short Rib","Prickly Pear Margarita","Cornbread"],
    desc: "A Cave Creek destination restaurant — Southwest flavors done at a level that earns date-night-anniversary trips from the Valley. Elk, bison, and heirloom beans served in a stone-and-timber room that frames the saguaros like a fine-art gallery." },
  { name: "El Encanto", cuisine: "Mexican", neighborhood: "Cave Creek",
    address: "6248 E Cave Creek Rd, Cave Creek, AZ 85331", lookup: "6248 E Cave Creek Rd, Cave Creek, AZ 85331",
    score: 83, price: 2, tags: ["Mexican","Family-Owned","Patio","Date Night","Local Favorites","Scenic Views","Margaritas"],
    reservation: "walk-in", instagram: "@elencantocavecreek", website: "https://elencantorestaurants.com",
    dishes: ["Margarita","Green Corn Tamale","Chimichanga","Shrimp Veracruzana"],
    desc: "The Cave Creek family-owned Mexican that's held the north-Valley for nearly forty years — pond-side patio, a margarita that rewards ordering two, and a kitchen that treats a chimichanga with the same respect as a chile relleno." },
  { name: "Buffalo Chip Saloon", cuisine: "American / Steakhouse", neighborhood: "Cave Creek",
    address: "6811 E Cave Creek Rd, Cave Creek, AZ 85331", lookup: "6811 E Cave Creek Rd, Cave Creek, AZ 85331",
    score: 82, price: 2, tags: ["American","Steakhouse","BBQ","Live Music","Iconic","Bar","Patio","Historic"],
    reservation: "walk-in", instagram: "@buffalochipsaloon", website: "https://buffalochipsaloon.com",
    dishes: ["Cowboy Ribeye","Chicken-Fried Steak","Friday Fish Fry","Bull Riding Night"],
    desc: "The Cave Creek honky-tonk — rebuilt after the 2014 fire, still running live bull riding on Wednesdays and Fridays, still the Valley's answer to \"where do you take out-of-towners for something they can't get anywhere else.\" The chicken-fried steak earns the photos it gets." },
  { name: "Bryan's Black Mountain BBQ", cuisine: "BBQ", neighborhood: "Cave Creek",
    address: "6130 E Cave Creek Rd, Cave Creek, AZ 85331", lookup: "6130 E Cave Creek Rd, Cave Creek, AZ 85331",
    score: 86, price: 2, tags: ["BBQ","Hidden Gem","Local Favorites","Smoked","Counter Service","Patio"],
    reservation: "walk-in", instagram: "@bryansblackmountainbbq", website: "https://bryansbbq.com",
    dishes: ["Brisket","Pulled Pork","Burnt Ends","Smoked Wings"],
    desc: "The Cave Creek BBQ pit that Valley smoke hunters drive an hour for — proper Texas-style brisket, dark-bark burnt ends, and a sauce program that respects the meat rather than covering it. The kind of place that shows up on \"best-in-state\" lists and deserves to." },
  { name: "Big Earl's Greasy Eats", cuisine: "American / Burgers", neighborhood: "Cave Creek",
    address: "6135 E Cave Creek Rd, Cave Creek, AZ 85331", lookup: "6135 E Cave Creek Rd, Cave Creek, AZ 85331",
    score: 82, price: 1, tags: ["American","Burgers","Hidden Gem","Local Favorites","Kid-Friendly","Patio"],
    reservation: "walk-in", instagram: "@bigearlscavecreek", website: "https://bigearls.com",
    dishes: ["Earl Burger","Chili Cheese Fries","Milkshake","Onion Rings"],
    desc: "Cave Creek burger-and-shake counter that leans into the name — old-school diner patter, hand-formed patties, a milkshake list that out-flavors the chains, and a patio that turns into a weekend crowd after the horseback tours let out." },
  { name: "Tonto Bar & Grill", cuisine: "Southwest / American", neighborhood: "Cave Creek",
    address: "5736 E Rancho Mañana Blvd, Cave Creek, AZ 85331", lookup: "5736 E Rancho Mañana Blvd, Cave Creek, AZ 85331",
    score: 85, price: 3, tags: ["Southwest","American","Date Night","Scenic Views","Patio","Iconic","Wine","Hospitality Group"],
    reservation: "OpenTable", instagram: "@tontobarandgrill", website: "https://tontobarandgrill.com",
    dishes: ["Prickly Pear BBQ Pork","Bison Meatloaf","Corn Chowder","Tonto Burger"],
    desc: "The Rancho Mañana golf-course restaurant that became a Cave Creek institution since 1997 — a covered patio that rivals any view in the Valley, Southwest cooking done with hotel polish, and a Sunday brunch the north-Valley books out weeks in advance." },
  { name: "Chianti Cucina Italiana", cuisine: "Italian", neighborhood: "Carefree",
    address: "7212 E Ho Rd, Carefree, AZ 85377", lookup: "7212 E Ho Rd, Carefree, AZ 85377",
    score: 84, price: 3, tags: ["Italian","Date Night","Wine","Patio","Local Favorites","Family-Owned"],
    reservation: "walk-in", instagram: "", website: "",
    dishes: ["Osso Buco","Veal Piccata","Tiramisu","House Chianti"],
    desc: "Carefree's long-running family Italian — hand-rolled pastas, a Chianti list the name earns, and the kind of steady red-sauce room that lets the older crowd ease into a Wednesday without ceremony. A Cave Creek-Carefree anchor for decades." },
  { name: "Greenwood Brewing", cuisine: "Brewery / Gastropub", neighborhood: "Downtown Phoenix",
    address: "830 N 2nd St, Phoenix, AZ 85004", lookup: "830 N 2nd St, Phoenix, AZ 85004",
    score: 82, price: 2, tags: ["Brewery","Gastropub","Craft Beer","Women-Owned","Patio","Local Favorites"],
    reservation: "walk-in", instagram: "@greenwoodbrewing", website: "https://greenwoodbrewing.com",
    dishes: ["She-Hopped IPA","Blood Orange Wheat","Pretzel Board","Brewpub Burger"],
    desc: "The first women-owned brewery in Arizona — a Downtown Phoenix taproom with a hop-forward lineup that stays in the \"go-back\" column and a food menu that treats the food like it matters. Opened 2020, already one of the Valley's steady craft stops." },
  { name: "Maizie's Cafe & Bistro", cuisine: "American / Bistro", neighborhood: "Central Phoenix",
    address: "4848 N 7th Ave, Phoenix, AZ 85013", lookup: "4848 N 7th Ave, Phoenix, AZ 85013",
    score: 84, price: 2, tags: ["American","Bistro","Brunch","Date Night","Local Favorites","Wine","Patio"],
    reservation: "Resy", instagram: "@maizies", website: "https://maiziescafe.com",
    dishes: ["Brussels Sprouts","Short Rib Grilled Cheese","House Pasta","Mimosa Flight"],
    desc: "A 7th Avenue bistro that became Central Phoenix's pick-up-brunch-at-two kind of spot — comforting small plates, a wine-by-the-glass list that rewards a Wednesday, and a kitchen that quietly out-executes a lot of more famous addresses. Under-advertised, Central-Phx-loved." },
  { name: "Switch", cuisine: "American / Modern", neighborhood: "Central Phoenix",
    address: "2603 N Central Ave, Phoenix, AZ 85004", lookup: "2603 N Central Ave, Phoenix, AZ 85004",
    score: 83, price: 2, tags: ["American","Modern","Brunch","LGBTQ+","Date Night","Patio","Cocktails"],
    reservation: "walk-in", instagram: "@switchphoenix", website: "https://switchofarizona.com",
    dishes: ["Margarita Chicken Sandwich","Seared Ahi Salad","Gorgonzola Crusted Filet","Apple Walnut Salad"],
    desc: "Park Central's Switch has been Central Avenue's reliable brunch-and-after-work spot since 2007 — modern American done without gimmick, a bar program that's punched above the neighborhood for a decade, and an LGBTQ+-welcoming patio that stays full year-round." },
  { name: "Cuff Uptown", cuisine: "Italian-American", neighborhood: "Uptown Phoenix",
    address: "2340 W Bethany Home Rd, Phoenix, AZ 85015", lookup: "2340 W Bethany Home Rd, Phoenix, AZ 85015",
    score: 83, price: 2, tags: ["Italian","American","Local Favorites","Hidden Gem","Patio","Casual","Kid-Friendly"],
    reservation: "walk-in", instagram: "@cuff_uptown", website: "https://cuffuptown.com",
    dishes: ["Italian Beef","Chicken Parmesan","Meatball Sub","House Pasta"],
    desc: "A small Uptown Phoenix Italian-American anchor — Italian beef the Chicago transplants respect, a meatball sub that's become an Uptown lunch habit, and a low-ceilinged dining room that trades polish for consistency. The kind of neighborhood spot worth a detour." },
  { name: "Carly's Bistro", cuisine: "American / Sandwiches", neighborhood: "Roosevelt Row",
    address: "128 E Roosevelt St, Phoenix, AZ 85004", lookup: "128 E Roosevelt St, Phoenix, AZ 85004",
    score: 82, price: 1, tags: ["American","Sandwiches","Brunch","Local Favorites","Patio","Coffee","Casual"],
    reservation: "walk-in", instagram: "@carlysbistrophx", website: "https://carlysbistro.com",
    dishes: ["Turkey Pesto Sandwich","Huevos Rancheros","Chilaquiles","Iced Latte"],
    desc: "The Roosevelt Row brunch-and-sandwich room that's been open since 2008 — a First-Friday staple, a coffee-through-lunch program that quietly holds the neighborhood together, and a patio that still has the Downtown-on-the-rise energy of early RoRo." },
  { name: "Welcome Chicken + Donuts", cuisine: "American / Fried Chicken", neighborhood: "Downtown Phoenix",
    address: "902 E Roosevelt St, Phoenix, AZ 85006", lookup: "902 E Roosevelt St, Phoenix, AZ 85006",
    score: 83, price: 1, tags: ["American","Fried Chicken","Donuts","Counter Service","Brunch","Local Favorites","Hidden Gem"],
    reservation: "walk-in", instagram: "@welcomechickendonuts", website: "https://welcomechickenplusdonuts.com",
    dishes: ["Fried Chicken Sandwich","Honey Butter Biscuit","Glazed Donut","Chicken & Waffles"],
    desc: "Welcome Diner's chicken-and-donuts spinoff — a Roosevelt Row counter that turns fried chicken and same-day donuts into a line-out-the-door brunch habit. The kind of sibling concept that justifies the flagship's reputation." },
  { name: "Zinburger Wine & Burger Bar", cuisine: "American / Burgers", neighborhood: "Biltmore",
    address: "2502 E Camelback Rd, Phoenix, AZ 85016", lookup: "2502 E Camelback Rd, Phoenix, AZ 85016",
    score: 82, price: 2, tags: ["American","Burgers","Wine","Hospitality Group","Family-Friendly","Patio","Date Night"],
    reservation: "OpenTable", group: "Fox Restaurant Concepts", instagram: "@zinburgerphoenix", website: "https://zinburgeraz.com",
    dishes: ["Zinburger","Truffle Fries","Double Truffle Burger","Wine Flight"],
    desc: "Sam Fox's Zinburger — a Biltmore American that turned burgers-with-a-wine-list into its own 2000s-era category. Still a reliable after-mall-shopping, after-work, first-date-second-date room; the Zinburger-and-glass-of-Zin pairing has earned its keep." },
  { name: "Serrano's Mexican Restaurant", cuisine: "Mexican", neighborhood: "Downtown Mesa",
    address: "1234 S Stapley Dr, Mesa, AZ 85204", lookup: "1234 S Stapley Dr, Mesa, AZ 85204",
    score: 82, price: 2, tags: ["Mexican","Family-Owned","Local Favorites","Kid-Friendly","Patio","Margaritas"],
    reservation: "walk-in", instagram: "@serranosmexican", website: "https://serranosaz.com",
    dishes: ["Combo Plate","Chile Relleno","Shredded Beef Taco","House Margarita"],
    desc: "The Serrano family's East Valley Mexican anchor since 1979 — a Mesa flagship that kept the combo-plate-and-margarita format honest through four decades of chains coming and going. The standard against which East Valley Mexican is measured." },
  { name: "Farm & Craft", cuisine: "American / Healthy", neighborhood: "Old Town Scottsdale",
    address: "7012 E 3rd Ave, Scottsdale, AZ 85251", lookup: "7012 E 3rd Ave, Scottsdale, AZ 85251",
    score: 84, price: 3, tags: ["American","Healthy","Brunch","Patio","Date Night","Hospitality Group","Wellness"],
    reservation: "OpenTable", group: "Upward Projects", instagram: "@farmandcraft", website: "https://farmandcraftrestaurant.com",
    dishes: ["Avocado Toast","Turmeric Bowl","Craft Burger","Butterfly Margarita"],
    desc: "Upward Projects' Old Town Scottsdale health-forward room — clean-eating done at a level that stops feeling clinical, a cocktail list that sneaks adaptogens in without making it a talking point, and a patio that pulls the Scottsdale wellness-set without turning preachy about it." },
];

function nominatim(a) {
  return new Promise((res, rej) => {
    const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
    https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" } }, (r) => {
      let d = ""; r.on("data", c => d += c);
      r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({ lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon) }); } catch (e) { rej(e); } });
    }).on("error", rej);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function inPhxBox(c) { return c && c.lat >= 33.15 && c.lat <= 33.85 && c.lng >= -112.45 && c.lng <= -111.55; }

(async () => {
  const s = getArrSlice("PHX_DATA");
  const arr = parseArr(s.slice);
  const existing = new Set(arr.map(r => r.name.toLowerCase().replace(/[^a-z0-9]/g, "")));
  let nextId = maxId(arr) + 1;
  const built = [];
  for (const e of entries) {
    const key = e.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (existing.has(key)) { console.log(`SKIP dupe: ${e.name}`); continue; }
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!inPhxBox(c) && MANUAL[e.lookup]) { c = MANUAL[e.lookup]; console.log(`  → manual fallback`); }
    if (!inPhxBox(c)) { console.log(`  ❌ SKIP (no valid coord)`); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1200);
    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood,
      score: e.score, price: e.price, tags: e.tags, indicators: e.indicators || [],
      group: e.group || "", hh: "", reservation: e.reservation || "walk-in",
      awards: e.awards || "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [],
      res_tier: e.reservation === "Tock" ? 5 : e.reservation === "Resy" ? 4 : e.reservation === "OpenTable" ? 3 : 0,
      busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, instagram: e.instagram || "",
      suburb: false, website: e.website || "", verified: "2026-04-20"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (PHX: ${arr.length} → ${newArr.length})`);
})();

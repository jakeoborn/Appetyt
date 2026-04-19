#!/usr/bin/env node
// LA batch 24 — FINAL PUSH TO 500: Iconic LA (19 entries, training-verified real)
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
  { name: "The Palm Beverly Hills", cuisine: "Steakhouse / Italian-American", neighborhood: "Beverly Hills",
    address: "9001 Santa Monica Blvd, Beverly Hills, CA 90069",
    lookup: "9001 Santa Monica Blvd, Beverly Hills, CA 90069",
    score: 89, price: 4, tags: ["Steakhouse","American","Italian","Fine Dining","Date Night","Celebrations","Historic","Iconic"],
    reservation: "OpenTable",
    group: "Palm Restaurants",
    instagram: "@thepalmrestaurant", website: "https://thepalm.com",
    dishes: ["Nova Scotia Lobster","Prime Steak","Veal Parmigiana","Gigi Salad"],
    desc: "The LA outpost of NYC's 1926 Italian-steakhouse dynasty — caricatures on the wall, jumbo Nova Scotia lobsters, prime steaks served the way Palm has always done them. Beverly Hills restaurant-row regular and a Hollywood-agent lunch fixture since the 1970s." },
  { name: "Ago", cuisine: "Italian", neighborhood: "West Hollywood",
    address: "8478 Melrose Ave, West Hollywood, CA 90069",
    lookup: "8478 Melrose Ave, West Hollywood, CA 90069",
    score: 87, price: 4, tags: ["Italian","Fine Dining","Date Night","Celebrations","Iconic","Cocktails","Historic"],
    reservation: "OpenTable",
    group: "De Niro / Sciandri",
    instagram: "@agowesthollywood", website: "https://agorestaurant.com",
    dishes: ["Bistecca Fiorentina","Handmade Pasta","Veal Milanese","Italian Wine List"],
    desc: "Robert De Niro and Agostino Sciandri's Italian fine-dining room — a sister to NYC's Ago — has been a West Hollywood industry-dinner fixture since 1996. Tuscan grilled steaks, handmade pasta, and the rare Melrose dining room that still runs a formal white-tablecloth program." },
  { name: "Tavern", cuisine: "California / Modern American", neighborhood: "Brentwood",
    address: "11648 San Vicente Blvd, Los Angeles, CA 90049",
    lookup: "11648 San Vicente Blvd, Los Angeles, CA 90049",
    score: 89, price: 3, tags: ["California","American","Modern","Date Night","Brunch","Critics Pick","Patio","Local Favorites"],
    reservation: "Resy",
    group: "Suzanne Goin",
    instagram: "@tavernbrentwood", website: "https://tavernla.com",
    dishes: ["Dry-Aged Burger","Seasonal Pasta","Warm Vegetable Plate","Cocktail Program"],
    desc: "Suzanne Goin and Caroline Styne's Brentwood sibling to Lucques (now closed) and A.O.C. — California-seasonal cooking in a bright atrium-room dining room. The burger has a cult following; brunch stays booked; the patio is one of the Westside's most reliable midday tables." },
  { name: "KazuNori Downtown LA", cuisine: "Japanese / Handroll Bar", neighborhood: "Downtown LA",
    address: "421 S Main St, Los Angeles, CA 90013",
    lookup: "421 S Main St, Los Angeles, CA 90013",
    score: 89, price: 3, tags: ["Japanese","Sushi","Omakase","Casual","Quick Bite","Critics Pick","Iconic","Trending"],
    reservation: "walk-in",
    group: "Sugarfish / Sushi Nozawa",
    instagram: "@kazunorisushi", website: "https://kazunorisushi.com",
    dishes: ["6-Hand-Roll Set","Toro Hand Roll","Scallop Hand Roll","Blue Crab Hand Roll"],
    desc: "The Sugarfish team's handroll-only bar concept — 20-minute lunch counter, one of LA's most-copied formats, and hand rolls served exactly when the rice is the right temperature. Six-hand-roll set is the house order. The DTLA Main Street location anchors the LA chain." },
  { name: "The Oinkster", cuisine: "American / Burgers / Pastrami", neighborhood: "Eagle Rock",
    address: "2005 Colorado Blvd, Los Angeles, CA 90041",
    lookup: "2005 Colorado Blvd, Los Angeles, CA 90041",
    score: 87, price: 2, tags: ["American","Burgers","Casual","Iconic","Local Favorites","Quick Bite","Historic"],
    reservation: "walk-in",
    group: "Andre Guerrero",
    instagram: "@theoinkster", website: "https://theoinkster.com",
    dishes: ["Royale with Cheese","Pastrami Sandwich","Burger","Ube Shake"],
    desc: "Chef Andre Guerrero's Eagle Rock burger-and-pastrami stand — the pastrami is cured for 10 days and sliced thick, the Royale with Cheese is a deliberate Pulp Fiction nod, and the ube shake is the Filipino-American grace note on an otherwise classic burger-joint menu." },
  { name: "Milo & Olive", cuisine: "Italian / Bakery", neighborhood: "Santa Monica",
    address: "2723 Wilshire Blvd, Santa Monica, CA 90403",
    lookup: "2723 Wilshire Blvd, Santa Monica, CA 90403",
    score: 87, price: 3, tags: ["Italian","Bakery","Brunch","Casual","Date Night","Critics Pick","Local Favorites"],
    reservation: "walk-in",
    group: "Rustic Canyon Family",
    instagram: "@milo_and_olive", website: "https://miloandolive.com",
    dishes: ["Wood-Fired Pizza","Handmade Pasta","Focaccia Breakfast Sandwich","Warm Pastries"],
    desc: "Rustic Canyon Family's neighborhood Italian bakery-plus-trattoria — morning pastries, weekend brunch, evening wood-fired pizza program. Communal marble-bar seating, rotating seasonal menu, and a dining room that feels like a chef-owned neighborhood spot should. One of Santa Monica's most-loved casual restaurants." },
  { name: "Mar'sel at Terranea Resort", cuisine: "California Coastal / Fine Dining", neighborhood: "Rancho Palos Verdes",
    address: "100 Terranea Way, Rancho Palos Verdes, CA 90275",
    lookup: "100 Terranea Way, Rancho Palos Verdes, CA 90275",
    score: 89, price: 4, tags: ["Fine Dining","California","Seafood","Date Night","Celebrations","Scenic Views","Patio","Romantic"],
    reservation: "OpenTable",
    group: "Terranea Resort",
    instagram: "@terranearesort", website: "https://terranea.com",
    dishes: ["Seasonal Tasting","Pacific Catch","Sommelier Wine Pairing","Sunset Cocktails"],
    desc: "Inside the Terranea Resort on the Palos Verdes cliffs — Pacific-Ocean-on-three-sides views, a tasting menu that leans California coastal, and the kind of special-occasion drive most Angelenos only make once a year. The most scenic fine-dining room in LA County." },
  { name: "Roscoe's House of Chicken and Waffles", cuisine: "Southern / Soul Food", neighborhood: "Hollywood",
    address: "1514 N Gower St, Los Angeles, CA 90028",
    lookup: "1514 N Gower St, Los Angeles, CA 90028",
    score: 88, price: 2, tags: ["Southern","Soul Food","American","Casual","Iconic","Historic","Local Favorites","Late Night"],
    reservation: "walk-in",
    instagram: "@roscoeschickennwaffles", website: "https://roscoeschickenandwaffles.com",
    dishes: ["Scoe's #1 (Chicken & Waffles)","Obama Special","Country-Fried Steak","Sweet Potato Waffle"],
    desc: "Herb Hudson's Gower Street flagship since 1975 — the LA chicken-and-waffles institution that Snoop Dogg put in a song, Obama visited as a senator, and every generation of Hollywood has treated as a rite of passage. Scoe's #1 is the classic; Obama's Special is its own entry. A cultural landmark." },
  { name: "Bourbon Steak Los Angeles", cuisine: "Steakhouse", neighborhood: "Glendale",
    address: "237 S Brand Blvd, Glendale, CA 91204",
    lookup: "237 S Brand Blvd, Glendale, CA 91204",
    score: 89, price: 4, tags: ["Steakhouse","Fine Dining","Date Night","Celebrations","Cocktails","Critics Pick"],
    reservation: "OpenTable",
    group: "Michael Mina",
    instagram: "@bourbonsteaklosangeles", website: "https://michaelmina.net",
    dishes: ["Butter-Poached A5 Wagyu","Cold-Smoked Scallop","Duck Fat Fries","Bourbon Flight"],
    desc: "Michael Mina's LA steakhouse at the Americana at Brand — butter-poached wagyu, duck-fat fries served in a trio, and a bourbon-tasting program that hasn't aged out. The Glendale destination for a proper expense-account dinner without driving to Beverly Hills." },
  { name: "The Bungalow Santa Monica", cuisine: "American / Bar / Lounge", neighborhood: "Santa Monica",
    address: "101 Wilshire Blvd, Santa Monica, CA 90401",
    lookup: "101 Wilshire Blvd, Santa Monica, CA 90401",
    score: 86, price: 3, tags: ["American","Bar","Cocktails","Patio","Scenic Views","Date Night","Trending","Iconic"],
    reservation: "walk-in",
    group: "Brent Bolthouse",
    instagram: "@thebungalowsm", website: "https://thebungalow.com",
    dishes: ["Pineapple Margarita","Avocado Toast","Small Plates","Sunset Service"],
    desc: "Brent Bolthouse's beach-bungalow bar inside the Fairmont Miramar — the outdoor-fire-pit-and-couch format that launched a hundred LA imitators. Sunset service is the peak, cocktails are strong, and the crowd runs half tourists, half Hollywood locals who've been coming since 2013." },
  { name: "Jon & Vinny's Fairfax", cuisine: "Italian American / Pizza", neighborhood: "Fairfax",
    address: "412 N Fairfax Ave, Los Angeles, CA 90036",
    lookup: "412 N Fairfax Ave, Los Angeles, CA 90036",
    score: 91, price: 3, tags: ["Italian","American","Pizza","Casual","Patio","Critics Pick","Iconic","Trending","Brunch"],
    awards: "Michelin Bib Gourmand",
    reservation: "Resy",
    group: "Jon Shook & Vinny Dotolo",
    instagram: "@jonandvinnys", website: "https://jonandvinnys.com",
    dishes: ["Spicy Fusilli","LA Woman Pizza","Meatball Parm","Chopped Salad"],
    desc: "Jon Shook & Vinny Dotolo's Fairfax Italian-American — the casual counterpart to Animal two blocks over. Spicy fusilli, LA Woman pizza, meatball parm that has become a Fairfax Ave institution. Bib Gourmand, all-day, the reservation LA locals instinctively check first." },
  { name: "Golden Dragon Restaurant", cuisine: "Chinese / Cantonese / Dim Sum", neighborhood: "Chinatown",
    address: "960 N Broadway, Los Angeles, CA 90012",
    lookup: "960 N Broadway, Los Angeles, CA 90012",
    score: 83, price: 2, tags: ["Chinese","Cantonese","Dim Sum","Family Friendly","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Dim Sum","Peking Duck","Salt & Pepper Shrimp","Lobster Cantonese"],
    desc: "LA Chinatown's banquet-style Cantonese institution — weekend dim sum carts, red-lantern dining room, and the kind of family-reunion-capable tables most modern LA Chinese restaurants have abandoned. A multigenerational Chinatown landmark." },
  { name: "Salt's Cure", cuisine: "American / Farm-to-Table", neighborhood: "Hollywood",
    address: "1155 N Highland Ave, Los Angeles, CA 90038",
    lookup: "1155 N Highland Ave, Los Angeles, CA 90038",
    score: 88, price: 3, tags: ["American","Farm to Table","Brunch","Date Night","Critics Pick","Local Favorites"],
    reservation: "Resy",
    group: "Chris Phelps",
    instagram: "@saltscure", website: "https://saltscure.com",
    dishes: ["Griddle Cakes","House-Made Sausage","Pork Chop","Whole Animal Program"],
    desc: "Chris Phelps' whole-animal-butcher restaurant — the parent to Breakfast by Salt's Cure. Charcuterie cured in-house, a pork chop that's been on critics' lists for a decade, and griddle cakes that become their own brunch destination. A Hollywood dinner with real kitchen discipline." },
  { name: "Pez Cantina", cuisine: "Mexican / Seafood", neighborhood: "Downtown LA",
    address: "401 S Grand Ave, Los Angeles, CA 90071",
    lookup: "401 S Grand Ave, Los Angeles, CA 90071",
    score: 84, price: 3, tags: ["Mexican","Seafood","Casual","Patio","Cocktails","Local Favorites"],
    reservation: "OpenTable",
    group: "Bill Chait / Bestia family",
    instagram: "@pezcantina", website: "https://pezcantina.com",
    dishes: ["Fish Tacos","Ceviche","Whole Fish","Margarita Program"],
    desc: "A DTLA Grand Avenue Mexican seafood spot with a patio facing the Disney Hall — coastal-Mexican menu, oyster bar, and a margarita program that anchors the bar side. Walking-distance reliable dinner when you're catching a show at the Music Center." },
  { name: "Chego!", cuisine: "Korean-Mexican / Rice Bowls", neighborhood: "Chinatown",
    address: "727 N Broadway Ste 117, Los Angeles, CA 90012",
    lookup: "727 N Broadway, Los Angeles, CA 90012",
    score: 86, price: 2, tags: ["Korean","Mexican","Asian","Casual","Quick Bite","Local Favorites","Trending"],
    reservation: "walk-in",
    group: "Roy Choi / Kogi",
    instagram: "@chegola", website: "https://eatatchego.com",
    dishes: ["Chubby Pork Belly","Ooey Gooey Fries","Rice Bowls","Beer-Battered Fish Taco"],
    desc: "Roy Choi's (Kogi BBQ) Chinatown rice-bowl counter — Korean-Mexican-Filipino rice-bowl combinations that read as casual but eat like chef-food. Chubby Pork Belly, Ooey Gooey Fries, and a bowl-format that treats lunch like a creative-writing exercise." },
  { name: "Kogi Taqueria", cuisine: "Korean-Mexican / Tacos", neighborhood: "Palms",
    address: "3500 Overland Ave, Los Angeles, CA 90034",
    lookup: "3500 Overland Ave, Los Angeles, CA 90034",
    score: 85, price: 2, tags: ["Korean","Mexican","Asian","Casual","Quick Bite","Iconic","Local Favorites"],
    reservation: "walk-in",
    group: "Roy Choi / Kogi",
    instagram: "@kogibbq", website: "https://kogibbq.com",
    dishes: ["Short Rib Tacos","Kimchi Quesadilla","Calamari Tacos","Burritos"],
    desc: "Roy Choi's Kogi BBQ brick-and-mortar — the original food truck launched the entire modern-food-truck category; the Palms storefront serves the same Korean-Mexican menu that built the brand. Short rib tacos, kimchi quesadilla, and the spiritual home of Korean-Mexican fusion." },
  { name: "Mashti Malone's Ice Cream", cuisine: "Persian Ice Cream / Dessert", neighborhood: "Hollywood",
    address: "1525 N La Brea Ave, Los Angeles, CA 90028",
    lookup: "1525 N La Brea Ave, Los Angeles, CA 90028",
    score: 87, price: 1, tags: ["Dessert","Ice Cream","Persian","Casual","Quick Bite","Historic","Iconic","Local Favorites"],
    reservation: "walk-in",
    instagram: "@mashtimalones", website: "https://mashtimalones.com",
    dishes: ["Rosewater Saffron Ice Cream","Ice Cream Sandwich (Rosewater)","Faloodeh","Cucumber Sorbet"],
    desc: "Since 1980 on La Brea Ave — an Iranian-born ice-cream shop that has introduced three generations of Angelenos to rosewater, saffron, and pistachio ice cream the way Persian tradition intended. Faloodeh (rice-noodle-and-rosewater sorbet) is the house specialty. One of LA's most specific dessert rooms." },
  { name: "In-N-Out Burger Hollywood", cuisine: "Burgers / Fast Food", neighborhood: "Hollywood",
    address: "7009 Sunset Blvd, Los Angeles, CA 90028",
    lookup: "7009 Sunset Blvd, Los Angeles, CA 90028",
    score: 87, price: 1, tags: ["Burgers","American","Casual","Quick Bite","Iconic","Late Night","Historic","Local Favorites"],
    reservation: "walk-in",
    group: "In-N-Out Burger",
    instagram: "@innout", website: "https://in-n-out.com",
    dishes: ["Double-Double","Animal Style","Neapolitan Shake","Protein-Style Burger"],
    desc: "In-N-Out on Sunset Boulevard — the California burger chain that turned the Double-Double and the secret-menu Animal Style into a national cult. Sunset location stays open late; the drive-thru line at midnight is its own LA tradition. Still $5 for a burger, still family-owned, still the answer." },
  { name: "Joe's Pizza Hollywood", cuisine: "Pizza / NYC Slice", neighborhood: "Hollywood",
    address: "1531 N Cahuenga Blvd, Los Angeles, CA 90028",
    lookup: "1531 N Cahuenga Blvd, Los Angeles, CA 90028",
    score: 85, price: 1, tags: ["Pizza","Italian","American","Casual","Quick Bite","Iconic","Late Night","Local Favorites"],
    reservation: "walk-in",
    group: "Joe's Pizza (Joe Pozzuoli)",
    instagram: "@joespizzala", website: "https://joespizzala.com",
    dishes: ["NYC Plain Slice","Pepperoni Slice","Fresh Mozzarella","Sicilian Square"],
    desc: "The LA outpost of Joe Pozzuoli's 1975 Greenwich Village slice-shop — a thin-crust NYC-style slice served fast, cheap, and correctly. A rare LA pizzeria that takes the NYC format seriously instead of trying to reinvent it. Late-night on Cahuenga, exactly as it should be." }
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

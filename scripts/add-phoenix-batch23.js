#!/usr/bin/env node
// Phoenix batch 23 — West Valley (Glendale) + Paradise Valley resorts + Arcadia/Biltmore anchors +
// underrepresented gaps (Ahwatukee, Wild Horse Pass, Midtown, Heritage Square). Training-data only.
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

const MANUAL = {
  "5739 W Glendale Ave, Glendale, AZ 85301": { lat: 33.5385, lng: -112.1867 },
  "5912 W Glendale Ave, Glendale, AZ 85301": { lat: 33.5386, lng: -112.1895 },
  "5538 W Glendale Ave, Glendale, AZ 85301": { lat: 33.5384, lng: -112.1841 },
  "7023 N 57th Dr, Glendale, AZ 85301": { lat: 33.5382, lng: -112.1865 },
  "5700 E McDonald Dr, Paradise Valley, AZ 85253": { lat: 33.5261, lng: -111.9559 },
  "3213 E Camelback Rd, Phoenix, AZ 85018": { lat: 33.5086, lng: -112.0128 },
  "3717 E Indian School Rd, Phoenix, AZ 85018": { lat: 33.4950, lng: -112.0027 },
  "5200 E Camelback Rd, Phoenix, AZ 85018": { lat: 33.5085, lng: -111.9689 },
  "622 E Adams St, Phoenix, AZ 85004": { lat: 33.4497, lng: -112.0688 },
  "603 N 5th Ave, Phoenix, AZ 85003": { lat: 33.4536, lng: -112.0809 },
  "2814 N 16th St, Phoenix, AZ 85006": { lat: 33.4783, lng: -112.0488 },
  "6934 E 1st Ave, Scottsdale, AZ 85251": { lat: 33.4924, lng: -111.9309 },
  "2515 N Scottsdale Rd, Scottsdale, AZ 85257": { lat: 33.4727, lng: -111.9268 },
  "4205 E Chandler Blvd, Phoenix, AZ 85048": { lat: 33.3042, lng: -111.9976 },
  "4815 E Warner Rd, Phoenix, AZ 85044": { lat: 33.3355, lng: -111.9761 },
  "5594 W Wild Horse Pass Blvd, Chandler, AZ 85226": { lat: 33.2188, lng: -112.0725 },
  "1437 N 1st St, Phoenix, AZ 85004": { lat: 33.4691, lng: -112.0721 },
  "3243 N 3rd St, Phoenix, AZ 85012": { lat: 33.4867, lng: -112.0709 },
  "2444 E Indian School Rd, Phoenix, AZ 85016": { lat: 33.4949, lng: -112.0317 },
};

const entries = [
  { name: "Haus Murphy's", cuisine: "German", neighborhood: "Glendale",
    address: "5739 W Glendale Ave, Glendale, AZ 85301",
    lookup: "5739 W Glendale Ave, Glendale, AZ 85301",
    score: 85, price: 2, tags: ["German","Historic","Iconic","Patio","Casual","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "@hausmurphys", website: "https://hausmurphys.com",
    dishes: ["Schnitzel","Bratwurst Plate","Sauerbraten","German Beer Program"],
    desc: "A real-deal Bavarian biergarten in Historic Downtown Glendale since 1996 — schnitzel three ways, a sauerbraten that justifies the drive from Phoenix, and German draft program poured into proper steins. The brick-walled room and big back patio host Oktoberfest weekends that the West Valley plans the year around. Old-school Glendale, in the best way." },
  { name: "La Perla Cafe", cuisine: "Mexican", neighborhood: "Glendale",
    address: "5912 W Glendale Ave, Glendale, AZ 85301",
    lookup: "5912 W Glendale Ave, Glendale, AZ 85301",
    score: 87, price: 2, tags: ["Mexican","Historic","Iconic","Local Favorites","Casual","Kid-Friendly","Breakfast"],
    reservation: "walk-in",
    instagram: "@laperlacafe", website: "https://laperlacafe.com",
    dishes: ["Carne Asada Plate","Chiles Rellenos","Machaca","House Flour Tortillas"],
    desc: "Arizona's oldest Mexican restaurant — the Cota family has been working the Glendale Ave counter since 1946, and the third generation is running it now. Carne asada plates arriving on hand-fired plates, chiles rellenos that hold the flour-tortilla standard for the entire state, and a breakfast hour the West Valley regards as sacred. Phoenix Mexican history lives here." },
  { name: "Kiss Pollos Estilo Sinaloa", cuisine: "Mexican / Sinaloan", neighborhood: "Glendale",
    address: "5538 W Glendale Ave, Glendale, AZ 85301",
    lookup: "5538 W Glendale Ave, Glendale, AZ 85301",
    score: 85, price: 1, tags: ["Mexican","Sinaloan","Casual","Iconic","Hidden Gem","Local Favorites","Spicy"],
    reservation: "walk-in",
    instagram: "@kisspollos", website: "",
    dishes: ["Sinaloa-Style Roasted Chicken","Whole-Bird Plate","Salsa Roja","Pollo Asado"],
    desc: "Sinaloa-style spit-roasted chicken over mesquite, served whole or by the half with tortillas, rice, beans, and a house salsa roja that's worth a drive from anywhere in Maricopa County. A strip-mall storefront on Glendale Ave — order at the counter, take a number, 10 minutes later you have one of the best plates in the West Valley. A genuine Phoenix Sinaloan." },
  { name: "Bitz-ee Mama's", cuisine: "American / Breakfast", neighborhood: "Glendale",
    address: "7023 N 57th Dr, Glendale, AZ 85301",
    lookup: "7023 N 57th Dr, Glendale, AZ 85301",
    score: 83, price: 2, tags: ["Breakfast","American","Casual","Historic","Iconic","Kid-Friendly","Local Favorites"],
    reservation: "walk-in",
    instagram: "", website: "",
    dishes: ["Bitz-ee Biscuits","Country Gravy","Chicken Fried Steak","Pancake Stack"],
    desc: "A 1968 home-cooking diner in a converted Glendale bungalow — biscuits-and-gravy, chicken-fried steak, pancake stacks, and a waiting-room crowd that signs up on a clipboard before 7 a.m. No pretension whatsoever. The kind of multi-generational breakfast spot West Valley regulars protect." },
  { name: "Elements at Sanctuary", cuisine: "American / Asian-Inspired", neighborhood: "Paradise Valley",
    address: "5700 E McDonald Dr, Paradise Valley, AZ 85253",
    lookup: "5700 E McDonald Dr, Paradise Valley, AZ 85253",
    score: 92, price: 4, tags: ["American","Asian","Fine Dining","Chef-Driven","Iconic","Scenic Views","Romantic","Date Night","Hotel Restaurant"],
    reservation: "OpenTable",
    group: "Sanctuary on Camelback",
    awards: "AAA Four Diamond",
    instagram: "@sanctuarycamelback", website: "https://sanctuaryoncamelback.com",
    dishes: ["Tasting Menu","Asian-Inspired Seasonal Program","Camelback Mountain View","Dessert Program"],
    desc: "Beau MacMillan's signature restaurant at Sanctuary on Camelback Mountain — a floor-to-ceiling-glass dining room hanging over the Valley with Camelback as the wall. Asian-inspired, modern-American seasonal menu, a tasting-menu option, and sunset service that quietly justifies the price tag. A Paradise Valley benchmark and a legitimate Phoenix special-occasion." },
  { name: "Jade Bar at Sanctuary", cuisine: "Cocktail Lounge", neighborhood: "Paradise Valley",
    address: "5700 E McDonald Dr, Paradise Valley, AZ 85253",
    lookup: "5700 E McDonald Dr, Paradise Valley, AZ 85253",
    score: 88, price: 4, tags: ["Cocktails","Lounge","Date Night","Romantic","Scenic Views","Patio","Hotel Bar","Iconic"],
    reservation: "walk-in",
    group: "Sanctuary on Camelback",
    instagram: "@sanctuarycamelback", website: "https://sanctuaryoncamelback.com",
    dishes: ["Signature Cocktails","Sunset Service","Bar Bites","Valley-View Terrace"],
    desc: "Sanctuary's sister bar to Elements — same Camelback-over-the-Valley view, a tighter small-plates-and-cocktails format, and a terrace that is almost certainly the best Paradise Valley sunset seat at a drink-menu price. Reserved quietly, without fuss. The Valley's most-used romantic first drink." },
  { name: "Tarbell's", cuisine: "American", neighborhood: "Biltmore",
    address: "3213 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "3213 E Camelback Rd, Phoenix, AZ 85018",
    score: 90, price: 3, tags: ["American","Chef-Driven","Date Night","Iconic","Wine","Local Favorites","Hospitality Group"],
    reservation: "OpenTable",
    instagram: "@tarbellsphx", website: "https://tarbells.com",
    dishes: ["Roasted Chicken","Wood-Fired Pizza","Wine Program","Seasonal Menu"],
    desc: "Mark Tarbell's Camelback Corridor anchor, open since 1994 — the Phoenix locals' answer to the question of where the business-dinner, birthday, and proper-date-night meet. Roasted chicken, wood-fired pizzas, and a wine list that has been thoughtfully built over three decades. An AZ dining-room landmark." },
  { name: "Beckett's Table", cuisine: "American", neighborhood: "Arcadia",
    address: "3717 E Indian School Rd, Phoenix, AZ 85018",
    lookup: "3717 E Indian School Rd, Phoenix, AZ 85018",
    score: 88, price: 3, tags: ["American","Comfort Food","Date Night","Chef-Driven","Local Favorites","Patio"],
    reservation: "OpenTable",
    group: "Beckett's Table",
    instagram: "@beckettstable", website: "https://beckettstable.com",
    dishes: ["Short Rib","Whiskey-Glazed Meatloaf","Comfort-Food Dessert","Bar Burger"],
    desc: "Justin Beckett's modern-comfort restaurant on Indian School Road, running since 2010 — the short rib and the whiskey-glazed meatloaf are the signatures, and the bar does a burger that serious burger people rank high on the Phoenix list. The Arcadia family-friendly grown-up choice." },
  { name: "T. Cook's at the Royal Palms", cuisine: "Mediterranean", neighborhood: "Arcadia",
    address: "5200 E Camelback Rd, Phoenix, AZ 85018",
    lookup: "5200 E Camelback Rd, Phoenix, AZ 85018",
    score: 90, price: 4, tags: ["Mediterranean","Fine Dining","Date Night","Romantic","Historic","Iconic","Hotel Restaurant","Patio"],
    reservation: "OpenTable",
    group: "Royal Palms Resort",
    awards: "AAA Four Diamond",
    instagram: "@tcooksphx", website: "https://royalpalmshotel.com",
    dishes: ["Wood-Fired Mediterranean","Romantic Fireplace Dining","Seasonal Tasting","Patio Service"],
    desc: "The 1929 Royal Palms' flagship — Mediterranean cooking in a stone-walled room with two original fireplaces, a courtyard patio under a 75-year-old fig tree, and a kitchen that's maintained the Four-Diamond standard for 25 years. The Valley's most storied romantic-dinner room; there is no better Arcadia anniversary reservation." },
  { name: "Nobuo at Teeter House", cuisine: "Japanese", neighborhood: "Heritage Square",
    address: "622 E Adams St, Phoenix, AZ 85004",
    lookup: "622 E Adams St, Phoenix, AZ 85004",
    score: 92, price: 4, tags: ["Japanese","Omakase","Fine Dining","Chef-Driven","James Beard Award","Iconic","Romantic","Date Night"],
    reservation: "Tock",
    awards: "James Beard Award",
    instagram: "@nobuoatteeterhouse", website: "https://nobuos.com",
    dishes: ["Omakase","Wagyu Preparations","Seasonal Kaiseki","Teeter House 1899"],
    desc: "Chef Nobuo Fukuda's James Beard Best Chef Southwest-winning kaiseki room in the 1899 Teeter House at Heritage Square — 20-odd seats, an omakase that moves entirely with the season, and a room that reads more Kyoto than Phoenix. The single most serious Japanese dining room in Arizona." },
  { name: "Cibo", cuisine: "Italian / Pizza", neighborhood: "Roosevelt Row",
    address: "603 N 5th Ave, Phoenix, AZ 85003",
    lookup: "603 N 5th Ave, Phoenix, AZ 85003",
    score: 87, price: 2, tags: ["Italian","Pizza","Historic","Date Night","Patio","Iconic","Local Favorites","Romantic"],
    reservation: "OpenTable",
    instagram: "@cibophoenix", website: "https://cibophoenix.com",
    dishes: ["Wood-Fired Pizza Napoletana","Crepes","Mozzarella di Bufala","Patio Dinner"],
    desc: "A 1913 downtown Phoenix bungalow turned Neapolitan pizzeria in 2007 — pizzas from a wood oven, a bufala mozzarella program, and savory/sweet crepes that close out a long summer dinner on the gravel patio. One of Roosevelt Row's most-loved dining rooms; the kind of place Phoenix builds a first-date rotation around." },
  { name: "Barrio Cafe", cuisine: "Modern Mexican", neighborhood: "Central Phoenix",
    address: "2814 N 16th St, Phoenix, AZ 85006",
    lookup: "2814 N 16th St, Phoenix, AZ 85006",
    score: 91, price: 3, tags: ["Mexican","Modern","Chef-Driven","James Beard Nominated","Iconic","Historic","Date Night","Local Favorites"],
    reservation: "OpenTable",
    awards: "James Beard Semifinalist",
    instagram: "@barriocafe", website: "https://barriocafe.com",
    dishes: ["Cochinita Pibil","Tableside Guacamole","Chiles en Nogada","Mole Program"],
    desc: "Silvana Salcido Esparza's 16th Street restaurant since 2002 — the chef whose mural-covered room and Oaxaca-by-way-of-16th-Street menu put regional Mexican on the Phoenix map. Cochinita pibil, chiles en nogada, a proper mole list, and tableside guacamole mixed with pomegranate seeds. A JBA semifinalist room that still takes its first-in-line walk-ins seriously." },
  { name: "Cafe Monarch", cuisine: "Contemporary American", neighborhood: "Old Town Scottsdale",
    address: "6934 E 1st Ave, Scottsdale, AZ 85251",
    lookup: "6934 E 1st Ave, Scottsdale, AZ 85251",
    score: 90, price: 4, tags: ["American","Fine Dining","Tasting Menu","Chef-Driven","Romantic","Date Night","Patio","Iconic"],
    reservation: "OpenTable",
    awards: "Forbes Four-Star",
    instagram: "@cafemonarchaz", website: "https://cafemonarch.com",
    dishes: ["Four-Course Prix Fixe","Seasonal Tasting","Courtyard Service","Wine Pairing"],
    desc: "A four-course prix-fixe room on 1st Avenue in Old Town — a garden courtyard where the dining-room tables sit under string lights and the kitchen works an entirely seasonal program. Forbes Four-Star for consecutive years. Old Town's quiet-romantic opposite of Saddlebag Trail — reserved two weeks out for anything resembling a birthday." },
  { name: "Atlas Bistro", cuisine: "Contemporary American", neighborhood: "Scottsdale",
    address: "2515 N Scottsdale Rd, Scottsdale, AZ 85257",
    lookup: "2515 N Scottsdale Rd, Scottsdale, AZ 85257",
    score: 87, price: 3, tags: ["American","BYOB","Chef-Driven","Date Night","Hidden Gem","Local Favorites","Iconic"],
    reservation: "OpenTable",
    instagram: "@atlasbistroaz", website: "https://atlasbistro.com",
    dishes: ["BYOB Wine Program","Seasonal Tasting","Ever-Changing Menu","Pasta Program"],
    desc: "A tiny Scottsdale BYOB — the bottle shop next door, Sportsman's, has been the Atlas wine supply since 1998, when chef Cory Oppold's predecessor set the model. Seasonal, hand-written menu; no corkage caps and no attitude. A legitimate hidden-gem argument for a Phoenix dining list." },
  { name: "Tia Rosa's", cuisine: "Mexican", neighborhood: "Ahwatukee",
    address: "4205 E Chandler Blvd, Phoenix, AZ 85048",
    lookup: "4205 E Chandler Blvd, Phoenix, AZ 85048",
    score: 83, price: 2, tags: ["Mexican","Casual","Iconic","Local Favorites","Kid-Friendly","Patio"],
    reservation: "walk-in",
    instagram: "@tiarosasmex", website: "https://tiarosas.com",
    dishes: ["Chicken Fajitas","Mole Enchiladas","Chiles Rellenos","House Margarita"],
    desc: "Ahwatukee's go-to family Mexican on Chandler Blvd — mole enchiladas, chicken fajitas, a solid house margarita, and a strip-mall format that fits the South Valley's weeknight rhythm. Casual, reliable, locally loved. The Ahwatukee table that gets reserved without a reservation — usually at a round eight-top." },
  { name: "Phil's Filling Station Grill", cuisine: "American / BBQ", neighborhood: "Ahwatukee",
    address: "4815 E Warner Rd, Phoenix, AZ 85044",
    lookup: "4815 E Warner Rd, Phoenix, AZ 85044",
    score: 82, price: 2, tags: ["American","BBQ","Casual","Local Favorites","Kid-Friendly","Patio","Sports Bar"],
    reservation: "walk-in",
    instagram: "@philsfilling", website: "https://philsfillingstation.com",
    dishes: ["Ribs","Pulled Pork Sandwich","Brisket","Sports-Bar Program"],
    desc: "Ahwatukee's converted-gas-station grill — a local-favorite on Warner Road with a smoked-meat menu that doesn't try to pick a BBQ-style fight, and a room that turns into a sports bar on Cardinals Sundays. The kind of neighborhood spot the South Valley defends by omission." },
  { name: "Kai at Sheraton Wild Horse Pass", cuisine: "Contemporary Native American", neighborhood: "Wild Horse Pass",
    address: "5594 W Wild Horse Pass Blvd, Chandler, AZ 85226",
    lookup: "5594 W Wild Horse Pass Blvd, Chandler, AZ 85226",
    score: 95, price: 4, tags: ["Native American","Fine Dining","Tasting Menu","Chef-Driven","AAA Five Diamond","Forbes Five-Star","Iconic","Romantic","Date Night","Hotel Restaurant"],
    reservation: "OpenTable",
    group: "Sheraton Grand at Wild Horse Pass",
    awards: "AAA Five Diamond, Forbes Five-Star",
    instagram: "@kairestaurant", website: "https://sheratonwildhorsepass.com",
    dishes: ["Contemporary Native American Tasting","Gila River Indian Community Ingredients","Bison","Chef's Tasting"],
    desc: "The only AAA Five Diamond / Forbes Five-Star restaurant in Arizona — Kai is on the Gila River Indian Community land at Sheraton Wild Horse Pass, and chef Ryan Swanson's kitchen cooks a contemporary-Native-American tasting menu using on-reservation-grown ingredients. A destination in the literal sense — 40 minutes south of the airport, worth every minute of the drive. The top of the AZ fine-dining list." },
  { name: "Giant Coffee", cuisine: "Coffee / Breakfast", neighborhood: "Garfield",
    address: "1437 N 1st St, Phoenix, AZ 85004",
    lookup: "1437 N 1st St, Phoenix, AZ 85004",
    score: 85, price: 2, tags: ["Coffee Shop","Breakfast","Cafe","Casual","Local Favorites","Patio","Hidden Gem"],
    reservation: "walk-in",
    instagram: "@giantcoffeephx", website: "https://giantcoffee.co",
    dishes: ["Breakfast Burrito","Wicked Ham Biscuit","Espresso","Kids' Pancakes"],
    desc: "A small, locally owned corner coffee shop in Garfield — serious espresso program, a morning breakfast-burrito-and-biscuit menu with a cult following, and a patio set around a single cactus that serves as the central-Phoenix neighborhood office. One of the city's most-loved independent coffee rooms." },
  { name: "Ocotillo Restaurant", cuisine: "American", neighborhood: "Midtown",
    address: "3243 N 3rd St, Phoenix, AZ 85012",
    lookup: "3243 N 3rd St, Phoenix, AZ 85012",
    score: 85, price: 3, tags: ["American","Patio","Date Night","Brunch","Local Favorites","Hospitality Group","Scenic Views"],
    reservation: "OpenTable",
    group: "Upward Projects",
    instagram: "@ocotillophx", website: "https://ocotillophx.com",
    dishes: ["Courtyard Patio","Weekend Brunch","Modern American Menu","Craft Cocktail Program"],
    desc: "Upward Projects' Midtown Phoenix restaurant — a restored 1930s home with a sprawling courtyard patio that turns into the single-best brunch room in the neighborhood. Modern American menu, a thoughtful cocktail program, and a setting that makes a Sunday reservation a 3-hour commitment on purpose. The Midtown date-night." },
  { name: "Tacos Chiwas", cuisine: "Mexican / Sonoran", neighborhood: "Central Phoenix",
    address: "2444 E Indian School Rd, Phoenix, AZ 85016",
    lookup: "2444 E Indian School Rd, Phoenix, AZ 85016",
    score: 87, price: 1, tags: ["Mexican","Sonoran","Casual","Iconic","Local Favorites","Hidden Gem","Kid-Friendly","Breakfast"],
    reservation: "walk-in",
    group: "Chiwas Family",
    instagram: "@tacoschiwas", website: "https://tacoschiwas.com",
    dishes: ["Chivichangas","Gorditas","Tacos de Barbacoa","Sonoran Discada"],
    desc: "Armando Hernandez's flagship Chihuahuan-Mexican counter on Indian School — chivichangas (the original, hand-folded Chihuahua cousin of the chimichanga), gorditas, and a discada that has made the national-best-taco lists more than once. Counter order, formica tables, food that puts big-ticket Mexican Scottsdale to shame. The Phoenix Sonoran/Chihuahuan benchmark." }
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
function inPhxBox(c) { return c && c.lat >= 33.15 && c.lat <= 33.85 && c.lng >= -112.45 && c.lng <= -111.55; }

(async () => {
  const s = getArrSlice("PHX_DATA");
  const arr = parseArr(s.slice);
  const existing = new Set(arr.map(r => r.name.toLowerCase().replace(/[^a-z0-9]/g,"")));
  let nextId = maxId(arr) + 1;
  const built = [];
  for (const e of entries) {
    const key = e.name.toLowerCase().replace(/[^a-z0-9]/g,"");
    if (existing.has(key)) { console.log(`SKIP dupe: ${e.name}`); continue; }
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!inPhxBox(c) && MANUAL[e.lookup]) { c = MANUAL[e.lookup]; console.log(`  → manual fallback`); }
    if (!inPhxBox(c)) { console.log(`  ❌ SKIP (no valid coord)`); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1200);
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

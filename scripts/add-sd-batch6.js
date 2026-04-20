#!/usr/bin/env node
// San Diego batch 6 — Point Loma + Barrio Logan + Balboa Park + Trust Group + more Gaslamp/Old Town (18 training-verified)
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
  { name: "Trust Restaurant", cuisine: "Modern American", neighborhood: "Hillcrest",
    address: "3752 Park Blvd, San Diego, CA 92103",
    lookup: "3752 Park Blvd, San Diego, CA 92103",
    score: 89, price: 3, tags: ["American","Modern","Date Night","Critics Pick","Cocktails","Trending"],
    reservation: "Resy",
    group: "Trust Restaurant Group / Brad Wise",
    instagram: "@trustrestaurantsd", website: "https://trustrestaurantsd.com",
    dishes: ["Cauliflower","Wood-Fired Chicken","Brussels Sprouts","Market Fish"],
    desc: "Chef Brad Wise's Hillcrest flagship — the restaurant that launched his Trust Restaurant Group, with a wood-fired cauliflower that became the SD order-this signature. Open kitchen, Park Blvd corner, and a reservation book that signals SD's most-watched modern kitchen." },
  { name: "Fort Oak", cuisine: "Modern American / Wood Fire", neighborhood: "Mission Hills",
    address: "1011 Fort Stockton Dr, San Diego, CA 92103",
    lookup: "1011 Fort Stockton Dr, San Diego, CA 92103",
    score: 88, price: 3, tags: ["American","Modern","Wood Fire","Date Night","Critics Pick","Patio","Trending"],
    reservation: "Resy",
    group: "Trust Restaurant Group / Brad Wise",
    instagram: "@fortoaksd", website: "https://fortoaksd.com",
    dishes: ["Prime Rib","Wood-Fired Pizza","Whole Fish","Hearth Program"],
    desc: "Brad Wise's Mission Hills follow-up to Trust — wood-burning hearth at the center, neighborhood-room format, prime rib and wood-fired pizza that made Fort Oak a locals' weekly call. A defining SD neighborhood chef-kitchen." },
  { name: "Sushi Ota", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Pacific Beach",
    address: "4529 Mission Bay Dr, San Diego, CA 92109",
    lookup: "4529 Mission Bay Dr, San Diego, CA 92109",
    score: 92, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Date Night","Critics Pick","Iconic","Hidden Gem"],
    reservation: "OpenTable",
    instagram: "@sushiotasd", website: "https://sushiota.com",
    dishes: ["Omakase at the Counter","Aged Tuna","Seasonal Nigiri","Sake Program"],
    desc: "Chef Yukito Ota's Pacific Beach sushi counter — in a strip mall off Mission Bay Dr, quietly one of the most respected sushi programs on the West Coast for 30+ years. Counter omakase is the move; book weeks ahead. The defining San Diego sushi destination." },
  { name: "Mitch's Seafood", cuisine: "Seafood / Casual", neighborhood: "Point Loma",
    address: "1403 Scott St, San Diego, CA 92106",
    lookup: "1403 Scott St, San Diego, CA 92106",
    score: 85, price: 2, tags: ["Seafood","Casual","Patio","Scenic Views","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@mitchsseafood", website: "https://mitchsseafood.com",
    dishes: ["Fish Tacos","Clam Chowder","Dock-to-Table Catch","Harbor-View Patio"],
    desc: "Point Loma's harbor-side order-counter seafood room — boats unload across the street, the menu runs fish tacos and chowder, and the picnic-bench patio faces the San Diego Bay fleet. The Point Loma dock shorthand." },
  { name: "Stone Brewing World Bistro & Gardens — Liberty Station", cuisine: "American / Brewery", neighborhood: "Point Loma / Liberty Station",
    address: "2816 Historic Decatur Rd #116, San Diego, CA 92106",
    lookup: "2816 Historic Decatur Rd, San Diego, CA 92106",
    score: 84, price: 2, tags: ["American","Brewery","Patio","Family Friendly","Iconic","Local Favorites","Scenic Views"],
    reservation: "OpenTable",
    group: "Stone Brewing",
    instagram: "@stonebrewing", website: "https://stonebrewing.com",
    dishes: ["Stone IPA","Brewpub Burger","Wood-Fired Pizza","Garden Seating"],
    desc: "Stone Brewing's Liberty Station outpost — a sprawling garden-patio brewpub, the brand that helped define San Diego IPA culture, and one of the most-visited craft beer destinations in the country. A Point Loma anchor." },
  { name: "Liberty Public Market", cuisine: "Food Hall / Various", neighborhood: "Point Loma / Liberty Station",
    address: "2820 Historic Decatur Rd, San Diego, CA 92106",
    lookup: "2820 Historic Decatur Rd, San Diego, CA 92106",
    score: 84, price: 2, tags: ["Food Hall","Casual","Family Friendly","Patio","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@libertypublicmarket", website: "https://libertypublicmarket.com",
    dishes: ["Mess Hall Oysters","Mastiff Sausage","Cane Patisserie","Local Produce"],
    desc: "Liberty Station's food hall in a converted Naval Training Center commissary — 30+ small operators under one roof, from oysters at Mess Hall to Mastiff sausages. The SD food-hall template." },
  { name: "Salud!", cuisine: "Mexican / Tacos", neighborhood: "Barrio Logan",
    address: "2196 Logan Ave, San Diego, CA 92113",
    lookup: "2196 Logan Ave, San Diego, CA 92113",
    score: 86, price: 2, tags: ["Mexican","Tacos","Casual","Local Favorites","Iconic","Trending"],
    reservation: "walk-in",
    instagram: "@saludsd", website: "https://saludsd.com",
    dishes: ["Suadero Taco","Al Pastor","Birria","Chicano Art Program"],
    desc: "Barrio Logan's flagship Chicano taqueria — suadero tacos, a crowd that includes Chicano Park muralists, and a dining room whose art program is as intentional as the kitchen. The defining Barrio Logan taco room." },
  { name: "Border X Brewing", cuisine: "Brewery / Mexican-American", neighborhood: "Barrio Logan",
    address: "2181 Logan Ave, San Diego, CA 92113",
    lookup: "2181 Logan Ave, San Diego, CA 92113",
    score: 84, price: 2, tags: ["Brewery","Mexican","Casual","Local Favorites","Trending","Patio"],
    reservation: "walk-in",
    group: "Border X Brewing",
    instagram: "@borderxbrewing", website: "https://borderxbrewing.com",
    dishes: ["Blood Saison","Abuelita's Chocolate Stout","Horchata Golden","Taco Pop-Ups"],
    desc: "Barrio Logan's Latino-founded brewery — beers inspired by Mexican ingredients (Abuelita's chocolate, horchata, hibiscus), a mural-wrapped tasting room, and a community anchor for the Barrio. One of SD's most culturally specific beer programs." },
  { name: "Panama 66", cuisine: "American / Patio", neighborhood: "Balboa Park",
    address: "1450 El Prado, San Diego, CA 92101",
    lookup: "1450 El Prado, San Diego, CA 92101",
    score: 83, price: 2, tags: ["American","Patio","Casual","Scenic Views","Local Favorites","Family Friendly"],
    reservation: "walk-in",
    group: "San Diego Museum of Art",
    instagram: "@panama66sd", website: "https://panama66.com",
    dishes: ["Burger","Salads","Local Beer","Sculpture Garden Patio"],
    desc: "Balboa Park's San Diego Museum of Art courtyard café — patio seating amid the sculpture garden, a tight American menu, and one of SD's most-scenic daytime drinks. A Balboa Park afternoon staple." },
  { name: "The Prado at Balboa Park", cuisine: "Californian / Latin", neighborhood: "Balboa Park",
    address: "1549 El Prado, San Diego, CA 92101",
    lookup: "1549 El Prado, San Diego, CA 92101",
    score: 85, price: 3, tags: ["American","Latin","Date Night","Celebrations","Patio","Scenic Views","Iconic"],
    reservation: "OpenTable",
    group: "Cohn Restaurant Group",
    instagram: "@thepradobalboa", website: "https://cohnrestaurants.com/theprado",
    dishes: ["Prado Paella","Sangria","Tableside Guacamole","House of Hospitality Patio"],
    desc: "Balboa Park's House of Hospitality restaurant — a Cohn Restaurant Group room in the park's Spanish-Colonial centerpiece, with a patio that remains SD's most storybook outdoor dining. Weddings, anniversaries, out-of-town family — the Prado move." },
  { name: "Nobu San Diego", cuisine: "Japanese / Peruvian-Japanese", neighborhood: "Gaslamp",
    address: "207 Fifth Ave, San Diego, CA 92101",
    lookup: "207 Fifth Ave, San Diego, CA 92101",
    score: 88, price: 4, tags: ["Fine Dining","Japanese","Peruvian","Date Night","Celebrations","Critics Pick","Iconic"],
    reservation: "OpenTable",
    group: "Nobu / Nobu Matsuhisa",
    instagram: "@nobusandiego", website: "https://noburestaurants.com/sandiego",
    dishes: ["Black Cod Miso","Yellowtail Jalapeño","Rock Shrimp Tempura","Omakase"],
    desc: "The Gaslamp Nobu — inside the Hard Rock Hotel, Nobu Matsuhisa's Peruvian-Japanese program, with the black cod miso and yellowtail jalapeño that read the same in every Nobu dining room worldwide. The Gaslamp fine-dining anchor." },
  { name: "Searsucker", cuisine: "Modern American", neighborhood: "Gaslamp",
    address: "611 Fifth Ave, San Diego, CA 92101",
    lookup: "611 Fifth Ave, San Diego, CA 92101",
    score: 83, price: 3, tags: ["American","Modern","Date Night","Patio","Cocktails","Gaslamp"],
    reservation: "OpenTable",
    instagram: "@searsucker", website: "https://searsucker.com",
    dishes: ["Shrimp & Grits","Duck Fat Fries","Crispy Chicken","Sidewalk Patio"],
    desc: "The original Searsucker — Gaslamp's main-and-main corner, launched the Brian Malarkey empire, and set the template for SD's modern-American dining room. Sidewalk patio, shrimp & grits, and the crowd that keeps Gaslamp's 5th Ave moving." },
  { name: "The Fish Market / Top of the Market", cuisine: "Seafood / Fine Dining", neighborhood: "Downtown / Embarcadero",
    address: "750 N Harbor Dr, San Diego, CA 92101",
    lookup: "750 N Harbor Dr, San Diego, CA 92101",
    score: 85, price: 3, tags: ["Seafood","Scenic Views","Date Night","Celebrations","Iconic","Patio","Fine Dining"],
    reservation: "OpenTable",
    group: "The Fish Market",
    instagram: "@thefishmarketsd", website: "https://thefishmarket.com",
    dishes: ["Top of Market Oysters","Whole Fish","Cioppino","Bay-View Dining"],
    desc: "SD's Embarcadero seafood institution — The Fish Market downstairs (casual, oyster bar, market counter) and Top of the Market upstairs (white-tablecloth, bay-view). The San Diego harbor seafood shorthand since 1980." },
  { name: "Tahona", cuisine: "Mexican / Mezcal", neighborhood: "Old Town",
    address: "2414 San Diego Ave, San Diego, CA 92110",
    lookup: "2414 San Diego Ave, San Diego, CA 92110",
    score: 87, price: 3, tags: ["Mexican","Mezcal","Date Night","Cocktails","Critics Pick","Patio","Trending"],
    reservation: "OpenTable",
    instagram: "@tahonasd", website: "https://tahonasd.com",
    dishes: ["Mezcal Flights","Modern Mexican","Tlayudas","Courtyard Dining"],
    desc: "Old Town's mezcal-forward modern Mexican — a deep agave list, chef-driven small plates, and a courtyard that puts SD's Old Town scene in a much more grown-up register than the tourist patios next door. One of Old Town's most-credible rooms." },
  { name: "El Agave Tequileria", cuisine: "Mexican / Tequila", neighborhood: "Old Town",
    address: "2304 San Diego Ave, San Diego, CA 92110",
    lookup: "2304 San Diego Ave, San Diego, CA 92110",
    score: 84, price: 3, tags: ["Mexican","Tequila","Date Night","Iconic","Cocktails","Local Favorites"],
    reservation: "OpenTable",
    instagram: "@elagavetequileria", website: "https://elagave.com",
    dishes: ["Mole Poblano","Regional Mexican","Tequila Flights","Library of 2000+ Tequilas"],
    desc: "Old Town's tequila library — 2,000+ bottles on the wall, a regional Mexican menu that goes deeper than combo plates, and the kind of spirits program that tequila nerds fly in for. An Old Town destination." },
  { name: "Underbelly North Park", cuisine: "Japanese / Ramen", neighborhood: "North Park",
    address: "3000 Upas St, San Diego, CA 92104",
    lookup: "3000 Upas St, San Diego, CA 92104",
    score: 85, price: 2, tags: ["Japanese","Ramen","Casual","Late Night","Local Favorites","Cocktails","Iconic"],
    reservation: "walk-in",
    group: "CH Projects",
    instagram: "@godblessunderbelly", website: "https://godblessunderbelly.com",
    dishes: ["Tonkotsu Ramen","Belly of the Beast","Pork Buns","Sake Program"],
    desc: "CH Projects' ramen room — a short menu done with real care, a dining room with concert-poster walls, and one of SD's defining casual ramen calls. The CH Projects signature of tight concept, tight execution." },
  { name: "Waypoint Public", cuisine: "Modern American / Gastropub", neighborhood: "North Park",
    address: "3794 30th St, San Diego, CA 92104",
    lookup: "3794 30th St, San Diego, CA 92104",
    score: 84, price: 2, tags: ["American","Modern","Gastropub","Patio","Family Friendly","Local Favorites","Craft Beer"],
    reservation: "walk-in",
    group: "CH Projects",
    instagram: "@waypointpublic", website: "https://waypointpublic.com",
    dishes: ["Burger","Whole Fish","Rotating Taps","Patio Program"],
    desc: "30th Street gastropub — a North Park anchor from the CH Projects group, with a rotating-tap beer program, kid-friendly patio, and burger that earned it a weekly-call reputation. A defining North Park neighborhood room." },
  { name: "Super Cocina", cuisine: "Mexican / Guisados", neighborhood: "City Heights",
    address: "3627 University Ave, San Diego, CA 92104",
    lookup: "3627 University Ave, San Diego, CA 92104",
    score: 86, price: 1, tags: ["Mexican","Casual","Quick Bite","Hidden Gem","Local Favorites","Iconic","Critics Pick"],
    reservation: "walk-in",
    instagram: "@supercocinasd", website: "",
    dishes: ["Chile Verde","Mole","Cochinita Pibil","Daily Guisados Rotation"],
    desc: "City Heights' guisados cafeteria — steam-table line, daily rotation of 20+ braises and moles from across regional Mexico, and prices that haven't caught up to what the cooking deserves. A San Diego chef-favorite for decades." }
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
  let nextId = arr.length ? maxId(arr) + 1 : 15000;
  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    let c = await nominatim(e.lookup);
    if (!c) {
      const simple = e.lookup.replace(/#\S+,?\s*/i, "").replace(/Ste \S+,?\s*/i, "");
      if (simple !== e.lookup) { await sleep(1100); c = await nominatim(simple); }
    }
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

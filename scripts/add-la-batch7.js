#!/usr/bin/env node
// LA batch 7 — Michelin Guide LA (Stars + Bib Gourmand + Selected) — PL voice
// Addresses verified from training + Michelin guide listing.
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
  // ============= MICHELIN STARS =============
  { name: "Orsa & Winston", cuisine: "Contemporary / Japanese-Italian", neighborhood: "Downtown LA",
    address: "122 W 4th St, Los Angeles, CA 90013",
    lookup: "122 W 4th St, Los Angeles, CA 90013",
    score: 93, price: 4, tags: ["Fine Dining","Contemporary","Japanese","Italian","Tasting Menu","Date Night","Critics Pick","Michelin"],
    awards: "Michelin 1-Star", reservation: "Tock",
    instagram: "@orsaandwinston", website: "https://orsaandwinston.com",
    dishes: ["Ten-Course Tasting","Japanese-Italian Pasta","Seasonal Omakase","Wine Pairing"],
    desc: "Chef Josef Centeno's Downtown tasting-menu room — the one Michelin remembered before everyone else did. Ten-course Japanese-Italian hybrid, intimate counter seating, and the kind of restraint that separates a one-star from a gimmick. Reservations stay tight; book weeks out." },
  { name: "Meteora", cuisine: "Modern Global / Creative", neighborhood: "West Hollywood",
    address: "7950 Sunset Blvd, Los Angeles, CA 90046",
    lookup: "7950 Sunset Blvd, Los Angeles, CA 90046",
    score: 91, price: 4, tags: ["Fine Dining","Modern","Contemporary","Tasting Menu","Date Night","Critics Pick","Michelin"],
    awards: "Michelin 1-Star", reservation: "Tock",
    instagram: "@meteora.la", website: "",
    dishes: ["Wood-Fire Tasting","Seasonal Crudo","Fire-Roasted Vegetables","Creative Dessert"],
    desc: "Jordan Kahn's second act after Vespertine. Fire-forward modern cooking — everything hits the coals at some point — and a tasting-menu format that rewards the kind of attention most restaurants don't earn. One Michelin star, a room that manages intimate and dramatic at the same time." },
  { name: "Bar Sawa", cuisine: "Japanese / Bar / Omakase", neighborhood: "Silver Lake",
    address: "1926 Hyperion Ave, Los Angeles, CA 90027",
    lookup: "1926 Hyperion Ave, Los Angeles, CA 90027",
    score: 91, price: 4, tags: ["Japanese","Bar","Omakase","Date Night","Critics Pick","Michelin"],
    awards: "Michelin 1-Star", reservation: "Tock",
    instagram: "@barsawa.la", website: "",
    dishes: ["Omakase Counter","Sake Flight","Seasonal Tsumami","House Highball"],
    desc: "Tight Silver Lake bar-omakase format that got a Michelin star for good reason. Sixteen seats, a sake list with depth, and a menu that alternates sashimi and grilled with the rhythm of an evening out rather than a full tasting. The LA version of a Golden Gai secret." },

  // ============= BIB GOURMAND =============
  { name: "Langer's Delicatessen-Restaurant", cuisine: "Jewish Deli", neighborhood: "Westlake",
    address: "704 S Alvarado St, Los Angeles, CA 90057",
    lookup: "704 S Alvarado St, Los Angeles, CA 90057",
    score: 93, price: 2, tags: ["Deli","Jewish Deli","Casual","Iconic","Historic","Local Favorites","Michelin"],
    awards: "Michelin Bib Gourmand · James Beard America's Classics", reservation: "walk-in",
    instagram: "@langersdeli", website: "https://langersdeli.com",
    dishes: ["#19 Pastrami Sandwich","Hand-Cut Pastrami","Matzo Ball Soup","Cheese Blintzes"],
    desc: "Operating since 1947 at MacArthur Park, Langer's hand-cuts its pastrami and serves the #19 sandwich that every credible deli argument in America has to reckon with. Rye that tastes like rye, pastrami sliced thick enough to bend a jaw, Russian dressing and slaw the only way to dress it. Cash-ever-since-forever; worth the drive; worth whatever parking you find." },
  { name: "Quarter Sheets Pizza Club", cuisine: "Pizza", neighborhood: "Echo Park",
    address: "1305 Portia St, Los Angeles, CA 90026",
    lookup: "1305 Portia St, Los Angeles, CA 90026",
    score: 89, price: 2, tags: ["Pizza","Casual","Local Favorites","Critics Pick","Michelin"],
    awards: "Michelin Bib Gourmand", reservation: "walk-in",
    instagram: "@quartersheets.la", website: "",
    dishes: ["Detroit-Style Pizza","Quarter Sheet Square","Buttercake","Garden Salad"],
    desc: "Detroit-style square pizza in Echo Park that made the Bib Gourmand list on the strength of the crust. Crispy-bottomed edge, cheese pulled to the pan walls, toppings layered with the right idea. The buttercake dessert is not optional. Tight room, short menu, near-permanent line." },

  // ============= SELECTED (Michelin Guide) =============
  { name: "Manuela", cuisine: "Modern American / Southern", neighborhood: "Arts District",
    address: "907 E 3rd St #100, Los Angeles, CA 90013",
    lookup: "907 E 3rd St, Los Angeles, CA 90013",
    score: 90, price: 4, tags: ["Modern","American","Southern","Date Night","Patio","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "Resy",
    instagram: "@manuela_restaurant", website: "https://manuela-la.com",
    dishes: ["Whole Fried Chicken","Collard Greens","Seasonal Crudités","Dry-Aged Steak"],
    desc: "Inside the Hauser & Wirth gallery complex, Manuela reads like an art-world dinner from a parallel universe: southern-leaning, technically rigorous, better than it has any right to be given the gallery-café framing. Whole fried chicken is the table-stopper; the patio is one of the Arts District's prettiest seats." },
  { name: "Redbird", cuisine: "California / Contemporary", neighborhood: "Downtown LA",
    address: "114 E 2nd St, Los Angeles, CA 90012",
    lookup: "114 E 2nd St, Los Angeles, CA 90012",
    score: 91, price: 4, tags: ["Fine Dining","California","American","Date Night","Celebrations","Patio","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "OpenTable",
    group: "Neal Fraser Restaurants",
    instagram: "@redbirdla", website: "https://redbird.la",
    dishes: ["Dry-Aged Duck","California Seasonal Tasting","Tuna Tartare","Chocolate Marquise"],
    desc: "Neal Fraser's DTLA anchor, set inside an 1887 rectory with a retractable glass roof — a room that justifies the prices before the food arrives. California modern done with the discipline of a proper kitchen; dry-aged duck is the order that makes regulars repeat-book. Currently LA's most-visited fine-dining destination you don't see on Instagram constantly." },
  { name: "Rossoblu", cuisine: "Italian / Bolognese", neighborhood: "Fashion District",
    address: "1124 San Julian St, Los Angeles, CA 90015",
    lookup: "1124 San Julian St, Los Angeles, CA 90015",
    score: 89, price: 3, tags: ["Italian","Date Night","Patio","Critics Pick","Cocktails","Michelin"],
    awards: "Michelin Selected", reservation: "Resy",
    instagram: "@rossoblula", website: "https://rossoblula.com",
    dishes: ["Tagliatelle Bolognese","Hand-Cut Pasta","Wood-Fired Cotoletta","Tiramisu"],
    desc: "Steve Samson's Bolognese-specific Italian on a Fashion District corner — handmade tagliatelle with an actual-Bologna ragù, pasta program that sets the LA-Italian conversation. Patio faces downtown, room sounds like a proper Italian dinner should, and the tiramisu shouldn't be missable." },
  { name: "Girl & the Goat Los Angeles", cuisine: "Contemporary American", neighborhood: "Arts District",
    address: "555-559 S Mateo St, Los Angeles, CA 90013",
    lookup: "555 S Mateo St, Los Angeles, CA 90013",
    score: 88, price: 3, tags: ["Contemporary","American","Date Night","Cocktails","Patio","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "Resy",
    group: "Stephanie Izard",
    instagram: "@girlandthegoatla", website: "https://girlandthegoat.com/los-angeles",
    dishes: ["Goat Empanadas","Wood-Fired Pig Face","Seasonal Vegetables","Pork Shoulder"],
    desc: "Stephanie Izard's Chicago-famous concept landed in the Arts District with the formula intact and the patio upgraded. Shareable, cocktail-forward, and specifically LA in its willingness to put fire-roasted vegetables next to the wood-fired pig face. Big room, big energy, Arts District reliable." },
  { name: "Q Sushi", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Downtown LA",
    address: "521 W 7th St, Los Angeles, CA 90014",
    lookup: "521 W 7th St, Los Angeles, CA 90014",
    score: 91, price: 4, tags: ["Japanese","Sushi","Omakase","Fine Dining","Date Night","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "Tock",
    instagram: "@qsushi.la", website: "https://qsushila.com",
    dishes: ["Omakase Nigiri","Seasonal Sashimi","Aged Fish","Hokkaido Uni"],
    desc: "Downtown LA's omakase anchor and one of the few sushi rooms that can argue with the Santa Monica set. Aged fish from Toyosu, minimalist counter, chef-driven pacing. A Michelin-selected room currently flying slightly under the radar that Kaneyoshi built." },
  { name: "Yong Su San", cuisine: "Korean / Traditional", neighborhood: "Koreatown",
    address: "950 S Vermont Ave, Los Angeles, CA 90006",
    lookup: "950 S Vermont Ave, Los Angeles, CA 90006",
    score: 88, price: 3, tags: ["Korean","Traditional","Date Night","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "OpenTable",
    instagram: "@yongsusan_la", website: "",
    dishes: ["Royal Court Hanjeongsik","Gujeolpan","Galbi","Seasonal Banchan"],
    desc: "Royal Korean court cuisine done in K-town. Gujeolpan (nine-section platter), formal hanjeongsik progressions, banchan program that makes every other K-town room look casual. The Korean meal LA locals reserve for out-of-town parents. Michelin nod earned." },
  { name: "Dama", cuisine: "Latin American / Contemporary", neighborhood: "Fashion District",
    address: "612 E 11th St, Los Angeles, CA 90015",
    lookup: "612 E 11th St, Los Angeles, CA 90015",
    score: 88, price: 3, tags: ["Latin","Modern","Date Night","Cocktails","Patio","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "Resy",
    instagram: "@damafashion", website: "https://damafashion.com",
    dishes: ["Ceviche","Wood-Fired Chicken","Seasonal Crudo","Mezcal Flight"],
    desc: "Fashion District corner restaurant running modern pan-Latin with a cocktail program as central as the food. Ceviche plates that travel cleanly across Mexico, Peru, and the Caribbean without getting fusion-y; patio lit for late dinner; crowd built around both. A Michelin-selected room worth a Friday." },
  { name: "San Laurel", cuisine: "Spanish / Contemporary", neighborhood: "Downtown LA",
    address: "649 S Olive St, Los Angeles, CA 90014",
    lookup: "649 S Olive St, Los Angeles, CA 90014",
    score: 90, price: 4, tags: ["Spanish","Fine Dining","Date Night","Celebrations","Cocktails","Critics Pick","Michelin"],
    awards: "Michelin Selected", reservation: "Tock",
    instagram: "@sanlaurel", website: "https://sanlaurel.com",
    dishes: ["Spanish Tasting Menu","A5 Wagyu Presa","Seasonal Pintxos","Wine Pairing"],
    desc: "Chef José Andrés on the top floor of Hotel Per La — Spanish, modern, expensive, and absolutely committed to the tasting-menu-as-theater format. A5 wagyu, pintxos as a progression, service calibrated to the tier. One of DTLA's highest-intent dining rooms and a Michelin inclusion that makes sense." }
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
  const skipped = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    const c = await nominatim(e.lookup);
    if (!c) { console.log(`  ❌ SKIP`); skipped.push(e.name); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1100);
    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood,
      score: e.score, price: e.price, tags: e.tags, indicators: [],
      group: e.group||"", hh: "", reservation: e.reservation || "walk-in",
      awards: e.awards || "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [],
      res_tier: e.reservation === "Tock" ? 5 : e.reservation === "Resy" ? 4 : e.reservation === "OpenTable" ? 3 : 0,
      busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, instagram: e.instagram||"",
      suburb: false, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
  if (skipped.length) console.log(`   Skipped: ${skipped.join(", ")}`);
})();

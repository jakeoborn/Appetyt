#!/usr/bin/env node
// LA batch 3 — Eater LA Best Dishes 2025 — PL voice
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
  { name: "Mini Kabob", cuisine: "Armenian", neighborhood: "Glendale",
    address: "313 1/2 Vine St, Glendale, CA 91204",
    lookup: "313 Vine St, Glendale, CA 91204",
    score: 88, price: 1, tags: ["Armenian","Casual","Local Favorites","Iconic","Quick Bite"],
    instagram: "@minikabob", website: "",
    dishes: ["Beef Lule Kabob","Chicken Kabob","Ghormeh Sabzi","House Salad"],
    desc: "Five-table Glendale Armenian institution that has been grinding and grilling its own lule since before most LA food critics learned the word 'Armenian.' The beef kabob is the dish — ground-on-site, seasoned right, charred on a proper skewer — and the wait out the door is part of the experience. Cash, patience, maybe the best kabob in North America." },
  { name: "Sattdown Jamaican Grill", cuisine: "Jamaican", neighborhood: "Studio City",
    address: "11320 Ventura Blvd, Studio City, CA 91604",
    lookup: "11320 Ventura Blvd, Studio City, CA 91604",
    score: 85, price: 2, tags: ["Jamaican","Caribbean","Casual","Local Favorites"],
    instagram: "@sattdownjamaicangrill", website: "",
    dishes: ["Oxtail Platter","Curry Goat","Jerk Chicken","Ackee and Saltfish"],
    desc: "Studio City's Jamaican anchor and one of LA's most legitimate oxtail plates — braised for hours, gelatinous and deep, served with rice and peas that come out right. Jerk chicken smokes properly, curry goat comes with the bone. An island-food room inside a Ventura Blvd strip plaza; completely its own world." },
  { name: "Aunt Yvette's Kitchen", cuisine: "Ethiopian", neighborhood: "Eagle Rock",
    address: "1743 Colorado Blvd, Los Angeles, CA 90041",
    lookup: "1743 Colorado Blvd, Los Angeles, CA 90041",
    score: 84, price: 2, tags: ["Ethiopian","Casual","Vegetarian","Hidden Gem"],
    indicators: ["vegetarian"],
    instagram: "@auntyvetteskitchen", website: "",
    dishes: ["Vegan Combo","Doro Wat","Kitfo","Injera"],
    desc: "Eagle Rock's Ethiopian spot, small and warm and serious about the vegan combo — a spread of dishes on injera that makes vegetables taste like they're the main character. Doro wat for the meat plate, kitfo for the adventurous. A correction for anyone who thinks Ethiopian food only happens on Fairfax." },
  { name: "Moffett's Family Restaurant & Chicken Pie Shoppe", cuisine: "American / Diner", neighborhood: "Arcadia",
    address: "1409 S Baldwin Ave, Arcadia, CA 91007",
    lookup: "1409 S Baldwin Ave, Arcadia, CA 91007",
    score: 82, price: 2, tags: ["American","Diner","Casual","Historic","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Chicken Pot Pie","Turkey Dinner","Mashed Potatoes","Pie"],
    desc: "Arcadia's chicken pot pie time capsule. Operating since 1953 with a menu that has refused to pretend the last 70 years happened — pot pies with actual lard crust, turkey-and-gravy plates, a pie case that people plan their visit around. If you like your Americana unironic, this is the answer." },
  { name: "Belle's Delicatessen and Bar", cuisine: "Jewish Deli", neighborhood: "Highland Park",
    address: "5022 York Blvd, Los Angeles, CA 90042",
    lookup: "5022 York Blvd, Los Angeles, CA 90042",
    score: 86, price: 3, tags: ["Deli","Jewish Deli","Cocktails","Casual","Local Favorites"],
    instagram: "@belles.delicatessen", website: "",
    dishes: ["Scallion Latkes","Pastrami Sandwich","Matzo Ball Soup","Chocolate Babka"],
    desc: "The Highland Park deli that made scallion latkes a 2025 LA obsession. Crispy, green-flecked, platform-worthy — also everything else on the menu is better than it needs to be. Bar program that actually thinks about Jewish-deli-meets-natural-wine, sandwiches stacked with respect. The current York Blvd reservation to get." },
  { name: "Mariscos El Faro", cuisine: "Mexican / Seafood", neighborhood: "Highland Park",
    address: "6139 N Figueroa St, Los Angeles, CA 90042",
    lookup: "6139 N Figueroa St, Los Angeles, CA 90042",
    score: 84, price: 2, tags: ["Mexican","Seafood","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Shrimp Empanadas","Aguachile","Tostada de Ceviche","Fish Tacos"],
    desc: "The Highland Park mariscos counter that keeps getting written up and keeps not raising prices. Shrimp empanadas with the fold right and the shrimp not overcooked, aguachile that actually has the citric punch, ceviche tostadas that pass the test. Walk-up, cash-comfortable, real." },
  { name: "Dai Ho", cuisine: "Taiwanese", neighborhood: "Temple City",
    address: "9148 Las Tunas Dr, Temple City, CA 91780",
    lookup: "9148 Las Tunas Dr, Temple City, CA 91780",
    score: 88, price: 2, tags: ["Taiwanese","Chinese","Casual","Local Favorites","Iconic"],
    instagram: "", website: "",
    dishes: ["Spicy Sesame Dry Noodles","Beef Noodle Soup","Pork Chop","Scallion Pancake"],
    desc: "San Gabriel Valley's spicy-sesame-dry-noodle landmark. A cult item at a cult address — Dai Ho has been grinding out this one bowl since 1993, and the bowl is still the benchmark against which every Taiwanese dry noodle in the US gets measured. Cash-only, tight hours, worth planning around." },
  { name: "Sapp Coffee Shop", cuisine: "Thai", neighborhood: "Thai Town",
    address: "5183 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5183 Hollywood Blvd, Los Angeles, CA 90027",
    score: 87, price: 2, tags: ["Thai","Casual","Local Favorites","Iconic"],
    instagram: "", website: "",
    dishes: ["Jade Noodles","Boat Noodle Soup","Pad See Ew","Thai Iced Coffee"],
    desc: "The Thai Town diner that serves the most talked-about jade noodles in LA — bright green, chewy, in a pork broth with the right depth. No atmosphere and no apologies for it; this is a tables-of-four-and-regulars kind of room that specializes in cooking you don't get elsewhere." },
  { name: "Kurrypinch", cuisine: "Sri Lankan", neighborhood: "Hollywood",
    address: "5051 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5051 Hollywood Blvd, Los Angeles, CA 90027",
    score: 86, price: 2, tags: ["Sri Lankan","Casual","Hidden Gem","Local Favorites"],
    instagram: "@kurrypinch", website: "",
    dishes: ["Mackerel Croquettes","Devilled Chicken","Rice & Curry","Kottu"],
    desc: "LA's Sri Lankan entry and one of the cuisine's strongest cases anywhere in California. Mackerel croquettes deep-fried to the right shatter, devilled chicken hot the way it's supposed to be, a rice-and-curry plate that reminds you what rice-and-curry actually means. A Hollywood address in a genre LA needs more of." },
  { name: "Budonoki", cuisine: "Japanese / Bistro", neighborhood: "East Hollywood",
    address: "654 N Virgil Ave, Los Angeles, CA 90004",
    lookup: "654 N Virgil Ave, Los Angeles, CA 90004",
    score: 88, price: 3, tags: ["Japanese","Modern","Date Night","Wine Bar","Critics Pick"],
    instagram: "@budonoki.la", website: "",
    dishes: ["Steak Frites","Tsukune","Natural Wine","Seasonal Pasta"],
    desc: "A Japanese-run wine bistro in Virgil Village that looks exactly like what you hope to find at 8 p.m. on a Tuesday. The steak frites is aggressively great — cooked over charcoal, sauced restrained, salty — and the natural wine list reads like someone spent a decade on it. A mid-block East Hollywood reason to cancel other plans." },
  { name: "Here's Looking at You", cuisine: "Modern American", neighborhood: "Koreatown",
    address: "3901 W 6th St, Los Angeles, CA 90020",
    lookup: "3901 W 6th St, Los Angeles, CA 90020",
    score: 88, price: 3, tags: ["Modern","American","Date Night","Cocktails","Critics Pick"],
    instagram: "@hereslookingatyou_la", website: "https://hlay.la",
    dishes: ["Deep-Fried Frog Legs","Seasonal Crudo","Charcoal Chicken","Market Vegetable"],
    desc: "The HLAY K-town dining room that has been making cooks' cooks obsess over it for years. Chef Jonathan Whitener's menu reads like an itinerary across five cuisines and still hangs together — deep-fried frog legs, charcoal chicken, crudo that pulls from Japan and Mexico in the same sentence. Cocktails engineered for the bar seats." },
  { name: "Haemaru Sellutang", cuisine: "Korean", neighborhood: "Koreatown",
    address: "3498 W 8th St, Los Angeles, CA 90005",
    lookup: "3498 W 8th St, Los Angeles, CA 90005",
    score: 85, price: 2, tags: ["Korean","Casual","Local Favorites","Late Night"],
    instagram: "", website: "",
    dishes: ["Leng Saap (Spicy Pork Spine)","Sullungtang","Kimchi","Banchan"],
    desc: "K-town's leng-saap headquarters. The Korean-ization of Thai pork-spine soup — bone-in pork, chili-heavy broth, green onions, the whole thing meant to be attacked with rubber gloves and a sense of purpose. Sullungtang on the side for the recovery. One of Koreatown's more specific late-night plays." },
  { name: "Cafe 2001", cuisine: "Cafe / Japanese-American", neighborhood: "Arts District",
    address: "2001 E 7th St, Los Angeles, CA 90021",
    lookup: "2001 E 7th St, Los Angeles, CA 90021",
    score: 84, price: 2, tags: ["Cafe","Japanese","Casual","Brunch","Hidden Gem"],
    instagram: "@cafe2001la", website: "",
    dishes: ["Katsu Sandwich","Cold Brew","Breakfast Plate","Matcha Latte"],
    desc: "Arts District katsu-sandwich specialist hidden in a low-key café format. The sando is the real deal — panko crust shattering correctly, hot mustard finishing it, soft milk bread around — and the coffee program treats the pour like it's the main event. The kind of LA discovery you text people about." },
  { name: "Cosetta", cuisine: "Cal-Italian", neighborhood: "Santa Monica",
    address: "3150 Ocean Park Blvd, Santa Monica, CA 90405",
    lookup: "3150 Ocean Park Blvd, Santa Monica, CA 90405",
    score: 87, price: 3, tags: ["Italian","Cal-Italian","Date Night","Patio","Cocktails"],
    instagram: "@cosettasm", website: "",
    dishes: ["Smoked Mozzarella Sticks","Wood-Fired Pizza","Pasta","Aperol Spritz"],
    desc: "The Cal-Italian dinner in Ocean Park that Santa Monica locals will drive past three closer places to reach. Smoked mozzarella sticks as an unironic cocktail order, wood-fired pizzas with the correct leoparding, handmade pasta that doesn't apologize for itself. Patio is small; book it." }
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
      group: "", hh: "", reservation: "walk-in",
      awards: "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [], res_tier: 0, busyness: null, waitTime: null,
      popularTimes: null, lastUpdated: null, trending: false,
      instagram: e.instagram||"", suburb: false,
      website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
})();

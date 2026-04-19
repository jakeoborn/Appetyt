#!/usr/bin/env node
// LA batch 5 — Eater LA Dumplings + Best Thai — PL voice
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
  // ============= DUMPLINGS (Eater LA 18 Best Dumplings) =============
  { name: "Colette Pasadena", cuisine: "Chinese / Cantonese / Dim Sum", neighborhood: "Pasadena",
    address: "975 N Michillinda Ave, Pasadena, CA 91107",
    lookup: "975 N Michillinda Ave, Pasadena, CA 91107",
    score: 88, price: 3, tags: ["Chinese","Cantonese","Dim Sum","Date Night","Critics Pick"],
    instagram: "@colette_pasadena", website: "",
    dishes: ["Jumbo Har Gow","Siu Mai","XLB","Peking Duck"],
    desc: "Chef Peter Lai runs one of LA's more inventive Cantonese kitchens out of a quiet Pasadena dining room. Jumbo har gow with actual shrimp inside, traditional xiao long bao with the right pleats, and a dim sum list that takes the form seriously rather than dumping siu mai at you. The Pasadena surprise." },
  { name: "Ixlb Dimsum Eats", cuisine: "Chinese / Dim Sum", neighborhood: "Hollywood",
    address: "5900 Sunset Blvd, Los Angeles, CA 90028",
    lookup: "5900 Sunset Blvd, Los Angeles, CA 90028",
    score: 83, price: 2, tags: ["Chinese","Dim Sum","Casual","Quick Bite"],
    instagram: "@ixlbdimsumeats", website: "",
    dishes: ["Xiao Long Bao","Pork Buns","Char Siu Bao","Scallion Pancake"],
    desc: "Tony Ying's modern dim sum counter that brought the SGV format to Sunset. XLB are the anchor, sauces are proper, and the whole operation feels like a well-run regional chain without the chain-store feeling. Hollywood's solution for when you don't want to drive to Valley Boulevard." },
  { name: "Bistro 1968", cuisine: "Chinese / Cantonese / Dim Sum", neighborhood: "San Gabriel",
    address: "402 S San Gabriel Blvd Ste A, San Gabriel, CA 91776",
    lookup: "402 S San Gabriel Blvd, San Gabriel, CA 91776",
    score: 86, price: 2, tags: ["Chinese","Dim Sum","Cantonese","Family Friendly","Local Favorites"],
    instagram: "@bistro1968sgv", website: "",
    dishes: ["BBQ Pork Buns","Spare Ribs","Rice Rolls","Egg Tarts"],
    desc: "SGV Cantonese dim sum that nails the classics without ever trying to be clever. BBQ pork buns with the pillow right, rice rolls smooth and slick, egg tarts that earn the box you take home. The kind of weekend dim sum room that forces a 30-minute wait without apology." },
  { name: "Mr Dragon Noodle House", cuisine: "Chinese / Soup Dumplings", neighborhood: "Rosemead",
    address: "8526 Valley Blvd #108, Rosemead, CA 91770",
    lookup: "8526 Valley Blvd, Rosemead, CA 91770",
    score: 84, price: 2, tags: ["Chinese","Dumplings","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Soup Dumplings","Pan-Fried Buns","Dan Dan Noodles","Wonton Soup"],
    desc: "Rosemead's generous-portion XLB specialist. Soup dumplings with juice, pan-fried buns with the right shatter-crust, and plates that come out bigger than the bowl suggests. SGV locals know where to send new arrivals." },
  { name: "Mian", cuisine: "Chinese / Sichuan / Noodles", neighborhood: "San Gabriel",
    address: "301 W Valley Blvd #114, San Gabriel, CA 91776",
    lookup: "301 W Valley Blvd, San Gabriel, CA 91776",
    score: 84, price: 2, tags: ["Chinese","Sichuan","Noodles","Casual","Local Favorites"],
    instagram: "@mian.sgv", website: "",
    dishes: ["Spicy Sichuan Noodles","Boiled Chao Shou Dumplings","Dan Dan Noodles","Cold Noodle Salad"],
    desc: "Spicy-noodle specialist in San Gabriel where the chao-shou dumplings are the sleeper pull. Sichuan heat calibrated correctly, noodle chew dialed, bowl-to-bowl consistency that earns the regulars. Tight menu on purpose; everything on it works." },
  { name: "Zui Xiang Yuan", cuisine: "Chinese / Dumplings", neighborhood: "Alhambra",
    address: "1269 Valley Blvd, Alhambra, CA 91801",
    lookup: "1269 Valley Blvd, Alhambra, CA 91801",
    score: 83, price: 2, tags: ["Chinese","Dumplings","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Leek & Egg Pockets","Pork Dumplings","Scallion Pancakes","Beef Rolls"],
    desc: "The Alhambra inheritor of a long-running dumpling program. The leek-and-scrambled-egg pockets are the cult order; the pork dumplings are the standard. Tight menu, fast service, family-run." },
  { name: "101 Noodle Express", cuisine: "Chinese / Northern", neighborhood: "Alhambra",
    address: "1408 E Valley Blvd, Alhambra, CA 91801",
    lookup: "1408 E Valley Blvd, Alhambra, CA 91801",
    score: 87, price: 2, tags: ["Chinese","Dumplings","Casual","Local Favorites","Iconic"],
    instagram: "", website: "",
    dishes: ["Beef Roll","Thick-Skinned Pork Potstickers","Dumplings","Noodle Soup"],
    desc: "The beef-roll reference point in Southern California — flaky scallion pancake wrapped around thin-sliced braised beef, hoisin, cilantro, tucked into a cylinder that's become a benchmark. Thick-skinned potstickers keep the regulars returning. Lines out the door on weekends." },
  { name: "You Kitchen", cuisine: "Chinese / Dumplings", neighborhood: "Alhambra",
    address: "1402 E Valley Blvd, Alhambra, CA 91801",
    lookup: "1402 E Valley Blvd, Alhambra, CA 91801",
    score: 85, price: 2, tags: ["Chinese","Dumplings","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Handmade Wontons","Pork & Fennel Dumplings","13 Types of Dumplings","Cold Noodles"],
    desc: "Thirteen varieties of dumpling, all handmade, which is the kind of commitment that demands respect. Pork-and-fennel is the signature; the wontons are benchmark; the menu rewards ordering in threes. SGV specialty done right." },
  { name: "p.p.pop", cuisine: "Chinese / Taiwanese", neighborhood: "Monterey Park",
    address: "127 N Garfield Ave, Monterey Park, CA 91754",
    lookup: "127 N Garfield Ave, Monterey Park, CA 91754",
    score: 83, price: 2, tags: ["Chinese","Taiwanese","Ramen","Dumplings","Casual"],
    instagram: "", website: "",
    dishes: ["Tonkotsu Ramen","Soup Dumplings","Pan-Fried Dumplings","Boba"],
    desc: "Known mostly for ramen but the dumplings at p.p.pop quietly became a table favorite. Tonkotsu broth with the right thickness, XLB that aren't an afterthought, and a late-dinner hour that fits Monterey Park perfectly. Small room; efficient operation." },
  { name: "Bafang Dumpling", cuisine: "Chinese / Dumplings / Fast Casual", neighborhood: "City of Industry",
    address: "1552 S Azusa Ave Ste b, City of Industry, CA 91748",
    lookup: "1552 S Azusa Ave, City of Industry, CA 91748",
    score: 81, price: 1, tags: ["Chinese","Dumplings","Fast Casual","Quick Bite","Casual"],
    group: "Bafang Dumpling", instagram: "@bafangdumpling.la",
    website: "",
    dishes: ["Pan-Fried Pork Dumplings","Kimchi Potstickers","Beef Noodle Soup","Pork Buns"],
    desc: "A Taiwanese fast-casual dumpling chain that took the formula global and now anchors City of Industry. Pan-fried dumplings crisped correctly, kimchi potstickers with a real kick, priced like something made by machines even though it isn't. Ideal for a 15-minute lunch." },
  { name: "Cindy's Kitchen", cuisine: "Chinese / Dumplings", neighborhood: "Hacienda Heights",
    address: "16409 Colima Rd, Hacienda Heights, CA 91745",
    lookup: "16409 Colima Rd, Hacienda Heights, CA 91745",
    score: 83, price: 2, tags: ["Chinese","Dumplings","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Leek & Pork Dumplings","Scallion Pancake","Beef Roll","Dan Dan Noodles"],
    desc: "A Hacienda Heights dumpling destination where the leek-and-pork dumpling is the reason locals put up with the constant weekend wait. Fillings seasoned like they're meant to be eaten, scallion pancake with a golden shatter, beef roll worth the calories." },

  // ============= THAI (Eater LA Best Thai) =============
  { name: "Renu Nakorn", cuisine: "Northern Thai", neighborhood: "Norwalk",
    address: "13019 Rosecrans Ave Ste 105, Norwalk, CA 90650",
    lookup: "13019 Rosecrans Ave, Norwalk, CA 90650",
    score: 86, price: 2, tags: ["Thai","Casual","Local Favorites","Critics Pick"],
    instagram: "", website: "",
    dishes: ["Nam Kao Tod","Kang Hung Lay","Isaan Sausage","Larb Moo"],
    desc: "The Northern Thai destination that's been in Norwalk long enough to confuse visiting food writers who think all good Thai is in East Hollywood. Nam kao tod (crispy rice salad) is the dish; kang hung lay (mild pork curry) is the sleeper. Worth the drive; worth putting in your head." },
  { name: "Tantawan Thai Kitchen", cuisine: "Thai", neighborhood: "Rosemead",
    address: "9000 Garvey Ave, Rosemead, CA 91770",
    lookup: "9000 Garvey Ave, Rosemead, CA 91770",
    score: 85, price: 2, tags: ["Thai","Casual","Local Favorites","Hidden Gem"],
    instagram: "", website: "",
    dishes: ["Crunchy Catfish Salad","Century Egg Salad","Chinese Sausage Salad","Pad Prik Khing"],
    desc: "The hidden Thai that makes Rosemead a proper Thai-food drive. Crunchy catfish salad tossed with enough lime and fish sauce to finish the fillet, century-egg salad that shouldn't work as an entry dish but does. Small room, specific menu, clear point of view." },
  { name: "Miya", cuisine: "Thai", neighborhood: "Altadena",
    address: "2470 Lake Ave, Altadena, CA 91001",
    lookup: "2470 Lake Ave, Altadena, CA 91001",
    score: 85, price: 2, tags: ["Thai","Casual","Local Favorites"],
    instagram: "@miya_thai", website: "",
    dishes: ["Khao Soi","Panang Curry","Pad See Ew","Rotating Specials"],
    desc: "Altadena homestyle Thai with a khao soi that gets the balance right — creamy, tart-lime-finished, chicken or beef cooked to fall apart. Panang curry deep enough to matter, a rotating specials board worth asking about. Small neighborhood spot doing specific things correctly." },
  { name: "Chiang Rai", cuisine: "Northern Thai", neighborhood: "Long Beach",
    address: "3832 E Anaheim St, Long Beach, CA 90804",
    lookup: "3832 E Anaheim St, Long Beach, CA 90804",
    score: 86, price: 2, tags: ["Thai","Northern Thai","Casual","Critics Pick","Hidden Gem"],
    instagram: "@chiangrai_lb", website: "",
    dishes: ["Red Cotton Flower Noodle Soup","Khao Soi","Herbaceous Sausage","Curry Noodles"],
    desc: "The red-cotton-flower noodle soup here is a dish you won't find elsewhere in LA county, built on a rare Northern Thai ingredient and served in a bowl with the herb depth you didn't know you wanted. Long Beach's Thai case against the Hollywood-Norwalk axis." },
  { name: "Kwan Kitchen", cuisine: "Thai", neighborhood: "Pasadena",
    address: "777 S Arroyo Pkwy Ste 101, Pasadena, CA 91105",
    lookup: "777 S Arroyo Pkwy, Pasadena, CA 91105",
    score: 85, price: 2, tags: ["Thai","Casual","Family Friendly","Patio","Local Favorites"],
    instagram: "@kwankitchen", website: "",
    dishes: ["Mama Hot Pot","Pad Thai","Khao Soi","Papaya Salad"],
    desc: "A Thai cafeteria-style room in Pasadena running the homestyle menu that transplants write home about. Mama hot pot (noodles with meat and an egg-cracked broth) is the name to know; the pad Thai comes out of the wok with proper smoke. Pasadena Thai done right." },
  { name: "Holy Basil DTLA", cuisine: "Thai", neighborhood: "Downtown LA",
    address: "3170 Glendale Blvd, Los Angeles, CA 90039",
    lookup: "3170 Glendale Blvd, Los Angeles, CA 90039",
    score: 87, price: 3, tags: ["Thai","Date Night","Cocktails","Critics Pick","Trending"],
    group: "Holy Basil", instagram: "@holybasil_la",
    website: "https://www.holybasilla.com",
    dishes: ["Beef Tataki","Wild Shrimp Curry","Crispy Rice","Cocktail Program"],
    desc: "The Atwater Village Holy Basil — same name as the Santa Monica outpost, different energy, both part of an expanding run. Beef tataki and wild shrimp curry have both become LA Thai-modern anchors, the cocktail program holds its own against any natural-wine bar within a mile. Currently one of LA's Thai restaurants to be seen at." },
  { name: "Jitlada Restaurant", cuisine: "Southern Thai", neighborhood: "Thai Town",
    address: "5233 Sunset Blvd, Los Angeles, CA 90027",
    lookup: "5233 Sunset Blvd, Los Angeles, CA 90027",
    score: 92, price: 2, tags: ["Thai","Southern Thai","Critics Pick","Iconic","Local Favorites"],
    instagram: "@jitlada.la", website: "https://jitladala.com",
    dishes: ["Crab Curry","Fried Morning Glory Salad","Dynamite Fried Chicken","Southern Curry"],
    desc: "LA's most famous Southern Thai kitchen and the address that broke the 'Thai food is just pad thai' myth for a lot of Americans. Jazz Singsanong's Southern Thai menu — crab curries that should be trademarked, fried morning-glory salad with actual architecture, chili heat that is not a joke. A Thai Town institution." },
  { name: "Luv2eat Thai Bistro", cuisine: "Southern Thai / Phuket", neighborhood: "Hollywood",
    address: "6660 W Sunset Blvd, Los Angeles, CA 90028",
    lookup: "6660 W Sunset Blvd, Los Angeles, CA 90028",
    score: 88, price: 2, tags: ["Thai","Southern Thai","Critics Pick","Local Favorites"],
    instagram: "@luv2eatthai", website: "https://luv2eatthai.com",
    dishes: ["Hat Yai Fried Chicken","Spicy Crab Curry","Pork Leg Stew","Roti"],
    desc: "Phuket-born chefs running a menu that spotlights the rarely-exported Southern Thai canon. Hat Yai fried chicken with the shallot-sweet marinade, spicy crab curry that the regulars call once a month in anticipation, and a room loud enough to match the heat. One of Hollywood's most specific Thai rooms." },
  { name: "Isaan Station Thai Street Food", cuisine: "Isaan / Thai", neighborhood: "Koreatown",
    address: "125 N Western Ave Unit 111, Los Angeles, CA 90004",
    lookup: "125 N Western Ave, Los Angeles, CA 90004",
    score: 84, price: 2, tags: ["Thai","Isaan","Casual","Local Favorites","Quick Bite"],
    instagram: "@isaan_station", website: "",
    dishes: ["Fermented Sausage","Papaya Salad","Grilled Chicken","Larb"],
    desc: "Northeast Thai / Isaan street food in a strip-mall room decorated like a roadside Thai shop that found a second life in LA. Fermented sausage that should scare you and then doesn't, papaya salad pounded with the right fire, grilled chicken with actual color. K-town's most specific Thai entry." },
  { name: "The Original Hoy-Ka Thai Noodle", cuisine: "Thai / Noodles", neighborhood: "Hollywood",
    address: "5908 Sunset Blvd, Los Angeles, CA 90028",
    lookup: "5908 Sunset Blvd, Los Angeles, CA 90028",
    score: 84, price: 2, tags: ["Thai","Noodles","Casual","Local Favorites","Late Night"],
    instagram: "", website: "",
    dishes: ["Boat Noodle Soup","Spare Rib Tom Yum","Bamee","Jade Noodles"],
    desc: "Hollywood Thai noodle specialist focused on boat noodles — the dark, deeply-spiced Thai beef noodle soup that most American Thai menus leave off. Spare-rib tom yum is the other order; the jade noodles prove the kitchen can do more than soup. Reliable late-night Thai." },
  { name: "Mae Malai Thai House of Noodles", cuisine: "Thai / Noodles", neighborhood: "Thai Town",
    address: "5445 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5445 Hollywood Blvd, Los Angeles, CA 90027",
    score: 85, price: 2, tags: ["Thai","Noodles","Casual","Local Favorites"],
    instagram: "@maemalai_la", website: "",
    dishes: ["Boat Noodle Soup","Tom Yum Noodles","Bamee Dry","Fried Chicken"],
    desc: "The Thai Town boat-noodle room that keeps making locals feel like they're eating in Bangkok. Boat noodle soup with the right blood-dark depth, tom yum noodles that bite back, and a bamee dry that's become a regulars' default. Small, loud, fast — exactly what this genre needs." },
  { name: "Heng Heng Chicken Rice", cuisine: "Thai / Hainanese Chicken Rice", neighborhood: "Thai Town",
    address: "5420 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5420 Hollywood Blvd, Los Angeles, CA 90027",
    score: 84, price: 1, tags: ["Thai","Casual","Quick Bite","Local Favorites","Hidden Gem"],
    instagram: "@henghengla", website: "",
    dishes: ["Hainanese Chicken Rice","Chili Sauce","Braised Pork Leg","Chicken Soup"],
    desc: "Thai-style Hainanese chicken rice — the Bangkok take, not the Singapore take — served fast and cheap in Thai Town. Poached chicken, rice cooked in chicken fat, three-sauce condiment set-up that's the whole show. A cult lunch with a loyal crowd." },
  { name: "Kanomwaan", cuisine: "Thai / Dessert", neighborhood: "Thai Town",
    address: "5261 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5261 Hollywood Blvd, Los Angeles, CA 90027",
    score: 82, price: 1, tags: ["Thai","Dessert","Casual","Quick Bite","Trending"],
    instagram: "@kanomwaan", website: "",
    dishes: ["Shaved Ice","Pandan Custard Brick Toast","Thai Iced Tea","Sticky Rice & Mango"],
    desc: "Thai dessert shop that turned brick toast with pandan custard into a full-blown Thai Town institution. Shaved ice with real-pandan layers, Thai iced tea with the kind of creaminess that doesn't apologize, a dessert-first menu that's picked up a young crowd." },
  { name: "Bhan Kanom Thai", cuisine: "Thai / Sweets", neighborhood: "Thai Town",
    address: "5271 Hollywood Blvd, Los Angeles, CA 90027",
    lookup: "5271 Hollywood Blvd, Los Angeles, CA 90027",
    score: 83, price: 1, tags: ["Thai","Dessert","Bakery","Casual","Quick Bite","Iconic"],
    instagram: "", website: "",
    dishes: ["Thai Sweets","Coconut Cakes","Sticky Rice Sweets","Tako"],
    desc: "A bodega-like palace of Thai sweets and savory snacks that looks more like a Bangkok market stall than anything else in LA. Coconut cakes, sticky rice sweets, a refrigerated case of traditional desserts most Americans have never heard of. Thai Town's most specific general store." }
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
      group: e.group||"", hh: "", reservation: "walk-in",
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
  if (skipped.length) console.log(`   Skipped: ${skipped.join(", ")}`);
})();

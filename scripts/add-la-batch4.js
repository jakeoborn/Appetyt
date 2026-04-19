#!/usr/bin/env node
// LA batch 4 — Eater LA Best Chinese + Best Korean BBQ — PL voice
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
  // ============= CHINESE (Eater LA Best Chinese map) =============
  { name: "Jade Rabbit", cuisine: "Chinese American", neighborhood: "Santa Monica",
    address: "2301 Santa Monica Blvd, Santa Monica, CA 90404",
    lookup: "2301 Santa Monica Blvd, Santa Monica, CA 90404",
    score: 85, price: 2, tags: ["Chinese","American","Casual","Quick Bite","Critics Pick"],
    instagram: "@jaderabbit.la", website: "",
    dishes: ["Combination Plate","Crispy Shrimp","Orange Chicken","Scallion Pancake"],
    desc: "Chef Bryant Ng (The Spice Table, Cassia) turned his family's Chinese-American memory into a fast-casual that's taken more seriously than fast-casual usually is. Combo-plate format, sauces layered properly, a shrimp that earns its place. The Westside's best argument for the Chinese-American canon." },
  { name: "Dan Modern Chinese", cuisine: "Chinese / Dim Sum", neighborhood: "Playa Vista",
    address: "12775 Millennium Dr Ste 110, Los Angeles, CA 90094",
    lookup: "12775 Millennium Dr, Los Angeles, CA 90094",
    score: 82, price: 2, tags: ["Chinese","Dim Sum","Casual","Modern","Patio"],
    group: "Dan Modern Chinese", instagram: "@danmodernchinese",
    website: "https://danmodernchinese.com",
    dishes: ["Handmade Xiao Long Bao","Dan Dan Noodles","Sesame Chicken","Pork Soup Dumplings"],
    desc: "Playa Vista's modern-Chinese chain-lite that handmakes its xiao long bao on the line. Soup dumplings with the right thin-skin/hot-soup ratio, dan dan noodles with actual Sichuan backbone, a dining room that looks like it's on a magazine set. The Westside's cleanest regional-Chinese option outside the SGV." },
  { name: "Lan Noodle", cuisine: "Chinese / Lanzhou Noodles", neighborhood: "West Hollywood",
    address: "7100 Santa Monica Blvd Ste 130, West Hollywood, CA 90046",
    lookup: "7100 Santa Monica Blvd, West Hollywood, CA 90046",
    score: 85, price: 2, tags: ["Chinese","Noodles","Casual","Critics Pick","Quick Bite"],
    instagram: "@lannoodle", website: "",
    dishes: ["Hand-Pulled Beef Noodle Soup","Lamb Noodle","Scallion Pancake","Cold Noodle Salad"],
    desc: "Lanzhou-style hand-pulled noodles, made to order, with a rich beef broth simmered the long way. The pull happens in view; the noodles arrive in under ten minutes; the broth has the right marrow depth. West Hollywood's strongest case against the idea that you need to drive to the SGV for this." },
  { name: "Hui Tou Xiang", cuisine: "Chinese / Dumplings", neighborhood: "Hollywood",
    address: "1643 N Cahuenga Blvd, Los Angeles, CA 90028",
    lookup: "1643 N Cahuenga Blvd, Los Angeles, CA 90028",
    score: 84, price: 2, tags: ["Chinese","Dumplings","Casual","Local Favorites"],
    instagram: "@huitouxiang", website: "",
    dishes: ["Hui Tou (Pan-Fried Dumplings)","Spicy Wontons","Xiao Long Bao","Scallion Pancake"],
    desc: "Pan-fried hui-tou dumplings (double-fold envelopes of beef or pork with a crackling bottom) are the name and the move. Hollywood outpost, stylish enough for a date, serious enough to pull regional-Chinese nerds off Valley Boulevard. Order the scallion pancake." },
  { name: "Feng Mao Mutton Kebab", cuisine: "Chinese / Xinjiang BBQ", neighborhood: "Koreatown",
    address: "3901 W Olympic Blvd, Los Angeles, CA 90019",
    lookup: "3901 W Olympic Blvd, Los Angeles, CA 90019",
    score: 84, price: 2, tags: ["Chinese","Xinjiang","Casual","Late Night","Local Favorites","BBQ"],
    instagram: "@fengmaola", website: "",
    dishes: ["Lamb Skewers","Cumin Beef","Rotating Grill Feast","Scallion Pancake"],
    desc: "Self-rotating skewer grills at each table, cumin-heavy lamb sticks, and a menu that treats Xinjiang barbecue like the main event instead of a side trip. Loud, late-night, somewhat unhinged, and one of the more specific Chinese-regional experiences in the city. K-town but not Korean." },
  { name: "Joy on York", cuisine: "Taiwanese", neighborhood: "Highland Park",
    address: "5100 York Blvd, Los Angeles, CA 90042",
    lookup: "5100 York Blvd, Los Angeles, CA 90042",
    score: 85, price: 2, tags: ["Taiwanese","Chinese","Casual","Local Favorites"],
    instagram: "@joyonyork", website: "",
    dishes: ["Beef Noodle Soup","Dan Dan Noodles","Bao","Popcorn Chicken"],
    desc: "The Highland Park Taiwanese spot that made locals stop saying 'you have to drive to Valley Boulevard for this.' Beef noodle soup with the anise-clove-star-anise depth, chewy knife-cut noodles, bao with proper filling-to-dough. Clean, casual, a cornerstone of the York Blvd food conversation." },
  { name: "Taste of MP", cuisine: "Chinese / Cantonese", neighborhood: "Monterey Park",
    address: "415 W Garvey Ave, Monterey Park, CA 91754",
    lookup: "415 W Garvey Ave, Monterey Park, CA 91754",
    score: 86, price: 3, tags: ["Chinese","Cantonese","Date Night","Local Favorites","Critics Pick"],
    instagram: "", website: "",
    dishes: ["Cantonese Banquet","Double-Boiled Soup","Roast Goose","Lobster Noodles"],
    desc: "Rebranded from the old-school New Lucky, Taste of MP is running the kind of Cantonese banquet the SGV actually wants. Live-seafood tanks, soups that take hours, lunch specials that still read like a menu from a different decade. A Monterey Park Cantonese anchor and one of the few rooms in English-friendly menu form." },
  { name: "Xiaolongkan Hot Pot", cuisine: "Chinese / Hot Pot", neighborhood: "Alhambra",
    address: "46 W Valley Blvd, Alhambra, CA 91801",
    lookup: "46 W Valley Blvd, Alhambra, CA 91801",
    score: 83, price: 3, tags: ["Chinese","Hot Pot","Sichuan","Date Night","Late Night"],
    instagram: "@xiaolongkan_la", website: "",
    dishes: ["Sichuan Hot Pot Broth","Wagyu Slices","All-You-Can-Eat Sauce Bar","Tripe"],
    desc: "A Chinese mainland hot-pot chain that made it to Alhambra with its fireballs intact. Sichuan-forward broths, a sauce bar that reads as a full kitchen, and a dining room that runs loud and long. One of the strongest hot pots in a corridor full of options." },
  { name: "Yunnan Restaurant", cuisine: "Chinese / Yunnan", neighborhood: "Monterey Park",
    address: "301 N Garfield Ave Ste B, Monterey Park, CA 91754",
    lookup: "301 N Garfield Ave, Monterey Park, CA 91754",
    score: 85, price: 2, tags: ["Chinese","Yunnan","Casual","Local Favorites","Hidden Gem"],
    instagram: "", website: "",
    dishes: ["Crossing the Bridge Noodles","Mushroom Hot Pot","Yunnan Rice Noodles","Steamed Chicken"],
    desc: "The SGV institution for Yunnan — rare in California, and here done with patience. Crossing-the-Bridge noodles arrive as a DIY event — a cauldron of hot broth at the table, plates of raw additions — and it's as specific as regional-Chinese gets. Worth the drive; worth the wait." },
  { name: "Henry's Cuisine", cuisine: "Chinese / Cantonese / Vietnamese", neighborhood: "Alhambra",
    address: "301 E Valley Blvd, Alhambra, CA 91801",
    lookup: "301 E Valley Blvd, Alhambra, CA 91801",
    score: 85, price: 3, tags: ["Chinese","Cantonese","Vietnamese","Date Night","Critics Pick"],
    instagram: "", website: "",
    dishes: ["Live Lobster","Crab Cantonese Style","Salt & Pepper Shrimp","Chinese-Vietnamese Broken Rice"],
    desc: "The Alhambra Cantonese spot that leans into its owners' Cantonese-Vietnamese heritage — a live-seafood tank, specials written on paper and taped to the wall, a menu that rewards people who know what to order. One of the SGV's deeper wells and a regular critic's pick." },
  { name: "KP Town Cuisine", cuisine: "Chinese / Kaipingese", neighborhood: "Alhambra",
    address: "1328 E Valley Blvd, Alhambra, CA 91801",
    lookup: "1328 E Valley Blvd, Alhambra, CA 91801",
    score: 85, price: 2, tags: ["Chinese","Hidden Gem","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Kaiping Specialty Dish","Cantonese Classics","Soup of the Day","Crispy Noodles"],
    desc: "A mom-and-pop Alhambra address running Kaiping specialties you won't find elsewhere in the US. Small menu, deep menu, dishes specific enough that Kaiping locals drive in specifically to eat them. The SGV's most rewarding needle-in-a-haystack table." },
  { name: "Newport Seafood Restaurant", cuisine: "Chinese / Seafood", neighborhood: "San Gabriel",
    address: "518 W Las Tunas Dr, San Gabriel, CA 91776",
    lookup: "518 W Las Tunas Dr, San Gabriel, CA 91776",
    score: 89, price: 3, tags: ["Chinese","Seafood","Cantonese","Vietnamese","Date Night","Iconic"],
    instagram: "@newportseafoodla", website: "https://newportseafood.com",
    dishes: ["House Special Lobster","Salt-Baked Crab","Pepper-Salt Shrimp","Combo Fried Rice"],
    desc: "The SGV's live-lobster temple. Newport's house-special lobster — garlic, butter, Chinese and Cambodian technique merged — is the dish that's made generations of Valley Boulevard diners drive here on anniversaries. The full Cantonese-Vietnamese-Thai fusion pantry in action; a big-table situation." },
  { name: "M Joy Kitchen", cuisine: "Chinese / Northwest Chinese / Lamb", neighborhood: "San Gabriel",
    address: "301 W Valley Blvd Ste 109, San Gabriel, CA 91776",
    lookup: "301 W Valley Blvd, San Gabriel, CA 91776",
    score: 85, price: 2, tags: ["Chinese","Hidden Gem","Casual","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Lamb Chops","Cumin Lamb Noodles","Lamb Rice Bowl","Sesame Flatbread"],
    desc: "Northwest Chinese lamb-focused kitchen that specializes in the cumin-heavy mutton dishes you'd find in Xi'an or further west. Lamb chops cooked right, cumin-forward lamb noodles, and a pace that matches SGV lunch traffic. Specific enough that it's why this genre of guide exists in the first place." },
  { name: "Mr. Chopsticks Seafood and BBQ", cuisine: "Chinese / Cantonese", neighborhood: "El Monte",
    address: "10990 Lower Azusa Rd, El Monte, CA 91731",
    lookup: "10990 Lower Azusa Rd, El Monte, CA 91731",
    score: 83, price: 2, tags: ["Chinese","Cantonese","Casual","Family Friendly","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Roast Duck","Roast Pork","Cantonese Seafood","Lunch Combo"],
    desc: "The El Monte Cantonese institution where a ridiculous lunch combo arrives five minutes after you order and still tastes better than most places' dinner. BBQ window cranking out roast pork and duck, tanks of seafood in the back, menu that goes deeper than the laminated version." },
  { name: "Thumbling", cuisine: "Chinese / Dumplings", neighborhood: "West Covina",
    address: "228 S Citrus St, West Covina, CA 91791",
    lookup: "228 S Citrus St, West Covina, CA 91791",
    score: 84, price: 2, tags: ["Chinese","Dumplings","Casual","Quick Bite","Local Favorites"],
    instagram: "@thumbling_dumplings", website: "",
    dishes: ["Xiao Long Bao","Pan-Fried Pork Dumplings","Dan Dan Noodles","Scallion Pancake"],
    desc: "West Covina dumpling counter-service with the kind of tight operation that rivals Din Tai Fung without the mall real estate. XLB made fresh, pan-fried dumplings with the right base, and a menu that doesn't stretch itself thin. Pure, specific, extremely fast." },

  // ============= KOREAN BBQ (Eater LA Best KBBQ map — new only) =============
  { name: "ABSteak by Akira Back", cuisine: "Korean BBQ / Steakhouse", neighborhood: "Beverly Grove",
    address: "8500 Beverly Blvd #111, Los Angeles, CA 90048",
    lookup: "8500 Beverly Blvd, Los Angeles, CA 90048",
    score: 89, price: 4, tags: ["Korean","Korean BBQ","Steakhouse","Date Night","Cocktails","Critics Pick"],
    group: "Akira Back", instagram: "@absteakbyakiraback",
    website: "https://absteakbyakiraback.com",
    dishes: ["Dry-Aged Wagyu Galbi","Banchan Tasting","Sake-Matured Beef","Kimchi Fried Rice"],
    desc: "Akira Back's high-end K-town-polish-meets-steakhouse-ambition entry. Dry-aged wagyu grilled tableside, banchan that takes itself seriously, and a dining room engineered for anniversaries and expense accounts. The Beverly answer to K-town's grittier originals — correct, if pricey." },
  { name: "Sun Ha Jang", cuisine: "Korean BBQ / Duck", neighborhood: "Koreatown",
    address: "4032 W Olympic Blvd, Los Angeles, CA 90019",
    lookup: "4032 W Olympic Blvd, Los Angeles, CA 90019",
    score: 85, price: 2, tags: ["Korean","Korean BBQ","Casual","Iconic","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Grilled Duck","Duck Leg Roast","Duck Rice Bowl","Bean Paste Soup"],
    desc: "The Koreatown duck specialist — an actual niche inside KBBQ, executed here with the kind of muscle memory that comes from doing one thing for decades. Grilled duck off a proper setup, duck fried rice to finish, banchan that keeps coming. Quiet, specific, not in the tourist loop." },
  { name: "Daedo Sikdang", cuisine: "Korean BBQ / Steak", neighborhood: "Koreatown",
    address: "4001 W 6th St, Los Angeles, CA 90020",
    lookup: "4001 W 6th St, Los Angeles, CA 90020",
    score: 87, price: 4, tags: ["Korean","Korean BBQ","Date Night","Critics Pick"],
    instagram: "@daedosikdang.la", website: "",
    dishes: ["USDA Prime Ribeye","Galbi","Certified Angus Steak","Naengmyeon"],
    desc: "Daedo treats ribeye like the steakhouse it is — Angus prime, sliced thick, grilled on charcoal, served with the banchan spread K-town expects. One of the few K-town steakhouses that actually competes with the LA chophouse set on the meat itself. Book a weeknight; the weekend is rough." },
  { name: "Chosun Galbee", cuisine: "Korean BBQ", neighborhood: "Koreatown",
    address: "3330 W Olympic Blvd, Los Angeles, CA 90019",
    lookup: "3330 W Olympic Blvd, Los Angeles, CA 90019",
    score: 87, price: 3, tags: ["Korean","Korean BBQ","Date Night","Celebrations","Local Favorites"],
    instagram: "@chosungalbeela", website: "https://chosungalbee.com",
    dishes: ["Marinated Galbi","LA-Style Short Ribs","Bulgogi","Seafood Pancake"],
    desc: "The traditional K-town galbi house that walks the polished line — white tablecloth, excellent service, meat you don't have to argue about. Marinated short ribs are the classic order, the dol sot bibimbap is the sleeper, and the whole operation runs like a Korean family restaurant that grew up without losing the thread." },
  { name: "Jeong Yuk Jeom Korean BBQ", cuisine: "Korean BBQ / Dry-Aged", neighborhood: "Koreatown",
    address: "621 S Western Ave #100, Los Angeles, CA 90005",
    lookup: "621 S Western Ave, Los Angeles, CA 90005",
    score: 88, price: 4, tags: ["Korean","Korean BBQ","Date Night","Critics Pick"],
    instagram: "@jeongyukjeom.la", website: "",
    dishes: ["Dry-Aged Galbi","Ribeye","Skirt Steak","Kimchi Jjigae"],
    desc: "Dry-aged beef in a K-town KBBQ format is still a specialty, and Jeong Yuk Jeom is the address for it. Proper aging program, grilled tableside with the respect it deserves, banchan set up to reward the meat rather than distract from it. A K-town upscale pick." },
  { name: "Yerim Korean BBQ", cuisine: "Korean BBQ / AYCE", neighborhood: "Koreatown",
    address: "300 S Hobart Blvd, Los Angeles, CA 90020",
    lookup: "300 S Hobart Blvd, Los Angeles, CA 90020",
    score: 82, price: 2, tags: ["Korean","Korean BBQ","All You Can Eat","Casual","Late Night"],
    instagram: "@yerimkbbq", website: "",
    dishes: ["AYCE Marinated Short Rib","Pork Belly","Spicy Chicken","Banchan"],
    desc: "K-town's under-the-radar all-you-can-eat KBBQ with an unreasonably good price-to-quality split. The marinated short rib is the anchor; the pork belly makes the case. Not a scene; just a room where four friends can eat for what one dinner at Baekjeong costs." },
  { name: "Baekjeong", cuisine: "Korean BBQ", neighborhood: "Koreatown",
    address: "3429 W 8th St, Los Angeles, CA 90005",
    lookup: "3429 W 8th St, Los Angeles, CA 90005",
    score: 90, price: 3, tags: ["Korean","Korean BBQ","Date Night","Local Favorites","Critics Pick","Iconic"],
    group: "Baekjeong Global", instagram: "@baekjeongla",
    website: "https://baekjeongla.com",
    dishes: ["Pork Belly","Brisket","Galbi","Beef Tongue"],
    desc: "Still the K-town KBBQ benchmark. Thick-cut pork belly sizzled on a hotstone, brisket that rewards patience, banchan refreshed without asking. Trendy decor inspired by Korean architecture; the line is long; you show up anyway. Other KBBQ rooms exist; this is the one that sets the baseline." },
  { name: "Ahgassi Gopchang", cuisine: "Korean BBQ / Intestines", neighborhood: "Koreatown",
    address: "3744 W 6th St, Los Angeles, CA 90020",
    lookup: "3744 W 6th St, Los Angeles, CA 90020",
    score: 86, price: 3, tags: ["Korean","Korean BBQ","Late Night","Critics Pick","Local Favorites"],
    instagram: "@ahgassigopchang.la", website: "",
    dishes: ["Grilled Intestines (Gopchang)","Marinated Tripe","Pork Belly","Spicy Soup"],
    desc: "K-Pop's K-town spot, which is both accurate and a disservice — the grilled gopchang here is the actual thing, chewy-crunchy-smoky in the right proportion. Loud room, late nights, drinks flowing, a dining room that runs like a Korean club that discovered it was a restaurant." },
  { name: "Mapo Dak Galbi", cuisine: "Korean / Spicy Chicken", neighborhood: "Koreatown",
    address: "1008 S St Andrews Pl, Los Angeles, CA 90019",
    lookup: "1008 S St Andrews Pl, Los Angeles, CA 90019",
    score: 84, price: 2, tags: ["Korean","Casual","Family Friendly","Local Favorites","Late Night"],
    instagram: "@mapodakgalbi", website: "",
    dishes: ["Dak Galbi (Spicy Chicken)","Cheese Dak Galbi","Fried Rice Finish","Kimchi"],
    desc: "Spicy-chicken stir-fry done tableside — Mapo Dak Galbi lets you watch the whole thing come together over a flat griddle. Cheese option if you need it, the fried rice finish at the bottom of the pan is not skippable, the spice builds correctly. K-town family-dinner reliable." },
  { name: "Pigya", cuisine: "Korean BBQ / Pork", neighborhood: "Koreatown",
    address: "3400 W 8th St, Los Angeles, CA 90005",
    lookup: "3400 W 8th St, Los Angeles, CA 90005",
    score: 84, price: 2, tags: ["Korean","Korean BBQ","Casual","Local Favorites"],
    instagram: "@pigya.la", website: "",
    dishes: ["Pork Belly","Pork Jowl","Thick-Cut Pork Neck","Galbi"],
    desc: "A KBBQ that stays in its lane — pork, in every cut worth grilling. Thick-cut pork belly, jowl, collar, neck, all sliced on-site, all priced fairly, all served with the banchan that keeps K-town regulars returning. Not a scene; a very good pork grill." },
  { name: "Corner Place", cuisine: "Korean / BBQ / Noodles", neighborhood: "Koreatown",
    address: "2819 James M Wood Blvd, Los Angeles, CA 90006",
    lookup: "2819 James M Wood Blvd, Los Angeles, CA 90006",
    score: 85, price: 2, tags: ["Korean","Korean BBQ","Casual","Local Favorites","Historic"],
    instagram: "", website: "",
    dishes: ["Dong Chi Mi Guksu (Cold Noodles)","Marinated Galbi","Pork Belly","Kimchi"],
    desc: "The K-town old-school that stands by the dong-chi-mi-guksu cold noodles as much as the grill. Line forms before it opens, the noodles are the cult order, the galbi is the classic one. A family-sized KBBQ room that's been feeding three generations of Koreatown regulars." }
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
      score: e.score, price: e.price, tags: e.tags, indicators: e.indicators||[],
      group: e.group||"", hh: "", reservation: e.reservation || "walk-in",
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

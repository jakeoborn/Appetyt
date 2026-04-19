#!/usr/bin/env node
// LA batch 2 — Koreatown / Korean restaurants map (Eater LA) — PL voice
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
  { name: "Hojokban", cuisine: "Modern Korean", neighborhood: "Arts District",
    address: "734 E 3rd St, Los Angeles, CA 90013",
    lookup: "734 E 3rd St, Los Angeles, CA 90013",
    score: 89, price: 3, tags: ["Korean","Modern","Date Night","Cocktails","Critics Pick"],
    instagram: "@hojokban.la", website: "",
    dishes: ["Caviar Salmon","Deconstructed Galbi","Kimchi Stew","Korean Fried Chicken"],
    desc: "New York transplant that brought a modernist take on Korean cooking into the Arts District. Industrial dining room, caviar-topped salmon, deconstructed galbi plated like a museum card. One of the Korean restaurants LA people actually argue about — is it Korean-Korean or Korean-New-York? — and the food doesn't care." },
  { name: "Yu Chun", cuisine: "Korean / Noodles", neighborhood: "Koreatown",
    address: "3185 W Olympic Blvd, Los Angeles, CA 90006",
    lookup: "3185 W Olympic Blvd, Los Angeles, CA 90006",
    score: 85, price: 2, tags: ["Korean","Casual","Local Favorites","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Cold Arrowroot Noodles","Dolpan Bibimbap","Bone Broth","Kimchi Mandoo"],
    desc: "Summer in Koreatown runs through Yu Chun's cold arrowroot noodles. The dolpan bibimbap arrives sizzling with the rice crust you actually want; the self-serve bone broth station is a fixture that K-town regulars treat like a rite of passage. Unpretentious, correct, Kore-adjacent." },
  { name: "Surawon Tofu House", cuisine: "Korean / Soondubu", neighborhood: "Koreatown",
    address: "2833 W Olympic Blvd, Los Angeles, CA 90006",
    lookup: "2833 W Olympic Blvd, Los Angeles, CA 90006",
    score: 85, price: 2, tags: ["Korean","Casual","Local Favorites","Late Night","Quick Bite"],
    instagram: "", website: "",
    dishes: ["Soondubu Stew","Fried Mackerel","Kimchi Pancake","Bulgogi"],
    desc: "The best soondubu in Koreatown and not really a contest. Homemade tofu, broth that reads rich instead of watery, and the fried mackerel combo is a K-town cold-weather ritual. Dining room looks like nothing; the stew is a statement. Order the bulgogi if you need meat." },
  { name: "Soban", cuisine: "Korean / Banchan", neighborhood: "Koreatown",
    address: "4001 W Olympic Blvd, Los Angeles, CA 90019",
    lookup: "4001 W Olympic Blvd, Los Angeles, CA 90019",
    score: 88, price: 3, tags: ["Korean","Traditional","Date Night","Critics Pick","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Ganjang Gejang","Galbi","Grilled Mackerel","Banchan Set"],
    desc: "The ganjang gejang (raw-crab-in-soy) at Soban is the dish Korean-American parents bring their kids to eat so they understand what actually-from-Korea tastes like. Banchan spread that shames most of Koreatown, grilled mackerel that arrives crackling, a quiet dining room that earns its reputation. One of LA's most grown-up Korean restaurants." },
  { name: "Seogwan by Yellow Cow", cuisine: "Korean / Buckwheat Noodles", neighborhood: "Koreatown",
    address: "3460 W 8th St, Los Angeles, CA 90005",
    lookup: "3460 W 8th St, Los Angeles, CA 90005",
    score: 86, price: 3, tags: ["Korean","Noodles","Critics Pick","Date Night"],
    instagram: "@seogwan_la", website: "",
    dishes: ["Organic Buckwheat Naengmyeon","Galbi","Yellow Cow Banchan","Soondae"],
    desc: "Organic U.S. buckwheat noodles in a subtle broth that takes Korean noodle-cooking seriously — a meditative bowl that rewards paying attention. Grilled meats off the side of the menu are also excellent; the banchan gets the thought most places skip. One of the most specific Korean rooms in Koreatown right now." },
  { name: "Borit Gogae", cuisine: "Korean / Traditional", neighborhood: "Koreatown",
    address: "3464 W 8th St, Los Angeles, CA 90005",
    lookup: "3464 W 8th St, Los Angeles, CA 90005",
    score: 85, price: 3, tags: ["Korean","Traditional","Date Night","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Set Menu","Bossam","Banchan Spread","Haemul Pajeon"],
    desc: "Rustic, Korean countryside dining with a set-menu format that feels like eating at someone's well-run grandmother's place. Deep banchan spread, bossam that treats pork belly the way pork belly deserves, and a cast-iron sense of tradition. Book ahead; the room is small on purpose." },
  { name: "Soot Bull Jip", cuisine: "Korean BBQ", neighborhood: "Koreatown",
    address: "3136 W 8th St, Los Angeles, CA 90005",
    lookup: "3136 W 8th St, Los Angeles, CA 90005",
    score: 87, price: 3, tags: ["Korean","Korean BBQ","Casual","Local Favorites","Historic"],
    instagram: "", website: "",
    dishes: ["Charcoal Galbi","Bulgogi","Pork Belly","Kimchi Stew"],
    desc: "The charcoal-over-gas argument starts here. Soot Bull Jip has been grilling on actual lumpwood charcoal for decades — the smoke you leave with is part of the bill. Galbi, bulgogi, pork belly — no tableside theatrics, just meat and fire and the right char. KBBQ purists' answer when someone says 'what about Park's?'" },
  { name: "Kobawoo House", cuisine: "Korean / Bossam", neighborhood: "Koreatown",
    address: "3069 W 7th St, Los Angeles, CA 90005",
    lookup: "3069 W 7th St, Los Angeles, CA 90005",
    score: 86, price: 2, tags: ["Korean","Casual","Local Favorites","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Bossam","Haemul Pajeon","Jeyuk Bokkeum","Kimchi Pancake"],
    desc: "Bossam headquarters. Pork belly boiled correctly, served with raw oysters and kimchi, wrapped in napa — the full production. Kobawoo's haemul pajeon is one of K-town's best after-work orders, the dining room is packed-and-cozy, and the price-to-satisfaction ratio is absurd. Bring four people." },
  { name: "MDK Noodles (Myung Dong Kyoja)", cuisine: "Korean / Noodles / Dumplings", neighborhood: "Koreatown",
    address: "3630 Wilshire Blvd, Los Angeles, CA 90010",
    lookup: "3630 Wilshire Blvd, Los Angeles, CA 90010",
    score: 86, price: 2, tags: ["Korean","Noodles","Casual","Local Favorites","Quick Bite"],
    instagram: "@mdknoodles", website: "",
    dishes: ["Kalguksu","Mandu","Bibim Guksu","Kongguksu"],
    desc: "Seoul's Myung Dong Kyoja, transplanted to K-town, with the kalguksu-and-mandu formula preserved and no one allowed to mess with it. Hand-cut knife noodles in a milky broth, six mandu on the side, kimchi that cuts through — the whole meal is under $20 and ranks with the best Korean noodles in North America." },
  { name: "Sun Nong Dan", cuisine: "Korean / Galbi Jjim", neighborhood: "Koreatown",
    address: "3470 W 6th St #7, Los Angeles, CA 90020",
    lookup: "3470 W 6th St, Los Angeles, CA 90020",
    score: 86, price: 2, tags: ["Korean","Casual","Local Favorites","Late Night"],
    instagram: "@sunnongdan.la", website: "",
    dishes: ["Galbi Jjim with Cheese","Seolleongtang","Galbi Tang","Kimchi"],
    desc: "Galbi-jjim with cheese melted over the top is the Instagram dish that became a Koreatown institution — short-rib braise, sweet-spicy sauce, mozzarella crust, the entire thing flambéed tableside. Also serves a proper seolleongtang. Open late, loud, packed at midnight — and that is the point." },
  { name: "Jilli", cuisine: "Korean / Snacks", neighborhood: "Koreatown",
    address: "3905 W 6th St, Los Angeles, CA 90020",
    lookup: "3905 W 6th St, Los Angeles, CA 90020",
    score: 84, price: 2, tags: ["Korean","Snacks","Cocktails","Casual","Late Night"],
    instagram: "@jilli.la", website: "",
    dishes: ["Tteokbokki","Korean Fried Chicken","Soju Cocktails","Cheese Corn"],
    desc: "A Korean snack bar built for the after-dinner-still-hungry crew. Tteokbokki done right, Korean fried chicken with the right bubble-crust, a soju cocktail list that treats soju like a spirit instead of a chaser. Late-night K-town at peak energy." },
  { name: "Han Bat Shul Lung Tang", cuisine: "Korean / Seolleongtang", neighborhood: "Koreatown",
    address: "4163 W 5th St, Los Angeles, CA 90020",
    lookup: "4163 W 5th St, Los Angeles, CA 90020",
    score: 86, price: 2, tags: ["Korean","Casual","Local Favorites","Historic"],
    instagram: "", website: "",
    dishes: ["Seolleongtang","Kkori Gomtang","Boiled Brisket","Kimchi"],
    desc: "The K-town seolleongtang standard. Milky-white beef broth simmered long enough to become a completely different substance, served simple — salt, green onion, rice on the side. Han Bat doesn't do 18 other things. It does one thing and has been doing it correctly since the '80s." },
  { name: "Jun Won Dak", cuisine: "Korean / Samgyetang", neighborhood: "Mid-Wilshire",
    address: "4254 1/2 W 3rd St, Los Angeles, CA 90020",
    lookup: "4254 W 3rd St, Los Angeles, CA 90020",
    score: 84, price: 2, tags: ["Korean","Casual","Family Friendly","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Samgyetang","Ginseng Chicken Soup","Jeon","Kimchi"],
    desc: "Ginseng chicken soup cooked for the four hours it takes to become medicinal. Jun Won Dak specializes in the Korean idea of cooking-as-health-intervention — samgyetang, bone soups, stews designed for recovery. Small, quiet, family-run; one of K-town's most underrated addresses." },
  { name: "Jinsol Gukbap", cuisine: "Korean / Gukbap", neighborhood: "Mid-Wilshire",
    address: "4031 W 3rd St, Los Angeles, CA 90020",
    lookup: "4031 W 3rd St, Los Angeles, CA 90020",
    score: 85, price: 2, tags: ["Korean","Casual","Late Night","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Busan-Style Pork Gukbap","Spicy Pork Gukbap","Haejang Guk","Soybean Rice"],
    desc: "Busan-style pork gukbap — bone broth simmered for a day, shredded pork, rice, green onions, the kind of bowl that cures a Saturday. Jinsol is the K-town entry for this regional specialty and the only reason you need to drive to 3rd Street in the afternoon. Small, fast, honest." },
  { name: "J Korean Restaurant", cuisine: "Korean / Hanjeongsik", neighborhood: "Koreatown",
    address: "210 N Western Ave, Los Angeles, CA 90004",
    lookup: "210 N Western Ave, Los Angeles, CA 90004",
    score: 87, price: 3, tags: ["Korean","Traditional","Date Night","Celebrations","Critics Pick"],
    instagram: "@j.korean.restaurant", website: "",
    dishes: ["Hanjeongsik Set","Jeon Platter","Seasonal Banchan","Bulgogi"],
    desc: "Multi-course hanjeongsik — the Korean answer to kaiseki, which means the whole meal shows up as a progression of small, specific plates. J Korean runs a set format that rotates seasonally; the banchan alone makes the case for the price. One of the most formal Korean meals in LA." },
  { name: "Lasung House", cuisine: "Korean / Donkatsu", neighborhood: "Koreatown",
    address: "3134 W Olympic Blvd, Los Angeles, CA 90006",
    lookup: "3134 W Olympic Blvd, Los Angeles, CA 90006",
    score: 84, price: 2, tags: ["Korean","Casual","Quick Bite","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Pork Donkatsu","Asian Pasta","Seafood Plate","Curry Rice"],
    desc: "The K-town donkatsu specialist with the crispiest cutlets in the neighborhood. Sides are serious (not an afterthought), the Asian-pasta dishes on the menu are the kind of fusion that actually tastes like a plan, and the room turns over quickly. Weeknight lunch answer." },
  { name: "Lee Ga", cuisine: "Korean / Homestyle", neighborhood: "Koreatown",
    address: "698 S Vermont Ave, Los Angeles, CA 90005",
    lookup: "698 S Vermont Ave, Los Angeles, CA 90005",
    score: 84, price: 2, tags: ["Korean","Casual","Local Favorites","Family Friendly"],
    instagram: "", website: "",
    dishes: ["Stone Pot Stews","Doenjang Jjigae","Bulgogi","Banchan Spread"],
    desc: "The K-town mom-and-pop with bubbling stone-pot soups and the homestyle banchan that K-town regulars bring their out-of-town family to. Doenjang jjigae done right, bulgogi not oversweetened, and a dining room with more regulars than first-timers." }
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
      group: "", hh: "", reservation: "walk-in",
      awards: "", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [], res_tier: 0,
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

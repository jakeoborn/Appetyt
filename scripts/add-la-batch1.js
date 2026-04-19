#!/usr/bin/env node
// LA expansion batch 1 — Michelin Stars LA 2025 + San Fernando Valley map
// Addresses via la.eater.com. Descriptions: Peter Luger voice.
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
  // =================== MICHELIN STARS 2025 ===================
  { name: "Somni", cuisine: "Spanish / Tasting Menu", neighborhood: "West Hollywood",
    address: "9045 Nemo St, West Hollywood, CA 90069",
    lookup: "9045 Nemo St, West Hollywood, CA 90069",
    score: 98, price: 4, tags: ["Fine Dining","Spanish","Tasting Menu","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 3-Star 2025", reservation: "Tock",
    instagram: "@somnirestaurant", website: "https://somnirestaurant.com",
    dishes: ["20+ Course Tasting Menu","Caviar Course","Seasonal Fish","Dessert Finale"],
    desc: "Aitor Zabala closed at the SLS Beverly Hills, reopened in West Hollywood in 2024, and got bumped to three Michelin stars for his trouble. The 20+ course tasting is theatrical in a way that justifies itself — every course is either a perfectly-engineered bite or a piece of performance art. The rarest reservation in LA and one of the six three-star rooms in America. Getting in is the entire problem." },
  { name: "Hayato", cuisine: "Japanese Kaiseki", neighborhood: "Arts District",
    address: "1320 E 7th St #126, Los Angeles, CA 90021",
    lookup: "1320 E 7th St, Los Angeles, CA 90021",
    score: 96, price: 4, tags: ["Fine Dining","Japanese","Kaiseki","Tasting Menu","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 2-Star 2025", reservation: "Tock",
    instagram: "@hayatorestaurant", website: "https://hayatorestaurant.com",
    dishes: ["Multi-Course Kaiseki","Seasonal Sashimi","Charcoal-Grilled Fish","Rice Course"],
    desc: "Brandon Go's eight-seat kaiseki counter tucked inside an Arts District market hall, two Michelin stars, and one of the hardest seats to book in the city. Traditional Japanese multi-course cooking, carried out by a chef who studied the form with the discipline it deserves. Not a place for casual walk-ins or tasting-menu amateurs — this is where you go when you actually want to understand kaiseki." },
  { name: "Mélisse", cuisine: "French / Modern American", neighborhood: "Santa Monica",
    address: "1104 Wilshire Blvd, Santa Monica, CA 90401",
    lookup: "1104 Wilshire Blvd, Santa Monica, CA 90401",
    score: 95, price: 4, tags: ["Fine Dining","French","Tasting Menu","Date Night","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 2-Star 2025", reservation: "Tock",
    instagram: "@melisserestaurant", website: "https://melisse.com",
    dishes: ["Caviar Course","Pitch-Perfect Tasting Menu","Wine Pairing","Cheese Course"],
    desc: "Josiah Citrin's white-tablecloth Santa Monica stalwart and one of the few LA rooms still running a pure tasting-menu program at the highest level. Caviar, wagyu, a wine list with actual depth, and service polished to a level most of LA's new-school spots never even attempt. Two stars, thirty years in, and still a benchmark." },
  { name: "Vespertine", cuisine: "Modern American / Tasting Menu", neighborhood: "Culver City",
    address: "3599 Hayden Ave, Culver City, CA 90232",
    lookup: "3599 Hayden Ave, Culver City, CA 90232",
    score: 94, price: 4, tags: ["Fine Dining","Tasting Menu","Date Night","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 2-Star 2025", reservation: "Tock",
    instagram: "@vespertine.la", website: "https://vespertine.la",
    dishes: ["16-Course Tasting Menu","Seasonal Amuse","Specialty Beverage Pairing","Dessert Theater"],
    desc: "Jordan Kahn's immersive 16-course experience set across multiple floors of an architectural curiosity nicknamed 'the Waffle.' Two Michelin stars, a custom-scored soundtrack, plates that look like artifacts. Polarizing — some people think it's the best dinner in LA, some think it's a piece of conceptual art that happens to include food. Either way, you'll remember it." },
  { name: "Inaba Japanese Restaurant", cuisine: "Japanese / Kaiseki", neighborhood: "Torrance",
    address: "20920 Hawthorne Blvd, Torrance, CA 90503",
    lookup: "20920 Hawthorne Blvd, Torrance, CA 90503",
    score: 93, price: 4, tags: ["Fine Dining","Japanese","Kaiseki","Date Night","Critics Pick","Michelin"],
    awards: "Michelin 1-Star 2025", reservation: "Tock",
    instagram: "", website: "",
    dishes: ["$100 Kaiseki Dinner","Seasonal Sashimi","Dashi Course","Housemade Soba"],
    desc: "The South Bay's first-ever Michelin star, earned in 2022 and kept since. A $100-per-head kaiseki dinner that would cost triple in Beverly Hills, served from a small counter that feels like a secret. Torrance is a drive; the experience earns it. Don't expect English on every menu card — bring your attention." },
  { name: "Sushi Kaneyoshi", cuisine: "Japanese / Sushi", neighborhood: "Little Tokyo",
    address: "250 E 1st St B1, Los Angeles, CA 90012",
    lookup: "250 E 1st St, Los Angeles, CA 90012",
    score: 95, price: 4, tags: ["Fine Dining","Japanese","Sushi","Omakase","Celebrations","Critics Pick","Michelin"],
    awards: "Michelin 1-Star 2025", reservation: "Tock",
    instagram: "", website: "",
    dishes: ["Edomae Omakase","Seasonal Nigiri","Aged Sashimi","Tamago"],
    desc: "A subterranean Edomae counter beneath Little Tokyo that feels like it was imported whole from Ginza. Chef Yoshiyuki Inoue, eight seats, aged fish, rice cooked correctly, no menu, no drama. The sushi-omakase conversation in LA runs through Mori, Ginza Onodera, and this room — and Kaneyoshi is the quietest and hardest-earned." },
  { name: "Gwen", cuisine: "Steakhouse / Butcher", neighborhood: "Hollywood",
    address: "6600 Sunset Blvd, Los Angeles, CA 90028",
    lookup: "6600 Sunset Blvd, Los Angeles, CA 90028",
    score: 91, price: 4, tags: ["Fine Dining","Steakhouse","Date Night","Cocktails","Critics Pick","Michelin"],
    awards: "Michelin 1-Star 2025", reservation: "Resy",
    instagram: "@gwenla", website: "https://gwenla.com",
    dishes: ["Tasting Menu","Grilled Wagyu","Dry-Aged Beef","Wagyu Tartare"],
    desc: "Curtis Stone's meat-centric Hollywood restaurant with its own butcher counter at the entrance. One Michelin star, a tasting menu that treats beef like a main character, and a dining room that actually feels like a restaurant, not a concept. The wagyu tartare is the Instagram moment; the tasting menu is the reason to come back." },
  { name: "Kato Restaurant", cuisine: "Taiwanese / Japanese / Modern", neighborhood: "Arts District",
    address: "777 S Alameda St Building 1 Ste 114, Los Angeles, CA 90021",
    lookup: "777 S Alameda St, Los Angeles, CA 90021",
    score: 94, price: 4, tags: ["Fine Dining","Taiwanese","Tasting Menu","Date Night","Critics Pick","Michelin"],
    awards: "Michelin 1-Star 2025", reservation: "Tock",
    instagram: "@katorestaurantla", website: "https://katorestaurant.com",
    dishes: ["Tasting Menu","Taiwanese Fan Tuan","Seasonal Fish","Shaved Ice Finale"],
    desc: "Jon Yao's Arts District tasting menu reads Taiwanese-American but feels entirely its own thing. A Michelin star, a 10+ course menu built around chef Yao's Taipei-through-California lens, and a room that somehow pulls off both intimate and confident. One of the most specific tasting-menu experiences in LA and one of the few that routinely earns its tag on the best-restaurants-in-America lists." },
  { name: "Gucci Osteria da Massimo Bottura", cuisine: "Italian / Tasting Menu", neighborhood: "Beverly Hills",
    address: "347 N Rodeo Dr, Beverly Hills, CA 90210",
    lookup: "347 N Rodeo Dr, Beverly Hills, CA 90210",
    score: 91, price: 4, tags: ["Fine Dining","Italian","Date Night","Celebrations","Critics Pick","Michelin","Rodeo Drive"],
    awards: "Michelin 1-Star 2025", reservation: "OpenTable",
    group: "Gucci / Massimo Bottura",
    instagram: "@gucciosteriabh", website: "https://www.gucci.com",
    dishes: ["Emilia Burger","Tortellini in Cream","Tasting Menu","Seasonal Pasta"],
    desc: "Massimo Bottura's Rodeo Drive project sounds like a PR stunt until you sit down. One Michelin star, pasta that justifies the Gucci-branded patio, and the Emilia burger — a Bottura greatest-hit that should be cornier than it is. The room is a lot; the food isn't playing." },

  // =================== SAN FERNANDO VALLEY ===================
  { name: "Casaléna", cuisine: "Italian / Mediterranean", neighborhood: "Woodland Hills",
    address: "22160 Ventura Blvd, Woodland Hills, CA 91364",
    lookup: "22160 Ventura Blvd, Woodland Hills, CA 91364",
    score: 86, price: 3, tags: ["Italian","Mediterranean","Date Night","Patio","Cocktails"],
    instagram: "@casalena_ca", website: "",
    dishes: ["Handmade Pasta","Wood-Fired Branzino","Burrata","Carpaccio"],
    desc: "The upscale Ventura Blvd spot that made West Valley diners stop driving into Hollywood for Italian. Verdant patio, handmade pastas, and a kitchen that treats Mediterranean as a full tradition instead of a vibe. The closest thing to a Rodeo Drive room the Valley has." },
  { name: "Cavaretta's Italian Deli", cuisine: "Italian / Deli", neighborhood: "Canoga Park",
    address: "22045 Sherman Way, Canoga Park, CA 91303",
    lookup: "22045 Sherman Way, Canoga Park, CA 91303",
    score: 84, price: 1, tags: ["Italian","Deli","Casual","Quick Bite","Local Favorites","Historic"],
    instagram: "@cavarettasdeli", website: "",
    dishes: ["Hot Meatball Sandwich","Italian Sub","House Sausage","Marinara by the Quart"],
    desc: "Operating since 1959, which makes it older than most of the San Fernando Valley's strip malls. Italian sandwiches that have kept their formula intact — the hot meatball sub is the move, the Italian sub is the move if you don't want a hot meatball sub. Counter service, tight, unpretentious, unbeatable." },
  { name: "Modern Bread & Bagel", cuisine: "Bakery / Gluten-Free", neighborhood: "Woodland Hills",
    address: "6256 Topanga Canyon Blvd Ste 1200, Woodland Hills, CA 91367",
    lookup: "6256 Topanga Canyon Blvd, Woodland Hills, CA 91367",
    score: 83, price: 2, tags: ["Bakery","Cafe","Healthy","Casual","Family Friendly"],
    instagram: "@modernbreadnbagel", website: "https://modernbreadbagel.com",
    dishes: ["Gluten-Free Bagel","Breakfast Plate","Loaded Lox","Chocolate Babka"],
    desc: "Entirely gluten-free and the rare bakery in that category where the product doesn't announce its restrictions. Bagels that chew right, sandwiches that feel like sandwiches, babka that passes the gifted-to-a-skeptic test. The gluten-free world's Russ & Daughters moment." },
  { name: "The Brothers Sushi", cuisine: "Japanese / Sushi / Omakase", neighborhood: "Woodland Hills",
    address: "21418 Ventura Blvd, Woodland Hills, CA 91364",
    lookup: "21418 Ventura Blvd, Woodland Hills, CA 91364",
    score: 90, price: 4, tags: ["Japanese","Sushi","Omakase","Date Night","Critics Pick"],
    instagram: "@thebrotherssushi", website: "https://thebrotherssushi.com",
    dishes: ["Omakase","Seasonal Nigiri","Toro","Sake Pairing"],
    desc: "The sushi destination Valley locals defend when you say LA's best sushi is on the Westside. Refined omakase, high-end sake program, and a chef who treats seasonality like the contract it's supposed to be. Reservations are starting to feel Nozawa-adjacent; book ahead." },
  { name: "Cupid's Hot Dogs", cuisine: "Hot Dogs / American", neighborhood: "Winnetka",
    address: "20030 Vanowen St, Winnetka, CA 91306",
    lookup: "20030 Vanowen St, Winnetka, CA 91306",
    score: 82, price: 1, tags: ["American","Hot Dogs","Casual","Quick Bite","Historic","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Cupid Chili Dog","Chili Cheese Fries","Polish Dog","Orange Drink"],
    desc: "Roller-skating carhops, red-and-white awnings, chili-dog formula unchanged since the 1950s. Cupid's is Valley Americana — the chili dog still drapes the bun correctly, the orange drink is still neon, and the carhops still know their customers by name. Time-machine order at current pricing." },
  { name: "Brent's Deli", cuisine: "Jewish Deli", neighborhood: "Northridge",
    address: "19565 Parthenia St, Northridge, CA 91324",
    lookup: "19565 Parthenia St, Northridge, CA 91324",
    score: 87, price: 2, tags: ["Deli","Jewish Deli","Casual","Local Favorites","Historic","Family Friendly"],
    instagram: "@brentsdeli", website: "https://brentsdeli.com",
    dishes: ["Black Pastrami Reuben","Matzo Ball Soup","Corned Beef Sandwich","Chocolate Phosphate"],
    desc: "Northridge since 1967 and still the deli conversation when someone says LA doesn't have delis. The black pastrami Reuben is the play — peppery, fatty, properly stacked — and the matzo ball soup is the other order no regular skips. Vintage dining room, regulars on first-name basis with the waitstaff, zero concessions to fashion." },
  { name: "Baja Subs Market & Deli", cuisine: "Sri Lankan / Mexican", neighborhood: "Northridge",
    address: "8801 Reseda Blvd Ste A, Northridge, CA 91324",
    lookup: "8801 Reseda Blvd, Northridge, CA 91324",
    score: 83, price: 1, tags: ["Sri Lankan","Mexican","Casual","Quick Bite","Hidden Gem","Local Favorites"],
    instagram: "", website: "",
    dishes: ["Sri Lankan Kottu","Devilled Chicken","Carnitas Torta","Rice & Curry"],
    desc: "The strip-mall Sri Lankan find hiding behind a Mexican-deli storefront — exactly the kind of double-life kitchen the Valley does better than anywhere else in LA. Kottu and devilled chicken one counter; carnitas tortas the other. Both menus are real, both are great, the deal is unreal." },
  { name: "Furn Saj Bakery", cuisine: "Lebanese / Bakery", neighborhood: "Granada Hills",
    address: "11146 Balboa Blvd, Granada Hills, CA 91344",
    lookup: "11146 Balboa Blvd, Granada Hills, CA 91344",
    score: 84, price: 1, tags: ["Lebanese","Middle Eastern","Bakery","Casual","Quick Bite"],
    instagram: "", website: "",
    dishes: ["Za'atar Mana'ish","Cheese Saj","Chicken Shawarma Wrap","Kibbeh"],
    desc: "The North Valley's Lebanese bakery of record. Saj bread pulled off the dome in front of you, mana'ish with za'atar that tastes like it was grown on a different continent, and shawarma wraps that travel well. Counter service; the line is the local endorsement." },
  { name: "Sadaf Restaurant", cuisine: "Persian", neighborhood: "Encino",
    address: "16240 Ventura Blvd, Encino, CA 91436",
    lookup: "16240 Ventura Blvd, Encino, CA 91436",
    score: 85, price: 3, tags: ["Persian","Middle Eastern","Date Night","Family Friendly","Local Favorites"],
    instagram: "@sadafencino", website: "",
    dishes: ["Chelo Kabob","Joojeh","Barg","Saffron Rice"],
    desc: "Encino's Persian destination and one of the better chelo kabob plates you'll find in LA proper. Saffron-streaked basmati, properly charred skewers, and the kind of dining room that has hosted three generations of Westside Persian-American families on the same Friday. Order the barg and the joojeh; split them; thank yourself." },
  { name: "El Cocinero", cuisine: "Vegan Mexican", neighborhood: "Van Nuys",
    address: "6265 Sepulveda Blvd, Van Nuys, CA 91411",
    lookup: "6265 Sepulveda Blvd, Van Nuys, CA 91411",
    score: 81, price: 1, tags: ["Mexican","Vegan","Vegetarian","Casual","Quick Bite"],
    indicators: ["vegetarian"],
    instagram: "@elcocinerovegan", website: "",
    dishes: ["Vegan Al Pastor Tacos","Bean Burrito","Vegan Nachos","Street Corn"],
    desc: "Van Nuys vegan Mexican that would fool your meat-eating uncle — al pastor made with a jackfruit-forward marinade that hits the seasoning without the smugness. Casual counter, cheap plates, a solid addition to the increasingly crowded LA vegan-Mexican conversation." },
  { name: "Sri Siam Cafe", cuisine: "Thai", neighborhood: "Valley Glen",
    address: "12843 Vanowen St, Valley Glen, CA 91605",
    lookup: "12843 Vanowen St, Valley Glen, CA 91605",
    score: 85, price: 2, tags: ["Thai","Casual","Family Friendly","Local Favorites","Hidden Gem"],
    instagram: "", website: "",
    dishes: ["Boat Noodles","Larb Gai","Pad See Ew","Sticky Rice & Mango"],
    desc: "Family-owned, no-frills Valley Thai that punches wildly above its strip-mall. Boat noodles with the depth actual boat noodles need, larb that lands on the right side of funky, and a menu that has regulars ordering off the specials board before they look at the main menu. Not a scene, all cooking." },
  { name: "Yala Coffee", cuisine: "Coffee / Cafe", neighborhood: "Studio City",
    address: "11824 Ventura Blvd, Studio City, CA 91604",
    lookup: "11824 Ventura Blvd, Studio City, CA 91604",
    score: 83, price: 2, tags: ["Coffee Shop","Cafe","Casual","Patio"],
    instagram: "@yala.coffee", website: "",
    dishes: ["Iraqi Sand Coffee","Cardamom Latte","Baklava Cookie","Breakfast Sandwich"],
    desc: "Iraqi-inspired Studio City café with a sand-coffee setup that's as close to a tableside pour as LA coffee gets. Cardamom latte is the house order, the pastries carry weight, and the patio is better than any Starbucks within a three-mile radius. A specific third place that couldn't exist anywhere else in the Valley." },
  { name: "Avi Cue", cuisine: "Middle Eastern / Shawarma", neighborhood: "Studio City",
    address: "11288 Ventura Blvd, Studio City, CA 91604",
    lookup: "11288 Ventura Blvd, Studio City, CA 91604",
    score: 85, price: 2, tags: ["Middle Eastern","Casual","Quick Bite","Trending","Local Favorites"],
    instagram: "@avicue", website: "",
    dishes: ["Wagyu Shawarma","Garlic Sauce","Hummus","Pita"],
    desc: "Shawarma pop-up that went permanent because the wagyu concept actually worked. Thinly-shaved wagyu off a proper vertical spit, stuffed into pita with garlic sauce that got an entire Studio City crowd addicted. Tight menu, long lines, enough internet noise to tell you this is the current thing." },
  { name: "Verse", cuisine: "Latin / Supper Club", neighborhood: "Toluca Lake",
    address: "4212 Lankershim Blvd, Toluca Lake, CA 91602",
    lookup: "4212 Lankershim Blvd, Toluca Lake, CA 91602",
    score: 83, price: 3, tags: ["Latin","Cocktails","Date Night","Live Music"],
    instagram: "@verselatinkitchen", website: "",
    dishes: ["Empanadas","Grilled Entrée","House Cocktail","Dessert Board"],
    desc: "Part restaurant, part music venue, part dinner-theater — a supper-club swing that mostly works. Latin-American menu, live music most nights, cocktails engineered to last through a set. If you've been looking for a Toluca Lake reason to stay out past 10 p.m., this is one." }
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
      awards: e.awards || "", description: e.desc, dishes: e.dishes,
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
  if (skipped.length) console.log(`   Skipped: ${skipped.join(", ")}`);
})();

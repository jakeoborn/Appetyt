'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

// 5 genuinely missing Austin Eater 38 restaurants — verified against AUSTIN_DATA (maxId 5636)
const NEW_CARDS = [
  {
    id: 5637,
    name: "Himalaya Kosheli",
    address: "8650 Spicewood Springs Rd Ste 148, Austin, TX 78759",
    lat: 30.4326, lng: -97.7715,
    phone: "(512) 582-0157", website: "himalayakosheli.com", instagram: "himalayakosheli",
    reservation: "walk-in", reserveUrl: "",
    hours: "Tue–Sun 11am–3pm, 5–9:30pm, Mon closed",
    cuisine: "Nepali / Himalayan",
    price: 2,
    description: "One of Austin's only Nepali restaurants, serving authentic Himalayan dishes made fresh daily including traditional momos, dal bhat thalis, goat curry, and thukpa noodle soups. Both à la carte ordering and a lunch buffet are available in a welcoming Northwest Austin strip-mall setting. A genuine find for Austin's Himalayan food scene.",
    dishes: ["Dal Bhat (lentil soup, steamed rice, vegetable tarkari, pickles, yogurt)", "Veg Kothey Momos (pan-fried vegetable dumplings)", "Chili Chicken Momos", "Himalayan Goat Curry (bone-in goat, Nepali spices)", "Chicken Thukpa (Nepali noodle soup)", "Chicken Tikka", "Vegetable Chowmein"],
    score: 82,
    neighborhood: "Northwest Austin",
    tags: ["Nepali", "Himalayan", "Indian", "Casual", "Buffet", "Family-Friendly", "Northwest Austin"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 5638,
    name: "Usta Kababgy",
    address: "9310 N Lamar Blvd, Austin, TX 78753",
    lat: 30.3627, lng: -97.6981,
    phone: "(512) 465-2720", website: "ustakababgy.com", instagram: "ustakababgy",
    reservation: "walk-in", reserveUrl: "",
    hours: "Mon–Tue 11am–10pm, Wed closed, Thu–Sun 11am–10pm",
    cuisine: "Uzbek / Kebab",
    price: 2,
    description: "An Austin standout for Central Asian and Middle Eastern halal charcoal grilling, serving handmade kebabs alongside Uzbek-influenced flatbreads, wraps, and rice plates. All meats are grilled over charcoal for a distinct smoky character with generous portions at accessible prices. A go-to for Austin's halal-seeking diners.",
    dishes: ["Adana Kabab (ground lamb skewer, grilled tomatoes, onion-parsley salad, rice)", "Iraqi Kabab (ground lamb with onion and parsley, charcoal-grilled)", "Meat Kabab Wrap (flatbread, parsley, onion, tomato)", "Zaatar & Cheese Flatbread", "Turkish Sausage Pita (sujuk with mozzarella)", "Baba Ghanoush", "Lentil Soup"],
    score: 84,
    neighborhood: "North Austin",
    tags: ["Halal", "Kebab", "Uzbek", "Middle Eastern", "Charcoal Grill", "Casual", "North Austin"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 5639,
    name: "Komé Sushi Kitchen",
    address: "5301 Airport Blvd Ste 100, Austin, TX 78751",
    lat: 30.3140, lng: -97.7145,
    phone: "(512) 712-5700", website: "kome-austin.com", instagram: "komeaustin",
    reservation: "walk-in", reserveUrl: "",
    hours: "Mon–Thu 11am–2pm, 5–10pm; Fri–Sun 11am–10pm",
    cuisine: "Japanese",
    price: 2,
    description: "A beloved family-run Austin institution founded in 2006 by Take and Kayo Asazu, growing from a farmers' market bento stand into a full-service Japanese restaurant. Lunch centers on a shokudo-style bistro menu; dinner shifts to izakaya small plates with sake pairings; the full sushi menu is available all day. Voted Best Sushi 2025 by the Austin Chronicle.",
    dishes: ["Kara-Age (fried chicken thighs with Japanese mayo)", "Tonkotsu Ramen (pork chashu, blackened garlic oil)", "Tarantula Roll (shrimp tempura, softshell crab, avocado, black tobiko, go-go sauce)", "Alone Together Roll (tuna, salmon, yellowtail, BBQ eel, tempura crunch)", "Sake Kasu Cheesecake (housemade with sake lees)", "Chirashi-Don (tuna, salmon, yellowtail, scallop, ikura, unagi)"],
    score: 90,
    neighborhood: "North Loop",
    tags: ["Japanese", "Sushi", "Izakaya", "Ramen", "Family-Run", "Casual", "Walk-In", "North Loop"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 5640,
    name: "Crown & Anchor Pub",
    address: "2911 San Jacinto Blvd, Austin, TX 78705",
    lat: 30.2925, lng: -97.7356,
    phone: "(512) 322-9168", website: "crownandanchorpub.com", instagram: "crownandanchor_atx",
    reservation: "walk-in", reserveUrl: "",
    hours: "Daily 11am–2am",
    cuisine: "American Pub",
    price: 1,
    description: "A Hyde Park and UT campus institution open since 1987, with over 30 taps focused on local and craft beers and happy hour daily 2–7pm on all drafts. The kitchen turns out burgers made with locally sourced, never-frozen beef from Ruffino Meats alongside housemade queso and classic pub fare. Dogs are always welcome on the large covered patio.",
    dishes: ["Classic Hamburger & Fries (fresh Ruffino Meats beef)", "Mushroom Swiss Burger", "Bacon Cheeseburger", "Award-Winning Veggie Burger", "Crown Nachos (refried beans, cheddar, housemade salsa)", "Queso & Chips (green chiles, extra melt cheese)", "Cheddar Cheese Fries"],
    score: 80,
    neighborhood: "Hyde Park",
    tags: ["Pub", "Burgers", "Craft Beer", "Dog-Friendly", "Patio", "Late Night", "College", "Hyde Park"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 5641,
    name: "Ensenada ATX",
    address: "1108 E 12th St, Austin, TX 78702",
    lat: 30.2727, lng: -97.7283,
    phone: "", website: "ensenadaatx.com", instagram: "ensenadatx",
    reservation: "walk-in", reserveUrl: "",
    hours: "Tue–Sat 11am–6pm, Sun–Mon closed",
    cuisine: "Mexican Seafood / Baja",
    price: 1,
    description: "A family-run food truck on East 12th Street bringing Baja-style mariscos to Austin, with every taco fried to order and all salsas made fresh each morning. Lightly battered wild Atlantic cod and Gulf shrimp anchor the menu, complemented by weekend-only ceviche tostadas and shrimp cocktail. An East Austin favorite for honest, bright Baja flavors.",
    dishes: ["Fish Tacos (lightly battered Atlantic cod, cabbage, crema, pickled onion, chile de árbol salsa)", "Shrimp Tacos (Gulf shrimp, citrus slaw, habanero crema)", "Tostada de Ceviche (lime-cured fish, pico de gallo, avocado — weekends)", "Cóctel de Camarón (shrimp cocktail, avocado, cucumber — weekends)", "Topo Chico Limeade"],
    score: 83,
    neighborhood: "East Austin",
    tags: ["Baja", "Seafood", "Tacos", "Food Truck", "Mexican", "East Austin", "Casual", "Affordable"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  }
];

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const AUSTIN_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} AUSTIN_DATA declaration(s)`);
if (declarations.length !== 1) { console.error('Expected exactly 1'); process.exit(1); }

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const AUSTIN_DATA\s*=\s*\[/)[0].length;
let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

const existing = eval('[' + html.slice(startIdx, closeIdx) + ']');
const prevCount = existing.length;
console.log(`Current Austin count: ${prevCount}`);

NEW_CARDS.forEach(card => {
  const dupeId = existing.find(r => r.id === card.id);
  const dupeName = existing.find(r => r.name.toLowerCase() === card.name.toLowerCase());
  if (dupeId) { console.error(`ID ${card.id} already exists: ${dupeId.name}`); process.exit(1); }
  if (dupeName) { console.error(`Name already exists: ${dupeName.name} (id ${dupeName.id})`); process.exit(1); }
});
console.log('No duplicates found — safe to insert');

const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

const m2 = html.match(/const AUSTIN_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
let newCount;
try { newCount = eval('[' + html.slice(s2, p2 - 1) + ']').length; }
catch (e) { console.error('Parse error after insert:', e.message); process.exit(1); }

if (newCount !== prevCount + NEW_CARDS.length) { console.error(`Count mismatch: got ${newCount}`); process.exit(1); }
console.log(`Austin count after insert: ${newCount} (expected ${prevCount + NEW_CARDS.length})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Added ${NEW_CARDS.length} Austin cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');
const PREV_COUNT = 726;

const NEW_CARDS = [
  {
    id: 9232,
    name: "The Chumley House",
    address: "3230 Camp Bowie Blvd Suite 150, Fort Worth, TX 76107",
    lat: 32.7493, lng: -97.363,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "British Steakhouse",
    price: 4,
    description: "An elegant British steakhouse tucked into the base of a boutique hotel across from the Modern Art Museum of Fort Worth. The marble bar, spy-film atmosphere, and impeccably sourced beef make it one of the DFW area's most distinctive fine-dining rooms — operated by the team behind Dallas's Mister Charles.",
    dishes: ["Prawns royale", "Tallow popovers", "Filet with duck-fat charred broccoli", "Tea and scones opener", "Puff pastry–topped pies"],
    score: 89,
    neighborhood: "Fort Worth Cultural District",
    tags: ["Steakhouse", "British", "Date Night", "Fine Dining", "Fort Worth"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9233,
    name: "61 Osteria",
    address: "500 W 7th St, Fort Worth, TX 76102",
    lat: 32.751162, lng: -97.333183,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "Italian",
    price: 3,
    description: "An upscale Italian osteria from Fort Worth restaurateur Adam Jones and Chef Blaine Staniford, housed in the heart of downtown. The kitchen champions traditional Italian cooking grounded in simple, seasonal ingredients sourced from local and quality producers.",
    dishes: ["House-made pastas", "Seasonal Italian small plates", "Wood-fired secondi"],
    score: 87,
    neighborhood: "Downtown Fort Worth",
    tags: ["Italian", "Date Night", "Fine Dining", "Fort Worth"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9234,
    name: "Walloon's Restaurant",
    address: "701 W Magnolia Ave, Fort Worth, TX 76104",
    lat: 32.730593, lng: -97.331704,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "Gulf Coast Seafood & Southern",
    price: 3,
    description: "A Gulf Coast-inspired dining room in a century-old bank building on Fort Worth's beloved Magnolia Avenue. The menu blends Southern comfort with coastal wanderlust — raw bars, bouillabaisse, and French-accented technique applied to fresh Gulf seafood.",
    dishes: ["Seafood tower (oysters, poached shrimp, tuna crudo)", "Seared redfish with Gulf shrimp and bouillabaisse", "Steak frites with sauce au poivre", "Pan roasted salmon with creamed leeks"],
    score: 87,
    neighborhood: "Fairmount / Magnolia Avenue, Fort Worth",
    tags: ["Seafood", "Southern", "Gulf Coast", "Date Night", "Fort Worth"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9235,
    name: "Sanjh Restaurant & Bar",
    address: "5250 N O'Connor Blvd, Irving, TX 75039",
    lat: 32.8699028, lng: -96.9380043,
    phone: "", website: "", instagram: "",
    reservation: "OpenTable", reserveUrl: "",
    hours: "",
    cuisine: "Modern Indian",
    price: 4,
    description: "High-end Indian dining in the Las Colinas business district, where three live-fire tandoors, smoke-filled cloches, and cocktail-bar-worthy drinks elevate classic regional recipes. A Sunday brunch buffet and ornate plating draw well-dressed families and business diners who don't want to leave the suburbs for a splurge.",
    dishes: ["Dahi puri with yogurt foam and pomegranate seeds", "Dal makhani (New Delhi slow-cooked lentils)", "Bharwan paneer tikka", "Goat seekh kebab", "Masaaledaar lamb chops with Punjabi spice rub"],
    score: 88,
    neighborhood: "Las Colinas, Irving",
    tags: ["Indian", "Fine Dining", "Date Night", "Cocktails"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9236,
    name: "Cenzo's Pizza & Deli",
    address: "1700 W 10th St, Dallas, TX 75208",
    lat: 32.7450638, lng: -96.8480976,
    phone: "", website: "", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "",
    cuisine: "Pizza & Italian Deli",
    price: 2,
    description: "A converted 1930s Tudor Revival gas station turned neighborhood pizzeria and deli in Oak Cliff. Picnic tables on a covered patio, local beers, Italian wines, and pies named after nearby streets make it the platonic ideal of a community pizza spot.",
    dishes: ["Montclair pizza (Italian sausage, caramelized fennel)", "Clinton pizza (lemon ricotta, calabrian chili crisp, pistachios)", "Meatball sub with cheese and marinara", "Fried mortadella sandwich"],
    score: 85,
    neighborhood: "Oak Cliff",
    tags: ["Pizza", "Italian", "Casual", "Patio", "Oak Cliff"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9237,
    name: "Bushi Bushi",
    address: "4930 Belt Line Rd #100, Addison, TX 75254",
    lat: 32.9532051, lng: -96.8273762,
    phone: "", website: "", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "",
    cuisine: "Dim Sum",
    price: 2,
    description: "A meticulously run dim sum restaurant in Addison helmed by Patrick Ru, a master dumpling maker trained at Brooklyn's acclaimed Mr. Bun. Every dish is made to order rather than pushed on carts, resulting in noticeably fresher flavors. Robot delivery adds a playful touch.",
    dishes: ["Duroc pork soup dumplings (xiaolongbao)", "Shuimai with pork and shrimp", "Spring rolls", "General Tso chicken", "Hot & sour soup"],
    score: 88,
    neighborhood: "Addison",
    tags: ["Dim Sum", "Chinese", "Dumplings", "Casual", "Addison"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9238,
    name: "Uchiko Plano",
    address: "7801 Windrose Ave, Plano, TX 75024",
    lat: 33.088032, lng: -96.8260295,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "Japanese (Omakase & Modern)",
    price: 4,
    description: "Uchiko's North Texas outpost in Legacy West Plano brings the Austin original's elegant Japanese sensibility with added Texas smoke and fire. Diners can go full 10-course omakase or opt for the flexible somakase, where the server curates sashimi, rolls, and hot tastings within your budget.",
    dishes: ["Hama chili (yellowtail, ponzu, Thai chili, oranges)", "The Hot Rock (tableside wagyu sear)", "10-course chef's omakase", "Somakase (server-curated tasting)"],
    score: 91,
    neighborhood: "Plano (Legacy West)",
    tags: ["Japanese", "Omakase", "Sushi", "Fine Dining", "Plano"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9239,
    name: "Restaurant Beatrice",
    address: "1111 N Beckley Ave, Dallas, TX 75203",
    lat: 32.7569581, lng: -96.8232021,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "Contemporary Cajun & Creole",
    price: 3,
    description: "Texas's first environmentally certified B-corp restaurant, housed in a cozy bungalow with a lively patio in North Oak Cliff. In-house cured meats, locally sourced beef from the owner's Louisiana family ranch, and seasonal crawfish boils honor the bayou tradition while keeping an eye on sustainability.",
    dishes: ["Mammaw's fried chicken (brined, spiced, with pepper jelly)", "Camellia red bean casserole with house andouille", "Beef bourguignon", "Seasonal crawfish boils"],
    score: 87,
    neighborhood: "North Oak Cliff",
    tags: ["Cajun", "Creole", "Southern", "Patio", "Oak Cliff"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9240,
    name: "Starship Bagel",
    address: "1520 Elm St #107, Dallas, TX 75201",
    lat: 32.7811328, lng: -96.7984884,
    phone: "", website: "", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "",
    cuisine: "Bagel Shop",
    price: 2,
    description: "A downtown Dallas bagel counter that won Best Bagel at New York BagelFest — a victory that reportedly upset many New Yorkers. Open until 1 PM daily, the shop achieves a crackly exterior and chewy interior with equally impressive cream cheese spreads.",
    dishes: ["Everything bagel with fermented jalapeño cream cheese", "Millennial Falcon (avocado, tomato, pickled onion, sprouts)", "Basil cream cheese spread", "Lightly smoked lox"],
    score: 84,
    neighborhood: "Downtown Dallas",
    tags: ["Bagels", "Breakfast & Brunch", "Cafe", "Downtown Dallas"],
    indicators: ["hole-in-the-wall"], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9241,
    name: "El Come Taco",
    address: "2513 N Fitzhugh Ave, Dallas, TX 75204",
    lat: 32.8122244, lng: -96.7834202,
    phone: "", website: "", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "",
    cuisine: "Mexican Street Tacos",
    price: 1,
    description: "A family-run Mexico City-style taqueria that has quietly achieved institution status in Old East Dallas since 2013. Counter service, big projectors for soccer, and a bathroom hallway connecting to the owners' mezcal bar La Viuda Negra — everything is good, but the offal tacos are the reason regulars keep coming back.",
    dishes: ["Tripe tacos", "Lengua (tongue) tacos", "Cochinita pibil tacos", "Jose taco (beans, cheese, avocado)", "Chapulines (grasshopper) tacos"],
    score: 86,
    neighborhood: "Old East Dallas",
    tags: ["Mexican", "Tacos", "Casual", "Local Favorites", "East Dallas"],
    indicators: ["hole-in-the-wall"], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9242,
    name: "Terry Black's Barbecue",
    address: "3025 Main St, Dallas, TX 75226",
    lat: 32.7848175, lng: -96.779959,
    phone: "", website: "", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "",
    cuisine: "Texas BBQ",
    price: 2,
    description: "The Dallas outpost of the Lockhart, Texas dynasty, bringing generations of Central Texas barbecue tradition to Deep Ellum since 2019. Extended hours, a full bar, and a large patio make it one of the city's most accessible smoked meat destinations.",
    dishes: ["Sliced brisket", "Beef ribs", "Pork ribs with sticky-sweet glaze", "Jalapeño-cheddar sausage"],
    score: 89,
    neighborhood: "Deep Ellum",
    tags: ["BBQ", "Texas BBQ", "Casual", "Patio", "Deep Ellum"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9243,
    name: "Gemma Restaurant",
    address: "2323 N Henderson Ave, Dallas, TX 75206",
    lat: 32.8139113, lng: -96.7778821,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "French-Italian Bistro",
    price: 3,
    description: "The ideal Dallas bistro, unchanged in quality for over a decade. Mustard-yellow banquettes, an excellent wine program, and a menu of French and Italian-inspired dishes made fresh daily — equally at home for a solo bar dinner or a special occasion.",
    dishes: ["Oysters on the half shell with jalapeño-ginger beer granita", "Caviar mini tots with crème fraîche", "Steak frites (Texas wagyu, chimichurri)", "Tagliatelle all'arrabbiata with spicy pork sausage"],
    score: 90,
    neighborhood: "Lower Greenville",
    tags: ["French", "Italian", "Date Night", "Bistro", "Wine Bar", "Lower Greenville"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9244,
    name: "Mike's Chicken",
    address: "4234 Maple Ave, Dallas, TX 75219",
    lat: 32.8083778, lng: -96.8187236,
    phone: "", website: "", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "",
    cuisine: "Vietnamese-American Fried Chicken",
    price: 1,
    description: "A family-run fried chicken operation originally born inside a laundromat — chicken is hand-cut daily and cooked only after you order (20-minute wait). Nationally recognized for its sage, turmeric, lemon, and ghost-pepper spice blend that bears no resemblance to any other fried chicken in Dallas.",
    dishes: ["Fried chicken with sage-turmeric-ghost pepper spice blend", "Buffalo wings with secret peanut sauce", "Fluffy honey-glazed biscuits", "Churros with caramel filling"],
    score: 87,
    neighborhood: "Uptown",
    tags: ["Fried Chicken", "Casual", "Local Favorites", "Uptown"],
    indicators: ["hole-in-the-wall"], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  },
  {
    id: 9245,
    name: "Meridian Restaurant",
    address: "5650 Village Glen Dr, Dallas, TX 75206",
    lat: 32.860909, lng: -96.7596258,
    phone: "", website: "", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "Contemporary American",
    price: 4,
    description: "A twice-born neighborhood bistro inside The Village Dallas mixed-use complex, now led by Executive Chef Eduardo Osorio with fire-driven, ingredient-focused small plates. After earning CultureMap Best Restaurant and Best Chef awards under James Beard-nominated Chef Junior Borges, the revamped menu shifts from prix-fixe tasting to a more accessible format without losing ambition.",
    dishes: ["Foie & Sea Island cornbread with white cheddar sauce", "Wagyu tallow seared oysters with pancetta", "Salmon crudo in cilantro oil and green pepper sauce", "Texas wagyu flatiron chef's cut"],
    score: 88,
    neighborhood: "East Dallas",
    tags: ["New American", "Small Plates", "Date Night", "Fine Dining", "East Dallas"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-28"
  }
];

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const DALLAS_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} DALLAS_DATA declaration(s)`);

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const DALLAS_DATA\s*=\s*\[/)[0].length;

let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify
const m2 = html.match(/const DALLAS_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
let cardCount;
try { cardCount = eval('[' + html.slice(s2, p2 - 1) + ']').length; }
catch (e) { console.error('Parse error:', e.message); process.exit(1); }

const expected = PREV_COUNT + NEW_CARDS.length;
if (cardCount !== expected) { console.error(`Count mismatch: got ${cardCount}, expected ${expected}`); process.exit(1); }
console.log(`DALLAS card count after insert: ${cardCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new Dallas cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

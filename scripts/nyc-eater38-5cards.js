'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  {
    id: 2040,
    name: "Filé Gumbo Bar",
    address: "275 Church St, New York, NY 10013",
    lat: 40.7184766, lng: -74.0048209,
    phone: "(646) 851-0810", website: "filenyc.com", instagram: "filegumbobar",
    reservation: "OpenTable", reserveUrl: "",
    hours: "Sun–Sat 11:30am–close",
    cuisine: "Cajun & Creole",
    price: 3,
    description: "A Louisiana-born Cajun and Creole bar in Tribeca from chef-owner Eric McCree, named for the dried sassafras powder introduced to Cajun cooking by the Choctaw Indians. Gumbo varieties are built from bases simmered days in advance, then finished bar-side in steam kettles — choose from chicken & andouille, whole crab & shrimp, or the all-in. Live music, a deep bourbon list, and crawfish bread from Leidenheimer make it the closest thing New York has to New Orleans.",
    dishes: ["Tiny's Gumbo All-In (chicken, andouille, crab & shrimp)", "Char-grilled oysters in herb butter with Parmigiano", "Jazz Fest Crawfish Bread", "Po' Boy (fried shrimp or oysters on Leidenheimer bread)", "Andouille & Shrimp Jambalaya", "Beignets", "Brown Butter Bourbon Bread Pudding"],
    score: 87,
    neighborhood: "Tribeca",
    tags: ["Cajun", "Creole", "New Orleans", "Cocktails", "Date Night", "Tribeca", "Live Music"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 2041,
    name: "Sunn's",
    address: "139 Division St, New York, NY 10002",
    lat: 40.7143881, lng: -73.9909746,
    phone: "(917) 540-0884", website: "sunnsnyc.com", instagram: "",
    reservation: "OpenTable", reserveUrl: "",
    hours: "Tue–Sun 5–10pm, Mon closed",
    cuisine: "Korean",
    price: 3,
    description: "A tiny, fiercely seasonal Korean banchan spot and wine bar in Chinatown from chef-owner Sunny Lee. The rotating menu blends Korean cooking with Italian influences — the tteokbokki here hits like a baked ziti, and the deep-sea scallops are a recurring standout. Wines are overseen by neighboring natural wine shop Parcelle; soju and makgeolli fill out the rest. Very small, very hyped, very worth it.",
    dishes: ["Seasonal rotating banchan", "Tteokbokki (baked ziti–style with spicy tomato)", "Sunn's kimchi", "Ssam", "Brisket", "Deep-sea scallops (seasonal)"],
    score: 90,
    neighborhood: "Chinatown",
    tags: ["Korean", "Banchan", "Wine Bar", "Natural Wine", "Chinatown", "Date Night", "Small Plates"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 2042,
    name: "Ernesto's",
    address: "259 E Broadway, New York, NY 10002",
    lat: 40.7143271, lng: -73.9854388,
    phone: "(646) 692-8300", website: "ernestosnyc.com", instagram: "ernestosnyc",
    reservation: "OpenTable", reserveUrl: "",
    hours: "Mon 5:30–9:30pm, Tue–Thu 5–9:30pm, Fri–Sat 5–10pm, Sun closed",
    cuisine: "Basque",
    price: 4,
    description: "A Basque taverna on the Lower East Side that changes its menu daily, channeling the pintxos bars and asadors of San Sebastián with the confidence of a restaurant that wrote the book on it — literally, the cookbook Essentially Basque. The kitchen turns out gildas, jamón croquetas, grilled Galician octopus, and wood-fired meats alongside a Basque-heavy wine list. One of the most respected Spanish kitchens in the city.",
    dishes: ["Gildas", "Jamón and gallina croquetas", "Pulpo a la brasa (grilled Galician octopus, boiled potato, pimentón)", "Ensalada de naranja con bacalao (orange, salt cod, manzanilla olives)", "Entrecôte a la brasa (dry-aged Highland Hollow NY strip)", "Tarta de queso (Basque cheesecake)"],
    score: 92,
    neighborhood: "Lower East Side",
    tags: ["Basque", "Spanish", "Date Night", "Wine Bar", "Fine Dining", "Lower East Side"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 2043,
    name: "L'Industrie Pizzeria",
    address: "254 S 2nd St, Brooklyn, NY 11211",
    lat: 40.7115764, lng: -73.9578034,
    phone: "(718) 599-0002", website: "lindustriebk.com", instagram: "lindustriebk",
    reservation: "walk-in", reserveUrl: "",
    hours: "Mon–Sun 12–10pm",
    cuisine: "Neapolitan Pizza",
    price: 2,
    description: "The Williamsburg pizza shop that sparked NYC's obsession with the thin-crust, perfectly charred slice. Massimo Laveglia's French-born kitchen produces a focused menu of Neapolitan-style pies topped with high-quality imported ingredients — the ricotta slice and burrata pizza have cult followings. The chicken cutlet sandwich with pesto balsamic aioli is equally legendary. Now three locations, but the 254 S 2nd Street original is still the benchmark.",
    dishes: ["Fresh ricotta slice with olive oil and black pepper", "Burrata pizza", "Margherita with San Marzano tomatoes", "Chicken cutlet sandwich (fresh mozzarella, roasted peppers, pesto balsamic aioli, arugula)", "Daily special pizza slices"],
    score: 88,
    neighborhood: "Williamsburg, Brooklyn",
    tags: ["Pizza", "Italian", "Casual", "Williamsburg", "Brooklyn", "Lunch"],
    indicators: ["hole-in-the-wall"], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 2044,
    name: "Rolo's",
    address: "853 Onderdonk Ave, Ridgewood, NY 11385",
    lat: 40.7019307, lng: -73.9034953,
    phone: "(718) 417-6567", website: "rolosnyc.com", instagram: "",
    reservation: "Resy", reserveUrl: "",
    hours: "",
    cuisine: "American (Wood-Fired)",
    price: 3,
    description: "A Michelin Bib Gourmand neighborhood restaurant in Ridgewood, Queens where every protein is sourced from NY State grass-fed farms and aged or cured in-house. Chef Howard Kalachnikoff (Gramercy Tavern alum) and chef Rafiq Salim run a wood-fired grill that produces whole branzini, heritage pork chops, and the city's best double cheeseburger — NY State beef ground daily and gone by 6pm. Housemade mortadella from Heritage Foods Boston butts is a signature you'll find at lunch and dinner.",
    dishes: ["Double cheeseburger with grilled onions and dijonnaise (NY State grass-fed, ground in-house)", "Two-sheet lasagna verde bolognese", "Wood-fired polenta bread with calabrian chili butter", "Pork t-bone with charred spring onions and aji verde", "Grilled arctic char with honey glaze and long hot pepper", "Wagyu beef skirt steak", "Housemade mortadella"],
    score: 90,
    neighborhood: "Ridgewood, Queens",
    tags: ["American", "Wood-Fired", "Michelin Bib Gourmand", "Burgers", "Steak", "Date Night", "Queens", "Ridgewood"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  }
];

let html = fs.readFileSync(FILE, 'utf8');

// Find NYC_DATA declaration (avoid false positives from PREV_NYC_DATA etc.)
const declarations = [];
let rx = /const NYC_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} NYC_DATA declaration(s)`);
if (declarations.length !== 1) { console.error('Expected exactly 1 declaration'); process.exit(1); }

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const NYC_DATA\s*=\s*\[/)[0].length;

// Walk to closing bracket
let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

// Get current count before insert
let prevCount;
try { prevCount = eval('[' + html.slice(startIdx, closeIdx) + ']').length; }
catch (e) { console.error('Parse error reading existing data:', e.message); process.exit(1); }
console.log(`Current NYC card count: ${prevCount}`);

// Insert new cards
const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify
const m2 = html.match(/const NYC_DATA\s*=\s*\[/);
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

const expected = prevCount + NEW_CARDS.length;
if (newCount !== expected) { console.error(`Count mismatch: got ${newCount}, expected ${expected}`); process.exit(1); }
console.log(`NYC card count after insert: ${newCount} (expected ${expected})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new NYC cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

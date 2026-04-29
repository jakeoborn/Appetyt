'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

// 7 genuinely missing Chicago Eater 38 restaurants — verified against CHICAGO_DATA (maxId 15531)
const NEW_CARDS = [
  {
    id: 15532,
    name: "Virtue Restaurant",
    address: "1462 E 53rd St, Chicago, IL 60615",
    lat: 41.7996677, lng: -87.5893002,
    phone: "(773) 947-8831", website: "virtuerestaurant.com", instagram: "virtuerestaurantchi",
    reservation: "OpenTable", reserveUrl: "",
    hours: "Tue–Thu 4–9pm, Fri–Sat 4–10pm, Sun 4–9pm, Mon closed",
    cuisine: "Southern / Soul Food",
    price: 3,
    description: "A Southern American restaurant in Hyde Park led by chef-owner Erick Williams, celebrating the cuisine carried north via the Great Migration with heritage techniques and contemporary sensibility. The menu draws on Black Southern foodways — Geechie-milled grits, dirty rice, short ribs, cornbread — in a warm, unhurried room. Holds a Michelin Bib Gourmand and earned national attention when Top Chef Season 19 winner Damarr Brown cooked here.",
    dishes: ["Fish & Grits (blackened red drum, Geechie stone-ground grits, crab étouffée)", "Short Rib (creamed spinach, caramelized onion gravy)", "Gizzards (Carolina gold dirty rice, gravy)", "Green Tomatoes (gulf shrimp, Leroy's remoulade)", "Gumbo (chicken, andouille, Carolina gold rice)", "Cornbread & Honey Butter", "Mac & Cheese"],
    score: 91,
    neighborhood: "Hyde Park",
    tags: ["Soul Food", "Southern", "Michelin Bib Gourmand", "Date Night", "Hyde Park", "Black-Owned"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 15533,
    name: "Harold's Chicken Shack",
    address: "407 E 75th St, Chicago, IL 60619",
    lat: 41.7582820, lng: -87.6146594,
    phone: "(773) 488-9533", website: "haroldschicken24.com", instagram: "",
    reservation: "walk-in", reserveUrl: "",
    hours: "Sun–Thu 11am–1am, Fri–Sat 11am–2am",
    cuisine: "Fried Chicken",
    price: 1,
    description: "A Chicago institution founded in 1950 by Harold Pierce, with locations across the South Side serving legendary mild-sauced fried chicken. Each order of crispy, juicy chicken comes with fries, white bread, and a generous pour of the cult-status mild sauce — a tangy, savory condiment inseparable from the Harold's experience. Location #24 at 75th Street is one of the most beloved outposts, open late into the night.",
    dishes: ["Half Chicken Dinner (fries, white bread, mild sauce)", "Wing Dinner", "Quarter Dark Dinner", "Chicken Tenders Dinner", "Famous French Fried Shrimp", "Fish Fillet Dinner", "Popcorn Chicken"],
    score: 84,
    neighborhood: "Greater Grand Crossing",
    tags: ["Fried Chicken", "Chicago Classic", "South Side", "Late Night", "Carry-Out", "Casual"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 15534,
    name: "HaiSous Vietnamese Kitchen",
    address: "1800 S Carpenter St, Chicago, IL 60608",
    lat: 41.8578843, lng: -87.6534096,
    phone: "(312) 702-1303", website: "haisous.com", instagram: "haisouschicago",
    reservation: "Resy", reserveUrl: "",
    hours: "Wed–Sun 4–9pm, Sun Brunch 10am–2pm, Mon–Tue closed",
    cuisine: "Vietnamese",
    price: 3,
    description: "An award-winning Vietnamese restaurant in Pilsen helmed by chefs Thai and Danielle Dang, celebrating lesser-known regional dishes with locally sourced ingredients. The menu spans Bún Chả Hanoi to whole fried fluke and a grilled seafood tower, earning a Michelin Bib Gourmand. One of the most acclaimed Vietnamese restaurants in the Midwest.",
    dishes: ["Bún Chả Hanoi (clay pot grilled pork patty, crispy spring roll, charred pork broth)", "Fried Whole Fluke (nước mắm tỏi, herbs, bib lettuce wraps)", "Bánh Xèo (shrimp and pork belly crispy rice crepe)", "Crab Fried Rice (chili lemongrass)", "Chicken Wings (caramelized fish sauce, chili)", "Grilled Meat Platter (pork shoulder, shrimp roll, sausage skewers, bò lá lốt)", "Chè Dừa (Vietnamese whipped rice pudding, young coconut)"],
    score: 90,
    neighborhood: "Pilsen",
    tags: ["Vietnamese", "Michelin Bib Gourmand", "Date Night", "Seafood", "Pilsen"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 15535,
    name: "Chubby Boys",
    address: "2758 W Fullerton Ave, Chicago, IL 60647",
    lat: 41.9249893, lng: -87.6972462,
    phone: "", website: "", instagram: "chubbyboys_group",
    reservation: "walk-in", reserveUrl: "",
    hours: "Wed–Fri 5–11pm, Sat 3–11pm, Sun–Tue closed",
    cuisine: "Burgers",
    price: 2,
    description: "A beloved Chicago pop-up turned Logan Square residency known for maximalist smashburgers that went viral before finding a permanent home at Spilt Milk. The Chubby Smash — stacked with bacon jam, béarnaise, cherry peppers, fried onions, and house Chubby sauce — layers complex flavors without tipping into chaos. One of the city's most hyped burger destinations.",
    dishes: ["Chubby Smash (smash patties, cheese, bacon jam, béarnaise, cherry peppers, Chubby sauce, fried onions)", "Oklahoma Patty Melt (Texas toast, caramelized onions, potato chips, Chubby sauce)", "KFC Chicken Sando (fried chicken thigh, Texas toast, Chubby sauce)", "Breakfast Sandwich (bacon jam, jalapeños, soft egg, cheese)", "Breakfast Burrito (chickpeas, eggs, hashbrowns, cheese, avocado)"],
    score: 85,
    neighborhood: "Logan Square",
    tags: ["Burgers", "Smashburger", "Late Night", "Logan Square", "Casual"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 15536,
    name: "Redhot Ranch",
    address: "2449 W Armitage Ave, Chicago, IL 60647",
    lat: 41.9174239, lng: -87.6892277,
    phone: "(773) 772-6020", website: "redhotranchchicago.com", instagram: "redhotranchchicago",
    reservation: "walk-in", reserveUrl: "",
    hours: "Daily 10:30am–12am",
    cuisine: "Hot Dogs / Burgers",
    price: 1,
    description: "A Chicago counter-service staple serving classic Chicago-style hot dogs, smash-style burgers with special sauce, and what many consider the city's best French fried shrimp. The Bucktown location on Armitage is a neighborhood anchor beloved for its no-frills approach and late-night availability. Fresh-cut fries and housemade special sauce round out a menu that has earned a loyal following across decades.",
    dishes: ["RHR Double Cheeseburger & Fries (special sauce, lettuce, tomato, onion)", "Chicago-Style Hot Dog & Fries", "Polish Sausage & Fries", "Famous French Fried Shrimp", "Cheddar Fries", "Fish Sandwich & Fries", "Corn Dog"],
    score: 80,
    neighborhood: "Bucktown",
    tags: ["Hot Dogs", "Burgers", "Chicago Classic", "Late Night", "Counter Service", "Casual"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 15537,
    name: "Milli by Metric",
    address: "3110 N Kedzie Ave, Chicago, IL 60618",
    lat: 41.9379773, lng: -87.7077989,
    phone: "(773) 904-2900", website: "milliallday.com", instagram: "millibymetric",
    reservation: "walk-in", reserveUrl: "",
    hours: "Mon 7am–6pm, Tue–Wed 7am–4pm, Thu–Sat 7am–6pm, Sun 7am–6pm",
    cuisine: "Café / Pastry",
    price: 2,
    description: "An all-day café and roastery from the team behind specialty roaster Metric Coffee, opened in Avondale in 2025. Alongside exceptional pour-over and espresso, the café offers a rotating menu of creative laminated pastries, savory baked goods, and seasonal food in a spacious, work-friendly space. The ham suisse — a buttery laminated pastry stuffed like an elevated Cubano — and ganache-filled buns have become early signatures.",
    dishes: ["Ham Suisse (laminated pastry with ham and Swiss in a Cubano style)", "Laminated Bun with Fig Jam and Tea-Infused Ganache", "Garlic and Cheese Herb Twist", "Chocolate Chip Cookie", "Plain Croissant", "Specialty Espresso Cream Soda", "Pour-Over Coffee (rotating single-origin)"],
    score: 82,
    neighborhood: "Avondale",
    tags: ["Café", "Coffee", "Pastry", "All-Day", "Specialty Coffee", "Work-Friendly", "Avondale"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  },
  {
    id: 15538,
    name: "Santa Masa Tamaleria",
    address: "7544 W Addison St, Chicago, IL 60634",
    lat: 41.9451886, lng: -87.8158790,
    phone: "(312) 982-9306", website: "santamasa.com", instagram: "santamasachicago",
    reservation: "walk-in", reserveUrl: "",
    hours: "Mon 7am–7pm, Wed–Sat 7am–7pm, Sun 7am–6pm, Tue closed",
    cuisine: "Mexican / Tamales",
    price: 1,
    description: "A family-run tamaleria in Dunning helmed by chef Jhoana Ruiz, a former Mexique chef, making hand-crafted tamales from masa imported directly from Mexico. The counter format lets guests watch the kitchen at work while eating buttery, fluffy tamales in flavors ranging from chicken in guajillo roja to rajas y queso to a dessert strawberry tamal with dulce de leche. A rotating Tamal del Mes and weekend pozole keep regulars coming back.",
    dishes: ["Pollo en Salsa Roja (shredded chicken, guajillo sauce)", "Pollo en Salsa Verde (chicken, tomatillo salsa)", "Rajas y Queso (poblano, caramelized onion, melted cheese)", "Tamal de Fresa (strawberry, dulce de leche, powdered sugar)", "Santo Taco (housemade tortilla, green chorizo, adobada)", "Chilaquiles Torta (crispy tortilla chips, fried egg, cotija, crema)", "Capirotada (salted caramel French toast bread pudding)"],
    score: 87,
    neighborhood: "Dunning",
    tags: ["Mexican", "Tamales", "Breakfast", "Family-Owned", "BYOB", "Casual", "Dunning"],
    indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
  }
];

let html = fs.readFileSync(FILE, 'utf8');

const declarations = [];
let rx = /const CHICAGO_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} CHICAGO_DATA declaration(s)`);
if (declarations.length !== 1) { console.error('Expected exactly 1'); process.exit(1); }

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const CHICAGO_DATA\s*=\s*\[/)[0].length;
let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

const existing = eval('[' + html.slice(startIdx, closeIdx) + ']');
const prevCount = existing.length;
console.log(`Current Chicago count: ${prevCount}`);

// Dupe check
NEW_CARDS.forEach(card => {
  const dupeId = existing.find(r => r.id === card.id);
  const dupeName = existing.find(r => r.name.toLowerCase() === card.name.toLowerCase());
  if (dupeId) { console.error(`ID ${card.id} already exists: ${dupeId.name}`); process.exit(1); }
  if (dupeName) { console.error(`Name already exists: ${dupeName.name} (id ${dupeName.id})`); process.exit(1); }
});
console.log('No duplicates found — safe to insert');

const insertBlock = ',\n' + NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify
const m2 = html.match(/const CHICAGO_DATA\s*=\s*\[/);
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
console.log(`Chicago count after insert: ${newCount} (expected ${prevCount + NEW_CARDS.length})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Added ${NEW_CARDS.length} Chicago cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);

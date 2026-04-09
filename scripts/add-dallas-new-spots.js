// Add new Dallas-area spots: InSo, The Landing, Pan Pa'Vos, Park Bistro, Tick Tock Taco X Churro on Top
// Run: node scripts/add-dallas-new-spots.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ── Parse DALLAS_DATA ──
const tag = 'const DALLAS_DATA';
const startIdx = html.indexOf(tag);
if (startIdx === -1) { console.error('DALLAS_DATA not found'); process.exit(1); }
const arrStart = html.indexOf('[', startIdx);
let depth = 0, arrEnd = arrStart;
for (let i = arrStart; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') depth--;
  if (depth === 0) { arrEnd = i + 1; break; }
}
const dallas = JSON.parse(html.slice(arrStart, arrEnd));
console.log(`Dallas spots before: ${dallas.length}`);

// ── Dedup set ──
const existing = new Set(dallas.map(r => r.name.toLowerCase()));
let nextId = Math.max(...dallas.map(r => r.id)) + 1;

function addSpot(spot) {
  if (existing.has(spot.name.toLowerCase())) {
    console.log(`  SKIP (duplicate): ${spot.name}`);
    return;
  }
  const entry = {
    id: nextId++,
    name: spot.name,
    phone: spot.phone || '',
    cuisine: spot.cuisine,
    neighborhood: spot.neighborhood,
    score: spot.score,
    price: spot.price,
    tags: spot.tags,
    indicators: spot.indicators || [],
    hh: spot.hh || '',
    reservation: spot.reservation || 'walk-in',
    awards: spot.awards || '',
    description: spot.description,
    dishes: spot.dishes,
    address: spot.address,
    hours: spot.hours || '',
    lat: spot.lat,
    lng: spot.lng,
    bestOf: spot.bestOf || [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: spot.trending || false,
    group: spot.group || '',
    instagram: spot.instagram,
    website: spot.website,
    suburb: spot.suburb || false,
    reserveUrl: spot.reserveUrl || '',
    menuUrl: spot.menuUrl || '',
    res_tier: spot.res_tier || 2,
  };
  if (spot.comingSoon) entry.comingSoon = true;
  dallas.push(entry);
  existing.add(spot.name.toLowerCase());
  console.log(`  ADDED: ${spot.name} (id ${entry.id})`);
}

// ── New spots ──

addSpot({
  name: "InSo",
  cuisine: "Southeast Asian Fusion",
  neighborhood: "Las Colinas",
  score: 85,
  price: 3,
  tags: ["Asian Fusion", "Date Night", "Cocktails", "Late Night", "Lounge"],
  indicators: ["new"],
  reservation: "OpenTable",
  description: "Las Colinas newcomer blending Southeast Asian flavors with Texas swagger in a sleek lounge setting that pivots from upscale dinner to late-night party. Chef Michael Morabito turns out dishes like cashew sesame-crusted salmon and lamb rack biryani alongside creative cocktails. The vibe shifts after dark with live DJs spinning deep house and Sufi electronica. A bold dining-meets-nightlife concept filling a gap in the Irving scene.",
  dishes: ["Cashew Sesame-Crusted Salmon", "Lamb Rack Biryani", "Coastal BBQ Shrimp Potstickers", "Craft Cocktails"],
  address: "3165 Regent Blvd, Irving, TX 75063",
  phone: "(214) 468-4207",
  lat: 32.8773,
  lng: -96.9425,
  instagram: "inso.lascolinas",
  website: "https://insousa.com",
  reserveUrl: "https://www.opentable.com/r/inso-las-colinas-irving",
  suburb: true,
  trending: true,
  res_tier: 2,
});

addSpot({
  name: "The Landing",
  cuisine: "Gastropub / Comfort Food",
  neighborhood: "Grand Prairie",
  score: 84,
  price: 2,
  tags: ["American", "Sports Bar", "Cocktails", "Brunch", "Patio", "New Opening"],
  indicators: ["new"],
  reservation: "walk-in",
  comingSoon: true,
  description: "Chef Tiffany Derry's newest venture — a waterfront gastropub and sports bar at Grand Prairie's EpicCentral entertainment district. Expect elevated comfort food like smashburgers and crispy wings alongside crafted cocktails and a robust beer list. Big screens, live entertainment, and a scenic patio overlooking the water make this a game-day destination. From the Top Chef alum and T2D Concepts team behind Roots Southern Table.",
  dishes: ["Smashburgers", "Crispy Wings", "Craft Cocktails", "Shareable Plates"],
  address: "2951 S State Hwy 161, Grand Prairie, TX 75052",
  phone: "",
  hours: "Thu-Fri 4-11PM, Sat-Sun 12-11PM",
  lat: 32.6869,
  lng: -97.0031,
  instagram: "",
  website: "https://epiccentral.com/fill/the-landing-coming-soon/",
  suburb: true,
  trending: true,
  group: "T2D Concepts",
  res_tier: 5,
});

addSpot({
  name: "Pan Pa' Vos",
  cuisine: "Venezuelan Bakery",
  neighborhood: "Far North Dallas",
  score: 86,
  price: 1,
  tags: ["Bakery", "Coffee", "Breakfast", "Casual", "Local Favorites"],
  indicators: [],
  reservation: "walk-in",
  awards: "Dallas Observer Best Croissant 2025",
  description: "Venezuelan bakery with serious French boulangerie chops tucked into far north Dallas near the Carrollton border. Owner Jaiver Díaz brought the concept from his hometown of Cabimas, Venezuela, and the croissants here earned Dallas Observer's Best Croissant nod. The croffins and croissant sandwiches are equally impressive, and the full coffee and tea menu makes it a perfect morning stop. Warm, cozy, and authentically Latin American.",
  dishes: ["Croissants", "Croffins", "Croissant Sandwiches", "Fresh Bread", "Coffee"],
  address: "3855 Frankford Rd, Dallas, TX 75287",
  phone: "(469) 346-5223",
  hours: "Daily 7AM-9PM",
  lat: 32.9875,
  lng: -96.8336,
  instagram: "panpavos",
  website: "https://panpavosbakery.com",
  suburb: false,
  res_tier: 5,
});

addSpot({
  name: "Park Bistro",
  cuisine: "Multi-Concept Food Hall",
  neighborhood: "Richardson",
  score: 82,
  price: 2,
  tags: ["Food Hall", "Casual", "Lunch", "American"],
  indicators: [],
  reservation: "walk-in",
  description: "Richardson food hall from Hospitality Alliance tucked inside the Galatyn Commons office complex, right across from the Eisemann Center and DART rail. Six mini-concepts under one roof serve everything from salads and sandwiches to chef-driven entrées at corporate-cafe prices. It is the same team behind AT&T Discovery District and Victory Social, bringing their polished multi-concept formula to the Richardson corridor.",
  dishes: ["Turkey Club", "Chicken Caesar Wrap", "Soups & Salads", "Daily Specials"],
  address: "2375 N Glenville Dr, Richardson, TX 75082",
  phone: "(972) 907-1250",
  lat: 32.9563,
  lng: -96.7484,
  instagram: "parkbistrods",
  website: "https://www.park-bistro.com",
  suburb: true,
  group: "Hospitality Alliance",
  res_tier: 5,
});

addSpot({
  name: "Tick Tock Taco X Churro on Top",
  cuisine: "Mexican Fusion / Desserts",
  neighborhood: "Fairview",
  score: 83,
  price: 1,
  tags: ["Mexican", "Desserts", "Family", "Casual", "Halal", "Viral"],
  indicators: ["halal", "new"],
  reservation: "walk-in",
  description: "Two-story dual-concept restaurant in Fairview Town Center combining creative halal tacos with over-the-top churros and milkshakes. Tick Tock Taco serves two dozen taco varieties made with organic ingredients and 100% Zabihah halal meat, while Churro on Top delivers more than 40 wildly decorated milkshakes topped with artisan churros. Founded by husband-and-wife team Mo and Anum Khan, the whimsical pink-and-white decor is peak Instagram bait.",
  dishes: ["Halal Tacos", "Churro Milkshakes", "Quesadillas", "Guacamole"],
  address: "201 Town Pl, Fairview, TX 75069",
  phone: "",
  lat: 33.1518,
  lng: -96.6276,
  instagram: "ticktocktaco_",
  website: "https://ticktocktaco.com",
  suburb: true,
  trending: true,
  res_tier: 5,
});

// ── Write back ──
const newJson = JSON.stringify(dallas);
const before = html.slice(0, arrStart);
const after = html.slice(arrEnd);
html = before + newJson + after;

// ── Also add The Landing to _csOpenDates ──
const csTag = "'Le Petit Chef':'2026-09-01','Aba Dallas':'2026-10-01','Romy':'2026-12-01'";
const csReplacement = csTag + ",\n      'The Landing':'2026-04-09'";
html = html.replace(csTag, csReplacement);

fs.writeFileSync(file, html, 'utf8');
console.log(`\nDallas spots after: ${dallas.length}`);
console.log('Done! Coming-soon date added for The Landing.');

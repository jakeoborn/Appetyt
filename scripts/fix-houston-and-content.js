// Comprehensive fix script:
// 1. Add Backstreet Cafe, Urbe, Zaranda to Houston (H Town Restaurant Group)
// 2. Fix Xochi, Hugo's, Caracol Instagram handles
// 3. Update March awards
// 4. Fix NYC nightlife tips (hardcoded NYC content showing in all cities)
// 5. Fix nightlife pro tips (NYC-specific late night food tip)
// Run: node scripts/fix-houston-and-content.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ═══════════════════════════════════════════
// 1. ADD MISSING H TOWN RESTAURANT GROUP SPOTS
// ═══════════════════════════════════════════

const hStart = html.indexOf('const HOUSTON_DATA');
const hArrStart = html.indexOf('[', hStart);
let hDepth = 0, hArrEnd = hArrStart;
for (let i = hArrStart; i < html.length; i++) {
  if (html[i] === '[') hDepth++;
  if (html[i] === ']') hDepth--;
  if (hDepth === 0) { hArrEnd = i + 1; break; }
}
const houston = JSON.parse(html.slice(hArrStart, hArrEnd));
const existing = new Set(houston.map(r => r.name.toLowerCase()));
let nextId = Math.max(...houston.map(r => r.id)) + 1;
let added = 0;

function addHouston(spot) {
  if (existing.has(spot.name.toLowerCase())) {
    console.log(`  SKIP (dup): ${spot.name}`);
    return;
  }
  houston.push({
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
  });
  existing.add(spot.name.toLowerCase());
  added++;
  console.log(`  ADDED: ${spot.name} (id ${nextId - 1})`);
}

addHouston({
  name: "Backstreet Cafe",
  cuisine: "New American Bistro",
  neighborhood: "River Oaks",
  score: 88,
  price: 3,
  tags: ["American", "Patio", "Brunch", "Date Night", "Local Favorites"],
  reservation: "SevenRooms",
  awards: "Houston institution since 1983",
  description: "Houston's first and foremost al fresco restaurant, set in a charming 1930s home in River Oaks. Chef Hugo Ortega brings seasonal American bistro fare with a refined touch to a patio that feels like dining in a friend's lush backyard. The brunch is legendary and the happy hour is one of the best-kept secrets in the Inner Loop. A Houston institution for over 40 years.",
  dishes: ["Cornmeal-Crusted Oysters", "Grilled Gulf Fish", "Weekend Brunch", "Happy Hour Bites"],
  address: "1103 S Shepherd Dr, Houston, TX 77019",
  phone: "(713) 521-2239",
  lat: 29.7451,
  lng: -95.4102,
  instagram: "backstreethou",
  website: "https://www.backstreetcafe.net",
  group: "H Town Restaurant Group",
  res_tier: 3,
});

addHouston({
  name: "Urbe",
  cuisine: "Mexican Street Food",
  neighborhood: "Uptown / Galleria",
  score: 86,
  price: 2,
  tags: ["Mexican", "Casual", "Tacos", "Brunch", "Cocktails"],
  reservation: "SevenRooms",
  description: "Chef Hugo Ortega's vibrant tribute to Mexican street food, tucked into Uptown Park near the Galleria. The menu draws from Mexico City, Oaxaca, Jalisco, and Puebla with tacos, tortas, churros, and craft cocktails. Ortega calls street food the purest form of authentic Mexican cuisine, and Urbe delivers on that promise with a lively, colorful atmosphere.",
  dishes: ["Street Tacos", "Churros", "Tortas", "Craft Margaritas"],
  address: "1101 Uptown Park Blvd, Suite 12, Houston, TX 77056",
  phone: "(713) 726-8273",
  lat: 29.7492,
  lng: -95.4614,
  instagram: "urbehouston",
  website: "https://www.urbehouston.com",
  group: "H Town Restaurant Group",
  res_tier: 4,
});

addHouston({
  name: "Zaranda",
  cuisine: "Mexican / Las Californias",
  neighborhood: "Downtown",
  score: 90,
  price: 3,
  tags: ["Mexican", "Fine Dining", "Date Night", "New Opening", "Cocktails", "Seafood"],
  indicators: ["new"],
  reservation: "SevenRooms",
  awards: "Texas Monthly Best New Restaurants 2026",
  description: "The newest jewel in Chef Hugo Ortega's crown, Zaranda brings wood-fired Las Californias cuisine to downtown Houston steps from Discovery Green. Inspired by the traditions of Alta and Baja California, the menu showcases coastal seafood, premium meats, and produce prepared over open flame. Named for the wire basket used to cook seafood, Zaranda earned a spot on Texas Monthly's best new restaurants list within months of opening.",
  dishes: ["Wood-Fired Seafood", "Baja-Style Fish", "Premium Steaks", "Craft Cocktails"],
  address: "1550 Lamar St, Suite 101, Houston, TX 77010",
  phone: "(713) 485-0652",
  lat: 29.7530,
  lng: -95.3571,
  instagram: "zarandahou",
  website: "https://www.zarandahouston.com",
  group: "H Town Restaurant Group",
  trending: true,
  res_tier: 2,
});

// Write back Houston data
const newHoustonJson = JSON.stringify(houston);
html = html.slice(0, hArrStart) + newHoustonJson + html.slice(hArrEnd);
console.log(`Houston: ${houston.length} spots (added ${added})`);

// ═══════════════════════════════════════════
// 2. FIX INSTAGRAM HANDLES
// ═══════════════════════════════════════════

// Xochi: @xochihouston -> @xochihou
const xochiOld = '"instagram":"@xochihouston"';
const xochiNew = '"instagram":"@xochihou"';
if (html.includes(xochiOld)) {
  html = html.replace(xochiOld, xochiNew);
  console.log('✓ Fixed Xochi Instagram -> @xochihou');
} else {
  console.log('✗ Xochi Instagram not found (may already be fixed)');
}

// Hugo's: @hugosrestaurant -> @hugos_houston
const hugosOld = '"instagram":"@hugosrestaurant"';
const hugosNew = '"instagram":"@hugos_houston"';
if (html.includes(hugosOld)) {
  html = html.replace(hugosOld, hugosNew);
  console.log('✓ Fixed Hugo\'s Instagram -> @hugos_houston');
} else {
  console.log('✗ Hugo\'s Instagram not found');
}

// Caracol: @caracolhouston -> @caracolhou
const caracolOld = '"instagram":"@caracolhouston"';
const caracolNew = '"instagram":"@caracolhou"';
if (html.includes(caracolOld)) {
  html = html.replace(caracolOld, caracolNew);
  console.log('✓ Fixed Caracol Instagram -> @caracolhou');
} else {
  console.log('✗ Caracol Instagram not found');
}

// ═══════════════════════════════════════════
// 3. UPDATE MARCH AWARDS
// ═══════════════════════════════════════════

const marchOld = '"awards":"Michelin 1 Star"';
const marchNew = '"awards":"Michelin 1 Star (2024, 2025), JBF Best Chef: Texas Nominee (2024, 2025), Houston Chronicle #1 (2024), Food & Wine Best New Chef 2023, Esquire Best New Restaurant 2022, CultureMap Restaurant of the Year 2024"';
if (html.includes(marchOld)) {
  html = html.replace(marchOld, marchNew);
  console.log('✓ Updated March awards');
} else {
  console.log('✗ March awards not found');
}

// ═══════════════════════════════════════════
// 4. FIX NYC NIGHTLIFE HOOD TIPS
// ═══════════════════════════════════════════

const oldHoodTips = `const hoodTips = {
      'Meatpacking District':'The scene peaks Thu-Sat after 11 PM. Le Bain at The Standard is the anchor. Dress up -- door policies are real. Catch rooftop for dinner then Le Bain or Marquee for dancing.',
      'Lower East Side':'The best dive-to-cocktail ratio in the city. Start at Welcome to the Johnsons (dive), graduate to Attaboy (cocktail), end at Beauty & Essex (speakeasy). Rivington and Ludlow are the main drags.',
      'Williamsburg':'Rooftops in summer (Westlight, Bar Blondeau), warehouses for parties (Elsewhere, Brooklyn Mirage). Bedford Ave for the crawl. The vibe is dressed down -- leave the heels at home.',
      'West Village':'Jazz capital of America. Village Vanguard and Blue Note are legendary. Cocktails at Katana Kitten or Employees Only. The streets are beautiful at night. Most intimate nightlife neighborhood.',
      'East Village':'The most packed square mile of bars in NYC. St. Marks Place is the tourist strip -- go one block north or south for the real spots. Sake bars, dive bars, and late-night ramen. Death & Co started a revolution here.',
      'Bushwick':'Warehouse parties and DIY venues. House of Yes requires costumes for many events. Elsewhere has the best sound system in Brooklyn. The scene starts late -- nothing happens before midnight.'
    };`;

const newHoodTips = `const hoodTips = {
      // NYC
      'Meatpacking District':'The scene peaks Thu-Sat after 11 PM. Le Bain at The Standard is the anchor. Dress up -- door policies are real. Catch rooftop for dinner then Le Bain or Marquee for dancing.',
      'Lower East Side':'The best dive-to-cocktail ratio in the city. Start at Welcome to the Johnsons (dive), graduate to Attaboy (cocktail), end at Beauty & Essex (speakeasy). Rivington and Ludlow are the main drags.',
      'Williamsburg':'Rooftops in summer (Westlight, Bar Blondeau), warehouses for parties (Elsewhere, Brooklyn Mirage). Bedford Ave for the crawl. The vibe is dressed down -- leave the heels at home.',
      'West Village':'Jazz capital of America. Village Vanguard and Blue Note are legendary. Cocktails at Katana Kitten or Employees Only. The streets are beautiful at night.',
      'East Village':'The most packed square mile of bars in NYC. St. Marks Place is the tourist strip -- go one block north or south for the real spots. Sake bars, dive bars, and late-night ramen.',
      'Bushwick':'Warehouse parties and DIY venues. House of Yes requires costumes for many events. Elsewhere has the best sound system in Brooklyn. The scene starts late.',
      // Dallas
      'Deep Ellum':'The epicenter of Dallas nightlife. Live music venues, craft cocktail bars, and late-night tacos line Elm and Main. Start at Midnight Rambler, bar hop down the strip, end with street tacos.',
      'Uptown':'The dressed-up scene. Katy Trail Ice House for a casual start, then Standard Pour or Happiest Hour rooftop. McKinney Ave trolley connects the bars. Most popular with the 25-35 crowd.',
      'Bishop Arts':'Eclectic and artsy. Start at Paradiso for mezcal, Boulevardier for cocktails, then Magnolias for late-night Tex-Mex. Walkable and low-key. The best neighborhood for a chill night.',
      'Lower Greenville':'The Truck Yard is the anchor -- live music, treehouse bar, cheese steaks. HG Sply Co rooftop for sunset. A mix of dive bars and elevated cocktail spots.',
      'Knox-Henderson':'Upscale casual. The Whippersnapper and Sidecar Social anchor the strip. Great restaurant-to-bar pipeline. Less rowdy than Deep Ellum, more scene than Bishop Arts.',
      'Design District':'Late-night lounge vibes. Henry\\'s Majestic, Midnight Rodeo energy. The warehouses-turned-bars crowd is creative and well-dressed.',
      // Houston
      'Montrose':'Houston\\'s most walkable nightlife strip. Start at Anvil Bar & Refuge for cocktails, hit Poison Girl for a dive, end at Present Company. Westheimer Rd is the main drag.',
      'Washington Corridor':'High-energy bars and lounges. Wooster\\'s Garden, Johnny\\'s Gold Brick, and Better Luck Tomorrow. The vibe is young and social. Uber home -- parking is a nightmare.',
      'Midtown':'Houston\\'s most concentrated bar district. Little Woodrow\\'s, Dogwood, and Pub Fiction draw big weekend crowds. Less craft, more party.',
      'Heights':'The chill alternative. Eight Row Flint for patio mezcal, Bravery Chef Hall for late bites. Tree-lined streets and a more relaxed pace than Midtown.',
      'EaDo':'East Downtown is Houston\\'s rising nightlife corridor. 8th Wonder Brewery anchors the scene. Growing fast with new bars and live music venues near the stadiums.',
      // Chicago
      'Wicker Park':'The creative heart of Chicago nightlife. Violet Hour for cocktails, Subterranean for live music, Big Star for late-night tacos on the patio. Division and Milwaukee are the main drags.',
      'River North':'Bottle-service clubs, steakhouses, and rooftop bars. RPM and Adalina Prime for dinner, then PRYSM or Underground for dancing. The most dressed-up neighborhood.',
      'Logan Square':'Craft cocktail paradise. Lost Lake for tiki, The Whistler for jazz and cocktails, Scofflaw for gin. The bartender scene is the best in Chicago.',
      'West Loop':'Restaurant-forward nightlife. Start at Girl & the Goat, cocktails at The Aviary, end at Lazy Bird. Randolph and Fulton Market are packed Thu-Sat.',
      'Lincoln Park':'Classic Chicago bar crawl territory. DeLux, Wrightwood Tap, and The J. Parker rooftop at Hotel Lincoln. Great for groups and a more relaxed vibe.',
      'Pilsen':'Art-driven nightlife with mezcalerías, murals, and live music. Punch House, Dusek\\'s, and Thalia Hall anchor the scene. The most culturally rich nightlife in Chicago.'
    };`;

if (html.includes(oldHoodTips)) {
  html = html.replace(oldHoodTips, newHoodTips);
  console.log('✓ Fixed nightlife hood tips (added Dallas, Houston, Chicago neighborhoods)');
} else {
  console.log('✗ Could not find nightlife hood tips to replace');
}

// ═══════════════════════════════════════════
// 5. FIX NYC-SPECIFIC PRO TIPS
// ═══════════════════════════════════════════

const oldProTip = "html+='\\u2022 Late night food: Chinatown, LES delis, slice shops until 4 AM';";
const newProTip = "html+='\\u2022 Late night food: check the app for late-night spots open past midnight in your city';";
if (html.includes(oldProTip)) {
  html = html.replace(oldProTip, newProTip);
  console.log('✓ Fixed NYC-specific late night food pro tip');
} else {
  console.log('✗ Could not find NYC pro tip to replace');
}

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ All fixes applied!');

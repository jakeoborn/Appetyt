// Dallas batch 2026-04-24b:
//   - Backfill 4 fields on existing cards (9070, 9073, 9074, 9053)
//   - Add 4 new cards (9226 Trades Deli, 9227 SER Steak, 9228 Drizl Coffee, 9229 Beyond the Bun)
//
// Matches the VAR\s*=\s*\[ declaration pattern (avoids DALLAS_DATA collision in CITY_GROUPS).
// All fields sourced from: CultureMap Dallas, Dallas Observer, Yelp, OpenTable, official sites,
// Oak Cliff Advocate, Nominatim (coords).

const fs=require('fs');
const path='C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
let html=fs.readFileSync(path,'utf8');

// ─────────────────────────────── backfills ───────────────────────────────
// Each backfill: find the card by id (scoped to Dallas), then replace a specific empty field.

function backfill(id, fieldName, newValue){
  // Scope: find the card containing `id:<ID>,name:` inside DALLAS_DATA.
  // We locate by scanning for `id:<ID>,` and confirming it's a Dallas card (nearest DALLAS_DATA).
  const idx=html.indexOf(`id:${id},`);
  if(idx<0){ console.log(`[skip] id ${id} not found`); return false; }
  // Find the card's opening `{`
  let i=idx; while(i>0 && html[i]!=='{'){ i--; }
  let depth=0,j=i;
  for(;j<html.length;j++){ const c=html[j]; if(c==='{')depth++; else if(c==='}'){ depth--; if(depth===0){ j++; break; } } }
  const card=html.slice(i,j);
  // Replace the field
  const re=new RegExp(`(${fieldName}\\s*:\\s*)(?:""|''|\\[\\])`);
  if(!re.test(card)){ console.log(`[skip] id ${id} field ${fieldName} not empty or not found`); return false; }
  const newCard=card.replace(re, `$1${JSON.stringify(newValue)}`);
  html=html.slice(0,i)+newCard+html.slice(j);
  console.log(`[ok] backfilled id ${id} ${fieldName} = ${newValue}`);
  return true;
}

// 9070 Common Good: phone
backfill(9070, 'phone', '(469) 924-6166');
// 9073 At Fault: phone
backfill(9073, 'phone', '(469) 364-6689');
// 9074 Chi Chi: phone
backfill(9074, 'phone', '(972) 245-1004');
// 9053 InSo: hours
backfill(9053, 'hours', 'Daily 11am-2am (fine dining until 9pm)');

// ─────────────────────────────── new cards ───────────────────────────────
const newCards = [
  {
    id: 9226,
    name: "Trades Delicatessen",
    cuisine: "Delicatessen / Bagels",
    neighborhood: "Bishop Arts",
    score: 88,
    price: 2,
    tags: ["Delicatessen","Bagels","Sandwiches","Breakfast","Coffee Roaster"],
    indicators: [],
    hh: "",
    reservation: "walk-in",
    awards: "",
    description: "From-scratch delicatessen and bakery in Bishop Arts — Trades bakes its own breads and bagels, smokes its own meats and fish, and roasts its own coffee beans on-site. Opened February 2024 by a pair of Dallas natives, the shop quickly became a neighborhood favorite for house-baked bagels, mortadella-stacked Italians, bagels and lox, and a short menu of hot sandwiches.",
    dishes: ["Italian Sandwich","Turkey Melt","Everything Bagel with Lox","Pastrami Bagel","House-Roasted Coffee"],
    address: "312 W 7th St, Dallas, TX 75208",
    hours: "Daily 7am-7pm",
    lat: 32.7486716,
    lng: -96.8273604,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "@tradesdeli",
    website: "https://www.tradesdeli.com",
    suburb: false,
    phone: "(972) 589-3525",
    res_tier: 0,
    verified: "2026-04-24",
    photos: [],
    photoUrl: ""
  },
  {
    id: 9227,
    name: "SĒR Steak + Spirits",
    cuisine: "Steakhouse / Fine Dining",
    neighborhood: "Design District",
    score: 91,
    price: 4,
    tags: ["Steakhouse","Wagyu","Skyline Views","Wine List","Fine Dining","Special Occasion","Date Night"],
    indicators: [],
    hh: "",
    reservation: "OpenTable",
    awards: "",
    description: "Award-winning 27th-floor steakhouse inside the Hilton Anatole in the Design District. Chef Aubrey Murphy's menu leans on wood-fired Heartbrand Akaushi, Allen Brothers Prime, and A5 Miyazaki wagyu, paired with a 350-bottle cellar, handcrafted cocktails, and an exclusive SĒR whiskey from Garrison Brothers. Skyline views are the room's second headliner.",
    dishes: ["20oz Heartbrand Akaushi Ribeye","A5 Miyazaki Wagyu","28oz Prime Porterhouse","Chipotle Short Rib","Free-Range Half Chicken"],
    address: "2201 N Stemmons Fwy Fl 27, Dallas, TX 75207",
    hours: "Mon-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Closed Sun",
    lat: 32.7998954,
    lng: -96.8290505,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "@sersteakspirits",
    website: "https://www.sersteak.com",
    suburb: false,
    phone: "(214) 761-7479",
    res_tier: 4,
    verified: "2026-04-24",
    photos: [],
    photoUrl: "",
    reserveUrl: "https://www.opentable.com/r/ser-steak-and-spirits-dallas"
  },
  {
    id: 9228,
    name: "Drizl Coffee",
    cuisine: "Coffee / Specialty Drinks",
    neighborhood: "Rowlett",
    score: 87,
    price: 1,
    tags: ["Coffee","Specialty Drinks","Matcha","Breakfast","Suburb"],
    indicators: [],
    hh: "",
    reservation: "walk-in",
    awards: "",
    description: "Craft coffee shop in Rowlett known for a creative matcha program — ceremonial-grade green tea, flavored lattes, and weekend-limited pairings like strawberry matcha tiramisu and banana-pudding matcha. Alongside the espresso bar, Drizl offers pour overs, cold brew, bagels, pastries, and a small menu of breakfast toasts and sandwiches.",
    dishes: ["Lavender Matcha Latte","Tres Leches Frappe","Strawberry Matcha Tiramisu Latte","Coconut Matcha Cold Foam","Ceremonial Matcha"],
    address: "8600 Lakeview Pkwy Ste F, Rowlett, TX 75088",
    hours: "Mon-Tue 7am-7pm, Wed 9am-6pm, Thu-Sun 7am-7pm",
    lat: 32.9163466,
    lng: -96.5181978,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "@drizlcoffee",
    website: "https://drizlcoffee.com",
    suburb: true,
    phone: "(469) 981-9812",
    res_tier: 0,
    verified: "2026-04-24",
    photos: [],
    photoUrl: ""
  },
  {
    id: 9229,
    name: "Beyond the Bun",
    cuisine: "Plant-Based Sandwiches",
    neighborhood: "Lewisville",
    score: 85,
    price: 2,
    tags: ["Vegan","Plant-Based","Sandwiches","Ghost Kitchen","Suburb"],
    indicators: [],
    hh: "",
    reservation: "walk-in",
    awards: "",
    description: "All-vegan sandwich shop from Danielle and Mason Strokes, tucked inside the Lakeland Plaza antique mall in Lewisville. Opened January 2025 as a ghost-kitchen concept: order at the self-serve kiosk, get a text when your sandwich is ready, grab it from one of eight pickup cubbies. Plant-based meats and cheeses are sourced from The Herbivorous Butcher in Minneapolis.",
    dishes: ["Italian Cuban","Buffalo Chicken","Dill Turkey","Plant-Based BLTA","Plant-Based Roast Beef"],
    address: "1165 S Stemmons Fwy Unit 128, Lewisville, TX 75067",
    hours: "Mon-Fri 11am-4pm, Closed Sat-Sun",
    lat: 33.0306192,
    lng: -96.9954446,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "@beyondthebunveg",
    website: "",
    suburb: true,
    phone: "",
    res_tier: 0,
    verified: "2026-04-24",
    photos: [],
    photoUrl: ""
  }
];

// Insert new cards inside DALLAS_DATA = [ ... ], at the end before the closing ]
// Need to hit BOTH copies of the declaration. Use regex: DALLAS_DATA\s*=\s*\[
const re=/DALLAS_DATA\s*=\s*\[/g;
const declMatches=[];
let mm; while((mm=re.exec(html))!==null){ declMatches.push(mm.index); }
console.log('DALLAS_DATA declarations:', declMatches.length);
if(declMatches.length!==2){ console.log('UNEXPECTED — aborting'); process.exit(1); }

// Walk each declaration to its closing ] and insert before it.
// We insert from the END so indexes stay valid for earlier copies.
const cardsStr = newCards.map(c=>JSON.stringify(c)).join(',\n');
for(let k=declMatches.length-1; k>=0; k--){
  const declIdx=declMatches[k];
  const openBracket=html.indexOf('[',declIdx);
  let depth=0,i=openBracket;
  for(;i<html.length;i++){const c=html[i];if(c==='[')depth++;else if(c===']'){depth--;if(depth===0)break;}}
  // i is the closing ]; insert before it (need preceding `,` since array is non-empty)
  const insert = ',\n' + cardsStr + '\n';
  html = html.slice(0,i) + insert + html.slice(i);
  console.log(`inserted into declaration #${k+1} before position ${i}`);
}

fs.writeFileSync(path, html);
console.log('\nWrote index.html.');
console.log(`Added ${newCards.length} cards. Backfills applied above.`);

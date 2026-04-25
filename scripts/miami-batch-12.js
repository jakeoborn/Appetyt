const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const TODAY = '2026-04-25';

// All 11 cards sourced from Time Out Miami published lists (real-data) + Nominatim addresses.
// Sources: TO "Best Brunch", TO "Best New Restaurants" (Apr 2026), TO "Best Italian"
const NEW_CARDS = [
  {
    id:4241, name:"Karyu", phone:"",
    cuisine:"Japanese Wagyu Omakase", neighborhood:"Design District", score:91, price:4,
    tags:["Japanese","Sushi","Fine Dining","Date Night","Tasting Menu","Critics Pick","Exclusive","New"],
    indicators:[], hh:"",
    reservation:"direct", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best New Restaurants 2026",
    description:"Ten-seat Design District omakase counter — wagyu courses sourced from a single family-run Japanese ranch, seasonal menus, and curated sake pairings. Newer than Naoe and Ogawa, betting on wagyu specialization rather than fish.",
    dishes:["Wagyu Course","Otsukuri","Nigiri Selection","Chawanmushi","Tea Ceremony","Sake Pairing"],
    address:"40 NE 41st St, Miami FL 33137", lat:25.8141, lng:-80.1946,
    website:"", instagram:"@karyumia",
    hours:"Dinner Tue-Sat",
    photoUrl:"", photos:[], bestOf:["#3 Best Japanese (Design District)"]
  },
  {
    id:4242, name:"BeyBey", phone:"",
    cuisine:"Lebanese-Mexican Fusion", neighborhood:"South Beach", score:88, price:3,
    tags:["Fusion","Lebanese","Mexican","Date Night","Critics Pick","Scene","Cocktails","New"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best New Restaurants 2026",
    description:"Chef Roberto Solis's 18th Street venue blending Lebanese and Mexican kitchens — za'atar short rib with house-pressed tortillas, kibbe steak tartare, and a serious mezcal-and-arak cocktail program. Electric, polished, and uniquely Miami-2026.",
    dishes:["Za'atar Short Rib Tortillas","Kibbe Steak Tartare","Lamb Tahdig","Hummus & Pita","Mezcal Old Fashioned","Halloumi"],
    address:"1330 18th St, Miami Beach FL 33139", lat:25.7934, lng:-80.1433,
    website:"", instagram:"@beybeymia",
    hours:"Dinner Tue-Sun",
    photoUrl:"", photos:[], bestOf:["#1 Best Fusion","#2 Best New Restaurant"]
  },
  {
    id:4243, name:"Fuku Coral Gables", phone:"",
    cuisine:"Korean Fried Chicken", neighborhood:"Coral Gables", score:84, price:2,
    tags:["Korean","Fast Casual","Casual","Family Friendly","Local Favorites","Late Night","New"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best New Restaurants 2026",
    description:"David Chang's kitschy fast-casual fried-chicken spot on Miracle Mile — simple sandwiches, deconstructed bowls, and the Miso Ranch & Slaw at $12 that quickly became Coral Gables' lunch consensus.",
    dishes:["Original Spicy Sandwich","Miso Ranch & Slaw","Tenders","Loaded Fries","Korean Slaw Bowl"],
    address:"135 Miracle Mile, Coral Gables FL 33134", lat:25.7499, lng:-80.2575,
    website:"https://eatfuku.com", instagram:"@eatfuku",
    hours:"Lunch & Dinner daily",
    photoUrl:"", photos:[], bestOf:["#1 Best Korean Fried Chicken","#2 Best Fast Casual (Coral Gables)"]
  },
  {
    id:4244, name:"Il Mulino New York at Acqualina", phone:"",
    cuisine:"Italian Fine Dining", neighborhood:"Sunny Isles Beach", score:90, price:4,
    tags:["Italian","Fine Dining","Date Night","Hotel Restaurant","Critics Pick","Wine","Awards"],
    indicators:[], hh:"",
    reservation:"OpenTable", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best New Restaurants 2026; Forbes Travel Guide (Acqualina Resort)",
    description:"NYC's Greenwich Village institution at the recently-renovated Acqualina Resort — branzino carved tableside, classic Northern Italian execution, and an oceanfront veranda that justifies the drive north for date nights.",
    dishes:["Branzino al Sale (tableside)","Veal Saltimbocca","Lobster Ravioli","Antipasti Tableside","Tiramisu Il Mulino"],
    address:"17875 Collins Ave, Sunny Isles Beach FL 33160", lat:25.9408, lng:-80.1205,
    website:"https://ilmulino.com/locations/miami", instagram:"@ilmulinomia",
    hours:"Dinner daily",
    photoUrl:"", photos:[], bestOf:["#1 Best Italian (Sunny Isles)"]
  },
  {
    id:4245, name:"Eight Bar", phone:"",
    cuisine:"Contemporary American", neighborhood:"Park West", score:85, price:3,
    tags:["American","Sushi","Cocktails","Sports Bar","Casual","Local Favorites","Pre-Game","New"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best New Restaurants 2026",
    description:"Polished but laid-back Park West restaurant near the Kaseya Center — sushi, bubbling shrimp, and creative cocktails sized for pre-Heat-game dinners. The Park West replacement for the late, lamented downtown sports-pre-game category.",
    dishes:["Bubbling Shrimp","Sushi Platter","Wagyu Sliders","Cocktail Flight","Truffle Fries"],
    address:"699 NE 1st Ave, Miami FL 33132", lat:25.7808, lng:-80.1921,
    website:"", instagram:"@eightbar.mia",
    hours:"Dinner daily; Late Night Fri-Sat",
    photoUrl:"", photos:[], bestOf:["#1 Best Pre-Game (Park West)"]
  },
  {
    id:4246, name:"Bellini Coconut Grove", phone:"",
    cuisine:"Italian / Rooftop", neighborhood:"Coconut Grove", score:86, price:4,
    tags:["Italian","Rooftop","Brunch","Date Night","Views","Hotel Restaurant","Cocktails"],
    indicators:[], hh:"",
    reservation:"OpenTable", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best Brunch",
    description:"Upscale Italian rooftop in Coconut Grove — pasture-raised egg dishes, lobster-and-caviar Benedict, and a Sunday brunch that uses the canopy view as a feature, not a backdrop.",
    dishes:["Lobster & Caviar Benedict","Pasture-Raised Egg Plate","Cacio e Pepe","Burrata Stack","Bellini","Tiramisu"],
    address:"2843 S Bayshore Dr, Coconut Grove FL 33133", lat:25.7308, lng:-80.2381,
    website:"", instagram:"@bellinimiami",
    hours:"Brunch & Dinner daily",
    photoUrl:"", photos:[], bestOf:["#1 Best Brunch Rooftop","#3 Best Italian (Coconut Grove)"]
  },
  {
    id:4247, name:"Tina in the Gables", phone:"",
    cuisine:"All-Day Café / Healthy", neighborhood:"Coral Gables", score:84, price:2,
    tags:["Brunch","Healthy","Casual","Bakery/Coffee","Family Friendly","Local Favorites","Breakfast"],
    indicators:["vegetarian"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best Brunch",
    description:"Coral Gables minimalist café emphasizing local, organic, non-GMO ingredients — rustic-modern breakfast classics, fresh-pressed juices, and a low-key dining room that turns into the neighborhood's morning living room.",
    dishes:["Avocado Toast","Egg Benedict","Acai Bowl","Granola Plate","Cold Brew","Matcha Latte"],
    address:"143 Sevilla Ave, Coral Gables FL 33134", lat:25.7465, lng:-80.2573,
    website:"", instagram:"@tinainthegables",
    hours:"Breakfast & Lunch daily",
    photoUrl:"", photos:[], bestOf:["#2 Best Healthy Brunch"]
  },
  {
    id:4248, name:"Lido Bayside Grill", phone:"",
    cuisine:"Mediterranean / Waterfront", neighborhood:"Belle Isle", score:85, price:3,
    tags:["Mediterranean","Brunch","Waterfront","Outdoor","Date Night","Hotel Restaurant","Patio"],
    indicators:["outdoor-only"], hh:"",
    reservation:"OpenTable", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best Brunch",
    description:"The Standard Spa's dock-and-dine restaurant on Belle Isle — Mediterranean small plates, a casual-chic setting, and Biscayne Bay views from a wraparound deck that turns into the city's most photogenic Sunday brunch.",
    dishes:["Mezze Platter","Whole Branzino","Octopus a la Plancha","Hummus & Pita","Greek Salad","Aperol Spritz"],
    address:"40 Island Ave, Miami Beach FL 33139", lat:25.7909, lng:-80.1488,
    website:"https://www.standardhotels.com/miami/properties/spa", instagram:"@thestandardmiami",
    hours:"Brunch & Dinner daily",
    photoUrl:"", photos:[], bestOf:["#2 Best Waterfront","#2 Best Brunch (Belle Isle)"]
  },
  {
    id:4249, name:"Contessa Miami", phone:"",
    cuisine:"Italian / Northern", neighborhood:"Design District", score:90, price:4,
    tags:["Italian","Fine Dining","Scene","Date Night","Brunch","Hotel Restaurant","Critics Pick"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best Brunch; Major Food Group concept",
    description:"Major Food Group's theatrical Northern Italian in the Design District — jewel-toned dining room, high-end Italian imports, and an elevated brunch program that makes the case for daytime indulgence at Carbone-tier prices.",
    dishes:["Tagliolini al Tartufo","Branzino in Crosta","Veal Cotoletta","Bruschetta Tower","Bottomless Negroni","Tiramisu Contessa"],
    address:"111 NE 41st St, Miami FL 33137", lat:25.8142, lng:-80.1931,
    website:"https://www.contessamiami.com", instagram:"@contessamia",
    hours:"Lunch & Dinner daily; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#1 Best Brunch (Design District)","#2 Best Italian (Design District)"]
  },
  {
    id:4250, name:"PASTA Wynwood", phone:"",
    cuisine:"Italian Pasta", neighborhood:"Wynwood", score:88, price:3,
    tags:["Italian","Pasta","Date Night","Critics Pick","Local Favorites","Casual"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best Italian",
    description:"Husband-and-wife chef team's industrial-warehouse pasta room in Wynwood — everything done in-house, from extruded shapes to cured meats. Tighter focus and lower volume than Otto & Pepe; a regulars-only feel within months of opening.",
    dishes:["Cavatelli Ragù","Tagliolini al Limone","Hand-Cut Pappardelle","Squid Ink Spaghetti","Stracciatella","Tiramisu"],
    address:"172 NW 24th St, Miami FL 33127", lat:25.7998, lng:-80.1984,
    website:"", instagram:"@pasta.miami",
    hours:"Dinner Tue-Sat",
    photoUrl:"", photos:[], bestOf:["#3 Best Italian (Wynwood)","#3 Best Pasta"]
  },
  {
    id:4251, name:"Casa Isola Sunset Harbour", phone:"",
    cuisine:"Italian / Italian-American", neighborhood:"South Beach", score:88, price:3,
    tags:["Italian","Date Night","Critics Pick","Local Favorites","Pasta","Brunch"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Miami Best Italian",
    description:"Sunset Harbour collaborative concept blending semi-authentic Italian with Italian-American classics — a corner room with house-pulled mozzarella, hand-rolled cavatelli, and a chicken-parm sandwich that became the unofficial mascot of the brand.",
    dishes:["Hand-Pulled Mozzarella","Cavatelli","Chicken Parm Sandwich","Bucatini all'Amatriciana","Tiramisu"],
    address:"1418 20th St, Miami Beach FL 33139", lat:25.7957, lng:-80.1408,
    website:"https://casaisolamiami.com", instagram:"@casaisolami",
    hours:"Dinner daily; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#1 Best Italian (Sunset Harbour)"]
  }
];

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));
const existingIds = new Set(arr.map(c => c.id));
const existingNames = new Set(arr.map(c => c.name.toLowerCase()));
for (const c of NEW_CARDS) {
  if (existingIds.has(c.id)) { console.error('ID collision', c.id); process.exit(1); }
  if (existingNames.has(c.name.toLowerCase())) { console.error('Name dup', c.name); process.exit(1); }
}

const SAMPLE_KEYS = Object.keys(arr[0]);
const ALL_KEYS = [...SAMPLE_KEYS];
['photoUrl','menuUrl','awards','indicators','hh','reservation','reserveUrl','res_tier','verified','bestOf','photos'].forEach(k => { if (!ALL_KEYS.includes(k)) ALL_KEYS.push(k); });
const DEFAULTS = {phone:'',bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:'',suburb:false,reserveUrl:'',menuUrl:'',indicators:[],hh:'',awards:'',photoUrl:'',photos:[],res_tier:0,verified:''};

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of ALL_KEYS) out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  for (const k of Object.keys(card)) if (!(k in out)) out[k] = card[k];
  return out;
});

lines[idx] = `const MIAMI_DATA=${JSON.stringify([...arr, ...merged])};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('Wrote', merged.length, 'cards. New total:', arr.length + merged.length);

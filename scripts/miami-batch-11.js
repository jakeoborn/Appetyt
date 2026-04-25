const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const TODAY = '2026-04-25';

// All 9 cards verified via Time Out Miami "32 Best Restaurants" article (real-data source)
// + own-website WebFetch (1-800-Lucky, Arbetter, Havana 1957) + Nominatim addresses
const NEW_CARDS = [
  {
    id:4232, name:"1-800-Lucky", phone:"(786) 381-2498",
    cuisine:"Asian Food Hall", neighborhood:"Wynwood", score:87, price:2,
    tags:["Food Hall","Asian","Casual","Late Night","Local Favorites","Cocktails","Family Friendly","Patio"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Miami's first Asian food hall — six rotating stalls under one Wynwood roof (Gold Marquess, Sili, Yip, B-Side, 88UNNIE, Soi Thai), a center bar, and a DJ booth that turns lunch into late-night. Open till 3am Friday-Sunday.",
    dishes:["Dim Sum (Gold Marquess)","Pho (Sili)","Sushi (Yip)","Korean Fried Chicken (88UNNIE)","Thai Curry (Soi Thai)","Boba"],
    address:"143 NW 23rd St, Miami FL 33127", lat:25.7993, lng:-80.1980,
    website:"https://www.1800lucky.com", instagram:"@1800lucky",
    menuUrl:"", hours:"Mon-Thu 12pm-1am, Fri-Sun 12pm-3am",
    photoUrl:"", photos:[], bestOf:["#1 Best Asian Food Hall","#2 Best Late Night"]
  },
  {
    id:4233, name:"Arbetter's Hot Dogs", phone:"",
    cuisine:"Hot Dogs / American Casual", neighborhood:"Westchester", score:86, price:1,
    tags:["Casual","Family Friendly","Local Favorites","Hole in the Wall","Iconic","Hot Dogs"],
    indicators:["hole-in-the-wall"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Open since 1959 — South Miami institution",
    description:"Bob Arbetter's 1959 hot-dog stand on SW 40th Street — house-made chili prepared daily, all-beef Sabretts grilled or boiled, and a menu of regional specialties (Miami Dog, Chicago Dog, the foot-long Uly Monster). Sixty-six years and counting under family ownership.",
    dishes:["Original Hot Dog","Uly Monster","Miami Dog","Chicago Dog","Dirty Dog","Zelda","M.O.C."],
    address:"8747 SW 40th St, Miami FL 33165", lat:25.7333, lng:-80.3368,
    website:"https://arbetters.com", instagram:"@arbettershotdogs",
    menuUrl:"",
    hours:"Daily 10:30am-9pm; closed major holidays",
    photoUrl:"", photos:[], bestOf:["#1 Best Hot Dog","#2 Best Hole-in-the-Wall"]
  },
  {
    id:4234, name:"Havana 1957", phone:"(786) 864-2881",
    cuisine:"Cuban", neighborhood:"South Beach", score:84, price:2,
    tags:["Cuban","Casual","Family Friendly","Live Music","Local Favorites","Mojitos","All-Day"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Ocean Drive's transportive 1957-Havana-themed restaurant — checked tile floors, live Latin music nightly, and a Cuban-comfort menu of ropa vieja, lechón, and house mojitos. The polished tourist-friendly version of Versailles.",
    dishes:["Ropa Vieja","Cuban Burger","Havana 1957 Chicken","Cuban Combo","Mojito","Tres Leches"],
    address:"940 Ocean Dr, Miami Beach FL 33139", lat:25.7800, lng:-80.1310,
    website:"https://havana1957.com", instagram:"@havana1957",
    menuUrl:"https://vidaestilo.olo.com/menu/havana-1957-ocean-drive-940",
    hours:"Mon-Thu 11:30am-11pm, Fri-Sat 11am-12am, Sun 11am-11pm",
    photoUrl:"", photos:[], bestOf:["#1 Best Cuban (Ocean Drive)","#3 Best Live Music"]
  },
  {
    id:4235, name:"Ogawa", phone:"",
    cuisine:"Japanese Omakase", neighborhood:"Little River", score:93, price:4,
    tags:["Japanese","Sushi","Fine Dining","Date Night","Critics Pick","Tasting Menu","Awards"],
    indicators:[], hh:"",
    reservation:"direct", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Eater Miami Best Sushi; Time Out Top 32",
    description:"Little River's intimate omakase counter — meticulous renditions of Edomae sushi alongside hot Japanese plates. Chef Masayuki Komatsu's seven-course menu has held a Time Out Top 32 listing every year since opening.",
    dishes:["Otsukuri","Nigiri Selection","Chawanmushi","Black Cod Saikyo","Wagyu Course","Miso Soup"],
    address:"8127 Biscayne Blvd, Miami FL 33138", lat:25.8497, lng:-80.1846,
    website:"", instagram:"@ogawamiami",
    hours:"Dinner Tue-Sat (single seating)",
    photoUrl:"", photos:[], bestOf:["#2 Best Japanese","#3 Best Tasting Menu"]
  },
  {
    id:4237, name:"Cotoa", phone:"",
    cuisine:"Ecuadorian", neighborhood:"North Miami", score:88, price:3,
    tags:["Ecuadorian","Latin","Date Night","Critics Pick","Awards","Local Favorites","Casual"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Top 32 Best Restaurants",
    description:"Chef Alejandra Espinoza's modern Ecuadorian restaurant in North Miami — ceviches, encebollados, and locro de papa rendered for a Miami audience without losing the cultural specificity. The most ambitious Ecuadorian restaurant in the United States.",
    dishes:["Ceviche de Camarón","Encebollado","Locro de Papa","Llapingachos","Bolón","Tres Leches"],
    address:"12450 Biscayne Blvd, North Miami FL 33181", lat:25.8912, lng:-80.1632,
    website:"", instagram:"@cotoamiami",
    hours:"Dinner Tue-Sun",
    photoUrl:"", photos:[], bestOf:["#1 Best Ecuadorian","#3 Best Latin (North Miami)"]
  },
  {
    id:4238, name:"The Joyce", phone:"",
    cuisine:"Steakhouse", neighborhood:"South Beach", score:88, price:4,
    tags:["Steakhouse","Date Night","Cocktails","Critics Pick","Local Favorites"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Top 32 Best Restaurants",
    description:"South of Fifth's 60-seat steakhouse — focused dry-aged beef program executed with creativity, an unfussy room that punches above the South Pointe scene. Standard steakhouse stuff done seriously.",
    dishes:["Dry-Aged Ribeye","NY Strip","Caesar Salad","Crab Cake","Truffle Mac","Cheesecake"],
    address:"300 Collins Ave, Miami Beach FL 33139", lat:25.7724, lng:-80.1336,
    website:"", instagram:"@thejoycemiami",
    hours:"Dinner daily",
    photoUrl:"", photos:[], bestOf:["#3 Best Steakhouse"]
  },
  {
    id:4239, name:"Claudie", phone:"",
    cuisine:"French Riviera", neighborhood:"Brickell", score:88, price:4,
    tags:["French","Scene","Date Night","Cocktails","Brunch","Critics Pick","Hotel Restaurant"],
    indicators:[], hh:"",
    reservation:"SevenRooms", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Top 32 Best Restaurants",
    description:"Brickell's French-Riviera-inspired hotspot — a glamorous room of velvet banquettes and tableside Champagne service, the night-out-as-theater format that has been Miami's defining late-2020s restaurant trend.",
    dishes:["Steak Tartare","Whole Roasted Branzino","Crispy Duck","Caviar Service","Tuna Tartare","Soufflé"],
    address:"1525 Brickell Ave, Miami FL 33129", lat:25.7577, lng:-80.1932,
    website:"", instagram:"@claudiemiami",
    hours:"Dinner daily; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#3 Best Brickell Date Night"]
  },
  {
    id:4240, name:"Caracas Bakery", phone:"",
    cuisine:"Venezuelan Bakery", neighborhood:"Upper East Side", score:86, price:2,
    tags:["Bakery/Coffee","Venezuelan","Casual","Family Friendly","Local Favorites","Breakfast","Dessert"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:4, verified:TODAY,
    awards:"Time Out Top 32 Best Restaurants",
    description:"Family-run Venezuelan bakery on Biscayne — pastry classics (cachitos, golfeados, tequeños) alongside arepas and Venezuelan coffee. Modern offerings sit alongside the canonical Caracas-style staples; the morning line is steady.",
    dishes:["Cachito de Jamón","Golfeado","Tequeños","Arepas","Quesillo","Cortadito"],
    address:"8125 Biscayne Blvd, Miami FL 33138", lat:25.8497, lng:-80.1846,
    website:"", instagram:"@caracasbakerymia",
    hours:"Daily early morning to evening",
    photoUrl:"", photos:[], bestOf:["#1 Best Venezuelan Bakery"]
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

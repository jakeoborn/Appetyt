const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const TODAY = '2026-04-25';

const NEW_CARDS = [
  {
    id:4216, name:"Naoe", phone:"(305) 947-6263",
    cuisine:"Japanese Omakase", neighborhood:"Brickell Key", score:97, price:4,
    tags:["Japanese","Sushi","Fine Dining","Date Night","Exclusive","Awards","Critics Pick","Tasting Menu"],
    indicators:[], hh:"",
    reservation:"direct", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Forbes Travel Guide 5 Stars (2026), AAA 5 Diamonds, La Liste, Gayot Top 40 US Restaurants",
    description:"Kevin Cory's five-seat Brickell Key omakase counter — universally regarded as one of the finest Japanese restaurants outside Japan. Six-course bento opening followed by chef-selected nigiri; reservations released months in advance and rarely available the same week.",
    dishes:["Bento Course","Chawanmushi","Otsukuri (Sashimi Course)","Nigiri Selection","Soup","Dessert"],
    address:"661 Brickell Key Dr, Miami FL 33131", lat:25.7672, lng:-80.1853,
    website:"https://www.naoemiami.com", instagram:"@naoemiami",
    menuUrl:"", hours:"Dinner Wed-Sat (single seating; reserve directly)",
    photoUrl:"", photos:[], bestOf:["#1 Best Japanese","#1 Best Tasting Menu","#1 Best Fine Dining (Brickell)"]
  },
  {
    id:4217, name:"American Social Brickell", phone:"(305) 223-7004",
    cuisine:"American Gastropub / Sports Bar", neighborhood:"Brickell", score:84, price:3,
    tags:["Sports Bar","American","Happy Hour","Cocktails","Late Night","Brunch","Casual","Local Favorites"],
    indicators:[], hh:"",
    reservation:"OpenTable", reserveUrl:"https://www.opentable.com/r/american-social-bar-and-kitchen-miami", res_tier:5, verified:TODAY,
    awards:"",
    description:"The waterfront Brickell gastropub on the Miami River — multi-screen sports viewing, all-day happy hour, weekend bottomless brunch, and a riverside patio that fills for game days and weekend afternoons.",
    dishes:["Buffalo Wings","Truffle Tots","American Social Burger","Loaded Nachos","Bottomless Mimosas"],
    address:"690 SW 1st Ct, Miami FL 33130", lat:25.7680, lng:-80.1961,
    website:"https://www.americansocialbar.com", instagram:"@amsocialbar",
    menuUrl:"https://americansocialbar.com/our-menus/?menu=miami",
    hours:"Lunch & Dinner daily; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#1 Best Sports Bar (Brickell)","#2 Best Happy Hour"]
  },
  {
    id:4218, name:"Flanigan's Seafood Bar & Grill — Coconut Grove", phone:"(305) 446-1114",
    cuisine:"Seafood / Sports Bar", neighborhood:"Coconut Grove", score:84, price:2,
    tags:["Sports Bar","Seafood","Casual","Family Friendly","Happy Hour","Local Favorites","Late Night","Iconic"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"South Florida institution since 1959 (Big Daddy Flanigan)",
    description:"Coconut Grove flagship of the South Florida sports-bar institution — Big Daddy Flanigan's family-run chain since 1959, BBQ ribs, fish dip, and Bud Light buckets in a wood-paneled tavern that has held Miami sports fans through 60 years of disappointments.",
    dishes:["Famous BBQ Ribs","Fish Dip","Coconut Shrimp","Half-Pound Burger","Dolphin Sandwich","Key Lime Pie"],
    address:"2721 Bird Ave, Miami FL 33133", lat:25.7358, lng:-80.2383,
    website:"https://www.flanigans.net", instagram:"@flanigansseafoodbargrill",
    menuUrl:"https://www.flanigans.net/menus/",
    hours:"Daily 11:30am-1am",
    photoUrl:"", photos:[], bestOf:["#1 Best Sports Bar","#1 Best Family-Friendly Casual"]
  },
  {
    id:4219, name:"Bayside Marketplace", phone:"(305) 577-3344",
    cuisine:"Food Hall / Waterfront", neighborhood:"Downtown Miami", score:80, price:2,
    tags:["Food Hall","Tourist Attraction","Casual","Family Friendly","Outdoor","Live Music","Views"],
    indicators:["outdoor-only"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Downtown's open-air bayfront marketplace — two stories of stalls, restaurants, and live-music plaza overlooking Biscayne Bay. The default first stop for visitors and the launching pad for most Miami harbor cruises.",
    dishes:["Cuban Sandwich","Stone Crab","Mojito","Empanadas","Ice Cream","Conch Fritters"],
    address:"401 Biscayne Blvd, Miami FL 33132", lat:25.7782, lng:-80.1871,
    website:"https://www.baysidemarketplace.com", instagram:"@baysidemarketplace",
    menuUrl:"", hours:"Daily 10am-10pm; Restaurants vary",
    photoUrl:"", photos:[], bestOf:["#1 Best Tourist Attraction","#2 Best Family Outing"]
  },
  {
    id:4220, name:"Wynwood Walls", phone:"(305) 531-4411",
    cuisine:"Outdoor Museum / Food Hall", neighborhood:"Wynwood", score:88, price:2,
    tags:["Tourist Attraction","Family Friendly","Outdoor","Casual","Patio","Local Favorites"],
    indicators:["outdoor-only"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"AIA Florida Honor Award; PaperCity 'Best Public Art Project'",
    description:"Tony Goldman's open-air street-art museum that anchors Wynwood — six-acre walled gallery with rotating murals from Shepard Fairey, Kenny Scharf, and OSGEMEOS, plus an on-site garden bar and food kiosks. Free general admission; ticketed expanded gallery.",
    dishes:["Wynwood Garden Cocktails","Empanadas","Tacos","Espresso","Local Beer","Acai Bowl"],
    address:"2520 NW 2nd Ave, Miami FL 33127", lat:25.8011, lng:-80.1997,
    website:"https://thewynwoodwalls.com", instagram:"@wynwoodwalls",
    menuUrl:"", hours:"Daily 10:30am-10pm",
    photoUrl:"", photos:[], bestOf:["#1 Best Tourist Attraction (Wynwood)","#1 Best Family Outdoor"]
  },
  {
    id:4221, name:"Pura Vida", phone:"(305) 535-3556",
    cuisine:"Healthy / Bowls", neighborhood:"South Beach", score:84, price:2,
    tags:["Healthy","Casual","Brunch","Local Favorites","Breakfast","Family Friendly","Bakery/Coffee","All-Day"],
    indicators:["vegetarian"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Omar Pereney and Jenny Wexler's healthy-bowl café chain — locally-grown bowls, smoothies, organic coffee, and avocado toasts that helped reset Miami's casual-healthy category. The South Beach location anchors a small mini-chain across the city.",
    dishes:["Acai Bowl","Avocado Toast","Pura Vida Bowl","Green Juice","Tropical Smoothie","Quinoa Bowl"],
    address:"110 Washington Ave, Miami Beach FL 33139", lat:25.7704, lng:-80.1353,
    website:"https://www.puravidamiami.com", instagram:"@puravidamiami",
    menuUrl:"https://www.puravidamiami.com/menu",
    hours:"Daily 7am-9pm",
    photoUrl:"", photos:[], bestOf:["#1 Best Healthy","#2 Best Bowls"]
  },
  {
    id:4222, name:"Copper 29 Bar", phone:"(786) 580-4689",
    cuisine:"Cocktail Bar", neighborhood:"Coral Gables", score:85, price:3,
    tags:["Cocktails","Date Night","Late Night","Local Favorites","Happy Hour","Live Music","Patio"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Coral Gables' Aragon Avenue cocktail bar — double-sided copper-topped bar, pre-batched classics, and a calendar of Latin and house DJs that turn the back patio into a midnight dance floor on weekends.",
    dishes:["Old Fashioned","Mezcal Negroni","Espresso Martini","Tomahawk Margarita","Charcuterie Board"],
    address:"203 Aragon Ave, Coral Gables FL 33134", lat:25.7506, lng:-80.2588,
    website:"https://www.copper29.com", instagram:"@copper29bar",
    hours:"Tue-Sun 5pm-3am",
    photoUrl:"", photos:[], bestOf:["#1 Best Cocktail Bar (Coral Gables)"]
  },
  {
    id:4223, name:"Wagyuya MiMo", phone:"(786) 953-7008",
    cuisine:"Japanese Steakhouse / Wagyu", neighborhood:"MiMo", score:88, price:4,
    tags:["Japanese","Steakhouse","Sushi","Date Night","Critics Pick","Fine Dining","Hotel Restaurant"],
    indicators:[], hh:"",
    reservation:"Resy", reserveUrl:"https://resy.com/cities/miami-fl/venues/wagyuya", res_tier:5, verified:TODAY,
    awards:"",
    description:"MiMo's intimate wagyu-focused Japanese counter — A5 Miyazaki by-the-gram, robata-grilled cuts, and a sushi program that takes the back seat to the beef. The room is 30 seats and never less than full.",
    dishes:["Miyazaki A5 Wagyu","Wagyu Sushi","Robata Lamb","Toro Tartare","Black Cod Miso","Yuzu Cheesecake"],
    address:"5829 NE 2nd Ave, Miami FL 33137", lat:25.8289, lng:-80.1919,
    website:"https://www.wagyuya.com", instagram:"@wagyuyamiami",
    hours:"Dinner Tue-Sun",
    photoUrl:"", photos:[], bestOf:["#2 Best Japanese","#3 Best Steakhouse"]
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

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const NEW_CARDS = [
  {
    id:4131, name:"STORY Miami", phone:"(305) 538-2424",
    cuisine:"Nightclub", neighborhood:"South Beach", score:90, price:4,
    tags:["Nightclub","Scene","Late Night","Bottle Service","DJ"],
    reservation:"SevenRooms", awards:"",
    description:"David Grutman's South Beach club — LIV's Washington Avenue counterpart, all 5,000-square-foot dance floor, kinetic LED ceiling, and a residency calendar headlined by Chainsmokers, Diplo, and Calvin Harris.",
    dishes:["Tableside Champagne","Bottle Service","Patrón","Ace of Spades","VIP Booth"],
    address:"136 Collins Ave, Miami Beach FL 33139", lat:25.7723, lng:-80.1326,
    website:"https://storymiami.com", instagram:"@storymiami",
    hours:"Thu-Sat 11pm-5am"
  },
  {
    id:4132, name:"Club Space", phone:"(305) 357-8444",
    cuisine:"Nightclub / Techno", neighborhood:"Downtown Miami", score:94, price:3,
    tags:["Nightclub","Iconic","Techno","Late Night","24-Hour","Critics Pick"],
    reservation:"resident-advisor", awards:"DJ Mag Top 100 Clubs, RA Best Clubs",
    description:"Downtown Miami's after-hours temple — open Friday night through Sunday afternoon without closing, the rooftop terrace at sunrise is the city's most enduring nightlife ritual. The American techno club that the rest of the country measures itself against.",
    dishes:["Bottle Service","Cocktails","Vodka Soda","Tequila","Patrón"],
    address:"34 NE 11th St, Miami FL 33132", lat:25.7846, lng:-80.1932,
    website:"https://clubspace.com", instagram:"@clubspace",
    hours:"Fri 11pm - Sun afternoon (continuous)"
  },
  {
    id:4133, name:"E11EVEN Miami", phone:"(305) 829-2911",
    cuisine:"24-Hour Nightclub", neighborhood:"Downtown Miami", score:92, price:4,
    tags:["Nightclub","24-Hour","Scene","Late Night","Bottle Service","Iconic"],
    reservation:"SevenRooms", awards:"",
    description:"America's only 24-hour ultraclub — three levels of cabaret performance, aerial silks, and headline DJs every night. The Miami nightlife venue that doesn't sleep.",
    dishes:["Bottle Service","Champagne Tower","Patrón","Don Julio 1942","Ace of Spades"],
    address:"29 NE 11th St, Miami FL 33132", lat:25.7849, lng:-80.1935,
    website:"https://www.11miami.com", instagram:"@11miami",
    hours:"24/7"
  },
  {
    id:4134, name:"Bourbon Steak Miami", phone:"(786) 279-6600",
    cuisine:"Steakhouse / American", neighborhood:"Aventura", score:91, price:4,
    tags:["Steakhouse","Date Night","Hotel Restaurant","Wine","Critics Pick","Award Winner"],
    reservation:"OpenTable",
    awards:"Wine Spectator Best of Award of Excellence, Forbes Travel Guide",
    description:"Michael Mina's Turnberry Aventura steakhouse — butter-poached cuts, a multi-page wine list, and signature trio of duck-fat fries. The steakhouse the South Florida private-club set goes to when they don't want South Beach.",
    dishes:["Bourbon Steak Trio","Mishima Reserve A5 Wagyu","Tuna Tartare","Lobster Pot Pie","Caviar Service"],
    address:"19999 W Country Club Dr, Aventura FL 33180", lat:25.9569, lng:-80.1430,
    website:"https://www.michaelmina.net/restaurants/bourbon-steak-miami", instagram:"@bourbonsteakmiami",
    menuUrl:"https://www.michaelmina.net/restaurants/bourbon-steak-miami/menus",
    hours:"Dinner daily"
  },
  {
    id:4135, name:"Dirty French Steakhouse", phone:"(305) 800-3344",
    cuisine:"French Steakhouse", neighborhood:"Brickell", score:91, price:4,
    tags:["Steakhouse","French","Scene","Date Night","Critics Pick","Hotel Restaurant"],
    reservation:"Resy",
    awards:"",
    description:"Major Food Group's French chophouse at the Citizens building — duck à l'orange carved tableside, the burger New York critics already worship, and a mahogany-paneled room engineered for the 9pm reservation crowd.",
    dishes:["Dirty French Burger","Duck à l'Orange","Steak au Poivre","Tuna Tartare","Roast Chicken"],
    address:"2200 Brickell Ave, Miami FL 33129", lat:25.7530, lng:-80.2006,
    website:"https://www.dirtyfrenchsteakhouse.com/miami", instagram:"@dirtyfrenchsteakhouse",
    hours:"Dinner daily"
  },
  {
    id:4136, name:"Hoy Como Ayer", phone:"(786) 708-8633",
    cuisine:"Cuban Live Music Bar", neighborhood:"Little Havana", score:88, price:2,
    tags:["Cuban","Live Music","Latin","Iconic","Cultural","Late Night"],
    reservation:"walk-in",
    awards:"",
    description:"Calle Ocho's intimate Cuban music venue since 2003 — the room where Buena Vista Social Club veterans pass through, mojito-slicked dancing on weeknights, and the kind of singing that makes the rum cheap.",
    dishes:["Mojito","Cuba Libre","Rum Old Fashioned","Cubano","Empanadas"],
    address:"2212 SW 8th St, Miami FL 33135", lat:25.7652, lng:-80.2310,
    website:"https://hoycomoayermiami.com", instagram:"@hoycomoayermiami",
    hours:"Wed-Sun, late-night live music"
  },
  {
    id:4137, name:"Bodega Taqueria y Tequila South Beach", phone:"(305) 704-2145",
    cuisine:"Mexican / Late Night Bar", neighborhood:"South Beach", score:87, price:2,
    tags:["Mexican","Late Night","Scene","Tacos","Local Favorites","Hidden Bar"],
    reservation:"walk-in",
    awards:"",
    description:"By day a casual taco shop, by night a hidden bar accessed through a port-a-potty door at the back. The 5am taco-and-tequila stop that defined late-2010s South Beach drinking.",
    dishes:["Al Pastor Taco","Carne Asada Taco","Cauliflower Taco","Margarita","Mezcal Old Fashioned"],
    address:"1220 16th St, Miami Beach FL 33139", lat:25.7888, lng:-80.1416,
    website:"https://bodegasouthbeach.com", instagram:"@bodegasouthbeach",
    menuUrl:"https://bodegasouthbeach.com/menu/",
    hours:"Daily 8am-5am"
  },
  {
    id:4138, name:"Rosa Sky Rooftop", phone:"(786) 502-6000",
    cuisine:"Rooftop Bar / Latin", neighborhood:"Brickell", score:88, price:3,
    tags:["Rooftop","Cocktails","Views","Date Night","Latin","Hotel Bar"],
    reservation:"OpenTable",
    awards:"",
    description:"AC Hotel Brickell's 12th-floor rooftop — Latin-leaning cocktails, ceviche, and the most photogenic view of Brickell's skyline from below. Built for golden hour.",
    dishes:["Rosa Sky Margarita","Pisco Sour","Tuna Ceviche","Yuca Fries","Mezcal Old Fashioned"],
    address:"600 SE 1st Ave, Miami FL 33131", lat:25.7666, lng:-80.1921,
    website:"https://www.rosaskymiami.com", instagram:"@rosaskymiami",
    hours:"Daily 4pm-2am"
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
['photoUrl','menuUrl','awards'].forEach(k => { if (!ALL_KEYS.includes(k)) ALL_KEYS.push(k); });
const DEFAULTS = {phone:'',bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:'',suburb:false,reserveUrl:'',menuUrl:'',indicators:[],hh:'',awards:'',photoUrl:''};

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of ALL_KEYS) out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  for (const k of Object.keys(card)) if (!(k in out)) out[k] = card[k];
  return out;
});

lines[idx] = `const MIAMI_DATA=${JSON.stringify([...arr, ...merged])};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('Wrote', merged.length, 'cards. New total:', arr.length + merged.length);

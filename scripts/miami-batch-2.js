// Miami batch 2: append 8 verified cards with full data.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const NEW_CARDS = [
  {
    id:4123, name:"Sweet Liberty Drinks & Supply Co.", phone:"(305) 763-8217",
    cuisine:"Cocktail Bar / American", neighborhood:"South Beach", score:92, price:3,
    tags:["Cocktails","Awards","Date Night","Late Night","Critics Pick","North America Top 50 Bar"],
    reservation:"walk-in",
    awards:"Tales of the Cocktail Best New American Cocktail Bar 2016, World's 50 Best Bars",
    description:"John Lermayer's still-imperfect drinks bar — the South Beach institution that made the city's first run at World's 50 Best Bars. Late-night kitchen, bartenders' table for one-on-one service, and a piña colada built with serious rum.",
    dishes:["Daiquiri","Painkiller","Whole-Roasted Cauliflower","Sweet Liberty Burger","Daily Punch"],
    address:"237 20th St, Miami Beach FL 33139", lat:25.7961, lng:-80.1298,
    website:"https://mysweetliberty.com", instagram:"@sweetlibertymiami",
    menuUrl:"https://mysweetliberty.com/menu/food",
    hours:"Daily 4pm-5am",
    photoUrl:"https://media.timeout.com/images/103349283/image.jpg"
  },
  {
    id:4124, name:"Mac's Club Deuce", phone:"(305) 531-6200",
    cuisine:"Dive Bar", neighborhood:"South Beach", score:88, price:1,
    tags:["Dive Bar","Iconic","Late Night","Historic","Local Favorites"],
    reservation:"walk-in",
    awards:"Miami's oldest bar (est. 1926), Anthony Bourdain favorite",
    description:"South Beach's oldest bar, opened 1926, neon-buzzing 8am-5am every day. The patron saint of pre-Art Deco Miami, immortalized by Anthony Bourdain and untouched by South Beach gentrification.",
    dishes:["Bud Light","Well Whiskey","Bloody Mary","Beer & Shot","Daiquiri"],
    address:"222 14th St, Miami Beach FL 33139", lat:25.7853, lng:-80.1315,
    website:"https://www.macsclubdeuce.com", instagram:"@macsclubdeuce",
    hours:"Daily 8am-5am",
    photoUrl:"https://static.wixstatic.com/media/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg/v1/fit/w_2500,h_1330,al_c/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg"
  },
  {
    id:4125, name:"Dante's HiFi", phone:"",
    cuisine:"Vinyl Listening Bar", neighborhood:"Wynwood", score:92, price:3,
    tags:["Cocktails","Vinyl","Date Night","Scene","North America Top 50 Bar","Awards"],
    reservation:"SevenRooms",
    awards:"World's 50 Best Bars, Esquire Best Bars in America",
    description:"America's first dedicated vinyl listening bar — Klipsch horn speakers, all-agave cocktails, and a rotating roster of selectors. Ranked among World's 50 Best Bars within a year of opening.",
    dishes:["Mezcal Negroni","Daiquiri","La Paloma","Smoked Old Fashioned","Tinned Fish"],
    address:"1858 NW 1st Ct, Miami FL 33136", lat:25.7936, lng:-80.1978,
    website:"https://www.danteshifi.com", instagram:"@danteshifi",
    hours:"Wed-Sun 7pm-2am"
  },
  {
    id:4126, name:"Smith & Wollensky Miami Beach", phone:"(305) 673-2800",
    cuisine:"Steakhouse", neighborhood:"South Pointe", score:89, price:4,
    tags:["Steakhouse","Iconic","Views","Date Night","Outdoor","Sunday Brunch"],
    reservation:"OpenTable",
    awards:"Wine Spectator Award of Excellence",
    description:"The white-clapboard chophouse on the southern tip of South Pointe Park — a port-side classic where USDA Prime cuts come with cargo-ship views. The southern bookend to Joe's Stone Crab.",
    dishes:["Cajun Ribeye","USDA Prime NY Strip","Crab Cakes","Coconut Cake","Lobster Cocktail"],
    address:"1 Washington Ave, Miami Beach FL 33139", lat:25.7658, lng:-80.1340,
    website:"https://www.smithandwollensky.com/our-restaurants/miami-beach", instagram:"@smithandwollensky",
    menuUrl:"https://www.smithandwollensky.com/our-restaurants/miami-beach/menus/",
    hours:"Daily 11:30am-11pm"
  },
  {
    id:4127, name:"R House Wynwood", phone:"(305) 576-0201",
    cuisine:"American / Drag Brunch", neighborhood:"Wynwood", score:86, price:3,
    tags:["Brunch","Drag Brunch","Scene","Wynwood","LGBTQ+","Local Favorites"],
    reservation:"OpenTable",
    awards:"",
    description:"Rocco Carulli and Owen Bale's Wynwood gallery-restaurant turned the Sunday drag brunch into a citywide ritual. The food is genuinely good — the show is what brings the room.",
    dishes:["Smoked Salmon Bowl","Lobster Mac & Cheese","Truffle Burger","Sangria Pitcher","Brunch Cocktail"],
    address:"2727 NW 2nd Ave, Miami FL 33127", lat:25.8027, lng:-80.1990,
    website:"https://www.rhousewynwood.com", instagram:"@rhousewynwood",
    menuUrl:"https://www.rhousewynwood.com/menu",
    hours:"Tue-Sun, Brunch Sat-Sun",
    photoUrl:"https://static.wixstatic.com/media/a28b97_b72b1b3689cc4c8aa3730106ef2e3acb~mv2.jpg/v1/fit/w_2500,h_1330,al_c/a28b97_b72b1b3689cc4c8aa3730106ef2e3acb~mv2.jpg"
  },
  {
    id:4128, name:"Cerveceria La Tropical", phone:"(305) 397-8736",
    cuisine:"Cuban Brewery", neighborhood:"Wynwood", score:87, price:2,
    tags:["Cuban","Brewery","Outdoor","Local Favorites","Casual","Latin"],
    reservation:"walk-in",
    awards:"",
    description:"The 1888 Havana brewery resurrected in Wynwood by the Heineken-affiliated Tropical family — open-air courtyard, traditional croquetas and ropa vieja, and a flagship lager unchanged in 130 years.",
    dishes:["Original Lager","Croquetas","Ropa Vieja","Cubano Sandwich","Maduros"],
    address:"42 NE 25th St, Miami FL 33137", lat:25.8004, lng:-80.1939,
    website:"https://www.cervecerialatropical.com", instagram:"@latropicalmiami",
    menuUrl:"https://www.cervecerialatropical.com/menu/",
    hours:"Daily 12pm-12am"
  },
  {
    id:4129, name:"Red Rooster Overtown", phone:"(305) 640-4140",
    cuisine:"Soul Food / Caribbean", neighborhood:"Overtown", score:89, price:3,
    tags:["Soul Food","Awards","Date Night","Live Music","Cultural","Critics Pick"],
    reservation:"Resy",
    awards:"James Beard Foundation Outstanding Restaurateur (Marcus Samuelsson)",
    description:"Marcus Samuelsson's Harlem export resited in Overtown's historic Black business corridor — fried chicken, oxtail, and a curated soundtrack that doubles as a love letter to the neighborhood that produced Sam Cooke and Cassius Clay.",
    dishes:["Fried Yardbird","Helga's Meatballs","Oxtail","Mac & Greens","Brown Butter Pie"],
    address:"920 NW 2nd Ave, Miami FL 33136", lat:25.7831, lng:-80.1983,
    website:"https://www.redroosterovertown.com", instagram:"@redroosterovertown",
    menuUrl:"https://www.redroosterovertown.com/menus/",
    hours:"Lunch & Dinner Tue-Sun"
  },
  {
    id:4130, name:"LIV Miami", phone:"(305) 674-4680",
    cuisine:"Nightclub", neighborhood:"Mid Beach", score:92, price:4,
    tags:["Nightclub","Iconic","Scene","Late Night","Hotel Bar","Bottle Service"],
    reservation:"SevenRooms",
    awards:"Top 50 Nightclubs in the World, multiple years",
    description:"The Fontainebleau's marquee nightclub since 2008 — David Grutman's flagship and arguably America's most-photographed dancefloor. Resident DJs and a bottle list that reads like a champagne-house catalog.",
    dishes:["Tableside Champagne Service","Patrón","Belvedere","Ace of Spades","Bottle Service"],
    address:"4441 Collins Ave, Miami Beach FL 33140", lat:25.8181, lng:-80.1220,
    website:"https://livnightclub.com", instagram:"@livmiami",
    hours:"Wed/Fri/Sat 11pm-5am"
  }
];

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
if (idx < 0) { console.error('MIAMI_DATA not found'); process.exit(1); }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));
console.log('Before:', arr.length);

const existingIds = new Set(arr.map(c => c.id));
const existingNames = new Set(arr.map(c => c.name.toLowerCase()));
for (const c of NEW_CARDS) {
  if (existingIds.has(c.id)) { console.error('ID collision', c.id, c.name); process.exit(1); }
  if (existingNames.has(c.name.toLowerCase())) { console.error('Name dup', c.name); process.exit(1); }
}

// Use sample card key order from existing data + photoUrl/menuUrl/awards
const SAMPLE_KEYS = Object.keys(arr[0]);
const ALL_KEYS = [...SAMPLE_KEYS];
['photoUrl','menuUrl','awards'].forEach(k => { if (!ALL_KEYS.includes(k)) ALL_KEYS.push(k); });

const DEFAULTS = {
  phone:'', bestOf:[], busyness:null, waitTime:null, popularTimes:null,
  lastUpdated:null, trending:false, group:'', suburb:false,
  reserveUrl:'', menuUrl:'', indicators:[], hh:'', awards:'', photoUrl:''
};

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of ALL_KEYS) {
    out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  }
  for (const k of Object.keys(card)) if (!(k in out)) out[k] = card[k];
  return out;
});

const newArr = [...arr, ...merged];
console.log('After:', newArr.length);

const newLine = `const MIAMI_DATA=${JSON.stringify(newArr)};`;
lines[idx] = newLine;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('IDs added:', merged.map(c => c.id).join(','));
console.log('With photoUrl:', merged.filter(c => c.photoUrl).length, '/', merged.length);

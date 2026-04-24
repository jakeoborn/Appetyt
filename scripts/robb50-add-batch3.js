#!/usr/bin/env node
// Add The Sampler, Grand Bar & Salon, Club Room, Gilligan's to NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARDS = [
  {
    id: 2005,
    name: 'The Sampler',
    phone: '(718) 484-3560',
    cuisine: 'Beer Bar',
    neighborhood: 'Bushwick',
    score: 84,
    price: 1,
    tags: ['Beer', 'Casual', 'Late Night', 'Local Favorites'],
    indicators: [],
    hh: '',
    reservation: 'walk-in',
    awards: '',
    description: "Bushwick's first bar devoted to craft beer, open since 2013 and revitalized in 2018 by co-owners Richard Mercado (Puerto Rican) and Leo Tineo (Dominican) with partner Joel Suarez. Twenty rotating taps and 300+ bottles and cans from US micro-brewers, plus wine, signature cocktails, and a pop-up kitchen that cycles through guest chefs. Table games, local art on the walls, and a DJ most nights. Latino-owned, Bushwick-native, late open — Friday and Saturday run to 4am.",
    dishes: ['Craft beer flights', 'Rotating taps', 'Guest chef pop-ups', 'Wine', 'Cocktails'],
    address: '234 Starr St, Brooklyn, NY 11237',
    hours: 'Mon-Thu 6pm-2am; Fri-Sat 6pm-4am; Sun 6pm-2am',
    lat: 40.7055479,
    lng: -73.9223382,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    group: '',
    instagram: '@thesamplerbk',
    website: 'https://www.thesamplerbk.nyc',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: 1,
    photos: [],
    photoUrl: '',
    verified: '2026-04-23',
  },
  {
    id: 2006,
    name: 'Grand Bar & Salon',
    phone: '(212) 965-3588',
    cuisine: 'Hotel Lounge / American',
    neighborhood: 'SoHo',
    score: 89,
    price: 4,
    tags: ['Cocktails', 'Hotel Bar', 'Scene', 'Date Night', 'Luxury', 'Whiskey'],
    indicators: [],
    hh: '',
    reservation: 'Resy',
    awards: '',
    description: "The lobby lounge of the Soho Grand Hotel, a throwback to old-New-York grand-bar tradition: gold-polished marble-top oak bar, embossed leather stools with nail-head detailing, New York Public Library-inspired chandeliers, terrazzo floors with nickel strips, and woven leather banquettes along the soaring windows. Fifty rare American whiskeys and a cocktail program from Natasha David and Jeremy Oertel. Breakfast through late-night food service — Eggs Benedict at 7am, Grand Burger at 2am. Live DJs Thursday through Saturday.",
    dishes: ['Grand Burger', 'Steak Frites au Poivre', 'Grand Margarita', 'Hell\'s Hundred Acres', 'Caviar service', 'Charcuterie board'],
    address: '310 W Broadway, New York, NY 10013',
    hours: 'Daily 7am-late; DJs Thu 8pm, Fri-Sat 7pm-late',
    lat: 40.7220039,
    lng: -74.0043561,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    group: 'GrandLife Hotels',
    instagram: '@sohograndhotel',
    website: 'https://www.sohogrand.com/dining/grand-bar/',
    suburb: false,
    reserveUrl: 'https://resy.com/cities/new-york-ny/venues/grand-bar-and-lounge-at-soho-grand-hotel',
    menuUrl: '',
    res_tier: 4,
    photos: [],
    photoUrl: 'https://www.cityguideny.com/uploads2/157332/Screen%20Shot%202023-12-01%20at%203_48_47%20PM.png',
    verified: '2026-04-23',
  },
  {
    id: 2007,
    name: 'Club Room',
    phone: '(212) 965-3000',
    cuisine: 'Cocktail Bar / Supper Club',
    neighborhood: 'SoHo',
    score: 90,
    price: 4,
    tags: ['Cocktails', 'Live Music', 'Jazz', 'Scene', 'Date Night', 'Luxury', 'Late Night'],
    indicators: [],
    hh: '',
    reservation: 'Resy',
    awards: '',
    description: "A two-room cocktail bar and live-music supper club on the second floor of the Soho Grand — Parlor and Bar Room, both drenched in velvet seating and warm lighting, with oversized Terry O'Neill black-and-white portraits on every wall. The bartenders run a mixology-history program from the 19th-century old fashioned through modernized espresso martinis. Nightly performers take the stage 7:30–8:30pm and 9:00–10:00pm — electric pianists, sultry vocalists, jazz. Cover is $25 Wed/Thu, $35 Fri/Sat (waived for hotel guests); 10pm onward turns DJ-driven with dancing through late.",
    dishes: ['Cheri Baby cocktail', 'Tall Dark Stranger cocktail', 'Oysters on the Half Shell', 'Club fries', 'Caviar service', 'Grand Burger'],
    address: '310 W Broadway, New York, NY 10013',
    hours: 'Wed-Sat 6pm-late',
    lat: 40.7220039,
    lng: -74.0043561,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    group: 'GrandLife Hotels',
    instagram: '@clubroomnewyork',
    website: 'https://www.clubroomnyc.com',
    suburb: false,
    reserveUrl: 'https://resy.com/cities/new-york-ny/venues/club-room-at-soho-grand-hotel',
    bookingInfo: 'Resy for dining + live music; SevenRooms for late-night tables after 10pm.',
    menuUrl: '',
    res_tier: 4,
    photos: [],
    photoUrl: 'https://www.cityguideny.com/uploads2/483424/Club-Room-Lighter-fotor-2024092315378.jpg',
    verified: '2026-04-23',
  },
  {
    id: 2008,
    name: "Gilligan's",
    phone: '',
    cuisine: 'Tropical / Seafood',
    neighborhood: 'SoHo',
    score: 86,
    price: 3,
    tags: ['Cocktails', 'Outdoor', 'Tropical', 'Pizza', 'Seafood', 'Seasonal'],
    indicators: ['seasonal'],
    hh: '',
    reservation: 'walk-in',
    awards: '',
    description: "The Soho Grand's summer-only outdoor bar, a slice of Long Island island-life on West Broadway. Picnic tables, deck chairs, kitschy tropical decor (mermaids, hanging bananas, beach fabric). Ingredient-driven menu runs signature pizzas alongside seafood from Long Island farms and fishermen. The Frozen Watermelon Margarita is the house anchor, joined by seasonal additions like a Gin Matcha Piña Colada and a fresh Jalapeño Mezcal. Typically open May through late September.",
    dishes: ['Frozen Watermelon Margarita', 'Gin Matcha Piña Colada', 'Jalapeño Mezcal', 'Signature pizzas', 'Long Island seafood'],
    address: '310 W Broadway, New York, NY 10013',
    hours: 'Seasonal (May-Sept); check @gilligansatsohogrand',
    lat: 40.7220039,
    lng: -74.0043561,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    group: 'GrandLife Hotels',
    instagram: '@gilligansatsohogrand',
    website: 'https://www.gilligansnyc.com',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: 1,
    photos: [],
    photoUrl: 'https://hotelchicblog.com/wp-content/uploads/2013/07/gilligans.jpg',
    verified: '2026-04-23',
  },
];

let html = fs.readFileSync(HTML_PATH, 'utf8');
const startLen = html.length;

let nycStart = html.indexOf('const NYC_DATA=');
if (nycStart < 0) nycStart = html.indexOf('const NYC_DATA =');
if (nycStart < 0) throw new Error('NYC_DATA not found');
const arrOpen = html.indexOf('[', nycStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}
let arrText = html.slice(arrOpen, arrClose);

for (const card of CARDS) {
  const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + card.id + '(?=[,}\\s])');
  if (idRe.test(arrText)) { console.error('id ' + card.id + ' already present — skipping ' + card.name); continue; }
  const nameCheck = '"name":"' + card.name.replace(/"/g, '\\"') + '"';
  if (arrText.includes(nameCheck)) { console.error(card.name + ' already present — skipping'); continue; }
  const serialized = JSON.stringify(card);
  const lastCloseBrace = arrText.lastIndexOf('}');
  arrText = arrText.slice(0, lastCloseBrace + 1) + ',' + serialized + arrText.slice(lastCloseBrace + 1);
  console.log('+ ' + card.name + ' (id=' + card.id + ')');
}

const newHtml = html.slice(0, arrOpen) + arrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('File delta: +' + (newHtml.length - startLen) + ' bytes');

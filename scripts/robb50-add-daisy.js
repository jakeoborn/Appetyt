#!/usr/bin/env node
// Add Daisy Margarita Bar (Robb Report NA Top 50 Bars #44) to LA_DATA.
// Also adds "Sherman Oaks" to LA CITY_NEIGHBORHOODS vocab + NEIGHBORHOOD_COORDS.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const CONST_NAME = 'LA_DATA';

const CARD = {
  id: 2535,
  name: 'Daisy Margarita Bar',
  phone: '(818) 450-3994',
  cuisine: 'Mexican / Margarita Bar',
  neighborhood: 'Sherman Oaks',
  score: 90,
  price: 2,
  tags: ['Mexican', 'Cocktails', 'Critics Pick', 'Awards', 'Casual', 'North America Top 50 Bar'],
  indicators: [],
  hh: '',
  reservation: 'Resy',
  awards: "North America's 50 Best Bars 2025 (#44)",
  description: "The Mírate team — proprietor Matt Egan, chef Alan Sanz, and beverage director Max Reis — brought their Mexican hospitality across the hill in June 2025, reworking the old Sherman space into an upscale vaquero cantina: wood paneling, green and gold tones, vintage Mexican photography, fringe lamps, and a custom jukebox. The bar is built around margaritas in their many forms (Cantina, Mercado, Salsa Bar), with Reis sourcing private-batch tequilas from El Tesoro and Tequila Ocho visible in the grid of tap-equipped glass jugs behind the counter. No salt rims: every drink is pre-salted for balance. Chef Alan Sanz's menu sources 70% of its ingredients from Mexico, pulling from Ensenada seafood and Monterrey meat traditions.",
  dishes: ['Mangoneada Margarita', 'Dirty Shirley Margarita', 'Guacamole Frozen Margarita', 'Tuna tostada', 'Kampachi ceviche', 'Lamb shank with porky beans', 'Tlacoyos', 'Oaxacan chocolate tart'],
  address: '14633 Ventura Blvd, Sherman Oaks, CA 91403',
  hours: 'Mon 5pm-11pm; Tue-Thu 5pm-12am; Fri 5pm-1am; Sat 11am-1am; Sun 11am-11pm',
  lat: 34.1517661,
  lng: -118.4521412,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: true,
  group: 'Mírame Hospitality',
  instagram: '@daisy.la',
  website: 'https://www.daisyla.com',
  suburb: false,
  reserveUrl: 'https://resy.com/cities/los-angeles-ca/venues/daisy',
  menuUrl: '',
  res_tier: 4,
  photos: [],
  photoUrl: 'https://blog.resy.com/wp-content/uploads/2025/06/DAISY-054-2000x1125.jpg',
  verified: '2026-04-23',
};

const SHERMAN_OAKS_VOCAB = {
  emoji: '🌴',
  vibe: 'San Fernando Valley dining strip centered on Ventura Boulevard — a residential foodie pocket that punches well above its zip code for cocktails, sushi, and modern Mexican.',
  bestFor: 'Mexican, Cocktails, Sushi',
  knownFor: 'Ventura Boulevard restaurants, Valley foodie scene',
  mustVisit: 'Daisy Margarita Bar, Casa Vega, Pineapple Hill Saloon',
  tip: 'The Ventura Boulevard stretch between Sepulveda and Van Nuys Blvd is the densest food-and-drink corridor in the Valley.'
};

const SHERMAN_OAKS_COORDS = [34.1516, -118.4484];

let html = fs.readFileSync(HTML_PATH, 'utf8');
const initialLen = html.length;

// ------ Step 1: Add to NEIGHBORHOOD_COORDS if not present ------
if (!html.includes('"Sherman Oaks":[')) {
  const coordsMatch = html.match(/const NEIGHBORHOOD_COORDS\s*=\s*\{/);
  if (!coordsMatch) throw new Error('NEIGHBORHOOD_COORDS not found');
  const coordsOpen = coordsMatch.index + coordsMatch[0].length;
  // Insert right after the opening `{`
  const insertion = `"Sherman Oaks":[${SHERMAN_OAKS_COORDS[0]},${SHERMAN_OAKS_COORDS[1]}],`;
  html = html.slice(0, coordsOpen) + insertion + html.slice(coordsOpen);
  console.log('+ Added Sherman Oaks to NEIGHBORHOOD_COORDS');
} else {
  console.log('= NEIGHBORHOOD_COORDS already has Sherman Oaks');
}

// ------ Step 2: Add to Los Angeles CITY_NEIGHBORHOODS vocab if not present ------
const laVocabStart = html.indexOf('"Los Angeles":{');
if (laVocabStart < 0) throw new Error('"Los Angeles":{ not found in CITY_NEIGHBORHOODS');
const laObjStart = html.indexOf('{', laVocabStart);
let depth = 0, laObjEnd = laObjStart;
for (let i = laObjStart; i < html.length; i++) {
  if (html[i] === '{') depth++;
  if (html[i] === '}') { depth--; if (depth === 0) { laObjEnd = i; break; } }
}
const laObjText = html.slice(laObjStart, laObjEnd + 1);

if (!laObjText.includes('"Sherman Oaks":{')) {
  const vocabInsert = ',"Sherman Oaks":' + JSON.stringify(SHERMAN_OAKS_VOCAB);
  // Insert right before the LA object's closing brace (at laObjEnd)
  html = html.slice(0, laObjEnd) + vocabInsert + html.slice(laObjEnd);
  console.log('+ Added Sherman Oaks to LA CITY_NEIGHBORHOODS');
} else {
  console.log('= LA CITY_NEIGHBORHOODS already has Sherman Oaks');
}

// ------ Step 3: Add card to LA_DATA ------
let cityStart = html.indexOf('const ' + CONST_NAME + '=');
if (cityStart < 0) cityStart = html.indexOf('const ' + CONST_NAME + ' =');
if (cityStart < 0) throw new Error(CONST_NAME + ' not found');
const arrOpen = html.indexOf('[', cityStart);
let d2 = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') d2++;
  if (html[i] === ']') { d2--; if (d2 === 0) { arrClose = i + 1; break; } }
}
const arrText = html.slice(arrOpen, arrClose);

const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + CARD.id + '(?=[,}\\s])');
if (idRe.test(arrText)) { console.error('id ' + CARD.id + ' already present.'); process.exit(1); }
if (arrText.includes('"name":"Daisy Margarita Bar"')) { console.error('Daisy Margarita Bar already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

html = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);

fs.writeFileSync(HTML_PATH, html);
console.log('+ Added Daisy Margarita Bar (id=' + CARD.id + ')');
console.log('Total file delta: +' + (html.length - initialLen) + ' bytes');

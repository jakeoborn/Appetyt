#!/usr/bin/env node
// Add 6 Chicago restaurants from Eater's 38 Best (Spring 2026) that were missing.
// Verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function makeEntry(e) {
  return {
    name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood, score: e.score, price: e.price,
    tags: e.tags || [], description: e.description, dishes: e.dishes || [],
    address: e.address, hours: e.hours || '', lat: e.lat, lng: e.lng,
    instagram: e.instagram || '', website: e.website || '', reservation: e.reservation || '',
    phone: e.phone || '', id: e.id,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: e.trending === true, group: e.group || '', suburb: false, menuUrl: '',
    res_tier: e.res_tier || 0, indicators: e.indicators || [], awards: e.awards || '',
    reserveUrl: '', hh: '', verified: true,
  };
}

const newEntries = [
  makeEntry({
    id: 12530,
    name: "Manny's Cafeteria & Delicatessen",
    cuisine: 'Jewish Deli',
    neighborhood: 'South Loop',
    score: 85,
    price: 2,
    tags: ['Deli', 'Jewish', 'Classic', 'Lunch', 'Cash Only'],
    description: "Chicago institution since 1942. Cafeteria-style Jewish deli with towering corned beef and pastrami sandwiches, matzo ball soup, and latkes. Walls covered in decades-old newspaper clippings and letters from Chicago political luminaries.",
    dishes: ['Corned Beef Sandwich', 'Pastrami on Rye', 'Matzo Ball Soup'],
    address: '1141 S Jefferson St, Chicago, IL 60607',
    lat: 41.8678,
    lng: -87.6424,
    instagram: 'mannysdeli',
    website: 'https://www.mannysdeli.com/',
    reservation: 'walk-in',
    phone: '(312) 939-2855',
  }),
  makeEntry({
    id: 12531,
    name: 'Rose Mary',
    cuisine: 'Croatian-Italian',
    neighborhood: 'Fulton Market',
    score: 88,
    price: 4,
    tags: ['Italian', 'Croatian', 'Date Night', 'Critics Pick', 'Patio'],
    description: "Top Chef winner Joe Flamm's love letter to Adriatic cuisine, blending Croatian and Italian traditions. Michelin Plate honoree known for handmade pastas, wood-roasted fish, and a seasonal ragu. Sister restaurant of BLVD Steakhouse under Day Off Group.",
    dishes: ['Funky Ribs', 'Handmade Pasta', 'Wood-Roasted Fish'],
    address: '932 W Fulton Market, Chicago, IL 60607',
    lat: 41.8866,
    lng: -87.6502,
    instagram: 'rosemarychi',
    website: 'https://www.rosemarychicago.com/',
    reservation: 'OpenTable',
    res_tier: 3,
    group: 'Day Off Group',
  }),
  makeEntry({
    id: 12532,
    name: 'Kyōten',
    cuisine: 'Japanese Omakase',
    neighborhood: 'Logan Square',
    score: 92,
    price: 4,
    tags: ['Japanese', 'Omakase', 'Sushi', 'Fine Dining', 'Exclusive', 'Critics Pick'],
    description: "Chef Otto Phan's counter omakase. Rare, wild, and ephemeral ingredients sourced predominantly from Japan. A tightly focused tasting menu built on flavor purity and balanced shari. Has a sister 'Kyoten Next Door' concept for reservation-only counter sushi.",
    dishes: ['Nigiri Omakase', 'Seasonal Sashimi', 'Otoro'],
    address: '2507 W Armitage Ave, Chicago, IL 60647',
    lat: 41.9177,
    lng: -87.6912,
    instagram: 'kyotenchicago',
    website: 'http://kyotenchicago.com/',
    reservation: 'Tock',
    res_tier: 5,
  }),
  makeEntry({
    id: 12533,
    name: 'Hermosa Restaurant',
    cuisine: 'Cambodian',
    neighborhood: 'Hermosa',
    score: 85,
    price: 3,
    tags: ['Cambodian', 'Asian', 'Neighborhood', 'Family-Owned'],
    description: "Cambodian restaurant that brings family recipes and Asian flavors into Chicago classics — including a standout Cambodian fried chicken sandwich. By day a bakery with sweet and savory pastries, by night a full dinner menu.",
    dishes: ['Cambodian Fried Chicken Sandwich', 'Amok', 'Lort Cha'],
    address: '4356 W Armitage Ave, Unit B, Chicago, IL 60639',
    lat: 41.9169,
    lng: -87.7349,
    instagram: 'hermosachicago',
    website: 'https://www.hermosarestaurant.com/',
    reservation: 'walk-in',
    phone: '(312) 588-6283',
  }),
  makeEntry({
    id: 12534,
    name: 'Asador Bastian',
    cuisine: 'Basque Steakhouse',
    neighborhood: 'River North',
    score: 87,
    price: 4,
    tags: ['Basque', 'Steakhouse', 'Live Fire', 'Date Night', 'Fine Dining'],
    description: "Basque-influenced chophouse from acclaimed Chef Doug Psaltis and pastry chef Hsing Chen, set inside River North's 1883 'Flair House.' Premium steaks cooked over live fire, seafood-leaning menu, and desserts that break from steakhouse tradition.",
    dishes: ['Txuleta Ribeye', 'Txogitxu Steak', 'Grilled Turbot'],
    address: '7 W Grand Ave, Chicago, IL 60654',
    lat: 41.8915,
    lng: -87.6288,
    instagram: 'asadorbastian',
    website: 'https://www.asadorbastian.com/',
    reservation: 'OpenTable',
    res_tier: 4,
  }),
  makeEntry({
    id: 12535,
    name: 'Del Sur Bakery',
    cuisine: 'Filipino Bakery',
    neighborhood: 'Lincoln Square',
    score: 84,
    price: 2,
    tags: ['Bakery', 'Filipino', 'Cafe', 'Pastries'],
    description: "Filipino-inspired bakery from Chef Marjorie Lerias. Pastries weave in Filipino flavors — pandan, longanisa, calamansi — alongside French technique. Started as a pop-up that sold out every weekend before the Lincoln Square storefront opened.",
    dishes: ['Pandan Croissant', 'Longanisa Kolache', 'Ube Danish'],
    address: '4639 N Damen Ave, Chicago, IL 60625',
    lat: 41.9662,
    lng: -87.6792,
    instagram: 'delsurbakery',
    website: 'https://www.delsurchicago.com/',
    reservation: 'walk-in',
  }),
];

const s = html.indexOf('const CHICAGO_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const block = html.slice(a, e);
const after = html.slice(e);

const arr = JSON.parse(block);
const startCount = arr.length;

newEntries.forEach(ne => {
  if (arr.some(r => r.id === ne.id)) { console.error('ID COLLISION: ' + ne.id); process.exit(1); }
  const dup = arr.find(r => r.name.toLowerCase() === ne.name.toLowerCase());
  if (dup) { console.error('NAME DUP: ' + ne.name + ' (id=' + dup.id + ')'); process.exit(1); }
});

arr.push(...newEntries);
console.log('Added ' + newEntries.length + ' entries:');
newEntries.forEach(e => console.log('  [' + e.score + '] id=' + e.id + ' ' + e.name + ' — ' + e.neighborhood));
console.log('Chicago count: ' + startCount + ' → ' + arr.length);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

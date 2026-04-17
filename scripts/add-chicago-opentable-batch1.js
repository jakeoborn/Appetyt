#!/usr/bin/env node
// Add 4 notable Chicago restaurants from OpenTable metro listing that were missing.
// Verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function makeEntry(e) {
  return {
    name: e.name,
    cuisine: e.cuisine,
    neighborhood: e.neighborhood,
    score: e.score,
    price: e.price,
    tags: e.tags || [],
    description: e.description,
    dishes: e.dishes || [],
    address: e.address,
    hours: e.hours || '',
    lat: e.lat,
    lng: e.lng,
    instagram: e.instagram || '',
    website: e.website || '',
    reservation: e.reservation || '',
    phone: e.phone || '',
    id: e.id,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: e.trending === true,
    group: e.group || '',
    suburb: false,
    menuUrl: '',
    res_tier: e.res_tier || 0,
    indicators: e.indicators || [],
    awards: e.awards || '',
    reserveUrl: '',
    hh: '',
    verified: true,
    locations: e.locations,
  };
}

const newEntries = [
  makeEntry({
    id: 12526,
    name: 'Itoko',
    cuisine: 'Japanese / Robata',
    neighborhood: 'Lakeview',
    score: 86,
    price: 3,
    tags: ['Japanese', 'Robata', 'Sushi', 'Date Night', 'Neighborhood'],
    description: "Neighborhood Japanese and robata restaurant on Lakeview's Southport Corridor from Gene Kato, executive chef of Momotaro. Nigiri sets, skewers from the robata grill, and a more approachable counterpart to Momotaro's fine dining.",
    dishes: ['Nigiri Set', 'Robata Skewers', 'Sashimi'],
    address: '3325 N Southport Ave, Chicago, IL 60657',
    lat: 41.9418,
    lng: -87.6638,
    instagram: 'itokochicago',
    website: 'https://www.itokochicago.com/',
    reservation: 'OpenTable',
    res_tier: 3,
    phone: '(773) 819-7672',
  }),
  makeEntry({
    id: 12527,
    name: 'The Oakville Grill & Cellar',
    cuisine: 'American / Wine',
    neighborhood: 'Fulton Market',
    score: 84,
    price: 4,
    tags: ['American', 'Wine Bar', 'Steakhouse', 'Date Night', 'Patio'],
    description: "Napa-inspired wine destination and grill in Fulton Market. Prime steak frites, seasonal plates, and a deep cellar with a Napa-leaning list. Terrace dining in warmer months.",
    dishes: ['Steak Frites', 'Wood-Fired Grill', 'Wine Pairing'],
    address: '324 N Jefferson St, Chicago, IL 60661',
    lat: 41.8880,
    lng: -87.6424,
    instagram: 'theoakvillechicago',
    website: 'https://www.theoakville.com/',
    reservation: 'OpenTable',
    res_tier: 3,
  }),
  makeEntry({
    id: 12528,
    name: 'El Che Steakhouse & Bar',
    cuisine: 'Argentine Steakhouse',
    neighborhood: 'West Loop',
    score: 86,
    price: 4,
    tags: ['Argentine', 'Steakhouse', 'Live Fire', 'Date Night', 'Cocktails'],
    description: "Argentine steakhouse based on traditional asados (backyard barbecues) from grillmaster John Manion. Live-fire cooking over a custom hearth, house-made empanadas, and a deep South American wine list just off West Loop's restaurant row.",
    dishes: ['Ojo de Bife (Ribeye)', 'Empanadas', 'Grilled Provoleta'],
    address: '845 W Washington Blvd, Chicago, IL 60607',
    lat: 41.8831,
    lng: -87.6497,
    instagram: 'elchechicago',
    website: 'https://www.elchechicago.com/',
    reservation: 'OpenTable',
    res_tier: 3,
    phone: '(872) 320-4912',
  }),
  makeEntry({
    id: 12529,
    name: 'Sushi-San',
    cuisine: 'Japanese / Sushi',
    neighborhood: 'River North',
    score: 86,
    price: 3,
    tags: ['Japanese', 'Sushi', 'Late Night', 'Hand Rolls', 'Cocktails'],
    description: "Lettuce Entertain You's hip-hop-infused sushi concept. Hand rolls, nigiri, and bento across three Chicago locations. Golden-era hip-hop plays while the chefs cut toro behind a counter that's open late.",
    dishes: ['Hand Roll Set', 'Megatron Sushi Set', 'Nigiri Omakase'],
    address: '63 W Grand Ave, Chicago, IL 60654',
    lat: 41.8915,
    lng: -87.6295,
    instagram: 'sushisanrestaurant',
    website: 'https://www.sushisanrestaurant.com/',
    reservation: 'Tock',
    res_tier: 3,
    phone: '(312) 828-0575',
    group: 'Lettuce Entertain You',
    locations: [
      { neighborhood: 'River North', address: '63 W Grand Ave, Chicago, IL 60654', phone: '(312) 828-0575' },
      { neighborhood: 'Lincoln Park', address: '1950 N Halsted St, Chicago, IL 60614', phone: '(773) 389-7101' },
    ],
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
  if (dup) { console.error('NAME DUP: ' + ne.name + ' (existing id=' + dup.id + ')'); process.exit(1); }
});

arr.push(...newEntries);
console.log('Added ' + newEntries.length + ' entries:');
newEntries.forEach(e => console.log('  [' + e.score + '] id=' + e.id + ' ' + e.name + ' — ' + e.neighborhood));
console.log('Chicago count: ' + startCount + ' → ' + arr.length);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

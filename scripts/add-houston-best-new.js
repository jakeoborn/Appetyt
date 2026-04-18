#!/usr/bin/env node
// Add 6 current Houston spots from Eater's Best New Restaurants (April 2026)
// to compensate for closure removals this session. All addresses + status
// verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

function readBlock(html, constName) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e, arr: JSON.parse(html.slice(a, e)) };
}

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function entry(o) {
  return {
    id: o.id,
    name: o.name,
    phone: o.phone || '',
    cuisine: o.cuisine,
    neighborhood: o.neighborhood,
    score: o.score,
    price: o.price || 3,
    tags: o.tags,
    indicators: o.indicators || ['new'],
    hh: '',
    reservation: o.reservation || '',
    awards: o.awards || '',
    description: o.description,
    dishes: o.dishes || [],
    address: o.address,
    hours: '',
    lat: o.lat,
    lng: o.lng,
    bestOf: [],
    group: o.group || '',
    instagram: o.instagram || '',
    website: o.website || '',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: o.res_tier || 2,
    verified: true,
    photoUrl: '',
  };
}

const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
const startLen = arr.length;
const maxId = Math.max(...arr.map(r => r.id || 0));

const additions = [
  entry({
    id: maxId + 1,
    name: 'Alturas Mexican Cafe',
    cuisine: 'Mexican',
    neighborhood: 'Heights',
    score: 87,
    price: 2,
    tags: ['Mexican', 'Casual', 'New Opening', 'Local Favorites'],
    description: 'Family-owned Mexican cafe that opened 2026 in the Heights, focused on traditional dishes, house-made masa, and regional specialties. A quiet but fast-rising favorite on Airline Drive, already featured on Eater\u2019s Best New Restaurants list.',
    address: '2409 Airline Dr, Houston, TX 77009',
    lat: 29.7954,
    lng: -95.3746,
    reservation: 'walk-in',
  }),
  entry({
    id: maxId + 2,
    name: 'The Green Room',
    cuisine: 'New American / Tasting Menu',
    neighborhood: 'Heights',
    score: 90,
    price: 4,
    tags: ['New American', 'Tasting Menu', 'Date Night', 'New Opening', 'Awards'],
    awards: 'James Beard Award (chef Tom Cunanan)',
    description: 'James Beard-winning chef Tom Cunanan\u2019s 26-seat chef-driven restaurant tucked inside Heights & Co. Intimate tasting-menu destination that opened March 2026 and has quickly become one of Houston\u2019s most-talked-about new rooms.',
    address: '1343 Yale St, Houston, TX 77008',
    lat: 29.7931,
    lng: -95.3988,
    reservation: 'Resy',
    instagram: '@thegreenroom_houston',
  }),
  entry({
    id: maxId + 3,
    name: 'Star Rover',
    cuisine: 'Asian / Fusion',
    neighborhood: 'Heights',
    score: 88,
    price: 3,
    tags: ['Asian', 'New American', 'Date Night', 'New Opening'],
    description: 'New concept from Rocket Farm Restaurants (Ford Fry\u2019s group) in the former Superica space on North Shepherd. Opened February 26, 2026 with a retro interior and Asian-fusion menu. From the team behind State of Grace and La Lucha.',
    address: '1801 N Shepherd Dr, Houston, TX 77008',
    lat: 29.7926,
    lng: -95.4103,
    reservation: 'Resy',
    group: 'Rocket Farm Restaurants',
  }),
  entry({
    id: maxId + 4,
    name: 'Murray\u2019s Pizza & Wine',
    cuisine: 'Pizza / Italian',
    neighborhood: 'Memorial',
    score: 86,
    price: 2,
    tags: ['Pizza', 'Italian', 'Wine Bar', 'Date Night', 'New Opening'],
    description: 'Artisan pizza and aperitivo-style wine bar from the team behind Leaf & Grain. Opened October 2025 in Memorial with a tiki-leaning cocktail program alongside Italian classics.',
    address: '9655 Katy Fwy Suite 3110, Houston, TX 77024',
    lat: 29.7835,
    lng: -95.5340,
    phone: '(281) 307-1093',
    reservation: 'walk-in',
  }),
  entry({
    id: maxId + 5,
    name: 'Ch\u00e2teau Bellecru',
    cuisine: 'French / Wine Bar',
    neighborhood: 'Heights',
    score: 87,
    price: 3,
    tags: ['French', 'Wine Bar', 'Date Night', 'New Opening'],
    description: 'Parisian-inspired candlelit wine lounge that opened September 2025 at 1515 Studemont. Curated French wine list, seasonal pastries, and a refined intimate setting on the edge of the Heights.',
    address: '1515 Studemont St Suite 103, Houston, TX 77007',
    lat: 29.7732,
    lng: -95.3930,
    phone: '(832) 982-2079',
    reservation: 'OpenTable',
    website: 'https://www.chateau-bellecru.com',
  }),
  entry({
    id: maxId + 6,
    name: 'Hypsi',
    cuisine: 'Italian',
    neighborhood: 'Heights',
    score: 88,
    price: 3,
    tags: ['Italian', 'Date Night', 'New Opening', 'Hotel Restaurant'],
    description: 'Italian restaurant and lounge inside Hotel Daphne led by two-time James Beard nominee chef Terrence Gallivan. Opened 2026 as the Heights\u2019 newest destination hotel dining room.',
    address: '347 W 20th St, Houston, TX 77008',
    lat: 29.8045,
    lng: -95.4057,
    phone: '(346) 613-1265',
    reservation: 'OpenTable',
    website: 'https://www.hypsirestaurant.com',
  }),
];

arr.push(...additions);
console.log('HOUSTON additions: ' + additions.length);
additions.forEach(r => console.log('  [' + r.score + '] id=' + r.id + ' ' + r.name + ' (' + r.neighborhood + ')'));
console.log('Count: ' + startLen + ' -> ' + arr.length);

html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

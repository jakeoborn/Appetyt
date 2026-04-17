#!/usr/bin/env node
// Add 5 iconic restaurants referenced in best-of lists but missing from data.
// Verified via firecrawl 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function bounds(name) {
  const s = html.indexOf('const ' + name);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e };
}

function addEntry(constName, e) {
  const b = bounds(constName);
  const slice = html.slice(b.a, b.e);
  const arr = JSON.parse(slice);
  if (arr.some(r => r.id === e.id)) throw new Error('id collision ' + e.id);
  if (arr.some(r => r.name === e.name)) throw new Error('name dup ' + e.name);
  const entry = {
    name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood, score: e.score,
    price: e.price, tags: e.tags || [], description: e.description, dishes: e.dishes || [],
    address: e.address, hours: e.hours || '', lat: e.lat, lng: e.lng,
    instagram: e.instagram || '', website: e.website || '', reservation: e.reservation || '',
    phone: e.phone || '', id: e.id,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: e.group || '', suburb: !!e.suburb, menuUrl: '',
    res_tier: e.res_tier || 0,
    indicators: e.indicators || [],
    awards: e.awards || '', reserveUrl: '', hh: '', verified: true,
  };
  arr.push(entry);
  html = html.slice(0, b.a) + JSON.stringify(arr) + html.slice(b.e);
  console.log('  + ' + e.name + ' (id=' + e.id + ') → ' + constName);
}

console.log('--- Chicago: 2 additions ---');
addEntry('CHICAGO_DATA', {
  id: 12538, name: 'Ever', cuisine: 'New American / Tasting Menu',
  neighborhood: 'Fulton Market', score: 95, price: 4,
  tags: ['Fine Dining', 'Tasting Menu', 'Date Night', 'Exclusive', 'Critics Pick', 'Michelin'],
  description: "Curtis Duffy's two-Michelin-star fine dining destination. Artfully plated, precisely choreographed New American tasting menus served on sleek black tables under museum-quality lighting. Adjacent cocktail lounge After extends the evening.",
  dishes: ['Tasting Menu', 'Signature Courses', 'Wine Pairing'],
  address: '1340 W Fulton St, Chicago, IL 60607', lat: 41.8867, lng: -87.6589,
  instagram: 'ever_restaurant', website: 'https://www.ever-restaurant.com',
  reservation: 'Tock', res_tier: 5, awards: 'MICHELIN 2 Stars',
});
addEntry('CHICAGO_DATA', {
  id: 12539, name: "Gino's East", cuisine: 'Deep Dish Pizza',
  neighborhood: 'Streeterville', score: 85, price: 2,
  tags: ['Pizza', 'Deep Dish', 'Iconic', 'Family-Friendly', 'Lunch'],
  description: "Chicago deep-dish institution since 1966. The Magnificent Mile flagship at 162 E Superior anchors a multi-location chain, home to the signature cornmeal-crust deep dish and a third-floor Comedy Bar. Walls are famously covered in decades of guest graffiti.",
  dishes: ['Deep Dish Pizza', 'Stuffed Pizza', 'Italian Sausage'],
  address: '162 E Superior St, Chicago, IL 60611', lat: 41.8958, lng: -87.6237,
  instagram: 'ginoseastpizza', website: 'https://www.ginoseast.com',
  reservation: 'walk-in', res_tier: 1,
});

console.log('\n--- Houston: 1 addition ---');
addEntry('HOUSTON_DATA', {
  id: 7561, name: "Killen's Steakhouse", cuisine: 'Steakhouse',
  neighborhood: 'Pearland (Suburban)', score: 93, price: 4,
  tags: ['Steakhouse', 'Fine Dining', 'Date Night', 'Wagyu', 'Texas'],
  description: "Chef Ronnie Killen's flagship steakhouse in his Pearland hometown, serving the highest quality USDA Prime and A5 Wagyu steaks. The original of the Killen's empire that also includes Killen's BBQ. Top-tier service and classic steakhouse sides.",
  dishes: ['A5 Wagyu', 'USDA Prime Ribeye', 'Jumbo Lump Crab Cake'],
  address: '2804 S Main St, Pearland, TX 77581', lat: 29.5613, lng: -95.2866,
  instagram: 'killenssteakhouse', website: 'https://www.killenssteakhouse.com',
  reservation: 'OpenTable', res_tier: 4, group: 'Killen\'s', suburb: true,
});

console.log('\n--- Austin: 1 addition ---');
addEntry('AUSTIN_DATA', {
  id: 5578, name: "C-Boy's Heart and Soul", cuisine: 'Live Music / Bar',
  neighborhood: 'South Congress', score: 82, price: 2,
  tags: ['Live Music', 'Bar', 'Cocktails', 'Late Night', 'Iconic'],
  description: "South Congress soul and blues venue where Austin's musicians hang out. Seven nights of live music, a killer back patio, and a basement tiki bar (The Jade Room). Named after Austin legend C-Boy Parks. A different kind of Best Date Night — come for the music, stay for the dancing.",
  dishes: ['Cocktails', 'Live Music Cover', 'The Jade Room'],
  address: '2008 S Congress Ave, Austin, TX 78704', lat: 30.2491, lng: -97.7535,
  instagram: 'cboysatx', website: 'https://www.cboys.com',
  reservation: 'walk-in', res_tier: 0, phone: '(512) 215-0023',
});

console.log('\n--- Las Vegas: 1 addition ---');
addEntry('LV_DATA', {
  id: 12524, name: 'Dough Zone Dumpling House', cuisine: 'Chinese / Dumplings',
  neighborhood: 'Chinatown', score: 85, price: 2,
  tags: ['Chinese', 'Dumplings', 'Xiao Long Bao', 'Casual', 'Lunch'],
  description: "Pacific Northwest-born dumpling chain (since 2014) that made its Vegas debut in Chinatown. Xiao long bao, Q-bao pan-fried buns, handmade noodles, and wontons in a modern counter-service setting. Hugely popular — expect a wait on weekends.",
  dishes: ['Xiao Long Bao', 'Q-Bao', 'Wontons in Chili Oil'],
  address: '5300 Spring Mountain Rd, Las Vegas, NV 89146', lat: 36.1262, lng: -115.2035,
  instagram: 'doughzonedh', website: 'https://www.doughzonedumplinghouse.com',
  reservation: 'walk-in', res_tier: 1,
});

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

#!/usr/bin/env node
// Add 5 OpenTable Icons missing from data, and tag one existing entry
// that the OT list referenced by shorter name. Verified via firecrawl 2026-04-17.
//
// Tag only: Gordon Ramsay Hell's Kitchen (Vegas id 12008)
// Add: Tre Dita (Chicago), Elina's (Chicago), ChopnBlok (Houston),
//      Kiran's (Houston), Ishtia (Houston)
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
    trending: e.trending === true, group: e.group || '', suburb: false, menuUrl: '',
    res_tier: e.res_tier || 0,
    indicators: (e.indicators || []).concat(['opentable-icon']),
    awards: e.awards || '', reserveUrl: '', hh: '', verified: true,
  };
  arr.push(entry);
  html = html.slice(0, b.a) + JSON.stringify(arr) + html.slice(b.e);
  console.log('  + ' + e.name + ' (id=' + e.id + ') → ' + constName);
}

// Surgical tag for existing entry
function tagExisting(constName, id) {
  const b = bounds(constName);
  // Locate "id":NUM or id:NUM within bounds, walk to enclosing object, find indicators
  let idMarker = '"id":' + id;
  let idx = html.indexOf(idMarker, b.a);
  if (idx < 0 || idx >= b.e) { idMarker = 'id:' + id; idx = html.indexOf(idMarker, b.a); }
  if (idx < 0 || idx >= b.e) { console.error('  MISS ' + constName + ' id=' + id); return; }
  const open = html.lastIndexOf('{', idx);
  let d = 0, close = -1;
  for (let i = open; i < b.e; i++) {
    if (html[i] === '{') d++;
    if (html[i] === '}') { d--; if (d === 0) { close = i; break; } }
  }
  const entry = html.slice(open, close + 1);
  const m = entry.match(/(["']?indicators["']?\s*:\s*)\[([^\]]*)\]/);
  if (!m) { console.error('  NO indicators field id=' + id); return; }
  const current = (m[2].match(/"([^"]+)"|'([^']+)'/g) || []).map(x => x.replace(/^['"]|['"]$/g, ''));
  if (current.includes('opentable-icon')) { console.log('  = already tagged id=' + id); return; }
  const fieldAbsStart = open + m.index;
  const arrEnd = fieldAbsStart + m[0].length - 1;
  const sep = m[2].trim() === '' ? '' : ',';
  const insertion = sep + '"opentable-icon"';
  html = html.slice(0, arrEnd) + insertion + html.slice(arrEnd);
  console.log('  + tagged existing id=' + id);
}

console.log('--- Vegas: tag existing ---');
tagExisting('LV_DATA', 12008);

console.log('\n--- Chicago: 2 additions ---');
addEntry('CHICAGO_DATA', {
  id: 12536, name: 'Tre Dita', cuisine: 'Italian Steakhouse', neighborhood: 'River North',
  score: 86, price: 4,
  tags: ['Italian', 'Steakhouse', 'Fine Dining', 'Date Night', 'Hotel Restaurant'],
  description: "Evan Funke and Lettuce Entertain You's swanky Tuscan steakhouse inside The St. Regis Chicago. Silky handmade pastas and premium steaks, a 700+ bottle all-Italian wine list, and dramatic 40-foot windows with Lake Michigan and Chicago River views.",
  dishes: ['Bistecca alla Fiorentina', 'Handmade Pasta', 'Italian Wine Pairing'],
  address: '626 N State St, Chicago, IL 60654', lat: 41.8931, lng: -87.6280,
  instagram: 'tredita_chicago', website: 'https://www.treditachicago.com',
  reservation: 'OpenTable', res_tier: 3, group: 'Lettuce Entertain You',
});
addEntry('CHICAGO_DATA', {
  id: 12537, name: "Elina's", cuisine: 'Italian', neighborhood: 'West Town',
  score: 85, price: 3,
  tags: ['Italian', 'Date Night', 'Pasta', 'Neighborhood'],
  description: "Intimate West Town Italian from vets of NYC MICHELIN-starred Restaurant Marc Forgione. Old-school red-sauce favorites — rigatoni alla vodka, Dover sole piccata, eggplant parm — served in a cozy, brick-walled dining room or on an Amalfi Coast-inspired patio.",
  dishes: ['Rigatoni alla Vodka', 'Dover Sole Piccata', 'Eggplant Parmigiana'],
  address: '1202 W Grand Ave, Chicago, IL 60642', lat: 41.8912, lng: -87.6563,
  instagram: 'elinaschicago', website: 'https://elinaschicago.com',
  reservation: 'OpenTable', res_tier: 3,
});

console.log('\n--- Houston: 3 additions ---');
addEntry('HOUSTON_DATA', {
  id: 7558, name: 'ChopnBlok', cuisine: 'West African',
  neighborhood: 'Montrose', score: 87, price: 3,
  tags: ['African', 'West African', 'Date Night', 'Critics Pick', 'New'],
  description: "James Beard semifinalist Ope Amosu's full-on celebration of the West African diaspora. Jollof jambalaya, suya with yaji peanut-pepper spice, deviled Scotch egg. Playful cocktails and a vibrant space decked with African textiles, books, and records. MICHELIN Bib Gourmand.",
  dishes: ['Jollof Jambalaya', 'Suya', 'Plantain Old Fashioned'],
  address: '507 Westheimer Rd, Houston, TX 77006', lat: 29.7425, lng: -95.3860,
  instagram: 'chopnblok_', reservation: 'OpenTable', res_tier: 3,
  awards: 'MICHELIN Bib Gourmand 2025',
});
addEntry('HOUSTON_DATA', {
  id: 7559, name: "Kiran's", cuisine: 'Indian',
  neighborhood: 'Upper Kirby', score: 86, price: 4,
  tags: ['Indian', 'Fine Dining', 'Date Night', 'Afternoon Tea'],
  description: "At her namesake restaurant, James Beard semifinalist Kiran Verma pairs traditional Indian flavors and techniques with local ingredients — tandoori Texas quail with fig chutney, goat cheese and beet salad with masala cashews. Weekend afternoon tea service features the restaurant's signature chai blend.",
  dishes: ['Tandoori Texas Quail', 'Masala Dosa', 'Afternoon Tea'],
  address: '2925 Richmond Ave, Houston, TX 77098', lat: 29.7377, lng: -95.4182,
  instagram: 'kiransrestaurant', website: 'https://kiranshouston.com',
  reservation: 'OpenTable', res_tier: 3, phone: '(713) 960-8472',
});
addEntry('HOUSTON_DATA', {
  id: 7560, name: 'Ishtia by eculent', cuisine: 'Indigenous American / Tasting Menu',
  neighborhood: 'Kemah', score: 86, price: 4,
  tags: ['Tasting Menu', 'Live Fire', 'Fine Dining', 'Exclusive', 'Date Night', 'Celebrity Chef'],
  description: "Chef David Skinner's 18-seat tasting-menu restaurant centered on Indigenous American cuisines and Skinner's own Choctaw heritage. Multi-course menus cooked over live fire, including tanchi labona (Choctaw nixtamalized-corn soup with pork). James Beard semifinalist Best Chef: Texas 2024.",
  dishes: ['Tanchi Labona', 'Live-Fire Tasting Menu', "Chef's Selection"],
  address: '718 Bradford Ave, Kemah, TX 77565', lat: 29.5436, lng: -95.0213,
  instagram: 'ishtia_eculent', website: 'https://www.ishtia.com',
  reservation: 'Tock', res_tier: 4,
});

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

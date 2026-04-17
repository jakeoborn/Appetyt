#!/usr/bin/env node
// Add 8 NYC OpenTable Icons missing from data. Verified via firecrawl 2026-04-17.
// NYC_DATA is a JS object literal (unquoted keys), so we parse via Function
// and re-serialize via JSON.stringify. JS engines accept both forms so this
// changes the format of the block but not its semantics — other scripts that
// read NYC_DATA use Function-eval fallback already.
//
// Skipped: Demo (results unclear — could be multiple venues; avoid guessing).
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const NYC_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = (new Function('return ' + html.slice(a, e)))();

function makeEntry(e) {
  return {
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
}

const newEntries = [
  makeEntry({
    id: 1924, name: 'San Sabino', cuisine: 'Italian-American Seafood',
    neighborhood: 'West Village', score: 88, price: 4,
    tags: ['Italian', 'Seafood', 'Date Night', 'Critics Pick', 'New'],
    description: "West Village Italian-American seafood restaurant from the Don Angie team (Angie Rito and Scott Tacinelli). Warm-brass dining room, caviar service, and sardine-grandma sandwiches that took over food-media feeds shortly after opening.",
    dishes: ['Sardine Sandwich', 'Caviar Service', 'Whole Fish'],
    address: '113 Greenwich Ave, New York, NY 10014', lat: 40.7369, lng: -74.0034,
    instagram: 'sansabinonyc', website: 'https://www.sansabinonyc.com',
    reservation: 'Resy', res_tier: 4, phone: '(212) 970-8808',
  }),
  makeEntry({
    id: 1925, name: 'Gjelina', cuisine: 'California / New American',
    neighborhood: 'NoHo', score: 87, price: 3,
    tags: ['California', 'Vegetable-Forward', 'Date Night', 'Pizza', 'Natural Wine'],
    description: "NYC outpost of the iconic Venice, LA original. Wood-fired pizzas, vegetable-forward plates, and an all-day menu that set the template for California-NYC cross-pollination. NoHo setting with industrial-chic warmth.",
    dishes: ['Butterscotch Pot de Crème', 'Wood-Fired Pizza', 'Roasted Root Vegetables'],
    address: '45 Bond St, New York, NY 10012', lat: 40.7262, lng: -73.9927,
    instagram: 'gjelinany', website: 'https://gjelina.com/home/',
    reservation: 'Resy', res_tier: 4, phone: '(646) 475-2506',
  }),
  makeEntry({
    id: 1926, name: 'The Musket Room', cuisine: 'New American / New Zealand-Inspired',
    neighborhood: 'Nolita', score: 88, price: 4,
    tags: ['New American', 'Fine Dining', 'Tasting Menu', 'Date Night', 'Garden'],
    description: "Kiwi-owned Nolita restaurant with New Zealand-inspired New American cooking and a beloved garden patio. Multi-course tasting menu showcases venison, fish, and stonefruit in season. Earned a MICHELIN Star before its 2023 reinvention and remains a NYC destination.",
    dishes: ['Venison Tasting', 'Pavlova', 'Seasonal Fish'],
    address: '265 Elizabeth St, New York, NY 10012', lat: 40.7228, lng: -73.9946,
    instagram: 'musketroom', website: 'https://www.musketroom.com',
    reservation: 'Resy', res_tier: 4,
  }),
  makeEntry({
    id: 1927, name: 'Momofuku Noodle Bar', cuisine: 'Asian / Ramen',
    neighborhood: 'East Village', score: 89, price: 3,
    tags: ['Asian', 'Ramen', 'Late Night', 'Celebrity Chef', 'Iconic'],
    description: "David Chang's original 2004 restaurant — the one that effectively launched the modern New York ramen scene. Still serving constantly-changing seasonal menus alongside signature pork buns and the namesake Momofuku ramen bowl. East Village flagship of the global Momofuku group.",
    dishes: ['Pork Buns', 'Momofuku Ramen', 'Lobster Noodles'],
    address: '171 1st Ave, New York, NY 10003', lat: 40.7297, lng: -73.9857,
    instagram: 'momofuku', website: 'https://www.momofuku.com/restaurants/noodle-bar-east-village',
    reservation: 'Resy', res_tier: 3, group: 'Momofuku',
  }),
  makeEntry({
    id: 1928, name: 'Strange Delight', cuisine: 'New American',
    neighborhood: 'Fort Greene', score: 88, price: 3,
    tags: ['New American', 'Date Night', 'Critics Pick', 'Cocktails', 'New'],
    description: "Fort Greene Brooklyn favorite named one of Infatuation's and Resy's ten best new NYC restaurants of 2024. Seasonal New American cooking in a tight, thoughtful space, with a killer cocktail list and a morning cafe spinoff (Amanda's Good Morning Cafe).",
    dishes: ['Chef\'s Seasonal Menu', 'Cocktails', 'Fresh Pasta'],
    address: '63 Lafayette Ave, Brooklyn, NY 11217', lat: 40.6876, lng: -73.9754,
    instagram: 'strangedelight.nyc', reservation: 'Resy', res_tier: 3,
  }),
  makeEntry({
    id: 1929, name: 'Cafe Mars', cuisine: 'Italian',
    neighborhood: 'Park Slope', score: 86, price: 3,
    tags: ['Italian', 'Date Night', 'Neighborhood', 'Critics Pick', 'Natural Wine'],
    description: 'An "unusual" Italian restaurant from the family behind Leroy\'s Place. Core to Cafe Mars is investigating and expanding what it means to be an Italian restaurant — rotating pastas, unexpected flavor pairings, and a wine list skewed toward Italian biodynamic producers. Park Slope locals\' pick.',
    dishes: ['Rotating Pasta', 'Seasonal Antipasti', 'Natural Wine Pairing'],
    address: '272 3rd Ave, Brooklyn, NY 11215', lat: 40.6742, lng: -73.9837,
    instagram: 'cafemarsbk', website: 'https://cafemarsbk.com',
    reservation: 'Resy', res_tier: 3, phone: '(347) 987-4225',
  }),
  makeEntry({
    id: 1930, name: 'Caviar Russe', cuisine: 'Caviar / Seafood',
    neighborhood: 'Midtown East', score: 90, price: 4,
    tags: ['Seafood', 'Caviar', 'Fine Dining', 'Date Night', 'Critics Pick'],
    description: "MICHELIN-starred caviar specialist seven years running. A tasting-menu Dining Room upstairs and a more relaxed Bar & Lounge downstairs, both anchored by same-day delivery-fresh caviar. 538 Madison Avenue flagship with a Miami sister.",
    dishes: ['Caviar Tasting', 'Raw Bar', 'Tasting Menu'],
    address: '538 Madison Ave, New York, NY 10022', lat: 40.7596, lng: -73.9733,
    instagram: 'caviarrusse', website: 'https://caviarrusse.com',
    reservation: 'OpenTable', res_tier: 4, awards: 'MICHELIN 1 Star',
  }),
  makeEntry({
    id: 1931, name: 'Le Jardinier', cuisine: 'French',
    neighborhood: 'Midtown East', score: 90, price: 4,
    tags: ['French', 'Fine Dining', 'Vegetable-Forward', 'Date Night', 'Critics Pick'],
    description: "MICHELIN-starred French restaurant from chef Alain Verzeroli (ex-Joël Robuchon). Vegetable-forward cooking refracted through classical French technique, served in a verdant, garden-like Midtown dining room. Upstairs sibling Sereine extends the program for special menus.",
    dishes: ['Garden Tasting', 'Scallop Carpaccio', 'Vegetable Main'],
    address: '610 Lexington Ave, New York, NY 10022', lat: 40.7595, lng: -73.9711,
    instagram: 'lejardiniernyc', website: 'https://www.lejardiniernyc.com',
    reservation: 'Tock', res_tier: 4, awards: 'MICHELIN 1 Star',
  }),
];

newEntries.forEach(ne => {
  if (arr.some(r => r.id === ne.id)) throw new Error('id collision: ' + ne.id);
  if (arr.some(r => r.name === ne.name)) throw new Error('name dup: ' + ne.name);
});

arr.push(...newEntries);
html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);

console.log('Added ' + newEntries.length + ' NYC entries:');
newEntries.forEach(e => console.log('  + [' + e.score + '] id=' + e.id + ' ' + e.name + ' — ' + e.neighborhood));
console.log('\nindex.html written. NYC: 880 → ' + arr.length);

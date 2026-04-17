#!/usr/bin/env node
// Add 4 new Chicago entries that replaced removed closures.
// Verified via firecrawl_search 2026-04-17.
// - Cariño (replaces Brass Heart 2023, Michelin-starred Latin-American)
// - Dēliz (replaces Etta 2025, Italian steakhouse)
// - Oliver's (replaces Acadia 2021, 1930s Hollywood-inspired American)
// - Common Decency (replaces Lost Lake 2022, 80s Miami Vice bar)

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Template fields that must be present for every entry (matches existing schema)
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
  };
}

const newEntries = [
  makeEntry({
    id: 12522,
    name: 'Cariño',
    cuisine: 'Latin American / Tasting Menu',
    neighborhood: 'Uptown',
    score: 89,
    price: 4,
    tags: ['Latin American', 'Fine Dining', 'Tasting Menu', 'Date Night', 'Critics Pick', 'Michelin'],
    description: 'Michelin-starred Latin-inspired tasting menu from Chef Norman Fenton in the former Brass Heart space. Menu draws on places, traditions, and families across Latin America. Offers both the primary tasting menu and a late-night taco omakase Wednesday through Sunday.',
    dishes: ['Tasting Menu', 'Taco Omakase', 'Aguachile'],
    address: '4662 N Broadway, Chicago, IL 60640',
    lat: 41.9657,
    lng: -87.6597,
    instagram: 'carino_chicago',
    website: 'https://www.carinochicago.com',
    reservation: 'Tock',
    phone: '(312) 722-6838',
    res_tier: 4,
    awards: 'Michelin Star',
  }),
  makeEntry({
    id: 12523,
    name: 'Dēliz',
    cuisine: 'Italian Steakhouse',
    neighborhood: 'Bucktown',
    score: 82,
    price: 4,
    tags: ['Italian', 'Steakhouse', 'Date Night', 'New'],
    description: 'Italian steakhouse social dining concept in the former Etta space. Elevated Italian steakhouse menu with cocktails and weekend brunch. Open Sunday through Thursday for dinner, with weekend brunch service.',
    dishes: ['Dry-Aged Steak', 'Handmade Pasta', 'Deliz Vida Cocktail'],
    address: '1840 W North Ave, Chicago, IL 60622',
    lat: 41.9100,
    lng: -87.6740,
    instagram: 'delizitalian',
    website: 'https://www.delizitalian.com',
    reservation: 'OpenTable',
    res_tier: 2,
    phone: '(773) 477-0000',
  }),
  makeEntry({
    id: 12524,
    name: "Oliver's",
    cuisine: 'American',
    neighborhood: 'South Loop',
    score: 81,
    price: 3,
    tags: ['American', 'Cocktails', 'Date Night', 'New'],
    description: "1930s Hollywood-inspired restaurant in the former Acadia space in the South Loop. Classic American flavors with retro cocktail charm and a focus on old-school hospitality. Walk-ins welcome alongside OpenTable reservations.",
    dishes: ['Steak', 'Martini', 'Classic Cocktails'],
    address: '1639 S Wabash Ave, Chicago, IL 60616',
    lat: 41.8597,
    lng: -87.6255,
    instagram: 'eatatolivers',
    website: 'https://www.eatatolivers.com',
    reservation: 'OpenTable',
    res_tier: 2,
  }),
  makeEntry({
    id: 12525,
    name: 'Common Decency',
    cuisine: 'Cocktail Bar',
    neighborhood: 'Logan Square',
    score: 83,
    price: 2,
    tags: ['Cocktails', 'Late Night', 'Music', 'New'],
    description: "Miami Vice-inspired cocktail bar with '80s aesthetics on the Logan Square/Avondale border, in the former Lost Lake space. Design pulls from Miami, the '80s, and touches of punk, with a DJ booth and disco ball. Owned by the Lost Lake/Fever Dream team.",
    dishes: ['Tropical Cocktails', 'Neon Sour', 'House Highball'],
    address: '3154 W Diversey Ave, Chicago, IL 60647',
    lat: 41.9321,
    lng: -87.7084,
    instagram: 'commondecency_chicago',
    reservation: 'walk-in',
    res_tier: 0,
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

// Dedup check — bail if any already exists
newEntries.forEach(ne => {
  if (arr.some(r => r.id === ne.id)) throw new Error('ID collision: ' + ne.id);
  if (arr.some(r => r.name === ne.name)) console.log('  DUP NAME WARN: ' + ne.name);
});

arr.push(...newEntries);
console.log('Added ' + newEntries.length + ' new Chicago entries:');
newEntries.forEach(e => console.log('  [' + e.score + '] id=' + e.id + ' ' + e.name + ' — ' + e.neighborhood));
console.log('Chicago count: ' + startCount + ' → ' + arr.length);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

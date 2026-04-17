#!/usr/bin/env node
// Add 2 real Houston restaurants referenced in the Best-Of lists but
// missing from HOUSTON_DATA. The other 5 originally-flagged entries
// were closed or fabricated; those were swapped for open restaurants
// already present in data via inline edits to the Houston Best-Of
// Vietnamese / Cocktail Bar lists (Cafe TH → Annam; Mi Tia Nga → The
// Blind Goat; Xin Chao → Sinh Sinh; The Pastry War → Eight Row Flint;
// Tongue-Cut Sparrow → Johnny's Gold Brick).
//
// Houston IG convention: @handle.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const HOUSTON_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));
const start = arr.length;
const maxId = Math.max(...arr.map(r => r.id));
let nextId = maxId + 1;

const adds = [
  {
    id: nextId++,
    name: 'Snooze, an A.M. Eatery',
    cuisine: 'Breakfast / Brunch',
    neighborhood: 'Montrose',
    score: 86,
    price: 2,
    tags: ['Brunch', 'Breakfast', 'Family', 'Casual'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Denver-born breakfast-and-brunch chain with a cult pancake flight, bottomless mimosas, and bright daylight design. Houston's Montrose location is the city flagship.",
    dishes: ['Pancake Flight', 'Benedict Duo', 'Sweet Potato Hash', 'Breakfast Burrito'],
    address: '3217 Montrose Blvd Ste 100, Houston, TX 77006',
    lat: 29.74, lng: -95.392,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: 'Snooze',
    instagram: '@snoozeeatery', website: 'https://www.snoozeeatery.com/restaurant/texas/montrose',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: "Les Ba'get",
    cuisine: 'Vietnamese / Banh Mi',
    neighborhood: 'Heights',
    score: 87,
    price: 2,
    tags: ['Vietnamese', 'Lunch', 'Casual', 'Local Favorites'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Oak Forest modern Vietnamese with a deep banh-mi roster, grilled-meat rice bowls, and a compact dining room that the food press has championed since opening.",
    dishes: ['Classic Banh Mi', 'Grilled Pork Rice Bowl', 'Crispy Egg Rolls', 'Pandan Waffle'],
    address: '1717 W 34th St Ste 800, Houston, TX 77018',
    lat: 29.811, lng: -95.424,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: '@lesbaget', website: 'https://les-baget.res-menu.net',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
];

const final = [...arr, ...adds];
console.log(`Added (${adds.length}):`, adds.map(a => `${a.id} ${a.name}`));
console.log(`HOUSTON count: ${start} → ${final.length}`);
html = before + JSON.stringify(final) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

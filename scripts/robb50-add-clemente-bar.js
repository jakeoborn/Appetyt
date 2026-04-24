#!/usr/bin/env node
// Add Clemente Bar (Robb Report NA Top 50 Bars #15) to NYC_DATA.
// Uses surgical append-after-last-card pattern (no re-serialization of existing cards).
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARD = {
  id: 1994,
  name: 'Clemente Bar',
  phone: '(212) 889-0905',
  cuisine: 'Cocktail Bar',
  neighborhood: 'Flatiron',
  score: 94,
  price: 4,
  tags: ['Cocktails', 'Exclusive', 'Critics Pick', 'Awards', 'Date Night', 'North America Top 50 Bar'],
  indicators: [],
  hh: '',
  reservation: 'Resy',
  awards: "North America's 50 Best Bars 2025 (#15)",
  description: "Daniel Humm's intimate cocktail lounge sits one flight above Eleven Madison Park, a collaboration with artist Francesco Clemente whose three large-scale murals anchor the walnut-paneled room. Beverage director Sebastian Tollius and bar manager Richard Millwater built the cocktail program around house-fermented miso, lending umami depth to drinks like Real Talk (pretzel miso, Kings County Coffee Whisky, amontillado) and Against the Grain (Glenfiddich 12, crème de banane, plantain-banana miso). The Lounge serves à la carte; the nine-seat chef's counter (The Studio) runs an omakase-style experience and hosts sushi master Eiji Ichimura for a multi-month residency in early 2026.",
  dishes: ['Real Talk cocktail', 'Against the Grain cocktail', 'Thrice-fried potatoes', 'Sake-marinated pickles', 'Carrot tartare with tonburi', 'Chocolate espresso sundae with milk punch'],
  address: '11 Madison Avenue, New York, NY 10010',
  hours: '',
  lat: 40.7415982,
  lng: -73.9871904,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: 'Make It Nice',
  instagram: '@theclementebar',
  website: 'https://www.clementebar.com',
  suburb: false,
  reserveUrl: 'https://resy.com/cities/new-york-ny/venues/clemente-bar',
  menuUrl: '',
  res_tier: 5,
  photos: [],
  photoUrl: 'https://www.surfacemag.com/app/uploads/2024/12/Copy-of-CLEMENTE-BAR_BAR_129-FINAL-Credit-Jason-Varney.jpg',
  verified: '2026-04-23',
};

let html = fs.readFileSync(HTML_PATH, 'utf8');

let nycStart = html.indexOf('const NYC_DATA=');
if (nycStart < 0) nycStart = html.indexOf('const NYC_DATA =');
if (nycStart < 0) throw new Error('NYC_DATA not found');
const arrOpen = html.indexOf('[', nycStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}
const arrText = html.slice(arrOpen, arrClose);

// Idempotency by id and by name.
const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + CARD.id + '(?=[,}\\s])');
if (idRe.test(arrText)) {
  console.error('id ' + CARD.id + ' already present — aborting.');
  process.exit(1);
}
if (arrText.includes('"name":"Clemente Bar"')) {
  console.error('"Clemente Bar" name already present — aborting.');
  process.exit(1);
}

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
if (lastCloseBrace < 0) throw new Error('Could not find last card close brace');

const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Clemente Bar (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

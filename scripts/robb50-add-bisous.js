#!/usr/bin/env node
// Add Bisous (Robb Report NA Top 50 Bars #30) to CHICAGO_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const CONST_NAME = 'CHICAGO_DATA';

const CARD = {
  id: 12599,
  name: 'Bisous',
  phone: '',
  cuisine: 'Cocktail Bar',
  neighborhood: 'West Loop / Fulton Market',
  score: 92,
  price: 3,
  tags: ['Cocktails', 'Critics Pick', 'Date Night', 'Awards', 'Late Night', 'North America Top 50 Bar'],
  indicators: [],
  hh: '',
  reservation: 'walk-in',
  awards: "North America's 50 Best Bars 2025 (#30); Esquire Best Bars in America 2024",
  description: "Peter Vestinos — the Chicago cocktail veteran behind programs at Sepia, NoMI, The Betty, and Sparrow — opened Bisous in January 2024 as one of the West Loop's rare standalone cocktail lounges. Two thousand square feet of rust-velvet half-circle booths, a 14-seat marble bar, globe chandeliers, and patterned wallpaper channel Paris in the 1960s. The menu leans into classic martinis, retro house specialties like the French 75 and Pink Squirrel, and low-intervention French wines paired with tinned seafood, pork rillettes, and rotating caviar service. Walk-in only.",
  dishes: ['French 75', 'Pink Squirrel', 'Rose Blanche martini', 'Tinned seafood', 'Pork rillettes', 'Caviar with olive-oil potato chips'],
  address: '938 W Fulton Market, Chicago, IL 60607',
  hours: 'Mon-Thu 4pm-2am; Fri 2pm-2am; Sat 2pm-3am; Sun 2pm-midnight',
  lat: 41.8868832,
  lng: -87.6513338,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: 'Footman Hospitality',
  instagram: '@bisouschicago',
  website: 'https://www.bisouschicago.com',
  suburb: false,
  reserveUrl: '',
  menuUrl: '',
  res_tier: 1,
  photos: [],
  photoUrl: 'https://i0.wp.com/bcc-newspack.s3.amazonaws.com/uploads/2024/02/Bisous-Lounge-Garrett-Sweet-scaled.jpeg',
  verified: '2026-04-23',
};

let html = fs.readFileSync(HTML_PATH, 'utf8');

let cityStart = html.indexOf('const ' + CONST_NAME + '=');
if (cityStart < 0) cityStart = html.indexOf('const ' + CONST_NAME + ' =');
if (cityStart < 0) throw new Error(CONST_NAME + ' not found');
const arrOpen = html.indexOf('[', cityStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}
const arrText = html.slice(arrOpen, arrClose);

const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + CARD.id + '(?=[,}\\s])');
if (idRe.test(arrText)) { console.error('id ' + CARD.id + ' already present.'); process.exit(1); }
if (arrText.includes('"name":"Bisous"')) { console.error('Bisous already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Bisous (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

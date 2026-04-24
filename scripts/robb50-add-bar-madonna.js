#!/usr/bin/env node
// Add Bar Madonna (Robb Report NA Top 50 Bars #36) to NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARD = {
  id: 1995,
  name: 'Bar Madonna',
  phone: '',
  cuisine: 'Cocktail Bar / Italian-American',
  neighborhood: 'Williamsburg',
  score: 91,
  price: 2,
  tags: ['Cocktails', 'Italian', 'Date Night', 'Late Night', 'Scene', 'North America Top 50 Bar'],
  indicators: [],
  hh: '',
  reservation: 'Resy',
  awards: "North America's 50 Best Bars 2025 (#36)",
  description: "Eric Madonna's Williamsburg cocktail bar — designed by Studio Guia with art direction from KidSuper (Colm Dillane) — runs a 14-drink program from beverage director Rob Crowe, including four drafts. Chef Rob Zwirz (alum of Carbone, Babbo, Lupa) reimagines Italian-American bar food: Calabrese wings, smashed meatball Parm, house salumi. Not a red-sauce joint — a bar with an Italian soul.",
  dishes: ['Brooklyn Special cocktail', "Gemma's Sauce cocktail", 'Calabrese wings', 'Smashed meatball Parm', 'House salumi', 'Stracciatella'],
  address: '367 Metropolitan Ave, Brooklyn, NY 11211',
  hours: 'Tue-Sun 5pm-2am',
  lat: 40.7142542,
  lng: -73.9556698,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: '',
  instagram: '@barmadonnabk',
  website: 'https://barmadonna.com',
  suburb: false,
  reserveUrl: 'https://resy.com/cities/new-york-ny/venues/bar-madonna',
  bookingInfo: 'Opens 30 days ahead on Resy.',
  menuUrl: '',
  res_tier: 4,
  photos: [],
  photoUrl: 'https://greenpointers.com/wp-content/uploads/2024/04/Bar-Madonna_3-1.jpg',
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

const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + CARD.id + '(?=[,}\\s])');
if (idRe.test(arrText)) { console.error('id ' + CARD.id + ' already present.'); process.exit(1); }
if (arrText.includes('"name":"Bar Madonna"')) { console.error('Bar Madonna already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Bar Madonna (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

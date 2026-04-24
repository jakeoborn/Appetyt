#!/usr/bin/env node
// Add Gabriela (Williamsburg dance bar) to NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARD = {
  id: 1996,
  name: 'Gabriela',
  phone: '',
  cuisine: 'Dance Club / Cocktail Bar',
  neighborhood: 'Williamsburg',
  score: 87,
  price: 2,
  tags: ['Cocktails', 'Nightlife', 'Dance Club', 'Late Night', 'Scene'],
  indicators: [],
  hh: '',
  reservation: 'walk-in',
  awards: '',
  description: "An intimate Williamsburg dancefloor and cocktail bar on Wythe Avenue, opened in 2023 in the former Kinfolk storefront. State-of-the-art A/V, a custom-designed dance floor, and natural light define the room; DJ Eli Escobar curates the music program. Upstairs runs a quieter lounge. Capacity 250 standing, 90 seated. Early reservations start at a $2,000 minimum spend; full buyouts Friday/Saturday require $30,000.",
  dishes: ['Signature cocktails', 'Champagne service'],
  address: '90 Wythe Ave, Brooklyn, NY 11249',
  hours: 'Thu-Sat 9pm-close',
  lat: 40.7217038,
  lng: -73.9582538,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: '',
  instagram: '@gabriela90.nyc',
  website: 'https://www.gabriela.nyc',
  suburb: false,
  reserveUrl: '',
  menuUrl: '',
  res_tier: 2,
  photos: [],
  photoUrl: 'https://img.partyslate.com/companies-cover-image/60091/image-ef6c7303-eaa9-4913-9d1c-d62c42c11220.png?tr=w-1920',
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
if (arrText.match(/"name":"Gabriela"[,}]/)) { console.error('Gabriela already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Gabriela (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

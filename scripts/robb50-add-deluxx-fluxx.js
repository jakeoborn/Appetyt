#!/usr/bin/env node
// Add Deluxx Fluxx (East Village art-arcade nightclub) to NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARD = {
  id: 2000,
  name: 'Deluxx Fluxx',
  phone: '(917) 274-7913',
  cuisine: 'Nightclub / Arcade Bar',
  neighborhood: 'East Village',
  score: 85,
  price: 2,
  tags: ['Nightlife', 'Dance Club', 'Late Night', 'Scene', 'Cocktails', 'Arts'],
  indicators: [],
  hh: '',
  reservation: 'walk-in',
  awards: '',
  description: "The NYC outpost of the Detroit art-club concept from Brooklyn artist duo FAILE (Patrick McNeil and Patrick Miller), opened in 2022 in the former Studio at Webster Hall. Four thousand two hundred square feet of floor-to-ceiling blacklight interiors, day-glo graffiti, custom \"artfully weird\" arcade games (including Crown Heights King, where pigeons battle for borough supremacy), pinball, DJs, and costumed performers. Experimental lighting design by Andi Watson (Radiohead, Prince); beverage program from James Beard-nominated restaurateur Joe Robinson. Part interactive art installation, part nightclub.",
  dishes: ['The Dancehall Queen cocktail', 'Craft cocktails', 'Beer'],
  address: '125 E 11th St, New York, NY 10003',
  hours: 'Thu-Sat 10pm-4am',
  lat: 40.7317616,
  lng: -73.9890945,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: 'FAILE / Deluxx Fluxx',
  instagram: '@deluxxfluxxnyc',
  website: 'https://www.deluxxfluxx.com',
  suburb: false,
  reserveUrl: '',
  menuUrl: '',
  res_tier: 1,
  photos: [],
  photoUrl: 'https://media.timeout.com/images/105931809/image.webp',
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
if (arrText.includes('"name":"Deluxx Fluxx"')) { console.error('Deluxx Fluxx already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Deluxx Fluxx (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

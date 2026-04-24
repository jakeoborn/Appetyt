#!/usr/bin/env node
// Add Mirate (Robb Report NA Top 50 Bars #28) to LA_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const CONST_NAME = 'LA_DATA';

const CARD = {
  id: 2534,
  name: 'Mírate',
  phone: '(323) 649-7937',
  cuisine: 'Mexican / Cocktail Bar',
  neighborhood: 'Los Feliz',
  score: 94,
  price: 3,
  tags: ['Mexican', 'Cocktails', 'Critics Pick', 'Date Night', 'Awards', 'North America Top 50 Bar'],
  indicators: [],
  hh: '',
  reservation: 'Resy',
  awards: "North America's 50 Best Bars 2025 (#28)",
  description: "Sibling to Michelin-recognized Mírame in Beverly Hills, Mírate is Chef Joshua Gil's Alta California take on regional Mexican cuisine spread across a multi-level Los Feliz space designed by Alexa Nafisi-Movaghar. A 40-foot indoor tree anchors the room, with an atrium ceiling framing views of the Griffith Observatory. Two bars — one a dedicated mezcaleria — run an all-Mexican wine and spirits program from bar director Max Reis, with cocktails like El Güero (aguachile, nopales granita, coconut, avocado-washed Cascahuin). The menu mashes up regional Mexican with Mediterranean influences across tacos árabes, tlayudas, and \"yuccas sucias\" — Gil's animal-style tribute.",
  dishes: ['El Güero margarita', 'Yuccas sucias', 'El Chicano burger', 'Lamb flautas', 'Octopus taco árabe', 'Tlayuda de Baja California'],
  address: '1712 N Vermont Ave, Los Angeles, CA 90027',
  hours: '',
  lat: 34.1021958,
  lng: -118.2916414,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: 'Mírame Hospitality',
  instagram: '@mirate.losangeles',
  website: 'https://www.mirate.la',
  suburb: false,
  reserveUrl: 'https://resy.com/cities/los-angeles-ca/venues/mirate',
  menuUrl: '',
  res_tier: 4,
  photos: [],
  photoUrl: 'https://blog.resy.com/wp-content/uploads/2023/01/Interiors_5-2000x1125.jpg',
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
if (arrText.includes('"name":"Mírate"')) { console.error('Mírate already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Mírate (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

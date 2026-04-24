#!/usr/bin/env node
// Add Viceversa (Robb Report NA Top 50 Bars #46) to MIAMI_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const CONST_NAME = 'MIAMI_DATA';

const CARD = {
  id: 4113,
  name: 'Viceversa',
  phone: '',
  cuisine: 'Cocktail Bar / Italian',
  neighborhood: 'Downtown Miami',
  score: 92,
  price: 3,
  tags: ['Cocktails', 'Italian', 'Pizza', 'Date Night', 'Critics Pick', 'Awards', 'North America Top 50 Bar'],
  indicators: [],
  hh: '',
  reservation: 'Resy',
  awards: "North America's 50 Best Bars 2025 (#46); 2025 James Beard \"Best New Bar\" finalist",
  description: "Award-winning Miami bartender Valentino Longo — ex-head bartender of the Four Seasons Surf Club Champagne Bar and Bombay Sapphire's 2020 Most Imaginative Bartender — opened Viceversa in the lobby of The Elser Hotel with the Jaguar Sun team. The 14-drink menu splits into a Negroni Family, Martinis, and Signature Cocktails, anchored by imported Italian spirits, vermouths, and amari. The room nods to Italian futuristi — posters, uniforms, and wall art by modern futurist Jean Vaquier (Folzer). The kitchen, led by Jaguar Sun's Carey Hynes and Justin Flit, turns out neo-Neapolitan pizzas (daily-stretched mozzarella, 24–48-hour cold fermentation) alongside Treasure Coast oysters, tuna tartare, and wood-fired flatbreads.",
  dishes: ['ViceVersa MI-TO', 'Sbagliato with Franciacorta', 'Brucio in Bocca', 'Affogato martini', 'Clam pizza', 'Bad First Date pizza', 'Sopressata pizza', 'Tuna tartare with pistachio'],
  address: '398 NE 5th St, Miami, FL 33132',
  hours: 'Tue-Sat 5pm-midnight',
  lat: 25.7787928,
  lng: -80.1892498,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: 'Jaguar Sun team',
  instagram: '@viceversamiami',
  website: 'https://viceversamia.com',
  suburb: false,
  reserveUrl: 'https://resy.com/cities/miami-fl/venues/viceversa-fl',
  bookingInfo: 'Limited Resy reservations; most seats (including all bar seats) are first-come, first-served.',
  menuUrl: '',
  res_tier: 3,
  photos: [],
  photoUrl: 'https://www.miaminewtimes.com/wp-content/uploads/sites/4/ww-media/mediaserver/mia/2024-25/vicevesa_main_bar_photo_credit_r.c._visuals.webp',
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
if (arrText.includes('"name":"Viceversa"')) { console.error('Viceversa already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Viceversa (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

#!/usr/bin/env node
// Add Damballa (Bushwick Haitian music bar) to NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARD = {
  id: 2001,
  name: 'Damballa',
  phone: '(315) 207-7718',
  cuisine: 'Music Bar / Caribbean',
  neighborhood: 'Bushwick',
  score: 88,
  price: 2,
  tags: ['Cocktails', 'Haitian', 'Caribbean', 'Nightlife', 'Dance Club', 'Late Night', 'Date Night'],
  indicators: [],
  hh: '',
  reservation: 'walk-in',
  awards: '',
  description: "The slightly-more-grown-up sibling to Cafe Erzulie — same Haitian-rooted team, directly across Broadway. Damballa pays homage to Haitian culture and art deco design: a wavy brown-and-white floor, floor-to-ceiling record shelves, and velvet maroon banquettes. The cocktail list leans rhum-based (Summer Sorel, Spicy PB&J) and the kitchen fries yuca crisp with a cilantro-dill dipping sauce. Sets run late — Friday and Saturday DJs often through 4am.",
  dishes: ['Summer Sorel cocktail', 'Spicy PB&J cocktail', 'Yuca fries with cilantro-dill sauce'],
  address: '895 Broadway, Brooklyn, NY 11206',
  hours: 'Wed-Thu 6pm-midnight; Fri-Sat 6pm-4am; Sun 7pm-midnight',
  lat: 40.6981186,
  lng: -73.9368872,
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: false,
  group: 'Cafe Erzulie / Damballa',
  instagram: '@damballa.nyc',
  website: 'https://www.damballa.nyc',
  suburb: false,
  reserveUrl: '',
  menuUrl: 'https://www.damballa.nyc/menus',
  res_tier: 1,
  photos: [],
  photoUrl: 'https://res.cloudinary.com/the-infatuation/image/upload/c_fill,w_1920,ar_4:3,g_center,f_auto/images/NYC_Damballa_WillaMoore_KPEDIT_01_hpw8is',
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
if (arrText.includes('"name":"Damballa"')) { console.error('Damballa already present.'); process.exit(1); }

const serialized = JSON.stringify(CARD);
const lastCloseBrace = arrText.lastIndexOf('}');
const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1);
const newArrText = before + ',' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Added Damballa (id=' + CARD.id + ') — file delta: +' + (newHtml.length - html.length) + ' bytes');

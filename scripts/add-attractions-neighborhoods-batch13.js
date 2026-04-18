#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 13.
const fs = require('fs');
const path = require('path');

function readBlock(html, constName) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e, arr: JSON.parse(html.slice(a, e)) };
}

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function entry(o) {
  return {
    id: o.id, name: o.name, phone: '', cuisine: o.cuisine,
    neighborhood: o.neighborhood, score: o.score, price: 1,
    tags: o.tags, indicators: [], hh: '', reservation: 'walk-in',
    awards: '', description: o.description, dishes: [],
    address: o.address, hours: '', lat: o.lat, lng: o.lng,
    bestOf: [], group: '', instagram: '', website: '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: 0,
    verified: true, photoUrl: '',
  };
}

function addTo(constName, adds) {
  const { a, e: end, arr } = readBlock(html, constName);
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  arr.push(...adds.map((o, i) => entry(Object.assign({}, o, { id: maxId + i + 1 }))));
  console.log(constName + ': +' + adds.length + ' (' + before + ' -> ' + arr.length + ')');
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(end);
}

addTo('SEATTLE_DATA', [
  { name: 'Georgetown Steam Plant', cuisine: 'Landmark / Historic Site', neighborhood: 'Georgetown', score: 82, tags: ['Landmark','Historic','Tourist Attraction'], description: 'National Historic Landmark 1906 steam-electric power plant, now a working museum of industrial technology. Open select Saturdays for tours through the cathedral-ceilinged turbine hall.', address: '6605 13th Ave S, Seattle, WA 98108', lat: 47.5385, lng: -122.3259 },
  { name: 'Oxbow Park (Hat \u2019n\u2019 Boots)', cuisine: 'Park / Landmark', neighborhood: 'Georgetown', score: 80, tags: ['Park','Landmark','Tourist Attraction','Photo Op'], description: 'Quirky Georgetown park featuring the restored 1954 Hat \u2019n\u2019 Boots gas-station sculpture \u2014 a 44-foot cowboy hat and a pair of 22-foot boots. Equal parts roadside Americana and neighborhood park.', address: '6430 Corson Ave S, Seattle, WA 98108', lat: 47.5402, lng: -122.3218 },
]);

addTo('HOUSTON_DATA', [
  { name: 'Rice Village', cuisine: 'Landmark / Shopping District', neighborhood: 'Rice Village', score: 84, tags: ['Landmark','Tourist Attraction','Shopping','Historic'], description: 'One of Houston\u2019s oldest open-air shopping districts (1938), a 16-block grid of boutiques, restaurants, and bars next to Rice University. Free parking, dog-friendly patios.', address: '2500 Rice Blvd, Houston, TX 77005', lat: 29.7163, lng: -95.4161 },
  { name: 'Market Street The Woodlands', cuisine: 'Landmark / Shopping District', neighborhood: 'The Woodlands', score: 85, tags: ['Landmark','Tourist Attraction','Shopping','Family Friendly'], description: 'Walkable open-air lifestyle center anchored by Tommy Bahama Restaurant, dozens of boutiques, and a central green that hosts concerts and a skating rink in winter.', address: '9595 Six Pines Dr, The Woodlands, TX 77380', lat: 30.1677, lng: -95.4637 },
  { name: 'The Woodlands Waterway', cuisine: 'Landmark / Trail', neighborhood: 'The Woodlands', score: 86, tags: ['Landmark','Tourist Attraction','Outdoor','Family Friendly'], description: '1.25-mile waterway with a cruiser trolley and paths connecting Market Street, the Cynthia Woods Mitchell Pavilion, and Town Green. The Woodlands\u2019 civic spine.', address: 'Woodlands Waterway, The Woodlands, TX 77380', lat: 30.1648, lng: -95.4601 },
]);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

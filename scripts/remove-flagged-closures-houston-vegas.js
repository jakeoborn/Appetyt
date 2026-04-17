#!/usr/bin/env node
// Remove closures that were flagged in description but never removed,
// and add their replacements where one exists.
// Verified via firecrawl 2026-04-17.
//
// Houston: Ouzo Bay (id 7291) — River Oaks District closed Jan 2026. No clear replacement surfaced.
// Vegas:   Aureole (id 12355) at Mandalay Bay — replaced by Orla (Chef Michael Mina Mediterranean).
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function bounds(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e };
}

function removeByIds(constName, ids) {
  const b = bounds(constName);
  if (!b) return 0;
  const slice = html.slice(b.a, b.e);
  const arr = JSON.parse(slice); // Houston+Vegas are strict JSON
  const startLen = arr.length;
  const filtered = arr.filter(r => !ids.includes(r.id));
  html = html.slice(0, b.a) + JSON.stringify(filtered) + html.slice(b.e);
  return startLen - filtered.length;
}

function addEntry(constName, entry) {
  const b = bounds(constName);
  if (!b) throw new Error('bounds not found for ' + constName);
  const slice = html.slice(b.a, b.e);
  const arr = JSON.parse(slice);
  if (arr.some(r => r.id === entry.id)) throw new Error('id collision: ' + entry.id);
  if (arr.some(r => r.name === entry.name)) throw new Error('name dup: ' + entry.name);
  arr.push(entry);
  html = html.slice(0, b.a) + JSON.stringify(arr) + html.slice(b.e);
}

function makeEntry(e) {
  return {
    name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood, score: e.score, price: e.price,
    tags: e.tags || [], description: e.description, dishes: e.dishes || [],
    address: e.address, hours: e.hours || '', lat: e.lat, lng: e.lng,
    instagram: e.instagram || '', website: e.website || '', reservation: e.reservation || '',
    phone: e.phone || '', id: e.id,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: e.trending === true, group: e.group || '', suburb: false, menuUrl: '',
    res_tier: e.res_tier || 0, indicators: e.indicators || [], awards: e.awards || '',
    reserveUrl: '', hh: '', verified: true,
  };
}

// Remove
const houRemoved = removeByIds('HOUSTON_DATA', [7291]); // Ouzo Bay
const lvRemoved = removeByIds('LV_DATA', [12355]);      // Aureole
console.log('Removed: Houston ' + houRemoved + ', Vegas ' + lvRemoved);

// Add Orla as replacement for Aureole
addEntry('LV_DATA', makeEntry({
  id: 12523,
  name: 'Orla',
  cuisine: 'Mediterranean',
  neighborhood: 'Mandalay Bay',
  score: 87,
  price: 4,
  tags: ['Mediterranean', 'Seafood', 'Date Night', 'Celebrity Chef', 'New'],
  description: 'Chef Michael Mina\'s Mediterranean restaurant at Mandalay Bay, opened in the former Aureole space. Stunning seafood, charcoal-roasted meats, and bright, zesty coastal vegetables in a refined dining room.',
  dishes: ['Seafood Tower', 'Charcoal-Roasted Lamb', 'Branzino'],
  address: '3950 S Las Vegas Blvd, Mandalay Bay, Las Vegas, NV 89119',
  lat: 36.0927,
  lng: -115.1767,
  instagram: 'orlalasvegas',
  website: 'https://mandalaybay.mgmresorts.com/en/restaurants/orla.html',
  reservation: 'OpenTable',
  res_tier: 3,
  group: 'Mina Group',
}));
console.log('Added: Orla (id 12523) to Vegas');

fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

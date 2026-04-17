#!/usr/bin/env node
// SLC replacements batch 2 — removes Cafe Niche (confirmed closed per
// gastronomicslc.com and the Salt Lake Tribune) and adds three verified
// 2025–26 openings:
//  - The Brick (score 87, 779 E 300 S) literally replaced Cafe Niche in
//    the same space per SLTrib: "Piraquive quietly opened [The Brick] in
//    January where Cafe Niche used to be."
//  - Monte (score 93) chef Martin Babio tasting-menu fine dining, Salt
//    Lake Magazine 2026 dining coverage, Michelin buzz.
//  - Neighbors Bar (score 86) on the 9 Line Trail, Salt Lake Magazine's
//    2026 "Restaurants to Watch".
//
// After this script: SLC_DATA should land back at 500 entries.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const SLC_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));

const start = arr.length;

// --- Remove closed entries ---
const removeIds = new Set([11054]); // Cafe Niche
const removed = arr.filter(r => removeIds.has(r.id)).map(r => r.name);
const filtered = arr.filter(r => !removeIds.has(r.id));

// --- Adds ---
const existingMax = Math.max(...filtered.map(r => r.id));
let nextId = Math.max(existingMax, 11572) + 1;

const adds = [
  {
    id: nextId++,
    name: 'The Brick',
    cuisine: 'International / Fusion',
    neighborhood: 'Central City',
    score: 87,
    price: 2,
    tags: ['New American', 'Brunch', 'Date Night', 'Local Favorites'],
    indicators: [],
    hh: '',
    reservation: 'OpenTable',
    awards: '',
    description: 'An international menu blending Spanish, Italian, Mexican, and American flavors in the space that once housed Cafe Niche. Chef-driven brunch and dinner with a neighborhood-modern feel near the base of the Avenues.',
    dishes: ['French Toast', 'Breakfast Burrito', 'Mexican Skillet', 'Roux Dinner Entrees'],
    address: '779 E 300 S, Salt Lake City, UT 84102',
    lat: 40.762, lng: -111.871,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: true, group: '',
    instagram: '@thebrickslc',
    website: 'https://thebrickslc.com',
    reserveUrl: '', menuUrl: '',
    res_tier: 2, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Monte',
    cuisine: 'New American / Tasting Menu',
    neighborhood: 'South Salt Lake',
    score: 93,
    price: 4,
    tags: ['Fine Dining', 'Tasting Menu', 'Date Night', 'Critics Pick', 'Chef Driven'],
    indicators: [],
    hh: '',
    reservation: 'Tock',
    awards: '',
    description: "Chef-owner Martin Babio's intimate 12-course tasting-menu destination in South Salt Lake. Organic, mountain-based ingredients plated as quiet narrative; reservations move quickly and the counter seats are the prize. Broadly considered among the most ambitious kitchens in Utah.",
    dishes: ['Chef\u2019s Tasting Menu', 'Seasonal Crudo', 'Wagyu Course', 'Local Cheese Course'],
    address: '2245 S W Temple St, South Salt Lake, UT 84115',
    lat: 40.722, lng: -111.896,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: true, group: '',
    instagram: '@monte_slc',
    website: 'https://monteslc.com',
    reserveUrl: '', menuUrl: '',
    res_tier: 4, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Neighbors Bar',
    cuisine: 'Bar / Neighborhood Tavern',
    neighborhood: 'Central City',
    score: 86,
    price: 2,
    tags: ['Cocktails', 'Late Night', 'Local Favorites', 'Bar'],
    indicators: [],
    hh: '',
    reservation: 'Walk-in',
    awards: '',
    description: 'A neighborhood bar and cafe on the 9 Line Trail on Harvey Milk Boulevard, from SLC couple Petek and Worthen. No reservations, 21+, a rotating pop-up food program, and a warm come-as-you-are room that has quickly become a neighborhood anchor.',
    dishes: ['Seasonal Pop-Up Menu', 'House Cocktails', 'Natural Wine Pours'],
    address: '430 E Harvey Milk Blvd, Salt Lake City, UT 84111',
    lat: 40.7499, lng: -111.8775,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: true, group: '',
    instagram: '@slc.neighbors',
    website: 'https://www.slc-neighbors.com',
    reserveUrl: '', menuUrl: '',
    res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
];

const final = [...filtered, ...adds];

console.log(`Removed (${removed.length}):`, removed);
console.log(`Added (${adds.length}):`, adds.map(a => `${a.id} ${a.name}`));
console.log(`SLC count: ${start} → ${final.length}`);

html = before + JSON.stringify(final) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

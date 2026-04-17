#!/usr/bin/env node
// Chicago replacement-space searches — batch 2.
// Adds verified replacements for Passerotto (→ Minyoli) and Table Fifty-Two
// (→ Blue Door Kitchen & Garden). Also corrects Amano Bistro address/cuisine
// (the Kitsune 4229 N Lincoln replacement was mislabeled at 4654).
// Verified via firecrawl_search 2026-04-17. Chicago IG convention: no @ prefix.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const CHICAGO_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));
const startCount = arr.length;
const maxId = Math.max(...arr.map(r => r.id || 0));

// --- Additions ---
const additions = [
  {
    id: maxId + 1,
    name: 'Minyoli',
    phone: '',
    cuisine: 'Taiwanese / Noodles',
    neighborhood: 'Andersonville',
    score: 87,
    price: 2,
    tags: ['Taiwanese', 'Noodles', 'Casual', 'Local Favorites', 'New Opening'],
    indicators: ['new'],
    hh: '',
    reservation: 'walk-in',
    awards: '',
    description: 'Taiwanese noodle shop from chef Brian Jupiter in the former Passerotto space, inspired by juan cun (military village) cooking. Opened May 2024 to a line down the block, anchored by braised beef noodle soup and Taiwanese fried chicken. Small, warm dining room; regular noodle menu weeknights and a signature tasting menu on select evenings.',
    dishes: ['Braised Beef Noodle Soup', 'Taiwanese Fried Chicken', 'Braised Beef Shank'],
    address: '5420 N Clark St, Chicago, IL 60640',
    hours: '',
    lat: 41.9805,
    lng: -87.6687,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: true,
    group: '',
    instagram: 'minyoli.chicago',
    website: 'https://www.minyolichicago.com',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: 2,
    verified: true,
    photoUrl: '',
  },
  {
    id: maxId + 2,
    name: 'Blue Door Kitchen & Garden',
    phone: '(312) 573-4000',
    cuisine: 'Southern / New American',
    neighborhood: 'Gold Coast',
    score: 85,
    price: 3,
    tags: ['Southern', 'New American', 'Date Night', 'Celebrity Chef', 'Brunch'],
    indicators: [],
    hh: '',
    reservation: 'OpenTable',
    awards: '',
    description: 'Chef Art Smith\u2019s Gold Coast farm-to-table restaurant in the former Table Fifty-Two space, serving the famous buttermilk fried chicken alongside a broader Southern-leaning menu. The historic brownstone features a heated garden patio in warmer months. A reliable Sunday brunch destination.',
    dishes: ['Buttermilk Fried Chicken', 'Hummingbird Cake', 'Shrimp & Grits'],
    address: '52 W Elm St, Chicago, IL 60610',
    hours: '',
    lat: 41.9020,
    lng: -87.6287,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: '',
    instagram: 'bluedoorkitchenchicago',
    website: 'https://bluedoorkitchenchicago.com',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: 3,
    verified: true,
    photoUrl: '',
  },
];

// --- Amano Bistro fix (the Kitsune-space replacement) ---
// Correct address + cuisine + add website/IG + description refresh.
let amanoFixed = false;
const amano = arr.find(r => r.name === 'Amano Bistro');
if (amano) {
  amano.address = '4229 N Lincoln Ave, Chicago, IL 60618';
  amano.lat = 41.9595;
  amano.lng = -87.6848;
  amano.cuisine = 'Mediterranean / Italian';
  amano.description = 'Mediterranean bistro from owners Nikola Paunovic and Nemanja Menicanin, fusing Italian, Greek, and Balkan flavors in the former Kitsune space on Lincoln Avenue. Opened Memorial Day weekend 2024. Handmade pastas, grilled seafood, and regional Mediterranean classics in a warm, intimate dining room.';
  amano.tags = Array.from(new Set([...(amano.tags || []), 'Mediterranean', 'Italian', 'Date Night']));
  amano.instagram = amano.instagram || 'amanobistrochicago';
  amano.reservation = 'Resy';
  amano.phone = amano.phone || '(773) 936-0658';
  amano.dishes = ['Handmade Pasta', 'Grilled Branzino', 'Balkan Meat Platter'];
  amanoFixed = true;
}

arr.push(...additions);

console.log('Additions: ' + additions.length);
additions.forEach(r => console.log('  [' + r.score + '] id=' + r.id + ' ' + r.name + ' (' + r.neighborhood + ')'));
console.log('Amano Bistro fixed: ' + amanoFixed);
console.log('Chicago count: ' + startCount + ' -> ' + arr.length);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

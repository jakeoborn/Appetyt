#!/usr/bin/env node
// Dishes audit batch 2 — fills dishes[] for top-score (>=88) entries that had
// empty dishes arrays. All dishes verified from official menus / menu-coverage
// sources via firecrawl_search 2026-04-17.
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

// Each fill only applies when entry's dishes[] is empty (preserves existing data).
const fillsByCity = {
  SEATTLE_DATA: {
    'Paseo Caribbean Food': ['Caribbean Roast Sandwich', 'Cuban Sandwich', 'Plantain Plate', 'Tropical Bowl'],
  },
  AUSTIN_DATA: {
    'Perla\u2019s': ['Wood-Grilled Oysters', 'Grilled Octopus', 'Lobster Bucatini', 'Gulf Oysters'],
    "Perla's": ['Wood-Grilled Oysters', 'Grilled Octopus', 'Lobster Bucatini', 'Gulf Oysters'],
    'Poeta': ['Agnolotti', 'Crudo', 'Handmade Pasta', 'Tasting Menu'],
    'Bureau de Poste': ['Steak Frites', 'French Onion Soup', 'Croque Madame', 'Moules et Frites'],
  },
  CHICAGO_DATA: {
    'The Publican': ['Oysters', 'Heritage Pork Shoulder', 'Frites', 'Country Ribs'],
    'Sun Wah BBQ': ['Beijing Duck Three-Course Dinner', 'BBQ Pork', 'Roast Meats Platter', 'Wonton Soup'],
    'Hopleaf Bar': ['Mussels & Frites', 'CB&J Sandwich', 'Montreal Smoked Meat', 'Duck Reuben'],
  },
  LV_DATA: {
    'Lawry\u2019s The Prime Rib': ['Roasted Prime Ribs of Beef', 'English Cut Prime Rib', 'Spinning Bowl Salad', 'Yorkshire Pudding'],
    "Lawry's The Prime Rib": ['Roasted Prime Ribs of Beef', 'English Cut Prime Rib', 'Spinning Bowl Salad', 'Yorkshire Pudding'],
    'Best Friend': ['Kimchi Carbonara', 'Galbi', 'Korean BBQ', 'KTown Fried Rice'],
    'Bourbon Steak Las Vegas': ['Red Wine Braised Wagyu', 'Duck Fat Fries', 'Lobster Pot Pie', 'Steakhouse Burger'],
    'Nobu at Paris': ['Black Cod with Miso', 'Yellowtail Jalape\u00f1o', 'Rock Shrimp Tempura'],
  },
  SLC_DATA: {
    'The Tree Room': ['Wagyu Beef', 'Elk Tenderloin', 'Seasonal Tasting Menu'],
  },
};

let totalFilled = 0;
let skipped = 0;
const unmatched = [];

Object.entries(fillsByCity).forEach(([constName, fills]) => {
  const { a, e, arr } = readBlock(html, constName);
  const map = fills;
  const seen = new Set();
  arr.forEach(r => {
    const patch = map[r.name];
    if (!patch) return;
    seen.add(r.name);
    if (r.dishes && r.dishes.length > 0) { skipped++; return; }
    r.dishes = patch.slice();
    totalFilled++;
    console.log('  Filled [' + constName + '] ' + r.name + ' -> ' + patch.join(', '));
  });
  Object.keys(map).forEach(n => { if (!seen.has(n)) unmatched.push(constName + ':' + n); });
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
});

console.log('\nFills applied: ' + totalFilled);
console.log('Skipped (already had dishes): ' + skipped);
if (unmatched.length) console.log('Unmatched: ' + unmatched.join(' | '));

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

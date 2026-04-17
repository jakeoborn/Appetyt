#!/usr/bin/env node
// Dishes audit batch 3 — fills dishes[] for more top-score (>=88) entries.
// All verified from official menus / direct menu-coverage sources
// via firecrawl_search 2026-04-17.
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

const fillsByCity = {
  SEATTLE_DATA: {
    'Takai By Kashiba': ['Edomae Nigiri', 'Omakase Sushi Course', 'Sashimi Selection', 'Omakase Dinner Box'],
    'Tavol\u00e0ta': ['Rigatoni', 'Pappardelle', 'Gnocchi Alla Romana', 'Bruschetta'],
    'Thai Tom': ['Pad Thai', 'Basil Stir-Fry', 'Coconut Curry', 'Green Curry'],
    'Revel': ['Kimchi Pancake', 'Short Rib Wontons', 'Dungeness Crab Noodle', 'Short Rib Rice Plate'],
  },
  SLC_DATA: {
    'Tiburon Fine Dining': ['Elk Tenderloin', 'Pork Belly', 'Ahi Tuna', 'Seared Scallops'],
  },
  LV_DATA: {
    'Cantina Contramar': ['Tuna Tostada', 'Chilaquiles', 'Pescado Zarandeado', 'Panqu\u00e9 de Elote'],
    'Cleaver': ['Bone Marrow', 'Tomahawk Ribeye', 'Porterhouse', 'Cleaver Ribeye'],
  },
};

let totalFilled = 0, skipped = 0;
const unmatched = [];

Object.entries(fillsByCity).forEach(([constName, fills]) => {
  const { a, e, arr } = readBlock(html, constName);
  const seen = new Set();
  arr.forEach(r => {
    const patch = fills[r.name];
    if (!patch) return;
    seen.add(r.name);
    if (r.dishes && r.dishes.length > 0) { skipped++; return; }
    r.dishes = patch.slice();
    totalFilled++;
    console.log('  Filled [' + constName + '] ' + r.name + ' -> ' + patch.join(', '));
  });
  Object.keys(fills).forEach(n => { if (!seen.has(n)) unmatched.push(constName + ':' + n); });
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
});

console.log('\nFills applied: ' + totalFilled);
console.log('Skipped (already had dishes): ' + skipped);
if (unmatched.length) console.log('Unmatched: ' + unmatched.join(' | '));

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

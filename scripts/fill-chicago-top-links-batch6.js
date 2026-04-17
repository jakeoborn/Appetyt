#!/usr/bin/env node
// Batch 6 — Chicago score 87 fills + 6 closure removals.
// Verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const fills = {
  346: { website: 'https://www.pizzafriendlypizza.com/' }, // Pizza Friendly Pizza
  354: { website: 'https://hugosfrogbar.com/' },           // Hugo's Frog Bar
  355: { website: 'https://www.swiftandsonstavern.com/' }, // Swift & Sons Tavern
  393: { website: 'https://www.michaeljordansteakhouse.com/' }, // Michael Jordan's Steak House
};

// Confirmed closures (all verified via Eater/Tribune/Yelp CLOSED tags)
const REMOVE_IDS = [
  363,  // The Blanchard (closed 2018)
  389,  // Passerotto (closed Sept 2020)
  400,  // Table Fifty-Two (closed)
  415,  // Bad Hunter (closed pandemic 2021)
  438,  // Cafe Cancale (closed June 2020, One Off Hospitality)
  439,  // Ruxbin (closed 2017)
];

const s = html.indexOf('const CHICAGO_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
let block = html.slice(a, e);
const after = html.slice(e);

const arr = JSON.parse(block);
const startCount = arr.length;
const removedInfo = [];
const filtered = arr.filter(r => {
  if (REMOVE_IDS.includes(r.id)) {
    removedInfo.push({ id: r.id, name: r.name, score: r.score });
    return false;
  }
  return true;
});
console.log('Removed closures: ' + removedInfo.length);
removedInfo.forEach(r => console.log('  [' + r.score + '] id=' + r.id + ' ' + r.name));

let fillCount = 0;
Object.entries(fills).forEach(([idStr, patch]) => {
  const id = Number(idStr);
  const entry = filtered.find(r => r.id === id);
  if (!entry) { console.log('  MISS id=' + id); return; }
  let changed = false;
  if (patch.website !== undefined && entry.website !== patch.website) { entry.website = patch.website; changed = true; }
  if (patch.instagram !== undefined && entry.instagram !== patch.instagram) { entry.instagram = patch.instagram; changed = true; }
  if (changed) { fillCount++; console.log('  Filled id=' + id + ' ' + entry.name + ' — ' + Object.keys(patch).join(', ')); }
});

console.log('\nChicago count: ' + startCount + ' → ' + filtered.length);
console.log('Fills: ' + fillCount);

html = before + JSON.stringify(filtered) + after;
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

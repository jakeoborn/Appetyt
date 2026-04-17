#!/usr/bin/env node
// Austin top-score link backfill — batch 1.
// Websites verified via firecrawl_search for high-score Austin entries.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));

const fills = {
  5281: { website: 'https://www.restaurantfrancois.com' },               // Restaurant François
  5452: { website: 'https://daidue.com', instagram: '@daidue' },          // Dai Due Butcher
  5314: { website: 'https://daidue.com' },                                // Dai Due Taqueria (IG already @daidue)
  5282: { website: 'https://www.scratchrestaurants.com/shokuninatx' },    // Shokunin
  5299: { website: 'https://www.craftmeatsaustin.com' },                  // Micklethwait Craft Meats
  5274: { website: 'https://vanhornsatx.com' },                           // VanHorn's
  5324: { website: 'https://elnaranjorestaurant.com' },                   // El Naranjo
  5364: { website: 'https://www.vespaioristorante.com' },                 // Vespaio
  5376: { website: 'https://www.lenoirrestaurant.com' },                  // Lenoir Hot Weather Food
};

let filled = 0, skipped = 0;
arr.forEach(r => {
  const f = fills[r.id];
  if (!f) return;
  if (f.website && !(r.website && String(r.website).trim())) { r.website = f.website; filled++; }
  else if (f.website) skipped++;
  if (f.instagram && !(r.instagram && String(r.instagram).trim())) { r.instagram = f.instagram; filled++; }
  else if (f.instagram) skipped++;
});

console.log(`Fills applied: ${filled}`);
console.log(`Skipped (already set): ${skipped}`);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

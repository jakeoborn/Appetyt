#!/usr/bin/env node
// Batch 7 — Chicago score 87 fills + 3 closure removals. Verified 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const fills = {
  343: { website: 'https://qxydumpling.com/' },                                      // Qing Xiang Yuan
  411: { website: 'https://radiclechicago.com/', instagram: 'radiclechicago' },      // The Radicle
  442: { website: 'https://www.avli.us/avli-river-north' },                          // Avli River North
  446: { instagram: 'bayankochicago' },                                              // Bayan Ko
};

// Confirmed closures
const REMOVE_IDS = [
  417,  // Cemitas Puebla — last Chicago shop closed Jan 2020 (Fulton Market)
  433,  // Etta — closed Oct 19, 2025 (Etta Collective Chapter 11)
  455,  // Dear Margaret — closed Oct 6, 2025 after fire (won't reopen)
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
  if (REMOVE_IDS.includes(r.id)) { removedInfo.push({ id: r.id, name: r.name, score: r.score }); return false; }
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

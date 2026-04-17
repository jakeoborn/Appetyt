#!/usr/bin/env node
// Batch 5 — Chicago score 87 link fills. Verified via firecrawl_search 2026-04-17.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const fills = {
  103: { instagram: 'official.nhahangvietnam' },                           // Nha Hang Viet Nam
  265: { website: 'https://casayari.com/', instagram: 'casayari' },        // Casa Yari
};

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
let fillCount = 0;
Object.entries(fills).forEach(([idStr, patch]) => {
  const id = Number(idStr);
  const entry = arr.find(r => r.id === id);
  if (!entry) { console.log('  MISS id=' + id); return; }
  let changed = false;
  if (patch.website !== undefined && entry.website !== patch.website) { entry.website = patch.website; changed = true; }
  if (patch.instagram !== undefined && entry.instagram !== patch.instagram) { entry.instagram = patch.instagram; changed = true; }
  if (changed) { fillCount++; console.log('  Filled id=' + id + ' ' + entry.name + ' — ' + Object.keys(patch).join(', ')); }
});

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('\nDone: ' + fillCount + ' fills');

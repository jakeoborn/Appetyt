#!/usr/bin/env node
// Remove permanently-closed Chicago restaurants from CHICAGO_DATA.
// Verified via firecrawl_search 2026-04-17.
// - Acadia (id 512): closed 2021 (Eater Chicago)
// - Blackbird (id 430): closed June 2020 (One Off Hospitality / Paul Kahan)
// - Brass Heart (id 399): closed 2023 (replaced by Cariño)
// - Lost Lake (id 52): closed Jan 2022 (tiki bar)
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const REMOVE_IDS = [52, 399, 430, 512];

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

// Parse, filter, serialize
const arr = JSON.parse(block);
const startCount = arr.length;
const removed = [];
const filtered = arr.filter(r => {
  if (REMOVE_IDS.includes(r.id)) {
    removed.push({ id: r.id, name: r.name, score: r.score });
    return false;
  }
  return true;
});

if (removed.length !== REMOVE_IDS.length) {
  console.error('Expected to remove ' + REMOVE_IDS.length + ' but matched ' + removed.length);
  const foundIds = removed.map(r => r.id);
  const missing = REMOVE_IDS.filter(id => !foundIds.includes(id));
  console.error('Missing ids: ' + missing.join(', '));
  process.exit(1);
}

console.log('Removed ' + removed.length + ' closed restaurants:');
removed.forEach(r => console.log('  [' + r.score + '] id=' + r.id + ' ' + r.name));
console.log('Chicago count: ' + startCount + ' → ' + filtered.length);

const newBlock = JSON.stringify(filtered);
html = before + newBlock + after;
fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');

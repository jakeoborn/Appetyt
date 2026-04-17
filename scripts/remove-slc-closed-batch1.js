#!/usr/bin/env node
// Remove SLC entries surfaced during batch 1 link verification:
//  - Current Fish & Oyster (id 11328): closed October 2025 per
//    gastronomicslc.com and Yelp ("CLOSED" status). Yelp banner: "Yelpers
//    report this location has closed."
//  - La Nonne (id 11327): no corroborating evidence this restaurant exists.
//    Address (136 E South Temple) is the Seraph luxury apartments tower.
//    Instagram handle @lanonneslc does not exist on the platform. Treating
//    as AI-fabricated per the project's anti-hallucination policy.
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

const removeIds = new Set([11328, 11327]);
const before_len = arr.length;
const removed = arr.filter(r => removeIds.has(r.id)).map(r => ({ id: r.id, name: r.name }));
const filtered = arr.filter(r => !removeIds.has(r.id));

console.log('Removed:', removed);
console.log(`SLC count: ${before_len} → ${filtered.length}`);

html = before + JSON.stringify(filtered) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

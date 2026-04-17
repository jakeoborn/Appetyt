#!/usr/bin/env node
// Set suburb:true on SLC Park City restaurants that are missing it.
// Park City is ~30 miles from Salt Lake City, so it belongs to SLC_DATA
// but should NOT appear on the main SLC map (the main map now filters suburb:true).
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

let fixed = 0;
arr.forEach(r => {
  if (/park city/i.test(r.neighborhood || '') && !r.suburb) {
    r.suburb = true;
    fixed++;
  }
});

console.log('Park City entries updated: ' + fixed);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');

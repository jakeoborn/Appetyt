#!/usr/bin/env node
// Audit which entries in PARK_DATA / MUSEUM_DATA / MALL_DATA have a
// populated `highlights` array. User wants all Things-to-Do entries
// to have highlights like Dallas Museum of Art does.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function readObjectBlock(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const b = html.indexOf('{', s);
  let d = 0, e = b;
  for (let i = b; i < html.length; i++) {
    if (html[i] === '{') d++;
    if (html[i] === '}') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return (new Function('return ' + html.slice(b, e)))();
}

const structs = ['MALL_DATA', 'PARK_DATA', 'MUSEUM_DATA'];

structs.forEach(name => {
  const obj = readObjectBlock(name);
  if (!obj) { console.log(name + ': not found'); return; }
  console.log('\n=== ' + name + ' ===');
  Object.keys(obj).forEach(city => {
    const arr = obj[city];
    if (!Array.isArray(arr)) return;
    const total = arr.length;
    const withHi = arr.filter(r => Array.isArray(r.highlights) && r.highlights.length > 0).length;
    const pct = total ? ((withHi / total) * 100).toFixed(0) : '0';
    const missing = arr.filter(r => !Array.isArray(r.highlights) || r.highlights.length === 0).map(r => r.name);
    console.log('  ' + city.padEnd(18) + ' ' + withHi + '/' + total + ' have highlights (' + pct + '%)');
    if (missing.length) missing.slice(0, 10).forEach(n => console.log('      missing: ' + n));
  });
});

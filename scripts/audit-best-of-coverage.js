#!/usr/bin/env node
// Audit the Best-Of guide: report which entries in each city's best-of lists
// cannot be matched to a restaurant in the data (so the → arrow is hidden
// and the card is un-clickable). Uses the same normalized matcher as the fix
// in index.html (commit e8a6bc7).
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function readBlock(name) {
  const s = html.indexOf('const ' + name);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  try { return JSON.parse(slice); }
  catch { return (new Function('return ' + slice))(); }
}

const CITY_CONSTS = {
  Dallas: 'DALLAS_DATA', Houston: 'HOUSTON_DATA', Chicago: 'CHICAGO_DATA',
  Austin: 'AUSTIN_DATA', 'Salt Lake City': 'SLC_DATA', 'Las Vegas': 'LV_DATA',
  Seattle: 'SEATTLE_DATA', 'New York': 'NYC_DATA',
};

// Extract _bestOfCityLists() return-value object literal.
// Locate `return {` inside the function and brace-walk just that object.
const fnIdx = html.indexOf('_bestOfCityLists()');
if (fnIdx < 0) { console.error('_bestOfCityLists not found'); process.exit(1); }
const returnIdx = html.indexOf('return {', fnIdx);
if (returnIdx < 0) { console.error('return statement not found'); process.exit(1); }
const objStart = html.indexOf('{', returnIdx);
let d = 0, objEnd = objStart;
for (let i = objStart; i < html.length; i++) {
  if (html[i] === '{') d++;
  if (html[i] === '}') { d--; if (d === 0) { objEnd = i + 1; break; } }
}
const objSource = html.slice(objStart, objEnd);
const lists = (new Function('return ' + objSource))();

const norm = v => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function matches(all, name) {
  const sn = norm(name);
  if (!sn) return null;
  let hit = all.find(r => norm(r.name) === sn);
  if (!hit) hit = all.find(r => {
    const rn = norm(r.name);
    if (!rn) return false;
    const min = Math.min(rn.length, sn.length);
    if (min < 7) return false;
    return rn.startsWith(sn) || sn.startsWith(rn);
  });
  return hit || null;
}

let totalMissing = 0, totalChecked = 0;
const report = {};

Object.entries(lists).forEach(([city, cityLists]) => {
  const constName = CITY_CONSTS[city];
  if (!constName) { console.log('  skip city (no data const): ' + city); return; }
  const data = readBlock(constName);
  if (!data) { console.log('  skip city (read failed): ' + city); return; }
  const missingByList = {};
  cityLists.forEach(list => {
    const misses = [];
    list.spots.forEach(s => {
      totalChecked++;
      const hit = matches(data, s.name);
      if (!hit) { misses.push(s.name); totalMissing++; }
    });
    if (misses.length) missingByList[list.title] = misses;
  });
  if (Object.keys(missingByList).length) report[city] = missingByList;
});

console.log('\n=== BEST-OF COVERAGE AUDIT ===');
console.log('Checked: ' + totalChecked + ' list entries across ' + Object.keys(lists).length + ' cities');
console.log('Missing (no matching restaurant in data): ' + totalMissing + ' (' + Math.round(totalMissing / totalChecked * 100) + '%)\n');

Object.entries(report).forEach(([city, byList]) => {
  console.log(city + ':');
  Object.entries(byList).forEach(([title, misses]) => {
    console.log('  ' + title + ':');
    misses.forEach(m => console.log('    - ' + m));
  });
  console.log();
});

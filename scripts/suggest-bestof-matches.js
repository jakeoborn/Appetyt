#!/usr/bin/env node
// For each best-of entry that didn't match, suggest possible canonical
// names in the city's data (Levenshtein-ranked + substring).
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  try { return JSON.parse(slice); } catch { return (new Function('return ' + slice))(); }
}

function lev(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1]
      : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  }
  return dp[m][n];
}

const norm = v => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const missing = {
  'Dallas': { const: 'DALLAS_DATA', names: ['Knife Dallas'] },
  'Houston': { const: 'HOUSTON_DATA', names: ['Snooze', 'Cafe TH', "Les Ba'get", 'Mi Tia Nga', 'Xin Chao', 'The Pastry War', 'Tongue Cut Sparrow'] },
  'Chicago': { const: 'CHICAGO_DATA', names: ['Art of Pizza', "Bartoli's", 'Chicago Cut Steakhouse', 'Sparrow', 'Ann Sather', 'Kanela Breakfast Club', 'Milk Room'] },
  'Austin': { const: 'AUSTIN_DATA', names: ["C-Boy's Heart & Soul"] },
  'Salt Lake City': { const: 'SLC_DATA', names: ['Powder', 'Ichiban Sushi', 'Itto Sushi', "Finn's Cafe", 'Post Office Place', 'Beer Bar', 'The Farm at Canyons'] },
  'Las Vegas': { const: 'LV_DATA', names: ['Sushi by Scratch Restaurants', "Rocco's", 'Ramen Danbo'] },
};

for (const [city, info] of Object.entries(missing)) {
  const arr = readArray(info.const);
  if (!arr) { console.log(city + ': NO DATA'); continue; }
  console.log(`\n=== ${city} ===`);
  for (const name of info.names) {
    const target = norm(name);
    const scored = arr
      .map(r => ({ r, d: lev(target, norm(r.name)), substr: norm(r.name).indexOf(target) > -1 || target.indexOf(norm(r.name)) > -1 }))
      .sort((a, b) => (b.substr ? 1 : 0) - (a.substr ? 1 : 0) || a.d - b.d)
      .slice(0, 4);
    console.log(`  "${name}" →`);
    scored.forEach(s => console.log(`     [${s.d}${s.substr ? '*' : ''}] ${s.r.id} ${s.r.name} (${s.r.neighborhood || ''})`));
  }
}

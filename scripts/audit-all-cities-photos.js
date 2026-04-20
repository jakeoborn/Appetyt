const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');

// Find every `const XXX_DATA=[...]` that holds restaurant cards
const cityRe = /const\s+([A-Z][A-Z_]+?)_DATA\s*=\s*\[/g;
const cities = [];
let m;
while ((m = cityRe.exec(c)) !== null) {
  cities.push({ name: m[1], markerStart: m.index, arrStart: c.indexOf('[', m.index + m[0].length - 1) });
}

function findArrEnd(start) {
  let i = start, depth = 0, inStr = false, esc = false;
  while (i < c.length) {
    const ch = c[i];
    if (esc) esc = false;
    else if (ch === '\\') esc = true;
    else if (ch === '"') inStr = !inStr;
    else if (!inStr) {
      if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return i; }
    }
    i++;
  }
  return -1;
}

function splitCards(txt) {
  const cards = [];
  let j = 1, dj = 0, js = -1, jnStr = false, jesc = false;
  while (j < txt.length - 1) {
    const ch = txt[j];
    if (jesc) jesc = false;
    else if (ch === '\\') jesc = true;
    else if (ch === '"') jnStr = !jnStr;
    else if (!jnStr) {
      if (ch === '{') { if (dj === 0) js = j; dj++; }
      else if (ch === '}') { dj--; if (dj === 0) { cards.push(txt.substring(js, j+1)); js = -1; } }
    }
    j++;
  }
  return cards;
}

const results = [];
for (const city of cities) {
  const end = findArrEnd(city.arrStart);
  if (end < 0) continue;
  const txt = c.substring(city.arrStart, end + 1);
  // Heuristic: skip arrays that don't look like restaurant cards
  if (!/"id":\d+/.test(txt.substring(0, 2000))) continue;
  if (!/"photoUrl"|"photos"|"address"/.test(txt.substring(0, 5000))) continue;
  const cards = splitCards(txt);
  if (cards.length < 10) continue; // skip small config arrays

  let noPhotosField = 0, emptyArr = 0, short = 0, good = 0, total = cards.length;
  for (const card of cards) {
    if (!/"id":\d+/.test(card)) continue;
    const ph = card.match(/"photos":\[([^\]]*)\]/);
    if (!ph) { noPhotosField++; continue; }
    let arr; try { arr = JSON.parse('[' + ph[1] + ']'); } catch (e) { arr = []; }
    if (arr.length === 0) emptyArr++;
    else if (arr.length < 3) short++;
    else good++;
  }
  const missing = noPhotosField + emptyArr;
  results.push({ city: city.name, total, good, short, emptyArr, noPhotosField, missing });
}

// Sort by missing count desc
results.sort((a, b) => b.missing - a.missing);

console.log('GALLERY COVERAGE BY CITY\n');
console.log('CITY'.padEnd(22), 'TOTAL'.padStart(7), 'GOOD(3+)'.padStart(10), 'SHORT(1-2)'.padStart(12), 'MISSING'.padStart(10));
console.log(''.padEnd(65, '-'));
let tTotal = 0, tGood = 0, tShort = 0, tMissing = 0;
for (const r of results) {
  console.log(r.city.padEnd(22), String(r.total).padStart(7), String(r.good).padStart(10), String(r.short).padStart(12), String(r.missing).padStart(10));
  tTotal += r.total; tGood += r.good; tShort += r.short; tMissing += r.missing;
}
console.log(''.padEnd(65, '-'));
console.log('TOTAL'.padEnd(22), String(tTotal).padStart(7), String(tGood).padStart(10), String(tShort).padStart(12), String(tMissing).padStart(10));

fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/all-cities-photo-audit.json', JSON.stringify(results, null, 2));

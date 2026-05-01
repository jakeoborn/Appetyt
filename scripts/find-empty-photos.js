const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function findArrayBounds(html, cityName) {
  const start = html.indexOf(cityName + '=[');
  if (start === -1) return null;
  const arrayStart = start + cityName.length + 1;
  let pos = arrayStart, depth = 0, inStr = false, esc = false;
  while (pos < html.length) {
    const ch = html[pos];
    if (esc) { esc = false; pos++; continue; }
    if (ch === '\\' && inStr) { esc = true; pos++; continue; }
    if (ch === '"') { inStr = !inStr; pos++; continue; }
    if (!inStr) {
      if (ch === '[' || ch === '{') depth++;
      else if (ch === ']' || ch === '}') { depth--; if (depth === 0) return { start: arrayStart, end: pos }; }
    }
    pos++;
  }
  return null;
}

const cities = ['AUSTIN_DATA','SLC_DATA','LV_DATA','SF_DATA','NYC_DATA','DALLAS_DATA','CHICAGO_DATA','LA_DATA','HOUSTON_DATA','SA_DATA','MIAMI_DATA','CHARLOTTE_DATA','PHX_DATA','SEATTLE_DATA','SD_DATA'];
const empty = [];

for (const city of cities) {
  const bounds = findArrayBounds(html, city);
  if (!bounds) continue;
  let arr;
  try { arr = JSON.parse(html.slice(bounds.start, bounds.end + 1)); } catch(e) { console.log(city + ': parse error'); continue; }
  for (const r of arr) {
    if (!r.photoUrl || r.photoUrl.trim() === '') {
      empty.push({ city, id: r.id, name: r.name, website: r.website || '', address: r.address || '' });
    }
  }
}

console.log('Total empty photoUrl:', empty.length);
const byCityCount = {};
for (const r of empty) byCityCount[r.city] = (byCityCount[r.city] || 0) + 1;
for (const [city, count] of Object.entries(byCityCount)) console.log(`  ${city}: ${count}`);

fs.writeFileSync('scripts/data/empty-photos.json', JSON.stringify(empty, null, 2));
console.log('\nWrote scripts/data/empty-photos.json');

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

const cities = ['AUSTIN_DATA', 'SLC_DATA', 'LV_DATA', 'SF_DATA'];
const withSite = [], noSite = [];

for (const city of cities) {
  const bounds = findArrayBounds(html, city);
  if (!bounds) continue;
  const arr = JSON.parse(html.slice(bounds.start, bounds.end + 1));
  for (const r of arr) {
    if (!r.dishes || r.dishes.length === 0) {
      const entry = { city, id: r.id, name: r.name, website: r.website || '', menuUrl: r.menuUrl || '' };
      if (r.website || r.menuUrl) withSite.push(entry);
      else noSite.push(entry);
    }
  }
}

console.log(`Total empty dishes: ${withSite.length + noSite.length}`);
console.log(`With website/menuUrl: ${withSite.length}`);
console.log(`Without any URL: ${noSite.length}\n`);

for (const city of cities) {
  const ws = withSite.filter(r => r.city === city);
  const ns = noSite.filter(r => r.city === city);
  console.log(`${city}: ${ws.length} with site, ${ns.length} without`);
}

// Write the with-site list for agent-browser targeting
fs.writeFileSync('scripts/data/empty-dishes-with-site.json', JSON.stringify(withSite, null, 2));
console.log('\nWrote scripts/data/empty-dishes-with-site.json');

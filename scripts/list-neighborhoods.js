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

const cities = ['SLC_DATA','LV_DATA','SF_DATA'];
for (const city of cities) {
  const bounds = findArrayBounds(html, city);
  if (!bounds) { console.log(city + ': not found'); continue; }
  const arr = JSON.parse(html.slice(bounds.start, bounds.end + 1));
  const hoods = {};
  for (const r of arr) {
    const n = r.neighborhood || '(none)';
    hoods[n] = (hoods[n] || 0) + 1;
  }
  const sorted = Object.entries(hoods).sort((a,b) => b[1]-a[1]);
  console.log(`\n${city} (${arr.length} entries, ${sorted.length} neighborhoods):`);
  sorted.forEach(([n, c]) => console.log(`  ${c.toString().padStart(3)}  ${n}`));
}

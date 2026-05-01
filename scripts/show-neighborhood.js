const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const city = process.argv[2];
const hood = process.argv[3];

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

const b = findArrayBounds(html, city);
const arr = JSON.parse(html.slice(b.start, b.end + 1));
const matches = arr.filter(r => r.neighborhood === hood);
console.log(`${city} / ${hood}: ${matches.length} entries`);
matches.forEach(r => console.log(`  ${r.id} ${r.name} | ${r.address}`));

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

for (const city of ['SLC_DATA','LV_DATA','SF_DATA']) {
  const b = findArrayBounds(html, city);
  if (!b) continue;
  const arr = JSON.parse(html.slice(b.start, b.end + 1));
  const maxId = Math.max(...arr.map(r => r.id));
  console.log(`${city}: max ID = ${maxId}, next = ${maxId + 1}`);
}

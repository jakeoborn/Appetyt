const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function findArrayEnd(html, arrayName) {
  const start = html.indexOf(arrayName + '=[');
  if (start === -1) return -1;
  let pos = start + arrayName.length + 1; // pos of '['
  let depth = 0, inString = false, escape = false;
  while (pos < html.length) {
    const ch = html[pos];
    if (escape) { escape = false; pos++; continue; }
    if (ch === '\\' && inString) { escape = true; pos++; continue; }
    if (ch === '"') { inString = !inString; pos++; continue; }
    if (!inString) {
      if (ch === '[' || ch === '{') depth++;
      else if (ch === ']' || ch === '}') { depth--; if (depth === 0) return pos; }
    }
    pos++;
  }
  return -1;
}

const cities = ['AUSTIN_DATA', 'SLC_DATA', 'LV_DATA', 'SF_DATA'];
for (const city of cities) {
  const start = html.indexOf(city + '=[');
  if (start === -1) { console.log(city + ': NOT FOUND'); continue; }
  const arrayStart = start + city.length + 1; // position of '['
  const end = findArrayEnd(html, city);
  if (end === -1) { console.log(city + ': array end not found'); continue; }
  try {
    const arr = JSON.parse(html.slice(arrayStart, end + 1)); // include '[' and ']'
    console.log(`${city}: VALID (${arr.length} entries)`);
  } catch(e) {
    const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || 0);
    const absPos = arrayStart + pos;
    console.log(`${city}: ERROR at pos ${pos} (abs ${absPos}): ${e.message}`);
    console.log('  Context:', JSON.stringify(html.slice(absPos - 30, absPos + 50)));
  }
}

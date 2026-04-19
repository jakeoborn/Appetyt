const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cityKeys = ['Las Vegas','Dallas','New York','Houston','Austin','Chicago','Salt Lake City','Seattle'];

function stackFindClose(str, open) {
  let depth = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

cityKeys.forEach(city => {
  const marker = `'${city}': {`;
  const idx = html.indexOf(marker);
  if (idx === -1) { console.log(city, 'not found'); return; }
  const tIdx = html.indexOf('thingsToDo:', idx);
  if (tIdx === -1) { console.log(city, 'no thingsToDo'); return; }
  const openBracket = html.indexOf('[', tIdx);
  const closeBracket = stackFindClose(html, openBracket);
  const body = html.substring(openBracket + 1, closeBracket);
  const entries = body.match(/^\s*\{emoji:/gm) || [];
  const preview = html.substring(closeBracket, closeBracket + 60).replace(/\n/g, '\\n');
  console.log(`${city}: entries=${entries.length} openIdx=${openBracket} closeIdx=${closeBracket} after="${preview}"`);
});

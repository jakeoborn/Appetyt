const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const varName = 'CHICAGO_DATA';
const declStart = html.indexOf('const ' + varName + '=');
const open = html.indexOf('[', declStart);
let depth = 0, close = open;
for (let j = open; j < html.length; j++) { if (html[j] === '[') depth++; else if (html[j] === ']') { depth--; if (depth === 0) { close = j; break; } } }
const sliceStart = open, sliceEnd = close + 1;
const data = eval(html.slice(sliceStart, sliceEnd));

// Canonical-neighborhood remap for new CHI batch entries only
const FIXES = {
  "Stetson's Modern Steak + Sushi": "The Loop",
  "Cantina Loca": "West Loop / Fulton Market",
  "Bar Biscay": "West Loop / Fulton Market",
  "Bar Marilou": "The Loop",
  "Gold Coast Dogs": "The Loop",
  "Bar Goa": "River North",  // already River North, keep
  "Le Sud": "Lincoln Square",  // Roscoe Village closest to Lincoln Square
  "Mfk.": "Lincoln Park",  // Lakeview Diversey closest to Lincoln Park
  "Maude's Liquor Bar": "West Loop / Fulton Market",
  "Gibsons Italia": "West Loop / Fulton Market",
};

let changed = 0;
data.forEach(r => {
  if (FIXES[r.name] && r.neighborhood !== FIXES[r.name]) {
    console.log(`  ${r.name}: ${r.neighborhood} → ${FIXES[r.name]}`);
    r.neighborhood = FIXES[r.name];
    changed++;
  }
});
console.log(`Relabeled ${changed} CHI entries.`);

const serialized = JSON.stringify(data);
html = html.slice(0, sliceStart) + serialized + html.slice(sliceEnd);
fs.writeFileSync('index.html', html);

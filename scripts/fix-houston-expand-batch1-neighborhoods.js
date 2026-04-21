// Relabel 5 new HOU cards to canonical neighborhoods per validate-vocabulary.
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const varName = 'HOUSTON_DATA';
const declStart = html.indexOf('const ' + varName + '=');
const open = html.indexOf('[', declStart);
let depth = 0, close = open;
for (let j = open; j < html.length; j++) {
  if (html[j] === '[') depth++;
  else if (html[j] === ']') { depth--; if (depth === 0) { close = j; break; } }
}
const sliceStart = open, sliceEnd = close + 1;
const data = eval(html.slice(sliceStart, sliceEnd));

// canonical mapping — see scripts/data/canonical-neighborhoods.json
const FIXES = {
  "Spanish Flowers": "Heights",                          // 4701 N Main — Near Northside → Heights (closest canonical)
  "Tony's Restaurant": "Upper Kirby",                    // 3755 Richmond — Greenway → Upper Kirby
  "SpindleTap Brewery": "Northwest Houston",             // 10622 Hirsch Rd — far-north, closest canonical
  "Fadi's Mediterranean Grill — Westheimer": "West Houston", // 8383 Westheimer — Sharpstown → West Houston
  "Three Brothers Bakery": "Southwest Houston"           // 4036 S Braeswood — Meyerland → Southwest Houston
};

let changed = 0;
data.forEach(r => {
  if (FIXES[r.name]) {
    const from = r.neighborhood;
    r.neighborhood = FIXES[r.name];
    console.log(`  ${r.name}: ${from} → ${r.neighborhood}`);
    changed++;
  }
});
console.log(`Relabeled ${changed} HOU entries.`);

const serialized = JSON.stringify(data);
html = html.slice(0, sliceStart) + serialized + html.slice(sliceEnd);
fs.writeFileSync('index.html', html);

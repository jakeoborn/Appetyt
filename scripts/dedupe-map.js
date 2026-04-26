// Map structural duplication in index.html
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(FILE, 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Find all <html, <body, </html, </body, <head, </head, <!DOCTYPE
const markers = [
  '<!DOCTYPE',
  '<html',
  '</html',
  '<head',
  '</head',
  '<body',
  '</body',
];
console.log('\n=== Document structural markers ===');
for (const m of markers) {
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(m)) hits.push(i+1);
  }
  console.log(`  ${m.padEnd(15)} ×${hits.length}: ${hits.slice(0,5).join(', ')}${hits.length>5?', ...':''}`);
}

// Find duplicate const declarations
console.log('\n=== Duplicate const CITY_DATA declarations ===');
const cityDataRE = /^const ([A-Z_]+_DATA)\s*=/;
const cityHits = {};
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(cityDataRE);
  if (m) (cityHits[m[1]] = cityHits[m[1]] || []).push(i+1);
}
for (const [k, v] of Object.entries(cityHits).sort((a,b) => b[1].length - a[1].length)) {
  console.log(`  ${k.padEnd(20)} ×${v.length}: ${v.slice(0,5).join(', ')}`);
}

// Find duplicate id="..." attributes (only the unique-by-design ones)
console.log('\n=== Duplicate id="X" attributes ===');
const idRE = /<[^>]+\sid="([^"]+)"/g;
const idHits = {};
for (let i = 0; i < lines.length; i++) {
  let m;
  const re = /<[^>]+\sid="([^"]+)"/g;
  while ((m = re.exec(lines[i])) !== null) {
    (idHits[m[1]] = idHits[m[1]] || []).push(i+1);
  }
}
const dupeIds = Object.entries(idHits).filter(([_,v]) => v.length > 1).sort((a,b) => b[1].length - a[1].length);
console.log(`  ${dupeIds.length} ids appear more than once`);
dupeIds.slice(0, 10).forEach(([k,v]) => console.log(`    id="${k}" ×${v.length}: ${v.slice(0,3).join(', ')}${v.length>3?', ...':''}`));

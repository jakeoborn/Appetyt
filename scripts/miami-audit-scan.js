// Read-only scan: find indicators/tag issues in MIAMI_DATA before mutating
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const VALID_INDICATORS = new Set([
  'vegetarian','black-owned','women-owned','lgbtq-friendly','hole-in-the-wall',
  'halal','dive-bar','brewery','outdoor-only','byob'
]);

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));

console.log('Total Miami cards:', arr.length);
console.log('Line index:', idx);

// 1. Invalid indicators
const badInd = [];
for (const c of arr) {
  if (!Array.isArray(c.indicators)) continue;
  const bad = c.indicators.filter(i => !VALID_INDICATORS.has(i));
  if (bad.length) badInd.push({id:c.id, name:c.name, bad, all:c.indicators});
}
console.log('\n=== Invalid indicators ('+ badInd.length +') ===');
badInd.forEach(b => console.log(`  ${b.id} ${b.name}: ${JSON.stringify(b.bad)} (all=${JSON.stringify(b.all)})`));

// 2. Outdoor tag (should be Patio)
const outdoorTag = arr.filter(c => Array.isArray(c.tags) && c.tags.includes('Outdoor'));
console.log('\n=== Cards with "Outdoor" tag ('+ outdoorTag.length +') ===');
outdoorTag.slice(0,15).forEach(c => console.log(`  ${c.id} ${c.name}`));
if (outdoorTag.length > 15) console.log('  ...');

// 3. Cards needing brewery indicator
const breweryNames = ['Cerveceria','Tripping Animals','Casa La Rubia','Beat Culture','Veza Sur','J. Wakefield','Wynwood Brewing','Lincoln\'s Beard','MIA Beer','Concrete Beach','Biscayne Bay Brewing'];
console.log('\n=== Brewery candidates ===');
for (const c of arr) {
  if (breweryNames.some(n => c.name.toLowerCase().includes(n.toLowerCase()))) {
    console.log(`  ${c.id} ${c.name} | indicators=${JSON.stringify(c.indicators||[])} | tags brewery? ${(c.tags||[]).includes('Brewery')}`);
  }
}

// 4. Dive bar candidates
const diveNames = ['Mac\'s Club Deuce','Lost Weekend','Kill Your Idol','Mama Tried','Blackbird Ordinary','Ted\'s Hideaway','Sweet Liberty'];
console.log('\n=== Dive-bar candidates ===');
for (const c of arr) {
  if (diveNames.some(n => c.name.toLowerCase().includes(n.toLowerCase().replace("'","")))) {
    console.log(`  ${c.id} ${c.name} | indicators=${JSON.stringify(c.indicators||[])}`);
  }
}

// 5. R House
console.log('\n=== R House ===');
arr.filter(c => /R House/i.test(c.name)).forEach(c => console.log(`  ${c.id} ${c.name} | indicators=${JSON.stringify(c.indicators||[])}`));

// 6. Veg-forward
console.log('\n=== Vegan/Plant candidates ===');
arr.filter(c => /Plant Food|Della Test|Charcoal Garden|Planta|Atlas Vegan/i.test(c.name)).forEach(c => console.log(`  ${c.id} ${c.name} | indicators=${JSON.stringify(c.indicators||[])}`));

// 7. Tag distribution sample
const tagCount = {};
for (const c of arr) for (const t of (c.tags||[])) tagCount[t] = (tagCount[t]||0)+1;
const sorted = Object.entries(tagCount).sort((a,b)=>b[1]-a[1]);
console.log('\n=== Top 30 tags ===');
sorted.slice(0,30).forEach(([t,n]) => console.log(`  ${n.toString().padStart(4)} ${t}`));

// 8. Indicator distribution
const indCount = {};
for (const c of arr) for (const i of (c.indicators||[])) indCount[i] = (indCount[i]||0)+1;
console.log('\n=== Indicator distribution ===');
Object.entries(indCount).sort((a,b)=>b[1]-a[1]).forEach(([t,n]) => console.log(`  ${n.toString().padStart(4)} ${t}`));

// Miami audit pass 1: indicator + tag fixes
// 1. Strip invalid 'iconic' indicators (21 cards)
// 2. Backfill brewery indicators (6 cards)
// 3. Backfill dive-bar indicators (4 cards)
// 4. Backfill lgbtq-friendly on R House Wynwood
// 5. Backfill vegetarian on Plant Food + Wine, Della Test Kitchen
// 6. Retag 'Outdoor' -> 'Patio'

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const VALID_INDICATORS = new Set([
  'vegetarian','black-owned','women-owned','lgbtq-friendly','hole-in-the-wall',
  'halal','dive-bar','brewery','outdoor-only','byob'
]);

// Indicator backfills, by card id
const ADD_INDICATORS = {
  4128: ['brewery'],   // Cerveceria La Tropical
  4171: ['brewery'],   // Tripping Animals
  4173: ['brewery'],   // Casa La Rubia
  4201: ['brewery'],   // Beat Culture
  4202: ['brewery'],   // Veza Sur
  4203: ['brewery'],   // J. Wakefield
  4143: ['dive-bar'],  // Mama Tried
  4153: ['dive-bar'],  // Blackbird Ordinary
  4155: ['dive-bar'],  // Lost Weekend
  4159: ['dive-bar'],  // Kill Your Idol
  4127: ['lgbtq-friendly'], // R House Wynwood
  4178: ['vegetarian'], // Plant Food + Wine
  4200: ['vegetarian'], // Della Test Kitchen
};

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));

let strippedIconic = 0, backfilled = 0, retagged = 0, retaggedRows = 0;

for (const c of arr) {
  // 1. Strip invalid indicators
  if (Array.isArray(c.indicators) && c.indicators.length) {
    const filtered = c.indicators.filter(i => VALID_INDICATORS.has(i));
    if (filtered.length !== c.indicators.length) {
      strippedIconic += (c.indicators.length - filtered.length);
      c.indicators = filtered;
    }
  } else if (!Array.isArray(c.indicators)) {
    c.indicators = [];
  }

  // 2-5. Backfill indicators
  if (ADD_INDICATORS[c.id]) {
    for (const ind of ADD_INDICATORS[c.id]) {
      if (!c.indicators.includes(ind)) {
        c.indicators.push(ind);
        backfilled++;
      }
    }
  }

  // 6. Retag Outdoor -> Patio
  if (Array.isArray(c.tags) && c.tags.includes('Outdoor')) {
    let rowChanged = false;
    c.tags = c.tags.map(t => {
      if (t === 'Outdoor') { retagged++; rowChanged = true; return 'Patio'; }
      return t;
    });
    // Dedupe in case Patio also already present
    c.tags = [...new Set(c.tags)];
    if (rowChanged) retaggedRows++;
  }
}

lines[idx] = `const MIAMI_DATA=${JSON.stringify(arr)};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');

console.log('Miami audit pass 1 complete:');
console.log(`  invalid indicators stripped: ${strippedIconic}`);
console.log(`  indicators backfilled:       ${backfilled}`);
console.log(`  Outdoor->Patio tag swaps:    ${retagged} on ${retaggedRows} cards`);
console.log(`  total cards: ${arr.length}`);

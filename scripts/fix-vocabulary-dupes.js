// Fix the 13 vocabulary errors found by validate-vocabulary.js:
// - 5 tag case dupes in Dallas: normalize lowercase -> Title Case
// - 1 Houston neighborhood: "The Heights" -> "Heights" (higher count canonical)
// - 2 LV neighborhood: "The Strip (Venetian|Palazzo)" -> "The Strip (The Venetian|The Palazzo)" (higher count canonical)
// - 5 LV duplicate-name: keep "X" (shorter), remove "X Las Vegas" (and case variants like WAKUDA)
// Run: node scripts/fix-vocabulary-dupes.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function modifyConst(constName, mutator) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const arr = JSON.parse(html.slice(a, e));
  const result = mutator(arr);
  html = html.slice(0, a) + JSON.stringify(result.arr) + html.slice(e);
  return result.stats;
}

// DALLAS — tag case normalization
const dallasStats = modifyConst('DALLAS_DATA', arr => {
  const tagMap = {
    'date night': 'Date Night',
    'late night': 'Late Night',
    'casual': 'Casual',
    'family friendly': 'Family Friendly',
    'eat & play': 'Eat & Play',
  };
  let fixed = 0;
  arr.forEach(r => {
    if (r.tags) r.tags = r.tags.map(t => {
      if (tagMap[t]) { fixed++; return tagMap[t]; }
      return t;
    });
  });
  return { arr, stats: { fixed } };
});
console.log('Dallas tag normalization:', dallasStats);

// HOUSTON — "The Heights" -> "Heights"
const houstonStats = modifyConst('HOUSTON_DATA', arr => {
  let fixed = 0;
  arr.forEach(r => {
    if (r.neighborhood === 'The Heights') { r.neighborhood = 'Heights'; fixed++; }
  });
  return { arr, stats: { fixed } };
});
console.log('Houston neighborhood normalization:', houstonStats);

// LAS VEGAS — neighborhood normalization + duplicate-name removal
const lvStats = modifyConst('LV_DATA', arr => {
  let nbhdFixed = 0;
  arr.forEach(r => {
    if (r.neighborhood === 'The Strip (Venetian)') { r.neighborhood = 'The Strip (The Venetian)'; nbhdFixed++; }
    if (r.neighborhood === 'The Strip (Palazzo)') { r.neighborhood = 'The Strip (The Palazzo)'; nbhdFixed++; }
  });

  // Duplicate-name removal: keep shorter (e.g., "Carbone" not "Carbone Las Vegas")
  const groups = {};
  arr.forEach(r => {
    const key = r.name.toLowerCase().replace(/\s+las vegas$/, '').trim();
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  const toRemoveIds = new Set();
  Object.keys(groups).forEach(k => {
    if (groups[k].length > 1) {
      groups[k].sort((a, b) => a.name.length - b.name.length);
      for (let i = 1; i < groups[k].length; i++) toRemoveIds.add(groups[k][i].id);
      console.log('  LV dedup keep:', groups[k][0].name, 'remove:', groups[k].slice(1).map(r => r.name).join(', '));
    }
  });
  const filtered = arr.filter(r => !toRemoveIds.has(r.id));
  return { arr: filtered, stats: { nbhdFixed, removed: toRemoveIds.size, finalCount: filtered.length } };
});
console.log('Las Vegas fixes:', lvStats);

fs.writeFileSync(file, html);
console.log('\n✅ Wrote fixes. Running validator...');

// Re-run validator
try {
  const { execSync } = require('child_process');
  const out = execSync('node ' + require('path').join(__dirname, 'validate-vocabulary.js'), { encoding: 'utf8' });
  console.log(out);
} catch (err) {
  console.log(err.stdout || err.message);
}

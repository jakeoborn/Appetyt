// Fix coordinate outliers identified by audit-coordinates.js:
//   1. Dallas / Toca Madera — coords pointed to Houston; fix to Dallas East Quarter
//   2. SLC / Sapa Sushi Bar & Grill — lat/lng were 0/0; assign real address + coords
//   3. Austin / Lockhart BBQ trio — neighborhood changed from "South Austin" to "Lockhart"
//   4. SLC / 13 Provo+Ogden+Logan outliers — set suburb:true (they are legitimate satellites but
//      were not flagged, which makes them appear as outliers on the primary metro map).
// Run: node scripts/fix-coordinates.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function modifyConst(constName, mutator) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const arr = JSON.parse(html.slice(a, e));
  const stats = mutator(arr);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
  return stats;
}

// ── 1. Dallas: Toca Madera (id 544) — fix Houston coords → East Quarter Dallas ──
const dStats = modifyConst('DALLAS_DATA', arr => {
  const r = arr.find(x => x.id === 544 && x.name === 'Toca Madera');
  if (!r) return { fixed: 0 };
  r.lat = 32.7833;
  r.lng = -96.7826;
  console.log('Dallas: Toca Madera coords → ' + r.lat + ',' + r.lng);
  return { fixed: 1 };
});

// ── 2. SLC: Sapa Sushi Bar & Grill (id 11210) — 722 S State St, Salt Lake City ──
const slcStats1 = modifyConst('SLC_DATA', arr => {
  const r = arr.find(x => x.id === 11210 && x.name === 'Sapa Sushi Bar & Grill');
  if (!r) return { fixed: 0 };
  r.lat = 40.7519;
  r.lng = -111.8878;
  if (!r.address) r.address = '722 S State St, Salt Lake City, UT 84111';
  console.log('SLC: Sapa Sushi coords → ' + r.lat + ',' + r.lng);
  return { fixed: 1 };
});

// ── 3. Austin: Lockhart BBQ trio — fix neighborhood ──
const aStats = modifyConst('AUSTIN_DATA', arr => {
  let fixed = 0;
  const lockhartIds = new Set([5162, 5163, 5164]); // Black's, Kreuz, Smitty's
  arr.forEach(r => {
    if (lockhartIds.has(r.id) && r.neighborhood === 'South Austin') {
      r.neighborhood = 'Lockhart';
      console.log('Austin: ' + r.name + ' neighborhood → Lockhart');
      fixed++;
    }
  });
  return { fixed };
});

// ── 4. SLC: set suburb:true on the 13 legit-suburb entries that lack the flag ──
const slcStats2 = modifyConst('SLC_DATA', arr => {
  const bbox = { minLat: 40.30, maxLat: 41.20, minLng: -112.40, maxLng: -111.40 };
  let fixed = 0;
  arr.forEach(r => {
    if (typeof r.lat !== 'number' || typeof r.lng !== 'number') return;
    if (r.lat === 0 && r.lng === 0) return;
    const outOfBbox = r.lat < bbox.minLat || r.lat > bbox.maxLat || r.lng < bbox.minLng || r.lng > bbox.maxLng;
    if (outOfBbox && !r.suburb) {
      r.suburb = true;
      console.log('SLC: ' + r.name + ' (' + r.neighborhood + ') → suburb:true');
      fixed++;
    }
  });
  return { fixed };
});

fs.writeFileSync(file, html);
console.log('\n✅ Fixes applied:');
console.log('  Dallas:', dStats);
console.log('  SLC (Sapa):', slcStats1);
console.log('  Austin (Lockhart):', aStats);
console.log('  SLC (suburb flags):', slcStats2);

// Re-run audit to confirm
console.log('\n— Re-running audit —');
const { execSync } = require('child_process');
const out = execSync('node ' + require('path').join(__dirname, 'audit-coordinates.js'), { encoding: 'utf8' });
// Just print the summary (first ~6 lines)
console.log(out.split('\n').slice(0, 6).join('\n'));

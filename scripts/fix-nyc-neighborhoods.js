// NYC per-card neighborhood relabel fixes from audit-nyc-neighborhoods.
// Scoped to NYC_DATA.
//
// NOTE: fix-nyc-neighborhoods-consolidation.js exists from another
// agent's earlier work (merged 85 buckets → ~35). Different purpose
// from this surgical per-card script.

const fs = require('fs');
const path = require('path');

const FIXES = [
  // === SEVERE ===
  { id: 1295, to: 'Coney Island / South Brooklyn', reason: 'Pho Hoai: 1906 Avenue U Brooklyn 11229 + coords (40.60,-73.95) — Sheepshead Bay' },
  { id: 1312, to: 'Chelsea',                       reason: "Lolo's Seafood Shack: 25 11th Ave 10011 + coords (40.74,-74.01) — Chelsea/Meatpacking" },
  { id: 1683, to: 'Queens',                        reason: 'Forest Hills Stadium: Forest Hills 11375 + coords (40.72,-73.85) — Queens' },
  { id: 1792, to: 'Astoria',                       reason: "Sal Kris & Charlie's Deli: Astoria 11105 + coords (40.77,-73.91) — Astoria" },
  { id: 1852, to: 'Upper West Side',               reason: 'Pig and Khao: 433 Amsterdam Ave 10024 + coords (40.78,-73.98) — UWS' },

  // === MODERATE (clear address-based) ===
  { id: 1058, to: 'Chinatown',                     reason: "Xi'an Famous Foods: 45 Bayard St 10013 — Chinatown" },
  { id: 1059, to: 'East Village',                  reason: '2 Bros Pizza: 32 St Marks Pl 10003 — East Village' },
  { id: 1118, to: 'Financial District',            reason: 'Mah-Ze-Dahr: 225 Liberty St 10281 — FiDi' },
  { id: 1170, to: 'Greenwich Village',             reason: 'Llama Inn card: 359 6th Ave 10014 + coord (40.73,-74.00) — GV' },
  { id: 1288, to: 'Park Slope / Prospect Heights', reason: "Hanco's: 354 7th Ave Brooklyn 11215 — Park Slope" },
  { id: 1342, to: 'Park Slope / Prospect Heights', reason: 'Ramen Danbo: 52 7th Ave Brooklyn 11217 — Park Slope' },
  { id: 1358, to: 'Bronx',                         reason: 'El Atoradero: 800 E 149th St Bronx 10455 — Bronx' },
  { id: 1424, to: 'Flatiron / NoMad',              reason: 'S&P Lunch: 174 5th Ave 10010 — Flatiron' },
  { id: 1449, to: 'Upper East Side',               reason: 'Bua Thai: 1611 2nd Ave 10028 — UES' },
  { id: 1454, to: 'Williamsburg',                  reason: "K'Far: 97 Wythe Ave Brooklyn 11249 — Williamsburg" },
  { id: 1466, to: 'Carroll Gardens / Cobble Hill', reason: 'Cafe Spaghetti: 126 Union St Brooklyn 11231 — Carroll Gardens' },
  { id: 1486, to: 'Park Slope / Prospect Heights', reason: 'Leland E&D House: 755 Dean St Brooklyn 11238 — Prospect Heights' },
  { id: 1512, to: 'Carroll Gardens / Cobble Hill', reason: 'Mile End Deli: 97 Hoyt St Brooklyn 11217 — Boerum Hill/Carroll Gardens edge' },
  { id: 1539, to: 'Upper West Side',               reason: 'Westville: 2290 Broadway 10024 — UWS' },
  { id: 1619, to: 'East Williamsburg',             reason: 'Pacha NY: 140 Stewart Ave Brooklyn 11237 — East Williamsburg' },
  { id: 1643, to: 'Carroll Gardens / Cobble Hill', reason: 'DUMBO Boulders: 575 Degraw St Brooklyn 11217 — Carroll Gardens, not DUMBO' },
  { id: 1650, to: 'Queens',                        reason: 'Knockdown Center: Maspeth 11378 + coords (40.72,-73.91) — Queens' },
  { id: 1659, to: 'Midtown',                       reason: 'Rough Trade NYC: 1250 6th Ave 10112 — Midtown' },
  { id: 1666, to: 'Williamsburg',                  reason: 'Superior Ingredients: 74 Wythe Ave Brooklyn 11249 — Williamsburg' },
  { id: 1698, to: 'SoHo',                          reason: 'Azul on the Rooftop: 525 Greenwich St 10013 — SoHo/Tribeca edge' },
  { id: 1746, to: 'Upper East Side',               reason: 'Birch Coffee: 171 E 88th St 10128 — UES' },
  { id: 1765, to: 'Financial District',            reason: 'Remi Flower & Coffee: 130 William St 10038 — FiDi' },
  { id: 1785, to: 'Downtown Brooklyn',             reason: 'Claw Daddy: 31 3rd Ave Brooklyn 11217 — Boerum Hill/DT Brooklyn' },
  { id: 1795, to: "Hell's Kitchen",                reason: "All'Antico Vinaio: 729 8th Ave 10036 — Hell's Kitchen" },
  { id: 1818, to: 'Financial District',            reason: 'Kesté: 77 Fulton St 10038 — FiDi' },
  { id: 1833, to: 'Williamsburg',                  reason: 'She Wolf Bakery: 141 Flushing Ave Brooklyn 11205 — Williamsburg' },
  { id: 1853, to: 'Carroll Gardens / Cobble Hill', reason: 'Ugly Baby: 407 Smith St Brooklyn 11231 — Carroll Gardens' },
  { id: 1860, to: 'Coney Island / South Brooklyn', reason: 'Purple Yam: 1314 Cortelyou Rd Brooklyn 11226 — Ditmas Park/S Brooklyn' },
];

const COORD_BUGS = [
  { id: 1040, name: 'Le Pavillon',                issue: 'One Vanderbilt Ave 10017 but coord 40.82,-73.95 is Harlem (should be ~40.753,-73.977)' },
  { id: 1260, name: 'Lavo Italian Restaurant',    issue: '39 E 58th St 10022 but coord 40.84,-73.85 is Bronx' },
  { id: 1426, name: 'Taim',                       issue: '222 Waverly Pl 10014 but coord 40.69,-73.99 is Brooklyn' },
  { id: 1440, name: 'Don Ceviche',                issue: "321 W 44th St 10036 but coord 40.72,-73.99 is SoHo" },
  { id: 1442, name: 'Teranga',                    issue: '1280 5th Ave 10029 but coord 40.76,-73.97 is Midtown' },
  { id: 1445, name: 'Huertas',                    issue: '987 1st Ave 10022 (Sutton Pl) but real venue is 107 E 7th (East Village) — card inconsistent' },
  { id: 1506, name: 'Twin Tails',                 issue: '85 Spring St 10012 but coord 40.77,-73.98 is Midtown' },
  { id: 1570, name: 'Le Dive',                    issue: '221 Bedford Ave Brooklyn 11211 but coord 40.71,-73.99 is LES' },
  { id: 1574, name: "Harriet's Rooftop",          issue: '1170 Broadway 10001 but coord 40.70,-74.00 is FiDi' },
  { id: 1624, name: 'Desert 5 Spot',              issue: '94 Wythe Ave Brooklyn 11249 but coord 40.66,-73.99 is Park Slope' },
  { id: 1838, name: 'Hanjan',                     issue: '36 W 26th St 10010 but coord 40.76,-73.81 is Queens' },
  { id: 1873, name: 'Shuko',                      issue: '47 E 12th St 10003 but coord 40.76,-73.97 is Midtown' },
];

const CHAIN_OR_NO_BUCKET = [
  { id: 1167, name: 'Chick-fil-A',                    issue: 'address "Various locations"; needs a specific location' },
  { id: 1166, name: 'Sweetgreen',                     issue: 'address "Various locations"; needs a specific location' },
  { id: 1706, name: 'NYC Ferry',                      issue: 'Multiple stops' },
  { id: 1572, name: 'The Roof at The Rockaway Hotel', issue: 'Rockaway Park 11694 — needs a Rockaway bucket' },
  { id: 1677, name: 'Statue of Liberty & Ellis Island', issue: 'Liberty Island — offshore' },
];

function findCityRange(html) {
  const patterns = ['const NYC_DATA = [', 'const NYC_DATA =[', 'const NYC_DATA=['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('NYC_DATA not found');
  let depth = 0, end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (!depth) { end = i; break; } }
  }
  return { start, end };
}

function findCardSlice(html, id, cityRange) {
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1;
  for (const a of anchors) {
    const i = html.indexOf(a, cityRange.start);
    if (i >= 0 && i < cityRange.end) { at = i; break; }
  }
  if (at < 0) return null;
  let depth = 0, start = -1;
  for (let i = at; i >= 0; i--) {
    if (html[i] === '}') depth++;
    else if (html[i] === '{') { if (!depth) { start = i; break; } depth--; }
  }
  if (start < 0) return null;
  depth = 0; let end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (!depth) { end = i; break; } }
  }
  return end > 0 ? { start, end } : null;
}

function run() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  let cityRange = findCityRange(html);
  const applied = [], skipped = [];
  for (const fix of FIXES) {
    const slice = findCardSlice(html, fix.id, cityRange);
    if (!slice) { skipped.push({ ...fix, why: 'not found in NYC_DATA' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const m = obj.match(/"neighborhood":"([^"]*)"/);
    if (!m) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    if (m[1] === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + m[1] + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: m[1], to: fix.to, reason: fix.reason });
    cityRange = findCityRange(html);
  }
  fs.writeFileSync(indexPath, html);
  console.log('NYC neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('\nCOORD BUGS: ' + COORD_BUGS.length);
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name);
  console.log('\nCHAIN/NO BUCKET: ' + CHAIN_OR_NO_BUCKET.length);
  for (const c of CHAIN_OR_NO_BUCKET) console.log('  #' + c.id + '  ' + c.name);
  fs.writeFileSync(path.join(__dirname, 'nyc-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS, chain_or_no_bucket: CHAIN_OR_NO_BUCKET }, null, 2));
}

run();

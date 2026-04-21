// Register Miami and Charlotte as first-class cities.
// Adds empty MIAMI_DATA / CHARLOTTE_DATA arrays, then wires each into
// CITY_DATA, CITY_GROUPS, CITY_COORDS, CITY_EMOJI, and (Miami only) WC_HOSTS.
// Idempotent — each step checks whether the change is already present.

const fs = require('fs');
const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');
let changes = [];

// 1) Insert empty MIAMI_DATA + CHARLOTTE_DATA declarations immediately before
//    `const CITY_DATA = {`. We keep them on their own lines so future batch
//    scripts can `match(/const MIAMI_DATA\s*=\s*(\[[\s\S]*?\]);/)` the same way
//    the existing city-expansion scripts match DALLAS/SANANTONIO/etc.
const cityDataMarker = '\nconst CITY_DATA = {';
const markerIdx = html.indexOf(cityDataMarker);
if (markerIdx < 0) throw new Error('CITY_DATA marker not found');

if (!/const MIAMI_DATA\s*=/.test(html)) {
  html = html.slice(0, markerIdx) + '\n\nconst MIAMI_DATA=[];' + html.slice(markerIdx);
  changes.push('created MIAMI_DATA=[]');
}
// Recompute marker after prior insert
const m2 = html.indexOf(cityDataMarker);
if (!/const CHARLOTTE_DATA\s*=/.test(html)) {
  html = html.slice(0, m2) + '\n\nconst CHARLOTTE_DATA=[];' + html.slice(m2);
  changes.push('created CHARLOTTE_DATA=[]');
}

// 2) Register in CITY_DATA = { ... }
for (const [label, varName] of [['Miami', 'MIAMI_DATA'], ['Charlotte', 'CHARLOTTE_DATA']]) {
  const line = `  '${label}': ${varName},`;
  if (html.includes(line)) continue;
  // Insert just before the closing `}` of CITY_DATA (which ends with `};`).
  const re = /const CITY_DATA\s*=\s*{[\s\S]*?}\s*;/;
  html = html.replace(re, (match) => {
    const closeIdx = match.lastIndexOf('}');
    return match.slice(0, closeIdx) + line + '\n' + match.slice(closeIdx);
  });
  changes.push(`CITY_DATA += '${label}'`);
}

// 3) Register in CITY_GROUPS — add '🌊 US Southeast':['Miami','Charlotte']
if (!/US Southeast/.test(html)) {
  html = html.replace(/const CITY_GROUPS\s*=\s*{/,
    `const CITY_GROUPS = {\n  '🌊 US Southeast':['Miami','Charlotte'],`);
  changes.push("CITY_GROUPS += 'US Southeast'");
}

// 4) Register in CITY_COORDS
if (!/'Miami':\[/.test(html)) {
  const re = /('San Diego':\[[-\d., ]+\])([\r\n]+)};/;
  const m = html.match(re);
  if (m) {
    html = html.replace(re, `$1,${m[2]}  'Miami':[25.7617,-80.1918],${m[2]}  'Charlotte':[35.2271,-80.8431]${m[2]}};`);
    changes.push("CITY_COORDS += Miami + Charlotte");
  } else {
    changes.push("CITY_COORDS: regex miss (skipped)");
  }
}

// 5) Register in CITY_EMOJI
if (!/'Miami':'🌴'|'Miami':'🦩'/.test(html)) {
  // Append to the CITY_EMOJI object literal inside buildCityList()
  html = html.replace(/(const CITY_EMOJI\s*=\s*{[^}]*?)(\s*};)/m,
    `$1,\n      'Miami':'🌴','Charlotte':'👑'$2`);
  changes.push("CITY_EMOJI += Miami + Charlotte");
}

// 6) Add Miami to WC_HOSTS (Charlotte is NOT a 2026 FIFA World Cup host)
if (!/new Set\(\[[^\]]*'Miami'/.test(html)) {
  html = html.replace(/(const WC_HOSTS = new Set\(\[)([^\]]*)(\]\);)/,
    (_, a, b, c) => `${a}${b},'Miami'${c}`);
  changes.push("WC_HOSTS += Miami");
}

fs.writeFileSync(path, html);
console.log('Applied:');
for (const c of changes) console.log(' -', c);
if (!changes.length) console.log(' (no changes — already applied)');

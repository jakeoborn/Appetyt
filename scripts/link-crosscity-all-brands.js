// Apply cityLinks to all legitimate cross-city brand matches — any tier, not
// just high-end. This complements the earlier high-end-only linker.
//
// SKIP_FUZZY_BRANDS: same fuzzy-normalized name but different real brands.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open) {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === '[') d++;
    else if (str[i] === ']') { d--; if (d === 0) return i; }
  }
  return -1;
}

function locateArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return null;
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  return { arrS, arrE };
}

function parseArray(varName) {
  const pos = locateArray(varName);
  const src = html.substring(pos.arrS, pos.arrE);
  try { return JSON.parse(src); } catch { return new Function('return ' + src)(); }
}

function fuzzyBrand(name, neighborhood) {
  let n = String(name || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  n = n.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (neighborhood) {
    const nbhd = String(neighborhood).toLowerCase().trim();
    if (nbhd && n.endsWith(' ' + nbhd)) n = n.slice(0, -(nbhd.length + 1)).trim();
  }
  n = n.replace(/\s+(north|south|east|west|downtown|uptown|midtown|central|heights|domain|airport|galleria|city center|citycenter|park city|sandy|provo|ogden|henderson|bellevue|belltown|ballard|fremont|katy|pearland|memorial|rockwall|plano|frisco|addison|arlington|irving|the woodlands|woodlands|lehi)$/i, '').trim();
  n = n.replace(/\s+(bbq|barbecue|barbeque|restaurant|steakhouse|steak house|grill|cantina|kitchen|cafe|caf|pizzeria|brewery|brewing|tacos|taqueria|pub|tavern|eatery)s?\.?\s*$/i, '').trim();
  n = n.replace(/'s\b/g, '').replace(/'/g, '');
  n = n.replace(/\s+/g, ' ').trim();
  return n;
}

// Fuzzy brand keys to skip — same normalized name but different real brands
const SKIP_FUZZY_BRANDS = new Set([
  'ruins',           // Dallas Latin cocktail bar vs NYC unrelated bar
  'bar w',           // Dallas Sports Bar vs SLC Steakhouse (different concept)
  'prospect park',   // Houston sports bar vs NYC actual park
  'hamsa',           // Houston Israeli vs Seattle Palestinian (different chef/concept)
  'leo',             // Houston "Leo's River Oaks" (New American) vs NYC "Leo" (Italian)
  'joey',            // Houston JOEY International vs Seattle Joey Bellevue (unrelated names)
  'market street',   // Houston shopping district vs SLC Market Street Grill (seafood)
  'garage',          // Austin speakeasy vs NYC club
  'este pizza',      // Austin Tavel Bristol-Joseph vs SLC different place
  'arlo',            // Austin "Arlo's" vegan burger truck vs SLC "Arlo" fine-dining American
  'takashi',         // SLC izakaya vs NYC defunct Korean beef
  'the grill',       // too generic
  'public',          // too generic
  'the continental', // too generic
  'common',          // too generic
  'union',           // too generic
  'local',           // too generic
  'the gallery',     // too generic
  'the pour house',  // too generic
  'tiger',           // too generic
]);

const cities = {
  'Dallas': 'const DALLAS_DATA','Houston': 'const HOUSTON_DATA','Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA','Salt Lake City': 'const SLC_DATA','Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA','New York': 'const NYC_DATA',
};

// Parse all data
const perCity = {};
Object.entries(cities).forEach(([c, v]) => { perCity[c] = parseArray(v); });

// Group by fuzzy brand
const brandMap = {};
Object.entries(perCity).forEach(([city, data]) => {
  data.forEach(r => {
    const key = fuzzyBrand(r.name, r.neighborhood);
    if (!key || key.length < 3) return;
    if (!brandMap[key]) brandMap[key] = [];
    brandMap[key].push({ city, ref: r });
  });
});

const linksAdded = [];
const skipped = [];

Object.entries(brandMap).forEach(([brand, entries]) => {
  const citySet = new Set(entries.map(e => e.city));
  if (citySet.size < 2) return;
  if (SKIP_FUZZY_BRANDS.has(brand)) {
    skipped.push({ brand, cities: [...citySet] });
    return;
  }
  const cityList = [...citySet];
  entries.forEach(e => {
    const others = cityList.filter(c => c !== e.city);
    const existing = Array.isArray(e.ref.cityLinks) ? e.ref.cityLinks.slice() : [];
    const existingSet = new Set(existing);
    const added = [];
    others.forEach(oc => {
      if (!existingSet.has(oc)) { existing.push(oc); existingSet.add(oc); added.push(oc); }
    });
    if (added.length) {
      e.ref.cityLinks = existing;
      linksAdded.push({ brand, city: e.city, id: e.ref.id, name: e.ref.name, added });
    }
  });
});

// Write back bottom-up
const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('scripts/crosscity-broad-link-report.json', JSON.stringify({ linksAdded, skipped }, null, 2));

console.log(`Added ${linksAdded.length} cityLinks entries across ${new Set(linksAdded.map(l => l.brand)).size} brands.`);
console.log(`Skipped ${skipped.length} ambiguous fuzzy-name collisions.\n`);
linksAdded.forEach(l => {
  console.log(`  ${l.city}#${l.id} "${l.name}": +${l.added.join(',')}`);
});
console.log('\n--- Skipped (ambiguous) ---');
skipped.forEach(s => console.log(`  ${s.brand} (${s.cities.join(', ')})`));

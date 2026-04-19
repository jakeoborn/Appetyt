// Broader cross-city audit — uses looser brand normalization (fuzzier matching)
// to catch brands my earlier audit missed (e.g., "Terry Black's BBQ" vs
// "Terry Black's Barbecue"). Also includes all tiers (no casual-exclusion).

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open) {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === '[') d++;
    else if (str[i] === ']') { d--; if (d === 0) return i; }
  }
  return -1;
}

function parseArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  const src = html.substring(arrS, arrE);
  try { return JSON.parse(src); } catch { return new Function('return ' + src)(); }
}

// Stronger normalization: strip possessives, common biz suffixes, trailing
// location qualifiers, punctuation. "Terry Black's Barbecue" and
// "Terry Black's BBQ" should both normalize to "terry black".
function fuzzyBrand(name, neighborhood) {
  let n = String(name || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  // Strip parenthetical
  n = n.replace(/\s*\([^)]*\)\s*$/, '').trim();
  // Strip neighborhood suffix if it matches the entry's neighborhood
  if (neighborhood) {
    const nbhd = String(neighborhood).toLowerCase().trim();
    if (nbhd && n.endsWith(' ' + nbhd)) n = n.slice(0, -(nbhd.length + 1)).trim();
  }
  // Strip directional suffixes
  n = n.replace(/\s+(north|south|east|west|downtown|uptown|midtown|central|heights|domain|airport|galleria|city center|citycenter|park city|sandy|provo|ogden|henderson|bellevue|belltown|ballard|fremont|katy|pearland|memorial|rockwall|plano|frisco|addison|addis|arlington|irving)$/i, '').trim();
  // Strip common cuisine/biz suffixes
  n = n.replace(/\s+(bbq|barbecue|barbeque|restaurant|steakhouse|steak house|grill|cantina|kitchen|cafe|caf|pizzeria|brewery|brewing|tacos|taqueria|kitchen & bar|& grill|& bar|pub|tavern|eatery)s?\.?\s*$/i, '').trim();
  // Normalize apostrophes: treat "terry black's" and "terry blacks" as equal
  n = n.replace(/'s\b/g, '').replace(/'/g, '');
  // Collapse spaces
  n = n.replace(/\s+/g, ' ').trim();
  return n;
}

const cities = {
  'Dallas': 'const DALLAS_DATA','Houston': 'const HOUSTON_DATA','Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA','Salt Lake City': 'const SLC_DATA','Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA','New York': 'const NYC_DATA',
};

const brandMap = {};
Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  data.forEach(r => {
    const key = fuzzyBrand(r.name, r.neighborhood);
    if (!key || key.length < 3) return;
    if (!brandMap[key]) brandMap[key] = [];
    brandMap[key].push({
      city, id: r.id, name: r.name, neighborhood: r.neighborhood,
      score: r.score, price: r.price, cuisine: r.cuisine,
      cityLinks: r.cityLinks || [],
    });
  });
});

const crossCity = Object.entries(brandMap)
  .filter(([k, v]) => new Set(v.map(e => e.city)).size >= 2)
  .sort((a,b) => b[1].length - a[1].length);

// Identify groups NOT already linked: at least one entry with missing cityLinks to a sibling city
const needsLinking = [];
crossCity.forEach(([brand, entries]) => {
  const entryCities = [...new Set(entries.map(e => e.city))];
  let anyMissing = false;
  entries.forEach(e => {
    const sib = entryCities.filter(c => c !== e.city);
    const missing = sib.filter(c => !(e.cityLinks || []).includes(c));
    if (missing.length) anyMissing = true;
  });
  if (anyMissing) needsLinking.push({ brand, entries, entryCities });
});

console.log(`=== BROAD CROSS-CITY BRAND AUDIT ===\n`);
console.log(`Total cross-city brands (any tier): ${crossCity.length}`);
console.log(`Need linking (missing cityLinks): ${needsLinking.length}\n`);

needsLinking.forEach(g => {
  console.log(`[${g.entries.length}] "${g.brand}" across ${g.entryCities.join(', ')}`);
  g.entries.forEach(e => {
    console.log(`  ${e.city}#${e.id} "${e.name}" score:${e.score} $${e.price} [${e.cuisine}] cityLinks:[${(e.cityLinks||[]).join(',')}]`);
  });
  console.log('');
});

fs.writeFileSync('scripts/crosscity-broad-audit.json', JSON.stringify(needsLinking, null, 2));

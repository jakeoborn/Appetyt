// Find same-brand entries across different cities — candidates for cityLinks linking.
// Uses the same normalizeBrand logic as in-city audit but groups across cities.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
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
  try { return JSON.parse(src); }
  catch (e) {
    try { return new Function('return ' + src)(); } catch (e2) { return []; }
  }
}

function normalizeBrand(name, neighborhood) {
  let n = String(name || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  n = n.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (neighborhood) {
    const nbhd = String(neighborhood).toLowerCase().trim();
    if (nbhd && n.endsWith(' ' + nbhd)) {
      const cand = n.slice(0, -(nbhd.length + 1)).trim();
      if (cand.length >= 4) n = cand;
    }
  }
  const trailers = ['north','south','east','west','downtown','uptown','midtown','central','heights','domain','airport','convention center','convention','galleria','city center','citycenter'];
  for (const t of trailers) {
    const re = new RegExp('\\s+' + t + '$');
    if (re.test(n)) {
      const cand = n.replace(re, '').trim();
      if (cand.length >= 4) n = cand;
    }
  }
  return n;
}

const cities = {
  'Dallas': 'const DALLAS_DATA',
  'Houston': 'const HOUSTON_DATA',
  'Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA',
  'Salt Lake City': 'const SLC_DATA',
  'Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA',
  'New York': 'const NYC_DATA',
};

// Collect one record per entry (primary only — these are now post-merge)
const allEntries = [];
Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  data.forEach(r => {
    allEntries.push({
      city, id: r.id, name: r.name, neighborhood: r.neighborhood || '',
      score: r.score || 0, price: r.price || 0,
      cuisine: r.cuisine || '',
      tags: r.tags || [],
      awards: r.awards || '',
      indicators: r.indicators || [],
      locationsCount: Array.isArray(r.locations) ? r.locations.length : 1,
      existingCityLinks: r.cityLinks || [],
    });
  });
});

// Group by normalized brand across cities
const groups = {};
allEntries.forEach(e => {
  const key = normalizeBrand(e.name, e.neighborhood);
  if (!key || key.length < 4) return;
  if (!groups[key]) groups[key] = [];
  groups[key].push(e);
});

// Filter to cross-city groups (entries in 2+ cities)
const crossCity = Object.entries(groups).filter(([k, v]) => {
  const cities = new Set(v.map(e => e.city));
  return cities.size >= 2;
});

crossCity.sort((a, b) => b[1].length - a[1].length);

// Classify: high-end (cityLinks candidate) vs casual (worth reviewing, but same-brand
// casual chains across cities is usually fine — no user-facing action needed)
function tier(e) {
  const cuLower = (e.cuisine || '').toLowerCase();
  const tagSet = new Set((e.tags || []).map(t => String(t).toLowerCase()));
  const awards = String(e.awards || '').toLowerCase();
  const indicatorSet = new Set((e.indicators || []).map(i => String(i).toLowerCase()));
  const fineDiningCu = /(fine dining|omakase|tasting menu|chef's counter|michelin)/.test(cuLower);
  const fineDiningTag = tagSet.has('fine dining') || tagSet.has('tasting menu') || tagSet.has('omakase') || tagSet.has('michelin');
  const michelin = indicatorSet.has('michelin-star') || indicatorSet.has('michelin') || /michelin/.test(awards);
  const hasAwards = awards && awards.length > 5;
  const highPrice = (e.price || 0) >= 3;
  if (michelin || fineDiningCu || fineDiningTag) return 'high-end';
  if (hasAwards && highPrice) return 'high-end';
  if (highPrice) return 'upper-mid';
  return 'casual';
}

// Output
const highEndGroups = [];
const casualGroups = [];
const mixedGroups = [];

crossCity.forEach(([brand, entries]) => {
  const tiers = new Set(entries.map(tier));
  const groupTier = tiers.has('high-end') ? 'high-end' : (tiers.has('upper-mid') ? 'upper-mid' : 'casual');
  const item = {
    brand,
    count: entries.length,
    cities: [...new Set(entries.map(e => e.city))],
    tier: groupTier,
    entries: entries.map(e => ({
      city: e.city, id: e.id, name: e.name, neighborhood: e.neighborhood,
      score: e.score, price: e.price, cuisine: e.cuisine, awards: e.awards,
      indicators: e.indicators, hasLocations: e.locationsCount > 1,
      tier: tier(e), existingCityLinks: e.existingCityLinks,
    })),
  };
  if (groupTier === 'high-end' || groupTier === 'upper-mid') highEndGroups.push(item);
  else casualGroups.push(item);
});

const out = { highEndGroups, casualGroups };
fs.writeFileSync('scripts/crosscity-brand-audit.json', JSON.stringify(out, null, 2));

console.log('=== CROSS-CITY BRAND AUDIT ===\n');
console.log(`High-end / upper-mid cross-city brands (cityLinks candidates): ${highEndGroups.length}`);
highEndGroups.forEach(g => {
  console.log(`\n  [${g.tier}] ${g.brand} (${g.count} entries across ${g.cities.length} cities: ${g.cities.join(', ')})`);
  g.entries.forEach(e => {
    const flags = [];
    if (e.existingCityLinks && e.existingCityLinks.length) flags.push(`already-linked(${e.existingCityLinks.length})`);
    if (e.hasLocations) flags.push('has-locations[]');
    console.log(`    ${e.city}#${e.id} "${e.name}" ($${e.price}) [${e.tier}] ${e.awards ? 'awards:"' + e.awards.slice(0, 40) + '"' : ''} ${flags.join(' ')}`);
  });
});

console.log(`\n\nCasual cross-city brands (usually fine, no action needed): ${casualGroups.length}`);
casualGroups.slice(0, 15).forEach(g => {
  console.log(`  ${g.brand} — ${g.cities.join(', ')} [${g.count} total]`);
});
if (casualGroups.length > 15) console.log(`  ...and ${casualGroups.length - 15} more`);

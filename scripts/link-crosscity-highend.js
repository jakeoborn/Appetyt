// Add cityLinks to high-end / upper-mid cross-city brand entries.
// Rule (user-confirmed 2026-04-18): high-end restaurants with a same-brand
// sibling in another city stay as separate cards, linked via cityLinks.
// Same-city duplicates already merged into locations[] by merge-multilocation.js.
//
// cityLinks format is a simple array of city-name strings (e.g. ["Dallas","Austin"]).
// The renderer looks up the sibling by normalized brand name within each linked city.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
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
  if (!pos) return [];
  const src = html.substring(pos.arrS, pos.arrE);
  try { return JSON.parse(src); }
  catch (e) { try { return new Function('return ' + src)(); } catch (e2) { return []; } }
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

// Ambiguous same-name-but-different-concept pairs — DO NOT link.
// Keyed by sorted brand normalized name.
const SKIP_BRANDS = new Set([
  'hamsa',    // Houston (Miller) vs Seattle — different concepts
  'takashi',  // SLC izakaya vs NYC Korean-beef (closed) — different
  'este pizza', // Austin (Tavel) vs SLC — different concept/price tier
]);

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

function tier(e) {
  const cu = String(e.cuisine || '').toLowerCase();
  const tagSet = new Set((e.tags || []).map(t => String(t).toLowerCase()));
  const awards = String(e.awards || '').toLowerCase();
  const indicatorSet = new Set((e.indicators || []).map(i => String(i).toLowerCase()));
  const fineDiningCu = /(fine dining|omakase|tasting menu|chef's counter|michelin)/.test(cu);
  const fineDiningTag = tagSet.has('fine dining') || tagSet.has('tasting menu') || tagSet.has('omakase') || tagSet.has('michelin');
  const michelin = indicatorSet.has('michelin-star') || indicatorSet.has('michelin') || /michelin/.test(awards);
  const hasAwards = awards && awards.length > 5;
  const highPrice = (e.price || 0) >= 3;
  if (michelin || fineDiningCu || fineDiningTag) return 'high-end';
  if (hasAwards && highPrice) return 'high-end';
  if (highPrice) return 'upper-mid';
  return 'casual';
}

// Load all entries with per-city primary records (post-merge)
const allEntriesByBrand = {};
const perCityData = {};

Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  perCityData[city] = { varName, data };
  data.forEach(r => {
    const key = normalizeBrand(r.name, r.neighborhood);
    if (!key || key.length < 4) return;
    if (!allEntriesByBrand[key]) allEntriesByBrand[key] = [];
    allEntriesByBrand[key].push({ city, ref: r });
  });
});

// For each brand with 2+ cities and at least one high-end/upper-mid tier, add cityLinks.
const linkReport = [];
let totalLinksAdded = 0;

Object.entries(allEntriesByBrand).forEach(([brand, entries]) => {
  const citySet = new Set(entries.map(e => e.city));
  if (citySet.size < 2) return;
  if (SKIP_BRANDS.has(brand)) {
    linkReport.push({ action: 'SKIP', brand, reason: 'ambiguous (different concepts)' });
    return;
  }
  // Group tier = highest across entries
  const tiers = entries.map(e => tier(e.ref));
  const groupTier = tiers.includes('high-end') ? 'high-end' : (tiers.includes('upper-mid') ? 'upper-mid' : 'casual');
  if (groupTier === 'casual') return; // casual chains don't get cityLinks

  const cityList = [...citySet];
  entries.forEach(e => {
    const others = cityList.filter(c => c !== e.city);
    const existing = Array.isArray(e.ref.cityLinks) ? e.ref.cityLinks.slice() : [];
    const existingSet = new Set(existing);
    const added = [];
    others.forEach(oc => {
      if (!existingSet.has(oc)) {
        existing.push(oc);
        existingSet.add(oc);
        added.push(oc);
      }
    });
    if (added.length) {
      e.ref.cityLinks = existing;
      totalLinksAdded += added.length;
      linkReport.push({
        action: 'LINK',
        brand,
        tier: groupTier,
        target: `${e.city}#${e.ref.id} "${e.ref.name}"`,
        added,
        nowLinked: existing.slice(),
      });
    }
  });
});

// Write each city's data back to HTML
// Edit bottom-up to keep earlier indices valid
const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});

ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  const src = JSON.stringify(perCityData[city].data);
  html = html.substring(0, pos.arrS) + src + html.substring(pos.arrE);
});

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('scripts/crosscity-link-report.json', JSON.stringify(linkReport, null, 2));

console.log('=== CROSS-CITY LINK REPORT ===\n');
console.log(`Total cityLinks added: ${totalLinksAdded}\n`);
linkReport.filter(r => r.action === 'LINK').forEach(r => {
  console.log(`  [${r.tier}] ${r.target}: +${r.added.join(',')} (now: ${r.nowLinked.join(',')})`);
});
const skipped = linkReport.filter(r => r.action === 'SKIP');
if (skipped.length) {
  console.log(`\nSkipped ${skipped.length} ambiguous brands:`);
  skipped.forEach(s => console.log(`  ${s.brand} — ${s.reason}`));
}

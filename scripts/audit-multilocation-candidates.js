// Find same-brand multi-entry candidates per city.
// Normalize name (strip trailing location qualifiers in parens, common
// directional/neighborhood suffixes) and group entries that share the
// normalized key. Any group with 2+ members in the same city is a merge
// candidate.

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
  try { return JSON.parse(html.substring(arrS, arrE)); }
  catch (e) {
    try { return new Function('return ' + html.substring(arrS, arrE))(); }
    catch (e2) { return []; }
  }
}

// Normalize name for grouping:
//   "Torchy's Tacos South Lamar" → "torchy's tacos"
//   "Pappasito's Cantina (Galleria)" → "pappasito's cantina"
//   "Hudson House Lakewood" → "hudson house"
// Strategy: lowercase; strip trailing parens; strip trailing neighborhood-like
// suffixes only if what remains is a meaningful brand (2+ words OR 1 long word).
function normalizeBrand(name, neighborhood) {
  let n = String(name || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip trailing parenthetical
  n = n.replace(/\s*\([^)]*\)\s*$/, '').trim();

  // Strip trailing neighborhood (if the entry has one and the name ends with it)
  if (neighborhood) {
    const nbhd = String(neighborhood).toLowerCase().trim();
    // Try exact trailing match first
    if (nbhd && n.endsWith(' ' + nbhd)) {
      const cand = n.slice(0, -(nbhd.length + 1)).trim();
      if (cand.length >= 4) n = cand;
    }
  }

  // Strip common trailing directional/city-subzone words
  const trailers = [
    'north','south','east','west','downtown','uptown','midtown','central',
    'heights','domain','airport','convention center','convention','galleria',
    'city center','citycenter',
  ];
  for (const t of trailers) {
    const re = new RegExp('\\s+' + t + '$');
    if (re.test(n)) {
      const cand = n.replace(re, '').trim();
      if (cand.length >= 4) n = cand;
    }
  }

  // Strip trailing ", city, ST" if present (rare in name field but just in case)
  n = n.replace(/,\s*[a-z .]+,?\s*[a-z]{0,3}$/i, '').trim();

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

const report = {};

Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  const groups = {};

  data.forEach(r => {
    // Skip entries that already have a locations[] array (already merged)
    if (Array.isArray(r.locations) && r.locations.length > 1) return;

    const key = normalizeBrand(r.name, r.neighborhood);
    if (!key || key.length < 4) return;
    if (!groups[key]) groups[key] = [];
    groups[key].push({
      id: r.id,
      name: r.name,
      neighborhood: r.neighborhood,
      address: r.address || '',
      score: r.score || 0,
      cuisine: r.cuisine,
      price: r.price,
      tags: r.tags || [],
      website: r.website || '',
      instagram: r.instagram || '',
      phone: r.phone || '',
      lat: r.lat,
      lng: r.lng,
    });
  });

  // Filter to groups with 2+ entries
  const multi = Object.entries(groups).filter(([k, v]) => v.length >= 2);
  // Sort each group by score desc so [0] is the designated primary
  multi.forEach(([k, v]) => v.sort((a, b) => b.score - a.score));
  // Sort groups by total entries desc
  multi.sort((a, b) => b[1].length - a[1].length);

  report[city] = {
    totalEntries: data.length,
    alreadyMultiLocation: data.filter(r => Array.isArray(r.locations) && r.locations.length > 1).length,
    candidateGroupCount: multi.length,
    candidateEntryCount: multi.reduce((s, [, v]) => s + v.length, 0),
    groups: multi.map(([key, entries]) => ({ key, count: entries.length, entries })),
  };
});

fs.writeFileSync('scripts/multilocation-candidates.json', JSON.stringify(report, null, 2));

// Summary
console.log('=== MULTI-LOCATION CANDIDATE REPORT ===\n');
Object.entries(report).forEach(([city, info]) => {
  console.log(`${city}: ${info.totalEntries} entries · ${info.alreadyMultiLocation} already merged · ${info.candidateGroupCount} brand groups with ${info.candidateEntryCount} total entries to consolidate`);
  info.groups.slice(0, 20).forEach(g => {
    const members = g.entries.map(e => `#${e.id} "${e.name}"${e.neighborhood ? ' (' + e.neighborhood + ')' : ''} [${e.score}]`).join(', ');
    console.log(`  [${g.count}] ${g.key}: ${members}`);
  });
  if (info.groups.length > 20) console.log(`  ...and ${info.groups.length - 20} more groups`);
  console.log('');
});

// Merge multi-location chains and dedupe same-neighborhood same-name entries.
//
// For each city:
//   1. Group entries by normalized brand name (same rule as audit).
//   2. Within each group, split by normalized neighborhood.
//      - Entries sharing a neighborhood → dedupe: keep highest-score, drop rest.
//      - Remaining distinct-neighborhood entries:
//         * If 1 left: nothing to do.
//         * If 2+ left: merge into the highest-score primary. Primary gets a
//           `locations: []` array listing every site (including its own), with
//           { name, address, neighborhood, lat, lng, phone }. Variants are removed.
//
// Explicit skips (ambiguous — user to review):
//   - Houston "Lucille's" (Museum District) vs "Lucille's EaDo (Bludorn / Navy Blue sibling)"
//     → same-name-prefix but the EaDo entry is clearly a sibling concept from a different group.

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
  catch (e) {
    try { return new Function('return ' + src)(); }
    catch (e2) { return []; }
  }
}

function normalizeBrand(name, neighborhood) {
  let n = String(name || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
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

function normalizeNbhd(nbhd) {
  return String(nbhd || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Entries we explicitly won't touch — by (city, id-set). The group's id ≥ 2 means at least 2 ids.
const SKIP_PAIRS = new Set([
  'Houston:7061+7303', // Lucille's vs Lucille's EaDo (sibling concept)
]);

function skipKey(city, entries) {
  const ids = entries.map(e => e.id).sort((a,b)=>a-b).join('+');
  return SKIP_PAIRS.has(`${city}:${ids}`);
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
const ordered = Object.entries(cities).sort((a,b) => {
  const ia = html.search(new RegExp(a[1] + '\\s*=\\s*\\['));
  const ib = html.search(new RegExp(b[1] + '\\s*=\\s*\\['));
  return ib - ia; // last-in-file first so earlier indices stay valid
});

ordered.forEach(([city, varName]) => {
  const data = parseArray(varName);
  if (!data.length) { console.log(`  !! could not parse ${varName}`); return; }
  const pos = locateArray(varName);
  const before = data.length;

  // Build groups of same-brand entries not already merged
  const groups = {};
  data.forEach(r => {
    if (Array.isArray(r.locations) && r.locations.length > 1) return;
    const key = normalizeBrand(r.name, r.neighborhood);
    if (!key || key.length < 4) return;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  const merges = [];
  const removedIds = new Set();

  Object.entries(groups).forEach(([brandKey, entries]) => {
    if (entries.length < 2) return;
    if (skipKey(city, entries)) {
      merges.push({ action: 'SKIP', brandKey, reason: 'explicit skip', ids: entries.map(e=>e.id) });
      return;
    }

    // Sort by score desc
    entries.sort((a,b) => (b.score||0) - (a.score||0));

    // Dedup same-neighborhood entries first (keep highest-score)
    const byNbhd = {};
    entries.forEach(e => {
      const n = normalizeNbhd(e.neighborhood);
      if (!byNbhd[n]) byNbhd[n] = [];
      byNbhd[n].push(e);
    });

    const survivors = [];
    Object.entries(byNbhd).forEach(([nbhd, ents]) => {
      ents.sort((a,b) => (b.score||0) - (a.score||0));
      const keeper = ents[0];
      for (let i = 1; i < ents.length; i++) {
        removedIds.add(ents[i].id);
        merges.push({
          action: 'DEDUPE',
          brandKey,
          kept: { id: keeper.id, name: keeper.name, neighborhood: keeper.neighborhood, score: keeper.score },
          removed: { id: ents[i].id, name: ents[i].name, neighborhood: ents[i].neighborhood, score: ents[i].score },
        });
      }
      survivors.push(keeper);
    });

    if (survivors.length < 2) return; // nothing to merge after dedupe

    // Merge survivors into highest-score primary
    survivors.sort((a,b) => (b.score||0) - (a.score||0));
    const primary = survivors[0];
    const others = survivors.slice(1);

    // Build locations[] array: include primary + each other (all fields)
    const locations = survivors.map(e => ({
      name: e.neighborhood || '',
      neighborhood: e.neighborhood || '',
      address: e.address || '',
      lat: e.lat,
      lng: e.lng,
      phone: e.phone || '',
    }));
    primary.locations = locations;

    // Remove variants
    others.forEach(o => {
      removedIds.add(o.id);
      merges.push({
        action: 'MERGE',
        brandKey,
        primary: { id: primary.id, name: primary.name, neighborhood: primary.neighborhood, score: primary.score },
        merged: { id: o.id, name: o.name, neighborhood: o.neighborhood, score: o.score },
      });
    });
  });

  // Apply removals
  const newData = data.filter(r => !removedIds.has(r.id));
  const after = newData.length;

  // Write back to HTML: use JSON.stringify (strict JSON is safe for all 8 cities
  // including NYC per earlier memory note that NYC_DATA was converted).
  const newSrc = JSON.stringify(newData);
  html = html.substring(0, pos.arrS) + newSrc + html.substring(pos.arrE);

  report[city] = {
    before,
    after,
    removed: before - after,
    mergedGroups: merges.filter(m => m.action === 'MERGE' || m.action === 'DEDUPE').length,
    skippedGroups: merges.filter(m => m.action === 'SKIP').length,
    merges,
  };
});

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('scripts/multilocation-merge-report.json', JSON.stringify(report, null, 2));

console.log('\n=== MULTI-LOCATION MERGE REPORT ===');
Object.entries(report).forEach(([city, info]) => {
  console.log(`\n${city}: ${info.before} → ${info.after} (removed ${info.removed}; ${info.mergedGroups} operations${info.skippedGroups ? '; ' + info.skippedGroups + ' skipped' : ''})`);
  info.merges.forEach(m => {
    if (m.action === 'MERGE') {
      console.log(`  MERGE "${m.merged.name}" (${m.merged.neighborhood}) → #${m.primary.id} "${m.primary.name}" [locations+]`);
    } else if (m.action === 'DEDUPE') {
      console.log(`  DEDUPE remove #${m.removed.id} "${m.removed.name}" (${m.removed.neighborhood}) — keep #${m.kept.id} [${m.kept.score} vs ${m.removed.score}]`);
    } else if (m.action === 'SKIP') {
      console.log(`  SKIP ${m.brandKey} (${m.reason}) — ids: ${m.ids.join(', ')}`);
    }
  });
});

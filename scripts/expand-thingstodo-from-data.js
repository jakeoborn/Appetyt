// Expands CITY_EXTRAS[city].thingsToDo by reusing verified attractions
// already in each city's restaurant data array. No fabrication — only
// fields already on each source entry are copied forward.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// === helpers ===
function stackFindClose(str, open, openCh = '[', closeCh = ']') {
  let depth = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) depth++;
    else if (str[i] === closeCh) { depth--; if (depth === 0) return i; }
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

function isAttraction(r) {
  if (!r) return false;
  const cu = String(r.cuisine || '').toLowerCase();
  const tags = (r.tags || []).map(t => String(t).toLowerCase());
  const name = String(r.name || '').toLowerCase();
  const LANDMARK = /\b(radio city|madison square garden|carnegie hall|forest hills stadium|kennedy center|hollywood bowl|moulin rouge|apollo theater)\b/;
  if (LANDMARK.test(name)) return true;
  if (cu.match(/museum|gallery|attraction|landmark|theater|theatre|cinema|bowling|arcade|gaming|aquarium|zoo|entertainment|sightseeing|observation|botanical|tourist/)) return true;
  if (cu === 'park') return true;
  if (cu.match(/\bpark\b/) && !cu.match(/grill|kitchen|restaurant|bar|pub/)) return true;
  if (tags.some(t => /museum|park|landmark|attraction|aquarium|zoo|activity|entertainment|sightseeing|tourist/.test(t))) return true;
  return false;
}

function isRestaurantMasqueradingAsAttraction(r) {
  const cu = String(r.cuisine || '').toLowerCase();
  const foodCuisines = /(sushi|ramen|italian|mexican|chinese|french|american|steak|seafood|pizza|burger|taco|bbq|barbecue|thai|korean|vietnamese|indian|mediterranean|spanish|greek|japanese|bakery|donut|coffee|deli|sandwich|breakfast|brunch|diner|salad|vegan|vegetarian|cheese|russian|oyster)/;
  if (foodCuisines.test(cu)) {
    if (!/museum|gallery|landmark|theater|theatre|attraction|park|observation|botanical|tourist/.test(cu)) return true;
  }
  return false;
}

function pickEmoji(cuisine) {
  const cu = String(cuisine || '').toLowerCase();
  if (cu.match(/art museum/)) return '🖼';
  if (cu.match(/museum/)) return '🏛';
  if (cu.match(/botanical|garden/)) return '🌿';
  if (cu.match(/park|greenbelt|nature/)) return '🌳';
  if (cu.match(/theater|theatre|cinema/)) return '🎭';
  if (cu.match(/stadium|arena/)) return '🏟';
  if (cu.match(/bridge/)) return '🌉';
  if (cu.match(/beach/)) return '🏖';
  if (cu.match(/zoo/)) return '🦁';
  if (cu.match(/aquarium/)) return '🐠';
  if (cu.match(/bowling/)) return '🎳';
  if (cu.match(/ski/)) return '⛷';
  if (cu.match(/historic|monument/)) return '🏛';
  if (cu.match(/live music|concert/)) return '🎵';
  if (cu.match(/comedy/)) return '🎤';
  if (cu.match(/observation/)) return '🏙';
  if (cu.match(/immersive|entertainment/)) return '✨';
  if (cu.match(/shopping|district/)) return '🛍';
  if (cu.match(/trail/)) return '🚶';
  return '📍';
}

function pickCategory(cuisine) {
  const cu = String(cuisine || '').trim();
  if (!cu) return 'Attraction';
  return cu.split('/')[0].trim() || 'Attraction';
}

function shortDesc(description) {
  if (!description) return '';
  let d = String(description).replace(/<[^>]+>/g, '').trim();
  // Pick the first "real" sentence: ends with . ! or ?, followed by whitespace+uppercase OR end-of-string.
  // Require at least 30 chars so short numeric prefixes ("3.") or initials ("A.") don't cut early.
  const re = /^.{30,}?[.!?](?=\s+[A-Z]|$)/;
  const m = d.match(re);
  if (m && m[0].length <= 220) return m[0].trim();
  if (d.length <= 180) return d;
  return d.slice(0, 177).replace(/\s+\S*$/, '') + '…';
}

function normalizeName(n) {
  return String(n || '').toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function esc(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, ' ')
    .trim();
}

function serializeEntry(t) {
  const parts = [];
  parts.push(`emoji:'${esc(t.emoji)}'`);
  parts.push(`name:'${esc(t.name)}'`);
  parts.push(`category:'${esc(t.category)}'`);
  parts.push(`desc:'${esc(t.desc)}'`);
  if (t.address) parts.push(`address:'${esc(t.address)}'`);
  if (t.website) parts.push(`website:'${esc(t.website)}'`);
  return '{' + parts.join(',') + '}';
}

// Locate thingsToDo[] block for a city and return { openIdx, closeIdx, body, names }
function locateThingsToDo(city) {
  const marker = `'${city}': {`;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const tIdx = html.indexOf('thingsToDo:', idx);
  if (tIdx === -1) return null;
  const openIdx = html.indexOf('[', tIdx);
  const closeIdx = stackFindClose(html, openIdx);
  const body = html.substring(openIdx + 1, closeIdx);
  // Extract top-level entry names: each entry starts with `{emoji:`
  // Split on /,\s*(?=\{emoji:)/ then pick name:'...' from each segment
  const segments = body.split(/,\s*(?=\{emoji:)/);
  const names = [];
  segments.forEach(seg => {
    const m = seg.match(/name:\s*'([^']+)'/);
    if (m) names.push(m[1]);
  });
  return { openIdx, closeIdx, body, names };
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

const CAP = 12;
const report = {};

// Process cities in REVERSE source order so later insertions don't invalidate earlier indices.
// locate indices fresh each time we edit — but since every edit changes html length, the
// safest approach is: edit from the bottom up.
const ordered = Object.entries(cities).sort((a, b) => {
  const ia = html.indexOf(`'${a[0]}': {`);
  const ib = html.indexOf(`'${b[0]}': {`);
  return ib - ia; // later-in-file first
});

ordered.forEach(([city, varName]) => {
  const data = parseArray(varName);
  const atts = data.filter(isAttraction).filter(a => !isRestaurantMasqueradingAsAttraction(a));

  const byName = {};
  atts.forEach(a => {
    const key = normalizeName(a.name);
    if (!byName[key] || (a.score || 0) > (byName[key].score || 0)) byName[key] = a;
  });
  const deduped = Object.values(byName);

  const locate = locateThingsToDo(city);
  if (!locate) {
    console.log(`  !! no thingsToDo block for ${city}`);
    return;
  }

  const existingNorm = new Set(locate.names.map(normalizeName));
  const candidates = deduped.filter(a => {
    const n = normalizeName(a.name);
    for (const ex of existingNorm) {
      if (n === ex) return false;
      if (n.length > 8 && ex.length > 8 && (n.includes(ex) || ex.includes(n))) return false;
    }
    return true;
  });

  candidates.sort((a, b) => (b.score || 0) - (a.score || 0));
  const picked = candidates.slice(0, CAP);

  const newEntries = picked.map(a => ({
    emoji: pickEmoji(a.cuisine),
    name: a.name,
    category: pickCategory(a.cuisine),
    desc: shortDesc(a.description),
    address: a.address || '',
    website: a.website || '',
  })).filter(t => t.desc);

  report[city] = {
    existingCount: locate.names.length,
    candidateCount: candidates.length,
    addedCount: newEntries.length,
    addedList: newEntries.map(t => t.name),
  };

  if (!newEntries.length) return;

  // Build insertion text: append inside the [...] just before the closing ].
  // Preserve the existing formatting style: one indented line per entry.
  const indent = '\n          ';
  const serialized = newEntries.map(serializeEntry).join(',' + indent);
  // Body currently ends with `...}\n        ` (the entries' indent + closing bracket).
  // We need to re-locate bounds now because html may have been mutated by previous cities.
  const fresh = locateThingsToDo(city);
  if (!fresh) { console.log(`  !! lost bounds for ${city}`); return; }
  const before = html.substring(0, fresh.closeIdx);
  const after = html.substring(fresh.closeIdx); // starts at the ]
  // Ensure trailing comma before our insertion
  const trailing = before.replace(/\s+$/, '');
  const needsComma = trailing.endsWith(',') ? '' : ',';
  const newHtml = trailing + needsComma + indent + serialized + '\n        ' + after;
  html = newHtml;
});

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('scripts/thingstodo-expansion-report.json', JSON.stringify(report, null, 2));

console.log('\n=== EXPANSION REPORT ===');
// Sort by original order for readability
['Las Vegas','Dallas','New York','Houston','Austin','Chicago','Salt Lake City','Seattle'].forEach(city => {
  const info = report[city];
  if (!info) return;
  console.log(`\n${city}: ${info.existingCount} → ${info.existingCount + info.addedCount} (+${info.addedCount}; ${info.candidateCount} candidates available)`);
  info.addedList.forEach(n => console.log(`  + ${n}`));
});

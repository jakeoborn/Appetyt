#!/usr/bin/env node
// Audit: every best-of list entry that does not resolve to a restaurant
// in its city's data array. These render WITHOUT a "›" arrow on the
// Best Of page because the normalized-name match fails.
//
// Uses the same lookup the renderer uses (_renderBestOfLists + the
// Dallas fallback at bestOfCityHTML + bestOfNYCHTML): lowercase, strip
// non-alphanumerics, try exact then substring match.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  try { return JSON.parse(slice); }
  catch { return (new Function('return ' + slice))(); }
}

const cityConstMap = {
  'Dallas': 'DALLAS_DATA',
  'Houston': 'HOUSTON_DATA',
  'Chicago': 'CHICAGO_DATA',
  'Austin': 'AUSTIN_DATA',
  'Salt Lake City': 'SLC_DATA',
  'Las Vegas': 'LV_DATA',
  'Seattle': 'SEATTLE_DATA',
  'New York': 'NYC_DATA',
};

// Normalizer matches renderer: v => String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'')
const norm = v => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function matchEntry(entryName, cityArr) {
  const sn = norm(entryName);
  if (!sn) return null;
  const exact = cityArr.find(r => norm(r.name) === sn);
  if (exact) return exact;
  const sub = cityArr.find(r => {
    const rn = norm(r.name);
    return rn && (rn.indexOf(sn) > -1 || sn.indexOf(rn) > -1);
  });
  return sub;
}

// Parse the best-of lists out of index.html.
// Strategy: extract { name: '...', note: '...' } pairs inside each
// city's list block. We walk the html by city label and capture spots.
function parseCityBestOf(cityLabel) {
  // Anchor on the city's block in _bestOfCityLists. For 'Dallas' and
  // 'New York' the lists live in separate methods, so handle those.
  if (cityLabel === 'Dallas') return parseDallasBestOf();
  if (cityLabel === 'New York') return parseCityBlock("bestOfNYCHTML", /bestOfNYCHTML\(\)\s*\{/);
  // Anchor on "'<city>': [" inside _bestOfCityLists().
  const anchor = `'${cityLabel}': [`;
  const start = html.indexOf(anchor);
  if (start < 0) return [];
  // Find the matching ] for that city's array (one level).
  let d = 0, e = start + anchor.length - 1;
  for (let i = e; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const block = html.slice(start, e);
  return extractListsFromBlock(block);
}

function parseDallasBestOf() {
  // Dallas's lists live inside bestOfCityHTML() before the '{ title:'...
  // See L7023-L7086. Anchor: "const lists = [" inside bestOfCityHTML.
  const fn = html.indexOf('bestOfCityHTML(){');
  if (fn < 0) return [];
  const arrStart = html.indexOf('const lists = [', fn);
  if (arrStart < 0) return [];
  const a = html.indexOf('[', arrStart);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return extractListsFromBlock(html.slice(a, e));
}

function parseCityBlock(label, regex) {
  const m = html.match(regex);
  if (!m) return [];
  const fnStart = html.indexOf(m[0]);
  const arrStart = html.indexOf('const lists = [', fnStart);
  if (arrStart < 0) return [];
  const a = html.indexOf('[', arrStart);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return extractListsFromBlock(html.slice(a, e));
}

function extractListsFromBlock(block) {
  const out = [];
  // Split on title: '...' to segment lists.
  const listRegex = /title:\s*(['"])([^'"]+)\1[\s\S]*?spots:\s*\[([\s\S]*?)\]\s*\}/g;
  let m;
  while ((m = listRegex.exec(block)) !== null) {
    const title = m[2];
    const spotsBlock = m[3];
    const spots = [];
    // Extract each { name: '...', note: '...' }. Names use ' or " and
    // may contain escaped apostrophes: \\' or \'.
    const spotRegex = /\{\s*name:\s*(['"])((?:\\.|(?!\1).)*)\1/g;
    let sm;
    while ((sm = spotRegex.exec(spotsBlock)) !== null) {
      const raw = sm[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
      spots.push(raw);
    }
    out.push({ title, spots });
  }
  return out;
}

let totalEntries = 0, totalMissing = 0;
const report = [];

for (const [city, constName] of Object.entries(cityConstMap)) {
  const cityArr = readArray(constName);
  if (!cityArr) { console.error('WARN: no data for ' + city); continue; }
  const lists = parseCityBestOf(city);
  if (!lists.length) { console.error('WARN: no best-of lists parsed for ' + city); continue; }
  const cityMissing = [];
  for (const list of lists) {
    for (const name of list.spots) {
      totalEntries++;
      const hit = matchEntry(name, cityArr);
      if (!hit) {
        totalMissing++;
        cityMissing.push({ list: list.title, name });
      }
    }
  }
  report.push({ city, listCount: lists.length, entryCount: lists.reduce((a,l)=>a+l.spots.length,0), missing: cityMissing });
}

console.log('\n=== Best-Of navigation audit ===\n');
for (const r of report) {
  const pct = r.entryCount ? Math.round(100 * r.missing.length / r.entryCount) : 0;
  console.log(`${r.city}: ${r.missing.length} / ${r.entryCount} missing (${pct}%), ${r.listCount} lists`);
  for (const m of r.missing) {
    console.log(`  [${m.list}] ${m.name}`);
  }
}
console.log(`\nTOTAL: ${totalMissing} / ${totalEntries} missing arrows.`);

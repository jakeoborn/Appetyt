#!/usr/bin/env node
// Tag existing Dim Hour cards with "North America Top 50 Bar" for bars that
// appear on Robb Report's 50 Best Bars in North America list (2026-04-23).
//
// Source: https://robbreport.com/food-drink/spirits/50-best-bars-north-america-sip-and-guzzle-1238013240/
//
// Pattern adapted from scripts/tag-opentable-icons-all.js (surgical edit to
// the `tags` array by id, preserving file formatting).
const fs = require('fs');
const path = require('path');

const TAG = 'North America Top 50 Bar';

const BARS = {
  NYC_DATA: [
    'Sip & Guzzle',          // #1
    'Bar Snack',             // #3
    'Schmuck',               // #4
    'Superbueno',            // #9
    "Martiny's",             // #23
    "Angel's Share",         // #31
    'Overstory',             // #33
    'Double Chicken Please', // #35
    'Attaboy',               // #37
    'Maison Premiere',       // #40
    'Employees Only',        // #45
  ],
  CHICAGO_DATA: [
    'Kumiko',                // #11
    'Best Intentions',       // #16
    "Gus' Sip & Dip",        // #27 (Robb typo: "Sup")
  ],
  MIAMI_DATA: [
    'Cafe La Trova',         // #42
  ],
  HOUSTON_DATA: [
    'Bandista',              // #47
  ],
};

const norm = v => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const startLen = html.length;

function blockBounds(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e };
}

function readArray(constName) {
  const b = blockBounds(constName);
  if (!b) return null;
  const slice = html.slice(b.a, b.e);
  try { return JSON.parse(slice); }
  catch { return (new Function('return ' + slice))(); }
}

function findEntryAndTags(constName, id) {
  const b = blockBounds(constName);
  if (!b) return null;
  const patterns = ['"id":' + id, 'id:' + id];
  let idIdx = -1;
  for (const p of patterns) {
    let i = html.indexOf(p, b.a);
    while (i !== -1 && i < b.e) {
      const nextCh = html[i + p.length];
      if (nextCh === ',' || nextCh === '}' || nextCh === ' ') { idIdx = i; break; }
      i = html.indexOf(p, i + 1);
    }
    if (idIdx > -1) break;
  }
  if (idIdx < 0) return null;
  let open = html.lastIndexOf('{', idIdx);
  let depth = 0, close = -1;
  for (let i = open; i < b.e; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') { depth--; if (depth === 0) { close = i; break; } }
  }
  if (close < 0) return null;
  const entrySlice = html.slice(open, close + 1);
  const tagsRe = /(["']?tags["']?\s*:\s*)\[([^\]]*)\]/;
  const m = tagsRe.exec(entrySlice);
  if (!m) return { open, close, hasTags: false, current: [] };
  const fieldStart = open + m.index;
  const arrayContentStart = fieldStart + m[1].length + 1;
  const arrayContentEnd = fieldStart + m[0].length - 1;
  const current = (m[2].match(/"([^"]+)"|'([^']+)'/g) || [])
    .map(x => x.replace(/^['"]|['"]$/g, ''));
  return { open, close, hasTags: true, current, arrayContentStart, arrayContentEnd };
}

const byCityLog = {};
let totalTagged = 0, totalAlready = 0, totalMissing = 0, totalDupe = 0;

Object.entries(BARS).forEach(([constName, names]) => {
  const arr = readArray(constName);
  if (!arr) { console.error('Could not read ' + constName); return; }
  const log = { tagged: [], already: [], missing: [], duplicates: [] };

  names.forEach(listName => {
    const sn = norm(listName);
    const hits = arr.filter(r => norm(r.name) === sn);
    if (hits.length === 0) { log.missing.push(listName); return; }
    if (hits.length > 1) {
      log.duplicates.push(listName + ' (found ' + hits.length + ': ids ' + hits.map(h => h.id).join(',') + ')');
      return;
    }
    const hit = hits[0];

    const found = findEntryAndTags(constName, hit.id);
    if (!found) { log.missing.push(listName + ' (lookup failed for id=' + hit.id + ')'); return; }

    if (found.current.includes(TAG)) {
      log.already.push(listName + ' (id=' + hit.id + ')');
      return;
    }

    const sample = html.slice(found.arrayContentStart, found.arrayContentEnd);
    const quote = sample.includes('"') ? '"' : (sample.includes("'") ? "'" : '"');
    const sep = sample.trim() === '' ? '' : ',';
    const insertion = sep + quote + TAG + quote;
    html = html.slice(0, found.arrayContentEnd) + insertion + html.slice(found.arrayContentEnd);

    log.tagged.push(listName + ' (id=' + hit.id + ')');
  });

  byCityLog[constName] = log;
  totalTagged += log.tagged.length;
  totalAlready += log.already.length;
  totalMissing += log.missing.length;
  totalDupe += log.duplicates.length;
});

if (totalDupe > 0) {
  console.error('\n*** Ambiguous matches — aborting before write ***');
  Object.entries(byCityLog).forEach(([city, log]) => {
    if (log.duplicates.length) {
      console.error(city + ':');
      log.duplicates.forEach(d => console.error('  ? ' + d));
    }
  });
  process.exit(1);
}

fs.writeFileSync(htmlPath, html);

console.log('=== North America Top 50 Bar tagging ===\n');
Object.entries(byCityLog).forEach(([city, log]) => {
  console.log(city + ':');
  console.log('  Tagged (' + log.tagged.length + '):');
  log.tagged.forEach(x => console.log('    + ' + x));
  if (log.already.length) {
    console.log('  Already tagged (' + log.already.length + '):');
    log.already.forEach(x => console.log('    = ' + x));
  }
  if (log.missing.length) {
    console.log('  Missing (' + log.missing.length + '):');
    log.missing.forEach(x => console.log('    - ' + x));
  }
  console.log();
});
console.log('TOTAL tagged: ' + totalTagged + ' | already: ' + totalAlready + ' | missing: ' + totalMissing);
console.log('File size change: ' + (html.length - startLen) + ' bytes');

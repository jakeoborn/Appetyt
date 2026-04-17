#!/usr/bin/env node
// Validate tag + neighborhood vocabulary across all city data in index.html.
// Fails (exit 1) on:
//   - Tag case-duplicates   (e.g., "Casual" + "casual")
//   - Neighborhood near-duplicates that differ only in "The " prefix, parentheses, punctuation
//   - Duplicate-name entries within a city (including "X Las Vegas" variants)
//
// Prints a summary even when clean. Intended for pre-commit.
// Run: node scripts/validate-vocabulary.js

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

// Own-const cities (JSON-parseable)
const CONSTS = [
  'DALLAS_DATA', 'HOUSTON_DATA', 'CHICAGO_DATA', 'AUSTIN_DATA',
  'SLC_DATA', 'LV_DATA', 'SEATTLE_DATA',
];
// NYC_DATA is a JS object literal (keys unquoted) — we parse entries by regex

function readConstArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  try { return JSON.parse(html.slice(a, e)); } catch { return null; }
}

function readNycEntries() {
  // NYC_DATA const is declared earlier in the file (before CITY_DATA object)
  const s = html.indexOf('const NYC_DATA');
  if (s < 0) return [];
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  let inStr = false, strCh = '', esc = false;
  for (let i = a; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (c === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === '[') d++;
    if (c === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  // Extract just name + neighborhood + tags list per entry via loose regex
  const entries = [];
  // Split roughly on entry boundaries: objects start with {id:
  const objRe = /\{id\s*:\s*(\d+)/g;
  let m;
  const starts = [];
  while ((m = objRe.exec(slice)) !== null) starts.push({ idx: m.index, id: parseInt(m[1], 10) });
  for (let i = 0; i < starts.length; i++) {
    const chunk = slice.slice(starts[i].idx, (i + 1 < starts.length) ? starts[i + 1].idx : slice.length);
    const nm = chunk.match(/name\s*:\s*(["'])([^"']+)\1/);
    const nb = chunk.match(/neighborhood\s*:\s*(["'])([^"']*)\1/);
    const tg = chunk.match(/tags\s*:\s*\[([^\]]*)\]/);
    const tags = tg ? Array.from(tg[1].matchAll(/(["'])([^"']*)\1/g)).map(x => x[2]) : [];
    entries.push({ id: starts[i].id, name: nm ? nm[2] : '', neighborhood: nb ? nb[2] : '', tags });
  }
  return entries;
}

function normalizeNeighborhood(n) {
  return String(n).toLowerCase()
    .replace(/\bthe\s+/g, '')
    .replace(/[(),.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function normalizeName(n) {
  return String(n).toLowerCase()
    .replace(/\s+las\s+vegas$/, '')
    .replace(/\s+nyc$/, '')
    .replace(/\s+new york$/, '')
    .replace(/^egg\s+slut/, 'eggslut')
    .trim();
}

let errors = [];
let warnings = [];

function audit(cityName, entries) {
  if (!entries || !entries.length) { warnings.push(cityName + ': no entries parsed'); return; }

  // 1) Tag case duplicates (across all entries)
  const tagFreq = {};
  entries.forEach(r => (r.tags || []).forEach(t => {
    const k = String(t);
    tagFreq[k] = (tagFreq[k] || 0) + 1;
  }));
  const tagKeys = Object.keys(tagFreq);
  for (let i = 0; i < tagKeys.length; i++) {
    for (let j = i + 1; j < tagKeys.length; j++) {
      if (tagKeys[i].toLowerCase() === tagKeys[j].toLowerCase()) {
        errors.push(`${cityName}: tag case-duplicate: "${tagKeys[i]}"(${tagFreq[tagKeys[i]]}) <-> "${tagKeys[j]}"(${tagFreq[tagKeys[j]]})`);
      }
    }
  }

  // 2) Neighborhood near-duplicates
  const nbFreq = {};
  entries.forEach(r => {
    const k = r.neighborhood || '';
    nbFreq[k] = (nbFreq[k] || 0) + 1;
  });
  const nbKeys = Object.keys(nbFreq);
  const normMap = {};
  nbKeys.forEach(k => {
    const norm = normalizeNeighborhood(k);
    if (!normMap[norm]) normMap[norm] = [];
    normMap[norm].push(k);
  });
  Object.keys(normMap).forEach(norm => {
    if (normMap[norm].length > 1) {
      errors.push(`${cityName}: neighborhood near-duplicate: ${normMap[norm].map(k => `"${k}"(${nbFreq[k]})`).join(' <-> ')}`);
    }
  });

  // 3) Duplicate-name entries within city (including X Las Vegas variants)
  const nameMap = {};
  entries.forEach(r => {
    const k = normalizeName(r.name);
    if (!nameMap[k]) nameMap[k] = [];
    nameMap[k].push(r.name);
  });
  Object.keys(nameMap).forEach(k => {
    if (nameMap[k].length > 1) {
      // Deduplicate exact matches; only report if there are actually different display names
      const uniq = Array.from(new Set(nameMap[k]));
      if (uniq.length > 1) {
        errors.push(`${cityName}: duplicate-name entries: ${uniq.map(n => `"${n}"`).join(' <-> ')}`);
      }
    }
  });
}

CONSTS.forEach(c => {
  const cityName = c.replace(/_DATA$/, '');
  audit(cityName, readConstArray(c));
});
audit('NEW_YORK', readNycEntries());

if (errors.length) {
  console.log('❌ Vocabulary validation FAILED');
  errors.forEach(e => console.log('  ' + e));
  console.log('\nTotal:', errors.length, 'errors');
  if (warnings.length) { console.log('\nWarnings:'); warnings.forEach(w => console.log('  ' + w)); }
  process.exit(1);
}

console.log('✅ Vocabulary clean');
if (warnings.length) { console.log('\nWarnings:'); warnings.forEach(w => console.log('  ' + w)); }

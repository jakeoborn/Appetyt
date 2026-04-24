#!/usr/bin/env node
/*
 * audit-generic-dishes.js
 *
 * Scans every *_DATA array in index.html for cards whose `dishes` list
 * is filler / generic / empty / thin. Mirrors the shape of
 * audit-bad-photos.js.
 *
 * Severity:
 *   GENERIC  — 2+ placeholder matches in the dishes array
 *   SUSPECT  — 1 placeholder match
 *   EMPTY    — dishes array length === 0
 *   THIN     — dishes array length 1 or 2 (regardless of content)
 *   OK       — 3+ items, no placeholder matches
 *
 * Outputs:
 *   scripts/data/generic-dishes-audit.json
 *   scripts/data/generic-dishes-audit.md
 *
 * Usage: node scripts/audit-generic-dishes.js
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
const OUT_JSON = path.join(__dirname, 'data', 'generic-dishes-audit.json');
const OUT_MD   = path.join(__dirname, 'data', 'generic-dishes-audit.md');

// Strong placeholder phrases — case-insensitive exact-ish match on the whole dish string
// (trimmed + lowercased). These count as placeholder hits.
const STRONG = [
  'classic cocktails',
  'craft cocktails',
  'craft classic cocktails',
  'signature cocktails',
  'seasonal cocktails',
  'seasonal drinks',
  'seasonal menu',
  'seasonal specials',
  'daily specials',
  'house specialties',
  "chef's selection",
  "chef's tasting menu",
  "chef's choice",
  'premium spirits',
  'bar snacks',
  'bar bites',
  'small plates', // very common filler — often the category not a dish
  'appetizers',
  'beer & wine',
  'beer and wine',
  'wine list',
  'wine selection',
  'craft beer',
  'craft beers',
  'tap beer',
  'tap beers',
  'draft beer',
  'local beer',
  'cocktail program',
  'house cocktails',
  'shared plates',
  'tasting menu',
];

// Bare single-word dishes that are almost always filler
const BARE = new Set([
  'cocktails',
  'beer',
  'wine',
  'spirits',
  'snacks',
  'dessert',
  'desserts',
  'coffee',
  'pastries',
  'bread',
  'salads',
  'sandwiches',
  'pizza',
]);

function classifyDish(raw) {
  if (typeof raw !== 'string') return null;
  const lc = raw.trim().toLowerCase();
  if (!lc) return null;
  if (BARE.has(lc)) return 'bare';
  for (const s of STRONG) if (lc === s || lc === s + 's') return 'strong';
  return null;
}

// ---------- parse index.html ----------
const html = fs.readFileSync(FILE, 'utf8');

const CITIES = [
  'NYC_DATA','DALLAS_DATA','AUSTIN_DATA','HOUSTON_DATA','SLC_DATA',
  'SEATTLE_DATA','LV_DATA','CHICAGO_DATA','LA_DATA','PHX_DATA',
  'SD_DATA','MIAMI_DATA','CHARLOTTE_DATA',
];

function findDeclRange(varName, startPos = 0) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const sub = html.slice(startPos);
  const m = re.exec(sub);
  if (!m) return null;
  const bracket = startPos + m.index + m[0].length - 1;
  let depth = 0;
  for (let i = bracket; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (depth === 0) return { start: bracket, end: i }; }
  }
  return null;
}

// Walk a section and yield each top-level card object's {start, end, text}.
function* iterateCards(sectionStart, sectionEnd) {
  let i = sectionStart + 1; // skip opening `[`
  while (i < sectionEnd) {
    while (i < sectionEnd && html[i] !== '{') i++;
    if (i >= sectionEnd) break;
    const start = i;
    let depth = 0;
    for (; i < sectionEnd; i++) {
      const c = html[i];
      if (c === '"') {
        i++;
        while (i < sectionEnd && html[i] !== '"') {
          if (html[i] === '\\') i++;
          i++;
        }
        continue;
      }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    yield { start, end: i, text: html.slice(start, i) };
  }
}

function extractDishes(cardText) {
  // `"dishes":[...]` — balance brackets so we handle nested escapes cleanly.
  const key = '"dishes":';
  const pos = cardText.indexOf(key);
  if (pos < 0) return null;
  let i = pos + key.length;
  while (i < cardText.length && cardText[i] !== '[') i++;
  if (cardText[i] !== '[') return null;
  let depth = 0;
  const arrStart = i;
  for (; i < cardText.length; i++) {
    const c = cardText[i];
    if (c === '"') {
      i++;
      while (i < cardText.length && cardText[i] !== '"') {
        if (cardText[i] === '\\') i++;
        i++;
      }
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  try {
    return JSON.parse(cardText.slice(arrStart, i));
  } catch {
    return null;
  }
}

function extractField(cardText, key) {
  // Simple JSON extraction for a string field from the top level
  const marker = '"' + key + '":"';
  const pos = cardText.indexOf(marker);
  if (pos < 0) return null;
  let i = pos + marker.length;
  let out = '';
  while (i < cardText.length) {
    const c = cardText[i];
    if (c === '\\') { out += cardText[i+1]; i += 2; continue; }
    if (c === '"') break;
    out += c;
    i++;
  }
  return out;
}

function extractNumber(cardText, key) {
  const re = new RegExp('"' + key + '":(\\d+)');
  const m = re.exec(cardText);
  return m ? +m[1] : null;
}

// ---------- run ----------
const results = {
  summary: {},
  byCity: {},
};

let cursor = 0;
// We only look at the first (live) declaration to avoid double-counting the mirror.
for (const varName of CITIES) {
  const range = findDeclRange(varName, 0);
  if (!range) continue;

  const cards = [];
  const cityBuckets = { GENERIC: [], SUSPECT: [], EMPTY: [], THIN: [], OK: [] };

  for (const c of iterateCards(range.start, range.end)) {
    const dishes = extractDishes(c.text);
    const id = extractNumber(c.text, 'id');
    const name = extractField(c.text, 'name') || '(unnamed)';
    const neighborhood = extractField(c.text, 'neighborhood') || '';

    const row = { id, name, neighborhood, dishes };

    if (!Array.isArray(dishes)) {
      // no dishes field at all — count as EMPTY
      row.severity = 'EMPTY';
      row.reasons = ['no dishes field'];
      cityBuckets.EMPTY.push(row);
      cards.push(row);
      continue;
    }

    if (dishes.length === 0) {
      row.severity = 'EMPTY';
      row.reasons = ['empty array'];
      cityBuckets.EMPTY.push(row);
      cards.push(row);
      continue;
    }

    const hits = [];
    for (const d of dishes) {
      const c2 = classifyDish(d);
      if (c2) hits.push({ dish: d, kind: c2 });
    }

    if (hits.length >= 2) {
      row.severity = 'GENERIC';
      row.reasons = hits.map(h => `${h.kind}:${h.dish}`);
      cityBuckets.GENERIC.push(row);
    } else if (hits.length === 1) {
      row.severity = 'SUSPECT';
      row.reasons = hits.map(h => `${h.kind}:${h.dish}`);
      cityBuckets.SUSPECT.push(row);
    } else if (dishes.length <= 2) {
      row.severity = 'THIN';
      row.reasons = [`only ${dishes.length} item${dishes.length === 1 ? '' : 's'}`];
      cityBuckets.THIN.push(row);
    } else {
      row.severity = 'OK';
      row.reasons = [];
      cityBuckets.OK.push(row);
    }
    cards.push(row);
  }

  results.byCity[varName] = {
    total: cards.length,
    GENERIC: cityBuckets.GENERIC.length,
    SUSPECT: cityBuckets.SUSPECT.length,
    EMPTY:   cityBuckets.EMPTY.length,
    THIN:    cityBuckets.THIN.length,
    OK:      cityBuckets.OK.length,
    buckets: cityBuckets,
  };
}

// Aggregate summary
const agg = { total: 0, GENERIC: 0, SUSPECT: 0, EMPTY: 0, THIN: 0, OK: 0 };
for (const [_city, d] of Object.entries(results.byCity)) {
  agg.total    += d.total;
  agg.GENERIC  += d.GENERIC;
  agg.SUSPECT  += d.SUSPECT;
  agg.EMPTY    += d.EMPTY;
  agg.THIN     += d.THIN;
  agg.OK       += d.OK;
}
results.summary = agg;

// ---------- write outputs ----------
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));

const mdLines = [];
mdLines.push('# Generic-dishes audit');
mdLines.push('');
mdLines.push(`_Scanned ${agg.total} cards. ${agg.GENERIC} GENERIC, ${agg.SUSPECT} SUSPECT, ${agg.EMPTY} EMPTY, ${agg.THIN} THIN, ${agg.OK} OK._`);
mdLines.push('');
mdLines.push('## Per-city summary');
mdLines.push('');
mdLines.push('| City | Total | GENERIC | SUSPECT | EMPTY | THIN | OK |');
mdLines.push('|------|-------|---------|---------|-------|------|-----|');
for (const [city, d] of Object.entries(results.byCity)) {
  mdLines.push(`| ${city} | ${d.total} | ${d.GENERIC} | ${d.SUSPECT} | ${d.EMPTY} | ${d.THIN} | ${d.OK} |`);
}
mdLines.push('');

for (const severity of ['GENERIC', 'SUSPECT', 'THIN', 'EMPTY']) {
  const all = [];
  for (const [city, d] of Object.entries(results.byCity)) {
    for (const r of d.buckets[severity]) all.push({ city, ...r });
  }
  if (!all.length) continue;
  mdLines.push(`## ${severity} (${all.length})`);
  mdLines.push('');
  for (const r of all) {
    const dishesFmt = Array.isArray(r.dishes) ? JSON.stringify(r.dishes) : '(no dishes field)';
    mdLines.push(`- **${r.city}** #${r.id} **${r.name}** _(${r.neighborhood})_  `);
    mdLines.push(`  dishes: \`${dishesFmt}\`  `);
    mdLines.push(`  reasons: ${r.reasons.join('; ')}`);
  }
  mdLines.push('');
}

fs.writeFileSync(OUT_MD, mdLines.join('\n'));

console.log(`Scanned ${agg.total} cards across ${Object.keys(results.byCity).length} cities.`);
console.log(`  GENERIC: ${agg.GENERIC}`);
console.log(`  SUSPECT: ${agg.SUSPECT}`);
console.log(`  EMPTY:   ${agg.EMPTY}`);
console.log(`  THIN:    ${agg.THIN}`);
console.log(`  OK:      ${agg.OK}`);
console.log();
console.log(`Wrote ${OUT_JSON}`);
console.log(`Wrote ${OUT_MD}`);

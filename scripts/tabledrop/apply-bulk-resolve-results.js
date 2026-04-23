#!/usr/bin/env node
/*
 * Apply the output of bulk-resolve-reserve-urls.js to NYC_DATA (or any city array).
 * - Only applies results with confidence >= THRESHOLD (default 80).
 * - Corrects r.reservation when resolvedPlatform differs from storedPlatform.
 * - Idempotent.
 *
 * Usage:
 *   node scripts/tabledrop/apply-bulk-resolve-results.js <results.json> [--city-var NYC_DATA] [--min-confidence N] [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'index.html');
const args = process.argv.slice(2);
const resultsPath = args[0];
if (!resultsPath) { console.error('Usage: ...apply-bulk-resolve-results.js <results.json>'); process.exit(1); }
const getFlag = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const CITY_VAR = getFlag('--city-var', 'NYC_DATA');
const MIN_CONF = parseInt(getFlag('--min-confidence', '80'), 10);
const DRY = args.includes('--dry-run');

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const eligible = results.filter(r => r.reserveUrl && (r.confidence || 0) >= MIN_CONF);
const lowConf = results.filter(r => r.reserveUrl && (r.confidence || 0) < MIN_CONF);
const failed = results.filter(r => !r.reserveUrl);

console.log(`Total: ${results.length} | Eligible (conf>=${MIN_CONF}): ${eligible.length} | Low-confidence: ${lowConf.length} | Failed: ${failed.length}`);

let html = fs.readFileSync(HTML_PATH, 'utf8');
let start = html.indexOf('const ' + CITY_VAR + '=');
if (start < 0) start = html.indexOf('const ' + CITY_VAR + ' =');
if (start < 0) throw new Error(CITY_VAR + ' not found');
const arrOpen = html.indexOf('[', start);
let d = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (!d) { arrClose = i + 1; break; } }
}
const before = html.slice(0, arrOpen);
let arrText = html.slice(arrOpen, arrClose);
const after = html.slice(arrClose);

const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

let applied = 0, platformChanges = 0, notFound = [];

for (const u of eligible) {
  const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + u.id + '(?=[,}\\s])');
  const m = idRe.exec(arrText);
  if (!m) { notFound.push(u.id); continue; }

  let s = m.index, bd = 0;
  while (s > 0) {
    const c = arrText[s];
    if (c === '}') bd++;
    else if (c === '{') { if (bd === 0) break; bd--; }
    s--;
  }
  if (arrText[s] !== '{') { notFound.push(u.id); continue; }

  let e = s, fd = 0;
  for (let i = s; i < arrText.length; i++) {
    if (arrText[i] === '{') fd++;
    else if (arrText[i] === '}') { fd--; if (!fd) { e = i; break; } }
  }

  let card = arrText.slice(s, e + 1);
  card = card.replace(/,\s*"?reserveUrl"?\s*:\s*(?:null|"(?:[^"\\]|\\.)*")/g, '');

  if (u.mismatch && u.resolvedPlatform) {
    const resRe = /("?reservation"?\s*:\s*)"([^"]+)"/;
    const rm = card.match(resRe);
    if (rm && rm[2] !== u.resolvedPlatform) {
      card = card.replace(resRe, '$1"' + u.resolvedPlatform + '"');
      platformChanges++;
    }
  }

  const inject = ',"reserveUrl":"' + esc(u.reserveUrl) + '"';
  const newCard = card.slice(0, -1) + inject + '}';
  arrText = arrText.slice(0, s) + newCard + arrText.slice(e + 1);
  applied++;
}

console.log(`Applied: ${applied}/${eligible.length}, platform corrections: ${platformChanges}`);
if (notFound.length) console.error('Not found:', notFound.slice(0, 20), (notFound.length > 20 ? '...' : ''));

if (DRY) { console.log('[dry-run] not writing.'); return; }

const newHtml = before + arrText + after;
fs.writeFileSync(HTML_PATH, newHtml);
console.log(`Wrote index.html (+${newHtml.length - html.length} bytes)`);

// Dump low-confidence + failed for manual review.
const reviewPath = resultsPath.replace(/\.json$/, '-review.json');
fs.writeFileSync(reviewPath, JSON.stringify({ lowConfidence: lowConf, failed }, null, 2));
console.log('Manual-review dump: ' + reviewPath + ' (' + (lowConf.length + failed.length) + ' entries)');

#!/usr/bin/env node
// Tag restaurants across all remaining cities with the "opentable-icon" indicator
// using normalized-name matching against OpenTable Icons lists scraped 2026-04-17.
//
// SAFE APPROACH: surgical per-entry edits of the `indicators` field.
// Does NOT re-serialize any data block. Handles both strict JSON (Chicago/Houston/etc.)
// and JS-object-literal (NYC) formats since we only touch the indicators field.
//
// Dallas was handled in tag-opentable-icons-dallas.js.
// SLC has no OpenTable Icons page.
const fs = require('fs');
const path = require('path');

const INDICATOR = 'opentable-icon';

const ICONS = {
  AUSTIN_DATA: [
    'Red Ash Italia', 'Este', 'Suerte', 'Comedor', 'Hestia', "Jeffrey's Restaurant",
    'Emmer & Rye', 'La Condesa', 'Canje', 'Kemuri Tatsu-ya', "Birdie's",
    'Nixta Taqueria', 'la Barbecue', "Lao'd Bar",
  ],
  CHICAGO_DATA: [
    'Daisies', 'Aba', 'Girl & the Goat', 'Alla Vita', 'Tre Dita', 'Rose Mary',
    'Akahoshi Ramen', 'Lula Cafe', 'Momotaro', 'Boka', 'avec', 'El Che Steakhouse',
    'Swift & Sons', 'Ever', 'Virtue', "Elina's", 'Elske', 'Obelix', 'Sepia',
    'Asador Bastian', 'schwa', 'Esmé', "Charlie Trotter's", 'North Pond', 'Cariño',
    'Moody Tongue',
  ],
  HOUSTON_DATA: [
    'Bludorn', 'Pappas Bros. Steakhouse', 'The Marigold Club', 'ChopnBlok',
    'BCN Taste & Tradition', 'Musaafer', "Kiran's", 'Uchi Houston', 'Navy Blue',
    "Little's Oyster Bar", "Lucille's", 'Hamsa', "Turner's Cut", 'JŪN', 'Julep',
    'March', 'Street To Kitchen', 'Ishtia', 'Belly of the Beast',
  ],
  SEATTLE_DATA: [
    'The Pink Door', 'Communion', 'Lark', 'Sushi Kashiba', 'Atoma',
    'Musang', 'Palace Kitchen', 'Joule', 'TOMO', 'Cafe Juanita',
  ],
  LV_DATA: [
    "Hell's Kitchen", 'Nobu', 'Peter Luger', 'Golden Steer Steakhouse',
    'Top of the World', "Esther's Kitchen", 'Lotus of Siam', 'Brezza',
    'Sparrow + Wolf', 'Restaurant Guy Savoy', 'The Black Sheep', 'Honey Salt',
  ],
  NYC_DATA: [
    'Frenchette', 'Muku', 'San Sabino', 'Estela', 'Gjelina', 'Una Pizza Napoletana',
    "Scarr's Pizza", 'Kabawa', 'Don Angie', "Raf's", 'Soothr', 'Demo', 'The Musket Room',
    'Red Hook Tavern', 'Casa Mono', 'Momofuku Noodle Bar', 'Wildair', 'Gage & Tollner',
    'OIJI MI', "Le Veau d'Or", 'Craft', 'Le B.', 'Tsukimi', 'Strange Delight', 'ASKA',
    'Hav & Mar', 'Tempura Matsui', 'Le Rock', 'Café Mars', 'Caviar Russe', 'Mari',
    'Kochi', 'Le Jardinier', 'Win Son', 'Aquavit',
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

// Find the character range of a single entry's object-literal by its id,
// then return the character range of the `indicators: [...]` array within it,
// along with current values. Works for both strict-JSON ("id":NUM) and
// JS-literal (id:NUM) formats.
function findEntryAndIndicators(constName, id) {
  const b = blockBounds(constName);
  if (!b) return null;
  // Search patterns: "id":NUM and id:NUM
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
  // Find enclosing {}
  let open = html.lastIndexOf('{', idIdx);
  let depth = 0, close = -1;
  for (let i = open; i < b.e; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') { depth--; if (depth === 0) { close = i; break; } }
  }
  if (close < 0) return null;
  const entrySlice = html.slice(open, close + 1);
  // Find indicators field — matches indicators:[...] or "indicators":[...]
  const indRe = /(["']?indicators["']?\s*:\s*)\[([^\]]*)\]/;
  const m = indRe.exec(entrySlice);
  if (!m) return { open, close, hasIndicators: false, current: [] };
  const fieldStart = open + m.index;
  const arrayContentStart = fieldStart + m[1].length + 1; // after [
  const arrayContentEnd = fieldStart + m[0].length - 1;   // before ]
  const current = (m[2].match(/"([^"]+)"|'([^']+)'/g) || [])
    .map(x => x.replace(/^['"]|['"]$/g, ''));
  return { open, close, hasIndicators: true, current, arrayContentStart, arrayContentEnd };
}

const byCityLog = {};
let totalTagged = 0, totalAlready = 0, totalMissing = 0;

Object.entries(ICONS).forEach(([constName, names]) => {
  const arr = readArray(constName);
  if (!arr) { console.error('Could not read ' + constName); return; }
  const log = { tagged: [], already: [], missing: [] };

  names.forEach(listName => {
    const sn = norm(listName);
    // Strict: normalized exact match first.
    let hit = arr.find(r => norm(r.name) === sn);
    // Relaxed: ONE name starts-with the other AND the shorter one is >= 7 chars.
    // This catches "Kemuri Tatsu-ya" ↔ "Kemuri Tatsu-ya" variants but rejects
    // "Ever" ↔ "Monteverde" (substring inside) and "Kira" ↔ "Kirans" (too short).
    if (!hit) hit = arr.find(r => {
      const rn = norm(r.name);
      if (!rn) return false;
      const min = Math.min(rn.length, sn.length);
      if (min < 7) return false;
      return rn.startsWith(sn) || sn.startsWith(rn);
    });
    if (!hit) { log.missing.push(listName); return; }

    const found = findEntryAndIndicators(constName, hit.id);
    if (!found) { log.missing.push(listName + ' (lookup failed for id=' + hit.id + ')'); return; }

    if (found.current.includes(INDICATOR)) {
      log.already.push(listName + ' (id=' + hit.id + ' → ' + hit.name + ')');
      return;
    }

    // Insert INDICATOR into the array. Preserve quote style (detect from existing entries or default).
    // Use double-quotes for strict-JSON arrays (like most city data); single-quote-check fallback.
    const isStrictJSON = /^"/.test(html.slice(found.arrayContentStart, found.arrayContentStart + 1)) ||
                        html.slice(found.arrayContentStart, found.arrayContentEnd).trim() === '';
    // Safer: check how other string items in this specific array are quoted
    const sample = html.slice(found.arrayContentStart, found.arrayContentEnd);
    const quote = sample.includes('"') ? '"' : (sample.includes("'") ? "'" : '"');
    const sep = sample.trim() === '' ? '' : ',';
    const insertion = sep + quote + INDICATOR + quote;
    html = html.slice(0, found.arrayContentEnd) + insertion + html.slice(found.arrayContentEnd);

    log.tagged.push(listName + ' (id=' + hit.id + ' → ' + hit.name + ')');
  });

  byCityLog[constName] = log;
  totalTagged += log.tagged.length;
  totalAlready += log.already.length;
  totalMissing += log.missing.length;
});

fs.writeFileSync(htmlPath, html);

console.log('=== OpenTable Icons tagging summary ===\n');
Object.entries(byCityLog).forEach(([city, log]) => {
  console.log(city + ':');
  console.log('  Tagged (' + log.tagged.length + '):');
  log.tagged.forEach(x => console.log('    + ' + x));
  if (log.already.length) {
    console.log('  Already tagged (' + log.already.length + '):');
    log.already.forEach(x => console.log('    = ' + x));
  }
  if (log.missing.length) {
    console.log('  Missing from our data (' + log.missing.length + '):');
    log.missing.forEach(x => console.log('    - ' + x));
  }
  console.log();
});
console.log('TOTAL tagged: ' + totalTagged + ' | already: ' + totalAlready + ' | missing (not in our data): ' + totalMissing);
console.log('File size change: ' + (html.length - startLen) + ' bytes');

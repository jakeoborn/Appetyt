#!/usr/bin/env node
// Audit same-venue duplicate cards within each city.
// FAIL conditions (both require same normalized address in the same city):
//   (a) name Jaccard >= 0.9 (near-identical name, e.g. "Cafe Carmellini" ~ "Café Carmellini")
//   (b) name Jaccard >= 0.65 AND (same website host OR same IG OR same phone)
// Pure same-address + distinct names is allowed — covers legit co-located venues
// (Bar Masa next to Masa, Momofuku Ssäm/Noodle, hotel + in-hotel restaurants,
// food halls, resort restaurant clusters).
//
// Also flags: a card whose top-level address appears in another card's locations[]
// (means one of them should be folded/deleted).
//
// Exit 0 if clean, 1 if duplicates found.
// Run: node scripts/audit-duplicates.js
//      node scripts/audit-duplicates.js --json > report.json

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

// Allowlist of verified non-duplicate pairs (same address, distinct venues)
const allowlistPath = path.join(__dirname, 'duplicate-allowlist.json');
const allowlist = fs.existsSync(allowlistPath)
  ? JSON.parse(fs.readFileSync(allowlistPath, 'utf8')).pairs || []
  : [];
const allowKey = (a, b) => [a, b].sort((x, y) => x - y).join(':');
const allowSet = new Set(allowlist.map(p => allowKey(p.ids[0], p.ids[1])));

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  try { return JSON.parse(html.slice(a, e)); }
  catch { try { return (new Function('return ' + html.slice(a, e)))(); } catch { return null; } }
}

// All city data arrays. Must match the actual consts in index.html.
const CITIES = {
  NYC_DATA: 'New York',
  DALLAS_DATA: 'Dallas',
  HOUSTON_DATA: 'Houston',
  AUSTIN_DATA: 'Austin',
  LA_DATA: 'Los Angeles',
  CHICAGO_DATA: 'Chicago',
  MIAMI_DATA: 'Miami',
  SEATTLE_DATA: 'Seattle',
  SD_DATA: 'San Diego',
  PHX_DATA: 'Phoenix',
  LV_DATA: 'Las Vegas',
  SA_DATA: 'San Antonio',
  SLC_DATA: 'Salt Lake City',
  CHARLOTTE_DATA: 'Charlotte',
};

function normAddr(addr) {
  if (!addr) return '';
  return String(addr)
    .toLowerCase()
    .replace(/[,#]/g, ' ')
    .replace(/\b(ste|suite|apt|unit)\s*\w+/g, ' ')
    .replace(/\b(west|east|north|south)\b/g, m => m[0])
    .replace(/\b(street|avenue|boulevard|road|drive|lane|court|place|parkway)\b/g, m => m[0])
    .replace(/\s+\d{5}(-\d{4})?$/, '')        // strip zip
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normHost(url) {
  if (!url) return '';
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); }
  catch { return ''; }
}

function normIG(ig) {
  if (!ig) return '';
  return String(ig).replace(/^@/, '').toLowerCase().trim();
}

function nameTokens(n) {
  // Keep descriptive words like "bar", "cafe", "kitchen" — they distinguish
  // sister concepts ("Masa" vs "Bar Masa", "El Alma" vs "El Alma Cafe").
  // Strip only true connectives.
  return new Set(
    String(n || '')
      .toLowerCase()
      .replace(/[’'`]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter(t => t.length > 1 && !['the', 'and', 'of', 'at', 'by'].includes(t))
  );
}

function jaccard(a, b) {
  const A = nameTokens(a), B = nameTokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function normPhone(p) {
  return (p || '').replace(/\D/g, '').replace(/^1/, '');
}

const violations = [];
const cityStats = [];

for (const [key, cityName] of Object.entries(CITIES)) {
  const arr = readArray(key);
  if (!arr) continue;

  // Group by normalized address
  const byAddr = new Map();
  arr.forEach(c => {
    const k = normAddr(c.address);
    if (!k) return;
    if (!byAddr.has(k)) byAddr.set(k, []);
    byAddr.get(k).push(c);
  });

  let cityViolations = 0;
  for (const [addrKey, cards] of byAddr) {
    if (cards.length < 2) continue;

    // All pairs
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const a = cards[i], b = cards[j];
        const sameHost = normHost(a.website) && normHost(a.website) === normHost(b.website);
        const sameIG = normIG(a.instagram) && normIG(a.instagram) === normIG(b.instagram);
        const samePhone = normPhone(a.phone) && normPhone(a.phone) === normPhone(b.phone);
        const nameSim = jaccard(a.name, b.name);

        const anyShared = sameHost || sameIG || samePhone;
        const isDup = nameSim >= 0.9 || (nameSim >= 0.65 && anyShared);
        if (!isDup) continue;
        if (allowSet.has(allowKey(a.id, b.id))) continue;

        const signals = [];
        if (sameHost) signals.push('same website');
        if (sameIG) signals.push('same IG');
        if (samePhone) signals.push('same phone');
        if (nameSim >= 0.7) signals.push(`name sim ${nameSim.toFixed(2)}`);

        violations.push({
          city: cityName,
          kind: 'same-address duplicate',
          a: { id: a.id, name: a.name, address: a.address, neighborhood: a.neighborhood, score: a.score },
          b: { id: b.id, name: b.name, address: b.address, neighborhood: b.neighborhood, score: b.score },
          signals,
        });
        cityViolations++;
      }
    }
  }

  // Also: cards whose top-level address matches another card's locations[] address
  const topAddrs = new Map();
  arr.forEach(c => {
    const k = normAddr(c.address);
    if (k) topAddrs.set(k, c);
  });
  arr.forEach(c => {
    const locs = Array.isArray(c.locations) ? c.locations : [];
    locs.forEach(loc => {
      const k = normAddr(loc.address);
      if (!k) return;
      const other = topAddrs.get(k);
      if (!other || other.id === c.id) return;
      // Only flag as orphan if the other card's NAME overlaps the parent's brand.
      // Otherwise it's just a co-located neighbor (shared building / complex).
      const nameSim = jaccard(c.name, other.name);
      if (nameSim < 0.4) return;
      violations.push({
        city: cityName,
        kind: 'card duplicates locations[] entry',
        parent: { id: c.id, name: c.name, primary_address: c.address },
        outpost_address: loc.address,
        orphan_card: { id: other.id, name: other.name, address: other.address, score: other.score },
        name_sim: nameSim,
      });
      cityViolations++;
    });
  });

  cityStats.push({ city: cityName, count: arr.length, violations: cityViolations });
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ violations, cityStats }, null, 2));
} else {
  cityStats.forEach(s => console.log(`  ${s.city.padEnd(20)} ${s.count.toString().padStart(4)} cards | ${s.violations} duplicate pair(s)`));
  if (violations.length === 0) {
    console.log('\n✅ No same-address duplicates detected.');
  } else {
    console.log(`\n❌ ${violations.length} duplicate issue(s) found:\n`);
    violations.forEach(v => {
      if (v.kind === 'same-address duplicate') {
        console.log(`  [${v.city}] ${v.signals.join(', ')}`);
        console.log(`    A #${v.a.id} ${v.a.name} | ${v.a.address} | s${v.a.score}`);
        console.log(`    B #${v.b.id} ${v.b.name} | ${v.b.address} | s${v.b.score}`);
      } else {
        console.log(`  [${v.city}] orphan of already-folded chain`);
        console.log(`    Parent #${v.parent.id} ${v.parent.name} has locations[] entry "${v.outpost_address}"`);
        console.log(`    Orphan #${v.orphan_card.id} ${v.orphan_card.name} | ${v.orphan_card.address} | s${v.orphan_card.score}`);
      }
    });
  }
}

process.exit(violations.length === 0 ? 0 : 1);

#!/usr/bin/env node
// Fast static audit of website + Instagram presence (no HTTP calls).
// Detects: missing fields, malformed URLs, malformed IG handles.
// For broken-link detection use scripts/audit-links.js (slow, runs HTTP).
// Run: node scripts/audit-missing-links.js

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
  try { return JSON.parse(slice); } catch {
    try { return (new Function('return ' + slice))(); } catch { return null; }
  }
}

const CITIES = {
  DALLAS_DATA: 'Dallas', HOUSTON_DATA: 'Houston', CHICAGO_DATA: 'Chicago',
  AUSTIN_DATA: 'Austin', SLC_DATA: 'Salt Lake City', LV_DATA: 'Las Vegas',
  SEATTLE_DATA: 'Seattle', NYC_DATA: 'New York',
};

function isMalformedUrl(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (!s) return null;
  if (/\s/.test(s)) return 'has whitespace';
  if (!/^https?:\/\//i.test(s)) return 'missing http(s)://';
  if (/^https?:\/\/$/.test(s)) return 'empty after scheme';
  if (/example\.com|placeholder|test\.com/i.test(s)) return 'placeholder domain';
  return null;
}

function isMalformedIG(h) {
  if (!h) return null;
  const s = String(h).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return 'full URL instead of handle';
  if (/\s/.test(s)) return 'has whitespace';
  if (/[^a-zA-Z0-9._@]/.test(s)) return 'has invalid chars';
  const stripped = s.replace('@', '');
  if (stripped.length > 30) return 'handle too long';
  if (stripped.length < 1) return 'empty';
  return null;
}

const totals = { total: 0, missingWeb: 0, missingIG: 0, bothMissing: 0, malformedUrls: 0, malformedIGs: 0 };
const byCity = {};

Object.entries(CITIES).forEach(([constName, cityName]) => {
  const arr = readArray(constName);
  if (!arr) return;
  const c = { total: arr.length, missingWeb: 0, missingIG: 0, bothMissing: 0, malformedUrls: 0, malformedIGs: 0, malformedSamples: [] };
  arr.forEach(r => {
    totals.total++;
    const webBad = !r.website || !String(r.website).trim();
    const igBad = !r.instagram || !String(r.instagram).trim();
    if (webBad) { c.missingWeb++; totals.missingWeb++; }
    if (igBad) { c.missingIG++; totals.missingIG++; }
    if (webBad && igBad) { c.bothMissing++; totals.bothMissing++; }
    const uBad = isMalformedUrl(r.website);
    const iBad = isMalformedIG(r.instagram);
    if (uBad) {
      c.malformedUrls++; totals.malformedUrls++;
      if (c.malformedSamples.length < 5) c.malformedSamples.push({ id: r.id, name: r.name, field: 'website', value: r.website, issue: uBad });
    }
    if (iBad) {
      c.malformedIGs++; totals.malformedIGs++;
      if (c.malformedSamples.length < 5) c.malformedSamples.push({ id: r.id, name: r.name, field: 'instagram', value: r.instagram, issue: iBad });
    }
  });
  byCity[cityName] = c;
});

// Print
console.log('='.repeat(60));
console.log('MISSING-LINK AUDIT — ' + totals.total + ' total spots');
console.log('='.repeat(60));
const pct = v => ((v / totals.total) * 100).toFixed(1) + '%';
console.log('Missing website:  ' + totals.missingWeb.toString().padStart(4) + ' (' + pct(totals.missingWeb) + ')');
console.log('Missing Instagram:' + totals.missingIG.toString().padStart(4) + ' (' + pct(totals.missingIG) + ')');
console.log('Missing BOTH:     ' + totals.bothMissing.toString().padStart(4));
console.log('Malformed URLs:   ' + totals.malformedUrls.toString().padStart(4));
console.log('Malformed IGs:    ' + totals.malformedIGs.toString().padStart(4));
console.log();
console.log('Per city:');
const order = ['Dallas','Houston','Chicago','Austin','Salt Lake City','Las Vegas','Seattle','New York'];
order.forEach(name => {
  const c = byCity[name]; if (!c) return;
  const p = (v) => ((v / c.total) * 100).toFixed(0) + '%';
  console.log('  ' + name.padEnd(16) + ' | tot ' + c.total.toString().padStart(4) + ' | web ✗ ' + c.missingWeb.toString().padStart(4) + ' (' + p(c.missingWeb).padStart(3) + ') | ig ✗ ' + c.missingIG.toString().padStart(4) + ' (' + p(c.missingIG).padStart(3) + ') | both ✗ ' + c.bothMissing.toString().padStart(3) + ' | mal urls ' + c.malformedUrls + ' ig ' + c.malformedIGs);
  if (c.malformedSamples.length) {
    c.malformedSamples.forEach(s => console.log('    • ' + s.field + ' malformed on [' + s.id + '] ' + s.name + ' → "' + s.value + '" (' + s.issue + ')'));
  }
});

fs.writeFileSync(path.join(__dirname, 'missing-links-report.json'), JSON.stringify({ totals, byCity }, null, 2));
console.log('\nReport → scripts/missing-links-report.json');

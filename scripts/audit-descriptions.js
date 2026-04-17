#!/usr/bin/env node
// Audit restaurant descriptions against the "3-4 sentence spicy/informative" standard.
// Flags:
//   - Too short (< 180 chars, roughly 1-2 sentences)
//   - Too few sentences (< 2 periods/terminators)
//   - Generic language ("great restaurant", "delicious food", etc.)
//   - Missing concrete detail (no chef name / signature dish / vibe word / address hook)
//   - Templated openings shared by many entries
// Outputs a priority list sorted by score (top-rated weak descriptions first).
// Run: node scripts/audit-descriptions.js

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

// Generic phrases — their presence signals low-effort copy
const GENERIC_PHRASES = [
  /great\s+(restaurant|place|spot|food)/i,
  /delicious\s+food/i,
  /amazing\s+(food|atmosphere|experience)/i,
  /best\s+(restaurant|food|place)\s+in/i,
  /must[- ]?(try|visit|eat)/i,           // often fine but common templated
  /highly\s+recommended/i,
  /you\s+won't\s+be\s+disappointed/i,
];

// Concrete signal words — their ABSENCE is a weak signal
const CONCRETE_CUES = [
  /chef\s+[A-Z]|by\s+[A-Z][a-z]+\s+[A-Z]/,   // "Chef X" or "by Firstname Lastname"
  /signature|famous|known for|legendary|iconic/i,
  /since\s+\d{4}|opened\s+in\s+\d{4}/i,
  /james\s+beard|michelin|critics\s+pick|award/i,
  /\$\d+|tasting\s+menu|prix\s+fixe/i,
  /[A-Z][a-z]+'s|[A-Z][a-z]+[0-9]/,          // proper nouns with possessive
];

function assessDescription(desc) {
  const issues = [];
  if (!desc || typeof desc !== 'string') {
    return { score: 0, issues: ['missing'], length: 0 };
  }
  const s = desc.trim();
  const len = s.length;
  const periods = (s.match(/[.!?](\s|$)/g) || []).length;
  let score = 10;

  if (len < 100) { issues.push('very short'); score -= 4; }
  else if (len < 180) { issues.push('short (<180ch)'); score -= 2; }
  else if (len < 260) { /* passable */ }

  if (periods < 2) { issues.push('< 2 sentences'); score -= 2; }
  if (periods >= 4 && len > 280) { /* good density */ score += 1; }

  // Generic phrase penalty
  for (const rx of GENERIC_PHRASES) {
    if (rx.test(s)) { issues.push('generic phrase'); score -= 2; break; }
  }

  // Concrete cue bonus — count how many cues the description hits
  let cueCount = 0;
  for (const rx of CONCRETE_CUES) if (rx.test(s)) cueCount++;
  if (cueCount === 0) { issues.push('no concrete cues'); score -= 2; }
  else if (cueCount >= 3) score += 1;

  return { score: Math.max(0, score), issues, length: len, periods, cueCount };
}

const weak = [];
const totals = { total: 0, weak: 0, verygood: 0, avgLen: 0, totalLen: 0, missing: 0 };
const byCity = {};

Object.entries(CITIES).forEach(([constName, cityName]) => {
  const arr = readArray(constName);
  if (!arr) return;
  const c = { total: arr.length, weak: 0, missing: 0, verygood: 0, avgLen: 0 };
  let totalLen = 0;
  arr.forEach(r => {
    totals.total++;
    const assessment = assessDescription(r.description);
    totalLen += assessment.length;
    totals.totalLen += assessment.length;
    if (!r.description) { c.missing++; totals.missing++; }
    if (assessment.score <= 4) {
      c.weak++;
      totals.weak++;
      weak.push({ city: cityName, id: r.id, name: r.name, score: r.score, neighborhood: r.neighborhood, descLen: assessment.length, issues: assessment.issues });
    }
    if (assessment.score >= 10) { c.verygood++; totals.verygood++; }
  });
  c.avgLen = Math.round(totalLen / c.total);
  byCity[cityName] = c;
});

totals.avgLen = Math.round(totals.totalLen / totals.total);

// Sort weak descriptions by entry score (worst descriptions on TOP restaurants first)
weak.sort((a, b) => b.score - a.score);

console.log('='.repeat(60));
console.log('DESCRIPTION QUALITY AUDIT — ' + totals.total + ' spots');
console.log('='.repeat(60));
console.log('Weak descriptions (score ≤ 4):', totals.weak, '(' + ((totals.weak / totals.total) * 100).toFixed(1) + '%)');
console.log('Missing descriptions:          ', totals.missing);
console.log('Very good (score ≥ 10):        ', totals.verygood);
console.log('Avg description length:        ', totals.avgLen, 'chars');
console.log();
console.log('Per city:');
Object.entries(byCity).forEach(([city, c]) => {
  const pct = ((c.weak / c.total) * 100).toFixed(0);
  console.log('  ' + city.padEnd(16) + ' | ' + c.total.toString().padStart(4) + ' spots | weak ' + c.weak.toString().padStart(3) + ' (' + pct.padStart(2) + '%) | missing ' + c.missing + ' | verygood ' + c.verygood + ' | avg ' + c.avgLen + ' chars');
});
console.log();
console.log('Top 20 weak descriptions on HIGH-SCORE (>=85) entries — priority fix list:');
weak.filter(w => w.score >= 85).slice(0, 20).forEach(w => {
  console.log('  [' + w.score + '] ' + w.city.padEnd(16) + '  ' + w.name.padEnd(35) + ' | ' + w.descLen + 'ch | ' + w.issues.join(', '));
});

fs.writeFileSync(path.join(__dirname, 'description-audit-report.json'), JSON.stringify({ totals, byCity, weakList: weak }, null, 2));
console.log('\nFull weak list (' + weak.length + ' entries) → scripts/description-audit-report.json');

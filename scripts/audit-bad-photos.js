#!/usr/bin/env node
/**
 * audit-bad-photos.js
 *
 * Scans every *_DATA array in index.html and grades each card's photo:
 *   BAD     — empty, icon, placeholder, or known broken pattern
 *   SUSPECT — og:image / social-share, Google Places user uploads, dupes
 *   OK      — passes all rules
 *
 * Writes a markdown report to scripts/data/bad-photo-audit.md and a
 * JSON blob to scripts/data/bad-photo-audit.json.
 *
 * Read-only — never modifies index.html. Re-run anytime.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'index.html');
const REPORT_MD = path.join(ROOT, 'scripts', 'data', 'bad-photo-audit.md');
const REPORT_JSON = path.join(ROOT, 'scripts', 'data', 'bad-photo-audit.json');

const html = fs.readFileSync(HTML_PATH, 'utf8');

// Dynamic discovery — every `const <NAME>_DATA = [` declaration in index.html.
// Was hardcoded; missing SF/PHX/SD/SANANTONIO until 2026-04-26.
const SECTIONS = (() => {
  const re = /const\s+([A-Z][A-Z0-9_]*_DATA)\s*=\s*\[/g;
  const found = new Set();
  let m;
  while ((m = re.exec(html)) !== null) found.add(m[1]);
  return [...found];
})();

const findArrayBounds = (sectionName) => {
  const declStart = html.indexOf('const ' + sectionName);
  if (declStart < 0) return null;
  const arrOpen = html.indexOf('[', declStart);
  let depth = 0, i = arrOpen, end = -1, inStr = false;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  return { arrOpen, arrClose: end };
};

// Walk the array contents and split on top-level {...} objects, regardless of
// whether "id" is the first key. Strings are skipped so braces inside string
// values don't throw off the depth counter.
const parseCardsInRange = (arrOpenIdx, arrCloseIdx, cityName) => {
  const cards = [];
  let depth = 0, cardStart = -1, inStr = false;
  for (let i = arrOpenIdx + 1; i < arrCloseIdx; i++) {
    const ch = html[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{') { if (depth === 0) cardStart = i; depth++; }
    else if (ch === '}') {
      depth--;
      if (depth === 0 && cardStart >= 0) {
        const slice = html.slice(cardStart, i + 1);
        const id = slice.match(/"id":(\d+)/)?.[1];
        const name = slice.match(/"name":"([^"]+)"/)?.[1];
        const nbhd = slice.match(/"neighborhood":"([^"]+)"/)?.[1];
        const photoUrl = slice.match(/"photoUrl":"([^"]*)"/)?.[1] ?? '';
        const photosMatch = slice.match(/"photos":\[([^\]]*)\]/)?.[1] ?? '';
        const firstPhoto = photosMatch.match(/"([^"]+)"/)?.[1] ?? '';
        cards.push({ city: cityName, id, name, neighborhood: nbhd, photoUrl, firstPhoto });
        cardStart = -1;
      }
    }
  }
  return cards;
};

const allCards = [];
for (const s of SECTIONS) {
  const b = findArrayBounds(s);
  if (!b) continue;
  const cityName = s.replace(/_DATA$/, '');
  allCards.push(...parseCardsInRange(b.arrOpen, b.arrClose, cityName));
}

const urlCounts = {};
for (const c of allCards) {
  const u = c.photoUrl || c.firstPhoto;
  if (u) urlCounts[u] = (urlCounts[u] || 0) + 1;
}

const BAD_PATTERNS = [
  { re: /\.svg(\?|$)/i, reason: 'SVG (icon, not photo)' },
  { re: /\.ico(\?|$)/i, reason: 'ICO (favicon)' },
  { re: /logo[._-]?(white|black|color|small|main)?\.(png|jpe?g|webp|svg)/i, reason: 'logo file' },
  { re: /\/logo[s]?\//i, reason: 'logo path' },
  { re: /favicon/i, reason: 'favicon' },
  { re: /placeholder/i, reason: 'placeholder' },
  { re: /no[-_]?image/i, reason: 'no-image placeholder' },
  { re: /default[-_]?image/i, reason: 'default-image placeholder' },
  { re: /default\.(png|jpe?g|webp)/i, reason: 'default.* image' },
  { re: /placehold\.(co|it)/i, reason: 'placehold.co/.it stock' },
  { re: /via\.placeholder\.com/i, reason: 'via.placeholder.com stock' },
  { re: /dummyimage\.com/i, reason: 'dummyimage.com stock' },
  { re: /Image_not_available/i, reason: 'Wikipedia Image_not_available' },
  { re: /No_image_available/i, reason: 'Wikipedia No_image_available' },
];

const SUSPECT_PATTERNS = [
  { re: /og[-_]image/i, reason: 'og:image meta tag asset' },
  { re: /social[-_]share/i, reason: 'social share asset' },
  { re: /twitter[-_]card/i, reason: 'twitter card asset' },
  { re: /(fb|facebook)[-_](share|card)/i, reason: 'facebook share/card asset' },
  { re: /share[-_]image/i, reason: 'share-image asset' },
  { re: /meta[-_]image/i, reason: 'meta-image asset' },
  { re: /[?&=]w=?1200&h=?630/i, reason: 'OG-aspect dimensions (1200x630)' },
  { re: /=w1200-h630/i, reason: 'OG-aspect dimensions (1200x630)' },
  { re: /lh3\.googleusercontent\.com\/p\/AF1Qip/i, reason: 'Google Places user upload (often low quality)' },
  { re: /lh3\.googleusercontent\.com\/gps-cs/i, reason: 'Google Places shared upload' },
  { re: /^https?:\/\/(www\.)?(unsplash|pexels|shutterstock|istockphoto|gettyimages)\.com/i, reason: 'stock photo site' },
  { re: /stock\.adobe\.com/i, reason: 'Adobe stock photo' },
];

const grade = (card) => {
  const u = card.photoUrl || card.firstPhoto;
  if (!u) return { severity: 'BAD', reasons: ['no photoUrl and no photos[0] (will fall back to emoji)'] };
  const reasons = [];
  let severity = 'OK';
  for (const p of BAD_PATTERNS) if (p.re.test(u)) { reasons.push(p.reason); severity = 'BAD'; }
  if (severity !== 'BAD') {
    for (const p of SUSPECT_PATTERNS) if (p.re.test(u)) { reasons.push(p.reason); severity = 'SUSPECT'; }
  }
  if (urlCounts[u] >= 5) {
    reasons.push(`reused on ${urlCounts[u]} cards (likely placeholder)`);
    if (severity === 'OK') severity = 'SUSPECT';
  }
  return { severity, reasons };
};

const graded = allCards.map(c => ({ ...c, ...grade(c) }));

const summary = {};
for (const g of graded) {
  if (!summary[g.city]) summary[g.city] = { BAD: 0, SUSPECT: 0, OK: 0 };
  summary[g.city][g.severity]++;
}

const cities = [...new Set(graded.map(g => g.city))].sort();
let md = '# Bad Photo Audit\n\n';
md += `Run: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}\n`;
md += `Total cards scanned: ${graded.length}\n\n`;
md += '## Summary by city\n\n';
md += '| City | BAD | SUSPECT | OK |\n|---|---:|---:|---:|\n';
for (const c of cities) {
  const s = summary[c];
  md += `| ${c} | ${s.BAD} | ${s.SUSPECT} | ${s.OK} |\n`;
}
const totals = cities.reduce((a, c) => ({ BAD: a.BAD + summary[c].BAD, SUSPECT: a.SUSPECT + summary[c].SUSPECT, OK: a.OK + summary[c].OK }), { BAD: 0, SUSPECT: 0, OK: 0 });
md += `| **TOTAL** | **${totals.BAD}** | **${totals.SUSPECT}** | **${totals.OK}** |\n\n`;

for (const c of cities) {
  const issues = graded.filter(g => g.city === c && g.severity !== 'OK')
    .sort((a, b) => (a.severity === 'BAD' ? -1 : 1) - (b.severity === 'BAD' ? -1 : 1));
  if (!issues.length) continue;
  md += `\n## ${c} — ${issues.length} flagged\n\n`;
  md += '| Severity | id | Name | Neighborhood | Reason | URL |\n|---|---|---|---|---|---|\n';
  for (const g of issues) {
    const u = (g.photoUrl || g.firstPhoto || '').slice(0, 80);
    const truncated = (g.photoUrl || g.firstPhoto || '').length > 80 ? '…' : '';
    md += `| ${g.severity} | ${g.id} | ${g.name} | ${g.neighborhood || ''} | ${g.reasons.join('; ')} | ${u}${truncated} |\n`;
  }
}

fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });
fs.writeFileSync(REPORT_MD, md);
fs.writeFileSync(REPORT_JSON, JSON.stringify({ summary, totals, graded: graded.filter(g => g.severity !== 'OK') }, null, 2));

console.log('Bad-photo audit complete.');
console.log(`  Total cards: ${graded.length}`);
console.log(`  BAD:     ${totals.BAD}`);
console.log(`  SUSPECT: ${totals.SUSPECT}`);
console.log(`  OK:      ${totals.OK}`);
console.log(`Report:   ${path.relative(ROOT, REPORT_MD)}`);
console.log(`JSON:     ${path.relative(ROOT, REPORT_JSON)}`);

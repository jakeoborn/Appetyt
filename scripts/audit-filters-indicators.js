#!/usr/bin/env node
// Audit tags (filters) + indicators for consistency and plausibility.
// Detects:
//   - Entries with NO tags (won't surface in any filter)
//   - Tag mismatches (e.g., "Rooftop" tag on a basement speakeasy cuisine)
//   - Low-volume tags (<5 entries — likely typos or useless)
//   - Obvious conflicts (e.g., both "Fine Dining" and "Casual" tags)
//   - Indicators field usage ("coming-soon" etc.)
// Run: node scripts/audit-filters-indicators.js

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

// Known conflict pairs — tags that shouldn't both be on the same entry
const CONFLICTS = [
  ['Fine Dining', 'Casual'],
  ['Fine Dining', 'Cheap Eats'],
  ['Fine Dining', 'Fast Casual'],
  ['Casual', 'Fine Dining'],
  ['Vegan', 'Steakhouse'],
  ['Plant-Based', 'Steakhouse'],
  ['Vegetarian', 'BBQ'],
];

// Tags that don't match obvious cuisine patterns (flag for review)
const CUISINE_TAG_MISMATCH = [
  { tag: 'Rooftop', cuisineNot: /basement|speakeasy/i, desc: 'Rooftop tag on basement/speakeasy' },
  { tag: 'BBQ', cuisineNot: /sushi|french|italian|japanese|vegan/i, desc: 'BBQ tag on non-BBQ cuisine' },
  { tag: 'Sushi', cuisineNot: /bbq|italian|french|steakhouse/i, desc: 'Sushi tag on non-Japanese cuisine' },
  { tag: 'Brunch', cuisineNot: /nightclub|speakeasy|brewery/i, desc: 'Brunch tag on nightlife venue' },
];

let totals = {
  total: 0,
  zeroTags: 0,
  singleTag: 0,
  withIndicators: 0,
  avgTags: 0,
  totalTagUses: 0,
  conflictPairs: 0,
  cuisineTagMismatches: 0,
};

const tagFreq = {};
const indicatorFreq = {};
const byCity = {};
const issues = { noTags: [], conflictPairs: [], cuisineMismatches: [], lowVolumeTags: {} };

Object.entries(CITIES).forEach(([constName, cityName]) => {
  const arr = readArray(constName);
  if (!arr) return;
  const c = { total: arr.length, zeroTags: 0, avgTags: 0, indicatorsUsed: 0, tagsByFreq: {} };

  arr.forEach(r => {
    totals.total++;
    const tags = r.tags || [];
    const inds = r.indicators || [];
    if (inds.length) {
      totals.withIndicators++;
      c.indicatorsUsed++;
      inds.forEach(i => { indicatorFreq[i] = (indicatorFreq[i] || 0) + 1; });
    }
    if (tags.length === 0) {
      totals.zeroTags++;
      c.zeroTags++;
      if (issues.noTags.length < 30) issues.noTags.push({ city: cityName, id: r.id, name: r.name, cuisine: r.cuisine });
    } else if (tags.length === 1) {
      totals.singleTag++;
    }
    totals.totalTagUses += tags.length;
    tags.forEach(t => {
      tagFreq[t] = (tagFreq[t] || 0) + 1;
      c.tagsByFreq[t] = (c.tagsByFreq[t] || 0) + 1;
    });

    // Conflict detection
    for (const [a, b] of CONFLICTS) {
      if (tags.includes(a) && tags.includes(b)) {
        totals.conflictPairs++;
        if (issues.conflictPairs.length < 20) issues.conflictPairs.push({ city: cityName, id: r.id, name: r.name, conflict: a + ' + ' + b });
      }
    }

    // Cuisine/tag mismatch
    const cu = String(r.cuisine || '').toLowerCase();
    CUISINE_TAG_MISMATCH.forEach(rule => {
      if (tags.includes(rule.tag) && rule.cuisineNot.test(cu)) {
        totals.cuisineTagMismatches++;
        if (issues.cuisineMismatches.length < 20) issues.cuisineMismatches.push({ city: cityName, id: r.id, name: r.name, cuisine: r.cuisine, tag: rule.tag, desc: rule.desc });
      }
    });
  });
  c.avgTags = c.total ? (arr.reduce((s, r) => s + (r.tags || []).length, 0) / c.total).toFixed(1) : 0;
  byCity[cityName] = c;
});

totals.avgTags = totals.total ? (totals.totalTagUses / totals.total).toFixed(1) : 0;

// Low-volume tags (< 5 uses globally)
Object.keys(tagFreq).filter(t => tagFreq[t] < 5).forEach(t => {
  issues.lowVolumeTags[t] = tagFreq[t];
});

console.log('='.repeat(60));
console.log('FILTER + INDICATOR AUDIT — ' + totals.total + ' spots');
console.log('='.repeat(60));
console.log('Entries with ZERO tags:   ', totals.zeroTags, '(' + ((totals.zeroTags / totals.total) * 100).toFixed(1) + '%)');
console.log('Entries with ONLY 1 tag:  ', totals.singleTag);
console.log('Avg tags per entry:       ', totals.avgTags);
console.log('Unique tags used:         ', Object.keys(tagFreq).length);
console.log('Entries with indicators:  ', totals.withIndicators);
console.log('Known conflict pairs:     ', totals.conflictPairs);
console.log('Cuisine/tag mismatches:   ', totals.cuisineTagMismatches);
console.log('Low-volume tags (<5):     ', Object.keys(issues.lowVolumeTags).length);
console.log();
console.log('Per city:');
Object.entries(byCity).forEach(([city, c]) => {
  console.log('  ' + city.padEnd(16) + ' | ' + c.total.toString().padStart(4) + ' spots | avg tags ' + c.avgTags + ' | noTags ' + c.zeroTags + ' | indicators ' + c.indicatorsUsed);
});
console.log();

if (issues.noTags.length) {
  console.log('⚠ Sample of entries with ZERO tags:');
  issues.noTags.slice(0, 10).forEach(e => console.log('  • [' + e.city + '] ' + e.name + ' (' + e.cuisine + ')'));
  if (issues.noTags.length > 10) console.log('  ...and ' + (totals.zeroTags - 10) + ' more');
}
if (issues.conflictPairs.length) {
  console.log('\n⚠ Conflicting tag pairs:');
  issues.conflictPairs.slice(0, 15).forEach(e => console.log('  • [' + e.city + '] ' + e.name + ' → ' + e.conflict));
}
if (issues.cuisineMismatches.length) {
  console.log('\n⚠ Cuisine/tag mismatches:');
  issues.cuisineMismatches.slice(0, 15).forEach(e => console.log('  • [' + e.city + '] ' + e.name + ' (cuisine: ' + e.cuisine + ') → "' + e.tag + '" tag — ' + e.desc));
}

// Print top 20 tags (most used) and low-volume (potential typos)
const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log('\nTop 20 tags in use:');
topTags.forEach(([t, c]) => console.log('  ' + c.toString().padStart(4) + '  ' + t));

if (Object.keys(issues.lowVolumeTags).length) {
  console.log('\nLow-volume tags (<5 uses — possibly typos or over-specific):');
  Object.entries(issues.lowVolumeTags).sort((a, b) => a[1] - b[1]).slice(0, 30).forEach(([t, c]) => console.log('  ' + c + '  "' + t + '"'));
}

// Indicators
if (Object.keys(indicatorFreq).length) {
  console.log('\nIndicators in use:');
  Object.entries(indicatorFreq).forEach(([i, c]) => console.log('  ' + c.toString().padStart(4) + '  ' + i));
}

fs.writeFileSync(path.join(__dirname, 'filter-indicator-audit-report.json'), JSON.stringify({ totals, byCity, issues, tagFreq, indicatorFreq }, null, 2));
console.log('\nFull report → scripts/filter-indicator-audit-report.json');

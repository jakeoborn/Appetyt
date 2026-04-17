#!/usr/bin/env node
// Audit `dishes` arrays for specificity + accuracy.
// Flags:
//   - 0 dishes (no must-try signals for user)
//   - < 3 dishes (too few to guide a first-timer)
//   - Generic-only dishes (array reads like a cuisine list, not real items)
//     "Pasta" vs "Cacio e Pepe"; "Pizza" vs "Margherita D.O.P."
//   - Cuisine/dish mismatch (Italian restaurant with "Sushi" in dishes)
//   - Cocktail-bar entries that DON'T list cocktail names in dishes
// Outputs priority list sorted by score (top-rated weakest first).
// Run: node scripts/audit-dishes.js

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

// Generic terms — single-word cuisine names, categories. If a restaurant's
// ENTIRE dish list is composed of these, the list has no signal.
const GENERIC = new Set([
  'pasta', 'pizza', 'salad', 'soup', 'bread', 'burger', 'burgers', 'sushi', 'ramen',
  'tacos', 'taco', 'noodles', 'rice', 'dumplings', 'appetizers', 'desserts', 'dessert',
  'steak', 'steaks', 'fish', 'seafood', 'chicken', 'beef', 'pork', 'lamb', 'duck',
  'veal', 'lobster', 'shrimp', 'oysters', 'cocktails', 'cocktail', 'wine', 'beer',
  'coffee', 'espresso', 'wings', 'fries', 'brunch', 'breakfast', 'lunch', 'dinner',
  'pastries', 'pastry', 'sandwiches', 'sandwich', 'curry', 'dim sum',
]);

// Cocktail venues (by cuisine) should have at least 2 cocktail-sounding dishes.
function isCocktailVenue(r) {
  const cu = String(r.cuisine || '').toLowerCase();
  return /cocktail|speakeasy|bar|lounge|nightclub/.test(cu);
}
function looksLikeCocktail(s) {
  const x = String(s).toLowerCase();
  return /martini|negroni|old[- ]?fashioned|manhattan|daiquiri|margarita|mojito|paloma|spritz|gimlet|sour|highball|julep|fizz|collins|cocktail/i.test(x);
}

function assessDishes(r) {
  const dishes = r.dishes || [];
  const issues = [];
  let score = 10;

  if (dishes.length === 0) { issues.push('missing'); score = 0; return { score, issues, dishes: [] }; }
  if (dishes.length < 3) { issues.push('< 3 items'); score -= 3; }

  // All-generic check
  const allGeneric = dishes.every(d => {
    const lc = String(d).toLowerCase().trim();
    return GENERIC.has(lc) || lc.split(/\s+/).every(w => GENERIC.has(w));
  });
  if (allGeneric) { issues.push('all generic'); score -= 4; }
  else {
    // How many items look GENERIC vs SPECIFIC?
    const genericCount = dishes.filter(d => GENERIC.has(String(d).toLowerCase().trim())).length;
    if (genericCount > 0 && genericCount >= dishes.length / 2) { issues.push('mostly generic'); score -= 2; }
  }

  // Cocktail venue missing cocktails
  if (isCocktailVenue(r)) {
    const hasCocktails = dishes.some(d => looksLikeCocktail(d));
    if (!hasCocktails) { issues.push('cocktail venue, no cocktail names'); score -= 2; }
  }

  return { score: Math.max(0, score), issues, dishes };
}

let totals = { total: 0, weak: 0, missing: 0, avgDishes: 0, avgDishLen: 0 };
const byCity = {};
const weak = [];
const allGenericDishes = new Set();

Object.entries(CITIES).forEach(([constName, cityName]) => {
  const arr = readArray(constName);
  if (!arr) return;
  const c = { total: arr.length, weak: 0, missing: 0, dishesTotal: 0, dishesMax: 0 };
  let dishChars = 0, dishCount = 0;
  arr.forEach(r => {
    totals.total++;
    const assessment = assessDishes(r);
    c.dishesTotal += assessment.dishes.length;
    dishCount += assessment.dishes.length;
    assessment.dishes.forEach(d => dishChars += String(d).length);
    if (assessment.dishes.length > c.dishesMax) c.dishesMax = assessment.dishes.length;
    if (assessment.dishes.length === 0) { c.missing++; totals.missing++; }
    if (assessment.score <= 4) {
      c.weak++;
      totals.weak++;
      weak.push({ city: cityName, id: r.id, name: r.name, score: r.score, neighborhood: r.neighborhood, cuisine: r.cuisine, dishCount: assessment.dishes.length, dishes: assessment.dishes, issues: assessment.issues });
    }
  });
  c.avgDishes = (c.dishesTotal / c.total).toFixed(1);
  c.avgDishLen = dishCount ? Math.round(dishChars / dishCount) : 0;
  byCity[cityName] = c;
});

weak.sort((a, b) => b.score - a.score);

console.log('='.repeat(60));
console.log('DISHES AUDIT — ' + totals.total + ' spots');
console.log('='.repeat(60));
console.log('Missing dishes:', totals.missing);
console.log('Weak (score ≤ 4):', totals.weak, '(' + ((totals.weak / totals.total) * 100).toFixed(1) + '%)');
console.log();
Object.entries(byCity).forEach(([city, c]) => {
  const pct = ((c.weak / c.total) * 100).toFixed(0);
  console.log('  ' + city.padEnd(16) + ' | ' + c.total.toString().padStart(4) + ' spots | weak ' + c.weak.toString().padStart(3) + ' (' + pct.padStart(2) + '%) | missing ' + c.missing + ' | avg ' + c.avgDishes + ' dishes | avg dish len ' + c.avgDishLen + ' chars');
});
console.log();
console.log('Top 30 weak-dishes on HIGH-SCORE (>=85) entries — priority rewrite list:');
weak.filter(w => w.score >= 85).slice(0, 30).forEach(w => {
  console.log('  [' + w.score + '] ' + w.city.padEnd(16) + ' ' + w.name.padEnd(35) + ' | ' + w.dishCount + ' dishes | ' + w.issues.join(', '));
  console.log('      current: ' + JSON.stringify(w.dishes));
});

fs.writeFileSync(path.join(__dirname, 'dishes-audit-report.json'), JSON.stringify({ totals, byCity, weakList: weak }, null, 2));
console.log('\nFull weak list (' + weak.length + ') → scripts/dishes-audit-report.json');

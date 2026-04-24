#!/usr/bin/env node
/*
 * Batch 1 of generic-dishes enrichment.
 * ID-scoped in-place replacement of `dishes` (and optional `menuUrl`
 * injection). Applies to both script copies.
 *
 * Every dish name below is sourced from press/menu coverage linked in
 * the enrichment PR. No fabrication.
 */
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(FILE, 'utf8');

const UPDATES = [
  {
    city: 'NYC_DATA',
    id: 1076,
    name: 'Overstory',
    dishes: ["Terroir Old Fashioned","El Bandito","In The Clouds","Chai Spot","Maravilla"],
    menuUrl: 'https://www.overstory-nyc.com'
  },
  {
    city: 'NYC_DATA',
    id: 1362,
    name: 'Please Don\'t Tell',
    dishes: ["Benton's Old Fashioned","Paddington","Calypso","Crif Collins","The Chang Dog"],
    menuUrl: 'https://www.pdtnyc.com'
  },
  {
    city: 'NYC_DATA',
    id: 1459,
    name: "Ha's Snack Bar",
    dishes: ["Snails in Tamarind Butter","Chicken Liver Pâté","Egg-Scallion Bánh Mì","Bass Crudo","Escargot"],
    menuUrl: ''
  },
  {
    city: 'NYC_DATA',
    id: 1542,
    name: "Angel's Share",
    dishes: ["Smoke Gets in Your Eyes","Street Car","Peel Me A Grape","Painted Paradise","Misty"],
    menuUrl: 'https://www.angelssharenyc.com'
  },
];

// Find declaration array range
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

// Find a specific card's object bounds within a section by id
function findCardById(secStart, secEnd, id) {
  const needle = '"id":' + id + ',';
  let i = secStart;
  while ((i = html.indexOf(needle, i)) !== -1) {
    if (i >= secEnd) return null;
    // Walk back to find opening brace at depth 0
    let depth = 0, start = i;
    for (let j = i; j >= secStart; j--) {
      if (html[j] === '}') depth++;
      else if (html[j] === '{') {
        if (depth === 0) { start = j; break; }
        depth--;
      }
    }
    // Walk forward to find matching close brace
    let d = 0;
    for (let j = start; j < secEnd; j++) {
      if (html[j] === '"') {
        j++;
        while (j < secEnd && html[j] !== '"') {
          if (html[j] === '\\') j++;
          j++;
        }
        continue;
      }
      if (html[j] === '{') d++;
      else if (html[j] === '}') { d--; if (d === 0) return { start, end: j + 1 }; }
    }
    i++;
  }
  return null;
}

// Replace dishes field and inject/update menuUrl within a card's text
function rewriteCard(cardText, newDishes, newMenuUrl) {
  const dishesRe = /"dishes":\[[^\]]*\]/;
  const dishesJson = JSON.stringify(newDishes);

  let out = cardText;
  if (dishesRe.test(out)) {
    out = out.replace(dishesRe, '"dishes":' + dishesJson);
  } else {
    throw new Error('card has no dishes field');
  }

  if (newMenuUrl) {
    if (/"menuUrl":"[^"]*"/.test(out)) {
      out = out.replace(/"menuUrl":"[^"]*"/, '"menuUrl":' + JSON.stringify(newMenuUrl));
    } else {
      // inject after dishes
      out = out.replace(/"dishes":\[[^\]]*\]/, m => m + ',"menuUrl":' + JSON.stringify(newMenuUrl));
    }
  }
  return out;
}

let totalReplacements = 0;

for (const u of UPDATES) {
  // Find both script copies
  const ranges = [];
  let cursor = 0;
  while (true) {
    const r = findDeclRange(u.city, cursor);
    if (!r) break;
    ranges.push(r);
    cursor = r.end + 1;
  }
  if (ranges.length !== 2) {
    console.warn(`WARN ${u.name} (#${u.id}): expected 2 ${u.city} ranges, found ${ranges.length}`);
  }

  let replacedCount = 0;

  // Replace in reverse order so earlier positions stay stable
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i];
    const loc = findCardById(range.start, range.end, u.id);
    if (!loc) continue;
    const oldText = html.slice(loc.start, loc.end);
    const newText = rewriteCard(oldText, u.dishes, u.menuUrl);
    if (oldText === newText) continue;
    html = html.slice(0, loc.start) + newText + html.slice(loc.end);
    replacedCount++;
  }
  totalReplacements += replacedCount;
  console.log(`  ${u.name} (#${u.id}): ${replacedCount} copy/copies updated`);
}

fs.writeFileSync(FILE, html);
console.log(`Total: ${totalReplacements} in-place updates`);

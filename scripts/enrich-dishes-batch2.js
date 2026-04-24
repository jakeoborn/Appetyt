#!/usr/bin/env node
/*
 * Batch 2 of generic-dishes enrichment — 4 more NYC cards.
 * All items press-verified (Time Out, Moxy, Grand Army site, Sugar Monk press).
 * Ginny's Supper Club #1104 deferred — only 2 verified cocktail names, not
 * enough to hit the 4-5 standard without fabrication.
 */
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(FILE, 'utf8');

const UPDATES = [
  {
    city: 'NYC_DATA',
    id: 1514,
    name: 'Dear Irving on Hudson',
    dishes: ["Wildest Redhead","TIL Midnight","Nonna Soprano","Sapphire Hour","Mona Lisa Vito"],
    menuUrl: 'https://www.dearirving.com/hudson-cocktail-menu'
  },
  {
    city: 'NYC_DATA',
    id: 1515,
    name: 'Magic Hour Rooftop',
    dishes: ["Moira Rose","Doctor's Orders","All Spice No Drama","This Ain't Texas","18oz Party Pouch"],
    menuUrl: 'https://moxytimessquare.com/dining/magic-hour-rooftop-bar-lounge/'
  },
  {
    city: 'NYC_DATA',
    id: 1535,
    name: 'Grand Army',
    dishes: ["Roasted Oysters","Garlic Butter Crab Toast","Lobster Roll","Crispy Potatoes","Deviled Eggs"],
    menuUrl: 'https://www.grandarmybar.com'
  },
  {
    city: 'NYC_DATA',
    id: 1547,
    name: 'Sugar Monk',
    dishes: ["Round Midnight","Potters Field","Marie Laveau","Four Horsemen","Thelonious"],
    menuUrl: 'https://sugarmonklounge.com'
  },
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

function findCardById(secStart, secEnd, id) {
  const needle = '"id":' + id + ',';
  let i = secStart;
  while ((i = html.indexOf(needle, i)) !== -1) {
    if (i >= secEnd) return null;
    let depth = 0, start = i;
    for (let j = i; j >= secStart; j--) {
      if (html[j] === '}') depth++;
      else if (html[j] === '{') {
        if (depth === 0) { start = j; break; }
        depth--;
      }
    }
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

function rewriteCard(cardText, newDishes, newMenuUrl) {
  const dishesRe = /"dishes":\[[^\]]*\]/;
  const dishesJson = JSON.stringify(newDishes);
  let out = cardText.replace(dishesRe, '"dishes":' + dishesJson);
  if (newMenuUrl) {
    if (/"menuUrl":"[^"]*"/.test(out)) {
      out = out.replace(/"menuUrl":"[^"]*"/, '"menuUrl":' + JSON.stringify(newMenuUrl));
    } else {
      out = out.replace(/"dishes":\[[^\]]*\]/, m => m + ',"menuUrl":' + JSON.stringify(newMenuUrl));
    }
  }
  return out;
}

let total = 0;
for (const u of UPDATES) {
  const ranges = [];
  let cursor = 0;
  while (true) {
    const r = findDeclRange(u.city, cursor);
    if (!r) break;
    ranges.push(r);
    cursor = r.end + 1;
  }
  let replaced = 0;
  for (let i = ranges.length - 1; i >= 0; i--) {
    const loc = findCardById(ranges[i].start, ranges[i].end, u.id);
    if (!loc) continue;
    const oldText = html.slice(loc.start, loc.end);
    const newText = rewriteCard(oldText, u.dishes, u.menuUrl);
    if (oldText !== newText) {
      html = html.slice(0, loc.start) + newText + html.slice(loc.end);
      replaced++;
    }
  }
  total += replaced;
  console.log(`  ${u.name} (#${u.id}): ${replaced} copies updated`);
}

fs.writeFileSync(FILE, html);
console.log(`Total: ${total} in-place updates`);

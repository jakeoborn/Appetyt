#!/usr/bin/env node
/*
 * Batch 3 of generic-dishes enrichment — 3 NYC cocktail bars.
 * Ruins (Bushwick tiki, #1668) deferred — search returned other Bushwick tiki
 * bars (Dromedary, Abe's Pagoda, Ra-Ra Rhino) but no Ruins-specific drinks,
 * so no verifiable names without fabrication.
 * Bar Sardine (#1957) deferred — Yelp shows "CLOSED" (March 2026); card
 * status needs verification before further work.
 */
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(FILE, 'utf8');

const UPDATES = [
  {
    city: 'NYC_DATA',
    id: 1586,
    name: 'Bathtub Gin',
    dishes: ["Bathtub Gin Martini","S'mores Old-Fashioned","Gin Mill Gimlet","Jazz Age","Drop A Dime Collins"],
    menuUrl: 'https://www.bathtubginnyc.com'
  },
  {
    city: 'NYC_DATA',
    id: 1587,
    name: 'Raines Law Room',
    dishes: ["The 10 Gallon Hat","The Pioneer Spirit","Raines Law Room Martini","After All Royale","Boulevardier"],
    menuUrl: 'https://www.raineslawroom.com'
  },
  {
    city: 'NYC_DATA',
    id: 1638,
    name: 'Weather Up',
    dishes: ["Critical Acclaim","Long Blonde","Diamond Night","White Horse","Kensington Fix"],
    menuUrl: 'https://www.weatherupnyc.com'
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
  console.log(`  ${u.name} (#${u.id}): ${replaced} copies`);
}

fs.writeFileSync(FILE, html);
console.log(`Total: ${total} in-place updates`);

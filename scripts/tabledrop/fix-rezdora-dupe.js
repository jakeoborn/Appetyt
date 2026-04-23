#!/usr/bin/env node
// Fix: Rezdôra #1988 (batch 2) is a dupe of #1197 (existing). My normalize() in
// match-tabledrop.js stripped the ô so the match missed. Delete #1988, move its
// reserveUrl + bookingInfo to #1197.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'index.html');
let html = fs.readFileSync(HTML_PATH, 'utf8');

let start = html.indexOf('const NYC_DATA=');
if (start < 0) start = html.indexOf('const NYC_DATA =');
const arrOpen = html.indexOf('[', start);
let d = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (!d) { arrClose = i + 1; break; } }
}
const before = html.slice(0, arrOpen);
let arrText = html.slice(arrOpen, arrClose);
const after = html.slice(arrClose);

// Find #1988 card bounds
function findCard(id) {
  const re = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + id + '(?=[,}\\s])');
  const m = re.exec(arrText);
  if (!m) return null;
  let s = m.index, bd = 0;
  while (s > 0) {
    const c = arrText[s];
    if (c === '}') bd++;
    else if (c === '{') { if (bd === 0) break; bd--; }
    s--;
  }
  let e = s, fd = 0;
  for (let i = s; i < arrText.length; i++) {
    if (arrText[i] === '{') fd++;
    else if (arrText[i] === '}') { fd--; if (!fd) { e = i; break; } }
  }
  return { start: s, end: e };
}

const dupe = findCard(1988);
const keep = findCard(1197);
if (!dupe || !keep) { console.error('cards not found'); process.exit(1); }

// Delete #1988 card + its preceding comma.
// Snip from the last "}" or "," before to end+1.
let delStart = dupe.start;
// Walk back over whitespace + preceding comma
while (delStart > 0 && /[\s,]/.test(arrText[delStart - 1])) {
  if (arrText[delStart - 1] === ',') { delStart--; break; }
  delStart--;
}
const delEnd = dupe.end + 1;

// Remove dupe FIRST so keep-card indexes stay valid (keep #1197 comes before #1988).
arrText = arrText.slice(0, delStart) + arrText.slice(delEnd);

// Re-find #1197 now (still valid since it's before #1988)
const k = findCard(1197);
let kCard = arrText.slice(k.start, k.end + 1);

// Strip any existing reserveUrl/bookingInfo, then add the ones from the deleted #1988.
kCard = kCard.replace(/,\s*"?reserveUrl"?\s*:\s*(?:null|"(?:[^"\\]|\\.)*")/g, '');
kCard = kCard.replace(/,\s*"?bookingInfo"?\s*:\s*(?:null|"(?:[^"\\]|\\.)*")/g, '');

const inject = ',"reserveUrl":"https://resy.com/cities/ny/rezdora","bookingInfo":"Opens 30 days ahead at midnight ET on Resy. Midnight releases go fast."';
kCard = kCard.slice(0, -1) + inject + '}';
arrText = arrText.slice(0, k.start) + kCard + arrText.slice(k.end + 1);

const newHtml = before + arrText + after;
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Deleted #1988 Rezdôra dupe; applied TableDrop data to #1197 Rezdôra. Delta:', newHtml.length - html.length, 'bytes');

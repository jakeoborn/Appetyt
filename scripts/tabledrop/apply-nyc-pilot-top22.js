#!/usr/bin/env node
// NYC pilot backfill: top 22 cards (score >= 95).
// Adds reserveUrl; corrects reservation platform where our data was stale.
// Data sourced via Firecrawl site-search on 2026-04-23.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'index.html');

// id, reserveUrl, platform (null = keep existing, else update r.reservation)
const UPDATES = [
  { id: 1001, name: 'Le Bernardin', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/le-bernardin', platform: 'Resy' },
  { id: 1002, name: 'Eleven Madison Park', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/eleven-madison-park', platform: 'Resy' },
  { id: 1013, name: 'Crown Shy', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/crown-shy', platform: 'Resy' },
  { id: 1020, name: 'Le Coucou', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/le-coucou', platform: 'Resy' },
  { id: 1022, name: 'Gramercy Tavern', reserveUrl: 'https://www.opentable.com/r/gramercy-tavern-new-york', platform: 'OpenTable' },
  { id: 1027, name: 'Cosme', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/cosme', platform: 'Resy' },
  // Platform mismatch: our data said Resy; actually on SevenRooms now.
  { id: 1028, name: 'Dhamaka', reserveUrl: 'https://www.sevenrooms.com/explore/dhamakanyc/reservations/create/search', platform: 'SevenRooms' },
  // Platform mismatch: our data said Resy; actually on OpenTable.
  { id: 1030, name: 'Olmsted', reserveUrl: 'https://www.opentable.com/r/olmsted-brooklyn', platform: 'OpenTable' },
  { id: 1007, name: 'Balthazar', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/balthazar-nyc', platform: 'Resy' },
  // Platform mismatch: our data said Resy; actually on Tock.
  { id: 1032, name: 'Jungsik', reserveUrl: 'https://www.exploretock.com/jungsik', platform: 'Tock' },
  { id: 1182, name: 'Saga', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/saga-ny', platform: 'Resy' },
  // Platform mismatch: our data said Resy; actually on OpenTable.
  { id: 1023, name: 'Gage & Tollner', reserveUrl: 'https://www.opentable.com/r/gage-and-tollner-brooklyn', platform: 'OpenTable' },
  { id: 1034, name: 'Gabriel Kreuther', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/gabriel-kreuther', platform: 'Resy' },
  { id: 1173, name: 'Jean-Georges', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/jean-georges', platform: 'Resy' },
  // Platform mismatch: our data said Resy; actually on Tock (deposit-required tasting).
  { id: 1174, name: 'Masa', reserveUrl: 'https://www.exploretock.com/masa', platform: 'Tock' },
  // Platform mismatch: our data said Resy; actually on Tock.
  { id: 1176, name: 'Aquavit', reserveUrl: 'https://www.exploretock.com/aquavit', platform: 'Tock' },
  { id: 1178, name: 'Odo', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/odo-east-village', platform: 'Resy' },
  { id: 1179, name: 'César', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/cesar', platform: 'Resy' },
  { id: 1181, name: 'Joo Ok', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/joo-ok', platform: 'Resy' },
  // Platform mismatch: our data said Resy; actually on Tock.
  { id: 1016, name: 'Di An Di', reserveUrl: 'https://www.exploretock.com/diandi', platform: 'Tock' },
  { id: 1019, name: 'Dante', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/dante', platform: 'Resy' },
  { id: 1035, name: 'Daniel', reserveUrl: 'https://resy.com/cities/new-york-ny/venues/daniel', platform: 'Resy' },
];

let html = fs.readFileSync(HTML_PATH, 'utf8');

let nycStart = html.indexOf('const NYC_DATA=');
if (nycStart < 0) nycStart = html.indexOf('const NYC_DATA =');
const arrOpen = html.indexOf('[', nycStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}
const beforeArr = html.slice(0, arrOpen);
let arrText = html.slice(arrOpen, arrClose);
const afterArr = html.slice(arrClose);

const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

let applied = 0, platformChanges = 0, notFound = [];

for (const u of UPDATES) {
  const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + u.id + '(?=[,}\\s])');
  const m = idRe.exec(arrText);
  if (!m) { notFound.push(u.id); continue; }

  // walk back to enclosing {
  let start = m.index, bDepth = 0;
  while (start > 0) {
    const c = arrText[start];
    if (c === '}') bDepth++;
    else if (c === '{') { if (bDepth === 0) break; bDepth--; }
    start--;
  }
  if (arrText[start] !== '{') { notFound.push(u.id); continue; }

  let end = start, fDepth = 0;
  for (let i = start; i < arrText.length; i++) {
    if (arrText[i] === '{') fDepth++;
    else if (arrText[i] === '}') { fDepth--; if (fDepth === 0) { end = i; break; } }
  }

  let card = arrText.slice(start, end + 1);

  // Strip existing reserveUrl
  card = card.replace(/,\s*"?reserveUrl"?\s*:\s*(?:null|"(?:[^"\\]|\\.)*")/g, '');

  // If platform change needed, update the reservation field value in place.
  const resRe = /("?reservation"?\s*:\s*)"([^"]+)"/;
  const resM = card.match(resRe);
  if (resM && resM[2] !== u.platform) {
    card = card.replace(resRe, '$1"' + u.platform + '"');
    platformChanges++;
  }

  // Inject reserveUrl before final }
  const inject = ',"reserveUrl":"' + esc(u.reserveUrl) + '"';
  const newCard = card.slice(0, -1) + inject + '}';
  arrText = arrText.slice(0, start) + newCard + arrText.slice(end + 1);
  applied++;
}

if (notFound.length) console.error('Not found:', notFound);
console.log('Applied:', applied, '/', UPDATES.length, '— platform corrections:', platformChanges);

const newHtml = beforeArr + arrText + afterArr;
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Wrote index.html (' + (newHtml.length - html.length) + ' byte delta)');

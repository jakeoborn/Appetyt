const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// SURGICAL approach: only fix specific known patterns in specific file regions
// Do NOT touch JSON data (NYC_DATA, DALLAS_DATA etc) — those use double quotes

// List every known unescaped apostrophe in single-quoted JS strings
// Found by searching for error patterns
const fixes = [
  // CITY_NEIGHBORHOODS — NYC section (single-quoted object literals)
  ["knownFor:'Katz's Deli,", "knownFor:'Katz\\'s Deli,"],
  ["Juliana's Pizza, Celestine", "Juliana\\'s Pizza, Celestine"],

  // Film locations data (single-quoted strings)
  ["Joe's Pizza'}", "Joe\\'s Pizza'}"],

  // Dallas _getWeekendGuides (single-quoted)
  ["Leela's Wine Bar", "Leela\\'s Wine Bar"],
  ["Emporium Pies',", "Emporium Pies',"],  // already ok

  // Dallas coming soon items — these use double quotes so should be fine
  // Events — uses single quotes for some values
  ["America's Team in the world's most expensive stadium", "America\\'s Team in the world\\'s most expensive stadium"],
  ["The most electric arena in the city. Pre-game dinner at The Capital Grille or Pappas Bros. two blocks away.'", "The most electric arena in the city. Pre-game dinner at The Capital Grille or Pappas Bros. two blocks away.'"],
];

let fixCount = 0;
fixes.forEach(([from, to]) => {
  if(from === to) return;
  if(h.includes(from)) {
    h = h.replace(from, to);
    fixCount++;
    console.log('Fixed:', from.substring(0, 50));
  }
});
console.log('\nApplied', fixCount, 'surgical fixes');

// Now do a TARGETED scan: only check single-quoted property values
// in the CITY_NEIGHBORHOODS, CITY_EVENTS, _getWeekendGuides sections
const sections = [
  {name: 'CITY_NEIGHBORHOODS', start: h.indexOf('CITY_NEIGHBORHOODS'), end: h.indexOf('const CITY_COORDS')},
  {name: 'CITY_EVENTS openActivities', start: h.indexOf("'New York': [", h.indexOf('CITY_EVENTS')), end: h.indexOf('];', h.indexOf("'New York': [", h.indexOf('CITY_EVENTS'))) + 2},
  {name: 'Weekend Guides NYC', start: h.indexOf("'New York':[", h.indexOf('_getWeekendGuides')), end: h.indexOf(']', h.indexOf("'New York':[", h.indexOf('_getWeekendGuides')) + 3000) + 1},
  {name: 'Film Locations', start: h.indexOf('FILM_LOCATIONS') > -1 ? h.indexOf('FILM_LOCATIONS') : 0, end: h.indexOf('FILM_LOCATIONS') > -1 ? h.indexOf('FILM_LOCATIONS') + 50000 : 0},
];

sections.forEach(s => {
  if(s.start <= 0 || s.end <= 0) return;
  const section = h.substring(s.start, Math.min(s.end, s.start + 50000));

  // Find single-quoted strings with unescaped apostrophes
  // Pattern: look for 'content' where content has letter'letter
  let inSQ = false;
  let sqStart = -1;
  for(let i = 0; i < section.length; i++) {
    const c = section[i];
    const prev = i > 0 ? section[i-1] : '';
    const next = i < section.length - 1 ? section[i+1] : '';

    if(c === "'" && prev !== '\\') {
      if(!inSQ) {
        inSQ = true;
        sqStart = i;
      } else {
        // End of string OR apostrophe?
        if(/[a-zA-Z]/.test(prev) && /[a-z]/.test(next)) {
          // Apostrophe! Need to escape
          const lineNum = h.substring(0, s.start + i).split('\n').length;
          const ctx = section.substring(Math.max(0,i-20), i+20);
          console.log(s.name, 'line', lineNum, ':', ctx);
          // Fix it
          h = h.substring(0, s.start + i) + "\\'" + h.substring(s.start + i + 1);
          fixCount++;
        } else {
          inSQ = false;
        }
      }
    }
  }
});

console.log('\nTotal fixes:', fixCount);

// Verify NYC_DATA still parses
const nycIdx = h.indexOf('const NYC_DATA');
const nycStart = h.indexOf('[', nycIdx);
let depth=0, nycEnd=nycStart;
for(let j=nycStart;j<h.length;j++){
  if(h[j]==='[') depth++;
  if(h[j]===']'){ depth--; if(depth===0){ nycEnd=j+1; break; } }
}
try {
  const arr = JSON.parse(h.substring(nycStart, nycEnd));
  console.log('NYC_DATA: OK,', arr.length, 'spots');
} catch(e) {
  console.log('NYC_DATA: PARSE ERROR -', e.message.substring(0, 80));
}

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');

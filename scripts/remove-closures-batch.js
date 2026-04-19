// Remove 10 confirmed closures found by the full sweep on 2026-04-18.
// Excluded: Brooklyn Botanic Garden #1947 — false positive (phrase was
// "The line to see the corpse flower is now closed", not the garden itself).

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const removals = [
  ['Seattle', 9021, 'Eden Hill', 'Permanently closed'],
  ['Chicago', 16, 'The Violet Hour', 'have closed (per own site)'],
  ['Seattle', 9129, 'The Whale Wins', 'permanently closed'],
  ['Houston', 7216, 'La Lucha', 'closed its doors'],
  ['Dallas', 267, "Armoury D.E.", 'closed its doors'],
  ['Las Vegas', 12385, 'DW Bistro', 'PERMANENTLY CLOSED (all caps — definitive)'],
  ['New York', 1642, 'Sleep No More', 'closed its doors (NYC run ended Jan 2024)'],
  ['Las Vegas', 12474, 'The Goodwich', 'title: The Goodwich is closed'],
  ['Seattle', 9432, 'Bitterroot BBQ', 'permanently closed'],
  ['New York', 1635, 'Carolines on Broadway', 'Thank You for 30 Years (comedy club closed 2022)'],
];

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};

const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

const report = [];
removals.forEach(([city, id, name, reason]) => {
  const data = perCity[city];
  const before = data.length;
  const target = data.find(r => r.id === id);
  if (!target) { report.push(`  ! ${city}#${id} ${name} NOT FOUND`); return; }
  if (!target.name.toLowerCase().includes(name.toLowerCase().slice(0, 6))) {
    report.push(`  ! ${city}#${id} name mismatch: "${target.name}" expected "${name}"`); return;
  }
  perCity[city] = data.filter(r => r.id !== id);
  report.push(`  ${city}#${id} "${target.name}" REMOVED — ${reason}`);
});

// Also clean up any cityLinks that pointed to these removed entries
// (need to sweep all cities for stale links)
const removedNames = new Set(removals.map(r => r[2].toLowerCase()));
let linkFixes = 0;
Object.entries(perCity).forEach(([cityName, data]) => {
  data.forEach(r => {
    if (!Array.isArray(r.cityLinks) || !r.cityLinks.length) return;
    // For each cityLink, check if the referenced city still has a match for this brand
    const myBrand = r.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
    if (!myBrand || myBrand.length < 4) return;
    const before = r.cityLinks.length;
    r.cityLinks = r.cityLinks.filter(linkedCity => {
      const target = perCity[linkedCity];
      if (!target) return true;
      const stillExists = target.some(x => new RegExp('\\b' + myBrand + '\\b', 'i').test(x.name));
      return stillExists;
    });
    if (r.cityLinks.length !== before) linkFixes++;
    if (r.cityLinks.length === 0) delete r.cityLinks;
  });
});

// Write back bottom-up
const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('=== CLOSURE REMOVAL ===');
report.forEach(r => console.log(r));
console.log('\nCityLinks cleaned up: ' + linkFixes + ' entries had stale links removed');

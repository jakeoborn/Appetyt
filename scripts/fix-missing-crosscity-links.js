// Fix missing cityLinks identified by broad audit after LA + Phoenix were added.
// Same-name-different-brand pairs are intentionally skipped (see SKIP_FUZZY_BRANDS
// in link-crosscity-all-brands.js).

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};

// Load all city data once
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

// Each row = [city, id, targetCities[]]. Will merge targetCities into existing cityLinks.
const fixes = [
  // Nobu — NYC/Vegas/LA is the same global brand
  ['Los Angeles', 2007, ['Las Vegas','New York']],
  ['Las Vegas', 12023, ['Los Angeles']], // already has Dallas, Houston, NYC
  ['New York', 1245, ['Los Angeles']], // already has Vegas

  // Gjelina — originally LA Venice brand, now NYC + Vegas outposts
  ['Los Angeles', 2021, ['Las Vegas','New York']],
  ['Las Vegas', 12132, ['Los Angeles']], // already has NYC
  ['New York', 1925, ['Los Angeles']], // already has Vegas

  // Spago — Wolfgang Puck's original in LA + Vegas outpost
  ['Los Angeles', 2006, ['Las Vegas']],
  ['Las Vegas', 12010, ['Los Angeles']],

  // Crossroads Kitchen — Tal Ronnen LA original + Vegas outpost
  ['Los Angeles', 2043, ['Las Vegas']],
  ['Las Vegas', 12100, ['Los Angeles']],

  // Chengdu Taste — Tony Xu's San Gabriel Valley flagship + Vegas
  ['Los Angeles', 2111, ['Las Vegas']],
  ['Las Vegas', 12241, ['Los Angeles']],

  // Carbone — Vegas Carbone Riviera missing NYC link (already has Dallas)
  ['Las Vegas', 12004, ['New York']],
];

let linksAdded = 0;
const added = [];

fixes.forEach(([city, id, newLinks]) => {
  const data = perCity[city];
  if (!data) { console.log(`! missing city: ${city}`); return; }
  const r = data.find(x => x.id === id);
  if (!r) { console.log(`! missing #${id} in ${city}`); return; }
  const existing = Array.isArray(r.cityLinks) ? r.cityLinks.slice() : [];
  const existingSet = new Set(existing);
  const toAdd = newLinks.filter(c => !existingSet.has(c));
  if (!toAdd.length) return;
  r.cityLinks = [...existing, ...toAdd];
  linksAdded += toAdd.length;
  added.push(`${city}#${id} "${r.name}": +${toAdd.join(',')} (now: ${r.cityLinks.join(',')})`);
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
console.log(`Added ${linksAdded} cityLinks:`);
added.forEach(a => console.log('  ' + a));

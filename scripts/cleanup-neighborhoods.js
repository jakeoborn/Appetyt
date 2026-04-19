// Clean up:
// 1. Remove/update "Multiple Locations" placeholder entries that aren't destination restaurants
// 2. Consolidate NYC "East Williamsburg / Ridgewood" variants (move Nowadays to proper Ridgewood)
// 3. Fix dangling cityLinks after removals

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

const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

const report = [];

// === REMOVALS: generic chains without specific destination address ===
const removals = [
  ['Houston', 7220, 'Whataburger — Texas fast-food chain, no specific address'],
  ['Houston', 7446, 'Taquerias Arandas — chain, no specific address'],
  ['Chicago', 347, "Harold's Chicken Shack — chain, no specific address"],
  ['Chicago', 381, "Mariano's Fresh Market — grocery store, not a destination restaurant"],
  ['New York', 1787, 'Joe & The Juice — global chain, no specific address'],
  ['New York', 1788, 'CAVA — fast-casual chain placeholder, no specific address'],
];

removals.forEach(([city, id, reason]) => {
  const data = perCity[city];
  const before = data.length;
  perCity[city] = data.filter(r => r.id !== id);
  if (perCity[city].length < before) {
    report.push(`  REMOVE ${city}#${id}: ${reason}`);
  }
});

// === UPDATE NEIGHBORHOODS for entries with real addresses ===
const neighborhoodUpdates = [
  ['Houston', 7230, 'Friendswood', "Gringo's — address is in Friendswood, TX"],
  ['Chicago', 230, 'Wicker Park', "Jeni's — 1925 W North Ave is Wicker Park"],
  ['New York', 1368, 'Ridgewood', 'Nowadays — 56-06 Cooper Ave is in Ridgewood, Queens (not border compound)'],
];

neighborhoodUpdates.forEach(([city, id, newNbhd, reason]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r) return;
  const old = r.neighborhood;
  r.neighborhood = newNbhd;
  report.push(`  UPDATE ${city}#${id} "${r.name}" neighborhood "${old}" → "${newNbhd}" — ${reason}`);
});

// === FIX DANGLING CITYLINKS ===
// After removing NYC CAVA (#1788), Dallas CAVA (#325) may still list NYC.
// After removing NYC Joe & The Juice, no existing links to clean.
const clkFixes = [
  ['Dallas', 325, 'New York', "CAVA NYC removed, drop stale cityLink"],
];
clkFixes.forEach(([city, id, dropCity, reason]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r || !Array.isArray(r.cityLinks)) return;
  const before = r.cityLinks.length;
  r.cityLinks = r.cityLinks.filter(c => c !== dropCity);
  if (r.cityLinks.length === 0) delete r.cityLinks;
  if (r.cityLinks?.length !== before) {
    report.push(`  FIX-LINKS ${city}#${id} "${r.name}" -${dropCity} — ${reason}`);
  }
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
console.log('=== NEIGHBORHOOD / PLACEHOLDER CLEANUP ===');
report.forEach(r => console.log(r));
console.log(`\nTotal: ${removals.length} removals, ${neighborhoodUpdates.length} nbhd updates, ${clkFixes.length} link fixes`);

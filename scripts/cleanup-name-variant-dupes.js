// Clean up 16 dupe groups found by scripts/audit-name-variants.js.
// 14 are exact-same-address duplicates (dedupe keep higher score / better name).
// 2 are multi-location same-brand entries (merge into locations[] on primary).

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

// === DEDUPE actions: [city, keepId, removeId, rationale] ===
const dedupes = [
  ['Austin', 5054, 5331, 'same address 5520 Burnet Rd; #5331 had wrong neighborhood label'],
  ['Austin', 5080, 5545, 'same venue 1315 S Congress Ave (Continental Club)'],
  ['Chicago', 18, 461, 'same venue 837 W Fulton Market (Publican)'],
  ['Chicago', 66, 168, 'same venue 1028 N Rush St (Gibsons)'],
  ['Salt Lake City', 11591, 11129, 'Brownstone 22 — keep newer #11591 with Gastronomic SLC context'],
  ['Salt Lake City', 11227, 11567, 'Bruges same venue 336 W Broadway'],
  ['Las Vegas', 12054, 12326, 'Golden Tiki same venue 3939 Spring Mountain Rd'],
  ['Las Vegas', 12232, 12453, 'Black Sheep same venue 8680 W Warm Springs (Spring Valley, not Chinatown)'],
  ['Las Vegas', 12458, 12340, 'Eat. — keep #12458 with proper brand-name period'],
  ['Las Vegas', 12501, 12425, "Holstein's — keep #12501 with proper apostrophe"],
  ['Seattle', 9034, 9397, 'Mountaineering Club Graduate Hotel rooftop, same venue'],
  ['Seattle', 9226, 9338, '5 Spot same venue 1502 Queen Anne Ave N'],
  ['New York', 1810, 1095, "Scarr's Pizza — keep #1810 with proper apostrophe and higher score"],
  ['New York', 1891, 1546, 'Long Island Bar same venue 110 Atlantic Ave; keep #1891 higher score'],
];

// === MERGE actions: multi-location same brand → merge into primary with locations[] ===
// [city, primaryId, mergeIds[]]
const merges = [
  ['Salt Lake City', 11057, [11552], 'Pig & A Jelly Jar multi-location'],
  ['Seattle', 9199, [9378], 'Purple Cafe & Wine Bar Downtown + Kirkland'],
];

const report = [];

// Apply dedupes
dedupes.forEach(([city, keepId, removeId, reason]) => {
  const data = perCity[city];
  const keep = data.find(r => r.id === keepId);
  const rm = data.find(r => r.id === removeId);
  if (!keep || !rm) {
    report.push(`  SKIP ${city} keep#${keepId} rm#${removeId}: ${keep?'':'(keep missing)'}${rm?'':'(rm missing)'}`);
    return;
  }
  perCity[city] = data.filter(r => r.id !== removeId);
  report.push(`  DEDUPE ${city}: removed #${removeId} "${rm.name}" (kept #${keepId} "${keep.name}") — ${reason}`);
});

// Apply merges
merges.forEach(([city, primaryId, mergeIds, reason]) => {
  const data = perCity[city];
  const primary = data.find(r => r.id === primaryId);
  if (!primary) { report.push(`  SKIP merge ${city} #${primaryId} (primary missing)`); return; }
  const existingLocs = Array.isArray(primary.locations) ? primary.locations.slice() : [{
    name: primary.neighborhood || '', neighborhood: primary.neighborhood || '',
    address: primary.address || '', lat: primary.lat, lng: primary.lng, phone: primary.phone || '',
  }];
  const removeIds = [];
  mergeIds.forEach(mid => {
    const other = data.find(r => r.id === mid);
    if (!other) return;
    existingLocs.push({
      name: other.neighborhood || '', neighborhood: other.neighborhood || '',
      address: other.address || '', lat: other.lat, lng: other.lng, phone: other.phone || '',
    });
    removeIds.push(mid);
    report.push(`  MERGE ${city}: "${other.name}" #${mid} → #${primaryId} locations[+] — ${reason}`);
  });
  primary.locations = existingLocs;
  perCity[city] = data.filter(r => !removeIds.includes(r.id));
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
console.log('=== DEDUPE + MERGE CLEANUP ===');
report.forEach(r => console.log(r));
console.log(`\nTotal: ${dedupes.length} dedupes + ${merges.length} merges.`);

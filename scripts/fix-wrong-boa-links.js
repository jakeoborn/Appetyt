// Undo bad cityLinks added by fuzzy-match error.
// IDs 9083, 5285, 9053, 1646 are NOT BOA Steakhouse — they're unrelated
// restaurants whose names contain "boa" as a substring (Board, Boat, etc).

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const cities = {'Dallas':'const DALLAS_DATA','Austin':'const AUSTIN_DATA','Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA'};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

const badLinks = [
  ['Dallas', 9083, 'Los Angeles'],      // Fount Board + Table (not BOA)
  ['Austin', 5285, 'Los Angeles'],      // Bread Boat (not BOA)
  ['Seattle', 9053, 'Los Angeles'],     // Ray's Boathouse (not BOA)
  ['New York', 1646, 'Los Angeles'],    // Royal Palms Shuffleboard Club (not BOA)
];

let fixed = 0;
badLinks.forEach(([city, id, dropCity]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r || !Array.isArray(r.cityLinks)) return;
  const before = r.cityLinks.length;
  r.cityLinks = r.cityLinks.filter(c => c !== dropCity);
  if (r.cityLinks.length === 0) delete r.cityLinks;
  if ((r.cityLinks?.length ?? 0) !== before) {
    fixed++;
    console.log('  ' + city + '#' + id + ' "' + r.name + '" -' + dropCity);
  }
});

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
console.log('\nRemoved', fixed, 'incorrect cityLinks. These 4 IDs are not BOA Steakhouse.');

// Revert URL fixes that pointed to hugedomains.com (parked domains for sale).
// These entries are almost certainly closed businesses — restore original URL
// so they show up correctly in future sweeps.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const fixes = JSON.parse(fs.readFileSync('scripts/url-fixes-report.json', 'utf8'));
const hugedomains = fixes.filter(f => /hugedomains\.com/i.test(f.newUrl));
console.log(`Found ${hugedomains.length} hugedomains.com redirects (parked/for-sale domains):`);

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

hugedomains.forEach(f => {
  const r = perCity[f.city].find(x => x.id === f.id);
  if (!r) return;
  r.website = f.oldUrl;  // restore original
  console.log(`  ${f.city}#${f.id} "${f.name}" — restored original URL ${f.oldUrl}`);
});

// Write back bottom-up
const ordered = Object.entries(cities).sort((a,b) => locateArray(b[1]).arrS - locateArray(a[1]).arrS);
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});
fs.writeFileSync('index.html', html, 'utf8');
console.log(`\nReverted ${hugedomains.length} bad fixes. These entries should be investigated for closure.`);

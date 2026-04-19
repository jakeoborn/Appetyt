// Revert URL "fixes" that replaced a broken specific page with a useless root
// page (e.g., individual MGM restaurant page → just aria.mgmresorts.com/en.html
// which doesn't help users find the actual restaurant).
//
// Policy: if the "fix" is just the domain root AND the path was meaningful, revert.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const fixes = JSON.parse(fs.readFileSync('scripts/url-fixes-report.json', 'utf8'));

// A fix is "useless" if:
//  - the old URL had a meaningful path (>10 chars, e.g. /restaurants/spago.html)
//  - the new URL is just the domain root or a generic landing (path length <= 8)
function isUseless(oldUrl, newUrl) {
  try {
    const o = new URL(oldUrl);
    const n = new URL(newUrl);
    const oldPathLen = (o.pathname + o.search).replace(/\/$/, '').length;
    const newPathLen = (n.pathname + n.search).replace(/\/$/, '').length;
    // Old had meaningful path, new is just root or very short
    if (oldPathLen > 10 && newPathLen <= 8) return true;
    return false;
  } catch (e) { return false; }
}

const uselessFixes = fixes.filter(f => isUseless(f.oldUrl, f.newUrl));
// Also include entries where the "new" is hugedomains (already reverted, but belt-and-suspenders)
const hugedomains = fixes.filter(f => /hugedomains\.com/i.test(f.newUrl));

const allRevertIds = new Set([...uselessFixes, ...hugedomains].map(f => f.city + '#' + f.id));

console.log(`Reverting ${uselessFixes.length} useless root-page "fixes":`);

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

let reverted = 0;
[...uselessFixes, ...hugedomains].forEach(f => {
  const r = perCity[f.city].find(x => x.id === f.id);
  if (!r) return;
  if (r.website === f.newUrl) {
    r.website = f.oldUrl;
    reverted++;
    console.log(`  ${f.city}#${f.id} "${f.name}" — restored ${f.oldUrl}`);
  }
});

const ordered = Object.entries(cities).sort((a,b) => locateArray(b[1]).arrS - locateArray(a[1]).arrS);
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});
fs.writeFileSync('index.html', html, 'utf8');
console.log(`\nReverted ${reverted} bad fixes. The original URLs (with 404 path or parked domain) are back.`);

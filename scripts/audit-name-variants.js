// Find in-city same-venue duplicates that weren't caught by earlier merge audits.
// Catches variants like "Long Island Bar" vs "The Long Island Bar" — same venue,
// different article prefix or punctuation.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}

// Ultra-normalized name — strips leading "the ", "&" → "and", punctuation, lowercase.
function ultraNormalize(name) {
  return String(name || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\band\b/g, '&')
    .replace(/^the\s+/, '')
    .replace(/\s+bar$/, ' bar')
    .replace(/[.,'`\-()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};

let totalIssues = 0;
Object.entries(cities).forEach(([city, varName]) => {
  const data = pa(varName);
  const groups = {};
  data.forEach(r => {
    const k = ultraNormalize(r.name);
    if (!k) return;
    if (!groups[k]) groups[k] = [];
    groups[k].push(r);
  });
  const dupes = Object.entries(groups).filter(([,v]) => v.length >= 2);
  if (!dupes.length) return;
  console.log(`\n=== ${city} — ${dupes.length} duplicate groups ===`);
  dupes.forEach(([k, v]) => {
    totalIssues++;
    console.log(`  [${k}]`);
    v.forEach(r => console.log(`    #${r.id} "${r.name}" (${r.neighborhood}) score:${r.score} price:$${r.price}`));
  });
});
console.log(`\nTotal duplicate groups across all cities: ${totalIssues}`);

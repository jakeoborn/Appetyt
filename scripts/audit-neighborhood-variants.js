// Find in-city neighborhoods that are likely variants of the same area
// (e.g., "East Williamsburg" vs "East Williamsburg / Ridgewood").

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}

function canonical(nbhd) {
  return String(nbhd || '').toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// Return set of "tokens" from a neighborhood name — split by slash or comma,
// treat each side as a candidate sub-neighborhood.
function tokens(nbhd) {
  return canonical(nbhd).split(/\s*[/,]\s*/).filter(Boolean);
}

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};

Object.entries(cities).forEach(([city, varName]) => {
  const data = pa(varName);
  const nbhdCounts = {};
  data.forEach(r => {
    const c = canonical(r.neighborhood);
    if (!c) return;
    nbhdCounts[c] = (nbhdCounts[c] || 0) + 1;
  });
  const allNbhds = Object.keys(nbhdCounts).sort();

  // For each nbhd, find other nbhds that share a token (and thus may be variants)
  const suspicious = [];
  for (let i = 0; i < allNbhds.length; i++) {
    const a = allNbhds[i];
    const aTokens = new Set(tokens(a));
    for (let j = i + 1; j < allNbhds.length; j++) {
      const b = allNbhds[j];
      const bTokens = new Set(tokens(b));
      // Skip exact matches or completely disjoint
      if (a === b) continue;
      const shared = [...aTokens].filter(t => bTokens.has(t));
      if (!shared.length) continue;
      // Flag only when one is a strict subset/superset OR shares all primary tokens
      const aSubsetB = [...aTokens].every(t => bTokens.has(t));
      const bSubsetA = [...bTokens].every(t => aTokens.has(t));
      if (aSubsetB || bSubsetA || shared.length === Math.min(aTokens.size, bTokens.size)) {
        suspicious.push({a, aCount: nbhdCounts[a], b, bCount: nbhdCounts[b], shared});
      }
    }
  }

  if (suspicious.length) {
    console.log(`\n=== ${city} (${suspicious.length} suspicious pairs) ===`);
    suspicious.forEach(s => {
      console.log(`  "${s.a}" (${s.aCount} entries) ~ "${s.b}" (${s.bCount} entries) — shared: [${s.shared.join(', ')}]`);
    });
  }
});

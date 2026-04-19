// Export 7 strongest Peter-Luger-voice exemplars from existing NYC entries
// as input for Tribe AI's Brand Voice plug-in /discover-brand skill.
// Output: scripts/brand-voice-exemplars.txt — paste into /discover-brand in claude.ai.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}

const nyc = pa('const NYC_DATA');

// User-selected exemplars spanning the tonal range:
// Peter Luger (iconic/swagger), Carbone (theatrical), COTE (Michelin-sharp),
// Sadelle's (photogenic/clever), Nobu Downtown (global/empire), Scarr's (LES-cool),
// Sweetgreen (commodity-brand voice — different tier but consistent attitude)
const ids = [1003, 1004, 1037, 1082, 1245, 1810, 1166];

const out = [];
out.push("# Dim Hour Brand Voice — Exemplar Cards\n");
out.push("These 7 descriptions represent the target voice across tonal tiers.");
out.push("Paste into Tribe AI /discover-brand to extract the voice profile.\n");
out.push("---\n");

ids.forEach(id => {
  const r = nyc.find(x => x.id === id);
  if (!r) return;
  out.push(`## ${r.name} (${r.cuisine}, ${r.neighborhood})`);
  out.push(`Score: ${r.score} · Price: $${r.price}`);
  if (r.awards) out.push(`Awards: ${r.awards}`);
  out.push('');
  out.push(r.description);
  out.push('');
  out.push(`Signature dishes: ${(r.dishes || []).join(', ')}`);
  out.push('\n---\n');
});

fs.writeFileSync('scripts/brand-voice-exemplars.txt', out.join('\n'));
console.log('Wrote scripts/brand-voice-exemplars.txt —', ids.length, 'exemplars,', fs.statSync('scripts/brand-voice-exemplars.txt').size, 'bytes');
console.log('\nTop snippet:');
console.log(out.slice(0, 12).join('\n'));

const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const nyc = pa('const NYC_DATA');
const pl = nyc.find(r => r.id === 1003);
console.log('=== Peter Luger Steak House (template) ===');
console.log('cuisine:', pl.cuisine);
console.log('tags:', pl.tags);
console.log('awards:', pl.awards);
console.log('indicators:', pl.indicators);
console.log('dishes:', pl.dishes);
console.log('description:', pl.description);
console.log();
// Compare with other top NYC cards
[1004,1037,1082,1166,1245,1400,1003].forEach(id => {
  const r = nyc.find(x=>x.id===id);
  if(!r) return;
  console.log('---', r.name, '($' + r.price + ', score:' + r.score + ')');
  console.log('  desc:', r.description);
  console.log('  dishes:', r.dishes);
});

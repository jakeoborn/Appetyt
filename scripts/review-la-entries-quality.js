const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const la = pa('const LA_DATA');

// Show all entries I added (id >= 2031) — original 29 are id <= 2030
const myAdds = la.filter(r => r.id >= 2031);
console.log('=== My LA additions (id >= 2031):', myAdds.length, '===\n');
myAdds.forEach(r => {
  console.log(`#${r.id} ${r.name} ($${r.price}, score:${r.score})`);
  console.log(`  desc: "${r.description}"`);
  console.log(`  dishes: ${JSON.stringify(r.dishes)}`);
  console.log();
});

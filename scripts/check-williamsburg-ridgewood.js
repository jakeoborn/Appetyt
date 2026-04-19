const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const nyc = pa('const NYC_DATA');
['east williamsburg','east williamsburg / ridgewood','ridgewood'].forEach(n => {
  const hits = nyc.filter(r => (r.neighborhood||'').toLowerCase().trim() === n);
  console.log('\n"' + n + '":', hits.length, 'entries');
  hits.forEach(r => console.log(`  #${r.id} "${r.name}" addr="${r.address}"`));
});

const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const austin=pa('const AUSTIN_DATA');
const slc=pa('const SLC_DATA');

console.log('=== AUSTIN ===');
['Twin Isle','Small','Space Kat','Oria','Le Calamar','Kiin Di',"Boni",'Leona'].forEach(n=>{
  const hit=austin.find(r=>r.name.toLowerCase().includes(n.toLowerCase()));
  console.log(' ', n, '→', hit ? `EXISTS "${hit.name}"` : 'NEW');
});

console.log('\n=== SLC ===');
['Drunken Kitchen','RIME','La Casa Del Tamal','Le Depot','Basalt','Franklin Ave','Himalayan Kitchen','Oquirrh','Bar Nohm','Copper Common','Midway Mercantile','Post Office Place','The Pearl','Finca'].forEach(n=>{
  const hit=slc.find(r=>r.name.toLowerCase().includes(n.toLowerCase()));
  console.log(' ', n, '→', hit ? `EXISTS "${hit.name}"` : 'NEW');
});

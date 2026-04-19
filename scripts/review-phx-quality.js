const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const phx = pa('const PHX_DATA');
const byName={};phx.forEach(r=>{const k=String(r.name).toLowerCase().replace(/[^a-z]/g,'');if(!byName[k])byName[k]=[];byName[k].push(r);});
const dupes=Object.entries(byName).filter(([,v])=>v.length>=2);
console.log('Dupes:',dupes.length);
const out=phx.filter(r=>r.lat<32.8||r.lat>34.2||r.lng<-113||r.lng>-111.3);
console.log('Out-of-range coords:',out.length, out.length ? out.map(r=>r.name):'');
const miss=phx.filter(r=>!r.name||!r.cuisine||!r.neighborhood||!r.address||!r.description);
console.log('Missing critical:',miss.length);
const nbhds=new Set(phx.map(r=>r.neighborhood).filter(Boolean));
console.log('Neighborhoods:',nbhds.size,'→',[...nbhds].sort().join(', '));
console.log('Total:',phx.length,'| avg tags/entry:',(phx.reduce((s,r)=>s+(r.tags||[]).length,0)/phx.length).toFixed(1),'| websites:',phx.filter(r=>r.website).length,'| awards:',phx.filter(r=>r.awards).length,'| suburb:',phx.filter(r=>r.suburb).length);

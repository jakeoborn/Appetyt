const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const p=h.indexOf('const LV_DATA=');
const s=h.indexOf('[',p);
let d=0,e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
const arr=JSON.parse(h.substring(s,e));
console.log('TOTAL:',arr.length);

// Neighborhoods
const nb={};
arr.forEach(r=>{nb[r.neighborhood]=(nb[r.neighborhood]||0)+1});
console.log('\n=== NEIGHBORHOODS ===');
Object.entries(nb).sort((a,b)=>a[1]-b[1]).forEach(([k,v])=>console.log(v.toString().padStart(3),k));

// Tags (filters)
const tg={};
arr.forEach(r=>(r.tags||[]).forEach(t=>tg[t]=(tg[t]||0)+1));
console.log('\n=== TAGS / FILTERS ===');
Object.entries(tg).sort((a,b)=>a[1]-b[1]).forEach(([k,v])=>console.log(v.toString().padStart(3),k));

// Indicators
const ind={};
arr.forEach(r=>(r.indicators||[]).forEach(t=>ind[t]=(ind[t]||0)+1));
console.log('\n=== INDICATORS ===');
Object.entries(ind).sort((a,b)=>a[1]-b[1]).forEach(([k,v])=>console.log(v.toString().padStart(3),k));

// Cuisines
const cu={};
arr.forEach(r=>cu[r.cuisine]=(cu[r.cuisine]||0)+1);
console.log('\n=== CUISINES (top 30) ===');
Object.entries(cu).sort((a,b)=>b[1]-a[1]).slice(0,30).forEach(([k,v])=>console.log(v.toString().padStart(3),k));

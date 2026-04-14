const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');

// Extract HOSPITALITY_GROUPS keys — detect duplicates
const hgStart=h.indexOf('const HOSPITALITY_GROUPS = {');
let d=0,inS=false,sC='',esc=false,hgEnd=-1;
for(let i=hgStart+25;i<h.length;i++){
  const c=h[i];
  if(esc){esc=false;continue;}
  if(c==='\\'){esc=true;continue;}
  if(inS){if(c===sC)inS=false;continue;}
  if(c==='"'||c==="'"||c==='`'){inS=true;sC=c;continue;}
  if(c==='{')d++;else if(c==='}'){d--;if(d===0){hgEnd=i;break;}}
}
const hgBlock=h.substring(hgStart,hgEnd);
const keys=[...hgBlock.matchAll(/\n\s+'([^']+)'\s*:\s*\{/g)].map(m=>m[1]);
console.log('Total HG entries:',keys.length);
const dupes=keys.filter((k,i)=>keys.indexOf(k)!==i);
console.log('DUPLICATES:',dupes);

function parseArr(marker){
  const p=h.indexOf(marker);if(p<0)return [];
  const s=h.indexOf('[',p);let dd=0,ee=s;
  for(let j=s;j<h.length;j++){if(h[j]==='[')dd++;if(h[j]===']'){dd--;if(dd===0){ee=j+1;break;}}}
  try{return JSON.parse(h.substring(s,ee));}catch(err){return [];}
}

const cities={
  Dallas:parseArr('const DALLAS_DATA='),
  Austin:parseArr('const AUSTIN_DATA='),
  Houston:parseArr('const HOUSTON_DATA='),
  SLC:parseArr('const SLC_DATA='),
  Seattle:parseArr('const SEATTLE_DATA='),
  Vegas:parseArr('const LV_DATA=')
};

// Flag suspect patterns
console.log('\n=== Possible mislabeled groups (hotel-as-group) ===');
Object.entries(cities).forEach(([city,arr])=>{
  const groupCounts={};
  arr.forEach(r=>{if(r.group&&r.group.trim())groupCounts[r.group]=(groupCounts[r.group]||0)+1;});
  Object.entries(groupCounts).forEach(([g,cnt])=>{
    const suspects=['Hotel ','Resorts','The Joule','Rosewood','Mandalay','Aria Resort','Bellagio Resort','Wynn Resorts','Palazzo','Cosmopolitan','The Venetian','Caesars Palace','MGM Grand','Encore','Park MGM','Fontainebleau','Resorts World'];
    for(const s of suspects){
      if(g.includes(s)){
        console.log('  '+city+' ['+cnt+']: group="'+g+'"');
        break;
      }
    }
  });
});

// Flag self-reference (group name == restaurant name, single-restaurant groups)
console.log('\n=== Single-restaurant self-referencing groups (noise) ===');
Object.entries(cities).forEach(([city,arr])=>{
  arr.forEach(r=>{
    if(r.group&&r.group.trim()&&r.name===r.group){
      console.log('  '+city+': '+r.name+' (group="'+r.group+'")');
    }
  });
});

// Suspect generic/sub-brand groups that may belong to bigger ones
console.log('\n=== Known sub-brands that might need reassignment ===');
const knownParents={
  'Carbone':'Major Food Group',
  'Carbone Riviera':'Major Food Group',
  'Sadelle\'s':'Major Food Group',
  'Sadelles':'Major Food Group',
  'HaSalon':'North Abraxas/Eyal Shani',
  'Nobu':'Nobu Restaurants',
  'Catch':'Catch Hospitality Group',
  'Catch Las Vegas':'Catch Hospitality Group',
  'STK':'The ONE Group',
  'STK Steakhouse':'The ONE Group',
  'Delilah':'h.wood Group',
  'Mastro\'s':'Landry\'s/Mastro\'s Restaurants',
  'Papi Steak':'Groot Hospitality',
  'Komodo':'Groot Hospitality',
  'TAO':'Tao Group Hospitality',
  'Hakkasan':'Tao Group Hospitality',
  'LAVO':'Tao Group Hospitality',
  'Beauty & Essex':'Tao Group Hospitality',
  'Fuhu':'Zouk Group',
  'Morimoto':'Morimoto Restaurants',
  'Zuma':'Azumi/Zuma Group',
  'Estiatorio Milos':'Milos',
  'Bavette\'s':'Hogsalt Hospitality',
  'Bavette\'s Steakhouse & Bar':'Hogsalt Hospitality',
  'Bouchon':'Thomas Keller Restaurant Group',
  'Shiro\'s Sushi':'Shiro\'s',
  'Matteo\'s':'Matteo\'s',
  'Delmonico Steakhouse':'Emeril Lagasse'
};
Object.entries(cities).forEach(([city,arr])=>{
  arr.forEach(r=>{
    const expected=knownParents[r.name];
    if(expected && r.group !== expected){
      if(!r.group) return;
      console.log('  '+city+': '+r.name+' has group="'+r.group+'" — expected parent: '+expected);
    }
  });
});

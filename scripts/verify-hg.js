const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const start=h.indexOf('const HOSPITALITY_GROUPS = {');
let depth=0,inStr=false,strCh='',escape=false,end=-1;
for(let i=start+25;i<h.length;i++){
  const c=h[i];
  if(escape){escape=false;continue;}
  if(c==='\\'){escape=true;continue;}
  if(inStr){if(c===strCh)inStr=false;continue;}
  if(c==='"'||c==="'"||c==='`'){inStr=true;strCh=c;continue;}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){end=i;break;}}
}
const block=h.substring(start,end+2);
try {
  new Function(block);
  console.log('HOSPITALITY_GROUPS syntax: OK');
} catch(e) { console.log('SYNTAX ERROR:',e.message.substring(0,200)); }
const matches=block.match(/^    '[^']+':\s*\{/gm);
console.log('Total HOSPITALITY_GROUPS entries:', matches?matches.length:0);
// Check the new ones
['Gordon Ramsay Restaurants','Mina Group','Joël Robuchon','Wolfgang Puck','Groot Hospitality','Ethan Stowell Restaurants','Sea Creatures','Tom Douglas','Gibsons Restaurant Group','Hotel Swexan','Lombardi Family Concepts'].forEach(k=>{
  console.log(k+':',h.includes("'"+k+"'")?'YES':'MISSING');
});

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cityVar = process.argv[2] || 'PHX_DATA';
const n = parseInt(process.argv[3] || '5', 10);
const m = html.match(new RegExp('const ' + cityVar + '\\s*=\\s*\\['));
const start = m.index + m[0].length - 1;
let depth=0,inStr=false,esc=false,sc=null,end=-1;
for(let i=start;i<html.length;i++){const c=html[i];
  if(esc){esc=false;continue}
  if(c==='\\' && inStr){esc=true;continue}
  if(inStr){if(c===sc){inStr=false;sc=null}continue}
  if(c==='"'||c==="'"){inStr=true;sc=c;continue}
  if(c==='[')depth++;
  if(c===']'){depth--;if(!depth){end=i+1;break}}
}
const arr = JSON.parse(html.substring(start, end));
console.log(`${cityVar} entries with photoUrl: ${arr.filter(r=>r.photoUrl).length} of ${arr.length}`);
console.log(`\nTop ${n} by score:`);
arr.filter(r=>r.photoUrl).sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,n).forEach(r=>{
  console.log(`  ${r.name} (score ${r.score})`);
  console.log(`    ${r.photoUrl}`);
});

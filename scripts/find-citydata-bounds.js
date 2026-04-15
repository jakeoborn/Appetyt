const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('const CITY_DATA =');
console.log('Start at char:',start);
let depth=0, inStr=false, strCh='', escape=false, end=-1;
for(let i=start; i<Math.min(start+500000,html.length); i++){
  const c=html[i];
  if(escape){ escape=false; continue; }
  if(c==='\\'){ escape=true; continue; }
  if(inStr){
    if(c===strCh) inStr=false;
    continue;
  }
  if(c==='"'||c==="'"||c==='`'){ inStr=true; strCh=c; continue; }
  if(c==='{') depth++;
  else if(c==='}'){ depth--; if(depth===0){end=i; break;} }
}
console.log('End at char:',end);
console.log('Length:',end-start);
const lineNum=html.substring(0,end).split('\n').length;
console.log('End line:',lineNum);
console.log('Last 400 chars before close:');
console.log(html.substring(end-400,end+5));

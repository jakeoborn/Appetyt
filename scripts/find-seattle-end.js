const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const s=html.indexOf('const SEATTLE_DATA=');
let depth=0, inStr=false, strCh='', escape=false, end=-1;
for(let i=s; i<html.length; i++){
  const c=html[i];
  if(escape){ escape=false; continue; }
  if(c==='\\'){ escape=true; continue; }
  if(inStr){
    if(c===strCh) inStr=false;
    continue;
  }
  if(c==='"'||c==="'"||c==='`'){ inStr=true; strCh=c; continue; }
  if(c==='[') depth++;
  else if(c===']'){ depth--; if(depth===0){end=i; break;} }
}
console.log('SEATTLE_DATA array ends at char:',end);
const lineNum=html.substring(0,end).split('\n').length;
console.log('End line:',lineNum);
console.log('Chars after end:',JSON.stringify(html.substring(end,end+100)));

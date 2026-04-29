const fs = require('fs');
const text = fs.readFileSync('index.html', 'utf8');
const m = /const SF_DATA=\[/.exec(text);
const openIdx = m.index + 'const SF_DATA='.length;
let depth=0, closeIdx=-1, inStr=false, sc='', esc=false;
for (let i=openIdx; i<text.length; i++) {
  const c=text[i];
  if(esc){esc=false;continue;}
  if(inStr){if(c==='\\'){esc=true;continue;}if(c===sc)inStr=false;continue;}
  if(c==='"'||c==="'"){inStr=true;sc=c;continue;}
  if(c==='[')depth++;
  else if(c===']'){depth--;if(depth===0){closeIdx=i;break;}}
}
const inner = text.slice(openIdx+1, closeIdx);
const names = [...inner.matchAll(/"name":"([^"]+)"/g)].map(m=>m[1]);
const ids = [...inner.matchAll(/"id":(\d+)/g)].map(m=>parseInt(m[1]));
console.log('Count:', names.length, '| Max ID:', Math.max(...ids));
names.forEach(n => console.log(n));

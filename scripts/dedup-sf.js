// Remove duplicate cards (same id) from SF_DATA, keeping first occurrence.
const fs = require('fs');
const path = require('path');
const HTML = path.resolve(__dirname, '..', 'index.html');
const text = fs.readFileSync(HTML, 'utf8');

const m = /const SF_DATA=\[/.exec(text);
if (!m) { console.error('SF_DATA not found'); process.exit(1); }
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

// Extract top-level objects with their spans
function splitTopLevel(s) {
  const objs = [];
  let d=0, start=-1, instr=false, sc2='', esc2=false;
  for (let i=0; i<s.length; i++) {
    const c=s[i];
    if(esc2){esc2=false;continue;}
    if(instr){if(c==='\\'){esc2=true;continue;}if(c===sc2)instr=false;continue;}
    if(c==='"'||c==="'"){instr=true;sc2=c;continue;}
    if(c==='{'){if(d===0)start=i;d++;}
    else if(c==='}'){d--;if(d===0&&start!==-1){objs.push(s.slice(start,i+1));start=-1;}}
  }
  return objs;
}

const objs = splitTopLevel(inner);
console.log('Before dedup:', objs.length);

const seen = new Set();
const deduped = [];
for (const o of objs) {
  const idM = /"id":(\d+)/.exec(o);
  if (!idM) { deduped.push(o); continue; }
  const id = idM[1];
  if (!seen.has(id)) { seen.add(id); deduped.push(o); }
}
console.log('After dedup:', deduped.length);

const newInner = deduped.join(',');
const newText = text.slice(0, openIdx+1) + newInner + text.slice(closeIdx);
fs.writeFileSync(HTML, newText, 'utf8');
console.log('Wrote', fs.statSync(HTML).size, 'bytes (was', Buffer.byteLength(text,'utf8'), ')');
console.log('OK');

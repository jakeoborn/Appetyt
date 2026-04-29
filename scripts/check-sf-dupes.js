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
const entries = [...inner.matchAll(/"id":(\d+),"name":"([^"]+)"/g)].map(m=>({id:parseInt(m[1]),name:m[2]}));
console.log('Total entries:', entries.length);
console.log('ID range:', Math.min(...entries.map(e=>e.id)), '-', Math.max(...entries.map(e=>e.id)));

// Find duplicates
const seen = {};
const dupes = [];
entries.forEach(e => {
  if(seen[e.id]) dupes.push(e);
  seen[e.id] = true;
});
if(dupes.length) {
  console.log('\nDUPLICATE IDs:');
  dupes.forEach(e => console.log(' ', e.id, e.name));
} else {
  console.log('No duplicate IDs.');
}

// Show ID distribution
const ids5050plus = entries.filter(e=>e.id>=5050).map(e=>e.id);
console.log('\nIDs >= 5050:', ids5050plus.join(', '));

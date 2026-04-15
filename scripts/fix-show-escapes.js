const fs=require('fs');
let h=fs.readFileSync('index.html','utf8');
const before=h.length;
const lines=h.split('\n');
const BS=String.fromCharCode(92);
const APO=String.fromCharCode(39);
const bad=BS+BS+APO; // \\'
// Target only show lines (9510-9517 range, by checking content markers)
for(let i=0;i<lines.length;i++){
  const L=lines[i];
  if(/type:'Show'/.test(L) && L.includes(bad)){
    // Replace \\'s with s (strip apostrophe); replace \\' with '
    lines[i]=L.split(bad+'s').join('s').split(bad).join(APO);
    console.log('fixed line',i+1);
  }
}
const out=lines.join('\n');
fs.writeFileSync('index.html',out);
console.log('delta:',out.length-before);

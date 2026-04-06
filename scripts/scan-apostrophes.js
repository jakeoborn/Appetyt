const fs = require('fs');
const h = fs.readFileSync('index.html','utf8');

const lines = h.split('\n');
let issues = 0;
lines.forEach((line, idx) => {
  if(!line.match(/[a-zA-Z]:'[^']/)) return;

  let inSQ = false;
  let prevChar = '';
  for(let i = 0; i < line.length; i++) {
    const c = line[i];
    const next = line[i+1] || '';
    if(c === "'" && prevChar !== '\\') {
      if(inSQ) {
        if(/[a-zA-Z]/.test(prevChar) && /[a-z]/.test(next)) {
          console.log('Line', idx+1, ':', line.substring(Math.max(0,i-25), Math.min(line.length, i+25)));
          issues++;
        } else {
          inSQ = false;
        }
      } else {
        inSQ = true;
      }
    }
    prevChar = c;
  }
});
console.log('Total remaining issues:', issues);

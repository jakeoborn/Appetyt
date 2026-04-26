// Locate the exact JS syntax error in index.html's canonical big script (#6 @ line 2913)
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const FILE = path.join(__dirname, '..', 'index.html');
const data = fs.readFileSync(FILE, 'utf8');

// Walk every <script> tag, parse its body with acorn, report the FIRST one that fails
let pos = 0, scriptIndex = 0;
const lineOffsets = [0];
for (let i = 0; i < data.length; i++) if (data[i] === '\n') lineOffsets.push(i+1);
function lineColOf(off) {
  let lo = 0, hi = lineOffsets.length-1;
  while (lo <= hi) { const m = (lo+hi)>>1; if (lineOffsets[m] <= off) lo = m+1; else hi = m-1; }
  const line = lo;
  const col = off - lineOffsets[line-1];
  return {line, col};
}

while (true) {
  const open = data.indexOf('<script', pos);
  if (open < 0) break;
  const tagEnd = data.indexOf('>', open);
  if (tagEnd < 0) break;
  const tagText = data.slice(open, tagEnd+1);
  if (/src=/.test(tagText) || /type="application\/ld\+json"/.test(tagText)) { pos = tagEnd+1; continue; }
  scriptIndex++;
  const close = data.indexOf('</script>', tagEnd);
  if (close < 0) break;
  const body = data.slice(tagEnd+1, close);
  const docOpenLine = lineColOf(open).line;

  try {
    acorn.parse(body, {ecmaVersion: 'latest', allowReturnOutsideFunction: true});
  } catch (e) {
    console.log(`Script #${scriptIndex} @ doc line ${docOpenLine}: ${e.message}`);
    if (e.loc) {
      const bodyStartOff = tagEnd+1;
      const docOff = bodyStartOff + e.pos;
      const docPos = lineColOf(docOff);
      console.log(`  body line ${e.loc.line}:${e.loc.column} (doc line ${docPos.line}, col ${docPos.col})`);

      // Show the chars around the error
      const ctxStart = Math.max(0, e.pos - 80);
      const ctxEnd = Math.min(body.length, e.pos + 80);
      console.log(`  context: ${JSON.stringify(body.slice(ctxStart, e.pos))}[ERR]${JSON.stringify(body.slice(e.pos, ctxEnd))}`);

      // Show the bytes around the error
      const bytes = [];
      for (let i = Math.max(0, e.pos-20); i < Math.min(body.length, e.pos+20); i++) {
        bytes.push(body.charCodeAt(i).toString(16).padStart(2,'0'));
      }
      console.log(`  bytes: ${bytes.join(' ')}`);
    }
    break;
  }
  pos = close + 9;
}
console.log('done');

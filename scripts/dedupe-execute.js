// Delete duplicate copy 2 of index.html (everything from line 49567 onward).
// Now safe because copy 1 is self-sufficient (NYC_DATA fix in commit 474177c).
// Backup at index.html.bak-pre-dedupe-<date> if needed.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');

console.log('Before:', lines.length, 'lines');

// Find the </html> at the end of copy 1 (around line 49566)
let firstHtmlClose = -1;
for (let i = 0; i < lines.length; i++) {
  if (/^<\/html>/i.test(lines[i].trim())) { firstHtmlClose = i; break; }
}
// Find the second one (end of script-string block) and the third (end of copy 1 actual)
const closes = [];
for (let i = 0; i < lines.length; i++) if (/<\/html>/i.test(lines[i])) closes.push(i+1);
console.log('All </html> lines:', closes);

// Find the </html> that ends copy 1 — it's the one followed by deploy comment without anything but blank/script after
// Pattern: real document end has been at line 49566 historically.
// Use: the </html> that is followed by `<!-- deploy ` comment
let copy1End = -1;
for (const c of closes) {
  const next = lines[c]; // 0-indexed = line c+1 1-indexed
  if (next && /^<!--\s*deploy/i.test(next.trim())) { copy1End = c; break; }
}
if (copy1End < 0) {
  console.error('Could not find copy 1 end (</html> followed by deploy comment)');
  process.exit(1);
}
console.log('Copy 1 ends at line', copy1End, '(0-indexed', copy1End-1, ')');
// Sanity
if (!/<\/html>/i.test(lines[copy1End-1])) {
  console.error('Sanity fail: line', copy1End, 'is not </html>');
  process.exit(1);
}

const kept = lines.slice(0, copy1End);
kept.push('');
fs.writeFileSync(FILE, kept.join('\n'), 'utf8');
console.log('After:', kept.length, 'lines');
console.log('Removed:', lines.length - kept.length, 'lines');

// Verify
const acorn = require('acorn');
const data = fs.readFileSync(FILE, 'utf8');
let pos = 0, scriptIndex = 0, anyError = false;
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
  try { acorn.parse(body, {ecmaVersion: 'latest', allowReturnOutsideFunction: true}); }
  catch (e) { console.log(`Script #${scriptIndex}: ERROR ${e.message}`); anyError = true; }
  pos = close + 9;
}
if (!anyError) console.log('ALL SCRIPTS PARSE CLEAN');

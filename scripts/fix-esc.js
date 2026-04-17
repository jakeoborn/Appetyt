const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find our esc function line (line 9392 area)
const marker = 'var esc = function(s){return String(s).replace';
const idx = html.indexOf(marker);
if (idx === -1) { console.log('Marker not found'); process.exit(1); }

// Get the line end
const lineEnd = html.indexOf('\n', idx);
const oldLine = html.substring(idx, lineEnd);
console.log('Old line bytes:', Buffer.from(oldLine).toString('hex').match(/../g).join(' '));
console.log('Old line:', oldLine);

// Compare with the working version at line 14711
const marker2 = 'const esc = s=> String(s).replace';
const idx2 = html.indexOf(marker2);
const lineEnd2 = html.indexOf('\n', idx2);
const goodLine = html.substring(idx2, lineEnd2);
console.log('Good line bytes:', Buffer.from(goodLine).toString('hex').match(/../g).join(' '));
console.log('Good line:', goodLine);

// The fix: copy the escape pattern from the good line
// Good line has: replace(/'/g,"\'");
// Our line should have the same pattern but with var syntax
// Let's just build the correct replacement
const replacement = "var esc = function(s){return String(s).replace(/'/g,\"\\\\'\")};"
console.log('Replacement:', replacement);
console.log('Replacement bytes:', Buffer.from(replacement).toString('hex').match(/../g).join(' '));

html = html.substring(0, idx) + replacement + html.substring(lineEnd);
fs.writeFileSync('index.html', html, 'utf8');

// Verify
const verify = fs.readFileSync('index.html', 'utf8');
const newIdx = verify.indexOf(marker);
const newLineEnd = verify.indexOf('\n', newIdx);
const newLine = verify.substring(newIdx, newLineEnd);
console.log('After fix:', newLine);
console.log('After fix bytes:', Buffer.from(newLine).toString('hex').match(/../g).join(' '));

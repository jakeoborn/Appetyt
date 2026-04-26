// Fix: copy 1 is missing NYC_DATA. Lines 28420-28425 are orphan NYC cards (no array wrapper),
// breaking JS parsing for the entire script. Insert proper NYC_DATA and remove orphans.
//
// Strategy:
//   1. Keep DALLAS_DATA on line 28419 untouched
//   2. Replace lines 28420-28426 (orphan NYC cards + stray `]` + blank) with a single
//      `const NYC_DATA = [...955 cards...];` line
//   3. Verify acorn parse succeeds afterwards
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const FILE = path.join(__dirname, '..', 'index.html');
const NYC_DATA = require('./data/nyc-data-canonical.json');

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
console.log('Before:', lines.length, 'lines');

// Sanity: line 28419 (1-indexed) is array index 28418
const dallasLine = lines[28418];
if (!dallasLine.startsWith('const DALLAS_DATA=')) {
  console.error('Line 28419 is not DALLAS_DATA, aborting');
  console.error('Got:', dallasLine.slice(0,80));
  process.exit(1);
}

// Sanity: lines 28420-28425 should be orphan {"id":1987..1993} object literals
for (let i = 28419; i <= 28424; i++) {
  if (!/^\{"id":/.test(lines[i])) {
    console.error('Line', i+1, 'is not an orphan object literal, aborting');
    console.error('Got:', lines[i].slice(0,80));
    process.exit(1);
  }
}

// Build replacement: NYC_DATA on a single line
const nycLine = `const NYC_DATA=${JSON.stringify(NYC_DATA)};`;
console.log('NYC_DATA line length:', nycLine.length);

// Replace lines 28420 through 28426 (1-indexed) with the NYC_DATA line
// 1-indexed [28420, 28426] = 0-indexed [28419, 28425] inclusive — 7 lines
// We want to replace those 7 lines with: empty, NYC_DATA, empty (3 lines) — keeps line 28427 unchanged-ish
const replacement = ['', nycLine, ''];
const newLines = [
  ...lines.slice(0, 28419),       // keep through line 28419 (DALLAS_DATA)
  ...replacement,                  // insert NYC_DATA + blanks
  ...lines.slice(28426)            // keep from line 28427 onwards (LA_DATA)
];

fs.writeFileSync(FILE, newLines.join('\n'), 'utf8');
console.log('After:', newLines.length, 'lines');

// Verify with acorn
console.log('\nVerifying with acorn...');
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
  try {
    acorn.parse(body, {ecmaVersion: 'latest', allowReturnOutsideFunction: true});
  } catch (e) {
    console.log(`Script #${scriptIndex}: ERROR ${e.message}`);
    anyError = true;
  }
  pos = close + 9;
}
if (!anyError) console.log('ALL SCRIPTS PARSE CLEAN');

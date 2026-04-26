// Delete the duplicate copy in index.html (everything from line 49567 onwards)
// Copy 1 (lines 1-49566) is canonical; copy 2 was a stale, partial duplicate.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');

console.log('Before:', lines.length, 'lines');

// Sanity: line 49566 must be </html>, line 49567 must be the deploy comment
const closer = lines[49565]; // 0-indexed
const next = lines[49566];
console.log('Line 49566:', closer.slice(0,50));
console.log('Line 49567:', next.slice(0,50));
if (!/<\/html>/i.test(closer)) {
  console.error('ABORT: line 49566 is not </html>');
  process.exit(1);
}

// Keep lines [0..49566) which is array indices 0 through 49565
// 0-indexed: keep up to and including index 49565 (= line 49566)
// Actually we want to keep through `</html>` AND its trailing deploy comment if any.
// Looking at the layout: line 49566 = </html>, line 49567 = <!-- deploy ... -->, lines 49568+ = duplicate copy
// We want to keep through 49566 (the </html>). The deploy comment at 49567 is fine to keep too as a marker.

const KEEP_THROUGH = 49566; // 1-indexed line number
const kept = lines.slice(0, KEEP_THROUGH); // 0-indexed end-exclusive
// Add a trailing newline by appending one empty string
kept.push('');

fs.writeFileSync(FILE, kept.join('\n'), 'utf8');
console.log('After:', kept.length, 'lines');
console.log('Removed:', lines.length - kept.length, 'lines');

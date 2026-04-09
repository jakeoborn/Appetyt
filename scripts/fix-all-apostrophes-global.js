const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// COMPREHENSIVE FIX: Find ALL unescaped apostrophes in the entire file
// that are inside single-quoted JavaScript strings.

// Strategy: scan the entire file character by character.
// Track whether we're inside a single-quoted string.
// When we find an apostrophe that's:
//   1. Inside a single-quoted string
//   2. Between two word characters (letter's or letter've etc)
//   3. NOT already escaped with backslash
// Then escape it.

let result = [];
let inSingleQuote = false;
let inDoubleQuote = false;
let inTemplate = false;
let inComment = false;
let fixCount = 0;

for(let i = 0; i < h.length; i++) {
  const c = h[i];
  const prev = i > 0 ? h[i-1] : '';
  const next = i < h.length - 1 ? h[i+1] : '';
  const prevprev = i > 1 ? h[i-2] : '';

  // Skip escaped characters
  if(prev === '\\' && prevprev !== '\\') {
    result.push(c);
    continue;
  }

  // Track string state
  if(c === "'" && !inDoubleQuote && !inTemplate && !inComment) {
    if(inSingleQuote) {
      // This could be end of string OR an unescaped apostrophe
      // It's an apostrophe if: preceded by a letter AND followed by a lowercase letter
      if(/[a-zA-Z]/.test(prev) && /[a-z]/.test(next)) {
        // This is an unescaped apostrophe inside a single-quoted string!
        // Escape it
        result.push('\\');
        result.push("'");
        fixCount++;
        continue;
      } else {
        // End of string
        inSingleQuote = false;
      }
    } else {
      // Start of string
      inSingleQuote = true;
    }
  }

  if(c === '"' && !inSingleQuote && !inTemplate) {
    inDoubleQuote = !inDoubleQuote;
  }

  if(c === '`' && !inSingleQuote && !inDoubleQuote) {
    inTemplate = !inTemplate;
  }

  result.push(c);
}

const fixed = result.join('');
console.log('Fixed', fixCount, 'unescaped apostrophes');

// Verify: try to find remaining issues
let remaining = 0;
let inSQ = false;
for(let i = 0; i < fixed.length; i++) {
  const c = fixed[i];
  const prev = i > 0 ? fixed[i-1] : '';
  const next = i < fixed.length - 1 ? fixed[i+1] : '';

  if(c === "'" && prev !== '\\') {
    if(inSQ) {
      if(/[a-zA-Z]/.test(prev) && /[a-z]/.test(next)) {
        remaining++;
        const ctx = fixed.substring(Math.max(0,i-20), i+20);
        console.log('REMAINING at', i, ':', ctx);
      } else {
        inSQ = false;
      }
    } else {
      inSQ = true;
    }
  }
}
console.log('Remaining issues:', remaining);

fs.writeFileSync('index.html', fixed, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('File size:', fixed.length);
console.log('Done!');

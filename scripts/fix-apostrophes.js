// Fix unescaped apostrophes in JavaScript string literals
// These cause SyntaxError: Unexpected identifier
// Run: node scripts/fix-apostrophes.js

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find the hoodTips block
const hoodStart = html.indexOf('const hoodTips');
if (hoodStart === -1) { console.log('hoodTips not found'); process.exit(1); }
const hoodEnd = html.indexOf('};', hoodStart) + 2;
let hoodBlock = html.substring(hoodStart, hoodEnd);

// Fix apostrophes in words within single-quoted strings
// Pattern: letter'letter (e.g., Houston's, Wooster's, Dusek's)
const original = hoodBlock;
const fixed = hoodBlock.replace(/([a-zA-Z])'([a-zA-Z])/g, "$1\\'$2");

if (fixed !== original) {
  html = html.slice(0, hoodStart) + fixed + html.slice(hoodEnd);
  const count = (fixed.match(/\\'/g) || []).length - (original.match(/\\'/g) || []).length;
  console.log('Fixed', count, 'unescaped apostrophes in hoodTips');
}

// Also check the nightlife pro tips section for the same issue
const proStart = html.indexOf("if(city==='New York')");
if (proStart > 0) {
  const proEnd = html.indexOf("html+='</div></div>';", proStart) + "html+='</div></div>';".length;
  let proBlock = html.substring(proStart, proEnd);
  const proOriginal = proBlock;
  const proFixed = proBlock.replace(/([a-zA-Z])'([a-zA-Z])/g, "$1\\'$2");
  if (proFixed !== proOriginal) {
    html = html.slice(0, proStart) + proFixed + html.slice(proEnd);
    console.log('Fixed apostrophes in pro tips block');
  }
}

// Also fix any other single-quoted strings with word apostrophes globally
// in seasonal activities
const seasonStart = html.indexOf("activities:city==='New York'");
if (seasonStart > 0) {
  const seasonEnd = html.indexOf("]:['Holiday", seasonStart + 2000);
  if (seasonEnd > 0) {
    const actualEnd = html.indexOf(']', seasonEnd + 10) + 1;
    let seasonBlock = html.substring(seasonStart, actualEnd);
    const seasonOrig = seasonBlock;
    const seasonFixed = seasonBlock.replace(/([a-zA-Z])'([a-zA-Z])/g, "$1\\'$2");
    if (seasonFixed !== seasonOrig) {
      html = html.slice(0, seasonStart) + seasonFixed + html.slice(actualEnd);
      console.log('Fixed apostrophes in seasonal activities');
    }
  }
}

// Do a broad scan for any remaining unescaped word-apostrophes in JS string contexts
// Count how many potential issues remain
let remaining = 0;
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Skip HTML content (descriptions in JSON), only check JS code lines
  if (line.match(/^\s*(html\+|var |const |let |if\(|}\s*else|'[A-Z])/) || line.includes(":'")) {
    const matches = line.match(/([a-zA-Z])'([a-zA-Z])/g);
    if (matches) {
      // Check if they're already escaped
      for (const m of matches) {
        const idx = line.indexOf(m);
        if (idx > 0 && line[idx - 1] !== '\\') {
          // Check if this is inside a single-quoted string
          const beforeQuotes = line.substring(0, idx).split("'").length - 1;
          if (beforeQuotes % 2 === 1) { // odd = inside a string
            remaining++;
            if (remaining <= 10) {
              console.log(`  Line ${i+1}: ...${line.substring(Math.max(0,idx-15), idx+15)}...`);
            }
          }
        }
      }
    }
  }
}

if (remaining > 0) {
  console.log(`Warning: ${remaining} potential unescaped apostrophes remain`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract the main script
const re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match, i = 0;
while ((match = re.exec(html)) !== null) {
  i++;
  const body = match[1].trim();
  if (body.length > 5000000) {
    console.log('Script #' + i + ', length:', body.length);

    // Binary search for the error line
    const lines = body.split('\n');
    let lo = 0, hi = lines.length;

    while (hi - lo > 50) {
      const mid = Math.floor((lo + hi) / 2);
      const partial = lines.slice(0, mid).join('\n');
      try {
        new Function(partial);
        lo = mid;
      } catch(e) {
        hi = mid;
      }
    }

    console.log('Error between lines', lo, 'and', hi);
    for (let k = lo; k < Math.min(hi, lo + 60); k++) {
      console.log('  L' + (k+1) + ': ' + lines[k]);
    }

    // Also test just the partial up to 'lo'
    try {
      new Function(lines.slice(0, lo).join('\n'));
      console.log('Lines 1-' + lo + ': OK');
    } catch(e) {
      console.log('Lines 1-' + lo + ': ERROR -', e.message);
    }
    try {
      new Function(lines.slice(0, hi).join('\n'));
      console.log('Lines 1-' + hi + ': OK');
    } catch(e) {
      console.log('Lines 1-' + hi + ': ERROR -', e.message);
    }
  }
}

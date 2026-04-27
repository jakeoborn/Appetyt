const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');

// Parse all inline scripts (>100 chars), identify the main bundle by size.
const scripts=[...h.matchAll(/<script(?:[^>]*?)>([\s\S]*?)<\/script>/g)];
const inline = scripts
  .map((m,i) => ({ i, tag: m[0].match(/<script[^>]*>/)[0], body: m[1] }))
  .filter(s => !s.tag.includes('src=') && s.body.length >= 100);

// The main bundle is the largest inline script.
const mainBundle = inline.reduce((best,s) => s.body.length > best.body.length ? s : best, inline[0]);

let hadError = false;
inline.forEach(s => {
  const label = s === mainBundle ? 'Script:MAIN' : 'Script #' + s.i;
  try {
    new Function(s.body);
    console.log(label + ' (' + s.body.length + ' chars): OK');
  } catch(err) {
    console.log(label + ' (' + s.body.length + ' chars): ERROR');
    console.log('  Message:', err.message);
    if (s === mainBundle) hadError = true;
    const posMatch = err.message.match(/at\s+.*?:(\d+)/);
    if (posMatch) {
      const ln = parseInt(posMatch[1]);
      const lines = s.body.split('\n');
      console.log('  Line ' + ln + ' context:');
      for (let j = Math.max(0, ln-2); j < Math.min(lines.length, ln+3); j++) {
        console.log('    ' + (j+1) + ':', lines[j].substring(0, 200));
      }
    }
  }
});

process.exit(hadError ? 1 : 0);

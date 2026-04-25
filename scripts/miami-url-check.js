// HEAD-check all 250 Miami website fields. Flag dead/404/timeout for replacement.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));

const targets = arr
  .filter(c => c.website && /^https?:/.test(c.website))
  .map(c => ({id:c.id, name:c.name, url:c.website}));

console.log(`HEAD-checking ${targets.length} of ${arr.length} Miami cards (skipping ${arr.length-targets.length} blank)`);

function check(url) {
  return new Promise(resolve => {
    // -L follow redirects, -s silent, -o /dev/null, -m 10 timeout, -w write http_code only
    // Use GET because some sites reject HEAD; -r 0-0 to keep it cheap
    const args = ['-sS','-L','-o','/dev/null','-m','12','-A','Mozilla/5.0 (compatible; MiamiAudit/1.0)','-w','%{http_code}','-r','0-0', url];
    const p = spawn('curl', args);
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', () => {
      const code = (out.trim().match(/^\d+/)||[''])[0] || '000';
      resolve({code, err: err.trim().slice(0,80)});
    });
    p.on('error', () => resolve({code:'000', err:'spawn-fail'}));
  });
}

async function runPool(items, fn, concurrency = 12) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const my = i++;
      results[my] = await fn(items[my], my);
    }
  }
  await Promise.all(Array.from({length:concurrency}, worker));
  return results;
}

(async () => {
  const t0 = Date.now();
  const out = await runPool(targets, async (t, n) => {
    const r = await check(t.url);
    if (n % 25 === 0) process.stderr.write(`  ${n}/${targets.length}\n`);
    return {...t, ...r};
  }, 12);
  console.log(`Done in ${((Date.now()-t0)/1000).toFixed(1)}s\n`);

  const buckets = {};
  for (const r of out) {
    const k = r.code === '200' || r.code === '301' || r.code === '302' ? 'OK' : r.code;
    buckets[k] = (buckets[k]||0)+1;
  }
  console.log('=== Status code distribution ===');
  Object.entries(buckets).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k.padEnd(6)} ${v}`));

  const dead = out.filter(r => !['200','301','302','206','403'].includes(r.code));
  console.log(`\n=== Dead/Suspect (${dead.length}) ===`);
  dead.forEach(r => console.log(`  ${r.code} | ${r.id} ${r.name} | ${r.url}`));

  fs.writeFileSync(path.join(__dirname,'data','miami-url-audit.json'), JSON.stringify(out, null, 2));
  console.log('\nFull report → scripts/data/miami-url-audit.json');
})();

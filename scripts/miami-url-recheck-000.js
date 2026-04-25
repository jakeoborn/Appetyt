// Re-check the 000 (network-fail) URLs with a real GET, no range request
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const all = require('./data/miami-url-audit.json');
const todo = all.filter(r => r.code === '000');
console.log(`Re-checking ${todo.length} '000' URLs with a real GET...`);

function check(url) {
  return new Promise(resolve => {
    // Real GET (no range), generous timeout, follow redirects, accept all SSL, behave like browser
    const args = ['-sS','-L','-k','-o','/dev/null','-m','20',
      '-A','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      '-H','Accept: text/html,application/xhtml+xml,*/*;q=0.8',
      '-w','%{http_code}', url];
    const p = spawn('curl', args);
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', () => {
      const code = (out.trim().match(/^\d+/)||[''])[0] || '000';
      resolve({code, err: err.trim().slice(0,120)});
    });
    p.on('error', () => resolve({code:'000', err:'spawn-fail'}));
  });
}
async function runPool(items, fn, c=8) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({length:c}, async () => { while (i < items.length) { const my = i++; out[my] = await fn(items[my]); } }));
  return out;
}
(async () => {
  const t0 = Date.now();
  const res = await runPool(todo, async (t) => ({...t, ...(await check(t.url))}));
  console.log(`Done in ${((Date.now()-t0)/1000).toFixed(1)}s`);
  const buckets = {};
  for (const r of res) buckets[r.code] = (buckets[r.code]||0)+1;
  console.log('Recheck distribution:', buckets);
  console.log('\nStill dead/000:');
  res.filter(r => r.code === '000').forEach(r => console.log(`  000 | ${r.id} ${r.name} | ${r.url} | ${r.err}`));
  console.log('\nReturned 404 on retry:');
  res.filter(r => r.code === '404').forEach(r => console.log(`  404 | ${r.id} ${r.name} | ${r.url}`));
  console.log('\nResolved (200/etc) on retry:');
  res.filter(r => /^[23]/.test(r.code)).forEach(r => console.log(`  ${r.code} | ${r.id} ${r.name} | ${r.url}`));
  fs.writeFileSync(path.join(__dirname,'data','miami-url-recheck.json'), JSON.stringify(res, null, 2));
})();

// Consolidate URL audit: merge first-pass + recheck, produce final dead-list
const fs = require('fs');
const path = require('path');
const first = require('./data/miami-url-audit.json');
const recheck = require('./data/miami-url-recheck.json');
const recheckMap = new Map(recheck.map(r => [r.id, r]));

const final = first.map(r => {
  const rc = recheckMap.get(r.id);
  // If recheck succeeded, prefer it; otherwise keep first-pass
  return rc ? {...r, code: rc.code, err: rc.err} : r;
});

const isOK = c => /^(200|201|202|204|206|301|302|304|307|308|403)$/.test(c);
const dead = final.filter(r => !isOK(r.code));
const ok = final.filter(r => isOK(r.code));

console.log(`Final: ${ok.length} OK, ${dead.length} dead/suspect of ${final.length}`);
console.log('\n=== Confirmed dead URLs ===');
dead.sort((a,b)=>a.id-b.id).forEach(r => console.log(`  ${r.code.padEnd(4)} ${r.id} ${r.name.padEnd(40)} ${r.url}`));

const buckets = {};
for (const r of dead) buckets[r.code] = (buckets[r.code]||0)+1;
console.log('\n=== Dead by reason ===');
Object.entries(buckets).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
  const label = {
    '000':'DNS fail / timeout / SSL error (likely fabricated or spelled wrong)',
    '404':'Page not found (page moved or removed)',
    '401':'Auth required',
    '429':'Rate-limited (may be fine)',
    '500':'Server error',
    '526':'Cloudflare cert error'
  }[k] || k;
  console.log(`  ${k.padEnd(4)} ${v.toString().padStart(3)}  ${label}`);
});

fs.writeFileSync(path.join(__dirname,'data','miami-url-dead.json'), JSON.stringify(dead.sort((a,b)=>a.id-b.id), null, 2));
console.log(`\nWrote ${dead.length} dead URLs → scripts/data/miami-url-dead.json`);

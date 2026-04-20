// Clear Mamani's photos[] gallery (all 10 entries are /gps-cs-s/ Google curated
// user photos flagged by user as non-professional). Keeps the Sanity CDN photoUrl
// as the sole hero. Idempotent: if photos[] is already empty, no-op.
const fs = require('fs');
const path = 'index.html';

function tryWrite(html, retries=5){
  for(let i=0;i<retries;i++){
    try{ fs.writeFileSync(path, html, 'utf8'); return true; }
    catch(e){
      if(i===retries-1) throw e;
      // OneDrive sync race — back off and retry
      const until = Date.now()+500;
      while(Date.now()<until){}
    }
  }
}

let html = fs.readFileSync(path, 'utf8');

// Match: "id":20,"name":"Mamani"... up to "photos":[...] then replace the photos array with []
// Use a dot-all regex scoped tightly enough to hit only the Mamani entry.
const re = /(\"id\":20,\"name\":\"Mamani\"[\s\S]*?\"photos\":)\[[^\]]*\]/;
const m = html.match(re);
if(!m){
  console.error('Mamani entry not found (or photos[] already empty).');
  process.exit(1);
}

const before = m[0];
const after = m[1] + '[]';
if(before === after){
  console.log('Already cleared — nothing to do.');
  process.exit(0);
}

// Count what we are about to remove
const count = (before.match(/https?:\/\/[^"]+/g) || []).length - 1; // minus the prefix's occurrences (which are none in the matched region before photos)
console.log('Clearing Mamani photos[] — removing', count, 'entries.');

const updated = html.replace(before, after);
tryWrite(updated);
console.log('Wrote', path, '(−' + (before.length - after.length), 'chars)');

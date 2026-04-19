// HEAD-request a sample of photoUrls in a city to confirm they load.
// Usage: node scripts/apify-verify-photos.js PHX_DATA [--all]
const fs = require('fs');

const cityVar = process.argv[2] || 'PHX_DATA';
const all = process.argv.includes('--all');
const html = fs.readFileSync('index.html', 'utf8');

function extractArray(varDecl) {
  const re = new RegExp('const ' + varDecl + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) throw new Error('not found: ' + varDecl);
  const start = m.index + m[0].length - 1;
  let depth = 0, inStr = false, esc = false, sc = null;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (ch === sc) { inStr = false; sc = null; } continue; }
    if (ch === '"' || ch === "'") { inStr = true; sc = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) {
      const slice = html.substring(start, i + 1);
      try { return JSON.parse(slice); } catch { return (new Function('return ' + slice))(); }
    }}
  }
}

async function head(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) });
    return { ok: res.ok, status: res.status, ct: res.headers.get('content-type'), len: res.headers.get('content-length') };
  } catch (e) { return { ok: false, error: e.message }; }
}

(async () => {
  const data = extractArray(cityVar);
  const withPhoto = data.filter(r => r && r.photoUrl);
  console.log(`${cityVar}: ${data.length} total, ${withPhoto.length} have photoUrl`);
  const sample = all ? withPhoto : withPhoto.slice(0, 20);
  let ok = 0, bad = 0;
  for (const r of sample) {
    const res = await head(r.photoUrl);
    const tag = res.ok ? 'OK ' : 'BAD';
    console.log(`  ${tag} #${r.id} ${r.name.padEnd(36)} ${res.status||res.error||''} ${res.ct||''}`);
    if (res.ok) ok++; else bad++;
  }
  console.log(`\n${ok} ok, ${bad} bad of ${sample.length} sampled`);
})();

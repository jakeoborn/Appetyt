// For each 404/5xx website, try common URL variants to find a working form.
// Auto-update entries where a variant resolves cleanly.
//
// Variants tried in order:
//   1. Strip /path — use domain root only
//   2. Swap www prefix (add or remove)
//   3. Strip /path on the swapped variant
//
// Writes updated URLs to index.html for entries that found a working variant.
// Leaves unresolvable URLs alone (they may be true closures or bot-blocked).

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const report = JSON.parse(fs.readFileSync('scripts/link-sweep-report.json', 'utf8'));
// Only look at real 404s (not 403/405/timeout which are usually bot-detection)
const fourOhFours = report.brokenWeb.filter(r => r.status === 404);
console.log(`Found ${fourOhFours.length} true 404s. Trying URL variants...`);

function buildVariants(url) {
  const variants = new Set();
  try {
    const u = new URL(url);
    const host = u.hostname;
    const altHost = host.startsWith('www.') ? host.slice(4) : 'www.' + host;
    // Root of original
    variants.add(u.protocol + '//' + host + '/');
    // Root of alternative www
    variants.add(u.protocol + '//' + altHost + '/');
    // Alternative www with same path
    variants.add(u.protocol + '//' + altHost + u.pathname + u.search);
    // http instead of https (last resort)
    if (u.protocol === 'https:') {
      variants.add('http://' + host + '/');
    }
  } catch (e) {
    // bad URL — try to salvage
    const m = url.match(/([a-z0-9-]+\.[a-z]{2,})/i);
    if (m) variants.add('https://' + m[1] + '/');
  }
  return [...variants];
}

async function ping(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD', redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-url-fixer/1.0' },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 405 || !res.ok) {
      // retry GET
      const r2 = await fetch(url, {
        method: 'GET', redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-url-fixer/1.0' },
        signal: AbortSignal.timeout(6000),
      });
      return { ok: r2.ok, status: r2.status, finalUrl: r2.url };
    }
    return { ok: res.ok, status: res.status, finalUrl: res.url };
  } catch (e) { return { ok: false, status: 0, error: e.message.slice(0,50) }; }
}

(async () => {
  const fixes = [];
  for (const entry of fourOhFours) {
    const variants = buildVariants(entry.website);
    let fixedUrl = null;
    for (const v of variants) {
      const r = await ping(v);
      if (r.ok) { fixedUrl = r.finalUrl || v; break; }
    }
    if (fixedUrl && fixedUrl !== entry.website) {
      fixes.push({ ...entry, oldUrl: entry.website, newUrl: fixedUrl });
    }
  }

  console.log(`\nFound working variants for ${fixes.length} of ${fourOhFours.length} broken 404 URLs.\n`);

  // Apply fixes to index.html
  const cities = {
    'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
    'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
    'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
    'Phoenix':'const PHX_DATA',
  };
  const perCity = {};
  Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

  let applied = 0;
  fixes.forEach(f => {
    const r = perCity[f.city].find(x => x.id === f.id);
    if (!r) return;
    r.website = f.newUrl;
    applied++;
    console.log(`  ${f.city}#${f.id} "${f.name}" (${f.score})`);
    console.log(`    OLD: ${f.oldUrl}`);
    console.log(`    NEW: ${f.newUrl}`);
  });

  const ordered = Object.entries(cities).sort((a,b) => locateArray(b[1]).arrS - locateArray(a[1]).arrS);
  ordered.forEach(([city, varName]) => {
    const pos = locateArray(varName);
    html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
  });
  fs.writeFileSync('index.html', html, 'utf8');

  console.log(`\nApplied ${applied} URL fixes to index.html.`);
  fs.writeFileSync('scripts/url-fixes-report.json', JSON.stringify(fixes, null, 2));
})();

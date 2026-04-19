// Sweep all website + instagram links across all 10 cities.
// Categorizes every entry:
//   - missing-website / missing-instagram (no value)
//   - broken-website (4xx/5xx) — site is dead
//   - broken-instagram (handle doesn't resolve)
//   - malformed-instagram (contains spaces, slashes, etc.)
//   - ok (both present and resolve)
//
// Outputs scripts/link-sweep-report.json for triage.
//
// Usage:
//   node scripts/sweep-links.js [--city <city>] [--skip-instagram] [--skip-website]

const fs = require('fs');

function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(varName, html){
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const a = m.index + m[0].length - 1;
  return JSON.parse(html.substring(a, scf(html, a) + 1));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { city: null, skipIG: false, skipWeb: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--city') out.city = args[++i];
    else if (args[i] === '--skip-instagram') out.skipIG = true;
    else if (args[i] === '--skip-website') out.skipWeb = true;
  }
  return out;
}

async function checkWebsite(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD', redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-link-sweep/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    return { ok: res.ok, status: res.status, finalUrl: res.url };
  } catch (e) {
    // Some servers don't support HEAD — retry with GET
    try {
      const res = await fetch(url, {
        method: 'GET', redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-link-sweep/1.0' },
        signal: AbortSignal.timeout(8000),
      });
      return { ok: res.ok, status: res.status, finalUrl: res.url };
    } catch (e2) {
      return { ok: false, status: 0, error: (e2.message || e2.name).slice(0, 80) };
    }
  }
}

async function checkInstagram(handle) {
  // Normalize: strip @, trim, lowercase (IG is case-insensitive)
  const clean = String(handle).replace(/^@/, '').trim().toLowerCase();
  if (!clean) return { ok: false, status: 0, error: 'empty' };
  // Malformed check — no spaces, no slashes, reasonable length
  if (/[\s\/\\]/.test(clean) || clean.length > 30 || clean.length < 1) {
    return { ok: false, status: 0, error: 'malformed: "' + handle + '"' };
  }
  const url = 'https://www.instagram.com/' + clean + '/';
  try {
    const res = await fetch(url, {
      method: 'GET', redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return { ok: false, status: 404, error: '404 not found' };
    if (res.status === 429) return { ok: null, status: 429, error: 'rate-limited' };
    if (!res.ok) return { ok: false, status: res.status, error: 'http-' + res.status };
    // IG returns 200 with login-wall for non-existent handles too. Check body for markers.
    const body = (await res.text()).slice(0, 50000);
    // Deleted/disabled accounts often show "Sorry, this page isn't available"
    if (/Sorry,?\s+this\s+page\s+isn'?t\s+available/i.test(body)) {
      return { ok: false, status: 200, error: 'page unavailable' };
    }
    // Username existence is fuzzy on IG — look for profile markers.
    // Their meta og:title or canonical link includes the handle if it exists.
    if (new RegExp('"username"\\s*:\\s*"' + clean + '"', 'i').test(body)) {
      return { ok: true, status: 200 };
    }
    if (new RegExp('@' + clean + '\\b', 'i').test(body)) {
      return { ok: true, status: 200 };
    }
    // Fallback: 200 + no error marker = probably ok
    return { ok: true, status: 200, note: 'inferred-ok' };
  } catch (e) {
    return { ok: null, status: 0, error: (e.message || e.name).slice(0, 80) };
  }
}

async function runPool(items, concurrency, workFn, progressFn) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const r = await workFn(items[i], i);
      results[i] = r;
      if (progressFn) progressFn(i + 1, items.length);
    }
  }
  await Promise.all(Array.from({length: concurrency}, () => worker()));
  return results;
}

(async () => {
  const args = parseArgs();
  const html = fs.readFileSync('index.html', 'utf8');
  const cities = {
    'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
    'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
    'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
    'Phoenix':'const PHX_DATA',
  };

  const entries = [];
  Object.entries(cities).forEach(([cityName, varName]) => {
    if (args.city && cityName !== args.city) return;
    const data = pa(varName, html);
    data.forEach(r => {
      entries.push({
        city: cityName, id: r.id, name: r.name,
        score: r.score, website: r.website || '', instagram: r.instagram || '',
      });
    });
  });

  console.log(`Sweeping ${entries.length} entries across ${new Set(entries.map(e => e.city)).size} cities...`);
  const start = Date.now();

  // Website sweep
  let webReport = [];
  if (!args.skipWeb) {
    const toCheck = entries.filter(e => e.website);
    console.log(`\n▸ Checking ${toCheck.length} websites (${entries.length - toCheck.length} entries missing website)...`);
    const results = await runPool(toCheck, 20, async (e) => {
      let url = e.website;
      if (!/^https?:\/\//.test(url)) url = 'https://' + url;
      const r = await checkWebsite(url);
      return { ...e, check: 'website', ...r };
    }, (done, total) => {
      if (done % 200 === 0 || done === total) process.stdout.write(`  web ${done}/${total}\r`);
    });
    webReport = results;
  }

  // Instagram sweep
  let igReport = [];
  if (!args.skipIG) {
    const toCheck = entries.filter(e => e.instagram);
    console.log(`\n▸ Checking ${toCheck.length} Instagram handles (${entries.length - toCheck.length} entries missing IG)...`);
    const results = await runPool(toCheck, 8, async (e) => {
      const r = await checkInstagram(e.instagram);
      return { ...e, check: 'instagram', ...r };
    }, (done, total) => {
      if (done % 100 === 0 || done === total) process.stdout.write(`  ig  ${done}/${total}\r`);
    });
    igReport = results;
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\n\nDone in ${elapsed}s.\n`);

  // Summarize
  const missing = {
    website: entries.filter(e => !e.website).length,
    instagram: entries.filter(e => !e.instagram).length,
  };

  const brokenWeb = webReport.filter(r => r.ok === false);
  const brokenIG = igReport.filter(r => r.ok === false);
  const rateLimitedIG = igReport.filter(r => r.status === 429).length;

  const summary = {
    total: entries.length,
    missing,
    broken_website: brokenWeb.length,
    broken_instagram: brokenIG.length,
    rate_limited_ig: rateLimitedIG,
  };

  fs.writeFileSync('scripts/link-sweep-report.json', JSON.stringify({
    summary, brokenWeb, brokenIG,
    missingWeb: entries.filter(e => !e.website).map(e => ({city:e.city,id:e.id,name:e.name,score:e.score})),
    missingIG: entries.filter(e => !e.instagram).map(e => ({city:e.city,id:e.id,name:e.name,score:e.score})),
  }, null, 2));

  console.log('=== SUMMARY ===');
  console.log('  Total entries:      ', summary.total);
  console.log('  Missing website:    ', summary.missing.website);
  console.log('  Missing Instagram:  ', summary.missing.instagram);
  console.log('  Broken website:     ', summary.broken_website);
  console.log('  Broken Instagram:   ', summary.broken_instagram);
  console.log('  IG rate-limited:    ', summary.rate_limited_ig, '(need retry)');
  console.log();

  if (brokenWeb.length) {
    console.log('=== TOP 20 BROKEN WEBSITES (by score) ===');
    brokenWeb.sort((a,b) => (b.score||0) - (a.score||0)).slice(0, 20).forEach(e => {
      console.log(`  [${e.status||'?'}] ${e.city} #${e.id} "${e.name}" (${e.score}) — ${e.website}${e.error ? ' (' + e.error + ')' : ''}`);
    });
  }
  if (brokenIG.length) {
    console.log('\n=== TOP 20 BROKEN INSTAGRAM (by score) ===');
    brokenIG.sort((a,b) => (b.score||0) - (a.score||0)).slice(0, 20).forEach(e => {
      console.log(`  [${e.status||'?'}] ${e.city} #${e.id} "${e.name}" (${e.score}) — ${e.instagram}${e.error ? ' (' + e.error + ')' : ''}`);
    });
  }

  console.log('\nFull report: scripts/link-sweep-report.json');
})();

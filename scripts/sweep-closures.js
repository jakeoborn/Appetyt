// Batch closure sweep across all 10 cities.
// Uses same pattern-matching logic as check-open.js, but in-process for speed.
// Concurrent fetches with limit to be polite.
//
// Usage:
//   node scripts/sweep-closures.js [--city <city>] [--min-score <n>] [--limit <n>]
//
// Examples:
//   node scripts/sweep-closures.js                # all 10 cities, all entries w/ website
//   node scripts/sweep-closures.js --city "Los Angeles" --min-score 80
//
// Output: scripts/closure-sweep-report.json + console summary

const fs = require('fs');

function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(varName, html){
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const a = m.index + m[0].length - 1;
  return JSON.parse(html.substring(a, scf(html, a) + 1));
}

const CLOSURE_PATTERNS = [
  /permanently closed/i,
  /closed\s+(for\s+good|permanently|its?\s+doors)/i,
  /is\s+now\s+closed/i,
  /our\s+last\s+day/i,
  /(final|last)\s+day\s+of\s+(service|operation)/i,
  /final\s+service/i,
  /it\s+is\s+with\s+a?\s*heavy\s+heart/i,
  /thank\s+you\s+for\s+\d+\s+(years|great\s+years|memories)/i,
  /thank\s+you\s+(to\s+everyone|for\s+celebrating).{0,80}(last|final|memories)/i,
  /has\s+closed/i,
  /have\s+closed/i,
  /closing\s+(our\s+)?doors/i,
  /after\s+\d+\s+(years|wonderful\s+years).{0,80}(closed|closing|shutting|final)/i,
  /we\s+are\s+no\s+longer\s+(open|serving|operating)/i,
  /no\s+longer\s+in\s+operation/i,
  /bidding\s+(you\s+)?farewell/i,
  /last\s+hurrah/i,
  /the\s+space\s+will\s+live\s+on/i,
  /lights?\s+out\s+on/i,
  /sad\s+to\s+(share|announce)\s+we/i,
];

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { city: null, minScore: 0, limit: Infinity };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--city') out.city = args[++i];
    else if (args[i] === '--min-score') out.minScore = parseInt(args[++i]);
    else if (args[i] === '--limit') out.limit = parseInt(args[++i]);
  }
  return out;
}

async function checkSite(url) {
  const signals = [];
  let httpStatus = null;
  try {
    const res = await fetch(url, {
      method: 'GET', redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-sweep/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    httpStatus = res.status;
    if (!res.ok) return { status: 'uncertain', httpStatus, signals: ['http-' + httpStatus] };
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text') && !ct.includes('html')) return { status: 'uncertain', httpStatus, signals: ['non-html'] };
    const body = (await res.text()).slice(0, 200000);
    const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().slice(0, 200) : '';
    const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 30000);
    CLOSURE_PATTERNS.forEach(re => {
      const m = text.match(re);
      if (m) signals.push(m[0].trim().slice(0, 80));
    });
    if (title && /(closed|shuttered|final\s+day)/i.test(title)) signals.push('title: ' + title);
    return {
      status: signals.length > 0 ? 'closed' : 'open',
      httpStatus, signals, title,
    };
  } catch (e) {
    return { status: 'uncertain', httpStatus, signals: ['fetch-error: ' + (e.message || e.name).slice(0, 80)] };
  }
}

async function runPool(items, concurrency, workFn, progressFn) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const item = items[i];
      const result = await workFn(item, i);
      results[i] = result;
      if (progressFn) progressFn(i + 1, items.length, result);
    }
  }
  const workers = Array.from({length: concurrency}, () => worker());
  await Promise.all(workers);
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
      if (!r.website) return;
      if ((r.score || 0) < args.minScore) return;
      let url = r.website;
      if (!/^https?:\/\//.test(url)) url = 'https://' + url;
      entries.push({ city: cityName, id: r.id, name: r.name, score: r.score, website: url });
    });
  });

  const limited = entries.slice(0, args.limit);
  console.log(`Sweeping ${limited.length} entries across ${new Set(limited.map(e => e.city)).size} cities...`);
  const start = Date.now();

  const report = await runPool(limited, 15, async (e) => {
    const result = await checkSite(e.website);
    return { ...e, ...result };
  }, (done, total, result) => {
    if (done % 50 === 0 || done === total) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      process.stdout.write(`  ${done}/${total} (${elapsed}s, last: ${result.status === 'closed' ? 'CLOSED' : result.status})\r`);
    }
  });

  console.log('\nDone in', ((Date.now() - start) / 1000).toFixed(1), 'seconds.\n');

  const closed = report.filter(r => r.status === 'closed');
  const uncertain = report.filter(r => r.status === 'uncertain');
  const open = report.filter(r => r.status === 'open');

  fs.writeFileSync('scripts/closure-sweep-report.json', JSON.stringify(report, null, 2));

  console.log('=== SWEEP RESULTS ===');
  console.log('  OPEN:     ', open.length);
  console.log('  CLOSED:   ', closed.length);
  console.log('  UNCERTAIN:', uncertain.length, '(4xx/5xx/timeout — likely needs manual check)');
  console.log();
  console.log('=== ALL CLOSED ENTRIES ===');
  closed.sort((a,b) => (b.score || 0) - (a.score || 0));
  closed.forEach(r => {
    console.log(`  [${r.status}] ${r.city} #${r.id} "${r.name}" (score:${r.score}) — ${r.signals[0]}`);
  });

  console.log('\nFull report: scripts/closure-sweep-report.json');
})();

// Pre-commit verification. Runs before every `git commit` to block:
//   1. Commits that add a restaurant entry with a closed website
//   2. (Optional, warns) Commits with address/coord mismatches
//
// Invoked by .git/hooks/pre-commit. Exits non-zero to block the commit.
//
// Finds NEW entries by parsing `git diff --cached index.html` for added
// entries that have both an `id` and a `website`. Runs check-open's same
// logic (in-process) against each new website. If any are detected closed,
// prints a clear error and blocks.

const { execSync } = require('child_process');

// Import the same HIGH/MED patterns from check-open.js (inlined for speed)
const HIGH_CONF_PATTERNS = [
  /permanently closed/i,
  /closed\s+(for\s+good|permanently|its?\s+doors)/i,
  /our\s+last\s+day/i,
  /(final|last)\s+day\s+of\s+(service|operation)/i,
  /final\s+service/i,
  /it\s+is\s+with\s+a?\s*heavy\s+heart/i,
  /thank\s+you\s+for\s+\d+\s+(years|great\s+years|memories)/i,
  /thank\s+you\s+(to\s+everyone|for\s+celebrating).{0,80}(last|final|memories)/i,
  /has\s+closed.{0,40}(forever|permanently|doors|final)/i,
  /have\s+closed.{0,40}(forever|permanently|doors|final|our)/i,
  /closing\s+(our\s+)?doors/i,
  /after\s+\d+\s+(years|wonderful\s+years).{0,80}(closed|closing|shutting|final)/i,
  /we\s+are\s+no\s+longer\s+(open|serving|operating)/i,
  /no\s+longer\s+in\s+operation/i,
  /bidding\s+(you\s+)?farewell/i,
  /last\s+hurrah/i,
];
const MED_CONF_PATTERNS = [
  /is\s+now\s+closed/i,
  /the\s+space\s+will\s+live\s+on/i,
  /lights?\s+out\s+on/i,
  /sad\s+to\s+(share|announce)\s+we/i,
  /\bhas\s+closed\b/i,
  /\bhave\s+closed\b/i,
];

async function checkSite(url) {
  try {
    const res = await fetch(url, {
      method: 'GET', redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-precommit/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: 'uncertain', httpStatus: res.status };
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text') && !ct.includes('html')) return { status: 'uncertain' };
    const body = (await res.text()).slice(0, 200000);
    const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().slice(0, 200) : '';
    const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 30000);
    let highHits = 0, medHits = 0;
    const signals = [];
    HIGH_CONF_PATTERNS.forEach(re => { const m = text.match(re); if (m) { signals.push('HIGH: "' + m[0].trim().slice(0, 80) + '"'); highHits++; } });
    MED_CONF_PATTERNS.forEach(re => { const m = text.match(re); if (m) { signals.push('MED: "' + m[0].trim().slice(0, 80) + '"'); medHits++; } });
    if (title && /(closed|shuttered|final\s+day)/i.test(title)) { signals.push('TITLE: "' + title + '"'); highHits++; }
    const status = highHits > 0 || medHits >= 2 ? 'closed' : 'open';
    return { status, signals };
  } catch (e) {
    return { status: 'uncertain', error: e.message };
  }
}

function getStagedDiff() {
  try {
    return execSync('git diff --cached -U0 index.html', { encoding: 'utf8' });
  } catch (e) {
    console.error('[pre-commit] could not run git diff:', e.message);
    return '';
  }
}

// Extract NEW entries from diff. Each added line starting with '+' may contain
// one or more restaurant-entry JSON objects. We extract those that have BOTH
// an id and a website.
function extractNewEntries(diff) {
  const addedLines = diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));
  const text = addedLines.join('\n');
  const entries = [];
  // Match objects that contain "id":N and "website":"..."
  const re = /\{[^{}]*"id":\s*(\d+)[^{}]*"website":\s*"([^"]+)"[^{}]*\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    entries.push({ id: parseInt(m[1]), website: m[2], source: 'id-first' });
  }
  // Also match website-first (in case field order varies)
  const re2 = /\{[^{}]*"website":\s*"([^"]+)"[^{}]*"id":\s*(\d+)[^{}]*\}/g;
  while ((m = re2.exec(text)) !== null) {
    const id = parseInt(m[2]);
    if (!entries.find(e => e.id === id)) {
      entries.push({ id, website: m[1], source: 'website-first' });
    }
  }
  // Also include entries that may have name but no id in this diff chunk (inserts can be whole-array rewrites)
  const nameRe = /"name":\s*"([^"]+)"[^{}]*"website":\s*"([^"]+)"/g;
  while ((m = nameRe.exec(text)) !== null) {
    const website = m[2];
    if (!entries.find(e => e.website === website)) {
      entries.push({ id: null, name: m[1], website });
    }
  }
  return entries;
}

(async () => {
  const diff = getStagedDiff();
  if (!diff) { process.exit(0); }

  const newEntries = extractNewEntries(diff);
  if (!newEntries.length) { process.exit(0); }

  // Cap the number of checks per commit to avoid slow commits on big batches.
  const limit = 50;
  const toCheck = newEntries.slice(0, limit);
  const skipped = newEntries.length - toCheck.length;

  console.log(`[pre-commit] Checking ${toCheck.length} new/changed entries for closure signals${skipped ? ' (skipping ' + skipped + ' over limit — run sweep-closures.js manually)' : ''}...`);

  const closed = [];
  for (const entry of toCheck) {
    let url = entry.website;
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    const result = await checkSite(url);
    if (result.status === 'closed') {
      closed.push({ ...entry, url, signals: result.signals });
    }
  }

  if (closed.length) {
    console.error('\n❌ COMMIT BLOCKED — the following new/changed entries appear to be CLOSED based on their websites:\n');
    closed.forEach(c => {
      console.error(`  #${c.id ?? '(no id)'} ${c.name ? '"' + c.name + '"' : ''} — ${c.url}`);
      c.signals.slice(0, 2).forEach(s => console.error(`    → ${s}`));
    });
    console.error('\nFix options:');
    console.error('  1. Remove the closed entries from your commit.');
    console.error('  2. If you believe this is a false positive, verify manually at the website, then:');
    console.error('       git commit --no-verify    # bypass this hook (use sparingly)');
    console.error('  3. Add a more specific closure pattern to scripts/check-open.js if the signal is wrong.\n');
    process.exit(1);
  }

  console.log('[pre-commit] No closed entries detected. ✓');
  process.exit(0);
})();

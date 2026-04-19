// Check if a restaurant appears to still be operating by probing its website
// and scanning for closure signals.
// Usage:   node scripts/check-open.js "Cassia" "https://cassiala.com"
// Output:  JSON with {status: 'open'|'closed'|'uncertain', signals:[...], httpStatus, ...}
//
// No API key needed. Only uses plain fetch to the restaurant's own website.

const name = process.argv[2];
const website = process.argv[3];

if (!name || !website) {
  console.error('Usage: node scripts/check-open.js "<restaurant name>" "<website url>"');
  process.exit(1);
}

// HIGH-CONFIDENCE closure patterns — almost always mean the business is closed
// (not a queue, not an exhibit, not a time-limited thing).
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

// MEDIUM-CONFIDENCE — could be legit closure OR a fragment about something else
// (a queue, an exhibit, a menu item). Only count if in title/h1 OR 2+ medium signals.
const MED_CONF_PATTERNS = [
  /is\s+now\s+closed/i,            // 'Birdie G's is now Closed' — but can also be 'queue is now closed'
  /the\s+space\s+will\s+live\s+on/i,
  /lights?\s+out\s+on/i,
  /sad\s+to\s+(share|announce)\s+we/i,
  /\bhas\s+closed\b/i,             // loose 'has closed' — can match 'form has closed', etc.
  /\bhave\s+closed\b/i,
];

const CLOSURE_PATTERNS = [...HIGH_CONF_PATTERNS, ...MED_CONF_PATTERNS];

(async () => {
  const signals = [];
  let httpStatus = null;
  let redirected = null;
  let bodySnippet = null;
  let title = null;

  try {
    const res = await fetch(website, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 Dim-Hour-check-open/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    httpStatus = res.status;
    if (res.url !== website) redirected = res.url;

    if (!res.ok) {
      signals.push(`http-status-${httpStatus}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html') || contentType.includes('text/plain')) {
      const body = (await res.text()).slice(0, 250000);
      // Title tag
      const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) title = titleMatch[1].trim().slice(0, 200);
      // Strip HTML for pattern matching
      const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 30000);
      bodySnippet = text.slice(0, 400);

      // Separate high- and medium-confidence matches. Title hits are always high.
      let highHits = 0;
      let medHits = 0;
      HIGH_CONF_PATTERNS.forEach(re => {
        const m = text.match(re);
        if (m) { signals.push('HIGH: "' + m[0].trim().slice(0, 80) + '"'); highHits++; }
      });
      MED_CONF_PATTERNS.forEach(re => {
        const m = text.match(re);
        if (m) { signals.push('MED: "' + m[0].trim().slice(0, 80) + '"'); medHits++; }
      });

      // Title-level closure indicator — very strong signal
      if (title && /(closed|shuttered|final\s+day)/i.test(title)) {
        signals.push('TITLE: "' + title + '"');
        highHits++;
      }
    } else {
      signals.push('non-html-content-type: ' + contentType);
    }
  } catch (e) {
    signals.push('fetch-error: ' + (e.message || e.name));
  }

  // Classify:
  //   - closed if any HIGH hit OR 2+ MED hits OR title hit
  //   - otherwise open (if site served content) or uncertain (if broken)
  let status;
  const hasHigh = signals.some(s => s.startsWith('HIGH:') || s.startsWith('TITLE:'));
  const medCount = signals.filter(s => s.startsWith('MED:')).length;
  if (hasHigh || medCount >= 2) {
    status = 'closed';
  } else if (httpStatus && httpStatus >= 200 && httpStatus < 400) {
    status = 'open';
  } else if ((httpStatus || 0) >= 400 || signals.some(s => s.startsWith('fetch-error') || s.startsWith('http-status'))) {
    status = 'uncertain';
  } else {
    status = 'uncertain';
  }

  console.log(JSON.stringify({
    name, website, status, httpStatus, redirected, title, signals,
    note: bodySnippet ? bodySnippet.slice(0, 300) + '…' : null,
  }, null, 2));
})();

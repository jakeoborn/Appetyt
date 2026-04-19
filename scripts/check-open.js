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

// Phrases that strongly suggest permanent closure when found on the restaurant's own site
const CLOSURE_PATTERNS = [
  /permanently closed/i,
  /closed\s+(for\s+good|permanently|its?\s+doors)/i,
  /our\s+last\s+day/i,
  /final\s+service/i,
  /it\s+is\s+with\s+a?\s*heavy\s+heart/i,
  /thank\s+you\s+for\s+\d+\s+(years|great\s+years|memories)/i,
  /has\s+closed/i,
  /closing\s+(our\s+)?doors/i,
  /after\s+\d+\s+(years|wonderful\s+years).{0,80}(closed|closing|shutting|final)/i,
  /we\s+are\s+no\s+longer\s+(open|serving|operating)/i,
  /bidding\s+(you\s+)?farewell/i,
];

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

      CLOSURE_PATTERNS.forEach((re, i) => {
        const m = text.match(re);
        if (m) signals.push('pattern-match: "' + m[0].trim().slice(0, 80) + '"');
      });

      // Title-level closure indicator
      if (title && /(closed|shuttered|final)/i.test(title)) {
        signals.push('title: "' + title + '"');
      }
    } else {
      signals.push('non-html-content-type: ' + contentType);
    }
  } catch (e) {
    signals.push('fetch-error: ' + (e.message || e.name));
  }

  // Classify
  let status;
  if (httpStatus && httpStatus >= 200 && httpStatus < 400 && !signals.some(s => s.startsWith('pattern-match') || s.startsWith('title:'))) {
    status = 'open';
  } else if (signals.some(s => s.startsWith('pattern-match') || s.startsWith('title:'))) {
    status = 'closed';
  } else if (httpStatus >= 400 || signals.some(s => s.startsWith('fetch-error') || s.startsWith('http-status'))) {
    status = 'uncertain'; // website broken could mean anything
  } else {
    status = 'uncertain';
  }

  console.log(JSON.stringify({
    name, website, status, httpStatus, redirected, title, signals,
    note: bodySnippet ? bodySnippet.slice(0, 300) + '…' : null,
  }, null, 2));
})();
